import { CareerGroup, GameState, NPC, NarrativeTone, NarrativeVariant, OutcomeEffect, Reputation } from '../types';
import { ChoiceResult } from './choiceResolver';
import { nextRandom } from './seededRandom';
import { deriveLifestyle, getWealthBand, wealthBandMatches } from './wealthIdentity';

const numericValues = (record?: object): number[] => record ? Object.values(record).filter((value): value is number => typeof value === 'number') : [];
const NARRATIVE_TRAIT_THRESHOLD = 60;
const normalizeLabel = (value: string): string => value.trim().toLowerCase();

export { getWealthBand } from './wealthIdentity';

export function getCareerGroup(career: GameState['career']): CareerGroup {
  const title = (career.title || '').toLowerCase();
  const track = (career.track || '').toLowerCase();
  if (track === 'actor' || title.includes('actor') || title === 'star' || title === 'legend' || title === 'extra') return 'actor';
  if (track === 'creator' || title.includes('creator')) return 'creator';
  if (track === 'adult_performer' || title.includes('adult') || title.includes('escort') || title.includes('webcam')) return 'adult_performer';
  if (career.type === 'unemployed' || title.includes('unemployed')) return 'unemployed';
  if (title.includes('doctor') || title.includes('nurse') || title.includes('medical') || title.includes('surgeon') || title.includes('hospital')) return 'medical';
  if (career.type === 'school' || title.includes('school') || title.includes('student') || title.includes('teacher') || title.includes('professor')) return 'education';
  return 'corporate';
}

export function getRelationshipHistoryYears(currentAge: number, npc?: NPC): number {
  if (!npc) return 0;
  const knownYears = [
    ...(npc.memories || []).map(memory => memory.tick),
    ...(npc.interactionHistory || []).map(interaction => interaction.year),
    ...(npc.memoryFlags || []).map(flag => flag.year)
  ].filter(year => Number.isFinite(year) && year <= currentAge);
  return knownYears.length > 0 ? Math.max(0, currentAge - Math.min(...knownYears)) : 0;
}

export function determineOutcomeTone(effect: OutcomeEffect, result?: ChoiceResult): NarrativeTone {
  let positive = 0;
  let negative = 0;
  const collect = (value: number) => { if (value > 0) positive += value; else negative += Math.abs(value); };
  numericValues((result?.statChanges || effect.statChanges) as object).forEach(collect);
  numericValues((result?.repChanges || effect.repChanges) as object).forEach(collect);
  collect(effect.cashChange || 0);
  collect(effect.approvalChange || 0);
  collect(effect.authorityChange || 0);
  collect(effect.fearChange || 0);
  collect(effect.integrityChange || 0);
  collect(effect.karmaChange || 0);
  collect(effect.willpowerChange || 0);
  const relationship = result?.relationshipChanges || effect.relationshipChanges;
  if (relationship) {
    collect(relationship.trust || 0);
    collect(-(relationship.suspicion || 0));
    collect(-(relationship.resentment || 0));
    collect(relationship.forgiveness || 0);
  }
  if (positive >= 5 && negative >= 5) return 'chaotic';
  if (positive > negative + 2) return 'positive';
  if (negative > positive + 2) return 'negative';
  return 'neutral';
}

