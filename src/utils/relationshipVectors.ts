import { NPC } from '../types';

export const PERSONALITY_DRIFT_MODIFIERS: Record<string, {
  trust_mult?: number;
  suspicion_mult?: number;
  resentment_mult?: number;
  forgiveness_mult?: number;
}> = {
  impulsive: { trust_mult: 1.5, suspicion_mult: 1.5, resentment_mult: 1.5, forgiveness_mult: 1.5 },
  cautious: { trust_mult: 0.7, suspicion_mult: 0.7, resentment_mult: 0.7, forgiveness_mult: 0.7 },
  denial_prone: { suspicion_mult: 0.5 },
  protective: { trust_mult: 0.5 }, // Trust degrades slower
  religious: { resentment_mult: 1.5, forgiveness_mult: 0.5 },
  supportive: { trust_mult: 0.5 }
};

export function applyYearlyDrift(npc: NPC, action: 'truth' | 'lie' | 'avoid' | 'exposed' | 'amends' | 'kept_working' | 'none'): void {
  let trustDelta = 0;
  let suspicionDelta = 0;
  let knowledgeDelta = 0;
  let resentmentDelta = 0;
  let forgivenessDelta = 0;

  // Base Drift rates matching Deliverable 2
  switch (action) {
    case 'truth':
      trustDelta = 2;
      suspicionDelta = -3;
      forgivenessDelta = 1;
      break;
    case 'lie':
      trustDelta = -1;
      suspicionDelta = 2;
      resentmentDelta = 1;
      forgivenessDelta = -1;
      break;
    case 'avoid':
      trustDelta = -0.5;
      suspicionDelta = 1;
      break;
    case 'exposed':
      trustDelta = -15;
      suspicionDelta = 5;
      knowledgeDelta = 10;
      resentmentDelta = 20;
      forgivenessDelta = -5;
      break;
    case 'amends':
      trustDelta = 3;
      suspicionDelta = -2;
      resentmentDelta = -5;
      forgivenessDelta = 8;
      break;
    case 'kept_working':
      trustDelta = -3;
      suspicionDelta = 2;
      resentmentDelta = 5;
      forgivenessDelta = -3;
      break;
    case 'none':
    default:
      suspicionDelta = -1;
      resentmentDelta = -1;
      forgivenessDelta = 2;
      break;
  }

  // Apply Personality modifiers (Deliverable 3)
  for (const trait of npc.personality || []) {
    const mod = PERSONALITY_DRIFT_MODIFIERS[trait];
    if (mod) {
      if (mod.trust_mult !== undefined) trustDelta *= mod.trust_mult;
      if (mod.suspicion_mult !== undefined) suspicionDelta *= mod.suspicion_mult;
      if (mod.resentment_mult !== undefined) resentmentDelta *= mod.resentment_mult;
      if (mod.forgiveness_mult !== undefined) forgivenessDelta *= mod.forgiveness_mult;
    }
  }

  // Apply Vector-to-Vector interactions (Deliverable 6)
  if (npc.vectors.suspicion > 75) {
    trustDelta -= 5; // distrust spiral
  }
  if (npc.vectors.resentment > 60) {
    forgivenessDelta -= 3; // harder to forgive
  }
  if (npc.vectors.forgiveness > 80) {
    resentmentDelta -= 5; // healing
  }

  // Update vectors with clamping
  npc.vectors.trust = Math.max(-100, Math.min(100, npc.vectors.trust + trustDelta));
  npc.vectors.suspicion = Math.max(0, Math.min(100, npc.vectors.suspicion + suspicionDelta));
  npc.vectors.knowledge = Math.max(0, Math.min(100, npc.vectors.knowledge + knowledgeDelta));
  npc.vectors.resentment = Math.max(0, Math.min(100, npc.vectors.resentment + resentmentDelta));
  npc.vectors.forgiveness = Math.max(0, Math.min(100, npc.vectors.forgiveness + forgivenessDelta));

  // Sync back to relationship level for UI compat
  npc.trust = Math.round((npc.vectors.trust + 100) / 2); // map -100..100 to 0..100
  npc.suspicion = Math.round(npc.vectors.suspicion);
  npc.resentment = Math.round(npc.vectors.resentment);
}

