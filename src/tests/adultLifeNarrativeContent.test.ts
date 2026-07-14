import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { EVENTS_POOL } from '../events';

const gameplayFingerprint = (event: unknown) => {
  const strip = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(strip);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== 'narrativeVariants')
      .map(([key, entry]) => [key, strip(entry)]));
  };
  return createHash('sha256').update(JSON.stringify(strip(event))).digest('hex').slice(0, 16);
};

describe('adult-life narrative content expansion', () => {
  it('adds variants without changing gameplay definitions', () => {
    const expected: Record<string, string> = {
      career_credit_theft: 'c9bec83d0af74535', dating_reputation_disaster: 'de67b149a4695b73', investment_opportunity: 'c1ceb2359324fcf0',
      adult_fansite: '64e53615b3916859', sugar_proposal: 'baf91f1c90f8536b', boss_spouse_affair: 'd956f1e079f92428', affair_fallout: '5ebf71c1814b16ba',
      adult_roommate_drama: 'cd65b01717f64be9', adult_wedding_speech: '2a56688b7f76de76', career_wrong_reply_all: '7d17ec7189b4ac96',
      career_office_drama: '940c329bccfd9ee0', adult_retirement_party: 'fea5b7d6794fe9da', life_health_scare: '054309bd89f65f12', random_scam_call: 'f3bb702b2843382a',
      gdd_event_1_algo: 'a46393711c66d6e9', gdd_event_2_ban: '09151e57c4a50bd5', gdd_event_21_phone: 'f313d3dc2117fd9c', gdd_event_22_ultimatum: 'cf86efb75933e30c',
      gdd_chain_3_resentment: '8a15fac3399a54e4', actor_first_audition: 'de95d6d4a8b2cac7'
    };
    for (const [id, fingerprint] of Object.entries(expected)) {
      const event = EVENTS_POOL.find(candidate => candidate.id === id);
      expect(event, id).toBeDefined();
      expect(gameplayFingerprint(event), id).toBe(fingerprint);
    }
  });

  it('covers the adult-life priority events with contextual variants', () => {
    const ids = ['adult_fansite', 'sugar_proposal', 'adult_roommate_drama', 'actor_first_audition', 'gdd_event_1_algo', 'gdd_event_2_ban', 'gdd_event_21_phone', 'gdd_event_22_ultimatum', 'gdd_chain_3_resentment'];
    for (const id of ids) {
      const event = EVENTS_POOL.find(candidate => candidate.id === id);
      const serialized = JSON.stringify(event);
      expect(serialized, id).toContain('narrativeVariants');
    }
  });
});
