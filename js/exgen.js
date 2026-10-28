// Aufgaben-Generator (DOM-frei, deterministisch per Seed). Renderer: js/exercises.js.
import { rng, shuffle, norm, words } from './util.js';

export const CHOICE_TYPES = ['listen', 'pic', 'de2es'];

/** Wort-Kacheln für „Satz bauen“: an Leerzeichen getrennt, Satzzeichen bleiben am Wort. */
export function tilesOf(es) {
  return String(es).trim().split(/\s+/);
}

export function canBuild(item) {
  const n = tilesOf(item.es).length;
  return n >= 3 && n <= 9;
}

/** Ablenker: zuerst aus derselben Lektion, dann aus früheren; nie gleicher Text/Emoji. */
export function distractors(target, sameLesson, earlier, n, rand, type) {
  const ok = (it) =>
    it.id !== target.id &&
    norm(it.es) !== norm(target.es) &&
    norm(it.de) !== norm(target.de) &&
    (type !== 'pic' || it.emoji !== target.emoji);
  const out = [];
  const seen = new Set();
  const add = (it) => {
    const keys = [norm(it.es), norm(it.de), type === 'pic' ? it.emoji : ''];
    if (keys.some((k) => k && seen.has(k))) return;
    keys.forEach((k) => k && seen.add(k));
    out.push(it);
  };
  for (const it of shuffle(sameLesson.filter(ok), rand)) if (out.length < n) add(it);
  for (const it of shuffle(earlier.filter(ok), rand)) if (out.length < n) add(it);
  return out;
}

function choice(type, item, same, earlier, rand) {
  const ds = distractors(item, same, earlier, 3, rand, type);
  if (ds.length < 2) return null;
  return { type, id: item.id, options: shuffle([item.id, ...ds.map((d) => d.id)], rand) };
}

function build(item, pool, rand) {
  const tiles = tilesOf(item.es);
  const extra = [];
  const cand = shuffle(pool.filter((p) => p.id !== item.id).flatMap((p) => tilesOf(p.es)), rand);
  for (const w of cand) {
    if (extra.length >= 2) break;
    if (w.includes('{') || tiles.some((t) => norm(t) === norm(w)) || extra.some((e) => norm(e) === norm(w))) continue;
    extra.push(w);
  }
  return { type: 'build', id: item.id, tiles: shuffle([...tiles, ...extra], rand) };
}

function pairs(items, rand) {
  const chosen = [];
  for (const it of shuffle(items, rand)) {
    if (chosen.length >= 5) break;
    if (chosen.some((c) => norm(c.es) === norm(it.es) || norm(c.de) === norm(it.de))) continue;
    chosen.push(it);
  }
  if (chosen.length < 4) return null;
  const ids = chosen.map((c) => c.id);
  return { type: 'pairs', ids, left: shuffle(ids, rand), right: shuffle(ids, rand) };
}

/** Eine Auswahl-Aufgabe, Typ mit Fallback (Bild → Deutsch→Spanisch, falls Emojis nicht reichen). */
function choiceWithFallback(type, item, same, earlier, rand) {
  const order = [type, ...CHOICE_TYPES.filter((t) => t !== type)];
  for (const t of order) {
    const ex = choice(t, item, same, earlier, rand);
    if (ex) return ex;
  }
  return null;
}

/**
 * Übungen für eine Lektion (ca. 10–14): je Item eine Auswahl-Aufgabe, bis zu 2× Satz bauen,
 * 1× Paare, 2× Nachsprechen. `earlier` = Items früherer Lektionen.
 */
export function lessonExercises(lesson, earlier, seed) {
  const rand = rng(seed);
  const items = lesson.items;
  const out = [];
  const offset = Math.floor(rand() * 3);
  shuffle(items, rand).forEach((it, i) => {
    const ex = choiceWithFallback(CHOICE_TYPES[(i + offset) % 3], it, items, earlier, rand);
    if (ex) out.push(ex);
  });
  const buildable = shuffle(items.filter(canBuild), rand).slice(0, 2);
  buildable.forEach((it) => out.push(build(it, [...items, ...earlier], rand)));
  const pr = pairs(items, rand);
  if (pr) out.push(pr);
  const speakable = shuffle(items.filter((it) => tilesOf(it.es).length >= 2), rand);
  (speakable.length >= 2 ? speakable : shuffle(items, rand)).slice(0, 2).forEach((it) => out.push({ type: 'speak', id: it.id }));

  // Mischen, aber leicht anfangen (Hören/Bild) und Paare nicht ganz vorn.
  let mixed = shuffle(out, rand);
  const easy = mixed.findIndex((e) => e.type === 'listen' || e.type === 'pic');
  if (easy > 0) mixed = [mixed[easy], ...mixed.slice(0, easy), ...mixed.slice(easy + 1)];
  const pi = mixed.findIndex((e) => e.type === 'pairs');
  if (pi >= 0 && pi < 3 && mixed.length > 4) {
    const [p] = mixed.splice(pi, 1);
    mixed.splice(Math.min(5, mixed.length), 0, p);
  }
  return mixed.slice(0, 14);
}

/** Wiederholung: eine Aufgabe je Item (gemischte Typen), Ablenker aus allen gelernten Items. */
export function reviewExercises(items, pool, seed) {
  const rand = rng(seed);
  return items.map((it, i) => {
    const r = rand();
    if (canBuild(it) && r < 0.25) return build(it, pool, rand);
    return choiceWithFallback(CHOICE_TYPES[(i + Math.floor(r * 3)) % 3], it, [], pool, rand);
  }).filter(Boolean);
}

/** Abschluss-Wiederholung einer Einheit: Paare + gemischte Aufgaben. */
export function unitExercises(unitItems, earlier, seed, n = 5) {
  const rand = rng(seed);
  const picked = shuffle(unitItems, rand).slice(0, n);
  const out = picked.map((it, i) => choiceWithFallback(CHOICE_TYPES[i % 3], it, unitItems, earlier, rand)).filter(Boolean);
  const pr = pairs(unitItems, rand);
  if (pr) out.push(pr);
  return out;
}

/** Prüft „Satz bauen“: gewählte Kacheln ergeben exakt den Satz (Groß/Klein & Satzzeichen tolerant). */
export function checkBuild(item, chosen) {
  return words(chosen.join(' ')).join(' ') === words(item.es).join(' ');
}
