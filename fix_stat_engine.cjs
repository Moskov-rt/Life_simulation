const fs = require('fs');
let code = fs.readFileSync('src/utils/statEngine.ts', 'utf8');

code = code.replace(/gameState\.stats\.confidence/g, "(gameState.stats as any).confidence");
code = code.replace(/statChanges\.confidence/g, "(statChanges as any).confidence");

fs.writeFileSync('src/utils/statEngine.ts', code);
