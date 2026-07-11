const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import { AgeUpModal } from './components/AgeUpModal';
import { EventPopupModal } from './components/EventPopupModal';
`;

code = code.replace("import { EVENTS_POOL } from './events';", "import { EVENTS_POOL } from './events';" + importsToAdd);

// handleChoiceClick -> handleChoiceSelect
code = code.replace(/onChoiceSelect=\{handleChoiceClick\}/g, "onChoiceSelect={handleChoiceSelect}");
code = code.replace(/handleChoiceClick\(/g, "handleChoiceSelect(");

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed final TS errors');
