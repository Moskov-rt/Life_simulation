import React, { useState } from 'react';
import { Event, Choice } from '../types';

interface EventPopupModalProps {
  event: Event;
  onChoiceSelected: (choice: Choice) => void;
  onClose: () => void;
}

export const EventPopupModal: React.FC<EventPopupModalProps> = ({
  event,
  onChoiceSelected,
  onClose
}) => {
  // Hardcoded or dynamically formatted choices with trend symbols (NO numbers)
  const getChoiceTrends = (choiceId: string) => {
    if (choiceId === 'deny') return ['↓ Trust -varies', '↑ Suspicion +varies'];
    if (choiceId === 'change_subject') return ['↓ Trust -varies', '↑ Suspicion +varies'];
    if (choiceId === 'confess') return ['↑ Knowledge +varies', '↓ Exposure -varies'];
    return [];
  };

  const handleSelectChoice = (choice: Choice) => {
    onChoiceSelected(choice);
  };

  // Determine header color based on mock severity (e.g. orange header)
  const headerBg = 'bg-orange-600';

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up">
        
        {/* Header Indicator */}
        <div className={`${headerBg} p-3.5 text-center`}>
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-950 font-mono">
            👀 Event Triggered
          </span>
        </div>

        {/* Title */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 text-center">
          <h3 className="text-lg font-black uppercase tracking-wide text-white font-mono">
            {event.title}
          </h3>
        </div>

        {/* Body & NPC Stats */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <p className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/30 p-3.5 rounded border border-slate-850">
            "{event.text}"
          </p>

          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2.5 text-xs font-mono">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-1">NPC Profile: Mom</h4>
            <div className="flex items-center text-slate-400">
              <span className="w-20">Trust:</span>
              <div className="flex-1 ml-2 bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                <div className="bg-indigo-500 h-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div className="flex items-center text-slate-400">
              <span className="w-20">Suspicion:</span>
              <div className="flex-1 ml-2 bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                <div className="bg-rose-500 h-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800 my-2"></div>

          <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">What do you do?</h4>

          {/* Choices - Limit to max 3 */}
          <div className="flex flex-col gap-2">
            {event.choices.slice(0, 3).map((choice) => {
              const trends = getChoiceTrends(choice.id);
              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice)}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-left p-3.5 rounded-xl border border-slate-700 transition"
                >
                  <span className="block text-xs font-bold text-slate-100 uppercase tracking-wide mb-1 font-mono">
                    [{choice.text.replace(/\.$/, '')}]
                  </span>
                  {trends.length > 0 && (
                    <div className="flex gap-3 text-[10px] text-slate-400 font-mono">
                      {trends.map((t, idx) => (
                        <span key={idx}>{t}</span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
