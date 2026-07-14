const fs = require('fs');
let p = 'src/App.tsx';
let code = fs.readFileSync(p, 'utf8');

const actorJobs =   // --- ACTOR JOBS ---
  { title: 'Extra', salary: 15000, minAge: 18, req: 'Looks >= 50', industry: 'entertainment', tier: 1, minLooks: 50 },
  { title: 'Supporting Actor', salary: 60000, minAge: 18, req: 'Looks >= 60, Smarts >= 40', industry: 'entertainment', tier: 2, minLooks: 60, minSmarts: 40 },
  { title: 'Lead Actor', salary: 150000, minAge: 18, req: 'Looks >= 70, Smarts >= 50', industry: 'entertainment', tier: 3, minLooks: 70, minSmarts: 50 },
  { title: 'Star', salary: 500000, minAge: 18, req: 'Looks >= 80, Smarts >= 60', industry: 'entertainment', tier: 4, minLooks: 80, minSmarts: 60 },
  { title: 'Legend', salary: 2000000, minAge: 18, req: 'Looks >= 90, Smarts >= 70', industry: 'entertainment', tier: 5, minLooks: 90, minSmarts: 70 },;

code = code.replace(
  "  { title: 'Adult Studio Director', salary: 220000, minAge: 25, req: 'Smarts >= 75', industry: 'entertainment', tier: 3, minSmarts: 75 }\n];",
  "  { title: 'Adult Studio Director', salary: 220000, minAge: 25, req: 'Smarts >= 75', industry: 'entertainment', tier: 3, minSmarts: 75 },\n" + actorJobs + "\n];"
);
code = code.replace(
  "  { title: 'Adult Studio Director', salary: 220000, minAge: 25, req: 'Smarts >= 75', industry: 'entertainment', tier: 3, minSmarts: 75 }\r\n];",
  "  { title: 'Adult Studio Director', salary: 220000, minAge: 25, req: 'Smarts >= 75', industry: 'entertainment', tier: 3, minSmarts: 75 },\r\n" + actorJobs + "\r\n];"
);

const isAdultFunc = "const isAdultPerformerCareer = (career: GameState['career']) => (career as any).industry === 'entertainment' || ADULT_PERFORMER_TITLES.includes(career.title);";
const fixedAdultFunc = "const isAdultPerformerCareer = (career: GameState['career']) => ADULT_PERFORMER_TITLES.includes(career?.title || '');";
code = code.replace(isAdultFunc, fixedAdultFunc);

const actorLogic = const ACTOR_TITLES = ['Extra', 'Supporting Actor', 'Lead Actor', 'Star', 'Legend'];
const emptyActorActions = (): ActorYearlyActions => ({ auditionCount: 0, rolesAccepted: 0, networkCount: 0, promoteCount: 0, trainCount: 0, restCount: 0 });
const isActorCareer = (career: GameState['career']) => ACTOR_TITLES.includes(career?.title || '');

function evaluateActorTier(career: GameState['career'], state: GameState): number | undefined {
  if (!isActorCareer(career)) return undefined;
  const profile = state.actorCareer;
  const consistency = profile?.consistency || 0;
  const fame = state.reputation.fame || 0;
  const performance = career.performance || 0;
  
  const score = fame + performance + consistency;
  
  if (score >= 300 && fame >= 80 && performance >= 80) return 5;
  if (score >= 230 && fame >= 60 && performance >= 70) return 4;
  if (score >= 165 && fame >= 40 && performance >= 60) return 3;
  if (score >= 100 && performance >= 50) return 2;
  return 1;
};

code = code.replace(
  "function evaluateAdultPerformerTier(career: GameState['career'], state: GameState): number | undefined {",
  actorLogic + "\n\nfunction evaluateAdultPerformerTier(career: GameState['career'], state: GameState): number | undefined {"
);

const adultHandler = "  const handleAdultPerformerAction = (action: keyof AdultPerformerYearlyActions) => {";
const actorHandler =   const handleActorAction = (action: keyof ActorYearlyActions) => {
    if (!gameState?.actorCareer?.active) return;
    triggerSound('click');
    const profile = gameState.actorCareer;
    setGameState({
      ...gameState,
      actorCareer: {
        ...profile,
        actions: { ...profile.actions, [action]: (profile.actions[action] || 0) + 1 }
      }
    });
  };

  const handleAdultPerformerAction = (action: keyof AdultPerformerYearlyActions) => {;
code = code.replace(adultHandler, actorHandler);

const adultUI = "{gameState.adultPerformerCareer?.active && (";
const actorUI = {gameState.actorCareer?.active && (
                              <div className="p-4 border-b border-slate-200 space-y-3">
                                <div>
                                  <span className="font-extrabold text-[15px] text-[#0f4a8a]">Actor Career</span>
                                  <span className="text-[12px] text-[#4281a4] block">Tier {gameState.career?.tier || 1} — actions resolve at year-end</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {([
                                    ['auditionCount', 'Audition'], ['rolesAccepted', 'Accept Roles'],
                                    ['networkCount', 'Network'], ['promoteCount', 'Promote Work'],
                                    ['trainCount', 'Train Acting'], ['restCount', 'Rest']
                                  ] as [keyof ActorYearlyActions, string][]).map(([action, label]) => (
                                    <button key={action} onClick={() => handleActorAction(action)} className="py-2 text-[11px] font-bold bg-slate-50 text-[#0f4a8a] border border-slate-200 rounded">{label} ({gameState.actorCareer?.actions?.[action] || 0})</button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {gameState.adultPerformerCareer?.active && (;
// Only replace the FIRST occurrence of the UI block! Wait, there might be multiple?
// No, the UI block is rendered under occupationSubView === 'current_job'
code = code.replace(
  /\{gameState\.adultPerformerCareer\?\.active && \(/g,
  function(match, offset, string) {
    if (offset > 4000) return actorUI; // Ensure we only hit the one in the JSX
    return match;
  }
);

fs.writeFileSync(p, code);
console.log('Patched App.tsx');
