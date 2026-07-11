const fs = require('fs');
let code = fs.readFileSync('src/utils/statEngine.ts', 'utf8');

code = code.replace(/currentStats\.confidence/g, "(currentStats as any).confidence");
code = code.replace(/cascades\.confidence/g, "(cascades as any).confidence");

fs.writeFileSync('src/utils/statEngine.ts', code);
