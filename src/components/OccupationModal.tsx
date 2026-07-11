import React from 'react';
import { GameState } from '../types';

interface OccupationModalProps {
  gameState: GameState;
  onClose: () => void;
}

export const OccupationModal: React.FC<OccupationModalProps> = ({ gameState, onClose }) => {
  const { career, secretExposure } = gameState;
  
  // Calculate exposure colors based on Deliverable 2
  const getExposureStyle = (level: number) => {
    if (level === 100) return { bg: 'bg-purple-600', text: 'text-white', badge: 'bg-purple-600', pulse: 'animate-pulse' };
    if (level > 75) return { bg: 'bg-red-500', text: 'text-white', badge: 'bg-red-500', pulse: '' };
    if (level > 50) return { bg: 'bg-orange-500', text: 'text-white', badge: 'bg-orange-50', pulse: '' };
    if (level > 25) return { bg: 'bg-yellow-400', text: 'text-slate-900', badge: 'transparent', pulse: '' };
    return { bg: 'bg-green-500', text: 'text-white', badge: 'transparent', pulse: '' };
  };

  const expStyle = secretExposure ? getExposureStyle(secretExposure.level) : getExposureStyle(0);

  const getStatusLabel = (level: number) => {
    if (level === 100) return 'EXPOSED 🟣';
    if (level > 75) return 'BURNING 🔴';
    if (level > 50) return 'HOT 🟠';
    if (level > 25) return 'WARM 🟡';
    return 'SAFE 🟢';
  };

  const renderMeter = (level: number) => {
    const blocks = Math.floor(level / 10);
    const empty = 10 - blocks;
    return `[${'█'.repeat(blocks)}${'░'.repeat(empty)}]`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 text-slate-200 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <span>←</span> Back
          </button>
          <h2 className="font-black text-sm uppercase tracking-widest text-slate-300">Occupation</h2>
          <div className="w-12"></div> {/* Spacer for center alignment */}
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* Day Job */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 font-mono">Day Job</h3>
            <p className="font-bold text-lg text-white mb-1">🎓 {career.title === 'job' ? 'Employed' : career.title}</p>
            <p className="text-sm text-slate-400 font-semibold mb-3">${career.salary.toLocaleString()}/mo <span className="mx-2 text-slate-600">|</span> {career.yearsInRole} years</p>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-md transition border border-slate-700">Quit</button>
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-md transition border border-slate-700">Ask for Raise</button>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Side Hustle */}
          {secretExposure?.isActive && (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 font-mono">Side Hustle</h3>
              <p className="font-bold text-lg text-white mb-1">🍑 FanZone Creator</p>
              <p className="text-sm text-slate-400 font-semibold mb-3">$4,800/mo <span className="mx-2 text-slate-600">|</span> 8 months</p>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-md transition border border-slate-700">Manage</button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-md transition border border-slate-700">Stats</button>
              </div>
            </div>
          )}

          <hr className="border-slate-800" />

          {/* Secret Exposure */}
          {secretExposure?.isActive && (
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 shadow-inner relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${expStyle.bg}`}></div>
              
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-3 flex items-center gap-2">
                🔒 Secret Exposure
              </h3>

              <div className="font-mono text-sm mb-3">
                <span className={`${expStyle.text} font-bold`}>{renderMeter(secretExposure.level)}</span>
                <span className="ml-2 font-bold">{secretExposure.level === 100 ? 'EXPOSED' : `${secretExposure.level}%`}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Status</span>
                  <span className="font-bold">{getStatusLabel(secretExposure.level)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Risk Level</span>
                  <span className="font-bold text-slate-300">{secretExposure.level > 75 ? 'High' : secretExposure.level > 50 ? 'Medium' : 'Low'}</span>
                </div>
              </div>

              <div className="bg-slate-900 rounded p-3 text-xs mb-4 border border-slate-800">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2 font-mono">This Year:</h4>
                <ul className="space-y-1.5 text-slate-400 font-mono">
                  <li>• {secretExposure.recentChanges.posts} posts (+{secretExposure.recentChanges.posts * 2}%)</li>
                  <li>• {secretExposure.recentChanges.collabs} collabs (+{secretExposure.recentChanges.collabs * 4}%)</li>
                  <li>• Mitigation: -{secretExposure.recentChanges.mitigation}%</li>
                  <li>• Location: Big City ×{secretExposure.recentChanges.locationMultiplier}</li>
                  <li>• Luck: +{secretExposure.recentChanges.luck}%</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-slate-800 font-bold text-slate-300">
                  TOTAL GAIN: +22%
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2 font-mono">NPC Awareness:</h4>
                <ul className="space-y-2 text-xs">
                  {Object.entries(secretExposure.npcAwareness as any).map(([npc, data]: [string, any]) => (
                    <li key={npc} className="flex justify-between items-center">
                      <span className="text-slate-300">👤 {npc}:</span>
                      <span className="font-mono font-bold text-slate-400">{data.status.replace('_', ' ')} ({data.level}%)</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-md transition border border-slate-700">Precautions</button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-md transition border border-slate-700">History</button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
