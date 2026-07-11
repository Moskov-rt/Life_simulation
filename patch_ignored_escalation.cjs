const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetOnCloseStr = `          onClose={() => {
            setShowAgeUpModal(false);
          }}`;

const replacementOnCloseStr = `          onClose={() => {
            setShowAgeUpModal(false);
            if (ageUpData.triggeredEvent) {
              const eventId = ageUpData.triggeredEvent.id;
              const nextNpcs = { ...gameState.npcs };
              let logMsg = '';
              
              if (eventId === 'whisper') {
                const npc = Object.values(nextNpcs).find(n => n.relation === 'parent' || n.relation === 'sibling');
                if (npc) {
                  npc.suspicion = Math.min(100, (npc.suspicion || 0) + 15);
                  logMsg = \`⚠️ Ignored whispers. \${npc.name}'s suspicion grew (+15%).\`;
                }
              } else if (eventId === 'confrontation') {
                const npc = Object.values(nextNpcs).find(n => n.relation === 'supervisor' || n.relation === 'partner' || n.relation === 'spouse');
                if (npc) {
                  npc.suspicion = Math.min(100, (npc.suspicion || 0) + 25);
                  logMsg = \`⚠️ Ignored confrontation. \${npc.name}'s suspicion grew (+25%).\`;
                }
              } else if (eventId === 'snoop') {
                const npc = Object.values(nextNpcs).find(n => n.relation === 'parent' || n.relation === 'sibling');
                if (npc) {
                  (npc as any).knowledge = Math.min(100, ((npc as any).knowledge || 0) + 40);
                  logMsg = \`⚠️ Ignored snooping. \${npc.name} found out more (+40% Knowledge).\`;
                }
              }
              
              setGameState({
                ...gameState,
                npcs: nextNpcs,
                log: logMsg ? [...gameState.log, logMsg] : gameState.log
              });
            }
          }}`;

if (code.includes(targetOnCloseStr)) {
  code = code.replace(targetOnCloseStr, replacementOnCloseStr);
  console.log('AgeUpModal onClose target replaced');
} else {
  const cleanTarget = targetOnCloseStr.replace(/\n/g, '\r\n');
  const cleanReplacement = replacementOnCloseStr.replace(/\n/g, '\r\n');
  if (code.includes(cleanTarget)) {
    code = code.replace(cleanTarget, cleanReplacement);
    console.log('AgeUpModal onClose target replaced (CRLF)');
  } else {
    console.log('AgeUpModal onClose target not found');
  }
}

fs.writeFileSync('src/App.tsx', code);
