import { GameState, RoyalBehavior } from '../types';

export const DEFAULT_ROYAL_BEHAVIOR: RoyalBehavior = { benevolent: 50, ambitious: 50, reckless: 0, corrupt: 0, ruthless: 0 };

export function ensureRoyalBehavior(state: GameState): RoyalBehavior {
  if (!state.royalBehavior) state.royalBehavior = { ...DEFAULT_ROYAL_BEHAVIOR };
  return state.royalBehavior;
}

export function applyRoyalBehavior(state: GameState, changes: Partial<RoyalBehavior>): void {
  const behavior = ensureRoyalBehavior(state);
  Object.entries(changes).forEach(([key, value]) => {
    const k = key as keyof RoyalBehavior;
    behavior[k] = Math.max(0, Math.min(100, behavior[k] + (value || 0)));
  });
}

export function isCorruptOrRuthless(state: Pick<GameState, 'royalBehavior'>): boolean {
  return (state.royalBehavior?.corrupt || 0) >= 60 || (state.royalBehavior?.ruthless || 0) >= 60;
}
