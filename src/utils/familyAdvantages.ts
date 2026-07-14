import { GameState } from '../types';

export interface FamilyAdvantageProfile {
  opportunities: string[];
  pressures: string[];
}

/** Narrative-only context for children of influential or wealthy families. */
export function getFamilyAdvantages(state: Pick<GameState, 'origin' | 'familyWealth' | 'fame' | 'career'>): FamilyAdvantageProfile {
  const opportunities: string[] = [];
  const pressures: string[] = [];
  const origin = state.origin?.id;
  const track = state.career?.track;
  if (origin === 'royal_family' || state.origin?.status === 'royal') {
    opportunities.push('royal introductions', 'elite education');
    pressures.push('public expectations', 'family scrutiny');
  }
  if (origin === 'wealthy_family' || (state.familyWealth || 0) >= 100000) {
    opportunities.push('family capital', 'private mentorship');
    pressures.push('comparison to family success');
  }
  if (origin === 'celebrity_family' || track === 'actor' || (state.fame || 0) >= 35) {
    opportunities.push('industry connections', 'public platform');
    pressures.push('reputation inherited from family');
  }
  if (track === 'adult_performer' || origin === 'celebrity_family') {
    pressures.push('privacy and exposure concerns');
  }
  if (origin === 'commoner' || opportunities.length === 0) {
    opportunities.push('self-made opportunities');
  }
  return { opportunities: [...new Set(opportunities)], pressures: [...new Set(pressures)] };
}
