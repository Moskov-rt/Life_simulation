import { describe, expect, it } from 'vitest';
import { EVENTS_POOL } from '../events';
import { resolveNarrativeVariant } from '../utils/narrativeVariants';
import { GameState, NPC, OutcomeEffect } from '../types';

const state = (): GameState => ({
  name: 'Actor', gender: 'Other', avatar: '', location: 'Tokyo, Japan', age: 30, alive: true, deathReason: '', cash: 20_000,
  stats: { health: 80, smarts: 70, looks: 80, happiness: 80, style: 60, status: 50 }, reputation: { family: 60, college: 50, online: 65, workplace: 60, dating: 50 }, fame: 60,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
  career: { type: 'job', title: 'Star', track: 'actor', salary: 500_000, performance: 70, yearsInRole: 4, tier: 4 }, karma: 50, willpower: 50,
  currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 99
});

const colleague: NPC = {
  id: 'colleague', name: 'Sam', relation: 'colleague', archetype: 'mentor', age: 35, gender: 'Other', occupation: 'Actor', trust: 75, suspicion: 10, resentment: 5,
  orientation: 'bisexual', nationality: 'Unknown', education: 'Unknown', income: 0, traits: {} as NPC['traits'], lifeState: {} as NPC['lifeState'], goals: [], memories: [], lifestyle: {} as NPC['lifestyle'], npcRelations: {}, personality: [],
  vectors: { trust: 50, suspicion: 10, knowledge: 40, resentment: 5, forgiveness: 10 }, memoryFlags: [], interactionHistory: []
};

describe('major event narrative migration', () => {
  it('keeps migrated event IDs, effects, and choices intact while attaching variants', () => {
    const promotion = EVENTS_POOL.find(event => event.id === 'career_promotion_rivalry')!;
    const award = EVENTS_POOL.find(event => event.id === 'actor_award_season')!;
    const illness = EVENTS_POOL.find(event => event.id === 'gdd_chain_9_sick')!;

    expect(promotion.choices.map(choice => choice.id)).toEqual(['promo_work', 'promo_network', 'promo_sabotage']);
    expect(promotion.choices[0].effect?.statChanges).toEqual({ status: 20, happiness: 5, willpower: 20 });
    expect(award.choices[0].effect?.flagsSet).toMatchObject({ actor_award_season_resolved: true, actorAwardEligiblePending: false });
    expect(illness.choices[1].effect?.statChanges).toEqual({ health: -30 });
    [promotion, award, illness].flatMap(event => event.choices).forEach(choice => expect(choice.effect?.narrativeVariants).toBeDefined());
  });

  it('selects the same migrated variant from the same seeded context', () => {
    const effect = EVENTS_POOL.find(event => event.id === 'actor_scandal')!.choices[0].effect as OutcomeEffect;
    expect(resolveNarrativeVariant(effect, undefined, state(), colleague)).toEqual(resolveNarrativeVariant(effect, undefined, state(), colleague));
  });
});
