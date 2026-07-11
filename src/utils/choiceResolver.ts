import { Choice, NPC, NPCInteractionHistory, Stats, Reputation, OngoingEffect } from '../types';
import { modifyOutcomeDeltas, getDynamicChoiceOutcome } from './relationshipVectors';

export interface ChoiceResult {
  outcomeText: string;
  statsLog: string;
  relationshipChanges?: {
    trust: number;
    suspicion: number;
    resentment: number;
    knowledge?: number;
    forgiveness?: number;
  };
  statChanges?: Partial<Stats>;
  repChanges?: Partial<Reputation>;
  followUpFlags?: any[];
  ongoingEffectsToAdd?: OngoingEffect[];
}

export function resolveChoice(
  choice: Choice,
  npc: NPC | undefined,
  currentYear: number
): ChoiceResult {
  // If no NPC is involved or choice effect is missing, return a base fallback
  if (!npc || !choice.effect) {
    return {
      outcomeText: choice.effect?.outcomeText || "The situation resolves quietly.",
      statsLog: "",
      statChanges: choice.effect?.statChanges,
      repChanges: choice.effect?.repChanges
    };
  }

  let effect = choice.effect;
  // If choice has probability outcomes, we would normally resolve it before passing it here,
  // but if we are resolving it here, we should assume the caller passed the resolved effect.
  // Wait, let's assume `choice.effect` passed to this function is the selected one, 
  // or we just resolve it in App.tsx and pass the effect.
  // Since the instructions say "Resolve choices using base deltas... Return a result object",
  // Let's pass the already rolled effect from App.tsx instead, or resolve the choice itself.
  
  // For now, assume effect is the base one.
  
  let baseTrustChange = effect.relationshipChanges?.trust || 0;
  let baseSuspicionChange = effect.relationshipChanges?.suspicion || 0;
  let baseResentmentChange = effect.relationshipChanges?.resentment || 0;
  let outcomeText = effect.outcomeText || "";
  let statsLog = "";
  
  // Check memory for repeated lies (penalty scaling)
  const isLie = choice.id.includes('deny');
  const isTruth = choice.id.includes('confess');
  const isAvoid = choice.id.includes('change_subject');
  
  let lieMultiplier = 1.0;
  if (isLie && npc.interactionHistory) {
    // Count lies in the last 5 years
    const recentLies = npc.interactionHistory.filter(h => h.playerLied && currentYear - h.year <= 5).length;
    if (recentLies > 0) {
      lieMultiplier = Math.min(2.5, 1 + (recentLies * 0.5)); // 1.5x, 2.0x, 2.5x max
      baseTrustChange = Math.floor(baseTrustChange * lieMultiplier);
      baseSuspicionChange = Math.floor(baseSuspicionChange * lieMultiplier);
    }
  }

  // Pass through modifyOutcomeDeltas
  const modified = modifyOutcomeDeltas(npc, baseTrustChange, baseSuspicionChange, baseResentmentChange);
  
  // Dynamic text generation (using the logic we built in getDynamicChoiceOutcome)
  const dynamicResult = getDynamicChoiceOutcome(npc, choice.id, outcomeText);
  outcomeText = dynamicResult.outcomeText;
  
  // Build stats log for UI
  const logParts = [];
  if (modified.trust !== 0) logParts.push(`Trust ${modified.trust > 0 ? '+' : ''}${modified.trust}%`);
  if (modified.suspicion !== 0) logParts.push(`Suspicion ${modified.suspicion > 0 ? '+' : ''}${modified.suspicion}%`);
  if (modified.resentment !== 0) logParts.push(`Resentment ${modified.resentment > 0 ? '+' : ''}${modified.resentment}%`);
  if (dynamicResult.knowledgeChange !== undefined && dynamicResult.knowledgeChange !== 0) {
     logParts.push(`Knowledge ${dynamicResult.knowledgeChange > 0 ? '+' : ''}${dynamicResult.knowledgeChange}%`);
  }
  statsLog = logParts.join(' | ');

  // Add memory/history tracking flag to be appended by App.tsx
  const followUpFlags = [];
  followUpFlags.push({
    type: 'interaction_history',
    year: currentYear,
    playerLied: isLie,
    playerToldTruth: isTruth,
    playerAvoided: isAvoid
  });
  
  // Repeated lie warning text
  if (isLie && lieMultiplier > 1.0) {
    outcomeText += ` (They remember you lying before...)`;
  }

  return {
    outcomeText,
    statsLog,
    relationshipChanges: modified,
    statChanges: effect.statChanges,
    repChanges: effect.repChanges,
    followUpFlags
  };
}
