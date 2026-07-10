import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Compass, Briefcase, Sparkles, Globe, ChevronDown, ChevronUp, Zap, HelpCircle } from 'lucide-react';
import { GameState } from '../types';

export interface MapCity {
  name: string;
  fullName: string;
  x: number; // SVG X% coord
  y: number; // SVG Y% coord
  emoji: string;
  bonusDesc: string;
  localActionName: string;
  localActionDesc: string;
  localActionCost: number;
}

export const MAP_CITIES: MapCity[] = [
  {
    name: 'Compton',
    fullName: 'Compton, United States',
    x: 20,
    y: 42,
    emoji: '🇺🇸',
    bonusDesc: 'Entertainment Hub: +15% Status & Fame gains, +15% creative career salary.',
    localActionName: '🎤 Street Rap Battle',
    localActionDesc: 'Showcase your lyricism in a heated street cypher. Boosts Status (+5) and Willpower (+3).',
    localActionCost: 0
  },
  {
    name: 'London',
    fullName: 'London, United Kingdom',
    x: 48,
    y: 28,
    emoji: '🇬🇧',
    bonusDesc: 'Finance Capital: +15% salary in corporate/finance jobs.',
    localActionName: '🎭 West End Theatre Gala',
    localActionDesc: 'Immerse yourself in theatrical arts and high society. Boosts Style (+5) and Looks (+3).',
    localActionCost: 80
  },
  {
    name: 'Munich',
    fullName: 'Munich, Germany',
    x: 54,
    y: 30,
    emoji: '🇩🇪',
    bonusDesc: 'Engineering Core: +3 status gain bonus during Work Hard and +10% tech smarts.',
    localActionName: '🍺 Bavarian Beer Hall Gathering',
    localActionDesc: 'Unwind with massive pretzels and draft beers. Boosts Happiness (+6) and Health (-3).',
    localActionCost: 20
  },
  {
    name: 'Tokyo',
    fullName: 'Tokyo, Japan',
    x: 82,
    y: 38,
    emoji: '🇯🇵',
    bonusDesc: 'Tech Sanctuary: +15% Smarts self-improvement (studying) gains.',
    localActionName: '🧘 Zen Temple Meditation',
    localActionDesc: 'Find inner focus among gravel gardens and paper lanterns. Boosts Willpower (+5) and Happiness (+3).',
    localActionCost: 0
  },
  {
    name: 'Mumbai',
    fullName: 'Mumbai, India',
    x: 70,
    y: 52,
    emoji: '🇮🇳',
    bonusDesc: 'Spiritual Sanctuary: +15% starting Karma and moral event saves.',
    localActionName: '🍛 Spice Bazaar Street Food Tour',
    localActionDesc: 'Explore rich traditional recipes. Highly delicious but can upset stomachs! (70% chance of +10 Happiness, 30% chance of -8 Health).',
    localActionCost: 10
  },
  {
    name: 'Sydney',
    fullName: 'Sydney, Australia',
    x: 88,
    y: 78,
    emoji: '🇦🇺',
    bonusDesc: 'Sunlit Haven: +15% gym health/happiness gains.',
    localActionName: '🏄 Bondi Beach Surfing Session',
    localActionDesc: 'Ride the massive Pacific swells and enjoy the ocean air. Boosts Health (+5) and Happiness (+4).',
    localActionCost: 0
  }
];

interface WorldTravelMapProps {
  gameState: GameState;
  onTravel: (city: MapCity) => void;
  onLocalAction: (city: MapCity) => void;
  triggerSound: (soundType: 'click' | 'success' | 'error') => void;
}

