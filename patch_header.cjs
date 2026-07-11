const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetRegex = /\{\/\* Player stats hero widget - Clickable to open Profile & Detailed Stats \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* INTERACTIVE EVENT OVERLAYS \(HIGHEST PRIORITY POPUPS\) \*\/\}/;

const replacementStr = `{/* Player stats hero widget - Clickable to open Profile & Detailed Stats */}
          <div className="flex flex-col items-center text-center py-2 relative">
            <div 
              onClick={() => { triggerSound('click'); setShowProfileModal(true); }}
              className="w-16 h-16 bg-slate-900 border-2 border-indigo-500/60 rounded-full flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-950/40 mb-3 animate-fade-in relative cursor-pointer hover:border-indigo-400 hover:shadow-indigo-500/20 transition-all"
              title="Click to view detailed profile and reputation stats"
            >
              <CharacterAvatar config={gameState.avatarConfig} gender={gameState.gender as 'Male' | 'Female'} age={gameState.age} />
            </div>
            
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 justify-center cursor-pointer" onClick={() => { triggerSound('click'); setShowProfileModal(true); }}>
              {gameState.name} <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded-full font-mono border border-indigo-900/40 select-none ml-1">Profile 👤</span>
            </h2>

            {/* JOB LINE */}
            <p className="text-sm text-slate-400 font-medium mt-1">
              🎓 {gameState.career.title === 'job' ? 'Employed' : gameState.career.title} 
              {gameState.secretExposure?.isActive && <span className="mx-2 text-slate-600">|</span>} 
              {gameState.secretExposure?.isActive && '🍑 FanZone Creator'}
            </p>

            {/* SECRET EXPOSURE BADGE */}
            {gameState.secretExposure?.isActive && (() => {
              const exp = gameState.secretExposure;
              
              let badgeColor = 'bg-transparent';
              let fill = 'bg-green-500';
              let text = 'text-green-500';
              let pulse = '';
              let statusText = \`\${exp.level}%\`;
              let dot = '🟢';

              if (exp.level === 100) { badgeColor = 'bg-purple-600'; fill = 'bg-purple-600'; text = 'text-white'; pulse = 'animate-pulse'; statusText = 'EXPOSED'; dot = '🟣'; }
              else if (exp.level > 75) { badgeColor = 'bg-red-500'; fill = 'bg-red-500'; text = 'text-white'; dot = '🔴'; }
              else if (exp.level > 50) { badgeColor = 'bg-orange-900/50'; fill = 'bg-orange-500'; text = 'text-orange-400'; dot = '🟠'; }
              else if (exp.level > 25) { fill = 'bg-yellow-400'; text = 'text-yellow-400'; dot = '🟡'; }

              const blocks = Math.floor(exp.level / 10);
              const empty = 10 - blocks;
              const bar = \`[\${'█'.repeat(blocks)}\${'░'.repeat(empty)}]\`;

              const highestAwareness = Object.entries(exp.npcAwareness).find(([_, data]) => data.level > 30);

              return (
                <div className="flex flex-col items-center gap-1 mt-2 mb-1">
                  <div 
                    onClick={() => { triggerSound('click'); setShowOccupationModal(true); }}
                    className={\`flex items-center gap-2 h-6 px-2 rounded cursor-pointer transition \${badgeColor} \${pulse}\`}
                  >
                    <span className="text-xs">🕵️</span>
                    <span className={\`text-xs font-mono font-semibold \${text}\`}>{statusText}</span>
                    <span className={\`text-xs font-mono tracking-tighter opacity-80 \${text}\`}>{bar}</span>
                    <span className="text-xs">{dot}</span>
                  </div>
                  {highestAwareness && (
                    <p className="text-[10px] font-bold text-amber-400 animate-pulse">
                      ⚠️ {highestAwareness[0]} {highestAwareness[1].status.replace('_', ' ')}
                    </p>
                  )}
                </div>
              );
            })()}

            {/* AGE AND MONEY LINE */}
            <p className="text-sm text-indigo-200 mt-2 font-semibold tracking-wide flex items-center gap-2">
              <span className="text-indigo-300">Age {gameState.age}</span>
              <span className="text-slate-700">|</span>
              <span className="text-emerald-400 font-bold">\${gameState.career.salary > 0 ? Math.floor(gameState.career.salary / 12).toLocaleString() : 0}/mo</span>
              {gameState.secretExposure?.isActive && (
                <>
                  <span className="text-slate-700">|</span>
                  <span className="text-emerald-400 font-bold">+$4,800/mo</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* INTERACTIVE EVENT OVERLAYS (HIGHEST PRIORITY POPUPS) */}`;

if (targetRegex.test(code)) {
  code = code.replace(targetRegex, replacementStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx header successfully patched');
} else {
  console.log('Regex match failed');
}
