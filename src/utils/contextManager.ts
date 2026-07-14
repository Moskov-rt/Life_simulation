import { GameState, Relationship, RelationType } from '../types';
import { relationshipToNPC } from './saveMigration';

const MALE_NAMES = ['Aleksander', 'Bruno', 'Ignacy', 'Kacper', 'Kamil', 'Marek', 'Tomasz', 'Dawid', 'Jan', 'Piotr'];
const FEMALE_NAMES = ['Hui-wen', 'Karolina', 'Zofia', 'Aneta', 'Sylwia', 'Anna', 'Katarzyna', 'Maria', 'Agnieszka'];
const SURNAMES = ['Sawicki', 'Adamski', 'Jen', 'Dabrowski', 'Gorski', 'Szczepanski', 'Nowak', 'Kowalski', 'Wisniewski', 'Kaminski', 'Lewandowski', 'Zielinski'];

export interface ContextRoleConfig {
  relation: RelationType;
  capacity: number;
  retentionRate: number;
  generate: (state: GameState, roll: () => number) => Relationship[];
}

export interface ContextConfig {
  type: string;
  active: (state: GameState) => boolean;
  roles: ContextRoleConfig[];
}

function getRandomName(roll: () => number, gender: 'Male' | 'Female'): string {
  const firstNames = gender === 'Male' ? MALE_NAMES : FEMALE_NAMES;
  return `${firstNames[Math.floor(roll() * firstNames.length)]} ${SURNAMES[Math.floor(roll() * SURNAMES.length)]}`;
}

export function generateSchoolContacts(isHighSchool: boolean, roll: () => number): Relationship[] {
  const contacts: Relationship[] = [];
  for (let i = 0; i < 6; i++) {
    const gender = roll() < 0.5 ? 'Male' : 'Female';
    contacts.push({
      id: `classmate_${Math.floor(roll() * 1000000000)}_${i}`,
      name: getRandomName(roll, gender), relation: 'classmate',
      archetype: roll() < 0.2 ? 'toxic friend' : roll() < 0.2 ? 'rival' : 'average',
      age: isHighSchool ? Math.floor(roll() * 3) + 14 : Math.floor(roll() * 3) + 6,
      gender, occupation: 'Student', trust: Math.floor(roll() * 40) + 30,
      suspicion: Math.floor(roll() * 20), resentment: Math.floor(roll() * 20)
    });
  }
  const gender = roll() < 0.5 ? 'Male' : 'Female';
  contacts.push({
    id: `teacher_${Math.floor(roll() * 1000000000)}`,
    name: `${gender === 'Male' ? 'Mr.' : 'Mrs.'} ${SURNAMES[Math.floor(roll() * SURNAMES.length)]}`,
    relation: 'teacher', archetype: roll() < 0.3 ? 'mentor' : 'average',
    age: Math.floor(roll() * 30) + 25, gender,
    occupation: isHighSchool ? 'High School Teacher' : 'Primary Teacher',
    trust: Math.floor(roll() * 30) + 40, suspicion: Math.floor(roll() * 15), resentment: Math.floor(roll() * 10)
  });
  return contacts;
}

export function generateWorkplaceContacts(state: GameState, roll: () => number): Relationship[] {
  const contacts: Relationship[] = [];
  for (let i = 0; i < 3; i++) {
    const gender = roll() < 0.5 ? 'Male' : 'Female';
    contacts.push({
      id: `colleague_${Math.floor(roll() * 1000000000)}_${i}`, name: getRandomName(roll, gender),
      relation: 'colleague', archetype: roll() < 0.15 ? 'rival' : roll() < 0.2 ? 'supportive friend' : 'average',
      age: Math.max(18, state.age + Math.floor(roll() * 20) - 10), gender, occupation: 'Coworker',
      trust: Math.floor(roll() * 30) + 35, suspicion: Math.floor(roll() * 20), resentment: Math.floor(roll() * 15)
    });
  }
  const gender = roll() < 0.5 ? 'Male' : 'Female';
  contacts.push({
    id: `supervisor_${Math.floor(roll() * 1000000000)}`, name: getRandomName(roll, gender),
    relation: 'supervisor', archetype: roll() < 0.2 ? 'mentor' : 'average',
    age: Math.max(25, state.age + Math.floor(roll() * 15) + 5), gender, occupation: 'Manager',
    trust: Math.floor(roll() * 30) + 40, suspicion: Math.floor(roll() * 25), resentment: Math.floor(roll() * 10)
  });
  return contacts;
}

export const CONTEXT_CONFIGS: ContextConfig[] = [
  {
    type: 'school',
    active: state => state.career.type === 'school',
    roles: [
      { relation: 'classmate', capacity: 6, retentionRate: 0.85, generate: (state, roll) => generateSchoolContacts(state.age >= 12, roll) },
      { relation: 'teacher', capacity: 1, retentionRate: 1, generate: (state, roll) => generateSchoolContacts(state.age >= 12, roll) }
    ]
  },
  {
    type: 'workplace',
    active: state => state.career.type === 'job' && state.career.salary > 0,
    roles: [
      { relation: 'colleague', capacity: 3, retentionRate: 0.9, generate: (state, roll) => generateWorkplaceContacts(state, roll) },
      { relation: 'supervisor', capacity: 1, retentionRate: 1, generate: (state, roll) => generateWorkplaceContacts(state, roll) }
    ]
  }
];

export function processContextTurnover(state: GameState, roll: () => number, configs: ContextConfig[] = CONTEXT_CONFIGS): void {
  const npcs = Object.values(state.npcs || {});
  const activeTypes = new Set(configs.filter(config => config.active(state)).map(config => config.type));

  for (const config of configs) {
    const isActive = activeTypes.has(config.type);
    for (const role of config.roles) {
      let candidates = npcs.filter(npc => npc.context === config.type && npc.relation === role.relation && !npc.isDeceased);
      if (isActive) {
        npcs.filter(npc => !npc.context && npc.relation === role.relation && !npc.isDeceased).forEach(npc => {
          npc.context = config.type;
          candidates.push(npc);
        });
        const retained = candidates.filter(() => roll() < role.retentionRate).slice(0, role.capacity);
        retained.forEach(npc => { npc.context = config.type; });
        candidates.filter(npc => !retained.includes(npc)).forEach(npc => { delete npc.context; });
        while (retained.length < role.capacity) {
          const generated = role.generate(state, roll).find(contact => contact.relation === role.relation);
          if (!generated) break;
          const npc = relationshipToNPC(generated);
          npc.context = config.type;
          state.npcs[npc.id] = npc;
          retained.push(npc);
        }
      } else {
        candidates.forEach(npc => { delete npc.context; });
      }
    }
  }

  const inactiveRelations = new Set(configs.filter(config => !activeTypes.has(config.type)).flatMap(config => config.roles.map(role => role.relation)));
  state.relationships = Object.values(state.npcs).filter(npc => !inactiveRelations.has(npc.relation));
}
