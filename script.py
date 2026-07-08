import os

target_path = os.path.join("src", "App.tsx")
with open(target_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the type definitions
old_types = """type JobInterviewOption = {
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
  question: string;
  options: JobInterviewOption[];
};"""

new_types = """type JobInterviewOption = {
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
};"""
content = content.replace(old_types, new_types)

# Replace the JOB_INTERVIEWS array
# I will find where it starts and ends
start_idx = content.find("const JOB_INTERVIEWS: JobInterview[] = [")
end_idx = content.find("const ASSETS_LIST = [")

if start_idx != -1 and end_idx != -1:
    new_jobs = """const JOB_INTERVIEWS: JobInterview[] = [
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
  { title: 'Adult Film Star', salary: 180000, minAge: 18, req: 'Happiness >= 50', industry: 'entertainment', tier: 1 }
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
    }
  ]
};

"""
    content = content[:start_idx] + new_jobs + content[end_idx:]

content = content.replace(
    "const [jobInterview, setJobInterview] = useState<typeof JOB_INTERVIEWS[0] | null>(null);",
    "const [jobInterview, setJobInterview] = useState<{job: typeof JOB_INTERVIEWS[0], questionData: {question: string, options: JobInterviewOption[]}} | null>(null);"
)

old_trigger = """  const triggerInterview = (job: typeof JOB_INTERVIEWS[0]) => {
    if (!gameState) return;
    triggerSound('click');
    
    // Check prerequisites
    if (job.reqLevel || job.reqMajor) {
      const history = gameState.completedEducation || [];
      
      const meetsLevel = job.reqLevel ? history.some(ed => ed.level === job.reqLevel) : true;
      const meetsMajor = job.reqMajor ? history.some(ed => job.reqMajor?.includes(ed.major)) : true;
      
      if (!meetsLevel || !meetsMajor) {
        triggerSound('error');
        setActionPopup({
          isOpen: true,
          title: 'Not Qualified',
          message: `You don't have the required education for this job. You need a degree from ${job.reqLevel ? job.reqLevel.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase()) : 'University'} ${job.reqMajor ? 'in ' + job.reqMajor.join(' or ') : ''}.`
        });
        return;
      }
    }
    
    setJobInterview(job);
  };"""

new_trigger = """  const triggerInterview = (job: typeof JOB_INTERVIEWS[0]) => {
    if (!gameState) return;
    triggerSound('click');
    
    if (job.reqLevel || job.reqMajor) {
      const history = gameState.completedEducation || [];
      const meetsLevel = job.reqLevel ? history.some(ed => ed.level === job.reqLevel) : true;
      const meetsMajor = job.reqMajor ? history.some(ed => job.reqMajor?.includes(ed.major)) : true;
      
      if (!meetsLevel || !meetsMajor) {
        triggerSound('error');
        setActionPopup({
          isOpen: true,
          title: 'Not Qualified',
          message: `You don't have the required education for this job. You need a degree from ${job.reqLevel ? job.reqLevel.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase()) : 'University'} ${job.reqMajor ? 'in ' + job.reqMajor.join(' or ') : ''}.`
        });
        return;
      }
    }
    
    const categoryQuestions = INTERVIEW_QUESTIONS[job.industry] || INTERVIEW_QUESTIONS['retail'];
    const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    
    setJobInterview({ job, questionData: randomQuestion });
  };"""

content = content.replace(old_trigger, new_trigger)

old_resolve = """  const resolveInterview = (option: typeof JOB_INTERVIEWS[0]['options'][0]) => {
    if (!gameState || !jobInterview) return;
    
    let nextStats = { ...gameState.stats };
    let nextLog = [...gameState.log];
    let nextCareer = { ...gameState.career };

    if (option.correct) {
      triggerSound('success');
      nextCareer = {
        title: jobInterview.title,
        salary: jobInterview.salary,
        type: 'career'
      };
      
      // Apply interview stat gains
      Object.entries(option.statChanges).forEach(([stat, val]) => {
        const k = stat as keyof Stats;
        nextStats[k] = Math.min(100, nextStats[k] + val);
      });

      nextLog.push(`🎉 Interview Passed: ${option.feedback}`);
      nextLog.push(`💼 Started a new career as a ${jobInterview.title} earning $${jobInterview.salary.toLocaleString()}/year!`);
    } else {
      triggerSound('error');
      nextLog.push(`❌ Interview Failed: ${option.feedback}`);
    }

    setGameState({
      ...gameState,
      stats: nextStats,
      career: nextCareer,
      log: nextLog
    });

    setJobInterview(null);
    setSelectedActivity(null);
  };"""

new_resolve = """  const resolveInterview = (option: typeof JOB_INTERVIEWS[0]['options'][0]) => {
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
      
      nextCareer = {
        type: 'job',
        title: theJob.title,
        salary: theJob.salary,
        performance: 50,
        yearsInRole: 0,
        industry: theJob.industry,
        tier: theJob.tier
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
      
      const filteredRels = gameState.relationships.filter(r => r.relation !== 'colleague' && r.relation !== 'supervisor');
      const nextRelationships = [...filteredRels, ...newColleagues];
      
      setGameState({
        ...gameState,
        stats: nextStats,
        log: nextLog,
        career: nextCareer as any,
        relationships: nextRelationships as any
      });
      
      setActionPopup({
        isOpen: true,
        title: 'When can you start?',
        message: `Welcome to the team!\\n\\nTitle: ${theJob.title}\\nCareer: ${theJob.industry.toUpperCase()}\\nSalary: $${theJob.salary.toLocaleString()}/yr`
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
        message: `You did not get the job. \\n\\nFeedback: ${option.feedback}`
      });
    }
    
    setJobInterview(null);
    setSelectedActivity(null);
  };"""

content = content.replace(old_resolve, new_resolve)

# Update JSX references
content = content.replace("jobInterview.salary", "jobInterview.job.salary")
content = content.replace("jobInterview.title", "jobInterview.job.title")
content = content.replace("jobInterview.question", "jobInterview.questionData.question")
content = content.replace("jobInterview.options.map", "jobInterview.questionData.options.map")

with open(target_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Success")
