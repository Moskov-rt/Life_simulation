import { GameState, RoyalRank } from '../types';

export interface RoyalPrivileges {
  royalActivities: boolean;
  residences: boolean;
  publicAppearances: boolean;
  successionResponsibilities: boolean;
  leadershipPreparation: boolean;
  highestAuthorityActions: boolean;
}

const ACTIVE_RANKS: RoyalRank[] = ['royal_child', 'prince_princess', 'heir', 'monarch'];

export function getRoyalPrivileges(state: Pick<GameState, 'royalSuccession' | 'royalLifestyle'>): RoyalPrivileges {
  const rank = state.royalSuccession?.rank;
  const active = Boolean(state.royalLifestyle?.active && rank && ACTIVE_RANKS.includes(rank));
  return {
    royalActivities: active,
    residences: active,
    publicAppearances: active,
    successionResponsibilities: active && (rank === 'heir' || rank === 'monarch'),
    leadershipPreparation: active && (rank === 'heir' || rank === 'monarch'),
    highestAuthorityActions: active && rank === 'monarch'
  };
}

export function canUseRoyalPrivilege(state: Pick<GameState, 'royalSuccession' | 'royalLifestyle'>, privilege: keyof RoyalPrivileges): boolean {
  return getRoyalPrivileges(state)[privilege];
}
