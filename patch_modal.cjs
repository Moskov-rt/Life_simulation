const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import OccupationModal
if (!code.includes("import { OccupationModal }")) {
  code = code.replace("import { AppearanceModal } from './components/AppearanceModal';", "import { AppearanceModal } from './components/AppearanceModal';\nimport { OccupationModal } from './components/OccupationModal';");
}

// 2. Add State for OccupationModal
if (!code.includes("const [showOccupationModal, setShowOccupationModal] = useState(false);")) {
  code = code.replace("const [showProfileModal, setShowProfileModal] = useState(false);", "const [showProfileModal, setShowProfileModal] = useState(false);\n  const [showOccupationModal, setShowOccupationModal] = useState(false);");
}

// 3. Render OccupationModal
if (!code.includes("<OccupationModal")) {
  code = code.replace("{showProfileModal && (", "{showOccupationModal && (\n        <OccupationModal \n          gameState={gameState}\n          onClose={() => setShowOccupationModal(false)}\n        />\n      )}\n\n      {showProfileModal && (");
}

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched for OccupationModal');
