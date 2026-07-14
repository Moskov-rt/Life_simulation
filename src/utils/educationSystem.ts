import { EducationLevel, EducationState, GameState } from '../types';

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function defaultEducationState(state?: Partial<GameState>): EducationState {
  const grades = Number(state?.flags?.schoolGrades ?? 80);
  const popularity = Number(state?.flags?.schoolPopularity ?? 50);
  return {
    level: state?.career?.educationLevel ? 'university' : state?.career?.type === 'school' ? (state.age < 12 ? 'primary' : 'secondary') : 'none',
    grades: clamp(grades),
    discipline: clamp(Number(state?.flags?.schoolDiscipline ?? 60)),
    academicReputation: clamp(Number(state?.flags?.academicReputation ?? grades)),
    major: state?.career?.major,
    enrolled: state?.career?.type === 'school',
    scholarship: Boolean(state?.flags?.scholarship),
    interests: {
      academics: clamp(Number(state?.flags?.educationAcademics ?? grades)),
      popularity,
      creativity: clamp(Number(state?.flags?.educationCreativity ?? 50)),
      sports: clamp(Number(state?.flags?.educationSports ?? 50)),
      relationships: clamp(Number(state?.flags?.educationRelationships ?? popularity))
    }
  };
}

export function ensureEducationState(state: GameState): EducationState {
  if (!state.education) state.education = defaultEducationState(state);
  return state.education;
}

function syncEducationFlags(state: GameState): void {
  const education = ensureEducationState(state);
  state.flags.schoolGrades = education.grades;
  state.flags.schoolDiscipline = education.discipline;
  state.flags.academicReputation = education.academicReputation;
  state.flags.educationAcademics = education.interests.academics;
  state.flags.educationCreativity = education.interests.creativity;
  state.flags.educationSports = education.interests.sports;
  state.flags.educationRelationships = education.interests.relationships;
  state.flags.schoolPopularity = education.interests.popularity;
}

/** Applies a school/university choice without introducing a second action engine. */
export function applyEducationChoice(state: GameState, eventId: string, choiceId: string): void {
  const education = ensureEducationState(state);
  if (eventId === 'education_school_choice') {
    if (choiceId === 'school_study') {
      education.grades = clamp(education.grades + 7);
      education.discipline = clamp(education.discipline + 6);
      state.stats.happiness = clamp(state.stats.happiness - 2);
      state.flags.educationMilestone = 'study';
    } else if (choiceId === 'school_socialize') {
      education.interests.popularity = clamp(education.interests.popularity + 8);
      education.interests.relationships = clamp(education.interests.relationships + 8);
      state.flags.educationMilestone = 'socialize';
    } else if (choiceId === 'school_rebel') {
      education.discipline = clamp(education.discipline - 8);
      education.interests.relationships = clamp(education.interests.relationships + 3);
      state.flags.educationMilestone = 'rebel';
    }
  }
  if (eventId === 'education_teen_development') {
    const interestMap: Record<string, keyof EducationState['interests']> = {
      teen_academics: 'academics', teen_popularity: 'popularity', teen_creativity: 'creativity', teen_sports: 'sports', teen_relationships: 'relationships'
    };
    const key = interestMap[choiceId];
    if (key) {
      education.interests[key] = clamp(education.interests[key] + 9);
      if (key === 'academics') education.grades = clamp(education.grades + 4);
      state.flags.teenFocus = key;
    }
  }
  if (eventId === 'education_university_decision') {
    if (choiceId === 'university_attend') {
      education.level = 'university'; education.enrolled = true; education.scholarship = education.grades >= 85;
      education.major = 'General Studies'; state.career = { ...state.career, type: 'school', title: 'University Student', educationLevel: 'university', major: education.major, yearsInRole: 0, performance: education.grades };
      state.flags.university_attending = true;
      if (education.scholarship) state.flags.scholarship = true;
    } else if (choiceId.startsWith('university_major_')) {
      const major = choiceId.replace('university_major_', '').replace(/_/g, ' ');
      education.major = major.replace(/\b\w/g, letter => letter.toUpperCase());
      education.level = 'university'; education.enrolled = true; education.scholarship = education.grades >= 85;
      state.career = { ...state.career, type: 'school', title: 'University Student', educationLevel: 'university', major: education.major, yearsInRole: 0, performance: education.grades };
      state.flags.university_attending = true;
      state.flags[`education_major_${major.replace(/\s+/g, '_')}`] = true;
    } else if (choiceId === 'university_skip') {
      education.enrolled = false;
      state.flags.university_skipped = true;
    }
  }
  syncEducationFlags(state);
}

export function advanceEducationYear(state: GameState, nextAge: number): void {
  const education = ensureEducationState(state);
  if (nextAge < 6) education.level = 'none';
  else if (nextAge < 12) education.level = 'primary';
  else if (nextAge < 18) education.level = 'secondary';
  education.enrolled = state.career.type === 'school';
  if (education.enrolled && education.level !== 'university') {
    education.academicReputation = clamp((education.academicReputation * 2 + education.grades) / 3);
  }
  syncEducationFlags(state);
}

export function educationCareerOpportunities(state: GameState): string[] {
  const education = ensureEducationState(state);
  const opportunities: string[] = [];
  if (education.grades >= 75 || education.interests.academics >= 75) opportunities.push('academic', 'medical', 'law');
  if (education.interests.creativity >= 65) opportunities.push('arts', 'actor', 'creator');
  if (education.interests.popularity >= 70 || education.interests.relationships >= 70) opportunities.push('communications', 'business');
  if (education.interests.sports >= 70) opportunities.push('sports');
  return [...new Set(opportunities)];
}

export function educationLevelForCareer(major: string): EducationLevel {
  if (/medical|law|business|computer|engineering|arts|education/i.test(major)) return 'university';
  return 'secondary';
}

export function educationAccessProfile(state: Pick<GameState, 'origin' | 'familyWealth' | 'cash' | 'education'>): { opportunities: string[]; obstacles: string[] } {
  const opportunities: string[] = [];
  const obstacles: string[] = [];
  if (state.origin?.status === 'royal' || (state.familyWealth || 0) >= 100000) {
    opportunities.push('private school', 'elite mentorship');
    obstacles.push('family expectations');
  } else if ((state.cash || 0) < 5000 && (state.familyWealth || 0) < 20000) {
    opportunities.push('need-based scholarship');
    obstacles.push('tuition pressure', 'work-study demands');
  } else {
    opportunities.push('public education');
  }
  if ((state.education?.grades || 0) >= 85) opportunities.push('merit scholarship');
  return { opportunities: [...new Set(opportunities)], obstacles: [...new Set(obstacles)] };
}
