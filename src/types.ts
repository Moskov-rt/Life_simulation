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

export type RelationType = 'parent' | 'sibling' | 'child' | 'grandparent' | 'grandchild' | 'cousin' | 'friend' | 'best_friend' | 'partner' | 'spouse' | 'affair' | 'rival' | 'mentor' | 'colleague' | 'supervisor' | 'classmate' | 'teacher' | 'pet';

export type OriginId = 'commoner' | 'wealthy_family' | 'noble' | 'royal_family' | 'political_family' | 'celebrity_family';
export type RoyalRank = 'royal_child' | 'prince_princess' | 'heir' | 'monarch' | 'former_monarch';

export interface CharacterOrigin {
  id: OriginId;
  country: string;
  status: 'commoner' | 'wealthy' | 'noble' | 'royal' | 'political' | 'celebrity';
  successionPosition?: 'heir' | 'spare';
  publicAttention: number;
}

export interface RoyalSuccessionState {
  rank: RoyalRank;
  inheritanceEligible: boolean;
  regencyActive: boolean;
  regentId?: string;
  previousMonarchId?: string;
  lastProcessedDeathId?: string;
  successionDisputed?: boolean;
}

export interface RoyalLegacy {
  achievements: string[];
  reforms: string[];
  scandals: string[];
  relationshipMilestones: string[];
  approvalSnapshots: number[];
}

export interface RoyalBehavior {
  benevolent: number;
  ambitious: number;
  reckless: number;
  corrupt: number;
  ruthless: number;
}

/** Lightweight cross-generation record; kept on GameState for save compatibility. */
export interface FamilyLegacy {
  achievements: string[];
  wealthPassedDown: number;
  relationshipMilestones: string[];
  reputationSnapshots: number[];
}

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


export interface NPCTraits {
  confidence: number;
  kindness: number;
  intelligence: number;
  ambition: number;
  greed: number;
  honesty: number;
  loyalty: number;
  jealousy: number;
  patience: number;
  romanticInterest: number;
  aggressiveness: number;
  humor: number;
  responsibility: number;
  emotionalStability: number;
  generosity: number;
  riskTaking: number;
}

export interface NPCLifeState {
  happiness: number;
  stress: number;
  energy: number;
  health: number;
  confidence: number;
  socialSatisfaction: number;
  careerSatisfaction: number;
}

export interface NPCGoal {
  id: string;
  type: string;
  progress: number;
  active: boolean;
}

export interface NPCMemory {
  id: string;
  type: string;
  sourceId: string;
  targetId: string;
  tick: number;
  intensity: number;
  emotionalValue: number;
  decayRate: number;
  permanent: boolean;
}

export interface NPCLifestyle {
  home: string;
  car: string;
  savings: number;
  debt: number;
  netWorth: number;
  hobbies: string[];
  favoriteActivities: string[];
  shoppingHabits: 'frugal' | 'average' | 'luxurious';
  vacationFrequency: 'rare' | 'average' | 'frequent';
  exerciseHabits: 'none' | 'occasional' | 'frequent';
  smoking: boolean;
  alcoholUse: 'none' | 'social' | 'frequent' | 'addicted';
}

export interface NPCRelationLink {
  type: RelationType;
  closeness: number;
  trust: number;
  respect: number;
  attraction: number;
  resentment: number;
  compatibility: number;
}

export interface NPCMemoryFlag {
  year: number;
  event: string;
  choice: string;
}

export interface NPCInteractionHistory {
  year: number;
  playerToldTruth?: boolean;
  playerLied?: boolean;
  playerAvoided?: boolean;
}

export interface NPC extends Relationship {
  context?: string;
  orientation: 'straight' | 'gay' | 'bisexual' | 'asexual';
  nationality: string;
  education: string;
  income: number;
  traits: NPCTraits;
  lifeState: NPCLifeState;
  goals: NPCGoal[];
  memories: NPCMemory[];
  lifestyle: NPCLifestyle;
  npcRelations: Record<string, NPCRelationLink>;
  personality: string[];
  vectors: {
    trust: number;
    suspicion: number;
    knowledge: number;
    resentment: number;
    forgiveness: number;
  };
  memoryFlags: NPCMemoryFlag[];
  interactionHistory: NPCInteractionHistory[];
}

export interface DelayedEvent {
  eventId: string;
  triggerAge: number;
}

