import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Smile, 
  Shuffle, 
  Plus, 
  Minus, 
  RotateCcw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Crown
} from 'lucide-react';
import { AvatarConfig } from '../types';
import { getAvatarUrl } from '../App';
import { CharacterAvatar } from './CharacterAvatar';

// Constants duplicated/shared for character name generation
const SURNAMES = ['Armstrong', 'Miller', 'Vance', 'Kovacs', 'Rodriguez', 'Chen', 'Sterling', 'Hayes', 'O\'Connor', 'Patel'];
const MALE_NAMES = ['Yusef', 'Logan', 'Sora', 'Devon', 'Mateo', 'Arthur', 'Marcus', 'Viktor', 'Kaito', 'Julian'];
const FEMALE_NAMES = ['Amara', 'Evelyn', 'Clara', 'Naomi', 'Elena', 'Yuki', 'Zoe', 'Iris', 'Priya', 'Sasha'];

const COUNTRIES = [
  'United States',
  'Japan',
  'United Kingdom',
  'Germany',
  'Australia',
  'India'
];

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['Compton', 'Los Angeles', 'New York', 'Chicago', 'Miami', 'San Francisco', 'Houston', 'Seattle'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Sapporo', 'Fukuoka', 'Yokohama', 'Nagoya', 'Hiroshima'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Edinburgh', 'Liverpool', 'Leeds', 'Bristol'],
  'Germany': ['Munich', 'Berlin', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Dusseldorf'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Gold Coast'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
};

const CITY_BONUSES: Record<string, string> = {
  'Compton': '🎨 Creative & Music Career Perks (+15% gain)',
  'Tokyo': '🎮 Technology & Software Career Perks (+15% gain)',
  'London': '💼 Finance & Corporate Career Perks (+15% gain)',
  'Munich': '🔬 Engineering & BioTech Career Perks (+15% gain)',
  'Sydney': '🏆 Athletics & Entertainment Career Perks (+15% gain)',
  'Mumbai': '🧠 IT & Science Career Perks (+15% gain)'
};

const BITLIFE_COLORS = [
  'from-[#00b0ff] to-[#0081cb]', // Vibrant Cyan
  'from-[#ffa000] to-[#e65100]', // Vibrant Orange
  'from-[#9c27b0] to-[#6a1b9a]', // Vibrant Purple
  'from-[#00e676] to-[#00c853]', // Vibrant Green
  'from-[#ff1744] to-[#d50000]', // Vibrant Red
  'from-[#ffd600] to-[#ffab00]', // Vibrant Yellow
];

interface CharacterCreatorProps {
  onStartGame: (setup: {
    name: string;
    gender: 'Male' | 'Female';
    location: string;
    avatar: string;
    avatarConfig: AvatarConfig;
    stats: {
      health: number;
      smarts: number;
      looks: number;
      happiness: number;
    };
    karma: number;
    willpower: number;
    startingCash?: number;
    discipline?: number;
    fertility?: number;
    sexuality?: string;
  }) => void;
  triggerSound: (type: 'click' | 'success' | 'error' | 'ageUp') => void;
}

