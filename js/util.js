// Kleine, DOM-freie Hilfsfunktionen (auch in Node-Tests nutzbar).

const pad = (n) => String(n).padStart(2, '0');

/** Lokales Datum als 'YYYY-MM-DD'. */
export function today(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 'YYYY-MM-DD' → Date (lokal, 12 Uhr, damit Sommerzeit egal ist). */
export function parseDay(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

export function addDays(s, n) {
  const d = parseDay(s);
  d.setDate(d.getDate() + n);
  return today(d);
}

/** Ganze Tage von a nach b (b − a). */
export function daysBetween(a, b) {
  return Math.round((parseDay(b) - parseDay(a)) / 86400000);
}

/** ISO-Woche, z. B. '2026-W44'. */
export function isoWeek(s) {
  const d = parseDay(s);
  const day = (d.getDay() + 6) % 7; // Mo = 0
  d.setDate(d.getDate() - day + 3); // Donnerstag dieser Woche
  const year = d.getFullYear();
  const jan4 = new Date(year, 0, 4, 12);
  const week = 1 + Math.round(((d - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
  return `${year}-W${pad(week)}`;
}

/** Deterministischer Zufall (mulberry32). */
export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rand = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick(arr, rand = Math.random) {
  return arr[Math.floor(rand() * arr.length)];
}

export function newSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

/** Klein, ohne Akzente, ohne Satzzeichen – zum Vergleichen von Wörtern. */
export function norm(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿¡.,;:!?«»“”„"'’‘()…\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Wörter eines Satzes (normalisiert). */
export function words(s) {
  const n = norm(s);
  return n ? n.split(' ') : [];
}

/** {name} durch Vornamen ersetzen. */
export function fill(s, name) {
  return s == null ? s : String(s).replace(/\{name\}/g, name || 'Ana');
}
