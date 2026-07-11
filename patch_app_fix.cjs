const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const corruptTarget = `    } else if (city.name === 'Compton') {
      nextStats.looks = Math.min(100, nextStats.looks + 4);
      welcomeBonus = ' (+4 Looks local streetwear drops)';
    }
      location: city.fullName,
      cash: nextCash,
      stats: nextStats,
      career: nextCareer,
      flags: nextFlags,
      ongoingEffects: typeof nextOngoingEffects !== 'undefined' ? nextOngoingEffects : gameState.ongoingEffects,
      log: nextLog
    });`;

const properReplacement = `    } else if (city.name === 'Compton') {
      nextStats.looks = Math.min(100, nextStats.looks + 4);
      welcomeBonus = ' (+4 Looks local streetwear drops)';
    }

    if (welcomeBonus) {
      nextLog.push(\`└─ Gained immediate local city bonus:\${welcomeBonus}!\`);
    }

    let nextCareer = { ...gameState.career };
    if (gameState.career.type === 'career') {
      nextCareer = { title: 'Unemployed', salary: 0, type: 'unemployed' };
      nextLog.push(\`⚠️ Sabbatical Alert: Moving internationally forced me to resign from my job as a \${gameState.career.title}.\`);
    }

    setGameState({
      ...gameState,
      location: city.fullName,
      cash: nextCash,
      stats: nextStats,
      career: nextCareer,
      flags: nextFlags,
      log: nextLog
    });`;

if (code.includes(corruptTarget)) {
  code = code.replace(corruptTarget, properReplacement);
  console.log('Fixed using \\n');
} else if (code.includes(corruptTarget.replace(/\n/g, '\r\n'))) {
  code = code.replace(corruptTarget.replace(/\n/g, '\r\n'), properReplacement.replace(/\n/g, '\r\n'));
  console.log('Fixed using \\r\\n');
} else {
  console.log('Could not find target');
}

fs.writeFileSync('src/App.tsx', code);
