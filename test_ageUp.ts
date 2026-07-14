import assert from 'assert';
import { runYearlySimulation } from './src/utils/ageUpSimulator';
import { GameState } from './src/types';
import { EVENTS_POOL } from './src/events';
import { applyChoiceResultToNPC, resolveChoice } from './src/utils/choiceResolver';
import { calculateStatCascades } from './src/utils/statCascades';
import { processOngoingEffects } from './src/utils/ongoingEffects';
import { relationshipToNPC } from './src/utils/saveMigration';

// Mock dependencies
const context = {
  INFANT_ILLNESSES: [],
  MINOR_ILLNESSES: [],
  CHRONIC_ILLNESSES: [],
  TERMINAL_ILLNESSES: [],
  };
const initialState: GameState = {
  name: 'Test', gender: 'Other', avatar: '', location: 'Test City', age: 5, alive: true, deathReason: '', cash: 1000,
  stats: { health: 50, smarts: 50, looks: 50, happiness: 50, style: 50, status: 50 },
  reputation: { family: 50, college: 50, online: 0, workplace: 50, dating: 50 }, fame: 0,
  npcs: {}, relationships: [], illnesses: [], flags: {}, delayedEvents: [], followUpFlags: [], ongoingEffects: [], personalityTraits: [], log: [],
  career: { type: 'school', title: 'Primary School Student', salary: 0, performance: 50, yearsInRole: 0 }, karma: 50, willpower: 50,
  currentEvent: null, activeRelationshipContextId: null, recentEventIds: [], lastOutcome: null, completedEducation: [], socialMedia: {}, rngSeed: 2024
};
const schoolContext = { ...context, MINOR_ILLNESSES: [{ id: 'test_minor', name: 'Test Cold', description: '', type: 'minor' as const, curable: true, healthImpactPerYear: 1, happinessImpactPerYear: 1, cureCost: 0, minDuration: 1, maxDuration: 1, baseCureChance: 1 }] };
const schoolState = structuredClone(initialState);
schoolState.age = 5;
schoolState.career = { type: 'school', title: 'Primary School Student', salary: 0, yearsInRole: 0, performance: 50 };
schoolState.rngSeed = 2024;
const existingParent = relationshipToNPC({ id: 'persistent_parent', name: 'Persistent Parent', relation: 'parent' });
existingParent.vectors = { trust: 10, suspicion: 20, knowledge: 30, resentment: 10, forgiveness: 50 };
existingParent.memories.push({ id: 'existing_memory', type: 'family_event', sourceId: 'test', targetId: existingParent.id, tick: 4, intensity: 50, emotionalValue: 20, decayRate: 1, permanent: true });
schoolState.npcs = { [existingParent.id]: existingParent };
schoolState.relationships = [existingParent];

const schoolResult = runYearlySimulation(schoolState, schoolContext);
const repeatedSchoolResult = runYearlySimulation(schoolState, schoolContext);
const differentSeedState = structuredClone(schoolState);
differentSeedState.rngSeed = 2025;
const differentSchoolResult = runYearlySimulation(differentSeedState, schoolContext);
const generatedContacts = schoolResult.updatedState.relationships.filter(relationship => relationship.relation === 'classmate');
const repeatedContacts = repeatedSchoolResult.updatedState.relationships.filter(relationship => relationship.relation === 'classmate');
const differentContacts = differentSchoolResult.updatedState.relationships.filter(relationship => relationship.relation === 'classmate');
assert.deepStrictEqual(generatedContacts, repeatedContacts, 'Same state and RNG seed generated different school contacts');
assert.notDeepStrictEqual(generatedContacts, differentContacts, 'Different RNG seeds generated identical school contacts');
assert.deepStrictEqual(schoolResult.updatedState, repeatedSchoolResult.updatedState, 'Same seed did not produce the same NPC world');
assert.ok(generatedContacts.every(contact => schoolResult.updatedState.npcs[contact.id].context === 'school'), 'Generated NPCs were not assigned to the school context');
assert.deepStrictEqual(schoolResult.updatedState.npcs[existingParent.id].memories, existingParent.memories, 'NPC memories did not persist');
assert.deepStrictEqual(schoolResult.updatedState.npcs[existingParent.id].vectors, { trust: 10, suspicion: 19.3, knowledge: 30, resentment: 9.3, forgiveness: 51.4 }, 'NPC relationship vectors or yearly drift changed unexpectedly');
assert.strictEqual(schoolResult.updatedState.npcs[existingParent.id].age, existingParent.age + 1, 'Yearly NPC drift ran more than once');
const reloadedSchoolState = JSON.parse(JSON.stringify(schoolResult.updatedState)) as GameState;
assert.deepStrictEqual(reloadedSchoolState.npcs[existingParent.id].memories, existingParent.memories, 'Save/load did not preserve NPC memories');
assert.deepStrictEqual(reloadedSchoolState.npcs[existingParent.id].vectors, schoolResult.updatedState.npcs[existingParent.id].vectors, 'Save/load did not preserve NPC vectors');
assert.strictEqual(reloadedSchoolState.npcs[generatedContacts[0].id].context, 'school', 'Save/load did not preserve NPC context assignment');
const leavingSchoolState = structuredClone(schoolResult.updatedState);
leavingSchoolState.career = { type: 'unemployed', title: 'Unemployed', salary: 0, yearsInRole: 0, performance: 0 };
const leavingSchoolResult = runYearlySimulation(leavingSchoolState, schoolContext);
assert.strictEqual(leavingSchoolResult.updatedState.relationships.some(relationship => relationship.relation === 'classmate' || relationship.relation === 'teacher'), false, 'Leaving school retained active school links');
assert.strictEqual(leavingSchoolResult.updatedState.npcs[generatedContacts[0].id].context, undefined, 'Leaving school removed canonical NPC records');

const actorState = structuredClone(initialState);
actorState.age = 24;
actorState.cash = 1_000;
actorState.fame = 80;
actorState.reputation.online = 100;
actorState.career = { type: 'job', title: 'Extra', salary: 15_000, performance: 100, yearsInRole: 0, tier: 1, track: 'actor' };
actorState.actorCareer = {
  active: true,
  consistency: 0,
  yearlyActions: { auditionCount: 2, rolesAccepted: 5, networkCount: 1, promoteCount: 1, trainCount: 2, restCount: 0 }
};
actorState.rngSeed = 404;
const actorResult = runYearlySimulation(actorState, context);
const repeatedActorResult = runYearlySimulation(actorState, context);
assert.deepStrictEqual(actorResult.updatedState, repeatedActorResult.updatedState, 'Actor simulation was not deterministic');
assert.strictEqual(actorResult.updatedState.career.title, 'Legend', 'Actor tier progression did not reach the expected title');
assert.strictEqual(actorResult.updatedState.career.salary, 2_000_000, 'Actor progression did not apply the tier salary');
assert.strictEqual(actorResult.ageUpData.earnedCash, 2_000_000, 'Actor income was not aggregated exactly once');
assert.strictEqual(actorResult.updatedState.cash, 1_501_000, 'Actor take-home pay was not applied correctly after expenses');
assert.ok(actorResult.updatedState.fame > actorState.fame, 'Actor actions did not increase fame');
assert.deepStrictEqual(actorResult.updatedState.actorCareer?.yearlyActions, { auditionCount: 0, rolesAccepted: 0, networkCount: 0, promoteCount: 0, trainCount: 0, restCount: 0 }, 'Actor yearly actions were not reset');
console.log('âœ… deterministic school contact generation');
