import { describe, expect, it } from 'vitest';
import { GameState } from '../types';
import { relationshipToNPC, migrateGameState } from '../utils/saveMigration';
import { resolveRoyalSuccession, resolveRegencyComingOfAge, ensureRoyalSuccession } from '../utils/royalSuccession';

const state = (age = 12): GameState => {
  const monarch = relationshipToNPC({ id: 'royal_father', name: 'King Father', relation: 'parent', archetype: 'mentor', age: 50, gender: 'Male', occupation: 'Head of State', trust: 85, suspicion: 0, resentment: 0 });
  const advisor = relationshipToNPC({ id: 'royal_advisor', name: 'Royal Advisor', relation: 'mentor', archetype: 'mentor', age: 55, gender: 'Male', occupation: 'Privy Advisor', trust: 90, suspicion: 0, resentment: 0, traits: { ...monarch.traits, loyalty: 95 }, personality: ['loyal', 'supportive'] });
  return {
    name: 'Young Heir', gender: 'Female', avatar: '', location: 'London, United Kingdom', age, alive: true, deathReason: '', cash: 1000,
    origin: { id: 'royal_family', country: 'United Kingdom', status: 'royal', successionPosition: 'heir', publicAttention: 90 },
    royalSuccession: { rank: 'heir', inheritanceEligible: true, regencyActive: false }, royalLifestyle: { active: true, yearlyActions: { education: 0, familyTime: 0, ignoreLessons: 0, publicAppearance: 0, privateFriendship: 0, rebellion: 0, relationshipChoice: 0, charity: 0, diplomacy: 0, ceremony: 0, speech: 0, publicService: 0, freedom: 0 } },
    familyWealth: 2500000, allowance: 5000, publicApproval: 65, stats: { health: 80, smarts: 70, looks: 70, happiness: 70, style: 50, status: 50 }, reputation: { family: 80, college: 50, online: 60, workplace: 50, dating: 50 }, fame: 20,
    npcs: { [monarch.id]: monarch, [advisor.id]: advisor }, relationships: [monarch, advisor], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [], career: { type: 'school', title: 'Student', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50, currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 17
  };
};

describe('royal succession lifecycle', () => {
  it('makes the eligible heir monarch and creates a regency for a child', () => {
    const game = state(12);
    game.npcs.royal_father.isDeceased = true;
    const result = resolveRoyalSuccession(game, 'royal_father', 17);
    expect(result.changed).toBe(true);
    expect(game.royalSuccession?.rank).toBe('monarch');
    expect(game.royalSuccession?.regencyActive).toBe(true);
    expect(game.royalSuccession?.regentId).toBe('royal_advisor');
    expect(game.npcs.royal_advisor.memories.some(memory => memory.type === 'royal_regency')).toBe(true);
  });

  it('ends regency at adulthood and is deterministic', () => {
    const first = state(20);
    first.royalSuccession = { rank: 'monarch', inheritanceEligible: true, regencyActive: true, regentId: 'royal_advisor' };
    const second = structuredClone(first);
    expect(resolveRegencyComingOfAge(first)).toBe(true);
    expect(resolveRegencyComingOfAge(second)).toBe(true);
    expect(first.royalSuccession).toEqual(second.royalSuccession);
    expect(first.flags.royal_regency_ended).toBe(true);
  });

  it('migrates royal rank state without affecting commoner saves', () => {
    const royal = migrateGameState({ location: 'London, United Kingdom', origin: state().origin, npcs: {}, relationships: [], age: 12 });
    ensureRoyalSuccession(royal);
    expect(royal.royalSuccession?.rank).toBe('royal_child');
    const commoner = migrateGameState({ location: 'New York, United States', npcs: {}, relationships: [], age: 20 });
    expect(commoner.royalSuccession).toBeUndefined();
  });
});
