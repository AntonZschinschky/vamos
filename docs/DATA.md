# Datenformate

Alle Inhalte sind ES-Module unter `data/`. Einstieg: `data/index.js` exportiert
`{ units, news, cards }`. `node tools/validate.mjs` prüft alles.

## Einheiten – `data/units/uN.js`
```js
export default {
  id: 'u1',                 // eindeutig
  title: 'Hallo & Tschüss', // Deutsch
  titleEs: '¡Hola!',
  place: 'Madrid',          // Station auf der Route
  country: 'ES',            // 'ES' | 'MX'
  emoji: '👋',
  lessons: [Lesson, Lesson, Lesson, Lesson],
  finale: Scene,            // Abschluss-Szene der Einheit (länger)
};
```

### Lesson
```js
{
  id: 'u1l1',
  title: 'Begrüßen',
  goal: 'Du lernst, Menschen zu begrüßen und dich zu verabschieden.',
  cando: 'Ich kann Menschen zu jeder Tageszeit begrüßen und mich verabschieden.',
  situation: 'Begrüßen',            // Kategorie im Phrasebook
  items: [Item, …],                 // 6–9 neue Wörter/Sätze
  tip: { title: 'Buenos días oder buenas tardes?', text: '…1–3 Sätze Deutsch…' },
  scene: Scene,                     // kurzer Dialog
  news: 'n01',                      // id in data/news.js
}
```

### Item
```js
{
  id: 'buenos-dias',       // global eindeutig, kebab-case (SRS-Schlüssel!) — nie umbenennen
  es: 'Buenos días',
  de: 'Guten Morgen / Guten Tag',
  emoji: '🌅',
  say: 'Buenos días',      // optional: was vorgelesen wird, falls anders als es
  note: 'bis ca. 12–14 Uhr', // optional, kleiner Hinweis
  alt: ['¿Qué onda?'],      // optional: Varianten
  region: 'MX',            // optional: nur 'ES' oder 'MX' typisch (wird als Fähnchen gezeigt)
}
```
Platzhalter `{name}` in `es`/`de`/`say` wird durch ihren Vornamen ersetzt (Einstellung `settings.name`,
im Onboarding abgefragt; leer → `Ana`).
`es` mit ≥ 3 Wörtern → eignet sich für „Satz bauen“ (Kacheln = Wörter an Leerzeichen,
Satzzeichen bleiben am Wort).

### Scene (Dialog)
```js
{
  title: 'An der Hotelrezeption',
  intro: 'Du kommst abends im Hotel in Madrid an.',   // Deutsch
  lines: [
    { who: 'npc', name: 'Recepcionista', es: '¡Buenas noches!', de: 'Guten Abend!' },
    { who: 'you', options: [
        { es: '¡Buenas noches!', de: 'Guten Abend!', ok: true },
        { es: '¡Buenos días!', de: 'Guten Morgen!', ok: false, why: 'Es ist Abend.' },
    ]},
    …
  ],
}
```
`who: 'note'` → Erzähl-Zeile ohne Audio (nur `de`, kursiv, z. B. „Zehn Minuten später …“).
`who: 'you'` → sie wählt; genau eine Option `ok: true`. `why` = Erklärung bei falscher Wahl.

## Zeitungssätze – `data/news.js`
```js
export default [{
  id: 'n01',
  es: 'Echter Satz, wörtlich aus dem Artikel.',
  de: 'Deutsche Übersetzung.',
  source: 'El País',            // Zeitung
  country: 'ES',
  date: '2026-03-14',           // Erscheinungsdatum
  url: 'https://…',
  title: 'Titel des Artikels',  // optional
  glossary: { 'palabra': 'Wort', … },   // Wort (klein, ohne Satzzeichen) → Deutsch
  question: { prompt: 'Worum geht es?', options: ['…', '…', '…'], answer: 0 },
  placeholder: true,            // nur bei Entwicklungs-Platzhaltern!
}]
```
Bekannte Wörter = Wörter, die in bereits gelernten Items vorkommen (Vergleich klein, ohne Akzente/Satzzeichen).

## Sammelkarten – `data/cards.js`
```js
export default [{
  id: 'c-cleopatra-pyramiden',
  rarity: 'bronze',           // 'bronze' | 'silver' | 'gold'
  epoch: 'Altes Ägypten',
  year: 'um 30 v. Chr.',
  title: 'Kleopatra und die Mondlandung',
  fact: '2–4 Sätze, Deutsch.',
  image: 'img/cards/cleopatra.jpg',  // relativ; Hochformat ~ 3:4, ≤ 150 KB
  imageCredit: 'Gemälde von …, gemeinfrei (Wikimedia Commons)',
  source: 'Kurzer Beleg für den Fakt',  // nicht in der UI nötig, nur zur Pflege
  placeholder: true,          // nur Platzhalter
}]
```

## Fortschritt – `localStorage['vamos.v1']`
```js
{
  v: 1,
  started: '2026-10-28',
  lessonsDone: ['u1l1', …],
  finalesDone: ['u1'],
  srs: { 'buenos-dias': { box: 2, due: '2026-10-30', seen: 4, wrong: 1 } },
  cards: { 'c-…': { count: 1, first: '2026-10-28' } },
  sinceGold: 3,
  streak: { count: 5, last: '2026-10-28', jokerWeek: '2026-W44', jokerUsed: false },
  days: { '2026-10-28': { minutes: 14, done: true } },
  session: null,             // laufende Tageseinheit zum Fortsetzen
  settings: { name: 'Ana', rate: 0.9, voice: 'es-ES', sound: true },
  onboarded: true,
}
```
SRS: Leitner-Boxen 0–5, Abstände 0, 1, 2, 4, 8, 16 Tage. Richtig → Box +1, falsch → Box 1.
