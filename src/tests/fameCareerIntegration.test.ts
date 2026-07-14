import { describe, expect, it } from 'vitest';
import { EVENTS_POOL } from '../events';
import { emptyAdultPerformerActions, isAdultPerformerJob } from '../App';
import { GameState } from '../types';
import { runYearlySimulation } from '../utils/ageUpSimulator';

const illness = { id: 'test', name: 'Test Cold', description: '', type: 'minor' as const, curable: true, healthImpactPerYear: 0, happinessImpactPerYear: 0, cureCost: 0, minDuration: 1, maxDuration: 1, baseCureChance: 1 };
const context = { INFANT_ILLNESSES: [illness], MINOR_ILLNESSES: [illness], CHRONIC_ILLNESSES: [{ ...illness, type: 'chronic' as const }], TERMINAL_ILLNESSES: [{ ...illness, type: 'terminal' as const }] };

const baseState = (seed = 123): GameState => ({
  name: 'Test', gender: 'Other', avatar: '', location: 'Tokyo, Japan', age: 20, alive: true, deathReason: '', cash: 0,
  stats: { health: 80, smarts: 70, looks: 80, happiness: 80, style: 60, status: 50 },
  reputation: { family: 50, college: 50, online: 30, workplace: 50, dating: 50 }, fame: 0,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
  career: { type: 'unemployed', title: 'Unemployed', salary: 0, performance: 0, yearsInRole: 0 }, karma: 50, willpower: 50,
  currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: seed
});

describe('Fame career integration fixes', () => {
  it('recognizes an Adult Performer job and resolves its selected yearly actions', () => {
    expect(isAdultPerformerJob({ title: 'Adult Film Extra' })).toBe(true);
    const state = baseState();
    state.career = { type: 'job', title: 'Adult Film Extra', salary: 40_000, performance: 50, yearsInRole: 0, tier: 1, track: 'adult_performer' };
    state.adultPerformerCareer = { active: true, consistency: 0, yearlyActions: { ...emptyAdultPerformerActions(), performCount: 1, skillCount: 1 } };
    const simulation = runYearlySimulation(state, context);
    expect(simulation.updatedState.fame).toBe(3);
    expect(simulation.newLogs.some(log => log.includes('performance +5'))).toBe(true);
    expect(simulation.updatedState.adultPerformerCareer?.yearlyActions).toEqual(emptyAdultPerformerActions());
  });

  it('preserves first-audition and award eligibility across promotion/reset ordering', () => {
    const auditionState = baseState();
    auditionState.career = { type: 'job', title: 'Extra', salary: 15_000, performance: 90, yearsInRole: 0, tier: 1, track: 'actor' };
    auditionState.flags.actorCareerStartAge = auditionState.age;
    auditionState.actorCareer = { active: true, consistency: 0, yearlyActions: { auditionCount: 2, rolesAccepted: 2, networkCount: 1, promoteCount: 1, trainCount: 1, restCount: 0 } };
    const auditionResult = runYearlySimulation(auditionState, context).updatedState;
    const auditionEvent = EVENTS_POOL.find(event => event.id === 'actor_first_audition')!;
    expect(auditionResult.career.tier).toBeGreaterThan(1);
    expect(auditionEvent.conditions?.customCheck?.(auditionResult)).toBe(true);

    const awardState = baseState(456);
    awardState.fame = 44;
    awardState.career = { type: 'job', title: 'Lead Actor', salary: 150_000, performance: 70, yearsInRole: 1, tier: 3, track: 'actor' };
    awardState.actorCareer = { active: true, consistency: 40, yearlyActions: { auditionCount: 0, rolesAccepted: 1, networkCount: 0, promoteCount: 0, trainCount: 0, restCount: 0 } };
    const awardResult = runYearlySimulation(awardState, context).updatedState;
    const awardEvent = EVENTS_POOL.find(event => event.id === 'actor_award_season')!;
    expect(awardEvent.conditions?.customCheck?.(awardResult)).toBe(true);
  });

  it('eventually fires an inactive fame-career character through the existing flow', () => {
    let state = baseState();
    state.career = { type: 'job', title: 'Extra', salary: 15_000, performance: 50, yearsInRole: 0, tier: 1, track: 'actor' };
    state.actorCareer = { active: true, consistency: 20, yearlyActions: { auditionCount: 0, rolesAccepted: 0, networkCount: 0, promoteCount: 0, trainCount: 0, restCount: 0 } };
    for (let year = 0; year < 10 && state.career.type === 'job'; year += 1) state = runYearlySimulation(state, context).updatedState;
    expect(state.career.type).toBe('unemployed');
    expect(state.actorCareer?.active).toBe(false);
  });

  it('does not grow exposure when there is no relevant activity', () => {
    const state = baseState();
    state.secretExposure = { isActive: true, level: 40, heat: 0, history: [], ignoredCount: {}, npcAwareness: {}, recentChanges: { posts: 0, collabs: 0, mitigation: 0, locationMultiplier: 1, luck: 0 } };
    const result = runYearlySimulation(state, context).updatedState;
    expect(result.secretExposure?.level).toBe(40);
  });

  it('replays the same fame-career year deterministically', () => {
    const state = baseState(9876);
    state.career = { type: 'job', title: 'Extra', salary: 15_000, performance: 50, yearsInRole: 0, tier: 1, track: 'actor' };
    state.actorCareer = { active: true, consistency: 0, yearlyActions: { auditionCount: 1, rolesAccepted: 1, networkCount: 1, promoteCount: 0, trainCount: 1, restCount: 0 } };
    expect(runYearlySimulation(state, context).updatedState).toEqual(runYearlySimulation(state, context).updatedState);
  });
});
