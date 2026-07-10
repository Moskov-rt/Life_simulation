/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Custom Synthesizer using Web Audio API for latency-free UI feedback
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playClick = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

export const playSuccess = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const playTone = (freq: number, start: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.06, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration - 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + duration);
  };

  // Play an ascending major triad
  playTone(261.63, now, 0.15); // C4
  playTone(329.63, now + 0.1, 0.15); // E4
  playTone(392.00, now + 0.2, 0.2); // G4
  playTone(523.25, now + 0.3, 0.3); // C5
};

export const playError = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(110, ctx.currentTime);
  osc.frequency.setValueAtTime(90, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

export const playAgeUp = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.5);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(110, now);
  osc2.frequency.exponentialRampToValueAtTime(220, now + 0.5);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc2.start();
  osc.stop(now + 0.6);
  osc2.stop(now + 0.6);
};
