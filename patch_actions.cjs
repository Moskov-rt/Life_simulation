const fs = require('fs');

const path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetBlock = code.substring(
  code.indexOf("const handleInfantBabble = () => {"),
  code.indexOf("const handleInfantNap = () => {")
);

const newBlock = `const handleInfantBabble = () => {
    if (!gameState) return;
    triggerSound('success');
    const smartsGain = Math.floor(Math.random() * 5) + 3;
    const happinessGain = Math.floor(Math.random() * 4) + 2;

    const babbles = [
      "Tried speaking my first words! Babbled 'goo-goo gaga' proudly at the wall.",
      "Giggled and babbled at the funny shadows on the ceiling.",
      "Babbled loudly during family dinner. Everyone laughed!",
      "Pointed at the family cat and shouted 'gaga'! The cat looked confused."
    ];
    const chosenBabble = babbles[Math.floor(Math.random() * babbles.length)];

    setGameState({
      ...gameState,
      stats: {
        ...gameState.stats,
        smarts: Math.min(100, gameState.stats.smarts + smartsGain),
        happiness: Math.min(100, gameState.stats.happiness + happinessGain)
      },
      log: [
        ...gameState.log,
        \`🍼 \${chosenBabble}\`,
        \`└─ Smarts improved (+\${smartsGain}) and Happiness improved (+\${happinessGain}).\`
      ]
    });
    
    setActionPopup({
      isOpen: true,
      title: "💬 Giggle & Babble",
      message: chosenBabble
    });
  };

  const handleInfantCry = () => {
    if (!gameState) return;
    triggerSound('click');
    const roll = Math.random();
    let logText = '';
    let effectText = '';
    const nextStats = { ...gameState.stats };
    let nextRelationships = [...gameState.relationships];

    if (roll < 0.4) {
      // Cuddled
      nextStats.happiness = Math.min(100, nextStats.happiness + 6);
      nextRelationships = gameState.relationships.map(r => r.relation === 'parent' ? { ...r, trust: Math.min(100, r.trust + 4) } : r);
      logText = "Cried out loud! Mama rushed in, scooped me up, and gave me a warm, gentle cuddle.";
      effectText = "Happiness improved (+6) and parental trust improved (+4).";
    } else if (roll < 0.8) {
      // Fed
      nextStats.health = Math.min(100, nextStats.health + 8);
      nextStats.happiness = Math.min(100, nextStats.happiness + 4);
      logText = "Cried of hunger! Papa quickly warmed up a fresh bottle of milk and fed me.";
      effectText = "Health improved (+8) and Happiness improved (+4).";
    } else {
      // Ignored
      nextStats.happiness = Math.max(0, nextStats.happiness - 4);
      logText = "Cried for attention for hours, but everyone was busy. I eventually cried myself to sleep.";
      effectText = "Felt neglected (-4 Happiness).";
    }

    setGameState({
      ...gameState,
      stats: nextStats,
      relationships: nextRelationships,
      log: [
        ...gameState.log,
        \`😭 \${logText}\`,
        \`└─ \${effectText}\`
      ]
    });
    
    setActionPopup({
      isOpen: true,
      title: "😭 Cry For Attention",
      message: logText
    });
  };

  const handleInfantCuddle = () => {
    if (!gameState) return;
    triggerSound('success');
    const happinessGain = Math.floor(Math.random() * 4) + 3;
    const trustGain = Math.floor(Math.random() * 5) + 5;

    const nextRelationships = gameState.relationships.map(r => 
      r.relation === 'parent' ? { ...r, trust: Math.min(100, r.trust + trustGain) } : r
    );

    setGameState({
      ...gameState,
      relationships: nextRelationships,
      stats: {
        ...gameState.stats,
        happiness: Math.min(100, gameState.stats.happiness + happinessGain)
      },
      log: [
        ...gameState.log,
        \`❤️ Crawled over to my parents and cuddled up tightly against them. They smiled and patted my head gently.\`,
        \`└─ Happiness improved (+\${happinessGain}) and trust with parents improved (+\${trustGain}).\`
      ]
    });
    
    setActionPopup({
      isOpen: true,
      title: "❤️ Cuddle Parents",
      message: "Crawled over to my parents and cuddled up tightly against them. They smiled and patted my head gently."
    });
  };

  const handleInfantPlay = () => {
    if (!gameState) return;
    triggerSound('success');
    const smartsGain = Math.floor(Math.random() * 4) + 2;
    const happinessGain = Math.floor(Math.random() * 5) + 3;

    const toys = [
      "Played with colorful wooden blocks and chewed on a squeaky rubber ducky.",
      "Played with a soft plush bear, tossing it across the play mat.",
      "Shook a shiny rattle with absolute joy. Shake shake shake!",
      "Discovered my own toes! Spent an hour trying to pull them into my mouth."
    ];
    const chosenToy = toys[Math.floor(Math.random() * toys.length)];

    setGameState({
      ...gameState,
      stats: {
        ...gameState.stats,
        smarts: Math.min(100, gameState.stats.smarts + smartsGain),
        happiness: Math.min(100, gameState.stats.happiness + happinessGain)
      },
      log: [
        ...gameState.log,
        \`🧸 \${chosenToy}\`,
        \`└─ Smarts improved (+\${smartsGain}) and Happiness improved (+\${happinessGain}).\`
      ]
    });
    
    setActionPopup({
      isOpen: true,
      title: "🧸 Play With Toys",
      message: chosenToy
    });
  };

  `;

code = code.replace(targetBlock, newBlock);
fs.writeFileSync(path, code);
