import { ChoiceResult } from './choiceResolver';
import { OngoingEffect, PlayerTrait, NPC } from '../types';

export interface PersonalityModifier {
  trustDelta: number;
  suspicionDelta: number;
  resentmentDelta: number;
  happinessDelta: number;
  ongoingEffect?: OngoingEffect;
}

/**
 * Registry defining how a trait modifies a specific choice outcome.
 */
const TRAIT_REGISTRY: Record<PlayerTrait, (baseResult: ChoiceResult, isLie: boolean, npc: NPC | undefined) => PersonalityModifier> = {
  'guilt_prone': (baseResult, isLie, npc) => ({
    trustDelta: 0,
    suspicionDelta: 0,
    resentmentDelta: 0,
    happinessDelta: isLie ? -10 : 0, // Extra happiness loss when lying
    ongoingEffect: isLie ? {
      id: '', // Will be set by caller
      effectType: 'guilt_complex',
      startYear: 0,
      remainingYears: 2,
      intensity: 10
    } : undefined
  }),
  
  'manipulative': (baseResult, isLie, npc) => {
    let tDelta = 0;
    let sDelta = 0;
    let rDelta = 0;
    if (isLie) {
      tDelta = 5; // Lies are more effective (mitigate trust loss)
      sDelta = -5; // Mitigate suspicion gain
      rDelta = 10; // But cause more resentment if caught / inherently toxic
    }
    return { trustDelta: tDelta, suspicionDelta: sDelta, resentmentDelta: rDelta, happinessDelta: 0 };
  },

  'family_oriented': (baseResult, isLie, npc) => {
    const isFamily = npc?.relation === 'parent' || npc?.relation === 'sibling';
    const conflict = (baseResult.relationshipChanges?.trust || 0) < 0 || (baseResult.relationshipChanges?.resentment || 0) > 0;
    return {
      trustDelta: 0, suspicionDelta: 0, resentmentDelta: 0,
      happinessDelta: (isFamily && conflict) ? -15 : 0 // Stronger family conflict penalty
    };
  },

  'independent': (baseResult, isLie, npc) => {
    const isFamily = npc?.relation === 'parent' || npc?.relation === 'sibling';
    const conflict = (baseResult.relationshipChanges?.trust || 0) < 0 || (baseResult.relationshipChanges?.resentment || 0) > 0;
    return {
      trustDelta: 0, suspicionDelta: 0, resentmentDelta: 0,
      happinessDelta: (isFamily && conflict) ? 10 : 0 // Reverses standard family conflict penalty
    };
  },

  'paranoid': (baseResult, isLie, npc) => {
    const suspicionGain = (baseResult.relationshipChanges?.suspicion || 0) > 0;
    return {
      trustDelta: 0, suspicionDelta: 0, resentmentDelta: 0,
      happinessDelta: suspicionGain ? -10 : 0,
      ongoingEffect: suspicionGain ? {
        id: '', effectType: 'paranoia_spike', startYear: 0, remainingYears: 1, intensity: 5
      } : undefined
    };
  },

  'shameless': (baseResult, isLie, npc) => {
    return {
      trustDelta: isLie ? -5 : 0, // Worse social consequence
      suspicionDelta: isLie ? 5 : 0,
      resentmentDelta: 0,
      happinessDelta: isLie ? 10 : 0 // Less internal stress when lying
    };
  },

  'empath': (baseResult, isLie, npc) => {
    const harm = (baseResult.relationshipChanges?.trust || 0) < 0 || (baseResult.relationshipChanges?.resentment || 0) > 0;
    const forgive = (baseResult.relationshipChanges?.forgiveness || 0) > 0;
    let hDelta = 0;
    if (harm) hDelta = -10;
    if (forgive) hDelta = 15;
    return { trustDelta: 0, suspicionDelta: 0, resentmentDelta: 0, happinessDelta: hDelta };
  }
};

/**
 * Pipes a ChoiceResult through the player's personality traits to apply secondary scaling and effects.
 * Pure function: does not mutate inputs.
 */
export function applyPlayerTraits(
  baseResult: ChoiceResult, 
  playerTraits: PlayerTrait[], 
  choiceId: string,
  npc: NPC | undefined,
  currentYear: number
): ChoiceResult {
  const isLie = choiceId.includes('deny');
  
  let finalTrust = baseResult.relationshipChanges?.trust || 0;
  let finalSuspicion = baseResult.relationshipChanges?.suspicion || 0;
  let finalResentment = baseResult.relationshipChanges?.resentment || 0;
  let totalHappinessDelta = 0;
  
  const newOngoingEffects: OngoingEffect[] = baseResult.ongoingEffectsToAdd ? [...baseResult.ongoingEffectsToAdd] : [];

  for (const trait of playerTraits) {
    const handler = TRAIT_REGISTRY[trait];
    if (handler) {
      const mods = handler(baseResult, isLie, npc);
      finalTrust += mods.trustDelta;
      finalSuspicion += mods.suspicionDelta;
      finalResentment += mods.resentmentDelta;
      totalHappinessDelta += mods.happinessDelta;

      if (mods.ongoingEffect) {
        newOngoingEffects.push({
          ...mods.ongoingEffect,
          startYear: currentYear,
          id: `${mods.ongoingEffect.effectType}_${npc?.id || 'sys'}`
        });
      }
    }
  }

  // Use clamp utility pattern
  finalTrust = Math.max(-100, Math.min(100, finalTrust));
  finalSuspicion = Math.max(0, Math.min(100, finalSuspicion));
  finalResentment = Math.max(0, Math.min(100, finalResentment));

  const newStatChanges = { ...(baseResult.statChanges || {}) };
  if (totalHappinessDelta !== 0) {
    newStatChanges.happiness = (newStatChanges.happiness || 0) + totalHappinessDelta;
  }

  return {
    ...baseResult,
    statChanges: Object.keys(newStatChanges).length > 0 ? newStatChanges : undefined,
    relationshipChanges: baseResult.relationshipChanges ? {
      ...baseResult.relationshipChanges,
      trust: finalTrust,
      suspicion: finalSuspicion,
      resentment: finalResentment
    } : undefined,
    ongoingEffectsToAdd: newOngoingEffects.length > 0 ? newOngoingEffects : undefined
  };
}
