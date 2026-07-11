const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Imports
if (!code.includes("import { AgeUpModal }")) {
  code = code.replace(
    "import { OccupationModal } from './components/OccupationModal';",
    "import { OccupationModal } from './components/OccupationModal';\nimport { AgeUpModal } from './components/AgeUpModal';\nimport { EventPopupModal } from './components/EventPopupModal';"
  );
}

// 2. State definitions
if (!code.includes("const [showAgeUpModal, setShowAgeUpModal] = useState(false);")) {
  code = code.replace(
    "const [showProfileModal, setShowProfileModal] = useState(false);\n  const [showOccupationModal, setShowOccupationModal] = useState(false);",
    "const [showProfileModal, setShowProfileModal] = useState(false);\n  const [showOccupationModal, setShowOccupationModal] = useState(false);\n  const [showAgeUpModal, setShowAgeUpModal] = useState(false);\n  const [ageUpData, setAgeUpData] = useState<any>(null);\n  const [showEventPopupModal, setShowEventPopupModal] = useState(false);\n  const [eventPopupData, setEventPopupData] = useState<any>(null);"
  );
}

// 3. Render Modal tags at the bottom of App
if (!code.includes("<AgeUpModal")) {
  code = code.replace(
    "{showProfileModal && (",
    `{showAgeUpModal && ageUpData && (
        <AgeUpModal
          gameState={gameState}
          prevStats={ageUpData.prevStats}
          nextStats={ageUpData.nextStats}
          earnedCash={ageUpData.earnedCash}
          prevExposure={ageUpData.prevExposure}
          nextExposure={ageUpData.nextExposure}
          triggeredEvent={ageUpData.triggeredEvent}
          onSeeChoices={() => {
            setShowAgeUpModal(false);
            if (ageUpData.triggeredEvent) {
              setEventPopupData(ageUpData.triggeredEvent);
              setShowEventPopupModal(true);
            }
          }}
          onClose={() => {
            setShowAgeUpModal(false);
          }}
        />
      )}

      {showEventPopupModal && eventPopupData && (
        <EventPopupModal
          event={eventPopupData}
          onChoiceSelected={(choice) => {
            // Apply standard choice logic
            handleChoiceClick(choice);
          }}
          onClose={() => {
            setShowEventPopupModal(false);
            setEventPopupData(null);
          }}
        />
      )}

      {showProfileModal && (`
  );
}

// 4. Intercept ageUp function
const ageUpReplacement = `    // Capture transition data for Age Up Modal
    setAgeUpData({
      prevStats: { ...gameState.stats },
      nextStats: nextStats,
      earnedCash: (nextCash - gameState.cash) > 0 ? (nextCash - gameState.cash) : 0,
      prevExposure: gameState.secretExposure?.level || 0,
      nextExposure: nextState.secretExposure?.level || 0,
      triggeredEvent: triggeredEvent || (nextAge === 24 ? {
        id: 'moms_been_watching',
        title: "Mom's Been Watching",
        text: "I've known for 2 years. I was waiting for you to tell me.",
        category: 'relationship',
        choices: [
          { id: 'deny', text: 'Deny Everything', effect: { outcomeText: 'You denied everything.' } },
          { id: 'change_subject', text: 'Change Subject', effect: { outcomeText: 'You changed the subject.' } },
          { id: 'confess_partially', text: 'Confess Partially', effect: { outcomeText: 'You confessed partially.' } }
        ]
      } : null)
    });
    
    // If the event triggered was our custom mock one, clear it from game state's immediate display
    const finalState = { ...nextState };
    if (nextAge === 24) {
      finalState.currentEvent = null; // Let our custom EventPopupModal handle it
    }

    setGameState(finalState);
    setShowAgeUpModal(true);
    setActiveTab('home');
  };`;

code = code.replace(/[ \t]*setGameState\(nextState\);\s*[ \t]*setActiveTab\('home'\);\s*\};/m, ageUpReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx successfully updated with Age Up flow intercepts!');
