/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Stats {
  health: number;
  smarts: number;
  looks: number;
  happiness: number;
  style: number;
  status: number;
}

export interface Reputation {
  family: number;
  college: number;
  online: number;
  workplace: number;
  dating: number;
}

export type RelationType = 'parent' | 'sibling' | 'cousin' | 'friend' | 'best_friend' | 'partner' | 'spouse' | 'affair' | 'rival' | 'mentor' | 'colleague' | 'supervisor' | 'classmate' | 'teacher' | 'pet';

export type ArchetypeType = 
  | 'loyal partner' 
  | 'jealous partner' 
  | 'controlling partner' 
  | 'supportive friend' 
  | 'toxic friend' 
  | 'rival' 
  | 'mentor' 
  | 'average';

export interface Relationship {
  id: string;
  name: string;
  relation: RelationType;
  archetype: ArchetypeType;
  age: number;
  gender: string;
  occupation: string;
  trust: number;       // 0 - 100
  suspicion: number;   // 0 - 100
  resentment: number;  // 0 - 100
  isDeceased?: boolean;
  yearsDeceased?: number;
  isEx?: boolean;
}

export interface DelayedEvent {
  eventId: string;
  triggerAge: number;
}

export interface EventCondition {
  minAge?: number;
  maxAge?: number;
  minStats?: Partial<Stats>;
  maxStats?: Partial<Stats>;
  minRep?: Partial<Reputation>;
  maxRep?: Partial<Reputation>;
  flagsTrue?: string[];
  flagsFalse?: string[];
  hasRelationshipType?: RelationType;
  hasRelationshipArchetype?: ArchetypeType;
  customCheck?: (state: GameState) => boolean;
}

export interface OutcomeEffect {
  statChanges?: Partial<Stats>;
  repChanges?: Partial<Reputation>;
  cashChange?: number;
  karmaChange?: number;
  willpowerChange?: number;
  flagsSet?: Record<string, any>;
  flagsRemove?: string[];
  scheduleDelayedEvent?: { eventId: string; delayYears: number };
  relationshipChanges?: {
    target: 'current' | 'all' | string; // 'current' targets relationship involved in event, otherwise ID
    trust?: number;
    suspicion?: number;
    resentment?: number;
  };
  logText?: string;
  outcomeText: string;
  cureIllness?: boolean;
}

export interface Choice {
  id: string;
  text: string;
  conditions?: EventCondition;
  effect?: OutcomeEffect; // Legacy single outcome
  outcomes?: { effect: OutcomeEffect; weight: number }[]; // New probability-based outcomes
}

export interface Event {
  id: string;
  title: string;
  text: string;
  category: 'general' | 'school' | 'career' | 'relationship' | 'random' | 'callback' | 'bully' | 'collision';
  conditions?: EventCondition;
  weight?: number; // default is 10
  choices: Choice[];
  involvedRelationshipType?: RelationType; // If set, the engine hooks a matching relationship into the event context
}

export interface Illness {
  id: string;
  name: string;
  type: 'minor' | 'chronic' | 'terminal';
  curable: boolean;
  cured: boolean;
  healthImpactPerYear: number;
  happinessImpactPerYear: number;
  discoveredAge: number;
  cureCost: number;
  remainingYears: number;
  baseCureChance: number;
}

export interface IllnessTemplate {
  id: string;
  name: string;
  type: 'minor' | 'chronic' | 'terminal';
  curable: boolean;
  healthImpactPerYear: number;
  happinessImpactPerYear: number;
  cureCost: number;
  minDuration: number;
  maxDuration: number;
  baseCureChance: number;
  requiresFlag?: string;
}

export interface AvatarConfig {
  eyes: string;
  eyebrows: string;
  mouth: string;
  skinColor: string;
  hairColor: string;
  facialHair: string;
  facialHairColor: string;
  top: string;
  eyesColorSimulated: string;
  lipsColorSimulated: string;
  makeupSimulated?: string;
}

export interface GameState {
  name: string;
  gender: string;
  avatar: string;
  avatarConfig?: AvatarConfig;
  location: string;
  age: number;
  alive: boolean;
  deathReason: string;
  cash: number;
  stats: Stats;
  reputation: Reputation;
  relationships: Relationship[];
  illnesses: Illness[];
  flags: Record<string, any>;
  delayedEvents: DelayedEvent[];
  log: string[];
  career: {
    type: 'unemployed' | 'school' | 'job';
    title: string;
    salary: number;
    performance: number;
    yearsInRole: number;
    educationLevel?: string;
    major?: string;
  };
  karma: number; // 0 - 100
  willpower: number; // 0 - 100
  currentEvent: Event | null;
  activeRelationshipContextId: string | null; // ID of relationship active in currentEvent
  recentEventIds: string[]; // Tracks last 6 events shown to prevent repeats
  lastOutcome: {
    choiceText: string;
    outcomeText: string;
    statChanges?: Partial<Stats>;
    repChanges?: Partial<Reputation>;
    cashChange?: number;
  } | null;
  completedEducation: { level: string; major: string }[];
}
