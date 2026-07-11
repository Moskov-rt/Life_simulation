import { GameState, NPC, Event, Relationship } from '../types';

export const EXPOSURE_EVENTS: Event[] = [
  {
    id: 'whisper',
    title: "Someone's Talking",
    text: "You overhear whispering at a family gathering. A relative mentions seeing someone online who looks exactly like you in some suggestive promotional posts.",
    category: 'relationship',
    choices: [
      { id: 'whisper_ignore', text: 'Ignore it and walk away.', effect: { outcomeText: 'You pretended not to hear anything, but the rumor mill keeps spinning.', relationshipChanges: { target: 'current', suspicion: 15 } } },
      { id: 'whisper_laugh', text: 'Laugh it off as a common lookalike.', effect: { outcomeText: 'You laughed loudly and joked about having a twin. They seem to buy it for now.', relationshipChanges: { target: 'current', trust: 5, suspicion: -5 } } }
    ]
  },
  {
    id: 'confrontation',
    title: "We Need to Talk",
    text: "You are pulled aside. They hold up a phone showing your side hustle profile page and demand to know if it is you.",
    category: 'relationship',
    choices: [
      { id: 'confrontation_deny', text: 'Deny everything flatly.', effect: { outcomeText: 'You claimed it was a deepfake. They look extremely suspicious but cannot prove otherwise.', relationshipChanges: { target: 'current', trust: -25, suspicion: 35 } } },
      { id: 'confrontation_admit', text: 'Confess partially.', effect: { outcomeText: 'You admitted it was you, but claimed you only do it for extra rent money.', relationshipChanges: { target: 'current', trust: -10, suspicion: -10 } } }
    ]
  },
  {
    id: 'recognition',
    title: "Don't I Know You?",
    text: "An acquaintance stops you and asks: 'Hey, are you that creator from OnlyFans? You look just like them.'",
    category: 'relationship',
    choices: [
      { id: 'recognition_ignore', text: 'Pretend they have the wrong person.', effect: { outcomeText: 'You quickly walked away. They look puzzled and suspicious.', relationshipChanges: { target: 'current', suspicion: 20 } } },
      { id: 'recognition_smile', text: 'Smile cryptically and walk away.', effect: { outcomeText: 'You smiled and winked. They look stunned.', relationshipChanges: { target: 'current', suspicion: 40 } } }
    ]
  },
  {
    id: 'leak',
    title: "The Ex Strikes",
    text: "Your ex-partner has leaked some of your private paywalled content to local community groups out of spite.",
    category: 'relationship',
    choices: [
      { id: 'leak_threaten', text: 'Threaten legal action.', effect: { outcomeText: 'You sent a fierce warning. They backed down slightly, but the damage is done.', relationshipChanges: { target: 'current', resentment: 25 } } },
      { id: 'leak_ignore', text: 'Ignore the leak completely.', effect: { outcomeText: 'You chose not to feed the fire. The posts slowly drift down the feed.', relationshipChanges: { target: 'current', suspicion: 10 } } }
    ]
  },
  {
    id: 'snoop',
    title: "Caught Red-Handed",
    text: "A family member is caught looking through your browser history and demands answers about your secret activities.",
    category: 'relationship',
    choices: [
      { id: 'snoop_deny', text: 'Demand they respect your privacy.', effect: { outcomeText: 'You locked your phone and yelled. They look highly suspicious.', relationshipChanges: { target: 'current', trust: -30, suspicion: 40 } } },
      { id: 'snoop_confess', text: 'Confess and ask for support.', effect: { outcomeText: 'You cried and explained everything. They hold you close, feeling closer but worried.', relationshipChanges: { target: 'current', trust: 15, suspicion: -20 } } }
    ]
  },
  {
    id: 'full_exposure',
    title: "It's Everywhere",
    text: "Your secret side hustle has completely gone viral locally. Your neighbors, bosses, and family have all seen your profiles.",
    category: 'relationship',
    choices: [
      { id: 'full_exposure_own', text: 'Own your content proudly.', effect: { outcomeText: 'You stood tall. Some respect your confidence, others turn their backs.', relationshipChanges: { target: 'all', trust: -10 } } },
      { id: 'full_exposure_delete', text: 'Delete everything and hide.', effect: { outcomeText: 'You deleted all your accounts, but the screenshots will live forever.', relationshipChanges: { target: 'all', trust: -25 } } }
    ]
  }
];

