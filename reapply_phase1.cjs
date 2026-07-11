const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Imports
if (!code.includes("import { relationshipToNPC }")) {
  code = code.replace(/import \{ EVENTS_POOL \}/, "import { relationshipToNPC } from './utils/saveMigration';\nimport { EVENTS_POOL }");
}
code = code.replace(/import \{ Relationship \} from '\.\/types';/, "import { NPC, Relationship } from './types';");
code = code.replace(/import \{ .*Relationship.* \} from '\.\/types';/, (match) => {
  if (!match.includes('NPC')) return match.replace('Relationship', 'Relationship, NPC');
  return match;
});

// 2. Initial Game State in startGame
code = code.replace(/relationships: parents,/g, "relationships: parents as any,\n      npcs: Object.fromEntries(parents.map(p => [p.id, relationshipToNPC(p)])),");

// 3. UI rendering adapter
code = code.replace(/gameState\.relationships/g, "(Object.values(gameState.npcs || {}) as any[])");

// 4. Intercept setGameState saving arrays back into GameState
code = code.replace(/relationships: nextRelationships as any,?/g, "npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),");
code = code.replace(/relationships: nextRelationships,?/g, "relationships: nextRelationships as any,\n              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),");

// 5. Fix Array Typing for fresh generated NPCs
code = code.replace(/let nextRelationships = \[\.\.\.\(Object\.values\(gameState\.npcs \|\| \{\}\) as any\[\]\)\];/g, "let nextRelationships: any[] = [...(Object.values(gameState.npcs || {}) as any[])];");
code = code.replace(/\.\.\.schoolmates/g, "...(schoolmates as any)");

fs.writeFileSync(appPath, code);
console.log("Phase 1 UI adapter reapplied.");
