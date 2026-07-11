const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateTarget = `  const [showProfileModal, setShowProfileModal] = useState(false);`;
const stateReplacement = `  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAgeUpModal, setShowAgeUpModal] = useState(false);
  const [ageUpData, setAgeUpData] = useState<any>(null);
  const [showEventPopupModal, setShowEventPopupModal] = useState(false);
  const [eventPopupData, setEventPopupData] = useState<any>(null);`;

if (code.includes(stateTarget)) {
  code = code.replace(stateTarget, stateReplacement);
} else if (code.includes(stateTarget.replace(/\n/g, '\r\n'))) {
  code = code.replace(stateTarget.replace(/\n/g, '\r\n'), stateReplacement.replace(/\n/g, '\r\n'));
}

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed state manually');
