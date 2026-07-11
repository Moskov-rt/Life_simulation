const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import { EVENTS_POOL } from './events';
import { applyYearlyDrift, modifyOutcomeDeltas, getDynamicChoiceOutcome } from './utils/relationshipVectors';
import { resolveChoice } from './utils/choiceResolver';
import { evaluateFollowUpFlags } from './utils/followUpFlags';
import { applyPlayerTraits } from './utils/personalityEffects';
import { calculateStatCascades } from './utils/statCascades';
import { processOngoingEffects, mergeOngoingEffects } from './utils/ongoingEffects';
import { evaluateSecretExposureEvents } from './utils/exposureEvents';
`;

code = code.replace("import { EVENTS_POOL } from './events';", importsToAdd);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed imports via script');
