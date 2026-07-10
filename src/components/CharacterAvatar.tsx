import React from 'react';
import { AvatarConfig } from '../types';

interface CharacterAvatarProps {
  config: AvatarConfig | undefined;
  gender: 'Male' | 'Female';
  age: number;
  className?: string;
  style?: React.CSSProperties;
}

// Helpers to get correct hex codes for colors
const getHairColorHex = (colorId: string | undefined): string => {
  const mapping: Record<string, string> = {
    '2c1b18': '#151110', // Jet Black
    '4a3728': '#443022', // Dark Brown
    'b58143': '#cfa15c', // Blonde
    'c93305': '#b53c1d', // Auburn
    '726f70': '#8c8a89', // Silver
    'ec4899': '#e03a89', // Neon Pink
    '3b82f6': '#2563eb', // Cobalt Blue
  };
  if (!colorId) return '#151110';
  return mapping[colorId] || (colorId.startsWith('#') ? colorId : `#${colorId}`);
};

const getSkinColorHex = (colorId: string | undefined): string => {
  const mapping: Record<string, string> = {
    'ffdbb4': '#fcd2b2', // Fair
    'edb98a': '#e5ab7c', // Peach
    'd08b5b': '#bd7748', // Olive
    'ae5d29': '#964d20', // Bronze
    '614335': '#523427', // Dark
    'f8d25c': '#e3bd48', // Golden
  };
  if (!colorId) return '#fcd2b2';
  return mapping[colorId] || (colorId.startsWith('#') ? colorId : `#${colorId}`);
};

const getEyesColorHex = (colorId: string | undefined): string => {
  const mapping: Record<string, string> = {
    'Brown': '#5a3e29',
    'Blue': '#2563eb',
    'Green': '#16a34a',
    'Hazel': '#7c704c',
    'Amber': '#d97706',
    'Grey': '#4b5563',
  };
  if (!colorId) return '#5a3e29';
  return mapping[colorId] || colorId;
};

const getLipsColorHex = (colorId: string | undefined): string => {
  const mapping: Record<string, string> = {
    'Natural': '#f8a5a5',
    'Coral Pink': '#f43f5e',
    'Ruby Red': '#be123c',
    'Peach Gloss': '#fda4af',
    'Dark Plum': '#881337',
  };
  if (!colorId) return '#f8a5a5';
  return mapping[colorId] || colorId;
};

// Darken skin color for shadow effects
const getDarkenedColor = (hex: string, percent: number): string => {
  let num = parseInt(hex.replace('#',''), 16),
  amt = Math.round(2.55 * percent),
  R = (num >> 16) - amt,
  G = (num >> 8 & 0x00FF) - amt,
  B = (num & 0x0000FF) - amt;
  return '#' + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
};

