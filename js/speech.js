// Vorlesen (speechSynthesis) + Aufnehmen/Abspielen (MediaRecorder). Kein SpeechRecognition (iOS-Home-Screen).

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
const cfg = { rate: 0.9, voice: 'es-ES' };
export const SLOW_RATE = 0.6;

export function configure({ rate, voice } = {}) {
  if (rate) cfg.rate = rate;
  if (voice) cfg.voice = voice;
}

export function hasTTS() {
  return !!synth && typeof window.SpeechSynthesisUtterance === 'function';
}

function allVoices() {
  try { return synth ? synth.getVoices() : []; } catch (e) { return []; }
}

const langOf = (v) => String(v.lang || '').replace('_', '-').toLowerCase();

export function spanishVoices() {
  return allVoices().filter((v) => langOf(v).startsWith('es'));
}

/** Stimme wählen: genaue Region (bevorzugt Mónica / Paulina), sonst irgendeine spanische. */
export function pickVoice(pref = cfg.voice) {
  const es = spanishVoices();
  if (!es.length) return null;
  const want = pref.toLowerCase();
  const fav = want === 'es-mx' ? /paulina/i : /m[oó]nica/i;
  const exact = es.filter((v) => langOf(v) === want);
  return exact.find((v) => fav.test(v.name)) || exact.find((v) => v.localService) || exact[0] ||
    (want === 'es-mx' ? es.find((v) => /-(us|419|mx|co|ar)/.test(langOf(v))) : null) || es[0];
}

/** Welche Regionen gibt es auf dem Gerät? */
export function availableRegions() {
  const langs = spanishVoices().map(langOf);
  return { ES: langs.includes('es-es'), MX: langs.includes('es-mx') || langs.some((l) => /-(us|419)/.test(l)), any: langs.length > 0 };
}

const voiceListeners = new Set();
/** Benachrichtigung, wenn die Stimmen (auf iOS verzögert) geladen sind. Gibt eine Abmelde-Funktion zurück. */
export function onVoices(fn) {
  voiceListeners.add(fn);
  return () => voiceListeners.delete(fn);
}
if (synth) {
  const fire = () => voiceListeners.forEach((fn) => fn());
  if (synth.addEventListener) synth.addEventListener('voiceschanged', fire);
  else synth.onvoiceschanged = fire;
}

let unlocked = false;
/** iOS: Erste Ausgabe nur nach Nutzer-Tipp – leise „Leer-Ausgabe“ im ersten Tipp. */
export function unlock() {
  if (unlocked || !hasTTS()) return;
  unlocked = true;
  try {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    synth.speak(u);
  } catch (e) { /* egal */ }
}

/** Spanisch vorlesen. Gibt ein Promise zurück, das am Ende (oder bei Fehler) erfüllt wird. */
export function speak(text, { slow = false } = {}) {
  return new Promise((resolve) => {
    if (!hasTTS() || !text) return resolve(false);
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) u.voice = v;
      u.lang = v ? v.lang : cfg.voice;
      u.rate = slow ? SLOW_RATE : cfg.rate;
      let done = false;
      const end = (ok) => { if (!done) { done = true; resolve(ok); } };
      u.onend = () => end(true);
      u.onerror = () => end(false);
      setTimeout(() => end(true), 1500 + text.length * 160); // iOS meldet „end“ nicht immer
      synth.speak(u);
    } catch (e) {
      resolve(false);
    }
  });
}

export function stopSpeaking() {
  try { synth && synth.cancel(); } catch (e) { /* egal */ }
}

// ── Aufnahme ──

export function canRecord() {
  return typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) &&
    typeof window.MediaRecorder === 'function';
}

function mimeType() {
  const MR = window.MediaRecorder;
  if (!MR.isTypeSupported) return '';
  for (const t of ['audio/mp4', 'audio/mp4;codecs=mp4a.40.2', 'audio/aac', 'audio/webm;codecs=opus', 'audio/webm']) {
    if (MR.isTypeSupported(t)) return t;
  }
  return '';
}

/**
 * Startet eine Aufnahme (max. ms). → { stop(), result: Promise<url|null> }
 * Wirft, wenn das Mikrofon nicht erlaubt/vorhanden ist.
 */
export async function startRecording(ms = 6000) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const type = mimeType();
  const rec = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream);
  const chunks = [];
  let timer;
  const result = new Promise((resolve) => {
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      clearTimeout(timer);
      stream.getTracks().forEach((t) => t.stop());
      if (!chunks.length) return resolve(null);
      resolve(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || type || 'audio/mp4' })));
    };
    rec.onerror = () => { stream.getTracks().forEach((t) => t.stop()); resolve(null); };
  });
  rec.start();
  timer = setTimeout(() => { if (rec.state !== 'inactive') rec.stop(); }, ms);
  return {
    stop() { if (rec.state !== 'inactive') rec.stop(); },
    result,
  };
}

let player;
export function playUrl(url) {
  return new Promise((resolve) => {
    try {
      if (player) player.pause();
      player = new Audio(url);
      player.onended = () => resolve(true);
      player.onerror = () => resolve(false);
      const p = player.play();
      if (p && p.catch) p.catch(() => resolve(false));
    } catch (e) {
      resolve(false);
    }
  });
}
