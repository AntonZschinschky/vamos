#!/usr/bin/env node
// Prüft alle Inhalte gegen docs/DATA.md (+ Vollständigkeit der Service-Worker-Liste).
// Aufruf: node tools/validate.mjs   → Exit-Code 1 bei Fehlern, Warnungen nur zur Info.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { units, news, cards } = await import(join(ROOT, 'data/index.js'));

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`✗ ${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`! ${where}: ${msg}`);
const str = (x) => typeof x === 'string' && x.trim().length > 0;
const need = (obj, keys, where) => keys.forEach((k) => { if (!str(obj[k])) err(where, `Feld „${k}“ fehlt/leer`); });

const COUNTRIES = ['ES', 'MX'];
const RARITIES = ['bronze', 'silver', 'gold'];
const newsIds = new Set();
const ids = { unit: new Set(), lesson: new Set(), item: new Set() };
const unique = (kind, id, where) => {
  if (ids[kind].has(id)) err(where, `${kind}-id „${id}“ doppelt`);
  ids[kind].add(id);
};

// ── Zeitungssätze ──
news.forEach((n, i) => {
  const w = `news[${i}] ${n.id || ''}`;
  need(n, ['id', 'es', 'de', 'source', 'country', 'date'], w);
  if (newsIds.has(n.id)) err(w, 'id doppelt');
  newsIds.add(n.id);
  if (n.date && !/^\d{4}-\d{2}-\d{2}$/.test(n.date)) err(w, 'date muss YYYY-MM-DD sein');
  else if (n.date && !n.date.startsWith('2026') && !n.placeholder) warn(w, 'Satz ist nicht aus 2026');
  if (!n.placeholder && !str(n.url)) warn(w, 'url fehlt');
  if (n.glossary && typeof n.glossary !== 'object') err(w, 'glossary muss ein Objekt sein');
  for (const k of Object.keys(n.glossary || {})) {
    if (k !== k.toLowerCase() || /[¿¡.,;:!?«»“”"]/.test(k)) warn(w, `Glossar-Schlüssel „${k}“ nicht klein/ohne Satzzeichen`);
  }
  const q = n.question;
  if (!q || !str(q.prompt) || !Array.isArray(q.options) || q.options.length < 2) err(w, 'question {prompt, options[≥2], answer} fehlt');
  else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) err(w, 'question.answer ist kein gültiger Index');
});

// ── Szenen ──
function checkScene(sc, where) {
  if (!sc || typeof sc !== 'object') return err(where, 'Szene fehlt');
  need(sc, ['title'], where);
  if (!Array.isArray(sc.lines) || !sc.lines.length) return err(where, 'lines fehlen');
  sc.lines.forEach((l, i) => {
    const w = `${where} Zeile ${i + 1}`;
    if (l.who === 'npc') need(l, ['es', 'de'], w);
    else if (l.who === 'note') need(l, ['de'], w);
    else if (l.who === 'you') {
      if (!Array.isArray(l.options) || l.options.length < 2 || l.options.length > 3) err(w, '2–3 Optionen nötig');
      else {
        const ok = l.options.filter((o) => o.ok === true).length;
        if (ok !== 1) err(w, `genau eine Option ok: true nötig (ist ${ok})`);
        l.options.forEach((o, j) => {
          need(o, ['es', 'de'], `${w} Option ${j + 1}`);
          if (!o.ok && !str(o.why)) warn(`${w} Option ${j + 1}`, '„why“ fehlt');
        });
      }
    } else err(w, `who muss npc | you | note sein (ist „${l.who}“)`);
  });
}

// ── Einheiten ──
units.forEach((u, ui) => {
  const w = `Einheit ${u.id || ui + 1}`;
  need(u, ['id', 'title', 'titleEs', 'place', 'country', 'emoji'], w);
  unique('unit', u.id, w);
  if (!COUNTRIES.includes(u.country)) err(w, `country muss ${COUNTRIES.join('|')} sein`);
  if (!Array.isArray(u.lessons) || !u.lessons.length) return err(w, 'lessons fehlen');
  if (u.lessons.length !== 4) warn(w, `${u.lessons.length} statt 4 Lektionen`);
  checkScene(u.finale, `${w} finale`);
  u.lessons.forEach((l, li) => {
    const lw = `Lektion ${l.id || `${u.id}#${li + 1}`}`;
    need(l, ['id', 'title', 'goal', 'cando', 'situation'], lw);
    unique('lesson', l.id, lw);
    if (!l.tip || !str(l.tip.title) || !str(l.tip.text)) err(lw, 'tip {title, text} fehlt');
    if (!newsIds.has(l.news)) err(lw, `news „${l.news}“ existiert nicht in data/news.js`);
    checkScene(l.scene, `${lw} scene`);
    if (!Array.isArray(l.items) || l.items.length < 5) return err(lw, 'mindestens 5 items nötig (für „Paare finden“)');
    if (l.items.length > 9) warn(lw, `${l.items.length} items (empfohlen 6–9)`);
    l.items.forEach((it, ii) => {
      const iw = `Item ${it.id || `${l.id}#${ii + 1}`}`;
      need(it, ['id', 'es', 'de', 'emoji'], iw);
      unique('item', it.id, iw);
      if (it.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.id)) err(iw, 'id muss kebab-case sein');
      if (it.region && !COUNTRIES.includes(it.region)) err(iw, `region muss ${COUNTRIES.join('|')} sein`);
      if (it.alt && !Array.isArray(it.alt)) err(iw, 'alt muss eine Liste sein');
    });
  });
});

// ── Karten ──
const cardIds = new Set();
cards.forEach((c, i) => {
  const w = `Karte ${c.id || i + 1}`;
  need(c, ['id', 'rarity', 'epoch', 'year', 'title', 'fact'], w);
  if (cardIds.has(c.id)) err(w, 'id doppelt');
  cardIds.add(c.id);
  if (!RARITIES.includes(c.rarity)) err(w, `rarity muss ${RARITIES.join('|')} sein`);
  if (c.image) {
    if (c.image.startsWith('/')) err(w, 'image muss relativ sein (ohne führendes /)');
    else if (!existsSync(join(ROOT, c.image))) (c.placeholder ? warn : err)(w, `Bild fehlt: ${c.image}`);
  } else if (!c.placeholder) err(w, 'image fehlt');
  if (c.image && !c.placeholder && !str(c.imageCredit)) err(w, 'imageCredit fehlt');
  if (!c.placeholder && !str(c.source)) warn(w, 'source fehlt');
});
for (const r of RARITIES) if (!cards.some((c) => c.rarity === r)) warn('Karten', `keine Karte der Stufe ${r}`);

// ── Service Worker: Kern-Dateien vollständig? ──
const sw = readFileSync(join(ROOT, 'sw.js'), 'utf8');
const listed = new Set([...sw.matchAll(/'\.\/([^']*)'/g)].map((m) => m[1]));
const walk = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
for (const dir of ['css', 'js', 'data', 'fonts']) {
  for (const f of walk(dir)) if (!f.endsWith('.gitkeep') && !listed.has(f)) err('sw.js', `${f} fehlt in CORE (offline!)`);
}
for (const f of listed) if (f && !existsSync(join(ROOT, f))) err('sw.js', `CORE-Datei existiert nicht: ${f}`);
if (!/const CACHE = 'vamos-v\d+'/.test(sw)) err('sw.js', "CACHE = 'vamos-vN' fehlt");

// ── Ausgabe ──
const total = units.reduce((n, u) => n + u.lessons.reduce((m, l) => m + l.items.length, 0), 0);
console.log(`Einheiten: ${units.length} · Lektionen: ${ids.lesson.size} · Items: ${total} · Zeitungssätze: ${news.length} · Karten: ${cards.length}`);
warnings.forEach((m) => console.log(m));
errors.forEach((m) => console.log(m));
if (errors.length) {
  console.log(`\n${errors.length} Fehler, ${warnings.length} Warnungen.`);
  process.exit(1);
}
console.log(`\nAlles gültig ✓ (${warnings.length} Warnungen)`);
