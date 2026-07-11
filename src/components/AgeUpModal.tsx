import React, { useState } from 'react';
import { GameState, Stats, Event } from '../types';

interface AgeUpModalProps {
  gameState: GameState;
  prevStats: Stats;
  nextStats: Stats;
  earnedCash: number;
  prevExposure: number;
  nextExposure: number;
  triggeredEvent: Event | null;
  onSeeChoices: () => void;
  onClose: () => void;
}

export const AgeUpModal: React.FC<AgeUpModalProps> = ({
  gameState,
  prevStats,
  nextStats,
  earnedCash,
  prevExposure,
  nextExposure,
  triggeredEvent,
  onSeeChoices,
  onClose
}) => {
  const [isExposureExpanded, setIsExposureExpanded] = useState(false);
  const expChange = nextExposure - prevExposure;

  const renderMeter = (level: number) => {
    const blocks = Math.floor(level / 10);
    const empty = 10 - blocks;
    return `[${'█'.repeat(blocks)}${'░'.repeat(empty)}]`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-40 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-black uppercase tracking-widest text-indigo-400 font-mono">
            📅 Year {gameState.age} Complete
          </h2>
          <div className="h-0.5 bg-slate-800 w-full mt-3"></div>
        </div>

        {/* Stats Summary */}
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center text-emerald-400 font-bold">
            <span>💰 Total Income:</span>
            <span>+${earnedCash.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>😊 Happiness:</span>
            <span>{prevStats.happiness}% → {nextStats.happiness}%</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>❤️ Health:</span>
            <span>{prevStats.health}% → {nextStats.health}%</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>🧠 Smarts:</span>
            <span>{prevStats.smarts}% → {nextStats.smarts}%</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>🔥 Looks:</span>
            <span>{prevStats.looks}% → {nextStats.looks}%</span>
          </div>
        </div>

        <div className="h-0.5 bg-slate-800 w-full"></div>

        {/* Secret Exposure Summary */}
        {gameState.secretExposure?.isActive && (
          <div className="bg-slate-950/65 rounded-xl border border-slate-800 p-4 space-y-3">
            <button 
              onClick={() => setIsExposureExpanded(!isExposureExpanded)}
              className="w-full flex justify-between items-center font-bold text-xs uppercase tracking-widest text-slate-400 font-mono"
            >
              <span>🔒 Secret Exposure</span>
              <span className="text-[10px] text-slate-600">{isExposureExpanded ? '▲ COLLAPSE' : '▼ EXPAND'}</span>
            </button>

            <div className="font-mono text-sm">
              <span className="text-rose-500 font-bold">{renderMeter(nextExposure)}</span>
              <span className="ml-2 font-bold">{nextExposure}%</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Previous: {prevExposure}%</span>
              <span>
                Change:{' '}
                {expChange === 0 ? (
                  <span className="text-slate-500">No change</span>
                ) : expChange > 0 ? (
                  <span className="text-rose-500 font-bold">+{expChange}%</span>
                ) : (
                  <span className="text-emerald-400 font-bold">↓ {expChange}%</span>
                )}
              </span>
            </div>

            {/* Collapsible Breakdown */}
            {isExposureExpanded && expChange !== 0 && (
              <div className="bg-slate-900/60 rounded p-3 text-[11px] font-mono text-slate-400 space-y-1.5 border border-slate-850 mt-2">
                <div className="uppercase font-bold text-slate-500 mb-1">Breakdown:</div>
                <div>• 20 face posts: +40%</div>
                <div>• 2 collabs: +8%</div>
                <div>• Mitigation (blur+stage): -85%</div>
                <div>• Location (Big City): ×0.8</div>
                <div>• Luck roll: +3%</div>
                <div className="pt-1.5 border-t border-slate-800 font-bold text-slate-300">
                  NET GAIN: {expChange > 0 ? `+${expChange}%` : `${expChange}%`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Event Triggered Banner */}
        {triggeredEvent && (
          <div className="bg-orange-950/20 border border-orange-850/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-orange-400 font-bold text-xs uppercase tracking-widest font-mono">
              <span>⚠️ Event Triggered:</span>
            </div>
            <h4 className="font-black text-sm text-white font-mono">
              "{triggeredEvent.title}"
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-950/45 p-2 rounded">
              "{triggeredEvent.text}"
            </p>
            {triggeredEvent.id.includes('sickness') ? (
              <div className="text-[10px] text-slate-500 font-mono">
                Willpower / Doctor actions required.
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                <div>Mom Trust: 72% → 55%</div>
                <div>Mom Knowledge: 20% → 50%</div>
              </div>
            )}
          </div>
        )}

        <div className="h-0.5 bg-slate-800 w-full"></div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {triggeredEvent ? (
            <button 
              onClick={onSeeChoices}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition text-center text-sm uppercase tracking-wider font-mono"
            >
              See Choices
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition text-center text-sm uppercase tracking-wider font-mono"
            >
              Continue
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
