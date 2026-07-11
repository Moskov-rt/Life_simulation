const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Initial State
const initTarget = `      delayedEvents: [],
      log: initialLogs,`;
const initReplacement = `      delayedEvents: [],
      followUpFlags: [],
      log: initialLogs,`;

if (code.includes(initTarget)) {
  code = code.replace(initTarget, initReplacement);
} else {
  if (code.includes(initTarget.replace(/\n/g, '\r\n'))) {
    code = code.replace(initTarget.replace(/\n/g, '\r\n'), initReplacement);
  }
}

// 2. ageUp Hook
// In the original ai-studio-merge App.tsx, ageUp loops look like this:
const ageUpLoopTarget = `    // Process delayed events
    const nextDelayed = gameState.delayedEvents.filter(e => {`;
    
const ageUpLoopReplacement = `    // Process FollowUp Flags
    const flagResult = evaluateFollowUpFlags(gameState);
    if (flagResult.newEvents.length > 0 && !triggeredEvent) {
      triggeredEvent = {
        id: flagResult.newEvents[0],
        title: "Delayed Consequence",
        text: "Past actions have caught up to you.",
        category: 'relationship',
        choices: [{ id: 'ok', text: 'Okay', effect: { outcomeText: 'You deal with the fallout.' } }]
      };
    }
    const filteredDelayed = gameState.delayedEvents.filter(e => !flagResult.flagsToRemove.includes(e.eventId));
    
    // Process delayed events
    const nextDelayed = filteredDelayed.filter(e => {`;

if (code.includes(ageUpLoopTarget)) {
  code = code.replace(ageUpLoopTarget, ageUpLoopReplacement);
} else {
  if (code.includes(ageUpLoopTarget.replace(/\n/g, '\r\n'))) {
    code = code.replace(ageUpLoopTarget.replace(/\n/g, '\r\n'), ageUpLoopReplacement);
  }
}

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx followUp flags integrated');
