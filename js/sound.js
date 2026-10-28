// Kurze Töne per WebAudio (keine Dateien). Muss im ersten Tipp „entsperrt“ werden (iOS).
let ctx = null;
let enabled = true;

export function setSound(on) { enabled = !!on; }

export function unlockAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    // stiller Puffer – entsperrt iOS
    const b = ctx.createBuffer(1, 1, 22050);
    const s = ctx.createBufferSource();
    s.buffer = b;
    s.connect(ctx.destination);
    s.start(0);
  } catch (e) { /* egal */ }
}

function tone(freq, start, dur, { type = 'sine', vol = 0.18 } = {}) {
  const t0 = ctx.currentTime + start;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function play(notes) {
  if (!enabled || !ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume();
    notes.forEach(([f, s, d, o]) => tone(f, s, d, o));
  } catch (e) { /* egal */ }
}

export const sfx = {
  right: () => play([[659.25, 0, 0.14], [987.77, 0.09, 0.22]]),
  wrong: () => play([[311.13, 0, 0.22, { type: 'triangle', vol: 0.14 }], [261.63, 0.12, 0.28, { type: 'triangle', vol: 0.12 }]]),
  tap: () => play([[880, 0, 0.05, { vol: 0.06 }]]),
  flip: () => play([[523.25, 0, 0.1, { vol: 0.08 }], [659.25, 0.06, 0.12, { vol: 0.08 }]]),
  done: () => play([[523.25, 0, 0.16], [659.25, 0.12, 0.16], [783.99, 0.24, 0.3]]),
  silver: () => play([[783.99, 0, 0.2], [1046.5, 0.1, 0.35, { vol: 0.12 }]]),
  gold: () => play([[523.25, 0, 0.18], [659.25, 0.1, 0.18], [783.99, 0.2, 0.18], [1046.5, 0.3, 0.5], [1318.5, 0.42, 0.6, { vol: 0.1 }]]),
};
