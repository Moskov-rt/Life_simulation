import { describe, expect, it } from 'vitest';
import { EVENTS_POOL } from '../events';
import { migrateGameState } from '../utils/saveMigration';
import { recordRoyalLegacy, summarizeRoyalLegacy } from '../utils/royalLegacy';
import { resolveRoyalSuccession } from '../utils/royalSuccession';
import { GameState } from '../types';
import { relationshipToNPC } from '../utils/saveMigration';

const royalState = (): GameState => {
  const monarch = relationshipToNPC({ id: 'royal_father', name: 'King', relation: 'parent', archetype: 'mentor', age: 60, gender: 'Male', occupation: 'Head of State', trust: 80, suspicion: 0, resentment: 0 });
  return {
    name: 'Heir', gender: 'Female', avatar: '', location: 'London, United Kingdom', age: 25, alive: true, deathReason: '', cash: 1000,
    origin: { id: 'royal_family', country: 'United Kingdom', status: 'royal', publicAttention: 80 }, royalAuthority: 70, publicApproval: 10, personalFreedom: 50,
    royalSuccession: { rank: 'heir', inheritanceEligible: true, regencyActive: false }, royalLegacy: { achievements: [], reforms: [], scandals: [], relationshipMilestones: [], approvalSnapshots: [10] },
    npcs: { [monarch.id]: monarch }, relationships: [monarch], familyWealth: 1000000, allowance: 1000, stats: { health: 80, smarts: 70, looks: 70, happiness: 70, style: 50, status: 50 }, reputation: { family: 10, college: 50, online: 50, workplace: 50, dating: 50 }, fame: 20,
    illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [], career: { type: 'unemployed', title: 'Heir', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50, currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 22
  };
};

describe('royal influence and legacy', () => {
  it('records achievements, reforms, and approval snapshots', () => {
    const state = royalState();
    recordRoyalLegacy(state, 'achievement', 'public_service');
    recordRoyalLegacy(state, 'reform', 'modernization');
    expect(state.royalLegacy?.achievements).toContain('public_service');
    expect(state.royalLegacy?.reforms).toContain('modernization');
    expect(state.royalLegacy?.approvalSnapshots).toHaveLength(3);
    expect(summarizeRoyalLegacy(state)).toContain('Reforms: 1');
  });

  it('makes succession sensitive to severe reputation and approval', () => {
    const state = royalState();
    state.npcs.royal_father.isDeceased = true;
    const result = resolveRoyalSuccession(state, 'royal_father', 22);
    expect(result.changed).toBe(true);
    expect(state.royalSuccession?.successionDisputed).toBe(true);
    expect(state.royalAuthority).toBe(35);
  });

  it('registers international royal events and migrates legacy state', () => {
    expect(EVENTS_POOL.find(event => event.id === 'royal_foreign_visit')).toBeDefined();
    expect(EVENTS_POOL.find(event => event.id === 'royal_wedding_diplomacy')).toBeDefined();
    const migrated = migrateGameState({ location: 'London, United Kingdom', origin: royalState().origin, npcs: {}, relationships: [] });
    expect(migrated.royalLegacy?.approvalSnapshots).toEqual([50]);
  });
});
