import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AvatarConfig } from '../types';
import { getAvatarUrl } from '../App';

interface AppearanceModalProps {
  currentConfig: AvatarConfig;
  gender: 'Male' | 'Female';
  age: number;
  onSave: (newConfig: AvatarConfig) => void;
  onClose: () => void;
  triggerSound: (type: 'click' | 'success' | 'error' | 'ageUp') => void;
}

// Custom lists of styles
const BROWS_STYLES = ['default', 'defaultNatural', 'flatNatural', 'raisedExcited', 'angry', 'sadConcerned'];
const FACIAL_HAIR_STYLES = ['none', 'beardLight', 'beardMedium', 'beardMajestic', 'moustacheFancy', 'moustacheMagnum'];
const EYES_STYLES = ['default', 'happy', 'surprised', 'wink', 'squint', 'hearts'];
const MOUTH_STYLES = ['smile', 'default', 'serious', 'concerned', 'grimace', 'sad', 'tongue'];

// Male hair vs female hair
const MALE_HAIR_STYLES = ['shortRound', 'sides', 'dreads', 'shaggy', 'curly', 'frizzle', 'noHair'];
const FEMALE_HAIR_STYLES = ['straight2', 'straightAndCurly', 'longHair', 'curly', 'frizzle', 'shortRound', 'shaggy', 'noHair'];

// Color Swatches
const HAIR_COLORS = [
  { id: '2c1b18', name: 'Jet Black', hex: '#111111' },
  { id: '4a3728', name: 'Dark Brown', hex: '#4a3728' },
  { id: 'b58143', name: 'Blonde', hex: '#b58143' },
  { id: 'c93305', name: 'Auburn', hex: '#c93305' },
  { id: '726f70', name: 'Silver', hex: '#8a8a8a' },
  { id: 'ec4899', name: 'Neon Pink', hex: '#ec4899' },
  { id: '3b82f6', name: 'Cobalt Blue', hex: '#3b82f6' }
];

const SKIN_COLORS = [
  { id: 'ffdbb4', name: 'Fair', hex: '#ffdbb4' },
  { id: 'edb98a', name: 'Peach', hex: '#edb98a' },
  { id: 'd08b5b', name: 'Olive', hex: '#d08b5b' },
  { id: 'ae5d29', name: 'Bronze', hex: '#ae5d29' },
  { id: '614335', name: 'Dark', hex: '#614335' },
  { id: 'f8d25c', name: 'Golden', hex: '#f8d25c' }
];

const EYES_COLORS = [
  { id: 'Brown', name: 'Brown', hex: '#6b4e37' },
  { id: 'Blue', name: 'Blue', hex: '#3b82f6' },
  { id: 'Green', name: 'Green', hex: '#10b981' },
  { id: 'Hazel', name: 'Hazel', hex: '#8a7f5c' },
  { id: 'Amber', name: 'Amber', hex: '#f59e0b' },
  { id: 'Grey', name: 'Grey', hex: '#6b7280' }
];

const LIPS_COLORS = [
  { id: 'Natural', name: 'Natural', hex: '#fca5a5' },
  { id: 'Coral Pink', name: 'Coral Pink', hex: '#f43f5e' },
  { id: 'Ruby Red', name: 'Ruby Red', hex: '#be123c' },
  { id: 'Peach Gloss', name: 'Peach Gloss', hex: '#fda4af' },
  { id: 'Dark Plum', name: 'Dark Plum', hex: '#881337' }
];

