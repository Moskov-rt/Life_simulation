import { CharacterOrigin, OriginId, Relationship } from '../types';
import { nextRandom } from './seededRandom';

export interface CountryMetadata {
  name: string;
  regions: string[];
  monarchyAvailable: boolean;
  availableOrigins: OriginId[];
}

export const COUNTRY_METADATA: Record<string, CountryMetadata> = {
  'United Kingdom': { name: 'United Kingdom', regions: ['England', 'Scotland', 'Wales', 'Northern Ireland'], monarchyAvailable: true, availableOrigins: ['commoner', 'wealthy_family', 'noble', 'royal_family'] },
  Japan: { name: 'Japan', regions: ['Kanto', 'Kansai', 'Tohoku', 'Kyushu'], monarchyAvailable: true, availableOrigins: ['commoner', 'royal_family'] },
  'United States': { name: 'United States', regions: ['California', 'New York', 'Texas', 'Florida'], monarchyAvailable: false, availableOrigins: ['commoner', 'wealthy_family', 'political_family'] },
  Germany: { name: 'Germany', regions: ['Bavaria', 'Berlin', 'Hesse', 'Saxony'], monarchyAvailable: false, availableOrigins: ['commoner', 'wealthy_family'] },
  Australia: { name: 'Australia', regions: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'], monarchyAvailable: false, availableOrigins: ['commoner', 'wealthy_family'] },
  India: { name: 'India', regions: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'], monarchyAvailable: false, availableOrigins: ['commoner', 'wealthy_family', 'political_family'] }
};

const FALLBACK_COUNTRY: CountryMetadata = { name: 'Unknown', regions: [], monarchyAvailable: false, availableOrigins: ['commoner'] };

export function getCountryMetadata(country: string): CountryMetadata {
  return COUNTRY_METADATA[country] || FALLBACK_COUNTRY;
}

export function getAvailableOrigins(country: string): OriginId[] {
  return [...getCountryMetadata(country).availableOrigins];
}

export function originLabel(origin: OriginId): string {
  return ({ commoner: 'Commoner', wealthy_family: 'Wealthy Family', noble: 'Noble Family', royal_family: 'Royal Family', political_family: 'Political Family', celebrity_family: 'Celebrity Family' } as Record<OriginId, string>)[origin];
}

function relation(id: string, name: string, relationType: Relationship['relation'], age: number, occupation: string, archetype: Relationship['archetype']): Relationship {
  return { id, name, relation: relationType, archetype, age, gender: id.includes('mother') ? 'Female' : 'Male', occupation, trust: 90, suspicion: 0, resentment: 0 };
}

export interface OriginProfile {
  origin: CharacterOrigin;
  startingCash: number;
  familyWealth: number;
  allowance: number;
  publicApproval: number;
  reputationBonus: number;
  familyMembers: Relationship[];
  flags: Record<string, boolean | string>;
  nextSeed: number;
}

/** Deterministically materializes only starting-origin consequences. */
export function createOriginProfile(origin: OriginId, country: string, seed = 1): OriginProfile {
  const metadata = getCountryMetadata(country);
  const validOrigin = metadata.availableOrigins.includes(origin) ? origin : 'commoner';
  const roll = nextRandom(seed);
  const status = validOrigin === 'royal_family' ? 'royal' : validOrigin === 'wealthy_family' ? 'wealthy' : validOrigin === 'noble' ? 'noble' : validOrigin === 'political_family' ? 'political' : validOrigin === 'celebrity_family' ? 'celebrity' : 'commoner';
  const isRoyal = validOrigin === 'royal_family';
  const familyMembers: Relationship[] = isRoyal
    ? [
        relation('royal_mother', 'Queen Mother', 'parent', 38 + Math.floor(roll.value * 8), 'Royal Family', 'mentor'),
        relation('royal_father', 'King Father', 'parent', 40 + Math.floor(roll.value * 8), 'Head of State', 'mentor'),
        relation('royal_relative', 'Royal Cousin', 'cousin', 22 + Math.floor(roll.value * 10), 'Royal Household', 'average'),
        relation('royal_advisor', 'Royal Advisor', 'mentor', 52, 'Privy Advisor', 'mentor'),
        relation('royal_tutor', 'Private Tutor', 'teacher', 45, 'Court Tutor', 'mentor'),
        relation('royal_staff', 'Household Steward', 'supervisor', 48, 'Royal Household Staff', 'average')
      ]
    : [];
  const heir = isRoyal && roll.value < 0.5;
  return {
    origin: { id: validOrigin, country: metadata.name, status, successionPosition: heir ? 'heir' : isRoyal ? 'spare' : undefined, publicAttention: isRoyal ? (heir ? 90 : 65) : validOrigin === 'celebrity_family' ? 45 : validOrigin === 'political_family' ? 30 : 0 },
    startingCash: validOrigin === 'royal_family' ? 15000 : validOrigin === 'wealthy_family' ? 75000 : validOrigin === 'noble' ? 30000 : validOrigin === 'political_family' ? 15000 : validOrigin === 'celebrity_family' ? 20000 : 0,
    familyWealth: validOrigin === 'royal_family' ? 2500000 : validOrigin === 'wealthy_family' ? 500000 : validOrigin === 'noble' ? 150000 : validOrigin === 'political_family' ? 100000 : validOrigin === 'celebrity_family' ? 250000 : 0,
    allowance: validOrigin === 'royal_family' ? 5000 : validOrigin === 'wealthy_family' ? 1500 : validOrigin === 'noble' ? 500 : 0,
    publicApproval: isRoyal ? 65 : validOrigin === 'noble' ? 55 : validOrigin === 'celebrity_family' ? 45 : 50,
    reputationBonus: isRoyal ? 25 : validOrigin === 'noble' || validOrigin === 'celebrity_family' ? 12 : validOrigin === 'political_family' ? 8 : 0,
    familyMembers,
    flags: { [`origin_${validOrigin}`]: true, ...(isRoyal ? { royal_status: true, succession_position: heir ? 'heir' : 'spare' } : {}) },
    nextSeed: roll.nextSeed
  };
}
