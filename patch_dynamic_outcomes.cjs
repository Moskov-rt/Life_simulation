const fs = require('fs');
let code = fs.readFileSync('src/utils/relationshipVectors.ts', 'utf8');

const dynamicOutcomeStr = `
export function getDynamicChoiceOutcome(
  npc: NPC,
  choiceId: string,
  baseText: string
): { outcomeText: string; trustChange: number; suspicionChange: number; resentmentChange: number } {
  let outcomeText = baseText;
  let trustChange = 0;
  let suspicionChange = 0;
  let resentmentChange = 0;

  if (choiceId.includes('deny')) {
    // Base changes for Deny
    trustChange = -5;
    suspicionChange = 10;
    
    // Scenario A: High trust, low knowledge
    if (npc.vectors.trust > 0 && npc.vectors.knowledge < 30) {
      const modified = modifyOutcomeDeltas(npc, trustChange, suspicionChange, 0);
      outcomeText = \`\${npc.name} looked confused but nodded. "Okay, sweetie." Trust \${modified.trust}%, Suspicion +\${modified.suspicion}%\`;
      return { outcomeText, trustChange: modified.trust, suspicionChange: modified.suspicion, resentmentChange: 0 };
    } 
    // Scenario B: Low trust or high knowledge
    else {
      const modified = modifyOutcomeDeltas(npc, trustChange, suspicionChange, 5);
      outcomeText = \`\${npc.name}'s eyes narrowed. "That's the same lie you told last year." Trust \${modified.trust}%, Suspicion +\${modified.suspicion}%, Resentment +\${modified.resentment}%\`;
      return { outcomeText, trustChange: modified.trust, suspicionChange: modified.suspicion, resentmentChange: modified.resentment };
    }
  }

  return { outcomeText, trustChange, suspicionChange, resentmentChange };
}`;

code += dynamicOutcomeStr;
fs.writeFileSync('src/utils/relationshipVectors.ts', code);
console.log('getDynamicChoiceOutcome appended to relationshipVectors.ts');
