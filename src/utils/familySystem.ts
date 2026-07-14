import { FamilyLegacy, GameState, NPC, NPCTraits } from '../types';
import { relationshipToNPC } from './saveMigration';
import { nextRandom } from './seededRandom';

export interface ChildGenerationOptions {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  seed?: number;
  parentStats?: { looks?: number; smarts?: number; health?: number };
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function inheritedValue(a: number, b: number, roll: number): number {
  return clamp((a + b) / 2 + (roll - 0.5) * 20);
}

export function generateChildNPC(parents: NPC[], options: ChildGenerationOptions): { child: NPC; nextSeed: number } {
  const seed = options.seed ?? 1;
  const firstRoll = nextRandom(seed);
  const secondRoll = nextRandom(firstRoll.nextSeed);
  const parentA = parents[0];
  const parentB = parents[1] || parents[0];
  const baseTraits = (Object.keys(parentA?.traits || {}) as (keyof NPCTraits)[]).reduce((traits, key) => {
    traits[key] = inheritedValue(parentA?.traits?.[key] ?? 50, parentB?.traits?.[key] ?? 50, firstRoll.value);
    return traits;
  }, {} as NPCTraits);
  const inheritedPersonality = Array.from(new Set([...(parentA?.personality || []), ...(parentB?.personality || [])])).slice(0, 3);
  const personality = inheritedPersonality.length ? inheritedPersonality : [secondRoll.value > 0.5 ? 'curious' : 'cautious'];
  const child = relationshipToNPC({
    id: options.id,
    name: options.name,
    relation: 'child',
    archetype: 'average',
    age: options.age ?? 0,
    gender: options.gender || 'Other',
    occupation: 'Child',
    trust: 70,
    suspicion: 0,
    resentment: 0,
    personality,
    traits: baseTraits,
    income: 0
  });
  // Health and intelligence are inherited tendencies, not clones.  The seeded
  // roll keeps siblings reproducible while still allowing variation.
  const inheritedIntelligence = inheritedValue(
    options.parentStats?.smarts ?? parentA?.traits?.intelligence ?? 50,
    options.parentStats?.smarts ?? parentB?.traits?.intelligence ?? 50,
    firstRoll.value
  );
  child.traits.intelligence = inheritedIntelligence;
  child.lifeState.health = inheritedValue(
    options.parentStats?.health ?? parentA?.lifeState?.health ?? 80,
    options.parentStats?.health ?? parentB?.lifeState?.health ?? 80,
    secondRoll.value
  );
  return { child, nextSeed: secondRoll.nextSeed };
}

/** Adds a generated child to the existing NPC collection. */
export function addChildToFamily(state: GameState, child: NPC): GameState {
  state.npcs[child.id] = child;
  state.relationships = Object.values(state.npcs);
  return state;
}

export type ParentingStyle = 'strict' | 'supportive' | 'neglectful';

export function applyParentingChoice(child: NPC, style: ParentingStyle, age: number): NPC {
  const next = structuredClone(child);
  const changes = style === 'strict' ? { trust: -5, resentment: 5, discipline: 8 } : style === 'supportive' ? { trust: 8, resentment: -4, happiness: 8 } : { trust: -12, resentment: 10, independence: 8 };
  next.trust = clamp(next.trust + changes.trust);
  next.resentment = clamp(next.resentment + changes.resentment);
  next.vectors.trust = Math.max(-100, Math.min(100, next.vectors.trust + changes.trust));
  next.vectors.resentment = clamp(next.vectors.resentment + changes.resentment);
  if (style === 'strict') next.traits.responsibility = clamp(next.traits.responsibility + changes.discipline);
  if (style === 'supportive') next.lifeState.happiness = clamp(next.lifeState.happiness + changes.happiness);
  if (style === 'neglectful') next.traits.confidence = clamp(next.traits.confidence + changes.independence);
  next.memories.push({ id: `parenting_${style}_${age}_${next.id}`, type: `parenting_${style}`, sourceId: 'parent', targetId: next.id, tick: age, intensity: 55, emotionalValue: style === 'supportive' ? 20 : -15, decayRate: style === 'neglectful' ? 0 : 2, permanent: style !== 'strict' });
  return next;
}

export function processFamilyInheritance(state: GameState, deceased: NPC): number {
  if (!deceased.isDeceased || !['parent', 'grandparent', 'spouse'].includes(deceased.relation)) return 0;
  const amount = Math.max(0, Math.round((deceased.lifestyle?.netWorth || 0) + (deceased.lifestyle?.savings || 0)));
  state.cash += amount;
  state.familyInheritance = (state.familyInheritance || 0) + amount;
  state.familyAssets = state.familyAssets || [];
  for (const asset of [deceased.lifestyle?.home, deceased.lifestyle?.car]) {
    if (asset && asset !== 'None' && !state.familyAssets.includes(asset)) state.familyAssets.push(asset);
  }
  recordFamilyLegacy(state, 'wealth', `Inherited from ${deceased.name}`, amount);
  if (deceased.context === 'royal' || /royal|monarch/i.test(deceased.occupation || '')) {
    state.flags.royal_inheritance_received = true;
  }
  state.flags[`inheritance_received_${deceased.id}`] = true;
  return amount;
}

export function recordFamilyLegacy(state: GameState, kind: 'achievement' | 'relationship' | 'wealth', entry: string, amount = 0): void {
  const legacy: FamilyLegacy = state.familyLegacy || {
    achievements: [], wealthPassedDown: 0, relationshipMilestones: [], reputationSnapshots: []
  };
  if (kind === 'achievement' && !legacy.achievements.includes(entry)) legacy.achievements.push(entry);
  if (kind === 'relationship' && !legacy.relationshipMilestones.includes(entry)) legacy.relationshipMilestones.push(entry);
  if (kind === 'wealth') legacy.wealthPassedDown += Math.max(0, amount);
  legacy.reputationSnapshots.push(Math.round(state.reputation.family ?? 50));
  state.familyLegacy = legacy;
}

export function summarizeFamilyLegacy(state: GameState): string {
  const legacy = state.familyLegacy;
  if (!legacy) return 'Family legacy: no milestones recorded yet.';
  return `Family legacy: ${legacy.achievements.length} achievements, ${legacy.relationshipMilestones.length} relationship milestones, and ${legacy.wealthPassedDown} in wealth passed down.`;
}