export interface FollowUpFlag {
  id: string;
  templateId: string;
  npcId: string;
  sourceEventId: string;
  createdYear: number;
  earliestTriggerYear: number;
  expiresYear: number;
  conditionId: string;
  triggerChance: number;
  escalationEventId: string;
}

export interface OngoingEffect {
  id: string;
  effectType: string;
  sourceId?: string;
  startYear: number;
  remainingYears: number | null;
  intensity: number;
}

export type PlayerTrait =
  | "guilt_prone"
  | "manipulative"
  | "family_oriented"
  | "independent"
  | "paranoid"
  | "shameless"
  | "empath";

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

export interface NPCMemoryEffect {
  type: string;
  intensity: number;
  emotionalValue: number;
  decayRate: number;
  permanent: boolean;
}

export type NarrativeTone = 'positive' | 'neutral' | 'negative' | 'chaotic';

export type WealthBand = 'struggling' | 'lower_class' | 'middle_class' | 'wealthy' | 'rich' | 'elite' | 'stable' | 'comfortable';

export type LifestyleLevel = Exclude<WealthBand, 'stable' | 'comfortable'>;
export type SpendingStyle = 'survival' | 'careful' | 'balanced' | 'discretionary' | 'luxury' | 'exclusive';

export interface LifestyleState {
  lifestyleLevel: LifestyleLevel;
  spendingStyle: SpendingStyle;
  financialStress: number;
}

export type CareerGroup = 'actor' | 'creator' | 'adult_performer' | 'medical' | 'corporate' | 'education' | 'unemployed';

export interface NarrativeVariant {
  text: string;
  minAge?: number;
  maxAge?: number;
  careers?: string[];
  careerGroups?: CareerGroup[];
  wealthBands?: WealthBand[];
  lifestyleLevels?: LifestyleLevel[];
  spendingStyles?: SpendingStyle[];
  minFinancialStress?: number;
  maxFinancialStress?: number;
  minFame?: number;
  maxFame?: number;
  minReputation?: Partial<Reputation>;
  relationshipTypes?: RelationType[];
  npcArchetypes?: ArchetypeType[];
  npcTraitsAny?: Array<keyof NPCTraits>;
  npcTraitsAll?: Array<keyof NPCTraits>;
  npcPersonalityAny?: string[];
  npcPersonalityAll?: string[];
  memoryTypesAny?: string[];
  memoryTypesAll?: string[];
  memorySentiment?: 'positive' | 'negative';
  minMemoryIntensity?: number;
  requiredFlags?: string[];
  excludedFlags?: string[];
  previousEventIds?: string[];
  minRelationshipTrust?: number;
  maxRelationshipTrust?: number;
  minRelationshipSuspicion?: number;
  maxRelationshipSuspicion?: number;
  minRelationshipResentment?: number;
  maxRelationshipResentment?: number;
  minRelationshipYears?: number;
  maxRelationshipYears?: number;
  minAuthority?: number;
  maxAuthority?: number;
  minFear?: number;
  maxFear?: number;
  minIntegrity?: number;
  maxIntegrity?: number;
  royalTendencies?: Partial<RoyalBehavior>;
}

export interface OutcomeEffect {
  statChanges?: Partial<Stats> & { karma?: number; willpower?: number; cashChange?: number };
  repChanges?: Partial<Reputation>;
  cashChange?: number;
  approvalChange?: number;
  authorityChange?: number;
  personalFreedomChange?: number;
  fearChange?: number;
  integrityChange?: number;
  royalTendencyChanges?: Partial<RoyalBehavior>;
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
    knowledge?: number;
    forgiveness?: number;
  };
  memory?: NPCMemoryEffect;
  narrativeVariants?: Partial<Record<NarrativeTone, NarrativeVariant[]>>;
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

export interface SocialMediaAccount {
  signedUp: boolean;
  followers: number;
  verified: boolean;
  suspended: boolean;
  postsCount: number;
  subscribers?: number; // OnlyFans specific
  subscriptionPrice?: number; // OnlyFans specific
  monetized?: boolean; // YouTube, Twitch, TikTok specific
  tipsCollected?: boolean; // OnlyFans specific (resets yearly)
  wishlistPosted?: boolean; // OnlyFans specific (resets yearly)
}

export type CreatorPlatform = 'creator_platform';
export type CreatorContentStyle = 'anonymous' | 'suggestive' | 'explicit';
export type CreatorTier = 'beginner' | 'rising' | 'established' | 'top_creator';

/**
 * Actions selected during a year. Their outcomes are resolved only by the
 * yearly simulation; they deliberately do not duplicate social-media state.
 */
