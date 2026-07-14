import { describe, expect, it } from 'vitest';
import { GameState } from '../types';
import { migrateGameState } from '../utils/saveMigration';
import { processContextTurnover } from '../utils/contextManager';
import { advanceEducationYear, applyEducationChoice, educationAccessProfile, educationCareerOpportunities, ensureEducationState } from '../utils/educationSystem';

const makeState = (): GameState => ({
  name: 'Student', gender: 'Other', avatar: '', location: 'London, United Kingdom', age: 10, alive: true, deathReason: '', cash: 1000,
  origin: { id: 'commoner', country: 'United Kingdom', status: 'commoner', publicAttention: 0 }, stats: { health: 80, smarts: 70, looks: 70, happiness: 70, style: 50, status: 50 },
  reputation: { family: 50, college: 50, online: 50, workplace: 50, dating: 50 }, fame: 0, npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
  career: { type: 'school', title: 'Primary School Student', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50, currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 4
});

describe('education and childhood foundation', () => {
  it('creates persistent school NPC context deterministically', () => {
    const first = makeState();
    const second = makeState();
    let seedA = 42;
    let seedB = 42;
    const rollA = () => { seedA = (1664525 * seedA + 1013904223) % 2 ** 32; return seedA / 2 ** 32; };
    const rollB = () => { seedB = (1664525 * seedB + 1013904223) % 2 ** 32; return seedB / 2 ** 32; };
    processContextTurnover(first, rollA);
    processContextTurnover(second, rollB);
    expect(Object.values(first.npcs).filter(npc => npc.relation === 'classmate')).toHaveLength(6);
    expect(Object.values(first.npcs).some(npc => npc.relation === 'teacher')).toBe(true);
    expect(first.npcs).toEqual(second.npcs);
    expect(first.npcs[Object.keys(first.npcs)[0]].memories).toEqual([]);
  });

  it('applies childhood and teenage choices to education state', () => {
    const state = makeState();
    ensureEducationState(state);
    const initialGrades = state.education!.grades;
    applyEducationChoice(state, 'education_school_choice', 'school_study');
    expect(state.education!.grades).toBeGreaterThan(initialGrades);
    applyEducationChoice(state, 'education_teen_development', 'teen_creativity');
    applyEducationChoice(state, 'education_teen_development', 'teen_creativity');
    expect(state.education!.interests.creativity).toBeGreaterThan(50);
    expect(educationCareerOpportunities(state)).toContain('arts');
  });

  it('connects background to access and preserves education through migration', () => {
    const state = makeState();
    state.cash = 100;
    const access = educationAccessProfile(state);
    expect(access.opportunities).toContain('need-based scholarship');
    expect(access.obstacles).toContain('tuition pressure');
    advanceEducationYear(state, 11);
    const migrated = migrateGameState(state);
    expect(migrated.education?.grades).toBe(state.education?.grades);
    expect(migrated.education?.level).toBe('primary');
  });
});
