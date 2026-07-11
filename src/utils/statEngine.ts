import { GameState, Stats, OutcomeEffect } from '../types';

/**
 * Stat Scaling Curve (Diminishing Returns)
 */
export function getScalingMultiplier(currentValue: number, isGain: boolean): number {
  if (currentValue <= 20) return isGain ? 2.5 : 0.5;
  if (currentValue <= 40) return isGain ? 1.5 : 0.75;
  if (currentValue <= 60) return isGain ? 1.0 : 1.0;
  if (currentValue <= 80) return isGain ? 0.75 : 1.25;
  if (currentValue <= 95) return isGain ? 0.4 : 1.5;
  return isGain ? 0.15 : 2.0; // 96-100
}

/**
 * Character Modifier based on Personality Traits
 */
export function getPersonalityModifier(
  traits: string[],
  statName: string,
  isGain: boolean,
  context?: { isFameEvent?: boolean, isMoneyEvent?: boolean }
): { multiplier: number; reason?: string } {
  let multiplier = 1.0;
  let reason = undefined;

  for (const trait of traits) {
    switch (trait) {
      case 'Resilient':
        if (!isGain) { multiplier *= 0.7; reason = 'Resilient'; }
        else { multiplier *= 1.1; reason = 'Resilient'; }
        break;
      case 'Fragile':
        if (!isGain) { multiplier *= 1.4; reason = 'Fragile'; }
        else { multiplier *= 1.2; reason = 'Fragile'; }
        break;
      case 'Money-Obsessed':
        if (statName === 'cashChange' || context?.isMoneyEvent) {
          multiplier *= isGain ? 1.5 : 1.8;
          reason = 'Money-Obsessed';
        } else if (statName === 'happiness' && isGain) {
          multiplier *= 0.6; // Happiness from non-money is less
        }
        break;
      case 'Validation-Seeking':
        if (statName === 'status' || statName === 'fame' || context?.isFameEvent) {
          multiplier *= isGain ? 1.8 : 2.0;
          reason = 'Validation-Seeking';
        }
        break;
      case 'Introvert':
        if (statName === 'status' || statName === 'fame' || context?.isFameEvent) {
          multiplier *= isGain ? 0.5 : 1.0;
          reason = 'Introvert';
        }
        break;
      case 'Extrovert':
        if (statName === 'status' || statName === 'fame' || context?.isFameEvent) {
          multiplier *= isGain ? 1.3 : 1.0;
          reason = 'Extrovert';
        }
        break;
      case 'Hustler':
        if (statName === 'cashChange' && isGain) { multiplier *= 1.3; reason = 'Hustler'; }
        if (statName === 'burnout' && isGain) multiplier *= 1.4;
        break;
      case 'Perfectionist':
        if (statName === 'burnout' && !isGain) multiplier *= 2.0; // Failures cause double burnout
        break;
    }
  }

  return { multiplier, reason };
}

/**
 * Life Context Modifier
 */
export function getContextModifier(
  gameState: GameState,
  statName: string,
  isGain: boolean
): { multiplier: number; reason?: string } {
  let multiplier = 1.0;
  let reason = undefined;
  
  // Age Scaling
  if (gameState.age >= 18 && gameState.age <= 21) {
    if (statName === 'cashChange' && isGain) multiplier *= 0.8;
    if (statName === 'status' && !isGain) { multiplier *= 1.5; reason = 'Youthful sensitivity'; }
  } else if (gameState.age >= 30 && gameState.age <= 39) {
    if (statName === 'burnout' && isGain) multiplier *= 1.2;
    if (statName === 'health' && isGain) multiplier *= 0.8;
  } else if (gameState.age >= 50) {
    if (statName === 'cashChange' && !isGain) multiplier *= 1.2;
  }

  // Financial Security
  if (statName === 'happiness' || statName === 'health') { // Using health/happiness as proxy for stress
    if (gameState.cash > 100000 && !isGain) {
      multiplier *= 0.5;
      reason = 'Financial security cushions the blow';
    } else if (gameState.cash < 1000 && !isGain) {
      multiplier *= 1.8;
      reason = 'Financial anxiety amplifies stress';
    }
  }

  // Career Stage
  if (gameState.career.yearsInRole < 1 && isGain && statName === 'status') {
    multiplier *= 2.5; reason = 'First taste of success';
  } else if (gameState.career.yearsInRole > 5 && isGain && statName === 'status') {
    multiplier *= 1.0; // Normalizes
  }

  return { multiplier, reason };
}

