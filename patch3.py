import os

target_path = os.path.join("src", "App.tsx")
with open(target_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Insert new interaction functions
new_functions = """
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
      setActionPopup({ isOpen: true, title: 'Too Soon', message: 'Your supervisor says you haven\\'t been in your current role long enough to be considered for a promotion.' });
      return;
    }
    
    if (perf < 75) {
      triggerSound('error');
      setActionPopup({ isOpen: true, title: 'Needs Improvement', message: 'Your supervisor points out that your performance hasn\\'t been exceptional lately. Work harder before asking again.' });
      return;
    }
    
    if (rel.trust < 50 || rel.resentment > 30) {
      triggerSound('error');
      setActionPopup({ isOpen: true, title: 'Denied', message: 'Your supervisor doesn\\'t like you enough to vouch for your promotion.' });
      return;
    }
    
    // Promotion success
    triggerSound('success');
    const newSalary = Math.floor(gameState.career.salary * 1.25);
    const newTitle = "Senior " + gameState.career.title.replace("Senior ", "").replace("Junior ", "");
    
    const nextRelationships = gameState.relationships.map(r => 
      r.id === rel.id ? { ...r, trust: Math.min(100, r.trust + 10) } : r
    );
    
    setGameState({
      ...gameState,
      relationships: nextRelationships,
      career: { ...gameState.career, title: newTitle, salary: newSalary, yearsInRole: 0 },
      log: [...gameState.log, `📈 You asked your supervisor for a promotion and got it! You are now a ${newTitle} making $${newSalary.toLocaleString()}/yr.`]
    });
    
    setActionPopup({ isOpen: true, title: 'Promoted!', message: `Congratulations! Your supervisor approved your promotion.\\n\\nNew Title: ${newTitle}\\nNew Salary: $${newSalary.toLocaleString()}/yr` });
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
      const nextRelationships = gameState.relationships.map(r => 
        r.id === rel.id ? { ...r, resentment: Math.min(100, r.resentment + 5) } : r
      );
      setGameState({ ...gameState, relationships: nextRelationships, log: [...gameState.log, `❌ Your request for a raise was denied.`] });
      return;
    }
    
    triggerSound('success');
    const newSalary = Math.floor(gameState.career.salary * 1.08); // 8% raise
    
    const nextRelationships = gameState.relationships.map(r => 
      r.id === rel.id ? { ...r, trust: Math.min(100, r.trust + 5) } : r
    );
    
    setGameState({
      ...gameState,
      relationships: nextRelationships,
      career: { ...gameState.career, salary: newSalary },
      log: [...gameState.log, `💰 You negotiated a raise! Your new salary is $${newSalary.toLocaleString()}/yr.`]
    });
    
    setActionPopup({ isOpen: true, title: 'Raise Approved', message: `Your supervisor agreed to give you a raise!\\n\\nNew Salary: $${newSalary.toLocaleString()}/yr` });
    setSelectedRelationship(null);
  };
"""

# Insert the functions before "const interactClassmateFlirt"
content = content.replace("  const interactClassmateFlirt = (rel: Relationship) => {", new_functions + "\n  const interactClassmateFlirt = (rel: Relationship) => {")

# 2. Insert the buttons into the relationship menu view
supervisor_buttons = """
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
"""

# Insert buttons before "{/* Teacher Specific Actions */}"
content = content.replace("                          {/* Teacher Specific Actions */}", supervisor_buttons + "\n                          {/* Teacher Specific Actions */}")

with open(target_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Patch 3 Success")
