import { describe, expect, it } from 'vitest';
import { EVENTS_POOL } from '../events';
import { GameState } from '../types';
import { applyRoyalBehavior, isCorruptOrRuthless } from '../utils/royalBehavior';
import { migrateGameState } from '../utils/saveMigration';
import { resolveNarrativeVariant } from '../utils/narrativeVariants';

const royal = (): GameState => ({
  name: 'Ruler', gender: 'Other', avatar: '', location: 'London, United Kingdom', age: 35, alive: true, deathReason: '', cash: 1000,
  origin: { id: 'royal_family', country: 'United Kingdom', status: 'royal', publicAttention: 80 }, royalAuthority: 80, publicApproval: 60, publicFear: 20, royalIntegrity: 70, personalFreedom: 40,
  royalBehavior: { benevolent: 50, ambitious: 50, reckless: 0, corrupt: 65, ruthless: 10 }, royalSuccession: { rank: 'monarch', inheritanceEligible: true, regencyActive: false },
  stats: { health: 80, smarts: 80, looks: 70, happiness: 60, style: 50, status: 70 }, reputation: { family: 80, college: 50, online: 60, workplace: 50, dating: 50 }, fame: 50,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [], career: { type: 'unemployed', title: 'Monarch', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50, currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 12
});

describe('royal corruption and scandal', () => {
  it('gates abuse of authority behind corrupt or ruthless behavior', () => {
    const event = EVENTS_POOL.find(candidate => candidate.id === 'royal_power_response')!;
    const abuse = event.choices.find(choice => choice.id === 'royal_response_abuse')!;
    expect(abuse.conditions?.customCheck?.(royal())).toBe(true);
    const respected = royal();
    respected.royalBehavior = { benevolent: 80, ambitious: 20, reckless: 0, corrupt: 0, ruthless: 0 };
    expect(abuse.conditions?.customCheck?.(respected)).toBe(false);
  });

  it('moves behavior direction and provides fear/integrity consequences', () => {
    const state = royal();
    applyRoyalBehavior(state, { corrupt: 10, ruthless: 5 });
    expect(isCorruptOrRuthless(state)).toBe(true);
    const abuse = EVENTS_POOL.find(candidate => candidate.id === 'royal_power_response')!.choices.find(choice => choice.id === 'royal_response_abuse')!.effect!;
    expect(abuse.fearChange).toBeGreaterThan(0);
    expect(abuse.integrityChange).toBeLessThan(0);
    expect(abuse.memory?.permanent).toBe(true);
  });

  it('selects a different narrative for fear-heavy rulers and migrates new fields', () => {
    const effect = { outcomeText: 'A royal decision leaves a room afraid.', integrityChange: -10, narrativeVariants: { negative: [{ text: 'The room remembers the fear.', maxFear: 5 }, { text: 'The room remembers the threat.', minFear: 6 }] } };
    const calm = resolveNarrativeVariant(effect, undefined, { ...royal(), publicFear: 0 });
    const feared = resolveNarrativeVariant(effect, undefined, { ...royal(), publicFear: 20 });
    expect(calm.selected).toBe(true);
    expect(feared.selected).toBe(true);
    expect(calm.text).not.toBe(feared.text);
    const migrated = migrateGameState({ location: 'London, United Kingdom', origin: royal().origin, npcs: {}, relationships: [] });
    expect(migrated.publicFear).toBe(0);
    expect(migrated.royalIntegrity).toBe(60);
    expect(migrated.royalBehavior?.corrupt).toBe(0);
  });
});
