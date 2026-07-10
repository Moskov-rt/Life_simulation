import os

target_path = os.path.join("src", "App.tsx")
with open(target_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace banner
old_banner = """                    {/* Current Status Banner (only on main view) */}
                    {occupationSubView === 'main' && (
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
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
                        {gameState.career.type === 'school' && gameState.career.title !== 'Primary School Student' && gameState.career.title !== 'High School Student' && gameState.career.title !== 'Infant' && (
                          <button onClick={handleDropOut} className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold rounded shadow-sm border border-rose-200 transition uppercase tracking-wider">Drop Out</button>
                        )}
                        {gameState.career.type === 'job' && (
                          <button onClick={handleResign} className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold rounded shadow-sm border border-rose-200 transition uppercase tracking-wider">Quit Job</button>
                        )}
                      </div>
                    )}"""

new_banner = """                    {/* Current Status Banner (only on main view) */}
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
                            <button onClick={(e) => { e.stopPropagation(); handleDropOut(); }} className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold rounded shadow-sm border border-rose-200 transition uppercase tracking-wider">Drop Out</button>
                          )}
                          {gameState.career.type === 'job' && (
                            <span className="text-[#1a6fb5]">›</span>
                          )}
                        </div>
                      </div>
                    )}"""

content = content.replace(old_banner, new_banner)

# 2. Add current_job view
current_job_view = """
                      {occupationSubView === 'current_job' && gameState.career.type === 'job' && (
                        <div className="flex flex-col">
                          {/* Performance Indicator */}
                          <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-[14px] text-[#0f4a8a] flex items-center gap-2">
                                📊 Performance
                              </span>
                              <span className="text-xs font-bold text-slate-500">{gameState.career.performance}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${gameState.career.performance > 75 ? 'bg-emerald-500' : gameState.career.performance > 40 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                style={{ width: `${gameState.career.performance}%` }}
                              ></div>
                            </div>
                          </div>
                          
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
                          
                          {/* Work Harder */}
                          <button 
                            onClick={() => { 
                              triggerSound('click');
                              const nextStats = { ...gameState.stats };
                              nextStats.health = Math.max(0, nextStats.health - 2);
                              nextStats.happiness = Math.max(0, nextStats.happiness - 3);
                              nextStats.status = Math.min(100, nextStats.status + 1);
                              setGameState({
                                ...gameState,
                                stats: nextStats,
                                career: { ...gameState.career, performance: Math.min(100, gameState.career.performance + 10) },
                                log: [...gameState.log, `💪 You put in some extra effort at work today! (Performance +10%, Health -2%, Happiness -3%)`]
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
"""

content = content.replace("                      {occupationSubView === 'jobs' && (", current_job_view + "                      {occupationSubView === 'jobs' && (")

with open(target_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Patch 2 Success")