export function calculateExposureFactor(exposure: number, zoneMin: number): number {
  const diff = zoneMin - exposure;
  if (diff > 15) return 0.1;       // Far Below Threshold
  if (diff > 0) return 0.5;        // Approaching
  if (diff === 0) return 1.0;      // At Threshold
  if (diff > -20) return 1.5;      // Above Threshold
  return 2.0;                      // Deep In Danger
}

export function calculateTensionMultiplier(npc: Relationship | NPC): number {
  const trust = npc.trust || 50;
  const suspicion = npc.suspicion || 0;
  const knowledge = (npc as any).knowledge || 0;
  const tension = (100 - trust) * 0.5 + suspicion * 0.5 + knowledge * 0.3;
  return 0.5 + (tension / 100);
}

export function calculateHeatMultiplier(heat: number): number {
  return 1.0 + (heat / 20);
}

export function rollLuck(random: () => number = Math.random): { value: number; isCritical: boolean; isNearMiss: boolean } {
  const val = 0.7 + random() * 0.6;
  const roll = random();
  return {
    value: val,
    isCritical: roll < 0.05,
    isNearMiss: roll >= 0.05 && roll < 0.15
  };
}

export function evaluateSecretExposureEvents(
  gameState: GameState,
  yearlyActions: string[],
  random: () => number = Math.random
): Event | null {
  if (!gameState.secretExposure?.isActive) return null;

  const currentHeat = gameState.secretExposure.heat || 0;
  const exposureLevel = gameState.secretExposure.level || 0;
  const npcs = Object.values(gameState.npcs || {}) as NPC[];
  const possibleEvents: { event: Event; chance: number }[] = [];

  const luckRoll = rollLuck(random);
  if (luckRoll.isCritical) {
    // Critical hit! Force a random event regardless of odds
    const randomEvent = EXPOSURE_EVENTS[Math.floor(random() * EXPOSURE_EVENTS.length)];
    return randomEvent;
  }

  // Iterate over all core events
  for (const event of EXPOSURE_EVENTS) {
    let baseChance = 0.03; // default
    let zoneMin = 30;

    if (event.id === 'whisper') { baseChance = 0.03; zoneMin = 20; }
    else if (event.id === 'confrontation') { baseChance = 0.04; zoneMin = 40; }
    else if (event.id === 'recognition') { baseChance = 0.02; zoneMin = 60; }
    else if (event.id === 'leak') { baseChance = 0.025; zoneMin = 10; }
    else if (event.id === 'snoop') { baseChance = 0.03; zoneMin = 50; }
    else if (event.id === 'full_exposure') { baseChance = 0.05; zoneMin = 85; }

    // Find involved NPC matching event type
    let matchingNPC = npcs.find(n => {
      if (event.id === 'leak') return n.isEx === true;
      if (event.id === 'confrontation') return n.relation === 'colleague' || n.relation === 'supervisor' || n.relation === 'partner' || n.relation === 'spouse';
      return n.relation === 'parent' || n.relation === 'sibling';
    });

    // Fallback NPC if none found
    if (!matchingNPC && npcs.length > 0) {
      matchingNPC = npcs[0];
    }
    if (!matchingNPC) continue;

    const expFactor = calculateExposureFactor(exposureLevel, zoneMin);
    const tensionMult = calculateTensionMultiplier(matchingNPC);
    const heatMult = calculateHeatMultiplier(currentHeat);

    let finalChance = baseChance * expFactor * tensionMult * heatMult * luckRoll.value;

    // Apply leak condition (ex must exist)
    if (event.id === 'leak' && !npcs.some(n => n.isEx === true)) {
      finalChance = 0;
    }

    if (random() < finalChance) {
      possibleEvents.push({ event, chance: finalChance });
    }
  }

  if (possibleEvents.length > 0) {
    // Return highest severity based on base_chance / danger_zone min
    possibleEvents.sort((a, b) => b.chance - a.chance);
    return possibleEvents[0].event;
  }

  return null;
}
