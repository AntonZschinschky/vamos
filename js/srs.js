// Wiederholung mit Abstand: Leitner-Boxen 0–5, Abstände 0, 1, 2, 4, 8, 16 Tage (DATA.md).
import { addDays } from './util.js';

export const INTERVALS = [0, 1, 2, 4, 8, 16];
export const MAX_BOX = INTERVALS.length - 1;

/** Neues Wort in Box 0 aufnehmen (fällig sofort). Vorhandene Einträge bleiben. */
export function introduce(srs, ids, day) {
  for (const id of ids) {
    if (!srs[id]) srs[id] = { box: 0, due: day, seen: 0, wrong: 0 };
  }
  return srs;
}

/**
 * Antwort bewerten. Richtig → Box +1 (höchstens einmal pro Tag), falsch → Box 1, morgen wieder.
 * Gibt den neuen Eintrag zurück (und schreibt ihn in srs).
 */
export function grade(srs, id, correct, day) {
  const e = srs[id] || { box: 0, due: day, seen: 0, wrong: 0 };
  const n = { ...e, seen: (e.seen || 0) + 1 };
  if (correct) {
    if (e.last !== day || e.box === 0) n.box = Math.min(MAX_BOX, (e.box || 0) + 1);
    // falls heute schon falsch: bleibt in Box 1, kommt morgen wieder
    if (e.last === day && e.lastWrong) n.box = 1;
  } else {
    n.box = 1;
    n.wrong = (e.wrong || 0) + 1;
  }
  n.lastWrong = !correct || (e.last === day && !!e.lastWrong);
  n.due = addDays(day, INTERVALS[n.box]);
  n.last = day;
  srs[id] = n;
  return n;
}

/** Fällige Wörter (due ≤ heute), die es noch gibt; zuerst die überfälligsten, dann niedrige Box. */
export function dueIds(srs, day, exists = () => true, limit = Infinity) {
  return Object.entries(srs)
    .filter(([id, e]) => e.due <= day && exists(id))
    .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : a[1].box - b[1].box))
    .slice(0, limit)
    .map(([id]) => id);
}

/** Für den Wiederholungsmodus: die „schwächsten“ Wörter, auch wenn noch nicht fällig. */
export function weakestIds(srs, exists = () => true, limit = 8) {
  return Object.entries(srs)
    .filter(([id]) => exists(id))
    .sort((a, b) => a[1].box - b[1].box || (b[1].wrong || 0) - (a[1].wrong || 0) || (a[1].due < b[1].due ? -1 : 1))
    .slice(0, limit)
    .map(([id]) => id);
}
