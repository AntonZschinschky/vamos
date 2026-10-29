// Fortschritt in localStorage['vamos.v1'] – laden, speichern, migrieren, sichern (DATA.md).
import { today } from './util.js';

export const KEY = 'vamos.v1';
export const VERSION = 1;

export function defaultState(day = today()) {
  return {
    v: VERSION,
    started: day,
    lessonsDone: [],
    finalesDone: [],
    srs: {},
    cards: {},
    sinceGold: 0,
    goldStreakGiven: false,
    streak: { count: 0, last: null, jokerWeek: null, jokerUsed: false },
    days: {},
    session: null,
    settings: { name: '', rate: 0.9, voice: 'es-ES', sound: true, micExplained: false },
    onboarded: false,
  };
}

const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);

/** Bringt beliebige (alte/teilweise) Daten auf das aktuelle Schema – verliert nie vorhandene Werte. */
export function migrate(raw, day = today()) {
  const base = defaultState(day);
  if (!isObj(raw)) return base;
  const s = { ...base, ...raw };
  // Zukünftige Migrationen: if ((raw.v || 0) < 2) { … }
  s.v = VERSION;
  for (const k of ['lessonsDone', 'finalesDone']) s[k] = Array.isArray(raw[k]) ? raw[k].slice() : [];
  for (const k of ['srs', 'cards', 'days']) s[k] = isObj(raw[k]) ? { ...raw[k] } : {};
  s.streak = { ...base.streak, ...(isObj(raw.streak) ? raw.streak : {}) };
  s.settings = { ...base.settings, ...(isObj(raw.settings) ? raw.settings : {}) };
  s.sinceGold = Number.isFinite(raw.sinceGold) ? raw.sinceGold : 0;
  s.session = isObj(raw.session) ? raw.session : null;
  s.onboarded = !!raw.onboarded;
  s.goldStreakGiven = !!raw.goldStreakGiven;
  return s;
}

function defaultStorage() {
  try { return globalThis.localStorage || null; } catch (e) { return null; }
}

export function load(storage = defaultStorage()) {
  let raw = null;
  try {
    const txt = storage && storage.getItem(KEY);
    raw = txt ? JSON.parse(txt) : null;
  } catch (e) {
    // Kaputte Daten nicht überschreiben, sondern beiseitelegen.
    try { storage.setItem(KEY + '.broken.' + Date.now(), storage.getItem(KEY)); } catch (e2) { /* egal */ }
  }
  return migrate(raw);
}

export function save(state, storage = defaultStorage()) {
  try {
    storage && storage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

/** Bittet den Browser, die Daten nicht automatisch zu löschen. */
export function persist() {
  try {
    if (globalThis.navigator && navigator.storage && navigator.storage.persist) {
      return navigator.storage.persist().catch(() => false);
    }
  } catch (e) { /* egal */ }
  return Promise.resolve(false);
}

// ── Sicherung als Code (Base64 von JSON, UTF-8-sicher) ──
export function exportCode(state) {
  const json = JSON.stringify({ ...state, session: null });
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return 'VAMOS1-' + btoa(bin);
}

export function importCode(code) {
  const clean = String(code || '').trim().replace(/^VAMOS1-/, '').replace(/\s+/g, '');
  if (!clean) throw new Error('Kein Code eingefügt.');
  let data;
  try {
    const bin = atob(clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    data = JSON.parse(new TextDecoder().decode(bytes));
  } catch (e) {
    throw new Error('Der Code ist unvollständig oder beschädigt.');
  }
  if (!isObj(data) || !Array.isArray(data.lessonsDone)) throw new Error('Das ist kein ¡Vamos!-Code.');
  return migrate(data);
}
