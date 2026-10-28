// Tagesplan: Wiederholung → nächste Lektion (inkl. Szene + Zeitungssatz) → Geschafft → Karte.
// Die Aufgabenliste wird einmal (per Seed) erzeugt und in state.session gespeichert → Fortsetzen nach Abbruch.
import { nextStep, learnedItems } from './content.js';
import { dueIds, weakestIds } from './srs.js';
import { lessonExercises, reviewExercises, unitExercises } from './exgen.js';
import { rng, shuffle, addDays, daysBetween, isoWeek, newSeed } from './util.js';

export const REVIEW_LIMIT = 8;

/** Items aller Lektionen vor `lessonId` (für Ablenker). */
function itemsBefore(C, lessonId) {
  const out = [];
  for (const l of C.order) {
    if (l.id === lessonId) break;
    out.push(...l.items);
  }
  return out;
}

/**
 * Neue Tageseinheit planen.
 * opts.extra = true → „Noch eine Lektion“ ohne Aufwärmen.
 */
export function planSession(C, state, day, { seed = newSeed(), extra = false } = {}) {
  const rand = rng(seed);
  const tasks = [];
  const exists = (id) => C.items.has(id);
  const step = nextStep(C, state);
  const pool = learnedItems(C, state);

  // 1. Aufwärmen
  let review = extra ? [] : dueIds(state.srs, day, exists, REVIEW_LIMIT);
  if (!step && !review.length) review = weakestIds(state.srs, exists, REVIEW_LIMIT);
  if (review.length) {
    tasks.push({ t: 'warmup', n: review.length });
    const items = review.map((id) => C.items.get(id));
    reviewExercises(items, pool.length >= 4 ? pool : [...C.items.values()], Math.floor(rand() * 2 ** 31))
      .forEach((ex) => tasks.push({ t: 'ex', ex, review: true }));
  }

  let kind;
  let ref = null;
  if (step && step.kind === 'lesson') {
    kind = 'lesson';
    ref = step.id;
    const lesson = C.lessons.get(ref);
    tasks.push({ t: 'goal' });
    lesson.items.forEach((it) => tasks.push({ t: 'learn', id: it.id }));
    tasks.push({ t: 'tip' });
    lessonExercises(lesson, itemsBefore(C, ref), Math.floor(rand() * 2 ** 31)).forEach((ex) => tasks.push({ t: 'ex', ex }));
    tasks.push({ t: 'scene', lesson: ref });
    if (lesson.news && C.newsById.has(lesson.news)) tasks.push({ t: 'news', id: lesson.news });
  } else if (step && step.kind === 'finale') {
    kind = 'finale';
    ref = step.id;
    const unit = C.unitById.get(ref);
    const unitItems = unit.lessons.flatMap((l) => l.items);
    tasks.push({ t: 'goal' });
    unitExercises(unitItems, itemsBefore(C, unit.lessons[0].id), Math.floor(rand() * 2 ** 31)).forEach((ex) => tasks.push({ t: 'ex', ex }));
    tasks.push({ t: 'scene', finale: ref });
  } else {
    kind = 'review';
    const doneLessons = C.order.filter((l) => state.lessonsDone.includes(l.id));
    const scenes = [
      ...doneLessons.map((l) => ({ t: 'scene', lesson: l.id })),
      ...state.finalesDone.filter((u) => C.unitById.has(u)).map((u) => ({ t: 'scene', finale: u })),
    ];
    if (scenes.length) tasks.push(shuffle(scenes, rand)[0]);
    const newsIds = shuffle(doneLessons.map((l) => l.news).filter((id) => C.newsById.has(id)), rand);
    if (newsIds.length) tasks.push({ t: 'news', id: newsIds[0] });
  }
  tasks.push({ t: 'done' });
  tasks.push({ t: 'card' });

  return {
    date: day, seed, kind, ref, extra, tasks, pos: 0,
    right: 0, wrong: 0, seconds: 0, newWords: 0,
    finished: false, card: null,
  };
}

/** Darf diese Einheit eine Karte bringen? Eine pro Tag; Abschluss-Szenen immer. */
export function cardEligible(state, session, day) {
  const d = state.days[day];
  return !(d && d.card) || session.kind === 'finale';
}

// ── Streak mit 1 Joker-Tag pro Woche ──

/** Tag als erledigt zählen. Ein verpasster Tag wird per Joker überbrückt (1× pro ISO-Woche). */
export function updateStreak(streak, day) {
  const s = { ...streak };
  const week = isoWeek(day);
  if (s.jokerWeek !== week) { s.jokerWeek = week; s.jokerUsed = false; }
  if (s.last === day) return s;
  const gap = s.last ? daysBetween(s.last, day) : Infinity;
  if (gap === 1) s.count = (s.count || 0) + 1;
  else if (gap === 2 && !s.jokerUsed) { s.count = (s.count || 0) + 1; s.jokerUsed = true; s.jokerDay = addDays(day, -1); }
  else s.count = 1;
  s.last = day;
  return s;
}

/** Aktuell angezeigter Streak (0, wenn er schon gerissen ist). */
export function currentStreak(streak, day) {
  if (!streak || !streak.last) return 0;
  const gap = daysBetween(streak.last, day);
  if (gap <= 1) return streak.count;
  const jokerFree = streak.jokerWeek !== isoWeek(day) || !streak.jokerUsed;
  if (gap === 2 && jokerFree) return streak.count; // heute noch zu retten
  return 0;
}

/**
 * Einheit abschließen: Lektion/Abschluss eintragen, Tag zählen, Streak.
 * (Karte zieht der Aufrufer über drawCard, damit die Animation passt.)
 */
export function completeSession(state, session, day) {
  if (session.kind === 'lesson' && !state.lessonsDone.includes(session.ref)) state.lessonsDone.push(session.ref);
  if (session.kind === 'finale' && !state.finalesDone.includes(session.ref)) state.finalesDone.push(session.ref);
  const d = state.days[day] || (state.days[day] = { minutes: 0, done: false });
  d.done = true;
  state.streak = updateStreak(state.streak, day);
  session.finished = true;
  return state;
}
