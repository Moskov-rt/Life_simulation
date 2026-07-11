const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetEscortStr = `  const handleFreelanceGig = (gigId: string) => {
    if (!gameState) return;
    triggerSound('click');
    
    if (gigId === 'escort') {`;

const replacementEscortStr = `  const handleFreelanceGig = (gigId: string) => {
    if (!gameState) return;
    triggerSound('click');
    
    if (gigId === 'escort') {
      const addedHeat = 5;
      const nextExposure = gameState.secretExposure ? {
        ...gameState.secretExposure,
        heat: (gameState.secretExposure.heat || 0) + addedHeat
      } : undefined;`;

// We also need to add the property to the setGameState calls inside that function
// Let's do a simple regex replacement for the first setGameState inside handleFreelanceGig
const targetState1 = `        setGameState({
          ...gameState,
          cash: gameState.cash + amount,
          flags: { ...gameState.flags, has_unprotected_sex: true },
          log: [...gameState.log, \`💋 You worked as an escort and made \$\${amount}, but took risky decisions.\`]
        });`;

const targetState2 = `        setGameState({
          ...gameState,
          cash: gameState.cash + amount,
          log: [...gameState.log, \`💋 You worked as an escort and made \$\${amount}.\`]
        });`;

if (code.includes(targetEscortStr)) {
  code = code.replace(targetEscortStr, replacementEscortStr);
  console.log('Escort entry patched');
} else {
  const cleanTarget = targetEscortStr.replace(/\n/g, '\r\n');
  const cleanReplacement = replacementEscortStr.replace(/\n/g, '\r\n');
  if (code.includes(cleanTarget)) {
    code = code.replace(cleanTarget, cleanReplacement);
    console.log('Escort entry patched (CRLF)');
  }
}

// Inject secretExposure: nextExposure into the setGameState calls inside handleFreelanceGig
code = code.replace(
  /flags: \{ \.\.\.gameState\.flags, has_unprotected_sex: true \},\s*log: \[\.\.\.gameState\.log, `💋 You worked as an escort and made \$\$\{amount\}, but took risky decisions.`\]/m,
  "flags: { ...gameState.flags, has_unprotected_sex: true },\n          secretExposure: nextExposure,\n          log: [...gameState.log, `💋 You worked as an escort and made $${amount}, but took risky decisions.`]"
);

code = code.replace(
  /cash: gameState\.cash \+ amount,\s*log: \[\.\.\.gameState\.log, `💋 You worked as an escort and made \$\$\{amount\}.`\]/m,
  "cash: gameState.cash + amount,\n          secretExposure: nextExposure,\n          log: [...gameState.log, `💋 You worked as an escort and made $${amount}.`]"
);

fs.writeFileSync('src/App.tsx', code);
console.log('Escort state modifications updated!');
