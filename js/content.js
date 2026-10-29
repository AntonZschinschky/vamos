// Nachschlage-Tabellen über die Inhalte aus data/ (DOM-frei).

export function indexContent({ units, news, cards }) {
  const items = new Map();      // itemId → item (mit lessonId, unitId)
  const lessons = new Map();    // lessonId → lesson (mit unitId, index)
  const order = [];             // alle Lektionen in Lernreihenfolge
  units.forEach((u, ui) => {
    u.lessons.forEach((l, li) => {
      const lesson = { ...l, unitId: u.id, unitIndex: ui, index: li };
      lessons.set(l.id, lesson);
      order.push(lesson);
      l.items.forEach((it) => items.set(it.id, { ...it, lessonId: l.id, unitId: u.id }));
    });
  });
  return {
    units,
    unitById: new Map(units.map((u) => [u.id, u])),
    items,
    lessons,
    order,
    news,
    newsById: new Map(news.map((n) => [n.id, n])),
    cards,
    cardById: new Map(cards.map((c) => [c.id, c])),
  };
}

/** Nächster Lernschritt: erste offene Lektion, oder Abschluss-Szene einer fertigen Einheit. */
export function nextStep(C, state) {
  const done = new Set(state.lessonsDone);
  for (const u of C.units) {
    const open = u.lessons.find((l) => !done.has(l.id));
    if (open) return { kind: 'lesson', id: open.id, unitId: u.id };
    if (!state.finalesDone.includes(u.id)) return { kind: 'finale', id: u.id, unitId: u.id };
  }
  return null; // alles gelernt → Wiederholungsmodus
}

/** Alle Items der erledigten Lektionen (Reihenfolge wie im Lehrplan). */
export function learnedItems(C, state) {
  const done = new Set(state.lessonsDone);
  const out = [];
  for (const l of C.order) if (done.has(l.id)) out.push(...l.items);
  return out;
}
