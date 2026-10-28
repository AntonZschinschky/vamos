import test from 'node:test';
import assert from 'node:assert/strict';
import { introduce, grade, dueIds, weakestIds, INTERVALS } from '../js/srs.js';

const D = '2026-10-28';

test('introduce legt Box 0 an, überschreibt nichts', () => {
  const srs = { hola: { box: 3, due: '2026-11-01', seen: 5, wrong: 0 } };
  introduce(srs, ['hola', 'adios'], D);
  assert.equal(srs.hola.box, 3);
  assert.deepEqual(srs.adios, { box: 0, due: D, seen: 0, wrong: 0 });
});

test('richtig → Box +1 mit passendem Abstand', () => {
  const srs = {};
  introduce(srs, ['hola'], D);
  const e = grade(srs, 'hola', true, D);
  assert.equal(e.box, 1);
  assert.equal(e.due, '2026-10-29');
  const e2 = grade(srs, 'hola', true, '2026-10-29');
  assert.equal(e2.box, 2);
  assert.equal(e2.due, '2026-10-31');
  assert.deepEqual(INTERVALS, [0, 1, 2, 4, 8, 16]);
});

test('höchstens eine Beförderung pro Tag', () => {
  const srs = {};
  introduce(srs, ['hola'], D);
  grade(srs, 'hola', true, D);
  grade(srs, 'hola', true, D);
  assert.equal(grade(srs, 'hola', true, D).box, 1);
});

test('falsch → Box 1, morgen fällig, auch nach späterem Richtig am selben Tag', () => {
  const srs = { hola: { box: 4, due: D, seen: 3, wrong: 0 } };
  const e = grade(srs, 'hola', false, D);
  assert.equal(e.box, 1);
  assert.equal(e.wrong, 1);
  assert.equal(e.due, '2026-10-29');
  assert.equal(grade(srs, 'hola', true, D).box, 1);
});

test('Box 5 ist das Maximum', () => {
  const srs = { a: { box: 5, due: D, seen: 1, wrong: 0 } };
  assert.equal(grade(srs, 'a', true, D).box, 5);
  assert.equal(srs.a.due, '2026-11-13');
});

test('dueIds sortiert nach Fälligkeit, filtert Zukunft und Gelöschtes', () => {
  const srs = {
    a: { box: 2, due: '2026-10-27' },
    b: { box: 1, due: '2026-10-28' },
    c: { box: 0, due: '2026-10-26' },
    d: { box: 1, due: '2026-10-29' },
    x: { box: 0, due: '2026-10-01' },
  };
  assert.deepEqual(dueIds(srs, D, (id) => id !== 'x'), ['c', 'a', 'b']);
  assert.deepEqual(dueIds(srs, D, undefined, 2), ['x', 'c']);
});

test('weakestIds nimmt niedrige Boxen zuerst', () => {
  const srs = { a: { box: 3, due: D }, b: { box: 1, due: D, wrong: 2 }, c: { box: 1, due: D, wrong: 0 } };
  assert.deepEqual(weakestIds(srs, undefined, 2), ['b', 'c']);
});
