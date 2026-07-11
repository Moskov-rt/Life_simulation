const fs = require('fs');

let typesCode = fs.readFileSync('src/types.ts', 'utf8');

// Conflict 1: Stats
typesCode = typesCode.replace(/<<<<<<< HEAD\n  karma\?: number;\n  willpower\?: number;\n  family\?: number;\n  leakRisk\?: number;\n  cashChange\?: number;\n  confidence\?: number;\n=======\n>>>>>>> aistudio\/main\n/g, "");

// Conflict 2: NPC Interfaces
typesCode = typesCode.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n>>>>>>> aistudio\/main\n/g, "$1");

// Conflict 3: OutcomeEffect
typesCode = typesCode.replace(/<<<<<<< HEAD\n  statChanges\?: Partial<Stats>;\n=======\n  statChanges\?: Partial<Stats> & \{ karma\?: number; willpower\?: number; cashChange\?: number \};\n>>>>>>> aistudio\/main\n/g, "  statChanges?: Partial<Stats> & { karma?: number; willpower?: number; cashChange?: number };\n");

// Conflict 4: GameState
typesCode = typesCode.replace(/<<<<<<< HEAD\n  saveVersion\?: number;\n  npcs: Record<string, NPC>;\n=======\n>>>>>>> aistudio\/main\n/g, "  saveVersion?: number;\n  npcs: Record<string, NPC>;\n");

fs.writeFileSync('src/types.ts', typesCode);
console.log("types.ts resolved!");
