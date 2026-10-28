import test from 'node:test';
import assert from 'node:assert/strict';
import * as data from '../data/index.js';
import { indexContent, nextStep } from '../js/content.js';
import { defaultState } from '../js/store.js';
import { introduce } from '../js/srs.js';
import { planSession, completeSession, updateStreak, currentStreak, cardEligible } from '../js/session.js';

const C = indexContent(data);
const D = '2026-10-28';

test('Neustart: erste Lektion, ohne Aufwärmen', () => {
  const s = defaultState(D);
  const p = planSession(C, s, D, { seed: 1 });
  assert.equal(p.kind, 'lesson');
  assert.equal(p.ref, 'u1l1');
  const types = p.tasks.map((t) => t.t);
  assert.equal(types[0], 'goal');
  assert.ok(!types.includes('warmup'));
  assert.equal(types.filter((t) => t === 'learn').length, C.lessons.get('u1l1').items.length);
  assert.deepEqual(types.slice(-4), ['scene', 'news', 'done', 'card']);
  // Reihenfolge: goal → learn → tip → ex → scene
  assert.ok(types.indexOf('tip') > types.lastIndexOf('learn'));
  assert.ok(types.indexOf('ex') > types.indexOf('tip'));
});

test('Plan ist JSON-fest (Fortsetzen) und deterministisch', () => {
  const s = defaultState(D);
  const p = planSession(C, s, D, { seed: 9 });
  assert.deepEqual(JSON.parse(JSON.stringify(p)), p);
  assert.deepEqual(planSession(C, s, D, { seed: 9 }), p);
});

test('fällige Wörter: höchstens 8 Aufwärm-Aufgaben vorweg', () => {
  const s = defaultState(D);
  s.lessonsDone = ['u1l1', 'u1l2'];
  introduce(s.srs, [...C.lessons.get('u1l1').items, ...C.lessons.get('u1l2').items].map((i) => i.id), D);
  const p = planSession(C, s, D, { seed: 2 });
  assert.equal(p.tasks[0].t, 'warmup');
  assert.equal(p.tasks.filter((t) => t.review).length, 8);
  assert.equal(p.ref, 'u1l3');
  assert.ok(p.tasks.findIndex((t) => t.t === 'goal') > 8);
});

test('Extra-Lektion ohne Aufwärmen', () => {
  const s = defaultState(D);
  s.lessonsDone = ['u1l1'];
  introduce(s.srs, C.lessons.get('u1l1').items.map((i) => i.id), D);
  const p = planSession(C, s, D, { seed: 2, extra: true });
  assert.ok(!p.tasks.some((t) => t.review));
});

test('nach 4 Lektionen kommt die Abschluss-Szene, danach Einheit 2', () => {
  const s = defaultState(D);
  s.lessonsDone = ['u1l1', 'u1l2', 'u1l3', 'u1l4'];
  assert.deepEqual(nextStep(C, s), { kind: 'finale', id: 'u1', unitId: 'u1' });
  const p = planSession(C, s, D, { seed: 3, extra: true });
  assert.equal(p.kind, 'finale');
  assert.ok(p.tasks.some((t) => t.t === 'scene' && t.finale === 'u1'));
  completeSession(s, p, D);
  assert.deepEqual(s.finalesDone, ['u1']);
  assert.equal(nextStep(C, s).id, 'u2l1');
});

test('alles gelernt → Wiederholungsmodus mit Szene + Zeitungssatz', () => {
  const s = defaultState(D);
  s.lessonsDone = C.order.map((l) => l.id);
  s.finalesDone = C.units.map((u) => u.id);
  introduce(s.srs, [...C.items.keys()], '2026-12-01');
  const p = planSession(C, s, D, { seed: 4 });
  assert.equal(p.kind, 'review');
  const types = p.tasks.map((t) => t.t);
  assert.ok(types.includes('warmup') && types.includes('scene') && types.includes('news'));
});

test('completeSession trägt Lektion + Tag ein', () => {
  const s = defaultState(D);
  const p = planSession(C, s, D, { seed: 1 });
  completeSession(s, p, D);
  assert.deepEqual(s.lessonsDone, ['u1l1']);
  assert.equal(s.days[D].done, true);
  assert.equal(s.streak.count, 1);
  assert.ok(p.finished);
});

test('Karte: eine pro Tag, Abschluss-Szene immer', () => {
  const s = defaultState(D);
  assert.ok(cardEligible(s, { kind: 'lesson' }, D));
  s.days[D] = { done: true, card: 'c-x' };
  assert.ok(!cardEligible(s, { kind: 'lesson' }, D));
  assert.ok(cardEligible(s, { kind: 'finale' }, D));
});

test('Streak: Folgetage zählen, ein Joker pro Woche', () => {
  let st = { count: 0, last: null, jokerWeek: null, jokerUsed: false };
  st = updateStreak(st, '2026-10-26'); // Mo
  st = updateStreak(st, '2026-10-27');
  st = updateStreak(st, '2026-10-27'); // doppelt zählt nicht
  assert.equal(st.count, 2);
  st = updateStreak(st, '2026-10-29'); // Mi verpasst → Joker
  assert.equal(st.count, 3);
  assert.ok(st.jokerUsed);
  assert.equal(currentStreak(st, '2026-10-30'), 3);
  assert.equal(currentStreak(st, '2026-10-31'), 0); // Joker dieser Woche schon weg
  st = updateStreak(st, '2026-10-31');
  assert.equal(st.count, 1);
  // neue Woche → neuer Joker
  st = updateStreak(st, '2026-11-02'); // Mo, 1 Tag Lücke (So)
  assert.equal(st.count, 2);
  assert.equal(st.jokerWeek, '2026-W45');
});

test('currentStreak: heute/gestern zählt, sonst 0', () => {
  const st = { count: 5, last: '2026-10-27', jokerWeek: '2026-W44', jokerUsed: false };
  assert.equal(currentStreak(st, '2026-10-28'), 5);
  assert.equal(currentStreak(st, '2026-10-29'), 5); // noch mit Joker rettbar
  assert.equal(currentStreak(st, '2026-10-31'), 0);
});
