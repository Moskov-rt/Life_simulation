import { describe, expect, it } from 'vitest';
import { GameState } from '../types';
import { runYearlySimulation } from '../utils/ageUpSimulator';
import { relationshipToNPC, migrateGameState } from '../utils/saveMigration';
import { emptyRoyalActions } from '../App';

const base = (royal: boolean): GameState => {
  const parent = relationshipToNPC({ id: 'royal_mother', name: 'Queen Mother', relation: 'parent', archetype: 'mentor', age: 40, gender: 'Female', occupation: 'Royal Family', trust: 80, suspicion: 0, resentment: 0 });
  return {
    name: 'Test', gender: 'Female', avatar: '', location: 'London, United Kingdom', age: 20, alive: true, deathReason: '', cash: 1000,
    origin: royal ? { id: 'royal_family', country: 'United Kingdom', status: 'royal', successionPosition: 'heir', publicAttention: 90 } : { id: 'commoner', country: 'United Kingdom', status: 'commoner', publicAttention: 0 },
    familyWealth: royal ? 2500000 : 0, allowance: royal ? 5000 : 0, publicApproval: royal ? 60 : 50,
    stats: { health: 80, smarts: 70, looks: 70, happiness: 60, style: 50, status: 40 }, reputation: { family: 80, college: 50, online: 50, workplace: 50, dating: 50 }, fame: 10,
    npcs: { [parent.id]: parent }, relationships: [parent], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
    career: { type: 'unemployed', title: 'Unemployed', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50, currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 42,
    actorCareer: { active: false, consistency: 0, yearlyActions: { auditionCount: 0, rolesAccepted: 0, networkCount: 0, promoteCount: 0, trainCount: 0, restCount: 0 } }, adultPerformerCareer: { active: false, consistency: 0, yearlyActions: { performCount: 0, collaborationCount: 0, promotionCount: 0, networkingCount: 0, skillCount: 0, privacyCount: 0, restCount: 0 } },
    royalLifestyle: { active: royal, yearlyActions: emptyRoyalActions() }
  };
};

const context = { INFANT_ILLNESSES: [], MINOR_ILLNESSES: [], CHRONIC_ILLNESSES: [], TERMINAL_ILLNESSES: [] };

describe('royal lifestyle', () => {
  it('resolves yearly royal duty and freedom tradeoffs', () => {
    const state = base(true);
    state.royalLifestyle!.yearlyActions.charity = 1;
    state.royalLifestyle!.yearlyActions.freedom = 1;
    const result = runYearlySimulation(state, context);
    expect(result.updatedState.publicApproval).toBe(61);
    expect(result.updatedState.npcs.royal_mother.vectors.trust).toBe(59);
    expect(result.updatedState.royalLifestyle!.yearlyActions.charity).toBe(0);
    expect(result.updatedState.npcs.royal_mother.memories.some(memory => memory.type === 'royal_duty')).toBe(true);
  });

  it('leaves commoner yearly state unaffected by royal actions', () => {
    const state = base(false);
    const result = runYearlySimulation(state, context);
    expect(result.updatedState.publicApproval).toBe(50);
    expect(result.updatedState.npcs.royal_mother.trust).toBe(80);
  });

  it('migrates royal lifestyle state and preserves deterministic replay', () => {
    const state = base(true);
    const a = runYearlySimulation(state, context).updatedState;
    const b = runYearlySimulation(state, context).updatedState;
    expect(a).toEqual(b);
    const migrated = migrateGameState({ location: 'London, United Kingdom', origin: state.origin, npcs: {}, relationships: [] });
    expect(migrated.royalLifestyle?.active).toBe(true);
  });
});
