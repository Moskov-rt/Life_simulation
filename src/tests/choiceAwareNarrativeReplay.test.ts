import { describe, expect, it } from 'vitest';
import { EVENTS_POOL } from '../events';
import { Choice, GameState, NPC } from '../types';
import { applyChoiceResultToNPC, resolveChoice } from '../utils/choiceResolver';
import { applyYearlyDrift } from '../utils/relationshipVectors';
import { relationshipToNPC } from '../utils/saveMigration';

const event = (id: string) => EVENTS_POOL.find(candidate => candidate.id === id)!;
const choice = (eventId: string, choiceId: string) => event(eventId).choices.find(candidate => candidate.id === choiceId)!;

function applyChoiceToState(state: GameState, selectedChoice: Choice, target?: NPC): GameState {
  const next = structuredClone(state);
  const effect = selectedChoice.effect!;
  Object.assign(next.flags, effect.flagsSet || {});
  effect.flagsRemove?.forEach(flag => delete next.flags[flag]);
  if (effect.scheduleDelayedEvent) next.delayedEvents.push({ eventId: effect.scheduleDelayedEvent.eventId, triggerAge: next.age + effect.scheduleDelayedEvent.delayYears });
  if (effect.repChanges) for (const [key, delta] of Object.entries(effect.repChanges)) next.reputation[key as keyof typeof next.reputation] = Math.max(0, Math.min(100, next.reputation[key as keyof typeof next.reputation] + (delta || 0)));
  if (target) {
    const result = resolveChoice(selectedChoice, target, next.age);
    next.npcs[target.id] = applyChoiceResultToNPC(target, result);
    next.relationships = Object.values(next.npcs);
  }
  return next;
}

const baseState = (): GameState => ({
  name: 'Narrative Replay', gender: 'Other', avatar: '', location: 'Tokyo, Japan', age: 30, alive: true, deathReason: '', cash: 0,
  stats: { health: 80, smarts: 70, looks: 80, happiness: 80, style: 60, status: 50 },
  reputation: { family: 50, college: 50, online: 30, workplace: 50, dating: 50 }, fame: 50,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
  career: { type: 'job', title: 'Creator', salary: 0, performance: 60, yearsInRole: 2 }, karma: 50, willpower: 50,
  currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 42
});

describe('Choice-aware narrative replay audit', () => {
  it.each([
    ['creator_family_discovers_account', 'creator_family_confess', 'parent', 'honest_account_disclosure'],
    ['creator_partner_conflict', 'creator_partner_confess', 'partner', 'creator_boundary_agreement'],
    ['actor_scandal', 'actor_scandal_joint', 'colleague', null]
  ])('propagates %s to the correct NPC and persists its vectors', (eventId, choiceId, relation, memoryType) => {
    const state = baseState();
    const target = relationshipToNPC({ id: relation, name: relation, relation: relation as any, age: 32 });
    const untouched = relationshipToNPC({ id: 'untouched', name: 'Untouched Friend', relation: 'friend', age: 31 });
    state.npcs = { [target.id]: target, [untouched.id]: untouched };
    state.relationships = Object.values(state.npcs);
    const result = applyChoiceToState(state, choice(eventId, choiceId), target);
    const updated = result.npcs[target.id];
    expect(updated.vectors.knowledge).toBeGreaterThan(target.vectors.knowledge);
    expect(updated.vectors.trust).not.toBe(target.vectors.trust);
    expect(result.npcs[untouched.id]).toEqual(untouched);
    if (memoryType) expect(updated.memories.at(-1)?.type).toBe(memoryType);
    const reloaded = JSON.parse(JSON.stringify(result)) as GameState;
    expect(reloaded.npcs[target.id]).toEqual(updated);
    applyYearlyDrift(reloaded.npcs[target.id], 'truth');
    expect(reloaded.npcs[target.id].vectors.knowledge).toBe(updated.vectors.knowledge);
  });

  it('supports friend vector and memory propagation even though no fame event currently targets friends', () => {
    const friend = relationshipToNPC({ id: 'friend', name: 'Friend', relation: 'friend', age: 30 });
    const synthetic: Choice = { id: 'friend_confess', text: 'Tell the truth', effect: { relationshipChanges: { target: 'current', trust: 6, suspicion: -4, resentment: -2, knowledge: 20 }, memory: { type: 'friend_disclosure', intensity: 40, emotionalValue: 20, decayRate: 2, permanent: false }, outcomeText: 'You tell your friend.' } };
    const updated = applyChoiceResultToNPC(friend, resolveChoice(synthetic, friend, 30));
    expect(updated.vectors.knowledge).toBe(20);
    expect(updated.memories.at(-1)?.targetId).toBe(friend.id);
    expect(EVENTS_POOL.some(candidate => candidate.id.startsWith('actor_') || candidate.id.startsWith('adult_performer_') || candidate.id.startsWith('creator_') ? candidate.involvedRelationshipType === 'friend' || candidate.conditions?.hasRelationshipType === 'friend' : false)).toBe(false);
  });

  it('commits creator viral, collaboration, and sponsor milestone flags and scheduling', () => {
    let state = baseState();
    state = applyChoiceToState(state, choice('creator_first_viral_post', 'creator_viral_engage'));
    expect(state.flags.creator_first_viral_post).toBe(true);
    expect(state.reputation.online).toBe(40);
    state = applyChoiceToState(state, choice('creator_collaboration_offer', 'creator_collaboration_accept'));
    expect(state.flags.creator_collaboration_offer_resolved).toBe(true);
    expect(state.flags.creator_collaboration_accepted).toBe(true);
    expect(state.delayedEvents).toContainEqual({ eventId: 'creator_sponsor_offer', triggerAge: 31 });
    state = applyChoiceToState(state, choice('creator_sponsor_offer', 'creator_sponsor_accept'));
    expect(state.flags.creator_sponsor_offer_resolved).toBe(true);
    expect(state.reputation.online).toBe(45);
  });
});
