import { GameState } from '../types';

/**
 * Simple Linear Congruential Generator (LCG) for deterministic randomness.
 */
export function seededRandom(seed: number): number {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  let current = seed;
  current = (a * current + c) % m;
  return current / m;
}

/**
 * Condition registry for delayed flags.
 * A follow up flag stores an ID, and we look up its logic here.
 */
type FlagConditionHandler = (gameState: GameState, seed: number) => { triggered: boolean, remove: boolean, consequence?: any };

const FLAG_REGISTRY: Record<string, FlagConditionHandler> = {
  'mom_check_history': (gameState: GameState, seed: number) => {
    // Example: 30% chance she looks at history and catches you if you lied recently
    const rand = seededRandom(seed);
    if (rand < 0.3) {
      return {
        triggered: true,
        remove: true,
        consequence: {
          type: 'event',
          eventId: 'mom_found_history'
        }
      };
    }
    return { triggered: false, remove: false };
  },
  'gossip_spreads': (gameState: GameState, seed: number) => {
    const rand = seededRandom(seed);
    if (rand < 0.5) {
      return {
        triggered: true,
        remove: true,
        consequence: {
          type: 'reputation_hit',
          family: -10,
          friends: -15
        }
      };
    }
    return { triggered: false, remove: true }; // Removes after checking once
  }
};

/**
 * Evaluate all active delayed flags in ageUp.
 */
export function evaluateFollowUpFlags(gameState: GameState): {
  newEvents: string[],
  statDecays: any[],
  flagsToRemove: string[]
} {
  const newEvents: string[] = [];
  const statDecays: any[] = [];
  const flagsToRemove: string[] = [];
  
  const seedBase = gameState.age * (gameState.karma || 1) + 12345;

  // Wait, gameState.flags is a flat Record<string, any>.
  // If we store follow-up flags, we might want to store them in a specific array, 
  // or use gameState.delayedEvents (which is an array of objects).
  // Let's use gameState.delayedEvents, which already exists!
  
  if (gameState.delayedEvents) {
    gameState.delayedEvents.forEach((ev, idx) => {
      // Evaluate if trigger age is met
      if (gameState.age >= ev.triggerAge) {
        flagsToRemove.push(ev.eventId);
        
        // Is it registered as a complex condition?
        const handler = FLAG_REGISTRY[ev.eventId];
        if (handler) {
          const result = handler(gameState, seedBase + idx);
          if (result.triggered && result.consequence) {
            if (result.consequence.type === 'event') {
              newEvents.push(result.consequence.eventId);
            } else if (result.consequence.type === 'reputation_hit') {
              statDecays.push(result.consequence);
            }
          }
          if (!result.remove) {
            // Remove from flagsToRemove if the handler says not to remove it yet
            flagsToRemove.pop();
          }
        } else {
          // It's a standard event spawn
          newEvents.push(ev.eventId);
        }
      }
    });
  }

  return { newEvents, statDecays, flagsToRemove };
}
