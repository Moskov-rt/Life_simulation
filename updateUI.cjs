const fs = require('fs');

const path = 'src/components/CharacterCreator.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetBlock = code.substring(
  code.indexOf("{/* --- GOD MODE: CUSTOM APPEARANCE & STATS --- */}"),
  code.indexOf("              {/* Point Buy / Slider Attribute Distribution")
);

const newBlock = `{/* --- GOD MODE: CUSTOM APPEARANCE & STATS --- */}
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
                <img
                  src={getAvatarUrl(currentAvatarConfig, 25, gender)}
                  alt="Character Avatar Preview"
                  className="w-full h-full object-cover select-none transform scale-125 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                
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
                        className={\`w-10 h-10 rounded-xl border-4 transition-all shadow-sm \${skinColor === color.value ? 'border-white scale-110 shadow-lg ring-2 ring-white/20' : 'border-slate-900 hover:scale-105 hover:border-slate-700'}\`}
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
                        className={\`w-10 h-10 rounded-xl border-4 transition-all shadow-sm \${eyesColorSimulated === color.name ? 'border-white scale-110 shadow-lg ring-2 ring-white/20' : 'border-slate-900 hover:scale-105 hover:border-slate-700'}\`}
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
                        className={\`w-10 h-10 rounded-xl border-4 transition-all shadow-sm \${lipsColorSimulated === color.name ? 'border-white scale-110 shadow-lg ring-2 ring-white/20' : 'border-slate-900 hover:scale-105 hover:border-slate-700'}\`}
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
                        className={\`w-10 h-10 rounded-xl border-4 transition-all shadow-sm \${hairColor === color.value ? 'border-white scale-110 shadow-lg ring-2 ring-white/20' : 'border-slate-900 hover:scale-105 hover:border-slate-700'}\`}
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
                    className={\`flex-1 min-w-[30%] py-2.5 text-[10px] font-black uppercase tracking-widest transition rounded-xl \${
                      editorTab === tab.id
                        ? 'bg-[#ffab00] text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }\`}
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
`;

code = code.replace(targetBlock, newBlock);
fs.writeFileSync(path, code);
