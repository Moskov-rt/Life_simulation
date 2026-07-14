const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const actorJobs =   // --- ACTOR JOBS ---
  { title: 'Extra', salary: 15000, minAge: 18, req: 'Looks >= 50', industry: 'entertainment', tier: 1, minLooks: 50 },
  { title: 'Supporting Actor', salary: 60000, minAge: 18, req: 'Looks >= 60, Smarts >= 40', industry: 'entertainment', tier: 2, minLooks: 60, minSmarts: 40 },
  { title: 'Lead Actor', salary: 150000, minAge: 18, req: 'Looks >= 70, Smarts >= 50', industry: 'entertainment', tier: 3, minLooks: 70, minSmarts: 50 },
  { title: 'Star', salary: 500000, minAge: 18, req: 'Looks >= 80, Smarts >= 60', industry: 'entertainment', tier: 4, minLooks: 80, minSmarts: 60 },
  { title: 'Legend', salary: 2000000, minAge: 18, req: 'Looks >= 90, Smarts >= 70', industry: 'entertainment', tier: 5, minLooks: 90, minSmarts: 70 },
;

code = code.replace(
  /{ title: 'Adult Studio Director'[^}]*\}[\r\n]+\];/,
  match => match.replace('];', actorJobs + '];')
);

// We need to inject evaluateActorTier and change isAdultPerformerCareer
// First let's find evaluateAdultPerformerTier

const adultTierLogic = const ADULT_PERFORMER_TITLES = ['Adult Film Extra', 'Adult Performer', 'Established Performer', 'Adult Film Star', 'Studio Director', 'Adult Studio Director'];
const emptyAdultActions = (): AdultPerformerYearlyActions => ({ performCount: 0, collaborationCount: 0, promotionCount: 0, networkingCount: 0, skillCount: 0, privacyCount: 0, restCount: 0 });
const isAdultPerformerCareer = (career: GameState['career']) => ADULT_PERFORMER_TITLES.includes(career?.title || '');

const ACTOR_TITLES = ['Extra', 'Supporting Actor', 'Lead Actor', 'Star', 'Legend'];
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
}

function evaluateAdultPerformerTier;

code = code.replace(
  /const ADULT_PERFORMER_TITLES[\s\S]*?function evaluateAdultPerformerTier/,
  adultTierLogic
);


// Replace handlers
const actorHandlerLogic = const handleActorAction = (action: keyof ActorYearlyActions) => {
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

  const handleAdultPerformerAction;

code = code.replace(/const handleAdultPerformerAction/g, match => actorHandlerLogic);

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
                            {gameState.adultPerformerCareer?.active && (

let replacedUI = false;
code = code.replace(/\{gameState\.adultPerformerCareer\?\.active && \(/g, (match, offset) => {
  if (offset > 4000 && !replacedUI) {
    replacedUI = true;
    return actorUI;
  }
  return match;
});

fs.writeFileSync('src/App.tsx', code);
