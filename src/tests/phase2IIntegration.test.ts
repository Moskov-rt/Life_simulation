import { describe, expect, it } from 'vitest';
import { relationshipTargetIds } from '../App';
import { EVENTS_POOL } from '../events';
import { EXPOSURE_EVENTS } from '../utils/exposureEvents';
import { applyChoiceResultToNPC, resolveChoice } from '../utils/choiceResolver';
import { runYearlySimulation } from '../utils/ageUpSimulator';
import { relationshipToNPC } from '../utils/saveMigration';
import { GameState } from '../types';

const illness = { id: 'test', name: 'Test Cold', description: '', type: 'minor' as const, curable: true, healthImpactPerYear: 0, happinessImpactPerYear: 0, cureCost: 0, minDuration: 1, maxDuration: 1, baseCureChance: 1 };
const context = { INFANT_ILLNESSES: [illness], MINOR_ILLNESSES: [illness], CHRONIC_ILLNESSES: [{ ...illness, type: 'chronic' as const }], TERMINAL_ILLNESSES: [{ ...illness, type: 'terminal' as const }] };
const baseState = (seed = 123): GameState => ({
  name: 'Phase 2I', gender: 'Other', avatar: '', location: 'Tokyo, Japan', age: 20, alive: true, deathReason: '', cash: 0,
  stats: { health: 80, smarts: 70, looks: 80, happiness: 80, style: 60, status: 50 }, reputation: { family: 50, college: 50, online: 30, workplace: 50, dating: 50 }, fame: 0,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
  career: { type: 'unemployed', title: 'Unemployed', salary: 0, performance: 0, yearsInRole: 0 }, karma: 50, willpower: 50,
  currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: seed
});

describe('Phase 2I integration polish', () => {
  it('routes current, all, and explicit relationship targets and creates per-NPC memories', () => {
    const parent = relationshipToNPC({ id: 'parent', name: 'Parent', relation: 'parent' });
    const friend = relationshipToNPC({ id: 'friend', name: 'Friend', relation: 'friend' });
    const deceased = relationshipToNPC({ id: 'deceased', name: 'Deceased', relation: 'parent', isDeceased: true });
    const npcs = [parent, friend, deceased];
    expect(relationshipTargetIds(npcs, 'current', friend.id)).toEqual([friend.id]);
    expect(relationshipTargetIds(npcs, parent.id, friend.id)).toEqual([parent.id]);
    const allIds = relationshipTargetIds(npcs, 'all', friend.id);
    expect(allIds).toEqual([parent.id, friend.id]);
    const allChoice = { id: 'all_disclosure', text: 'Tell everyone', effect: { relationshipChanges: { target: 'all' as const, trust: -5, knowledge: 25 }, memory: { type: 'shared_disclosure', intensity: 50, emotionalValue: -10, decayRate: 2, permanent: false }, outcomeText: 'Everyone learns the truth.' } };
    const updated = Object.fromEntries(npcs.map(npc => [npc.id, allIds.includes(npc.id) ? applyChoiceResultToNPC(npc, resolveChoice(allChoice, npc, 21)) : npc]));
    expect(updated.parent.vectors.knowledge).toBe(25);
    expect(updated.friend.vectors.knowledge).toBe(25);
    expect(updated.parent.memories.at(-1)?.targetId).toBe(parent.id);
    expect(updated.friend.memories.at(-1)?.targetId).toBe(friend.id);
    expect(updated.deceased).toEqual(deceased);
  });

  it('executes a due delayed event once at the correct age without changing replay determinism', () => {
    const state = baseState(456);
    state.delayedEvents = [{ eventId: 'creator_sponsor_offer', triggerAge: 21 }];
    const first = runYearlySimulation(state, context);
    const replay = runYearlySimulation(state, context);
    expect(first.updatedState).toEqual(replay.updatedState);
    expect(first.triggeredEvent?.id).toBe('creator_sponsor_offer');
    expect(first.updatedState.delayedEvents).toEqual([]);
    const second = runYearlySimulation(first.updatedState, context);
    expect(second.triggeredEvent?.id).not.toBe('creator_sponsor_offer');
  });

  it('assigns a family NPC context to an exposure event and applies its memory and vectors', () => {
    let exposureResult: ReturnType<typeof runYearlySimulation> | undefined;
    for (let seed = 1; seed <= 1000 && !exposureResult; seed += 1) {
      const state = baseState(seed);
      const parent = relationshipToNPC({ id: 'parent', name: 'Parent', relation: 'parent' });
      state.npcs = { parent };
      state.relationships = [parent];
      state.secretExposure = { isActive: true, level: 100, heat: 100, history: [], ignoredCount: {}, npcAwareness: {}, recentChanges: { posts: 0, collabs: 0, mitigation: 0, locationMultiplier: 1, luck: 0 } };
      const candidate = runYearlySimulation(state, context);
      if (candidate.triggeredEvent?.id === 'whisper') exposureResult = candidate;
    }
    expect(exposureResult?.updatedState.activeRelationshipContextId).toBe('parent');
    const parent = exposureResult!.updatedState.npcs.parent;
    const selected = EXPOSURE_EVENTS.find(event => event.id === 'whisper')!.choices[0];
    const updated = applyChoiceResultToNPC(parent, resolveChoice(selected, parent, exposureResult!.updatedState.age));
    expect(updated.vectors.suspicion).toBeGreaterThan(parent.vectors.suspicion);
    expect(updated.memories.at(-1)?.type).toBe('exposure_rumor_ignored');
  });

  it('keeps Award Season eligible after the qualifying year and clears it on resolution', () => {
    const award = EVENTS_POOL.find(event => event.id === 'actor_award_season')!;
    const state = baseState();
    state.flags.actorAwardEligiblePending = true;
    state.career = { type: 'job', title: 'Lead Actor', salary: 150_000, performance: 35, yearsInRole: 3, tier: 3, track: 'actor' };
    state.actorCareer = { active: true, consistency: 30, yearlyActions: { auditionCount: 0, rolesAccepted: 0, networkCount: 0, promoteCount: 0, trainCount: 0, restCount: 1 } };
    expect(award.conditions?.customCheck?.(state)).toBe(true);
    expect(award.choices[0].effect?.flagsSet?.actorAwardEligiblePending).toBe(false);
  });

  it('lets a proven inactive fame career survive longer than a weak one', () => {
    const failureYear = (tier: number, consistency: number, yearsInRole: number) => {
      let state = baseState(789);
      state.career = { type: 'job', title: tier >= 3 ? 'Lead Actor' : 'Extra', salary: 15_000, performance: 50, yearsInRole, tier, track: 'actor' };
      state.actorCareer = { active: true, consistency, yearlyActions: { auditionCount: 0, rolesAccepted: 0, networkCount: 0, promoteCount: 0, trainCount: 0, restCount: 0 } };
      let elapsed = 0;
      while (state.career.type === 'job' && elapsed < 30) { state = runYearlySimulation(state, context).updatedState; elapsed += 1; }
      return elapsed;
    };
    expect(failureYear(4, 90, 8)).toBeGreaterThan(failureYear(1, 0, 0));
  });
});
