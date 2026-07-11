import { GameState, Event as GameEvent, Stats, Reputation, Relationship, SocialMediaAccount, Illness, IllnessTemplate } from '../types';
import { applyYearlyDrift } from './relationshipVectors';
import { evaluateSecretExposureEvents } from './exposureEvents';
import { processOngoingEffects } from './ongoingEffects';
import { evaluateFollowUpFlags } from './followUpFlags';
import { EVENTS_POOL } from '../events';
import { SICKNESS_TITLES, SICKNESS_DESCRIPTIONS, IGNORE_TEXTS, PRAY_TEXTS, WATER_TEXTS } from '../healthTexts';
import { relationshipToNPC } from './saveMigration';

// Simple Linear Congruential Generator (LCG)
export function nextRandom(seed: number): { value: number; nextSeed: number } {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  const nextSeed = (a * seed + c) % m;
  return { value: nextSeed / m, nextSeed };
}

export interface AgeUpData {
  prevStats: Stats;
  nextStats: Stats;
  earnedCash: number;
  prevExposure: number;
  nextExposure: number;
  triggeredEvent: GameEvent | null;
}

export interface YearlySimulationResult {
  updatedState: GameState;
  ageUpData: AgeUpData;
  triggeredEvent: GameEvent | null;
  queuedEvents: GameEvent[];
  newLogs: string[];
}

export interface AgeUpContext {
  INFANT_ILLNESSES: IllnessTemplate[];
  MINOR_ILLNESSES: IllnessTemplate[];
  CHRONIC_ILLNESSES: IllnessTemplate[];
  TERMINAL_ILLNESSES: IllnessTemplate[];
  generateSchoolContacts: (isHighSchool: boolean) => Relationship[];
}

