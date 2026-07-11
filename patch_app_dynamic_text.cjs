const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update import
if (!code.includes("getDynamicChoiceOutcome")) {
  code = code.replace(
    "import { applyYearlyDrift, modifyOutcomeDeltas } from './utils/relationshipVectors';",
    "import { applyYearlyDrift, modifyOutcomeDeltas, getDynamicChoiceOutcome } from './utils/relationshipVectors';"
  );
}

// Intercept before effect is processed
const target = `    let overriddenOutcomeText = effect.outcomeText;
    let overriddenLogText = effect.logText || \`Selected: \${choice.text}\`;`;

const replacement = `    let overriddenOutcomeText = effect.outcomeText;
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

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("App.tsx patched successfully!");
} else {
  const cleanTarget = target.replace(/\n/g, '\r\n');
  const cleanReplacement = replacement.replace(/\n/g, '\r\n');
  if (code.includes(cleanTarget)) {
    code = code.replace(cleanTarget, cleanReplacement);
    console.log("App.tsx patched successfully! (CRLF)");
  } else {
    console.log("Target not found!");
  }
}

fs.writeFileSync('src/App.tsx', code);
