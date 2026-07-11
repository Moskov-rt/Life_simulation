const fs = require('fs');
const p = 'src/utils/ageUpSimulator.ts';
let code = fs.readFileSync(p, 'utf8');

const target = `  Object.values(workingState.npcs).forEach(npc => {
    // Only increment age if they weren't just generated this exact year as new contacts
    // Wait, let's just increment age safely.
    npc.age += 1;
    applyYearlyDrift(npc, action);
    workingState.relationships.push(npc);
  });`;

const replacement = `  Object.values(workingState.npcs).forEach(npc => {
    // Only increment age if they weren't just generated this exact year as new contacts
    // Wait, let's just increment age safely.
    npc.age += 1;
    
    // Determine specific drift action based on interaction history this year
    let driftAction = action;
    if (npc.interactionHistory && npc.interactionHistory.length > 0) {
      const recentHistory = npc.interactionHistory.filter(h => h.year === workingState.age);
      if (recentHistory.length > 0) {
        const h = recentHistory[recentHistory.length - 1];
        if (h.playerLied) driftAction = 'lie';
        else if (h.playerToldTruth) driftAction = 'truth';
        else if (h.playerAvoided) driftAction = 'avoid';
      }
    }
    
    // Type casting to ensure compatibility with applyYearlyDrift
    applyYearlyDrift(npc, driftAction as 'truth' | 'lie' | 'avoid' | 'exposed' | 'amends' | 'kept_working' | 'none');
    workingState.relationships.push(npc);
  });`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(p, code);
  console.log('Replaced successfully');
} else {
  console.log('Target not found');
}
