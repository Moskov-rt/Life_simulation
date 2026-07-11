import { OngoingEffect, GameState } from '../types';

export interface OngoingEffectResult {
  updatedEffects: OngoingEffect[];
  statDeltas: { happiness: number; health: number; };
  expiredEffectIds: string[];
}

/**
 * Registry defining what each ongoing effect type does per year.
 */
const ONGOING_REGISTRY: Record<string, (effect: OngoingEffect, gameState: GameState) => { hDelta: number; hlthDelta: number }> = {
  'guilt_complex': (effect) => ({
    hDelta: -effect.intensity,
    hlthDelta: 0
  }),
  'resentment_stress': (effect) => ({
    hDelta: -effect.intensity,
    hlthDelta: 0
  }),
  'paranoia_spike': (effect) => ({
    hDelta: -effect.intensity,
    hlthDelta: -Math.floor(effect.intensity / 2)
  })
};

/**
 * Processes ongoing effects for a given year during ageUp.
 * Pure function: Does not mutate GameState.
 */
export function processOngoingEffects(
  currentEffects: OngoingEffect[],
  gameState: GameState
): OngoingEffectResult {
  const updatedEffects: OngoingEffect[] = [];
  const expiredEffectIds: string[] = [];
  let totalHappinessDelta = 0;
  let totalHealthDelta = 0;

  for (const effect of currentEffects) {
    // Process impact
    const handler = ONGOING_REGISTRY[effect.effectType];
    if (handler) {
      const impact = handler(effect, gameState);
      totalHappinessDelta += impact.hDelta;
      totalHealthDelta += impact.hlthDelta;
    }

    // Process duration
    if (effect.remainingYears !== null) {
      const newRemaining = effect.remainingYears - 1;
      if (newRemaining <= 0) {
        expiredEffectIds.push(effect.id);
      } else {
        updatedEffects.push({
          ...effect,
          remainingYears: newRemaining
        });
      }
    } else {
      updatedEffects.push({ ...effect });
    }
  }

  return {
    updatedEffects,
    statDeltas: {
      happiness: totalHappinessDelta,
      health: totalHealthDelta
    },
    expiredEffectIds
  };
}

/**
 * Pure function to merge new effects into an existing array, handling dedupes by type + source.
 */
export function mergeOngoingEffects(
  existingEffects: OngoingEffect[],
  newEffects: OngoingEffect[]
): OngoingEffect[] {
  const result = [...existingEffects];

  for (const newEff of newEffects) {
    const duplicateIdx = result.findIndex(
      e => e.effectType === newEff.effectType && e.sourceId === newEff.sourceId
    );

    if (duplicateIdx !== -1) {
      // Intentional refresh or intensity increase
      const existing = result[duplicateIdx];
      result[duplicateIdx] = {
        ...existing,
        remainingYears: Math.max(existing.remainingYears || 0, newEff.remainingYears || 0),
        intensity: Math.max(existing.intensity, newEff.intensity)
      };
    } else {
      result.push(newEff);
    }
  }

  return result;
}
