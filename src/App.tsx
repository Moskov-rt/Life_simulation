/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Smile, 
  DollarSign, 
  Briefcase, 
  Users, 
  Sliders, 
  Plus, 
  Minus,
  Shuffle,
  Volume2, 
  VolumeX, 
  RotateCcw, 
  BookOpen, 
  MapPin, 
  User, 
  Award, 
  TrendingUp, 
  ShieldAlert, 
  Gift, 
  MessageSquare, 
  HeartHandshake, 
  Activity, 
  ShoppingBag, 
  Flame, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  GraduationCap,
  Baby,
  ChevronLeft,
  ArrowLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
  Skull, Plane, Mountain, Star, Dices, Laptop, UserCircle, Scale, Ticket, Wine, Dog, Sun, Smartphone, Palmtree, HandHeart, FileText, Flag
} from 'lucide-react';
import { GameState, Stats, Reputation, Relationship, NPC, Event, Choice, OutcomeEffect, ArchetypeType, AvatarConfig, Illness, IllnessTemplate, SocialMediaAccount, CreatorContentStyle, CreatorYearlyActions } from './types';
import { relationshipToNPC } from './utils/saveMigration';

import { EVENTS_POOL } from './events';
import { AgeUpModal } from './components/AgeUpModal';
import { EventPopupModal } from './components/EventPopupModal';

import { modifyOutcomeDeltas, getDynamicChoiceOutcome } from './utils/relationshipVectors';
import { resolveChoice, applyChoiceResultToNPC } from './utils/choiceResolver';
import { applyPlayerTraits } from './utils/personalityEffects';
import { calculateStatCascades } from './utils/statCascades';
import { mergeOngoingEffects } from './utils/ongoingEffects';
import { runYearlySimulation } from './utils/ageUpSimulator';

import { SICKNESS_TITLES, SICKNESS_DESCRIPTIONS, IGNORE_TEXTS, PRAY_TEXTS, WATER_TEXTS } from './healthTexts';
import { playClick, playSuccess, playError, playAgeUp } from './utils/audio';
import { WorldTravelMap, MapCity } from './components/WorldTravelMap';
import { CharacterCreator } from './components/CharacterCreator';
import { AppearanceModal } from './components/AppearanceModal';
import { CharacterAvatar } from './components/CharacterAvatar';

// Constants for initial state generation
const SURNAMES = ['Armstrong', 'Miller', 'Vance', 'Kovacs', 'Rodriguez', 'Chen', 'Sterling', 'Hayes', 'O\'Connor', 'Patel'];
const MALE_NAMES = ['Yusef', 'Logan', 'Sora', 'Devon', 'Mateo', 'Arthur', 'Marcus', 'Viktor', 'Kaito', 'Julian'];
const FEMALE_NAMES = ['Amara', 'Evelyn', 'Clara', 'Naomi', 'Elena', 'Yuki', 'Zoe', 'Iris', 'Priya', 'Sasha'];
const CAREER_TYPES = ['school', 'career', 'unemployed'];

const LOCATIONS = [
  'Compton, United States',
  'Tokyo, Japan',
  'London, United Kingdom',
  'Munich, Germany',
  'Sydney, Australia',
  'Mumbai, India'
];

type JobInterviewOption = {
  text: string;
  correct: boolean;
  feedback: string;
  statChanges: any;
};

type JobInterview = {
  title: string;
  salary: number;
  minAge: number;
  req: string;
  reqLevel?: string;
  reqMajor?: string[];
  industry: string;
  tier: number;
  minLooks?: number;
  minSmarts?: number;
};

const JOB_INTERVIEWS: JobInterview[] = [
  { title: 'Cashier', salary: 18000, minAge: 16, req: 'None', industry: 'retail', tier: 1 },
  { title: 'Store Manager', salary: 45000, minAge: 18, req: 'Cashier Experience', industry: 'retail', tier: 2 },
  { title: 'IT Helpdesk Technician', salary: 38000, minAge: 18, req: 'Smarts >= 45, Community College (Any Tech)', reqLevel: 'community_college', reqMajor: ['Information Systems', 'Computer Science', 'Ethical Hacking'], industry: 'tech', tier: 1 },
  { title: 'Junior Software Engineer', salary: 68000, minAge: 21, req: 'Smarts >= 60, University Degree (Tech)', reqLevel: 'university', reqMajor: ['Computer Science', 'Quantum Engineering', 'Software Engineering', 'Information Systems'], industry: 'tech', tier: 2 },
  { title: 'Senior Systems Architect', salary: 135000, minAge: 24, req: 'Smarts >= 75, Tech Experience', reqLevel: 'graduate_school', reqMajor: ['Computer Science', 'Software Engineering', 'Information Systems'], industry: 'tech', tier: 3 },
  { title: 'General Surgeon', salary: 320000, minAge: 26, req: 'Smarts >= 90, Medical School', reqLevel: 'medical_school', industry: 'medical', tier: 3 },
  { title: 'Registered Nurse', salary: 75000, minAge: 21, req: 'Nursing School', reqLevel: 'nursing_school', industry: 'medical', tier: 1 },
  { title: 'Corporate Defense Lawyer', salary: 190000, minAge: 25, req: 'Smarts >= 85, Law School', reqLevel: 'law_school', industry: 'corporate', tier: 2 },
  { title: 'Corporate Vice President', salary: 240000, minAge: 30, req: 'Smarts >= 80, Business School', reqLevel: 'business_school', industry: 'corporate', tier: 3 },
  { title: 'Paranormal Investigator', salary: 45000, minAge: 21, req: 'University Degree (Occult or History)', reqLevel: 'university', reqMajor: ['Cryptid Zoology', 'Occult Sciences', 'History', 'Religious Studies'], industry: 'special', tier: 1 },
  { title: 'Space Colonist', salary: 250000, minAge: 24, req: 'Graduate School (Space or Science)', reqLevel: 'graduate_school', reqMajor: ['Astrobiology', 'Space Colonization', 'Physics', 'Quantum Engineering'], industry: 'special', tier: 2 },
  
  // --- ADULT INDUSTRY JOBS ---
  { title: 'Exotic Dancer', salary: 35000, minAge: 18, req: 'Looks >= 60', industry: 'entertainment', tier: 1, minLooks: 60 },
  { title: 'Webcam Model', salary: 65000, minAge: 18, req: 'Looks >= 70, Smarts >= 40', industry: 'entertainment', tier: 1, minLooks: 70, minSmarts: 40 },
  { title: 'Adult Film Extra', salary: 40000, minAge: 18, req: 'Looks >= 50', industry: 'entertainment', tier: 1, minLooks: 50 },
  { title: 'VIP Escort', salary: 110000, minAge: 18, req: 'Looks >= 80, Smarts >= 50', industry: 'entertainment', tier: 2, minLooks: 80, minSmarts: 50 },
  { title: 'Adult Film Star', salary: 180000, minAge: 21, req: 'Looks >= 80', industry: 'entertainment', tier: 2, minLooks: 80 },
  { title: 'Adult Studio Director', salary: 220000, minAge: 25, req: 'Smarts >= 75', industry: 'entertainment', tier: 3, minSmarts: 75 }
];

const INTERVIEW_QUESTIONS: Record<string, {question: string, options: JobInterviewOption[]}[]> = {
  'retail': [
    {
      question: 'How would you handle a customer who claims they gave you a $50 bill when they only gave you a $20?',
      options: [
        { text: 'Call the manager immediately to verify and count the cash drawer.', correct: true, feedback: 'Correct! You followed procedure.', statChanges: { smarts: 5, status: 5 } },
        { text: 'Argue with them loudly to prove you are right.', correct: false, feedback: 'Incorrect. Arguing causes a scene.', statChanges: { status: -5 } },
        { text: 'Just give them the extra change to avoid a scene.', correct: false, feedback: 'Giving away store money is a serious policy violation.', statChanges: { smarts: -5 } }
      ]
    },
    {
      question: 'A coworker is consistently late to their shift, forcing you to stay extra. What do you do?',
      options: [
        { text: 'Talk to them privately first, then escalate to management if it continues.', correct: true, feedback: 'Professional and fair.', statChanges: { smarts: 5, status: 5 } },
        { text: 'Scream at them in front of customers.', correct: false, feedback: 'Highly unprofessional.', statChanges: { status: -15 } },
        { text: 'Just leave when your shift is over and let the store run empty.', correct: false, feedback: 'Negligent. You failed.', statChanges: { status: -10 } }
      ]
    }
  ],
  'tech': [
    {
      question: 'Your team is debating between a quick, unstable hotfix or a proper, time-consuming refactor. What is your stance?',
      options: [
        { text: 'Advocate for the hotfix to stop the immediate bleeding, but schedule a refactor sprint next week.', correct: true, feedback: 'Excellent balance of business urgency and code quality.', statChanges: { smarts: 8, status: 12 } },
        { text: 'Refuse to write a single line of code until the entire repository is rewritten.', correct: false, feedback: 'Too rigid. The team needs team players.', statChanges: { status: -5 } },
        { text: 'Flip a coin and blame the database administrator if it fails.', correct: false, feedback: 'Very unprofessional.', statChanges: { smarts: -10 } }
      ]
    },
    {
      question: 'Our main database cluster has just crashed during a high-traffic marketing campaign. What is your first action?',
      options: [
        { text: 'Isolate the traffic, check replication lag logs, and failover to the read-replica cluster.', correct: true, feedback: 'Highly professional recovery flow. Hired!', statChanges: { smarts: 10, status: 20 } },
        { text: 'Panic, delete your professional accounts, and sneak out of the building.', correct: false, feedback: 'The team needed a leader, not an escape artist.', statChanges: { status: -15 } },
        { text: 'Instantly blame the intern.', correct: false, feedback: 'Scapegoating is toxic.', statChanges: { status: -10 } }
      ]
    }
  ],
  'medical': [
    {
      question: 'During a routine appendectomy, you discover an unexpected tumor. What is the protocol?',
      options: [
        { text: 'Take a biopsy, close the patient safely, and schedule a consultation with oncology.', correct: true, feedback: 'Perfect! Safest protocol followed.', statChanges: { smarts: 15, status: 30 } },
        { text: 'Attempt to cut it out immediately without consulting anyone.', correct: false, feedback: 'Reckless and dangerous.', statChanges: { status: -25 } },
        { text: 'Ignore it entirely because it wasnt on the original surgery order.', correct: false, feedback: 'Medical negligence.', statChanges: { status: -15 } }
      ]
    }
  ],
  'corporate': [
    {
      question: 'The board of directors is demanding a 15% operational cost reduction. How do you implement this responsibly?',
      options: [
        { text: 'Audit structural inefficiencies, renegotiate software vendors, and freeze non-essential hiring.', correct: true, feedback: 'Superb! A strategic, analytical mind.', statChanges: { smarts: 15, status: 25 } },
        { text: 'Double your own salary package and immediately fire the customer support team.', correct: false, feedback: 'Selfish and destructive to brand value.', statChanges: { status: -20 } },
        { text: 'Ignore the directive and hope they forget about it by next quarter.', correct: false, feedback: 'Complete negligence of duty.', statChanges: { status: -10 } }
      ]
    }
  ],
  'special': [
    {
      question: 'You walk into an allegedly haunted Victorian manor and the EMF reader instantly maxes out. Your partner starts acting strange. What do you do?',
      options: [
        { text: 'Establish a safe perimeter, initiate an audio recording, and calmly ask the entity to identify itself.', correct: true, feedback: 'Professional and brave.', statChanges: { smarts: 10, status: 15, willpower: 10 } },
        { text: 'Scream, throw the EMF reader at the wall, and run out the front door.', correct: false, feedback: 'Cowardice has no place in this field.', statChanges: { status: -15, willpower: -10 } },
        { text: 'Start throwing salt randomly while chanting loudly.', correct: false, feedback: 'Amateurish and reckless.', statChanges: { status: -10 } }
      ]
    }
  ],
  'entertainment': [
    {
      question: 'The director wants to do a very demanding, unscheduled scene. How do you handle it?',
      options: [
        { text: 'Embrace the challenge enthusiastically and give it your all.', correct: true, feedback: 'The director loved your energy.', statChanges: { status: 15, happiness: 5 } },
        { text: 'Throw a tantrum and demand double pay before starting.', correct: false, feedback: 'You were labeled a diva.', statChanges: { status: -10, happiness: -5 } },
        { text: 'Awkwardly refuse and try to leave the set.', correct: false, feedback: 'They found a replacement instantly.', statChanges: { status: -5 } }
      ]
    },
    {
      question: 'A top VIP client asks you to attend their high school reunion as their fake sweetheart, pretending you are a nuclear physicist. What do you do?',
      options: [
        { text: 'Study basic nuclear physics terms overnight, dress elegantly, and play the role flawlessly.', correct: true, feedback: 'Amazing job! The client was thrilled and paid you a huge bonus.', statChanges: { smarts: 10, status: 15 } },
        { text: 'Refuse the gig because physics sounds too boring and complicated.', correct: false, feedback: 'You missed a high-paying opportunity.', statChanges: { status: -5 } },
        { text: 'Attend, get completely wasted, and tell everyone you are actually an adult worker.', correct: false, feedback: 'A total disaster. You ruined the client\'s reputation.', statChanges: { status: -20, happiness: -10 } }
      ]
    },
    {
      question: 'A webcam viewer offers to pay your rent for the next six months in exchange for your sweaty gym socks. What is your response?',
      options: [
        { text: 'Politely accept the offer, package the socks nicely, and mail them with tracking.', correct: true, feedback: 'Easiest money ever! The whale is extremely happy.', statChanges: { smarts: 5, status: 5 } },
        { text: 'Get offended, scream at them in chat, and ban them immediately.', correct: false, feedback: 'You lost your biggest financial supporter.', statChanges: { status: -10 } },
        { text: 'Send them clean socks from the store and hope they don\'t notice.', correct: false, feedback: 'They noticed, filed a chargeback, and left a bad review.', statChanges: { smarts: -5 } }
      ]
    },
    {
      question: 'During a live filming session, a heavy overhead lighting rig collapses and sparks fly near the set. The director yells "Keep rolling!" What do you do?',
      options: [
        { text: 'Step back safely, call for a technical pause, and wait for the crew to fix it.', correct: true, feedback: 'Safety first. The crew appreciates your professionalism.', statChanges: { smarts: 10, status: 10 } },
        { text: 'Pose dramatically next to the sparks to make the shot look more intense.', correct: false, feedback: 'You got a minor shock and had to be treated by the set medic.', statChanges: { status: -10 } },
        { text: 'Scream, run off set crying, and sue the studio immediately.', correct: false, feedback: 'You were blacklisted from future studio projects.', statChanges: { status: -25 } }
      ]
    }
  ]
};

const ASSETS_LIST = [
  // --- YOUTH & EVERYDAY ITEMS (Realistic prices) ---
  { id: 'bubblegum', name: 'Double-Bubble Fruit Bubblegum', cost: 1, style: 1, status: 0, type: 'everyday' as const, ageRequired: 1, maxAge: 17, desc: 'Creates massive bubbles and tastes like pure sugar for exactly 45 seconds.' },
  { id: 'pencil', name: 'Fancy Mechanical Pencil & Sketchbook', cost: 5, style: 1, status: 1, type: 'everyday' as const, ageRequired: 4, desc: 'A sleek professional pencil with replacement leads and a premium gridded notebook.' },
  { id: 'coffee', name: 'Cup of Artisan Vanilla Latte', cost: 6, style: 1, status: 1, type: 'everyday' as const, ageRequired: 14, desc: 'Freshly roasted single-origin beans with silky microfoam. Pure morning focus.' },
  { id: 'yoyo', name: 'Championship Stunt Yo-Yo', cost: 12, style: 2, status: 1, type: 'toy' as const, ageRequired: 5, maxAge: 17, desc: 'Features a high-speed ball bearing for performing insane sleep and loop tricks.' },
  { id: 'comic', name: 'Rare Superhero Comic Book', cost: 25, style: 2, status: 2, type: 'toy' as const, ageRequired: 7, maxAge: 25, desc: 'A limited edition comic featuring the debut of a legendary space crusader.' },
  { id: 'book', name: 'Biography of a Tech Visionary', cost: 28, style: 1, status: 2, type: 'everyday' as const, ageRequired: 12, desc: 'Packed with leadership formulas, corporate intrigue, and motivational quotes.' },
  { id: 'skateboard', name: 'Pro-Model Maple Skateboard', cost: 75, style: 10, status: 5, type: 'vehicle' as const, ageRequired: 8, maxAge: 21, desc: 'Seven-ply Canadian maple deck with customized grip-tape and super smooth bearings.' },
  { id: 'hoodie', name: 'Limited-Drop Streetwear Hoodie', cost: 110, style: 12, status: 8, type: 'accessory' as const, ageRequired: 12, desc: 'A heavy-cotton embroidered hoodie from an ultra-popular underground brand.' },
  { id: 'gym', name: 'Premium Gym Membership (Annual)', cost: 360, style: 10, status: 5, type: 'everyday' as const, ageRequired: 16, desc: 'Full access to state-of-the-art power racks, dry saunas, and complimentary organic juices.' },
  
  // --- GADGETS & GEAR ---
  { id: 'console', name: 'Next-Gen Gaming Console', cost: 499, style: 2, status: 5, type: 'gadget' as const, ageRequired: 10, desc: 'Boasts 4K ray-tracing and instant loading screens. Perfect for weekend escapes.' },
  { id: 'bicycle', name: 'Commuter Urban Road Bicycle', cost: 550, style: 5, status: 5, type: 'vehicle' as const, ageRequired: 12, desc: 'Lightweight alloy frame, hydraulic disc brakes, and slick tires for city cruising.' },
  { id: 'phone', name: 'Titanium Flagship Smartphone', cost: 1099, style: 8, status: 10, type: 'gadget' as const, ageRequired: 12, desc: 'Features a massive professional-grade zoom camera and premium titanium bezel.' },
  { id: 'watch', name: 'Designer Sports Chronometer', cost: 2200, style: 15, status: 12, type: 'accessory' as const, ageRequired: 18, desc: 'A Swiss-engineered sapphire-glass timepiece that instantly commands corporate presence.' },
  
  // --- HIGH-END ASSETS & VEHICLES ---
  { id: 'sedan', name: 'Reliable Used Sedan', cost: 6500, style: 5, status: 15, type: 'vehicle' as const, ageRequired: 16, desc: 'Well-maintained, fuel-efficient daily driver. Cold AC and a roaring engine.' },
  { id: 'sportscar', name: 'Prestige Supercharged V8 Sportscar', cost: 65000, style: 40, status: 45, type: 'vehicle' as const, ageRequired: 18, desc: 'Deafening active exhaust notes, carbon-fiber spoiler, and unparalleled highway prestige.' },
  { id: 'condo', name: 'Downtown High-Rise Luxury Condo', cost: 250000, style: 35, status: 60, type: 'property' as const, ageRequired: 18, desc: 'Modern loft layout with breathtaking floor-to-ceiling skyline views.' },
  { id: 'estate', name: 'Historic Suburban Gated Estate', cost: 850000, style: 50, status: 85, type: 'property' as const, ageRequired: 21, desc: 'Sprawling private grounds, manicured topiary lawns, an infinity pool, and timeless charm.' }
];

interface FightState {
  opponentName: string;
  opponentId?: string;
  move: string;
  target: string;
}

interface FightOutcomeState {
  victory: boolean;
  text: string;
  statChangesText: string;
}

interface MedicalReportState {
  success: boolean;
  text: string;
  cost: number;
}


const FIGHT_MOVES = [
  { id: 'uppercut', name: 'Uppercut', emoji: '👊', desc: 'Powerful vertical fist launch' },
  { id: 'grab', name: 'Grab', emoji: '👐', desc: 'Secure them in a tight hold' },
  { id: 'punch', name: 'Punch', emoji: '🤛', desc: 'Standard straight jab' },
  { id: 'left_kick', name: 'Left Kick', emoji: '🦵', desc: 'Lethal roundhouse sweep' },
  { id: 'right_kick', name: 'Right Kick', emoji: '🦵', desc: 'Lethal roundhouse sweep' },
  { id: 'eye_poke', name: 'Eye Poke', emoji: '👉', desc: 'Direct poke to render blind' },
  { id: 'pinch', name: 'Pinch', emoji: '🤏', desc: 'Nasty skin squeeze' },
  { id: 'tickle', name: 'Tickle', emoji: '👈', desc: 'A silly tickling attempt' },
  { id: 'touch', name: 'Touch', emoji: '🤝', desc: 'A completely harmless brush' }
];

const FIGHT_TARGETS = [
  { id: 'hand', name: 'Hand', emoji: '✋' },
  { id: 'face', name: 'Face', emoji: '👁️' },
  { id: 'skull', name: 'Skull', emoji: '💀' },
  { id: 'jaw', name: 'Jaw', emoji: '🦷' },
  { id: 'stomach', name: 'Stomach', emoji: '🤢' },
  { id: 'leg', name: 'Leg', emoji: '🦿' },
  { id: 'lips', name: 'Lips', emoji: '👄' },
  { id: 'dd', name: 'DD', emoji: '🍑' }
];

const INFANT_ILLNESSES: IllnessTemplate[] = [
  { id: 'baby_colic', name: 'Baby Colic', type: 'minor', curable: true, healthImpactPerYear: 2, happinessImpactPerYear: 18, cureCost: 15, minDuration: 1, maxDuration: 2, baseCureChance: 0.9 },
  { id: 'teething_fever', name: 'Teething Fever', type: 'minor', curable: true, healthImpactPerYear: 4, happinessImpactPerYear: 12, cureCost: 10, minDuration: 1, maxDuration: 1, baseCureChance: 0.95 },
  { id: 'diaper_rash', name: 'Severe Diaper Rash', type: 'minor', curable: true, healthImpactPerYear: 1, happinessImpactPerYear: 8, cureCost: 8, minDuration: 1, maxDuration: 1, baseCureChance: 0.99 },
  { id: 'baby_croup', name: 'Infant Croup Cough', type: 'minor', curable: true, healthImpactPerYear: 8, happinessImpactPerYear: 14, cureCost: 35, minDuration: 1, maxDuration: 2, baseCureChance: 0.85 },
  { id: 'baby_flu', name: 'Infant RSV / Flu', type: 'minor', curable: true, healthImpactPerYear: 12, happinessImpactPerYear: 18, cureCost: 50, minDuration: 1, maxDuration: 3, baseCureChance: 0.8 }
];

const MINOR_ILLNESSES: IllnessTemplate[] = [
  { id: 'flu', name: 'Seasonal Flu', type: 'minor', curable: true, healthImpactPerYear: 6, happinessImpactPerYear: 10, cureCost: 40, minDuration: 2, maxDuration: 4, baseCureChance: 0.85 },
  { id: 'cold', name: 'Common Cold', type: 'minor', curable: true, healthImpactPerYear: 3, happinessImpactPerYear: 5, cureCost: 15, minDuration: 3, maxDuration: 5, baseCureChance: 0.95 },
  { id: 'migraine', name: 'Acute Migraine', type: 'minor', curable: true, healthImpactPerYear: 5, happinessImpactPerYear: 15, cureCost: 65, minDuration: 1, maxDuration: 5, baseCureChance: 0.75 },
  { id: 'poisoning', name: 'Food Poisoning', type: 'minor', curable: true, healthImpactPerYear: 12, happinessImpactPerYear: 12, cureCost: 80, minDuration: 1, maxDuration: 1, baseCureChance: 0.99 },
  { id: 'strep', name: 'Strep Throat', type: 'minor', curable: true, healthImpactPerYear: 4, happinessImpactPerYear: 8, cureCost: 35, minDuration: 1, maxDuration: 2, baseCureChance: 0.9 }
];

const CHRONIC_ILLNESSES: IllnessTemplate[] = [
  { id: 'asthma', name: 'Asthma', type: 'chronic', curable: false, healthImpactPerYear: 3, happinessImpactPerYear: 4, cureCost: 120, minDuration: 10, maxDuration: 80, baseCureChance: 0.1 },
  { id: 'allergies', name: 'Severe Pollen Allergy', type: 'chronic', curable: false, healthImpactPerYear: 2, happinessImpactPerYear: 6, cureCost: 30, minDuration: 5, maxDuration: 80, baseCureChance: 0.15 },
  { id: 'anxiety', name: 'Generalized Anxiety', type: 'chronic', curable: true, healthImpactPerYear: 2, happinessImpactPerYear: 14, cureCost: 200, minDuration: 3, maxDuration: 25, baseCureChance: 0.25 },
  { id: 'gonorrhea', name: 'Gonorrhea', type: 'chronic', curable: true, healthImpactPerYear: 8, happinessImpactPerYear: 15, cureCost: 350, minDuration: 5, maxDuration: 15, baseCureChance: 0.05, requiresFlag: 'has_unprotected_sex' }
];

const TERMINAL_ILLNESSES: IllnessTemplate[] = [
  { id: 'leukemia', name: 'Acute Leukemia', type: 'terminal', curable: true, healthImpactPerYear: 22, happinessImpactPerYear: 25, cureCost: 7500, minDuration: 99, maxDuration: 99, baseCureChance: 0.05 },
  { id: 'heart_failure', name: 'Cardiac Valve Failure', type: 'terminal', curable: true, healthImpactPerYear: 18, happinessImpactPerYear: 20, cureCost: 9000, minDuration: 99, maxDuration: 99, baseCureChance: 0.08 },
  { id: 'brain_tumor', name: 'Malignant Brain Tumor', type: 'terminal', curable: true, healthImpactPerYear: 25, happinessImpactPerYear: 30, cureCost: 12000, minDuration: 99, maxDuration: 99, baseCureChance: 0.02 },
  { id: 'hiv', name: 'HIV', type: 'terminal', curable: false, healthImpactPerYear: 15, happinessImpactPerYear: 35, cureCost: 0, minDuration: 99, maxDuration: 99, baseCureChance: 0, requiresFlag: 'has_unprotected_sex' }
];

const MAJORS = [
  'Information Systems', 'Engineering', 'History', 'Accounting', 
  'Religious Studies', 'Computer Science', 'Business', 'Biology', 
  'Nursing', 'Law', 'English', 'Mathematics', 'Physics', 'Psychology',
  'Art History', 'Chemistry', 'Political Science', 'Economics',
  'Software Engineering', 'Astrobiology', 'Cryptid Zoology', 'Quantum Engineering',
  'Ethical Hacking', 'Space Colonization', 'Cybersecurity', 'Data Science',
  'Graphic Design', 'Architecture', 'Occult Sciences', 'Botany', 'Culinary Arts',
  'Cinematography', 'Music Production', 'Journalism', 'Robotics', 'Game Design',
  'Marine Biology', 'Astrophysics', 'Creative Writing', 'Philosophy', 'Sociology',
  'Anthropology', 'Criminal Justice', 'Marketing', 'Finance', 'Supply Chain Management'
];

const EDUCATION_OPTIONS = [
  { id: 'community_college', name: 'Community College', subtitle: 'Take some local classes', icon: '🏫', level: 'Undergraduate' },
  { id: 'university', name: 'University', subtitle: 'Get a college degree', icon: '🏛️', level: 'Undergraduate' },
  { id: 'graduate_school', name: 'Graduate School', subtitle: 'Continue your university focus', icon: '🎓', level: 'Graduate' },
  { id: 'business_school', name: 'Business School', subtitle: 'Study to be a business leader', icon: '📊', level: 'Professional' },
  { id: 'dental_school', name: 'Dental School', subtitle: 'Study to be a dentist', icon: '🦷', level: 'Professional' },
  { id: 'law_school', name: 'Law School', subtitle: 'Study to be a lawyer', icon: '⚖️', level: 'Professional' },
  { id: 'medical_school', name: 'Medical School', subtitle: 'Study to be a doctor', icon: '🚑', level: 'Professional' },
  { id: 'nursing_school', name: 'Nursing School', subtitle: 'Study to be a nurse', icon: '🎀', level: 'Professional' },
  { id: 'coding_bootcamp', name: 'Coding Bootcamp', subtitle: 'Fast-track to tech', icon: '💻', level: 'Trade' },
  { id: 'culinary_institute', name: 'Culinary Institute', subtitle: 'Master the culinary arts', icon: '🍳', level: 'Trade' },
  { id: 'space_academy', name: 'Space Academy', subtitle: 'Train for the stars', icon: '🚀', level: 'Professional' },
  { id: 'occult_seminary', name: 'Occult Seminary', subtitle: 'Study the unknown', icon: '🔮', level: 'Graduate' },
  { id: 'police_academy', name: 'Police Academy', subtitle: 'Train for law enforcement', icon: '🚓', level: 'Trade' },
  { id: 'flight_school', name: 'Flight School', subtitle: 'Learn to pilot aircraft', icon: '✈️', level: 'Trade' }
];

const ALL_ACTIVITIES = [
  { id: 'accessories', name: 'Accessories', subtitle: 'Accessorize yourself', icon: ShoppingBag, color: 'text-amber-500', minAge: 12, functional: false },
  { id: 'adoption', name: 'Adoption', subtitle: 'Adopt a child', icon: Baby, color: 'text-orange-400', minAge: 18, functional: false },
  { id: 'crime', name: 'Crime', subtitle: 'Commit a crime', icon: Skull, color: 'text-red-600', minAge: 14, functional: false },
  { id: 'dating', name: 'Dating App', subtitle: 'Find someone to love', icon: Heart, color: 'text-pink-500', minAge: 16, functional: true },
  { id: 'doctors', name: 'Doctor', subtitle: 'Visit the doctor', icon: Stethoscope, color: 'text-emerald-500', minAge: 0, functional: true },
  { id: 'emigrate', name: 'Emigrate', subtitle: 'Move to another country', icon: Plane, color: 'text-blue-500', minAge: 18, functional: false },
  { id: 'extreme', name: 'Extreme Sports', subtitle: 'Push your limits', icon: Mountain, color: 'text-slate-600', minAge: 16, functional: false },
  { id: 'fame', name: 'Fame', subtitle: 'Manage your fame', icon: Star, color: 'text-yellow-400', minAge: 18, functional: false },
  { id: 'gamble', name: 'Gamble', subtitle: 'Visit a local casino', icon: Dices, color: 'text-indigo-600', minAge: 18, functional: false },
  { id: 'gym', name: 'Mind & Body', subtitle: 'Take care of yourself', icon: Activity, color: 'text-rose-500', minAge: 12, functional: true },
  { id: 'hackathon', name: 'Hackathon', subtitle: 'Compete in coding events', icon: Laptop, color: 'text-cyan-500', minAge: 12, functional: false },
  { id: 'identity', name: 'Identity', subtitle: 'Define your identity', icon: UserCircle, color: 'text-indigo-400', minAge: 10, functional: false },
  { id: 'lawsuit', name: 'Lawsuit', subtitle: 'Sue someone', icon: Scale, color: 'text-stone-600', minAge: 18, functional: false },
  { id: 'lottery', name: 'Lottery', subtitle: 'Play the lottery', icon: Ticket, color: 'text-emerald-400', minAge: 18, functional: false },
  { id: 'nightlife', name: 'Nightlife', subtitle: 'Go clubbing', icon: Wine, color: 'text-fuchsia-500', minAge: 18, functional: false },
  { id: 'pets', name: 'Pets', subtitle: 'Get a pet', icon: Dog, color: 'text-amber-700', minAge: 4, functional: false },
  { id: 'rehab', name: 'Rehab', subtitle: 'Battle your addictions', icon: Sun, color: 'text-yellow-500', minAge: 14, functional: false },
  { id: 'sidehustle', name: 'Side Hustle', subtitle: 'Start a mini-business', icon: Briefcase, color: 'text-teal-700', minAge: 14, functional: false },
  { id: 'style', name: 'Shopping', subtitle: 'Upgrade your wardrobe', icon: Sparkles, color: 'text-purple-500', minAge: 12, functional: true },
  { id: 'socialmedia', name: 'Social Media', subtitle: 'Manage online identity', icon: Smartphone, color: 'text-blue-400', minAge: 13, functional: false },
  { id: 'therapy', name: 'Therapy', subtitle: 'Improve your mental health', icon: Brain, color: 'text-teal-400', minAge: 12, functional: false },
  { id: 'vacation', name: 'Vacation', subtitle: 'Go on a vacation', icon: Palmtree, color: 'text-lime-500', minAge: 18, functional: false },
  { id: 'volunteer', name: 'Volunteering', subtitle: 'Give back to community', icon: HandHeart, color: 'text-rose-400', minAge: 10, functional: false },
  { id: 'will', name: 'Will & Testament', subtitle: 'Manage your legacy', icon: FileText, color: 'text-slate-500', minAge: 18, functional: false }
];


export function getAvatarUrl(config: AvatarConfig | undefined, age: number, defaultGender?: string): string {
  const gender = defaultGender || 'Male';
  if (!config) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(gender)}`;
  }
  const {
    eyes = 'default',
    eyebrows = 'default',
    mouth = 'smile',
    skinColor = 'ffdbb4',
    hairColor = '2c1b18',
    facialHair = 'none',
    facialHairColor = '2c1b18',
    top = 'shortRound',
  } = config;

  // Beard & mustache (facialHair) is only shown after character reaches 25 years of age.
  const appliedFacialHair = age >= 25 ? facialHair : 'none';

  // Map simplified top/hair styles to exact Dicebear avataaars v7 values to prevent validation errors
  let mappedTop = 'shortHairShortRound';
  switch (top) {
    case 'shortRound':
      mappedTop = 'shortHairShortRound';
      break;
    case 'sides':
      mappedTop = 'shortHairSides';
      break;
    case 'dreads':
      mappedTop = gender === 'Male' ? 'shortHairDreads01' : 'longHairDreads';
      break;
    case 'shaggy':
      mappedTop = 'shortHairShaggyMullet';
      break;
    case 'curly':
      mappedTop = gender === 'Male' ? 'shortHairShortCurly' : 'longHairCurly';
      break;
    case 'frizzle':
      mappedTop = 'shortHairFrizzle';
      break;
    case 'straight2':
      mappedTop = 'longHairStraight2';
      break;
    case 'straightAndCurly':
      mappedTop = 'longHairCurvy';
      break;
    case 'longHair':
      mappedTop = 'longHairStraight';
      break;
    case 'noHair':
      mappedTop = 'noHair';
      break;
    default:
      if (top.startsWith('shortHair') || top.startsWith('longHair') || top === 'noHair') {
        mappedTop = top;
      } else {
        mappedTop = gender === 'Male' ? 'shortHairShortRound' : 'longHairStraight';
      }
  }

  // Build parameters object
  const queryParams: Record<string, string> = {
    eyebrows,
    eyes,
    mouth,
    skinColor,
    top: mappedTop,
    topColor: hairColor,
    accessories: 'none',
  };

  // Facial hair probability & style
  if (appliedFacialHair && appliedFacialHair !== 'none') {
    queryParams.facialHair = appliedFacialHair;
    queryParams.facialHairColor = facialHairColor;
    queryParams.facialHairProbability = '100';
  } else {
    queryParams.facialHairProbability = '0';
  }

  // Top/hair probability
  if (mappedTop === 'noHair') {
    queryParams.topProbability = '0';
  } else {
    queryParams.topProbability = '100';
  }

  const params = new URLSearchParams(queryParams);
  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'age_18', title: 'Adulthood', description: 'Survive and reach 18 years of age.', emoji: '🎓' },
  { id: 'age_60', title: 'Golden Years', description: 'Survive and reach 60 years of age.', emoji: '👴' },
  { id: 'age_90', title: 'Centenarian', description: 'Survive and reach 90 years of age.', emoji: '🏆' },
  { id: 'wealth_100k', title: 'Six Figures', description: 'Reach a net worth of $100,000.', emoji: '💼' },
  { id: 'wealth_1m', title: 'First Million', description: 'Reach a net worth of $1,000,000.', emoji: '💰' },
  { id: 'wealth_10m', title: 'Decamillionaire', description: 'Reach a net worth of $10,000,000.', emoji: '👑' },
  { id: 'stat_health_100', title: 'Peak Fitness', description: 'Reach 100% Health.', emoji: '❤️' },
  { id: 'stat_smarts_100', title: 'Einstein', description: 'Reach 100% Smarts.', emoji: '🧠' },
  { id: 'stat_looks_100', title: 'Supermodel', description: 'Reach 100% Looks.', emoji: '✨' },
  { id: 'stat_happiness_100', title: 'Pure Bliss', description: 'Reach 100% Happiness.', emoji: '😊' },
  { id: 'assets_3', title: 'Property Tycoon', description: 'Own 3 or more assets at the same time.', emoji: '🏰' },
  { id: 'perfect_relation', title: 'Soulmate', description: 'Have a relationship with 100% Trust & Respect.', emoji: '💖' },
  { id: 'overcome_terminal', title: 'Medical Miracle', description: 'Get cured from a terminal illness.', emoji: '🩺' },
];

export interface MilestoneInfo {
  icon: string;
  title: string;
  color: string;
  bgLight: string;
  borderClass: string;
  textClass: string;
}

export function detectMilestone(log: string): MilestoneInfo | null {
  const text = log.toLowerCase();
  
  if (log.includes('👶') || text.includes('i was born') || text.includes('biological constitution')) {
    return {
      icon: '👶',
      title: 'Miracle of Birth',
      color: 'from-blue-500 to-sky-500',
      bgLight: 'bg-blue-50/70 border-blue-200',
      borderClass: 'border-blue-300',
      textClass: 'text-blue-950 font-bold'
    };
  }
  
  if (log.includes('🎓') || text.includes('graduated') || text.includes('graduation') || text.includes('college') || text.includes('university') || text.includes('high school')) {
    return {
      icon: '🎓',
      title: 'Academic Milestone',
      color: 'from-violet-600 to-indigo-600',
      bgLight: 'bg-indigo-50/70 border-indigo-200',
      borderClass: 'border-indigo-300',
      textClass: 'text-indigo-950 font-bold'
    };
  }

  if (log.includes('🏫') || log.includes('🎒') || text.includes('started attending')) {
    return {
      icon: '🏫',
      title: 'Education Phase',
      color: 'from-indigo-500 to-purple-500',
      bgLight: 'bg-indigo-50/40 border-indigo-100',
      borderClass: 'border-indigo-200',
      textClass: 'text-indigo-900 font-bold'
    };
  }

  if (text.includes('started dating') || text.includes('soulmate') || text.includes('engaged') || text.includes('proposed') || text.includes('wedding') || text.includes('married')) {
    return {
      icon: '💖',
      title: 'Romantic Milestone',
      color: 'from-pink-500 to-rose-500',
      bgLight: 'bg-rose-50/70 border-rose-200',
      borderClass: 'border-rose-300',
      textClass: 'text-rose-950 font-semibold'
    };
  }

  if (text.includes('broke up') || text.includes('divorced') || text.includes('rejected me')) {
    return {
      icon: '💔',
      title: 'Heartbreak',
      color: 'from-slate-500 to-slate-600',
      bgLight: 'bg-slate-100/80 border-slate-200',
      borderClass: 'border-slate-300',
      textClass: 'text-slate-950'
    };
  }

  if (text.includes('offered the job') || text.includes('started working') || text.includes('promoted to') || text.includes('promotion') || text.includes('career changed to') || text.includes('retired')) {
    return {
      icon: '💼',
      title: 'Professional Milestone',
      color: 'from-emerald-600 to-teal-600',
      bgLight: 'bg-emerald-50/70 border-emerald-200',
      borderClass: 'border-emerald-300',
      textClass: 'text-emerald-950 font-semibold'
    };
  }

  if (text.includes('bought') || text.includes('purchased') || text.includes('acquired asset') || text.includes('mansion') || text.includes('estate') || text.includes('yacht')) {
    return {
      icon: '🏰',
      title: 'Major Acquisition',
      color: 'from-amber-500 to-yellow-600',
      bgLight: 'bg-amber-50/70 border-amber-200',
      borderClass: 'border-amber-300',
      textClass: 'text-amber-950 font-semibold'
    };
  }

  if (text.includes('critical health alert') || text.includes('diagnosed with') || text.includes('terminal')) {
    return {
      icon: '🚨',
      title: 'Medical Crisis',
      color: 'from-red-600 to-rose-700',
      bgLight: 'bg-red-50/80 border-red-200',
      borderClass: 'border-red-300',
      textClass: 'text-red-950 font-bold'
    };
  }

  if (text.includes('cured') || text.includes('recovered from') || text.includes('miraculously')) {
    return {
      icon: '🩺',
      title: 'Medical Miracle',
      color: 'from-cyan-500 to-teal-500',
      bgLight: 'bg-cyan-50/70 border-cyan-200',
      borderClass: 'border-cyan-300',
      textClass: 'text-cyan-950 font-semibold'
    };
  }

  if (text.includes('passed away') || text.includes('died') || text.includes('funeral')) {
    return {
      icon: '⚱️',
      title: 'Tragic Bereavement',
      color: 'from-slate-700 to-zinc-800',
      bgLight: 'bg-slate-100/90 border-slate-300',
      borderClass: 'border-slate-400',
      textClass: 'text-slate-900 font-semibold'
    };
  }

  if (text.includes('fight result') || text.includes('defeated') || text.includes('won the fight') || text.includes('attacked')) {
    return {
      icon: '⚡',
      title: 'Physical Confrontation',
      color: 'from-orange-500 to-amber-600',
      bgLight: 'bg-orange-50/60 border-orange-200',
      borderClass: 'border-orange-300',
      textClass: 'text-orange-950 font-semibold'
    };
  }

  if (text.includes('lottery') || text.includes('won $') || text.includes('casino') || text.includes('jackpot')) {
    return {
      icon: '💵',
      title: 'Fortune Smile',
      color: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50/70 border-green-200',
      borderClass: 'border-green-300',
      textClass: 'text-green-950 font-bold'
    };
  }

  // --- UNHINGED 18+ ADULT MILESTONES ---
  if (text.includes('feet-modeling') || text.includes('toesofglory') || text.includes('foot-modeling')) {
    return {
      icon: '🦶',
      title: 'Spicy Side-Hustle',
      color: 'from-purple-500 to-pink-500',
      bgLight: 'bg-pink-50/70 border-pink-200',
      borderClass: 'border-pink-300',
      textClass: 'text-pink-950 font-extrabold'
    };
  }

  if (text.includes('billionaire') || text.includes('sugar-companion') || text.includes('sugar-dating') || text.includes('lord_bentley')) {
    return {
      icon: '💎',
      title: 'Sugar Arrangement',
      color: 'from-cyan-500 to-blue-600',
      bgLight: 'bg-cyan-50/60 border-cyan-200',
      borderClass: 'border-cyan-300',
      textClass: 'text-cyan-950 font-extrabold'
    };
  }

  if (text.includes('masquerade rave') || text.includes('neon cocktail') || text.includes('table dance') || text.includes('warehouse party')) {
    return {
      icon: '🎪',
      title: 'Wild Night Out',
      color: 'from-fuchsia-500 to-indigo-500',
      bgLight: 'bg-fuchsia-50/60 border-fuchsia-200',
      borderClass: 'border-fuchsia-300',
      textClass: 'text-fuchsia-950 font-bold'
    };
  }

  if (text.includes('tattoo') || text.includes('piercing') || text.includes('piercings')) {
    return {
      icon: '🎨',
      title: 'Body Modification',
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50/60 border-amber-200',
      borderClass: 'border-amber-300',
      textClass: 'text-amber-950 font-bold'
    };
  }

  if (text.includes('secret affair') || text.includes('tryst') || text.includes('blackmailed the vice-president')) {
    return {
      icon: '🔥',
      title: 'Forbidden Romance',
      color: 'from-red-500 to-pink-600',
      bgLight: 'bg-red-50/60 border-red-200',
      borderClass: 'border-red-300',
      textClass: 'text-red-950 font-extrabold'
    };
  }

  if (text.includes('fired in disgrace') || text.includes('quiet resignation') || text.includes('scandal')) {
    return {
      icon: '🚨',
      title: 'Career Scandal',
      color: 'from-rose-600 to-red-700',
      bgLight: 'bg-rose-50/80 border-rose-200',
      borderClass: 'border-rose-300',
      textClass: 'text-rose-950 font-black'
    };
  }

  return null;
}

function generateSchoolContacts(isHighSchool: boolean): Relationship[] {
  const classmates = [
    { name: 'Aleksander Sawicki', gender: 'Male', occupation: 'Student' },
    { name: 'Bruno Adamski', gender: 'Male', occupation: 'Student' },
    { name: 'Hui-wen Jen', gender: 'Female', occupation: 'Student' },
    { name: 'Ignacy Dabrowski', gender: 'Male', occupation: 'Student' },
    { name: 'Kacper Dabrowski', gender: 'Male', occupation: 'Student' },
    { name: 'Kamil Adamski', gender: 'Male', occupation: 'Student' },
    { name: 'Karolina Gorski', gender: 'Female', occupation: 'Student' },
    { name: 'Karolina Szczepanski', gender: 'Female', occupation: 'Student' },
    { name: 'Zofia Nowak', gender: 'Female', occupation: 'Student' },
    { name: 'Marek Kowalski', gender: 'Male', occupation: 'Student' },
    { name: 'Aneta Wisniewska', gender: 'Female', occupation: 'Student' },
    { name: 'Sylwia Kaminska', gender: 'Female', occupation: 'Student' },
    { name: 'Tomasz Lewandowski', gender: 'Male', occupation: 'Student' }
  ];

  const teachers = [
    { name: 'Mrs. Wysocki', gender: 'Female', occupation: 'Homeroom Teacher' },
    { name: 'Mr. Adamski', gender: 'Male', occupation: 'Music Teacher' },
    { name: 'Mrs. Szczepanski', gender: 'Female', occupation: 'PE Teacher' },
    { name: 'Mrs. Wisniewski', gender: 'Female', occupation: 'Headmaster' },
    { name: 'Mr. Zielinski', gender: 'Male', occupation: 'Science Teacher' },
    { name: 'Mrs. Szymanski', gender: 'Female', occupation: 'Art Teacher' }
  ];

  // Shuffle & pick 6 classmates
  const pickedClassmates = [...classmates]
    .sort(() => 0.5 - Math.random())
    .slice(0, 6)
    .map((c, i) => ({
      id: `classmate_${Date.now()}_${i}`,
      name: c.name,
      relation: 'classmate' as const,
      archetype: (Math.random() < 0.2 ? 'toxic friend' : Math.random() < 0.2 ? 'rival' : 'average') as any,
      age: isHighSchool ? Math.floor(Math.random() * 3) + 14 : Math.floor(Math.random() * 3) + 6,
      gender: c.gender,
      occupation: c.occupation,
      trust: Math.floor(Math.random() * 40) + 30, // 30 - 70 initial trust
      suspicion: Math.floor(Math.random() * 20),
      resentment: Math.floor(Math.random() * 20)
    }));

  // Shuffle & pick 3 teachers
  const pickedTeachers = [...teachers]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((t, i) => ({
      id: `teacher_${Date.now()}_${i}`,
      name: t.name,
      relation: 'teacher' as const,
      archetype: 'mentor' as const,
      age: Math.floor(Math.random() * 30) + 30,
      gender: t.gender,
      occupation: t.occupation,
      trust: Math.floor(Math.random() * 30) + 40, // 40 - 70 initial trust
      suspicion: Math.floor(Math.random() * 10),
      resentment: Math.floor(Math.random() * 10)
    }));

  return [...pickedClassmates, ...pickedTeachers];
}

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [schoolSubView, setSchoolSubView] = useState<'main' | 'class' | 'faculty' | 'private' | 'nurse' | null>('main');
  const [selectedClassmate, setSelectedClassmate] = useState<Relationship | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Relationship | null>(null);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(true);
  const [selectedMapCity, setSelectedMapCity] = useState<MapCity | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'school' | 'assets' | 'relationships' | 'activities'>('home');
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [showExes, setShowExes] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<'job' | 'gym' | 'study' | 'style' | 'dating' | 'assets' | 'doctor' | null>(null);
  const [jobInterview, setJobInterview] = useState<{job: typeof JOB_INTERVIEWS[0], questionData: {question: string, options: JobInterviewOption[]}} | null>(null);
  const [datingAppMatch, setDatingAppMatch] = useState<Relationship | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAgeUpModal, setShowAgeUpModal] = useState(false);
  const [ageUpData, setAgeUpData] = useState<any>(null);
  const [showEventPopupModal, setShowEventPopupModal] = useState(false);
  const [eventPopupData, setEventPopupData] = useState<any>(null);
  const [purchasedAssets, setPurchasedAssets] = useState<string[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, { unlockedAt: string; characterName: string }>>(() => {
    try {
      const saved = localStorage.getItem('life_sim_unlocked_achievements');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [activeAchievementToast, setActiveAchievementToast] = useState<{
    id: string;
    title: string;
    emoji: string;
  } | null>(null);
  
  // Fight State
  const [activeFight, setActiveFight] = useState<FightState | null>(null);
  const [fightOutcome, setFightOutcome] = useState<FightOutcomeState | null>(null);

  // Occupation Overhaul States
  const [occupationSubView, setOccupationSubView] = useState<'main' | 'education' | 'jobs' | 'freelance' | 'current_job'>('main');
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<string>('Information Systems');
  
  // Interactive Ritual
  const [ritualPaymentActive, setRitualPaymentActive] = useState<{illnessName: string} | null>(null);
  const [ritualPaymentAmount, setRitualPaymentAmount] = useState<number>(100);
  
  // Doctor State
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [medicalReport, setMedicalReport] = useState<MedicalReportState | null>(null);

  // Appearance Modal State
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [assetsSubView, setAssetsSubView] = useState<'main' | 'possessions' | 'social_media' | 'social_channel_dashboard'>('main');
  const [activeSocialModal, setActiveSocialModal] = useState<'post' | 'troll' | 'celebrity' | 'promote' | null>(null);
  const [selectedVictim, setSelectedVictim] = useState<string>('');
  const [selectedPostType, setSelectedPostType] = useState<string>('');
  const [selectedCelebrity, setSelectedCelebrity] = useState<string>('');
  const [celebrityInteractionType, setCelebrityInteractionType] = useState<'reply' | 'flirt' | 'insult'>('reply');
  const [showVerifyRejection, setShowVerifyRejection] = useState<boolean>(false);
  const [showSubscriptionFeeModal, setShowSubscriptionFeeModal] = useState<boolean>(false);
  const [showWishlistModal, setShowWishlistModal] = useState<boolean>(false);
  const [wishlistGifts, setWishlistGifts] = useState<string[]>(['Shoes', 'Designer Bag', 'Lingerie']);
  const [tempSubscriptionPrice, setTempSubscriptionPrice] = useState<number>(10);
  const [selectedSocialChannel, setSelectedSocialChannel] = useState<string | null>(null);
  const [socialPostResult, setSocialPostResult] = useState<any | null>(null);
  const [animProgress, setAnimProgress] = useState<number>(0);

  // Sleep Popup state
  const [actionPopup, setActionPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    statsGained?: string;
  } | null>(null);

  // Journal log filter
  const [logFilter, setLogFilter] = useState<'all' | 'milestones'>('all');

  // Asset marketplace category filter
  const [assetMarketFilter, setAssetMarketFilter] = useState<'all' | 'youth' | 'gear' | 'estates'>('all');
  const [showShopModal, setShowShopModal] = useState(false);

  // Dynamic age-filtered assets list
  const ageFilteredAssets = useMemo(() => {
    if (!gameState) return [];
    const age = gameState.age;
    return ASSETS_LIST.filter(asset => {
      const meetsAge = age >= (asset.ageRequired || 0);
      const notTooOld = !asset.maxAge || age <= asset.maxAge;
      return meetsAge && notTooOld;
    });
  }, [gameState?.age]);

  // Category-filtered market assets list
  const displayedMarketAssets = useMemo(() => {
    return ageFilteredAssets.filter(asset => {
      if (assetMarketFilter === 'all') return true;
      if (assetMarketFilter === 'youth') {
        return asset.type === 'toy' || (asset.type === 'everyday' && asset.cost < 100);
      }
      if (assetMarketFilter === 'gear') {
        return asset.type === 'gadget' || asset.type === 'accessory' || (asset.type === 'everyday' && asset.cost >= 100);
      }
      if (assetMarketFilter === 'estates') {
        return asset.type === 'vehicle' || asset.type === 'property';
      }
      return true;
    });
  }, [ageFilteredAssets, assetMarketFilter]);

  // Parse milestones from the entire logs feed dynamically
  const parsedMilestones = useMemo(() => {
    if (!gameState || !gameState.log) return [];
    const list: { log: string; age: number; info: MilestoneInfo; originalIndex: number }[] = [];
    let currentAge = 0;
    
    gameState.log.forEach((log, idx) => {
      if (log.startsWith('🎂 Age ')) {
        const match = log.match(/Age (\d+)/);
        if (match) {
          currentAge = parseInt(match[1], 10);
        }
      }
      const info = detectMilestone(log);
      if (info) {
        list.push({
          log,
          age: currentAge,
          info,
          originalIndex: idx
        });
      }
    });
    return list;
  }, [gameState?.log]);

  const [isShaking, setIsShaking] = useState(false);
  const [isRedPulser, setIsRedPulser] = useState(false);

  // Trigger dramatic shake / red pulse effect on high-risk logs
  useEffect(() => {
    if (!gameState?.log || gameState.log.length === 0) return;
    const lastLog = gameState.log[gameState.log.length - 1];
    const secondLastLog = gameState.log.length > 1 ? gameState.log[gameState.log.length - 2] : '';
    const thirdLastLog = gameState.log.length > 2 ? gameState.log[gameState.log.length - 3] : '';

    const logsToCheck = [lastLog, secondLastLog, thirdLastLog].filter(Boolean);
    const hasHighRisk = logsToCheck.some(log => {
      const milestone = detectMilestone(log);
      if (!milestone) return false;
      return ['Medical Crisis', 'Career Scandal', 'Forbidden Romance', 'Heartbreak', 'Physical Confrontation'].includes(milestone.title);
    });

    if (hasHighRisk) {
      setIsShaking(true);
      setIsRedPulser(true);
      const timer = setTimeout(() => {
        setIsShaking(false);
        setIsRedPulser(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState?.log]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the life logs to the bottom when updated
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameState?.log, gameState?.age]);

  // Handle initial game creation on mount
  useEffect(() => {
    setIsCreatingCharacter(true);
  }, []);

  // Animate social post result counters over 1.2 seconds
  useEffect(() => {
    if (socialPostResult) {
      setAnimProgress(0);
      let start = null;
      const duration = 1200;
      let animFrame;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percent = Math.min(1, progress / duration);
        setAnimProgress(percent);
        if (percent < 1) {
          animFrame = requestAnimationFrame(animate);
        }
      };
      animFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animFrame);
    }
  }, [socialPostResult]);

  const relTrustString = gameState?.relationships ? JSON.stringify((Object.values(gameState.npcs || {}) as any[]).map(r => r.trust)) : '';
  const illnessesCuredString = gameState?.illnesses ? JSON.stringify(gameState.illnesses.map(i => i.cured)) : '';
  const purchasedAssetsCount = purchasedAssets.length;

  // Check achievements on game state changes
  useEffect(() => {
    if (!gameState) return;

    // Calculate current net worth
    const totalAssetCost = purchasedAssets.reduce((sum, aName) => {
      const found = ASSETS_LIST.find(a => a.name === aName);
      return sum + (found ? found.cost : 0);
    }, 0);
    const netWorth = gameState.cash + totalAssetCost;

    setUnlockedAchievements(prev => {
      const newUnlocks = { ...prev };
      let updated = false;

      ACHIEVEMENTS.forEach(ach => {
        if (newUnlocks[ach.id]) return;

        let met = false;
        switch (ach.id) {
          case 'age_18':
            met = gameState.age >= 18;
            break;
          case 'age_60':
            met = gameState.age >= 60;
            break;
          case 'age_90':
            met = gameState.age >= 90;
            break;
          case 'wealth_100k':
            met = netWorth >= 100000;
            break;
          case 'wealth_1m':
            met = netWorth >= 1000000;
            break;
          case 'wealth_10m':
            met = netWorth >= 10000000;
            break;
          case 'stat_health_100':
            met = gameState.stats.health >= 100;
            break;
          case 'stat_smarts_100':
            met = gameState.stats.smarts >= 100;
            break;
          case 'stat_looks_100':
            met = gameState.stats.looks >= 100;
            break;
          case 'stat_happiness_100':
            met = gameState.stats.happiness >= 100;
            break;
          case 'assets_3':
            met = purchasedAssets.length >= 3;
            break;
          case 'perfect_relation':
            met = (Object.values(gameState.npcs || {}) as any[]).some(rel => rel.trust >= 100);
            break;
          case 'overcome_terminal':
            met = gameState.illnesses.some(ill => ill.type === 'terminal' && ill.cured);
            break;
        }

        if (met) {
          newUnlocks[ach.id] = {
            unlockedAt: new Date().toISOString(),
            characterName: gameState.name
          };
          updated = true;

          setActiveAchievementToast({
            id: ach.id,
            title: ach.title,
            emoji: ach.emoji
          });

          // Auto dismiss toast
          setTimeout(() => {
            setActiveAchievementToast(curr => curr?.id === ach.id ? null : curr);
          }, 4000);
        }
      });

      if (updated) {
        localStorage.setItem('life_sim_unlocked_achievements', JSON.stringify(newUnlocks));
        setTimeout(() => triggerSound('success'), 0);
        return newUnlocks;
      }
      return prev;
    });
  }, [
    gameState?.age,
    gameState?.cash,
    gameState?.stats?.health,
    gameState?.stats?.smarts,
    gameState?.stats?.looks,
    gameState?.stats?.happiness,
    gameState?.name,
    purchasedAssetsCount,
    relTrustString,
    illnessesCuredString
  ]);

  const triggerSound = (type: 'click' | 'success' | 'error' | 'ageUp') => {
    if (!soundEnabled) return;
    if (type === 'click') playClick();
    if (type === 'success') playSuccess();
    if (type === 'error') playError();
    if (type === 'ageUp') playAgeUp();
  };

  const startNewGame = (customSetup?: {
    name: string;
    gender: 'Male' | 'Female';
    location: string;
    avatar?: string;
    avatarConfig?: AvatarConfig;
    stats: {
      health: number;
      smarts: number;
      looks: number;
      happiness: number;
    };
    karma?: number;
    willpower?: number;
    startingCash?: number;
  }) => {
    const gender = customSetup ? customSetup.gender : (Math.random() > 0.5 ? 'Male' : 'Female');
    const name = customSetup ? customSetup.name : `${gender === 'Male' ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;
    const location = customSetup ? customSetup.location : LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const avatar = customSetup?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    
    const startingKarma = customSetup?.karma !== undefined ? customSetup.karma : (Math.floor(Math.random() * 51) + 25);
    const startingWillpower = customSetup?.willpower !== undefined ? customSetup.willpower : (Math.floor(Math.random() * 51) + 25);
    
    const defaultAvatarConfig: AvatarConfig = {
      eyes: 'default',
      eyebrows: 'default',
      mouth: 'smile',
      skinColor: 'ffdbb4',
      hairColor: '2c1b18',
      facialHair: 'none',
      facialHairColor: '2c1b18',
      top: 'shortRound',
      eyesColorSimulated: 'Brown',
      lipsColorSimulated: 'Natural'
    };
    
    // 1. Roll congenital constitution
    let constitution: 'robust' | 'average' | 'frail' = 'average';
    let baseHealth = 75;

    if (customSetup) {
      baseHealth = customSetup.stats.health;
      if (baseHealth >= 85) {
        constitution = 'robust';
      } else if (baseHealth >= 65) {
        constitution = 'average';
      } else {
        constitution = 'frail';
      }
    } else {
      const constRoll = Math.random();
      if (constRoll < 0.65) {
        constitution = 'robust';
        baseHealth = Math.floor(Math.random() * 16) + 85; // 85-100
      } else if (constRoll < 0.90) {
        constitution = 'average';
        baseHealth = Math.floor(Math.random() * 20) + 65; // 65-84
      } else {
        constitution = 'frail';
        baseHealth = Math.floor(Math.random() * 21) + 35; // 35-55
      }
    }

    // 2. Initial stats
    const stats: Stats = {
      health: baseHealth,
      smarts: customSetup ? customSetup.stats.smarts : Math.floor(Math.random() * 60) + 30, // 30-90
      looks: customSetup ? customSetup.stats.looks : Math.floor(Math.random() * 50) + 40,  // 40-90
      happiness: customSetup ? customSetup.stats.happiness : Math.floor(Math.random() * 21) + 80, // 80-100
      style: 10,
      status: 10
    };

    // 3. Roll terminal susceptibility & uncurable rate
    const isTerminalSusceptible = Math.random() < 0.10; // 10% lifetime chance
    const isTerminalUncurable = isTerminalSusceptible && (Math.random() < 0.20); // 20% of terminal cases are uncurable

    const flags: Record<string, any> = {
      constitution,
      terminal_susceptible: isTerminalSusceptible,
      terminal_uncurable: isTerminalUncurable
    };

    // 4. Born illnesses roll (12% chance of starting with Asthma or Allergy)
    const activeIllnesses: Illness[] = [];
    const initialLogs = [
      `👶 I was born a ${gender.toLowerCase()} in ${location}.`,
      `🧬 Biological Constitution: I was born with a **${constitution.toUpperCase()}** physical state (Starting Health: ${stats.health}%).`,
      `🧠 Initial Intellect: My brain is developing at **${stats.smarts}%** capacity.`,
      `✨ Appearance: People remark that my starting looks are around **${stats.looks}%**.`,
      `😊 Starting Happiness: I am feeling **${stats.happiness}%** happy and cozy in my crib.`
    ];

    if (customSetup?.startingCash && customSetup.startingCash > 0) {
      initialLogs.push(`💰 Inheritance: I started life with a generous inheritance of $${customSetup.startingCash.toLocaleString()}!`);
    }

    if (Math.random() < 0.12) {
      const bornTemplates = [
        { id: 'asthma', name: 'Congenital Asthma', type: 'chronic' as const, curable: false, healthImpactPerYear: 3, happinessImpactPerYear: 4, cureCost: 120, minDuration: 10, maxDuration: 80, baseCureChance: 0.1 },
        { id: 'allergies', name: 'Severe Pollen Allergy', type: 'chronic' as const, curable: false, healthImpactPerYear: 1, happinessImpactPerYear: 3, cureCost: 30, minDuration: 5, maxDuration: 80, baseCureChance: 0.15 }
      ];
      const selectedBorn = bornTemplates[Math.floor(Math.random() * bornTemplates.length)];
      const randomDuration = Math.floor(Math.random() * (selectedBorn.maxDuration - selectedBorn.minDuration + 1)) + selectedBorn.minDuration;
      const illnessInstance: Illness = {
        id: `${selectedBorn.id}_born`,
        name: selectedBorn.name,
        type: selectedBorn.type,
        curable: selectedBorn.curable,
        cured: false,
        healthImpactPerYear: selectedBorn.healthImpactPerYear,
        happinessImpactPerYear: selectedBorn.happinessImpactPerYear,
        discoveredAge: 0,
        cureCost: selectedBorn.cureCost,
        remainingYears: randomDuration,
        baseCureChance: selectedBorn.baseCureChance
      };
      activeIllnesses.push(illnessInstance);
      initialLogs.push(`🤒 Medical Notice: I was diagnosed with **${selectedBorn.name}** at birth.`);
    }

    // Initial reputation dimensions
    const reputation: Reputation = {
      family: 80,
      college: 50,
      online: 50,
      workplace: 50,
      dating: 50
    };

    // Generate parents
    const lastName = name.includes(' ') ? name.split(' ').slice(-1)[0] : SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const momName = `${FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)]} ${lastName}`;
    const dadName = `${MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]} ${lastName}`;
    const momAge = Math.floor(Math.random() * 10) + 24; // 24-33
    const dadAge = Math.floor(Math.random() * 10) + 26; // 26-35

    const parentJobs = ['Accountant', 'Nurse', 'Electrician', 'Teacher', 'Designer', 'Chef'];
    const momJob = parentJobs[Math.floor(Math.random() * parentJobs.length)];
    const dadJob = parentJobs[Math.floor(Math.random() * parentJobs.length)];

    const parents: Relationship[] = [
      {
        id: 'mom',
        name: momName,
        relation: 'parent',
        archetype: 'mentor',
        age: momAge,
        gender: 'Female',
        occupation: momJob,
        trust: 90,
        suspicion: 5,
        resentment: 0
      },
      {
        id: 'dad',
        name: dadName,
        relation: 'parent',
        archetype: 'supportive friend',
        age: dadAge,
        gender: 'Male',
        occupation: dadJob,
        trust: 85,
        suspicion: 5,
        resentment: 0
      }
    ];

    initialLogs.push(
      `My mother is ${momName}, a ${momJob.toLowerCase()} (age ${momAge}).`,
      `My father is ${dadName}, an ${dadJob.toLowerCase()} (age ${dadAge}).`,
      `My parents named me ${name}.`,
      `🎂 Age 0 years: Enjoying the warm comfort of infancy.`
    );

    const initialGameState: GameState = {
      name,
      gender,
      avatar,
      avatarConfig: customSetup?.avatarConfig || defaultAvatarConfig,
      location,
      age: 0,
      alive: true,
      deathReason: '',
      cash: customSetup?.startingCash || 0,
      stats,
      reputation,
      relationships: parents as any,
      npcs: Object.fromEntries(parents.map(p => [p.id, relationshipToNPC(p)])),
      illnesses: activeIllnesses,
      flags,
      delayedEvents: [],
      followUpFlags: [],
      ongoingEffects: [],
      personalityTraits: [],
      log: initialLogs,
      career: {
        title: 'Infant',
        salary: 0,
        type: 'school',
        performance: 50,
        yearsInRole: 0
      },
      karma: startingKarma,
      willpower: startingWillpower,
      currentEvent: null,
      activeRelationshipContextId: null,
      recentEventIds: [],
      lastOutcome: null,
      completedEducation: [],
      socialMedia: {
        facebook: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        instagram: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        onlyfans: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, subscribers: 0, subscriptionPrice: 10, tipsCollected: false, wishlistPosted: false },
        tiktok: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, monetized: false },
        twitch: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, monetized: false },
        twitter: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        soundcloud: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        podcast: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        youtube: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, monetized: false }
      },
    };

    setGameState(initialGameState);
    setIsCreatingCharacter(false);
    setPurchasedAssets([]);
    setSelectedActivity(null);
    setJobInterview(null);
    setDatingAppMatch(null);
    setSelectedRelationship(null);
    setActiveTab('home');
    setShowProfileModal(false);
    setActiveFight(null);
    setFightOutcome(null);
    setShowDoctorModal(false);
    setMedicalReport(null);
    triggerSound('success');
  };

  const handleRestartClick = () => {
    triggerSound('click');
    setIsCreatingCharacter(true);
  };

  const executeInteractiveRitual = () => {
    if (!gameState || !ritualPaymentActive) return;
    
    if (gameState.cash < ritualPaymentAmount) {
      triggerSound('error');
      setActionPopup({ isOpen: true, title: 'Not enough cash', message: 'You cannot afford this sacrifice.' });
      return;
    }
    
    triggerSound('click');
    const payment = ritualPaymentAmount;
    
    const logPayment = Math.log10(Math.max(1, payment));
    const cureChance = 0.05 + ((logPayment / 6.0) * 0.8);
    const success = Math.random() < cureChance;

    let nextStats = { ...gameState.stats };
    let nextCash = gameState.cash - payment;
    let nextIllnesses = [...gameState.illnesses];
    let nextLog = [...gameState.log];
    let outcomeText = '';
    let statChanges = {};

    const illnessId = gameState.currentEvent?.id.split('_')[1];

    if (success) {
      nextStats.happiness = Math.min(100, nextStats.happiness + 20);
      nextStats.health = Math.min(100, nextStats.health + 25);
      statChanges = { happiness: 20, health: 25 };
      if (illnessId) {
         nextIllnesses = nextIllnesses.filter(i => i.id !== illnessId);
      }
      outcomeText = `Unbelievably, the ritual worked! The dark magic cleansed your body. The $${payment.toLocaleString()} sacrifice was accepted.`;
      nextLog.push(`Successfully cured illness with a $${payment.toLocaleString()} bizarre ritual.`);
    } else {
      nextStats.health = Math.max(0, nextStats.health - 15);
      nextStats.happiness = Math.max(0, nextStats.happiness - 15);
      statChanges = { health: -15, happiness: -15 };
      outcomeText = `The ritual went horribly wrong. You accidentally inhaled toxic smoke and feel much worse now. Lost $${payment.toLocaleString()}.`;
      nextLog.push(`Botched a $${payment.toLocaleString()} healing ritual and got sicker.`);
    }

    setGameState({
      ...gameState,
      stats: nextStats,
      cash: nextCash,
      illnesses: nextIllnesses,
      log: nextLog,
      currentEvent: null,
      lastOutcome: {
        choiceText: `Paid $${payment.toLocaleString()} for Ritual`,
        outcomeText: outcomeText,
        statChanges: statChanges,
        cashChange: -payment
      }
    });
    
    setRitualPaymentActive(null);
    setShowOutcomeModal(true);
  };

  const handleChoiceSelect = (choice: Choice) => {
    if (!gameState) return;
    triggerSound('click');

    if (choice.id === 'sick_ritual_interactive') {
      const illnessId = gameState.currentEvent?.id.split('_')[1];
      const illnessName = [...MINOR_ILLNESSES, ...CHRONIC_ILLNESSES, ...TERMINAL_ILLNESSES, ...INFANT_ILLNESSES].find(i => i.id === illnessId)?.name || 'Unknown Illness';
      setRitualPaymentActive({ illnessName });
      return;
    }

    let effect = choice.effect;

    if (choice.outcomes && choice.outcomes.length > 0) {
      const totalWeight = choice.outcomes.reduce((sum, outcome) => sum + outcome.weight, 0);
      let randomVal = Math.random() * totalWeight;
      for (const outcome of choice.outcomes) {
        if (randomVal < outcome.weight) {
          effect = outcome.effect;
          break;
        }
        randomVal -= outcome.weight;
      }
    }

    if (!effect) return; // Failsafe
    let nextStats = { ...gameState.stats };
    let nextRep = { ...gameState.reputation };
    let nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => ({ ...r }));
    let nextFlags = { ...gameState.flags };
    let nextDelayed = [...gameState.delayedEvents];
    let nextCash = gameState.cash + (effect.cashChange || 0);
    let nextIllnesses = [...gameState.illnesses];

    // 1. Apply stat changes
    if (effect.statChanges) {
      Object.entries(effect.statChanges).forEach(([stat, val]) => {
        const k = stat as keyof Stats;
        nextStats[k] = Math.max(0, Math.min(100, nextStats[k] + (val || 0)));
      });
    }

    // 2. Apply reputation changes
    if (effect.repChanges) {
      Object.entries(effect.repChanges).forEach(([rep, val]) => {
        const k = rep as keyof Reputation;
        nextRep[k] = Math.max(0, Math.min(100, nextRep[k] + (val || 0)));
      });
    }

    // 3. Flags set & remove
    if (effect.flagsSet) {
      Object.entries(effect.flagsSet).forEach(([f, val]) => {
        nextFlags[f] = val;
      });
    }
    if (effect.flagsRemove) {
      effect.flagsRemove.forEach(f => {
        delete nextFlags[f];
      });
    }

    // 4. Schedule delayed event
    if (effect.scheduleDelayedEvent) {
      nextDelayed.push({
        eventId: effect.scheduleDelayedEvent.eventId,
        triggerAge: gameState.age + effect.scheduleDelayedEvent.delayYears
      });
    }

    // 5. Use modular choiceResolver with personality and stat cascades
    let overriddenOutcomeText = effect.outcomeText || "";
    let overriddenLogText = effect.logText || `Selected: ${choice.text}`;
    let nextOngoingEffects = gameState.ongoingEffects ? [...gameState.ongoingEffects] : [];
    
    const activeNpc = nextRelationships.find(r => r.id === gameState.activeRelationshipContextId);
    let result = resolveChoice({ ...choice, effect }, activeNpc, gameState.age);
    if (activeNpc && effect) {
      result = applyPlayerTraits(result, gameState.personalityTraits || [], choice.id, activeNpc, gameState.age);
      result = calculateStatCascades(result, gameState.age, activeNpc.id);
      
      // Update text
      overriddenOutcomeText = result.outcomeText;
      overriddenLogText = result.outcomeText;

      // Apply stat changes
      if (result.statChanges) {
        if (result.statChanges.happiness !== undefined) nextStats.happiness = Math.max(0, Math.min(100, (nextStats.happiness || 0) + (result.statChanges.happiness - (effect.statChanges?.happiness || 0))));
        if (result.statChanges.health !== undefined) nextStats.health = Math.max(0, Math.min(100, (nextStats.health || 0) + (result.statChanges.health - (effect.statChanges?.health || 0))));
        // Wait, result.statChanges contains the absolute new delta to add or the new value? 
        // choiceResolver effect.statChanges has absolute changes or deltas? Usually deltas.
        // If we add totalHappinessDelta in personalityEffects it's a delta.
        // Let's just safely apply the full delta difference from base or just merge it directly.
        // Actually, we should just apply the result.statChanges directly as the new values.
        nextStats = { ...nextStats, ...result.statChanges };
        nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness));
        nextStats.health = Math.max(0, Math.min(100, nextStats.health));
      }

      // Merge ongoing effects
      if (result.ongoingEffectsToAdd && result.ongoingEffectsToAdd.length > 0) {
        nextOngoingEffects = mergeOngoingEffects(nextOngoingEffects, result.ongoingEffectsToAdd);
      }

      // Update active NPC relationships
      if (result.relationshipChanges || result.memoryToAdd) {
        nextRelationships = nextRelationships.map(r => {
          if (r.id === activeNpc.id) {
            return applyChoiceResultToNPC(r, result);
          }
          return r;
        });
      }
    }

    // 6. Cure Illness Effect
    if (effect.cureIllness && nextIllnesses.length > 0) {
      const cured = nextIllnesses.pop();
      if (cured) {
        nextFlags[`cured_${cured.id}`] = true;
      }
    }

    // Dynamic semantic adjustments for Karma and Willpower
    // KARMA IS RARE — it cannot be bought by simply praying or refusing things.
    // It only shifts meaningfully when you make a genuine moral choice.
    let autoKarma = 0;
    let autoWillpower = 0;

    const lowerText = choice.text.toLowerCase();
    const eventText = (gameState.currentEvent?.text || "").toLowerCase();
    const eventTitle = (gameState.currentEvent?.title || "").toLowerCase();

    // Willpower boosts: Studying, working hard, exercising, showing restraint
    if (lowerText.includes('study') || lowerText.includes('work hard') || lowerText.includes('overtime') || lowerText.includes('practice') || lowerText.includes('train') || lowerText.includes('focus') || lowerText.includes('intensely')) {
      autoWillpower += 4;
    }
    // Willpower resistance: saying no to drinks, drugs, temptation, peer pressure
    if (lowerText.includes('decline') || lowerText.includes('refuse') || lowerText.includes('say no') || lowerText.includes('resist') || lowerText.includes('reject') || lowerText.includes('walk away')) {
      autoWillpower += 6;
      // NOTE: Refusing things does NOT give karma. Karma comes from active moral choices, not passive restraint.
    }
    // Willpower drop: giving in, trying drugs, getting lazy, cheating
    if (lowerText.includes('try some') || lowerText.includes('smoke') || lowerText.includes('drugs') || lowerText.includes('cheat') || lowerText.includes('steal')) {
      autoWillpower -= 6;
    }

    // KARMA — Very small gains, very rare.
    // Only genuine acts of moral courage or selflessness grant karma.
    // +1 karma for truly helpful, selfless, or protective actions.
    const isTrulyHelpful = 
      lowerText.includes('help') || lowerText.includes('donate') || lowerText.includes('give money') ||
      lowerText.includes('support') || lowerText.includes('comfort') || lowerText.includes('reconcile') ||
      lowerText.includes('forgive') || lowerText.includes('apologize') || lowerText.includes('tell the truth') ||
      lowerText.includes('stand up for') || lowerText.includes('protect') || lowerText.includes('report the bully') ||
      lowerText.includes('volunteer');
    if (isTrulyHelpful) {
      autoKarma += 1; // Only +1, karma is precious
    }

    // -3 to -8 for genuinely evil acts
    const isGenuinelyEvil =
      lowerText.includes('bully') || lowerText.includes('insult') || lowerText.includes('sabotage') ||
      lowerText.includes('punch') || lowerText.includes('steal') || lowerText.includes('cheat') ||
      lowerText.includes('lie') || lowerText.includes('prank') || lowerText.includes('humiliate') ||
      lowerText.includes('blackmail') || lowerText.includes('threaten');
    if (isGenuinelyEvil) {
      autoKarma -= Math.floor(Math.random() * 4) + 3; // -3 to -6
    }

    // Merging values
    let nextKarma = Math.max(0, Math.min(100, gameState.karma + (effect.karmaChange || 0) + autoKarma));
    let nextWillpower = Math.max(0, Math.min(100, gameState.willpower + (effect.willpowerChange || 0) + autoWillpower));

    // Willpower Overrides & Peer Pressure Systems


    const isPeerPressureOrInfluence = 
      lowerText.includes('accept') || lowerText.includes('try') || lowerText.includes('join') || 
      lowerText.includes('agree') || lowerText.includes('yes') || lowerText.includes('chug') || 
      lowerText.includes('drink') || lowerText.includes('smoke') || lowerText.includes('snort') || 
      lowerText.includes('take') || lowerText.includes('cheat') || lowerText.includes('steal') || 
      lowerText.includes('sabotage') || lowerText.includes('bribe');

    const isPeerPressureTopic = 
      lowerText.includes('drug') || lowerText.includes('weed') || lowerText.includes('cocaine') || 
      lowerText.includes('pill') || lowerText.includes('heroin') || lowerText.includes('beer') || 
      lowerText.includes('shot') || lowerText.includes('alcohol') || lowerText.includes('vape') || 
      lowerText.includes('drink') || lowerText.includes('cheat') || lowerText.includes('steal') || 
      eventTitle.includes('drug') || eventTitle.includes('drink') || eventTitle.includes('party') || 
      eventTitle.includes('bribe') || eventTitle.includes('cheat') || eventText.includes('drug') || 
      eventText.includes('drink') || eventText.includes('peer') || eventText.includes('offer');

    const isResistChoice = 
      lowerText.includes('decline') || lowerText.includes('refuse') || lowerText.includes('say no') || 
      lowerText.includes('resist') || lowerText.includes('reject') || lowerText.includes('walk away') || 
      lowerText.includes('ignore') || lowerText.includes('stay away');

    // Trigger High Willpower Intervention
    if (gameState.willpower >= 60 && isPeerPressureOrInfluence && isPeerPressureTopic) {
      const shieldChance = gameState.willpower >= 80 ? 0.95 : 0.75;
      if (Math.random() < shieldChance) {
        overriddenOutcomeText = `🧠 [WILLPOWER SHIELD] Your high Willpower (${gameState.willpower}%) kicked in at the last split-second! Despite the strong temptation, you resisted the bad influence, stood your ground, and walked away with clean lungs and a clear mind.`;
        overriddenLogText = `🧠 Resisted temptation due to high Willpower (${gameState.willpower}%).`;
        
        // Nullify bad consequences:
        nextStats.health = Math.max(gameState.stats.health, nextStats.health);
        nextStats.happiness = Math.max(gameState.stats.happiness, nextStats.happiness + 5);
        nextStats.smarts = Math.max(gameState.stats.smarts, nextStats.smarts + 2);
        nextWillpower = Math.min(100, nextWillpower + 8);
        
        // Clear harmful flags:
        delete nextFlags['addicted'];
        delete nextFlags['drunk'];
        delete nextFlags['hungover'];
        delete nextFlags['suspended'];
      }
    }

    // Trigger Low Willpower peer pressure collapse
    if (gameState.willpower < 40 && isResistChoice && isPeerPressureTopic) {
      const failChance = (40 - gameState.willpower) / 40; // e.g., if willpower is 10, failChance is 75%
      if (Math.random() < failChance) {
        overriddenOutcomeText = `🥺 [WILLPOWER COLLAPSE] You desperately tried to say no, but your weak Willpower (${gameState.willpower}%) collapsed under the crushing peer pressure! You gave in, did exactly what they wanted, and instantly regretted your lack of spine.`;
        overriddenLogText = `🥺 Succumbed to peer pressure due to low Willpower (${gameState.willpower}%).`;
        
        // Apply negative peer pressure effects:
        nextStats.health = Math.max(5, nextStats.health - 15);
        nextStats.happiness = Math.max(5, nextStats.happiness - 10);
        nextStats.smarts = Math.max(5, nextStats.smarts - 5);
        nextWillpower = Math.max(0, nextWillpower - 6);
        nextKarma = Math.max(0, nextKarma - 4);
        
        // Set bad flags:
        if (lowerText.includes('drug') || eventText.includes('drug') || eventTitle.includes('drug')) {
          nextFlags['drug_user'] = true;
          if (Math.random() < 0.35) {
            nextFlags['addicted'] = true;
          }
        } else {
          nextFlags['drunk'] = true;
        }
      }
    }

    // Karma Luck Intervention (approx. 15% more luck)
    const isBadOutcome = 
      (effect.statChanges?.health && effect.statChanges.health < 0) || 
      (effect.statChanges?.happiness && effect.statChanges.happiness < 0) || 
      (effect.repChanges?.family && effect.repChanges.family < 0) ||
      (effect.cashChange && effect.cashChange < 0);

    if (gameState.karma >= 60 && isBadOutcome) {
      if (Math.random() < 0.22) { // 22% chance of miracle save (adds ~15% luck bonus to high karma players)
        overriddenOutcomeText = `✨ [KARMA LUCK SAVE] Miraculous luck! Your outstanding Karma (${gameState.karma}%) protected you. At the very last moment, a fortunate coincidence turned a potential disaster into a harmless event.`;
        overriddenLogText = `✨ Miraculously saved from a bad outcome by high Karma (${gameState.karma}%).`;
        
        // Reset negative stats back to their values before the drop
        if (effect.statChanges) {
          Object.entries(effect.statChanges).forEach(([stat, val]) => {
            if (val && val < 0) {
              const k = stat as keyof Stats;
              nextStats[k] = gameState.stats[k]; // Restore original
            }
          });
        }
        if (effect.repChanges) {
          Object.entries(effect.repChanges).forEach(([rep, val]) => {
            if (val && val < 0) {
              const k = rep as keyof Reputation;
              nextRep[k] = gameState.reputation[k]; // Restore original
            }
          });
        }
        if (effect.cashChange && effect.cashChange < 0) {
          nextCash = gameState.cash; // Restore cash
        }
        nextKarma = Math.min(100, nextKarma + 3);
      }
    }

    // Conversely, low karma gets unlucky occasionally
    if (gameState.karma < 40 && !isBadOutcome && Math.random() < 0.12) {
      overriddenOutcomeText = `💀 [BAD KARMA BLIGHT] Unlucky! Your low Karma (${gameState.karma}%) brought you a sudden stroke of misfortune. A completely routine choice went sideways due to pure bad luck.`;
      overriddenLogText = `💀 Suffered a bad luck event from low Karma (${gameState.karma}%).`;
      
      nextStats.health = Math.max(5, nextStats.health - 10);
      nextStats.happiness = Math.max(5, nextStats.happiness - 12);
      nextRep.family = Math.max(5, nextRep.family - 5);
      nextKarma = Math.max(0, nextKarma - 2);
    }

    // Construct final outcome logging
    const loggedText = overriddenLogText.startsWith('└─') ? overriddenLogText : `└─ ${overriddenLogText}`;
    const outcomeLine = overriddenOutcomeText.startsWith('✨') ? overriddenOutcomeText : `✨ Outcome: ${overriddenOutcomeText}`;

    const updatedLogs = [...gameState.log, loggedText, outcomeLine];

    // Determine status of death or high stakes
    let isAlive = nextStats.health > 0;
    let deathReason = '';
    if (!isAlive) {
      deathReason = 'Failing health and severe stress.';
      triggerSound('error');
    } else {
      triggerSound('success');
    }

    const updatedState: GameState = {
      ...gameState,
      alive: isAlive,
      deathReason: isAlive ? '' : deathReason,
      cash: nextCash,
      stats: nextStats,
      reputation: nextRep,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      flags: nextFlags,
      ongoingEffects: typeof nextOngoingEffects !== 'undefined' ? nextOngoingEffects : gameState.ongoingEffects,
      delayedEvents: nextDelayed,
      illnesses: nextIllnesses,
      log: updatedLogs,
      karma: nextKarma,
      willpower: nextWillpower,
      currentEvent: null,
      activeRelationshipContextId: null,
      lastOutcome: {
        choiceText: choice.text,
        outcomeText: overriddenOutcomeText,
        statChanges: effect.statChanges,
        repChanges: effect.repChanges,
        cashChange: effect.cashChange
      }
    };

    if (choice.id === 'bully_attack' || choice.id === 'bully_fight') {
      setActiveFight({
        opponentName: 'Marcus Armstrong',
        opponentId: 'bully_marcus',
        move: 'punch',
        target: 'jaw'
      });
      setGameState({
        ...gameState,
        currentEvent: null
      });
      return;
    }

    setGameState(updatedState);
    setShowOutcomeModal(true);
  };

  const handleResolveFight = () => {
    if (!gameState || !activeFight) return;
    triggerSound('click');

    const moveInfo = FIGHT_MOVES.find(m => m.id === activeFight.move) || FIGHT_MOVES[0];
    const targetInfo = FIGHT_TARGETS.find(t => t.id === activeFight.target) || FIGHT_TARGETS[0];

    const isSilly = ['tickle', 'touch', 'pinch'].includes(activeFight.move);
    const winChance = isSilly ? 0.12 : 0.55;
    const playerWon = Math.random() < winChance;

    let text = '';
    let healthChange = 0;
    let happinessChange = 0;
    let statusChange = 0;
    let logMsg = '';

    if (playerWon) {
      triggerSound('success');
      if (isSilly) {
        text = `You tried to tickle ${activeFight.opponentName}'s ${targetInfo.name}. Miraculously, they burst into absolute hysterical laughter, collapsed on the floor begging for mercy, and surrendered! The crowd cheered for your bizarre tactics!`;
        healthChange = 0;
        happinessChange = 20;
        statusChange = 25;
      } else {
        // Serious attacks
        if (activeFight.move === 'uppercut' && activeFight.target === 'jaw') {
          text = `You launched a thunderous Uppercut directly into ${activeFight.opponentName}'s Jaw! There was a loud snap as they spun around and hit the deck, completely knocked cold. A flawless victory!`;
        } else if (activeFight.move === 'eye_poke' && activeFight.target === 'face') {
          text = `You poked ${activeFight.opponentName} squarely in the Eye! They shrieked in absolute agony, stumbling backwards and sobbing. The fight was over instantly!`;
        } else if (activeFight.target === 'dd') {
          text = `You unleashed a direct ${moveInfo.name} on ${activeFight.opponentName}'s DD! They let out an incredibly high-pitched squeal, doubled over in absolute shock, and ran away red-faced!`;
        } else {
          text = `You delivered a powerful ${moveInfo.name} to ${activeFight.opponentName}'s ${targetInfo.name}! They groaned in pain, lost their balance, and fell backwards in utter defeat.`;
        }
        healthChange = -5; // minor scratches
        happinessChange = 15;
        statusChange = 20;
      }
      logMsg = `👊 Fought and defeated ${activeFight.opponentName} using a ${moveInfo.name} to the ${targetInfo.name}!`;
    } else {
      triggerSound('error');
      if (isSilly) {
        text = `You attempted to ${moveInfo.name} ${activeFight.opponentName}'s ${targetInfo.name}. They stared at you with dead eyes, completely unamused, and then absolutely destroyed you with a heavy headbutt!`;
      } else {
        text = `You tried to execute a ${moveInfo.name} to ${activeFight.opponentName}'s ${targetInfo.name}, but they dodged your strike and countered with a devastating sweep, pinning you to the floor and pounding you.`;
      }
      healthChange = -25;
      happinessChange = -20;
      statusChange = -15;
      logMsg = `🤕 Got beaten up by ${activeFight.opponentName} after trying to use a ${moveInfo.name} on their ${targetInfo.name}.`;
    }

    const nextStats = {
      ...gameState.stats,
      health: Math.max(0, Math.min(100, gameState.stats.health + healthChange)),
      happiness: Math.max(0, Math.min(100, gameState.stats.happiness + happinessChange)),
      status: Math.max(0, Math.min(100, gameState.stats.status + statusChange))
    };

    // If opponent is a relationship, adjust their stats too!
    let nextRelationships = (Object.values(gameState.npcs || {}) as any[]);
    if (activeFight.opponentId && activeFight.opponentId !== 'bully_marcus') {
      nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
        if (r.id === activeFight.opponentId) {
          return {
            ...r,
            trust: Math.max(0, r.trust - 35),
            resentment: Math.min(100, r.resentment + 40)
          };
        }
        return r;
      });
    }

    const isAlive = nextStats.health > 0;
    const deathReason = isAlive ? '' : `Fatal internal trauma sustained during a physical brawling match with ${activeFight.opponentName}.`;

    const updatedFlags = { ...gameState.flags };
    if (activeFight.opponentId === 'bully_marcus') {
      if (playerWon) {
        updatedFlags.confronted_marcus = true;
        updatedFlags.defeated_marcus = true;
      } else {
        updatedFlags.bullied_by_marcus = true;
      }
    }

    setGameState({
      ...gameState,
      alive: isAlive,
      deathReason,
      stats: nextStats,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      flags: updatedFlags,
      currentEvent: null,
      log: [...gameState.log, logMsg, `✨ Fight Result: ${text}`]
    });

    setFightOutcome({
      victory: playerWon,
      text,
      statChangesText: `${healthChange !== 0 ? `Health: ${healthChange > 0 ? '+' : ''}${healthChange}% ` : ''}${happinessChange !== 0 ? `Happiness: ${happinessChange > 0 ? '+' : ''}${happinessChange}% ` : ''}${statusChange !== 0 ? `Status: ${statusChange > 0 ? '+' : ''}${statusChange}%` : ''}`
    });

    setActiveFight(null);
  };

  const handleConsultPublicClinic = () => {
    if (!gameState) return;
    triggerSound('click');

    if (!gameState.illnesses || gameState.illnesses.length === 0) {
      setMedicalReport({
        success: true,
        text: "The clinic doctor did a quick routine checkup. 'You are in outstanding shape! Keep doing what you are doing,' he said with a smile.",
        cost: 0
      });
      return;
    }

    const targetIllness = gameState.illnesses[0];
    if (targetIllness.type !== 'minor') {
      setMedicalReport({
        success: false,
        text: `The clinic doctor reviewed your case for ${targetIllness.name}. 'I am terribly sorry,' he sighed. 'This is a specialized, long-term condition that our basic clinic is not equipped to treat. You must consult a Private Specialist or Surgeon.'`,
        cost: 0
      });
      return;
    }

    const success = Math.random() < (targetIllness.baseCureChance * 0.85);
    if (success) {
      triggerSound('success');
      const updatedIllnesses = gameState.illnesses.filter(i => i.id !== targetIllness.id);
      setGameState({
        ...gameState,
        illnesses: updatedIllnesses,
        stats: {
          ...gameState.stats,
          health: Math.min(100, gameState.stats.health + 15),
          happiness: Math.min(100, gameState.stats.happiness + 10)
        },
        log: [...gameState.log, `🏥 Public Clinic successfully cured my ${targetIllness.name}!`]
      });
      setMedicalReport({
        success: true,
        text: `The clinic doctor prescribed some generic medication. It worked! Your ${targetIllness.name} has been completely cured.`,
        cost: 0
      });
    } else {
      triggerSound('error');
      setMedicalReport({
        success: false,
        text: `The clinic doctor examined you and suggested standard bed rest, but your ${targetIllness.name} symptoms persist.`,
        cost: 0
      });
    }
  };

  const handleConsultPrivateSpecialist = () => {
    if (!gameState) return;

    const isMinor = gameState.age < 18;
    const cost = 250;

    if (isMinor) {
      if (Math.random() < 0.35) { // 35% chance parents refuse Private Specialist
        triggerSound('error');
        setMedicalReport({
          success: false,
          text: "You begged your parents to take you to a Private Specialist, but they said it was too expensive and told you to just wait it out.",
          cost: 0
        });
        return;
      }
    } else if (gameState.cash < cost) {
      triggerSound('error');
      return;
    }

    triggerSound('click');
    const nextCash = isMinor ? gameState.cash : gameState.cash - cost;
    const payerLog = isMinor ? ' (Parents Paid)' : ` (-$${cost})`;

    if (!gameState.illnesses || gameState.illnesses.length === 0) {
      setMedicalReport({
        success: true,
        text: "The Private Specialist conducted advanced diagnostic tests. 'Your health biomarkers are immaculate! No sickness detected,' she declared.",
        cost: isMinor ? 0 : 250
      });
      setGameState({
        ...gameState,
        cash: nextCash
      });
      return;
    }

    const targetIllness = gameState.illnesses[0];

    if (targetIllness.type === 'minor') {
      const success = Math.random() < targetIllness.baseCureChance;
      if (success) {
        triggerSound('success');
        const updatedIllnesses = gameState.illnesses.filter(i => i.id !== targetIllness.id);
        setGameState({
          ...gameState,
          cash: nextCash,
          illnesses: updatedIllnesses,
          stats: {
            ...gameState.stats,
            health: Math.min(100, gameState.stats.health + 25),
            happiness: Math.min(100, gameState.stats.happiness + 15)
          },
          log: [...gameState.log, `🏥 Private Specialist cured my ${targetIllness.name}${payerLog}.`]
        });
        setMedicalReport({
          success: true,
          text: `The private specialist administered a fast-acting clinical treatment. Your ${targetIllness.name} has been completely cured!`,
          cost: isMinor ? 0 : 250
        });
      } else {
        triggerSound('error');
        setGameState({ ...gameState, cash: nextCash, log: [...gameState.log, `🏥 Private Specialist failed to cure my ${targetIllness.name}${payerLog}.`] });
        setMedicalReport({
          success: false,
          text: `The specialist tried an aggressive treatment for your ${targetIllness.name}, but it was unusually stubborn and did not clear up.`,
          cost: isMinor ? 0 : 250
        });
      }
    } else if (targetIllness.type === 'chronic') {
      const success = Math.random() < targetIllness.baseCureChance;
      if (success) {
        triggerSound('success');
        const updatedIllnesses = gameState.illnesses.filter(i => i.id !== targetIllness.id);
        setGameState({
          ...gameState,
          cash: nextCash,
          illnesses: updatedIllnesses,
          stats: {
            ...gameState.stats,
            health: Math.min(100, gameState.stats.health + 20),
            happiness: Math.min(100, gameState.stats.happiness + 20)
          },
          log: [...gameState.log, `🏥 Private Specialist successfully cured my chronic ${targetIllness.name}${payerLog}.`]
        });
        setMedicalReport({
          success: true,
          text: `With advanced modern immunotherapy, the specialist managed to completely cure your chronic ${targetIllness.name}!`,
          cost: isMinor ? 0 : 250
        });
      } else {
        triggerSound('error');
        setGameState({
          ...gameState,
          cash: nextCash
        });
        setMedicalReport({
          success: false,
          text: `The specialist prescribed premium therapeutic management. While your ${targetIllness.name} symptoms are stabilized, the chronic condition remains uncured.`,
          cost: isMinor ? 0 : 250
        });
      }
    } else if (targetIllness.type === 'terminal') {
      if (!targetIllness.curable) {
        setGameState({
          ...gameState,
          cash: nextCash
        });
        setMedicalReport({
          success: false,
          text: `The specialist sorrowfully shook her head. 'I am deeply sorry. Your ${targetIllness.name} is inoperable and completely uncurable. We can only provide symptom management.'`,
          cost: isMinor ? 0 : 250
        });
      } else {
        const totalCureCost = targetIllness.cureCost;
        if (!isMinor && gameState.cash < 250 + totalCureCost) {
          setGameState({
            ...gameState,
            cash: nextCash
          });
          setMedicalReport({
            success: false,
            text: `The specialist confirms your ${targetIllness.name} is curable with a major specialized surgery, but the operation costs $${totalCureCost.toLocaleString()} on top of the checkup. You do not have enough funds!`,
            cost: 250
          });
        } else {
          // If minor, parents either pay the huge cost or refuse
          if (isMinor && Math.random() < 0.6) { // 60% chance parents refuse major surgery cost
            triggerSound('error');
            setMedicalReport({
              success: false,
              text: `The specialist confirms your ${targetIllness.name} is curable with surgery costing $${totalCureCost.toLocaleString()}. Your parents wept, but they simply could not afford it.`,
              cost: 0
            });
            return;
          }

          triggerSound('success');
          const updatedIllnesses = gameState.illnesses.filter(i => i.id !== targetIllness.id);
          setGameState({
            ...gameState,
            cash: isMinor ? gameState.cash : gameState.cash - 250 - totalCureCost,
            illnesses: updatedIllnesses,
            stats: {
              ...gameState.stats,
              health: Math.min(100, gameState.stats.health + 45),
              happiness: Math.min(100, gameState.stats.happiness + 35)
            },
            log: [...gameState.log, `🏥 Underwent major private surgery to cure terminal ${targetIllness.name}${isMinor ? ' (Parents Paid)' : ` (-$${(totalCureCost + 250).toLocaleString()})`}.`]
          });
          setMedicalReport({
            success: true,
            text: `The specialist performed an immediate emergency surgery! The operation was an absolute success—your terminal ${targetIllness.name} is fully cured!`,
            cost: isMinor ? 0 : 250 + totalCureCost
          });
        }
      }
    }
  };

  const handleConsultWitchDoctor = () => {
    if (!gameState) return;

    const isMinor = gameState.age < 18;
    const cost = 50;

    if (isMinor) {
      if (Math.random() < 0.8) { // 80% chance parents refuse Witch Doctor
        triggerSound('error');
        setMedicalReport({
          success: false,
          text: "You asked your parents to take you to the Mysterious Witch Doctor. They looked at you like you were crazy and refused.",
          cost: 0
        });
        return;
      }
    } else if (gameState.cash < cost) {
      triggerSound('error');
      return;
    }

    triggerSound('click');
    const roll = Math.random();
    const nextCash = isMinor ? gameState.cash : gameState.cash - cost;
    const payerLog = isMinor ? ' (Parents Paid)' : ` (-$${cost})`;

    if (roll < 0.15) {
      triggerSound('success');
      setGameState({
        ...gameState,
        cash: nextCash,
        illnesses: [],
        stats: {
          ...gameState.stats,
          health: 100,
          happiness: 100
        },
        log: [...gameState.log, `🔮 Witch Doctor cured all my ailments miraculously!${payerLog}`]
      });
      setMedicalReport({
        success: true,
        text: "The Witch Doctor shook a magical staff of feathers, murmured ancient tribal chants, and forced you to gulp down a bubbling purple brew. MIRACLE! A warm light surges through your chest—ALL of your illnesses are completely, instantly cured!",
        cost: isMinor ? 0 : 50
      });
    } else if (roll < 0.65) {
      triggerSound('error');
      const nextHealth = Math.max(1, gameState.stats.health - 20);
      const nextHappiness = Math.max(1, gameState.stats.happiness - 25);
      setGameState({
        ...gameState,
        cash: nextCash,
        stats: {
          ...gameState.stats,
          health: nextHealth,
          happiness: nextHappiness
        },
        log: [...gameState.log, `🔮 Consulted a Witch Doctor and got extremely sick from their herbal potion${payerLog}.`]
      });
      setMedicalReport({
        success: false,
        text: "The Witch Doctor tied grass ropes around your arms and fed you a live swamp toad. You immediately began vomiting uncontrollably and feel terribly weak! (-20% Health, -25% Happiness)",
        cost: isMinor ? 0 : 50
      });
    } else {
      setGameState({
        ...gameState,
        cash: nextCash
      });
      setMedicalReport({
        success: false,
        text: `The Witch Doctor burned aromatic bark and danced around you, but nothing seemed to happen. Your symptoms are unchanged.${isMinor ? '' : ' (-$50)'}`,
        cost: isMinor ? 0 : 50
      });
    }
  };

  // Age up main game loop
  const ageUp = () => {
    if (!gameState || !gameState.alive) return;
    triggerSound('ageUp');

    const context = {
      INFANT_ILLNESSES,
      MINOR_ILLNESSES,
      CHRONIC_ILLNESSES,
      TERMINAL_ILLNESSES,
      generateSchoolContacts
    };

    const result = runYearlySimulation(gameState, context);
    
    if (!result.updatedState.alive) {
      triggerSound('error');
    }

    setAgeUpData(result.ageUpData);
    setGameState(result.updatedState);
    setShowAgeUpModal(true);
    setActiveTab('home');
  };

  // Custom Activities triggers
  const handleGym = () => {
    if (!gameState) return;
    const isUnderage = gameState.age < 18;
    const gymCost = isUnderage ? 0 : 20;

    if (!isUnderage && gameState.cash < gymCost) {
      triggerSound('error');
      return;
    }

    if (isUnderage) {
      const parents = (Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation === 'parent');
      const parentsCount = parents.length;
      const avgTrust = parentsCount > 0 
        ? parents.reduce((sum, p) => sum + p.trust, 0) / parentsCount 
        : 80;

      const successChance = Math.max(5, Math.min(95, avgTrust));
      const roll = Math.random() * 100;
      const success = roll < successChance;

      if (!success) {
        triggerSound('error');
        const nextStats = {
          ...gameState.stats,
          happiness: Math.max(0, gameState.stats.happiness - 5)
        };
        const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
          if (r.relation === 'parent') {
            return { ...r, resentment: Math.min(100, r.resentment + 2) };
          }
          return r;
        });

        setGameState({
          ...gameState,
          stats: nextStats,
          relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
          log: [
            ...gameState.log,
            `😢 Asked my parents to let me join the gym, but they refused! "You can exercise by running around the backyard for free!"`,
            `└─ Lost happiness (-5).`
          ],
          lastOutcome: {
            choiceText: "Ask Parents to pay for Gym Membership",
            outcomeText: `😢 Asked your parents to let you join the gym, but they refused! "You can exercise by running around the backyard for free!" they declared. (-5 Happiness, +2 Parents' Resentment)`
          }
        });
        setShowOutcomeModal(true);
        setSelectedActivity(null);
        return;
      }
    }

    triggerSound('success');
    let healthGain = Math.floor(Math.random() * 10) + 6;
    let looksGain = Math.floor(Math.random() * 5) + 3;
    let happinessGain = Math.floor(Math.random() * 6) + 4;
    let bonusText = '';
    if (gameState.location === 'Sydney, Australia') {
      healthGain = Math.round(healthGain * 1.15);
      happinessGain = Math.round(happinessGain * 1.15);
      bonusText = ' (Sydney Sunlit Haven Bonus: +15%)';
    }
    const willpowerGain = Math.floor(Math.random() * 3) + 2; // +2 to +4 willpower

    const nextStats = {
      ...gameState.stats,
      health: Math.min(100, gameState.stats.health + healthGain),
      looks: Math.min(100, gameState.stats.looks + looksGain),
      happiness: Math.min(100, gameState.stats.happiness + happinessGain)
    };

    setGameState({
      ...gameState,
      cash: gameState.cash - gymCost,
      stats: nextStats,
      willpower: Math.min(100, gameState.willpower + willpowerGain),
      flags: {
        ...gameState.flags,
        gymVisitsThisYear: (gameState.flags.gymVisitsThisYear || 0) + 1
      },
      log: [
        ...gameState.log,
        isUnderage 
          ? `🏋️ Asked my parents to let me join the local gym. They said YES and paid for my session!`
          : `🏋️ Worked out vigorously at the local gym (-$20).`,
        `└─ Gained health (+${healthGain}), looks (+${looksGain}), happiness (+${happinessGain})${bonusText}, and willpower (+${willpowerGain})!`
      ],
      lastOutcome: isUnderage ? {
        choiceText: "Ask Parents to pay for Gym Membership",
        outcomeText: `🏋️ You asked your parents to let you join the local gym. They said YES and paid for your session! You had an incredible workout. (+${healthGain} Health, +${looksGain} Looks, +${happinessGain} Happiness, +${willpowerGain} Willpower)`
      } : null
    });
    if (isUnderage) {
      setShowOutcomeModal(true);
    }
    setSelectedActivity(null);
  };

  const handleTravelToCity = (city: MapCity) => {
    if (!gameState) return;
    const isUnderage = gameState.age < 18;
    const travelCost = isUnderage ? 0 : 350;

    if (!isUnderage && gameState.cash < travelCost) {
      triggerSound('error');
      return;
    }

    triggerSound('success');

    let nextStats = { ...gameState.stats };
    let nextLog = [...gameState.log];
    let nextCash = gameState.cash;
    let nextFlags = { ...gameState.flags };

    if (isUnderage) {
      if (gameState.stats.smarts < 65 && gameState.stats.happiness < 60) {
        triggerSound('error');
        nextLog.push(`✈️ I asked my parents if we could relocate or if I could do an exchange in ${city.name}.`);
        nextLog.push(`└─ They refused. "Your smarts (${gameState.stats.smarts}%) are too low, study more first!"`);
        setGameState({ ...gameState, log: nextLog });
        return;
      } else {
        nextLog.push(`✈️ Approved for a student exchange program in ${city.name}!`);
        nextLog.push(`└─ Moved from ${gameState.location} to ${city.fullName}. Relocation sponsored by parents!`);
      }
    } else {
      nextCash -= travelCost;
      nextLog.push(`✈️ Relocated to ${city.fullName}! Settle into your new apartment.`);
      nextLog.push(`└─ Booked a one-way flight and paid moving fees (-$${travelCost}).`);
    }

    let welcomeBonus = '';
    if (city.name === 'Tokyo') {
      nextStats.smarts = Math.min(100, nextStats.smarts + 4);
      welcomeBonus = ' (+4 Smarts study inspiration)';
    } else if (city.name === 'London') {
      nextStats.style = Math.min(100, nextStats.style + 5);
      welcomeBonus = ' (+5 Style fashion wave)';
    } else if (city.name === 'Munich') {
      nextStats.status = Math.min(100, nextStats.status + 4);
      welcomeBonus = ' (+4 Career status engineering awe)';
    } else if (city.name === 'Sydney') {
      nextStats.health = Math.min(100, nextStats.health + 5);
      welcomeBonus = ' (+5 Health pristine coastal climate)';
    } else if (city.name === 'Mumbai') {
      nextStats.happiness = Math.min(100, nextStats.happiness + 5);
      welcomeBonus = ' (+5 Happiness mystical vibe)';
    } else if (city.name === 'Compton') {
      nextStats.looks = Math.min(100, nextStats.looks + 4);
      welcomeBonus = ' (+4 Looks local streetwear drops)';
    }

    if (welcomeBonus) {
      nextLog.push(`└─ Gained immediate local city bonus:${welcomeBonus}!`);
    }

    let nextCareer = { ...gameState.career };
    if (gameState.career.type === 'career') {
      nextCareer = { title: 'Unemployed', salary: 0, type: 'unemployed' };
      nextLog.push(`⚠️ Sabbatical Alert: Moving internationally forced me to resign from my job as a ${gameState.career.title}.`);
    }

    setGameState({
      ...gameState,
      location: city.fullName,
      cash: nextCash,
      stats: nextStats,
      career: nextCareer,
      flags: nextFlags,
      log: nextLog
    });

    setSelectedMapCity(city);
  };

  const handleLocalCityAction = (city: MapCity) => {
    if (!gameState) return;
    
    if (gameState.cash < city.localActionCost) {
      triggerSound('error');
      return;
    }

    triggerSound('success');

    let nextStats = { ...gameState.stats };
    let nextLog = [...gameState.log];
    let nextCash = gameState.cash - city.localActionCost;
    let nextWillpower = gameState.willpower;
    let nextKarma = gameState.karma;

    let costString = city.localActionCost > 0 ? ` (-$${city.localActionCost})` : '';
    nextLog.push(`📍 Local Activity: Did a local action in ${city.name}${costString}.`);

    if (city.name === 'Compton') {
      nextStats.status = Math.min(100, nextStats.status + 5);
      nextWillpower = Math.min(100, nextWillpower + 3);
      nextLog.push(`└─ ${city.localActionName}: Rhymed live on the corner! Earned status (+5) and boosted willpower (+3).`);
    } else if (city.name === 'London') {
      nextStats.style = Math.min(100, nextStats.style + 5);
      nextStats.looks = Math.min(100, nextStats.looks + 3);
      nextLog.push(`└─ ${city.localActionName}: Shined in the elegant crowd! Gained style (+5) and looks (+3).`);
    } else if (city.name === 'Munich') {
      nextStats.happiness = Math.min(100, nextStats.happiness + 6);
      nextStats.health = Math.max(5, nextStats.health - 3);
      nextLog.push(`└─ ${city.localActionName}: Drank, sang, and feasted! Gained happiness (+6) but health slightly decreased (-3).`);
    } else if (city.name === 'Tokyo') {
      nextWillpower = Math.min(100, nextWillpower + 5);
      nextStats.happiness = Math.min(100, nextStats.happiness + 3);
      nextLog.push(`└─ ${city.localActionName}: Experienced spiritual discipline! Gained willpower (+5) and peace (+3 happiness).`);
    } else if (city.name === 'Mumbai') {
      const roll = Math.random();
      if (roll < 0.70) {
        nextStats.happiness = Math.min(100, nextStats.happiness + 10);
        nextLog.push(`└─ ${city.localActionName}: The hot spices and butter chicken were absolute heaven! Gained massive happiness (+10).`);
      } else {
        nextStats.health = Math.max(5, nextStats.health - 8);
        nextLog.push(`└─ ${city.localActionName}: The extreme hot chili caused a massive stomach upset. Lost health (-8).`);
      }
    } else if (city.name === 'Sydney') {
      nextStats.health = Math.min(100, nextStats.health + 5);
      nextStats.happiness = Math.min(100, nextStats.happiness + 4);
      nextLog.push(`└─ ${city.localActionName}: Caught a sweet wave right under the golden sun! Gained health (+5) and happiness (+4).`);
    }

    setGameState({
      ...gameState,
      cash: nextCash,
      stats: nextStats,
      willpower: nextWillpower,
      karma: nextKarma,
      log: nextLog
    });
  };

  const handleStudy = () => {
    if (!gameState) return;
    const studiesThisYear = gameState.flags.studiesThisYear || 0;
    
    if (studiesThisYear >= 2) {
      triggerSound('error');
      setGameState({
        ...gameState,
        log: [
          ...gameState.log,
          `📚 I tried to study harder, but my brain is completely fried! I've already hit the study limit of 2 times this year.`,
          `└─ No stats were changed (reached annual study cap).`
        ]
      });
      setSelectedActivity(null);
      return;
    }

    triggerSound('success');
    
    // Highly dynamic stat change: harder to gain smarts when already very smart,
    // and higher willpower boosts the studying efficiency.
    const currentSmarts = gameState.stats.smarts;
    const baseMin = Math.max(2, Math.floor((102 - currentSmarts) / 12));
    const baseMax = Math.max(5, Math.floor((102 - currentSmarts) / 6) + 3);
    const willpowerModifier = 0.8 + (gameState.willpower / 100); // 0.8 to 1.8 multiplier
    
    let smartsGain = Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin;
    smartsGain = Math.round(smartsGain * willpowerModifier);
    if (smartsGain < 1) smartsGain = 1;

    let bonusText = '';
    if (gameState.location === 'Tokyo, Japan') {
      smartsGain = Math.round(smartsGain * 1.15);
      bonusText = ' (Tokyo Tech Sanctuary Bonus: +15%)';
    }
    
    const happinessChange = -2; // Studying is hard work
    const willpowerGain = Math.floor(Math.random() * 4) + 2; // +2 to +5 willpower

    const nextStats = {
      ...gameState.stats,
      smarts: Math.min(100, gameState.stats.smarts + smartsGain),
      happiness: Math.max(0, gameState.stats.happiness + happinessChange)
    };

    setGameState({
      ...gameState,
      stats: nextStats,
      willpower: Math.min(100, gameState.willpower + willpowerGain),
      flags: {
        ...gameState.flags,
        studiesThisYear: studiesThisYear + 1
      },
      log: [
        ...gameState.log,
        `📚 Spent the weekend studying advanced materials intensely at the library (Study ${studiesThisYear + 1}/2 this year).`,
        `└─ Smarts increased (+${smartsGain})${bonusText}, willpower improved (+${willpowerGain}), but felt slightly tired (-2 happiness).`
      ]
    });
    setSelectedActivity(null);
  };

  const handleVisitNurse = (symptom: string) => {
    if (!gameState) return;
    let healthChange = 0;
    let happinessChange = 0;
    let smartsChange = 0;
    let outcomeText = '';
    let logMsg = '';

    if (symptom === 'throat') {
      triggerSound('success');
      healthChange = 10;
      happinessChange = -2;
      outcomeText = `The nurse grunted, rummaged through her drawers, and handed you a sticky, unwrapped cough drop she found under her desk. It tasted suspiciously like black licorice and cat hair, but your throat feels slightly better.`;
      logMsg = `🏥 Visited the school nurse for a sore throat. She gave me a sketchy floor-candy cough drop.`;
    } else if (symptom === 'heart') {
      triggerSound('click');
      smartsChange = 15;
      happinessChange = -5;
      outcomeText = `The nurse sighed heavily, handed you a leaking ice pack, and said: "Sweetie, romance is a scam and life only gets exponentially worse. Rub some dirt on it and go back to class." You feel weirdly enlightened but sad.`;
      logMsg = `🏥 Visited the school nurse for a broken heart. She told me romance is a scam.`;
    } else if (symptom === 'stress') {
      triggerSound('success');
      happinessChange = 20;
      healthChange = 5;
      outcomeText = `The nurse locked the door, started playing loud heavy-metal music, and handed you a steaming cup of "herbal mystery tea." You headbanged together for 15 minutes. Your exam stress is completely gone!`;
      logMsg = `🏥 Visited the school nurse for exam stress. We headbanged to heavy metal.`;
    }

    setGameState({
      ...gameState,
      stats: {
        ...gameState.stats,
        health: Math.max(0, Math.min(100, gameState.stats.health + healthChange)),
        happiness: Math.max(0, Math.min(100, gameState.stats.happiness + happinessChange)),
        smarts: Math.max(0, Math.min(100, gameState.stats.smarts + smartsChange))
      },
      log: [
        ...gameState.log,
        logMsg,
        `└─ ${outcomeText} (Health: ${healthChange >= 0 ? '+' : ''}${healthChange}, Happiness: ${happinessChange >= 0 ? '+' : ''}${happinessChange}, Smarts: ${smartsChange >= 0 ? '+' : ''}${smartsChange})`
      ]
    });
    setSchoolSubView('main');
  };

  const handleDropOut = () => {
    if (!gameState) return;

    if (gameState.age < 18) {
      triggerSound('error');
      setGameState({
        ...gameState,
        log: [
          ...gameState.log,
          `⛔ I tried to drop out of school, but I am a minor. My parents would absolutely destroy me. I have to stay in school.`
        ]
      });
      return;
    }

    triggerSound('error');

    // Reduce relationship with parents
    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.relation === 'parent') {
        return {
          ...r,
          trust: Math.max(0, r.trust - 50),
          resentment: Math.min(100, r.resentment + 40)
        };
      }
      return r;
    });

    setGameState({
      ...gameState,
      career: { title: 'High School Dropout', salary: 0, type: 'unemployed' },
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      reputation: {
        ...gameState.reputation,
        family: Math.max(0, gameState.reputation.family - 45)
      },
      log: [
        ...gameState.log,
        `✕ Dropped out of school!`,
        `└─ Decided formal education is a scam. Parents are absolutely devastated (-50 Trust, family reputation ruined).`
      ]
    });
    setSchoolSubView('main');
  };

  const handleAskPrivateSchool = () => {
    if (!gameState) return;
    const dad = (Object.values(gameState.npcs || {}) as any[]).find(r => r.id === 'dad');
    const mom = (Object.values(gameState.npcs || {}) as any[]).find(r => r.id === 'mom');
    const trustScore = ((dad?.trust || 50) + (mom?.trust || 50)) / 2;
    
    // Success chance scales with parental trust
    const isSuccess = Math.random() < (trustScore / 130);
    let outcomeText = '';
    let logMsg = '';
    let happinessChange = 0;
    let smartsChange = 0;
    let styleChange = 0;
    let nextRelationships = (Object.values(gameState.npcs || {}) as any[]);
    let schoolType = 'public';

    if (isSuccess) {
      triggerSound('success');
      schoolType = 'private';
      happinessChange = 15;
      smartsChange = 10;
      styleChange = 12;
      outcomeText = `Your parents agreed! They decided your intellectual genius is wasted on public school and enrolled you in "St. Jude's Unhinged Academy for Academic Mischief." However, they force you to wear a giant velvet bow-tie and a blazer with gold buttons.`;
      logMsg = `🏫 Successfully convinced parents to send me to Private School!`;
      
      nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
        if (r.relation === 'parent') {
          return { ...r, trust: Math.max(0, r.trust - 5) }; // cost them money!
        }
        return r;
      });
    } else {
      triggerSound('error');
      happinessChange = -8;
      outcomeText = `Your father laughed so hard he choked on his coffee. "Do you think I'm made of solid gold?! Go sell a kidney if you want private tutoring!" Your mother nodded in agreement.`;
      logMsg = `🏫 Asked parents to go to Private School, but they laughed in my face.`;
      
      nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
        if (r.relation === 'parent') {
          return { ...r, resentment: Math.min(100, r.resentment + 5) };
        }
        return r;
      });
    }

    const nextFlags = {
      ...gameState.flags,
      schoolType,
      schoolGrades: 85
    };

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      stats: {
        ...gameState.stats,
        happiness: Math.max(0, Math.min(100, gameState.stats.happiness + happinessChange)),
        smarts: Math.max(0, Math.min(100, gameState.stats.smarts + smartsChange)),
        style: Math.max(0, Math.min(100, gameState.stats.style + styleChange))
      },
      flags: nextFlags,
      log: [
        ...gameState.log,
        logMsg,
        `└─ ${outcomeText} (Happiness: ${happinessChange >= 0 ? '+' : ''}${happinessChange}, Smarts: ${smartsChange >= 0 ? '+' : ''}${smartsChange}, Style: ${styleChange >= 0 ? '+' : ''}${styleChange})`
      ],
      lastOutcome: {
        choiceText: "Ask Parents to pay for Private School Tuition",
        outcomeText: outcomeText
      }
    });
    setShowOutcomeModal(true);
    setSchoolSubView('main');
  };

  const handleWorkHard = () => {
    if (!gameState) return;
    triggerSound('success');
    let statusGain = Math.floor(Math.random() * 8) + 4;
    let bonusText = '';
    if (gameState.location === 'Munich, Germany') {
      statusGain += 3;
      bonusText = ' (Munich Engineering Bonus: +3 Status)';
    }
    const stressCost = -3;
    const willpowerGain = Math.floor(Math.random() * 3) + 2; // +2 to +4 willpower

    const nextStats = {
      ...gameState.stats,
      happiness: Math.max(0, gameState.stats.happiness + stressCost),
      status: Math.min(100, gameState.stats.status + statusGain)
    };

    setGameState({
      ...gameState,
      stats: nextStats,
      willpower: Math.min(100, gameState.willpower + willpowerGain),
      log: [
        ...gameState.log,
        `💼 I put in hard work and extra hours at my job as a ${gameState.career.title}.`,
        `└─ Social status and career prestige increased (+${statusGain})${bonusText}, willpower improved (+${willpowerGain}), but felt slightly stressed (${stressCost} happiness).`
      ]
    });
  };

  const handleResign = () => {
    if (!gameState) return;
    triggerSound('click');
    const oldTitle = gameState.career.title;
    setGameState({
      ...gameState,
      career: { title: 'Unemployed', salary: 0, type: 'unemployed', yearsInRole: 0 },
      creatorCareer: gameState.creatorCareer?.active ? { ...gameState.creatorCareer, active: false } : gameState.creatorCareer,
      log: [
        ...gameState.log,
        `💼 Resigned: I quit my job as a ${oldTitle} and am now looking for new career paths.`
      ]
    });
  };

  const handleStartCreatorCareer = () => {
    if (!gameState || gameState.age < 18) return;
    triggerSound('click');
    setGameState({
      ...gameState,
      career: { title: 'Creator', salary: 0, type: 'job', performance: 50, yearsInRole: 0 },
      creatorCareer: {
        active: true,
        profile: gameState.creatorCareer?.profile || {
          platform: 'creator_platform',
          contentStyle: 'anonymous',
          tier: 'beginner',
          contentQuality: 50,
          consistency: 0,
          yearlyActions: { publishCount: 0, livestreamCount: 0, collaborationCount: 0, promotionCount: 0, privacyImprovementCount: 0 },
          milestones: {}
        }
      }
    });
    setOccupationSubView('current_job');
  };

  const handleCreatorContentStyle = (contentStyle: CreatorContentStyle) => {
    const profile = gameState?.creatorCareer?.profile;
    if (!gameState || !gameState.creatorCareer?.active || !profile) return;
    triggerSound('click');
    setGameState({ ...gameState, creatorCareer: { ...gameState.creatorCareer, profile: { ...profile, contentStyle } } });
  };

  const handleCreatorAction = (action: keyof CreatorYearlyActions) => {
    const profile = gameState?.creatorCareer?.profile;
    if (!gameState || !gameState.creatorCareer?.active || !profile) return;
    triggerSound('click');
    setGameState({
      ...gameState,
      creatorCareer: {
        ...gameState.creatorCareer,
        profile: { ...profile, yearlyActions: { ...profile.yearlyActions, [action]: profile.yearlyActions[action] + 1 } }
      }
    });
  };

  const handleUniversityDropOut = () => {
    if (!gameState) return;
    triggerSound('click');
    const oldTitle = gameState.career.title;
    setGameState({
      ...gameState,
      career: { title: 'Dropout', salary: 0, type: 'unemployed', yearsInRole: 0 },
      log: [
        ...gameState.log,
        `🏫 Dropped Out: I quit my studies in ${oldTitle} and am now unemployed.`
      ]
    });
  };

  const handleInfantBabble = () => {
    if (!gameState) return;
    triggerSound('success');
    const smartsGain = Math.floor(Math.random() * 5) + 3;
    const happinessGain = Math.floor(Math.random() * 4) + 2;

    const babbles = [
      "Tried speaking my first words! Babbled 'goo-goo gaga' proudly at the wall.",
      "Giggled and babbled at the funny shadows on the ceiling.",
      "Babbled loudly during family dinner. Everyone laughed!",
      "Pointed at the family cat and shouted 'gaga'! The cat looked confused.",
      "Made raspberry noises at grandma. She thought it was a real word and got emotional.",
      "Tried to say 'mama' but it came out as 'nana'. Close enough!",
      "Babbled an entire monologue at my reflection in the mirror. Very convincing speech.",
      "Squealed with delight when papa made funny faces. My giggle echoed through the house!",
      "Had a full babble conversation with the family dog. We understood each other perfectly.",
      "Discovered my own voice echo in the hallway and babbled for 20 minutes straight.",
      "Blew spit bubbles while trying to say 'dada'. Papa filmed the whole thing.",
      "Laughed so hard at a peek-a-boo game that I got the hiccups!"
    ];
    const chosenBabble = babbles[Math.floor(Math.random() * babbles.length)];

    setGameState({
      ...gameState,
      stats: {
        ...gameState.stats,
        smarts: Math.min(100, gameState.stats.smarts + smartsGain),
        happiness: Math.min(100, gameState.stats.happiness + happinessGain)
      },
      log: [
        ...gameState.log,
        `🍼 ${chosenBabble}`,
        `└─ Smarts improved (+${smartsGain}) and Happiness improved (+${happinessGain}).`
      ]
    });
    
    setActionPopup({
      isOpen: true,
      title: "💬 Giggle & Babble",
      message: chosenBabble
    });
  };

  const handleInfantCry = () => {
    if (!gameState) return;
    triggerSound('click');
    const roll = Math.random();
    let logText = '';
    let effectText = '';
    const nextStats = { ...gameState.stats };
    let nextRelationships: any[] = [...(Object.values(gameState.npcs || {}) as any[])];

    if (roll < 0.4) {
      // Cuddled
      nextStats.happiness = Math.min(100, nextStats.happiness + 6);
      nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => r.relation === 'parent' ? { ...r, trust: Math.min(100, r.trust + 4) } : r);
      const cuddleResponses = [
        "Cried out loud! Mama rushed in, scooped me up, and gave me a warm, gentle cuddle.",
        "Let out a big wail! Papa came running and rocked me gently until I calmed down.",
        "Whimpered softly until mama picked me up and sang a sweet lullaby in my ear.",
        "Cried with all my might! Both parents came and took turns holding me close."
      ];
      logText = cuddleResponses[Math.floor(Math.random() * cuddleResponses.length)];
      effectText = "Happiness improved (+6) and parental trust improved (+4).";
    } else if (roll < 0.8) {
      // Fed
      nextStats.health = Math.min(100, nextStats.health + 8);
      nextStats.happiness = Math.min(100, nextStats.happiness + 4);
      const fedResponses = [
        "Cried of hunger! Papa quickly warmed up a fresh bottle of milk and fed me.",
        "My tummy rumbled and I wailed! Mama prepared warm milk and I guzzled it down happily.",
        "Screamed until someone noticed I was hungry. Got a warm bottle and some mashed banana!",
        "Fussed and cried until grandma came with a bottle. She even burped me afterwards!"
      ];
      logText = fedResponses[Math.floor(Math.random() * fedResponses.length)];
      effectText = "Health improved (+8) and Happiness improved (+4).";
    } else {
      // Ignored
      nextStats.happiness = Math.max(0, nextStats.happiness - 4);
      const ignoredResponses = [
        "Cried for attention for hours, but everyone was busy. I eventually cried myself to sleep.",
        "Wailed and wailed but nobody came. The house was empty and quiet. Fell asleep exhausted.",
        "Sobbed into my blankie for what felt like forever. Everyone was too distracted to notice.",
        "Let out my loudest cry but the TV was too loud. Nobody heard me over the movie."
      ];
      logText = ignoredResponses[Math.floor(Math.random() * ignoredResponses.length)];
      effectText = "Felt neglected (-4 Happiness).";
    }

    setGameState({
      ...gameState,
      stats: nextStats,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      log: [
        ...gameState.log,
        `😭 ${logText}`,
        `└─ ${effectText}`
      ]
    });
    
    setActionPopup({
      isOpen: true,
      title: "😭 Cry For Attention",
      message: logText
    });
  };

  const handleInfantCuddle = () => {
    if (!gameState) return;
    triggerSound('success');
    const happinessGain = Math.floor(Math.random() * 4) + 3;
    const trustGain = Math.floor(Math.random() * 5) + 5;

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => 
      r.relation === 'parent' ? { ...r, trust: Math.min(100, r.trust + trustGain) } : r
    );

    const cuddleMessages = [
      "Crawled over to my parents and cuddled up tightly against them. They smiled and patted my head gently.",
      "Snuggled into mama's arms and fell asleep listening to her heartbeat. Pure bliss.",
      "Grabbed papa's finger and wouldn't let go. He carried me around the house like a little koala.",
      "Nuzzled against mama's neck and made happy cooing sounds. She kissed my forehead softly.",
      "Climbed into papa's lap and rested my head on his chest. He read me a story in a funny voice.",
      "Wrapped my tiny arms around mama's leg and held on tight. She laughed and picked me up for a big hug.",
      "Crawled between both parents on the couch and fell asleep in the warmest spot in the world.",
      "Reached up with both arms until papa lifted me high in the air. I giggled and drooled on his face.",
      "Pressed my cheek against mama's and babbled softly. She said I was the sweetest baby ever.",
      "Toddled over to papa and headbutted his knee lovingly. He scooped me up for a bear hug.",
      "Curled up like a little ball in mama's lap while she hummed a gentle tune.",
      "Grabbed both parents' hands and tried to hold them together. They melted with joy."
    ];
    const chosenCuddle = cuddleMessages[Math.floor(Math.random() * cuddleMessages.length)];

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      stats: {
        ...gameState.stats,
        happiness: Math.min(100, gameState.stats.happiness + happinessGain)
      },
      log: [
        ...gameState.log,
        `❤️ ${chosenCuddle}`,
        `└─ Happiness improved (+${happinessGain}) and trust with parents improved (+${trustGain}).`
      ]
    });
    
    setActionPopup({
      isOpen: true,
      title: "❤️ Cuddle Parents",
      message: chosenCuddle
    });
  };

  const handleInfantPlay = () => {
    if (!gameState) return;
    triggerSound('success');
    const smartsGain = Math.floor(Math.random() * 4) + 2;
    const happinessGain = Math.floor(Math.random() * 5) + 3;

    const toys = [
      "Played with colorful wooden blocks and chewed on a squeaky rubber ducky.",
      "Played with a soft plush bear, tossing it across the play mat.",
      "Shook a shiny rattle with absolute joy. Shake shake shake!",
      "Discovered my own toes! Spent an hour trying to pull them into my mouth.",
      "Stacked three blocks on top of each other then knocked them down with a victorious shriek!",
      "Found a crinkly toy and spent forever making it go crunch crunch crunch. Music to my ears!",
      "Pushed a toy car across the floor and chased after it on all fours. Vroom vroom!",
      "Hugged my stuffed bunny so tight its ear popped off. Mama had to perform emergency surgery.",
      "Banged on a toy xylophone like a tiny rock star. The dog howled along!",
      "Figured out how to open the jack-in-the-box. Scared myself and cried, then did it again.",
      "Played peek-a-boo with a blanket over my head. Kept forgetting where everyone went!",
      "Found papa's keys and jingled them for 30 minutes straight. Best toy ever invented."
    ];
    const chosenToy = toys[Math.floor(Math.random() * toys.length)];

    setGameState({
      ...gameState,
      stats: {
        ...gameState.stats,
        smarts: Math.min(100, gameState.stats.smarts + smartsGain),
        happiness: Math.min(100, gameState.stats.happiness + happinessGain)
      },
      log: [
        ...gameState.log,
        `🧸 ${chosenToy}`,
        `└─ Smarts improved (+${smartsGain}) and Happiness improved (+${happinessGain}).`
      ]
    });
    
    setActionPopup({
      isOpen: true,
      title: "🧸 Play With Toys",
      message: chosenToy
    });
  };

  const handleInfantNap = () => {
    if (!gameState) return;
    
    const currentNapCount = gameState.flags.napCount || 0;
    const isSleepy = currentNapCount < 3;
    
    if (isSleepy) {
      triggerSound('success');
      const healthGain = Math.floor(Math.random() * 5) + 3; // a lil health boost
      const happinessGain = Math.floor(Math.random() * 3) + 2;
      const newNapCount = currentNapCount + 1;
      
      setGameState({
        ...gameState,
        stats: {
          ...gameState.stats,
          health: Math.min(100, gameState.stats.health + healthGain),
          happiness: Math.min(100, gameState.stats.happiness + happinessGain)
        },
        flags: {
          ...gameState.flags,
          napCount: newNapCount
        },
        log: [
          ...gameState.log,
          `💤 Took a long, peaceful nap on my parents' lap with my thumb in my mouth.`,
          `└─ Health restored (+${healthGain}) and Happiness improved (+${happinessGain}).`
        ]
      });
      
      const napSuccessMessages = [
        "Dozed off on papa's warm chest while he watched TV. Dreamed about floating clouds.",
        "Fell asleep mid-crawl and face-planted into a soft pillow. Mama found me snoring peacefully.",
        "Curled up with my favorite stuffed animal and drifted into the sweetest nap.",
        "Mama rocked me gently and I was out like a light within seconds. Zzzzz.",
        "Napped so hard I drooled a little lake on the blanket. Woke up refreshed and hungry!",
        "Fell asleep to the sound of rain pattering on the window. Had dreams about splashing in puddles.",
        "Papa sang an off-key lullaby and somehow it worked perfectly. Slept like a tiny angel.",
        "Yawned three times in a row and conked out right on the play mat surrounded by toys.",
        "Snuggled into the warm laundry pile and took the coziest nap of my life.",
        "Watched the ceiling fan go round and round until my eyes got heavy... zzzzz."
      ];
      const chosenNapMsg = napSuccessMessages[Math.floor(Math.random() * napSuccessMessages.length)];
      setActionPopup({
        isOpen: true,
        title: "💤 Sweet Dreams",
        message: chosenNapMsg,
      });
    } else {
      triggerSound('error');
      
      const wakefulReasons = [
        "You saw a spider on the ceiling and couldn't sleep.",
        "You kept thinking about your toys.",
        "You heard a loud truck outside.",
        "You weren't sleepy though, but you tried to sleep anyway.",
        "You were too energetic and rolled around instead.",
        "A fly was buzzing around your ear.",
        "You wanted to play peek-a-boo instead.",
        "You were hungry for milk.",
        "You felt like babbling loudly."
      ];
      const randomReason = wakefulReasons[Math.floor(Math.random() * wakefulReasons.length)];
      
      setGameState({
        ...gameState,
        log: [
          ...gameState.log,
          `💤 Tried to nap, but wasn't sleepy. ${randomReason}`
        ]
      });
      
      setActionPopup({
        isOpen: true,
        title: "💤 Wide Awake",
        message: randomReason,
      });
    }
  };

  const handleStyleUpgrade = () => {
    if (!gameState) return;
    const isUnderage = gameState.age < 18;

    if (!isUnderage && gameState.cash < 150) {
      triggerSound('error');
      return;
    }

    const styleGain = Math.floor(Math.random() * 15) + 10;
    const statusGain = Math.floor(Math.random() * 10) + 5;

    if (isUnderage) {
      const parents = (Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation === 'parent');
      const parentsCount = parents.length;
      const avgTrust = parentsCount > 0 
        ? parents.reduce((sum, p) => sum + p.trust, 0) / parentsCount 
        : 80;

      const successChance = Math.max(5, Math.min(95, avgTrust - 20));
      const roll = Math.random() * 100;
      const success = roll < successChance;

      if (!success) {
        triggerSound('error');
        const nextStats = {
          ...gameState.stats,
          happiness: Math.max(0, gameState.stats.happiness - 5)
        };
        const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
          if (r.relation === 'parent') {
            return { ...r, resentment: Math.min(100, r.resentment + 2) };
          }
          return r;
        });

        setGameState({
          ...gameState,
          stats: nextStats,
          relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
          log: [
            ...gameState.log,
            `😢 Asked my parents for money to upgrade my wardrobe, but they said NO! "You still fit perfectly fine in your older sibling's hand-me-downs!"`,
            `└─ Lost happiness (-5).`
          ],
          lastOutcome: {
            choiceText: "Ask Parents to pay for Wardrobe Upgrade ($150)",
            outcomeText: `😢 You asked your parents for money to buy stylish new clothes, but they said NO! "You still fit perfectly fine in your older sibling's hand-me-downs!" they complained. (-5 Happiness, +2 Parents' Resentment)`
          }
        });
        setShowOutcomeModal(true);
        setSelectedActivity(null);
        return;
      }

      // Success! Parents paid.
      triggerSound('success');
      const nextStats = {
        ...gameState.stats,
        style: Math.min(100, gameState.stats.style + styleGain),
        status: Math.min(100, gameState.stats.status + statusGain),
        happiness: Math.min(100, gameState.stats.happiness + 5)
      };
      const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
        if (r.relation === 'parent') {
          return { ...r, trust: Math.min(100, r.trust + 2) };
        }
        return r;
      });

      setGameState({
        ...gameState,
        stats: nextStats,
        relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
        log: [
          ...gameState.log,
          `👗 Asked my parents for money to buy stylish new clothes. They agreed and paid the $150!`,
          `└─ Style increased substantially (+${styleGain}), social status grew (+${statusGain}), and happiness improved (+5)!`
        ],
        lastOutcome: {
          choiceText: "Ask Parents to pay for Wardrobe Upgrade ($150)",
          outcomeText: `👗 You asked your parents for money to upgrade your wardrobe. They agreed and happily paid the $150! You look fabulous. (+${styleGain} Style, +${statusGain} Status, +5 Happiness, +2 Parents' Trust)`
        }
      });
      setShowOutcomeModal(true);
    } else {
      // Adult purchase
      triggerSound('success');
      const nextStats = {
        ...gameState.stats,
        style: Math.min(100, gameState.stats.style + styleGain),
        status: Math.min(100, gameState.stats.status + statusGain)
      };

      setGameState({
        ...gameState,
        cash: gameState.cash - 150,
        stats: nextStats,
        log: [
          ...gameState.log,
          `👔 Visited high-end boutiques to upgrade your wardrobe with stylish modern fits (-$150).`,
          `└─ Style increased substantially (+${styleGain}) and social status grew (+${statusGain})!`
        ]
      });
    }
    setSelectedActivity(null);
  };

  // Job Interview management
  const triggerInterview = (job: typeof JOB_INTERVIEWS[0]) => {
    if (!gameState) return;
    triggerSound('click');
    
    // Check Looks and Smarts minimum stats for qualification
    if (job.minLooks && gameState.stats.looks < job.minLooks) {
      triggerSound('error');
      setActionPopup({
        isOpen: true,
        title: 'Not Qualified',
        message: `You don't meet the physical appearance requirements for this job. You need at least ${job.minLooks}% Looks.`
      });
      return;
    }
    
    if (job.minSmarts && gameState.stats.smarts < job.minSmarts) {
      triggerSound('error');
      setActionPopup({
        isOpen: true,
        title: 'Not Qualified',
        message: `You don't meet the intelligence requirements for this job. You need at least ${job.minSmarts}% Smarts.`
      });
      return;
    }

    if (job.reqLevel || job.reqMajor) {
      const history = gameState.completedEducation || [];
      const meetsLevel = job.reqLevel ? history.some(ed => ed.level === job.reqLevel) : true;
      const meetsMajor = job.reqMajor ? history.some(ed => job.reqMajor?.includes(ed.major)) : true;
      
      if (!meetsLevel || !meetsMajor) {
        triggerSound('error');
        setActionPopup({
          isOpen: true,
          title: 'Not Qualified',
          message: `You don't have the required education for this job. You need a degree from ${job.reqLevel ? job.reqLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'University'} ${job.reqMajor ? 'in ' + job.reqMajor.join(' or ') : ''}.`
        });
        return;
      }
    }
    
    const categoryQuestions = INTERVIEW_QUESTIONS[job.industry] || INTERVIEW_QUESTIONS['retail'];
    const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    
    setJobInterview({ job, questionData: randomQuestion });
  };

  const resolveInterview = (option: JobInterviewOption) => {
    if (!gameState || !jobInterview) return;
    
    let nextStats = { ...gameState.stats };
    let nextLog = [...gameState.log];
    let nextCareer = { ...gameState.career };
    const theJob = jobInterview.job;

    if (option.correct) {
      triggerSound('success');
      if (option.statChanges) {
        Object.entries(option.statChanges).forEach(([stat, val]) => {
          const k = stat as keyof Stats;
          if (k in nextStats) nextStats[k] = Math.min(100, Math.max(0, nextStats[k] + (val as number)));
        });
      }
      
      const employers = {
        'tech': ['TechNova Solutions', 'CyberDyne Systems', 'Initech', 'Pied Piper'],
        'medical': ['St. Jude\'s Hospital', 'Mercy General', 'Springfield Medical Center', 'Apex Health'],
        'corporate': ['Globex Corporation', 'Wayne Enterprises', 'Omni Consumer Products', 'Prestige Worldwide'],
        'retail': ['Dumpton\'s', 'S-Mart', 'MegaLo Mart', 'Cloud 9 Superstore'],
        'special': ['Freelance', 'Independent', 'Government'],
        'entertainment': ['Star Records', 'Vivid Productions', 'Hollywood Studios']
      };
      const empList = employers[theJob.industry as keyof typeof employers] || employers['retail'];
      const randomEmployer = empList[Math.floor(Math.random() * empList.length)];
      
      nextCareer = {
        type: 'job',
        title: theJob.title,
        salary: theJob.salary,
        performance: 50,
        yearsInRole: 0,
        workHarderCount: 0,
        hoursPerWeek: 40,
        industry: theJob.industry,
        tier: theJob.tier,
        employer: randomEmployer
      };
      
      nextLog.push(`💼 Started a new career as a ${theJob.title} earning $${theJob.salary.toLocaleString()}/year!`);
      
      const MALE_NAMES_L = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"];
      const FEMALE_NAMES_L = ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy"];
      const SURNAMES_L = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
      
      const generateName = () => {
        const first = Math.random() > 0.5 ? MALE_NAMES_L[Math.floor(Math.random() * MALE_NAMES_L.length)] : FEMALE_NAMES_L[Math.floor(Math.random() * FEMALE_NAMES_L.length)];
        const last = SURNAMES_L[Math.floor(Math.random() * SURNAMES_L.length)];
        return first + ' ' + last;
      };
      
      const newColleagues = [];
      newColleagues.push({
        id: 'sup_' + Date.now(),
        name: generateName(),
        relation: 'supervisor',
        archetype: 'average',
        age: gameState.age + Math.floor(Math.random() * 20) + 5,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        occupation: 'Manager',
        trust: 50, suspicion: 20, resentment: 0
      });
      for (let i = 0; i < 3; i++) {
        newColleagues.push({
          id: 'coworker_' + i + '_' + Date.now(),
          name: generateName(),
          relation: 'colleague',
          archetype: 'average',
          age: gameState.age + Math.floor(Math.random() * 20) - 5,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          occupation: 'Coworker',
          trust: 40, suspicion: 10, resentment: 0
        });
      }
      
      const filteredRels = (Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation !== 'colleague' && r.relation !== 'supervisor');
      const nextRelationships = [...filteredRels, ...newColleagues];
      
      setGameState({
        ...gameState,
        stats: nextStats,
        log: nextLog,
        career: nextCareer as any,
        npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      });
      
      setActionPopup({
        isOpen: true,
        title: 'When can you start?',
        message: `Welcome to the team!\n\nTitle: ${theJob.title}\nCareer: ${theJob.industry.toUpperCase()}\nSalary: $${theJob.salary.toLocaleString()}/yr`
      });
      
    } else {
      triggerSound('error');
      if (option.statChanges) {
        Object.entries(option.statChanges).forEach(([stat, val]) => {
          const k = stat as keyof Stats;
          if (k in nextStats) nextStats[k] = Math.min(100, Math.max(0, nextStats[k] + (val as number)));
        });
      }
      nextLog.push(`❌ Rejected: Failed the interview for ${theJob.title}. ${option.feedback}`);
      setGameState({
        ...gameState,
        stats: nextStats,
        log: nextLog
      });
      
      setActionPopup({
        isOpen: true,
        title: 'Rejected',
        message: `You did not get the job. \n\nFeedback: ${option.feedback}`
      });
    }
    
    setJobInterview(null);
    setSelectedActivity(null);
  };

  // Relationship actions: spent time, conversations, gifts, insults
  const interactSpendTime = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('success');

    const trustGain = Math.floor(Math.random() * 8) + 5;
    const resentmentDec = Math.floor(Math.random() * 10) + 5;

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.min(100, r.trust + trustGain),
          resentment: Math.max(0, r.resentment - resentmentDec)
        };
      }
      return r;
    });

    const updatedLog = [
      ...gameState.log,
      `❤️ Spent peaceful quality time bonding with your ${rel.relation} (${rel.name}).`,
      `└─ Trust increased (+${trustGain}) and resentment diminished (-${resentmentDec}).`
    ];

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      log: updatedLog
    });
    setSelectedRelationship(null);
  };

  const interactChat = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('click');

    const positiveChance = Math.random() > (rel.resentment / 150);
    let trustChange = 0;
    let resentmentChange = 0;
    let outcomeText = '';

    if (positiveChance) {
      trustChange = Math.floor(Math.random() * 6) + 3;
      resentmentChange = -Math.floor(Math.random() * 5) - 2;
      outcomeText = `The conversation went beautifully! You shared deep insights and laughed about childhood memories.`;
    } else {
      trustChange = -Math.floor(Math.random() * 5) - 2;
      resentmentChange = Math.floor(Math.random() * 8) + 4;
      outcomeText = `The conversation took an awkward turn, hitting a sore spot and creating tension.`;
    }

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.max(0, Math.min(100, r.trust + trustChange)),
          resentment: Math.max(0, Math.min(100, r.resentment + resentmentChange))
        };
      }
      return r;
    });

    const updatedLog = [
      ...gameState.log,
      `💬 Had a conversation with your ${rel.relation} (${rel.name}).`,
      `└─ Outcome: ${outcomeText} (Trust: ${trustChange >= 0 ? '+' : ''}${trustChange}, Resentment: ${resentmentChange >= 0 ? '+' : ''}${resentmentChange})`
    ];

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      log: updatedLog
    });
    setSelectedRelationship(null);
  };

  const interactGift = (rel: Relationship, cost: number) => {
    if (!gameState || gameState.cash < cost) {
      triggerSound('error');
      return;
    }
    triggerSound('success');

    // Trust gain scales with cost
    const baseGain = cost === 50 ? 8 : 22;
    const trustGain = Math.floor(Math.random() * 10) + baseGain;
    const resentmentDec = Math.floor(Math.random() * 15) + baseGain;

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.min(100, r.trust + trustGain),
          resentment: Math.max(0, r.resentment - resentmentDec)
        };
      }
      return r;
    });

    const giftType = cost === 50 ? 'heartfelt book' : 'premium luxury handbag';
    const updatedLog = [
      ...gameState.log,
      `🎁 Gifted a ${giftType} to your ${rel.relation} (${rel.name}) (-$${cost}).`,
      `└─ Trust spiked (+${trustGain}) and resentment dropped (-${resentmentDec}).`
    ];

    setGameState({
      ...gameState,
      cash: gameState.cash - cost,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      log: updatedLog
    });
    setSelectedRelationship(null);
  };

  const interactInsult = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('error');

    const trustDec = Math.floor(Math.random() * 20) + 15;
    const resentmentInc = Math.floor(Math.random() * 25) + 15;

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.max(0, r.trust - trustDec),
          resentment: Math.min(100, r.resentment + resentmentInc)
        };
      }
      return r;
    });

    const updatedLog = [
      ...gameState.log,
      `🤬 You insulted your ${rel.relation} (${rel.name}) during a heated argument.`,
      `└─ Trust collapsed (-${trustDec}) and resentment surged (+${resentmentInc})!`
    ];

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      log: updatedLog
    });
    setSelectedRelationship(null);
  };

  const interactFight = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('click');
    setActiveFight({
      opponentName: rel.name,
      opponentId: rel.id,
      move: 'punch',
      target: 'jaw'
    });
    setSelectedRelationship(null);
  };


  const interactAskPromotion = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('click');
    
    if (gameState.career.type !== 'job') {
      setActionPopup({ isOpen: true, title: 'Not Possible', message: 'You need a job first to ask for a promotion.' });
      return;
    }
    
    // Logic for promotion
    // Needs high performance and at least 2 years in role
    const perf = gameState.career.performance || 0;
    const years = gameState.career.yearsInRole || 0;
    
    if (years < 2) {
      triggerSound('error');
      setActionPopup({ isOpen: true, title: 'Too Soon', message: 'Your supervisor says you haven\'t been in your current role long enough to be considered for a promotion.' });
      return;
    }
    
    if (perf < 75) {
      triggerSound('error');
      setActionPopup({ isOpen: true, title: 'Needs Improvement', message: 'Your supervisor points out that your performance hasn\'t been exceptional lately. Work harder before asking again.' });
      return;
    }
    
    if (rel.trust < 50 || rel.resentment > 30) {
      triggerSound('error');
      setActionPopup({ isOpen: true, title: 'Denied', message: 'Your supervisor doesn\'t like you enough to vouch for your promotion.' });
      return;
    }
    
    // Promotion success
    triggerSound('success');
    const newSalary = Math.floor(gameState.career.salary * 1.25);
    const newTitle = "Senior " + gameState.career.title.replace("Senior ", "").replace("Junior ", "");
    
    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => 
      r.id === rel.id ? { ...r, trust: Math.min(100, r.trust + 10) } : r
    );
    
    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      career: { ...gameState.career, title: newTitle, salary: newSalary, yearsInRole: 0 },
      log: [...gameState.log, `📈 You asked your supervisor for a promotion and got it! You are now a ${newTitle} making $${newSalary.toLocaleString()}/yr.`]
    });
    
    setActionPopup({ isOpen: true, title: 'Promoted!', message: `Congratulations! Your supervisor approved your promotion.\n\nNew Title: ${newTitle}\nNew Salary: $${newSalary.toLocaleString()}/yr` });
    setSelectedRelationship(null);
  };
  
  const interactAskRaise = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('click');
    
    if (gameState.career.type !== 'job') {
      return;
    }
    
    const perf = gameState.career.performance || 0;
    
    if (perf < 60 || rel.trust < 40) {
      triggerSound('error');
      setActionPopup({ isOpen: true, title: 'Raise Denied', message: 'Your supervisor laughed at your request for a raise. Your performance and relationship need to be better.' });
      const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => 
        r.id === rel.id ? { ...r, resentment: Math.min(100, r.resentment + 5) } : r
      );
      setGameState({ ...gameState, relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])), log: [...gameState.log, `❌ Your request for a raise was denied.`] });
      return;
    }
    
    triggerSound('success');
    const newSalary = Math.floor(gameState.career.salary * 1.08); // 8% raise
    
    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => 
      r.id === rel.id ? { ...r, trust: Math.min(100, r.trust + 5) } : r
    );
    
    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      career: { ...gameState.career, salary: newSalary },
      log: [...gameState.log, `💰 You negotiated a raise! Your new salary is $${newSalary.toLocaleString()}/yr.`]
    });
    
    setActionPopup({ isOpen: true, title: 'Raise Approved', message: `Your supervisor agreed to give you a raise!\n\nNew Salary: $${newSalary.toLocaleString()}/yr` });
    setSelectedRelationship(null);
  };

  const interactClassmateFlirt = (rel: Relationship) => {
    if (!gameState) return;
    const isSuccess = Math.random() > 0.4;
    let trustChange = 0;
    let resentmentChange = 0;
    let popularityChange = 0;
    let happinessChange = 0;
    let outcomeText = '';
    let logMsg = '';

    if (isSuccess) {
      triggerSound('success');
      trustChange = Math.floor(Math.random() * 15) + 10;
      resentmentChange = -Math.floor(Math.random() * 10) - 5;
      popularityChange = Math.floor(Math.random() * 8) + 4;
      happinessChange = 12;
      outcomeText = `You winked seductively and whispered a hilarious pickup line in Chemistry class. They blushed, giggled, and whispered: "You're crazy, but I like it!"`;
      logMsg = `❤️ Successfully flirted with classmate ${rel.name} in class.`;
    } else {
      triggerSound('error');
      trustChange = -Math.floor(Math.random() * 10) - 5;
      resentmentChange = Math.floor(Math.random() * 15) + 5;
      popularityChange = -Math.floor(Math.random() * 10) - 5;
      happinessChange = -10;
      outcomeText = `You tried to look seductive but choked on your saliva and coughed violently all over their desk. They shrieked "EWW! TEACHER, THEY SPIT ON ME!" in front of the whole class.`;
      logMsg = `💔 Failed miserably trying to flirt with classmate ${rel.name}.`;
    }

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.max(0, Math.min(100, r.trust + trustChange)),
          resentment: Math.max(0, Math.min(100, r.resentment + resentmentChange))
        };
      }
      return r;
    });

    const nextFlags = {
      ...gameState.flags,
      schoolPopularity: Math.max(0, Math.min(100, (gameState.flags.schoolPopularity || 50) + popularityChange))
    };

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      stats: {
        ...gameState.stats,
        happiness: Math.max(0, Math.min(100, gameState.stats.happiness + happinessChange))
      },
      flags: nextFlags,
      log: [
        ...gameState.log,
        logMsg,
        `└─ ${outcomeText} (Popularity: ${popularityChange >= 0 ? '+' : ''}${popularityChange}, Happiness: ${happinessChange >= 0 ? '+' : ''}${happinessChange})`
      ]
    });
    setSelectedRelationship(null);
  };

  const interactClassmateRumor = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('success');
    
    const rumors = [
      `runs a secret illegal snail-racing ring in the gymnasium basement`,
      `has a severe obsession with eating neon crayons during exams`,
      `was spotted wearing their grandmother's frilly underwear to PE class`,
      `secretly runs a highly lucrative foot-modeling empire under a pseudonym`,
      `is actually a 35-year-old undercover cop trying to look cool`
    ];
    const pickedRumor = rumors[Math.floor(Math.random() * rumors.length)];
    
    const trustChange = -25;
    const resentmentChange = 30;
    const popularityChange = Math.floor(Math.random() * 12) + 6;

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.max(0, r.trust + trustChange),
          resentment: Math.min(100, r.resentment + resentmentChange)
        };
      }
      return r;
    });

    const nextFlags = {
      ...gameState.flags,
      schoolPopularity: Math.max(0, Math.min(100, (gameState.flags.schoolPopularity || 50) + popularityChange))
    };

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      flags: nextFlags,
      log: [
        ...gameState.log,
        `🗣️ Started a rumor that ${rel.name} ${pickedRumor}.`,
        `└─ The rumor spread like wildfire! Your school popularity surged (+${popularityChange}) but ${rel.name} absolutely despises you.`
      ]
    });
    setSelectedRelationship(null);
  };

  const interactClassmatePrank = (rel: Relationship) => {
    if (!gameState) return;
    const isSuccess = Math.random() > 0.45;
    let trustChange = 0;
    let resentmentChange = 0;
    let popularityChange = 0;
    let healthChange = 0;
    let outcomeText = '';
    let logMsg = '';

    if (isSuccess) {
      triggerSound('success');
      trustChange = -15;
      resentmentChange = 20;
      popularityChange = Math.floor(Math.random() * 15) + 5;
      outcomeText = `You coated their locker handle with industrial-strength superglue and glitter. They got stuck for three hours while the entire hallway laughed and took videos.`;
      logMsg = `🎉 Successfully pranked classmate ${rel.name}.`;
    } else {
      triggerSound('error');
      trustChange = -20;
      resentmentChange = 35;
      popularityChange = -10;
      healthChange = -15;
      outcomeText = `You tried to drop a water balloon on their head from the balcony, but slipped, fell over the railing, landed directly on a trash bin, and then they kicked you in the ribs.`;
      logMsg = `❌ My prank on classmate ${rel.name} backfired catastrophically!`;
    }

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.max(0, r.trust + trustChange),
          resentment: Math.min(100, r.resentment + resentmentChange)
        };
      }
      return r;
    });

    const nextFlags = {
      ...gameState.flags,
      schoolPopularity: Math.max(0, Math.min(100, (gameState.flags.schoolPopularity || 50) + popularityChange))
    };

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      stats: {
        ...gameState.stats,
        health: Math.max(0, gameState.stats.health + healthChange)
      },
      flags: nextFlags,
      log: [
        ...gameState.log,
        logMsg,
        `└─ ${outcomeText} (Popularity: ${popularityChange >= 0 ? '+' : ''}${popularityChange}, Health: ${healthChange})`
      ]
    });
    setSelectedRelationship(null);
  };

  const interactTeacherBrownNose = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('success');
    const trustGain = Math.floor(Math.random() * 12) + 8;
    const smartsGain = Math.floor(Math.random() * 5) + 2;

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.min(100, r.trust + trustGain)
        };
      }
      return r;
    });

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      stats: {
        ...gameState.stats,
        smarts: Math.min(100, gameState.stats.smarts + smartsGain)
      },
      log: [
        ...gameState.log,
        `🍏 Brown-nosed your teacher, ${rel.name}.`,
        `└─ You complimented their slide design and polished their desk. They smiled warmly (+${trustGain} Teacher Trust, +${smartsGain} Smarts).`
      ]
    });
    setSelectedRelationship(null);
  };

  const interactTeacherGradeBoost = (rel: Relationship) => {
    if (!gameState) return;
    // Success scales with how much the teacher trusts you
    const isSuccess = Math.random() < (rel.trust / 120);
    let outcomeText = '';
    let gradeChange = 0;
    let logMsg = '';

    if (isSuccess) {
      triggerSound('success');
      gradeChange = Math.floor(Math.random() * 10) + 5;
      outcomeText = `You burst into tears, claiming your dog ate your hard drive containing the homework. Since they like you, they gave you an extension and bumped up your grade.`;
      logMsg = `📈 Successfully begged teacher ${rel.name} for a grade boost.`;
    } else {
      triggerSound('error');
      gradeChange = -5;
      outcomeText = `You tried to cry, but no tears came out. They saw right through your lazy performance, scolded you, and docked points for wasting their time.`;
      logMsg = `📉 Begging teacher ${rel.name} for a grade boost backfired.`;
    }

    const nextFlags = {
      ...gameState.flags,
      schoolGrades: Math.max(0, Math.min(100, (gameState.flags.schoolGrades || 80) + gradeChange))
    };

    setGameState({
      ...gameState,
      flags: nextFlags,
      log: [
        ...gameState.log,
        logMsg,
        `└─ ${outcomeText} (School Grades: ${gradeChange >= 0 ? '+' : ''}${gradeChange})`
      ]
    });
    setSelectedRelationship(null);
  };

  const interactTeacherPrank = (rel: Relationship) => {
    if (!gameState) return;
    const isSuccess = Math.random() > 0.55;
    let trustChange = 0;
    let resentmentChange = 0;
    let popularityChange = 0;
    let familyRepChange = 0;
    let outcomeText = '';
    let logMsg = '';

    if (isSuccess) {
      triggerSound('success');
      trustChange = -25;
      resentmentChange = 30;
      popularityChange = Math.floor(Math.random() * 20) + 10;
      outcomeText = `You snuck a screaming rubber chicken into their lectern. When they pressed it, the class went wild! You became an absolute school legend.`;
      logMsg = `🎉 Successfully pranked teacher ${rel.name}!`;
    } else {
      triggerSound('error');
      trustChange = -35;
      resentmentChange = 45;
      popularityChange = -10;
      familyRepChange = -15;
      outcomeText = `You tried to replace their whiteboard markers with permanent ones, but they caught you red-handed. You were sent to the Principal, given 3 days of detention, and your parents were notified.`;
      logMsg = `❌ Got caught pranking teacher ${rel.name}.`;
    }

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.max(0, r.trust + trustChange),
          resentment: Math.min(100, r.resentment + resentmentChange)
        };
      }
      return r;
    });

    const nextFlags = {
      ...gameState.flags,
      schoolPopularity: Math.max(0, Math.min(100, (gameState.flags.schoolPopularity || 50) + popularityChange))
    };

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      reputation: {
        ...gameState.reputation,
        family: Math.max(0, gameState.reputation.family + familyRepChange)
      },
      flags: nextFlags,
      log: [
        ...gameState.log,
        logMsg,
        `└─ ${outcomeText} (Popularity: ${popularityChange >= 0 ? '+' : ''}${popularityChange}, Family Reputation: ${familyRepChange})`
      ]
    });
    setSelectedRelationship(null);
  };

  const interactCompliment = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('success');

    const trustGain = Math.floor(Math.random() * 8) + 6;
    const resentmentDec = Math.floor(Math.random() * 8) + 4;

    const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
      if (r.id === rel.id) {
        return {
          ...r,
          trust: Math.min(100, r.trust + trustGain),
          resentment: Math.max(0, r.resentment - resentmentDec)
        };
      }
      return r;
    });

    const compliments = [
      "their incredible work ethic",
      "their sparkling personality",
      "their exquisite fashion taste",
      "how they always make everyone feel special",
      "their brilliant intellect"
    ];
    const chosenCompliment = compliments[Math.floor(Math.random() * compliments.length)];

    const updatedLog = [
      ...gameState.log,
      `🥰 You paid a warm compliment to your ${rel.relation} (${rel.name}), praising ${chosenCompliment}.`,
      `└─ Trust increased (+${trustGain}) and resentment decreased (-${resentmentDec}).`
    ];

    setGameState({
      ...gameState,
      relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
      log: updatedLog
    });
    setSelectedRelationship(null);
  };

  const interactAskForMoney = (rel: Relationship) => {
    if (!gameState) return;
    triggerSound('click');

    // Only parents or partners/spouses can be asked for money
    if (rel.relation !== 'parent' && rel.relation !== 'partner') {
      triggerSound('error');
      return;
    }

    let successChance = (rel.trust - rel.resentment) / 100;
    if (gameState.karma >= 60) {
      successChance += 0.15; // 15% more luck!
    } else if (gameState.karma < 40) {
      successChance -= 0.10; // 10% less luck
    }
    const roll = Math.random();

    if (roll < successChance) {
      triggerSound('success');
      // Success! Amount depends on age
      const amount = gameState.age < 12 
        ? Math.floor(Math.random() * 20) + 10  // $10-$30
        : gameState.age < 18 
        ? Math.floor(Math.random() * 50) + 20  // $20-$70
        : Math.floor(Math.random() * 150) + 50; // $50-$200

      const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
        if (r.id === rel.id) {
          return {
            ...r,
            resentment: Math.min(100, r.resentment + 2)
          };
        }
        return r;
      });

      const updatedLog = [
        ...gameState.log,
        `💰 You asked your ${rel.relation} (${rel.name}) for some spending money, and they agreed!`,
        `└─ Received: +$${amount.toLocaleString()} in cash.`
      ];

      setGameState({
        ...gameState,
        cash: gameState.cash + amount,
        relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
        log: updatedLog,
        lastOutcome: {
          choiceText: `Ask ${rel.relation === 'parent' ? 'Parents' : 'Partner'} for Money`,
          outcomeText: `💰 Your ${rel.relation} (${rel.name}) agreed! They handed you $${amount.toLocaleString()} with a warm smile. "Use it wisely!"`,
          cashChange: amount
        }
      });
      setShowOutcomeModal(true);
    } else {
      triggerSound('error');
      // Rejected
      const trustDec = Math.floor(Math.random() * 5) + 3;
      const resentmentInc = Math.floor(Math.random() * 6) + 4;

      const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
        if (r.id === rel.id) {
          return {
            ...r,
            trust: Math.max(0, r.trust - trustDec),
            resentment: Math.min(100, r.resentment + resentmentInc)
          };
        }
        return r;
      });

      const updatedLog = [
        ...gameState.log,
        `🚫 You asked your ${rel.relation} (${rel.name}) for some money, but they flatly refused and told you to stop begging.`,
        `└─ Trust decreased (-${trustDec}) and resentment increased (+${resentmentInc}).`
      ];

      setGameState({
        ...gameState,
        relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
        log: updatedLog,
        lastOutcome: {
          choiceText: `Ask ${rel.relation === 'parent' ? 'Parents' : 'Partner'} for Money`,
          outcomeText: `🚫 You asked your ${rel.relation} (${rel.name}) for some money, but they flatly refused! "We are not made of solid gold. Go earn your own money!" (Trust: -${trustDec}, Resentment: +${resentmentInc})`
        }
      });
      setShowOutcomeModal(true);
    }
    setSelectedRelationship(null);
  };

  // Dating search and Ask Out mechanics
  const handleSearchPartner = () => {
    if (!gameState || gameState.cash < 50) {
      triggerSound('error');
      return;
    }
    triggerSound('success');

    const isMale = Math.random() > 0.5;
    const partnerGender = isMale ? 'Male' : 'Female';
    const pName = `${isMale ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;
    const pAge = gameState.age + Math.floor(Math.random() * 5) - 2; // Roughly same age
    const actualAge = Math.max(18, pAge);
    
    const archetypes: ArchetypeType[] = [
      'loyal partner', 'jealous partner', 'controlling partner', 'supportive friend', 'toxic friend', 'average'
    ];
    const arch = archetypes[Math.floor(Math.random() * archetypes.length)];

    const occupations = ['Barista', 'Graphic Designer', 'Architect', 'Nurse', 'Marketing Lead', 'Unemployed'];
    const occ = occupations[Math.floor(Math.random() * occupations.length)];

    const matchedPartner: Relationship = {
      id: `partner_${Date.now()}`,
      name: pName,
      relation: 'partner',
      archetype: arch,
      age: actualAge,
      gender: partnerGender,
      occupation: occ,
      trust: 55,
      suspicion: arch === 'jealous partner' ? 35 : 10,
      resentment: 0
    };

    setDatingAppMatch(matchedPartner);
  };

  const handleApplyEducation = (schoolId: string, major: string) => {
    if (!gameState) return;
    triggerSound('click');
    const isAccepted = Math.random() < (gameState.stats.smarts / 100) + 0.1;
    
    if (isAccepted) {
      setGameState({
        ...gameState,
        career: {
          type: 'school',
          title: major,
          salary: 0,
          performance: 50,
          yearsInRole: 0,
        workHarderCount: 0,
        hoursPerWeek: 40,
          educationLevel: schoolId,
          major: major
        },
        log: [...gameState.log, `🎓 Accepted into ${schoolId === 'university' ? 'University' : 'School'} for ${major}!`]
      });
      setShowUniversityModal(false);
      setOccupationSubView('main');
      setActionPopup({
        isOpen: true,
        title: 'Accepted!',
        message: `Congratulations! Your application to study ${major} was accepted.`
      });
    } else {
      setShowUniversityModal(false);
      setActionPopup({
        isOpen: true,
        title: 'Rejected',
        message: `Your application was rejected. Try increasing your smarts before applying again.`
      });
      setGameState({
        ...gameState,
        log: [...gameState.log, `❌ Rejected from studying ${major}.`]
      });
    }
  };

  const handleFreelanceGig = (gigId: string) => {
    if (!gameState) return;
    triggerSound('click');
    
    if (gigId === 'escort') {
      const stdRisk = Math.random() < 0.25;
      const amount = Math.floor(Math.random() * 800) + 700;
      
      if (stdRisk && !gameState.flags.has_unprotected_sex) {
        setGameState({
          ...gameState,
          cash: gameState.cash + amount,
          flags: { ...gameState.flags, has_unprotected_sex: true },
          log: [...gameState.log, `💋 You worked as an escort and made $${amount}, but took risky decisions.`]
        });
        setActionPopup({
          isOpen: true,
          title: 'High Risk!',
          message: `You worked as an escort and made $${amount}. However, you had unprotected encounters. Watch out for illnesses next year!`
        });
      } else {
        setGameState({
          ...gameState,
          cash: gameState.cash + amount,
          log: [...gameState.log, `💋 You worked as an escort and made $${amount}.`]
        });
        setActionPopup({
          isOpen: true,
          title: 'Gig Complete',
          message: `You worked as an escort and successfully made $${amount}.`
        });
      }
    } else {
      setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'More freelance gigs will be available later.' });
    }
  };

  const handleAskOut = (accepted: boolean) => {
    if (!gameState || !datingAppMatch) return;

    if (accepted) {
      triggerSound('success');
      
      // Filter out any prior partner relationship to represent dating monogamously (standard in BitLife)
      const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation !== 'partner');
      nextRelationships.push(datingAppMatch);

      const nextRep = {
        ...gameState.reputation,
        dating: Math.min(100, gameState.reputation.dating + 15)
      };

      setGameState({
        ...gameState,
        cash: gameState.cash - 50,
        relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
        reputation: nextRep,
        log: [
          ...gameState.log,
          `❤️ Asked out ${datingAppMatch.name} on a cozy date (-$50).`,
          `└─ They accepted! You are now officially dating (Archetype: ${datingAppMatch.archetype}).`
        ]
      });
    } else {
      triggerSound('click');
    }

    setDatingAppMatch(null);
    setSelectedActivity(null);
  };

  // Asset buying
  const handleBuyAsset = (asset: typeof ASSETS_LIST[0]) => {
    if (!gameState || gameState.cash < asset.cost) {
      triggerSound('error');
      return;
    }
    triggerSound('success');

    const nextStats = {
      ...gameState.stats,
      style: Math.min(100, gameState.stats.style + asset.style),
      status: Math.min(100, gameState.stats.status + asset.status)
    };

    setGameState({
      ...gameState,
      cash: gameState.cash - asset.cost,
      stats: nextStats,
      log: [
        ...gameState.log,
        `🔑 Purchased Asset: "${asset.name}" for $${asset.cost.toLocaleString()}.`,
        `└─ Gained massive social status (+${asset.status}) and unique personal style (+${asset.style})!`
      ]
    });

    setPurchasedAssets([...purchasedAssets, asset.name]);
    setSelectedActivity(null);
  };

  // Ask Parents to Buy Asset (for age < 12)
  const handleAskParentsToBuy = (asset: typeof ASSETS_LIST[0]) => {
    if (!gameState) return;
    const isOwned = purchasedAssets.includes(asset.name);
    if (isOwned) {
      triggerSound('error');
      return;
    }

    const parents = (Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation === 'parent');
    const parentsCount = parents.length;
    const avgTrust = parentsCount > 0 
      ? parents.reduce((sum, p) => sum + p.trust, 0) / parentsCount 
      : 80;

    // Roll success chance based on parent relationship trust and cost of item
    // Cheap items are easy to get, expensive items are much harder.
    let costPenalty = 0;
    if (asset.cost <= 5) costPenalty = 0;
    else if (asset.cost <= 25) costPenalty = 10;
    else if (asset.cost <= 100) costPenalty = 25;
    else if (asset.cost <= 1000) costPenalty = 50;
    else costPenalty = 85;

    let successChance = Math.max(5, Math.min(95, avgTrust - costPenalty));
    if (gameState.karma >= 60) {
      successChance += 15; // 15% more luck!
    } else if (gameState.karma < 40) {
      successChance -= 10; // 10% less luck
    }
    const roll = Math.random() * 100;
    const success = roll < successChance;

    if (success) {
      triggerSound('success');
      const nextStats = {
        ...gameState.stats,
        style: Math.min(100, gameState.stats.style + asset.style),
        status: Math.min(100, gameState.stats.status + asset.status),
        happiness: Math.min(100, gameState.stats.happiness + 8)
      };

      // Boost relationship trust slightly
      const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
        if (r.relation === 'parent') {
          return { ...r, trust: Math.min(100, r.trust + 3) };
        }
        return r;
      });

      setGameState({
        ...gameState,
        stats: nextStats,
        relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
        log: [
          ...gameState.log,
          `🎁 Asked my parents to buy me: "${asset.name}". They smiled and bought it for me!`,
          `└─ Gained status (+${asset.status}), style (+${asset.style}), and happiness (+8) (Parents paid $${asset.cost.toLocaleString()}).`
        ],
        lastOutcome: {
          choiceText: `Ask Parents to buy "${asset.name}"`,
          outcomeText: `🎁 Your parents smiled warmly and decided to purchase "${asset.name}" (worth $${asset.cost.toLocaleString()}) for you! They love seeing you happy. (+8 Happiness, +${asset.style} Style, +${asset.status} Status)`
        }
      });
      setShowOutcomeModal(true);
      setPurchasedAssets([...purchasedAssets, asset.name]);
    } else {
      triggerSound('error');
      const nextStats = {
        ...gameState.stats,
        happiness: Math.max(0, gameState.stats.happiness - 6)
      };

      // Slight resentment / tension boost
      const nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
        if (r.relation === 'parent') {
          return { ...r, resentment: Math.min(100, r.resentment + 2) };
        }
        return r;
      });

      setGameState({
        ...gameState,
        stats: nextStats,
        relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
        log: [
          ...gameState.log,
          `😢 Asked my parents to buy me: "${asset.name}". They flatly refused! "We are not made of money."`,
          `└─ Lost happiness (-6).`
        ],
        lastOutcome: {
          choiceText: `Ask Parents to buy "${asset.name}"`,
          outcomeText: `😢 You asked your parents to buy you "${asset.name}" (worth $${asset.cost.toLocaleString()}), but they flatly refused! "Do you think we are made of money?!" they scolded. (-6 Happiness, +2 Parents' Resentment)`
        }
      });
      setShowOutcomeModal(true);
    }
    setSelectedActivity(null);
  };

  if (isCreatingCharacter) {
    return (
      <CharacterCreator 
        onStartGame={(setup) => startNewGame(setup)} 
        triggerSound={triggerSound} 
      />
    );
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-6">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Calculate some display metrics
  const lifeStage = gameState.age < 6 ? 'Infant' : gameState.age < 12 ? 'Child' : gameState.age < 18 ? 'Student' : gameState.career.title;
  const isDead = !gameState.alive;

  return (
    <div className="flex flex-col h-screen md:h-auto min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-100 font-sans antialiased md:py-8 justify-center overflow-hidden md:overflow-visible">
      
      {/* Outer frame container inspired by premium responsive desktop-first layout */}
      <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 md:shadow-lg flex flex-col h-full md:h-[850px] max-h-screen md:max-h-none relative overflow-hidden">
        
        {/* TOP STATUS BAR CONTAINER */}
        <div className="bg-slate-950 text-white p-5 pb-10 flex flex-col justify-between relative border-b border-slate-900">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-widest uppercase opacity-75 font-black text-indigo-400">Life Simulator</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[8px] font-bold text-slate-400 uppercase tracking-wide">v0.2</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setSoundEnabled(!soundEnabled); triggerSound('click'); }} 
                className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-full transition text-slate-300 hover:text-white cursor-pointer"
                title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
                id="toggle-sound"
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              <button 
                onClick={handleRestartClick} 
                className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-full transition text-slate-300 hover:text-white cursor-pointer"
                title="Restart Game"
                id="restart-game"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Player stats hero widget - Clickable to open Profile & Detailed Stats */}
          <div 
            onClick={() => { triggerSound('click'); setShowProfileModal(true); }}
            className="flex flex-col items-center text-center py-2 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-150 group"
            title="Click to view detailed profile and reputation stats"
          >
            <div className="w-16 h-16 bg-slate-900 border-2 border-indigo-500/60 rounded-full flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-950/40 mb-3 animate-fade-in relative group-hover:border-indigo-400 group-hover:shadow-indigo-500/20 transition-all">
              <CharacterAvatar config={gameState.avatarConfig} gender={gameState.gender as 'Male' | 'Female'} age={gameState.age} />
              <span className="absolute bottom-0 right-0 bg-slate-950 text-[10px] font-black border border-slate-800 rounded-full px-1.5 py-0.5 leading-none z-10">
                {gameState.gender === 'Male' ? 'M' : 'F'}
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white group-hover:text-indigo-200 transition-all flex items-center gap-1.5 justify-center">
              {gameState.name} <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded-full font-mono border border-indigo-900/40 select-none">Profile 👤</span>
            </h2>
            <p className="text-xs text-indigo-200 mt-2 font-semibold tracking-wide flex items-center gap-1.5 bg-slate-900/55 px-3.5 py-1.5 rounded-full border border-slate-800/40 group-hover:bg-slate-900/80 transition-all">
              <span className="text-indigo-300">{lifeStage}</span>
              <span className="text-slate-700">&bull;</span>
              <span className="text-emerald-400 font-bold font-mono">${gameState.cash.toLocaleString()}</span>
              <span className="text-slate-700">&bull;</span>
              <span className="text-indigo-300">{gameState.age} {gameState.age === 1 ? 'Year' : 'Years'} old</span>
            </p>
          </div>
        </div>

        {/* INTERACTIVE EVENT OVERLAYS (HIGHEST PRIORITY POPUPS) */}
        {gameState.currentEvent && gameState.alive && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-indigo-50/50 relative overflow-hidden transform scale-100 transition-all">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1"></div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono flex items-center gap-1.5 shadow-xs">
                  <AlertTriangle size={12} className="shrink-0 text-indigo-500 animate-pulse" /> Choice Point
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {gameState.currentEvent.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-medium">
                  {gameState.currentEvent.text}
                </p>

                {gameState.activeRelationshipContextId && (
                  <div className="mt-3 px-3 py-2 bg-slate-50 border border-slate-100 text-xs text-slate-500 rounded-2xl flex items-center justify-between">
                    <span>Involved: <strong className="text-slate-800">{(Object.values(gameState.npcs || {}) as any[]).find(r => r.id === gameState.activeRelationshipContextId)?.name}</strong></span>
                    <span className="uppercase text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {(Object.values(gameState.npcs || {}) as any[]).find(r => r.id === gameState.activeRelationshipContextId)?.archetype}
                    </span>
                  </div>
                )}
              </div>

              {ritualPaymentActive ? (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest text-center">Ritual Sacrifice</p>
                    <p className="text-xl font-black text-indigo-700 font-mono mb-4">
                      ${ritualPaymentAmount.toLocaleString()}
                    </p>
                    
                    <input 
                      type="range" 
                      min="1" 
                      max="1000000" 
                      step="1"
                      value={ritualPaymentAmount}
                      onChange={(e) => { setRitualPaymentAmount(Number(e.target.value)); }}
                      className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    
                    <div className="flex justify-between w-full mt-2 text-[10px] text-slate-400 font-bold font-mono">
                      <span>$1</span>
                      <span>$1,000,000</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRitualPaymentActive(null)}
                      className="flex-1 py-3 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeInteractiveRitual}
                      className="flex-[2] py-3 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 rounded-xl transition cursor-pointer"
                    >
                      Perform Ritual
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {gameState.currentEvent.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoiceSelect(choice)}
                      className="w-full text-left p-3.5 border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/60 hover:border-indigo-200 text-xs font-bold text-slate-800 rounded-2xl transition duration-150 flex items-center justify-between group cursor-pointer"
                      id={`choice-${choice.id}`}
                    >
                      <span>{choice.text}</span>
                      <span className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition font-mono">&rarr;</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SLEEP POPUP MODAL */}
        {actionPopup && actionPopup.isOpen && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md z-40 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-[#ffab00] rounded-[2.5rem] shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden transform scale-100 transition-all">
              <div className="text-5xl my-2 select-none animate-pulse">💤</div>
              <h3 className="text-xl font-black text-[#ffd600] uppercase tracking-wide">
                {actionPopup.title}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                {actionPopup.message}
              </p>
              {actionPopup.statsGained && (
                <div className="text-xs text-emerald-400 font-black tracking-wider uppercase bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-full font-mono mt-1">
                  {actionPopup.statsGained}
                </div>
              )}
              <button
                onClick={() => { triggerSound('click'); setActionPopup(null); }}
                className="w-full rounded-full border-2 border-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black py-3 px-6 shadow-md uppercase tracking-wider text-xs cursor-pointer transition active:scale-95 mt-4"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* JOB INTERVIEW MODAL */}
        {jobInterview && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-emerald-50/50 relative overflow-hidden transform scale-100 transition-all">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1"></div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono flex items-center gap-1.5 shadow-xs">
                  <Briefcase size={12} className="shrink-0 text-emerald-600" /> Career Interview
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  Salary Offered: <span className="text-emerald-600 font-mono font-black">${jobInterview.job.salary.toLocaleString()}</span> / year
                </h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono font-bold">Interview Question:</p>
                <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-4 border border-slate-100 rounded-2xl font-semibold italic">
                  "{jobInterview.questionData.question}"
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-1">
                {jobInterview.questionData.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => resolveInterview(option)}
                    className="w-full text-left p-3.5 border border-slate-100 bg-slate-50/50 hover:bg-emerald-50/60 hover:border-emerald-200 text-xs font-bold text-slate-800 rounded-2xl transition duration-150 flex items-center justify-between cursor-pointer"
                    id={`interview-opt-${idx}`}
                  >
                    <span>{option.text}</span>
                    <span className="text-slate-300 transition font-mono">&rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DATING MATCH MODAL */}
        {datingAppMatch && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-pink-50/50 relative overflow-hidden transform scale-100 transition-all">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1"></div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-pink-50 text-pink-700 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono flex items-center gap-1.5 shadow-xs">
                  <Heart size={12} className="shrink-0 text-pink-500 animate-pulse" /> Dating Match Found!
                </span>
              </div>
              <div className="bg-pink-50/30 p-5 border border-pink-100/40 rounded-3xl text-center flex flex-col items-center gap-2 shadow-xs">
                <div className="text-4xl animate-bounce">❤️</div>
                <h3 className="text-xl font-black text-slate-900 leading-snug">
                  {datingAppMatch.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {datingAppMatch.gender} &bull; Age {datingAppMatch.age} &bull; Works as {datingAppMatch.occupation}
                </p>
                <div className="mt-2 text-[9px] uppercase font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full tracking-wider">
                  Archetype: {datingAppMatch.archetype}
                </div>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  onClick={() => handleAskOut(true)}
                  className="flex-1 py-3 bg-pink-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-pink-500 transition rounded-full cursor-pointer shadow-md shadow-pink-100"
                  id="ask-out-yes"
                >
                  Ask Out!
                </button>
                <button
                  onClick={() => handleAskOut(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition rounded-full cursor-pointer"
                  id="ask-out-no"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OUTCOME MODAL */}
        {showOutcomeModal && gameState.lastOutcome && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-indigo-50/50 relative overflow-hidden transform scale-100 transition-all">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1"></div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 size={12} className="shrink-0 text-indigo-500" /> Outcome Report
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">You chose:</p>
                <p className="text-xs font-bold text-indigo-950 italic mt-0.5">&ldquo;{gameState.lastOutcome.choiceText}&rdquo;</p>
                
                <p className="text-sm text-slate-700 mt-4 leading-relaxed font-semibold">
                  {gameState.lastOutcome.outcomeText}
                </p>
              </div>



              <button
                onClick={() => { triggerSound('click'); setShowOutcomeModal(false); }}
                className="w-full py-3 bg-indigo-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-900 transition mt-2 rounded-2xl cursor-pointer shadow-md"
                id="outcome-continue"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE FIGHT SELECTION MODAL */}
        {activeFight && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-rose-50/50 relative overflow-hidden transform scale-100 transition-all">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1"></div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono flex items-center gap-1.5 shadow-xs">
                  <Flame size={12} className="shrink-0 text-rose-500 animate-pulse" /> Brawl Initiated!
                </span>
              </div>
              
              <div>
                <h3 className="text-base font-black text-slate-950">
                  Choose your tactics against <span className="text-rose-600 font-mono font-black">{activeFight.opponentName}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                  Select a strike and targeting zone. Silly moves have a low win rate but grant status and happiness. Serious moves deal massive damage!
                </p>
              </div>

              {/* MOVES SELECTOR */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">1. Select Fight Move</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {FIGHT_MOVES.map((move) => {
                    const isSelected = activeFight.move === move.id;
                    const isSilly = ['tickle', 'touch', 'pinch'].includes(move.id);
                    return (
                      <button
                        key={move.id}
                        onClick={() => setActiveFight({ ...activeFight, move: move.id })}
                        className={`py-2 px-1 border text-[11px] font-bold text-center transition flex flex-col items-center justify-center gap-0.5 rounded-2xl cursor-pointer ${
                          isSelected 
                            ? 'border-rose-500 bg-rose-50/50 text-rose-700 font-black shadow-xs' 
                            : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                        id={`fight-move-${move.id}`}
                      >
                        <span className="text-sm">{move.emoji}</span>
                        <span className="truncate max-w-full leading-tight">{move.name}</span>
                        {isSilly && <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full mt-0.5 uppercase tracking-wider leading-none">Silly</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TARGET SELECTOR */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">2. Select Body Target</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {FIGHT_TARGETS.map((target) => {
                    const isSelected = activeFight.target === target.id;
                    return (
                      <button
                        key={target.id}
                        onClick={() => setActiveFight({ ...activeFight, target: target.id })}
                        className={`py-2 px-0.5 border text-[11px] font-bold text-center transition rounded-2xl cursor-pointer flex flex-col items-center justify-center ${
                          isSelected 
                            ? 'border-rose-500 bg-rose-50/50 text-rose-700 font-black shadow-xs' 
                            : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                        id={`fight-target-${target.id}`}
                      >
                        <span className="text-sm">{target.emoji}</span>
                        <span className="truncate max-w-full block leading-none mt-0.5">{target.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  onClick={handleResolveFight}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg shadow-rose-100 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  id="fight-attack-unleash"
                >
                  💥 Strike {activeFight.opponentName}!
                </button>
                <button
                  onClick={() => { triggerSound('click'); setActiveFight(null); }}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full transition cursor-pointer"
                  id="fight-retreat"
                >
                  Retreat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FIGHT OUTCOME MODAL */}
        {fightOutcome && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className={`bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border ${fightOutcome.victory ? 'border-emerald-50/50' : 'border-rose-50/50'} relative overflow-hidden transform scale-100 transition-all`}>
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1"></div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono flex items-center gap-1.5 shadow-xs ${fightOutcome.victory ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  <span className="text-xs">{fightOutcome.victory ? '🏆' : '🤕'}</span>
                  {fightOutcome.victory ? 'Brawl Victory' : 'Brawl Defeat'}
                </span>
              </div>

              <div className="bg-slate-50 p-5 border border-slate-100 rounded-3xl">
                <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                  {fightOutcome.text}
                </p>
              </div>

              {fightOutcome.statChangesText && (
                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-1 text-xs">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 block font-mono">Stat Alterations</span>
                  <p className="font-mono text-slate-700 font-bold">{fightOutcome.statChangesText}</p>
                </div>
              )}

              <button
                onClick={() => { triggerSound('click'); setFightOutcome(null); }}
                className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition cursor-pointer shadow-md"
                id="fight-outcome-continue"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* CLINIC / DOCTOR REPORT MODAL */}
        {medicalReport && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className={`bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border ${medicalReport.success ? 'border-emerald-50/50' : 'border-slate-50/50'} relative overflow-hidden transform scale-100 transition-all`}>
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1"></div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono flex items-center gap-1.5 shadow-xs ${medicalReport.success ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  <span className="text-xs">🩺</span> Medical Consultation
                </span>
              </div>

              <div className="bg-slate-50 p-5 border border-slate-100 rounded-3xl">
                <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                  {medicalReport.text}
                </p>
              </div>

              <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Consultation Fee:</span>
                <span className={`font-black ${medicalReport.cost > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {medicalReport.cost > 0 ? `-$${medicalReport.cost.toLocaleString()}` : 'FREE (Paid by Parents / Public Clinic)'}
                </span>
              </div>

              <button
                onClick={() => { triggerSound('click'); setMedicalReport(null); }}
                className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition cursor-pointer shadow-md"
                id="medical-report-close"
              >
                Exit Clinic
              </button>
            </div>
          </div>
        )}

        {/* PERSONAL IDENTITY PROFILE & DETAILED STATS MODAL */}
        {showAgeUpModal && ageUpData && (
        <AgeUpModal
          gameState={gameState}
          prevStats={ageUpData.prevStats}
          nextStats={ageUpData.nextStats}
          earnedCash={ageUpData.earnedCash}
          prevExposure={ageUpData.prevExposure}
          nextExposure={ageUpData.nextExposure}
          triggeredEvent={ageUpData.triggeredEvent}
          onSeeChoices={() => {
            setShowAgeUpModal(false);
            if (ageUpData.triggeredEvent) {
              setEventPopupData(ageUpData.triggeredEvent);
              setShowEventPopupModal(true);
            }
          }}
          onClose={() => {
            setShowAgeUpModal(false);
          }}
        />
      )}

      {showEventPopupModal && eventPopupData && (
        <EventPopupModal
          event={eventPopupData}
          onChoiceSelected={(choice) => {
            // Apply standard choice logic
            handleChoiceSelect(choice);
          }}
          onClose={() => {
            setShowEventPopupModal(false);
            setEventPopupData(null);
          }}
        />
      )}

      {showProfileModal && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-indigo-50/50 relative overflow-hidden max-h-[90%] transform scale-100 transition-all">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1"></div>
              
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full font-mono bg-indigo-50 text-indigo-700 flex items-center gap-1.5">
                  👤 Personal Profile
                </span>
                <button 
                  onClick={() => { triggerSound('click'); setShowProfileModal(false); }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="overflow-y-auto pr-1 space-y-4 max-h-[500px]">
                {/* Character Name & Life Overview */}
                <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-4 rounded-3xl relative overflow-hidden">
                  <div 
                    onClick={() => { triggerSound('click'); setShowAppearanceModal(true); }}
                    className="absolute top-2 right-4 w-12 h-12 rounded-full overflow-hidden border border-white/20 select-none bg-slate-900/50 hover:scale-105 hover:border-yellow-400 active:scale-95 transition-all cursor-pointer group"
                    title="Click to customize appearance"
                  >
                    <CharacterAvatar config={gameState.avatarConfig} gender={gameState.gender as 'Male' | 'Female'} age={gameState.age} className="group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-black uppercase text-white transition-opacity select-none">
                      Edit
                    </div>
                  </div>
                  <h4 className="text-lg font-black tracking-tight">{gameState.name}</h4>
                  <p className="text-[11px] font-mono text-indigo-200 mt-0.5 uppercase tracking-wide">
                    {gameState.age} Year Old &bull; {gameState.gender} &bull; {lifeStage}
                  </p>

                  {/* DNA Traits Badges */}
                  {gameState.avatarConfig && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                      <span className="text-[8px] px-2 py-0.5 bg-indigo-950/60 border border-white/10 text-indigo-200 font-extrabold uppercase tracking-widest rounded-full font-mono">
                        👁️ {gameState.avatarConfig.eyesColorSimulated} Eyes
                      </span>
                      <span className="text-[8px] px-2 py-0.5 bg-indigo-950/60 border border-white/10 text-indigo-200 font-extrabold uppercase tracking-widest rounded-full font-mono">
                        💋 {gameState.avatarConfig.lipsColorSimulated} Lips
                      </span>
                      <span className="text-[8px] px-2 py-0.5 bg-indigo-950/60 border border-white/10 text-indigo-200 font-extrabold uppercase tracking-widest rounded-full font-mono">
                        💇 Hair: {gameState.avatarConfig.top === 'noHair' ? 'Bald' : 'Styled'}
                      </span>
                      {gameState.gender === 'Male' && gameState.avatarConfig.facialHair !== 'none' && (
                        <span className={`text-[8px] px-2 py-0.5 border font-extrabold uppercase tracking-widest rounded-full font-mono ${
                          gameState.age >= 25 
                            ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300' 
                            : 'bg-amber-950/60 border-amber-800/40 text-amber-300'
                        }`}>
                          🧔 Beard: {gameState.age >= 25 ? 'Grown' : 'Growing (Age 25+)'}
                        </span>
                      )}
                      {gameState.gender === 'Female' && gameState.avatarConfig.makeupSimulated && gameState.avatarConfig.makeupSimulated !== 'None' && (
                        <span className="text-[8px] px-2 py-0.5 bg-pink-950/60 border border-pink-800/40 text-pink-200 font-extrabold uppercase tracking-widest rounded-full font-mono">
                          💄 {gameState.avatarConfig.makeupSimulated}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-indigo-900/60 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-indigo-300 block font-mono">Net Worth Valuation</span>
                      <span className="text-xl font-mono font-black text-emerald-400">
                        ${(gameState.cash + purchasedAssets.reduce((sum, aName) => sum + (ASSETS_LIST.find(a => a.name === aName)?.cost || 0), 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appearance Edit Button */}
                <button
                  onClick={() => { triggerSound('click'); setShowAppearanceModal(true); }}
                  className="w-full bg-gradient-to-r from-slate-800 to-indigo-950 hover:from-slate-700 hover:to-indigo-900 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm border border-slate-700/30 cursor-pointer"
                >
                  ⚡ Customize Appearance
                </button>

                {/* Core Status Bars */}
                <div className="space-y-2.5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Character Attributes</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-2.5 border border-slate-100">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1">❤️ Health</span>
                        <span className="font-mono">{gameState.stats.health}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${gameState.stats.health}%` }}></div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 border border-slate-100">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1">🧠 Smarts</span>
                        <span className="font-mono">{gameState.stats.smarts}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${gameState.stats.smarts}%` }}></div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 border border-slate-100">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1">🔥 Looks</span>
                        <span className="font-mono">{gameState.stats.looks}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${gameState.stats.looks}%` }}></div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 border border-slate-100">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1">✨ Style</span>
                        <span className="font-mono">{gameState.stats.style}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${gameState.stats.style}%` }}></div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 border border-slate-100 col-span-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span className="flex items-center gap-1">👑 Status / Prestige</span>
                        <span className="font-mono">{gameState.stats.status}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${gameState.stats.status}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reputation Breakdown */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Reputations & Relations</h3>
                  <div className="bg-slate-50 p-3 border border-slate-100 space-y-2">
                    {Object.entries(gameState.reputation).map(([category, val]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 capitalize">
                          <span>{category} Circle</span>
                          <span className="font-mono">{val}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-600 transition-all duration-300" style={{ width: `${val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Illnesses */}
                {gameState.illnesses.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Active Illnesses</h3>
                    <div className="space-y-1.5">
                      {gameState.illnesses.map((illness) => (
                        <div key={illness.id} className="p-2.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold">{illness.name}</span>
                            <p className="text-[9px] text-rose-600 mt-0.5 capitalize">Type: {illness.type}</p>
                          </div>
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-200 text-rose-800 font-black text-[9px] uppercase">Active</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lifetime Achievements */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1">
                      <span>🏆</span>
                      <span>Lifetime Achievements</span>
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full text-amber-700">
                      {Object.keys(unlockedAchievements).length} / {ACHIEVEMENTS.length}
                    </span>
                  </div>

                  {/* Completion Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3 border border-slate-200/50">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500" 
                      style={{ width: `${(Object.keys(unlockedAchievements).length / ACHIEVEMENTS.length) * 100}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {ACHIEVEMENTS.map(ach => {
                      const unlockInfo = unlockedAchievements[ach.id];
                      const isUnlocked = !!unlockInfo;

                      return (
                        <div 
                          key={ach.id} 
                          className={`p-3 border transition-all flex items-start gap-3 rounded-2xl ${
                            isUnlocked 
                              ? 'bg-amber-50/30 border-amber-200' 
                              : 'bg-slate-50/50 border-slate-100 opacity-60'
                          }`}
                        >
                          <div className={`text-2xl p-2 rounded-xl shrink-0 flex items-center justify-center select-none ${isUnlocked ? 'bg-amber-100' : 'bg-slate-200/60 filter grayscale opacity-50'}`}>
                            {ach.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-black uppercase tracking-wide ${isUnlocked ? 'text-amber-950' : 'text-slate-500'}`}>
                                {ach.title}
                              </span>
                              {isUnlocked && (
                                <span className="text-[8px] font-mono text-amber-600 bg-amber-100/50 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-widest">
                                  Unlocked
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                              {ach.description}
                            </p>
                            {isUnlocked && (
                              <p className="text-[9px] font-mono text-slate-400 mt-1.5 italic">
                                Achieved by {unlockInfo.characterName} on {new Date(unlockInfo.unlockedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN GAME OVER SCREEN */}
        {isDead && (
          <div className="absolute inset-0 bg-indigo-950 text-white z-40 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-4">🪦</div>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase">Rest In Peace</h1>
            <p className="text-indigo-300 font-mono text-sm mt-1">{gameState.name}</p>
            <p className="text-indigo-400 font-mono text-xs mt-1">Lived {gameState.age} years</p>
            
            <div className="my-6 max-w-sm p-4 bg-indigo-900/50 border border-indigo-800 rounded">
              <p className="text-xs text-indigo-300 uppercase tracking-widest font-mono font-bold">Cause of Death</p>
              <p className="text-sm font-semibold mt-1 leading-relaxed">{gameState.deathReason || 'Passed peacefully after a long and meaningful life.'}</p>
              <p className="text-xs font-mono text-indigo-400 mt-3">Final Net Worth: ${gameState.cash.toLocaleString()}</p>
            </div>

            <button
              onClick={handleRestartClick}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 font-bold uppercase text-xs tracking-wider transition shadow-lg flex items-center gap-2"
              id="resurrect-game"
            >
              <RotateCcw size={14} /> Start a New Life
            </button>
          </div>
        )}

        {/* ACTIVE MAIN CONTENT AREA */}
        <div className="bg-white rounded-t-[2.5rem] -mt-6 pt-5 flex-1 flex flex-col overflow-y-auto min-h-0 z-10 relative shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
          
          {/* TAB 1: LIFE LOG / JOURNAL FEED */}
          {activeTab === 'home' && (
            <div className="flex-1 flex flex-col p-4 bg-slate-50 min-h-0">

              {/* Journal Header with Filter Controls */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Life Chronology
                </span>
                
                <div className="flex bg-slate-200/70 p-0.5 rounded-xl border border-slate-300/40 select-none">
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setLogFilter('all');
                    }}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      logFilter === 'all'
                        ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    📝 Full Journal
                  </button>
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setLogFilter('milestones');
                    }}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      logFilter === 'milestones'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm border border-amber-600/10'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🏆 Milestones ({parsedMilestones.length})
                  </button>
                </div>
              </div>

              <motion.div 
                animate={
                  isShaking 
                    ? { 
                        x: [-6, 6, -6, 6, -4, 4, -2, 2, 0],
                        borderColor: ['#ef4444', '#f87171', '#ef4444', '#f87171', '#cbd5e1'],
                        boxShadow: ['0 0 0 4px rgba(239, 68, 68, 0.4)', '0 0 0 4px rgba(239, 68, 68, 0.4)', '0 0 0 0px rgba(0,0,0,0)']
                      } 
                    : {}
                }
                transition={{ duration: 0.6 }}
                className={`flex-1 overflow-y-auto border p-4 font-mono text-sm space-y-3 shadow-inner rounded-xl transition-colors duration-300 min-h-[420px] ${
                  isRedPulser ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-white'
                }`}
              >
                {logFilter === 'milestones' ? (
                  parsedMilestones.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-full">
                      <div className="text-4xl mb-3 animate-pulse">⏳</div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">No Major Milestones Yet</h4>
                      <p className="text-[10px] text-slate-400 max-w-[240px] mt-2 leading-relaxed">
                        Milestones flag key turning points like graduating, romantic bonds, first jobs, big medical events, or property acquisitions. Keep playing to leave your mark!
                      </p>
                    </div>
                  ) : (
                    <div className="relative pl-4 border-l-2 border-slate-200 space-y-4 ml-2 my-2">
                      {parsedMilestones.map((item, idx) => {
                        const m = item.info;
                        return (
                          <div key={idx} className="relative group">
                            {/* Dot indicator on the left timeline line */}
                            <div className={`absolute -left-[24px] top-4 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow bg-gradient-to-r ${m.color}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                            
                            <div className={`p-3.5 border rounded-2xl flex items-start gap-3 bg-white border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200`}>
                              <div className={`text-xl p-2 rounded-xl shrink-0 flex items-center justify-center select-none ${m.bgLight} border ${m.borderClass} shadow-inner`}>
                                {m.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${m.color}`}>
                                    {m.title}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded-md">
                                    Age {item.age}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed font-sans">
                                  {item.log}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (() => {
                  let currentMappingAge = 0;
                  return gameState.log.map((log, idx) => {
                    let isEvent = log.startsWith('❗');
                    let isOutcome = log.startsWith('✨');
                    let isChoice = log.includes('Selected:');
                    let isBirth = log.includes('👶') || log.includes('My mother');
                    let isAgeHeader = log.startsWith('🎂');

                    if (isAgeHeader) {
                      const match = log.match(/Age (\d+)/);
                      if (match) {
                        currentMappingAge = parseInt(match[1], 10);
                      }
                    }

                    const milestone = detectMilestone(log);
                    if (milestone) {
                      return (
                        <div 
                          key={idx} 
                          className={`p-3 border rounded-2xl flex items-start gap-3 my-2.5 transition-all shadow-sm ${milestone.bgLight}`}
                        >
                          <div className={`text-lg p-1.5 rounded-lg shrink-0 flex items-center justify-center select-none bg-white shadow-sm border ${milestone.borderClass}`}>
                            {milestone.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full text-white bg-gradient-to-r ${milestone.color}`}>
                                {milestone.title}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 font-medium">
                                Age {currentMappingAge}
                              </span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 mt-1 leading-relaxed">
                              {log}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    let textClass = 'text-slate-600';
                    let bgClass = 'py-0.5';

                    if (isEvent) {
                      textClass = 'text-indigo-900 font-extrabold border-l-2 border-indigo-600 pl-2';
                      bgClass = 'bg-indigo-50/50 py-1 px-1.5';
                    } else if (isOutcome) {
                      textClass = 'text-emerald-700 font-medium pl-2';
                      bgClass = 'bg-emerald-50/40 py-1';
                    } else if (isChoice) {
                      textClass = 'text-indigo-600 italic';
                    } else if (isBirth) {
                      textClass = 'text-slate-800 font-semibold';
                    } else if (isAgeHeader) {
                      textClass = 'text-indigo-950 font-bold border-b border-slate-100 pb-1 mt-2';
                      bgClass = 'pt-2';
                    }

                    return (
                      <div key={idx} className={`${textClass} ${bgClass} leading-relaxed break-words`}>
                        {log}
                      </div>
                    );
                  });
                })()}
                <div ref={logEndRef} />
              </motion.div>
            </div>
          )}

          {/* TAB 2: SCHOOL & CAREER */}
          {activeTab === 'school' && (
            <div className="p-4 space-y-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {gameState.age < 3 ? (
                    <Baby size={18} className="text-amber-500" />
                  ) : gameState.age < 6 ? (
                    <Smile size={18} className="text-amber-500" />
                  ) : (
                    <GraduationCap size={18} className="text-indigo-600" />
                  )}
                  <span className="text-sm font-black uppercase tracking-wider text-slate-800">
                    {gameState.age < 3 ? 'Infant Phase' : gameState.age < 6 ? 'Toddler Phase' : 'School & Career'}
                  </span>
                </div>
                <button 
                  onClick={() => { triggerSound('click'); setActiveTab('home'); }}
                  className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 rounded-full transition cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {gameState.age < 6 ? (
                /* INFANT / TODDLER ACTIONS CARD */
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-none text-center space-y-3 shrink-0">
                    <div className="text-4xl">🍼</div>
                    <h4 className="text-base font-black text-amber-900 uppercase tracking-wide">
                      {gameState.age < 3 ? '👶 Infant' : '🧸 Toddler'} {gameState.name}
                    </h4>
                    <p className="text-xs text-amber-800 font-medium">
                      You are currently an {gameState.age < 3 ? 'infant' : 'toddler'}! You spend your days exploring, sleeping, playing with toys, and babbling at your parents. Enjoy these sweet years before school starts at age 6!
                    </p>
                  </div>

                  <div className="space-y-2.5 flex-1 mt-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Development Activities</h3>
                    
                    <div className="grid grid-cols-1 gap-2.5 pb-6">
                      <button
                        onClick={handleInfantBabble}
                        className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-amber-500 hover:bg-amber-50/20 transition flex items-center justify-between group cursor-pointer"
                        id="infant-babble"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-all">💬</span>
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Giggle & Babble</span>
                            <span className="text-[10px] text-slate-400">Try speaking first words or giggling. Boosts Smarts.</span>
                          </div>
                        </div>
                        <span className="text-slate-300 font-mono">❯</span>
                      </button>

                      <button
                        onClick={handleInfantCry}
                        className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-amber-500 hover:bg-amber-50/20 transition flex items-center justify-between group cursor-pointer"
                        id="infant-cry"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-all">😭</span>
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Cry for Attention</span>
                            <span className="text-[10px] text-slate-400">Cry for cuddles or food. Results may vary!</span>
                          </div>
                        </div>
                        <span className="text-slate-300 font-mono">❯</span>
                      </button>

                      <button
                        onClick={handleInfantCuddle}
                        className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-amber-500 hover:bg-amber-50/20 transition flex items-center justify-between group cursor-pointer"
                        id="infant-cuddle"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-all">❤️</span>
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Cuddle Parents</span>
                            <span className="text-[10px] text-slate-400">Give mama or papa a hug. Boosts love and relationship trust.</span>
                          </div>
                        </div>
                        <span className="text-slate-300 font-mono">❯</span>
                      </button>

                      <button
                        onClick={handleInfantPlay}
                        className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-amber-500 hover:bg-amber-50/20 transition flex items-center justify-between group cursor-pointer"
                        id="infant-play"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-all">🧸</span>
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Play with Baby Toys</span>
                            <span className="text-[10px] text-slate-400">Squeeze rattles, stack blocks, or chew chew chew. Boosts Happiness & Smarts.</span>
                          </div>
                        </div>
                        <span className="text-slate-300 font-mono">❯</span>
                      </button>

                      <button
                        onClick={handleInfantNap}
                        className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-amber-500 hover:bg-amber-50/20 transition flex items-center justify-between group cursor-pointer"
                        id="infant-nap"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-all">💤</span>
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Nap on Parents' Lap</span>
                            <span className="text-[10px] text-slate-400">Rest your heavy baby head. Restores Health & Happiness.</span>
                          </div>
                        </div>
                        <span className="text-slate-300 font-mono">❯</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* SCHOOL & CAREER VIEW (FOR AGE >= 6) */
                gameState.career.type === 'school' ? (
                  /* EXCLUSIVE, HIGH-FIDELITY SCHOOL DASHBOARD */
                  <div className="space-y-4 flex-1 flex flex-col min-h-0">
                    {schoolSubView === 'main' && (
                      <div className="space-y-4 flex-1 flex flex-col">
                        {/* School Header Block */}
                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-none border border-indigo-950 shadow-sm relative overflow-hidden">
                          <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full filter blur-xl"></div>
                          <span className="text-[9px] font-mono font-black uppercase tracking-widest text-indigo-300 block">Current Education</span>
                          <h4 className="text-xl font-extrabold tracking-tight mt-1">
                            {gameState.flags.schoolType === 'private' ? "🏫 St. Jude's Private Academy" : "🏫 Public Comprehensive School"}
                          </h4>
                          <p className="text-xs text-indigo-200 mt-1.5 font-medium italic">
                            Currently enrolled as a full-time student
                          </p>

                          {/* Grades and Popularity bars */}
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                            <div>
                              <div className="flex justify-between text-[10px] font-bold text-indigo-200 mb-1">
                                <span className="flex items-center gap-1">📊 Academic Grades</span>
                                <span className="font-mono">{gameState.flags.schoolGrades || 80}%</span>
                              </div>
                              <div className="w-full bg-indigo-950 h-1.5 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${gameState.flags.schoolGrades || 80}%` }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] font-bold text-indigo-200 mb-1">
                                <span className="flex items-center gap-1">📣 School Popularity</span>
                                <span className="font-mono">{gameState.flags.schoolPopularity || 50}%</span>
                              </div>
                              <div className="w-full bg-indigo-950 h-1.5 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-pink-400 transition-all duration-300" style={{ width: `${gameState.flags.schoolPopularity || 50}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Activities List */}
                        <div className="space-y-2.5 flex-1 mt-2">
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">School Activities</h3>
                          
                          <div className="grid grid-cols-1 gap-2.5 pb-6">
                            {/* Ask Parents for Private School */}
                            {gameState.flags.schoolType !== 'private' && (
                              <button
                                onClick={handleAskPrivateSchool}
                                className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/10 transition flex items-center justify-between group cursor-pointer"
                                id="school-ask-private"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl group-hover:scale-110 transition-all">🎩</span>
                                  <div>
                                    <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Request Private Academy</span>
                                    <span className="text-[10px] text-slate-400">Beg your parents to pay for elite schooling</span>
                                  </div>
                                </div>
                                <span className="text-slate-300 font-mono">❯</span>
                              </button>
                            )}

                            {/* Classmates List */}
                            <button
                              onClick={() => { triggerSound('click'); setSchoolSubView('class'); }}
                              className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/10 transition flex items-center justify-between group cursor-pointer"
                              id="school-view-classmates"
                            >
                              <div className="flex items-center gap-3">
                                  <span className="text-2xl group-hover:scale-110 transition-all">👦</span>
                                  <div>
                                    <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Classmates</span>
                                    <span className="text-[10px] text-slate-400">View and interact with classmate relations</span>
                                  </div>
                                </div>
                                <span className="text-slate-300 font-mono">❯</span>
                            </button>

                            {/* Faculty Teachers */}
                            <button
                              onClick={() => { triggerSound('click'); setSchoolSubView('faculty'); }}
                              className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/10 transition flex items-center justify-between group cursor-pointer"
                              id="school-view-faculty"
                            >
                              <div className="flex items-center gap-3">
                                  <span className="text-2xl group-hover:scale-110 transition-all">👩‍🏫</span>
                                  <div>
                                    <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Faculty / Teachers</span>
                                    <span className="text-[10px] text-slate-400">Brown-nose teachers or pull rebellious pranks</span>
                                  </div>
                                </div>
                                <span className="text-slate-300 font-mono">❯</span>
                            </button>

                            {/* School Nurse */}
                            <button
                              onClick={() => { triggerSound('click'); setSchoolSubView('nurse'); }}
                              className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/10 transition flex items-center justify-between group cursor-pointer"
                              id="school-visit-nurse"
                            >
                              <div className="flex items-center gap-3">
                                  <span className="text-2xl group-hover:scale-110 transition-all">🏥</span>
                                  <div>
                                    <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Visit School Nurse</span>
                                    <span className="text-[10px] text-slate-400">Heal ailments or request unhinged diagnoses</span>
                                  </div>
                                </div>
                                <span className="text-slate-300 font-mono">❯</span>
                            </button>

                             {/* Study Harder */}
                             <button
                               onClick={handleStudy}
                               disabled={(gameState.flags.studiesThisYear || 0) >= 2}
                               className={`w-full text-left p-3.5 border transition flex items-center justify-between group ${
                                 (gameState.flags.studiesThisYear || 0) >= 2
                                   ? 'border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed'
                                   : 'border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/10 cursor-pointer'
                               }`}
                               id="school-study-harder"
                             >
                               <div className="flex items-center gap-3">
                                   <span className="text-2xl group-hover:scale-110 transition-all">📚</span>
                                   <div>
                                     <div className="flex items-center gap-2">
                                       <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">Study Harder</span>
                                       <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                         (gameState.flags.studiesThisYear || 0) >= 2 
                                           ? 'bg-rose-100 text-rose-700' 
                                           : 'bg-indigo-100 text-indigo-700'
                                       }`}>
                                         {gameState.flags.studiesThisYear || 0}/2 this year
                                       </span>
                                     </div>
                                     <span className="text-[10px] text-slate-400">
                                       {(gameState.flags.studiesThisYear || 0) >= 2
                                         ? "Your brain needs a rest! You've reached your studying limit for this year."
                                         : "Hit the books to boost your grades and intelligence"
                                       }
                                     </span>
                                   </div>
                                 </div>
                                 <span className="text-slate-300 font-mono">❯</span>
                             </button>

                            {/* Drop Out */}
                            <button
                              onClick={handleDropOut}
                              className="w-full text-left p-3.5 border border-rose-200 bg-rose-50/30 hover:border-rose-500 hover:bg-rose-50/50 transition flex items-center justify-between group cursor-pointer"
                              id="school-drop-out"
                            >
                              <div className="flex items-center gap-3">
                                  <span className="text-2xl group-hover:scale-110 transition-all text-rose-500">❌</span>
                                  <div>
                                    <span className="font-extrabold text-xs text-rose-900 block uppercase tracking-wide">Drop Out</span>
                                    <span className="text-[10px] text-rose-600/70">Reject formal education and live on the streets</span>
                                  </div>
                                </div>
                                <span className="text-rose-300 font-mono">❯</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {schoolSubView === 'class' && (
                      <div className="space-y-4 flex-1 flex flex-col">
                        {/* Subview Back Header */}
                        <div className="flex items-center justify-between bg-slate-50 p-3 border border-slate-200">
                          <button 
                            onClick={() => { triggerSound('click'); setSchoolSubView('main'); }}
                            className="flex items-center gap-1.5 text-xs font-black text-indigo-700 uppercase tracking-wider cursor-pointer animate-pulse"
                          >
                            <ArrowLeft size={16} />
                            <span>Back</span>
                          </button>
                          <span className="text-xs font-black text-slate-700 uppercase tracking-wide">My Classmates</span>
                        </div>

                        {/* Classmates Popularity card */}
                        <div className="bg-gradient-to-r from-pink-50 to-indigo-50 border border-indigo-100 p-4 rounded-none space-y-1">
                          <span className="text-[8px] font-mono font-black text-indigo-600 uppercase tracking-widest block">Class Social Scene</span>
                          <h4 className="text-sm font-black text-slate-900">Your standing among peers</h4>
                          <div className="pt-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                              <span>📣 Social Popularity</span>
                              <span className="font-mono">{gameState.flags.schoolPopularity || 50}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${gameState.flags.schoolPopularity || 50}%` }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Classmates List */}
                        <div className="space-y-2 flex-1 pb-6 overflow-y-auto pr-1">
                          {(Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation === 'classmate').length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-8">No classmates generated yet. Advance your age to populate your class!</p>
                          ) : (
                            (Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation === 'classmate').map((classmate) => {
                              return (
                                <button
                                  key={classmate.id}
                                  onClick={() => { triggerSound('click'); setSelectedRelationship(classmate); }}
                                  className="w-full text-left p-3 border border-slate-200 bg-white hover:border-indigo-600 transition flex items-center justify-between cursor-pointer"
                                  id={`classmate-${classmate.id}`}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-2xl select-none shrink-0">
                                      {classmate.gender === 'Female' ? '👧' : '👦'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-xs font-extrabold text-slate-900 truncate">
                                        {classmate.name}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[8px] font-mono text-slate-400 shrink-0 uppercase tracking-wider">Relationship</span>
                                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                                          <div 
                                            className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500" 
                                            style={{ width: `${classmate.trust}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-slate-300 font-bold ml-2">❯</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {schoolSubView === 'faculty' && (
                      <div className="space-y-4 flex-1 flex flex-col">
                        {/* Subview Back Header */}
                        <div className="flex items-center justify-between bg-slate-50 p-3 border border-slate-200">
                          <button 
                            onClick={() => { triggerSound('click'); setSchoolSubView('main'); }}
                            className="flex items-center gap-1.5 text-xs font-black text-indigo-700 uppercase tracking-wider cursor-pointer"
                          >
                            <ArrowLeft size={16} />
                            <span>Back</span>
                          </button>
                          <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Faculty / Teachers</span>
                        </div>

                        {/* Faculty list */}
                        <div className="space-y-2 flex-1 pb-6 overflow-y-auto pr-1">
                          {(Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation === 'teacher').length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-8">No teachers generated yet. Advance your age to hire school faculty!</p>
                          ) : (
                            (Object.values(gameState.npcs || {}) as any[]).filter(r => r.relation === 'teacher').map((teacher) => {
                              return (
                                <button
                                  key={teacher.id}
                                  onClick={() => { triggerSound('click'); setSelectedRelationship(teacher); }}
                                  className="w-full text-left p-3 border border-slate-200 bg-white hover:border-indigo-600 transition flex items-center justify-between cursor-pointer"
                                  id={`teacher-${teacher.id}`}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-2xl select-none shrink-0">
                                      {teacher.gender === 'Female' ? '👩‍🏫' : '👨‍🏫'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-xs font-extrabold text-slate-900 truncate">
                                        {teacher.name}
                                      </h4>
                                      <span className="text-[9px] text-slate-400 block mt-0.5 uppercase tracking-wide font-medium font-mono">
                                        {teacher.id === 'teacher1' ? 'Principal' : teacher.id === 'teacher2' ? 'Homeroom Advisor' : 'Subject Teacher'}
                                      </span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[8px] font-mono text-slate-400 shrink-0 uppercase tracking-wider">Teacher Trust</span>
                                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                                          <div 
                                            className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" 
                                            style={{ width: `${teacher.trust}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-slate-300 font-bold ml-2">❯</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {schoolSubView === 'nurse' && (
                      <div className="space-y-4 flex-1 flex flex-col">
                        {/* Subview Back Header */}
                        <div className="flex items-center justify-between bg-slate-50 p-3 border border-slate-200">
                          <button 
                            onClick={() => { triggerSound('click'); setSchoolSubView('main'); }}
                            className="flex items-center gap-1.5 text-xs font-black text-indigo-700 uppercase tracking-wider cursor-pointer"
                          >
                            <ArrowLeft size={16} />
                            <span>Back</span>
                          </button>
                          <span className="text-xs font-black text-slate-700 uppercase tracking-wide font-mono">School Nurse</span>
                        </div>

                        {/* Nurse Desk dialogue Card */}
                        <div className="bg-gradient-to-br from-rose-50 to-slate-50 border border-rose-100 p-5 rounded-none text-center space-y-3">
                          <div className="text-4xl animate-bounce">👩‍⚕️</div>
                          <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider font-mono">School Nurse's Desk</h4>
                          <p className="text-xs text-rose-900 leading-relaxed font-medium italic">
                            "Welcome to the School Nurse's Office, child. I have limited resources, some cough drops from 1998, and some rather unhinged philosophies on pain. What seems to be your ailment?"
                          </p>
                        </div>

                        {/* Nurse Treatment Options */}
                        <div className="space-y-2 flex-1 mt-2">
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Choose Your Symptom</h3>

                          <div className="grid grid-cols-1 gap-2.5 pb-6">
                            <button
                              onClick={() => handleVisitNurse('throat')}
                              className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-rose-500 hover:bg-rose-50/10 transition flex items-center justify-between group cursor-pointer"
                              id="nurse-throat"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl group-hover:scale-110 transition-all">👅</span>
                                <div>
                                  <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">"I have a terrible sore throat"</span>
                                  <span className="text-[10px] text-slate-400">Request a throat lozenge or cough drop</span>
                                </div>
                              </div>
                              <span className="text-rose-300 font-bold">❯</span>
                            </button>

                            <button
                              onClick={() => handleVisitNurse('heart')}
                              className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-rose-500 hover:bg-rose-50/10 transition flex items-center justify-between group cursor-pointer"
                              id="nurse-heart"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl group-hover:scale-110 transition-all">💔</span>
                                <div>
                                  <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">"My heart is completely broken"</span>
                                  <span className="text-[10px] text-slate-400">Ask the nurse for romantic therapy or advice</span>
                                </div>
                              </div>
                              <span className="text-rose-300 font-bold">❯</span>
                            </button>

                            <button
                              onClick={() => handleVisitNurse('stress')}
                              className="w-full text-left p-3.5 border border-slate-200 bg-white hover:border-rose-500 hover:bg-rose-50/10 transition flex items-center justify-between group cursor-pointer"
                              id="nurse-stress"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl group-hover:scale-110 transition-all">🤯</span>
                                <div>
                                  <span className="font-extrabold text-xs text-slate-900 block uppercase tracking-wide">"I am suffering from exam stress"</span>
                                  <span className="text-[10px] text-slate-400">Ask for her legendary secret stress-relief tea</span>
                                </div>
                              </div>
                              <span className="text-rose-300 font-bold">❯</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col min-h-0 relative">
                    {/* Adult Occupation Header */}
                    <div className="bg-[#0b4b8a] p-3 text-center border-b border-[#083a6c] shrink-0 text-white relative flex justify-center items-center">
                      {occupationSubView !== 'main' && (
                        <button 
                          onClick={() => { triggerSound('click'); setOccupationSubView('main'); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#083a6c] hover:bg-[#062b50] transition cursor-pointer"
                        >
                          <ChevronLeft size={18} />
                        </button>
                      )}
                      <h3 className="text-[15px] font-black tracking-wide uppercase">
                        {occupationSubView === 'main' ? 'Occupation' : occupationSubView === 'education' ? 'Education' : 'Jobs'}
                      </h3>
                    </div>

                    {/* Current Status Banner (only on main view) */}
                    {occupationSubView === 'main' && (
                      <div 
                        onClick={() => {
                          if (gameState.career.type === 'job') {
                            triggerSound('click');
                            setOccupationSubView('current_job');
                          }
                        }}
                        className={`bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between ${gameState.career.type === 'job' ? 'cursor-pointer hover:bg-slate-100 transition' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xl shadow-inner">
                            {gameState.career.type === 'job' ? '💼' : gameState.career.type === 'school' ? '🎓' : '💤'}
                          </div>
                          <div>
                            <h4 className="text-[14px] font-black text-[#1a6fb5] leading-tight">
                              {gameState.career.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {gameState.career.type === 'job' 
                                ? `$${gameState.career.salary.toLocaleString()} / year` 
                                : gameState.career.type === 'school' 
                                ? `${gameState.career.major || 'General Studies'}` 
                                : 'Unemployed'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {gameState.career.type === 'school' && gameState.career.title !== 'Primary School Student' && gameState.career.title !== 'High School Student' && gameState.career.title !== 'Infant' && (
                            <button onClick={(e) => { e.stopPropagation(); handleUniversityDropOut(); }} className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold rounded shadow-sm border border-rose-200 transition uppercase tracking-wider">Drop Out</button>
                          )}
                          {gameState.career.type === 'job' && (
                            <span className="text-[#1a6fb5]">›</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto pb-24">
                      {occupationSubView === 'main' && (
                        <div className="flex flex-col">
                          {/* EDUCATION */}
                          <button 
                            onClick={() => { triggerSound('click'); setOccupationSubView('education'); }}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <GraduationCap size={28} className="text-[#e63946] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Education</span>
                                <span className="text-[12px] text-[#4281a4]">Go back to school</span>
                              </div>
                            </div>
                            <ChevronRight className="text-[#2a6184]" size={20} />
                          </button>
                          
                          {/* FIGHT */}
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              setActiveFight({
                                opponentName: 'Random Thug',
                                opponentId: 'random_thug',
                                move: 'punch',
                                target: 'jaw'
                              });
                            }}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">🥊</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Fight</span>
                                <span className="text-[12px] text-[#4281a4]">Enter the fighter scene</span>
                              </div>
                            </div>
                            <ChevronRight className="text-[#2a6184]" size={20} />
                          </button>

                          {/* FREELANCE GIGS */}
                          <button 
                            onClick={() => { triggerSound('click'); setOccupationSubView('freelance'); }}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">🧢</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Freelance Gigs</span>
                                <span className="text-[12px] text-[#4281a4]">Make some quick money</span>
                              </div>
                            </div>
                            <ChevronRight className="text-[#2a6184]" size={20} />
                          </button>

                          {/* JOB RECRUITER */}
                          <button 
                            onClick={() => triggerSound('click')}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">📞</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Job Recruiter</span>
                                <span className="text-[12px] text-[#4281a4]">Visit the job recruiter</span>
                              </div>
                            </div>
                            <MoreHorizontal className="text-[#2a6184]" size={20} />
                          </button>

                          {/* JOBS */}
                          <button 
                            onClick={() => { triggerSound('click'); setOccupationSubView('jobs'); }}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">💵</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Jobs</span>
                                <span className="text-[12px] text-[#4281a4]">Browse full-time job listings</span>
                              </div>
                            </div>
                            <ChevronRight className="text-[#2a6184]" size={20} />
                          </button>

                          {!gameState.creatorCareer?.active && (
                            <button
                              onClick={handleStartCreatorCareer}
                              disabled={gameState.age < 18}
                              className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-2xl group-hover:scale-110 transition-transform">🎥</span>
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-[15px] text-[#0f4a8a]">Creator Career</span>
                                  <span className="text-[12px] text-[#4281a4]">{gameState.age >= 18 ? 'Start creating on CreatorPlatform' : 'Available at age 18'}</span>
                                </div>
                              </div>
                              <ChevronRight className="text-[#2a6184]" size={20} />
                            </button>
                          )}

                          {/* MILITARY */}
                          <button 
                            onClick={() => triggerSound('click')}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">🛡️</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Military</span>
                                <span className="text-[12px] text-[#4281a4]">Join the military</span>
                              </div>
                            </div>
                            <ChevronRight className="text-[#2a6184]" size={20} />
                          </button>
                        </div>
                      )}
                      
                      {occupationSubView === 'freelance' && (
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleFreelanceGig('escort')}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">💋</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Escort</span>
                                <span className="text-[12px] text-[#4281a4]">High cash gig, but risky</span>
                              </div>
                            </div>
                            <MoreHorizontal className="text-[#2a6184]" size={20} />
                          </button>
                          
                          <button
                            onClick={() => handleFreelanceGig('tutor')}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Tutor</span>
                                <span className="text-[12px] text-[#4281a4]">Tutor a local high schooler</span>
                              </div>
                            </div>
                            <MoreHorizontal className="text-[#2a6184]" size={20} />
                          </button>
                        </div>
                      )}

                      {occupationSubView === 'education' && (
                        <div className="flex flex-col">
                          {EDUCATION_OPTIONS.map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                triggerSound('click');
                                if (opt.id === 'university') {
                                  setShowUniversityModal(true);
                                } else {
                                  setActionPopup({ isOpen: true, title: 'Coming Soon', message: `${opt.name} logic is currently under development.` });
                                }
                              }}
                              className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer group"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-[15px] text-[#0f4a8a]">{opt.name}</span>
                                  <span className="text-[12px] text-[#4281a4]">{opt.subtitle}</span>
                                </div>
                              </div>
                              <MoreHorizontal className="text-[#2a6184]" size={20} />
                            </button>
                          ))}
                        </div>
                      )}


                      {occupationSubView === 'current_job' && gameState.career.type === 'job' && (
                        <div className="flex flex-col">
                          {gameState.creatorCareer?.active && gameState.creatorCareer.profile && (
                            <div className="p-4 border-b border-slate-200 space-y-3">
                              <div>
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Creator Career</span>
                                <span className="text-[12px] text-[#4281a4] block">{gameState.creatorCareer.profile.tier.replace('_', ' ')}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {(['anonymous', 'suggestive', 'explicit'] as CreatorContentStyle[]).map(style => (
                                  <button key={style} onClick={() => handleCreatorContentStyle(style)} className={`py-2 text-[10px] font-bold rounded border ${gameState.creatorCareer?.profile?.contentStyle === style ? 'bg-[#0f4a8a] text-white border-[#0f4a8a]' : 'bg-white text-[#0f4a8a] border-slate-200'}`}>{style}</button>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleCreatorAction('publishCount')} className="py-2 text-[11px] font-bold bg-slate-50 text-[#0f4a8a] border border-slate-200 rounded">Publish content ({gameState.creatorCareer.profile.yearlyActions.publishCount})</button>
                                <button onClick={() => handleCreatorAction('livestreamCount')} className="py-2 text-[11px] font-bold bg-slate-50 text-[#0f4a8a] border border-slate-200 rounded">Livestream ({gameState.creatorCareer.profile.yearlyActions.livestreamCount})</button>
                                <button onClick={() => handleCreatorAction('collaborationCount')} className="py-2 text-[11px] font-bold bg-slate-50 text-[#0f4a8a] border border-slate-200 rounded">Collaborate ({gameState.creatorCareer.profile.yearlyActions.collaborationCount})</button>
                                <button onClick={() => handleCreatorAction('promotionCount')} className="py-2 text-[11px] font-bold bg-slate-50 text-[#0f4a8a] border border-slate-200 rounded">Promote account ({gameState.creatorCareer.profile.yearlyActions.promotionCount})</button>
                                <button onClick={() => handleCreatorAction('privacyImprovementCount')} className="py-2 text-[11px] font-bold bg-slate-50 text-[#0f4a8a] border border-slate-200 rounded col-span-2">Improve privacy ({gameState.creatorCareer.profile.yearlyActions.privacyImprovementCount})</button>
                              </div>
                              <button onClick={handleResign} className="w-full py-2 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded">Leave Creator Career</button>
                            </div>
                          )}
                          {/* Job Profile Header */}
                          <button 
                            onClick={() => { triggerSound('click'); setShowJobDetailsModal(true); }}
                            className="w-full bg-[#c2c6cc] p-3 border-b-2 border-[#aab0b8] flex items-center gap-3 cursor-pointer hover:bg-[#b0b5bc] transition active:bg-[#9fa6b0]"
                          >
                            <div className="text-3xl drop-shadow-sm">💼</div>
                            <div className="flex-1 min-w-0 text-left">
                              <h3 className="font-black text-[#0f4a8a] text-lg tracking-tight leading-none truncate">{gameState.career.title}</h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[11px] font-bold text-[#5c728a]">Performance</span>
                                <div className="w-full bg-white/70 h-2 rounded-sm overflow-hidden border border-white flex-1 max-w-[120px]">
                                  <div 
                                    className="h-full bg-[#2da641]"
                                    style={{ width: `${gameState.career.performance}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="text-[#0f4a8a] text-xl font-black">•••</div>
                          </button>
                          
                          {/* Co-Workers */}
                          <button 
                            onClick={() => { triggerSound('click'); setActiveTab('relationships'); }}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">👥</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Co-Workers</span>
                                <span className="text-[12px] text-[#4281a4]">Interact with your team</span>
                              </div>
                            </div>
                            <span className="text-[#2a6184]">›</span>
                          </button>
                          
                          {/* Adjust Hours */}
                          <div className="w-full py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex flex-col group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <span className="text-2xl group-hover:scale-110 transition-transform">⏱️</span>
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-[15px] text-[#0f4a8a]">Adjust Hours</span>
                                  <span className="text-[12px] text-[#4281a4]">More hours = better performance</span>
                                </div>
                              </div>
                              <span className="font-bold text-[#0f4a8a] text-sm">{gameState.career.hoursPerWeek || 40} hr/wk</span>
                            </div>
                            <input 
                              type="range" 
                              min="30" 
                              max="70" 
                              step="2" 
                              value={gameState.career.hoursPerWeek || 40}
                              onChange={(e) => {
                                setGameState({
                                  ...gameState,
                                  career: { ...gameState.career, hoursPerWeek: parseInt(e.target.value) }
                                });
                              }}
                              className="w-full accent-[#0f4a8a] cursor-pointer" 
                            />
                            <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                              <span>30</span>
                              <span>Part-Time</span>
                              <span>Overtime</span>
                              <span>70</span>
                            </div>
                          </div>

                          {/* Work Harder */}
                          <button 
                            onClick={() => { 
                              triggerSound('click');
                              const workHarderCount = gameState.career.workHarderCount || 0;
                              
                              const nextStats = { ...gameState.stats };
                              nextStats.health = Math.max(0, nextStats.health - 2);
                              nextStats.happiness = Math.max(0, nextStats.happiness - 3);
                              nextStats.status = Math.min(100, nextStats.status + 1);
                              
                              // Performance only increases if worked harder less than 3 times
                              const performanceIncrease = workHarderCount < 3 ? 10 : 0;
                              const message = workHarderCount < 3 
                                ? `💪 You put in some extra effort at work today!`
                                : `💪 You stayed up late working, but you're so exhausted that it didn't improve your overall performance.`;

                              setGameState({
                                ...gameState,
                                stats: nextStats,
                                career: { 
                                  ...gameState.career, 
                                  performance: Math.min(100, (gameState.career.performance || 50) + performanceIncrease),
                                  workHarderCount: workHarderCount + 1
                                },
                                log: [...gameState.log, message]
                              });
                            }}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">💪</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Work Harder</span>
                                <span className="text-[12px] text-[#4281a4]">Put in some extra effort</span>
                              </div>
                            </div>
                            <span className="text-[#2a6184]">›</span>
                          </button>
                          
                          {/* Human Resources */}
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              setActionPopup({ isOpen: true, title: 'Human Resources', message: 'You have nothing to report right now.' });
                            }}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">📣</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Human Resources</span>
                                <span className="text-[12px] text-[#4281a4]">Report someone to HR</span>
                              </div>
                            </div>
                            <span className="text-[#2a6184]">›</span>
                          </button>
                          
                          {/* Resign */}
                          <button 
                            onClick={handleResign}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">👋</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Resign</span>
                                <span className="text-[12px] text-[#4281a4]">Tender your resignation</span>
                              </div>
                            </div>
                            <span className="text-[#2a6184]">›</span>
                          </button>
                          
                          {/* Retire */}
                          {gameState.age >= 60 && (
                            <button 
                              onClick={() => {
                                triggerSound('success');
                                const pension = Math.floor(gameState.career.salary * 0.4);
                                setGameState({
                                  ...gameState,
                                  career: { type: 'unemployed', title: 'Retired', salary: pension, yearsInRole: 0 },
                                  log: [...gameState.log, `👴 You retired from your job! You now collect a pension of $${pension.toLocaleString()}/yr.`]
                                });
                                setOccupationSubView('main');
                              }}
                              className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-2xl group-hover:scale-110 transition-transform">⛳</span>
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-[15px] text-[#0f4a8a]">Retire</span>
                                  <span className="text-[12px] text-[#4281a4]">Consider retirement</span>
                                </div>
                              </div>
                              <span className="text-[#2a6184]">›</span>
                            </button>
                          )}
                        </div>
                      )}
                      {occupationSubView === 'jobs' && (
                        <div className="flex flex-col">
                          {JOB_INTERVIEWS.map((job) => {
                            const canApply = gameState.age >= job.minAge;
                            return (
                              <button
                                key={job.title}
                                disabled={!canApply}
                                onClick={() => triggerInterview(job)}
                                className={`w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group ${!canApply ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-[15px] text-[#0f4a8a]">{job.title}</span>
                                  <span className="text-[12px] text-[#4281a4]">Salary: ${job.salary.toLocaleString()}/yr</span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">{job.req}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* University Apply Modal */}
                    {showUniversityModal && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#fdfaf6] w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border-2 border-[#e63946] flex flex-col relative">
                          <div className="bg-gradient-to-r from-[#d90429] to-[#ef233c] py-3 text-center relative">
                            <button onClick={() => setShowUniversityModal(false)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#d90429] font-black cursor-pointer shadow-sm">✕</button>
                            <span className="text-white font-black italic tracking-wider uppercase text-sm">Education</span>
                          </div>
                          <div className="p-6 flex flex-col items-center text-center gap-4">
                            <span className="text-3xl">🏛️</span>
                            <h3 className="text-2xl font-black text-slate-900">University</h3>
                            <p className="text-sm font-bold text-[#780000]">Apply to university today!</p>
                            
                            <div className="w-full text-left mt-2">
                              <label className="text-xs font-black text-[#003049] mb-1.5 block">Pick your major:</label>
                              <div className="relative">
                                <select 
                                  value={selectedMajor}
                                  onChange={(e) => setSelectedMajor(e.target.value)}
                                  className="w-full appearance-none bg-white border-2 border-[#003049] text-[#003049] text-sm font-bold py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#003049]/50 cursor-pointer"
                                >
                                  {MAJORS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-[#003049] text-white">
                                  <ChevronDown size={16} />
                                </div>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => handleApplyEducation('university', selectedMajor)}
                              className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-white font-black py-3 px-4 uppercase tracking-wider transition cursor-pointer shadow-md rounded-lg"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

                    {/* TAB 2.5: ASSETS - BitLife Style */}
          {activeTab === 'assets' && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#f4f3f0] relative">

              {/* ── Finances summary row ── */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#e6e2da] border-b border-[#ebdcb9] shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#fcd015]/30 flex items-center justify-center text-2xl shrink-0 border border-[#fcd015]/60 shadow-sm">💰</div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[13px] font-black text-[#5d4037]">Finances</p>
                  <p className="text-[11px] text-slate-500 font-semibold">Cash: ${gameState.cash.toLocaleString()}</p>
                </div>
                <span className="text-slate-400 text-lg font-bold">···</span>
              </div>

              {/* ── Subview Dispatcher ── */}
              {assetsSubView === 'main' && (
                <div className="flex-1 overflow-y-auto pb-24">
                  
                  {/* Category Lists */}
                  <div className="divide-y divide-[#ebdcb9] border-b border-[#ebdcb9] bg-white">
                    {/* Finances */}
                    <button 
                      onClick={() => setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'Finances & Bank accounts are coming soon in a future update!' })}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Finances</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Finances</span>
                        <span className="text-[10px] text-slate-400 block truncate">View your bank accounts and credit cards</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>

                    {/* Investments */}
                    <button 
                      onClick={() => setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'Investments and Stock Market trading are coming soon in a future update!' })}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Investments</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Investments</span>
                        <span className="text-[10px] text-slate-400 block truncate">Manage your investment portfolio</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>

                    {/* Luxury */}
                    <button 
                      onClick={() => setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'Luxury services and VIP chartering are coming soon!' })}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Luxury</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Luxury</span>
                        <span className="text-[10px] text-slate-400 block truncate">Enjoy the perks of being a VIP</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>
                  </div>

                  {/* PREMIUM ASSETS HEADER */}
                  <div className="bg-[#5d4037] text-white text-[9px] font-black text-center py-1 tracking-widest uppercase font-mono">
                    Premium Assets
                  </div>
                  <div className="divide-y divide-[#ebdcb9] border-b border-[#ebdcb9] bg-white">
                    {/* Auction Houses */}
                    <button 
                      onClick={() => setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'Participate in premium item auctions in a future update!' })}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Auction</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Auction Houses</span>
                        <span className="text-[10px] text-slate-400 block truncate">Purchase rare collectibles</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>

                    {/* Casino */}
                    <button 
                      onClick={() => setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'Start your own casino empire in a future update!' })}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Casino</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Casino</span>
                        <span className="text-[10px] text-slate-400 block truncate">Start your own casino</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>

                    {/* Museum */}
                    <button 
                      onClick={() => setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'Museum ownership is coming soon!' })}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Museum</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Museum</span>
                        <span className="text-[10px] text-slate-400 block truncate">Display your collectibles</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>

                    {/* Race Car Garage */}
                    <button 
                      onClick={() => setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'F1 Garages and vehicle custom tuning are coming soon!' })}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Race</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Race Car Garage</span>
                        <span className="text-[10px] text-slate-400 block truncate">Purchase a race car garage</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>

                    {/* Zoo */}
                    <button 
                      onClick={() => setActionPopup({ isOpen: true, title: 'Coming Soon', message: 'Build and customize a personal zoo soon!' })}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Zoo</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Zoo</span>
                        <span className="text-[10px] text-slate-400 block truncate">Purchase a zoo</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>
                  </div>

                  {/* COLLECTIBLES HEADER */}
                  <div className="bg-[#5d4037] text-white text-[9px] font-black text-center py-1 tracking-widest uppercase font-mono">
                    Collectibles
                  </div>
                  <div className="divide-y divide-[#ebdcb9] border-b border-[#ebdcb9] bg-white">
                    {/* Belongings */}
                    <button 
                      onClick={() => { triggerSound('click'); setAssetsSubView('possessions'); }}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Belongings</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Belongings</span>
                        <span className="text-[10px] text-slate-400 block truncate">View your possessions</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>
                  </div>

                  {/* MISC HEADER */}
                  <div className="bg-[#5d4037] text-white text-[9px] font-black text-center py-1 tracking-widest uppercase font-mono">
                    Misc.
                  </div>
                  <div className="divide-y divide-[#ebdcb9] border-b border-[#ebdcb9] bg-white">
                    {/* Go Shopping */}
                    <button 
                      onClick={() => {
                        triggerSound('click');
                        setAssetMarketFilter('all');
                        setShowShopModal(true);
                      }}
                      className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-2xl">Shopping</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-sm text-[#5d4037] block">Go Shopping...</span>
                        <span className="text-[10px] text-slate-400 block truncate">Purchase assets, vehicles, properties, or commodities</span>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>
                  </div>

                </div>
              )}

              {/* ── POSSESSIONS VIEW ── */}
              {assetsSubView === 'possessions' && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Back banner */}
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                    <button 
                      onClick={() => { triggerSound('click'); setAssetsSubView('main'); }}
                      className="text-xs font-black text-indigo-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-200 cursor-pointer"
                    >
                      ❮ Back
                    </button>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Belongings</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pb-24">
                    {(() => {
                      const getAssetEmoji = (type: string, name: string) => {
                        if (type === 'property') return '🏠';
                        if (type === 'vehicle') return '🚗';
                        if (type === 'accessory') return '💎';
                        if (type === 'gadget') return '📱';
                        if (type === 'toy') return '🧸';
                        return '🎒';
                      };

                      const getConditionPct = (cost: number) => {
                        return Math.min(95, 40 + Math.floor(Math.log(cost + 1) * 8));
                      };

                      const ownedItems = purchasedAssets.map(name => ASSETS_LIST.find(a => a.name === name)).filter(Boolean) as typeof ASSETS_LIST;

                      const properties   = ownedItems.filter(a => a.type === 'property');
                      const vehicles     = ownedItems.filter(a => a.type === 'vehicle');
                      const accessories  = ownedItems.filter(a => a.type === 'accessory');
                      const gadgets      = ownedItems.filter(a => a.type === 'gadget');
                      const everyday     = ownedItems.filter(a => a.type === 'everyday' || a.type === 'toy');

                      const ownedGroups = [
                        { label: 'Real Estate',   items: properties },
                        { label: 'Vehicles',       items: vehicles },
                        { label: 'Accessories',    items: accessories },
                        { label: 'Gadgets & Tech', items: gadgets },
                        { label: 'Possessions',    items: everyday },
                      ].filter(g => g.items.length > 0);

                      if (ownedGroups.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                            <div className="text-4xl mb-3">🎒</div>
                            <p className="text-sm font-bold text-slate-600">Nothing owned yet</p>
                            <p className="text-[11px] text-slate-400 mt-1">Go to the marketplace and buy something!</p>
                          </div>
                        );
                      }

                      return ownedGroups.map(group => (
                        <div key={group.label}>
                          <div className="bg-[#4a4a4a] text-white text-[10px] font-bold text-center py-1 tracking-wider uppercase font-mono">
                            {group.label}
                          </div>
                          <div className="divide-y divide-slate-100 bg-white">
                            {group.items.map(asset => {
                              const condPct = getConditionPct(asset.cost);
                              return (
                                <div key={asset.id} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition cursor-pointer">
                                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                                    {getAssetEmoji(asset.type, asset.name)}
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <p className="text-[13px] font-bold text-[#1a6fb5] leading-tight">{asset.name}</p>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <span className="text-[10px] text-slate-400 font-medium">Condition</span>
                                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${condPct}%` }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* ── SOCIAL CHANNEL DASHBOARD ── */}
              {assetsSubView === 'social_channel_dashboard' && selectedSocialChannel && gameState.socialMedia?.[selectedSocialChannel] && (
                (() => {
                  const channel = selectedSocialChannel;
                  const data = gameState.socialMedia[channel];
                  const emojis = {
                    facebook: '📘', instagram: '📸', onlyfans: '🍑', tiktok: '🎵',
                    twitch: '🔮', twitter: '🐦', soundcloud: '☁️', podcast: '🎙️', youtube: '🎥'
                  };
                  const titles = {
                    facebook: 'Facebook', instagram: 'Instagram', onlyfans: 'OnlyFans', tiktok: 'TikTok',
                    twitch: 'Twitch', twitter: 'Twitter', soundcloud: 'SoundCloud', podcast: 'Podcast', youtube: 'YouTube'
                  };

                  const handleVerifyRequest = () => {
                    triggerSound('click');
                    // Requirements: > 50,000 followers and high status
                    if (data.followers >= 50000 && gameState.stats.status >= 70) {
                      triggerSound('success');
                      setGameState({
                        ...gameState,
                        socialMedia: {
                          ...gameState.socialMedia,
                          [channel]: { ...data, verified: true }
                        },
                        log: [...gameState.log, `✔️ Verification Approved! Your ${titles[channel]} account is now officially verified.`]
                      });
                      setActionPopup({ isOpen: true, title: 'Verification Approved', message: `Congratulations! The moderators verified your account! You now have a verified badge next to your profile.` });
                    } else {
                      triggerSound('error');
                      setShowVerifyRejection(true);
                    }
                  };

                  const handlePromoteProduct = () => {
                    triggerSound('click');
                    if (data.followers < 5000) {
                      setActionPopup({ isOpen: true, title: 'Not Famous Enough', message: 'You need at least 5,000 followers to promote products.' });
                      return;
                    }
                    triggerSound('success');
                    const payment = Math.min(5000, Math.floor(data.followers * 0.05));
                    const lostFollowers = Math.floor(data.followers * 0.02);
                    
                    setGameState({
                      ...gameState,
                      cash: gameState.cash + payment,
                      socialMedia: {
                        ...gameState.socialMedia,
                        [channel]: { ...data, followers: Math.max(0, data.followers - lostFollowers) }
                      },
                      log: [...gameState.log, `📈 Sponsored Promotion: Promoted a product on ${titles[channel]} and earned $${payment.toLocaleString()}. Lost ${lostFollowers.toLocaleString()} followers due to commercializing.`]
                    });

                    setActionPopup({ 
                      isOpen: true, 
                      title: 'Promotion Complete', 
                      message: `You promoted a sponsored product!\n\nEarnings: +$${payment.toLocaleString()}\nFollower Change: -${lostFollowers.toLocaleString()} (fans hate ads!)`
                    });
                  };

                  return (
                    <div className="flex-grow flex flex-col min-h-0 bg-[#f4f3f0]">
                      {/* Header banner */}
                      <div className="bg-[#0f4a8a] text-white py-3 px-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { triggerSound('click'); setAssetsSubView('social_media'); }}
                            className="text-xs font-black bg-white/20 hover:bg-white/30 px-3 py-1 rounded cursor-pointer transition"
                          >
                            ❮ Back
                          </button>
                          <span className="font-extrabold text-sm tracking-wider uppercase">{titles[channel]}</span>
                        </div>
                        <span className="text-[10px] font-bold opacity-80">v3.24a</span>
                      </div>

                      {/* Profile Banner */}
                      <div className="bg-white border-b border-[#ebdcb9] p-4 text-left flex items-center gap-4 shrink-0">
                        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-3xl shadow-sm border border-slate-200 shrink-0">
                          {emojis[channel]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-[#0f4a8a] text-base leading-tight flex items-center gap-1.5">
                            {titles[channel]} Account
                            {data.verified && <span className="text-sky-500 text-sm" title="Verified">✔️</span>}
                          </h4>
                          <p className="text-xs font-bold text-slate-500 mt-1">{(data.followers || 0).toLocaleString()} followers</p>
                        </div>
                      </div>

                      {/* 18+ Risk Indicators */}
                      <div className="bg-amber-50/50 border-b border-[#ebdcb9] px-4 py-3.5 text-left space-y-2 shrink-0">
                        <div>
                          <div className="flex justify-between items-center text-xs font-extrabold text-slate-700 mb-1">
                            <span className="flex items-center gap-1">⚡ Creative Stress</span>
                            <span className="font-mono">{(gameState.flags.stress !== undefined ? gameState.flags.stress : 10)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rose-600 transition-all duration-300" 
                              style={{ width: `${(gameState.flags.stress !== undefined ? gameState.flags.stress : 10)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-xs font-extrabold text-slate-700 mb-1">
                            <span className="flex items-center gap-1">🔒 Leak Risk</span>
                            <span className="font-mono">{(gameState.flags.leakRisk || 0)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 transition-all duration-300" 
                              style={{ width: `${(gameState.flags.leakRisk || 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>


                      {/* Activities Header */}
                      <div className="bg-[#5d4037] text-white text-[9px] font-black text-center py-1 tracking-widest uppercase font-mono shrink-0">
                        Activities
                      </div>

                      {/* List of actions */}
                      <div className="flex-1 overflow-y-auto divide-y divide-[#ebdcb9] bg-white border-b border-[#ebdcb9] text-left pb-24">
                        
                        {/* Celebrity Interaction */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            setSelectedCelebrity('Taylor Swift');
                            setCelebrityInteractionType('reply');
                            setActiveSocialModal('celebrity');
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">⭐</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Celebrity</span>
                            <span className="text-[10px] text-slate-400 block truncate">Reply to a celebrity</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Delete Account */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            if (window.confirm(`Are you sure you want to permanently delete your ${titles[channel]} account?`)) {
                              setGameState({
                                ...gameState,
                                socialMedia: {
                                  ...gameState.socialMedia,
                                  [channel]: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 }
                                },
                                log: [...gameState.log, `❌ Closed your ${titles[channel]} account.`]
                              });
                              setAssetsSubView('social_media');
                            }
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">🗑️</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-red-600 block">Delete</span>
                            <span className="text-[10px] text-slate-400 block truncate font-mono">Delete your account</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Post Content */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            const defaultPostTypes = {
                              facebook: 'Selfie', instagram: 'Selfie', onlyfans: 'Thirst Trap',
                              tiktok: 'Dance Trend', twitch: 'Gaming Stream', twitter: 'Meme',
                              soundcloud: 'Original Track', podcast: 'Solo Rant', youtube: 'Vlog'
                            };
                            setSelectedPostType(defaultPostTypes[channel] || 'Selfie');
                            setActiveSocialModal('post');
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">✍️</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Post</span>
                            <span className="text-[10px] text-slate-400 block truncate">Make a post</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Promote Product */}
                        <button 
                          onClick={handlePromoteProduct}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">📈</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Promote</span>
                            <span className="text-[10px] text-slate-400 block truncate">Promote a product</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Troll */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            // Pick first available relative/friend, otherwise fallback to celebrity
                            const contacts = (Object.values(gameState.npcs || {}) as any[]).filter(r => !r.isDeceased);
                            if (contacts.length > 0) {
                              setSelectedVictim(contacts[0].name);
                            } else {
                              setSelectedVictim('Taylor Swift');
                            }
                            setActiveSocialModal('troll');
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">👹</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Troll</span>
                            <span className="text-[10px] text-slate-400 block truncate">Troll someone</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Verify Request */}
                        <button 
                          onClick={handleVerifyRequest}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">✔️</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Verify</span>
                            <span className="text-[10px] text-slate-400 block truncate">Request verification</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                      </div>

                    </div>
                  );
                })()
              )}

              {/* ── SOCIAL MEDIA VIEW ── */}
              {assetsSubView === 'social_media' && (
                <div className="flex-1 flex flex-col min-h-0 bg-white">
                  {/* Header */}
                  <div className="bg-[#0f4a8a] text-white py-3 px-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { triggerSound('click'); setAssetsSubView('main'); }}
                        className="text-xs font-black bg-white/20 hover:bg-white/30 px-3 py-1 rounded cursor-pointer transition"
                      >
                        ❮ Back
                      </button>
                      <span className="font-extrabold text-sm tracking-wider uppercase">Social Media</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-80">v3.24a</span>
                  </div>

                  <div className="flex-1 overflow-y-auto pb-24">
                    {(() => {
                      const channels = [
                        { id: 'facebook', name: 'Facebook', emoji: '📘', desc: 'Connect with family and friends' },
                        { id: 'instagram', name: 'Instagram', emoji: '📸', desc: 'Share photos and aesthetic stories' },
                        { id: 'onlyfans', name: 'OnlyFans', emoji: '🍑', desc: 'Adult subscription channel' },
                        { id: 'tiktok', name: 'TikTok', emoji: '🎵', desc: 'Upload short, viral video clips' },
                        { id: 'twitch', name: 'Twitch', emoji: '🔮', desc: 'Live stream games and chats' },
                        { id: 'twitter', name: 'Twitter', emoji: '🐦', desc: 'Share unhinged thoughts and arguments' },
                        { id: 'soundcloud', name: 'SoundCloud', emoji: '☁️', desc: 'Share your self-produced music tracks' },
                        { id: 'podcast', name: 'Podcast', emoji: '🎙️', desc: 'Start your own podcast channel' },
                        { id: 'youtube', name: 'YouTube', emoji: '🎥', desc: 'Create vlogs, reviews, and video content' }
                      ];

                      const activeList = channels.filter(c => gameState.socialMedia?.[c.id]?.signedUp);
                      const inactiveList = channels.filter(c => !gameState.socialMedia?.[c.id]?.signedUp);

                      const renderChannelItem = (c: typeof channels[0], active: boolean) => {
                        const data = gameState.socialMedia?.[c.id];
                        const subtext = active 
                          ? `${(data?.followers || 0).toLocaleString()} Followers${data?.verified ? ' • Verified' : ''}`
                          : `Sign up for ${c.name}`;

                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              triggerSound('click');
                              if (active) {
                                setSelectedSocialChannel(c.id);
                                setAssetsSubView('social_channel_dashboard');
                              } else {
                                // Sign up flow
                                setGameState({
                                  ...gameState,
                                  socialMedia: {
                                    ...gameState.socialMedia,
                                    [c.id]: { signedUp: true, followers: 10, verified: false, suspended: false, postsCount: 0, subscribers: 0, subscriptionPrice: 10 }
                                  },
                                  log: [...gameState.log, `📱 Signed up for ${c.name}! Let's post some content.`]
                                });
                                setActionPopup({ isOpen: true, title: 'Account Created', message: `You have successfully signed up for ${c.name}!` });
                              }
                            }}
                            className="w-full text-left p-3.5 hover:bg-slate-50 transition border-b border-slate-100 flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{c.emoji}</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-sm text-[#0f4a8a]">{c.name}</span>
                                <span className="text-[11px] text-slate-400 font-semibold">{subtext}</span>
                              </div>
                            </div>
                            <span className="text-[#0f4a8a] text-xs font-bold font-mono">❯</span>
                          </button>
                        );
                      };

                      return (
                        <div className="flex flex-col">
                          {activeList.length > 0 && (
                            <>
                              <div className="bg-[#4281a4] text-white text-[9px] font-bold text-center py-1 tracking-widest uppercase font-mono">
                                Active Channels
                              </div>
                              <div className="bg-white">
                                {activeList.map(c => renderChannelItem(c, true))}
                              </div>
                            </>
                          )}

                          {inactiveList.length > 0 && (
                            <>
                              <div className="bg-slate-200 text-slate-600 text-[9px] font-bold text-center py-1 tracking-widest uppercase font-mono">
                                Inactive Channels
                              </div>
                              <div className="bg-white">
                                {inactiveList.map(c => renderChannelItem(c, false))}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ── Fixed bottom "Social Media" button (only in main Assets screen) ── */}
              {assetsSubView === 'main' && (
                <div className="absolute bottom-0 left-0 right-0">
                  <button
                    onClick={() => {
                      triggerSound('click');
                      if (gameState.age < 13) {
                        setActionPopup({ isOpen: true, title: 'Too Young', message: 'You must be at least 13 years old to use social media.' });
                        return;
                      }
                      setAssetsSubView('social_media');
                    }}
                    className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold text-[15px] py-4 flex items-center justify-center gap-3 transition cursor-pointer border-t border-[#00acc1]"
                    id="go-shopping-btn"
                  >
                    <span className="text-xl">📱</span> Social Media
                  </button>
                </div>
              )}

              {/* ── Shop Modal overlay ── */}
              {showShopModal && (
                <div className="absolute inset-0 bg-white z-40 flex flex-col">
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shrink-0">
                    <div>
                      <h3 className="text-[14px] font-black text-slate-800">Marketplace</h3>
                      <p className="text-[10px] text-slate-400">Balance: <span className="font-bold text-emerald-600">${gameState.cash.toLocaleString()}</span> · Age {gameState.age}</p>
                    </div>
                    <button
                      onClick={() => { triggerSound('click'); setShowShopModal(false); }}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer text-sm font-bold"
                    >✕</button>
                  </div>

                  {/* Category pills */}
                  <div className="flex gap-1.5 px-3 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto shrink-0">
                    {[
                      { label: 'All',     filter: 'all' as const },
                      { label: '🧸 Youth', filter: 'youth' as const },
                      { label: '📱 Tech',  filter: 'gear' as const },
                      { label: '🏠 Estates', filter: 'estates' as const },
                    ].map(cat => (
                      <button
                        key={cat.filter}
                        onClick={() => { triggerSound('click'); setAssetMarketFilter(cat.filter); }}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                          assetMarketFilter === cat.filter
                            ? 'bg-[#00bcd4] text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Marketplace Items Scroll List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                    {displayedMarketAssets.length === 0 ? (
                      <div className="text-center text-slate-400 py-10 font-bold text-xs uppercase">No items in this category for your age</div>
                    ) : (
                      displayedMarketAssets.map(asset => {
                        const isMinor = gameState.age < 12;
                        const isOwned = purchasedAssets.includes(asset.name);
                        const canAfford = gameState.cash >= asset.cost;
                        const canAction = !isOwned && (isMinor || canAfford);

                        const getEmoji = (type: string, name: string) => {
                          if (type === 'property') return '🏠';
                          if (type === 'vehicle') return '🚗';
                          if (type === 'accessory') return name.toLowerCase().includes('watch') ? '⌚' : '👕';
                          if (type === 'gadget') return name.toLowerCase().includes('phone') ? '📱' : '🎮';
                          if (type === 'toy') return name.toLowerCase().includes('comic') ? '📚' : '🧸';
                          return '☕';
                        };

                        return (
                          <div 
                            key={asset.id} 
                            className="bg-white border border-slate-200 p-3 flex justify-between items-center rounded-xl shadow-xs"
                          >
                            <div className="text-left flex-1 min-w-0 pr-2">
                              <h4 className="font-extrabold text-[13px] text-slate-800 flex items-center gap-1">
                                <span className="text-sm">{getEmoji(asset.type, asset.name)}</span> {asset.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{asset.desc}</p>
                              <div className="flex gap-2 mt-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                <span>+{asset.style} Style</span>
                                <span>+{asset.status} Status</span>
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className="font-mono text-xs font-bold text-emerald-700 block mb-1.5">${asset.cost.toLocaleString()}</span>
                              <button
                                disabled={!canAction}
                                onClick={() => {
                                  triggerSound('click');
                                  if (isMinor) {
                                    handleAskParentsToBuy(asset);
                                  } else {
                                    handleBuyAsset(asset);
                                  }
                                }}
                                className={`px-3 py-1 text-[10px] font-black transition rounded-lg uppercase tracking-wider cursor-pointer ${
                                  isOwned 
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                                    : canAction 
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs' 
                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}
                                id={`buy-${asset.id}`}
                              >
                                {isOwned ? '✓ Owned' : isMinor ? 'Ask Parents' : 'Buy'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

            </div>
          )}


          {activeTab === 'relationships' && (
            <div className="p-4 space-y-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-pink-500" />
                  <span className="text-sm font-black uppercase tracking-wider text-slate-800">My Relationships</span>
                </div>
                <button 
                  onClick={() => { triggerSound('click'); setActiveTab('home'); }}
                  className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 rounded-full transition cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
              
              {/* Categorized Relationships List */}
              <div className="space-y-4">
                {(() => {
                  const getRelationshipEmoji = (rel: Relationship) => {
                    if (rel.isDeceased) return '💀';
                    if (rel.relation === 'pet') return '🐕';
                    if (rel.relation === 'parent') {
                      if (rel.gender === 'Male') return rel.age > 65 ? '👴' : '👨';
                      return rel.age > 65 ? '👵' : '👩';
                    }
                    if (rel.relation === 'partner' || rel.relation === 'spouse') {
                      return rel.gender === 'Male' ? '🤵' : '👰';
                    }
                    if (['sibling', 'cousin'].includes(rel.relation)) {
                      return rel.gender === 'Male' ? '👦' : '👧';
                    }
                    if (['friend', 'best_friend', 'affair', 'rival', 'mentor'].includes(rel.relation)) {
                      return rel.gender === 'Male' ? '🧑' : '👩';
                    }
                    return '👤';
                  };

                  const getBarColor = (score: number) => {
                    if (score > 70) return 'bg-[#2ecc71]'; // BitLife bright green
                    if (score > 35) return 'bg-[#f1c40f]'; // Yellow/Orange
                    return 'bg-[#e74c3c]'; // Red
                  };

                  const renderRelItem = (rel: Relationship, showBar: boolean = true) => {
                    const relScore = Math.max(0, Math.min(100, Math.floor(rel.trust - (rel.suspicion + rel.resentment) / 2)));
                    return (
                      <div 
                        key={rel.id} 
                        onClick={() => { triggerSound('click'); setSelectedRelationship(rel); }}
                        className="flex items-center gap-4 py-3 px-4 border-b border-slate-300 bg-white hover:bg-slate-50 transition cursor-pointer"
                      >
                        <div className="text-4xl shrink-0 drop-shadow-sm">
                          {getRelationshipEmoji(rel)}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-baseline gap-1 truncate">
                            <span className="font-extrabold text-[15px] text-[#0f4a8a] truncate">{rel.name}</span>
                            <span className="text-[14px] text-[#4281a4] capitalize">
                              ({rel.isEx ? `Ex-${rel.relation}` : rel.relation})
                            </span>
                          </div>
                          
                          {rel.isDeceased ? (
                            <p className="text-[13px] text-[#4281a4] mt-0.5">
                              Died {rel.yearsDeceased || 1} years ago
                            </p>
                          ) : showBar ? (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[12px] text-[#4281a4]">Relationship</span>
                              <div className="w-24 bg-slate-200 h-2.5 rounded-sm overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${getBarColor(relScore)}`} style={{ width: `${relScore}%` }}></div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        {rel.isDeceased ? (
                          <MoreHorizontal className="text-[#0f4a8a] shrink-0" size={24} strokeWidth={3} />
                        ) : (
                          <ChevronRight className="text-[#0f4a8a] shrink-0" size={24} strokeWidth={2.5} />
                        )}
                      </div>
                    );
                  };

                  if (showExes) {
                    const exes = (Object.values(gameState.npcs || {}) as any[]).filter(r => r.isEx);
                    return (
                      <div className="space-y-0 pb-6 -mt-4">
                        <div className="flex items-center justify-between bg-[#0f4a8a] text-white p-3 cursor-pointer select-none" onClick={() => { triggerSound('click'); setShowExes(false); }}>
                          <div className="flex items-center gap-2">
                            <ChevronLeft size={24} strokeWidth={3} />
                          </div>
                          <span className="font-black uppercase tracking-widest text-sm absolute left-1/2 -translate-x-1/2">EXES</span>
                          <div className="w-6"></div> {/* Spacer for centering */}
                        </div>
                        {exes.length === 0 ? (
                          <div className="text-center p-8 text-slate-400 font-bold bg-slate-100 h-64 flex items-center justify-center">You don't have any exes.</div>
                        ) : (
                          <div className="bg-white">
                            {exes.map(ex => renderRelItem(ex, true))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const activeRels = (Object.values(gameState.npcs || {}) as any[]).filter(r => !r.isDeceased && !r.isEx);
                  const deceasedRels = (Object.values(gameState.npcs || {}) as any[]).filter(r => r.isDeceased);
                  
                  const family = activeRels.filter(r => ['parent', 'sibling', 'cousin'].includes(r.relation));
                  const friends = activeRels.filter(r => ['friend', 'best_friend', 'pet'].includes(r.relation));
                  const love = activeRels.filter(r => ['partner', 'spouse', 'affair'].includes(r.relation));
                  const exesCount = (Object.values(gameState.npcs || {}) as any[]).filter(r => r.isEx).length;

                  const groups = [
                    { title: 'Family', list: family, key: 'family' },
                    { title: 'Friends', list: friends, key: 'friends' },
                    { title: 'Love', list: love, key: 'love', showExesButton: true },
                    { title: 'Late Relationships', list: deceasedRels, key: 'late' }
                  ];

                  return (
                    <div className="pb-6 -mx-4 -mt-4 bg-[#e9eef2] min-h-screen">
                      {groups.map(group => {
                        if (group.list.length === 0 && !group.showExesButton) return null;
                        return (
                          <div key={group.key} className="mb-4">
                            {/* Section Header */}
                            <div className="bg-[#788896] text-white text-[12px] font-bold py-1 px-3 text-center">
                              {group.title}
                            </div>

                            {/* Section Items */}
                            <div className="bg-white">
                              {group.showExesButton && (
                                <button 
                                  onClick={() => { triggerSound('click'); setShowExes(true); }}
                                  className="w-full flex items-center gap-4 py-3 px-4 border-b border-slate-300 hover:bg-slate-50 transition cursor-pointer text-left"
                                >
                                  <div className="text-4xl shrink-0 drop-shadow-sm">💔</div>
                                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <span className="font-extrabold text-[15px] text-[#0f4a8a]">Exes</span>
                                    <span className="text-[13px] text-[#4281a4]">View your exes</span>
                                  </div>
                                  <ChevronRight className="text-[#0f4a8a] shrink-0" size={24} strokeWidth={2.5} />
                                </button>
                              )}
                              
                              {group.list.map(rel => renderRelItem(rel, group.key !== 'late'))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* RELATIONSHIP INTERACTIVE MODAL */}
              {selectedRelationship && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 flex items-center justify-center p-4">
                  <div className="bg-[#fffdf9] border-4 border-[#8d6e63] shadow-2xl w-full max-w-sm rounded-[1.5rem] overflow-hidden flex flex-col max-h-[90%] font-sans animate-scale-up">
                    
                    {/* Header: Color themed on relation */}
                    <div className={`p-4 text-white relative shrink-0 ${
                      selectedRelationship.relation === 'partner' 
                        ? 'bg-gradient-to-r from-rose-600 to-pink-500' 
                        : selectedRelationship.relation === 'parent' 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-500' 
                        : selectedRelationship.relation === 'sibling' 
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-500' 
                        : 'bg-gradient-to-r from-[#8d6e63] to-[#a1887f]'
                    }`}>
                      <button 
                        onClick={() => setSelectedRelationship(null)}
                        className="absolute top-2 right-3 text-white/80 hover:text-white text-sm font-black z-10"
                      >
                        ✕
                      </button>
                      
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-3xl border-2 border-white/50 shadow-md">
                          {(() => {
                            const rel = selectedRelationship;
                            if (rel.relation === 'parent') {
                              if (rel.gender === 'Male') return rel.age > 65 ? '👴' : '👨';
                              return rel.age > 65 ? '👵' : '👩';
                            }
                            if (rel.relation === 'partner') {
                              return rel.gender === 'Male' ? '🤵' : '👰';
                            }
                            if (rel.relation === 'sibling') {
                              return rel.gender === 'Male' ? '👦' : '👧';
                            }
                            if (rel.relation === 'friend') {
                              return rel.gender === 'Male' ? '🧑' : '👩';
                            }
                            return '👤';
                          })()}
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-2 text-left">
                          <h4 className="font-black text-lg tracking-tight leading-tight truncate">{selectedRelationship.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1 mb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-white/25 px-2 py-0.5 rounded-full inline-block">
                              {selectedRelationship.relation}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest bg-white/25 px-2 py-0.5 rounded-full inline-block">
                              {selectedRelationship.age} YRS
                            </span>
                          </div>
                          
                          <div className="text-[10px] font-semibold leading-snug opacity-90 truncate capitalize">
                            💼 {selectedRelationship.occupation || 'Unemployed'}
                          </div>
                          <div className="text-[10px] font-semibold leading-snug opacity-90 truncate capitalize mt-0.5">
                            🎭 {selectedRelationship.archetype}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 flex-1 overflow-y-auto space-y-4">
                      
                      {/* Stats Section */}
                      <div className="space-y-2.5 bg-[#fcf8f2] border border-[#f0e4d0] p-3 rounded-xl">
                        <h5 className="text-center font-bold text-[10px] text-[#5d4037] border-b border-[#ebdcb9] pb-1 mb-2 uppercase tracking-wide">📊 Stats</h5>
                        
                        {/* Overall Relation Bar */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                            <span>Relationship</span>
                            <span>{Math.max(0, Math.min(100, Math.floor(selectedRelationship.trust - (selectedRelationship.suspicion + selectedRelationship.resentment)/2)))}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${(() => {
                                const score = Math.max(0, Math.min(100, Math.floor(selectedRelationship.trust - (selectedRelationship.suspicion + selectedRelationship.resentment)/2)));
                                if (score > 70) return 'bg-emerald-500';
                                if (score > 35) return 'bg-amber-500';
                                return 'bg-rose-500';
                              })()}`} 
                              style={{ width: `${Math.max(0, Math.min(100, selectedRelationship.trust - (selectedRelationship.suspicion + selectedRelationship.resentment)/2))}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Trust Bar */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                            <span>Trust & Respect</span>
                            <span>{selectedRelationship.trust}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${selectedRelationship.trust}%` }}></div>
                          </div>
                        </div>

                        {/* Suspicion Bar */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                            <span>Suspicion</span>
                            <span>{selectedRelationship.suspicion}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${selectedRelationship.suspicion}%` }}></div>
                          </div>
                        </div>

                        {/* Resentment Bar */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                            <span>Resentment</span>
                            <span>{selectedRelationship.resentment}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${selectedRelationship.resentment}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Actions vertical list */}
                      <div className="space-y-1.5">
                        <h5 className="text-[9px] uppercase tracking-widest font-bold text-slate-400 font-mono">Select Action</h5>
                        <div className="border border-[#ebdcb9] rounded-xl overflow-hidden divide-y divide-[#ebdcb9] bg-white shadow-xs">
                          
                          {/* Spend Time */}
                          <button 
                            onClick={() => interactSpendTime(selectedRelationship)}
                            className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                            id="rel-spend-time"
                          >
                            <span className="text-lg">🕒</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-xs text-[#5d4037] block">Spend Time</span>
                              <span className="text-[9px] text-slate-400 block truncate">Hang out and bond together</span>
                            </div>
                            <span className="text-slate-300 font-bold">❯</span>
                          </button>

                          {/* Conversation */}
                          <button 
                            onClick={() => interactChat(selectedRelationship)}
                            className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                            id="rel-chat"
                          >
                            <span className="text-lg">💬</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-xs text-[#5d4037] block">Conversation</span>
                              <span className="text-[9px] text-slate-400 block truncate">Have a friendly and meaningful chat</span>
                            </div>
                            <span className="text-slate-300 font-bold">❯</span>
                          </button>

                          {/* Compliment */}
                          <button 
                            onClick={() => interactCompliment(selectedRelationship)}
                            className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                            id="rel-compliment"
                          >
                            <span className="text-lg">🥰</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-xs text-[#5d4037] block">Compliment Them</span>
                              <span className="text-[9px] text-slate-400 block truncate">Pay a heartfelt compliment to win favor</span>
                            </div>
                            <span className="text-slate-300 font-bold">❯</span>
                          </button>

                          {/* Give Gift */}
                          <button 
                            onClick={() => interactGift(selectedRelationship, 50)}
                            className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                            id="rel-gift-small"
                          >
                            <span className="text-lg">🎁</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-xs text-[#5d4037] block">Give Gift ($50)</span>
                              <span className="text-[9px] text-slate-400 block truncate">Offer a sweet book to express care</span>
                            </div>
                            <span className="text-slate-300 font-bold">❯</span>
                          </button>

                          {/* Classmate Specific Actions */}
                          {selectedRelationship.relation === 'classmate' && (
                            <>
                              {/* Flirt */}
                              <button 
                                onClick={() => interactClassmateFlirt(selectedRelationship)}
                                className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                                id="rel-classmate-flirt"
                              >
                                <span className="text-lg">❤️</span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-extrabold text-xs text-indigo-700 block">Flirt / Hit On</span>
                                  <span className="text-[9px] text-slate-400 block truncate">Wink and deliver a terrible pickup line</span>
                                </div>
                                <span className="text-slate-300 font-bold">❯</span>
                              </button>

                              {/* Start Rumor */}
                              <button 
                                onClick={() => interactClassmateRumor(selectedRelationship)}
                                className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                                id="rel-classmate-rumor"
                              >
                                <span className="text-lg">🗣️</span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-extrabold text-xs text-indigo-700 block">Start an Unhinged Rumor</span>
                                  <span className="text-[9px] text-slate-400 block truncate">Spread malicious gossip to boost your clout</span>
                                </div>
                                <span className="text-slate-300 font-bold">❯</span>
                              </button>

                              {/* Prank */}
                              <button 
                                onClick={() => interactClassmatePrank(selectedRelationship)}
                                className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                                id="rel-classmate-prank"
                              >
                                <span className="text-lg">🎉</span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-extrabold text-xs text-indigo-700 block">Play a Rebellious Prank</span>
                                  <span className="text-[9px] text-slate-400 block truncate">Superglue their locker handle with glitter</span>
                                </div>
                                <span className="text-slate-300 font-bold">❯</span>
                              </button>
                            </>
                          )}


                          {/* Supervisor Specific Actions */}
                          {selectedRelationship.relation === 'supervisor' && (
                            <>
                              <button 
                                onClick={() => interactAskPromotion(selectedRelationship)}
                                className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                              >
                                <span className="text-lg">📈</span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-extrabold text-xs text-indigo-700 block">Ask for Promotion</span>
                                  <span className="text-[9px] text-slate-400 block truncate">Request a new title and more pay</span>
                                </div>
                                <span className="text-slate-300 font-bold">❯</span>
                              </button>
                              
                              <button 
                                onClick={() => interactAskRaise(selectedRelationship)}
                                className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                              >
                                <span className="text-lg">💰</span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-extrabold text-xs text-emerald-700 block">Ask for Raise</span>
                                  <span className="text-[9px] text-slate-400 block truncate">Request a salary bump without a title change</span>
                                </div>
                                <span className="text-slate-300 font-bold">❯</span>
                              </button>
                            </>
                          )}

                          {/* Teacher Specific Actions */}
                          {selectedRelationship.relation === 'teacher' && (
                            <>
                              {/* Brown-nose */}
                              <button 
                                onClick={() => interactTeacherBrownNose(selectedRelationship)}
                                className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                                id="rel-teacher-brown-nose"
                              >
                                <span className="text-lg">🍏</span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-extrabold text-xs text-emerald-700 block">Brown-Nose / Suck Up</span>
                                  <span className="text-[9px] text-slate-400 block truncate">Suck up to teacher for trust and smarts</span>
                                </div>
                                <span className="text-slate-300 font-bold">❯</span>
                              </button>

                              {/* Ask Grade Boost */}
                              <button 
                                onClick={() => interactTeacherGradeBoost(selectedRelationship)}
                                className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                                id="rel-teacher-grade-boost"
                              >
                                <span className="text-lg">📈</span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-extrabold text-xs text-emerald-700 block">Beg for Grade Boost</span>
                                  <span className="text-[9px] text-slate-400 block truncate">Cry and claim your dog ate your hard drive</span>
                                </div>
                                <span className="text-slate-300 font-bold">❯</span>
                              </button>

                              {/* Prank */}
                              <button 
                                onClick={() => interactTeacherPrank(selectedRelationship)}
                                className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                                id="rel-teacher-prank"
                              >
                                <span className="text-lg">😜</span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-extrabold text-xs text-emerald-700 block">Prank the Teacher</span>
                                  <span className="text-[9px] text-slate-400 block truncate">Sneak a screaming rubber chicken into their desk</span>
                                </div>
                                <span className="text-slate-300 font-bold">❯</span>
                              </button>
                            </>
                          )}

                          {/* Ask for Money (Only Parents/Spouse) */}
                          {(selectedRelationship.relation === 'parent' || selectedRelationship.relation === 'partner') && (
                            <button 
                              onClick={() => interactAskForMoney(selectedRelationship)}
                              className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                              id="rel-ask-money"
                            >
                              <span className="text-lg">💰</span>
                              <div className="flex-1 min-w-0">
                                <span className="font-extrabold text-xs text-[#5d4037] block">Ask for Money</span>
                                <span className="text-[9px] text-slate-400 block truncate">Request some quick cash / pocket money</span>
                              </div>
                              <span className="text-slate-300 font-bold">❯</span>
                            </button>
                          )}

                          {/* Insult */}
                          <button 
                            onClick={() => interactInsult(selectedRelationship)}
                            className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                            id="rel-insult"
                          >
                            <span className="text-lg">🤬</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-xs text-[#5d4037] block">Insult Them</span>
                              <span className="text-[9px] text-slate-400 block truncate">Speak harshly and damage trust</span>
                            </div>
                            <span className="text-slate-300 font-bold">❯</span>
                          </button>

                          {/* Brawl / Fight */}
                          {gameState.age >= 6 && (
                            <button 
                              onClick={() => interactFight(selectedRelationship)}
                              className="w-full text-left p-2.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                              id="rel-fight"
                            >
                              <span className="text-lg">🥊</span>
                              <div className="flex-1 min-w-0">
                                <span className="font-extrabold text-xs text-[#5d4037] block">Brawl / Fight</span>
                                <span className="text-[9px] text-slate-400 block truncate">Throw hands in a dangerous confrontation</span>
                              </div>
                              <span className="text-slate-300 font-bold">❯</span>
                            </button>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="pt-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
              <div className="flex justify-between items-center pb-3 px-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-rose-500" />
                  <span className="text-sm font-black uppercase tracking-wider text-slate-800">Life Activities</span>
                </div>
                <button 
                  onClick={() => { triggerSound('click'); setActiveTab('home'); }}
                  className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 rounded-full transition cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {!selectedActivity ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50">
                  {ALL_ACTIVITIES.map((act) => {
                    const canDo = gameState.age >= act.minAge;
                    
                    return (
                      <button 
                        key={act.id}
                        onClick={() => { 
                          triggerSound('click'); 
                          if (!canDo) return;
                          
                          if (act.functional) {
                            setSelectedActivity(act.id as any);
                          } else {
                            setGameState(prev => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                currentEvent: {
                                  title: 'Coming Soon!',
                                  text: `The ${act.name} activity is currently under development. Check back in a future update!`,
                                  type: 'neutral',
                                  image: 'https://images.unsplash.com/photo-1541888052150-136f4520ce3f?auto=format&fit=crop&w=400&q=80',
                                  choices: [
                                    { id: 'ok', text: 'Understood', effect: { outcomeText: 'You wait patiently for the developers to finish building this feature.' } }
                                  ]
                                }
                              }
                            });
                          }
                        }}
                        className={`relative overflow-hidden p-4 rounded-[1.25rem] border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 text-center group ${!canDo ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                        id={`act-${act.id}`}
                      >
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-300 ${act.color}`}>
                          <act.icon size={32} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col items-center w-full">
                          <span className="font-extrabold text-[14px] text-slate-800 tracking-tight leading-tight">{act.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium mt-1 leading-snug line-clamp-2 px-1">{!canDo ? `Unlocks at ${act.minAge}` : act.subtitle}</span>
                        </div>
                      </button>
                    );
                  })}

                  <button 
                    onClick={() => { 
                      triggerSound('click');
                      setGameState(prev => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          currentEvent: {
                            title: 'Surrender',
                            text: 'Are you sure you want to surrender? This will instantly end your current life and you will die.',
                            type: 'negative',
                            image: 'https://images.unsplash.com/photo-1598284693444-6725350fc65c?auto=format&fit=crop&w=400&q=80',
                            choices: [
                              { id: 'surrender_yes', text: 'Yes, end my life.', effect: { statChanges: { health: -100 }, outcomeText: 'You have given up on life.' } },
                              { id: 'surrender_no', text: 'No, I want to live!', effect: { outcomeText: 'You chose to keep living.' } }
                            ]
                          }
                        }
                      });
                    }}
                    className="relative overflow-hidden p-4 rounded-[1.25rem] border border-rose-200/60 bg-rose-50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 text-center group cursor-pointer"
                  >
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 shadow-inner group-hover:scale-110 transition-transform duration-300 text-rose-600">
                      <Skull size={32} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <span className="font-extrabold text-[14px] text-rose-900 tracking-tight leading-tight">Surrender</span>
                      <span className="text-[10px] text-rose-700/70 font-medium mt-1 leading-snug">End your life</span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 capitalize">{selectedActivity} Activity</span>
                    <button 
                      onClick={() => setSelectedActivity(null)} 
                      className="text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  {/* JOB SUB-VIEW */}
                  {selectedActivity === 'job' && (
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Available Jobs</p>
                      {JOB_INTERVIEWS.map((job) => {
                        const canApply = gameState.age >= job.minAge;
                        return (
                          <div key={job.title} className="p-3 bg-white border border-slate-200 flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{job.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Salary: ${job.salary.toLocaleString()}/yr</p>
                              <p className="text-[9px] text-indigo-500 font-semibold uppercase tracking-wider mt-1">Req: {job.req}</p>
                            </div>
                            <button
                              disabled={!canApply}
                              onClick={() => triggerInterview(job)}
                              className={`px-3 py-1.5 text-xs font-bold transition rounded-none uppercase tracking-wider ${canApply ? 'bg-indigo-900 text-white hover:bg-indigo-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                              id={`apply-${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              Apply
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* DATING SUB-VIEW */}
                  {selectedActivity === 'dating' && (
                    <div className="text-center py-4 space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Connect with potential partners in your local area. The matching service costs a standard <strong className="text-emerald-700">$50 fee</strong>.
                      </p>
                      <button
                        onClick={handleSearchPartner}
                        className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider"
                        id="search-partner"
                      >
                        Find Matches
                      </button>
                    </div>
                  )}

                  {/* ASSETS SUB-VIEW */}
                  {selectedActivity === 'assets' && (
                    <div className="space-y-2">
                      {ageFilteredAssets.length === 0 ? (
                        <div className="p-4 bg-white border border-slate-200 text-center text-xs text-slate-400 font-medium">
                          No items available for your current age.
                        </div>
                      ) : (
                        ageFilteredAssets.map((asset) => {
                          const isMinor = gameState.age < 12;
                          const isOwned = purchasedAssets.includes(asset.name);
                          const canAction = isMinor ? !isOwned : (gameState.cash >= asset.cost && !isOwned);

                          let emoji = '📦';
                          if (asset.type === 'property') emoji = '🏠';
                          else if (asset.type === 'vehicle') emoji = '🚗';
                          else if (asset.type === 'accessory') emoji = '⌚';
                          else if (asset.type === 'gadget') emoji = '📱';
                          else if (asset.type === 'toy') emoji = '🧸';
                          else if (asset.type === 'everyday') emoji = '☕';

                          return (
                            <div key={asset.id} className="p-3 bg-white border border-slate-200 flex flex-col gap-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                                    <span className="text-sm">{emoji}</span> {asset.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{asset.desc}</p>
                                </div>
                                <span className="font-mono text-xs font-bold text-emerald-700">${asset.cost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                                <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-wider">
                                  Effects: +{asset.style} Style, +{asset.status} Status
                                </span>
                                <button
                                  disabled={!canAction}
                                  onClick={() => {
                                    triggerSound('click');
                                    if (isMinor) {
                                      handleAskParentsToBuy(asset);
                                    } else {
                                      handleBuyAsset(asset);
                                    }
                                  }}
                                  className={`px-3 py-1 text-xs font-bold transition rounded-none uppercase tracking-wider cursor-pointer ${
                                    isOwned 
                                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                                      : canAction 
                                        ? 'bg-indigo-900 text-white hover:bg-indigo-800' 
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  }`}
                                  id={`buy-${asset.id}`}
                                >
                                  {isOwned ? '✓ Owned' : isMinor ? 'Ask Parents to Buy' : 'Buy Item'}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* STYLE SUB-VIEW */}
                  {selectedActivity === 'style' && (
                    <div className="text-center py-4 space-y-4">
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Dramatically improve your unique aesthetic, style, and general visual appeal. Costs <strong className="text-slate-800">$150</strong>.
                      </p>
                      <button
                        onClick={handleStyleUpgrade}
                        className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-wider"
                        id="style-upgrade"
                      >
                        Upgrade Wardrobe
                      </button>
                    </div>
                  )}

                  {/* GYM SUB-VIEW */}
                  {selectedActivity === 'gym' && (
                    <div className="text-center py-4 space-y-4">
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        {gameState.age < 18 ? (
                          <span>Enjoy a refreshing full-body training session at your local gym to boost happiness, health, and looks. Costs <strong className="text-emerald-600">FREE</strong> (parents pay since you are under 18).</span>
                        ) : (
                          <span>Enjoy a refreshing full-body training session at your local gym to boost happiness, health, and looks. Costs <strong className="text-slate-800">$20</strong>.</span>
                        )}
                      </p>
                      <button
                        onClick={handleGym}
                        className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg"
                        id="gym-upgrade"
                      >
                        {gameState.age < 18 ? 'Enter Gym (Paid by Parents)' : 'Enter Gym ($20)'}
                      </button>
                    </div>
                  )}

                  {/* DOCTORS SUB-VIEW */}
                  {selectedActivity === 'doctors' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-white border border-slate-200">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Current Diagnoses</span>
                        {gameState.illnesses && gameState.illnesses.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {gameState.illnesses.map((i) => (
                              <span 
                                key={i.id} 
                                className={`text-[10px] font-bold px-2 py-0.5 border ${
                                  i.type === 'terminal' 
                                    ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' 
                                    : i.type === 'chronic' 
                                      ? 'bg-amber-50 border-amber-200 text-amber-700' 
                                      : 'bg-blue-50 border-blue-200 text-blue-700'
                                }`}
                              >
                                {i.name} ({i.type}){!i.curable && ' - Inoperable'}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-emerald-600 font-bold mt-1">✓ You do not have any active medical conditions!</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        {/* 1. Public Clinic */}
                        <div className="p-3 bg-white border border-slate-200 flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900">🏥 Public Health Clinic</h4>
                            <p className="text-[10px] text-slate-400">Basic free treatment. Best suited for treating minor ailments.</p>
                            <span className="text-[9px] text-emerald-600 font-bold uppercase font-mono">FEE: FREE</span>
                          </div>
                          <button
                            onClick={handleConsultPublicClinic}
                            className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                            id="doctor-public"
                          >
                            Consult
                          </button>
                        </div>

                        {/* 2. Private Specialist */}
                        <div className="p-3 bg-white border border-slate-200 flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900">🩺 Private Clinical Specialist</h4>
                            <p className="text-[10px] text-slate-400">Premium specialist consultations. Can cure chronic & terminal diseases.</p>
                            <span className="text-[9px] text-rose-600 font-bold uppercase font-mono">FEE: $250 Checkup</span>
                          </div>
                          <button
                            disabled={gameState.age >= 18 && gameState.cash < 250}
                            onClick={handleConsultPrivateSpecialist}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer ${
                              gameState.age < 18 || gameState.cash >= 250 
                                ? 'bg-indigo-900 text-white hover:bg-indigo-800' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                            id="doctor-private"
                          >
                            Consult
                          </button>
                        </div>

                        {/* 3. Witch Doctor */}
                        <div className="p-3 bg-white border border-slate-200 flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900">🔮 Mysterious Witch Doctor</h4>
                            <p className="text-[10px] text-slate-400">Highly volatile treatments. Small chance to cure everything, high chance of severe sickness.</p>
                            <span className="text-[9px] text-amber-600 font-bold uppercase font-mono">FEE: $50</span>
                          </div>
                          <button
                            disabled={gameState.age >= 18 && gameState.cash < 50}
                            onClick={handleConsultWitchDoctor}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer ${
                              gameState.age < 18 || gameState.cash >= 50 
                                ? 'bg-indigo-900 text-white hover:bg-indigo-800' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                            id="doctor-witch"
                          >
                            Consult
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM REAL-TIME CORE QUICK STAT BARS */}
        <div className="bg-slate-950 p-4 border-t border-slate-900 grid grid-cols-4 gap-3 text-center text-[10px] font-bold uppercase tracking-wider">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-slate-400 flex items-center gap-1">😊 <span className="opacity-80">Happy</span></span>
            <div className="w-full bg-slate-900 h-2 mt-0.5 rounded-full overflow-hidden relative border border-slate-800/60 shadow-inner">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-300" style={{ width: `${gameState.stats.happiness}%` }}></div>
            </div>
            <span className="text-[9px] font-mono font-extrabold text-amber-400 mt-0.5">{gameState.stats.happiness}%</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-slate-400 flex items-center gap-1">❤️ <span className="opacity-80">Health</span></span>
            <div className="w-full bg-slate-900 h-2 mt-0.5 rounded-full overflow-hidden relative border border-slate-800/60 shadow-inner">
              <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_8px_rgba(244,63,94,0.4)] transition-all duration-300" style={{ width: `${gameState.stats.health}%` }}></div>
            </div>
            <span className="text-[9px] font-mono font-extrabold text-rose-400 mt-0.5">{gameState.stats.health}%</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-slate-400 flex items-center gap-1">🧠 <span className="opacity-80">Smarts</span></span>
            <div className="w-full bg-slate-900 h-2 mt-0.5 rounded-full overflow-hidden relative border border-slate-800/60 shadow-inner">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-all duration-300" style={{ width: `${gameState.stats.smarts}%` }}></div>
            </div>
            <span className="text-[9px] font-mono font-extrabold text-cyan-400 mt-0.5">{gameState.stats.smarts}%</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-slate-400 flex items-center gap-1">🔥 <span className="opacity-80">Looks</span></span>
            <div className="w-full bg-slate-900 h-2 mt-0.5 rounded-full overflow-hidden relative border border-slate-800/60 shadow-inner">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-300" style={{ width: `${gameState.stats.looks}%` }}></div>
            </div>
            <span className="text-[9px] font-mono font-extrabold text-indigo-400 mt-0.5">{gameState.stats.looks}%</span>
          </div>
        </div>

        {/* BOTTOM NAVIGATION TABS AND MASSIVE GREEN "AGE" BUTTON */}
        <div className="bg-slate-950 border-t border-slate-900 p-2 pb-3 text-white flex justify-between items-center relative h-16 shrink-0">
          
          {(() => {
            const age = gameState.age;
            let tabLabel = 'School';
            let tabIcon = <GraduationCap size={18} />;

            if (age < 3) {
              tabLabel = 'Infant';
              tabIcon = <Baby size={18} />;
            } else if (age < 6) {
              tabLabel = 'Toddler';
              tabIcon = <Smile size={18} />;
            } else if (age < 12) {
              tabLabel = 'Primary';
              tabIcon = <GraduationCap size={18} />;
            } else if (age < 15) {
              tabLabel = 'Middle';
              tabIcon = <GraduationCap size={18} />;
            } else if (age < 18) {
              tabLabel = 'High';
              tabIcon = <GraduationCap size={18} />;
            } else if (gameState.career.type === 'school') {
              tabLabel = 'College';
              tabIcon = <GraduationCap size={18} />;
            } else if (gameState.career.type === 'career') {
              tabLabel = 'Job';
              tabIcon = <Briefcase size={18} />;
            } else {
              tabLabel = 'Occupation';
              tabIcon = <Briefcase size={18} />;
            }

            return (
              <button 
                onClick={() => { triggerSound('click'); setActiveTab(activeTab === 'school' ? 'home' : 'school'); }}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${activeTab === 'school' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                id="tab-school"
              >
                {tabIcon}
                <span className="text-[9px] mt-0.5 font-black tracking-wider uppercase">
                  {tabLabel}
                </span>
              </button>
            );
          })()}

          <button 
            onClick={() => { triggerSound('click'); setActiveTab(activeTab === 'assets' ? 'home' : 'assets'); }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${activeTab === 'assets' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            id="tab-assets"
          >
            <ShoppingBag size={18} />
            <span className="text-[9px] mt-0.5 font-black tracking-wider uppercase">Assets</span>
          </button>

          {/* MASSIVE AGE UP ROUND GREEN BUTTON IN THE CENTER */}
          <div className="relative -top-5 px-2.5 z-20">
            <button
              disabled={gameState.currentEvent !== null || isDead}
              onClick={ageUp}
              className={`w-15 h-15 rounded-full flex flex-col items-center justify-center border-4 shadow-xl active:scale-95 transition-all duration-150 cursor-pointer ${
                gameState.currentEvent !== null || isDead 
                  ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60' 
                  : 'bg-gradient-to-b from-green-500 to-emerald-600 border-green-400 hover:from-green-400 hover:to-emerald-500 text-white shadow-emerald-950/40 shadow-2xl'
              }`}
              title="Age Up (+1 Year)"
              id="age-button"
            >
              <Plus size={18} className="stroke-[3.5] animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase -mt-0.5 leading-none tracking-wider">Age</span>
            </button>
          </div>

          <button 
            onClick={() => { triggerSound('click'); setActiveTab(activeTab === 'relationships' ? 'home' : 'relationships'); }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${activeTab === 'relationships' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            id="tab-relationships"
          >
            <Heart size={18} className={activeTab === 'relationships' ? 'text-indigo-400' : 'text-slate-400 hover:text-pink-400'} />
            <span className="text-[9px] mt-0.5 font-black tracking-wider uppercase">People</span>
          </button>

          <button 
            onClick={() => { triggerSound('click'); setActiveTab(activeTab === 'activities' ? 'home' : 'activities'); }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${activeTab === 'activities' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            id="tab-activities"
          >
            <Activity size={18} />
            <span className="text-[9px] mt-0.5 font-black tracking-wider uppercase">Action</span>
          </button>

        </div>

        {/* ACHIEVEMENT UNLOCKED FLOATING TOAST */}
        {activeAchievementToast && (
          <>
            <style>{`
              @keyframes slideUp {
                0% { transform: translateY(120%) scale(0.9); opacity: 0; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
              }
              .animate-slide-up {
                animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>
            <div 
              className="absolute bottom-24 left-4 right-4 bg-slate-950/95 border-2 border-amber-400 text-white px-4 py-3.5 shadow-2xl z-50 flex items-center gap-3 animate-slide-up rounded-xl"
              id="achievement-toast"
            >
              <div className="text-3xl animate-bounce shrink-0 select-none">
                {activeAchievementToast.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block font-mono">
                  🏆 Achievement Unlocked!
                </span>
                <h4 className="text-sm font-black tracking-tight text-white uppercase mt-0.5">
                  {activeAchievementToast.title}
                </h4>
              </div>
              <button 
                onClick={() => setActiveAchievementToast(null)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 cursor-pointer transition"
              >
                ✕
              </button>
            </div>
          </>
        )}

              {/* JOB DETAILS MODAL */}
      {showJobDetailsModal && gameState.career.type === 'job' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#f0f0f0] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative border-4 border-[#ff4e00] flex flex-col max-h-[90vh]">
            
            <button 
              onClick={() => { triggerSound('click'); setShowJobDetailsModal(false); }}
              className="absolute -top-3 -left-3 z-10 bg-white rounded-full p-1 shadow-lg border-2 border-slate-300 hover:scale-110 transition active:scale-95"
            >
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold leading-none select-none">✕</div>
            </button>

            <div className="bg-gradient-to-r from-[#d75024] to-[#f55928] p-3 flex items-center justify-between border-b-4 border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 bg-[#e0d6c8] flex items-center justify-center text-2xl shadow-md">
                  {gameState.avatar}
                </div>
                <div className="text-white font-black text-lg tracking-tight drop-shadow-md">
                  {gameState.name}
                </div>
              </div>
              <span className="text-white font-black text-xl italic drop-shadow-md pr-2">You</span>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl drop-shadow-sm">💼</span>
                <h2 className="text-[#3b120c] font-black text-xl text-center">{gameState.career.title}</h2>
              </div>

              <div className="bg-[#e6e6e6] rounded-xl overflow-hidden shadow-inner border border-slate-300">
                <div className="flex px-3 py-2.5 border-b border-white/50">
                  <span className="w-32 font-black text-[#4a2e2a]">Title:</span>
                  <span className="flex-1 text-[#5c3e3a] font-semibold">{gameState.career.title}</span>
                </div>
                <div className="flex px-3 py-2.5 border-b border-white/50 bg-[#dbdbdb]">
                  <span className="w-32 font-black text-[#4a2e2a]">Career:</span>
                  <span className="flex-1 text-[#5c3e3a] font-semibold capitalize">{gameState.career.industry || 'General'} Industry</span>
                </div>
                <div className="flex px-3 py-2.5 border-b border-white/50">
                  <span className="w-32 font-black text-[#4a2e2a]">Employer:</span>
                  <span className="flex-1 text-[#5c3e3a] font-semibold">{gameState.career.employer || 'The Company'}</span>
                </div>
                <div className="flex px-3 py-2.5 border-b border-white/50 bg-[#dbdbdb]">
                  <span className="w-32 font-black text-[#4a2e2a]">Years in Position:</span>
                  <span className="flex-1 text-[#5c3e3a] font-semibold">{gameState.career.yearsInRole || 0}</span>
                </div>
                <div className="flex px-3 py-2.5">
                  <span className="w-32 font-black text-[#4a2e2a]">Salary:</span>
                  <span className="flex-1 text-[#5c3e3a] font-semibold">${(gameState.career.salary || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <span className="font-black text-[#4a2e2a] text-sm">Performance</span>
                <div className="flex-1 bg-white h-4 rounded-sm border border-slate-300 shadow-inner overflow-hidden">
                  <div 
                    className="h-full bg-[#2da641] transition-all duration-300"
                    style={{ width: `${gameState.career.performance || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

            {/* SOCIAL MEDIA DETAIL/DASHBOARD MODAL - REMOVED */}
      {false && (
        (() => {
          const channel = selectedSocialChannel;
          const data = gameState.socialMedia[channel];
          
          const emojis = {
            facebook: '📘', instagram: '📸', onlyfans: '🍑', tiktok: '🎵',
            twitch: '🔮', twitter: '🐦', soundcloud: '☁️', podcast: '🎙️', youtube: '🎥'
          };
          
          const titles = {
            facebook: 'Facebook', instagram: 'Instagram', onlyfans: 'OnlyFans', tiktok: 'TikTok',
            twitch: 'Twitch', twitter: 'Twitter', soundcloud: 'SoundCloud', podcast: 'Podcast', youtube: 'YouTube'
          };

          const handlePostContent = (topic) => {
            triggerSound('click');
            
            let looksFactor = gameState.stats.looks / 100;
            let smartsFactor = gameState.stats.smarts / 100;
            let followerGained = 0;
            let happinessChange = 2;
            let outcomeText = "";

            if (topic === 'Meme') {
              followerGained = Math.floor(Math.random() * 800) + 100;
              outcomeText = "You shared a spicy meme that went semi-viral! People liked your humor.";
            } else if (topic === 'Dance') {
              followerGained = Math.floor((Math.random() * 2000 + 200) * (looksFactor + 0.2));
              outcomeText = "You filmed yourself doing a trending dance challenge. Your looks got you a lot of views!";
            } else if (topic === 'Vlog') {
              followerGained = Math.floor((Math.random() * 1500 + 100) * (smartsFactor + looksFactor) / 2);
              outcomeText = "You posted a vlog about your daily routine. People loved the authenticity.";
            } else if (topic === 'Opinion') {
              const roll = Math.random();
              if (roll > 0.4) {
                followerGained = Math.floor(Math.random() * 4000) + 500;
                outcomeText = "You gave a hot take on a trending topic. Your post exploded in popularity!";
              } else {
                followerGained = -Math.floor(Math.random() * 1500) - 200;
                happinessChange = -15;
                outcomeText = "You shared a highly controversial opinion. The internet mob swarmed your account and canceled you!";
              }
            } else if (topic === 'Lewd') {
              followerGained = Math.floor((Math.random() * 6000 + 1000) * (looksFactor * 1.5 + 0.3));
              outcomeText = "You posted exclusive, highly provocative content. Subscriptions skyrocketed!";
            }

            const nextStats = { ...gameState.stats };
            nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness + happinessChange));
            
            const channelData = {
              ...data,
              followers: Math.max(0, data.followers + followerGained),
              postsCount: data.postsCount + 1
            };

            setGameState({
              ...gameState,
              stats: nextStats,
              socialMedia: {
                ...gameState.socialMedia,
                [channel]: channelData
              },
              log: [...gameState.log, `📱 Posted a ${topic} on ${titles[channel]}. Gained ${followerGained.toLocaleString()} followers.`]
            });

            setActionPopup({ 
              isOpen: true, 
              title: followerGained >= 0 ? 'Post Successful!' : 'Controversial Post', 
              message: `${outcomeText}\n\nFollower Change: ${followerGained >= 0 ? '+' : ''}${followerGained.toLocaleString()}`
            });
          };

          const handleBuyFollowers = () => {
            triggerSound('click');
            if (gameState.cash < 500) {
              setActionPopup({ isOpen: true, title: 'Insufficient Funds', message: 'It costs $500 to buy bot followers.' });
              return;
            }

            const roll = Math.random();
            if (roll < 0.25) {
              triggerSound('error');
              setGameState({
                ...gameState,
                cash: gameState.cash - 500,
                socialMedia: {
                  ...gameState.socialMedia,
                  [channel]: { ...data, signedUp: false, followers: 0, verified: false }
                },
                log: [...gameState.log, `🚫 BANNED: Caught buying fake bot followers on ${titles[channel]}! Account terminated.`]
              });
              setActionPopup({ isOpen: true, title: 'Account Terminated', message: `The moderators caught you buying fake followers and permanently deleted your account!` });
              setSelectedSocialChannel(null);
            } else {
              triggerSound('success');
              const botsGained = Math.floor(Math.random() * 4000) + 3000;
              setGameState({
                ...gameState,
                cash: gameState.cash - 500,
                socialMedia: {
                  ...gameState.socialMedia,
                  [channel]: { ...data, followers: data.followers + botsGained }
                },
                log: [...gameState.log, `🤖 Bought bot followers on ${titles[channel]} for $500.`]
              });
              setActionPopup({ isOpen: true, title: 'Bots Delivered', message: `Your follower packages have been quietly delivered! (+${botsGained.toLocaleString()} followers)` });
            }
          };

          const handleDeleteAccount = () => {
            triggerSound('click');
            setGameState({
              ...gameState,
              socialMedia: {
                ...gameState.socialMedia,
                [channel]: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 }
              },
              log: [...gameState.log, `❌ Closed your ${titles[channel]} account.`]
            });
            setActionPopup({ isOpen: true, title: 'Account Closed', message: `Your ${titles[channel]} account has been permanently deleted.` });
            setSelectedSocialChannel(null);
          };

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-[#f0f0f0] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative border-4 border-[#0f4a8a] flex flex-col max-h-[90vh]">
                
                <button 
                  onClick={() => { triggerSound('click'); setSelectedSocialChannel(null); }}
                  className="absolute -top-3 -left-3 z-10 bg-white rounded-full p-1 shadow-lg border-2 border-slate-300 hover:scale-110 transition active:scale-95 cursor-pointer"
                >
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold leading-none select-none">✕</div>
                </button>

                <div className="bg-gradient-to-r from-[#0f4a8a] to-[#2575fc] p-4 text-white border-b-4 border-white/20">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl drop-shadow-md">{emojis[channel]}</span>
                    <div className="text-left">
                      <h3 className="font-black text-xl tracking-tight leading-none drop-shadow-md">{titles[channel]}</h3>
                      <p className="text-xs font-semibold opacity-90 mt-1">{data.verified ? '🌟 Verified Profile' : 'Standard Profile'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 overflow-y-auto space-y-4">
                  <div className="bg-[#e6e6e6] rounded-xl p-3 border border-slate-300 flex justify-around text-center shadow-inner">
                    <div>
                      <span className="text-slate-400 font-bold text-[10px] uppercase block">Followers</span>
                      <span className="font-black text-[#5d4037] text-lg">{(data.followers || 0).toLocaleString()}</span>
                    </div>
                    {channel === 'onlyfans' && (
                      <div>
                        <span className="text-slate-400 font-bold text-[10px] uppercase block">Subscribers</span>
                        <span className="font-black text-[#5d4037] text-lg">{(data.subscribers || 0).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {channel === 'onlyfans' && (
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-xs text-[#0f4a8a]">Subscription Price</span>
                        <span className="font-bold text-sm text-[#0f4a8a]">${data.subscriptionPrice || 10}/mo</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="50"
                        value={data.subscriptionPrice || 10}
                        onChange={(e) => {
                          setGameState({
                            ...gameState,
                            socialMedia: {
                              ...gameState.socialMedia,
                              onlyfans: { ...data, subscriptionPrice: parseInt(e.target.value) }
                            }
                          });
                        }}
                        className="w-full accent-[#0f4a8a] cursor-pointer"
                      />
                      <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase text-center">Higher price = fewer subscribers</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 block font-mono text-left">Actions</span>
                    
                    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-2 text-left">
                      <span className="font-extrabold text-xs text-slate-600 block">Post New Content</span>
                      <div className="grid grid-cols-2 gap-2">
                        {channel === 'onlyfans' ? (
                          <>
                            <button 
                              onClick={() => handlePostContent('Vlog')}
                              className="bg-slate-100 hover:bg-[#fffaf2] border border-slate-200 font-bold text-xs py-2 px-3 text-[#5d4037] rounded-lg transition active:scale-95 cursor-pointer text-center"
                            >
                              🎥 Daily Vlog
                            </button>
                            <button 
                              onClick={() => handlePostContent('Lewd')}
                              className="bg-[#ffeef0] hover:bg-[#ffd5da] border border-[#ffb3c1] font-bold text-xs py-2 px-3 text-red-600 rounded-lg transition active:scale-95 cursor-pointer text-center"
                            >
                              🍑 Lewd Photos
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handlePostContent('Meme')}
                              className="bg-slate-100 hover:bg-[#fffaf2] border border-slate-200 font-bold text-xs py-2 px-3 text-[#5d4037] rounded-lg transition active:scale-95 cursor-pointer text-center"
                            >
                              🤪 Meme
                            </button>
                            <button 
                              onClick={() => handlePostContent('Dance')}
                              className="bg-slate-100 hover:bg-[#fffaf2] border border-slate-200 font-bold text-xs py-2 px-3 text-[#5d4037] rounded-lg transition active:scale-95 cursor-pointer text-center"
                            >
                              💃 Dance
                            </button>
                            <button 
                              onClick={() => handlePostContent('Vlog')}
                              className="bg-slate-100 hover:bg-[#fffaf2] border border-slate-200 font-bold text-xs py-2 px-3 text-[#5d4037] rounded-lg transition active:scale-95 cursor-pointer text-center"
                            >
                              🎥 Vlog
                            </button>
                            <button 
                              onClick={() => handlePostContent('Opinion')}
                              className="bg-slate-100 hover:bg-[#fffaf2] border border-slate-200 font-bold text-xs py-2 px-3 text-[#5d4037] rounded-lg transition active:scale-95 cursor-pointer text-center"
                            >
                              🗣️ Opinion
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleBuyFollowers}
                      className="w-full bg-[#fcf8f2] hover:bg-[#fff4e0] border border-[#ebdcb9] hover:border-[#f5d59e] p-3 text-left rounded-xl transition flex items-center justify-between group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform">🤖</span>
                        <div className="flex flex-col text-left">
                          <span className="font-extrabold text-xs text-[#5d4037]">Buy Followers ($500)</span>
                          <span className="text-[9px] text-slate-400 font-semibold">Buy 5,000 bot followers (25% risk of ban!)</span>
                        </div>
                      </div>
                      <span className="text-slate-300 font-bold">❯</span>
                    </button>

                    <button 
                      onClick={handleDeleteAccount}
                      className="w-full bg-red-50 hover:bg-red-100 border border-red-200 p-3 text-left rounded-xl transition flex items-center justify-between group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform">❌</span>
                        <div className="flex flex-col text-left">
                          <span className="font-extrabold text-xs text-red-600">Delete Account</span>
                          <span className="text-[9px] text-slate-400 font-semibold">Permanently erase this account profile</span>
                        </div>
                      </div>
                      <span className="text-red-300 font-bold">❯</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()
      )}


      {/* SUBSCRIPTION FEE MODAL */}
      {showSubscriptionFeeModal && selectedSocialChannel === 'onlyfans' && gameState.socialMedia?.onlyfans && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-300 flex flex-col">
            
            <button 
              onClick={() => { triggerSound('click'); setShowSubscriptionFeeModal(false); }}
              className="absolute -top-3 -left-3 z-10 bg-white rounded-full p-1 shadow-lg border border-slate-200 hover:scale-110 transition active:scale-95 cursor-pointer"
            >
              <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm select-none">✕</div>
            </button>

            <div className="bg-gradient-to-r from-[#d75024] to-[#f55928] py-4 px-6 text-white border-b-4 border-white/20 flex justify-between items-center">
              <h3 className="font-black text-xl tracking-tight drop-shadow-md">
                Subscription Fee
              </h3>
              <span className="text-white/70 font-black tracking-widest text-xs uppercase font-mono">Social</span>
            </div>

            <div className="p-6 space-y-6 text-left">
              <p className="text-sm font-extrabold text-slate-700 text-center">
                Decide how much you'll charge your subscribers each month today!
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center shadow-inner">
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Current Monthly Fee</span>
                <span className="font-black text-[#5d4037] text-xl">${gameState.socialMedia.onlyfans.subscriptionPrice || 10}</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Subscription Fee</span>
                  <span>${tempSubscriptionPrice}</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="100"
                  value={tempSubscriptionPrice}
                  onChange={(e) => setTempSubscriptionPrice(parseInt(e.target.value))}
                  className="w-full accent-[#d75024] cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  triggerSound('click');
                  setGameState({
                    ...gameState,
                    socialMedia: {
                      ...gameState.socialMedia,
                      onlyfans: {
                        ...gameState.socialMedia.onlyfans,
                        subscriptionPrice: tempSubscriptionPrice
                      }
                    },
                    log: [...gameState.log, `🍑 Set OnlyFans subscription price to $${tempSubscriptionPrice}/month.`]
                  });
                  setShowSubscriptionFeeModal(false);
                  setActionPopup({ isOpen: true, title: 'Price Updated', message: `Subscription price set to $${tempSubscriptionPrice}/mo.` });
                }}
                className="w-full bg-[#0f4a8a] hover:bg-[#093566] text-white font-black py-3 rounded-xl transition cursor-pointer text-center text-sm shadow-md"
              >
                OK
              </button>
            </div>

          </div>
        </div>
      )}

      {/* WISHLIST MODAL */}
      {showWishlistModal && selectedSocialChannel === 'onlyfans' && gameState.socialMedia?.onlyfans && (
        (() => {
          const gifts = ['Designer Bag', 'Diamond Ring', 'Sports Car', 'Airplane', 'Jet Skis', 'Mansion', 'Luxury Watch', 'Designer Shoes'];
          
          const handlePostWishlist = () => {
            triggerSound('click');
            const data = gameState.socialMedia.onlyfans;
            
            const buyChance = Math.min(35, Math.floor((data.subscribers || 0) * 0.005));
            const roll = Math.random() * 100;
            
            let obtainedGift = null;
            let logText = "";
            let outcomeText = "";
            let nextCash = gameState.cash;
            
            if (roll < buyChance && data.subscribers > 0) {
              triggerSound('success');
              obtainedGift = wishlistGifts[Math.floor(Math.random() * wishlistGifts.length)];
              
              const giftValues = {
                'Designer Bag': 3500,
                'Diamond Ring': 12000,
                'Sports Car': 85000,
                'Airplane': 2500000,
                'Jet Skis': 15000,
                'Mansion': 4500000,
                'Luxury Watch': 25000,
                'Designer Shoes': 1200
              };
              const value = giftValues[obtainedGift as keyof typeof giftValues] || 1000;
              nextCash += value;
              
              logText = `🎁 A generous OnlyFans subscriber purchased a ${obtainedGift} from your wishlist! You pocketed the value of $${value.toLocaleString()}.`;
              outcomeText = `An incredibly wealthy subscriber bought a ${obtainedGift} off your wishlist!\n\nYou received the cash value of $${value.toLocaleString()}!`;
            } else {
              triggerSound('error');
              logText = `🎁 You posted your wishlist on OnlyFans, but no subscribers purchased anything this time.`;
              outcomeText = "You shared your wishlist link, but none of your subscribers bought you a gift this time.";
            }

            setGameState({
              ...gameState,
              cash: nextCash,
              socialMedia: {
                ...gameState.socialMedia,
                onlyfans: { ...data, wishlistPosted: true }
              },
              log: [...gameState.log, logText]
            });
            
            setShowWishlistModal(false);
            setActionPopup({ isOpen: true, title: obtainedGift ? 'Gift Received!' : 'Wishlist Shared', message: outcomeText });
          };

          return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-300 flex flex-col">
                
                <button 
                  onClick={() => { triggerSound('click'); setShowWishlistModal(false); }}
                  className="absolute -top-3 -left-3 z-10 bg-white rounded-full p-1 shadow-lg border border-slate-200 hover:scale-110 transition active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm select-none">✕</div>
                </button>

                <div className="bg-gradient-to-r from-[#d75024] to-[#f55928] py-4 px-6 text-white border-b-4 border-white/20 flex justify-between items-center">
                  <h3 className="font-black text-xl tracking-tight drop-shadow-md flex items-center gap-2">
                    🎁 Wish
                  </h3>
                  <span className="text-white/70 font-black tracking-widest text-xs uppercase font-mono">Social</span>
                </div>

                <div className="p-6 space-y-4 text-left">
                  <p className="text-sm font-bold text-slate-700 text-center font-semibold">Manage your OnlyFans wishlist today.</p>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 font-mono">Pick a gift preference:</label>
                    <div className="relative">
                      <select 
                        value={wishlistGifts[0]}
                        onChange={(e) => setWishlistGifts([e.target.value, wishlistGifts[1], wishlistGifts[2]])}
                        className="w-full bg-[#f4f3f0] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs outline-none focus:border-indigo-600 transition cursor-pointer appearance-none"
                      >
                        {gifts.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-[10px]">▼</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 font-mono">Pick a second gift preference:</label>
                    <div className="relative">
                      <select 
                        value={wishlistGifts[1]}
                        onChange={(e) => setWishlistGifts([wishlistGifts[0], e.target.value, wishlistGifts[2]])}
                        className="w-full bg-[#f4f3f0] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs outline-none focus:border-indigo-600 transition cursor-pointer appearance-none"
                      >
                        {gifts.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-[10px]">▼</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 font-mono">Pick a third gift preference:</label>
                    <div className="relative">
                      <select 
                        value={wishlistGifts[2]}
                        onChange={(e) => setWishlistGifts([wishlistGifts[0], wishlistGifts[1], e.target.value])}
                        className="w-full bg-[#f4f3f0] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs outline-none focus:border-indigo-600 transition cursor-pointer appearance-none"
                      >
                        {gifts.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-[10px]">▼</div>
                    </div>
                  </div>

                  <button 
                    onClick={handlePostWishlist}
                    className="w-full bg-[#0f4a8a] hover:bg-[#093566] text-white font-black py-3 rounded-xl transition cursor-pointer text-center text-sm shadow-md mt-2"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}


      {/* SOCIAL POST RESULT POPUP (GDD METRICS) */}
      {socialPostResult && (
        (() => {
          const res = socialPostResult;
          const p = animProgress;
          const currViews = Math.floor(res.viewsStart + (res.viewsEnd - res.viewsStart) * p);
          const currLikes = Math.floor(res.likesStart + (res.likesEnd - res.likesStart) * p);
          const currFollowers = Math.floor(res.followersGained * p);
          const currEarnings = Math.floor(res.earningsStart + (res.earningsEnd - res.earningsStart) * p);

          const titles: Record<string, string> = {
            facebook: 'Facebook', instagram: 'Instagram', onlyfans: 'OnlyFans', tiktok: 'TikTok',
            twitch: 'Twitch', twitter: 'Twitter', soundcloud: 'SoundCloud', podcast: 'Podcast', youtube: 'YouTube'
          };
          const emojis: Record<string, string> = {
            facebook: '📘', instagram: '📸', onlyfans: '🍑', tiktok: '🎵',
            twitch: '🔮', twitter: '🐦', soundcloud: '☁️', podcast: '🎙️', youtube: '🎥'
          };

          const handleContinue = () => {
            triggerSound('click');
            
            // Apply all stat modifications
            const nextStats = { ...gameState.stats };
            nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness + (res.statChanges.happiness || 0)));
            nextStats.status = Math.max(0, Math.min(100, nextStats.status + (res.statChanges.fame || 0)));

            let nextCash = gameState.cash + (res.statChanges.money || 0);

            // Fetch flags
            const nextFlags = { ...gameState.flags };
            nextFlags.stress = Math.max(0, Math.min(100, (nextFlags.stress || 10) + (res.statChanges.stress || 0)));
            nextFlags.leakRisk = Math.max(0, Math.min(100, (nextFlags.leakRisk || 0) + (res.statChanges.leakRisk || 0)));

            // Apply Family Relations change
            let nextRelationships: any[] = [...(Object.values(gameState.npcs || {}) as any[])];
            if (res.statChanges.family && res.statChanges.family !== 0) {
              nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
                if (r.relation === 'parent' || r.relation === 'sibling') {
                  return { ...r, trust: Math.max(0, r.trust + res.statChanges.family) };
                }
                return r;
              });
            }

            // Apply Bonus Event Effects
            if (res.bonusEvent && res.bonusEvent.effect) {
              const eff = res.bonusEvent.effect;
              if (eff.cashChange) {
                nextCash += eff.cashChange;
              }
              if (eff.statChanges) {
                if (eff.statChanges.happiness) nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness + eff.statChanges.happiness));
                if (eff.statChanges.status) nextStats.status = Math.max(0, Math.min(100, nextStats.status + eff.statChanges.status));
                if (eff.statChanges.health) nextStats.health = Math.max(0, Math.min(100, nextStats.health + eff.statChanges.health));
              }
              if (eff.stress) {
                nextFlags.stress = Math.max(0, Math.min(100, (nextFlags.stress || 10) + eff.stress));
              }
              if (eff.leakRisk) {
                nextFlags.leakRisk = Math.max(0, Math.min(100, (nextFlags.leakRisk || 0) + eff.leakRisk));
              }
              if (eff.familyRel) {
                nextRelationships = nextRelationships.map(r => {
                  if (r.relation === 'parent' || r.relation === 'sibling') {
                    return { ...r, trust: Math.max(0, r.trust + eff.familyRel) };
                  }
                  return r;
                });
              }
            }

            // Write logs
            const earnedText = res.statChanges.money > 0 ? ` Earning $${res.statChanges.money.toLocaleString()}.` : "";
            const bonusText = res.bonusEvent ? ` [Event: ${res.bonusEvent.title}]` : "";
            const logMsg = `📱 Posted "${res.topic}" on ${titles[res.channel]}. Views: ${res.viewsEnd.toLocaleString()} (${res.viralTier}).${earnedText}${bonusText}`;

            // Check Critical Thresholds
            let criticalPopup = null;
            if (nextFlags.stress >= 100) {
              nextFlags.stress = 20;
              nextStats.happiness = Math.max(0, nextStats.happiness - 15);
              criticalPopup = {
                title: "⚠️ BREAKDOWN (Stress 100%)",
                message: "You collapsed from extreme exhaustion! You are forced to rest, losing some momentum on all profiles.",
                statMsg: "Stress Reset, Happiness -15%"
              };
            } else if (nextFlags.leakRisk >= 100) {
              nextFlags.leakRisk = 20;
              nextStats.status = Math.max(0, nextStats.status - 50); // Loss of Fame
              criticalPopup = {
                title: "⚠️ FULL DOXX (Leak Risk 100%)",
                message: "Your real identity, address, and info have been leaked online. You must wipe accounts and rebuild anonymity.",
                statMsg: "Fame/Status -50%"
              };
            }

            setGameState({
              ...gameState,
              stats: nextStats,
              cash: nextCash,
              flags: nextFlags,
              relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
              socialMedia: {
                ...gameState.socialMedia,
                [res.channel]: {
                  ...gameState.socialMedia[res.channel],
                  followers: Math.max(0, gameState.socialMedia[res.channel].followers + currFollowers),
                  postsCount: gameState.socialMedia[res.channel].postsCount + 1
                }
              },
              log: [...gameState.log, logMsg]
            });

            setSocialPostResult(null);

            if (criticalPopup) {
              setActionPopup({
                isOpen: true,
                title: criticalPopup.title,
                message: `${criticalPopup.message}\n\n${criticalPopup.statMsg}`
              });
            }
          };

          return (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
              <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 border-slate-300 flex flex-col transform scale-100 transition-all">
                
                {/* Visual Header */}
                <div 
                  className="py-4 px-6 text-white text-center border-b-4 border-white/20 flex justify-between items-center"
                  style={{ backgroundColor: res.viralColor }}
                >
                  <h3 className="font-black text-lg tracking-tight uppercase">
                    {emojis[res.channel]} {titles[res.channel]} Post Results
                  </h3>
                  <span className="text-[10px] font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full font-mono">
                    {res.viralTier} {res.viralEmoji}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 text-left overflow-y-auto max-h-[420px]">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black font-mono block">Content Uploaded</span>
                    <h4 className="text-sm font-black text-slate-800">"{res.topic}"</h4>
                    <p className="text-[10px] text-slate-400 font-bold font-mono">{res.typeLabel}</p>
                  </div>

                  {/* Real-time stats display */}
                  <div className="space-y-2.5 border-t border-slate-100 pt-3">
                    <div className="flex justify-between items-center text-xs text-slate-700">
                      <span className="font-bold flex items-center gap-1.5">👁️ Views</span>
                      <span className="font-mono font-black">{currViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-700">
                      <span className="font-bold flex items-center gap-1.5">❤️ Likes</span>
                      <span className="font-mono font-black">{currLikes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-700">
                      <span className="font-bold flex items-center gap-1.5">👥 Followers</span>
                      <span className="font-mono font-black text-emerald-600">+{currFollowers.toLocaleString()}</span>
                    </div>
                    {currEarnings > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-700">
                        <span className="font-bold flex items-center gap-1.5">💰 Net Earnings</span>
                        <span className="font-mono font-black text-emerald-600">${currEarnings.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Stat shifts updates */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black font-mono block">📊 Statistical Shifts</span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
                      {res.statChanges.happiness !== 0 && (
                        <div className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-xl">
                          <span>Happiness</span>
                          <span className={res.statChanges.happiness > 0 ? "text-emerald-600 font-black font-mono" : "text-rose-600 font-black font-mono"}>
                            {res.statChanges.happiness > 0 ? `↑ +${res.statChanges.happiness}%` : `↓ ${res.statChanges.happiness}%`}
                          </span>
                        </div>
                      )}
                      {res.statChanges.fame !== 0 && (
                        <div className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-xl">
                          <span>Fame</span>
                          <span className={res.statChanges.fame > 0 ? "text-emerald-600 font-black font-mono" : "text-rose-600 font-black font-mono"}>
                            {res.statChanges.fame > 0 ? `↑ +${res.statChanges.fame}%` : `↓ ${res.statChanges.fame}%`}
                          </span>
                        </div>
                      )}
                      {res.statChanges.stress !== 0 && (
                        <div className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-xl">
                          <span>Stress</span>
                          <span className="text-rose-600 font-black font-mono">
                            ↑ +{res.statChanges.stress}%
                          </span>
                        </div>
                      )}
                      {res.statChanges.leakRisk !== 0 && (
                        <div className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-xl">
                          <span>Leak Risk</span>
                          <span className="text-rose-600 font-black font-mono">
                            ↑ +{res.statChanges.leakRisk}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bonus event box */}
                  {res.bonusEvent && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-amber-700 font-black font-mono block">🎲 BONUS EVENT!</span>
                      <h5 className="text-xs font-black text-amber-900">{res.bonusEvent.title}</h5>
                      <p className="text-xs text-amber-800 leading-snug">{res.bonusEvent.description}</p>
                      <p className="text-[9px] text-amber-600 font-black font-mono uppercase mt-1">{res.bonusEvent.extraStats}</p>
                    </div>
                  )}

                  {/* Continue Button */}
                  <button 
                    onClick={handleContinue}
                    className="w-full bg-[#0f4a8a] hover:bg-[#093566] text-white font-black py-3.5 rounded-2xl transition cursor-pointer text-center text-sm shadow-md mt-4 active:scale-[0.98]"
                  >
                    CONTINUE →
                  </button>
                </div>

              </div>
            </div>
          );
        })()
      )}

      {/* SOCIAL MEDIA POST MODAL */}

      {activeSocialModal === 'post' && selectedSocialChannel && gameState.socialMedia?.[selectedSocialChannel] && (
        (() => {
          const channel = selectedSocialChannel;
          const data = gameState.socialMedia[channel];
          const titles = {
            facebook: 'Facebook', instagram: 'Instagram', onlyfans: 'OnlyFans', tiktok: 'TikTok',
            twitch: 'Twitch', twitter: 'Twitter', soundcloud: 'SoundCloud', podcast: 'Podcast', youtube: 'YouTube'
          };
          const emojis = {
            facebook: '📘', instagram: '📸', onlyfans: '🍑', tiktok: '🎵',
            twitch: '🔮', twitter: '🐦', soundcloud: '☁️', podcast: '🎙️', youtube: '🎥'
          };

          const postOptions = {
            facebook: [
              '👵 Minion Meme about Mondays', 
              '😒 Passive-Aggressive Rant about a Cousin', 
              '🧄 Sharing Fake News about Garlic Curing Baldness', 
              '💼 MLM Scheme Pitch (Get Rich Quick!)',
              '🤳 Out-of-focus Bathroom Selfie',
              '🐈 Video of my cat sleeping'
            ],
            instagram: [
              '🏎️ Flexing a Rented Supercar as My Own', 
              '🔮 Cryptic Quote About My Enemies', 
              '🦝 Showing Off my New Pet Raccoon', 
              '💊 Spamming Sponsored Diet Gummies that cause Hair Loss',
              '🏖️ Travel Photo with an Obvious Photoshop Filter',
              '🍑 Aesthetic Thirst Trap'
            ],
            onlyfans: [
              '👣 Feet Pics for Foot Sniffers', 
              '🥒 ASMR Eating Pickles Loudly', 
              '🧪 Selling My Used Bathwater', 
              '🥖 Baking Cookies Completely Naked',
              '🦖 Lingerie Fight with a Cardboard T-Rex',
              '👙 Thirst Trap in a Sparkly Bikini',
              '🔞 Explicit Custom Video Request'
            ],
            tiktok: [
              '🌶️ Eating Ghost Peppers and Sobbing', 
              '🕺 Cringe Dance in Public until Someone Screams', 
              '🗿 Pretending to Be a Statue to Jump-Scare Pedestrians', 
              '👄 Lip-Syncing a Politician\'s Live Meltdown',
              '🛹 Doing a Backflip into a Garbage Can'
            ],
            youtube: [
              '🎨 Reacting to Paint Drying (24-Hour Stream)', 
              '📦 Unboxing a Mystical Occult Crate from the Deep Web', 
              '🥫 Eating a 100-Year-Old Military Ration', 
              '💼 Pranked My Supervisor by Selling Their Office Chair',
              '🎤 10 Hours of Pure Static Noise (Lo-Fi Study Beats)'
            ],
            twitch: [
              '🦖 Hot Tub Stream in a Dinosaur Costume', 
              '🎮 Playing Dark Souls with a Voice-Activated Microwave', 
              '💤 Stream Sleeping for Subscriber Donations', 
              '🍕 Eating an Entire Extra Large Pizza in Under 3 Minutes',
              '🚨 Faking a Swatting Prank (Extremely Dangerous)'
            ],
            twitter: [
              '🥊 Threatening to Fight a Tech Billionaire in a Cage Match', 
              '📂 Leaking Fake Declassified Alien Documents', 
              '🤖 Arguing with an Obvious AI Bot for 12 Hours Straight', 
              '👑 Declaring Myself the Supreme Emperor of a Backyard Micro-nation',
              '🎭 Posting an AI-Generated Crying Apology Video'
            ],
            soundcloud: [
              '🔥 Diss Track targeting my Supervisor', 
              '😭 Sound effect of me sobbing to Lo-Fi piano chords', 
              '💰 Mumble Rap song about Tax Evasion and Crypto scams',
              '🛹 Aggressive Screamo Rap about my Dad\'s Lawnmower'
            ],
            podcast: [
              '🦅 Conspiracy: Are Birds Actually Government Spy Drones?', 
              '🐈 Interviewing My Ex-Partner\'s Confused Cat', 
              '🍍 Explaining why Pineapple belongs on Pizza (4-Hour Debate)',
              '👽 Debate: Is Earth just a Reality Show for Extraterrestrials?'
            ]
          };

          const options = postOptions[channel as keyof typeof postOptions] || ['Selfie'];

          const executePost = () => {
            triggerSound('click');
            const topic = selectedPostType || options[0];
            const looksFactor = gameState.stats.looks / 100;
            const smartsFactor = gameState.stats.smarts / 100;

            // Determine Base Viral Category
            let baseMin = 40;
            let baseMax = 70;
            let typeLabel = "Photo Post";

            if (topic.includes('Teaser') || topic.includes('Selfie')) {
              baseMin = 35; baseMax = 65; typeLabel = "Free Teaser Photo";
            } else if (topic.includes('Bikini') || topic.includes('bathwater') || topic.includes('Feet') || topic.includes('Lingerie') || topic.includes('Nude') || topic.includes('Naked') || topic.includes('Thirst Trap')) {
              baseMin = 30; baseMax = 70; typeLabel = "PPV Photo / Thirst Content";
            } else if (topic.includes('Cringe') || topic.includes('Lip-Syncing') || topic.includes('Backflip') || topic.includes('Prank') || topic.includes('Transition') || topic.includes('Dance')) {
              baseMin = 40; baseMax = 80; typeLabel = "Short Video Clip";
            } else if (topic.includes('Reacting') || topic.includes('Unboxing') || topic.includes('Static') || topic.includes('Vlog') || topic.includes('Review') || topic.includes('Tutorial') || topic.includes('DIY')) {
              baseMin = 50; baseMax = 85; typeLabel = "Long Video Segment";
            } else if (topic.includes('Live') || topic.includes('Stream') || topic.includes('Hot Tub') || topic.includes('Sleep') || topic.includes('Microwave') || topic.includes('Meltdown') || topic.includes('ASMR')) {
              baseMin = 45; baseMax = 75; typeLabel = "Live Stream Broadcast";
            } else if (topic.includes('Diss') || topic.includes('Rant') || topic.includes('Beef') || topic.includes('Expose') || topic.includes('Troll') || topic.includes('Leaking') || topic.includes('Conspiracy') || topic.includes('MLM') || topic.includes('Threatening') || topic.includes('Arguing')) {
              baseMin = 20; baseMax = 90; typeLabel = "Controversial Drama";
            } else {
              baseMin = 40; baseMax = 70; typeLabel = "Behind-the-Scenes Update";
            }

            // Collab check
            let isCollab = topic.includes('Collab') || topic.includes('feud') || topic.includes('Beef');
            let collabBonus = isCollab ? 15 : 0;

            // Calculate score
            let rawScore = Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin;
            let algoScore = Math.max(0, Math.min(100, rawScore + looksFactor * 10 + smartsFactor * 5 + collabBonus));

            // Map score to GDD tiering
            let tier = "AVERAGE";
            let color = "#2196F3"; // Blue
            let emoji = "😐";
            let multiplier = 0.8;
            let fMin = 0.005;
            let fMax = 0.02;
            let happinessChange = 1;
            let fameChange = 0;
            let leakRiskChange = 2;
            let stressChange = 1;
            let famChange = 0;

            if (algoScore <= 25) {
              tier = "FLOP"; color = "#9E9E9E"; emoji = "💀"; multiplier = 0.1; fMin = -0.05; fMax = -0.02;
              happinessChange = -5; stressChange = 5;
            } else if (algoScore <= 40) {
              tier = "POOR"; color = "#795548"; emoji = "😬"; multiplier = 0.3; fMin = -0.02; fMax = 0.0;
              happinessChange = -2; stressChange = 2;
            } else if (algoScore <= 55) {
              tier = "AVERAGE"; color = "#2196F3"; emoji = "😐"; multiplier = 0.8; fMin = 0.005; fMax = 0.02;
              happinessChange = 1;
            } else if (algoScore <= 70) {
              tier = "GOOD"; color = "#8BC34A"; emoji = "🙂"; multiplier = 1.2; fMin = 0.02; fMax = 0.05;
              happinessChange = 3;
            } else if (algoScore <= 82) {
              tier = "TRENDING"; color = "#4CAF50"; emoji = "🔥"; multiplier = 2.5; fMin = 0.05; fMax = 0.12;
              happinessChange = 5; fameChange = 3; stressChange = 2;
            } else if (algoScore <= 92) {
              tier = "VIRAL"; color = "#FF9800"; emoji = "🚀"; multiplier = 6.0; fMin = 0.12; fMax = 0.25;
              happinessChange = 8; fameChange = 8; leakRiskChange = 10; stressChange = 3;
            } else if (algoScore <= 97) {
              tier = "MEGA VIRAL"; color = "#FF5722"; emoji = "🤯"; multiplier = 15.0; fMin = 0.25; fMax = 0.50;
              happinessChange = 10; fameChange = 15; leakRiskChange = 20; stressChange = 5; famChange = -10;
            } else {
              tier = "LEGENDARY"; color = "#FFD700"; emoji = "👑"; multiplier = 40.0; fMin = 0.50; fMax = 1.00;
              happinessChange = 15; fameChange = 25; leakRiskChange = 30; stressChange = 10; famChange = -20;
            }

            // Calculate views, likes, follower details
            let baseViews = 500 + data.followers * 0.05;
            let viewsEnd = Math.floor(baseViews * multiplier);
            let likesEnd = Math.floor(viewsEnd * (0.05 + looksFactor * 0.1 + Math.random() * 0.05));

            let followerChangePercent = Math.random() * (fMax - fMin) + fMin;
            let followersGained = Math.floor(data.followers * followerChangePercent);
            if (data.followers < 100) {
              followersGained = Math.floor((Math.random() * 40 + 10) * multiplier);
            }

            // Earnings logic
            let earningsEnd = 0;
            let newSubs = 0;
            let tipRevenue = 0;
            let platformCut = 0;
            let userShare = 0;

            if (channel === 'onlyfans') {
              newSubs = Math.max(1, Math.floor(followersGained * 0.08));
              earningsEnd = (data.subscriptionPrice || 10) * newSubs;
              if (algoScore >= 70) {
                tipRevenue = Math.floor(Math.random() * 80 + 20);
                earningsEnd += tipRevenue;
              }
              platformCut = Math.floor(earningsEnd * 0.2);
              userShare = earningsEnd - platformCut;
            } else if (data.monetized) {
              earningsEnd = Math.floor((viewsEnd / 1000) * 1.5);
              if (algoScore >= 70) {
                earningsEnd += 300; // ad bonus
              }
              platformCut = Math.floor(earningsEnd * 0.3);
              userShare = earningsEnd - platformCut;
            }

            // Roll 20% check for Bonus Mini-Events
            let bonusEvent = null;
            if (Math.random() < 0.2) {
              const roll = Math.floor(Math.random() * 10);
              if (roll === 0 && (channel === 'onlyfans' || topic.includes('Live') || topic.includes('Stream'))) {
                bonusEvent = {
                  title: "💎 Big Tipper",
                  description: "@RichFan tipped you $500!",
                  extraStats: "+$500 Cash, +5% Happiness",
                  effect: { cashChange: 500, statChanges: { happiness: 5 } }
                };
              } else if (roll === 1 && algoScore >= 82) {
                bonusEvent = {
                  title: "📩 Collab Request",
                  description: "@BigCreator wants to collab on a video!",
                  extraStats: "+3% Fame",
                  effect: { statChanges: { status: 3 } }
                };
              } else if (roll === 2 && algoScore >= 82) {
                bonusEvent = {
                  title: "😡 Hater Raid",
                  description: "A hater army is mass-downvoting your content!",
                  extraStats: "-3% Followers, +5% Stress",
                  effect: { followerLossPercent: 0.03, stress: 5 }
                };
              } else if (roll === 3 && algoScore >= 92) {
                bonusEvent = {
                  title: "📰 Media Pickup",
                  description: "BuzzFeed wrote an article about your post!",
                  extraStats: "+10% Fame, +15% Leak Risk, -5% Family Relations",
                  effect: { statChanges: { status: 10 }, leakRisk: 15, familyRel: -5 }
                };
              } else if (roll === 4 && algoScore >= 70) {
                bonusEvent = {
                  title: "⭐ Platform Feature",
                  description: "Platform featured you on the homepage!",
                  extraStats: "+100 free followers, +20% reach next post",
                  effect: { followersRaw: 100 }
                };
              } else if (roll === 5 && gameState.stats.looks > 80) {
                bonusEvent = {
                  title: "🔪 Stalker DM",
                  description: "Someone sent a threatening message detailing your street address...",
                  extraStats: "+10% Stress, -5% Mental health",
                  effect: { stress: 10, statChanges: { health: -5 } }
                };
              } else if (roll === 6 && (gameState.flags.leakRisk || 0) > 60) {
                bonusEvent = {
                  title: "😰 Ex Leaked It",
                  description: "Your ex posted your private screenshot links to SpicyChat...",
                  extraStats: "+25% Leak Risk, -8% Happiness",
                  effect: { leakRisk: 25, statChanges: { happiness: -8 } }
                };
              } else if (roll === 7 && algoScore >= 92) {
                bonusEvent = {
                  title: "👀 Family Saw It",
                  description: "Your mother liked the post by accident on her feed...",
                  extraStats: "-15% Family Relations, +10% Stress",
                  effect: { familyRel: -15, stress: 10 }
                };
              } else if (roll === 8 && algoScore >= 70 && data.followers > 10000) {
                bonusEvent = {
                  title: "💼 Brand Deal Offer",
                  description: "LingerieBrand wants to sponsor your next channel update!",
                  extraStats: "+$2,000 Cash, +5% Fame",
                  effect: { cashChange: 2000, statChanges: { status: 5 } }
                };
              } else {
                bonusEvent = {
                  title: "🤖 Algorithm Change",
                  description: "Platform changed its feed ordering algorithm unexpectedly!",
                  extraStats: "+5% Stress, ±20% organic fluctuation",
                  effect: { stress: 5 }
                };
              }
            }

            // Set state to trigger the animated modal display
            setSocialPostResult({
              channel,
              typeLabel,
              topic,
              viewsStart: 0,
              viewsEnd,
              likesStart: 0,
              likesEnd,
              followersGained,
              earningsStart: 0,
              earningsEnd: userShare > 0 ? userShare : earningsEnd,
              viralTier: tier,
              viralColor: color,
              viralEmoji: emoji,
              statChanges: {
                happiness: happinessChange,
                fame: fameChange,
                money: userShare > 0 ? userShare : earningsEnd,
                leakRisk: leakRiskChange,
                stress: stressChange,
                family: famChange
              },
              bonusEvent
            });

            // Close post config modal
            setActiveSocialModal(null);
          };


          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-300 flex flex-col">
                <button 
                  onClick={() => { triggerSound('click'); setActiveSocialModal(null); }}
                  className="absolute -top-3 -left-3 z-10 bg-white rounded-full p-1 shadow-lg border border-slate-300 hover:scale-110 transition active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm select-none">✕</div>
                </button>

                <div className="bg-gradient-to-r from-[#d75024] to-[#f55928] py-4 px-6 text-white border-b-4 border-white/20 flex justify-between items-center">
                  <h3 className="font-black text-xl tracking-tight drop-shadow-md flex items-center gap-2">
                    {emojis[channel]} Post
                  </h3>
                  <span className="text-white/70 font-black tracking-widest text-xs uppercase font-mono">Social</span>
                </div>

                <div className="p-6 space-y-5 text-left">
                  <p className="text-sm font-bold text-slate-700">Make a post on {titles[channel]} today!</p>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Pick your post:</label>
                    <div className="relative">
                      <select 
                        value={selectedPostType || options[0]}
                        onChange={(e) => setSelectedPostType(e.target.value)}
                        className="w-full bg-[#f4f3f0] border-2 border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold text-sm outline-none focus:border-indigo-600 transition cursor-pointer appearance-none"
                      >
                        {options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-xs">▼</div>
                    </div>
                  </div>

                  <button 
                    onClick={executePost}
                    className="w-full bg-[#2da641] hover:bg-[#258a36] text-white font-black py-3 rounded-xl transition cursor-pointer text-center text-sm shadow-md"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* SOCIAL MEDIA TROLL MODAL */}
      {activeSocialModal === 'troll' && selectedSocialChannel && (
        (() => {
          const channel = selectedSocialChannel;
          const data = gameState.socialMedia[channel];
          const titles = {
            facebook: 'Facebook', instagram: 'Instagram', onlyfans: 'OnlyFans', tiktok: 'TikTok',
            twitch: 'Twitch', twitter: 'Twitter', soundcloud: 'SoundCloud', podcast: 'Podcast', youtube: 'YouTube'
          };

          const celebrities = ['Usher', 'Kesha', 'Olivia Rodrigo', '@BitLifeApp', 'Taylor Swift'];
          const relatives = (Object.values(gameState.npcs || {}) as any[]).filter(r => !r.isDeceased).map(r => r.name);
          const victims = [...celebrities, ...relatives];

          const executeTroll = () => {
            triggerSound('click');
            const target = selectedVictim || victims[0];
            const isCelebrity = celebrities.includes(target);
            const roll = Math.random();

            let followerChange = 0;
            let happinessChange = 0;
            let trustChange = 0;
            let resentmentChange = 0;
            let outcomeText = "";

            if (isCelebrity) {
              if (roll > 0.6) {
                // Success
                followerChange = Math.floor(Math.random() * 3000) + 500;
                outcomeText = `You made a savage troll post targeting ${target}. It went completely viral and got tons of retweets!`;
              } else if (roll > 0.3) {
                // Ignore/Block
                followerChange = -Math.floor(Math.random() * 500);
                outcomeText = `${target} noticed your comment and immediately blocked you. Your followers laughed at you.`;
              } else {
                // Roasted
                followerChange = -Math.floor(Math.random() * 1500) - 200;
                happinessChange = -15;
                outcomeText = `${target} clapped back at your comment with a brutal, genius burn. You feel humiliated.`;
              }
            } else {
              // Trolling relationships
              trustChange = -25;
              resentmentChange = 30;
              if (roll > 0.5) {
                followerChange = Math.floor(Math.random() * 200) + 50;
                outcomeText = `You trolled your relationship contact, ${target}, with an embarrassing meme. Your followers found it hilarious, but ${target} is extremely angry!`;
              } else {
                followerChange = -Math.floor(Math.random() * 100);
                outcomeText = `You posted a mean troll post targeting ${target}. The community criticized you for picking on someone you know.`;
              }
            }

            const nextStats = { ...gameState.stats };
            if (happinessChange !== 0) nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness + happinessChange));

            let nextRelationships: any[] = [...(Object.values(gameState.npcs || {}) as any[])];
            if (!isCelebrity) {
              nextRelationships = (Object.values(gameState.npcs || {}) as any[]).map(r => {
                if (r.name === target) {
                  return {
                    ...r,
                    trust: Math.max(0, r.trust + trustChange),
                    resentment: Math.min(100, r.resentment + resentmentChange)
                  };
                }
                return r;
              });
            }

            setGameState({
              ...gameState,
              stats: nextStats,
              relationships: nextRelationships as any,
              npcs: Object.fromEntries(nextRelationships.map(r => [r.id, relationshipToNPC(r)])),
              socialMedia: {
                ...gameState.socialMedia,
                [channel]: { ...data, followers: Math.max(0, data.followers + followerChange) }
              },
              log: [...gameState.log, `👹 Trolled ${target} on ${titles[channel]}. Followers change: ${followerChange.toLocaleString()}.`]
            });

            setActiveSocialModal(null);
            setActionPopup({
              isOpen: true,
              title: followerChange >= 0 ? 'Trolling Successful' : 'Troll Outcome',
              message: `${outcomeText}\n\nFollowers: ${followerChange >= 0 ? '+' : ''}${followerChange.toLocaleString()}`
            });
          };

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-300 flex flex-col">
                <button 
                  onClick={() => { triggerSound('click'); setActiveSocialModal(null); }}
                  className="absolute -top-3 -left-3 z-10 bg-white rounded-full p-1 shadow-lg border border-slate-200 hover:scale-110 transition active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm select-none">✕</div>
                </button>

                <div className="bg-gradient-to-r from-[#d75024] to-[#f55928] py-4 px-6 text-white border-b-4 border-white/20 flex justify-between items-center">
                  <h3 className="font-black text-xl tracking-tight drop-shadow-md flex items-center gap-2">
                    👹 Troll
                  </h3>
                  <span className="text-white/70 font-black tracking-widest text-xs uppercase font-mono">Social</span>
                </div>

                <div className="p-6 space-y-5 text-left">
                  <p className="text-sm font-bold text-slate-700">Troll someone on {titles[channel]} today!</p>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Pick your victim:</label>
                    <div className="relative">
                      <select 
                        value={selectedVictim || victims[0]}
                        onChange={(e) => setSelectedVictim(e.target.value)}
                        className="w-full bg-[#f4f3f0] border-2 border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold text-sm outline-none focus:border-indigo-600 transition cursor-pointer appearance-none"
                      >
                        {victims.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-xs">▼</div>
                    </div>
                  </div>

                  <button 
                    onClick={executeTroll}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl transition cursor-pointer text-center text-sm shadow-md"
                  >
                    Troll
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* SOCIAL MEDIA CELEBRITY INTERACTION MODAL */}
      {activeSocialModal === 'celebrity' && selectedSocialChannel && (
        (() => {
          const channel = selectedSocialChannel;
          const data = gameState.socialMedia[channel];
          const titles = {
            facebook: 'Facebook', instagram: 'Instagram', onlyfans: 'OnlyFans', tiktok: 'TikTok',
            twitch: 'Twitch', twitter: 'Twitter', soundcloud: 'SoundCloud', podcast: 'Podcast', youtube: 'YouTube'
          };
          const celebrities = ['Taylor Swift', 'Olivia Rodrigo', 'Usher', 'Kesha', '@BitLifeApp'];

          const executeCelebrityInteraction = () => {
            triggerSound('click');
            const target = selectedCelebrity || celebrities[0];
            const type = celebrityInteractionType || 'reply';
            const roll = Math.random();

            let followerChange = 0;
            let happinessChange = 0;
            let outcomeText = "";

            if (type === 'reply') {
              if (roll > 0.7) {
                followerChange = Math.floor(Math.random() * 2000) + 400;
                outcomeText = `You left a witty reply under ${target}'s latest post. They pinned your reply, giving you a huge boost!`;
              } else {
                followerChange = Math.floor(Math.random() * 200);
                outcomeText = `You replied to ${target}'s post. It got a few likes but was mostly buried in the comments.`;
              }
            } else if (type === 'flirt') {
              if (roll > 0.85) {
                followerChange = Math.floor(Math.random() * 8000) + 1500;
                happinessChange = 15;
                outcomeText = `MIRACLE! ${target} replied to your flirtatious message with a wink emoji! The internet went absolutely crazy.`;
              } else if (roll > 0.4) {
                outcomeText = `You sent a cheesy pickup line to ${target}. They completely ignored it.`;
              } else {
                followerChange = -Math.floor(Math.random() * 1000);
                happinessChange = -5;
                outcomeText = `${target} blocked you for flirting on their professional profile. Awkward.`;
              }
            } else if (type === 'insult') {
              if (roll > 0.6) {
                followerChange = Math.floor(Math.random() * 3000) + 500;
                outcomeText = `You left a hilarious, highly critical insult on ${target}'s page. Fans loved the drama!`;
              } else {
                followerChange = -Math.floor(Math.random() * 2000) - 200;
                happinessChange = -10;
                outcomeText = `${target}'s massive fanbase swarmed your profile, mass-reporting you and leaving nasty comments.`;
              }
            }

            const nextStats = { ...gameState.stats };
            if (happinessChange !== 0) nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness + happinessChange));

            setGameState({
              ...gameState,
              stats: nextStats,
              socialMedia: {
                ...gameState.socialMedia,
                [channel]: { ...data, followers: Math.max(0, data.followers + followerChange) }
              },
              log: [...gameState.log, `⭐ Interacted with ${target} (${type}) on ${titles[channel]}. Followers change: ${followerChange.toLocaleString()}.`]
            });

            setActiveSocialModal(null);
            setActionPopup({
              isOpen: true,
              title: 'Celebrity Interaction',
              message: `${outcomeText}\n\nFollowers: ${followerChange >= 0 ? '+' : ''}${followerChange.toLocaleString()}`
            });
          };

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-300 flex flex-col">
                <button 
                  onClick={() => { triggerSound('click'); setActiveSocialModal(null); }}
                  className="absolute -top-3 -left-3 z-10 bg-white rounded-full p-1 shadow-lg border border-slate-200 hover:scale-110 transition active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm select-none">✕</div>
                </button>

                <div className="bg-gradient-to-r from-[#d75024] to-[#f55928] py-4 px-6 text-white border-b-4 border-white/20 flex justify-between items-center">
                  <h3 className="font-black text-xl tracking-tight drop-shadow-md flex items-center gap-2">
                    ⭐ Celebrity Interaction
                  </h3>
                  <span className="text-white/70 font-black tracking-widest text-xs uppercase font-mono">Social</span>
                </div>

                <div className="p-6 space-y-4 text-left">
                  <p className="text-sm font-bold text-slate-700">Choose your celebrity target & action:</p>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Celebrity:</label>
                    <div className="relative">
                      <select 
                        value={selectedCelebrity || celebrities[0]}
                        onChange={(e) => setSelectedCelebrity(e.target.value)}
                        className="w-full bg-[#f4f3f0] border-2 border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold text-sm outline-none focus:border-indigo-600 transition cursor-pointer appearance-none"
                      >
                        {celebrities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-xs">▼</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Action:</label>
                    <div className="relative">
                      <select 
                        value={celebrityInteractionType || 'reply'}
                        onChange={(e) => setCelebrityInteractionType(e.target.value as any)}
                        className="w-full bg-[#f4f3f0] border-2 border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold text-sm outline-none focus:border-indigo-600 transition cursor-pointer appearance-none"
                      >
                        <option value="reply">💬 Leave Witty Reply</option>
                        <option value="flirt">❤️ Flirt with Them</option>
                        <option value="insult">🔥 Troll / Insult Them</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-xs">▼</div>
                    </div>
                  </div>

                  <button 
                    onClick={executeCelebrityInteraction}
                    className="w-full bg-[#2da641] hover:bg-[#258a36] text-white font-black py-3 rounded-xl transition cursor-pointer text-center text-sm shadow-md mt-2"
                  >
                    Interact
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* VERIFY REJECTION MODAL */}
      {showVerifyRejection && selectedSocialChannel && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border-4 border-sky-400 flex flex-col p-6 text-center">
            
            <h2 className="text-[#0f4a8a] font-black text-2xl tracking-tight mb-4 uppercase mt-2">Who are you?</h2>
            
            <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
              Your attempt to verify your {selectedSocialChannel.charAt(0).toUpperCase() + selectedSocialChannel.slice(1)} account has been rejected.
            </p>

            <button
              onClick={() => { triggerSound('click'); setShowVerifyRejection(false); }}
              className="bg-[#0f4a8a] hover:bg-[#093566] text-white font-black py-2.5 rounded-xl transition cursor-pointer text-sm shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showAppearanceModal && gameState && (
          <AppearanceModal
            currentConfig={gameState.avatarConfig || {
              eyes: 'default',
              eyebrows: 'default',
              mouth: 'smile',
              skinColor: 'ffdbb4',
              hairColor: '2c1b18',
              facialHair: 'none',
              facialHairColor: '2c1b18',
              top: 'shortRound',
              eyesColorSimulated: 'Brown',
              lipsColorSimulated: 'Natural'
            }}
            gender={gameState.gender as 'Male' | 'Female'}
            age={gameState.age}
            onSave={(newConfig) => {
              setGameState({
                ...gameState,
                avatarConfig: newConfig,
                log: [...gameState.log, `💈 Custom Appearance: I updated my personal look!`]
              });
              setShowAppearanceModal(false);
            }}
            onClose={() => setShowAppearanceModal(false)}
            triggerSound={triggerSound}
          />
        )}

      </div>
    </div>
  );
}
