const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import the evaluation function
if (!code.includes("import { evaluateSecretExposureEvents }")) {
  code = code.replace(
    "import { AgeUpModal } from './components/AgeUpModal';",
    "import { AgeUpModal } from './components/AgeUpModal';\nimport { evaluateSecretExposureEvents } from './utils/exposureEvents';"
  );
}

// Update the ageUp transition capture logic in App.tsx
// We will replace the intercept block we wrote earlier
const interceptRegex = /\/\/ Capture transition data for Age Up Modal[\s\S]*?setShowAgeUpModal\(true\);/;

const interceptReplacement = `// Capture transition data for Age Up Modal
    const currentExposure = gameState.secretExposure?.level || 0;
    const currentHeat = gameState.secretExposure?.heat || 0;
    const ofPosts = nextSocialMedia.onlyfans?.postsCount || 0;
    
    // Math logic based on Part 2 deliverables
    const postsVal = ofPosts > 0 ? ofPosts : 10;
    const collabsVal = ofPosts > 5 ? 2 : 0;
    const mitigationVal = 85; // Base mitigation
    const locationMult = gameState.location.includes('Mumbai') ? 0.8 : 1.0;
    const luckRoll = Math.floor(Math.random() * 6) - 3; // -3 to +3
    
    const calculatedGain = Math.round(((postsVal * 2) + (collabsVal * 4) - (mitigationVal * 0.1)) * locationMult + luckRoll);
    const finalNextExposure = Math.max(0, Math.min(100, currentExposure + calculatedGain));
    
    // Decay heat by 50%
    const nextHeat = Math.round(currentHeat * 0.5);

    // Roll mathematical events
    const mockStateForRoll = {
      ...nextState,
      secretExposure: {
        ...gameState.secretExposure,
        level: finalNextExposure,
        heat: nextHeat
      }
    };
    const rolledEvent = evaluateSecretExposureEvents(mockStateForRoll as any, []);
    if (rolledEvent) {
      triggeredEvent = rolledEvent;
    }

    // Save history
    const prevHistory = gameState.secretExposure?.history || [];
    const nextHistory = [...prevHistory, finalNextExposure];

    const updatedSecretExposure = gameState.secretExposure ? {
      ...gameState.secretExposure,
      level: finalNextExposure,
      heat: nextHeat,
      history: nextHistory
    } : undefined;

    nextState.secretExposure = updatedSecretExposure;

    setAgeUpData({
      prevStats: { ...gameState.stats },
      nextStats: nextStats,
      earnedCash: (nextCash - gameState.cash) > 0 ? (nextCash - gameState.cash) : 0,
      prevExposure: currentExposure,
      nextExposure: finalNextExposure,
      triggeredEvent: triggeredEvent
    });
    
    // If an event triggered, clear it from nextState immediate display so EventPopupModal handles it
    if (triggeredEvent) {
      nextState.currentEvent = null;
    }

    setGameState(nextState);
    setShowAgeUpModal(true);`;

if (interceptRegex.test(code)) {
  code = code.replace(interceptRegex, interceptReplacement);
  console.log('App.tsx mathematical ageUp updated successfully');
} else {
  console.log('Intercept regex target not found');
}

fs.writeFileSync('src/App.tsx', code);
