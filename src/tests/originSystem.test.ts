import { describe, expect, it } from 'vitest';
import { getAvailableOrigins, createOriginProfile, getCountryMetadata } from '../utils/origins';
import { migrateGameState } from '../utils/saveMigration';
import { EVENTS_POOL } from '../events';

describe('character origins', () => {
  it('exposes royal origins only in monarchies', () => {
    expect(getAvailableOrigins('United Kingdom')).toContain('royal_family');
    expect(getAvailableOrigins('Japan')).toContain('royal_family');
    expect(getAvailableOrigins('United States')).not.toContain('royal_family');
    expect(getCountryMetadata('United States').monarchyAvailable).toBe(false);
  });

  it('creates deterministic royal family, wealth, status, and succession context', () => {
    const first = createOriginProfile('royal_family', 'United Kingdom', 123);
    const second = createOriginProfile('royal_family', 'United Kingdom', 123);
    expect(first).toEqual(second);
    expect(first.familyMembers.map(member => member.relation)).toEqual(['parent', 'parent', 'cousin', 'mentor', 'teacher', 'supervisor']);
    expect(first.startingCash).toBeGreaterThan(0);
    expect(first.origin.status).toBe('royal');
    expect(first.origin.successionPosition).toMatch(/heir|spare/);
  });

  it('falls back to commoner when an origin is unavailable', () => {
    const profile = createOriginProfile('royal_family', 'United States', 1);
    expect(profile.origin.id).toBe('commoner');
    expect(profile.familyMembers).toHaveLength(0);
  });

  it('persists origin through save migration for new and legacy saves', () => {
    const migrated = migrateGameState({ location: 'London, United Kingdom', npcs: {}, relationships: [] });
    expect(migrated.origin).toEqual({ id: 'commoner', country: 'United Kingdom', status: 'commoner', publicAttention: 0 });
    expect(migrated.familyWealth).toBe(0);
    expect(migrated.allowance).toBe(0);
    expect(migrated.publicApproval).toBe(50);
  });

  it('registers royal-gated events without making them available to commoners', () => {
    const childhood = EVENTS_POOL.find(event => event.id === 'royal_childhood_expectations');
    expect(childhood).toBeDefined();
    const commoner = { origin: { id: 'commoner', country: 'United Kingdom', status: 'commoner', publicAttention: 0 }, age: 8, flags: {}, reputation: { online: 50 } } as any;
    const royal = { origin: { id: 'royal_family', country: 'United Kingdom', status: 'royal', publicAttention: 65 }, age: 8, flags: {}, reputation: { online: 50 } } as any;
    expect(childhood!.conditions?.customCheck?.(commoner)).toBe(false);
    expect(childhood!.conditions?.customCheck?.(royal)).toBe(true);
  });
});