export interface CreatorYearlyActions {
  publishCount: number;
  livestreamCount: number;
  collaborationCount: number;
  promotionCount: number;
  privacyImprovementCount: number;
}

export interface CreatorProfile {
  platform: CreatorPlatform;
  contentStyle: CreatorContentStyle;
  tier: CreatorTier;
  contentQuality: number;
  consistency: number;
  yearlyActions: CreatorYearlyActions;
  milestones: Record<string, boolean>;
}

export interface CreatorCareer {
  active: boolean;
  profile: CreatorProfile | null;
}

export interface AdultPerformerYearlyActions {
  performCount: number;
  collaborationCount: number;
  promotionCount: number;
  networkingCount: number;
  skillCount: number;
  privacyCount: number;
  restCount: number;
}

export interface ActorYearlyActions {
  auditionCount: number;
  rolesAccepted: number;
  networkCount: number;
  promoteCount: number;
  trainCount: number;
  restCount: number;
}

export interface RoyalYearlyActions {
  education: number;
  familyTime: number;
  ignoreLessons: number;
  publicAppearance: number;
  privateFriendship: number;
  rebellion: number;
  relationshipChoice: number;
  charity: number;
  diplomacy: number;
  ceremony: number;
  speech: number;
  publicService: number;
  freedom: number;
}

export interface RoyalLifestyle {
  active: boolean;
  yearlyActions: RoyalYearlyActions;
}

export type EducationLevel = 'none' | 'primary' | 'secondary' | 'university' | 'graduate';

export interface EducationState {
  level: EducationLevel;
  grades: number;
  discipline: number;
  academicReputation: number;
  major?: string;
  enrolled: boolean;
  scholarship: boolean;
  interests: {
    academics: number;
    popularity: number;
    creativity: number;
    sports: number;
    relationships: number;
  };
}

export interface AdultPerformerCareer {
  active: boolean;
  consistency: number;
  yearlyActions: AdultPerformerYearlyActions;
}

export interface ActorCareer {
  active: boolean;
  consistency: number;
  yearlyActions: ActorYearlyActions;
}

export interface SecretExposure {
  isActive: boolean;
  level: number; // 0-100
  heat: number;
  history: number[];
  ignoredCount: Record<string, number>;
  npcAwareness: Record<string, {
    status: 'unaware' | 'suspicious' | 'knows_partial' | 'knows_full';
    level: number; // 0-100
  }>;
  recentChanges: {
    posts: number;
    collabs: number;
    mitigation: number;
    locationMultiplier: number;
    luck: number;
  };
}

export interface GameState {
  name: string;
  gender: string;
  avatar: string;
  avatarConfig?: AvatarConfig;
  location: string;
  origin?: CharacterOrigin;
  royalSuccession?: RoyalSuccessionState;
  familyWealth?: number;
  familyInheritance?: number;
  familyAssets?: string[];
  familyLegacy?: FamilyLegacy;
  allowance?: number;
  publicApproval?: number;
  royalAuthority?: number;
  personalFreedom?: number;
  royalLegacy?: RoyalLegacy;
  royalBehavior?: RoyalBehavior;
  publicFear?: number;
  royalIntegrity?: number;
  age: number;
  alive: boolean;
  deathReason: string;
  cash: number;
  stats: Stats;
  reputation: Reputation;
  fame: number;
  saveVersion?: number;
  rngSeed?: number;
  npcs: Record<string, NPC>;
  relationships: Relationship[];
  illnesses: Illness[];
  flags: Record<string, any>;
  delayedEvents: DelayedEvent[];
  followUpFlags: FollowUpFlag[];
  ongoingEffects: OngoingEffect[];
  personalityTraits: PlayerTrait[];
  log: string[];
  career: {
    type: 'unemployed' | 'school' | 'job';
    title: string;
    salary: number;
    performance: number;
    yearsInRole: number;
    tier?: number;
    educationLevel?: string;
    major?: string;
    employer?: string;
    workHarderCount?: number;
    hoursPerWeek?: number;
    track?: 'adult_performer' | 'actor';
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
  education?: EducationState;
  lifestyle?: LifestyleState;
  socialMedia: Record<string, SocialMediaAccount>;
  creatorCareer?: CreatorCareer;
  adultPerformerCareer?: AdultPerformerCareer;
  actorCareer?: ActorCareer;
  royalLifestyle?: RoyalLifestyle;
  secretExposure?: SecretExposure;
}
