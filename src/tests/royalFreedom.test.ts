import { describe, expect, it } from 'vitest';
import { EVENTS_POOL } from '../events';
import { GameState } from '../types';
import { abdicateRoyalty } from '../utils/royalSuccession';
import { getRoyalPrivileges } from '../utils/royalPrivileges';
import { migrateGameState } from '../utils/saveMigration';

const royalState = (): GameState => ({
  name: 'Monarch', gender: 'Female', avatar: '', location: 'London, United Kingdom', age: 30, alive: true, deathReason: '', cash: 1000,
  origin: { id: 'royal_family', country: 'United Kingdom', status: 'royal', publicAttention: 80 }, royalSuccession: { rank: 'monarch', inheritanceEligible: true, regencyActive: false }, royalLifestyle: { active: true, yearlyActions: { education: 0, familyTime: 0, ignoreLessons: 0, publicAppearance: 0, privateFriendship: 0, rebellion: 0, relationshipChoice: 0, charity: 0, diplomacy: 0, ceremony: 0, speech: 0, publicService: 0, freedom: 0 } }, royalAuthority: 80, publicApproval: 70, personalFreedom: 20,
  familyWealth: 2500000, allowance: 5000, stats: { health: 80, smarts: 80, looks: 70, happiness: 60, style: 50, status: 70 }, reputation: { family: 80, college: 50, online: 60, workplace: 50, dating: 50 }, fame: 80,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [], career: { type: 'unemployed', title: 'Monarch', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50, currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 4
});

describe('royal privilege, restrictions, and freedom', () => {
  it('exposes rank-based privileges and removes them after abdication', () => {
    const state = royalState();
    expect(getRoyalPrivileges(state).highestAuthorityActions).toBe(true);
    expect(abdicateRoyalty(state)).toBe(true);
    expect(state.royalSuccession?.rank).toBe('former_monarch');
    expect(state.royalLifestyle?.active).toBe(false);
    expect(state.personalFreedom).toBe(100);
    expect(state.royalAuthority).toBe(0);
    expect(getRoyalPrivileges(state).royalActivities).toBe(false);
    expect(state.fame).toBe(80);
  });

  it('keeps royal restrictions in event conditions while commoners remain excluded', () => {
    const abdication = EVENTS_POOL.find(event => event.id === 'royal_abdication');
    expect(abdication?.conditions?.customCheck?.(royalState())).toBe(true);
    expect(abdication?.conditions?.customCheck?.({ ...royalState(), origin: { id: 'commoner', country: 'United Kingdom', status: 'commoner', publicAttention: 0 } })).toBe(false);
    const reaction = EVENTS_POOL.find(event => event.id === 'royal_relationship_scandal');
    expect(reaction?.choices.some(choice => choice.effect?.personalFreedomChange !== undefined)).toBe(true);
  });

  it('migrates personal freedom without granting royal privileges to commoners', () => {
    const royal = migrateGameState({ location: 'London, United Kingdom', origin: royalState().origin, npcs: {}, relationships: [] });
    const commoner = migrateGameState({ location: 'New York, United States', npcs: {}, relationships: [] });
    expect(royal.personalFreedom).toBe(45);
    expect(commoner.personalFreedom).toBe(100);
    expect(getRoyalPrivileges(commoner).royalActivities).toBe(false);
  });
});