export function checkGossipTrigger(npc: NPC, allNpcs: NPC[]): { triggered: boolean; source: string; target: string } | null {
  const isGossipy = npc.personality.includes('gossipy');
  if (npc.vectors.knowledge > 50 && npc.vectors.trust < 30) {
    // Gossip trigger
    const targetNpc = allNpcs.find(n => n.id !== npc.id && n.relation !== 'pet');
    if (targetNpc) {
      targetNpc.vectors.knowledge = Math.max(targetNpc.vectors.knowledge, Math.round(npc.vectors.knowledge * 0.8));
      targetNpc.vectors.suspicion = Math.max(targetNpc.vectors.suspicion, Math.round(npc.vectors.suspicion * 0.7));
      return {
        triggered: true,
        source: npc.name,
        target: targetNpc.name
      };
    }
  }
  return null;
}

export function modifyOutcomeDeltas(
  npc: NPC, 
  trustChange: number, 
  suspicionChange: number, 
  resentmentChange: number
): { trust: number; suspicion: number; resentment: number } {
  let tMult = 1.0;
  let sMult = 1.0;
  let rMult = 1.0;

  // High Trust (Trust > 50 mapped as vectors.trust > 0)
  if (npc.vectors.trust > 0) {
    if (trustChange < 0) tMult = 0.4; // trust loss is mitigated
  } else {
    if (trustChange < 0) tMult = 2.0; // trust loss amplified
  }

  // Suspicion modifiers
  if (npc.vectors.suspicion > 50) {
    if (suspicionChange > 0) sMult = 1.5; // suspicion gain amplified
  } else {
    if (suspicionChange > 0) sMult = 0.6; // suspicion gain mitigated
  }

  // Apply traits
  for (const trait of npc.personality || []) {
    if (trait === 'protective' && trustChange < 0) {
      tMult *= 0.5;
    }
    if (trait === 'religious' && resentmentChange > 0) {
      rMult *= 1.5;
    }
    if (trait === 'supportive' && trustChange > 0) {
      tMult *= 1.5;
    }
    if (trait === 'supportive' && resentmentChange > 0) {
      rMult *= 0.5;
    }
  }

  return {
    trust: Math.round(trustChange * tMult),
    suspicion: Math.round(suspicionChange * sMult),
    resentment: Math.round(resentmentChange * rMult)
  };
}

export function getDynamicChoiceOutcome(
  npc: NPC,
  choiceId: string,
  baseText: string
): { outcomeText: string; trustChange: number; suspicionChange: number; resentmentChange: number; knowledgeChange?: number } {
  let outcomeText = baseText;
  let trustChange = 0;
  let suspicionChange = 0;
  let resentmentChange = 0;
  let knowledgeChange = 0;

  if (choiceId.includes('deny')) {
    // Base changes for Deny
    trustChange = -5;
    suspicionChange = 10;
    
    // Scenario A: High trust, low knowledge
    if (npc.vectors.trust > 0 && npc.vectors.knowledge < 30) {
      const modified = modifyOutcomeDeltas(npc, trustChange, suspicionChange, 0);
      outcomeText = `${npc.name} looked confused but nodded. "Okay, sweetie." Trust ${modified.trust}%, Suspicion +${modified.suspicion}%`;
      return { outcomeText, trustChange: modified.trust, suspicionChange: modified.suspicion, resentmentChange: 0, knowledgeChange: 0 };
    } 
    // Scenario B: Low trust or high knowledge
    else {
      const modified = modifyOutcomeDeltas(npc, trustChange, suspicionChange, 5);
      outcomeText = `${npc.name}'s eyes narrowed. "That's the same lie you told last year." Trust ${modified.trust}%, Suspicion +${modified.suspicion}%, Resentment +${modified.resentment}%`;
      return { outcomeText, trustChange: modified.trust, suspicionChange: modified.suspicion, resentmentChange: modified.resentment, knowledgeChange: 0 };
    }
  }

  return { outcomeText, trustChange, suspicionChange, resentmentChange, knowledgeChange };
}