export function runYearlySimulation(gameState: GameState, context: AgeUpContext): YearlySimulationResult {
  // 1. Capture previous values (Deep clone to preserve strict immutability of input state)
  const workingState: GameState = structuredClone(gameState);
  
  // Initialize RNG Seed if it doesn't exist
  if (workingState.rngSeed === undefined) {
    workingState.rngSeed = Math.floor(Math.random() * 1000000);
  }
  let currentSeed = workingState.rngSeed;

  // Helper to roll using our deterministic RNG
  const roll = () => {
    const res = nextRandom(currentSeed);
    currentSeed = res.nextSeed;
    return res.value;
  };

  const newLogs: string[] = [`🎂 Age ${workingState.age + 1} years:`];
  let triggeredEvent: GameEvent | null = null;
  const queuedEvents: GameEvent[] = [];
  let earnedCashTotal = 0;
  
  const prevStats = structuredClone(workingState.stats);
  const prevExposure = workingState.secretExposure?.level || 0;

  // Age increments exactly once
  workingState.age += 1;
  const nextAge = workingState.age;

  // 2. Calculate yearly income and normal stat changes
  const hasOFPosts = (workingState.socialMedia?.onlyfans?.postsCount || 0) > 0;
  const action = hasOFPosts ? 'kept_working' : 'none';

  if (workingState.career.type === 'school' && workingState.career.educationLevel && workingState.career.educationLevel !== 'High School') {
    const graduationYears = ['community_college', 'coding_bootcamp', 'culinary_institute'].includes(workingState.career.educationLevel) ? 2 : 4;
    workingState.career.yearsInRole += 1;
    if (workingState.career.yearsInRole >= graduationYears) {
      newLogs.push(`🎓 I graduated from ${workingState.career.title} with a degree in ${workingState.career.major || 'General Studies'}!`);
      workingState.completedEducation.push({
        level: workingState.career.educationLevel,
        major: workingState.career.major || 'General Studies'
      });
      workingState.career = { title: 'Unemployed Graduate', salary: 0, type: 'unemployed', yearsInRole: 0, performance: 0 };
      triggeredEvent = {
        id: `graduation_${nextAge}`,
        title: '🎓 Graduation Day',
        text: `You have successfully completed your studies and earned your degree in ${workingState.completedEducation[workingState.completedEducation.length-1].major}! It is time to enter the workforce.`,
        category: 'career',
        choices: [
          { id: 'grad_ok', text: 'Time to find a job!', effect: { statChanges: { smarts: 5, happiness: 10, status: 15 }, outcomeText: 'You tossed your cap in the air and celebrated your achievement!', logText: 'Celebrated graduation.' } }
        ]
      };
    }
  } else if (workingState.career.type === 'job' && workingState.career.performance !== undefined) {
    workingState.career.yearsInRole += 1;
    
    // Social Media
    if (workingState.socialMedia) {
      let socialLogs: string[] = [];
      Object.entries(workingState.socialMedia).forEach(([channel, rawData]) => {
        const data = rawData as SocialMediaAccount;
        if (!data.signedUp || data.suspended) return;

        let growthFactor = 1.0;
        if (workingState.stats.looks > 70) growthFactor += 0.05;
        if (workingState.stats.smarts > 70) growthFactor += 0.03;
        if (data.verified) growthFactor += 0.05;

        if (data.postsCount === 0) {
          data.followers = Math.max(0, Math.floor(data.followers * 0.95));
        } else {
          const newFollowers = Math.floor(roll() * 200 * data.postsCount * growthFactor);
          data.followers += newFollowers;
        }

        if (data.followers >= 100000 && !data.verified) {
          data.verified = true;
          socialLogs.push(`🌟 Congratulations! Your ${channel} account has been verified!`);
        }

        if (channel === 'onlyfans') {
          const price = data.subscriptionPrice || 10;
          const targetSubs = Math.floor(data.followers * (workingState.stats.looks / 100) * (15 / price));
          data.subscribers = Math.max(0, Math.min(data.followers, targetSubs));
          const payout = data.subscribers * price * 12; 
          if (payout > 0) {
            earnedCashTotal += payout;
            workingState.cash += payout;
            socialLogs.push(`🍑 OnlyFans: Earned $${payout.toLocaleString()} from your subscribers this year!`);
          }
        } else if (channel === 'youtube' && data.monetized && data.followers >= 10000) {
          const payout = Math.floor(data.followers * 0.05);
          earnedCashTotal += payout;
          workingState.cash += payout;
          socialLogs.push(`🎥 YouTube: Earned $${payout.toLocaleString()} from ad revenue this year!`);
        } else if (channel === 'twitch' && data.monetized && data.followers >= 5000) {
          const payout = Math.floor(data.followers * 0.08);
          earnedCashTotal += payout;
          workingState.cash += payout;
          socialLogs.push(`🔮 Twitch: Earned $${payout.toLocaleString()} from subscriptions and donations!`);
        } else if (channel === 'tiktok' && data.monetized && data.followers >= 50000) {
          const payout = Math.floor(data.followers * 0.02);
          earnedCashTotal += payout;
          workingState.cash += payout;
          socialLogs.push(`🎵 TikTok: Earned $${payout.toLocaleString()} from the Creator Fund!`);
        }
      });
      if (socialLogs.length > 0) newLogs.push(...socialLogs);
    }

    const hours = workingState.career.hoursPerWeek || 40;
    if (hours > 40) {
      const extra = hours - 40;
      workingState.career.performance = Math.min(100, workingState.career.performance + (extra * 1.5));
      workingState.stats.health = Math.max(0, workingState.stats.health - Math.floor(extra * 0.8));
      workingState.stats.happiness = Math.max(0, workingState.stats.happiness - Math.floor(extra * 1.2));
      newLogs.push(`⏱️ You worked ${hours} hours/week this year. The overtime boosted your performance but took a toll on your health and happiness.`);
    } else if (hours < 40) {
      const deficit = 40 - hours;
      workingState.career.performance = Math.max(0, workingState.career.performance - (deficit * 2));
      workingState.stats.happiness = Math.min(100, workingState.stats.happiness + Math.floor(deficit * 1));
      newLogs.push(`⏱️ You worked only ${hours} hours/week this year. Your performance tanked, but you had plenty of free time!`);
    }

    if (workingState.career.performance < 20 && workingState.career.yearsInRole > 0) {
      if (workingState.career.title.includes('Senior ')) {
        workingState.career.title = workingState.career.title.replace('Senior ', '');
        workingState.career.salary = Math.floor(workingState.career.salary * 0.7);
        workingState.career.performance = 50;
        newLogs.push(`📉 Demotion! Due to poor performance, you were demoted to ${workingState.career.title}. Salary decreased to $${workingState.career.salary.toLocaleString()}/yr.`);
      } else {
        workingState.career = { title: 'Unemployed', salary: 0, type: 'unemployed', yearsInRole: 0, performance: 0 };
        newLogs.push(`❌ Fired! You were fired from your job due to extremely poor performance.`);
      }
    } else if (workingState.career.performance > 90 && workingState.career.yearsInRole > 2) {
      if (!workingState.career.title.includes('Senior ') && !workingState.career.title.includes('President') && !workingState.career.title.includes('Manager')) {
        workingState.career.title = 'Senior ' + workingState.career.title.replace('Junior ', '');
        workingState.career.salary = Math.floor(workingState.career.salary * 1.3);
        workingState.career.performance = 50;
        workingState.career.yearsInRole = 0;
        newLogs.push(`📈 Promotion! Your exceptional hard work paid off! You were promoted to ${workingState.career.title} earning $${workingState.career.salary.toLocaleString()}/yr.`);
      } else {
        const raise = Math.floor(workingState.career.salary * 1.15);
        workingState.career.salary = raise;
        workingState.career.performance = 50;
        newLogs.push(`💰 Raise! For your outstanding performance, your boss gave you a huge raise to $${raise.toLocaleString()}/yr!`);
      }
    } else if (workingState.career.performance >= 50) {
      workingState.career.performance = Math.max(0, workingState.career.performance - (Math.floor(roll() * 15) + 5));
    }
  }

  // Base Stats
  let annualHealthChange = 0;
  let annualHappinessChange = Math.floor(roll() * 7) - 3;
  let annualSmartsChange = 0;
  let annualLooksChange = 0;

  if (nextAge < 18) {
    annualHealthChange += Math.floor(roll() * 3) + 1;
  } else if (nextAge >= 30 && nextAge < 50) {
    annualHealthChange -= (roll() < 0.35 ? 1 : 0);
  } else if (nextAge >= 50 && nextAge < 65) {
    annualHealthChange -= Math.floor(roll() * 2) + 1;
  } else if (nextAge >= 65) {
    annualHealthChange -= Math.floor(roll() * 3) + 1;
  }

  if (workingState.flags.gymVisitsThisYear && workingState.flags.gymVisitsThisYear > 0) {
    annualHealthChange += Math.min(5, workingState.flags.gymVisitsThisYear * 2);
  }

  if (workingState.stats.happiness < 30) annualHealthChange -= Math.floor(roll() * 2) + 1;
  
  if (workingState.stats.health < 40) annualHappinessChange -= Math.floor(roll() * 3) + 2;
  else if (workingState.stats.health > 85) annualHappinessChange += 1;

  if (workingState.relationships && workingState.relationships.length > 0) {
    const avgTrust = workingState.relationships.reduce((sum, r) => sum + r.trust, 0) / workingState.relationships.length;
    if (avgTrust > 75) annualHappinessChange += 2;
    else if (avgTrust < 30) annualHappinessChange -= 2;
  }

  if (nextAge < 10) annualSmartsChange += Math.floor(roll() * 4) + 1;
  else if (nextAge < 22 && workingState.career.type === 'school') annualSmartsChange += Math.floor(roll() * 3);
  else annualSmartsChange += Math.floor(roll() * 3) - 1;

  if (nextAge >= 12 && nextAge <= 19) annualLooksChange += Math.floor(roll() * 5) - 1;
  else if (nextAge >= 30 && nextAge < 55) annualLooksChange -= (roll() < 0.40 ? 1 : 0);
  else if (nextAge >= 55) annualLooksChange -= Math.floor(roll() * 2) + 1;

  workingState.stats.health = Math.max(0, Math.min(100, workingState.stats.health + annualHealthChange));
  workingState.stats.happiness = Math.max(0, Math.min(100, workingState.stats.happiness + annualHappinessChange));
  workingState.stats.smarts = Math.max(0, Math.min(100, workingState.stats.smarts + annualSmartsChange));
  workingState.stats.looks = Math.max(0, Math.min(100, workingState.stats.looks + annualLooksChange));

  const changesText: string[] = [];
  if (annualHealthChange !== 0) changesText.push(`Health ${annualHealthChange > 0 ? '▲ +' : '▼ '}${annualHealthChange}%`);
  if (annualHappinessChange !== 0) changesText.push(`Happiness ${annualHappinessChange > 0 ? '▲ +' : '▼ '}${annualHappinessChange}%`);
  if (annualSmartsChange !== 0) changesText.push(`Smarts ${annualSmartsChange > 0 ? '▲ +' : '▼ '}${annualSmartsChange}%`);
  if (annualLooksChange !== 0) changesText.push(`Looks ${annualLooksChange > 0 ? '▲ +' : '▼ '}${annualLooksChange}%`);
  if (changesText.length > 0) newLogs.push(`🌱 Year-over-year organic changes: ${changesText.join(', ')}.`);

  // School transitions
  if (nextAge === 6) {
    workingState.career = { title: 'Primary School Student', salary: 0, type: 'school', yearsInRole: 0, performance: 50 };
    newLogs.push('🏫 I started attending Public Primary School.');
    workingState.flags.schoolGrades = 80;
    workingState.flags.schoolPopularity = 50;
    workingState.flags.schoolType = 'public';
    workingState.relationships = workingState.relationships.filter(r => r.relation !== 'classmate' && r.relation !== 'teacher');
    workingState.relationships.push(...context.generateSchoolContacts(false));
  } else if (nextAge === 12) {
    workingState.career = { title: 'High School Student', salary: 0, type: 'school', yearsInRole: 0, performance: 50 };
    newLogs.push('🎒 I started attending Secondary High School.');
    workingState.flags.schoolGrades = Math.max(50, (workingState.flags.schoolGrades || 80) - 5);
    workingState.flags.schoolPopularity = Math.max(30, (workingState.flags.schoolPopularity || 50));
    workingState.relationships = workingState.relationships.filter(r => r.relation !== 'classmate' && r.relation !== 'teacher');
    workingState.relationships.push(...context.generateSchoolContacts(true));
  } else if (nextAge === 18) {
    workingState.career = { title: 'Unemployed High School Graduate', salary: 0, type: 'unemployed', yearsInRole: 0, performance: 0 };
    newLogs.push('🎓 I graduated from High School! I am now looking for career opportunities.');
    workingState.relationships = workingState.relationships.filter(r => r.relation !== 'classmate' && r.relation !== 'teacher');
  }

  if (workingState.career.type === 'school' && !workingState.relationships.some(r => r.relation === 'classmate')) {
    workingState.relationships.push(...context.generateSchoolContacts(nextAge >= 12));
    if (workingState.flags.schoolGrades === undefined) workingState.flags.schoolGrades = 80;
    if (workingState.flags.schoolPopularity === undefined) workingState.flags.schoolPopularity = 50;
    if (workingState.flags.schoolType === undefined) workingState.flags.schoolType = 'public';
  }

  // Illness
  let currentIllnesses = [...workingState.illnesses];
  currentIllnesses.forEach(ill => {
    workingState.stats.health = Math.max(0, workingState.stats.health - ill.healthImpactPerYear);
    workingState.stats.happiness = Math.max(0, workingState.stats.happiness - ill.happinessImpactPerYear);
    newLogs.push(`🤒 My uncured ${ill.name} is affecting my health (-${ill.healthImpactPerYear} Health, -${ill.happinessImpactPerYear} Happiness).`);
  });

  const remainingIllnesses: Illness[] = [];
  currentIllnesses.forEach(ill => {
    ill.remainingYears -= 1;
    if (ill.remainingYears <= 0) {
      newLogs.push(`🌱 Recovery: My ${ill.name} has completely cleared up naturally!`);
      if (!triggeredEvent) {
        triggeredEvent = {
          id: `recovery_${ill.id}_${nextAge}`,
          title: '🎉 Illness Cured',
          text: `You are no longer suffering from ${ill.name}. Your body has naturally fought off the condition!`,
          category: 'random',
          choices: [
            { id: 'recovery_ok', text: 'Great news!', effect: { statChanges: { happiness: 15, health: 5 }, outcomeText: 'You feel a renewed sense of energy and appreciation for your health.', logText: `Celebrated natural recovery from ${ill.name}.` } }
          ]
        };
      } else {
        queuedEvents.push({
          id: `recovery_${ill.id}_${nextAge}`,
          title: '🎉 Illness Cured',
          text: `You are no longer suffering from ${ill.name}. Your body has naturally fought off the condition!`,
          category: 'random',
          choices: [
            { id: 'recovery_ok', text: 'Great news!', effect: { statChanges: { happiness: 15, health: 5 }, outcomeText: 'You feel a renewed sense of energy and appreciation for your health.', logText: `Celebrated natural recovery from ${ill.name}.` } }
          ]
        });
      }
    } else {
      remainingIllnesses.push(ill);
    }
  });
  workingState.illnesses = remainingIllnesses;

  const constitution = workingState.flags.constitution || 'average';
  let contractChance = 0.10;
  if (constitution === 'robust') contractChance = 0.03;
  if (constitution === 'frail') contractChance = 0.26;
  const healthFactor = Math.max(0.5, 3.0 - (workingState.stats.health / 40));
  contractChance = Math.min(0.90, contractChance * healthFactor);

  if (workingState.flags.terminal_susceptible && !workingState.illnesses.some(i => i.type === 'terminal') && nextAge >= 6) {
    if (roll() < 0.08) {
      const availableTerminals = context.TERMINAL_ILLNESSES.filter(t => !t.requiresFlag || workingState.flags[t.requiresFlag]);
      if (availableTerminals.length > 0) {
        const termTemplate = availableTerminals[Math.floor(roll() * availableTerminals.length)];
        const isUncurable = !!workingState.flags.terminal_uncurable;
        const randomDuration = Math.floor(roll() * (termTemplate.maxDuration - termTemplate.minDuration + 1)) + termTemplate.minDuration;
        const illnessInstance: Illness = {
          id: `${termTemplate.id}_${nextAge}`,
          name: isUncurable ? `Inoperable ${termTemplate.name}` : termTemplate.name,
          type: 'terminal',
          curable: !isUncurable,
          cured: false,
          healthImpactPerYear: termTemplate.healthImpactPerYear,
          happinessImpactPerYear: termTemplate.happinessImpactPerYear,
          discoveredAge: nextAge,
          cureCost: termTemplate.cureCost,
          remainingYears: randomDuration,
          baseCureChance: termTemplate.baseCureChance
        };
        workingState.illnesses.push(illnessInstance);
        newLogs.push(`🚨 CRITICAL HEALTH ALERT: At age ${nextAge}, I was diagnosed with terminal **${illnessInstance.name}**! It is ${isUncurable ? 'uncurable and inoperable' : 'life-threatening but curable with private specialized treatment'}.`);
      }
    }
  } else if (roll() < contractChance && nextAge >= 1) {
    let template: IllnessTemplate;
    if (nextAge < 6) {
      template = context.INFANT_ILLNESSES[Math.floor(roll() * context.INFANT_ILLNESSES.length)];
    } else {
      let pools = roll() < 0.80 ? context.MINOR_ILLNESSES : context.CHRONIC_ILLNESSES;
      pools = pools.filter(t => !t.requiresFlag || workingState.flags[t.requiresFlag]);
      if (pools.length === 0) pools = context.MINOR_ILLNESSES.filter(t => !t.requiresFlag || workingState.flags[t.requiresFlag]);
      template = pools[Math.floor(roll() * pools.length)];
    }

    if (!workingState.illnesses.some(i => i.id.startsWith(template.id))) {
      const randomDuration = Math.floor(roll() * (template.maxDuration - template.minDuration + 1)) + template.minDuration;
      const illnessInstance: Illness = {
        id: `${template.id}_${nextAge}`,
        name: template.name,
        type: template.type,
        curable: template.curable,
        cured: false,
        healthImpactPerYear: template.healthImpactPerYear,
        happinessImpactPerYear: template.happinessImpactPerYear,
        discoveredAge: nextAge,
        cureCost: template.cureCost,
        remainingYears: randomDuration,
        baseCureChance: template.baseCureChance
      };
      workingState.illnesses.push(illnessInstance);
      
      const isMinor = nextAge < 18;
      const replacePlaceholders = (text: string) => text.replace('{illness}', template.name).replace('{type}', template.type);

      const ev: GameEvent = {
        id: `sickness_${template.id}_${nextAge}`,
        title: replacePlaceholders(SICKNESS_TITLES[Math.floor(roll() * SICKNESS_TITLES.length)]),
        text: replacePlaceholders(SICKNESS_DESCRIPTIONS[Math.floor(roll() * SICKNESS_DESCRIPTIONS.length)]),
        category: 'random',
        choices: [
          {
            id: 'sick_ignore',
            text: IGNORE_TEXTS[Math.floor(roll() * IGNORE_TEXTS.length)],
            effect: { statChanges: { health: -5 }, willpowerChange: 10, outcomeText: 'You ignored the illness. Your body will have to fight it off naturally.', logText: `Ignored ${template.name}.` }
          },
          {
            id: 'sick_pray',
            text: PRAY_TEXTS[Math.floor(roll() * PRAY_TEXTS.length)],
            outcomes: [
              { weight: 87, effect: { statChanges: { happiness: 3 }, outcomeText: 'You prayed earnestly, but the heavens were silent today. You feel slightly more at peace, but you are still sick.', logText: `Prayed to be cured from ${template.name}. Wasn't heard this time.` } },
              { weight: 12, effect: { statChanges: { happiness: 8 }, karmaChange: 2, outcomeText: 'You prayed, and for a moment you felt a strange warmth. It didn\'t cure you, but something subtle shifted. Your karma grew slightly.', logText: `Prayed to be cured from ${template.name}. Your prayer was heard. +2 Karma.` } },
              { weight: 1, effect: { statChanges: { happiness: 40, health: 30 }, karmaChange: 2, cureIllness: true, outcomeText: 'A MIRACLE! You prayed fervently, and a warm golden light washed over you. The sickness vanished instantly!', logText: `Experienced a medical miracle after praying for ${template.name}.` } }
            ]
          },
          {
            id: 'sick_ritual_interactive',
            text: `Perform a bizarre healing ritual (Choose Payment).`,
            effect: { statChanges: {}, outcomeText: '' }
          },
          {
            id: 'sick_doctor',
            text: isMinor ? 'Beg your parents to take you to the doctor.' : 'Go directly to the clinic.',
            effect: { statChanges: { health: 10, smarts: 5 }, outcomeText: isMinor ? 'Your parents gave you some medicine and put you to bed. You need a proper checkup later.' : 'You scheduled a visit. Remember to check the Doctors tab!', logText: `Decided to seek medical attention for ${template.name}.` }
          },
          {
            id: 'sick_water',
            text: WATER_TEXTS[Math.floor(roll() * WATER_TEXTS.length)],
            effect: { statChanges: { health: 5 }, outcomeText: 'You hydrated and rested. The illness is still there, but your body is slightly stronger.', logText: `Drank water to fight ${template.name}.` }
          }
        ]
      };

      if (!triggeredEvent) triggeredEvent = ev;
      else queuedEvents.push(ev);
    }
  }

  // Salary
  if (workingState.career.salary > 0) {
    let activeSalary = workingState.career.salary;
    let bonusLogs = '';

    if (workingState.location === 'London, United Kingdom') {
      const isCorporate = ['Accountant', 'Broker', 'Executive', 'Investment Banker', 'CEO', 'Manager', 'Analyst', 'Clerk', 'Cashier'].includes(workingState.career.title);
      if (isCorporate) {
        const bonus = Math.floor(activeSalary * 0.15);
        activeSalary += bonus;
        bonusLogs += ` (Includes +15% London Finance Bonus: +$${bonus.toLocaleString()})`;
      }
    }

    if (workingState.location === 'Compton, United States') {
      const isArtist = ['Musician', 'Artist', 'Actor', 'Influencer', 'Writer', 'Producer', 'Rapper'].includes(workingState.career.title);
      if (isArtist) {
        const bonus = Math.floor(activeSalary * 0.15);
        activeSalary += bonus;
        bonusLogs += ` (Includes +15% Compton Creative Industry Bonus: +$${bonus.toLocaleString()})`;
      }
    }

    workingState.cash += activeSalary;
    earnedCashTotal += activeSalary;
    newLogs.push(`💼 Received annual salary of $${activeSalary.toLocaleString()} as a ${workingState.career.title}.${bonusLogs}`);
    
    const expenses = Math.floor(activeSalary * 0.25);
    workingState.cash -= expenses;
    newLogs.push(`💸 Paid $${expenses.toLocaleString()} for taxes and living expenses.`);
  }

  // 3. Calculate exposure gain, decay, and new exposure
  if (workingState.secretExposure) {
    const ofPosts = workingState.socialMedia?.onlyfans?.postsCount || 0;
    const postsVal = ofPosts > 0 ? ofPosts : 10;
    const collabsVal = ofPosts > 5 ? 2 : 0;
    const mitigationVal = 85; 
    const locationMult = workingState.location.includes('Mumbai') ? 0.8 : 1.0;
    const luckRoll = Math.floor(roll() * 6) - 3;
    
    const calculatedGain = Math.round(((postsVal * 2) + (collabsVal * 4) - (mitigationVal * 0.1)) * locationMult + luckRoll);
    workingState.secretExposure.level = Math.max(0, Math.min(100, workingState.secretExposure.level + calculatedGain));
    workingState.secretExposure.heat = Math.round(workingState.secretExposure.heat * 0.5);
    workingState.secretExposure.history.push(workingState.secretExposure.level);
  }

  workingState.relationships.forEach(r => {
    if (!workingState.npcs[r.id]) {
      workingState.npcs[r.id] = relationshipToNPC(r);
    }
  });
  
  // Clean up relationships array so it syncs exactly with npcs going forward
  workingState.relationships = [];
  
  Object.values(workingState.npcs).forEach(npc => {
    // Only increment age if they weren't just generated this exact year as new contacts
    // Wait, let's just increment age safely.
    npc.age += 1;
    applyYearlyDrift(npc, action);
    workingState.relationships.push(npc);
  });

  // 5. Process ongoing effects
  const ongoingResult = processOngoingEffects(workingState.ongoingEffects, workingState);
  workingState.stats.health = Math.max(0, Math.min(100, workingState.stats.health + ongoingResult.statDeltas.health));
  workingState.stats.happiness = Math.max(0, Math.min(100, workingState.stats.happiness + ongoingResult.statDeltas.happiness));
  workingState.ongoingEffects = ongoingResult.updatedEffects;

  // 6. Evaluate follow-up flags
  const followUpResult = evaluateFollowUpFlags(workingState);
  workingState.followUpFlags = (workingState.followUpFlags || []).filter(f => !followUpResult.flagsToRemove.includes(f.id));
  
  if (followUpResult.newEvents.length > 0) {
    followUpResult.newEvents.forEach(eventId => {
      const fullMatch = EVENTS_POOL.find(e => e.id === eventId);
      if (fullMatch) {
        if (!triggeredEvent) {
          triggeredEvent = fullMatch;
        } else {
          // Priority! If triggeredEvent exists and is NOT a follow-up, push it to queue and take over
          queuedEvents.unshift(triggeredEvent);
          triggeredEvent = fullMatch;
        }
        newLogs.push(`❗️ A past decision caught up with you: ${fullMatch.title}`);
      }
    });
  }

  // 7. Check for a new exposure event using the updated exposure
  const rolledExposureEvent = evaluateSecretExposureEvents(workingState as any, []);
  if (rolledExposureEvent) {
    if (!triggeredEvent) triggeredEvent = rolledExposureEvent;
    else queuedEvents.push(rolledExposureEvent);
  }

  // Delayed / callback event queue
  const delayedMatchIndex = workingState.delayedEvents.findIndex(de => de.triggerAge === nextAge);
  if (delayedMatchIndex !== -1) {
    const match = workingState.delayedEvents[delayedMatchIndex];
    workingState.delayedEvents = workingState.delayedEvents.filter((_, idx) => idx !== delayedMatchIndex);
    const fullMatch = EVENTS_POOL.find(e => e.id === match.eventId);
    if (fullMatch) {
      if (!triggeredEvent) triggeredEvent = fullMatch;
      else queuedEvents.push(fullMatch);
    }
  }

  // General conditional eligibility checks from pool
  if (!triggeredEvent && queuedEvents.length === 0) {
    const recentIds = new Set(workingState.recentEventIds || []);
    const eligibleEvents = EVENTS_POOL.filter(event => {
      if (recentIds.has(event.id)) return false;
      if (event.category === 'callback' && !workingState.flags[`trigger_callback_${event.id}`]) return false;
      if (!event.conditions) return true;
      const c = event.conditions;

      if (c.minAge !== undefined && nextAge < c.minAge) return false;
      if (c.maxAge !== undefined && nextAge > c.maxAge) return false;
      if (c.minStats) { for (const [k, v] of Object.entries(c.minStats)) { if (workingState.stats[k as keyof Stats] < (v || 0)) return false; } }
      if (c.maxStats) { for (const [k, v] of Object.entries(c.maxStats)) { if (workingState.stats[k as keyof Stats] > (v || 0)) return false; } }
      if (c.minRep) { for (const [k, v] of Object.entries(c.minRep)) { if (workingState.reputation[k as keyof Reputation] < (v || 0)) return false; } }
      if (c.maxRep) { for (const [k, v] of Object.entries(c.maxRep)) { if (workingState.reputation[k as keyof Reputation] > (v || 0)) return false; } }
      if (c.flagsTrue) { for (const f of c.flagsTrue) { if (!workingState.flags[f]) return false; } }
      if (c.flagsFalse) { for (const f of c.flagsFalse) { if (workingState.flags[f]) return false; } }
      if (c.hasRelationshipType && !workingState.relationships.some(r => r.relation === c.hasRelationshipType)) return false;
      if (c.hasRelationshipArchetype && !workingState.relationships.some(r => r.archetype === c.hasRelationshipArchetype)) return false;

      return true;
    });

    if (eligibleEvents.length > 0 && roll() < 0.95) {
      const totalWeight = eligibleEvents.reduce((sum, e) => sum + (e.weight || 10), 0);
      let randomVal = roll() * totalWeight;
      for (const e of eligibleEvents) {
        const w = e.weight || 10;
        if (randomVal < w) {
          triggeredEvent = e;
          break;
        }
        randomVal -= w;
      }
    }
  }

  // Active Relationship Context Hooking
  workingState.activeRelationshipContextId = null;
  if (triggeredEvent) {
    if (triggeredEvent.involvedRelationshipType) {
      const matches = workingState.relationships.filter(r => r.relation === triggeredEvent?.involvedRelationshipType);
      if (matches.length > 0) workingState.activeRelationshipContextId = matches[Math.floor(roll() * matches.length)].id;
    } else if (triggeredEvent.conditions?.hasRelationshipType) {
      const matches = workingState.relationships.filter(r => r.relation === triggeredEvent?.conditions?.hasRelationshipType);
      if (matches.length > 0) workingState.activeRelationshipContextId = matches[Math.floor(roll() * matches.length)].id;
    }
    newLogs.push(`❗ EVENT: ${triggeredEvent.title}`);
  } else {
    const generalDescriptions = ["Nothing major occurred this year.", "Passed the year focusing on personal routine.", "Spent a quiet year keeping to my own goals.", "An uneventful, peaceful year went by.", "Focused on mental wellness and quiet hobbies."];
    newLogs.push(`• ${generalDescriptions[Math.floor(roll() * generalDescriptions.length)]}`);
  }

  // Check if health drops to zero
  workingState.alive = workingState.stats.health > 0;
  workingState.deathReason = '';

  if (!workingState.alive && nextAge < 18) {
    const hasTerminal = workingState.illnesses.some(i => i.type === 'terminal');
    if (!hasTerminal) {
      workingState.alive = true;
      workingState.stats.health = 5;
      newLogs.push(`⚠️ Medical Emergency: I nearly died from complications, but the hospital stabilized me. Health is critical.`);
    }
  }

  if (!workingState.alive) {
    const activeTerminal = workingState.illnesses.find(i => i.type === 'terminal');
    if (activeTerminal) workingState.deathReason = `Complications arising from terminal ${activeTerminal.name}.`;
    else if (workingState.illnesses.length > 0) workingState.deathReason = `Severe medical complications from ${workingState.illnesses[0].name}.`;
    else workingState.deathReason = 'Severe physical decline and critical organ failure.';
  } else if (nextAge >= 90 && roll() < (nextAge - 80) * 0.08) {
    workingState.alive = false;
    workingState.deathReason = `Old age (passed peacefully at ${nextAge} years).`;
  }

  if (triggeredEvent) {
    workingState.recentEventIds = [...(workingState.recentEventIds || []).slice(-5), triggeredEvent.id];
  }
  
  // 11. Reset yearly trackers
  workingState.flags.napCount = 0;
  workingState.flags.studiesThisYear = 0;
  workingState.flags.gymVisitsThisYear = 0;
  if (workingState.socialMedia) {
    Object.keys(workingState.socialMedia).forEach(key => {
      const acc = workingState.socialMedia![key as keyof typeof workingState.socialMedia];
      if (acc) {
        acc.postsCount = 0;
        acc.tipsCollected = false;
        acc.wishlistPosted = false;
      }
    });
  }

  // 12. Advance RNG seed deterministically
  workingState.rngSeed = currentSeed;
  workingState.log.push(...newLogs);

  const ageUpData: AgeUpData = {
    prevStats,
    nextStats: workingState.stats,
    earnedCash: earnedCashTotal,
    prevExposure,
    nextExposure: workingState.secretExposure?.level || 0,
    triggeredEvent
  };

  workingState.currentEvent = null; // Clear immediate display to allow Modal handling

  return {
    updatedState: workingState,
    ageUpData,
    triggeredEvent,
    queuedEvents,
    newLogs
  };
}
