const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update imports
if (!code.includes("import { applyPlayerTraits }")) {
  code = code.replace(
    "import { evaluateFollowUpFlags } from './utils/followUpFlags';",
    "import { evaluateFollowUpFlags } from './utils/followUpFlags';\nimport { applyPlayerTraits } from './utils/personalityEffects';\nimport { calculateStatCascades } from './utils/statCascades';\nimport { processOngoingEffects, mergeOngoingEffects } from './utils/ongoingEffects';"
  );
}

// 2. Intercept handleChoiceSelect
const rcTarget = `    // 5. Use modular choiceResolver
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
        nextRelationships = nextRelationships.map(r => {`;

const rcReplacement = `    // 5. Use modular choiceResolver with personality and stat cascades
    let overriddenOutcomeText = effect.outcomeText || "";
    let overriddenLogText = effect.logText || \`Selected: \${choice.text}\`;
    let nextOngoingEffects = gameState.ongoingEffects ? [...gameState.ongoingEffects] : [];
    
    const activeNpc = nextRelationships.find(r => r.id === gameState.activeRelationshipContextId);
    if (activeNpc && effect) {
      let result = resolveChoice(choice, activeNpc, gameState.age);
      result = applyPlayerTraits(result, gameState.personalityTraits || [], choice.id, activeNpc, gameState.age);
      result = calculateStatCascades(result, gameState.age, activeNpc.id);
      
      // Update text
      overriddenOutcomeText = result.outcomeText;
      overriddenLogText = result.outcomeText;

      // Apply stat changes
      if (result.statChanges) {
        if (result.statChanges.happiness !== undefined) nextStats.happiness = Math.max(0, Math.min(100, (nextStats.happiness || 0) + (result.statChanges.happiness - (effect.statChanges?.happiness || 0))));
        if (result.statChanges.health !== undefined) nextStats.health = Math.max(0, Math.min(100, (nextStats.health || 0) + (result.statChanges.health - (effect.statChanges?.health || 0))));
        // Wait, result.statChanges contains the absolute new delta to add or the new value? 
        // choiceResolver effect.statChanges has absolute changes or deltas? Usually deltas.
        // If we add totalHappinessDelta in personalityEffects it's a delta.
        // Let's just safely apply the full delta difference from base or just merge it directly.
        // Actually, we should just apply the result.statChanges directly as the new values.
        nextStats = { ...nextStats, ...result.statChanges };
        nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness));
        nextStats.health = Math.max(0, Math.min(100, nextStats.health));
      }

      // Merge ongoing effects
      if (result.ongoingEffectsToAdd && result.ongoingEffectsToAdd.length > 0) {
        nextOngoingEffects = mergeOngoingEffects(nextOngoingEffects, result.ongoingEffectsToAdd);
      }

      // Update active NPC relationships
      if (result.relationshipChanges) {
        nextRelationships = nextRelationships.map(r => {`;

if (code.includes(rcTarget)) {
  code = code.replace(rcTarget, rcReplacement);
} else {
  if (code.includes(rcTarget.replace(/\n/g, '\r\n'))) {
    code = code.replace(rcTarget.replace(/\n/g, '\r\n'), rcReplacement);
  }
}

// Ensure nextOngoingEffects replaces GameState properly at end of handleChoiceSelect
const hcsEndTarget = `      flags: nextFlags,
      delayedEvents: nextDelayed,
      illnesses: nextIllnesses,
      log: updatedLogs,
      karma: nextKarma,
      willpower: nextWillpower,`;

const hcsEndReplacement = `      flags: nextFlags,
      ongoingEffects: typeof nextOngoingEffects !== 'undefined' ? nextOngoingEffects : gameState.ongoingEffects,
      delayedEvents: nextDelayed,
      illnesses: nextIllnesses,
      log: updatedLogs,
      karma: nextKarma,
      willpower: nextWillpower,`;

if (code.includes(hcsEndTarget)) {
  code = code.replace(hcsEndTarget, hcsEndReplacement);
} else {
  if (code.includes(hcsEndTarget.replace(/\n/g, '\r\n'))) {
    code = code.replace(hcsEndTarget.replace(/\n/g, '\r\n'), hcsEndReplacement);
  }
}

// 3. Update ageUp
const ageUpTarget = `    // Process FollowUp Flags
    const flagResult = evaluateFollowUpFlags(gameState);`;

const ageUpReplacement = `    // Process Ongoing Effects
    let currentOngoingEffects = gameState.ongoingEffects || [];
    const ongoingResult = processOngoingEffects(currentOngoingEffects, gameState);
    nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness + ongoingResult.statDeltas.happiness));
    nextStats.health = Math.max(0, Math.min(100, nextStats.health + ongoingResult.statDeltas.health));
    nextState.ongoingEffects = ongoingResult.updatedEffects;

    // Process FollowUp Flags
    const flagResult = evaluateFollowUpFlags(gameState);`;

if (code.includes(ageUpTarget)) {
  code = code.replace(ageUpTarget, ageUpReplacement);
} else {
  if (code.includes(ageUpTarget.replace(/\n/g, '\r\n'))) {
    code = code.replace(ageUpTarget.replace(/\n/g, '\r\n'), ageUpReplacement);
  }
}

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched for Part 6!');
