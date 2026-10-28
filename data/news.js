// Echte Sätze aus spanischsprachigen Zeitungen 2026 – werden lokal mit Quelle gepflegt.
// placeholder: true = Entwicklungs-Platzhalter, wird ersetzt.
const ph = (id, es, de) => ({
  id, es, de, source: 'Platzhalter', country: 'ES', date: '2026-01-01', url: '',
  glossary: {}, question: { prompt: 'Worum geht es?', options: [de, 'Um das Wetter in Berlin.', 'Um ein Fußballspiel.'], answer: 0 },
  placeholder: true,
});

export default [
  ph('n01', 'Hola, buenos días: hoy hace sol en Madrid.', 'Hallo, guten Morgen: Heute scheint in Madrid die Sonne.'),
  ph('n02', 'Lucía es de Madrid y habla un poco de alemán.', 'Lucía ist aus Madrid und spricht ein bisschen Deutsch.'),
  ph('n03', 'Muchas gracias a todos por venir.', 'Vielen Dank an alle fürs Kommen.'),
  ph('n04', 'Los turistas no entienden el nuevo horario.', 'Die Touristen verstehen den neuen Fahrplan nicht.'),
];
