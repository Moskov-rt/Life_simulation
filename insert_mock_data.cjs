const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacementStr = `      },
      secretExposure: {
        isActive: true, // MOCKED for UI testing
        level: 64, // MOCKED 
        npcAwareness: {
          'Mom': { status: 'knows_partial', level: 45 },
          'Dad': { status: 'suspicious', level: 12 },
          'Boss': { status: 'unaware', level: 0 },
          'Ex': { status: 'knows_full', level: 100 }
        },
        recentChanges: {
          posts: 20,
          collabs: 2,
          mitigation: 85,
          locationMultiplier: 0.8,
          luck: 3
        }
      }
    };

    setGameState(initialGameState);`;

code = code.replace(/      \},\s*\};\s*setGameState\(initialGameState\);/m, replacementStr);
fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched with mock data');
