const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Initial game state
const initTarget = `      delayedEvents: [],
      followUpFlags: [],
      log: initialLogs,`;
const initReplacement = `      delayedEvents: [],
      followUpFlags: [],
      ongoingEffects: [],
      personalityTraits: [],
      log: initialLogs,`;
if (code.includes(initTarget)) {
  code = code.replace(initTarget, initReplacement);
} else if (code.includes(initTarget.replace(/\n/g, '\r\n'))) {
  code = code.replace(initTarget.replace(/\n/g, '\r\n'), initReplacement.replace(/\n/g, '\r\n'));
}

// 2. Missing imports
const importsToAdd = `
import { applyYearlyDrift, modifyOutcomeDeltas, getDynamicChoiceOutcome } from './utils/relationshipVectors';
import { resolveChoice } from './utils/choiceResolver';
import { applyPlayerTraits } from './utils/personalityEffects';
import { calculateStatCascades } from './utils/statCascades';
import { processOngoingEffects, mergeOngoingEffects } from './utils/ongoingEffects';
import { evaluateSecretExposureEvents } from './utils/exposureEvents';
`;

code = code.replace("import { evaluateFollowUpFlags } from './utils/followUpFlags';", "import { evaluateFollowUpFlags } from './utils/followUpFlags';" + importsToAdd);

// 3. State variables
const stateTarget = `  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOccupationModal, setShowOccupationModal] = useState(false);`;
const stateReplacement = `  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOccupationModal, setShowOccupationModal] = useState(false);
  const [showAgeUpModal, setShowAgeUpModal] = useState(false);
  const [ageUpData, setAgeUpData] = useState<any>(null);
  const [showEventPopupModal, setShowEventPopupModal] = useState(false);
  const [eventPopupData, setEventPopupData] = useState<any>(null);`;

if (code.includes(stateTarget)) {
  code = code.replace(stateTarget, stateReplacement);
} else if (code.includes(stateTarget.replace(/\n/g, '\r\n'))) {
  code = code.replace(stateTarget.replace(/\n/g, '\r\n'), stateReplacement.replace(/\n/g, '\r\n'));
}

// 4. Modal imports
const modalTarget = `import { OccupationModal } from './components/OccupationModal';`;
const modalReplacement = `import { OccupationModal } from './components/OccupationModal';
import { AgeUpModal } from './components/AgeUpModal';
import { EventPopupModal } from './components/EventPopupModal';`;
if (code.includes(modalTarget)) {
  code = code.replace(modalTarget, modalReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed TS errors manually');
