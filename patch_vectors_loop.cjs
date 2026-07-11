const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import functions
if (!code.includes("import { applyYearlyDrift")) {
  code = code.replace(
    "import { evaluateSecretExposureEvents } from './utils/exposureEvents';",
    "import { evaluateSecretExposureEvents } from './utils/exposureEvents';\nimport { applyYearlyDrift, modifyOutcomeDeltas } from './utils/relationshipVectors';"
  );
}

// 2. Intercept Relationship changes in handleChoiceSelect
const rcTarget = `    if (effect.relationshipChanges) {
      const rc = effect.relationshipChanges;
      nextRelationships = nextRelationships.map(r => {
        let isMatch = false;
        if (rc.target === 'current' && r.id === gameState.activeRelationshipContextId) {
          isMatch = true;
        } else if (rc.target === 'all') {
          isMatch = true;
        } else if (rc.target === r.id) {
          isMatch = true;
        }

        if (isMatch) {
          return {
            ...r,
            trust: Math.max(0, Math.min(100, r.trust + (rc.trust || 0))),
            suspicion: Math.max(0, Math.min(100, r.suspicion + (rc.suspicion || 0))),
            resentment: Math.max(0, Math.min(100, r.resentment + (rc.resentment || 0)))
          };
        }
        return r;
      });
    }`;

const rcReplacement = `    if (effect.relationshipChanges) {
      const rc = effect.relationshipChanges;
      nextRelationships = nextRelationships.map(r => {
        let isMatch = false;
        if (rc.target === 'current' && r.id === gameState.activeRelationshipContextId) {
          isMatch = true;
        } else if (rc.target === 'all') {
          isMatch = true;
        } else if (rc.target === r.id) {
          isMatch = true;
        }

        if (isMatch) {
          const rawTrustChange = rc.trust || 0;
          const rawSuspicionChange = rc.suspicion || 0;
          const rawResentmentChange = rc.resentment || 0;
          
          const modified = modifyOutcomeDeltas(r, rawTrustChange, rawSuspicionChange, rawResentmentChange);
          
          const updatedVectors = {
            trust: Math.max(-100, Math.min(100, (r.vectors?.trust || 0) + modified.trust)),
            suspicion: Math.max(0, Math.min(100, (r.vectors?.suspicion || 0) + modified.suspicion)),
            knowledge: r.vectors?.knowledge || 0,
            resentment: Math.max(0, Math.min(100, (r.vectors?.resentment || 0) + modified.resentment)),
            forgiveness: r.vectors?.forgiveness || 50
          };
          
          return {
            ...r,
            vectors: updatedVectors,
            trust: Math.round((updatedVectors.trust + 100) / 2),
            suspicion: Math.round(updatedVectors.suspicion),
            resentment: Math.round(updatedVectors.resentment)
          };
        }
        return r;
      });
    }`;

if (code.includes(rcTarget)) {
  code = code.replace(rcTarget, rcReplacement);
  console.log('rcTarget replaced');
} else {
  const cleanTarget = rcTarget.replace(/\n/g, '\r\n');
  const cleanReplacement = rcReplacement.replace(/\n/g, '\r\n');
  if (code.includes(cleanTarget)) {
    code = code.replace(cleanTarget, cleanReplacement);
    console.log('rcTarget replaced (CRLF)');
  } else {
    console.log('rcTarget not found');
  }
}

// 3. Update ageUp() relationship loop to run applyYearlyDrift
const ageUpLoopTarget = `    let nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => ({
      ...r,
      age: r.age + 1
    }));`;

const ageUpLoopReplacement = `    const hasOFPosts = (nextSocialMedia.onlyfans?.postsCount || 0) > 0;
    const action = hasOFPosts ? 'kept_working' : 'none';
    let nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      const npcCopy = { ...r };
      npcCopy.age = r.age + 1;
      applyYearlyDrift(npcCopy, action);
      return npcCopy;
    });`;

if (code.includes(ageUpLoopTarget)) {
  code = code.replace(ageUpLoopTarget, ageUpLoopReplacement);
  console.log('ageUpLoopTarget replaced');
} else {
  const cleanTarget = ageUpLoopTarget.replace(/\n/g, '\r\n');
  const cleanReplacement = ageUpLoopReplacement.replace(/\n/g, '\r\n');
  if (code.includes(cleanTarget)) {
    code = code.replace(cleanTarget, cleanReplacement);
    console.log('ageUpLoopTarget replaced (CRLF)');
  } else {
    console.log('ageUpLoopTarget not found');
  }
}

fs.writeFileSync('src/App.tsx', code);
