import { describe, expect, it } from 'vitest';
import { EVENTS_POOL } from '../events';
import { GameState } from '../types';
import { resolveNarrativeVariant } from '../utils/narrativeVariants';
import { migrateGameState } from '../utils/saveMigration';

const state = (authority: number): GameState => ({
  name: 'Monarch', gender: 'Female', avatar: '', location: 'London, United Kingdom', age: 30, alive: true, deathReason: '', cash: 5000,
  origin: { id: 'royal_family', country: 'United Kingdom', status: 'royal', publicAttention: 80 }, royalAuthority: authority, publicApproval: 60,
  stats: { health: 80, smarts: 80, looks: 70, happiness: 70, style: 50, status: 70 }, reputation: { family: 80, college: 50, online: 60, workplace: 50, dating: 50 }, fame: 50,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [], career: { type: 'unemployed', title: 'Monarch', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50,
  currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 9,
  royalSuccession: { rank: 'monarch', inheritanceEligible: true, regencyActive: false }, royalLifestyle: { active: true, yearlyActions: { education: 0, familyTime: 0, ignoreLessons: 0, publicAppearance: 0, privateFriendship: 0, rebellion: 0, relationshipChoice: 0, charity: 0, diplomacy: 0, ceremony: 0, speech: 0, publicService: 0, freedom: 0 } }
});

describe('royal governance authority', () => {
  it('exposes royal governance choices through the existing event pool', () => {
    const event = EVENTS_POOL.find(candidate => candidate.id === 'royal_governance_choice');
    expect(event).toBeDefined();
    expect(event!.conditions?.customCheck?.(state(60))).toBe(true);
    expect(event!.conditions?.customCheck?.({ ...state(60), origin: { id: 'commoner', country: 'United Kingdom', status: 'commoner', publicAttention: 0 } })).toBe(false);
  });

  it('selects authority-aware narrative variants deterministically', () => {
    const effect = EVENTS_POOL.find(event => event.id === 'royal_governance_choice')!.choices[1].effect!;
    const low = resolveNarrativeVariant(effect, undefined, state(30));
    const high = resolveNarrativeVariant(effect, undefined, state(70));
    expect(low.selected).toBe(true);
    expect(high.selected).toBe(true);
    expect(low.text).not.toBe(high.text);
    expect(resolveNarrativeVariant(effect, undefined, state(70))).toEqual(high);
  });

  it('migrates authority for royal and commoner saves', () => {
    expect(migrateGameState({ location: 'London, United Kingdom', origin: state(60).origin, npcs: {}, relationships: [] }).royalAuthority).toBe(35);
    expect(migrateGameState({ location: 'New York, United States', npcs: {}, relationships: [] }).royalAuthority).toBe(0);
  });
});