export const WorldTravelMap: React.FC<WorldTravelMapProps> = ({
  gameState,
  onTravel,
  onLocalAction,
  triggerSound
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCity, setSelectedCity] = useState<MapCity | null>(null);

  // Auto-select current city on mount or location change
  const currentCityInfo = MAP_CITIES.find(c => c.fullName === gameState.location) || MAP_CITIES[0];

  useEffect(() => {
    if (!selectedCity || !MAP_CITIES.some(c => c.fullName === selectedCity.fullName)) {
      setSelectedCity(currentCityInfo);
    }
  }, [gameState.location]);

  const activeCity = selectedCity || currentCityInfo;
  const isCurrentActive = activeCity.fullName === gameState.location;
  const isUnderage = gameState.age < 18;
  const travelCost = isUnderage ? 0 : 350;
  const canAffordTravel = gameState.cash >= travelCost;
  const hasMetExchangeRequirement = gameState.stats.smarts >= 65 && gameState.stats.happiness >= 60;

  // Render curved flight paths in SVG format
  const renderFlightPath = (fromCity: MapCity, toCity: MapCity) => {
    if (fromCity.fullName === toCity.fullName) return null;

    // Calculate control point for a nice arched curve
    const x1 = fromCity.x;
    const y1 = fromCity.y;
    const x2 = toCity.x;
    const y2 = toCity.y;

    // Control point moves up relative to distance
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Arch height
    const k = 0.25; 
    const cx = (x1 + x2) / 2 - dy * k;
    const cy = (y1 + y2) / 2 + dx * k - length * 0.15;

    return (
      <g key={`path-${fromCity.name}-${toCity.name}`}>
        {/* Shadow glow path */}
        <path
          d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${toCity.y}`}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.15"
        />
        {/* Animated dashes path */}
        <motion.path
          d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${toCity.y}`}
          fill="none"
          stroke="url(#gradient-flight)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -20 }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 1.5 }}
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>
    );
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 mb-4 select-none">
      {/* Header segment with expand toggle */}
      <div 
        onClick={() => {
          triggerSound('click');
          setIsOpen(!isOpen);
        }}
        className="flex justify-between items-center cursor-pointer select-none pb-1"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm flex items-center justify-center">
            <Globe size={16} className="animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Global Travel Network
            </h3>
            <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">
              Current Base: <span className="text-indigo-600">{gameState.location}</span>
            </p>
          </div>
        </div>

        <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-3"
          >
            {/* STYLIZED COORDINATE WORLD MAP */}
            <div className="relative w-full h-44 sm:h-52 md:h-56 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
              
              {/* Retro tactical grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              {/* Cyber radar circles representing world regions */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-flight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>

                {/* Simulated Continents / Tactical Spheres */}
                {/* Americas Zone */}
                <circle cx="20" cy="45" r="16" fill="#1e293b" opacity="0.3" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="20" cy="45" r="8" fill="#334155" opacity="0.15" />
                
                {/* Europe Zone */}
                <circle cx="51" cy="29" r="12" fill="#1e293b" opacity="0.3" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="51" cy="29" r="6" fill="#334155" opacity="0.15" />

                {/* India Zone */}
                <circle cx="70" cy="52" r="10" fill="#1e293b" opacity="0.3" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="70" cy="52" r="5" fill="#334155" opacity="0.15" />

                {/* Japan Zone */}
                <circle cx="82" cy="38" r="10" fill="#1e293b" opacity="0.3" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="82" cy="38" r="4" fill="#334155" opacity="0.15" />

                {/* Australia Zone */}
                <circle cx="88" cy="78" r="11" fill="#1e293b" opacity="0.3" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="88" cy="78" r="5" fill="#334155" opacity="0.15" />

                {/* Flight Arcs Connection */}
                {MAP_CITIES.map(city => renderFlightPath(currentCityInfo, city))}
              </svg>

              {/* Glowing Interactive Pins */}
              {MAP_CITIES.map((city) => {
                const isCurrent = city.fullName === gameState.location;
                const isSelected = activeCity.name === city.name;
                
                return (
                  <button
                    key={city.name}
                    onClick={() => {
                      triggerSound('click');
                      setSelectedCity(city);
                    }}
                    style={{ left: `${city.x}%`, top: `${city.y}%` }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin focus:outline-none z-20 cursor-pointer"
                  >
                    {/* Ring Pulse for Current Location */}
                    {isCurrent && (
                      <span className="absolute w-7 h-7 rounded-full bg-emerald-500/20 animate-ping duration-1000 pointer-events-none" />
                    )}

                    {/* Ring Pulse for Selection */}
                    {isSelected && (
                      <span className="absolute w-8 h-8 rounded-full bg-indigo-500/25 border border-indigo-400/40 pointer-events-none" />
                    )}

                    {/* Pin Head */}
                    <div className={`p-1 rounded-full border transition-all duration-300 shadow-lg ${
                      isCurrent 
                        ? 'bg-emerald-500 border-emerald-300 text-white scale-110' 
                        : isSelected 
                          ? 'bg-indigo-500 border-indigo-300 text-white scale-105' 
                          : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:scale-105 hover:bg-slate-800'
                    }`}>
                      <MapPin size={10} className={isCurrent ? 'animate-bounce' : ''} />
                    </div>

                    {/* Tactical Tag label */}
                    <div className={`mt-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-bold font-mono tracking-wider transition-all duration-300 border shadow-md flex items-center gap-0.5 whitespace-nowrap ${
                      isCurrent
                        ? 'bg-emerald-950/95 border-emerald-800/60 text-emerald-300'
                        : isSelected
                          ? 'bg-indigo-950/95 border-indigo-800/60 text-indigo-300'
                          : 'bg-slate-950/90 border-slate-800 text-slate-400 group-hover/pin:text-white group-hover/pin:border-slate-600'
                    }`}>
                      <span>{city.emoji} {city.name}</span>
                      {isCurrent && <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>}
                    </div>
                  </button>
                );
              })}

              {/* Map Footer coordinates overview */}
              <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[8px] font-mono font-extrabold text-slate-500 bg-slate-950/80 backdrop-blur-xs px-2 py-1 rounded-md border border-slate-900 pointer-events-none">
                <span>RADAR STATUS: ACTIVE</span>
                <span>SYSTEM TARGET: {activeCity.fullName.toUpperCase()}</span>
                <span>LAT/LON COMPUTE: OK</span>
              </div>
            </div>

            {/* SELECTED CITY ACTION BOARD */}
            <div className="mt-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 p-3.5 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl leading-none">{activeCity.emoji}</span>
                    <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide">
                      {activeCity.fullName}
                    </h4>
                    {isCurrentActive && (
                      <span className="text-[8px] font-bold font-mono uppercase bg-emerald-100 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        Current Base
                      </span>
                    )}
                  </div>
                  
                  {/* City unique career passive bonus */}
                  <div className="flex gap-1.5 items-start p-2 bg-indigo-50/50 border border-indigo-100/40 rounded-xl">
                    <Briefcase size={12} className="text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-indigo-800 font-mono">City Bonus</p>
                      <p className="text-[10px] text-slate-600 font-medium leading-relaxed mt-0.5 font-sans">
                        {activeCity.bonusDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini Compass logo */}
                <div className="p-1.5 rounded-xl bg-white border border-slate-200 shrink-0 text-slate-400">
                  <Compass size={14} className="animate-spin-slow" />
                </div>
              </div>

              {/* ACTIVE ACTIONS FOOTER */}
              <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row gap-2">
                
                {/* Local Activity Panel: Shown only for current base */}
                {isCurrentActive ? (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <Zap size={10} className="text-amber-500" /> Unique Local Activity
                      </span>
                      {activeCity.localActionCost > 0 && (
                        <span className="text-[10px] font-mono font-black text-slate-600 bg-slate-200/50 px-2 py-0.5 rounded-md">
                          Cost: ${activeCity.localActionCost}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onLocalAction(activeCity)}
                      disabled={gameState.cash < activeCity.localActionCost}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl shadow-xs transition duration-200 text-xs font-black tracking-wide uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <span>{activeCity.localActionName}</span>
                      {activeCity.localActionCost > 0 && (
                        <span>(-${activeCity.localActionCost})</span>
                      )}
                    </button>
                    
                    <p className="text-[9px] text-slate-400 leading-relaxed font-sans mt-1">
                      {activeCity.localActionDesc}
                    </p>
                  </div>
                ) : (
                  /* Travel Panel: Shown for other bases */
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        ✈️ Ticket Relocation Cost
                      </span>
                      <span className={`font-black ${isUnderage ? 'text-emerald-600 font-bold' : 'text-slate-800'}`}>
                        {isUnderage ? '💵 SPONSORED (FREE)' : `$${travelCost}`}
                      </span>
                    </div>

                    {isUnderage ? (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => onTravel(activeCity)}
                          className={`w-full py-2.5 px-4 rounded-xl shadow-sm text-xs font-black tracking-wide uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            hasMetExchangeRequirement
                              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white'
                              : 'bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          🌍 Request Student Exchange Relocation
                        </button>
                        <p className={`text-[9px] font-sans leading-relaxed ${hasMetExchangeRequirement ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {hasMetExchangeRequirement
                            ? '✅ Requirement Met! Your parents are proud of your academic score and will sponsor your exchange!'
                            : `❌ Requires Smarts >= 65 (Current: ${gameState.stats.smarts}%) and Happiness >= 60 (Current: ${gameState.stats.happiness}%) to get parental approval.`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => onTravel(activeCity)}
                          disabled={!canAffordTravel}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl shadow-md transition text-xs font-black tracking-wide uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          💼 Relocate base to {activeCity.name} (-$350)
                        </button>
                        {!canAffordTravel && (
                          <p className="text-[9px] text-rose-500 font-medium">
                            ⚠️ Insufficient Funds: You need at least $350 cash for flight tickets and landlord deposits.
                          </p>
                        )}
                        <p className="text-[9px] text-amber-600 leading-relaxed font-sans">
                          💡 Realism warning: Moving bases internationally will force you to resign from your current career.
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
