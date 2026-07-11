import { ChoiceResult } from './choiceResolver';
import { OngoingEffect } from '../types';

/**
 * Calculates cascading secondary effects based on the primary changes from a choice.
 * Pure function: does not mutate inputs.
 */
export function calculateStatCascades(
  baseResult: ChoiceResult,
  currentYear: number,
  sourceId: string
): ChoiceResult {
  let cascadeHappiness = 0;
  let cascadeHealth = 0;
  const newOngoingEffects: OngoingEffect[] = baseResult.ongoingEffectsToAdd ? [...baseResult.ongoingEffectsToAdd] : [];

  // Relationship cascades
  if (baseResult.relationshipChanges) {
    const rc = baseResult.relationshipChanges;
    
    // Major trust loss => happiness loss
    if (rc.trust <= -20) {
      cascadeHappiness -= 15;
    } else if (rc.trust < 0) {
      cascadeHappiness -= 5;
    }

    // High resentment => recurring mental health pressure
    if (rc.resentment >= 20) {
      newOngoingEffects.push({
        id: `${sourceId}_resentment_stress`,
        effectType: 'resentment_stress',
        startYear: currentYear,
        remainingYears: 3,
        intensity: Math.floor(rc.resentment / 2)
      });
    }

    // Forgiveness => happiness recovery
    if (rc.forgiveness && rc.forgiveness > 0) {
      cascadeHappiness += 10;
    }
  }

  // Currently ChoiceResult does not directly hold exposureChanges, but we can look at statChanges
  // Wait, if exposure was affected, it might be in statChanges.exposure if such a stat exists, 
  // but exposure is typically handled in secretExposure.
  // We can pass exposure changes if needed, but for now we'll stick to what ChoiceResult has.
  // The prompt mentions "maximum exposure -> severe stress". If exposure isn't in ChoiceResult, 
  // we can just handle relationship cascades here, or add exposure changes to the input signature.

  const newStatChanges = { ...(baseResult.statChanges || {}) };
  
  if (cascadeHappiness !== 0) {
    newStatChanges.happiness = (newStatChanges.happiness || 0) + cascadeHappiness;
  }
  if (cascadeHealth !== 0) {
    newStatChanges.health = (newStatChanges.health || 0) + cascadeHealth;
  }

  return {
    ...baseResult,
    statChanges: Object.keys(newStatChanges).length > 0 ? newStatChanges : undefined,
    ongoingEffectsToAdd: newOngoingEffects.length > 0 ? newOngoingEffects : undefined
  };
}