/**
 * Choice History Habituation Modifier
 */
export function getHistoryModifier(
  choiceId: string,
  history: Record<string, number>,
  statName: string,
  isGain: boolean
): { multiplier: number; reason?: string } {
  if (!choiceId || !history[choiceId]) return { multiplier: 1.0 };
  
  const count = history[choiceId];
  let multiplier = 1.0;
  let reason = undefined;

  // Habituation: The more you do it, the less it impacts you emotionally
  if (statName === 'happiness' || statName === 'health') {
    if (count >= 50) { multiplier = 0.0; reason = 'Completely numb to this'; }
    else if (count >= 20) { multiplier = 0.2; reason = 'Routine'; }
    else if (count >= 5) { multiplier = 0.6; reason = 'Desensitized'; }
  }

  return { multiplier, reason };
}

/**
 * Event Severity Scaling (Audience Size)
 */
export function getSeverityMultiplier(followers: number): number {
  if (followers <= 0) return 1.0;
  return 1 + (Math.log10(followers + 1) / 4);
}

/**
 * Income Scaling
 * Replaces flat big cash events with a percentage of monthly revenue.
 */
export function scaleIncome(baseChange: number, currentMonthlyRevenue: number): number {
  if (currentMonthlyRevenue <= 0) return baseChange;
  
  // If baseChange is massively positive, treat as "Big Tip" (5-15% of monthly rev)
  if (baseChange >= 1000) {
    const pct = 0.05 + (Math.random() * 0.1); // 0.05 to 0.15
    return Math.floor(currentMonthlyRevenue * pct);
  }
  
  // If baseChange is massively negative, treat as "Slow Month" (30-60% loss)
  if (baseChange <= -1000) {
    const pct = 0.3 + (Math.random() * 0.3); // 0.3 to 0.6
    return -Math.floor(currentMonthlyRevenue * pct);
  }

  return baseChange;
}

/**
 * Stat Cascades (Interaction Matrix)
 */
export function processCascades(
  primaryStat: string,
  finalChange: number,
  currentStats: Stats
): { cascades: Partial<Stats>, log: string } | null {
  const cascades: Partial<Stats> = {};
  let log = '';

  const health = currentStats.health || 50;
  const happiness = currentStats.happiness || 50;
  // Use happiness inverse for stress
  const stress = 100 - happiness; 
  const confidence = (currentStats as any).confidence || 50;
  const money = 0; // Handled at higher level if needed, or pass cash in

  if (primaryStat === 'cashChange' && finalChange > 5000 && health < 40) {
    cascades.health = 5;
    log = 'Health +5% (Can afford better care)';
  }
  if (primaryStat === 'cashChange' && finalChange < -2000) {
    if (stress < 80) {
      cascades.happiness = -15; // +15 stress
      log = 'Happiness -15% (Sudden financial anxiety)';
    } else {
      cascades.happiness = -5;
      log = 'Happiness -5% (Already numb to financial pain)';
    }
  }
  if (primaryStat === 'status' && finalChange > 10) {
    if (happiness < 30) {
      cascades.happiness = -5;
      log = 'Happiness -5% (Fame makes misery public)';
    } else if (happiness > 60) {
      cascades.happiness = 8;
      log = 'Happiness +8% (Validation fuels ego)';
    }
  }
  if (primaryStat === 'looks') {
    if (finalChange > 0 && confidence < 50) {
      (cascades as any).confidence = 20;
      log = 'Confidence +20% (Appearance validation)';
    } else if (finalChange < 0 && confidence > 80) {
      (cascades as any).confidence = -25;
      log = 'Confidence -25% (Identity crisis)';
    }
  }
  if (primaryStat === 'burnout' && finalChange > 0 && (currentStats.health || 50) < 40) {
    cascades.happiness = -20;
    log = 'Happiness -20% (Spiral triggered by burnout)';
  }

  if (log) return { cascades, log };
  return null;
}

/**
 * MASTER FORMULA EXECUTOR
 */
