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
          logText: 'Invested $1,000 in a high-risk biotech stock tip.'
        }
      },
      {
        id: 'invest_refuse',
        text: 'Politely decline, citing your preference for index funds.',
        effect: {
          statChanges: { smarts: 10 },
          outcomeText: 'You hold onto your savings. They shrug, muttered something about missed fortunes, and buy another espresso.',
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
          { weight: 70, effect: { statChanges: { smarts: 15, happiness: 10 }, outcomeText: 'They are totally receptive! They stop the morning metal, start using the office microwave for fish, and only introduce you to three plants per week. Progress!', logText: 'Successfully set apartment boundaries with an unusual roommate.' } },
          { weight: 30, effect: { statChanges: { happiness: -15, willpower: -10 }, outcomeText: 'They get incredibly offended. They claim the plants need the metal music to photosynthesize. They stop talking to you and leave passive-aggressive sticky notes everywhere.', logText: 'Failed to reason with an eccentric roommate, resulting in a toxic living environment.' } }
        ]
      },
      {
        id: 'roommate_retaliate',
        text: 'Fight fire with fire: play bagpipe music at 3am.',
        outcomes: [
          { weight: 40, effect: { statChanges: { happiness: 20, status: -10 }, repChanges: { family: -5 }, outcomeText: 'You spend a week in a noise war that escalates into a legend the whole building tells. You eventually both collapse in exhausted laughter and become best friends.', logText: 'Waged a musical noise war with my roommate. We are now best friends.' } },
          { weight: 60, effect: { statChanges: { happiness: -20, cashChange: -300 }, outcomeText: 'The landlord receives 14 noise complaints. You are fined $300 and both issued a final eviction warning. The apartment is dead silent forever after.', logText: 'Fined $300 by the landlord for engaging in a noise war with my roommate.' } }
        ]
      },
      {
        id: 'roommate_accept',
        text: 'Learn the plants\' names and join the chaos.',
        outcomes: [
          { weight: 50, effect: { statChanges: { happiness: 30, smarts: 5 }, outcomeText: 'You learn that "Gerald" the fiddle-leaf fig is actually fascinating. Your roommate is eccentric but incredibly loyal. This becomes the best living situation you ever have.', logText: 'Embraced chaotic roommate energy. Best apartment ever.' } },
          { weight: 50, effect: { statChanges: { smarts: -15, health: -10 }, outcomeText: 'You try to embrace the chaos, but you develop severe allergies to the plants, and the death metal gives you chronic migraines. You are miserable.', logText: 'Tried to embrace eccentric roommate life but suffered health issues instead.' } }
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
      { id: 'speech_improvise', text: 'Wing it from the heart — pure improvisation.', effect: { statChanges: { happiness: 25, status: 20, willpower: 25 }, repChanges: { dating: 15 }, outcomeText: 'You speak from pure emotion. Four people cry. The bride says it was better than any written speech could have been. You find out later someone filmed it and it got posted to a wedding blog.', logText: 'Improvised a wedding speech that made four people cry.' } },
      { id: 'speech_honest', text: 'Tell the crowd you forgot your notes and ask for forgiveness.', effect: { statChanges: { karma: 1, happiness: 15 }, outcomeText: 'Everyone laughs with you, not at you. You muddle through warmly and the couple loves you for it. The wedding photographer captures your honest panic face for the album.', logText: 'Admitted to forgetting wedding speech notes. Crowd laughed with me.' } },
      { id: 'speech_quote', text: 'Fill three minutes with inspirational quotes you barely remember.', effect: { statChanges: { status: -10, happiness: -5, smarts: 5 }, outcomeText: 'You butcher a Winston Churchill quote badly, attribute a Gandhi line to Einstein, and finish with something you think is from Rumi but is actually a mug from TJ Maxx. Still applauded.', logText: 'Filled a forgotten wedding speech with misattributed inspirational quotes.' } }
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
      { id: 'reply_apologize', text: 'Send an immediate company-wide apology email.', effect: { statChanges: { karma: 1, status: -15, happiness: -20 }, repChanges: { workplace: -20 }, outcomeText: 'Your apology goes to all 340 people too. Your boss calls you into his office. Somehow, three colleagues quietly thank you for saying what everyone was thinking.', logText: 'Sent accidental reply-all rant about boss to entire company. Apologized company-wide.' } },
      { id: 'reply_own', text: 'Own it. Send a follow-up: "I stand by every word."', effect: { statChanges: { willpower: 20, status: 10, happiness: 15 }, repChanges: { workplace: -30 }, outcomeText: 'This is either the bravest or stupidest thing you have ever done. HR calls you in. Somehow you still have your job. The story becomes office legend.', logText: 'Doubled down after an accidental reply-all rant about the boss.' } },
      { id: 'reply_deny', text: 'Claim your account was hacked and file an IT ticket immediately.', effect: { statChanges: { smarts: 15, karma: -15 }, repChanges: { workplace: -5 }, outcomeText: 'IT reviews the logs, finds it was absolutely you, and sends you a politely devastating report. Your boss says nothing, but starts cc\'ing every email you send.', logText: 'Blamed a hack for a damning reply-all email. IT proved it was me.' } }
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
      { id: 'promo_work', text: 'Put in extra work and let your results speak for themselves.', effect: { statChanges: { status: 20, happiness: 5, willpower: 20 }, repChanges: { workplace: 20 }, outcomeText: 'You pull three brilliant reports in a week. Your boss notices. On announcement day, your name is called. Alex congratulates you with class.', logText: 'Won a competitive promotion through hard work and outstanding results.' } },
      { id: 'promo_network', text: 'Schmooze every stakeholder and play company politics.', effect: { statChanges: { status: 25, smarts: 10, happiness: -5 }, repChanges: { workplace: 10 }, outcomeText: 'You attend every optional meeting, remember everyone\'s birthday, and mention your achievements in every conversation. It works. You feel slightly hollow but get the job title.', logText: 'Won a promotion through strategic networking and office politics.' } },
      { id: 'promo_sabotage', text: 'Anonymously tip the boss off about a minor mistake Alex made.', effect: { statChanges: { karma: -30, status: 15 }, repChanges: { workplace: -15 }, outcomeText: 'Alex finds out it was you two months later through a mutual colleague. The damage to your relationship is irreversible. You got the job but lost your integrity and a friend.', logText: 'Sabotaged a colleague to secure a promotion. Lost their friendship.' } }
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
      { id: 'retire_speech', text: 'Give an emotional speech about your career journey.', effect: { statChanges: { happiness: 35, status: 20, willpower: 15 }, repChanges: { workplace: 25, family: 20 }, outcomeText: 'You speak for 15 minutes. Three people cry. Your boss says it was the best farewell speech in company history. You feel a profound sense of completion.', logText: 'Gave an emotional retirement speech that moved the entire office.' } },
      { id: 'retire_dance', text: 'Immediately put on music and start dancing.', effect: { statChanges: { happiness: 45, health: 5 }, outcomeText: 'You request "I Will Survive" and dance for an hour straight. Everyone joins in. You are the first person in company history to retire with a mosh pit.', logText: 'Started a retirement party mosh pit. Historic.' } },
      { id: 'retire_quiet', text: 'Quietly thank everyone and ask to just enjoy the cake and company.', effect: { statChanges: { happiness: 30, karma: 2 }, repChanges: { family: 15 }, outcomeText: 'No fanfare, just warmth. You spend three hours in genuine conversation with people who shaped your life. It\'s perfect.', logText: 'Had a quiet, deeply meaningful retirement party.' } }
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
      { id: 'health_change', text: 'Commit to a complete lifestyle overhaul starting today.', effect: { statChanges: { health: 20, happiness: 15, willpower: 25 }, outcomeText: 'You quit the junk food, start walking every morning, and actually go to sleep before midnight. Six months later, your next checkup shows dramatic improvement.', logText: 'Doctor\'s warning triggered a complete and successful lifestyle overhaul.' } },
      { id: 'health_ignore', text: 'Nod politely and immediately eat a cheeseburger.', effect: { statChanges: { health: -15, happiness: 10 }, outcomeText: 'The cheeseburger is magnificent. You tell yourself you will start next Monday. Next Monday comes and goes. The cycle continues.', logText: 'Responded to a health scare with a cheeseburger. Starting healthy habits "next Monday".' } },
      { id: 'health_research', text: 'Deep-dive into health research and consult a specialist.', effect: { statChanges: { smarts: 20, health: 15, willpower: 15 }, outcomeText: 'You become extremely knowledgeable about your condition and put together a solid personalized plan with a nutritionist. People start coming to you for health advice.', logText: 'Researched health scare extensively and developed a specialist-guided plan.' } }
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
      { id: 'scam_pay', text: 'Panic and wire them the $1,500 fine to avoid jail.', effect: { statChanges: { happiness: -40, smarts: -15 }, cashChange: -1500, outcomeText: 'You wire the money in a complete panic. Two hours later, you call the real tax agency to confirm... it was a scam. Your money is gone, and you feel incredibly foolish.', logText: 'Fell for a terrifying government tax scam call and lost $1,500.' } },
      { id: 'scam_yell', text: 'Yell at them and hang up the phone.', effect: { statChanges: { willpower: 10, karma: -5 }, outcomeText: 'You scream profanities into the phone and slam it down. Your heart is pounding. You check your actual tax portal just in case—you\'re clear. It was a scam.', logText: 'Yelled at a tax scammer over the phone and hung up.' } },
      { id: 'scam_ignore', text: 'Just block the number and go back to sleep.', effect: { statChanges: { happiness: 5 }, outcomeText: 'You block the number without a second thought. If the government wants you, they can send a letter. You take a fantastic nap.', logText: 'Ignored a government scam call and took a nap.' } }
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
];
