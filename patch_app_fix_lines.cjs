const fs = require('fs');

let lines = fs.readFileSync('src/App.tsx', 'utf8').split(/\r?\n/);

const startIdx = lines.findIndex(l => l.includes("    } else if (city.name === 'Compton') {"));
const endIdx = lines.findIndex(l => l.includes("    setSelectedMapCity(city);"));

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `    } else if (city.name === 'Compton') {
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
    });

    setSelectedMapCity(city);`;

  lines.splice(startIdx, endIdx - startIdx + 1, ...replacement.split('\\n'));
  fs.writeFileSync('src/App.tsx', lines.join('\\n'));
  console.log('Fixed exactly via lines splice');
} else {
  console.log('Could not find start/end indices');
}
