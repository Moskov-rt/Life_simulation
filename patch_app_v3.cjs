const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update imports
if (!code.includes("resolveChoice")) {
  code = code.replace(
    "import { applyYearlyDrift, modifyOutcomeDeltas, getDynamicChoiceOutcome } from './utils/relationshipVectors';",
    "import { applyYearlyDrift, modifyOutcomeDeltas, getDynamicChoiceOutcome } from './utils/relationshipVectors';\nimport { resolveChoice } from './utils/choiceResolver';\nimport { evaluateFollowUpFlags } from './utils/followUpFlags';"
  );
}

// 2. Intercept relationship processing block in handleChoiceSelect
const rcTarget = `    // 5. Relationship changes
    if (effect.relationshipChanges) {
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

// And remove the dynamic text adjustment we added earlier:
const dynTarget = `    let overriddenOutcomeText = effect.outcomeText;
    let overriddenLogText = effect.logText || \`Selected: \${choice.text}\`;
    
    // Dynamic text adjustment based on trust vectors
    if (effect.relationshipChanges && gameState.activeRelationshipContextId) {
      const activeNpc = (Object.values(gameState.npcs || {}) as any[]).find(n => n.id === gameState.activeRelationshipContextId);
      if (activeNpc && effect.outcomeText) {
        const dynamicResult = getDynamicChoiceOutcome(activeNpc, choice.id, effect.outcomeText);
        if (dynamicResult.outcomeText !== effect.outcomeText) {
          overriddenOutcomeText = dynamicResult.outcomeText;
          overriddenLogText = dynamicResult.outcomeText;
        }
      }
    }`;

const rcReplacement = `    // 5. Use modular choiceResolver
    let overriddenOutcomeText = effect.outcomeText || "";
    let overriddenLogText = effect.logText || \`Selected: \${choice.text}\`;
    
    const activeNpc = nextRelationships.find(r => r.id === gameState.activeRelationshipContextId);
    if (activeNpc && effect) {
      const result = resolveChoice(choice, activeNpc, gameState.age);
      
      // Update text
      overriddenOutcomeText = result.outcomeText;
      overriddenLogText = result.outcomeText;

      // Update active NPC relationships
      if (result.relationshipChanges) {
        nextRelationships = nextRelationships.map(r => {
          if (r.id === activeNpc.id) {
            const updatedVectors = {
              trust: Math.max(-100, Math.min(100, (r.vectors?.trust || 0) + result.relationshipChanges!.trust)),
              suspicion: Math.max(0, Math.min(100, (r.vectors?.suspicion || 0) + result.relationshipChanges!.suspicion)),
              knowledge: r.vectors?.knowledge || 0,
              resentment: Math.max(0, Math.min(100, (r.vectors?.resentment || 0) + result.relationshipChanges!.resentment)),
              forgiveness: r.vectors?.forgiveness || 50
            };
            
            // Apply flags directly to interactionHistory
            const nextHistory = r.interactionHistory ? [...r.interactionHistory] : [];
            if (result.followUpFlags && result.followUpFlags.length > 0) {
              result.followUpFlags.forEach(f => {
                if (f.type === 'interaction_history') {
                  nextHistory.push({ year: f.year, playerLied: f.playerLied, playerToldTruth: f.playerToldTruth, playerAvoided: f.playerAvoided });
                }
              });
            }
            
            return {
              ...r,
              vectors: updatedVectors,
              trust: Math.round((updatedVectors.trust + 100) / 2),
              suspicion: Math.round(updatedVectors.suspicion),
              resentment: Math.round(updatedVectors.resentment),
              interactionHistory: nextHistory
            };
          }
          return r;
        });
      }
    }`;

// Replace dynTarget with empty, and rcTarget with rcReplacement
if (code.includes(dynTarget)) {
  code = code.replace(dynTarget, '');
  console.log("dynTarget removed");
} else {
  if (code.includes(dynTarget.replace(/\n/g, '\r\n'))) {
    code = code.replace(dynTarget.replace(/\n/g, '\r\n'), '');
    console.log("dynTarget removed (CRLF)");
  } else {
    console.log("dynTarget not found");
  }
}

if (code.includes(rcTarget)) {
  code = code.replace(rcTarget, rcReplacement);
  console.log("rcTarget replaced");
} else {
  if (code.includes(rcTarget.replace(/\n/g, '\r\n'))) {
    code = code.replace(rcTarget.replace(/\n/g, '\r\n'), rcReplacement);
    console.log("rcTarget replaced (CRLF)");
  } else {
    console.log("rcTarget not found");
  }
}

// 3. Update ageUp() to use followUpFlags
const ageUpLoopTarget = `    // Process Secret Exposure (Deliverable 2)`;
const ageUpLoopReplacement = `    // Process FollowUp Flags
    const flagResult = evaluateFollowUpFlags(gameState);
    if (flagResult.newEvents.length > 0 && !triggeredEvent) {
      triggeredEvent = {
        id: flagResult.newEvents[0],
        title: "Delayed Consequence",
        text: "Past actions have caught up to you.",
        severity: "danger",
        choices: [{ id: 'ok', text: 'Okay', effect: { outcomeText: 'You deal with the fallout.' } }]
      };
    }
    flagResult.flagsToRemove.forEach(eventId => {
      const idx = gameState.delayedEvents.findIndex(e => e.eventId === eventId);
      if (idx !== -1) nextDelayed.splice(idx, 1);
    });
    
    // Process Secret Exposure (Deliverable 2)`;

if (code.includes(ageUpLoopTarget)) {
  code = code.replace(ageUpLoopTarget, ageUpLoopReplacement);
  console.log("ageUpLoopTarget replaced");
} else {
  if (code.includes(ageUpLoopTarget.replace(/\n/g, '\r\n'))) {
    code = code.replace(ageUpLoopTarget.replace(/\n/g, '\r\n'), ageUpLoopReplacement);
    console.log("ageUpLoopTarget replaced (CRLF)");
  } else {
    console.log("ageUpLoopTarget not found");
  }
}

fs.writeFileSync('src/App.tsx', code);