export function calculateDynamicOutcome(
  effect: OutcomeEffect,
  gameState: GameState,
  choiceId?: string,
  eventContext?: { isFameEvent?: boolean, followers?: number, monthlyRevenue?: number }
): { dynamicEffect: OutcomeEffect, displayLines: string[] } {
  
  const dynamicEffect: OutcomeEffect = JSON.parse(JSON.stringify(effect));
  if (!dynamicEffect.statChanges) dynamicEffect.statChanges = {};
  
  const displayLines: string[] = [];
  const cascadesObj: Partial<Stats> = {};
  
  const traits = (gameState as any).personalityTraits || [];
  const history = (gameState as any).choiceHistory || {};

  // Helper to format display text
  const formatStat = (statName: string, val: number, reason?: string) => {
    const sign = val > 0 ? '+' : '';
    let line = `${statName.charAt(0).toUpperCase() + statName.slice(1)} ${sign}${Math.round(val)}`;
    if (reason) line += ` (${reason})`;
    return line;
  };

  // Process Stats
  if (effect.statChanges) {
    for (const [key, value] of Object.entries(effect.statChanges)) {
      const statName = key as keyof Stats;
      const baseValue = typeof value === 'number' ? value : 0;
      if (baseValue === 0) continue;

      const isGain = baseValue > 0;
      const currentVal = gameState.stats[statName] || 50;
      
      const scaling = getScalingMultiplier(currentVal, isGain);
      const personality = getPersonalityModifier(traits, statName, isGain, eventContext);
      const context = getContextModifier(gameState, statName, isGain);
      const hab = getHistoryModifier(choiceId || '', history, statName, isGain);
      
      const variance = 0.85 + (Math.random() * 0.3); // 0.85 - 1.15
      
      // Severity check for fame/status
      let severity = 1.0;
      if (statName === 'status') {
        severity = getSeverityMultiplier(eventContext?.followers || 0);
      }

      let finalChange = baseValue * scaling * personality.multiplier * context.multiplier * hab.multiplier * severity * variance;
      
      // Check limits
      let finalVal = currentVal + finalChange;
      let limitTag = '';
      if (finalVal > 100) { finalChange = 100 - currentVal; limitTag = ' [MAX]'; }
      if (finalVal < 0) { finalChange = -currentVal; limitTag = ' [FLOOR]'; }
      
      dynamicEffect.statChanges[statName] = Math.round(finalChange);
      
      let reasonText = personality.reason || context.reason || hab.reason;
      displayLines.push(formatStat(statName, finalChange, reasonText) + limitTag);

      // Trigger Cascades
      const cascadeResult = processCascades(statName, finalChange, gameState.stats);
      if (cascadeResult) {
        displayLines.push(` ↳ ${cascadeResult.log}`);
        for (const [cKey, cVal] of Object.entries(cascadeResult.cascades)) {
          cascadesObj[cKey as keyof Stats] = (cascadesObj[cKey as keyof Stats] || 0) + (cVal as number);
        }
      }
    }
  }

  // Apply Cascades to dynamicEffect
  for (const [key, val] of Object.entries(cascadesObj)) {
    const sKey = key as keyof Stats;
    dynamicEffect.statChanges[sKey] = (dynamicEffect.statChanges[sKey] || 0) + (val as number);
  }

  // Process Cash
  if (effect.cashChange) {
    const isGain = effect.cashChange > 0;
    
    // Scale income if revenue is provided
    let baseCash = effect.cashChange;
    if (eventContext?.monthlyRevenue) {
      baseCash = scaleIncome(baseCash, eventContext.monthlyRevenue);
    }

    const personality = getPersonalityModifier(traits, 'cashChange', isGain, eventContext);
    const context = getContextModifier(gameState, 'cashChange', isGain);
    
    let finalCash = baseCash * personality.multiplier * context.multiplier;
    
    dynamicEffect.cashChange = Math.round(finalCash);
    
    let reasonText = personality.reason || context.reason;
    const sign = finalCash > 0 ? '+$' : '-$';
    displayLines.push(`Money ${sign}${Math.abs(Math.round(finalCash)).toLocaleString()}` + (reasonText ? ` (${reasonText})` : ''));
    
    // Trigger Cascades for Cash
    const cascadeResult = processCascades('cashChange', finalCash, gameState.stats);
    if (cascadeResult) {
      displayLines.push(` ↳ ${cascadeResult.log}`);
      for (const [cKey, cVal] of Object.entries(cascadeResult.cascades)) {
        dynamicEffect.statChanges[cKey as keyof Stats] = (dynamicEffect.statChanges[cKey as keyof Stats] || 0) + (cVal as number);
      }
    }
  }

  return { dynamicEffect, displayLines };
}
