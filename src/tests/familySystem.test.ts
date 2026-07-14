import { describe, expect, it } from 'vitest';
import { GameState } from '../types';
import { addChildToFamily, applyParentingChoice, generateChildNPC, processFamilyInheritance, summarizeFamilyLegacy } from '../utils/familySystem';
import { getFamilyAdvantages } from '../utils/familyAdvantages';
import { relationshipToNPC, migrateGameState } from '../utils/saveMigration';

const parent = (id: string, personality: string[]) => relationshipToNPC({ id, name: id, relation: 'parent', archetype: 'mentor', age: 40, gender: 'Other', occupation: 'Teacher', trust: 80, suspicion: 0, resentment: 0, personality, traits: { confidence: 70, kindness: 60, intelligence: 80, ambition: 50, greed: 20, honesty: 70, loyalty: 80, jealousy: 20, patience: 60, romanticInterest: 40, aggressiveness: 20, humor: 50, responsibility: 70, emotionalStability: 60, generosity: 65, riskTaking: 40 } });

const state = (): GameState => ({
  name: 'Parent', gender: 'Other', avatar: '', location: 'London, United Kingdom', age: 45, alive: true, deathReason: '', cash: 1000, origin: { id: 'royal_family', country: 'United Kingdom', status: 'royal', publicAttention: 50 }, stats: { health: 80, smarts: 70, looks: 70, happiness: 70, style: 50, status: 50 }, reputation: { family: 70, college: 50, online: 50, workplace: 50, dating: 50 }, fame: 20, npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [], career: { type: 'unemployed', title: 'Parent', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50, currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 8
});

describe('family and dynasty system', () => {
  it('generates deterministic children with inherited traits and varied personality', () => {
    const parents = [parent('mother', ['supportive', 'curious']), parent('father', ['cautious', 'ambitious'])];
    const first = generateChildNPC(parents, { id: 'child', name: 'Child', seed: 33, parentStats: { looks: 80, smarts: 90 } });
    const second = generateChildNPC(parents, { id: 'child', name: 'Child', seed: 33, parentStats: { looks: 80, smarts: 90 } });
    expect(first).toEqual(second);
    expect(first.child.relation).toBe('child');
    expect(first.child.traits.intelligence).toBeGreaterThan(50);
    expect(first.child.lifeState.health).toBeGreaterThan(50);
    expect(first.child.personality).toEqual(expect.arrayContaining(['supportive']));
  });

  it('applies parenting styles to trust, traits, and permanent memories', () => {
    const child = generateChildNPC([parent('a', ['cautious']), parent('b', ['supportive'])], { id: 'child', name: 'Child', seed: 2 }).child;
    const supported = applyParentingChoice(child, 'supportive', 12);
    const neglected = applyParentingChoice(child, 'neglectful', 12);
    expect(supported.trust).toBeGreaterThan(child.trust);
    expect(neglected.trust).toBeLessThan(child.trust);
    expect(neglected.memories.at(-1)?.permanent).toBe(true);
  });

  it('processes family inheritance and preserves it through migration', () => {
    const game = state();
    const deceased = parent('grandparent', ['traditional']);
    deceased.relation = 'grandparent';
    deceased.isDeceased = true;
    deceased.lifestyle.netWorth = 12000;
    deceased.lifestyle.savings = 3000;
    deceased.lifestyle.home = 'Family Estate';
    deceased.lifestyle.car = 'Classic Sedan';
    const amount = processFamilyInheritance(game, deceased);
    expect(amount).toBe(15000);
    expect(game.cash).toBe(16000);
    expect(game.familyInheritance).toBe(15000);
    expect(game.familyAssets).toEqual(expect.arrayContaining(['Family Estate', 'Classic Sedan']));
    const migrated = migrateGameState({ location: 'London, United Kingdom', npcs: {}, relationships: [] });
    expect(migrated.familyInheritance).toBe(0);
  });

  it('persists children in the NPC collection and exposes family advantages', () => {
    const game = state();
    const child = generateChildNPC([parent('a', ['supportive']), parent('b', ['ambitious'])], { id: 'child', name: 'Child', seed: 9 }).child;
    addChildToFamily(game, child);
    expect(game.npcs.child.relation).toBe('child');
    const advantages = getFamilyAdvantages(game);
    expect(advantages.opportunities).toContain('royal introductions');
    expect(summarizeFamilyLegacy(game)).toContain('Family legacy');
  });
});
