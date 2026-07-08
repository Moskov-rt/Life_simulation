import os

# 1. Update types.ts
target_path_types = os.path.join("src", "types.ts")
with open(target_path_types, "r", encoding="utf-8") as f:
    content_types = f.read()

old_career_state = """export type CareerState = {
  title: string;
  salary: number;
  type: 'school' | 'career' | 'job' | 'unemployed';
  educationLevel?: string;
  major?: string;
  performance?: number;
  yearsInRole?: number;
  industry?: string;
  tier?: number;
};"""

new_career_state = """export type CareerState = {
  title: string;
  salary: number;
  type: 'school' | 'career' | 'job' | 'unemployed';
  educationLevel?: string;
  major?: string;
  performance?: number;
  yearsInRole?: number;
  industry?: string;
  tier?: number;
  workHarderCount?: number;
  hoursPerWeek?: number;
};"""

content_types = content_types.replace(old_career_state, new_career_state)
with open(target_path_types, "w", encoding="utf-8") as f:
    f.write(content_types)

# 2. Update App.tsx
target_path_app = os.path.join("src", "App.tsx")
with open(target_path_app, "r", encoding="utf-8") as f:
    content_app = f.read()

# Update ageUp for workHarderCount reset and hoursPerWeek effects
old_age_up_start = """    // 1. Natural stat fluctuations & career progression
    if (nextCareer.type === 'job' && nextCareer.performance !== undefined) {"""

new_age_up_start = """    // 1. Natural stat fluctuations & career progression
    if (nextCareer.type === 'job' && nextCareer.performance !== undefined) {
      nextCareer.workHarderCount = 0; // Reset annual work harder count
      
      // Handle weekly hours effects
      const hours = nextCareer.hoursPerWeek || 40;
      if (hours > 40) {
        const extra = hours - 40;
        nextCareer.performance = Math.min(100, nextCareer.performance + (extra * 1.5));
        nextStats.health = Math.max(0, nextStats.health - Math.floor(extra * 0.8));
        nextStats.happiness = Math.max(0, nextStats.happiness - Math.floor(extra * 1.2));
        newLogs.push(`⏱️ You worked ${hours} hours/week this year. The overtime boosted your performance but took a toll on your health and happiness.`);
      } else if (hours < 40) {
        const deficit = 40 - hours;
        nextCareer.performance = Math.max(0, nextCareer.performance - (deficit * 2));
        nextStats.happiness = Math.min(100, nextStats.happiness + Math.floor(deficit * 1));
        newLogs.push(`⏱️ You worked only ${hours} hours/week this year. Your performance tanked, but you had plenty of free time!`);
      }
"""
content_app = content_app.replace(old_age_up_start, new_age_up_start)

# Initialize hours to 40 on job start
content_app = content_app.replace("yearsInRole: 0,", "yearsInRole: 0,\n        workHarderCount: 0,\n        hoursPerWeek: 40,")

# Update Work Harder button and add Adjust Hours
old_work_harder = """                          {/* Work Harder */}
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
                          </button>"""

new_work_harder_and_hours = """                          {/* Adjust Hours */}
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
                              if (workHarderCount >= 3) {
                                triggerSound('error');
                                setActionPopup({ isOpen: true, title: 'Burnout Warning', message: 'You have already worked harder 3 times this year. Take a break before you collapse!' });
                                return;
                              }
                              
                              const nextStats = { ...gameState.stats };
                              nextStats.health = Math.max(0, nextStats.health - 2);
                              nextStats.happiness = Math.max(0, nextStats.happiness - 3);
                              nextStats.status = Math.min(100, nextStats.status + 1);
                              setGameState({
                                ...gameState,
                                stats: nextStats,
                                career: { 
                                  ...gameState.career, 
                                  performance: Math.min(100, (gameState.career.performance || 50) + 10),
                                  workHarderCount: workHarderCount + 1
                                },
                                log: [...gameState.log, `💪 You put in some extra effort at work today! (Performance +10%, Health -2%, Happiness -3%)`]
                              });
                            }}
                            className="w-full text-left py-4 px-4 border-b border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl group-hover:scale-110 transition-transform">💪</span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-[15px] text-[#0f4a8a]">Work Harder ({3 - (gameState.career.workHarderCount || 0)} left)</span>
                                <span className="text-[12px] text-[#4281a4]">Put in some extra effort</span>
                              </div>
                            </div>
                            <span className="text-[#2a6184]">›</span>
                          </button>"""

content_app = content_app.replace(old_work_harder, new_work_harder_and_hours)

with open(target_path_app, "w", encoding="utf-8") as f:
    f.write(content_app)

print("Patch 5 Success")
