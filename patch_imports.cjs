const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { resolveChoice }")) {
  code = code.replace(
    "import { EVENTS_POOL } from './utils/events';",
    "import { EVENTS_POOL } from './utils/events';\nimport { applyYearlyDrift, modifyOutcomeDeltas, getDynamicChoiceOutcome } from './utils/relationshipVectors';\nimport { resolveChoice } from './utils/choiceResolver';\nimport { evaluateFollowUpFlags } from './utils/followUpFlags';"
  );
}

fs.writeFileSync('src/App.tsx', code);
console.log('Imports added');
