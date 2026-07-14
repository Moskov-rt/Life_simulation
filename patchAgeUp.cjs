const fs = require('fs');
const p = 'src/utils/ageUpSimulator.ts';
let code = fs.readFileSync(p, 'utf8');

// Replace imports to include processContextTurnover
code = code.replace(
  "import { relationshipToNPC } from './saveMigration';",
  "import { relationshipToNPC } from './saveMigration';\nimport { processContextTurnover } from './contextManager';"
);

// Remove the context.generateSchoolContacts calls from school transitions
code = code.replace(
  "workingState.relationships = workingState.relationships.filter(r => r.relation !== 'classmate' && r.relation !== 'teacher');\n    workingState.relationships.push(...context.generateSchoolContacts(false, roll));",
  "// Turnover handled generically by contextManager"
);
code = code.replace(
  "workingState.relationships = workingState.relationships.filter(r => r.relation !== 'classmate' && r.relation !== 'teacher');\n    workingState.relationships.push(...context.generateSchoolContacts(true, roll));",
  "// Turnover handled generically by contextManager"
);
code = code.replace(
  "workingState.relationships = workingState.relationships.filter(r => r.relation !== 'classmate' && r.relation !== 'teacher');",
  "// Turnover handled generically by contextManager"
);

// The fallback school creation code:
const fallbackRegex = /if \(workingState\.career\.type === 'school' && !workingState\.relationships\.some\(r => r\.relation === 'classmate'\)\) \{[\s\S]*?\}\n/;
code = code.replace(
  fallbackRegex,
  "if (workingState.career.type === 'school' && workingState.flags.schoolGrades === undefined) {\n    workingState.flags.schoolGrades = 80;\n    workingState.flags.schoolPopularity = 50;\n    workingState.flags.schoolType = 'public';\n  }\n"
);

// Inject processContextTurnover right after the drift application loop
const driftTarget = "    workingState.relationships.push(npc);\n  });";
const replacement = driftTarget + "\n\n  // 4.5 Process Generic Context Turnover (School, Workplace retention & replenishment)\n  processContextTurnover(workingState, roll);\n  // Sync back to relationships array\n  workingState.relationships = Object.values(workingState.npcs);\n";
code = code.replace(driftTarget, replacement);

fs.writeFileSync(p, code);
console.log('Patched ageUpSimulator.ts');
