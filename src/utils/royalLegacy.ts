import { GameState } from '../types';

export type RoyalLegacyKind = 'achievement' | 'reform' | 'scandal' | 'relationship';

export function recordRoyalLegacy(state: GameState, kind: RoyalLegacyKind, entry: string): void {
  if (state.origin?.status !== 'royal' || !state.royalLegacy) return;
  const key = kind === 'achievement' ? 'achievements' : kind === 'reform' ? 'reforms' : kind === 'scandal' ? 'scandals' : 'relationshipMilestones';
  if (!state.royalLegacy[key].includes(entry)) state.royalLegacy[key].push(entry);
  state.royalLegacy.approvalSnapshots.push(state.publicApproval ?? 50);
}

export function summarizeRoyalLegacy(state: Pick<GameState, 'royalLegacy'>): string {
  const legacy = state.royalLegacy;
  if (!legacy) return '';
  return `Achievements: ${legacy.achievements.length}; Reforms: ${legacy.reforms.length}; Scandals: ${legacy.scandals.length}; Relationship milestones: ${legacy.relationshipMilestones.length}.`;
}