export function CharacterCreator({ onStartGame, triggerSound }: CharacterCreatorProps) {
  // Navigation active state
  const [activeSubScreen, setActiveSubScreen] = useState<'hub' | 'gender' | 'country' | 'city' | 'name' | 'custom_attributes'>('hub');

  // Core character setup states
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedCity, setSelectedCity] = useState('Compton');
  
  // Custom Attributes Pool & stats
  const [pointsPool, setPointsPool] = useState(0);
  const [stats, setStats] = useState({
    health: 75,
    smarts: 50,
    looks: 50,
    happiness: 80
  });

  const [karma, setKarma] = useState(50);
  const [willpower, setWillpower] = useState(50);
  const [discipline, setDiscipline] = useState(50);
  const [fertility, setFertility] = useState(80);
  const [sexuality, setSexuality] = useState('Straight');

  // Avatar customized states
  const [eyes, setEyes] = useState('default');
  const [eyebrows, setEyebrows] = useState('default');
  const [mouth, setMouth] = useState('smile');
  const [skinColor, setSkinColor] = useState('ffdbb4');
  const [hairColor, setHairColor] = useState('2c1b18');
  const [facialHair, setFacialHair] = useState('none');
  const [facialHairColor, setFacialHairColor] = useState('2c1b18');
  const [top, setTop] = useState('shortRound');
  const [eyesColorSimulated, setEyesColorSimulated] = useState('Brown');
  const [lipsColorSimulated, setLipsColorSimulated] = useState('Natural');
  const [makeupSimulated, setMakeupSimulated] = useState('None');

  const [editorTab, setEditorTab] = useState<'eyes' | 'skin' | 'brows' | 'hair' | 'mouth' | 'facialHair'>('hair');
  const [previewAdult, setPreviewAdult] = useState(true);

  // Randomize genes generator
  const handleRandomizeAvatar = (targetGender?: 'Male' | 'Female') => {
    const activeGender = targetGender || gender;
    const eyesStyles = ['default', 'happy', 'surprised', 'wink', 'squint', 'hearts'];
    const eyebrowsStyles = ['default', 'defaultNatural', 'flatNatural', 'raisedExcited', 'angry', 'sadConcerned'];
    const mouthStyles = ['smile', 'default', 'serious', 'concerned', 'grimace', 'sad', 'tongue'];
    const skinColors = ['ffdbb4', 'edb98a', 'd08b5b', 'ae5d29', '614335', 'f8d25c'];
    const hairColors = ['2c1b18', '4a3728', 'b58143', 'c93305', '726f70'];
    
    const facialHairs = activeGender === 'Male'
      ? ['none', 'beardMedium', 'beardLight', 'beardMajestic', 'moustacheFancy', 'moustacheMagnum']
      : ['none'];

    const maleHairStyles = ['shortRound', 'sides', 'dreads', 'shaggy', 'curly', 'frizzle', 'noHair'];
    const femaleHairStyles = ['straight2', 'straightAndCurly', 'longHair', 'curly', 'frizzle', 'shortRound', 'shaggy'];
    const hairStyles = activeGender === 'Male' ? maleHairStyles : femaleHairStyles;

    const eyesColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Amber', 'Grey'];
    const lipsColors = ['Natural', 'Coral Pink', 'Ruby Red', 'Peach Gloss', 'Dark Plum'];
    const makeupStyles = activeGender === 'Female'
      ? ['None', 'Classic Eyeliner', 'Rosy Blush', 'Gilded Eyeshadow', 'Nude Glow']
      : ['None'];

    setEyes(eyesStyles[Math.floor(Math.random() * eyesStyles.length)]);
    setEyebrows(eyebrowsStyles[Math.floor(Math.random() * eyebrowsStyles.length)]);
    setMouth(mouthStyles[Math.floor(Math.random() * mouthStyles.length)]);
    setSkinColor(skinColors[Math.floor(Math.random() * skinColors.length)]);
    const chosenHairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
    setHairColor(chosenHairColor);
    setFacialHair(facialHairs[Math.floor(Math.random() * facialHairs.length)]);
    setFacialHairColor(chosenHairColor);
    setTop(hairStyles[Math.floor(Math.random() * hairStyles.length)]);
    setEyesColorSimulated(eyesColors[Math.floor(Math.random() * eyesColors.length)]);
    setLipsColorSimulated(lipsColors[Math.floor(Math.random() * lipsColors.length)]);
    setMakeupSimulated(makeupStyles[Math.floor(Math.random() * makeupStyles.length)]);
  };

  // Run on mount
  useEffect(() => {
    const defaultGender = Math.random() > 0.5 ? 'Male' : 'Female';
    setGender(defaultGender);
    const list = defaultGender === 'Male' ? MALE_NAMES : FEMALE_NAMES;
    const randomFirst = list[Math.floor(Math.random() * list.length)];
    const randomLast = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    setName(`${randomFirst} ${randomLast}`);
    
    // Select default random birthplace
    const countriesKeys = Object.keys(CITIES_BY_COUNTRY);
    const randomC = countriesKeys[Math.floor(Math.random() * countriesKeys.length)];
    const randomCities = CITIES_BY_COUNTRY[randomC];
    const randomCity = randomCities[0]; // main default
    setSelectedCountry(randomC);
    setSelectedCity(randomCity);

    handleRandomizeAvatar(defaultGender);

    // Randomize initial stats
    setStats({
      health: Math.floor(Math.random() * 55) + 40, // 40-95
      smarts: Math.floor(Math.random() * 65) + 30, // 30-95
      looks: Math.floor(Math.random() * 60) + 35, // 35-95
      happiness: Math.floor(Math.random() * 30) + 70 // 70-100
    });
    setKarma(Math.floor(Math.random() * 51) + 25);
    setWillpower(Math.floor(Math.random() * 51) + 25);
    setDiscipline(Math.floor(Math.random() * 60) + 30);
    setFertility(Math.floor(Math.random() * 50) + 40);
    const sexualityRoll = Math.random();
    setSexuality(sexualityRoll < 0.85 ? 'Straight' : sexualityRoll < 0.95 ? 'Bisexual' : 'Gay');
  }, []);

  const handleGenderChange = (newGender: 'Male' | 'Female') => {
    setGender(newGender);
    const list = newGender === 'Male' ? MALE_NAMES : FEMALE_NAMES;
    const randomFirst = list[Math.floor(Math.random() * list.length)];
    const randomLast = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    setName(`${randomFirst} ${randomLast}`);
    handleRandomizeAvatar(newGender);
  };

  const handleRandomizeAll = () => {
    triggerSound('success');
    const randomGender = Math.random() > 0.5 ? 'Male' : 'Female';
    setGender(randomGender);
    const list = randomGender === 'Male' ? MALE_NAMES : FEMALE_NAMES;
    const randomFirst = list[Math.floor(Math.random() * list.length)];
    const randomLast = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    setName(`${randomFirst} ${randomLast}`);

    const countriesKeys = Object.keys(CITIES_BY_COUNTRY);
    const randomC = countriesKeys[Math.floor(Math.random() * countriesKeys.length)];
    const randomCities = CITIES_BY_COUNTRY[randomC];
    const randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    setSelectedCountry(randomC);
    setSelectedCity(randomCity);

    handleRandomizeAvatar(randomGender);

    setStats({
      health: Math.floor(Math.random() * 61) + 40,
      smarts: Math.floor(Math.random() * 71) + 25,
      looks: Math.floor(Math.random() * 71) + 25,
      happiness: Math.floor(Math.random() * 41) + 60
    });
    setKarma(Math.floor(Math.random() * 81) + 10);
    setWillpower(Math.floor(Math.random() * 81) + 10);
    setDiscipline(Math.floor(Math.random() * 81) + 10);
    setFertility(Math.floor(Math.random() * 81) + 10);
    const sexualityRoll = Math.random();
    setSexuality(sexualityRoll < 0.85 ? 'Straight' : sexualityRoll < 0.95 ? 'Bisexual' : 'Gay');
    setPointsPool(0);
  };

  const adjustStat = (statName: 'health' | 'smarts' | 'looks' | 'happiness', amount: number) => {
    const currentVal = stats[statName];
    const newVal = currentVal + amount;

    const limits = {
      health: { min: 40, max: 100 },
      smarts: { min: 10, max: 100 },
      looks: { min: 10, max: 100 },
      happiness: { min: 50, max: 100 }
    };

    const { min, max } = limits[statName];

    if (newVal < min || newVal > max) {
      triggerSound('error');
      return;
    }

    if (amount > 0 && pointsPool < amount) {
      triggerSound('error');
      return;
    }

    triggerSound('click');
    if (pointsPool > 0 && amount > 0) {
      setPointsPool(pointsPool - amount);
    }
    setStats({
      ...stats,
      [statName]: newVal
    });
  };

  const handleBeginLife = (startingCash = 0) => {
    if (!name.trim()) {
      triggerSound('error');
      return;
    }
    triggerSound('success');
    const config: AvatarConfig = {
      eyes,
      eyebrows,
      mouth,
      skinColor,
      hairColor,
      facialHair,
      facialHairColor,
      top,
      eyesColorSimulated,
      lipsColorSimulated,
      makeupSimulated
    };
    const finalAvatar = getAvatarUrl(config, 0, gender);
    onStartGame({
      name: name.trim(),
      gender,
      location: `${selectedCity}, ${selectedCountry}`,
      avatar: finalAvatar,
      avatarConfig: config,
      stats,
      karma,
      willpower,
      startingCash,
      discipline,
      fertility,
      sexuality
    });
  };

  const currentAvatarConfig: AvatarConfig = {
    eyes,
    eyebrows,
    mouth,
    skinColor,
    hairColor,
    facialHair,
    facialHairColor,
    top,
    eyesColorSimulated,
    lipsColorSimulated,
    makeupSimulated
  };

  // Determine starting archetype for flavor
  let archetypeTitle = "Balanced Pioneer";
  let archetypeDesc = "A well-rounded individual ready to carve their own unique path in life.";
  let archetypeIcon = "🧭";

  const { health, smarts, looks, happiness } = stats;
  const maxStat = Math.max(health, smarts, looks, happiness);

  if (smarts === maxStat && smarts >= 70) {
    archetypeTitle = "Future Genius";
    archetypeDesc = "Highly intelligent. Primed for academic excellence and elite professional careers.";
    archetypeIcon = "🧠";
  } else if (looks === maxStat && looks >= 70) {
    archetypeTitle = "Charming Star";
    archetypeDesc = "Dazzling beauty. Popularity and social charm come naturally, easing social hurdles.";
    archetypeIcon = "✨";
  } else if (health === maxStat && health >= 85) {
    archetypeTitle = "Iron Born";
    archetypeDesc = "Robust physical form. Exceptional endurance and powerful natural resistance to illness.";
    archetypeIcon = "❤️";
  } else if (happiness === maxStat && happiness >= 90) {
    archetypeTitle = "Radiant Soul";
    archetypeDesc = "Overflowing with joy. Exceptionally resilient against stress and emotional setbacks.";
    archetypeIcon = "😊";
  }

  // Render Subscreen based on selection flow
  return (
    <div className="flex flex-col h-screen md:h-auto min-h-screen bg-slate-950 text-white font-sans antialiased justify-center overflow-hidden">
      
      {/* Outer Phone/App Container */}
      <div className="w-full max-w-md mx-auto bg-[#0d0f14] border-4 border-slate-800 shadow-2xl flex flex-col h-full md:h-[800px] relative overflow-hidden">
        
        {/* --- MAIN NEW LIFE DASHBOARD (HUB) --- */}
        {activeSubScreen === 'hub' && (
          <div className="flex-1 flex flex-col justify-between p-6">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-3xl animate-pulse">🌱</span>
              <div className="text-center flex-1">
                <h1 className="text-xl font-black uppercase tracking-widest text-[#00e676]">New Life</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Start a new life!</p>
              </div>
              <button 
                onClick={handleRandomizeAll}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 transition border border-slate-700 rounded-lg cursor-pointer"
                title="Randomize All"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Avatar Circle Container */}
            <div className="flex flex-col items-center justify-center my-6 relative">
              <div className="w-32 h-32 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center overflow-hidden shadow-2xl relative group">
                <CharacterAvatar config={currentAvatarConfig} gender={gender} age={previewAdult ? 25 : 0} />
                <span className="absolute bottom-1 bg-slate-950/90 text-white text-[8px] font-black uppercase font-mono px-2 py-0.5 rounded border border-slate-800">
                  {gender}
                </span>
              </div>
              <p className="text-sm font-black text-[#ffa000] mt-3 tracking-wide">{archetypeIcon} {archetypeTitle}</p>
            </div>

            {/* Action Pills Grid */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              
              {/* Name Pill */}
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('name'); }}
                className="w-full rounded-full border-[3px] border-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-400 hover:to-cyan-500 text-white text-center font-black py-3 px-6 shadow-lg shadow-black/20 transition duration-150 active:scale-95 text-base uppercase tracking-wider cursor-pointer flex items-center justify-between"
              >
                <span className="text-slate-200 text-xs font-bold tracking-normal uppercase">Name</span>
                <span className="text-white font-extrabold truncate pl-3">{name || "Click to Name"}</span>
                <span className="text-slate-200 text-sm ml-2">❯</span>
              </button>

              {/* Gender Pill */}
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('gender'); }}
                className="w-full rounded-full border-[3px] border-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-center font-black py-3 px-6 shadow-lg shadow-black/20 transition duration-150 active:scale-95 text-base uppercase tracking-wider cursor-pointer flex items-center justify-between"
              >
                <span className="text-slate-200 text-xs font-bold tracking-normal uppercase">Gender</span>
                <span className="text-white font-extrabold truncate pl-3">{gender === 'Male' ? '👦 Male' : '👧 Female'}</span>
                <span className="text-slate-200 text-sm ml-2">❯</span>
              </button>

              {/* Country Pill */}
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('country'); }}
                className="w-full rounded-full border-[3px] border-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white text-center font-black py-3 px-6 shadow-lg shadow-black/20 transition duration-150 active:scale-95 text-base uppercase tracking-wider cursor-pointer flex items-center justify-between"
              >
                <span className="text-slate-200 text-xs font-bold tracking-normal uppercase">Country</span>
                <span className="text-white font-extrabold truncate pl-3">
                  {selectedCountry === 'United States' ? '🇺🇸' : 
                   selectedCountry === 'Japan' ? '🇯🇵' : 
                   selectedCountry === 'United Kingdom' ? '🇬🇧' : 
                   selectedCountry === 'Germany' ? '🇩🇪' : 
                   selectedCountry === 'Australia' ? '🇦🇺' : '🇮🇳'} {selectedCountry}
                </span>
                <span className="text-slate-200 text-sm ml-2">❯</span>
              </button>

              {/* City Pill */}
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('city'); }}
                className="w-full rounded-full border-[3px] border-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-center font-black py-3 px-6 shadow-lg shadow-black/20 transition duration-150 active:scale-95 text-base uppercase tracking-wider cursor-pointer flex items-center justify-between"
              >
                <span className="text-slate-200 text-xs font-bold tracking-normal uppercase">City</span>
                <span className="text-white font-extrabold truncate pl-3">📍 {selectedCity}</span>
                <span className="text-slate-200 text-sm ml-2">❯</span>
              </button>

              {/* Customize Attributes & Genes (God Mode Pill) */}
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('custom_attributes'); }}
                className="w-full rounded-full border-[3px] border-amber-400 bg-gradient-to-r from-[#ffd600] to-[#ffab00] hover:from-[#ffe033] hover:to-[#ffd11a] text-slate-950 font-black py-3 px-6 shadow-lg shadow-amber-950/20 transition duration-150 active:scale-95 text-sm uppercase tracking-wider cursor-pointer flex items-center justify-between border-dashed border-2"
              >
                <span className="flex items-center gap-1.5 font-extrabold text-slate-950">
                  <Crown size={15} className="text-rose-700 fill-rose-700 animate-bounce" />
                  Custom Appearance & Stats ⚡
                </span>
                <span className="text-slate-800 text-[10px] bg-white px-2 py-0.5 rounded-full font-black">EDIT</span>
              </button>

            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 space-y-3 shrink-0">
              
              {/* Start Normal Life */}
              <button
                onClick={() => handleBeginLife(0)}
                className="w-full rounded-full border-[4px] border-white bg-[#00e676] hover:bg-[#26ff8c] text-white text-center font-black py-3.5 px-6 shadow-xl shadow-green-950/40 transition duration-150 active:scale-95 text-base uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Start {name.split(' ')[0] || 'Character'}'s Life!</span>
                <span>👶</span>
              </button>

              {/* Start Millionaire Inheritance Background */}
              <button
                onClick={() => handleBeginLife(1000000)}
                className="w-full rounded-full border-[4px] border-[#00e676] bg-slate-900 hover:bg-slate-800 text-[#00e676] text-center font-black py-3 px-6 shadow-md shadow-black/20 transition duration-150 active:scale-95 text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>💵 Start with $1,000,000 Inheritance!</span>
              </button>

            </div>

          </div>
        )}

        {/* --- PICK YOUR GENDER --- */}
        {activeSubScreen === 'gender' && (
          <div className="flex-1 flex flex-col justify-between p-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('hub'); }}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-200">Gender Selection</h2>
            </div>

            {/* Subheading */}
            <div className="text-center py-4">
              <span className="text-4xl animate-bounce block mb-2">👫</span>
              <h3 className="text-xl font-extrabold text-white">Pick your gender!</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Choose a gender to begin. Starting name and default styles will adjust.
              </p>
            </div>

            {/* Big Gender Selection Pills */}
            <div className="space-y-4 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full px-4">
              
              {/* Male Pill */}
              <button
                onClick={() => {
                  handleGenderChange('Male');
                  triggerSound('success');
                  setActiveSubScreen('hub');
                }}
                className="w-full rounded-full border-[4px] border-white bg-gradient-to-r from-[#00b0ff] to-[#0081cb] text-white font-black py-5 px-8 shadow-xl text-lg uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transform transition hover:scale-105 duration-150"
              >
                <span>👦 Male</span>
              </button>

              {/* Female Pill */}
              <button
                onClick={() => {
                  handleGenderChange('Female');
                  triggerSound('success');
                  setActiveSubScreen('hub');
                }}
                className="w-full rounded-full border-[4px] border-white bg-gradient-to-r from-[#ff1744] to-[#d50000] text-white font-black py-5 px-8 shadow-xl text-lg uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transform transition hover:scale-105 duration-150"
              >
                <span>👧 Female</span>
              </button>

            </div>

            {/* Bottom Note */}
            <div className="text-center text-[10px] text-slate-500 font-medium font-mono">
              Gender determines default genetic facial and hair assets.
            </div>

          </div>
        )}

        {/* --- PICK YOUR COUNTRY --- */}
        {activeSubScreen === 'country' && (
          <div className="flex-1 flex flex-col p-6 min-h-0">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800 shrink-0">
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('hub'); }}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-200">Country Selection</h2>
            </div>

            {/* Subheading */}
            <div className="text-center py-4 shrink-0">
              <span className="text-4xl animate-pulse block mb-2">🌍</span>
              <h3 className="text-xl font-extrabold text-white">Pick your country!</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Select a nation of birth. This locks down your available local cities.
              </p>
            </div>

            {/* Scrollable list of countries */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {COUNTRIES.map((country, idx) => {
                const colorClass = BITLIFE_COLORS[idx % BITLIFE_COLORS.length];
                const flag = country === 'United States' ? '🇺🇸' : 
                             country === 'Japan' ? '🇯🇵' : 
                             country === 'United Kingdom' ? '🇬🇧' : 
                             country === 'Germany' ? '🇩🇪' : 
                             country === 'Australia' ? '🇦🇺' : '🇮🇳';
                return (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      const defaultCity = CITIES_BY_COUNTRY[country]?.[0] || 'Compton';
                      setSelectedCity(defaultCity);
                      triggerSound('click');
                      setActiveSubScreen('hub');
                    }}
                    className={`w-full rounded-full border-[3px] border-white bg-gradient-to-r ${colorClass} text-white font-black py-3.5 px-6 shadow-md transition duration-150 active:scale-95 text-base uppercase tracking-wider cursor-pointer flex items-center justify-between`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl select-none">{flag}</span>
                      <span>{country}</span>
                    </span>
                    <span className="text-white text-sm">❯</span>
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* --- PICK YOUR PLACE OR CITY --- */}
        {activeSubScreen === 'city' && (
          <div className="flex-1 flex flex-col p-6 min-h-0">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800 shrink-0">
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('hub'); }}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-200">City Selection</h2>
            </div>

            {/* Subheading */}
            <div className="text-center py-4 shrink-0">
              <span className="text-4xl animate-bounce block mb-2">📍</span>
              <h3 className="text-xl font-extrabold text-white">Pick your place or city!</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Selected Country: <strong className="text-[#00e676]">{selectedCountry}</strong>
              </p>
            </div>

            {/* Scrollable list of cities */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {(CITIES_BY_COUNTRY[selectedCountry] || []).map((city, idx) => {
                const colorClass = BITLIFE_COLORS[idx % BITLIFE_COLORS.length];
                const isSpecial = CITY_BONUSES[city] !== undefined;
                return (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      triggerSound('click');
                      setActiveSubScreen('hub');
                    }}
                    className={`w-full rounded-[2rem] border-[3px] border-white bg-gradient-to-r ${colorClass} text-white font-black py-3.5 px-6 shadow-md transition duration-150 active:scale-95 text-left cursor-pointer flex flex-col justify-center`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-base uppercase tracking-wider font-extrabold">{city}</span>
                      {isSpecial && <span className="bg-white text-slate-950 font-black text-[8px] px-2 py-0.5 rounded-full border border-yellow-400 animate-pulse">BONUS 🌟</span>}
                    </div>
                    {isSpecial && (
                      <p className="text-[9px] text-white/90 font-medium font-mono mt-1 leading-tight">
                        {CITY_BONUSES[city]}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* --- PICK YOUR NAME --- */}
        {activeSubScreen === 'name' && (
          <div className="flex-1 flex flex-col justify-between p-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800 shrink-0">
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('hub'); }}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-200">Name Customizer</h2>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col justify-center space-y-6 max-w-sm mx-auto w-full px-4">
              
              <div className="text-center">
                <span className="text-4xl animate-pulse block mb-2">✏️</span>
                <h3 className="text-xl font-extrabold text-white">Pick your name!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Type a custom name, or click Dice to randomize.
                </p>
              </div>

              {/* Input & Re-roll */}
              <div className="space-y-4">
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name..."
                    className="flex-1 px-4 py-3 bg-slate-900 border-2 border-slate-700 text-white rounded-2xl focus:border-[#00e676] focus:ring-0 text-sm font-bold tracking-wide transition uppercase"
                    maxLength={35}
                  />
                  <button
                    onClick={() => {
                      const list = gender === 'Male' ? MALE_NAMES : FEMALE_NAMES;
                      const randomFirst = list[Math.floor(Math.random() * list.length)];
                      const randomLast = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
                      setName(`${randomFirst} ${randomLast}`);
                      triggerSound('click');
                    }}
                    className="px-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 text-white rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Randomize Name"
                  >
                    <Shuffle size={16} />
                  </button>
                </div>

                {/* Quick select first/last defaults */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      const list = gender === 'Male' ? MALE_NAMES : FEMALE_NAMES;
                      const randomFirst = list[Math.floor(Math.random() * list.length)];
                      const currentLast = name.includes(' ') ? name.split(' ').slice(1).join(' ') : SURNAMES[0];
                      setName(`${randomFirst} ${currentLast}`);
                      triggerSound('click');
                    }}
                    className="text-[10px] font-black uppercase tracking-wider font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2.5 py-1 hover:bg-indigo-950 transition"
                  >
                    🎲 Reroll First Name
                  </button>
                  <button
                    onClick={() => {
                      const randomLast = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
                      const currentFirst = name.includes(' ') ? name.split(' ')[0] : (gender === 'Male' ? MALE_NAMES[0] : FEMALE_NAMES[0]);
                      setName(`${currentFirst} ${randomLast}`);
                      triggerSound('click');
                    }}
                    className="text-[10px] font-black uppercase tracking-wider font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2.5 py-1 hover:bg-indigo-950 transition"
                  >
                    🎲 Reroll Surname
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-6 shrink-0">
              <button
                disabled={!name.trim()}
                onClick={() => { triggerSound('success'); setActiveSubScreen('hub'); }}
                className={`w-full rounded-full border-[3px] border-white font-black py-3.5 px-6 shadow-md uppercase tracking-wider text-base transition duration-150 active:scale-95 cursor-pointer flex items-center justify-center ${
                  name.trim() 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                }`}
              >
                Confirm Name
              </button>
            </div>

          </div>
        )}

        {/* --- GOD MODE: CUSTOM APPEARANCE & STATS --- */}
        {activeSubScreen === 'custom_attributes' && (
          <div className="flex-1 flex flex-col p-5 min-h-0 overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <button 
                onClick={() => { triggerSound('click'); setActiveSubScreen('hub'); }}
                className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-white cursor-pointer uppercase tracking-wider"
              >
                <ArrowLeft size={16} />
                <span>Hub</span>
              </button>
              <h2 className="text-xs font-black uppercase tracking-widest text-[#ffd600] font-mono">⚡ Start Customizer</h2>
            </div>

            {/* Customized Avatar Circular Frame */}
            <div className="flex flex-col items-center justify-center mb-6 shrink-0 bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 rounded-3xl border border-slate-800 relative shadow-inner">
              
              <div className="w-32 h-32 bg-slate-800 border-4 border-[#ffab00] rounded-full flex items-center justify-center overflow-hidden shadow-2xl relative mb-4 z-10 ring-4 ring-slate-950">
                <CharacterAvatar config={currentAvatarConfig} gender={gender} age={25} />
                
                {editorTab !== 'skin' && (
                  <>
                    <button 
                      onClick={() => {
                        triggerSound('click');
                        if (editorTab === 'eyes') {
                          const opts = ['default', 'happy', 'surprised', 'wink', 'squint', 'hearts'];
                          const idx = opts.indexOf(eyes);
                          setEyes(opts[(idx - 1 + opts.length) % opts.length]);
                        } else if (editorTab === 'brows') {
                          const opts = ['default', 'defaultNatural', 'flatNatural', 'raisedExcited', 'angry', 'sadConcerned'];
                          const idx = opts.indexOf(eyebrows);
                          setEyebrows(opts[(idx - 1 + opts.length) % opts.length]);
                        } else if (editorTab === 'mouth') {
                          const opts = ['smile', 'default', 'serious', 'concerned', 'grimace', 'sad', 'tongue'];
                          const idx = opts.indexOf(mouth);
                          setMouth(opts[(idx - 1 + opts.length) % opts.length]);
                        } else if (editorTab === 'hair') {
                          const opts = gender === 'Male' ? 
                            ['shortRound', 'sides', 'dreads', 'shaggy', 'curly', 'frizzle', 'noHair', 'straight2', 'straightAndCurly', 'longHair'] :
                            ['straight2', 'straightAndCurly', 'longHair', 'curly', 'frizzle', 'shaggy', 'shortRound', 'sides', 'noHair'];
                          const idx = opts.indexOf(top);
                          setTop(opts[(idx - 1 + opts.length) % opts.length]);
                        } else if (editorTab === 'facialHair') {
                          if (gender === 'Male') {
                            const opts = ['none', 'beardLight', 'beardMedium', 'beardMajestic', 'moustacheFancy'];
                            const idx = opts.indexOf(facialHair);
                            setFacialHair(opts[(idx - 1 + opts.length) % opts.length]);
                          } else {
                            const opts = ['None', 'Classic Eyeliner', 'Rosy Blush', 'Gilded Eyeshadow', 'Nude Glow'];
                            const idx = opts.indexOf(makeupSimulated);
                            setMakeupSimulated(opts[(idx - 1 + opts.length) % opts.length]);
                          }
                        }
                      }}
                      className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/90 text-white rounded-full transition-all border border-white/20"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        triggerSound('click');
                        if (editorTab === 'eyes') {
                          const opts = ['default', 'happy', 'surprised', 'wink', 'squint', 'hearts'];
                          const idx = opts.indexOf(eyes);
                          setEyes(opts[(idx + 1) % opts.length]);
                        } else if (editorTab === 'brows') {
                          const opts = ['default', 'defaultNatural', 'flatNatural', 'raisedExcited', 'angry', 'sadConcerned'];
                          const idx = opts.indexOf(eyebrows);
                          setEyebrows(opts[(idx + 1) % opts.length]);
                        } else if (editorTab === 'mouth') {
                          const opts = ['smile', 'default', 'serious', 'concerned', 'grimace', 'sad', 'tongue'];
                          const idx = opts.indexOf(mouth);
                          setMouth(opts[(idx + 1) % opts.length]);
                        } else if (editorTab === 'hair') {
                          const opts = gender === 'Male' ? 
                            ['shortRound', 'sides', 'dreads', 'shaggy', 'curly', 'frizzle', 'noHair', 'straight2', 'straightAndCurly', 'longHair'] :
                            ['straight2', 'straightAndCurly', 'longHair', 'curly', 'frizzle', 'shaggy', 'shortRound', 'sides', 'noHair'];
                          const idx = opts.indexOf(top);
                          setTop(opts[(idx + 1) % opts.length]);
                        } else if (editorTab === 'facialHair') {
                          if (gender === 'Male') {
                            const opts = ['none', 'beardLight', 'beardMedium', 'beardMajestic', 'moustacheFancy'];
                            const idx = opts.indexOf(facialHair);
                            setFacialHair(opts[(idx + 1) % opts.length]);
                          } else {
                            const opts = ['None', 'Classic Eyeliner', 'Rosy Blush', 'Gilded Eyeshadow', 'Nude Glow'];
                            const idx = opts.indexOf(makeupSimulated);
                            setMakeupSimulated(opts[(idx + 1) % opts.length]);
                          }
                        }
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/90 text-white rounded-full transition-all border border-white/20"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              <div className="text-center mb-4 z-10 w-full flex items-center justify-center flex-col">
                <span className="text-[9px] text-[#ffab00] font-black uppercase tracking-widest bg-[#ffab00]/10 px-2 py-0.5 rounded-full border border-[#ffab00]/30 mb-2">
                  {editorTab === 'eyes' ? 'Eye Expression' : 
                   editorTab === 'skin' ? 'Skin Tone' :
                   editorTab === 'brows' ? 'Eyebrow Expression' :
                   editorTab === 'hair' ? 'Hair Style' :
                   editorTab === 'mouth' ? 'Mouth Expression' :
                   gender === 'Male' ? 'Facial Hair' : 'Makeup'}
                </span>
                
                {/* Active Style Label (if applicable) */}
                {editorTab !== 'skin' && (
                  <div className="text-xs font-bold text-white uppercase tracking-wider h-4">
                    {editorTab === 'eyes' ? ['Normal', 'Happy', 'Surprise', 'Wink', 'Squint', 'Hearts'][['default', 'happy', 'surprised', 'wink', 'squint', 'hearts'].indexOf(eyes)] :
                     editorTab === 'brows' ? ['Classic', 'Thick', 'Flat', 'Raised', 'Angry', 'Sad'][['default', 'defaultNatural', 'flatNatural', 'raisedExcited', 'angry', 'sadConcerned'].indexOf(eyebrows)] :
                     editorTab === 'mouth' ? ['Smile', 'Neutral', 'Serious', 'Concern', 'Grimace', 'Frown', 'Playful'][['smile', 'default', 'serious', 'concerned', 'grimace', 'sad', 'tongue'].indexOf(mouth)] :
                     editorTab === 'hair' ? (gender === 'Male' ? ['Crop', 'Buzz', 'Dreads', 'Shaggy', 'Curly', 'Afro', 'Bald', 'Straight', 'Bob', 'Flow'][['shortRound', 'sides', 'dreads', 'shaggy', 'curly', 'frizzle', 'noHair', 'straight2', 'straightAndCurly', 'longHair'].indexOf(top)] : ['Straight', 'Bob', 'Flow', 'Curly', 'Afro', 'Shaggy', 'Crop', 'Buzz', 'Bald'][['straight2', 'straightAndCurly', 'longHair', 'curly', 'frizzle', 'shaggy', 'shortRound', 'sides', 'noHair'].indexOf(top)]) :
                     editorTab === 'facialHair' ? (gender === 'Male' ? ['Clean Shaven', 'Stubble', 'Medium', 'Majestic', 'Fancy Mustache'][['none', 'beardLight', 'beardMedium', 'beardMajestic', 'moustacheFancy'].indexOf(facialHair)] : ['Natural', 'Eyeliner', 'Blush', 'Shadow', 'Nude Gloss Glow'][['None', 'Classic Eyeliner', 'Rosy Blush', 'Gilded Eyeshadow', 'Nude Glow'].indexOf(makeupSimulated)]) : ''}
                  </div>
                )}
              </div>

              {/* Color Selection Palette */}
              <div className="h-14 flex items-center justify-center w-full z-10">
                {editorTab === 'skin' && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { value: 'ffdbb4', label: 'Fair', bg: '#ffdbb4' },
                      { value: 'edb98a', label: 'Peach', bg: '#edb98a' },
                      { value: 'd08b5b', label: 'Olive', bg: '#d08b5b' },
                      { value: 'ae5d29', label: 'Bronze', bg: '#ae5d29' },
                      { value: '614335', label: 'Dark', bg: '#614335' },
                      { value: 'f8d25c', label: 'Golden', bg: '#f8d25c' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => { triggerSound('click'); setSkinColor(color.value); }}
                        className={`w-10 h-10 rounded-xl border-4 transition-all shadow-sm ${skinColor === color.value ? 'border-white scale-110 shadow-lg ring-2 ring-white/20' : 'border-slate-900 hover:scale-105 hover:border-slate-700'}`}
                        style={{ backgroundColor: color.bg }}
                        title={color.label}
                      />
                    ))}
                  </div>
                )}
                
                {editorTab === 'eyes' && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { name: 'Brown', hex: '#4e2f1d' },
                      { name: 'Blue', hex: '#2e6b9e' },
                      { name: 'Green', hex: '#3d8c40' },
                      { name: 'Hazel', hex: '#7a703d' },
                      { name: 'Amber', hex: '#b0811e' },
                      { name: 'Grey', hex: '#707a7e' }
                    ].map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => { triggerSound('click'); setEyesColorSimulated(color.name); }}
                        className={`w-10 h-10 rounded-xl border-4 transition-all shadow-sm ${eyesColorSimulated === color.name ? 'border-white scale-110 shadow-lg ring-2 ring-white/20' : 'border-slate-900 hover:scale-105 hover:border-slate-700'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
                
                {editorTab === 'mouth' && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { name: 'Natural', hex: '#e8a397' },
                      { name: 'Coral Pink', hex: '#f57d76' },
                      { name: 'Ruby Red', hex: '#c41829' },
                      { name: 'Peach Gloss', hex: '#e89058' },
                      { name: 'Dark Plum', hex: '#631835' }
                    ].map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => { triggerSound('click'); setLipsColorSimulated(color.name); }}
                        className={`w-10 h-10 rounded-xl border-4 transition-all shadow-sm ${lipsColorSimulated === color.name ? 'border-white scale-110 shadow-lg ring-2 ring-white/20' : 'border-slate-900 hover:scale-105 hover:border-slate-700'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
                
                {editorTab === 'hair' && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { value: '2c1b18', label: 'Jet Black', hex: '#2c1b18' },
                      { value: '4a3728', label: 'Dark Brown', hex: '#4a3728' },
                      { value: 'b58143', label: 'Blonde', hex: '#b58143' },
                      { value: 'c93305', label: 'Auburn/Red', hex: '#c93305' },
                      { value: '726f70', label: 'Silver/Grey', hex: '#726f70' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => {
                          triggerSound('click');
                          setHairColor(color.value);
                          setFacialHairColor(color.value);
                        }}
                        className={`w-10 h-10 rounded-xl border-4 transition-all shadow-sm ${hairColor === color.value ? 'border-white scale-110 shadow-lg ring-2 ring-white/20' : 'border-slate-900 hover:scale-105 hover:border-slate-700'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Customizer Tabs & Controllers */}
            <div className="space-y-4 flex-1">
              
              {/* Tabs Row */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-1.5 flex flex-wrap gap-1">
                {[
                  { id: 'eyes', label: 'Eyes' },
                  { id: 'skin', label: 'Skin' },
                  { id: 'brows', label: 'Brows' },
                  { id: 'hair', label: 'Hair' },
                  { id: 'mouth', label: 'Mouth' },
                  { id: 'facialHair', label: gender === 'Male' ? 'Beard' : 'Makeup' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { triggerSound('click'); setEditorTab(tab.id as any); }}
                    className={`flex-1 min-w-[30%] py-2.5 text-[10px] font-black uppercase tracking-widest transition rounded-xl ${
                      editorTab === tab.id
                        ? 'bg-[#ffab00] text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { triggerSound('click'); setActiveSubScreen('hub'); }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg active:scale-95"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { triggerSound('success'); handleRandomizeAvatar(); }}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-lg uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg active:scale-95 flex items-center justify-center border border-slate-700"
                  title="Randomize Appearance"
                >
                  🎲
                </button>
              </div>

              <div className="h-4" /> {/* Spacer */}
              {/* Point Buy / Slider Attribute Distribution (God Mode Style) */}
              <div className="space-y-4 bg-slate-900/90 p-4 border border-slate-800 rounded-3xl">
                <div className="border-b border-slate-800 pb-2 text-center">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#ffd600] font-mono">
                    Select your attributes!
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Discipline */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>🚴 Discipline</span>
                      <span className="font-mono text-white text-xs">{discipline}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={discipline}
                      onChange={(e) => {
                        setDiscipline(Number(e.target.value));
                        if (Number(e.target.value) % 10 === 0) triggerSound('click');
                      }}
                      className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ffd600] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Fertility */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>🧬 Fertility</span>
                      <span className="font-mono text-white text-xs">{fertility}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={fertility}
                      onChange={(e) => {
                        setFertility(Number(e.target.value));
                        if (Number(e.target.value) % 10 === 0) triggerSound('click');
                      }}
                      className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ffd600] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Happiness */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>😄 Happiness</span>
                      <span className="font-mono text-white text-xs">{stats.happiness}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={stats.happiness}
                      onChange={(e) => {
                        setStats(prev => ({ ...prev, happiness: Number(e.target.value) }));
                        if (Number(e.target.value) % 10 === 0) triggerSound('click');
                      }}
                      className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ffd600] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Health */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>❤️ Health</span>
                      <span className="font-mono text-white text-xs">{stats.health}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={stats.health}
                      onChange={(e) => {
                        setStats(prev => ({ ...prev, health: Number(e.target.value) }));
                        if (Number(e.target.value) % 10 === 0) triggerSound('click');
                      }}
                      className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ffd600] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Karma */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>🧘 Karma</span>
                      <span className="font-mono text-white text-xs">{karma}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={karma}
                      onChange={(e) => {
                        setKarma(Number(e.target.value));
                        if (Number(e.target.value) % 10 === 0) triggerSound('click');
                      }}
                      className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ffd600] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Looks */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>✨ Looks</span>
                      <span className="font-mono text-white text-xs">{stats.looks}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={stats.looks}
                      onChange={(e) => {
                        setStats(prev => ({ ...prev, looks: Number(e.target.value) }));
                        if (Number(e.target.value) % 10 === 0) triggerSound('click');
                      }}
                      className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ffd600] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Sexuality Choice */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>🌈 Sexuality</span>
                      <span className="font-mono text-white text-xs uppercase tracking-wide font-black">{sexuality}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg">
                      {['Straight', 'Bisexual', 'Gay'].map((sex) => (
                        <button
                          key={sex}
                          type="button"
                          onClick={() => { triggerSound('click'); setSexuality(sex); }}
                          className={`py-1 text-[9px] font-black uppercase tracking-wider transition duration-100 rounded ${
                            sexuality === sex 
                              ? 'bg-[#ffab00] text-slate-950 font-black' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          {sex}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smarts */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>🧠 Smarts</span>
                      <span className="font-mono text-white text-xs">{stats.smarts}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={stats.smarts}
                      onChange={(e) => {
                        setStats(prev => ({ ...prev, smarts: Number(e.target.value) }));
                        if (Number(e.target.value) % 10 === 0) triggerSound('click');
                      }}
                      className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ffd600] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Willpower */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#ffd600]">
                      <span>💪 Willpower</span>
                      <span className="font-mono text-white text-xs">{willpower}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={willpower}
                      onChange={(e) => {
                        setWillpower(Number(e.target.value));
                        if (Number(e.target.value) % 10 === 0) triggerSound('click');
                      }}
                      className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ffd600] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-4 shrink-0">
              <button
                onClick={() => { triggerSound('success'); setActiveSubScreen('hub'); }}
                className="w-full rounded-full border-[3px] border-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black py-3 px-6 shadow-md uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                Save Starting Genes 💾
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
