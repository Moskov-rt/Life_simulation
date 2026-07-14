import { describe, expect, it } from 'vitest';
import { GameState, OutcomeEffect } from '../types';
import { deriveLifestyle, getWealthBand, calculateFinancialStress } from '../utils/wealthIdentity';
import { resolveNarrativeVariant } from '../utils/narrativeVariants';

const state = (cash: number): GameState => ({
  name: 'Test', gender: 'Other', avatar: '', location: 'London, United Kingdom', age: 30, alive: true, deathReason: '', cash,
  stats: { health: 80, smarts: 70, looks: 70, happiness: 70, style: 50, status: 50 }, reputation: { family: 50, college: 50, online: 50, workplace: 50, dating: 50 }, fame: 0,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
  career: { type: 'job', title: 'Office Worker', salary: 50000, performance: 70, yearsInRole: 2 }, karma: 50, willpower: 50, currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 17
});

describe('wealth identity and lifestyle foundation', () => {
  it('classifies cash without replacing it as source of truth', () => {
    expect(getWealthBand(50)).toBe('struggling');
    expect(getWealthBand(3_000)).toBe('lower_class');
    expect(getWealthBand(15_000)).toBe('middle_class');
    expect(getWealthBand(500_000)).toBe('wealthy');
    expect(getWealthBand(2_000_000)).toBe('rich');
    expect(getWealthBand(20_000_000)).toBe('elite');
  });

  it('derives financial pressure from cash, expenses, and stability', () => {
    const struggling = calculateFinancialStress({ cash: 50, income: 1000, expenses: 2000, careerStability: 15 });
    const secure = calculateFinancialStress({ cash: 2_000_000, income: 100000, expenses: 25000, careerStability: 90 });
    expect(struggling).toBeGreaterThan(secure);
    expect(deriveLifestyle(state(50)).spendingStyle).toBe('survival');
    expect(deriveLifestyle(state(2_000_000)).spendingStyle).toBe('luxury');
  });

  it('selects wealth-aware narrative text deterministically', () => {
    const effect: OutcomeEffect = {
      statChanges: { happiness: 5 }, outcomeText: 'Fallback.', narrativeVariants: { positive: [
        { text: 'The bill arrives at the worst possible time.', lifestyleLevels: ['struggling', 'lower_class'] },
        { text: 'The cost is manageable, though still inconvenient.', lifestyleLevels: ['middle_class', 'wealthy'] },
        { text: 'The cost is irrelevant; only the interruption matters.', lifestyleLevels: ['rich', 'elite'] }
      ] }
    };
    const poor = state(50);
    const rich = state(2_000_000);
    expect(resolveNarrativeVariant(effect, undefined, poor).text).toContain('worst possible');
    expect(resolveNarrativeVariant(effect, undefined, rich).text).toContain('irrelevant');
    expect(resolveNarrativeVariant(effect, undefined, rich)).toEqual(resolveNarrativeVariant(effect, undefined, rich));
  });
});
