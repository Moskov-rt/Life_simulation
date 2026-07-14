import { describe, expect, it } from 'vitest';
import { GameState, OutcomeEffect } from '../types';
import { determineOutcomeTone, getCareerGroup, getRelationshipHistoryYears, getWealthBand, resolveNarrativeVariant } from '../utils/narrativeVariants';
import { nextRandom } from '../utils/seededRandom';
import { relationshipToNPC } from '../utils/saveMigration';

const state = (): GameState => ({
  name: 'Variant Test', gender: 'Other', avatar: '', location: 'Tokyo, Japan', age: 30, alive: true, deathReason: '', cash: 0,
  stats: { health: 80, smarts: 70, looks: 80, happiness: 80, style: 60, status: 50 }, reputation: { family: 50, college: 50, online: 60, workplace: 50, dating: 50 }, fame: 70,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
  career: { type: 'job', title: 'Star', salary: 500_000, performance: 70, yearsInRole: 3, tier: 4, track: 'actor' }, karma: 50, willpower: 50,
  currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 42
});

describe('Narrative variation layer', () => {
  it('keeps legacy outcome text and RNG unchanged when variants are absent', () => {
    const effect: OutcomeEffect = { statChanges: { happiness: 5 }, outcomeText: 'Legacy outcome.' };
    expect(resolveNarrativeVariant(effect, undefined, state())).toEqual({ text: 'Legacy outcome.', tone: 'positive', selected: false, nextSeed: 42 });
  });

  it('classifies positive, neutral, negative, and chaotic applied effects', () => {
    expect(determineOutcomeTone({ statChanges: { happiness: 8 }, outcomeText: '' })).toBe('positive');
    expect(determineOutcomeTone({ outcomeText: '' })).toBe('neutral');
    expect(determineOutcomeTone({ statChanges: { happiness: -8 }, outcomeText: '' })).toBe('negative');
    expect(determineOutcomeTone({ statChanges: { happiness: 8, health: -8 }, outcomeText: '' })).toBe('chaotic');
  });

  it('filters variants using age, career, fame, reputation, relationship, and NPC context', () => {
    const parent = relationshipToNPC({ id: 'parent', name: 'Parent', relation: 'parent', archetype: 'average', trust: 80, suspicion: 10 });
    const effect: OutcomeEffect = {
      statChanges: { happiness: 10 },
      outcomeText: 'Fallback.',
      narrativeVariants: { positive: [
        { text: 'Actor-family variant A.', minAge: 25, careers: ['actor'], minFame: 50, minReputation: { online: 50 }, relationshipTypes: ['parent'], npcArchetypes: ['average'], minRelationshipTrust: 70, maxRelationshipSuspicion: 20 },
        { text: 'Actor-family variant B.', careers: ['Star'], minFame: 60, relationshipTypes: ['parent'] },
        { text: 'Ineligible colleague variant.', relationshipTypes: ['colleague'] },
        { text: 'Ineligible age variant.', minAge: 40 }
      ] }
    };
    const expectedIndex = Math.floor(nextRandom(42).value * 2);
    const resolution = resolveNarrativeVariant(effect, undefined, state(), parent);
    expect(resolution.text).toBe(['Actor-family variant A.', 'Actor-family variant B.'][expectedIndex]);
    expect(resolution.selected).toBe(true);
    expect(resolution.nextSeed).toBe(nextRandom(42).nextSeed);
  });

  it('selects the same variant text for identical seeded replays', () => {
    const effect: OutcomeEffect = { statChanges: { happiness: 5 }, outcomeText: 'Fallback.', narrativeVariants: { positive: [{ text: 'One' }, { text: 'Two' }, { text: 'Three' }] } };
    expect(resolveNarrativeVariant(effect, undefined, state())).toEqual(resolveNarrativeVariant(effect, undefined, state()));
  });

  it('selects different text for wealth bands and career groups', () => {
    const effect: OutcomeEffect = {
      statChanges: { happiness: 5 },
      outcomeText: 'Fallback.',
      narrativeVariants: { positive: [
        { text: 'A struggling worker counts every small win.', wealthBands: ['struggling'] },
        { text: 'A wealthy worker treats the win as another option.', wealthBands: ['wealthy'] },
        { text: 'The actor sees a career break in the moment.', careerGroups: ['actor'] },
        { text: 'The creator turns the moment into content.', careerGroups: ['creator'] },
        { text: 'The office worker files it under professional progress.', careerGroups: ['corporate'] }
      ] }
    };
    const poor: GameState = { ...state(), cash: 50, career: { ...state().career, title: 'Office Worker', track: undefined } };
    const wealthy: GameState = { ...poor, cash: 500_000 };
    const actor: GameState = { ...poor, cash: 50_000, career: { ...poor.career, title: 'Lead Actor', track: 'actor' } };
    const creator: GameState = { ...poor, cash: 50_000, career: { ...poor.career, title: 'Creator', track: undefined } };
    expect(getWealthBand(poor.cash)).toBe('struggling');
    expect(getWealthBand(wealthy.cash)).toBe('wealthy');
    expect(getCareerGroup(actor.career)).toBe('actor');
    expect(getCareerGroup(creator.career)).toBe('creator');
    expect(resolveNarrativeVariant(effect, undefined, poor).text).toBe('A struggling worker counts every small win.');
    expect(resolveNarrativeVariant(effect, undefined, wealthy).text).toBe('A wealthy worker treats the win as another option.');
    expect(resolveNarrativeVariant(effect, undefined, actor).text).toBe('The actor sees a career break in the moment.');
    expect(resolveNarrativeVariant(effect, undefined, creator).text).toBe('The creator turns the moment into content.');
  });

  it('selects different text from NPC memory and relationship history', () => {
    const effect: OutcomeEffect = {
      statChanges: { happiness: 5 },
      outcomeText: 'Fallback.',
      narrativeVariants: { positive: [
        { text: 'Their past support makes this moment feel safe.', memoryTypesAny: ['stood_by_player'], memorySentiment: 'positive', minRelationshipTrust: 70, minRelationshipYears: 5 },
        { text: 'The old betrayal makes every promise sound fragile.', memoryTypesAny: ['betrayed_player'], memorySentiment: 'negative', minRelationshipResentment: 40, minRelationshipSuspicion: 30 }
      ] }
    };
    const supportive = relationshipToNPC({ id: 'partner', name: 'Partner', relation: 'partner', trust: 85, suspicion: 5, resentment: 0 });
    supportive.memories.push({ id: 'support', type: 'stood_by_player', sourceId: 'past_support', targetId: supportive.id, tick: 20, intensity: 70, emotionalValue: 50, decayRate: 1, permanent: true });
    const betrayed = relationshipToNPC({ id: 'partner', name: 'Partner', relation: 'partner', trust: 25, suspicion: 60, resentment: 70 });
    betrayed.memories.push({ id: 'betrayal', type: 'betrayed_player', sourceId: 'past_betrayal', targetId: betrayed.id, tick: 28, intensity: 90, emotionalValue: -70, decayRate: 1, permanent: true });
    expect(getRelationshipHistoryYears(30, supportive)).toBe(10);
    expect(resolveNarrativeVariant(effect, undefined, state(), supportive).text).toBe('Their past support makes this moment feel safe.');
    expect(resolveNarrativeVariant(effect, undefined, state(), betrayed).text).toBe('The old betrayal makes every promise sound fragile.');
  });

  it('selects different text from milestone, failure, and previous-event history', () => {
    const effect: OutcomeEffect = {
      statChanges: { happiness: 5 },
      outcomeText: 'Fallback.',
      narrativeVariants: { positive: [
        { text: 'The achievement makes this feel like another step upward.', requiredFlags: ['career_milestone_complete'], excludedFlags: ['career_failure'], previousEventIds: ['major_award'] },
        { text: 'After the failure, even a small recovery carries weight.', requiredFlags: ['career_failure'], excludedFlags: ['career_milestone_complete'], previousEventIds: ['career_setback'] }
      ] }
    };
    const achieved: GameState = { ...state(), flags: { career_milestone_complete: true }, recentEventIds: ['major_award'] };
    const failed: GameState = { ...state(), flags: { career_failure: true }, recentEventIds: ['career_setback'] };
    expect(resolveNarrativeVariant(effect, undefined, achieved).text).toBe('The achievement makes this feel like another step upward.');
    expect(resolveNarrativeVariant(effect, undefined, failed).text).toBe('After the failure, even a small recovery carries weight.');
    expect(resolveNarrativeVariant(effect, undefined, achieved)).toEqual(resolveNarrativeVariant(effect, undefined, achieved));
  });
});
