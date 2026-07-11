import { GameState, NPC, NPCTraits, NPCLifeState, NPCLifestyle } from '../types';

function generateDefaultTraits(): NPCTraits {
  return {
    confidence: 50,
    kindness: 50,
    intelligence: 50,
    ambition: 50,
    greed: 50,
    honesty: 50,
    loyalty: 50,
    jealousy: 50,
    patience: 50,
    romanticInterest: 50,
    aggressiveness: 50,
    humor: 50,
    responsibility: 50,
    emotionalStability: 50,
    generosity: 50,
    riskTaking: 50,
  };
}

function generateDefaultLifeState(): NPCLifeState {
  return {
    happiness: 60,
    stress: 20,
    energy: 80,
    health: 80,
    confidence: 60,
    socialSatisfaction: 60,
    careerSatisfaction: 60,
  };
}

function generateDefaultLifestyle(): NPCLifestyle {
  return {
    home: "Apartment",
    car: "None",
    savings: 1000,
    debt: 0,
    netWorth: 1000,
    hobbies: [],
    favoriteActivities: [],
    shoppingHabits: 'average',
    vacationFrequency: 'rare',
    exerciseHabits: 'occasional',
    smoking: false,
    alcoholUse: 'social',
  };
}

/**
 * Creates a valid NPC from legacy Relationship data or new basic data.
 */
export function relationshipToNPC(rel: Partial<NPC> & Pick<NPC, 'id' | 'name' | 'relation'>): NPC {
  const npc = { ...rel } as NPC;

  if (npc.archetype === undefined) npc.archetype = 'average';
  if (npc.age === undefined) npc.age = 18;
  if (npc.gender === undefined) npc.gender = 'Male';
  if (npc.orientation === undefined) npc.orientation = 'straight';
  if (npc.nationality === undefined) npc.nationality = 'Local';
  if (npc.occupation === undefined) npc.occupation = 'Unemployed';
  if (npc.education === undefined) npc.education = 'High School';
  if (npc.income === undefined) npc.income = 0;
  
  if (npc.trust === undefined) npc.trust = 50;
  if (npc.suspicion === undefined) npc.suspicion = 0;
  if (npc.resentment === undefined) npc.resentment = 0;

  if (npc.personality === undefined) {
    npc.personality = ['cautious'];
  }

  if (npc.vectors === undefined) {
    npc.vectors = {
      trust: (npc.trust * 2) - 100, // Map 0..100 to -100..100
      suspicion: npc.suspicion,
      knowledge: 0,
      resentment: npc.resentment,
      forgiveness: 50
    };
  }

  if (!npc.traits) npc.traits = generateDefaultTraits();
  if (!npc.lifeState) npc.lifeState = generateDefaultLifeState();
  if (!npc.goals) npc.goals = [];
  if (!npc.memories) npc.memories = [];
  if (!npc.lifestyle) npc.lifestyle = generateDefaultLifestyle();
  if (!npc.npcRelations) npc.npcRelations = {};
  if (!npc.memoryFlags) npc.memoryFlags = [];
  if (!npc.interactionHistory) npc.interactionHistory = [];

  return npc;
}

/**
 * Migrates a legacy GameState into the new format.
 */
export function migrateGameState(state: unknown): GameState {
  if (!state) throw new TypeError('Invalid saved game state');
  if (typeof state !== 'object') throw new TypeError('Invalid saved game state');

  const source = state as Partial<GameState>;
  const newState = structuredClone(source) as GameState;
  newState.saveVersion = 1;
  newState.npcs = {};
  if (!newState.followUpFlags) newState.followUpFlags = [];
  if (!newState.ongoingEffects) newState.ongoingEffects = [];
  if (!newState.personalityTraits) newState.personalityTraits = [];
  if (!newState.creatorCareer) {
    newState.creatorCareer = { active: false, profile: null };
  }
  
  // Convert legacy relationships array to npcs dictionary
  for (const npc of Object.values(source.npcs || {})) {
    const normalized = relationshipToNPC(npc);
    newState.npcs[normalized.id] = normalized;
  }
  if (Array.isArray(source.relationships)) {
    for (const rel of source.relationships) {
      const npc = relationshipToNPC(rel);
      if (!newState.npcs[npc.id]) newState.npcs[npc.id] = npc;
    }
  }

  // Clear out old relationships array to prevent bugs, or keep empty
  newState.relationships = Object.values(newState.npcs);
  
  return newState as GameState;
}