export function AppearanceModal({
  currentConfig,
  gender,
  age,
  onSave,
  onClose,
  triggerSound
}: AppearanceModalProps) {
  const [config, setConfig] = useState<AvatarConfig>({ ...currentConfig });
  const [activeTab, setActiveTab] = useState<'Brows' | 'Facial Hair' | 'Hair' | 'Eyes' | 'Mouth' | 'Skin Tone'>('Hair');

  // Filter out Facial Hair tab for female characters
  const availableTabs = gender === 'Male'
    ? (['Brows', 'Facial Hair', 'Hair', 'Eyes', 'Mouth', 'Skin Tone'] as const)
    : (['Brows', 'Hair', 'Eyes', 'Mouth', 'Skin Tone'] as const);

  // Get active style cycle list
  const getStyleList = () => {
    switch (activeTab) {
      case 'Brows':
        return BROWS_STYLES;
      case 'Facial Hair':
        return FACIAL_HAIR_STYLES;
      case 'Hair':
        return gender === 'Male' ? MALE_HAIR_STYLES : FEMALE_HAIR_STYLES;
      case 'Eyes':
        return EYES_STYLES;
      case 'Mouth':
        return MOUTH_STYLES;
      case 'Skin Tone':
        return []; // skin tone has no distinct "style" shapes in dicebear avataaars typically
      default:
        return [];
    }
  };

  // Get currently active style value
  const getActiveStyleValue = () => {
    switch (activeTab) {
      case 'Brows':
        return config.eyebrows;
      case 'Facial Hair':
        return config.facialHair;
      case 'Hair':
        return config.top;
      case 'Eyes':
        return config.eyes;
      case 'Mouth':
        return config.mouth;
      default:
        return '';
    }
  };

  // Set style value
  const setStyleValue = (newValue: string) => {
    switch (activeTab) {
      case 'Brows':
        setConfig(prev => ({ ...prev, eyebrows: newValue }));
        break;
      case 'Facial Hair':
        setConfig(prev => ({ ...prev, facialHair: newValue }));
        break;
      case 'Hair':
        setConfig(prev => ({ ...prev, top: newValue }));
        break;
      case 'Eyes':
        setConfig(prev => ({ ...prev, eyes: newValue }));
        break;
      case 'Mouth':
        setConfig(prev => ({ ...prev, mouth: newValue }));
        break;
    }
  };

  // Cycle current style
  const handleCycle = (direction: 'prev' | 'next') => {
    triggerSound('click');
    const list = getStyleList();
    if (list.length === 0) return;

    const currentVal = getActiveStyleValue();
    let currentIndex = list.indexOf(currentVal);
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= list.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = list.length - 1;

    setStyleValue(list[nextIndex]);
  };

  // Get color swatches for active tab
  const getColorSwatches = () => {
    switch (activeTab) {
      case 'Brows':
      case 'Facial Hair':
      case 'Hair':
        return HAIR_COLORS;
      case 'Skin Tone':
        return SKIN_COLORS;
      case 'Eyes':
        return EYES_COLORS;
      case 'Mouth':
        return LIPS_COLORS;
      default:
        return [];
    }
  };

  // Get active color value
  const getActiveColorValue = () => {
    switch (activeTab) {
      case 'Brows':
      case 'Hair':
        return config.hairColor;
      case 'Facial Hair':
        return config.facialHairColor;
      case 'Skin Tone':
        return config.skinColor;
      case 'Eyes':
        return config.eyesColorSimulated || 'Brown';
      case 'Mouth':
        return config.lipsColorSimulated || 'Natural';
      default:
        return '';
    }
  };

  // Set color value
  const setColorValue = (colorId: string) => {
    triggerSound('click');
    switch (activeTab) {
      case 'Brows':
      case 'Hair':
        setConfig(prev => ({ ...prev, hairColor: colorId }));
        break;
      case 'Facial Hair':
        setConfig(prev => ({ ...prev, facialHairColor: colorId }));
        break;
      case 'Skin Tone':
        setConfig(prev => ({ ...prev, skinColor: colorId }));
        break;
      case 'Eyes':
        setConfig(prev => ({ ...prev, eyesColorSimulated: colorId }));
        break;
      case 'Mouth':
        setConfig(prev => ({ ...prev, lipsColorSimulated: colorId }));
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-[2px] p-4">
      <div className="bg-[#121824] border-4 border-slate-700 w-full max-w-md rounded-[2rem] overflow-hidden flex flex-col h-[90%] max-h-[640px] text-white shadow-2xl relative font-sans animate-scale-up">
        
        {/* Close button top right */}
        <button 
          onClick={() => { triggerSound('click'); onClose(); }}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header Title Section */}
        <div className="text-center pt-8 pb-3 px-6 select-none">
          <h2 className="text-2xl font-black tracking-wider text-white uppercase flex items-center justify-center gap-1.5 font-sans">
            ⚡ Appearance
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Select your appearance!</p>
          <div className="h-[2px] bg-slate-800 w-full mt-4"></div>
        </div>

        {/* Interactive Avatar Container with Cycling Arrows */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative min-h-0">
          <div className="relative flex items-center justify-center w-full max-w-[280px]">
            
            {/* Left Cycle Arrow */}
            {getStyleList().length > 0 && (
              <button 
                onClick={() => handleCycle('prev')}
                className="absolute left-0 bg-slate-800/80 hover:bg-slate-700 hover:scale-105 active:scale-95 text-white/90 hover:text-white rounded-full w-11 h-11 flex items-center justify-center transition-all shadow-lg border border-slate-700/50 cursor-pointer z-10"
              >
                <ChevronLeft size={24} className="stroke-[3]" />
              </button>
            )}

            {/* Avatar Preview Box */}
            <div className="w-40 h-40 rounded-full bg-slate-900/60 border-4 border-slate-700/80 flex items-center justify-center overflow-hidden shadow-2xl p-1 relative">
              <img 
                src={getAvatarUrl(config, age, gender)} 
                alt="Custom Avatar" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Cycle Arrow */}
            {getStyleList().length > 0 && (
              <button 
                onClick={() => handleCycle('next')}
                className="absolute right-0 bg-slate-800/80 hover:bg-slate-700 hover:scale-105 active:scale-95 text-white/90 hover:text-white rounded-full w-11 h-11 flex items-center justify-center transition-all shadow-lg border border-slate-700/50 cursor-pointer z-10"
              >
                <ChevronRight size={24} className="stroke-[3]" />
              </button>
            )}

          </div>

          {/* Green SAVE Button */}
          <div className="mt-5 select-none">
            <button
              onClick={() => {
                triggerSound('success');
                onSave(config);
              }}
              className="bg-[#00c853] hover:bg-[#00e676] text-white font-extrabold text-base px-10 py-2.5 rounded-full border-[3px] border-white shadow-lg shadow-emerald-950/50 transition-all duration-150 transform hover:scale-105 active:scale-95 text-center cursor-pointer uppercase tracking-wider"
            >
              Save
            </button>
          </div>
        </div>

        {/* Bottom Section: Categories and Color Swatches */}
        <div className="bg-[#1a2333] border-t border-slate-800 px-4 py-5 flex flex-col gap-4 select-none shrink-0">
          
          {/* Categories Tab Bar */}
          <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
            {availableTabs.map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { triggerSound('click'); setActiveTab(tab); }}
                  className={`text-xs font-black uppercase tracking-wider whitespace-nowrap px-3.5 py-1.5 transition cursor-pointer border-b-2 ${
                    isActive 
                      ? 'text-yellow-400 border-yellow-400 font-extrabold' 
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Color Swatch List */}
          <div className="flex gap-3 overflow-x-auto py-1 justify-center min-h-[56px] no-scrollbar">
            {getColorSwatches().map(swatch => {
              const activeVal = getActiveColorValue();
              const isSelected = activeVal === swatch.id;
              return (
                <button
                  key={swatch.id}
                  onClick={() => setColorValue(swatch.id)}
                  style={{ backgroundColor: swatch.hex }}
                  className={`w-11 h-11 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isSelected 
                      ? 'border-[3.5px] border-yellow-400 scale-110 shadow-lg shadow-yellow-400/20' 
                      : 'border-2 border-white hover:scale-105 hover:border-slate-300'
                  }`}
                  title={swatch.name}
                />
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
