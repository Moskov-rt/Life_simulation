/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Event } from './types';

export const EVENTS_POOL: Event[] = [
  // --- KARMA EVENTS ---
  {
    id: 'karma_stray_cat',
    title: '🐱 Stray Cat',
    text: 'You see a scrawny, shivering stray cat in a back alley. It meows pitifully as you walk by.',
    category: 'general',
    weight: 25,
    choices: [
      {
        id: 'cat_ignore',
        text: 'Ignore the cat and keep walking.',
        effect: {
          outcomeText: 'You ignored the cat. It continues to shiver in the cold.',
          logText: 'Ignored a shivering stray cat in an alley.'
        }
      },
      {
        id: 'cat_pet',
        text: 'Pet it and give it some of your food.',
        effect: {
          statChanges: { karma: 1, happiness: 5 },
          outcomeText: 'The cat purrs loudly and rubs against your leg. You feel a warm sense of compassion in your heart.',
          logText: 'Pet and fed a stray cat. Earned some good karma.'
        }
      },
      {
        id: 'cat_kick',
        text: 'Kick the cat away.',
        effect: {
          statChanges: { karma: -3, happiness: -5 },
          outcomeText: 'You kick the cat! It yowls in pain and runs away. You feel a dark, heavy weight settle on your conscience.',
          logText: 'Cruelly kicked a stray cat. Bad karma.'
        }
      }
    ]
  },
  {
    id: 'karma_school_bully',
    title: '👊 The School Bully',
    text: 'A notorious school bully corners you and demands your lunch money.',
    category: 'general',
    conditions: {
      minAge: 6,
      maxAge: 18
    },
    weight: 25,
    choices: [
      {
        id: 'bully_fight',
        text: 'Beat the bully to a pulp.',
        effect: {
          statChanges: { karma: -1, status: 10, happiness: -5 },
          outcomeText: 'You ruthlessly beat the bully. While your classmates are impressed, you realize violence wasn\'t the best answer.',
          logText: 'Beat up a school bully. Gained status but lost karma.'
        }
      },
      {
        id: 'bully_tell',
        text: 'Refuse and report them to a teacher.',
        effect: {
          statChanges: { karma: 1, happiness: 5, smarts: 2 },
          outcomeText: 'You stood your ground peacefully and informed an adult. The bully is suspended, and you feel good about handling it maturely.',
          logText: 'Reported a school bully to a teacher. Handled it peacefully.'
        }
      }
    ]
  },
  // --- CHILDHOOD / TODDLER YEARS CORE EVENTS ---
  {
    id: 'childhood_first_words',
    title: '🍼 First Word Milestone',
    text: 'Your parents are gathered around your highchair, excitedly coaxing you to say your very first words. Everyone is listening carefully!',
    category: 'general',
    conditions: {
      minAge: 1,
      maxAge: 2
    },
    weight: 50,
    choices: [
      {
        id: 'first_word_mama',
        text: 'Say "Mama"!',
        effect: {
          statChanges: { happiness: 10 },
          repChanges: { family: 15 },
          outcomeText: 'Your mother bursts into tears of joy and wraps you in a warm hug! Your father looks slightly envious but smiles anyway.',
          logText: 'Spoke my first word: "Mama"! My mother was overjoyed.'
        }
      },
      {
        id: 'first_word_dada',
        text: 'Say "Dada"!',
        effect: {
          statChanges: { happiness: 10 },
          repChanges: { family: 15 },
          outcomeText: 'Your father leaps up in celebration and carries you around the room on his shoulders! Your mother record-films the entire thing.',
          logText: 'Spoke my first word: "Dada"! My father was absolutely thrilled.'
        }
      },
      {
        id: 'first_word_gemini',
        text: 'Say "Gemini"!',
        effect: {
          statChanges: { smarts: 15, happiness: 10 },
          repChanges: { family: 5 },
          outcomeText: 'Your parents stare at each other in utter confusion and awe. "Did our baby just name a high-tech AI model?" your dad whispers.',
          logText: 'Spoke my first word: "Gemini"! My parents think I am a genius.'
        }
      },
      {
        id: 'first_word_raspberry',
        text: 'Blow a loud, wet raspberry instead.',
        effect: {
          statChanges: { happiness: 5, looks: 5 },
          outcomeText: 'You blow a massive raspberry, spraying milk everywhere. Your parents laugh and wipe their faces. Classic baby move.',
          logText: 'Blew a loud raspberry instead of speaking. Got laughs all around.'
        }
      }
    ]
  },
  {
    id: 'childhood_wall_mural',
    title: '🖍️ The Wall Masterpiece',
    text: 'You found a set of permanent, colorful markers on the counter. The blank white living room wallpaper looks like the perfect canvas for your creative debut!',
    category: 'general',
    conditions: {
      minAge: 2,
      maxAge: 3
    },
    weight: 50,
    choices: [
      {
        id: 'wall_mural_dog',
        text: 'Blame the family dog.',
        effect: {
          statChanges: { smarts: 10 },
          repChanges: { family: -10 },
          outcomeText: 'Your parents look at the marker drawing, then at the guiltless dog who is sleeping. They don\'t buy it, but they are secretly impressed by your devious imagination.',
          logText: 'Drew a massive wall mural and tried to blame the sleeping dog.'
        }
      },
      {
        id: 'wall_mural_cry',
        text: 'Burst into tears and scream before they can speak.',
        effect: {
          statChanges: { happiness: -5, looks: 5 },
          outcomeText: 'You let out a deafening wail. Startled, your mother immediately comforts you, completely forgetting about the ruined wall for the moment.',
          logText: 'Cried hysterically to preemptively escape trouble for painting the wall.'
        }
      },
      {
        id: 'wall_mural_proud',
        text: 'Proudly present it as modern high art.',
        effect: {
          statChanges: { status: 10 },
          repChanges: { family: -15 },
          outcomeText: 'You gesture dramatically at the scrawls. Your parents sigh heavily, take pictures for social media, and then start scrubbing. You got grounded from markers.',
          logText: 'Presented my wall crayon scribbles as high-concept modern art.'
        }
      },
      {
        id: 'wall_mural_clean',
        text: 'Apologize and try to wipe it off with your sleeve.',
        effect: {
          statChanges: { happiness: 5 },
          repChanges: { family: 15 },
          outcomeText: 'You try to wipe the marker off, smearing it everywhere. Your parents melt at your innocent remorse and help you clean up, saying they love your helpful spirit.',
          logText: 'Remorsefully tried to clean up my wall drawings. Parents forgave me.'
        }
      }
    ]
  },
  {
    id: 'childhood_imaginary_friend',
    title: '🧙‍♂️ The Wizard in the Closet',
    text: 'An invisible wizard named Barnaby has started visiting you from your bedroom closet. He has a sparkling hat and says he can teach you magic spells.',
    category: 'general',
    conditions: {
      minAge: 4,
      maxAge: 5
    },
    weight: 45,
    choices: [
      {
        id: 'imag_friend_parents',
        text: 'Introduce Barnaby to your parents.',
        effect: {
          statChanges: { happiness: 10, status: -5 },
          outcomeText: 'You set a tiny plate for Barnaby at dinner. Your parents smile indulgently, though they exchange worried glances about your hyperactive imagination.',
          logText: 'Introduced my invisible closet wizard friend, Barnaby, to my parents at dinner.'
        }
      },
      {
        id: 'imag_friend_spells',
        text: 'Keep his secrets and practice "magic spells" with him.',
        effect: {
          statChanges: { happiness: -25, willpower: -15, health: -10 },
          outcomeText: 'You close your eyes to focus on the spell, but suddenly you feel cold, bony fingers grab your arm! Barnaby isn\'t a friendly wizard, he\'s a terrifying closet ghost! You scream for your parents and refuse to sleep in that room for a month.',
          logText: 'Tried to learn magic from Barnaby the closet wizard, but he turned out to be a terrifying ghost that grabbed me.'
        }
      },
      {
        id: 'imag_friend_creepy',
        text: 'Tell Barnaby to go away because he\'s creepy.',
        effect: {
          statChanges: { happiness: 5, willpower: 15 },
          outcomeText: 'You stand in front of the closet, put your hands on your hips, and order him out. You feel brave, independent, and sleep much better now.',
          logText: 'Banished my imaginary closet wizard after deciding he was too creepy.'
        }
      }
    ]
  },
  {
    id: 'childhood_first_pet',
    title: '🐶 Choosing a Furry Friend',
    text: 'Your parents take you to the neighborhood animal shelter to pick out your very first childhood pet! There are so many cute options looking back at you.',
    category: 'general',
    conditions: {
      minAge: 5,
      maxAge: 6
    },
    weight: 50,
    choices: [
      {
        id: 'pet_puppy',
        text: 'Choose the high-energy golden puppy.',
        effect: {
          statChanges: { happiness: 15, health: 10 },
          outcomeText: 'The puppy licks your face instantly! You name him Buster. You spend the whole year running around the backyard together, staying extremely active.',
          logText: 'Adopted an energetic golden puppy named Buster. We are inseparable.'
        }
      },
      {
        id: 'pet_cat',
        text: 'Choose the sleepy, intellectual senior cat.',
        effect: {
          statChanges: { happiness: 15, smarts: 10 },
          outcomeText: 'The cat purrs quietly and curls up in your lap. You name her Cleo. She watches you read and do puzzle blocks, providing calm companionship.',
          logText: 'Adopted a serene, wise older cat named Cleo.'
        }
      },
      {
        id: 'pet_iguana',
        text: 'Choose the exotic, spiked green iguana.',
        effect: {
          statChanges: { status: 15, smarts: 5 },
          outcomeText: 'You choose the majestic lizard and name him Godzilla. All the neighborhood kids think you are the coolest kid on the block for having an iguana!',
          logText: 'Adopted a cool green iguana named Godzilla.'
        }
      },
      {
        id: 'pet_rock',
        text: 'Insist that you only want to adopt a Pet Rock.',
        effect: {
          statChanges: { willpower: 20, status: -10 },
          outcomeText: 'You refuse all animals and pick up a smooth grey stone from the shelter garden, naming it "Rocky". Your parents are baffled by your absolute stubborness.',
          logText: 'Rejected real pets to adopt a smooth grey stone named Rocky.'
        }
      }
    ]
  },
  {
    id: 'childhood_playground_dare',
    title: '🛹 The Schoolyard Dare',
    text: 'During recess, a group of kids surrounds you. They dare you to eat a live earthworm and a scoop of soil in exchange for a shiny $5 bill.',
    category: 'general',
    conditions: {
      minAge: 7,
      maxAge: 9,
      customCheck: (state: any) => state.career.type === 'school'
    },
    weight: 45,
    choices: [
      {
        id: 'dare_eat',
        text: 'Eat it with absolute pride and collect the cash!',
        effect: {
          statChanges: { status: 20, health: -15 },
          outcomeText: 'You swallow it whole! The crowd erupts in cheers and disgust. You pocket the $5, though your stomach feels extremely uneasy for the next three days.',
          logText: 'Ate a live earthworm on a recess dare. Earned $5 and schoolyard status but ruined my stomach.'
        }
      },
      {
        id: 'dare_refuse',
        text: 'Decline and tell them they are incredibly immature.',
        effect: {
          statChanges: { smarts: 10, willpower: 15, status: -5 },
          outcomeText: 'You walk away with your head high. They call you a chicken, but you know you preserved your digestive tract and maintained your self-respect.',
          logText: 'Declined a playground dare to eat dirt, prioritizing my hygiene.'
        }
      },
      {
        id: 'dare_double',
        text: 'Double-dare them to eat it instead for $10.',
        effect: {
          statChanges: { status: 15, smarts: 15 },
          outcomeText: 'You turn the tables! Shaken, the ringleader backpedals in embarrassment, making you look like the master strategist of the playground.',
          logText: 'Successfully turned a playground dare back onto the instigator.'
        }
      }
    ]
  },
  {
    id: 'childhood_lost_megamart',
    title: '🛒 Lost in the Mega-Mart',
    text: 'You let go of your mother\'s shopping cart for a single second to look at a toy shelf, and now she is completely out of sight. You are alone in a massive store!',
    category: 'general',
    conditions: {
      minAge: 6,
      maxAge: 8
    },
    weight: 40,
    choices: [
      {
        id: 'lost_cry',
        text: 'Sit on the floor and cry as loudly as possible.',
        effect: {
          statChanges: { happiness: -10, status: -5 },
          outcomeText: 'You wail on the floor. Within minutes, a crowd gathers and a security guard pages your parents over the intercom. Your mother runs over, hugging you tightly.',
          logText: 'Got lost in the store and wailed on the floor until found.'
        }
      },
      {
        id: 'lost_employee',
        text: 'Stay calm and locate a store employee with a name tag.',
        effect: {
          statChanges: { smarts: 15, willpower: 15 },
          outcomeText: 'You walk up to a cashier and politely say you lost your mother. They make a professional intercom announcement, and you are reunited safely.',
          logText: 'Handles being lost in a megamart with mature composure and employee assistance.'
        }
      },
      {
        id: 'lost_play_toys',
        text: 'Take advantage of this and start unboxing toys to play.',
        effect: {
          statChanges: { happiness: 20, karma: -15 },
          outcomeText: 'You rip open a brand-new racing track set and play happily on the aisle floor until a frantic security guard and your weeping parents find you.',
          logText: 'Used being lost in a toy store as an opportunity to open and play with premium toys.'
        }
      }
    ]
  },
  {
    id: 'childhood_shattered_window',
    title: '⚾ The Shattered Window',
    text: 'While playing street baseball with neighborhood kids, you hit a massive home run. The ball smashes directly through the front window of grumpy Mrs. Gable!',
    category: 'general',
    conditions: {
      minAge: 9,
      maxAge: 11
    },
    weight: 45,
    choices: [
      {
        id: 'window_run',
        text: 'Scram! Run away with your friends and stay quiet.',
        effect: {
          statChanges: { status: 10, karma: -20 },
          repChanges: { family: -10 },
          outcomeText: 'You sprint down the alleyway and hide. Nobody saw who hit it, but you live with a nagging sense of guilt every time you walk past her house.',
          logText: 'Smashed a neighbor\'s window with a baseball and ran away in silence.'
        }
      },
      {
        id: 'window_confess',
        text: 'Knock on Mrs. Gable\'s door and confess immediately.',
        effect: {
          statChanges: { karma: 3, willpower: 20 },
          outcomeText: 'Mrs. Gable is stunned by your absolute honesty. Instead of yelling, she thanks you for your courage but insists you help her mow her lawn to pay for the glass.',
          logText: 'Confessed to breaking Mrs. Gable\'s window. Agreed to mow lawns to pay for repairs.'
        }
      },
      {
        id: 'window_blame',
        text: 'Point and blame your classmate instead.',
        effect: {
          statChanges: { status: -15, karma: -25 },
          outcomeText: 'You try to shift blame, but Mrs. Gable sees right through you. She calls your parents immediately, and your friends now label you a liar and a snitch.',
          logText: 'Tried to blame a classmate for a broken window. Got caught and lost peer trust.'
        }
      }
    ]
  },

  // --- CHILDHOOD BULLEY CHAIN (PERSISTENT MEMORY) ---
  {
    id: 'bully_childhood_marcus',
    title: 'The Schoolyard Shadow',
    text: 'A larger kid in class, Marcus, has cornered you during recess, demanding your lunch money and making fun of your outfit.',
    category: 'bully',
    conditions: {
      minAge: 8,
      maxAge: 12,
      flagsFalse: ['confronted_marcus', 'bullied_by_marcus'],
      customCheck: (state: any) => state.career.type === 'school'
    },
    weight: 25,
    choices: [
      {
        id: 'bully_attack',
        text: 'Attack him! (Initiate Interactive Fight)',
        effect: {
          statChanges: { status: 5 },
          flagsSet: { tried_attacking_marcus: true },
          outcomeText: 'You lunged at Marcus! Time to throw some moves...',
          logText: 'Decided to physically confront Marcus.'
        }
      },
      {
        id: 'bully_stand_up',
        text: 'Stand up to him verbally.',
        effect: {
          statChanges: { happiness: 5, status: 10 },
          flagsSet: { confronted_marcus_verbally: true },
          outcomeText: 'You stood your ground and told him you aren\'t afraid of him. Marcus shoved you into a bush and laughed, but your peers noticed your courage and respect you for speaking up.',
          logText: 'Stood up verbally to Marcus.'
        }
      },
      {
        id: 'bully_parents',
        text: 'Tell your parents about the harassment.',
        effect: {
          statChanges: { happiness: -5, smarts: 5 },
          repChanges: { family: 15 },
          flagsSet: { told_parents_marcus: true },
          outcomeText: 'You told your parents. They accepted the news, comforted you, and spoke to the principal. The school looked into it but did nothing. However, Marcus\'s father found out and forced Marcus to apologize, though he still glares at you from afar.',
          logText: 'Informed parents about Marcus\'s schoolyard bullying.'
        }
      },
      {
        id: 'bully_endure',
        text: 'Let it go (Walk away and endure in silence).',
        effect: {
          statChanges: { happiness: -15, status: -10 },
          flagsSet: { bullied_by_marcus: true },
          outcomeText: 'You decided to let it go and walked away in silence, giving him a small portion of your pocket change. He sneers and calls you a coward, but you avoided a physical beating.',
          logText: 'Chose to let it go and walk away from Marcus.'
        }
      }
    ]
  },
  {
    id: 'bully_callback_marcus_successful',
    title: 'An Unexpected Request',
    text: 'Out of the blue, you receive a LinkedIn connection request from Marcus—the schoolyard bully. His profile shows he is now a Senior Vice President of Sales. He added a short message: "Hey, I was thinking about the old days. I would love to grab a coffee and catch up. My treat!"',
    category: 'callback',
    conditions: {
      minAge: 22,
      maxAge: 35,
      flagsTrue: ['bullied_by_marcus']
    },
    weight: 20,
    choices: [
      {
        id: 'marcus_coffee_accept',
        text: 'Meet him for coffee to see if he has truly changed.',
        effect: {
          statChanges: { happiness: 15, smarts: 10 },
          repChanges: { online: 5 },
          flagsSet: { reconciled_with_marcus: true },
          outcomeText: 'You sit down at a local cafe. Marcus looks genuinely remorseful, apologizes sincerely for how he treated you, and even offers to refer you for a position in his company. You feel a deep weight lift.',
          logText: 'Met with Marcus for coffee and accepted his sincere apology.'
        }
      },
      {
        id: 'marcus_coffee_reject',
        text: 'Decline and send a blunt message reminding him of his cruelty.',
        effect: {
          statChanges: { happiness: 10, status: 5 },
          flagsSet: { rejected_marcus: true },
          outcomeText: 'You reply: "You made my life miserable for years. I have no interest in catching up." You then block him. It feels remarkably satisfying.',
          logText: 'Rejected Marcus\'s request to catch up, reminding him of his bullying.'
        }
      },
      {
        id: 'marcus_coffee_ignore',
        text: 'Ignore the request entirely.',
        effect: {
          statChanges: { smarts: 5 },
          outcomeText: 'You hit "Ignore" and go about your day. Some ghosts of the past are best left buried in silence.',
          logText: 'Ignored a message from childhood bully Marcus.'
        }
      }
    ]
  },
  {
    id: 'bully_callback_marcus_confronted',
    title: 'The Playground Rivalry Resurfaces',
    text: 'At a professional networking event, you run into Marcus—the bully you once traded punches with as a kid. He looks at your name tag, chuckles, and says, "Well look who it is! Still got that fiery temper, or have you learned to relax?"',
    category: 'callback',
    conditions: {
      minAge: 22,
      maxAge: 35,
      flagsTrue: ['confronted_marcus']
    },
    weight: 20,
    choices: [
      {
        id: 'marcus_confront_polite',
        text: 'Smile professionally and say, "We were kids, Marcus. Glad we both grew up."',
        effect: {
          statChanges: { status: 15, smarts: 10 },
          repChanges: { workplace: 15 },
          outcomeText: 'Your mature response disarms him completely. Several bystanders nod in approval of your poise. Marcus looks slightly embarrassed and wanders off.',
          logText: 'Politely defused a run-in with Marcus at a networking event.'
        }
      },
      {
        id: 'marcus_confront_aggr',
        text: 'Stare him down and reply, "I still have it if you want to test it again."',
        effect: {
          statChanges: { happiness: 10, status: -5, looks: -5 },
          repChanges: { workplace: -10 },
          outcomeText: 'A tense silence falls over the circle. Marcus sneers, "Still a hothead, I see," and walks away. The nearby colleagues look uncomfortable with your confrontational tone.',
          logText: 'Verbally threatened Marcus when reunited at a professional event.'
        }
      }
    ]
  },

  // --- RELATIONSHIP COLLISION EVENT ---
  {
    id: 'collision_partner_jealousy',
    title: 'The Jealous Confrontation',
    text: 'Your partner has gone through your phone while you were asleep and found text messages exchange with a close coworker. Although innocent, they demand that you block the coworker immediately.',
    category: 'collision',
    conditions: {
      hasRelationshipType: 'partner',
      hasRelationshipArchetype: 'jealous partner'
    },
    weight: 30,
    choices: [
      {
        id: 'jealous_agree',
        text: 'Apologize and block the coworker to keep the peace.',
        effect: {
          statChanges: { happiness: -10, status: -5 },
          repChanges: { workplace: -10 },
          relationshipChanges: { target: 'current', trust: 15, suspicion: -20 },
          outcomeText: 'Your partner calms down, feeling reassured, but your dynamic with your coworker at work becomes awkward and strained.',
          logText: 'Blocked a coworker to satisfy a partner\'s jealousy.'
        }
      },
      {
        id: 'jealous_refuse',
        text: 'Refuse to block them, arguing that trust is vital in a relationship.',
        effect: {
          statChanges: { happiness: -15 },
          relationshipChanges: { target: 'current', trust: -10, resentment: 25, suspicion: 15 },
          outcomeText: 'A massive argument erupts. Your partner slams the door, muttering about betrayal and lack of respect for their boundaries.',
          logText: 'Stood your ground against your partner\'s jealous demands.'
        }
      },
      {
        id: 'jealous_confront_archetype',
        text: 'Address their insecurity directly and suggest couples therapy.',
        effect: {
          statChanges: { smarts: 10, happiness: -5 },
          relationshipChanges: { target: 'current', trust: 5, resentment: -10 },
          outcomeText: 'They are defensive at first, but your calm, constructive tone helps de-escalate. They reluctantly admit they have past trust issues to work on.',
          logText: 'Suggested counseling to address partner\'s insecurity.'
        }
      }
    ]
  },

  // --- ACADEMIC / SCHOOL EVENTS ---
  {
    id: 'school_exam_cheat',
    title: 'The Tempting Cheat Sheet',
    text: 'A crucial advanced chemistry exam is tomorrow, and you feel completely unprepared. A classmate slips you a detailed cheat sheet in the locker room.',
    category: 'school',
    conditions: {
      minAge: 14,
      maxAge: 18,
      customCheck: (state: any) => state.career.type === 'school'
    },
    weight: 15,
    choices: [
      {
        id: 'cheat_use',
        text: 'Use the cheat sheet during the exam.',
        effect: {
          statChanges: { smarts: 10, happiness: 15 },
          repChanges: { family: 5 },
          flagsSet: { cheated_on_exam: true },
          outcomeText: 'You successfully cheat and score an A! Your parents are thrilled with your grades, but you live in constant paranoia of being discovered.',
          logText: 'Cheated on an advanced chemistry exam.'
        }
      },
      {
        id: 'cheat_refuse',
        text: 'Toss the sheet away and pull an all-nighter studying.',
        effect: {
          statChanges: { health: -10, smarts: 15, happiness: -5 },
          outcomeText: 'You study until 4 AM. Exhausted, you manage to scrape together a respectable B-. You feel proud of your integrity, though your head is pounding.',
          logText: 'Studied with integrity and earned a B-.'
        }
      },
      {
        id: 'cheat_report',
        text: 'Report the student who distributed the cheat sheet.',
        effect: {
          statChanges: { status: -15 },
          repChanges: { family: 10, college: 15 },
          outcomeText: 'The administration launches an investigation. Word spreads that you are the whistleblower; while teachers and family commend you, your peers shun you in the halls.',
          logText: 'Reported exam cheating to school administration.'
        }
      }
    ]
  },

  // --- CAREER / WORKPLACE EVENTS ---
  {
    id: 'career_credit_theft',
    title: 'The Stolen Presentation',
    text: 'During a major company meeting, your manager presents your research slide-for-slide, taking absolute credit for the breakthrough and receiving high praise from the executives.',
    category: 'career',
    conditions: {
      minAge: 21,
      flagsFalse: ['confronted_boss_theft']
    },
    weight: 15,
    choices: [
      {
        id: 'theft_confront',
        text: 'Speak up in the meeting: "I am glad you found my research so useful, Boss."',
        effect: {
          statChanges: { status: 15, happiness: 5 },
          repChanges: { workplace: -10 },
          flagsSet: { confronted_boss_theft: true },
          outcomeText: 'The room goes dead silent. The executives look intrigued; your boss turns beet red and quickly moves to the next slide. Afterwards, your boss pulls you aside, furious but cautious.',
          narrativeVariants: { chaotic: [
            { text: 'Early in your career, speaking up feels like stepping onto a ledge. The executives notice the truth, and your manager notices that you are no longer easy to erase.', careerGroups: ['corporate'], maxAge: 30 },
            { text: 'After years of work, you recognize the cost of letting someone else own your contribution. The room understands your meaning immediately, even if your manager never forgives the interruption.', careerGroups: ['corporate'], minAge: 40 },
            { text: 'You reclaim the work in front of everyone. The victory is real, but so is the knowledge that tomorrow you still have to work for the person you embarrassed.', minReputation: { workplace: 40 } }
          ] },
          logText: 'Publicly claimed ownership of research during a meeting.'
        }
      },
      {
        id: 'theft_silent',
        text: 'Keep quiet and let them take the credit to secure your standing.',
        effect: {
          statChanges: { happiness: -20, status: -5 },
          repChanges: { workplace: 15 },
          outcomeText: 'You nod along with the praise. Your boss gives you a subtle, grateful wink. You got a reputation as a loyal team player, but the resentment burns deep.',
          narrativeVariants: { chaotic: [
            { text: 'You protect a job you cannot afford to lose, smiling while someone else receives the applause. Security wins today; resentment comes home with you.', wealthBands: ['struggling', 'stable'] },
            { text: 'You let the meeting move on without correcting the record. The choice preserves your standing, but it makes your own ambition feel increasingly difficult to ignore.', careerGroups: ['corporate'], minAge: 30 },
            { text: 'Your manager rewards the silence with warmer treatment. It is a useful advantage, bought with a piece of professional pride.' }
          ] },
          logText: 'Let your manager take credit for your work.'
        }
      },
      {
        id: 'theft_hr',
        text: 'Quietly compile evidence and file an official complaint with HR.',
        effect: {
          statChanges: { smarts: 5, happiness: -5 },
          repChanges: { workplace: 5 },
          outcomeText: 'HR begins a formal investigation. The process is slow and bureaucratic, adding tension to your daily routine, but you feel justified in taking the legal route.',
          narrativeVariants: { chaotic: [
            { text: 'You document every file, timestamp, and revision before contacting HR. The process is exhausting, but experience has taught you that memory alone rarely protects an employee.', careerGroups: ['corporate'], minAge: 35 },
            { text: 'The complaint enters a system designed to move slowly. You spend the following weeks balancing ordinary work with the quiet fear of retaliation.', maxAge: 34 },
            { text: 'HR opens a case and your evidence holds together. Nothing resolves quickly, but you have stopped carrying the injustice alone.' }
          ] },
          logText: 'Filed an HR complaint against manager for credit theft.'
        }
      }
    ]
  },

  // --- ONLINE / SOCIAL REPUTATION ---
  {
    id: 'online_viral_drama',
    title: 'The Viral Misunderstanding',
    text: 'An old, sarcastic comment you wrote online has been taken completely out of context and is gaining rapid traction in local forums, with users calling you insensitive.',
    category: 'general',
    conditions: {
      minAge: 16,
    },
    weight: 15,
    choices: [
      {
        id: 'online_apologize',
        text: 'Draft a sincere, public apology explaining your intent.',
        effect: {
          statChanges: { happiness: -10, status: -5 },
          repChanges: { online: 15, family: 5 },
          outcomeText: 'Your apology is well-received by reasonable observers. The backlash cools down, although a few trolls continue to leaves comments on your profile.',
          narrativeVariants: { positive: [{ text: 'Your explanation reaches people willing to listen. The pile-on loses momentum, leaving only a few stubborn trolls behind.' }, { text: 'A careful apology changes the tone of the conversation. By evening, more people are sharing your clarification than the original outrage.' }] },
          logText: 'Apologized publicly for an old online post.'
        }
      },
      {
        id: 'online_defiant',
        text: 'Double down and mock the outrage as sensitive "cancel culture".',
        effect: {
          statChanges: { happiness: 10, status: 15 },
          repChanges: { online: -25, family: -15 },
          outcomeText: 'You gain a small, rowdy following of internet contrarians, but your family is deeply embarrassed by your abrasive posts and local standing is damaged.',
          narrativeVariants: { chaotic: [{ text: 'The post wins you a loud new audience while every family notification feels like a fresh warning. The attention is exhilarating and isolating at once.' }, { text: 'Your replies become a rallying cry for strangers and an embarrassment at home. You gain visibility, but not the kind that feels safe.' }] },
          logText: 'Publicly clashed with critics online, doubling down on comments.'
        }
      },
      {
        id: 'online_ghost',
        text: 'Deactivate your social media accounts and stay completely offline.',
        effect: {
          statChanges: { happiness: 5, smarts: 10 },
          repChanges: { online: -5 },
          outcomeText: 'You turn off the screen. Over the next month, the internet hivemind forgets about you and moves on to another target. Your real-world mental health improves dramatically.',
          narrativeVariants: { positive: [{ text: 'Offline, the noise becomes manageable. The trend finds another target, and you rediscover how quiet your own life can be.' }, { text: 'Stepping away costs a little visibility, but the relief arrives quickly. A month later, the outrage has moved on without you.' }] },
          logText: 'Deactivated online accounts to escape viral outrage.'
        }
      }
    ]
  },

  // --- GENERAL RELATIONSHIP / DATING ---
  {
    id: 'dating_reputation_disaster',
    title: 'The High Society Gala',
    text: 'A wealthy love interest invites you to a prestigious high-society gala. You feel completely out of your depth regarding etiquette and dress code.',
    category: 'relationship',
    conditions: {
      minAge: 18,
    },
    weight: 15,
    choices: [
      {
        id: 'gala_dress_up',
        text: 'Spend a substantial sum ($500) to rent a designer outfit and take etiquette classes.',
        effect: {
          statChanges: { style: 25, status: 20, looks: 15 },
          repChanges: { dating: 20 },
          cashChange: -500,
          outcomeText: 'You look flawless! You glide through conversations with grace, deeply impressing your date and securing their admiration.',
          narrativeVariants: { chaotic: [
            { text: 'Five hundred dollars is a frightening expense, but tonight it buys confidence you could not fake. You enter the room feeling briefly fluent in a world built to intimidate you.', wealthBands: ['struggling', 'stable'] },
            { text: 'The cost barely registers, letting you focus on the social choreography. Your date sees how comfortably you adapt when the room expects polish.', wealthBands: ['wealthy'] },
            { text: 'The clothes and preparation do their job. Beneath the compliments, you wonder how much of the admiration belongs to you and how much belongs to the performance.' }
          ] },
          logText: 'Invested heavily to attend a high-society gala in style.'
        }
      },
      {
        id: 'gala_casual',
        text: 'Go in your standard formal wear, choosing to be your authentic self.',
        effect: {
          statChanges: { happiness: 10, status: -5 },
          repChanges: { dating: -5 },
          outcomeText: 'Your outfit is noticeably dated, drawing subtle snickers from elitist guests. However, your date respects your comfort and genuineness, despite the awkwardness.',
          narrativeVariants: { chaotic: [
            { text: 'You arrive in the best clothes you already own. A few guests notice the difference in money; your date notices that you refused to pretend.', wealthBands: ['struggling', 'stable'] },
            { text: 'You could have bought the room\'s approval, but choose not to. The evening is awkward in places and unexpectedly intimate in others.', wealthBands: ['comfortable', 'wealthy'] },
            { text: 'The outfit draws quiet judgment, yet your date stays close. Their support matters more once you know the room is measuring both of you.' }
          ] },
          logText: 'Attended a gala in modest clothing, staying true to yourself.'
        }
      },
      {
        id: 'gala_fake_it',
        text: 'Fake an illness at the last minute to avoid going.',
        effect: {
          statChanges: { happiness: -15, smarts: 5 },
          repChanges: { dating: -15 },
          outcomeText: 'You stay home in sweatpants, feeling guilty. Your partner is disappointed and suspicious of your sudden "migraine".',
          narrativeVariants: { negative: [
            { text: 'You cancel rather than admit how intimidated you feel. The relief is immediate; the guilt arrives when your date stops asking whether you are all right.' },
            { text: 'Avoiding the gala protects you from one difficult night and creates a harder conversation at home. Your explanation sounds thin even to you.', minAge: 30 },
            { text: 'The excuse works badly. Your partner hears fear as dishonesty, and the missed evening becomes a question about whether you trust them with your insecurity.', requiredFlags: ['career_failure'] }
          ] },
          logText: 'Cancelled a high-profile date at the last minute.'
        }
      }
    ]
  },

  // --- GENERAL EVENTS / FINANCIALS / STYLE ---
  {
    id: 'investment_opportunity',
    title: 'A Whispered Stock Tip',
    text: 'A business acquaintance pulls you aside at a café, excitedly showing you insider tips on an upcoming biotech regulatory approval. "It is a guaranteed double-your-money deal," they whisper.',
    category: 'general',
    conditions: {
      minAge: 18,
    },
    weight: 12,
    choices: [
      {
        id: 'invest_big',
        text: 'Invest a major portion of your cash ($1,000).',
        effect: {
          statChanges: { happiness: 10 },
          cashChange: -1000,
          scheduleDelayedEvent: { eventId: 'investment_resolved_win', delayYears: 2 },
          outcomeText: 'You wire the funds. Your contact smiles and nods. Now, you wait for the regulatory decision in two years.',
          narrativeVariants: { chaotic: [
            { text: 'One thousand dollars is most of your safety net. The transfer leaves your account feeling dangerously small and your future briefly full of possibility.', wealthBands: ['struggling', 'stable'] },
            { text: 'You can absorb the loss, which makes the risk feel almost intellectual. Still, the secrecy around the tip follows you home.', wealthBands: ['wealthy'] },
            { text: 'You send the money and begin the least glamorous part of speculation: waiting two years to learn whether confidence was insight or vanity.', careerGroups: ['corporate'] }
          ] },
          logText: 'Invested $1,000 in a high-risk biotech stock tip.'
        }
      },
      {
        id: 'invest_refuse',
        text: 'Politely decline, citing your preference for index funds.',
        effect: {
          statChanges: { smarts: 10 },
          outcomeText: 'You hold onto your savings. They shrug, muttered something about missed fortunes, and buy another espresso.',
          narrativeVariants: { positive: [
            { text: 'You cannot afford for “guaranteed” to be wrong. Keeping the money feels less exciting than the pitch and far more responsible.', wealthBands: ['struggling', 'stable'] },
            { text: 'You have enough money to take the risk and enough experience to recognize the pressure tactic. You decline without wondering whether caution makes you timid.', wealthBands: ['comfortable', 'wealthy'], minAge: 35 },
            { text: 'You choose predictable savings over somebody else\'s urgency. The acquaintance calls it fear; you recognize it as discipline.' }
          ] },
          logText: 'Declined a risky stock market speculation tip.'
        }
      }
    ]
  },

  // --- DELAYED / RESOLUTION EVENTS ---
  {
    id: 'investment_resolved_win',
    title: 'Biotech Stock Outcome',
    text: 'The biotech company you invested in two years ago has received historic approval from the drug administration! The stock has skyrocketed.',
    category: 'callback',
    choices: [
      {
        id: 'invest_win_ok',
        text: 'Cash out your massive returns.',
        effect: {
          statChanges: { happiness: 30, status: 15 },
          cashChange: 3500, // Recover initial 1000 + 2500 profit
          outcomeText: 'Your investment has paid off handsomely! You cash out with $3,500 in total returns, feeling like a financial genius.',
          narrativeVariants: { positive: [{ text: 'The approval lands, the price surges, and your patience finally has a number attached to it. You cash out before the excitement can turn into greed.' }, { text: 'Two years of uncertainty resolve in a single satisfying sale. For once, the risky decision pays exactly as promised.' }] },
          logText: 'Cashed out a massive $3,500 profit from biotech stocks.'
        }
      }
    ]
  },

  // --- UNHINGED 18+ ADULT EVENTS ---
  {
    id: 'adult_fansite',
    title: 'The Premium Feet Venture 🦶',
    text: 'With rent prices skyrocketing, your closest friend suggests starting a private "Premium Feet" channel to sell high-resolution pictures of your feet. "People pay absolutely crazy money for nice arches, and you don\'t even have to show your face!" they promise.',
    category: 'general',
    conditions: {
      minAge: 18,
      maxAge: 28,
    },
    weight: 25,
    choices: [
      {
        id: 'fansite_start',
        text: 'Start the page under the alias "ToesOfGlory".',
        effect: {
          statChanges: { status: 10, looks: 5, style: 15, happiness: 10 },
          cashChange: 2500,
          repChanges: { family: -20, online: 20 },
          flagsSet: { started_fansite: true },
          outcomeText: 'You start the page and your arch photography goes viral! Foot-connoisseurs rave about your pristine pedicure. You pocket a clean $2,500, though you live in constant terror of your mother ever discovering your side-hustle.',
          narrativeVariants: { chaotic: [{ text: 'The rent is covered before the week is over, but every notification now carries the same question: how much of your private life can stay private?', wealthBands: ['struggling', 'stable'], maxFame: 35 }, { text: 'The money is almost absurdly easy. So is the temptation to let a side hustle become the identity everyone remembers.', wealthBands: ['comfortable', 'wealthy'], minFame: 20 }, { text: 'You make the practical choice and immediately discover that practicality can still feel intimate when strangers are paying attention.', careers: ['creator', 'adult_performer'] }] },
          logText: 'Started an anonymous premium feet-modeling channel to pay the rent.'
        }
      },
      {
        id: 'fansite_decline',
        text: 'Decline. My feet are for walking, not for weirdos.',
        effect: {
          statChanges: { smarts: 5 },
          repChanges: { family: 15 },
          outcomeText: 'You stick to your integrity and decline. Your feet remain private, and your family reputation stays pristine.',
          narrativeVariants: { positive: [{ text: 'With bills waiting, declining feels less like a moral victory than a promise to solve the problem on your own terms.', wealthBands: ['struggling', 'stable'] }, { text: 'You can afford to say no, and the privacy feels worth more than the novelty of easy money.', wealthBands: ['comfortable', 'wealthy'] }, { text: 'You decline without judging the people who said yes. Boundaries are easier to keep when they are yours.', careers: ['creator', 'adult_performer'] }] },
          logText: 'Proudly declined a suggestion to sell feet pictures online.'
        }
      },
      {
        id: 'fansite_accidental',
        text: 'Try to do it, but accidentally upload the photos to your main Instagram.',
        effect: {
          statChanges: { happiness: -40, status: -30 },
          repChanges: { family: -45, online: -35, workplace: -25 },
          flagsSet: { fansite_disaster: true },
          outcomeText: 'OH NO! In a sleep-deprived daze, you post your debut foot album directly to your public Instagram story. Your boss, your uncle, and your old high school chemistry teacher all view it before you delete it. The pure embarrassment is absolute.',
          narrativeVariants: { negative: [{ text: 'The post is deleted, but screenshots outlive the panic. You spend the next month deciding who deserves an explanation and who only wants a story.', careers: ['corporate'], minReputation: { workplace: 20 } }, { text: 'A private experiment becomes public before you have decided what it means. The embarrassment is loud; the questions about money are quieter and harder.', wealthBands: ['struggling', 'stable'] }, { text: 'You learn that anonymity is not the same thing as control. The lesson arrives in every awkward glance afterward.' }] },
          logText: 'Accidentally published intimate foot-modeling photos to personal social media, causing a total social meltdown.'
        }
      }
    ]
  },
  {
    id: 'sugar_proposal',
    title: 'An Offer of Companionship 💎',
    text: 'A wealthy user named "Lord_Bentley_68" slides into your direct messages. He offers a "guaranteed weekly allowance of $4,000" if you accompany him to high-end yachts and exclusive dinners. "No funny business, just beauty and high-class companionship," his message reads.',
    category: 'relationship',
    conditions: {
      minAge: 18,
      maxAge: 32,
    },
    weight: 25,
    choices: [
      {
        id: 'sugar_accept',
        text: 'Accept and become Lord Bentley\'s premier arm candy.',
        effect: {
          statChanges: { style: 25, looks: 15, status: 15, happiness: 20 },
          cashChange: 4000,
          repChanges: { family: -25, dating: -10 },
          flagsSet: { has_sugar_daddy: true },
          outcomeText: 'You accept! You spend a weekend drinking champagne on a triple-deck yacht in Saint-Tropez. Lord Bentley wires you $4,000. It\'s fabulous, but his repetitive stories about his 1980s real-estate conquests are mind-numbing.',
          narrativeVariants: { chaotic: [{ text: 'The allowance changes what “a tight month” means, but the arrangement still asks you to perform a version of yourself at every dinner.', wealthBands: ['struggling', 'stable'], maxAge: 25 }, { text: 'You know how to read a room and how to leave one. The luxury is real; so is the calculation behind every invitation.', wealthBands: ['comfortable', 'wealthy'], minAge: 26 }, { text: 'The arrangement feels glamorous until you notice how often companionship is being treated like a service with a return policy.', careers: ['creator', 'adult_performer'] }] },
          logText: 'Became a companion to an elderly billionaire for a lavish allowance.'
        }
      },
      {
        id: 'sugar_scam',
        text: 'Try to pocket his upfront deposit and then block him immediately.',
        effect: {
          statChanges: { smarts: 15, happiness: 15 },
          cashChange: 1500,
          repChanges: { online: -15 },
          flagsSet: { scammed_sugar: true },
          outcomeText: 'You talk him into sending a $1,500 "travel deposit" first, then immediately block him. Hustling the billionaire feels absolutely amazing!',
          narrativeVariants: { chaotic: [{ text: 'The deposit solves an immediate problem and creates a longer memory: you are proud of the nerve, uneasy about the person it required you to become.', wealthBands: ['struggling', 'stable'] }, { text: 'The money is less important than proving you could outmaneuver someone who assumed you were for sale.', wealthBands: ['comfortable', 'wealthy'] }, { text: 'You call it a hustle until the story starts sounding like a warning when you tell it later.', careers: ['creator', 'adult_performer'] }] },
          logText: 'Scammed an online sugar-dating solicitor out of a $1,500 deposit.'
        }
      },
      {
        id: 'sugar_reject',
        text: 'Report his account and delete the message.',
        effect: {
          statChanges: { smarts: 5, status: 5 },
          repChanges: { family: 10 },
          outcomeText: 'You hit report and block. You don\'t need easy money; you are building a real career.',
          narrativeVariants: { positive: [{ text: 'You choose the slower path because you want a life whose best opportunities do not depend on pretending to be available.', careers: ['corporate', 'education', 'medical'] }, { text: 'The message is deleted, and the evening returns to ordinary work. Ordinary suddenly feels like a choice rather than a limitation.', wealthBands: ['struggling', 'stable'] }, { text: 'You report the account, keep the evidence, and move on without turning the encounter into your identity.', minAge: 26 }] },
          logText: 'Rejected and reported an unsolicited sugar-companion proposal.'
        }
      }
    ]
  },
  {
    id: 'wild_underground_rave',
    title: 'The Warehouse Rave 🎪',
    text: 'You are invited to an exclusive, secret masquerade rave in an abandoned industrial slaughterhouse. The dress code is "exquisite leather" and the entry password is "forbidden".',
    category: 'general',
    conditions: {
      minAge: 18,
    },
    weight: 25,
    choices: [
      {
        id: 'rave_drink',
        text: 'Drink the neon-pink cocktail handed to you by someone in a unicorn mask.',
        effect: {
          statChanges: { happiness: 35, looks: -10, health: -15, style: 20 },
          repChanges: { online: -10 },
          flagsSet: { drank_mysterious_punch: true },
          outcomeText: 'The drink tastes like carbonated static electricity. You spend the next six hours dancing like an absolute deity, convinced you can speak to spirits. You wake up on a stranger\'s lawn wearing neon body paint and half a shoe.',
          logText: 'Drank a highly suspicious neon cocktail at an underground masquerade rave, leading to a legendary but chaotic night.'
        }
      },
      {
        id: 'rave_strip',
        text: 'Tear off your shirt and lead a wild table-dancing ring.',
        effect: {
          statChanges: { happiness: 25, status: 15, looks: 10 },
          repChanges: { family: -10, online: -20 },
          flagsSet: { table_dancer: true },
          outcomeText: 'You jump on a rusty metal table and start dancing. The crowd goes wild, chanting your name! Unfortunately, someone records it and posts it to a local gossip page. Your grandmother left you a very concerned voicemail.',
          logText: 'Performed an impromptu, unhinged table dance at a warehouse party.'
        }
      },
      {
        id: 'rave_chill',
        text: 'Stay in the corner, sip tap water, and judge everyone silently.',
        effect: {
          statChanges: { smarts: 15, happiness: -5, health: 5 },
          repChanges: { family: 5 },
          outcomeText: 'You remain sober and observant. Watching people in expensive suits bicker with inflatable pool floats is highly entertaining, though your feet are sore from standing.',
          logText: 'Attended a warehouse party but stayed completely sober as an analytical observer.'
        }
      }
    ]
  },
  {
    id: 'sketchy_tattoo_parlor',
    title: 'The Sunrise Mistake 🎨',
    text: 'You wake up at 5:00 AM sitting in a sketchy, neon-lit tattoo parlor. A heavily pierced artist named "Sledge" is sanitizing a needle. "Alright pal, you paid cash upfront. We doing the giant lower-back tattoo of a crying bald eagle or what?"',
    category: 'general',
    conditions: {
      minAge: 18,
    },
    weight: 25,
    choices: [
      {
        id: 'tattoo_eagle',
        text: 'Double down! Give me that crying eagle.',
        effect: {
          statChanges: { happiness: 30, style: -15, looks: -10 },
          repChanges: { family: -15 },
          flagsSet: { bald_eagle_tattoo: true },
          outcomeText: 'Sledge does a masterclass. You now have a massive, hyper-realistic bald eagle crying a single tear over an American flag on your lower back. It is incredibly tacky, but you kind of love it.',
          logText: 'Got a giant, highly questionable lower-back tattoo of a crying bald eagle.'
        }
      },
      {
        id: 'tattoo_face',
        text: 'Change plans: pierce my septum and my eyebrow instead!',
        effect: {
          statChanges: { style: 25, looks: 5, happiness: 15 },
          repChanges: { workplace: -15, family: -10 },
          flagsSet: { face_pierced: true },
          outcomeText: 'You walk out of the parlor with fresh steel in your face. It hurts like crazy to sneeze, but your edgy aesthetic is now off the charts.',
          logText: 'Acquired bold eyebrow and septum piercings on a midnight whim.'
        }
      },
      {
        id: 'tattoo_escape',
        text: 'Panic, scream, and bolt out of the shop.',
        effect: {
          statChanges: { happiness: -15, smarts: 5, status: -5 },
          cashChange: -150,
          outcomeText: 'You sprint out the door into the cold morning air, leaving your $150 deposit behind. Your skin is intact, but your dignity is severely bruised.',
          logText: 'Fled a sketchy tattoo parlor in sheer panic at dawn.'
        }
      }
    ]
  },
  {
    id: 'boss_spouse_affair',
    title: 'The Dangerously Flirtatious Dinner 🥂',
    text: 'At your company\'s annual corporate gala, your division vice-president\'s attractive spouse corners you near the chocolate fountain. They lock eyes, bite their lip, and whisper: "My partner is so incredibly boring. Want to sneak out to the parking lot and look at the stars?"',
    category: 'collision',
    conditions: {
      minAge: 21,
      flagsFalse: ['fired_from_affair']
    },
    weight: 25,
    choices: [
      {
        id: 'affair_accept',
        text: 'Sneak out with them. YOLO.',
        effect: {
          statChanges: { happiness: 30, looks: 5 },
          repChanges: { workplace: -30, family: -20 },
          flagsSet: { affair_active: true },
          scheduleDelayedEvent: { eventId: 'affair_fallout', delayYears: 1 },
          outcomeText: 'The parking lot is freezing, but the chemistry is boiling. You spend an unforgettable hour in the back of a luxury SUV. The thrill is unmatched, but your career now rests on a razor\'s edge.',
          narrativeVariants: { chaotic: [
            { text: 'You mistake being desired for being untouchable. The secret feels intoxicating tonight, while tomorrow\'s workplace consequences remain just far enough away to ignore.', maxAge: 30 },
            { text: 'You know exactly how much professional history this could destroy and go anyway. Experience does not prevent the mistake; it only makes the stakes clearer.', minAge: 40, careerGroups: ['corporate'] },
            { text: 'The encounter gives you the rush you wanted and a secret that now owns part of every future meeting. Ambition and impulse have become enemies.' }
          ] },
          logText: 'Began a highly reckless secret affair with the boss\'s spouse.'
        }
      },
      {
        id: 'affair_decline',
        text: 'Decline politely and excuse yourself to the restroom.',
        effect: {
          statChanges: { smarts: 15, status: 10 },
          repChanges: { workplace: 20, family: 15 },
          outcomeText: 'You pull back, stammer an excuse about having to check on a spreadsheet, and walk away. It was a close call, but your career and family standings remain safe.',
          narrativeVariants: { positive: [
            { text: 'You leave before attraction becomes a decision other people must pay for. The restraint feels unglamorous and deeply adult.', minAge: 30 },
            { text: 'Your career is finally gaining traction, and you refuse to hand its future to one reckless hour. The temptation passes; the relief stays.', careerGroups: ['corporate'], maxAge: 35 },
            { text: 'You step away from the invitation and from the version of yourself that wanted the danger. Nothing explodes, which is its own kind of victory.' }
          ] },
          logText: 'Prudently declined an inappropriate advance from a boss\'s spouse.'
        }
      },
      {
        id: 'affair_blackmail',
        text: 'Record their advance on your phone and use it as leverage for a promotion.',
        effect: {
          statChanges: { smarts: 20, status: 15 },
          repChanges: { workplace: -10, family: -10 },
          flagsSet: { blackmailing_boss: true },
          outcomeText: 'You discreetly activate your voice recorder. Armed with this audio, you drop a subtle hint during your performance review. Your boss looks terrified and promises your promotion is "being accelerated".',
          narrativeVariants: { chaotic: [
            { text: 'You convert an inappropriate advance into leverage. The accelerated promotion arrives carrying the knowledge that your new authority began as a threat.', careerGroups: ['corporate'] },
            { text: 'The recording protects you and compromises you at the same time. Your boss yields, but every later success now has a shadow beside it.', minReputation: { workplace: 40 } },
            { text: 'You win the negotiation without ever naming it. The power feels useful, corrosive, and difficult to put down.' }
          ] },
          logText: 'Blackmailed the vice-president using recorded advances from their spouse to secure a promotion.'
        }
      }
    ]
  },
  {
    id: 'affair_fallout',
    title: 'The Secret is Out! 🚨',
    text: 'A year ago, you had a reckless tryst with your boss\'s spouse. Today, you are called into an urgent private meeting with the company founder and a stern HR representative. Your boss is sitting there with a devastated and furious expression.',
    category: 'callback',
    choices: [
      {
        id: 'fallout_fired',
        text: 'Try to explain yourself, but prepare for the worst.',
        effect: {
          statChanges: { happiness: -45, status: -35 },
          repChanges: { workplace: -60, family: -25, online: -15 },
          flagsSet: { fired_from_affair: true, unemployed: true },
          flagsRemove: ['affair_active'],
          outcomeText: 'There is no explaining this. You are immediately fired for gross professional misconduct without severance, and your boss promises to blackball you from the entire industry. Your name is mud in professional circles.',
          narrativeVariants: { negative: [
            { text: 'The meeting ends your job, your references, and the professional identity you spent years building. Regret stops being abstract when security escorts you past your former desk.', careerGroups: ['corporate'], minAge: 35 },
            { text: 'You lose the position before you had enough savings to survive the fall. The scandal is public at work; the financial panic waits for you at home.', wealthBands: ['struggling', 'stable'] },
            { text: 'The secret finally demands payment. Losing the job hurts; realizing how many people were pulled into the damage hurts longer.' }
          ] },
          logText: 'Was fired in disgrace and blackballed from the industry after a secret affair with the boss\'s spouse was exposed.'
        }
      },
      {
        id: 'fallout_bribe',
        text: 'Offer to resign quietly if they sign a non-disclosure agreement with a severance package.',
        effect: {
          statChanges: { smarts: 20, happiness: -20, status: -15 },
          cashChange: 3000,
          repChanges: { workplace: -40 },
          flagsSet: { fired_from_affair: true, unemployed: true },
          flagsRemove: ['affair_active'],
          outcomeText: 'Using some quick legal bluffing, you negotiate a quiet exit with a modest $3,000 package to keep the story out of the courts. You lost your job, but at least you walked away with cash.',
          narrativeVariants: { chaotic: [
            { text: 'Three thousand dollars buys time, not absolution. You leave quietly with enough money to breathe and no honest way to explain why the career ended.', wealthBands: ['struggling', 'stable'] },
            { text: 'The severance is financially trivial, but the NDA contains the scandal. You preserve your public options while privately confronting what ambition allowed you to become.', wealthBands: ['wealthy'] },
            { text: 'You negotiate the ending like a professional, even though professionalism is what the room believes you abandoned. The deal limits the damage without repairing it.' }
          ] },
          logText: 'Negotiated a quiet resignation and a $3,000 package after the affair was discovered.'
        }
      }
    ]
  },

  // --- MORE CHILDHOOD EVENTS ---
  {
    id: 'childhood_sandbox_treasure',
    title: '🏖️ Buried Treasure!',
    text: 'While digging in the sandbox at the park, your shovel hits something hard. You dig it out — it\'s a rusty tin box with some old coins, a faded photo, and a mysterious brass key inside.',
    category: 'general',
    conditions: { minAge: 5, maxAge: 8 },
    weight: 40,
    choices: [
      { id: 'treasure_keep', text: 'Keep it! Finders keepers.', effect: { statChanges: { happiness: 15, smarts: 5 }, cashChange: 3, outcomeText: 'You pocket the coins and feel like a real-life treasure hunter. The brass key remains a mystery forever.', logText: 'Found a buried tin box with old coins in the park sandbox.' } },
      { id: 'treasure_show', text: 'Show your parents and try to find the owner.', effect: { statChanges: { karma: 2, status: 10 }, outcomeText: 'Your parents are impressed by your honesty. No owner is found, so you get to keep the coins. An old neighbor thanks you with homemade cookies.', logText: 'Found buried treasure and tried to find the rightful owner.' } },
      { id: 'treasure_bury', text: 'Re-bury it deeper and draw a treasure map.', effect: { statChanges: { smarts: 15, happiness: 10 }, outcomeText: 'You create an elaborate treasure map and hide it under your pillow. This is your greatest secret adventure.', logText: 'Re-buried sandbox treasure and created a detailed treasure map.' } }
    ]
  },
  {
    id: 'childhood_tooth_fairy',
    title: '🦷 The Tooth Fairy Conspiracy',
    text: 'You lose your first tooth! Before bed, you put it under your pillow. But you wake up at midnight and catch your dad sneaking into your room with his wallet out.',
    category: 'general',
    conditions: { minAge: 5, maxAge: 7 },
    weight: 35,
    choices: [
      { id: 'tooth_pretend', text: 'Pretend to be asleep and collect the money in the morning.', effect: { statChanges: { smarts: 15, happiness: 20 }, outcomeText: 'You get $5 in the morning and pretend to be totally shocked. Your dad winks at you. You both know, but neither of you say a word.', logText: 'Discovered the Tooth Fairy secret but kept the magic alive.' } },
      { id: 'tooth_confront', text: 'Jump up and shout "I KNEW IT WAS YOU!"', effect: { statChanges: { happiness: 10, status: 5 }, repChanges: { family: -5 }, outcomeText: 'Your dad freezes, burst into laughter, and gives you $10 for being so funny. Your mom calls from the hall asking what happened.', logText: 'Caught dad being the Tooth Fairy and confronted him hilariously.' } },
      { id: 'tooth_negotiate', text: 'Ask him for a raise — inflation is real!', effect: { statChanges: { smarts: 20 }, cashChange: 8, outcomeText: 'Your dad blinks in surprise, then cracks up laughing. He gives you $8 and tells everyone at breakfast that you are going to be a lawyer.', logText: 'Negotiated a higher Tooth Fairy rate by citing inflation.' } }
    ]
  },
  {
    id: 'childhood_science_fair',
    title: '🔬 The School Science Fair',
    text: 'The annual science fair is tomorrow and you have not even started your project. You have a volcano kit, some random kitchen ingredients, and a bag of glitter.',
    category: 'school',
    conditions: { minAge: 8, maxAge: 12, customCheck: (state: any) => state.career.type === 'school' },
    weight: 38,
    choices: [
      { id: 'fair_volcano', text: 'Build the classic baking-soda volcano. Safe and reliable.', effect: { statChanges: { smarts: 8, happiness: 10 }, outcomeText: 'The eruption works perfectly! You get a Participation ribbon and feel proud of your solid, if unoriginal, effort.', logText: 'Built a classic volcano for the science fair.' } },
      { id: 'fair_glitter', text: 'Cover everything in glitter and call it "The Big Bang Theory".', effect: { statChanges: { style: 15, smarts: -5, status: 10 }, outcomeText: 'It is absolutely beautiful and completely unscientific. The judges are baffled but award you a Special Creativity Prize. Glitter is still in your hair three weeks later.', logText: 'Won a Creativity Prize for a glitter-based Big Bang science project.' } },
      { id: 'fair_allnight', text: 'Pull an all-nighter and research something genuinely impressive.', effect: { statChanges: { smarts: 25, health: -10, happiness: -5 }, repChanges: { college: 10 }, outcomeText: 'Exhausted but proud, your project on household mold cultures wins First Place! The teacher nominates you for the regional fair.', logText: 'Won first place at science fair after an intense all-night research session.' } }
    ]
  },
  {
    id: 'childhood_camping_trip',
    title: '🏕️ The Family Camping Trip',
    text: 'Your family packs up the minivan for a weekend camping trip. On the first night, you hear a mysterious rustling sound outside the tent.',
    category: 'general',
    conditions: { minAge: 7, maxAge: 11 },
    weight: 40,
    choices: [
      { id: 'camp_investigate', text: 'Grab the flashlight and investigate bravely.', effect: { statChanges: { willpower: 20, happiness: 15 }, outcomeText: 'It was just a fat raccoon raiding the cooler! You stare each other down. The raccoon wins and takes a hotdog. You feel like a true wilderness explorer.', logText: 'Bravely investigated mysterious camping noises. Faced a very bold raccoon.' } },
      { id: 'camp_scream', text: 'Let out a bloodcurdling scream and wake everyone up.', effect: { statChanges: { happiness: -5, status: -5 }, repChanges: { family: -5 }, outcomeText: 'The whole campground wakes up. Your dad checks outside — it was a squirrel. You will never live this down at family reunions.', logText: 'Panicked and screamed at a camping trip noise. It was a squirrel.' } },
      { id: 'camp_ignore', text: 'Put your headphones on and go back to sleep.', effect: { statChanges: { happiness: 5, health: 5 }, outcomeText: 'You sleep like a log. In the morning you learn a bear ate your family\'s marshmallows. You are oddly proud of your unbothered nature.', logText: 'Slept through a bear visiting the campsite. Peak unbothered energy.' } }
    ]
  },
  {
    id: 'childhood_bake_sale',
    title: '🍪 The Bake Sale Disaster',
    text: 'You volunteered to bring homemade cookies to the school bake sale. But your batch came out completely black and rock solid. The sale is in 30 minutes!',
    category: 'school',
    conditions: { minAge: 8, maxAge: 13, customCheck: (state: any) => state.career.type === 'school' },
    weight: 35,
    choices: [
      { id: 'bake_store', text: 'Rush to the corner store and buy ready-made cookies to pass off as yours.', effect: { statChanges: { status: 10, karma: -10 }, outcomeText: 'Nobody notices they are store-bought. They sell out in 10 minutes. You feel slightly guilty but mostly just relieved.', logText: 'Passed off store-bought cookies as homemade at the school bake sale.' } },
      { id: 'bake_honest', text: 'Arrive with the burnt cookies and be completely honest.', effect: { statChanges: { karma: 1, happiness: 10, status: -5 }, outcomeText: 'Your teacher laughs, the class laughs, and someone dares to try one. It tastes like charcoal. You become a school legend for your honesty.', logText: 'Brought burnt cookies to bake sale and owned it with total transparency.' } },
      { id: 'bake_skip', text: 'Skip the bake sale and pretend you forgot.', effect: { statChanges: { happiness: -10, karma: -5 }, outcomeText: 'You stay home watching cartoons. Your teacher gives you a very disappointed look the next day that haunts you for weeks.', logText: 'Skipped the bake sale after burning the cookies.' } }
    ]
  },

  // --- TEEN EVENTS ---
  {
    id: 'teen_first_crush',
    title: '💘 The Note in the Locker',
    text: 'You find an anonymous love note in your school locker. It says: "I think you\'re amazing. — Secret Admirer." with a small doodle of a heart.',
    category: 'relationship',
    conditions: { minAge: 12, maxAge: 16, customCheck: (state: any) => state.career.type === 'school' },
    weight: 40,
    choices: [
      { id: 'crush_investigate', text: 'Launch a full detective mission to find out who it is.', effect: { statChanges: { smarts: 10, happiness: 15 }, outcomeText: 'After three days of analysis, you narrow it down to your lab partner. When you ask them, they turn beet red and nod. Adorable.', logText: 'Successfully investigated and identified my secret admirer.' } },
      { id: 'crush_reply', text: 'Leave a reply note in the same spot with your answer.', effect: { statChanges: { happiness: 20, looks: 5 }, repChanges: { dating: 15 }, outcomeText: 'You write back "I think you\'re amazing too." The next day, there\'s another note with their name and a request to sit together at lunch. This is going well!', logText: 'Replied to a secret admirer note. A lunch date followed.' } },
      { id: 'crush_ignore', text: 'Ignore it and play it cool.', effect: { statChanges: { status: 10, happiness: 5 }, outcomeText: 'You casually drop it on the floor in front of your friends, pretending you see love notes all the time. Your reputation as unflappably cool skyrockets.', logText: 'Played it cool after receiving a secret admirer note.' } }
    ]
  },
  {
    id: 'teen_sneaked_out',
    title: '🌙 The Midnight Escape',
    text: 'Your friends are throwing a huge party at midnight and your parents already said no. Your window is unlocked and there\'s a conveniently placed tree right outside.',
    category: 'general',
    conditions: { minAge: 14, maxAge: 17 },
    weight: 38,
    choices: [
      { id: 'sneak_go', text: 'Climb out the window. The tree is right there!', effect: { statChanges: { happiness: 25, health: -5 }, repChanges: { family: -15 }, flagsSet: { snuck_out_teen: true }, outcomeText: 'You make it to the party! It is incredible. You get home at 3am, barely sleep, and your mom is definitely suspicious in the morning.', logText: 'Snuck out the bedroom window at midnight to attend a party.' } },
      { id: 'sneak_stay', text: 'Stay home, resentfully scroll social media, and watch the stories roll in.', effect: { statChanges: { happiness: -15, smarts: 10 }, outcomeText: 'You see every single photo from the party online. You stew in jealousy but feel oddly mature for respecting your parents\' decision.', logText: 'Chose to stay home instead of sneaking out to a party.' } },
      { id: 'sneak_negotiate', text: 'Text your parents a long heartfelt message begging for an extension.', effect: { statChanges: { smarts: 15, happiness: 10 }, repChanges: { family: 10 }, outcomeText: 'Your dad texts back a stern no, but your mom is impressed by your communication skills and extends your next weekend curfew by an hour.', logText: 'Negotiated curfew extension via heartfelt text message.' } }
    ]
  },
  {
    id: 'teen_fail_driving_test',
    title: '🚗 The Driving Test Disaster',
    text: 'It\'s the day of your driving test. You are extremely nervous. On your first attempt, you accidentally back the car into a traffic cone... and then another... and then the examiner\'s coffee.',
    category: 'general',
    conditions: { minAge: 16, maxAge: 18 },
    weight: 38,
    choices: [
      { id: 'drive_laugh', text: 'Burst out laughing and apologize profusely.', effect: { statChanges: { happiness: 5, status: -5 }, outcomeText: 'The examiner tries to stay stern, but your genuine laughter cracks them. You fail, but rebook immediately. The examiner gives you a pep talk.', logText: 'Failed driving test by destroying three cones and one coffee. Rebooked immediately.' } },
      { id: 'drive_cry', text: 'Burst into embarrassed tears.', effect: { statChanges: { happiness: -15, willpower: 10 }, repChanges: { family: 10 }, outcomeText: 'The examiner feels terrible and calls your dad. He drives you home, buys ice cream, and spends the weekend teaching you for the rebook.', logText: 'Cried after a disastrous driving test failure. Dad bought ice cream.' } },
      { id: 'drive_blame_cones', text: 'Sincerely argue the cones were placed irresponsibly.', effect: { statChanges: { smarts: 10, status: -10 }, outcomeText: 'The examiner stares at you in total disbelief. You fail immediately. This story is told at family dinners for years.', logText: 'Argued the traffic cones were at fault for a failed driving test.' } }
    ]
  },
  {
    id: 'teen_viral_talent_show',
    title: '🎤 The School Talent Show',
    text: 'You signed up for the school talent show on a dare. You\'re backstage now, heart pounding. 400 students are in the audience.',
    category: 'school',
    conditions: { minAge: 13, maxAge: 17, customCheck: (state: any) => state.career.type === 'school' },
    weight: 35,
    choices: [
      {
        id: 'talent_sing',
        text: 'Go out there and sing your heart out.',
        outcomes: [
          { weight: 60, effect: { statChanges: { status: 25, happiness: 20, willpower: 15 }, outcomeText: 'You crack on the first note but power through. The crowd goes crazy at the end. A girl in the front row films it and it gets 40K views by morning.', logText: 'Performed in school talent show and accidentally went viral.' } },
          { weight: 40, effect: { statChanges: { status: -25, happiness: -20 }, outcomeText: 'You completely freeze on stage. The silence is deafening. Someone coughs. You run off stage in tears. You are a meme by next period.', logText: 'Froze on stage during the school talent show and became a cruel meme.' } }
        ]
      },
      {
        id: 'talent_comedy',
        text: 'Switch to stand-up comedy at the last second.',
        outcomes: [
          { weight: 70, effect: { statChanges: { smarts: 15, status: 20, happiness: 25 }, outcomeText: 'You improvise six minutes of self-deprecating humor about the school cafeteria. The principal is laughing the hardest. This is your calling.', logText: 'Improvised a stand-up comedy set at the school talent show.' } },
          { weight: 30, effect: { statChanges: { status: -15, karma: -10 }, outcomeText: 'Your jokes cross the line. You accidentally roast a teacher who just got divorced. The microphone is cut halfway through.', logText: 'Bombed a stand-up comedy set at the school talent show by roasting a teacher.' } }
        ]
      },
      {
        id: 'talent_flee',
        text: 'Pretend to faint and be carried off stage.',
        outcomes: [
          { weight: 50, effect: { statChanges: { karma: -10, status: -15, happiness: -10 }, outcomeText: 'The school nurse is called. Your drama teacher is furious. You spend the evening watching Netflix instead of accepting your totally manufactured medical drama.', logText: 'Faked a fainting episode to escape performing at the talent show.' } },
          { weight: 50, effect: { statChanges: { karma: -25, status: -25 }, outcomeText: 'You drop to the floor. The school calls an ambulance. You get a $800 bill for a fake emergency, and everyone finds out.', logText: 'Faked a medical emergency at a talent show resulting in massive embarrassment and an ambulance bill.' } }
        ]
      }
    ]
  },
  {
    id: 'teen_group_project',
    title: '📚 The Group Project Nightmare',
    text: 'Your teacher assigned a major group project worth 30% of your grade. Your group consists of you, one overachiever, one social butterfly who does nothing, and one kid who just discovered TikTok.',
    category: 'school',
    conditions: { minAge: 13, maxAge: 18, customCheck: (state: any) => state.career.type === 'school' },
    weight: 40,
    choices: [
      {
        id: 'group_carry',
        text: 'Accept reality and do most of the work yourself.',
        outcomes: [
          { weight: 80, effect: { statChanges: { smarts: 20, happiness: -10, willpower: 15 }, outcomeText: 'You carry the whole team. You get an A. The social butterfly gives you a huge hug and nothing else. The TikTok kid posts a video titled "carried by my groupmate lol".', logText: 'Carried the entire group project solo. Still got the A.' } },
          { weight: 20, effect: { statChanges: { smarts: -5, happiness: -25, willpower: -20 }, outcomeText: 'You try to do everything but burn out at 3 AM. You turn in a half-finished mess. You get a D. Your group blames you.', logText: 'Tried to solo carry a group project and burned out, resulting in a failing grade.' } }
        ]
      },
      {
        id: 'group_rebel',
        text: 'Submit separate work under your own name to get individual credit.',
        outcomes: [
          { weight: 50, effect: { statChanges: { smarts: 15, status: -10 }, repChanges: { college: 5 }, outcomeText: 'The teacher allows it! You get the A. Your former group members all give you the stink eye in the hallway for weeks.', logText: 'Broke from a dysfunctional group to submit independent work.' } },
          { weight: 50, effect: { statChanges: { status: -20, happiness: -15 }, outcomeText: 'The teacher denies it and fails all of you for failing to work as a team. You are forced to write a 5-page essay on collaboration.', logText: 'Failed a group project for refusing to collaborate with the group.' } }
        ]
      },
      {
        id: 'group_delegate',
        text: 'Assign everyone a strict role and hold them accountable.',
        outcomes: [
          { weight: 65, effect: { statChanges: { smarts: 20, status: 15, willpower: 20 }, outcomeText: 'You run the group like a project manager. It works! Everyone turns in their parts. The TikTok kid even made a genuinely useful infographic. B+.', logText: 'Successfully managed a chaotic group project through clear delegation.' } },
          { weight: 35, effect: { statChanges: { happiness: -20, status: -15 }, outcomeText: 'You assign roles. Nobody does them. At the presentation, they all stare at you blankly. You stand in silence for 3 minutes before the teacher tells you to sit down. F.', logText: 'Attempted to manage a group project but everyone ignored their roles. Humiliating presentation failure.' } }
        ]
      }
    ]
  },

  // --- YOUNG ADULT EVENTS ---
  {
    id: 'adult_roommate_drama',
    title: '🏠 Roommate From Another Dimension',
    text: 'Your new apartment roommate has some unusual habits: they blast death metal at 6am, cook fish in the microwave for 8 minutes, and own 14 houseplants with individual names and backstories.',
    category: 'general',
    conditions: { minAge: 18, maxAge: 26 },
    weight: 35,
    choices: [
      {
        id: 'roommate_talk',
        text: 'Have a calm, adult conversation about boundaries.',
        outcomes: [
          { weight: 70, effect: { statChanges: { smarts: 15, happiness: 10 }, outcomeText: 'They are totally receptive! They stop the morning metal, start using the office microwave for fish, and only introduce you to three plants per week. Progress!', narrativeVariants: { positive: [{ text: 'You are young enough to still believe a direct conversation can save a home, and this time it does. The apartment becomes livable without becoming boring.', maxAge: 23 }, { text: 'The boundary talk works because you arrive with rent paid, patience intact, and a little practice at saying what you need.', minAge: 24 }, { text: 'A shared address becomes a small lesson in adulthood: kindness is useful, but clarity is what makes it sustainable.', wealthBands: ['stable', 'comfortable', 'wealthy'] }] }, logText: 'Successfully set apartment boundaries with an unusual roommate.' } },
          { weight: 30, effect: { statChanges: { happiness: -15, willpower: -10 }, outcomeText: 'They get incredibly offended. They claim the plants need the metal music to photosynthesize. They stop talking to you and leave passive-aggressive sticky notes everywhere.', narrativeVariants: { negative: [{ text: 'You chose a calm conversation because you thought adulthood rewarded calm conversations. The silence afterward is more exhausting than the music.', maxAge: 23 }, { text: 'You have had difficult colleagues and difficult family members; neither prepared you for sharing a kitchen with someone who weaponizes sticky notes.', minAge: 24 }, { text: 'The lease is affordable, but the emotional cost keeps appearing in small deductions from every good day.', wealthBands: ['struggling', 'stable'] }] }, logText: 'Failed to reason with an eccentric roommate, resulting in a toxic living environment.' } }
        ]
      },
      {
        id: 'roommate_retaliate',
        text: 'Fight fire with fire: play bagpipe music at 3am.',
        outcomes: [
          { weight: 40, effect: { statChanges: { happiness: 20, status: -10 }, repChanges: { family: -5 }, outcomeText: 'You spend a week in a noise war that escalates into a legend the whole building tells. You eventually both collapse in exhausted laughter and become best friends.', narrativeVariants: { chaotic: [{ text: 'The feud becomes a story the building tells about you, then a friendship neither of you planned. Some adult mistakes become social glue.', maxAge: 25 }, { text: 'You are old enough to know retaliation is a bad plan and young enough to try it anyway. The laughter afterward is real.', minAge: 26 }, { text: 'The rent is still due, the neighbors are still furious, and somehow this is the first place in months that feels like home.', wealthBands: ['struggling', 'stable'] }] }, logText: 'Waged a musical noise war with my roommate. We are now best friends.' } },
          { weight: 60, effect: { statChanges: { happiness: -20, cashChange: -300 }, outcomeText: 'The landlord receives 14 noise complaints. You are fined $300 and both issued a final eviction warning. The apartment is dead silent forever after.', narrativeVariants: { negative: [{ text: 'The joke ends where adult life often ends jokes: with a fine, an eviction warning, and a budget that cannot absorb either.', wealthBands: ['struggling', 'stable'] }, { text: 'You can pay the fine, but not the embarrassment of having to explain it to a landlord who has seen this exact fight before.', wealthBands: ['comfortable', 'wealthy'] }, { text: 'The silence is not peace. It is two people waiting for the next lease decision to make the conflict official.', minAge: 24 }] }, logText: 'Fined $300 by the landlord for engaging in a noise war with my roommate.' } }
        ]
      },
      {
        id: 'roommate_accept',
        text: 'Learn the plants\' names and join the chaos.',
        outcomes: [
          { weight: 50, effect: { statChanges: { happiness: 30, smarts: 5 }, outcomeText: 'You learn that "Gerald" the fiddle-leaf fig is actually fascinating. Your roommate is eccentric but incredibly loyal. This becomes the best living situation you ever have.', narrativeVariants: { positive: [{ text: 'You are building a life on a budget, and the unexpected luxury is finding someone whose strange habits come with real loyalty.', wealthBands: ['struggling', 'stable'] }, { text: 'The apartment is not polished, but it is full of the kind of belonging money cannot schedule.', wealthBands: ['comfortable', 'wealthy'] }, { text: 'You remember the plants, the music, and the person who made a crowded home feel generous.', maxAge: 26 }] }, logText: 'Embraced chaotic roommate energy. Best apartment ever.' } },
          { weight: 50, effect: { statChanges: { smarts: -15, health: -10 }, outcomeText: 'You try to embrace the chaos, but you develop severe allergies to the plants, and the death metal gives you chronic migraines. You are miserable.', narrativeVariants: { negative: [{ text: 'You wanted to be flexible. Your sinuses, sleep, and work schedule interpret flexibility as surrender.', careers: ['corporate', 'education', 'medical'] }, { text: 'The arrangement looked affordable until health costs and lost sleep started appearing in every other part of your life.', wealthBands: ['struggling', 'stable'] }, { text: 'Good intentions do not make a home compatible. You learn that before resentment has time to harden.', minAge: 24 }] }, logText: 'Tried to embrace eccentric roommate life but suffered health issues instead.' } }
        ]
      }
    ]
  },
  {
    id: 'adult_job_interview_weird',
    title: '💼 The Unusual Job Interview',
    text: 'You are being interviewed for a position and the hiring manager asks: "If you were a kitchen appliance, which one would you be and why?" while staring at you with complete seriousness.',
    category: 'career',
    conditions: { minAge: 18, maxAge: 35 },
    weight: 35,
    choices: [
      { id: 'interview_toaster', text: '"A toaster. Reliable, consistent, and I always deliver results under pressure."', effect: { statChanges: { status: 20, smarts: 10 }, repChanges: { workplace: 15 }, outcomeText: 'The interviewer writes furiously in their notepad and says "I love that." You get a callback the next day. The toaster metaphor apparently resonated deeply.', logText: 'Nailed a bizarre job interview with a well-crafted toaster metaphor.' } },
      { id: 'interview_blender', text: '"A blender. I take complex problems and turn them into something smooth."', effect: { statChanges: { smarts: 20, status: 15 }, outcomeText: 'The interviewer visibly pauses, tilts their head, and then writes it down. You get the job. The blender answer is referenced in your first performance review as "visionary".', logText: 'Secured a job by comparing myself to a blender in a weird interview.' } },
      { id: 'interview_honest', text: 'Tell them this question is an HR red flag and ask about the actual job scope.', effect: { statChanges: { smarts: 25, status: -10 }, outcomeText: 'The interviewer stares at you for five full seconds, then says "Fair point" and pulls out the actual job description. You get the job offer, and a grudging amount of respect.', logText: 'Called out a bizarre interview question as a red flag. Got the job anyway.' } }
    ]
  },
  {
    id: 'adult_gym_embarrassment',
    title: '💪 Gym Hall of Shame',
    text: 'You are using a machine at the gym when you realize — you have been using it completely backwards for the last 15 minutes while several regulars watched in silent horror.',
    category: 'general',
    conditions: { minAge: 16, maxAge: 40 },
    weight: 38,
    choices: [
      { id: 'gym_laugh', text: 'Burst out laughing, announce it, and ask for help.', effect: { statChanges: { happiness: 20, status: 10, health: 5 }, outcomeText: 'A veteran gym-goer literally applauds your self-awareness and spends 20 minutes teaching you the correct form for every machine. You gain a gym mentor.', logText: 'Used a gym machine backwards for 15 minutes. Gained a mentor from the chaos.' } },
      { id: 'gym_pretend', text: 'Pretend it was on purpose — a "proprietary training method."', effect: { statChanges: { status: 15, smarts: 5 }, outcomeText: 'Two people actually start copying your backwards technique. You leave before anyone asks you to explain the science.', logText: 'Accidentally invented a fake gym technique that other people started doing.' } },
      { id: 'gym_leave', text: 'Quietly pack your bag and never return to this gym.', effect: { statChanges: { happiness: -10, health: -5 }, outcomeText: 'You leave with tremendous dignity — technically none, but you try. You rejoin a different gym across town and start fresh.', logText: 'Fled the gym in total humiliation after using equipment backwards.' } }
    ]
  },
  {
    id: 'adult_wedding_speech',
    title: '🥂 The Wedding Speech Panic',
    text: 'You are the best man / maid of honor at a close friend\'s wedding. You prepared a speech, but just as you stand up, you realize you left the notes at home. 150 people stare at you.',
    category: 'relationship',
    conditions: { minAge: 20, maxAge: 38 },
    weight: 30,
    choices: [
      { id: 'speech_improvise', text: 'Wing it from the heart — pure improvisation.', effect: { statChanges: { happiness: 25, status: 20, willpower: 25 }, repChanges: { dating: 15 }, outcomeText: 'You speak from pure emotion. Four people cry. The bride says it was better than any written speech could have been. You find out later someone filmed it and it got posted to a wedding blog.', narrativeVariants: { positive: [{ text: 'You speak about the years when success, grief, and bad decisions tested the friendship. The room hears a history no polished quotation could replace.', minAge: 30 }, { text: 'You are young enough to be terrified and close enough to tell the truth. The speech becomes a promise that the friendship will survive the lives both of you are building.', maxAge: 25 }, { text: 'Without notes, you rely on memory. The stories are imperfect, specific, and full of the loyalty that brought you to the microphone.' }] }, logText: 'Improvised a wedding speech that made four people cry.' } },
      { id: 'speech_honest', text: 'Tell the crowd you forgot your notes and ask for forgiveness.', effect: { statChanges: { karma: 1, happiness: 15 }, outcomeText: 'Everyone laughs with you, not at you. You muddle through warmly and the couple loves you for it. The wedding photographer captures your honest panic face for the album.', narrativeVariants: { positive: [{ text: 'You admit the mistake before pretending confidence. Your friend laughs first, giving the entire room permission to see the panic as affection rather than failure.' }, { text: 'The confession breaks the tension. What follows is less a speech than a warm, clumsy account of why this friendship has lasted.' }] }, logText: 'Admitted to forgetting wedding speech notes. Crowd laughed with me.' } },
      { id: 'speech_quote', text: 'Fill three minutes with inspirational quotes you barely remember.', effect: { statChanges: { status: -10, happiness: -5, smarts: 5 }, outcomeText: 'You butcher a Winston Churchill quote badly, attribute a Gandhi line to Einstein, and finish with something you think is from Rumi but is actually a mug from TJ Maxx. Still applauded.', narrativeVariants: { chaotic: [{ text: 'You hide behind borrowed wisdom until the quotations collapse into accidental comedy. Your friend recognizes the panic and applauds hardest.' }, { text: 'The speech becomes a procession of misremembered lines and sincere intentions. It is embarrassing now and destined to become friendship folklore later.' }] }, logText: 'Filled a forgotten wedding speech with misattributed inspirational quotes.' } }
    ]
  },
  {
    id: 'adult_locked_out',
    title: '🔑 Locked Out at Midnight',
    text: 'You step outside your apartment to take out the trash and hear the door click shut behind you. It\'s midnight. You\'re in your pajamas. Your phone is inside.',
    category: 'general',
    conditions: { minAge: 18, maxAge: 40 },
    weight: 35,
    choices: [
      { id: 'locked_neighbor', text: 'Knock on your neighbor\'s door and ask to borrow a phone.', effect: { statChanges: { smarts: 10, happiness: 5 }, outcomeText: 'Your neighbor opens the door in a matching onesie. You bond over this shared pajama energy. They lend you the phone and you call a locksmith. You two are friends now.', logText: 'Locked out at midnight. Bonded with neighbor in matching onesie energy.' } },
      { id: 'locked_window', text: 'Attempt to climb through the bathroom window you left open.', effect: { statChanges: { willpower: 15, health: -10, happiness: 10 }, outcomeText: 'You succeed, but you lose a slipper halfway up and land face-first into the laundry pile. Totally worth it.', logText: 'Climbed through bathroom window to escape a midnight lockout.' } },
      { id: 'locked_wait', text: 'Sit in the hallway and wait for morning.', effect: { statChanges: { willpower: 20, happiness: -20, health: -5 }, outcomeText: 'You sit on the cold floor for six hours reading the fire safety poster repeatedly. At 6am, a passing neighbor calls a locksmith. Never again.', logText: 'Spent six hours in a hallway waiting for morning after being locked out.' } }
    ]
  },

  // --- ADULT / CAREER EVENTS ---
  {
    id: 'career_wrong_reply_all',
    title: '📧 The Reply-All Apocalypse',
    text: 'You meant to vent about your boss to your work friend. Instead, you hit Reply All to the entire company email chain of 340 people. The message contains the phrase "honestly he\'s such a micromanaging nightmare."',
    category: 'career',
    conditions: { minAge: 21, maxAge: 45 },
    weight: 30,
    choices: [
      { id: 'reply_apologize', text: 'Send an immediate company-wide apology email.', effect: { statChanges: { karma: 1, status: -15, happiness: -20 }, repChanges: { workplace: -20 }, outcomeText: 'Your apology goes to all 340 people too. Your boss calls you into his office. Somehow, three colleagues quietly thank you for saying what everyone was thinking.', narrativeVariants: { negative: [{ text: 'Early in your career, the mistake feels large enough to define you. The apology is sincere, public, and followed by the longest walk to a manager\'s office you have ever taken.', maxAge: 28, careerGroups: ['corporate'] }, { text: 'Years of workplace credibility cannot unsend the message, but they keep one mistake from becoming your entire reputation. The apology still costs you authority.', minAge: 40, minReputation: { workplace: 50 } }, { text: 'You apologize to everyone at once. A few private messages offer solidarity, but none can spare you the meeting waiting behind your boss\'s door.' }] }, logText: 'Sent accidental reply-all rant about boss to entire company. Apologized company-wide.' } },
      { id: 'reply_own', text: 'Own it. Send a follow-up: "I stand by every word."', effect: { statChanges: { willpower: 20, status: 10, happiness: 15 }, repChanges: { workplace: -30 }, outcomeText: 'This is either the bravest or stupidest thing you have ever done. HR calls you in. Somehow you still have your job. The story becomes office legend.', narrativeVariants: { chaotic: [{ text: 'You turn an accident into a public stand. Coworkers admire the nerve, management documents the insubordination, and your career becomes more interesting in all the wrong ways.', careerGroups: ['corporate'] }, { text: 'Your reputation gives the criticism weight and makes the defiance harder to dismiss. It also ensures every senior leader remembers your name.', minReputation: { workplace: 55 } }, { text: 'The second email removes any possibility of misunderstanding. You keep the job, lose political safety, and become the person colleagues quote in whispers.' }] }, logText: 'Doubled down after an accidental reply-all rant about the boss.' } },
      { id: 'reply_deny', text: 'Claim your account was hacked and file an IT ticket immediately.', effect: { statChanges: { smarts: 15, karma: -15 }, repChanges: { workplace: -5 }, outcomeText: 'IT reviews the logs, finds it was absolutely you, and sends you a politely devastating report. Your boss says nothing, but starts cc\'ing every email you send.', narrativeVariants: { chaotic: [{ text: 'The lie survives only until IT opens the logs. What might have been one embarrassing message becomes evidence that your judgment fails under pressure.', careerGroups: ['corporate'], maxAge: 30 }, { text: 'You have spent years building credibility and spend part of it on a denial nobody believes. The quiet monitoring afterward feels worse than open discipline.', minAge: 40 }, { text: 'IT proves the obvious with clinical precision. Your boss does not confront you; they simply stop trusting any message that arrives without witnesses.' }] }, logText: 'Blamed a hack for a damning reply-all email. IT proved it was me.' } }
    ]
  },
  {
    id: 'career_office_drama',
    title: '☕ The Office Fridge War',
    text: 'Someone keeps eating your clearly labeled lunch from the office fridge. This is the third time this week. Your lunch today was a very special homemade meal.',
    category: 'career',
    conditions: { minAge: 21, maxAge: 50 },
    weight: 35,
    choices: [
      { id: 'fridge_note', text: 'Leave a passive-aggressive note on the fridge.', effect: { statChanges: { happiness: 10, status: 5 }, outcomeText: 'You write "Dear Lunch Thief: I know who you are. I have always known." Nobody confesses, but your lunch stops disappearing. The mystery remains unsolved.', logText: 'Left a cryptic note in the office fridge. Lunch thief never struck again.' } },
      { id: 'fridge_trap', text: 'Set up a decoy lunch with ghost-pepper hot sauce.', effect: { statChanges: { happiness: 30, karma: -10, smarts: 15 }, outcomeText: 'At 12:15, you hear a distant scream from the kitchen. You go to investigate with the energy of someone who absolutely did not do this. The thief is identified. Justice is served.', logText: 'Set a ghost-pepper trap for the office lunch thief. Justice achieved.' } },
      { id: 'fridge_cctv', text: 'Ask IT to check the hallway camera footage.', effect: { statChanges: { smarts: 20, status: 15 }, repChanges: { workplace: 10 }, outcomeText: 'IT pulls the footage. It is your manager\'s manager. HR gets involved in an extremely uncomfortable meeting. Your lunches are now sacred and untouched.', logText: 'Used security camera footage to expose a senior executive as the office lunch thief.' } }
    ]
  },
  {
    id: 'career_promotion_rivalry',
    title: '🏆 The Promotion Competition',
    text: 'There is one open senior position. Two candidates: you and your friendly colleague Alex, who is charming, competent, and has been there a year longer. The announcement is next week.',
    category: 'career',
    conditions: { minAge: 24, maxAge: 45 },
    weight: 28,
    choices: [
      { id: 'promo_work', text: 'Put in extra work and let your results speak for themselves.', effect: { statChanges: { status: 20, happiness: 5, willpower: 20 }, repChanges: { workplace: 20 }, outcomeText: 'You pull three brilliant reports in a week. Your boss notices. On announcement day, your name is called. Alex congratulates you with class.', narrativeVariants: { positive: [{ text: 'The late nights show up in the work, not the gossip. When your name is announced, even Alex has no reason to doubt it.' }, { text: 'Your results make the decision look inevitable. The promotion feels earned, and the congratulations around you feel genuine.' }] }, logText: 'Won a competitive promotion through hard work and outstanding results.' } },
      { id: 'promo_network', text: 'Schmooze every stakeholder and play company politics.', effect: { statChanges: { status: 25, smarts: 10, happiness: -5 }, repChanges: { workplace: 10 }, outcomeText: 'You attend every optional meeting, remember everyone\'s birthday, and mention your achievements in every conversation. It works. You feel slightly hollow but get the job title.', narrativeVariants: { chaotic: [{ text: 'You learn every name, every hallway alliance, and exactly when to mention your wins. The title arrives with applause that feels a little rehearsed.' }, { text: 'Your networking campaign works perfectly. By the time the offer arrives, you have the role—and a nagging sense that you performed a different version of yourself.' }] }, logText: 'Won a promotion through strategic networking and office politics.' } },
      { id: 'promo_sabotage', text: 'Anonymously tip the boss off about a minor mistake Alex made.', effect: { statChanges: { karma: -30, status: 15 }, repChanges: { workplace: -15 }, outcomeText: 'Alex finds out it was you two months later through a mutual colleague. The damage to your relationship is irreversible. You got the job but lost your integrity and a friend.', narrativeVariants: { chaotic: [{ text: 'The promotion is yours, but Alex eventually connects the missing pieces. The new title cannot make the office feel like home again.' }, { text: 'Your warning does its job. Months later, the victory curdles when Alex learns who made the competition personal.' }] }, logText: 'Sabotaged a colleague to secure a promotion. Lost their friendship.' } }
    ]
  },

  // --- RANDOM / WEIRD LIFE EVENTS ---
  {
    id: 'random_bird_attack',
    title: '🦅 Attacked by a Goose',
    text: 'You are walking through the park, completely minding your business, when a massive Canadian goose squares up to you on the path. It is hissing. It is not bluffing.',
    category: 'general',
    conditions: { minAge: 5 },
    weight: 42,
    choices: [
      { id: 'goose_run', text: 'Run. Run as fast as you possibly can.', effect: { statChanges: { health: 5, happiness: 10, status: -5 }, outcomeText: 'You sprint across the park screaming. The goose chases you for 200 meters. You survive. A jogger films the whole thing. It ends up online.', logText: 'Was chased across a park by a territorial goose. A video exists.' } },
      { id: 'goose_stare', text: 'Stand your ground and stare it down.', effect: { statChanges: { willpower: 25, status: 20 }, outcomeText: 'You lock eyes with the goose for 45 tense seconds. It blinks first. You walk away slowly, hands in your pockets. You have earned something ancient and primal today.', logText: 'Won a staring contest with an aggressive goose. Respect was earned.' } },
      { id: 'goose_bread', text: 'Offer it some bread from your bag.', effect: { statChanges: { happiness: 20, karma: 1 }, outcomeText: 'The goose takes the bread gently and walks away. You have made peace with nature itself. The goose occasionally visits you during future park walks.', logText: 'Negotiated peaceful terms with an attacking goose using bread diplomacy.' } }
    ]
  },
  {
    id: 'random_lottery_ticket',
    title: '🎰 The Lucky Scratch Card',
    text: 'You find a scratch card on the ground outside a convenience store. You scratch it and see three matching symbols. According to the back, that means... $500.',
    category: 'general',
    conditions: { minAge: 10 },
    weight: 35,
    choices: [
      { id: 'lottery_claim', text: 'Take it to the store and claim the prize immediately.', effect: { statChanges: { happiness: -20, status: -15 }, cashChange: -100, outcomeText: 'You excitedly hand it to the cashier. He scans it, shakes his head, and points at the tiny text. It\'s a fake prank ticket! Everyone in the store laughs at you. You buy $100 worth of comfort snacks out of shame.', logText: 'Tried to claim a $500 scratch card but it was a humiliating fake prank ticket. Bought $100 in comfort food.' } },
      { id: 'lottery_ignore', text: 'Leave it — it must be expired or a scam.', effect: { statChanges: { karma: 5, smarts: 10 }, outcomeText: 'You walk away with your integrity intact, refusing to trust the universe. Turns out it was real. Someone else finds it and screams with joy behind you.', logText: 'Left a potentially winning scratch card on the ground out of skepticism.' } },
      { id: 'lottery_split', text: 'Look for who dropped it and offer to split it.', effect: { statChanges: { karma: 3, happiness: 20 }, cashChange: 250, outcomeText: 'An elderly woman nearby gasps and says she dropped it. You show her how to claim it. She insists on splitting the prize. Best $250 you ever earned.', logText: 'Split a found $500 scratch card prize with the person who dropped it.' } }
    ]
  },
  {
    id: 'random_famous_double',
    title: '🌟 Celebrity Doppelgänger',
    text: 'A stranger approaches you on the street, completely starstruck. They are 100% convinced you are a rising music celebrity. They ask for a selfie, an autograph, and your opinion on your latest album.',
    category: 'general',
    conditions: { minAge: 14 },
    weight: 38,
    choices: [
      {
        id: 'double_deny',
        text: 'Firmly explain you are not who they think you are.',
        outcomes: [
          { weight: 70, effect: { statChanges: { happiness: 10 }, outcomeText: 'They are mortified and apologize repeatedly. You spend 10 minutes convincing them. They go home and google extensively. The real celebrity looks nothing like you.', logText: 'Was mistaken for a celebrity and spent 10 minutes disproving it.' } },
          { weight: 30, effect: { statChanges: { status: -10, happiness: -15 }, outcomeText: 'They think you are lying to avoid them. They pull out their phone, record you screaming "I AM NOT HIM!", and post it. It goes mildly viral as "celebrity meltdown".', logText: 'Was mistaken for a celebrity and aggressively denied it, ending up in an embarrassing viral video.' } }
        ]
      },
      {
        id: 'double_play',
        text: 'Play along, give an autograph, and drop a fake single name.',
        outcomes: [
          { weight: 60, effect: { statChanges: { happiness: 35, status: 15, karma: -10 }, outcomeText: 'You sign "Xcalibur Jones" and invent a fake album called "Velvet Tremor." The stranger posts it online. "Xcalibur Jones" briefly trends. Nobody knows who that is.', logText: 'Pretended to be a famous celebrity. Created a fake alter-ego that briefly trended online.' } },
          { weight: 40, effect: { statChanges: { status: -25, cashChange: -200 }, outcomeText: 'The stranger turns out to be a paparazzi stringer. They sell the fake story. The real celebrity\'s lawyers find you and threaten to sue for identity theft. You pay a $200 legal consultation fee just to be safe.', logText: 'Pretended to be a celebrity and was threatened with a lawsuit for identity theft.' } }
        ]
      },
      {
        id: 'double_photo',
        text: 'Take the selfie, stay mysterious, and say nothing.',
        outcomes: [
          { weight: 80, effect: { statChanges: { happiness: 25, style: 10 }, outcomeText: 'You give a cryptic smile, take the photo, and walk away without a single word. The stranger tweets about "an incredible encounter with a legend." The mystery lives on.', logText: 'Took a selfie as a celebrity lookalike and walked away saying nothing.' } },
          { weight: 20, effect: { statChanges: { style: -15, status: -15 }, outcomeText: 'You try to look mysterious, but you trip over a curb while walking away backwards. The stranger stops believing you are famous immediately.', logText: 'Tried to act like a mysterious celebrity but tripped and embarrassed myself.' } }
        ]
      }
    ]
  },
  {
    id: 'random_meteor_shower',
    title: '🌠 Unexpected Meteor Shower',
    text: 'You step outside late at night to find the sky filled with a breathtaking surprise meteor shower. Streaks of light are everywhere. It\'s completely unexpected and incredibly beautiful.',
    category: 'general',
    conditions: { minAge: 6 },
    weight: 35,
    choices: [
      { id: 'meteor_wish', text: 'Close your eyes and make a deep, heartfelt wish.', effect: { statChanges: { happiness: 30, willpower: 20 }, outcomeText: 'You stand in silence and make the most sincere wish you have ever made. Whatever happens next, this moment of pure hope will stay with you forever.', logText: 'Witnessed an unexpected meteor shower and made a heartfelt wish.' } },
      { id: 'meteor_film', text: 'Grab your phone and try to capture every second on video.', effect: { statChanges: { smarts: 10, happiness: 15 }, repChanges: { online: 15 }, outcomeText: 'You get incredible footage. You post it and it gets thousands of views overnight. But the comments make you realize you should have just put the phone down and watched.', logText: 'Filmed a surprise meteor shower. It went viral but felt slightly hollow.' } },
      { id: 'meteor_call', text: 'Call someone you\'ve been missing and watch it with them over the phone.', effect: { statChanges: { happiness: 40 }, repChanges: { family: 20, dating: 15 }, outcomeText: 'You call and they pick up. You both watch the sky from your different cities, saying very little. It is one of the best conversations you have ever had.', logText: 'Shared a surprise meteor shower over the phone with someone important.' } }
    ]
  },

  // --- ELDERLY / LATE LIFE EVENTS ---
  {
    id: 'adult_retirement_party',
    title: '🎉 Retirement Party Surprise',
    text: 'Your coworkers have organized a surprise retirement party for you. As you walk in, 50 people shout "Surprise!" and you see 40 years of your career summarized in a PowerPoint presentation.',
    category: 'career',
    conditions: { minAge: 58, maxAge: 70 },
    weight: 30,
    choices: [
      { id: 'retire_speech', text: 'Give an emotional speech about your career journey.', effect: { statChanges: { happiness: 35, status: 20, willpower: 15 }, repChanges: { workplace: 25, family: 20 }, outcomeText: 'You speak for 15 minutes. Three people cry. Your boss says it was the best farewell speech in company history. You feel a profound sense of completion.', narrativeVariants: { positive: [{ text: 'You speak about the promotions and failures, but also the ordinary Tuesdays that slowly became a career. Recognition feels deserved because you remember what it cost.', requiredFlags: ['career_milestone_complete'] }, { text: 'The speech includes mistakes you once tried to hide and people who helped you recover from them. Retirement feels less like an ending than an honest accounting.', requiredFlags: ['career_failure'] }, { text: 'You look across the room at decades of colleagues and finally understand how much of your life was built together rather than alone.', careerGroups: ['corporate', 'medical', 'education'] }] }, logText: 'Gave an emotional retirement speech that moved the entire office.' } },
      { id: 'retire_dance', text: 'Immediately put on music and start dancing.', effect: { statChanges: { happiness: 45, health: 5 }, outcomeText: 'You request "I Will Survive" and dance for an hour straight. Everyone joins in. You are the first person in company history to retire with a mosh pit.', narrativeVariants: { positive: [{ text: 'After decades of being responsible, you choose joy without needing to justify it. The dance floor fills with people who have never seen you this unguarded.' }, { text: 'Your knees object before your spirit does. Coworkers from every chapter of the career join in, turning the farewell into one last shared act of rebellion.' }] }, logText: 'Started a retirement party mosh pit. Historic.' } },
      { id: 'retire_quiet', text: 'Quietly thank everyone and ask to just enjoy the cake and company.', effect: { statChanges: { happiness: 30, karma: 2 }, repChanges: { family: 15 }, outcomeText: 'No fanfare, just warmth. You spend three hours in genuine conversation with people who shaped your life. It\'s perfect.', narrativeVariants: { positive: [{ text: 'You skip the grand summary and spend the afternoon exchanging small, specific thanks. The quiet makes room for the relationships the résumé could never show.' }, { text: 'There is no final performance. Just cake, old stories, and conversations with people who remember versions of you that no longer exist.' }] }, logText: 'Had a quiet, deeply meaningful retirement party.' } }
    ]
  },
  {
    id: 'life_health_scare',
    title: '❤️ The Health Wake-Up Call',
    text: 'Your doctor calls with some unexpected test results. Nothing life-threatening, but they want you to seriously reconsider your lifestyle habits. "You are getting older," they say. "Your body is not forgiving anymore."',
    category: 'general',
    conditions: { minAge: 35 },
    weight: 30,
    choices: [
      { id: 'health_change', text: 'Commit to a complete lifestyle overhaul starting today.', effect: { statChanges: { health: 20, happiness: 15, willpower: 25 }, outcomeText: 'You quit the junk food, start walking every morning, and actually go to sleep before midnight. Six months later, your next checkup shows dramatic improvement.', narrativeVariants: { positive: [{ text: 'The warning arrives while your career is consuming every spare hour. You begin treating sleep, food, and movement as obligations as real as any deadline.', careerGroups: ['actor', 'creator', 'adult_performer', 'corporate'] }, { text: 'You have ignored smaller warnings before. This time, the memory of those failures turns motivation into routine instead of another temporary promise.', requiredFlags: ['health_warning_ignored'] }, { text: 'The first weeks are uncomfortable and ordinary. Months later, the improved results feel less like luck than proof that your future can still be influenced.' }] }, logText: 'Doctor\'s warning triggered a complete and successful lifestyle overhaul.' } },
      { id: 'health_ignore', text: 'Nod politely and immediately eat a cheeseburger.', effect: { statChanges: { health: -15, happiness: 10 }, outcomeText: 'The cheeseburger is magnificent. You tell yourself you will start next Monday. Next Monday comes and goes. The cycle continues.', narrativeVariants: { chaotic: [{ text: 'The meal is comforting precisely because the appointment was frightening. You postpone change until Monday, then use work, money, and exhaustion to postpone it again.', careerGroups: ['corporate', 'creator', 'actor'] }, { text: 'You can afford every specialist and still cannot purchase the willingness to change. The contradiction follows you through another indulgent meal.', wealthBands: ['wealthy'] }, { text: 'Denial tastes good for an evening. By the next week, the doctor\'s warning has become background noise and the cycle has resumed.' }] }, logText: 'Responded to a health scare with a cheeseburger. Starting healthy habits "next Monday".' } },
      { id: 'health_research', text: 'Deep-dive into health research and consult a specialist.', effect: { statChanges: { smarts: 20, health: 15, willpower: 15 }, outcomeText: 'You become extremely knowledgeable about your condition and put together a solid personalized plan with a nutritionist. People start coming to you for health advice.', narrativeVariants: { positive: [{ text: 'Money gives you access to specialists, but the real change comes from asking better questions and following the plan after the appointments end.', wealthBands: ['comfortable', 'wealthy'] }, { text: 'Specialist care strains the budget, so you arrive prepared and make every appointment count. Knowledge becomes a form of control when money cannot be.', wealthBands: ['struggling', 'stable'] }, { text: 'You turn fear into research, then research into a routine built for your actual life rather than an idealized one.' }] }, logText: 'Researched health scare extensively and developed a specialist-guided plan.' } }
    ]
  },
  {
    id: 'random_scam_call',
    title: '📞 The Urgent Phone Call',
    text: 'You receive a frantic phone call from someone claiming to be from the government tax agency. They say there is a warrant out for your arrest due to unpaid taxes, and the police are on their way unless you pay a fine immediately.',
    category: 'general',
    conditions: { minAge: 18 },
    weight: 45,
    choices: [
      { id: 'scam_pay', text: 'Panic and wire them the $1,500 fine to avoid jail.', effect: { statChanges: { happiness: -40, smarts: -15 }, cashChange: -1500, outcomeText: 'You wire the money in a complete panic. Two hours later, you call the real tax agency to confirm... it was a scam. Your money is gone, and you feel incredibly foolish.', narrativeVariants: { negative: [{ text: 'The transfer empties the money you kept for rent and emergencies. Shame arrives beside a practical crisis: the scam will affect the rest of the month.', wealthBands: ['struggling', 'stable'] }, { text: 'The loss is affordable, which does nothing to soften the humiliation. You keep replaying the moment fear overruled experience.', wealthBands: ['wealthy'] }, { text: 'The caller understands exactly how to make adulthood feel like one missed notice away from disaster. By the time you verify the story, the money and your confidence are gone.' }] }, logText: 'Fell for a terrifying government tax scam call and lost $1,500.' } },
      { id: 'scam_yell', text: 'Yell at them and hang up the phone.', effect: { statChanges: { willpower: 10, karma: -5 }, outcomeText: 'You scream profanities into the phone and slam it down. Your heart is pounding. You check your actual tax portal just in case—you\'re clear. It was a scam.', narrativeVariants: { chaotic: [{ text: 'You recognize the script but not before it reaches your nerves. Anger gets you off the call; checking the real account is what finally lets you breathe.' }, { text: 'Experience tells you the threat is false, while your body reacts as if police are already outside. You hang up furious and verify everything twice.', minAge: 40 }] }, logText: 'Yelled at a tax scammer over the phone and hung up.' } },
      { id: 'scam_ignore', text: 'Just block the number and go back to sleep.', effect: { statChanges: { happiness: 5 }, outcomeText: 'You block the number without a second thought. If the government wants you, they can send a letter. You take a fantastic nap.', narrativeVariants: { positive: [{ text: 'Years of bills and official correspondence have taught you one useful rule: real institutions leave a paper trail. You block the number and protect your afternoon.', minAge: 35 }, { text: 'The caller demands urgency; you answer with indifference. The number disappears into the block list, taking its manufactured crisis with it.' }] }, logText: 'Ignored a government scam call and took a nap.' } }
    ]
  },
  {
    id: 'random_bird_attack',
    title: '🦅 Unprovoked Attack',
    text: 'You are walking through the park minding your own business when a massive, angry goose locks eyes with you. It lowers its head, hisses, and charges directly at your legs!',
    category: 'general',
    conditions: { minAge: 6 },
    weight: 35,
    choices: [
      { id: 'bird_run', text: 'Run for your life!', effect: { statChanges: { happiness: -15, status: -10 }, outcomeText: 'You sprint away screaming in terror as the goose chases you for three blocks. A group of teenagers film the entire incident and laugh at you.', logText: 'Was violently chased through the park by an angry goose while teenagers laughed.' } },
      { id: 'bird_fight', text: 'Stand your ground and kick it!', effect: { statChanges: { health: -20, karma: -15, happiness: -20 }, outcomeText: 'You try to kick the goose, but it dodges with ninja-like reflexes and bites you fiercely on the knee. It draws blood. You limp away defeated by a bird.', logText: 'Got into a physical altercation with a goose and lost terribly. Sustained minor injuries.' } },
      { id: 'bird_bribe', text: 'Throw your expensive sandwich at it.', effect: { statChanges: { happiness: -5 }, cashChange: -15, outcomeText: 'You sacrifice your delicious $15 artisanal sandwich to appease the beast. The goose devours it and spares your life. You are safe, but hungry.', logText: 'Bribed an attacking goose with a $15 sandwich to spare my life.' } }
    ]
  }
,
  // --- GDD SOCIAL MEDIA & RANDOM ADULT EVENTS ---
  {
    id: 'gdd_event_1_algo',
    title: 'THE ALGORITHM SHIFT',
    text: 'FanZone has rolled out a strict new algorithm. Posting multiple times daily is now penalized, while premium weekly long-form content receives double reach. What is your strategy?',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_algo_daily',
        text: '📅 Post Daily Anyway',
        effect: {
          statChanges: { happiness: -5 },
          outcomeText: 'You stick to your grinding schedule. Your views are flat, you get buried by the new algorithm, and you feel completely exhausted.',
          narrativeVariants: { negative: [{ text: 'The schedule becomes a second job: visible, measurable, and difficult to stop even when your body asks for a weekend.', careers: ['creator', 'adult_performer'], wealthBands: ['struggling', 'stable'] }, { text: 'The numbers stay flat because you keep showing up to an audience that is no longer being shown your work.', careers: ['creator', 'adult_performer'], minFame: 40 }, { text: 'You learn the first public lesson of growth: momentum feels like success until it starts choosing your hours for you.' }] },
          logText: 'Chose to grind posts daily despite the negative algorithm shift.'
        }
      },
      {
        id: 'gdd_algo_weekly',
        text: '🎥 Switch to Weekly',
        effect: {
          statChanges: { happiness: 5 },
          outcomeText: 'Your fans complain about the lack of content, but your new weekly uploads look incredibly professional and get double reach.',
          narrativeVariants: { positive: [{ text: 'A smaller schedule gives you enough room to remember why you started. The audience that stays feels more like a community than a metric.', careers: ['creator', 'adult_performer'] }, { text: 'You stop treating rest as an apology. The work is steadier because your life has somewhere else to go.', minFame: 35 }, { text: 'The compromise is not glamorous, but it lets ambition share a house with sleep.', wealthBands: ['struggling', 'stable'] }] },
          logText: 'Pivoted to weekly high-quality uploads following the algorithm update.'
        }
      },
      {
        id: 'gdd_algo_boost',
        text: '💰 Pay for Algorithm Boost ($500)',
        effect: {
          cashChange: -500,
          outcomeText: 'The algorithm boost delivers thousands of bot views, but your organic reach modifier drops permanently.',
          narrativeVariants: { negative: [{ text: 'The reach is real for a week and the cost is immediate. Growth starts to feel like a wager made with rent money.', wealthBands: ['struggling', 'stable'] }, { text: 'You can absorb the bill, but the sudden attention still leaves you wondering whether people found the work or the advertisement.', wealthBands: ['comfortable', 'wealthy'] }, { text: 'Buying momentum works just well enough to make the next boost feel inevitable.', careers: ['creator', 'adult_performer'] }] },
          logText: 'Paid $500 for a temporary algorithm traffic boost.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_2_ban',
    title: 'FLAGGED FOR EXPLICIT CONTENT',
    text: 'Your latest SpicyChat post has been flagged by automated filters for violating Terms of Service. One more strike triggers a permanent ban. How do you respond?',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_ban_appeal',
        text: 'appeal the Strike',
        effect: {
          outcomeText: 'Appeal rejected! The moderators warn you to keep it clean. Your stress level is through the roof.',
          narrativeVariants: { neutral: [{ text: 'The appeal disappears into a moderation queue. You are left translating an automated warning into a new set of creative boundaries.', careers: ['creator', 'adult_performer'] }, { text: 'The rejection is impersonal, which somehow makes it harder to argue with. Your audience waits while you rewrite the plan.', minFame: 40 }, { text: 'A platform rule becomes a career question: adapt, move, or accept that the audience does not belong entirely to you.' }] },
          logText: 'Unsuccessfully appealed a SpicyChat content strike.'
        }
      },
      {
        id: 'gdd_ban_delete',
        text: '🗑️ Delete Flagged Post ($200 loss)',
        effect: {
          cashChange: -200,
          outcomeText: 'You deleted the evidence. The warning strike is removed, but your fans are disappointed that you folded.',
          narrativeVariants: { negative: [{ text: 'You spend the money to keep the account alive and discover that survival can still look like retreat to the people watching.', wealthBands: ['struggling', 'stable'] }, { text: 'The strike disappears. The screenshot of it does not, and your audience starts debating what you will compromise next.', minFame: 45 }, { text: 'Protecting the platform means accepting that the platform gets a vote in your creative life.', careers: ['creator', 'adult_performer'] }] },
          logText: 'Deleted flagged post, taking a temporary PPV refund hit.'
        }
      },
      {
        id: 'gdd_ban_migrate',
        text: 'Move to RedStage',
        effect: {
          outcomeText: 'You announce your migration. Your RedStage subscriber count jumps, but your cashflow takes a temporary hit.',
          narrativeVariants: { neutral: [{ text: 'The audience follows, but not all at once. You are rebuilding a business while pretending the move was always part of the plan.', careers: ['creator', 'adult_performer'] }, { text: 'A new platform offers fresh control and fresh uncertainty. The first week is less a victory than a test of who actually follows you.', minFame: 35 }, { text: 'You leave before the ban can decide your future, accepting that independence often begins with an inconvenient invoice.' }] },
          logText: 'Announced migration to RedStage to avoid permanent SpicyChat ban.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_3_verify',
    title: 'THE VERIFICATION CONTRACT',
    text: 'FanZone offers you a blue checkmark to protect your identity, but they require you to submit your legal ID linked to your public profile page. Will you verify?',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_verify_real',
        text: '✔️ Verify with Real ID',
        effect: {
          statChanges: { status: 15 },
          outcomeText: 'You are verified! Growth explodes, but a local forum leaks your government name.',
          logText: 'Verified creator profile with real ID, losing anonymity.'
        }
      },
      {
        id: 'gdd_verify_fake',
        text: '🆔 Buy Fake ID Verification ($200)',
        effect: {
          cashChange: -200,
          outcomeText: 'The black-market ID works! Your profile looks official, and nobody knows who you really are.',
          logText: 'Purchased a fake ID to obtain verification status anonymously.'
        }
      },
      {
        id: 'gdd_verify_reject',
        text: '❌ Reject the Badge',
        effect: {
          outcomeText: 'You value your privacy. Your follower growth slows down, but you sleep easily.',
          logText: 'Rejected the profile verification badge to preserve anonymity.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_4_copycat',
    title: 'THE CARBON COPY',
    text: 'A rising star has copied your logo, your exact cosplay designs, and even uses your captions word-for-word. They are gaining fast. What is your play?',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_copycat_expose',
        text: '📢 Expose Them Publicly',
        effect: {
          outcomeText: 'You start a massive internet war. Fans flood their comments, but other creators call you toxic.',
          logText: 'Publicly exposed a copycat creator on social channels.'
        }
      },
      {
        id: 'gdd_copycat_collab',
        text: '🤝 Propose a Duet / Collab',
        effect: {
          cashChange: 1000,
          outcomeText: 'The crossover video is a hit! You convert their audience and double your average views.',
          logText: 'Co-opted copycat creator into a collaborative project.'
        }
      },
      {
        id: 'gdd_copycat_ignore',
        text: '🤫 Ignore & Change Styles',
        effect: {
          statChanges: { smarts: 15 },
          outcomeText: 'You quietly update your wardrobe. Your new high-fashion look leaves the copycat looking outdated.',
          logText: 'Ignored copycat and innovated new fashion content.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_5_sabotage',
    title: 'THE FORBIDDEN CLIP',
    text: 'A user in your Live chat claims they will drop a $5,000 tip right now if you ingest a bottle of prescription pills on camera.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_sabotage_fake',
        text: '💊 Fake It with Candy (Risky)',
        effect: {
          cashChange: 5000,
          outcomeText: 'You pulled it off! The cash lands in your account, but viewers clip it and report you to the moderators.',
          logText: 'Faked pill ingestion for a $5,000 live stream tip.'
        }
      },
      {
        id: 'gdd_sabotage_ban',
        text: '🚫 Ban the Troll',
        effect: {
          outcomeText: 'You delete their account. The stream cools off, but your moderators praise your morals.',
          logText: 'Banned stream troll who demanded self-harm for tips.'
        }
      },
      {
        id: 'gdd_sabotage_laugh',
        text: '😜 Laugh It Off',
        effect: {
          cashChange: 200,
          outcomeText: 'You joke about it. The chat laughs and dumps smaller tips to keep the stream positive.',
          logText: 'Laughed off self-harm tip request on live stream.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_6_stalker',
    title: 'THE HOME DELIVERY',
    text: 'An obsessive subscriber has tracked your real address. You receive a package containing roses, a card, and a Polaroid of your front gate.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_stalker_move',
        text: '🏢 Sign New Lease & Move ($5,000)',
        effect: {
          cashChange: -5000,
          outcomeText: 'You packed your bags and moved. Your wallet is light, but you finally feel safe again.',
          logText: 'Relocated apartment quickly to escape stalker tracking.'
        }
      },
      {
        id: 'gdd_stalker_police',
        text: '👮 Report to Police',
        effect: {
          outcomeText: 'The officer takes your statement and says "stay off the internet." Nothing is resolved.',
          logText: 'Reported stalker to police, with no immediate action taken.'
        }
      },
      {
        id: 'gdd_stalker_expose',
        text: '📢 Expose Them Online',
        effect: {
          outcomeText: 'Your post goes viral. The community rallies to identify them, but you get a creepy anonymous DM.',
          logText: 'Exposed stalker publicly on social channels.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_7_partner_collab',
    title: 'THE REVENUE STEAL',
    text: 'Your collab partner uploaded your joint video on their page early, withdrew all the earnings ($10K), and blocked your phone number.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_partner_feud',
        text: '🔥 Launch Diss Track & Feud',
        effect: {
          outcomeText: 'Your diss track is fire! You get massive clout, but the industry brands you as toxic.',
          logText: 'Launched public online war against partner thief.'
        }
      },
      {
        id: 'gdd_partner_sue',
        text: '⚖️ Hire Attorney to Sue ($3,000)',
        effect: {
          cashChange: 2000,
          outcomeText: 'The lawyer sends a letter. Your ex-partner panics and agrees to settle out of court for a partial return.',
          logText: 'Retained attorney to recover stolen collab revenue.'
        }
      },
      {
        id: 'gdd_partner_forgive',
        text: '🧘 Accept the Loss & Move On',
        effect: {
          statChanges: { happiness: 5 },
          outcomeText: 'You take a deep breath and ignore it. You focus on your own work and feel lighter.',
          logText: 'Accepted the loss of collab revenue to avoid drama.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_8_sugar_date',
    title: 'THE SUGAR OFFER',
    text: 'A top-tier fan who has spent $20K on your custom messages offers to fully pay your lease for a year if you fly out for a real dinner date.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_sugar_date_yes',
        text: '✈️ Accept the Date',
        effect: {
          cashChange: 15000,
          outcomeText: 'You went on the trip. They paid the cash, but kept trying to touch your arm. You feel dirty and unsafe.',
          logText: 'Accepted sugar date, earning $15,000 but losing boundaries.'
        }
      },
      {
        id: 'gdd_sugar_date_no',
        text: '❌ Decline the Offer',
        effect: {
          outcomeText: 'You declined. The fan calls you ungrateful and deletes their account, costing you monthly tip income.',
          logText: 'Declined sugar date, resulting in fan unsubscribing.'
        }
      },
      {
        id: 'gdd_sugar_date_virtual',
        text: '💻 Offer Virtual Live Show',
        effect: {
          cashChange: 3000,
          outcomeText: 'They agree to the virtual show! They tip you heavily on stream and respect your rules.',
          logText: 'Negotiated virtual show alternative with sugar fan.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_9_beef',
    title: 'THE DISS VIDEO',
    text: 'A massive creator with 5 million subscribers has posted a review mocking your acting skills and looks. Your comments are flooded.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_beef_savage',
        text: '🤬 Attack Them Savage style',
        effect: {
          outcomeText: 'You drag them in a response video. Your follower count grows, but the constant hate DMs stress you out.',
          logText: 'Fought back with aggressive drama response video.'
        }
      },
      {
        id: 'gdd_beef_mature',
        text: '🕊️ Send Mature Response',
        effect: {
          outcomeText: 'Your mature reply gets praised by major channels. You look like the bigger person.',
          logText: 'Released poised response to creator beef invitation.'
        }
      },
      {
        id: 'gdd_beef_collab',
        text: '💼 Ask to Collab (Truce)',
        effect: {
          outcomeText: 'They post your collab request to Twitter with the caption "Desperate for views." You are humiliated.',
          logText: 'Rejected collab suggestion and publicly roasted by beef instigator.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_10_gift',
    title: 'THE TROLL PACKAGE',
    text: 'A follower sends you a beautiful $3,000 designer handbag. When examining the seams, you discover a tiny, active spy camera inside.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_gift_wear',
        text: '📸 Pose with it for Content',
        effect: {
          cashChange: 500,
          outcomeText: 'You kept it. A week later, your bedroom photos are leaked on an anonymous forum.',
          logText: 'Posed with a gifted bag containing a spy camera.'
        }
      },
      {
        id: 'gdd_gift_destroy',
        text: '🔥 Destroy & Report to Police',
        effect: {
          outcomeText: 'You smashed the bag and gave it to the police. They run a scan on the camera IP address.',
          logText: 'Destroyed spy camera gift and reported it to police.'
        }
      },
      {
        id: 'gdd_gift_sell',
        text: '💲 Sell it Online',
        effect: {
          cashChange: 800,
          outcomeText: 'You sold it. The spy camera was wiped, but the sender sends a furious anonymous email.',
          logText: 'Wiped spy camera gift and resold it online.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_11_tax',
    title: 'THE TAX INSPECTION',
    text: 'The IRS has flagged your large cash withdrawals and FanZone income. They demand receipts for the last three tax years. You have none.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_tax_lawyer',
        text: '💼 Hire Tax Attorney ($15,000)',
        effect: {
          cashChange: -17000,
          outcomeText: 'Your attorney finds a loophole. The fine is dropped to $2,000. You are cleared.',
          logText: 'Retained attorney to settle IRS audit.'
        }
      },
      {
        id: 'gdd_tax_fine',
        text: '💸 Pay the Fine Instantly ($25,000)',
        effect: {
          cashChange: -25000,
          outcomeText: 'You paid the full bill. Your savings are empty, but the government leaves you alone.',
          logText: 'Paid $25,000 penalty fine to settle audit case.'
        }
      },
      {
        id: 'gdd_tax_ignore',
        text: '🤫 Ignore & Hide Cash',
        effect: {
          outcomeText: 'You ignored the warnings. A week later, you receive a formal court summons.',
          logText: 'Ignored IRS notices, attempting to hide cash reserves.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_12_refunds',
    title: 'THE MASS REFUNDS',
    text: 'A gang of scammers used stolen cards to buy $3,200 of your video customs. The bank processed chargebacks, freezing your account.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_refund_id',
        text: '🔒 Lock Account Behind ID Check',
        effect: {
          outcomeText: 'The extra ID step annoys standard fans, but your refund rate drops to zero.',
          logText: 'Enabled strict client ID verification protocols.'
        }
      },
      {
        id: 'gdd_refund_crypto',
        text: '🪙 Switch to Crypto Payments',
        effect: {
          outcomeText: 'Most of your fans don\'t understand wallets. Income drops, but payments are final.',
          logText: 'Switched platform store to crypto-only processing.'
        }
      },
      {
        id: 'gdd_refund_accept',
        text: '🤷 Accept the Loss ($3,200)',
        effect: {
          cashChange: -3500,
          outcomeText: 'You wrote it off. Your bank charges you an extra processing penalty fee.',
          logText: 'Wrote off scam chargeback losses, taking a fee hit.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_13_camera',
    title: 'CAMERA CRASH',
    text: 'Your expensive studio camera falls off its tripod and breaks. You have three paid custom orders due by tomorrow morning.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_camera_buy',
        text: '📸 Buy Same-Day DSLR Gear ($1,500)',
        effect: {
          cashChange: -1500,
          outcomeText: 'You bought the new gear. The shots look amazing and you hit your deadlines.',
          logText: 'Purchased emergency camera equipment to hit deadlines.'
        }
      },
      {
        id: 'gdd_camera_phone',
        text: '📱 Filming on Your Phone',
        effect: {
          outcomeText: 'The phone quality was terrible. Two clients demand their money back.',
          logText: 'Filmed custom videos on phone to avoid buying new gear.'
        }
      },
      {
        id: 'gdd_camera_delay',
        text: '✉️ Message Fans for Delay ($500 loss)',
        effect: {
          cashChange: -500,
          outcomeText: 'Your fans appreciate the honesty, but one cancels their subscription out of anger.',
          logText: 'Requested video custom extensions due to equipment failures.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_14_sponsor',
    title: 'THE SHADY SPONSOR',
    text: 'A supplement brand offers you $50K to promote a "fat burner" pill. You read reports that the pill has caused liver damage in tests.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_sponsor_yes',
        text: '💲 Accept the Deal ($50K)',
        effect: {
          cashChange: 50000,
          outcomeText: 'The money is in the bank! However, three major drama channels upload call-out videos.',
          logText: 'Promoted hazardous supplements for a $50,000 fee.'
        }
      },
      {
        id: 'gdd_sponsor_negotiate',
        text: '⚖️ Negotiate Safe Alternative ($30K)',
        effect: {
          cashChange: 30000,
          outcomeText: 'They agree to promote their new multivitamin instead. Your fans respect you.',
          logText: 'Negotiated multivitamin sponsorship alternative.'
        }
      },
      {
        id: 'gdd_sponsor_no',
        text: '❌ Reject the Deal',
        effect: {
          outcomeText: 'You refused. The company blacklists you from their network, but your fan respect rises.',
          logText: 'Rejected supplement sponsor deal on safety grounds.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_15_sugar',
    title: 'THE HIGH-ROLLER COMPANION',
    text: 'A verified billionaire DMs you: "I will send you $10,000 every month if you agree to text me goodnight and send one selfie daily."',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_sugar_yes',
        text: '🤝 Accept the Allowance',
        effect: {
          cashChange: 10000,
          outcomeText: 'The payments land on time. However, they start calling you at 3 AM demanding video chats.',
          logText: 'Accepted billionaire companion contract for monthly payouts.'
        }
      },
      {
        id: 'gdd_sugar_negotiate',
        text: '🔒 Set Strict Text Rules ($5K)',
        effect: {
          cashChange: 5000,
          outcomeText: 'They agree to the boundaries! You get a steady cash stream with zero physical risk.',
          logText: 'Agreed companion contract with strict safety boundaries.'
        }
      },
      {
        id: 'gdd_sugar_no',
        text: '❌ Decline the Cash',
        effect: {
          cashChange: 500,
          outcomeText: 'You decline. The user tips you $500 on your next post anyway out of respect.',
          logText: 'Declined sugar allowance contract.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_16_std',
    title: 'THE POSITIVE RESULTS',
    text: 'Your bi-weekly clinic test comes back POSITIVE for Chlamydia. You filmed collab scenes with three other creators last Tuesday.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_std_inform',
        text: '📢 Inform Partners Immediately',
        effect: {
          cashChange: -2000,
          outcomeText: 'Your partners are upset but appreciate the warning. They get treated. The incident stays private.',
          logText: 'Disclosed clinic test results to collaborators, taking down scenes.'
        }
      },
      {
        id: 'gdd_std_hide',
        text: '🤫 Treat Quietly & Ignore',
        effect: {
          outcomeText: 'You took the pills and said nothing. A week later, one of the partners tests positive and blames you on Twitter.',
          logText: 'Attempted to resolve infection quietly without notifying scene partners.'
        }
      },
      {
        id: 'gdd_std_pivot',
        text: '🛑 Stop Performing & Pivot',
        effect: {
          outcomeText: 'You cancel your upcoming gigs. You take time to recover, and your health returns to normal.',
          logText: 'Stopped active studio filming following clinic test results.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_17_burnout',
    title: 'THE CRASH',
    text: 'You have been editing videos and replying to DMs for 36 hours straight. You are crying at your desk and your chest feels tight.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_burnout_vacation',
        text: '🛌 Take a 2-Week Vacation ($1,000)',
        effect: {
          cashChange: -1000,
          outcomeText: 'You unplugged your router and went to the beach. Your mind is clear, but your subscriber count dipped.',
          logText: 'Took emergency mental health vacation.'
        }
      },
      {
        id: 'gdd_burnout_assistant',
        text: '🤖 Hire Content Assistant ($1,500/mo)',
        effect: {
          outcomeText: 'Your new assistant handles the boring tasks. You get to sleep and keep posting.',
          logText: 'Hired business assistant to manage messaging channels.'
        }
      },
      {
        id: 'gdd_burnout_push',
        text: '☕ Take Caffeine & Push On',
        effect: {
          statChanges: { health: -15 },
          outcomeText: 'Your heart starts racing mid-stream. You collapse and wake up in an ambulance.',
          logText: 'Collapsed from work exhaustion during live stream.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_18_addiction',
    title: 'THE ENERGY INCENTIVE',
    text: 'During a long night shoot, another performer offers you a line of cocaine: "This is the only way we get through these late-night sets."',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_addiction_snort',
        text: '👃 Snort It (Energy Boost)',
        effect: {
          statChanges: { health: -15 },
          outcomeText: 'You finish the shoot with crazy energy, but the next morning you wake up craving another hit.',
          logText: 'Accepted cocaine line on set to boost energy.'
        }
      },
      {
        id: 'gdd_addiction_refuse',
        text: '❌ Refuse & Walk Off Set ($1,000 loss)',
        effect: {
          cashChange: -1000,
          outcomeText: 'You packed your bags. You lost the gig fee, but you protected your body and your sobriety.',
          logText: 'Walked off late-night film set to protect sobriety.'
        }
      },
      {
        id: 'gdd_addiction_report',
        text: '📢 File Report to Producer',
        effect: {
          outcomeText: 'The producer fires the other actor, but the community brands you as a tattle-tale.',
          logText: 'Reported drug usage on set to studio producers.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_19_upgrade',
    title: 'THE UPGRADE OFFER',
    text: 'Your agency suggests a breast or butt augmentation surgery ($15K) to double your booking rate. Your fans love your current natural look.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_upgrade_yes',
        text: '🏥 Get Augmentation Surgery ($15,000)',
        effect: {
          cashChange: -15000,
          statChanges: { looks: 20 },
          outcomeText: 'The surgery goes well. Your bookings increase, but some long-term fans unsubscribe.',
          logText: 'Completed augmentative surgery procedure.'
        }
      },
      {
        id: 'gdd_upgrade_budget',
        text: '🩺 Use Budget Overseas Doctor ($4,500)',
        effect: {
          cashChange: -4500,
          statChanges: { looks: -30, health: -40 },
          outcomeText: 'The doctor made a huge error. You get a massive infection and your chest looks deformed.',
          logText: 'Completed augmentative surgery under budget clinic.'
        }
      },
      {
        id: 'gdd_upgrade_no',
        text: '❌ Reject Augmentation',
        effect: {
          outcomeText: 'You stay natural. Your fans launch a supportive hashtag praising your body.',
          logText: 'Rejected agency suggestions for augmentative surgery.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_20_meltdown',
    title: 'THE STREAM MELTDOWN',
    text: 'You suffer a severe panic attack live on camera in front of 8,000 viewers. You are hyperventilating and sobbing.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_meltdown_apology',
        text: '📢 Post Honest Apology Video',
        effect: {
          outcomeText: 'Your honesty goes viral. Fans support you and send gifts.',
          logText: 'Released explanation video regarding live panic attack.'
        }
      },
      {
        id: 'gdd_meltdown_art',
        text: '🎭 Claim it was Performance Art',
        effect: {
          outcomeText: 'No one believes it was acting. You look crazy and fake.',
          logText: 'Claimed panic attack was performance art.'
        }
      },
      {
        id: 'gdd_meltdown_delete',
        text: '🗑️ Delete the Stream Archives ($300 loss)',
        effect: {
          cashChange: -300,
          outcomeText: 'You scrub the archives, but viewers already posted clips on Reddit.',
          logText: 'Scrubbed stream archives following panic attack.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_21_phone',
    title: 'THE UNLOCKED PHONE',
    text: 'Your mother borrowed your phone to call a relative and accidentally opened your active FanZone creator wallet showing $15,000 in payouts.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_phone_truth',
        text: '🗣️ Tell Her the Truth',
        effect: {
          outcomeText: 'She is horrified and calls it "sinful money," but you feel relieved the secret is out.',
          narrativeVariants: { neutral: [{ text: 'The truth lands badly, but it is no longer taking up space between every call and every family silence.', careers: ['creator', 'adult_performer'] }, { text: 'Her reaction is shaped by fear as much as judgment. You leave the conversation bruised, relieved, and newly visible.', minFame: 40 }, { text: 'You choose honesty before the secret can become a second relationship in the family.' }] },
          logText: 'Disclosed adult platform creator earnings directly to family.'
        }
      },
      {
        id: 'gdd_phone_lie',
        text: '🤥 Lie and Say it is a Bug',
        effect: {
          outcomeText: 'She believes you for now, but she starts looking at you suspiciously.',
          narrativeVariants: { neutral: [{ text: 'The lie buys one quiet evening and spends a little trust every time your phone lights up.', careers: ['creator', 'adult_performer'] }, { text: 'You protect the account by making the relationship less honest. That trade feels manageable until the next question.', minFame: 35 }, { text: 'The explanation is plausible enough to survive the night, not the history that follows it.' }] },
          logText: 'Concealed phone earnings from parents, claiming UI bug.'
        }
      },
      {
        id: 'gdd_phone_cutoff',
        text: '🛑 Cut Off Contact',
        effect: {
          outcomeText: 'You block her number. You are alone, but nobody can control you anymore.',
          narrativeVariants: { negative: [{ text: 'The block creates immediate peace and a much longer silence. Independence is easier to announce than to live with.', careers: ['creator', 'adult_performer'] }, { text: 'You choose control over reconciliation, then discover that control cannot answer when the evening gets quiet.', minFame: 40 }, { text: 'The secret is yours again. So is the responsibility for what the family no longer gets to know.' }] },
          logText: 'Severed family ties following phone disclosure.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_22_ultimatum',
    title: 'THE ULTIMATUM',
    text: 'Your partner has discovered your OnlyFans page. They give you a choice: "Delete your accounts and quit, or I am leaving you tonight."',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_ultimatum_partner',
        text: '❤️ Delete Accounts for Love',
        effect: {
          outcomeText: 'You deleted everything. You are broke but together. You feel a seed of resentment.',
          narrativeVariants: { neutral: [{ text: 'You save the relationship by giving up the work, then notice the resentment arriving before the relief has finished.', careers: ['creator', 'adult_performer'], wealthBands: ['struggling', 'stable'] }, { text: 'Love wins the argument and loses a piece of the future you were building. Both facts remain true over dinner.', minFame: 45 }, { text: 'The account is gone, the partner is still there, and the question of whose life this is has only become quieter.' }] },
          logText: 'Deactivated platforms to resolve partner relationship ultimatum.'
        }
      },
      {
        id: 'gdd_ultimatum_career',
        text: '🍑 Choose Your Career',
        effect: {
          outcomeText: 'They pack their bags. You cry alone, but your evening content session goes smoothly.',
          narrativeVariants: { negative: [{ text: 'The work continues because deadlines do not attend breakups. Success that night feels uncomfortably close to proof.', careers: ['creator', 'adult_performer'] }, { text: 'You choose the career, then spend the first successful evening wishing someone specific were proud of it.', minFame: 45 }, { text: 'The audience rewards consistency while your private life records the cost of it.' }] },
          logText: 'Ended relationship to maintain creator profile.'
        }
      },
      {
        id: 'gdd_ultimatum_open',
        text: '💬 Negotiate Open Boundary',
        effect: {
          outcomeText: 'Negotiation failed! They throw their key at you and block your number.',
          narrativeVariants: { negative: [{ text: 'You offered a compromise because you wanted both lives. The slammed door makes the choice feel less thoughtful and more final.', careers: ['creator', 'adult_performer'] }, { text: 'The boundary was honest, but honesty cannot make another person want the same relationship.', minAge: 30 }, { text: 'The career remains; the future you imagined around it does not.' }] },
          logText: 'Unsuccessfully suggested open relationship boundary alternative.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_23_blackmail',
    title: 'THE SIBLING BLACKMAIL',
    text: 'Your brother found your profile. He demands $2,000 every month to keep quiet, or he\'ll send the links to your strict parents.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_blackmail_pay',
        text: '💵 Pay the Hush Money ($2,000/mo)',
        effect: {
          cashChange: -2000,
          outcomeText: 'You send him the cash. You feel sick knowing your brother is extorting you.',
          logText: 'Submitted to sibling blackmail payment demands.'
        }
      },
      {
        id: 'gdd_blackmail_parents',
        text: '📣 Tell Parents Yourself First',
        effect: {
          outcomeText: 'You call Mom and tell her. She cries, but your brother is grounded and has no power.',
          logText: 'Self-disclosed profile to parents to preempt blackmail.'
        }
      },
      {
        id: 'gdd_blackmail_ignore',
        text: '🤫 Ignore & Dare Him',
        effect: {
          outcomeText: 'He calls your dad immediately. The phone starts ringing. It\'s your dad.',
          logText: 'Ignored sibling blackmail threat, letting them link family.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_24_dating',
    title: 'THE SCREENSHOT VIRAL',
    text: 'A match on Tinder recognized your avatar, took screenshots of your profile, and posted them online saying: "Dating is dead in 2026."',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_dating_own',
        text: '🔥 Own It and Pin the Post',
        effect: {
          statChanges: { status: 15 },
          outcomeText: 'You reposted it. Your OnlyFans subs jump by 500. The Tinder match looks stupid.',
          logText: 'Doxxed match back by pinning their Tinder call-out.'
        }
      },
      {
        id: 'gdd_dating_report',
        text: '🚫 Report Tinder Account',
        effect: {
          outcomeText: 'Tinder support replies with a canned message. The screenshot keeps spreading.',
          logText: 'Submitted platform report regarding Tinder screenshot sharing.'
        }
      },
      {
        id: 'gdd_dating_ignore',
        text: '🤫 Ignore and Keep Swiping',
        effect: {
          outcomeText: 'You say nothing. Judgmental matches filter themselves out automatically.',
          logText: 'Ignored Tinder doxx screenshot attempt.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_25_bbq',
    title: 'THE CO-WORKER\'S EYE',
    text: 'At a family dinner, your father\'s coworker pulls him aside and shows him a video on his phone. Dad returns to the table white-faced.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_bbq_meeting',
        text: '🏛️ Request Private Meeting',
        effect: {
          outcomeText: 'You explained your finances in his study. He is disappointed but agrees to process the news.',
          logText: 'Requested study meeting with father to clarify video links.'
        }
      },
      {
        id: 'gdd_bbq_run',
        text: '🏃 Grab Your Keys and Run',
        effect: {
          outcomeText: 'You drove home in tears. The family group chat is blowing up.',
          logText: 'Left family dinner abruptly after profile discovery.'
        }
      },
      {
        id: 'gdd_bbq_business',
        text: '💼 Treat it as a Legal Business',
        effect: {
          outcomeText: 'You show him your tax filings. He is shocked by the numbers and respects the cashflow.',
          logText: 'Exhibited tax filings to clarify profile as legal entity.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_26_sting',
    title: 'THE UNDERCOVER CLIENT',
    text: 'You arrive at a hotel for a private escort gig. The client locks the door, pulls out a badge, and says "You are under arrest for soliciting."',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_sting_lawyer',
        text: '💼 Call Private Lawyer ($5,000)',
        effect: {
          cashChange: -5000,
          outcomeText: 'Your lawyer gets the charges dropped due to illegal entrapment.',
          logText: 'Hired private counsel to dismiss hotel solicitation arrest.'
        }
      },
      {
        id: 'gdd_sting_guilty',
        text: '🙋 Plead Guilty & Take Fine ($2,000)',
        effect: {
          cashChange: -2000,
          outcomeText: 'You plead out. You pay the fine, but you now have a solicitation record.',
          logText: 'Plead guilty to solicitation, paying a $2,000 fine.'
        }
      },
      {
        id: 'gdd_sting_run',
        text: '🏃 Run for the Window',
        effect: {
          statChanges: { health: -40 },
          outcomeText: 'You fell through a canopy, breaking your leg. The police arrest you in the alley.',
          logText: 'Attempted hotel escape window leap, breaking leg.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_27_revenge',
    title: 'THE UNAPPROVED UPLOAD',
    text: 'Your ex-boyfriend has posted your private Snapchat videos on major adult websites. Your real name and hometown are in the title.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_revenge_takedown',
        text: '⚖️ Retain Legal Takedown Firm ($8,000)',
        effect: {
          cashChange: -8000,
          outcomeText: 'The takedown letters work. The links are dead within 48 hours.',
          logText: 'Retained takedown firm to purge Snapchat leaks.'
        }
      },
      {
        id: 'gdd_revenge_expose',
        text: '📢 Make Public Post Exposing Him',
        effect: {
          outcomeText: 'Your statement goes viral. Followers support you, but you receive fresh spam comments.',
          logText: 'Released public statement exposing revenge leak instigator.'
        }
      },
      {
        id: 'gdd_revenge_dox',
        text: '👺 Leak His Private Info back',
        effect: {
          outcomeText: 'You doxed him. He contacts the police and you are charged with cyberstalking.',
          logText: 'Leaked private details of ex-partner in retaliation.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_28_minor',
    title: 'THE MINOR VISITOR',
    text: 'A fan DMs you admitting they used their parent\'s credit card and are actually 16. They spent $800 on your premium content store.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_minor_refund',
        text: '🛡️ Report & Refund Instantly ($800)',
        effect: {
          cashChange: -800,
          outcomeText: 'You processed the refund. The platform records your compliance and flags the card.',
          logText: 'Refunded $800 of minor transaction to maintain platform status.'
        }
      },
      {
        id: 'gdd_minor_block',
        text: '🚫 Block Account & Ignore',
        effect: {
          outcomeText: 'You blocked them. They contact their bank, flagging your store for fraud.',
          logText: 'Blocked minor buyer profile without refunding.'
        }
      },
      {
        id: 'gdd_minor_keep',
        text: '🤫 Keep Chatting Quietly',
        effect: {
          outcomeText: 'The parents look at the statements and file a police report for grooming.',
          logText: 'Continued messages with minor buyer profile.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_29_doxx',
    title: 'THE FULL DOXX',
    text: 'An anonymous board has published your real name, phone number, physical address, and parent\'s work address online. You are receiving spam.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_doxx_move',
        text: '🏠 Pack Up & Move Tonight ($8,000)',
        effect: {
          cashChange: -8000,
          outcomeText: 'You signed an emergency lease. You are safe, but your bank account is empty.',
          logText: 'Relocated immediately to escape doxx threats.'
        }
      },
      {
        id: 'gdd_doxx_cyber',
        text: '🕵️ Hire Cybersecurity Firm ($3,000)',
        effect: {
          cashChange: -3000,
          outcomeText: 'The security firm traces the IP address and issues a cease & desist.',
          logText: 'Hired cybersecurity firm to track doxx origin.'
        }
      },
      {
        id: 'gdd_doxx_expose',
        text: '🗣️ Post Public Statement',
        effect: {
          outcomeText: 'Your video gets views, but weird cars start parking outside your house.',
          logText: 'Released public video statement regarding doxx coordinates.'
        }
      }
    ]
  },
  {
    id: 'gdd_event_30_contract',
    title: 'THE studio TRAP',
    text: 'You review your signed studio deal and find a clause: they own your stage name, social handles, and all videos permanently.',
    category: 'random',
    conditions: { minAge: 18 },
    choices: [
      {
        id: 'gdd_contract_buyout',
        text: '💸 Buy Out the Contract ($50,000)',
        effect: {
          cashChange: -50000,
          outcomeText: 'You paid the fee. You are free to post independently, but you have no cash left.',
          logText: 'Completed $50,000 contract buyout clause.'
        }
      },
      {
        id: 'gdd_contract_rebrand',
        text: '🎒 Rebrand Completely (New Name)',
        effect: {
          outcomeText: 'You started a new profile under a different alias. Growth is slow, but you own it.',
          logText: 'Abandoned handles and rebranded under new alias.'
        }
      },
      {
        id: 'gdd_contract_negotiate',
        text: '🤝 Try to Re-Negotiate',
        effect: {
          outcomeText: 'The studio refuses to modify the terms. You must produce 10 more videos for them.',
          logText: 'Unsuccessfully attempted to modify studio contract terms.'
        }
      }
    ]
  },

  // --- DELAYED CONSEQUENCE EVENTS ---
  {
    id: 'gdd_chain_1_stalker_gate',
    title: 'THE GATECRASHER',
    text: 'You did not move apartments. The stalker you confronted online has sneaked past security and is knocking on your front door.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_gate_police',
        text: '👮 Lock Door & Call Police',
        effect: {
          outcomeText: 'Police arrive and arrest him. You get a restraining order, but you are shaken.',
          logText: 'Stalker arrested at door by police.'
        }
      },
      {
        id: 'gdd_gate_fight',
        text: '🥊 Open Door & Fight Back',
        effect: {
          statChanges: { health: -50, looks: -20 },
          outcomeText: 'You fought him off, but he punched you in the face. You have a black eye and need stitches.',
          logText: 'Physically clashed with stalker at door.'
        }
      },
      {
        id: 'gdd_gate_flee',
        text: '🏢 Flee to Fire Escape ($3,000 loss)',
        effect: {
          cashChange: -3000,
          outcomeText: 'You ran out. He trashed your living room. You have to buy new filming equipment.',
          logText: 'Fled home via fire escape while stalker ransacked property.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_2_tax_felony',
    title: 'FELONY TAX EVASION',
    text: 'The IRS investigators discovered your hidden accounts. You have been formally charged with tax fraud.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_tax_plea',
        text: '🤝 Accept Plea Deal (1 Year Jail)',
        effect: {
          statChanges: { happiness: -40, status: -30 },
          outcomeText: 'You report to federal prison. Your career is paused.',
          logText: 'Accepted plea deal for tax evasion, serving jail sentence.'
        }
      },
      {
        id: 'gdd_tax_trial',
        text: '💼 Hire Elite Attorney ($50,000)',
        effect: {
          cashChange: -50000,
          outcomeText: 'You lost the case. The judge sentences you to 3 years in federal prison.',
          logText: 'Lost tax fraud trial, receiving a prison sentence.'
        }
      },
      {
        id: 'gdd_tax_flee',
        text: '✈️ Fly to Non-Extradition Country',
        effect: {
          cashChange: -20000,
          outcomeText: 'You escape to Bali. You are safe, but you cannot return home and must start a new career.',
          logText: 'Fled jurisdiction for Bali to avoid prison.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_3_resentment',
    title: 'THE AMBITION DEBATE',
    text: 'You deleted your social accounts for your partner. Now, they complain that you have no drive and expect them to pay for everything.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_resent_reopen',
        text: '🍑 Re-open OnlyFans Account',
        effect: {
          outcomeText: 'You went back to work. Your partner leaves you, but your fans welcome you back.',
          narrativeVariants: { neutral: [{ text: 'The audience welcomes the return as a comeback. You experience it as a decision that finally stopped asking permission.', careers: ['creator', 'adult_performer'], minFame: 35 }, { text: 'Work gives the breakup a shape: public, measurable, and easier to explain than the private argument that caused it.', minAge: 30 }, { text: 'You reopen the account knowing freedom can still feel like grief when someone had planned a different future with you.' }] },
          logText: 'Reopened OnlyFans profile, ending partner relationship.'
        }
      },
      {
        id: 'gdd_resent_unemployed',
        text: '🧘 Stay Unemployed and Quiet',
        effect: {
          statChanges: { happiness: -20 },
          outcomeText: 'You stay home. You feel depressed and useless.',
          narrativeVariants: { negative: [{ text: 'The quiet is supposed to protect the relationship. Instead it turns every unpaid bill and empty afternoon into an argument you have with yourself.', wealthBands: ['struggling', 'stable'] }, { text: 'You are not failing at rest; you are stranded without a plan that belongs to you.', minAge: 30 }, { text: 'The audience has moved on, the household is tense, and your own ambition has become difficult to hear.' }] },
          logText: 'Stayed unemployed, leading to deep depression.'
        }
      },
      {
        id: 'gdd_resent_breakup',
        text: '💔 Break Up',
        effect: {
          outcomeText: 'You packed your bags. You are single, but free to build your empire.',
          narrativeVariants: { neutral: [{ text: 'The breakup gives your ambition room, but freedom arrives carrying boxes, deposits, and the memory of what it cost.', wealthBands: ['struggling', 'stable'] }, { text: 'You call it an empire because the word is easier than admitting you are rebuilding from one room.', careers: ['creator', 'adult_performer'] }, { text: 'For once, the future is entirely yours. That is exhilarating until you realize it is also entirely your responsibility.' }] },
          logText: 'Ended relationship over ambition differences.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_4_leak_bbq',
    title: 'THE FAMILY LEAK',
    text: 'Your brother sent your FanZone links to your parents\' email. Your dad has called an emergency family meeting at their house.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_leak_attend',
        text: '🚗 Attend the Meeting',
        effect: {
          statChanges: { happiness: -20 },
          outcomeText: 'They scream and call you a disgrace. You leave in tears.',
          logText: 'Attended family leak summit, receiving reprimand.'
        }
      },
      {
        id: 'gdd_leak_block',
        text: '📴 Block Entire Family',
        effect: {
          outcomeText: 'You cut them off. The silence is painful, but the family drama is over.',
          logText: 'Severed communications with parents over link leaks.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_5_warrant',
    title: 'THE ARREST WARRANT',
    text: 'The video of you doing illegal acts on stream has been investigated by local police. Officers show up at your door with a warrant.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_warrant_surrender',
        text: '🤝 Surrender Peacefully ($5,000 Bail)',
        effect: {
          cashChange: -5000,
          outcomeText: 'You are booked. You pay bail, but your name is in local news crime logs.',
          logText: 'Surrendered to arrest warrant, posting $5,000 bail.'
        }
      },
      {
        id: 'gdd_warrant_lawyer',
        text: '💼 Call Lawyer Immediately ($10,000)',
        effect: {
          cashChange: -10000,
          outcomeText: 'Your lawyer finds a procedural error in the warrant. You are released.',
          logText: 'Hired counsel to void stream warrant execution.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_6_lawsuit',
    title: 'BREACH OF CONTRACT',
    text: 'You tried to post independently. The studio files a lawsuit against you for $100,000 for breach of contract and copyright theft.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_lawsuit_settle',
        text: '💼 Settle for $30,000',
        effect: {
          cashChange: -30000,
          outcomeText: 'You paid the settlement. You are officially free, but your savings are gone.',
          logText: 'Settled studio contract dispute for $30,000.'
        }
      },
      {
        id: 'gdd_lawsuit_fight',
        text: '⚖️ Fight in Court ($15,000)',
        effect: {
          cashChange: -15000,
          outcomeText: 'You lost the lawsuit. The court orders you to pay the studio $100,000.',
          logText: 'Lost studio lawsuit, receiving a $100,000 judgment.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_7_bots',
    title: 'ACCOUNT SUSPENDED',
    text: 'SpicyChat filters detected that 95% of your new followers are fake bot accounts. Your account has been suspended for 7 days.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_bots_rest',
        text: '🧘 Take a Rest',
        effect: {
          outcomeText: 'The bots are deleted. Your follower count drops back to normal.',
          logText: 'Waited out platform suspension.'
        }
      },
      {
        id: 'gdd_bots_apologize',
        text: '📢 Apologize & Blame Sponsor',
        effect: {
          outcomeText: 'You blamed a marketing agency. The platform lifts the suspension early.',
          logText: 'Released apology video blaming marketing agency.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_8_school',
    title: 'THE HIGH SCHOOL REVEAL',
    text: 'Someone from your old high school recognized your fake ID photo and leaked your address to your hometown Facebook group.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_school_explain',
        text: '📢 Make a Video Explaining',
        effect: {
          statChanges: { happiness: 5 },
          outcomeText: 'You explain your choices. Your fans defend you, and your old classmates look petty.',
          logText: 'Defended identity doxx leak with viral explanation video.'
        }
      },
      {
        id: 'gdd_school_ignore',
        text: '🤫 Ignore & Turn off Phone',
        effect: {
          statChanges: { happiness: -10 },
          outcomeText: 'You hide. The notifications keep coming, and you feel isolated.',
          logText: 'Ignored classmates hometown doxx leak.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_9_sick',
    title: 'LIVER TOXICITY',
    text: 'You took the pills you promoted to show they work. You wake up with yellow eyes and severe abdominal pain. You need to go to the hospital.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_sick_er',
        text: '🏥 Emergency Room Admission ($10,000)',
        effect: {
          cashChange: -10000,
          outcomeText: 'Doctors treat the poisoning. You recover, but you are weak.',
          narrativeVariants: { negative: [{ text: 'The hospital stops the poisoning before it becomes irreversible. Recovery is slow, and every weak morning reminds you why you came.' }, { text: 'Doctors stabilize you, but the scare leaves its mark. You leave alive, exhausted, and unable to treat the warning as abstract anymore.' }] },
          logText: 'Admitted to ER for supplement liver poisoning.'
        }
      },
      {
        id: 'gdd_sick_home',
        text: '💊 Rest at Home & Drink Water',
        effect: {
          statChanges: { health: -30 },
          outcomeText: 'Your condition worsens. You pass out and are rushed to the ICU.',
          narrativeVariants: { negative: [{ text: 'Waiting it out becomes impossible. By the time you collapse, the people around you are making the emergency decision for you.' }, { text: 'The pain keeps escalating until the room goes dark. You wake in intensive care with the cost of delay written all around you.' }] },
          logText: 'Refused medical attention for liver toxicity.'
        }
      }
    ]
  },
  {
    id: 'gdd_chain_10_propose',
    title: 'THE OBSESSION',
    text: 'The fan who paid your rent has proposed to you via DM. They say they are flying to your city to marry you and have bought a ring.',
    category: 'callback',
    choices: [
      {
        id: 'gdd_propose_block',
        text: '🚫 Block & Cancel Lease ($3,000 loss)',
        effect: {
          cashChange: -3000,
          outcomeText: 'You block them and find a new place. You lose your deposit, but you are safe.',
          logText: 'Canceled lease to escape obsessive proposal.'
        }
      },
      {
        id: 'gdd_propose_gentle',
        text: '🕊️ Try to Let Them Down Gently',
        effect: {
          outcomeText: 'They call you a liar and leak your private messages out of anger.',
          logText: 'Attempted to reject obsessive fan proposal gently.'
        }
      }
    ]
  },
  {
    id: 'creator_first_viral_post',
    title: 'First Viral Post',
    text: 'One of your posts suddenly spreads far beyond your usual audience.',
    category: 'career',
    weight: 25,
    conditions: {
      minAge: 18,
      flagsFalse: ['creator_first_viral_post'],
      customCheck: state => {
        const profile = state.creatorCareer?.profile;
        return state.creatorCareer?.active === true && !!profile && (state.socialMedia[profile.platform]?.followers || 0) >= 10000;
      }
    },
    choices: [
      { id: 'creator_viral_engage', text: 'Engage with the new audience.', effect: { repChanges: { online: 10 }, flagsSet: { creator_first_viral_post: true }, outcomeText: 'You welcome the attention and turn the viral moment into momentum.', narrativeVariants: { positive: [{ text: 'The new comments feel overwhelming at first, then energizing. You meet the moment with warmth and turn a spike in attention into a community.' }, { text: 'Instead of treating the viral post as a fluke, you show up for the people it reached. The audience begins to recognize you as more than one lucky clip.' }] }, logText: 'Engaged with the audience after a first viral post.' } },
      { id: 'creator_viral_steady', text: 'Keep posting normally.', effect: { repChanges: { online: 5 }, flagsSet: { creator_first_viral_post: true }, outcomeText: 'You avoid chasing the trend and keep your account focused.', narrativeVariants: { positive: [{ text: 'You let the trend pass through without changing your voice. The quieter growth that follows feels more durable.' }, { text: 'Rather than chase the algorithm, you keep your routine. Some new viewers stay because they like what you were already making.' }] }, logText: 'Stayed consistent after a first viral post.' } }
    ]
  },
  {
    id: 'creator_collaboration_offer',
    title: 'Collaboration Offer',
    text: 'Another creator proposes a joint project for the coming year.',
    category: 'career',
    weight: 20,
    conditions: {
      minAge: 18,
      flagsFalse: ['creator_collaboration_offer_resolved'],
      customCheck: state => state.creatorCareer?.active === true && (state.creatorCareer.profile?.yearlyActions.collaborationCount || 0) > 0
    },
    choices: [
      { id: 'creator_collaboration_accept', text: 'Accept the collaboration.', effect: { flagsSet: { creator_collaboration_offer_resolved: true, creator_collaboration_accepted: true }, scheduleDelayedEvent: { eventId: 'creator_sponsor_offer', delayYears: 1 }, outcomeText: 'You agree on a project and begin planning the release.', narrativeVariants: { neutral: [{ text: 'You settle the practical details, divide the work, and begin planning a release neither of you could make alone.' }, { text: 'The agreement is straightforward: shared work, shared credit, and a project on the calendar. The real work starts now.' }] }, logText: 'Accepted a creator collaboration offer.' } },
      { id: 'creator_collaboration_decline', text: 'Decline politely.', effect: { flagsSet: { creator_collaboration_offer_resolved: true }, outcomeText: 'You decline without burning the professional connection.', narrativeVariants: { neutral: [{ text: 'You pass without making it personal. The connection remains open, even if this project is not the right fit.' }, { text: 'The offer does not match your plans, and you say so clearly. No bridge burns; you simply keep moving on your own schedule.' }] }, logText: 'Declined a creator collaboration offer.' } }
    ]
  },
  {
    id: 'creator_sponsor_offer',
    title: 'Sponsor Offer',
    text: 'A brand offers a paid sponsorship and asks you to promote its product.',
    category: 'career',
    weight: 15,
    conditions: {
      minAge: 18,
      flagsFalse: ['creator_sponsor_offer_resolved'],
      customCheck: state => state.creatorCareer?.active === true && (state.flags.creator_collaboration_accepted || ['established', 'top_creator'].includes(state.creatorCareer.profile?.tier || 'beginner'))
    },
    choices: [
      { id: 'creator_sponsor_accept', text: 'Accept with clear disclosure.', effect: { repChanges: { online: 5 }, flagsSet: { creator_sponsor_offer_resolved: true }, outcomeText: 'You disclose the sponsorship and publish the campaign professionally.', narrativeVariants: { positive: [{ text: 'You label the partnership clearly and keep the campaign aligned with your usual voice. Your audience sees the disclosure—and the care behind it.' }, { text: 'The sponsored post is direct about what it is. That clarity lets the campaign support your work without pretending to be something else.' }] }, logText: 'Accepted a disclosed creator sponsorship.' } },
      { id: 'creator_sponsor_decline', text: 'Decline the offer.', effect: { flagsSet: { creator_sponsor_offer_resolved: true }, outcomeText: 'You decide the offer does not fit your account.', narrativeVariants: { neutral: [{ text: 'The money is tempting, but the brand does not belong in your feed. You leave the door open for an offer that does.' }, { text: 'You thank them and decline. Your account stays pointed in the direction you chose, without any need for a public explanation.' }] }, logText: 'Declined a creator sponsorship.' } }
    ]
  },
  {
    id: 'creator_family_discovers_account',
    title: 'Family Discovers the Account',
    text: 'A family member confronts you after connecting the account to you.',
    category: 'relationship',
    weight: 20,
    involvedRelationshipType: 'parent',
    conditions: {
      minAge: 18,
      flagsFalse: ['creator_family_discovery_resolved'],
      hasRelationshipType: 'parent',
      customCheck: state => state.creatorCareer?.active === true && (state.secretExposure?.level || 0) >= 30 && ((state.secretExposure?.level || 0) >= 60 || Object.values(state.npcs).some(npc => npc.relation === 'parent' && npc.vectors.knowledge >= 20))
    },
    choices: [
      { id: 'creator_family_confess', text: 'Tell the truth and explain your boundaries.', effect: { flagsSet: { creator_family_discovery_resolved: true }, relationshipChanges: { target: 'current', trust: 12, suspicion: -10, resentment: -8, knowledge: 45, forgiveness: 5 }, memory: { type: 'honest_account_disclosure', intensity: 60, emotionalValue: 30, decayRate: 2, permanent: true }, outcomeText: 'You answer honestly. Their reaction is shaped by their trust and personality.', narrativeVariants: { positive: [{ text: 'You make room for their discomfort without surrendering your boundaries. The conversation is difficult, but it leaves the relationship clearer than before.', relationshipTypes: ['parent'], npcArchetypes: ['average', 'mentor'], minRelationshipTrust: 55 }, { text: 'Honesty does not make the subject easy, yet it gives you both something solid to work from. They leave knowing where you stand.', relationshipTypes: ['parent'], minAge: 21 }] }, logText: 'Discussed the creator account honestly with family.' } },
      { id: 'creator_family_deny', text: 'Deny that the account is yours.', effect: { flagsSet: { creator_family_discovery_resolved: true }, relationshipChanges: { target: 'current', trust: -10, suspicion: 20, resentment: 15, knowledge: 15 }, memory: { type: 'account_discovery_denial', intensity: 70, emotionalValue: -35, decayRate: 1, permanent: false }, outcomeText: 'You deny it, but the evidence leaves them uneasy.', narrativeVariants: { negative: [{ text: 'They stop pressing, but not believing. Every later pause in the conversation carries the question you refused to answer.', relationshipTypes: ['parent'], npcArchetypes: ['controlling partner', 'average'] }, { text: 'The denial buys you a quiet exit, not relief. Their uncertainty hardens into something harder to repair.', relationshipTypes: ['parent'], maxRelationshipSuspicion: 80 }] }, logText: 'Denied owning the discovered creator account.' } }
    ]
  },
  {
    id: 'creator_partner_conflict',
    title: 'Partner Conflict',
    text: 'Your partner raises concerns about the account and what it means for the relationship.',
    category: 'relationship',
    weight: 20,
    involvedRelationshipType: 'partner',
    conditions: {
      minAge: 18,
      flagsFalse: ['creator_partner_conflict_resolved'],
      hasRelationshipType: 'partner',
      customCheck: state => state.creatorCareer?.active === true && (state.secretExposure?.level || 0) >= 30 && ((state.secretExposure?.level || 0) >= 50 || Object.values(state.npcs).some(npc => npc.relation === 'partner' && npc.vectors.knowledge >= 20))
    },
    choices: [
      { id: 'creator_partner_confess', text: 'Talk openly and agree on boundaries.', effect: { flagsSet: { creator_partner_conflict_resolved: true }, relationshipChanges: { target: 'current', trust: 12, suspicion: -10, resentment: -10, knowledge: 35, forgiveness: 8 }, memory: { type: 'creator_boundary_agreement', intensity: 65, emotionalValue: 35, decayRate: 2, permanent: true }, outcomeText: 'You have a direct conversation and agree on boundaries together.', narrativeVariants: { positive: [{ text: 'You make the rules explicit instead of asking either of you to guess. The tension softens into a plan you both helped build.', relationshipTypes: ['partner', 'spouse'], npcArchetypes: ['loyal partner', 'supportive friend'] }, { text: 'The talk is vulnerable, but neither of you walks away from it. Your boundaries become an agreement rather than an ultimatum.', relationshipTypes: ['partner', 'spouse'], minRelationshipTrust: 50 }] }, logText: 'Agreed on creator-career boundaries with a partner.' } },
      { id: 'creator_partner_change_subject', text: 'Dismiss the concern and change the subject.', effect: { flagsSet: { creator_partner_conflict_resolved: true }, relationshipChanges: { target: 'current', trust: -12, suspicion: 18, resentment: 20, knowledge: 10 }, memory: { type: 'dismissed_creator_concern', intensity: 75, emotionalValue: -40, decayRate: 1, permanent: false }, outcomeText: 'They feel dismissed, and the unresolved conflict lingers.', narrativeVariants: { negative: [{ text: 'The room goes quiet, but the problem does not. Your partner hears the subject change as a decision to leave them alone with it.', relationshipTypes: ['partner', 'spouse'], npcArchetypes: ['jealous partner', 'controlling partner'] }, { text: 'You escape the conversation for tonight. The unanswered concern settles into the relationship as distance.', relationshipTypes: ['partner', 'spouse'] }] }, logText: 'Dismissed a partner conflict about the creator account.' } }
    ]
  },
  {
    id: 'creator_account_leak_backlash',
    title: 'Account Leak and Backlash',
    text: 'Private account information leaks and a wave of backlash reaches your public profile.',
    category: 'career',
    weight: 15,
    conditions: {
      minAge: 18,
      flagsFalse: ['creator_account_leak_resolved'],
      customCheck: state => state.creatorCareer?.active === true && (state.secretExposure?.level || 0) >= 70
    },
    choices: [
      { id: 'creator_leak_address', text: 'Address the leak publicly.', effect: { statChanges: { happiness: -10 }, repChanges: { online: -10 }, flagsSet: { creator_account_leak_resolved: true }, outcomeText: 'You acknowledge the leak and publish a measured response.', narrativeVariants: { negative: [{ text: 'You make the statement because silence would let the leak define you. It costs energy and goodwill, but you regain a little control of the story.' }, { text: 'The response is measured, even while the attention is not. You face the leak directly and accept that repair will take longer than one post.' }] }, logText: 'Addressed an account leak publicly.' } },
      { id: 'creator_leak_withdraw', text: 'Step back from posting.', effect: { statChanges: { happiness: -15 }, repChanges: { online: -15 }, flagsSet: { creator_account_leak_resolved: true }, outcomeText: 'You withdraw while the backlash cools, but the stress follows you offline.', narrativeVariants: { negative: [{ text: 'You stop posting to create distance, but the story follows you past the screen. The quiet helps only after the stress has had time to settle.' }, { text: 'Retreating gives the backlash less to react to. It does not erase the feeling that your private life has been pulled into public view.' }] }, logText: 'Stepped back after an account leak and backlash.' } }
    ]
  },
  {
    id: 'adult_performer_breakout',
    title: 'Breakout Collaboration',
    text: 'A respected performer offers you a collaboration that could put your work in front of a much larger audience.',
    category: 'career',
    weight: 18,
    conditions: {
      minAge: 18,
      flagsFalse: ['adult_performer_breakout_resolved'],
      customCheck: state => state.adultPerformerCareer?.active === true && (state.fame || 0) >= 20 && (state.adultPerformerCareer?.yearlyActions.collaborationCount || 0) > 0
    },
    choices: [
      { id: 'adult_breakout_accept', text: 'Accept and prepare carefully.', effect: { repChanges: { online: 8 }, flagsSet: { adult_performer_breakout_resolved: true }, memory: { type: 'breakout_collaboration', intensity: 45, emotionalValue: 25, decayRate: 2, permanent: false }, outcomeText: 'The collaboration lands well and strengthens your professional network.', narrativeVariants: { positive: [{ text: 'Preparation keeps the larger audience from feeling like a gamble. The collaboration expands your reach while proving you can hold your own in the room.', careers: ['adult_performer'], minFame: 20 }, { text: 'The release reaches beyond your usual circle, and the professional respect matters as much as the numbers. A new door opens without costing you control.', careers: ['adult_performer'] }] }, logText: 'Accepted a breakout performer collaboration.' } },
      { id: 'adult_breakout_decline', text: 'Decline to protect your boundaries.', effect: { statChanges: { happiness: 5 }, flagsSet: { adult_performer_breakout_resolved: true }, outcomeText: 'You pass on the opportunity and keep control of your boundaries.', narrativeVariants: { positive: [{ text: 'The opportunity is real, but so is your right to say no. You leave with your limits intact and no explanation owed.' }, { text: 'You choose the pace of your own career. The offer moves on, while your sense of control remains yours.' }] }, logText: 'Declined a breakout collaboration to protect boundaries.' } }
    ]
  },
  {
    id: 'adult_performer_family_rumor',
    title: 'A Family Member Has Questions',
    text: 'A family member has seen hints of your public work and asks whether the rumors are true.',
    category: 'relationship',
    weight: 16,
    involvedRelationshipType: 'parent',
    conditions: {
      minAge: 18,
      hasRelationshipType: 'parent',
      flagsFalse: ['adult_performer_family_rumor_resolved'],
      customCheck: state => state.adultPerformerCareer?.active === true && (state.secretExposure?.level || 0) >= 30 && (state.fame || 0) >= 15
    },
    choices: [
      { id: 'adult_family_honest', text: 'Explain your work and your boundaries.', effect: { relationshipChanges: { target: 'current', trust: 8, suspicion: -12, knowledge: 35, forgiveness: 5 }, flagsSet: { adult_performer_family_rumor_resolved: true }, memory: { type: 'adult_career_disclosure', intensity: 55, emotionalValue: 10, decayRate: 1, permanent: true }, outcomeText: 'The conversation is difficult, but honesty gives the relationship a path forward.', narrativeVariants: { positive: [{ text: 'You explain the work without apologizing for existing. The conversation is strained, but it ends with clearer boundaries and less fear.', relationshipTypes: ['parent'], minFame: 15 }, { text: 'There is no perfect way to have this conversation. Still, honesty gives your family something more useful than rumor.', relationshipTypes: ['parent'], npcArchetypes: ['average', 'mentor'] }] }, logText: 'Discussed adult performer work honestly with family.' } },
      { id: 'adult_family_deny', text: 'Deny everything and change the subject.', effect: { relationshipChanges: { target: 'current', trust: -8, suspicion: 18, knowledge: 8 }, flagsSet: { adult_performer_family_rumor_resolved: true }, outcomeText: 'They let the subject drop, but the unanswered questions remain.', narrativeVariants: { negative: [{ text: 'They let you change the subject, but their doubt does not leave with it. The next family gathering feels more watchful.', relationshipTypes: ['parent'] }, { text: 'The rumor is no longer discussed aloud. It survives instead in the pauses between ordinary questions.', relationshipTypes: ['parent'], maxAge: 30 }] }, logText: 'Denied rumors about adult performer work.' } }
    ]
  },
  {
    id: 'actor_breakout_audition', title: 'Breakout Audition', text: 'A director offers you a high-stakes audition after seeing your recent work.', category: 'career', weight: 18,
    conditions: { minAge: 18, flagsFalse: ['actor_breakout_audition_resolved'], customCheck: state => state.actorCareer?.active === true && (state.fame || 0) >= 15 && (state.actorCareer?.yearlyActions.auditionCount || 0) > 0 },
    choices: [
      { id: 'actor_audition_commit', text: 'Prepare intensely and commit.', effect: { statChanges: { happiness: -3 }, repChanges: { online: 8 }, flagsSet: { actor_breakout_audition_resolved: true }, memory: { type: 'breakout_audition', intensity: 45, emotionalValue: 25, decayRate: 2, permanent: false }, outcomeText: 'Your preparation earns respect and a larger professional network.', narrativeVariants: { positive: [{ text: 'The preparation costs you sleep, not focus. In the room, you are ready enough to turn nerves into presence.', careers: ['actor'], minFame: 15 }, { text: 'You treat the audition like the opening it is. Whatever happens next, the casting team remembers how prepared you were.', careers: ['actor'] }] }, logText: 'Committed to a breakout acting audition.' } },
      { id: 'actor_audition_pass', text: 'Pass and protect your schedule.', effect: { statChanges: { happiness: 4 }, flagsSet: { actor_breakout_audition_resolved: true }, outcomeText: 'You protect your energy, though the opportunity moves on.', narrativeVariants: { positive: [{ text: 'You recognize that an open door is not always the right one. The role moves on, while your energy stays available for the work you chose.' }, { text: 'Saying no feels quieter than chasing a breakthrough, but the relief is immediate. You keep your schedule—and your agency.' }] }, logText: 'Passed on a breakout acting audition.' } }
    ]
  },
  {
    id: 'actor_family_premiere', title: 'Premiere Attention', text: 'A family member sees your name in the press and asks how public you intend your career to become.', category: 'relationship', weight: 16, involvedRelationshipType: 'parent',
    conditions: { minAge: 18, hasRelationshipType: 'parent', flagsFalse: ['actor_family_premiere_resolved'], customCheck: state => state.actorCareer?.active === true && (state.fame || 0) >= 35 },
    choices: [
      { id: 'actor_family_share', text: 'Share the excitement and set boundaries.', effect: { relationshipChanges: { target: 'current', trust: 8, suspicion: -8, knowledge: 25 }, flagsSet: { actor_family_premiere_resolved: true }, memory: { type: 'actor_premiere_discussion', intensity: 35, emotionalValue: 20, decayRate: 2, permanent: false }, outcomeText: 'They understand the visibility tradeoff and celebrate with you.', narrativeVariants: { positive: [{ text: 'You let them celebrate the premiere without pretending fame has no cost. The shared excitement makes the boundaries easier to understand.', relationshipTypes: ['parent'], minFame: 35 }, { text: 'For a moment, the press coverage feels personal instead of distant. Your family sees both the opportunity and the limits you need.', relationshipTypes: ['parent'], npcArchetypes: ['average', 'mentor'] }] }, logText: 'Discussed acting fame with family.' } },
      { id: 'actor_family_withhold', text: 'Keep the details private.', effect: { relationshipChanges: { target: 'current', suspicion: 8, knowledge: 5 }, flagsSet: { actor_family_premiere_resolved: true }, outcomeText: 'You keep the conversation light and your career boundaries firm.', narrativeVariants: { negative: [{ text: 'You keep the details to yourself, and they respect the boundary without quite understanding it. Curiosity lingers after the subject changes.', relationshipTypes: ['parent'] }, { text: 'The premiere remains public news but private territory at home. Your family leaves with more questions than answers.', relationshipTypes: ['parent'], minFame: 50 }] }, logText: 'Kept acting career details private from family.' } }
    ]
  },
  {
    id: 'actor_first_audition', title: 'First Audition', text: 'Your first serious casting call is tomorrow, and the room will be full of more experienced performers.', category: 'career', weight: 20,
    conditions: { minAge: 18, flagsFalse: ['actor_first_audition_resolved'], customCheck: state => state.actorCareer?.active === true && state.flags.actorFirstAuditionEligibleThisYear === true },
    choices: [
      { id: 'actor_first_audition_prepare', text: 'Rehearse until you know every beat.', effect: { statChanges: { smarts: 2, happiness: -2 }, repChanges: { workplace: 5 }, flagsSet: { actor_first_audition_resolved: true }, outcomeText: 'You arrive prepared and leave a strong first impression.', narrativeVariants: { positive: [{ text: 'You walk into the room carrying the nerves of a newcomer and the discipline of someone who intends to stay. The panel notices both.', careers: ['actor'], maxAge: 25 }, { text: 'Preparation steadies you when the room feels intimidating. The first impression is not glamorous, but it is professional.', careers: ['actor'], minAge: 26 }, { text: 'You give the casting team something reliable to remember: a performer who did the work before asking for the opportunity.', careers: ['actor'] }] }, logText: 'Prepared thoroughly for a first acting audition.' } },
      { id: 'actor_first_audition_improvise', text: 'Trust your instincts and improvise.', effect: { statChanges: { status: 3 }, flagsSet: { actor_first_audition_resolved: true }, outcomeText: 'Your bold choice gets the casting team talking.', narrativeVariants: { positive: [{ text: 'The risk feels enormous for a first audition, but your instincts turn the unfamiliar room into a conversation.', careers: ['actor'], maxAge: 25 }, { text: 'You have learned that experience is useful only when it leaves room for surprise. The panel keeps talking after you leave.', careers: ['actor'], minAge: 26 }, { text: 'The choice is bold enough to be remembered, and measured enough not to look like panic.', careers: ['actor'] }] }, logText: 'Took an instinctive approach to a first acting audition.' } }
    ]
  },
  {
    id: 'actor_award_season', title: 'Award Season', text: 'Your lead performance is on an awards shortlist, and every interview could shape the public story around you.', category: 'career', weight: 18,
    conditions: { minAge: 18, flagsFalse: ['actor_award_season_resolved'], customCheck: state => state.actorCareer?.active === true && (state.flags.actorAwardEligibleThisYear === true || state.flags.actorAwardEligiblePending === true) },
    choices: [
      { id: 'actor_award_gracious', text: 'Keep every appearance gracious and focused.', effect: { repChanges: { online: 10, workplace: 5 }, flagsSet: { actor_award_season_resolved: true, actorAwardEligiblePending: false }, outcomeText: 'Your professionalism wins over voters and collaborators.', narrativeVariants: { positive: [{ text: 'Every interview gives the same impression: prepared, generous, and impossible to rattle. The season leaves collaborators eager to work with you again.', careers: ['actor'], minFame: 50, minReputation: { online: 30 } }, { text: 'You let the work remain the headline. By the end of the circuit, the attention has strengthened both your public image and your professional ties.', careers: ['actor'] }] }, logText: 'Handled award-season attention professionally.' } },
      { id: 'actor_award_skip', text: 'Skip the circuit and protect your energy.', effect: { statChanges: { happiness: 6 }, repChanges: { online: -3 }, flagsSet: { actor_award_season_resolved: true, actorAwardEligiblePending: false }, outcomeText: 'You preserve your energy, even as the spotlight moves on without you.', narrativeVariants: { chaotic: [{ text: 'The silence protects your energy but gives the spotlight somewhere else to go. You feel better while the public conversation keeps moving without you.' }, { text: 'You trade a little visibility for a life that feels manageable again. It is a relief—and a reminder that attention rarely waits.' }] }, logText: 'Stepped back from award-season publicity.' } }
    ]
  },
  {
    id: 'actor_scandal', title: 'Set Gossip Goes Public', text: 'A rumor from a film set is spreading online, and a close colleague asks whether you will address it together.', category: 'relationship', weight: 15, involvedRelationshipType: 'colleague',
    conditions: { minAge: 18, hasRelationshipType: 'colleague', flagsFalse: ['actor_scandal_resolved'], customCheck: state => state.actorCareer?.active === true && (state.fame || 0) >= 30 && (state.reputation.online || 0) >= 15 },
    choices: [
      { id: 'actor_scandal_joint', text: 'Issue a calm joint statement.', effect: { repChanges: { online: 4 }, relationshipChanges: { target: 'current', trust: 8, suspicion: -6, resentment: -5, knowledge: 10 }, flagsSet: { actor_scandal_resolved: true }, outcomeText: 'The statement settles the story and shows your colleague you have their back.', narrativeVariants: { positive: [{ text: 'You and your colleague take the rumor seriously without feeding it. The unified response gives the story less room to grow.', careers: ['actor'], relationshipTypes: ['colleague'], minFame: 30 }, { text: 'The statement is calm, specific, and shared. Your colleague remembers that you stood beside them when silence would have been easier.', relationshipTypes: ['colleague'], npcArchetypes: ['supportive friend', 'mentor', 'average'] }] }, logText: 'Addressed a set rumor with a colleague.' } },
      { id: 'actor_scandal_silent', text: 'Stay silent and let it burn out.', effect: { statChanges: { happiness: -4 }, relationshipChanges: { target: 'current', trust: -6, suspicion: 7, resentment: 8 }, flagsSet: { actor_scandal_resolved: true }, outcomeText: 'The headlines fade, but your colleague feels left alone in the fallout.', narrativeVariants: { negative: [{ text: 'The rumor eventually loses heat, but your colleague remembers who was absent while it was hottest. The professional cost is quieter than the headlines.', careers: ['actor'], relationshipTypes: ['colleague'] }, { text: 'Silence keeps you out of the immediate mess. It also leaves your colleague to carry a story that involved both of you.', relationshipTypes: ['colleague'], minRelationshipTrust: 40 }] }, logText: 'Stayed silent during a set-rumor scandal.' } }
    ]
  },
  {
    id: 'royal_childhood_expectations', title: 'Lessons of the Crown', text: 'Your household has arranged a demanding schedule of tutors, languages, and public etiquette. Even childhood carries an audience.', category: 'career', weight: 12,
    conditions: { minAge: 6, maxAge: 12, customCheck: state => state.origin?.status === 'royal' && state.origin.country !== 'Unknown' },
    choices: [
      { id: 'royal_study', text: 'Commit to the lessons.', effect: { statChanges: { smarts: 5, happiness: -3 }, approvalChange: 3, outcomeText: 'You master another difficult lesson. The household praises your discipline, though you wonder when an achievement becomes simply expected.', logText: 'Accepted demanding royal education expectations.' } },
      { id: 'royal_play', text: 'Ask for time to play like other children.', effect: { statChanges: { happiness: 8, status: -2 }, approvalChange: -2, outcomeText: 'A little ordinary time is granted. The relief is private, but it feels like the first decision that belongs entirely to you.', logText: 'Asked the royal household for ordinary childhood time.' } }
    ]
  },
  {
    id: 'royal_teen_privacy', title: 'A Photograph in the Papers', text: 'A photographer has captured you leaving a private gathering. Advisors want a response before the story grows.', category: 'relationship', weight: 14,
    conditions: { minAge: 13, maxAge: 19, customCheck: state => state.origin?.status === 'royal' },
    choices: [
      { id: 'royal_privacy_statement', text: 'Ask the household to defend your privacy.', effect: { approvalChange: 2, repChanges: { online: 3 }, outcomeText: 'The statement is restrained but firm. The story fades, while your supporters appreciate that the household treated your boundaries as real.', logText: 'Defended royal privacy through a measured statement.' } },
      { id: 'royal_own_story', text: 'Address the public yourself.', effect: { approvalChange: 6, repChanges: { online: 5 }, statChanges: { happiness: -4 }, outcomeText: 'You speak plainly about being young, visible, and imperfect. The honesty earns warmth from some people and scrutiny from others.', logText: 'Addressed public attention personally as a young royal.' } },
      { id: 'royal_hide', text: 'Say nothing and retreat from public life.', effect: { approvalChange: -4, statChanges: { happiness: 3 }, outcomeText: 'Silence protects the evening but leaves the public story to strangers. Privacy returns slowly, carrying a cost in trust.', logText: 'Withdrew from public attention after a royal privacy incident.' } }
    ]
  },
  {
    id: 'royal_adult_duty', title: 'The Public Duty', text: 'As an adult royal, you are asked to attend a difficult community event where your presence could reassure people.', category: 'career', weight: 10,
    conditions: { minAge: 20, minRep: { online: 0 }, customCheck: state => state.origin?.status === 'royal' && (state.publicApproval ?? 50) >= 35 },
    choices: [
      { id: 'royal_duty_attend', text: 'Attend and listen without turning it into a speech.', effect: { approvalChange: 8, statChanges: { happiness: -2 }, outcomeText: 'You listen longer than you speak. The photographs show a public figure present for the people rather than performing at them.', logText: 'Fulfilled a public royal duty with a listening-first approach.' } },
      { id: 'royal_duty_delegate', text: 'Send an advisor in your place.', effect: { approvalChange: -5, statChanges: { happiness: 2 }, outcomeText: 'The advisor is capable, but absence is noticed. You keep your schedule and lose a little of the public trust that schedule was meant to protect.', logText: 'Delegated a difficult royal public duty.' } }
    ]
  },
  {
    id: 'royal_parent_expectations', title: 'A Private Conversation', text: 'One of your royal parents asks whether you are prepared to keep choosing duty when nobody is applauding.', category: 'relationship', weight: 12, involvedRelationshipType: 'parent',
    conditions: { minAge: 13, hasRelationshipType: 'parent', customCheck: state => state.origin?.status === 'royal' && (state.publicApproval ?? 50) < 75 },
    choices: [
      { id: 'royal_parent_reassure', text: 'Promise to take the responsibility seriously.', effect: { approvalChange: 3, relationshipChanges: { target: 'current', trust: 8, suspicion: -4, resentment: -3 }, outcomeText: 'Your parent hears the promise as a commitment rather than a performance. The expectations remain, but the relationship feels steadier.', logText: 'Reassured a royal parent about public responsibility.' } },
      { id: 'royal_parent_boundary', text: 'Explain that duty needs boundaries.', effect: { approvalChange: -2, relationshipChanges: { target: 'current', trust: 2, suspicion: 2, resentment: 5 }, statChanges: { happiness: 5 }, outcomeText: 'The conversation is tense, but honest. Your parent dislikes the limit and understands why you need one.', logText: 'Set a boundary with a royal parent about duty.' } }
    ]
  },
  {
    id: 'royal_regency_transition', title: 'The Regency Ends', text: 'You are old enough to rule in your own name. Your regent asks what role they should have now.', category: 'relationship', weight: 14, involvedRelationshipType: 'mentor',
    conditions: { minAge: 18, flagsTrue: ['royal_regency_ended'], customCheck: state => state.royalSuccession?.rank === 'monarch' && !state.royalSuccession.regencyActive && !!state.royalSuccession.regentId },
    choices: [
      { id: 'regency_keep_advisor', text: 'Keep the regent as a trusted advisor.', effect: { relationshipChanges: { target: 'current', trust: 8, resentment: -6 }, approvalChange: 3, flagsSet: { royal_regency_ended: false }, outcomeText: 'The regent steps back without disappearing. The transition feels like gratitude rather than dismissal.', logText: 'Kept a former regent as a trusted royal advisor.' } },
      { id: 'regency_distance', text: 'Create distance and rule independently.', effect: { relationshipChanges: { target: 'current', trust: -5, resentment: 8 }, approvalChange: -2, statChanges: { happiness: 4 }, flagsSet: { royal_regency_ended: false }, outcomeText: 'You take full control, and the household understands that independence can still feel like rejection.', logText: 'Chose independence after a royal regency.' } }
    ]
  },
  {
    id: 'royal_sibling_claim', title: 'A Sibling Questions the Succession', text: 'A sibling privately argues that the family should reconsider who deserves the future crown.', category: 'relationship', weight: 10, involvedRelationshipType: 'sibling',
    conditions: { minAge: 13, hasRelationshipType: 'sibling', customCheck: state => state.origin?.status === 'royal' && state.royalSuccession?.rank === 'monarch' && (state.publicApproval ?? 50) < 65 },
    choices: [
      { id: 'sibling_listen', text: 'Listen and acknowledge the hurt.', effect: { relationshipChanges: { target: 'current', trust: 6, suspicion: -4, resentment: -5 }, approvalChange: 2, outcomeText: 'You do not surrender the succession, but you stop treating your sibling’s resentment as treason. The family tension loosens.', logText: 'Listened to a sibling dispute about royal succession.' } },
      { id: 'sibling_dismiss', text: 'Dismiss the challenge as disloyalty.', effect: { relationshipChanges: { target: 'current', trust: -8, suspicion: 8, resentment: 12 }, approvalChange: -3, outcomeText: 'The claim is dismissed publicly and remembered privately. The succession remains clear; the relationship does not.', logText: 'Dismissed a sibling succession challenge.' } }
    ]
  },
  {
    id: 'royal_governance_choice', title: 'The Shape of the Crown', text: 'As a high-ranking royal, you must choose whether to preserve a familiar tradition or begin a careful modernization effort.', category: 'career', weight: 12,
    conditions: { minAge: 18, customCheck: state => state.origin?.status === 'royal' && ['monarch', 'heir'].includes(state.royalSuccession?.rank || '') },
    choices: [
      { id: 'royal_preserve_tradition', text: 'Preserve the tradition.', effect: { approvalChange: 4, authorityChange: 3, relationshipChanges: { target: 'all', trust: 2 }, outcomeText: 'You protect the familiar ceremony. Traditional supporters feel reassured, while younger voices wait to see whether continuity can still make room for them.', narrativeVariants: { positive: [{ text: 'With authority still new, continuity gives your household a stable first promise.', minAuthority: 0, maxAuthority: 45 }, { text: 'You have enough authority to choose tradition deliberately rather than defensively. The ceremony feels like stewardship.', minAuthority: 46 }] }, logText: 'Chose to preserve a royal tradition.' } },
      { id: 'royal_reform_tradition', text: 'Modernize the institution carefully.', effect: { approvalChange: -2, authorityChange: 7, relationshipChanges: { target: 'all', trust: -2, resentment: 2 }, outcomeText: 'The changes are measured, but change still unsettles people who believed the old form was the point. Your authority grows as your family debates what you are becoming.', narrativeVariants: { chaotic: [{ text: 'You spend authority to make the institution more legible to a new generation. The applause is mixed, but the decision is unmistakably yours.', minAuthority: 46 }, { text: 'You are still earning the right to change the symbols everyone inherited. The first reform creates as much family conversation as public approval.', maxAuthority: 45 }] }, logText: 'Introduced careful reforms to royal tradition.' } },
      { id: 'royal_public_service', text: 'Put the crown behind a public project.', effect: { approvalChange: 8, authorityChange: 4, statChanges: { happiness: -2 }, outcomeText: 'You attach the crown to a practical public project. The work outlasts the photographs, and supporters begin to measure your reign by results.', narrativeVariants: { positive: [{ text: 'The project gives your authority somewhere useful to go: into schools, hospitals, and promises people can visit.', minAuthority: 35 }, { text: 'Public service turns recognition into support. The crown feels less like a symbol and more like an obligation with witnesses.', minFame: 20 }] }, logText: 'Committed royal authority to a public service project.' } }
    ]
  },
  {
    id: 'royal_advisor_disagreement', title: 'The Advisor’s Objection', text: 'Your royal advisor believes your latest decision is too risky. They ask whether you want counsel or obedience.', category: 'relationship', weight: 13, involvedRelationshipType: 'mentor',
    conditions: { minAge: 18, hasRelationshipType: 'mentor', customCheck: state => state.origin?.status === 'royal' && (state.royalAuthority ?? 0) >= 35 },
    choices: [
      { id: 'royal_advisor_listen', text: 'Listen before deciding.', effect: { approvalChange: 2, authorityChange: 2, relationshipChanges: { target: 'current', trust: 8, suspicion: -4, resentment: -4 }, outcomeText: 'You hear the concern without surrendering the decision. The advisor leaves convinced that counsel still matters under your authority.', narrativeVariants: { positive: [{ text: 'A cautious advisor is easiest to dismiss when authority feels exciting. You listen anyway, and the relationship becomes a stabilizer rather than a brake.', npcPersonalityAny: ['cautious', 'loyal'] }, { text: 'You have enough authority to disagree without humiliating the person who warned you.', minAuthority: 60 }] }, logText: 'Listened to a royal advisor before making a decision.' } },
      { id: 'royal_advisor_override', text: 'Override the advice publicly.', effect: { approvalChange: -3, authorityChange: 6, relationshipChanges: { target: 'current', trust: -8, suspicion: 4, resentment: 9 }, outcomeText: 'The decision is yours, and everyone knows it. The advisor remains loyal for now, but the public disagreement becomes a memory with a long half-life.', narrativeVariants: { negative: [{ text: 'Authority can end an argument instantly. It cannot make the person who lost it forget the room.', npcPersonalityAny: ['loyal', 'traditional'] }, { text: 'You win the decision and spend some of the trust that made the decision possible.', minAuthority: 35, maxAuthority: 59 }] }, logText: 'Overrode a royal advisor in public.' } }
    ]
  },
  {
    id: 'royal_public_reaction', title: 'The Public Reaction', text: 'Your latest royal decision has become the subject of national conversation. Supporters want reassurance; critics want an explanation.', category: 'random', weight: 11,
    conditions: { minAge: 18, customCheck: state => state.origin?.status === 'royal' && (state.royalAuthority ?? 0) >= 30 },
    choices: [
      { id: 'royal_reaction_explain', text: 'Explain the decision plainly.', effect: { approvalChange: 6, authorityChange: 1, outcomeText: 'The explanation does not satisfy everyone, but it gives the public a coherent reason to disagree with you rather than inventing one.', narrativeVariants: { positive: [{ text: 'Recognition brought the question to you; authority lets you answer without hiding behind ceremony.', minFame: 30, minAuthority: 50 }, { text: 'You are still learning how much honesty a public role can carry. The answer lands because it sounds like a person made it.', maxAuthority: 49 }] }, logText: 'Explained a royal decision to the public.' } },
      { id: 'royal_reaction_silence', text: 'Let the household statement speak.', effect: { approvalChange: -2, authorityChange: 3, outcomeText: 'The official statement is polished and defensible. It also leaves people wondering whether the crown is listening or merely speaking.', logText: 'Allowed a royal household statement to answer public criticism.' } }
    ]
  },
  {
    id: 'royal_relationship_scandal', title: 'A Private Life in Public', text: 'A photograph of your partner leaving a private gathering has become a royal scandal. The household wants a statement.', category: 'relationship', weight: 12, involvedRelationshipType: 'partner',
    conditions: { minAge: 18, hasRelationshipType: 'partner', customCheck: state => state.origin?.status === 'royal' && ['heir', 'monarch'].includes(state.royalSuccession?.rank || '') },
    choices: [
      { id: 'royal_scandal_protect', text: 'Protect your partner and acknowledge the relationship.', effect: { approvalChange: 3, authorityChange: 1, relationshipChanges: { target: 'current', trust: 8, suspicion: -5, resentment: -4 }, outcomeText: 'You take responsibility for the story without offering your partner as its explanation. The public debate continues, but the relationship feels protected.', narrativeVariants: { positive: [{ text: 'Royal life has made privacy expensive. You spend some approval to make sure the cost is not paid by the person beside you.', minAuthority: 35 }, { text: 'The statement is careful without being evasive. Your partner remembers that the institution did not come first this time.', minRelationshipTrust: 60 }] }, logText: 'Protected a partner during a royal relationship scandal.' } },
      { id: 'royal_scandal_distance', text: 'Distance yourself from the controversy.', effect: { approvalChange: 1, authorityChange: 2, personalFreedomChange: -5, relationshipChanges: { target: 'current', trust: -8, suspicion: 5, resentment: 10 }, outcomeText: 'The official story becomes cleaner. The private relationship becomes colder, watched by the same people who praised your discipline.', logText: 'Prioritized royal reputation over a partner during a scandal.' } }
    ]
  },
  {
    id: 'royal_marriage_expectations', title: 'The Marriage Question', text: 'Your family believes a public marriage would steady the succession and reassure traditional supporters.', category: 'relationship', weight: 10,
    conditions: { minAge: 25, customCheck: state => state.origin?.status === 'royal' && ['heir', 'monarch'].includes(state.royalSuccession?.rank || '') },
    choices: [
      { id: 'royal_marriage_accept', text: 'Accept the expectation and begin introductions.', effect: { approvalChange: 5, authorityChange: 1, personalFreedomChange: -10, outcomeText: 'The household celebrates the possibility. You gain approval and lose a little of the right to keep your romantic life unobserved.', logText: 'Accepted family pressure to explore a royal marriage.' } },
      { id: 'royal_marriage_decline', text: 'Decline and set a personal boundary.', effect: { approvalChange: -4, authorityChange: 2, personalFreedomChange: 10, outcomeText: 'The refusal disappoints the family, but the boundary is unmistakably yours. For once, the future feels private enough to imagine.', logText: 'Declined a royal marriage expectation.' } }
    ]
  },
  {
    id: 'royal_abdication', title: 'The Crown and the Person', text: 'The duties of the crown have begun to consume the life you wanted to live. You can continue, or formally step away.', category: 'career', weight: 8,
    conditions: { minAge: 25, customCheck: state => state.origin?.status === 'royal' && state.royalSuccession?.rank === 'monarch' && (state.personalFreedom ?? 45) <= 35 },
    choices: [
      { id: 'royal_continue', text: 'Continue serving despite the cost.', effect: { approvalChange: 4, authorityChange: 2, personalFreedomChange: -5, outcomeText: 'You remain. The institution steadies, and the personal cost becomes something you carry rather than resolve.', logText: 'Continued royal duties despite personal freedom pressure.' } },
      { id: 'royal_abdicate', text: 'Abdicate and live as a former royal.', effect: { approvalChange: -12, authorityChange: -100, personalFreedomChange: 55, relationshipChanges: { target: 'all', trust: -3, resentment: 5 }, flagsSet: { royal_abdicated: true }, outcomeText: 'You surrender the title and the privileges with it. Fame, memories, and relationships remain; the duties no longer do.', logText: 'Abdicated the crown to reclaim a private life.' } }
    ]
  },
  {
    id: 'royal_celebrity_appearance', title: 'The Celebrity Invitation', text: 'A famous performer invites you to a private event. Attending could humanize the crown, but every photograph will be interpreted.', category: 'random', weight: 9,
    conditions: { minAge: 18, customCheck: state => state.origin?.status === 'royal' && ['prince_princess', 'heir', 'monarch'].includes(state.royalSuccession?.rank || '') },
    choices: [
      { id: 'royal_celebrity_attend', text: 'Attend openly and accept the attention.', effect: { approvalChange: 2, authorityChange: 1, personalFreedomChange: -3, outcomeText: 'The appearance makes the crown feel younger and less distant. It also turns a private evening into public property.', logText: 'Attended a celebrity event as a public royal appearance.' } },
      { id: 'royal_celebrity_decline', text: 'Decline to protect your private life.', effect: { approvalChange: -1, personalFreedomChange: 4, outcomeText: 'You keep the evening private. The public receives no new image of you, which is its own kind of relief.', logText: 'Declined a celebrity invitation to preserve privacy.' } }
    ]
  },
  {
    id: 'royal_foreign_visit', title: 'A Foreign Visit', text: 'A neighboring monarchy invites you for a formal visit. Your presence could strengthen a relationship that is larger than either family.', category: 'career', weight: 9,
    conditions: { minAge: 18, customCheck: state => state.origin?.status === 'royal' && ['heir', 'monarch'].includes(state.royalSuccession?.rank || '') },
    choices: [
      { id: 'royal_visit_accept', text: 'Accept the invitation and represent the crown.', effect: { approvalChange: 4, authorityChange: 3, personalFreedomChange: -4, outcomeText: 'The visit is formal, exhausting, and quietly effective. You return with better relationships and a clearer sense of what your presence can do.', logText: 'Completed an international royal visit.' } },
      { id: 'royal_visit_decline', text: 'Decline and focus on domestic duties.', effect: { approvalChange: 1, authorityChange: -1, personalFreedomChange: 4, outcomeText: 'You keep your schedule and your privacy. The invitation is graciously declined, though the opportunity will not wait forever.', logText: 'Declined an international royal visit.' } }
    ]
  },
  {
    id: 'royal_wedding_diplomacy', title: 'The Royal Wedding', text: 'A royal wedding abroad offers celebration, family visibility, and a diplomatic room full of cameras.', category: 'relationship', weight: 8,
    conditions: { minAge: 18, customCheck: state => state.origin?.status === 'royal' && (state.publicApproval ?? 50) >= 35 },
    choices: [
      { id: 'royal_wedding_attend', text: 'Attend and make the family connection visible.', effect: { approvalChange: 5, authorityChange: 2, personalFreedomChange: -3, outcomeText: 'The celebration becomes a public bridge between two families. You leave with memories that feel personal despite the cameras.', logText: 'Attended an international royal wedding.' } },
      { id: 'royal_wedding_private', text: 'Send a private message instead.', effect: { approvalChange: -1, personalFreedomChange: 3, outcomeText: 'Your message is sincere, but your absence is noticed. The relationship survives without the ceremony becoming part of your public story.', logText: 'Sent private congratulations instead of attending a royal wedding.' } }
    ]
  },
  {
    id: 'royal_power_response', title: 'The Objection', text: 'An advisor challenges a decision you made in private. The room is quiet enough for respect, ego, or fear to decide what happens next.', category: 'relationship', weight: 12, involvedRelationshipType: 'mentor',
    conditions: { minAge: 18, hasRelationshipType: 'mentor', customCheck: state => state.origin?.status === 'royal' && (state.royalAuthority ?? 0) >= 35 },
    choices: [
      { id: 'royal_response_respect', text: 'Hear the objection and respond with respect.', effect: { approvalChange: 4, authorityChange: 1, integrityChange: 5, royalTendencyChanges: { benevolent: 5, ambitious: 1 }, relationshipChanges: { target: 'current', trust: 8, suspicion: -5, resentment: -5 }, memory: { type: 'royal_respect', intensity: 50, emotionalValue: 20, decayRate: 1, permanent: true }, outcomeText: 'You let the advisor finish. The decision may still stand, but the relationship survives with its dignity intact.', logText: 'Responded respectfully to an advisor’s objection.' } },
      { id: 'royal_response_ego', text: 'Make the advisor regret embarrassing you.', effect: { approvalChange: -4, authorityChange: 3, integrityChange: -8, fearChange: 5, royalTendencyChanges: { ambitious: 4, reckless: 3, ruthless: 2 }, relationshipChanges: { target: 'current', trust: -10, suspicion: 5, resentment: 12 }, memory: { type: 'royal_humiliation', intensity: 70, emotionalValue: -30, decayRate: 0, permanent: true }, outcomeText: 'The advisor leaves with the answer you wanted and a memory you did not intend to create. Compliance arrives faster than trust.', narrativeVariants: { negative: [{ text: 'You win the room by making one person smaller. The victory is immediate; the silence afterward is not.', maxFear: 5 }, { text: 'The advisor nods because the crown is still powerful. Their faith in your judgment does not survive the meeting.', minFear: 6 }] }, logText: 'Used ego and humiliation to silence an advisor.' } },
      { id: 'royal_response_abuse', text: 'Use your authority to threaten consequences.', conditions: { customCheck: state => (state.royalAuthority ?? 0) >= 60 && ((state.royalBehavior?.corrupt || 0) >= 60 || (state.royalBehavior?.ruthless || 0) >= 60) }, effect: { approvalChange: -12, authorityChange: -8, integrityChange: -20, fearChange: 18, personalFreedomChange: -4, royalTendencyChanges: { corrupt: 8, ruthless: 8, benevolent: -5 }, relationshipChanges: { target: 'current', trust: -20, suspicion: 12, resentment: 25 }, memory: { type: 'royal_abuse_of_power', intensity: 95, emotionalValue: -60, decayRate: 0, permanent: true }, flagsSet: { royal_abuse_allegation: true }, outcomeText: 'The threat works. That is the problem. The advisor obeys because refusal now feels dangerous, and the memory becomes a private accusation waiting for a witness.', logText: 'Abused royal authority to threaten an advisor.' } }
    ]
  },
  {
    id: 'royal_leaked_information', title: 'The Leak', text: 'A private message about your relationship and household negotiations has reached a journalist. Someone close to the crown is talking.', category: 'random', weight: 10,
    conditions: { minAge: 18, customCheck: state => state.origin?.status === 'royal' && ((state.royalBehavior?.reckless || 0) >= 30 || (state.royalBehavior?.corrupt || 0) >= 30) },
    choices: [
      { id: 'royal_leak_truth', text: 'Acknowledge the mistake and protect the people involved.', effect: { approvalChange: 5, integrityChange: 6, authorityChange: -1, royalTendencyChanges: { benevolent: 4, reckless: -4 }, flagsSet: { royal_leak_resolved: true }, outcomeText: 'You admit what happened without offering a scapegoat. The leak remains damaging, but the people around you are not sacrificed to contain it.', logText: 'Handled a royal information leak with accountability.' } },
      { id: 'royal_leak_blame', text: 'Blame a junior staff member and control the story.', effect: { approvalChange: -8, integrityChange: -12, fearChange: 8, royalTendencyChanges: { corrupt: 6, ruthless: 5 }, flagsSet: { royal_abuse_allegation: true, royal_leak_resolved: true }, outcomeText: 'The story is contained for a day. The staff member is not, and the household learns that loyalty under pressure is becoming a one-way demand.', logText: 'Scapegoated staff during a royal information leak.' } }
    ]
  },
  {
    id: 'royal_downfall_crisis', title: 'The Crown’s Breaking Point', text: 'Approval has collapsed, fear is rising, and the people closest to you are no longer certain the institution can carry your choices.', category: 'career', weight: 7,
    conditions: { minAge: 25, customCheck: state => state.origin?.status === 'royal' && state.royalSuccession?.rank === 'monarch' && ((state.publicApproval ?? 50) <= 20 || (state.publicFear ?? 0) >= 70 || Boolean(state.flags.royal_abuse_allegation)) },
    choices: [
      { id: 'royal_downfall_reconcile', text: 'Invite family and advisors to a private reckoning.', effect: { approvalChange: 6, authorityChange: -4, fearChange: -12, integrityChange: 8, royalTendencyChanges: { benevolent: 6, ruthless: -5 }, relationshipChanges: { target: 'all', trust: 5, resentment: -8 }, outcomeText: 'No one forgets the harm, but the room is finally allowed to describe it. Reconciliation begins as a process rather than a speech.', logText: 'Started a private royal reckoning after a scandal.' } },
      { id: 'royal_downfall_clampdown', text: 'Tighten control and demand loyalty.', conditions: { customCheck: state => (state.royalAuthority ?? 0) >= 45 }, effect: { approvalChange: -10, authorityChange: -12, fearChange: 15, integrityChange: -10, royalTendencyChanges: { corrupt: 5, ruthless: 8 }, relationshipChanges: { target: 'all', trust: -8, resentment: 15 }, flagsSet: { royal_forced_abdication_risk: true }, outcomeText: 'The institution becomes quieter, not safer. People obey in public while preparing for the day obedience is no longer enough.', logText: 'Clamped down after a royal scandal.' } },
      { id: 'royal_downfall_abdicate', text: 'Step down before the crown becomes a weapon.', effect: { approvalChange: -5, authorityChange: -100, personalFreedomChange: 50, fearChange: -15, integrityChange: 10, flagsSet: { royal_forced_abdication: true }, outcomeText: 'You leave the throne before the family has to remove you. The legacy is damaged, but the last choice is not another act of control.', logText: 'Stepped down during a royal downfall crisis.' } }
    ]
  },
  {
    id: 'family_parenting_choice', title: 'The Kind of Parent You Are', text: 'Your child is old enough to notice the difference between guidance, control, and absence. The next choice will become part of how they remember you.', category: 'relationship', weight: 12, involvedRelationshipType: 'child',
    conditions: { minAge: 18, hasRelationshipType: 'child' },
    choices: [
      { id: 'parenting_strict', text: 'Set strict rules and high standards.', effect: { relationshipChanges: { target: 'current', trust: -5, resentment: 5 }, outcomeText: 'Your child becomes disciplined and careful around you. They know what you expect; they are less certain whether they can disappoint you safely.', logText: 'Chose strict parenting.' } },
      { id: 'parenting_supportive', text: 'Listen, encourage, and stay present.', effect: { relationshipChanges: { target: 'current', trust: 8, resentment: -4 }, outcomeText: 'Your child leaves the conversation happier and more secure. Support does not remove every problem, but it gives them somewhere to bring one.', logText: 'Chose supportive parenting.' } },
      { id: 'parenting_neglectful', text: 'Let them figure everything out alone.', effect: { relationshipChanges: { target: 'current', trust: -12, resentment: 10 }, outcomeText: 'Independence arrives early, carrying a question you may not be able to answer later: where were you when they needed you?', logText: 'Chose a neglectful parenting approach.' } }
    ]
  },
  {
    id: 'family_inheritance_dispute', title: 'The Inheritance Meeting', text: 'A family member challenges the way an inheritance was divided. The estate is valuable; the resentment is older.', category: 'relationship', weight: 10, involvedRelationshipType: 'sibling',
    conditions: { minAge: 18, hasRelationshipType: 'sibling', customCheck: state => (state.familyInheritance || 0) > 0 },
    choices: [
      { id: 'inheritance_share', text: 'Offer a fairer share and explain the decision.', effect: { cashChange: -1000, relationshipChanges: { target: 'current', trust: 8, resentment: -10 }, outcomeText: 'You give up money to keep the family from turning grief into litigation. The settlement is imperfect, but the relationship survives it.', logText: 'Shared inherited wealth to resolve a family dispute.' } },
      { id: 'inheritance_refuse', text: 'Refuse to renegotiate.', effect: { relationshipChanges: { target: 'current', trust: -8, suspicion: 5, resentment: 12 }, outcomeText: 'The paperwork is clear. So is the distance that opens between you and the relative who believes clarity was never the same thing as fairness.', logText: 'Refused to renegotiate an inheritance dispute.' } }
    ]
  },
  {
    id: 'family_sibling_rivalry', title: 'The Family Comparison', text: 'A sibling accuses you of turning every family gathering into a comparison of achievements, money, and attention.', category: 'relationship', weight: 11, involvedRelationshipType: 'sibling',
    conditions: { minAge: 13, hasRelationshipType: 'sibling' },
    choices: [
      { id: 'sibling_reconcile', text: 'Admit the competition and make space for them.', effect: { relationshipChanges: { target: 'current', trust: 8, resentment: -8, suspicion: -3 }, outcomeText: 'The apology is awkward and specific. It does not erase the years of comparison, but it gives the sibling something better than another defense.', logText: 'Reconciled with a sibling after a rivalry.' } },
      { id: 'sibling_compete', text: 'Point out that you earned your position.', effect: { relationshipChanges: { target: 'current', trust: -6, resentment: 12, suspicion: 4 }, outcomeText: 'You win the argument and lose the evening. The family learns that your success is not the same thing as your generosity.', logText: 'Escalated sibling rivalry by defending status.' } }
    ]
  },
  {
    id: 'family_parent_conflict', title: 'The Parent You Cannot Please', text: 'A parent criticizes the life you built and insists they know what would have made you happier.', category: 'relationship', weight: 10, involvedRelationshipType: 'parent',
    conditions: { minAge: 18, hasRelationshipType: 'parent' },
    choices: [
      { id: 'parent_boundary', text: 'Set a firm boundary without cruelty.', effect: { relationshipChanges: { target: 'current', trust: 3, suspicion: -2, resentment: 3 }, outcomeText: 'The boundary disappoints them, but it is clear enough to be respected. Adulthood becomes a relationship you negotiate rather than win.', logText: 'Set a respectful boundary with a parent.' } },
      { id: 'parent_explode', text: 'Tell them exactly how much they hurt you.', effect: { relationshipChanges: { target: 'current', trust: -6, resentment: 10, suspicion: 3 }, outcomeText: 'The truth comes out sharp enough to wound twice. You feel relief first, then wonder whether honesty needed to sound like punishment.', logText: 'Confronted a parent in an explosive argument.' } }
    ]
  },
  {
    id: 'family_child_bonding', title: 'A Small Childhood Milestone', text: 'Your young child reaches for your attention in the middle of an ordinary day. What you do becomes part of their earliest sense of safety.', category: 'relationship', weight: 10, involvedRelationshipType: 'child',
    conditions: { minAge: 18, hasRelationshipType: 'child', customCheck: state => Object.values(state.npcs).some(npc => npc.relation === 'child' && npc.age <= 5) },
    choices: [
      { id: 'child_bond', text: 'Put everything aside and be present.', effect: { relationshipChanges: { target: 'current', trust: 8, resentment: -4 }, memory: { type: 'early_bonding', intensity: 45, emotionalValue: 25, decayRate: 1, permanent: true }, outcomeText: 'The moment is simple, but your child learns that your attention can be trusted.', logText: 'Prioritized early bonding with a child.' } },
      { id: 'child_dismiss', text: 'Promise to make time later.', effect: { relationshipChanges: { target: 'current', trust: -4, resentment: 5 }, memory: { type: 'missed_bonding', intensity: 35, emotionalValue: -15, decayRate: 1, permanent: false }, outcomeText: 'The day moves on. Your child notices the promise more than the reason behind it.', logText: 'Missed an early childhood bonding moment.' } }
    ]
  },
  {
    id: 'family_child_school_hobby', title: 'School and Hobbies', text: 'Your school-age child is discovering interests that may shape the person they become.', category: 'relationship', weight: 10, involvedRelationshipType: 'child',
    conditions: { minAge: 18, hasRelationshipType: 'child', customCheck: state => Object.values(state.npcs).some(npc => npc.relation === 'child' && npc.age >= 6 && npc.age <= 12) },
    choices: [
      { id: 'child_encourage_hobby', text: 'Encourage curiosity over perfect results.', effect: { relationshipChanges: { target: 'current', trust: 6, resentment: -2 }, memory: { type: 'supported_hobby', intensity: 35, emotionalValue: 20, decayRate: 1, permanent: false }, outcomeText: 'Your child feels free to explore without turning every interest into a test.', logText: 'Encouraged a child’s school and hobby interests.' } },
      { id: 'child_push_grades', text: 'Insist that achievement comes first.', effect: { relationshipChanges: { target: 'current', trust: -3, resentment: 5 }, memory: { type: 'academic_pressure', intensity: 40, emotionalValue: -10, decayRate: 1, permanent: false }, outcomeText: 'The grades improve, but your child becomes careful about sharing what they actually enjoy.', logText: 'Prioritized achievement over a child’s hobbies.' } }
    ]
  },
  {
    id: 'family_child_independence', title: 'A Child Wants Their Own Direction', text: 'Your teenager asks for room to make decisions that do not match your plans for them.', category: 'relationship', weight: 10, involvedRelationshipType: 'child',
    conditions: { minAge: 18, hasRelationshipType: 'child', customCheck: state => Object.values(state.npcs).some(npc => npc.relation === 'child' && npc.age >= 13 && npc.age <= 18) },
    choices: [
      { id: 'child_trust_choice', text: 'Offer guidance, then let them choose.', effect: { relationshipChanges: { target: 'current', trust: 8, resentment: -5 }, memory: { type: 'supported_independence', intensity: 45, emotionalValue: 25, decayRate: 1, permanent: true }, outcomeText: 'You remain available without making their future a referendum on your expectations.', logText: 'Supported a teenager’s independence.' } },
      { id: 'child_control_choice', text: 'Demand they follow the safer path.', effect: { relationshipChanges: { target: 'current', trust: -8, resentment: 10 }, memory: { type: 'blocked_independence', intensity: 50, emotionalValue: -25, decayRate: 1, permanent: true }, outcomeText: 'Your fear sounds like certainty. Your teenager hears it as a verdict against their judgment.', logText: 'Tried to control a teenager’s future.' } }
    ]
  },
  {
    id: 'family_reconciliation', title: 'A Chance to Repair the Family', text: 'An old family wound is still present in the pauses between conversations. Someone has finally left the door open.', category: 'relationship', weight: 8, involvedRelationshipType: 'sibling',
    conditions: { minAge: 18, hasRelationshipType: 'sibling', customCheck: state => Object.values(state.npcs).some(npc => npc.relation === 'sibling' && npc.resentment >= 20) },
    choices: [
      { id: 'family_reconcile', text: 'Apologize specifically and listen.', effect: { relationshipChanges: { target: 'current', trust: 10, resentment: -12, suspicion: -5 }, memory: { type: 'family_reconciliation', intensity: 55, emotionalValue: 30, decayRate: 1, permanent: true }, outcomeText: 'The past does not disappear, but the relationship stops treating it as a sentence.', logText: 'Reconciled with a family member.' } },
      { id: 'family_reopen_wound', text: 'List every way they hurt you.', effect: { relationshipChanges: { target: 'current', trust: -5, resentment: 8 }, memory: { type: 'reopened_family_wound', intensity: 50, emotionalValue: -25, decayRate: 1, permanent: true }, outcomeText: 'The conversation becomes an archive of grievances instead of a bridge.', logText: 'Reopened an old family wound.' } }
    ]
  },
  {
    id: 'family_scandal', title: 'A Family Secret Reaches the Public', text: 'A private family conflict has become a story other people feel entitled to discuss.', category: 'relationship', weight: 7, involvedRelationshipType: 'parent',
    conditions: { minAge: 18, hasRelationshipType: 'parent', customCheck: state => (state.fame || 0) >= 25 && Object.values(state.npcs).some(npc => npc.relation === 'parent' && npc.memories.some(memory => memory.emotionalValue < -20)) },
    choices: [
      { id: 'family_scandal_protect', text: 'Protect the family member from the spectacle.', effect: { relationshipChanges: { target: 'current', trust: 8, resentment: -4 }, repChanges: { family: 3 }, memory: { type: 'protected_family_privacy', intensity: 55, emotionalValue: 25, decayRate: 1, permanent: true }, outcomeText: 'You refuse to turn private pain into public content. The story loses its sharpest angle.', logText: 'Protected family privacy during a scandal.' } },
      { id: 'family_scandal_expose', text: 'Tell your version before someone else does.', effect: { relationshipChanges: { target: 'current', trust: -10, suspicion: 8, resentment: 12 }, repChanges: { online: 3, family: -6 }, memory: { type: 'family_secret_exposed', intensity: 70, emotionalValue: -35, decayRate: 0, permanent: true }, outcomeText: 'The public gets a clear story. Your family gets a permanent memory of who supplied it.', logText: 'Exposed a family secret publicly.' } }
    ]
  },
  {
    id: 'education_school_choice', title: 'A Year at School', text: 'School is asking more of you now. You have to decide what deserves your time: achievement, friendships, or the freedom to push back.', category: 'school', weight: 12,
    conditions: { minAge: 5, maxAge: 12, customCheck: state => state.career.type === 'school' },
    choices: [
      { id: 'school_study', text: 'Study and take the difficult subjects seriously.', effect: { statChanges: { smarts: 2, happiness: -2 }, flagsSet: { education_choice_study: true }, outcomeText: 'Your grades rise, and so does the sense that discipline can open doors later.', narrativeVariants: { positive: [{ text: 'The work is tedious until the results arrive. Then the difficult subjects feel less like walls and more like keys.', minAge: 8 }], neutral: [{ text: 'You spend the year learning how much progress can come from showing up when the work is not exciting.' }] }, logText: 'Focused on study and school discipline.' } },
      { id: 'school_socialize', text: 'Spend more time with classmates and build friendships.', effect: { statChanges: { happiness: 4, status: 3 }, flagsSet: { education_choice_social: true }, outcomeText: 'You become more comfortable in groups and learn which friendships feel reciprocal.', narrativeVariants: { positive: [{ text: 'The friendships are not just a distraction from school; they become practice for the person you are learning to be around others.' }], neutral: [{ text: 'You learn names, loyalties, and the quiet social rules no textbook explains.' }] }, logText: 'Prioritized friendships and social skills at school.' } },
      { id: 'school_rebel', text: 'Push back against rules and do things your own way.', effect: { statChanges: { happiness: 2, status: 2 }, flagsSet: { education_choice_rebel: true }, outcomeText: 'You gain independence, but teachers become less certain they can rely on you.', narrativeVariants: { chaotic: [{ text: 'You turn one harmless rule into a campaign for personal freedom. The adults call it defiance; your friends call it memorable.' }], negative: [{ text: 'The freedom feels real until missed work and disappointed teachers start following you home.' }] }, logText: 'Rebelled against school expectations.' } }
    ]
  },
  {
    id: 'education_teen_development', title: 'The Direction of Your Teenage Years', text: 'Your teenage years are becoming a portfolio of choices: academics, popularity, creativity, sports, and relationships all compete for room.', category: 'school', weight: 11,
    conditions: { minAge: 13, maxAge: 18, customCheck: state => state.career.type === 'school' },
    choices: [
      { id: 'teen_academics', text: 'Commit to academics.', effect: { statChanges: { smarts: 3 }, flagsSet: { education_focus_academics: true }, outcomeText: 'Your academic reputation improves, creating options that may not pay off until adulthood.', logText: 'Focused teenage development on academics.' } },
      { id: 'teen_popularity', text: 'Build your social presence.', effect: { statChanges: { status: 5, happiness: 2 }, flagsSet: { education_focus_popularity: true }, outcomeText: 'You become more visible at school and more practiced at reading a room.', logText: 'Focused teenage development on popularity.' } },
      { id: 'teen_creativity', text: 'Make time for art and creative work.', effect: { statChanges: { smarts: 1, happiness: 4 }, flagsSet: { education_focus_creativity: true }, outcomeText: 'Creative work gives you a language for feelings that do not fit neatly into school subjects.', logText: 'Focused teenage development on creativity.' } },
      { id: 'teen_sports', text: 'Train and compete in sports.', effect: { statChanges: { health: 3, status: 3 }, flagsSet: { education_focus_sports: true }, outcomeText: 'Training builds stamina, confidence, and a reputation for showing up under pressure.', logText: 'Focused teenage development on sports.' } },
      { id: 'teen_relationships', text: 'Prioritize relationships and emotional growth.', effect: { statChanges: { happiness: 4 }, flagsSet: { education_focus_relationships: true }, outcomeText: 'You learn that emotional intelligence is a skill, not a personality trait you either have or lack.', logText: 'Focused teenage development on relationships.' } }
    ]
  },
  {
    id: 'education_university_decision', title: 'What Comes After School?', text: 'Graduation is approaching. University could expand your options, but it also costs time, money, and the comfort of staying close to what you know.', category: 'school', weight: 14,
    conditions: { minAge: 17, maxAge: 19, flagsFalse: ['university_decision_resolved'], customCheck: state => state.career.type === 'school' || state.career.type === 'unemployed' },
    choices: [
      { id: 'university_attend', text: 'Apply to university and pursue a degree.', effect: { statChanges: { smarts: 3, happiness: -1 }, flagsSet: { university_decision_resolved: true }, outcomeText: 'You commit to university. The next few years will be shaped by a major, a campus community, and the pressure to make the opportunity count.', narrativeVariants: { positive: [{ text: 'The acceptance letter does not promise an easy life. It promises room to build one deliberately.', wealthBands: ['comfortable', 'wealthy'] }], neutral: [{ text: 'You choose a longer route into adulthood, hoping the education will make the uncertainty worthwhile.' }], negative: [{ text: 'The offer is real, but the financial pressure is real too. You begin calculating the future in installments.' }] }, logText: 'Chose to attend university.' } },
      { id: 'university_major_medical', text: 'Choose medicine and health sciences.', effect: { flagsSet: { university_decision_resolved: true }, outcomeText: 'You choose a demanding path toward medicine, where grades and discipline will matter every year.', logText: 'Chose a medical university major.' } },
      { id: 'university_major_arts', text: 'Choose arts and creative studies.', effect: { flagsSet: { university_decision_resolved: true }, outcomeText: 'You choose creative studies and accept that a less predictable career can still be a serious one.', logText: 'Chose an arts university major.' } },
      { id: 'university_major_business', text: 'Choose business and commerce.', effect: { flagsSet: { university_decision_resolved: true }, outcomeText: 'You choose business, drawn to negotiation, organizations, and the power of understanding incentives.', logText: 'Chose a business university major.' } },
      { id: 'university_skip', text: 'Skip university and start earning now.', effect: { statChanges: { happiness: 2 }, flagsSet: { university_decision_resolved: true }, outcomeText: 'You step into work sooner. The choice removes tuition pressure but closes some professional doors for now.', narrativeVariants: { neutral: [{ text: 'You choose a paycheck and practical experience over a credential. It is not a failure, but it will shape which risks remain affordable.' }], positive: [{ text: 'You begin earning and learning on the job, building a life that does not wait for permission from an admissions office.' }] }, logText: 'Chose to enter work instead of university.' } }
    ]
  }
];
