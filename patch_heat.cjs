const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Social Post Heat Injection
const targetPostStr = `            setGameState({
              ...gameState,
              stats: nextStats,
              cash: nextCash,
              flags: nextFlags,
              relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
              socialMedia: {
                ...gameState.socialMedia,
                [res.channel]: {
                  ...gameState.socialMedia[res.channel],
                  followers: Math.max(0, gameState.socialMedia[res.channel].followers + currFollowers),
                  postsCount: gameState.socialMedia[res.channel].postsCount + 1
                }
              },
              log: [...gameState.log, logMsg]
            });`;

const replacementPostStr = `            const addedHeat = res.channel === 'onlyfans' ? (res.topic?.includes('collab') ? 4 : res.topic?.includes('Live') ? 3 : 2) : 0;
            const nextExposure = gameState.secretExposure ? {
              ...gameState.secretExposure,
              heat: (gameState.secretExposure.heat || 0) + addedHeat
            } : undefined;

            setGameState({
              ...gameState,
              stats: nextStats,
              cash: nextCash,
              flags: nextFlags,
              relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
              socialMedia: {
                ...gameState.socialMedia,
                [res.channel]: {
                  ...gameState.socialMedia[res.channel],
                  followers: Math.max(0, gameState.socialMedia[res.channel].followers + currFollowers),
                  postsCount: gameState.socialMedia[res.channel].postsCount + 1
                }
              },
              secretExposure: nextExposure,
              log: [...gameState.log, logMsg]
            });`;

if (code.includes(targetPostStr)) {
  code = code.replace(targetPostStr, replacementPostStr);
  console.log('Post Heat logic replaced');
} else {
  // Try CRLF replacement
  const cleanTarget = targetPostStr.replace(/\n/g, '\r\n');
  const cleanReplacement = replacementPostStr.replace(/\n/g, '\r\n');
  if (code.includes(cleanTarget)) {
    code = code.replace(cleanTarget, cleanReplacement);
    console.log('Post Heat logic replaced (CRLF)');
  } else {
    console.log('Post Heat target not found');
  }
}

// 2. Freelance Gig Escort Heat Injection
const targetEscortStr = `    if (gigId === 'escort') {
      const stdRisk = Math.random() < 0.25;
      const amount = Math.floor(Math.random() * 800) + 700;
      
      if (stdRisk && !gameState.flags.has_unprotected_sex) {
        setGameState({
          ...gameState,
          cash: gameState.cash + amount,
          flags: { ...gameState.flags, has_unprotected_sex: true },
          log: [...gameState.log, \`💋 You worked as an escort and made $\\\${amount}, but took risky decisions.\`]
        });
        setActionPopup({
          isOpen: true,
          title: 'High Risk!',
          message: \`You worked as an escort and made $\\\${amount}. However, you had unprotected encounters. Watch out for illnesses next year!\`
        });
      } else {
        setGameState({
          ...gameState,
          cash: gameState.cash + amount,
          log: [...gameState.log, \`💋 You worked as an escort and made $\\\${amount}.\`]
        });`;

const replacementEscortStr = `    if (gigId === 'escort') {
      const stdRisk = Math.random() < 0.25;
      const amount = Math.floor(Math.random() * 800) + 700;
      
      const addedHeat = 5;
      const nextExposure = gameState.secretExposure ? {
        ...gameState.secretExposure,
        heat: (gameState.secretExposure.heat || 0) + addedHeat
      } : undefined;

      if (stdRisk && !gameState.flags.has_unprotected_sex) {
        setGameState({
          ...gameState,
          cash: gameState.cash + amount,
          flags: { ...gameState.flags, has_unprotected_sex: true },
          secretExposure: nextExposure,
          log: [...gameState.log, \`💋 You worked as an escort and made $\\\${amount}, but took risky decisions.\`]
        });
        setActionPopup({
          isOpen: true,
          title: 'High Risk!',
          message: \`You worked as an escort and made $\\\${amount}. However, you had unprotected encounters. Watch out for illnesses next year!\`
        });
      } else {
        setGameState({
          ...gameState,
          cash: gameState.cash + amount,
          secretExposure: nextExposure,
          log: [...gameState.log, \`💋 You worked as an escort and made $\\\${amount}.\`]
        });`;

if (code.includes(targetEscortStr)) {
  code = code.replace(targetEscortStr, replacementEscortStr);
  console.log('Escort Heat logic replaced');
} else {
  const cleanTarget = targetEscortStr.replace(/\n/g, '\r\n');
  const cleanReplacement = replacementEscortStr.replace(/\n/g, '\r\n');
  if (code.includes(cleanTarget)) {
    code = code.replace(cleanTarget, cleanReplacement);
    console.log('Escort Heat logic replaced (CRLF)');
  } else {
    console.log('Escort Heat target not found');
  }
}

fs.writeFileSync('src/App.tsx', code);
