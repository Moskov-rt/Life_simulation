import { GameState, NPC, RoyalRank } from '../types';
import { nextRandom } from './seededRandom';

export interface SuccessionResolution {
  changed: boolean;
  logs: string[];
  nextSeed: number;
}

export function initialRoyalRank(age: number, successionPosition?: 'heir' | 'spare'): RoyalRank {
  if (age < 13) return 'royal_child';
  if (successionPosition === 'heir') return 'heir';
  return 'prince_princess';
}

function regentScore(npc: NPC): number {
  const loyalty = npc.traits?.loyalty || 0;
  const personalityBonus = (npc.personality || []).some(p => ['loyal', 'supportive', 'protective'].includes(p)) ? 15 : 0;
  return npc.trust + loyalty - npc.resentment * 1.5 + personalityBonus;
}

function selectRegent(state: GameState, seed: number): { npc?: NPC; nextSeed: number } {
  const candidates = Object.values(state.npcs || {}).filter(npc => !npc.isDeceased && ['parent', 'sibling', 'cousin', 'mentor', 'teacher', 'supervisor'].includes(npc.relation));
  if (!candidates.length) return { nextSeed: seed };
  const ranked = [...candidates].sort((a, b) => regentScore(b) - regentScore(a) || a.id.localeCompare(b.id));
  const roll = nextRandom(seed);
  const best = ranked.slice(0, Math.min(3, ranked.length));
  return { npc: best[Math.floor(roll.value * best.length)], nextSeed: roll.nextSeed };
}

export function ensureRoyalSuccession(state: GameState): void {
  if (state.origin?.status !== 'royal') return;
  if (!state.royalSuccession) {
    state.royalSuccession = {
      rank: initialRoyalRank(state.age, state.origin.successionPosition),
      inheritanceEligible: true,
      regencyActive: false
    };
  }
}

export function advanceRoyalRankForAge(state: GameState): boolean {
  ensureRoyalSuccession(state);
  if (!state.royalSuccession || state.royalSuccession.rank !== 'royal_child' || state.age < 13) return false;
  state.royalSuccession.rank = state.origin?.successionPosition === 'heir' ? 'heir' : 'prince_princess';
  return true;
}

export function resolveRoyalSuccession(state: GameState, deceasedId: string, seed = state.rngSeed || 1): SuccessionResolution {
  ensureRoyalSuccession(state);
  if (!state.royalSuccession || state.origin?.status !== 'royal' || state.royalSuccession.lastProcessedDeathId === deceasedId) return { changed: false, logs: [], nextSeed: seed };
  const deceased = state.npcs?.[deceasedId];
  const isMonarch = deceased?.occupation === 'Head of State' || deceasedId === state.royalSuccession.previousMonarchId;
  if (!isMonarch) return { changed: false, logs: [], nextSeed: seed };
  const logs: string[] = [];
  state.royalSuccession.lastProcessedDeathId = deceasedId;
  if (deceased) deceased.isDeceased = true;
  if ((state.publicApproval ?? 50) < 20 || (state.reputation.family ?? 50) < 20) {
    state.royalSuccession.successionDisputed = true;
    state.royalAuthority = Math.min(state.royalAuthority ?? 0, 35);
  }
  if (!state.royalSuccession.inheritanceEligible) return { changed: false, logs, nextSeed: seed };

  state.royalSuccession.rank = 'monarch';
  state.royalAuthority = state.royalSuccession.successionDisputed ? Math.min(state.royalAuthority || 0, 35) : Math.max(state.royalAuthority || 0, state.age < 18 ? 45 : 75);
  state.royalSuccession.previousMonarchId = deceasedId;
  state.origin.successionPosition = undefined;
  logs.push('👑 The monarch has died. The eligible royal heir inherits the crown.');
  if (state.age < 18) {
    const selected = selectRegent(state, seed);
    state.royalSuccession.regencyActive = true;
    state.royalSuccession.regentId = selected.npc?.id;
    if (selected.npc) {
      selected.npc.memories.push({ id: `regency_${state.age}_${selected.npc.id}`, type: 'royal_regency', sourceId: 'player', targetId: selected.npc.id, tick: state.age, intensity: 70, emotionalValue: 15, decayRate: 1, permanent: true });
      logs.push(`${selected.npc.name} becomes regent during the heir's minority.`);
    } else logs.push('The royal household enters a regency period while a guardian is appointed.');
    return { changed: true, logs, nextSeed: selected.nextSeed };
  }
  state.royalSuccession.regencyActive = false;
  state.royalSuccession.regentId = undefined;
  return { changed: true, logs, nextSeed: seed };
}

export function resolveRegencyComingOfAge(state: GameState): boolean {
  if (!state.royalSuccession?.regencyActive || state.royalSuccession.rank !== 'monarch' || state.age < 18) return false;
  const regent = state.royalSuccession.regentId ? state.npcs?.[state.royalSuccession.regentId] : undefined;
  if (regent) {
    regent.memories.push({ id: `regency_end_${state.age}_${regent.id}`, type: 'regency_completed', sourceId: 'player', targetId: regent.id, tick: state.age, intensity: 45, emotionalValue: 10, decayRate: 2, permanent: false });
  }
  state.royalSuccession.regencyActive = false;
  state.royalSuccession.regentId = undefined;
  state.flags.royal_regency_ended = true;
  return true;
}

export function abdicateRoyalty(state: GameState): boolean {
  if (state.origin?.status !== 'royal' || !state.royalSuccession || state.royalSuccession.rank === 'former_monarch') return false;
  state.royalSuccession.rank = 'former_monarch';
  state.royalSuccession.inheritanceEligible = false;
  state.royalSuccession.regencyActive = false;
  state.royalSuccession.regentId = undefined;
  state.royalAuthority = 0;
  state.personalFreedom = 100;
  if (state.royalLifestyle) state.royalLifestyle.active = false;
  state.flags.royal_abdicated = true;
  state.flags.former_royal = true;
  return true;
}