function matchesContext(variant: NarrativeVariant, state: GameState, npc?: NPC): boolean {
  const careerKeys = [state.career.title, state.career.type, state.career.track].filter(Boolean) as string[];
  const memories = npc?.memories || [];
  const relationshipYears = getRelationshipHistoryYears(state.age, npc);
  const expressedTraits = new Set(Object.entries(npc?.traits || {})
    .filter(([, value]) => typeof value === 'number' && value >= NARRATIVE_TRAIT_THRESHOLD)
    .map(([trait]) => trait));
  const personalityLabels = new Set(npc ? [npc.archetype, ...(npc.personality || [])].map(normalizeLabel) : []);
  if (variant.minAge !== undefined && state.age < variant.minAge) return false;
  if (variant.maxAge !== undefined && state.age > variant.maxAge) return false;
  if (variant.careers && !variant.careers.some(career => careerKeys.includes(career))) return false;
  if (variant.careerGroups && !variant.careerGroups.includes(getCareerGroup(state.career))) return false;
  const lifestyle = state.lifestyle || deriveLifestyle(state);
  const wealthBand = getWealthBand(state.cash);
  if (variant.wealthBands && !variant.wealthBands.some(band => wealthBandMatches(wealthBand, band))) return false;
  if (variant.lifestyleLevels && (!lifestyle || !variant.lifestyleLevels.includes(lifestyle.lifestyleLevel))) return false;
  if (variant.spendingStyles && (!lifestyle || !variant.spendingStyles.includes(lifestyle.spendingStyle))) return false;
  if (variant.minFinancialStress !== undefined && (lifestyle?.financialStress ?? 0) < variant.minFinancialStress) return false;
  if (variant.maxFinancialStress !== undefined && (lifestyle?.financialStress ?? 0) > variant.maxFinancialStress) return false;
  if (variant.minFame !== undefined && state.fame < variant.minFame) return false;
  if (variant.maxFame !== undefined && state.fame > variant.maxFame) return false;
  if (variant.minAuthority !== undefined && (state.royalAuthority ?? 0) < variant.minAuthority) return false;
  if (variant.maxAuthority !== undefined && (state.royalAuthority ?? 0) > variant.maxAuthority) return false;
  if (variant.minFear !== undefined && (state.publicFear ?? 0) < variant.minFear) return false;
  if (variant.maxFear !== undefined && (state.publicFear ?? 0) > variant.maxFear) return false;
  if (variant.minIntegrity !== undefined && (state.royalIntegrity ?? 50) < variant.minIntegrity) return false;
  if (variant.maxIntegrity !== undefined && (state.royalIntegrity ?? 50) > variant.maxIntegrity) return false;
  if (variant.royalTendencies && Object.entries(variant.royalTendencies).some(([key, minimum]) => (state.royalBehavior?.[key as keyof typeof state.royalBehavior] || 0) < (minimum || 0))) return false;
  if (variant.minReputation && Object.entries(variant.minReputation).some(([key, minimum]) => state.reputation[key as keyof Reputation] < (minimum || 0))) return false;
  if (variant.relationshipTypes && (!npc || !variant.relationshipTypes.includes(npc.relation))) return false;
  if (variant.npcArchetypes && (!npc || !variant.npcArchetypes.includes(npc.archetype))) return false;
  if (variant.npcTraitsAny && !variant.npcTraitsAny.some(trait => expressedTraits.has(trait))) return false;
  if (variant.npcTraitsAll && !variant.npcTraitsAll.every(trait => expressedTraits.has(trait))) return false;
  if (variant.npcPersonalityAny && !variant.npcPersonalityAny.some(label => personalityLabels.has(normalizeLabel(label)))) return false;
  if (variant.npcPersonalityAll && !variant.npcPersonalityAll.every(label => personalityLabels.has(normalizeLabel(label)))) return false;
  if (variant.memoryTypesAny && !variant.memoryTypesAny.some(type => memories.some(memory => memory.type === type))) return false;
  if (variant.memoryTypesAll && !variant.memoryTypesAll.every(type => memories.some(memory => memory.type === type))) return false;
  if (variant.memorySentiment === 'positive' && !memories.some(memory => memory.emotionalValue > 0)) return false;
  if (variant.memorySentiment === 'negative' && !memories.some(memory => memory.emotionalValue < 0)) return false;
  if (variant.minMemoryIntensity !== undefined && !memories.some(memory => memory.intensity >= variant.minMemoryIntensity)) return false;
  if (variant.requiredFlags && !variant.requiredFlags.every(flag => Boolean(state.flags[flag]))) return false;
  if (variant.excludedFlags && variant.excludedFlags.some(flag => Boolean(state.flags[flag]))) return false;
  if (variant.previousEventIds && !variant.previousEventIds.some(eventId => (state.recentEventIds || []).includes(eventId))) return false;
  if (variant.minRelationshipTrust !== undefined && (!npc || npc.trust < variant.minRelationshipTrust)) return false;
  if (variant.maxRelationshipTrust !== undefined && (!npc || npc.trust > variant.maxRelationshipTrust)) return false;
  if (variant.minRelationshipSuspicion !== undefined && (!npc || npc.suspicion < variant.minRelationshipSuspicion)) return false;
  if (variant.maxRelationshipSuspicion !== undefined && (!npc || npc.suspicion > variant.maxRelationshipSuspicion)) return false;
  if (variant.minRelationshipResentment !== undefined && (!npc || npc.resentment < variant.minRelationshipResentment)) return false;
  if (variant.maxRelationshipResentment !== undefined && (!npc || npc.resentment > variant.maxRelationshipResentment)) return false;
  if (variant.minRelationshipYears !== undefined && (!npc || relationshipYears < variant.minRelationshipYears)) return false;
  if (variant.maxRelationshipYears !== undefined && (!npc || relationshipYears > variant.maxRelationshipYears)) return false;
  return true;
}

export interface NarrativeVariantResolution {
  text: string;
  tone: NarrativeTone;
  selected: boolean;
  nextSeed: number;
}

export function resolveNarrativeVariant(effect: OutcomeEffect, result: ChoiceResult | undefined, state: GameState, npc?: NPC): NarrativeVariantResolution {
  const tone = determineOutcomeTone(effect, result);
  const variants = effect.narrativeVariants?.[tone]?.filter(variant => matchesContext(variant, state, npc)) || [];
  if (variants.length === 0) return { text: effect.outcomeText, tone, selected: false, nextSeed: state.rngSeed ?? 1 };
  const random = nextRandom(state.rngSeed ?? 1);
  return { text: variants[Math.floor(random.value * variants.length)].text, tone, selected: true, nextSeed: random.nextSeed };
}
