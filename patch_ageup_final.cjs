const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
if (!code.includes("import { runYearlySimulation }")) {
  code = code.replace("import { processOngoingEffects, mergeOngoingEffects } from './utils/ongoingEffects';", "import { processOngoingEffects, mergeOngoingEffects } from './utils/ongoingEffects';\nimport { runYearlySimulation } from './utils/ageUpSimulator';");
}

// 2. Replace ageUp body
const startStr = "const ageUp = () => {";
const endRegex = /setGameState\(nextState\);\s*setShowAgeUpModal\(true\);\s*setActiveTab\('home'\);\s*};/m;

const startIndex = code.indexOf(startStr);
if (startIndex === -1) throw new Error("Could not find const ageUp = () => {");

const afterStart = code.substring(startIndex);
const match = endRegex.exec(afterStart);
if (!match) throw new Error("Could not find the end of ageUp function");

const endIndex = startIndex + match.index + match[0].length;

const newAgeUp = `const ageUp = () => {
    if (!gameState || !gameState.alive) return;
    triggerSound('ageUp');

    const context = {
      INFANT_ILLNESSES,
      MINOR_ILLNESSES,
      CHRONIC_ILLNESSES,
      TERMINAL_ILLNESSES,
      generateSchoolContacts
    };

    const result = runYearlySimulation(gameState, context as any);
    
    if (!result.updatedState.alive) {
      triggerSound('error');
    }

    setAgeUpData(result.ageUpData);
    setGameState(result.updatedState);
    setShowAgeUpModal(true);
    setActiveTab('home');
  };`;

code = code.substring(0, startIndex) + newAgeUp + code.substring(endIndex);

fs.writeFileSync('src/App.tsx', code);
console.log("Successfully replaced ageUp with runYearlySimulation in App.tsx!");