export function CharacterAvatar({ config, gender, age, className = '', style }: CharacterAvatarProps) {
  // Use default configuration if undefined
  const activeConfig = config || {
    eyes: 'default',
    eyebrows: 'default',
    mouth: 'smile',
    skinColor: 'ffdbb4',
    hairColor: '2c1b18',
    facialHair: 'none',
    facialHairColor: '2c1b18',
    top: 'shortRound',
    eyesColorSimulated: 'Brown',
    lipsColorSimulated: 'Natural',
  };

  const skinColorHex = getSkinColorHex(activeConfig.skinColor);
  const shadowColorHex = getDarkenedColor(skinColorHex, 15);
  const hairColorHex = getHairColorHex(activeConfig.hairColor);
  const eyesColorHex = getEyesColorHex(activeConfig.eyesColorSimulated);
  const lipsColorHex = getLipsColorHex(activeConfig.lipsColorSimulated);
  const facialHairColorHex = getHairColorHex(activeConfig.facialHairColor);

  // Beard & mustache only shown after age 18 in custom SVG for realism
  const showFacialHair = age >= 18 && activeConfig.facialHair && activeConfig.facialHair !== 'none';

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`w-full h-full select-none ${className}`}
      style={style}
    >
      <defs>
        {/* Soft radial background gradient for avatar backdrop */}
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>

        {/* Soft shadow filter */}
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Circular Backdrop */}
      <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />

      {/* Neck & Shoulder base */}
      <g>
        {/* Neck Shadow */}
        <path d="M42 75 L58 75 L58 84 L42 84 Z" fill={shadowColorHex} />
        {/* Neck */}
        <path d="M44 73 L56 73 L56 82 L44 82 Z" fill={skinColorHex} />
        {/* Crew neck shirt shoulders */}
        <path 
          d="M22 92 C22 84, 35 81, 50 81 C65 81, 78 84, 78 92 L78 98 L22 98 Z" 
          fill={gender === 'Male' ? '#1e3a8a' : '#701a75'} 
          filter="url(#softShadow)"
        />
        {/* Collar line */}
        <path d="M40 81 C45 85, 55 85, 60 81" fill="none" stroke={gender === 'Male' ? '#3b82f6' : '#d946ef'} strokeWidth="1.5" />
      </g>

      {/* Ears */}
      <circle cx="23" cy="54" r="5.5" fill={skinColorHex} />
      <circle cx="23" cy="54" r="3" fill={shadowColorHex} opacity="0.6" />
      <circle cx="77" cy="54" r="5.5" fill={skinColorHex} />
      <circle cx="77" cy="54" r="3" fill={shadowColorHex} opacity="0.6" />

      {/* Head / Face */}
      <circle cx="50" cy="53" r="25" fill={skinColorHex} filter="url(#softShadow)" />

      {/* Cheeks blush */}
      <circle cx="34" cy="62" r="3" fill="#f43f5e" opacity="0.15" />
      <circle cx="66" cy="62" r="3" fill="#f43f5e" opacity="0.15" />

      {/* Nose */}
      <path d="M48 57 C50 59, 50 59, 52 57" fill="none" stroke={shadowColorHex} strokeWidth="1.5" strokeLinecap="round" />

      {/* Eyes */}
      <g>
        {/* Left Eye */}
        {activeConfig.eyes === 'hearts' ? (
          <path d="M31 47 C29 44, 32 42, 34 45 C36 42, 39 44, 37 47 L34 50 Z" fill="#ef4444" />
        ) : activeConfig.eyes === 'happy' ? (
          <path d="M30 50 C32 47, 36 47, 38 50" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        ) : activeConfig.eyes === 'wink' ? (
          <path d="M30 50 C32 47, 36 47, 38 50" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        ) : activeConfig.eyes === 'squint' ? (
          <line x1="30" y1="50" x2="38" y2="50" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          /* Default / Open Eye */
          <g>
            <circle cx="34" cy="50" r="3.5" fill="#ffffff" />
            <circle cx="34" cy="50" r="2.2" fill={eyesColorHex} />
            <circle cx="34.3" cy="49.3" r="1.1" fill="#000000" />
            <circle cx="35" cy="48.5" r="0.6" fill="#ffffff" />
          </g>
        )}

        {/* Right Eye */}
        {activeConfig.eyes === 'hearts' ? (
          <path d="M63 47 C61 44, 64 42, 66 45 C68 42, 71 44, 69 47 L66 50 Z" fill="#ef4444" />
        ) : activeConfig.eyes === 'happy' ? (
          <path d="M62 50 C64 47, 68 47, 70 50" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        ) : activeConfig.eyes === 'squint' ? (
          <line x1="62" y1="50" x2="70" y2="50" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          /* Default / Open Eye */
          <g>
            <circle cx="66" cy="50" r="3.5" fill="#ffffff" />
            <circle cx="66" cy="50" r="2.2" fill={eyesColorHex} />
            <circle cx="65.7" cy="49.3" r="1.1" fill="#000000" />
            <circle cx="65" cy="48.5" r="0.6" fill="#ffffff" />
          </g>
        )}
      </g>

      {/* Eyebrows */}
      <g>
        {/* Left Eyebrow */}
        {activeConfig.eyebrows === 'angry' ? (
          <path d="M29 44 L38 46" stroke={hairColorHex} strokeWidth="2" strokeLinecap="round" />
        ) : activeConfig.eyebrows === 'sadConcerned' ? (
          <path d="M29 46 L38 44" stroke={hairColorHex} strokeWidth="2" strokeLinecap="round" />
        ) : activeConfig.eyebrows === 'raisedExcited' ? (
          <path d="M29 42 C32 39, 35 39, 38 42" fill="none" stroke={hairColorHex} strokeWidth="2" strokeLinecap="round" />
        ) : (
          /* Default / Flat Natural */
          <path d="M29 43.5 L38 43.5" stroke={hairColorHex} strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Right Eyebrow */}
        {activeConfig.eyebrows === 'angry' ? (
          <path d="M71 44 L62 46" stroke={hairColorHex} strokeWidth="2" strokeLinecap="round" />
        ) : activeConfig.eyebrows === 'sadConcerned' ? (
          <path d="M71 46 L62 44" stroke={hairColorHex} strokeWidth="2" strokeLinecap="round" />
        ) : activeConfig.eyebrows === 'raisedExcited' ? (
          <path d="M71 42 C68 39, 65 39, 62 42" fill="none" stroke={hairColorHex} strokeWidth="2" strokeLinecap="round" />
        ) : (
          /* Default / Flat Natural */
          <path d="M71 43.5 L62 43.5" stroke={hairColorHex} strokeWidth="2" strokeLinecap="round" />
        )}
      </g>

      {/* Mouth */}
      <g>
        {activeConfig.mouth === 'sad' ? (
          <path d="M43 68 C47 65, 53 65, 57 68" fill="none" stroke={lipsColorHex} strokeWidth="3" strokeLinecap="round" />
        ) : activeConfig.mouth === 'tongue' ? (
          <g>
            <path d="M42 65 C42 70, 58 70, 58 65 Z" fill="#ffffff" stroke={lipsColorHex} strokeWidth="1.5" />
            <path d="M46 67 C48 72, 52 72, 54 67 Z" fill="#f43f5e" />
          </g>
        ) : activeConfig.mouth === 'serious' || activeConfig.mouth === 'concerned' ? (
          <line x1="43" y1="66" x2="57" y2="66" stroke={lipsColorHex} strokeWidth="3" strokeLinecap="round" />
        ) : activeConfig.mouth === 'grimace' ? (
          <rect x="42" y="64" width="16" height="5" rx="2.5" fill="#ffffff" stroke={lipsColorHex} strokeWidth="2" />
        ) : (
          /* Smile / Default */
          <path d="M42 64 C45 70, 55 70, 58 64" fill="none" stroke={lipsColorHex} strokeWidth="3.5" strokeLinecap="round" />
        )}
      </g>

      {/* Mustache / Beard (Facial Hair) */}
      {showFacialHair && (
        <g>
          {/* Mustache Fancy / Magnum */}
          {(activeConfig.facialHair?.includes('moustache') || activeConfig.facialHair?.includes('beard')) && (
            <path 
              d="M41 62 C45 61, 49 61, 50 63 C51 61, 55 61, 59 62 C55 63, 45 63, 41 62 Z" 
              fill={facialHairColorHex} 
            />
          )}
          {/* Full beard / Majestic */}
          {activeConfig.facialHair?.includes('beard') && (
            <path 
              d="M26 53 C26 73, 35 79, 50 79 C65 79, 74 73, 74 53 C70 56, 30 56, 26 53 Z" 
              fill={facialHairColorHex} 
              opacity="0.9" 
              stroke={facialHairColorHex} 
              strokeWidth="1.5"
            />
          )}
        </g>
      )}

      {/* Hair (top) */}
      <g filter="url(#softShadow)">
        {activeConfig.top === 'sides' ? (
          <g>
            <path d="M22 50 C20 40, 27 34, 30 38" fill="none" stroke={hairColorHex} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M78 50 C80 40, 73 34, 70 38" fill="none" stroke={hairColorHex} strokeWidth="4.5" strokeLinecap="round" />
          </g>
        ) : activeConfig.top === 'dreads' ? (
          <g fill={hairColorHex}>
            <path d="M22 36 C24 22, 40 22, 50 25 C60 22, 76 22, 78 36 L79 50 C79 56, 75 58, 75 54 L76 38 Z" />
            {/* Dread strands hanging down */}
            <rect x="21" y="38" width="4.5" height="24" rx="2" />
            <rect x="74" y="38" width="4.5" height="24" rx="2" />
            <rect x="17" y="44" width="4" height="18" rx="2" />
            <rect x="79" y="44" width="4" height="18" rx="2" />
          </g>
        ) : activeConfig.top === 'shaggy' ? (
          <path 
            d="M21 44 C19 32, 28 20, 50 18 C72 20, 81 32, 79 44 C72 40, 64 35, 50 38 C36 35, 28 40, 21 44 Z" 
            fill={hairColorHex} 
          />
        ) : activeConfig.top === 'curly' ? (
          <g fill={hairColorHex}>
            {/* Curly hair bubbles */}
            <circle cx="50" cy="24" r="13" />
            <circle cx="39" cy="27" r="11" />
            <circle cx="61" cy="27" r="11" />
            <circle cx="31" cy="33" r="10" />
            <circle cx="69" cy="33" r="10" />
            <circle cx="25" cy="41" r="8" />
            <circle cx="75" cy="41" r="8" />
          </g>
        ) : activeConfig.top === 'frizzle' ? (
          <circle cx="50" cy="36" r="21" fill={hairColorHex} stroke={hairColorHex} strokeWidth="2.5" strokeDasharray="3 3" />
        ) : activeConfig.top === 'longHair' || activeConfig.top === 'straight2' || activeConfig.top === 'straightAndCurly' ? (
          <g fill={hairColorHex}>
            {/* Long curtain sides */}
            <path d="M24 38 C21 52, 20 68, 22 75 L28 75 C29 65, 29 45, 27 38 Z" />
            <path d="M76 38 C79 52, 80 68, 78 75 L72 75 C71 65, 71 45, 73 38 Z" />
            {/* Crown */}
            <path d="M23 38 C25 24, 40 22, 50 24 C60 22, 75 24, 77 38 C68 33, 32 33, 23 38 Z" />
          </g>
        ) : activeConfig.top === 'noHair' ? (
          /* Bald - nothing to draw */
          null
        ) : (
          /* Default / shortRound */
          <path 
            d="M23 41 C21 28, 35 22, 50 22 C65 22, 79 28, 77 41 C70 36, 30 36, 23 41 Z" 
            fill={hairColorHex} 
          />
        )}
      </g>
    </svg>
  );
}
