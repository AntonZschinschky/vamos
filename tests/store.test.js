import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, migrate, load, save, exportCode, importCode, KEY } from '../js/store.js';

function memStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), map: m };
}

test('defaultState hat Schema-Version und leere Listen', () => {
  const s = defaultState('2026-10-28');
  assert.equal(s.v, 1);
  assert.equal(s.started, '2026-10-28');
  assert.deepEqual(s.lessonsDone, []);
  assert.equal(s.settings.rate, 0.9);
});

test('migrate ergänzt fehlende Felder und behält vorhandene', () => {
  const s = migrate({ lessonsDone: ['u1l1'], settings: { name: 'Mama' }, srs: { hola: { box: 2, due: '2026-10-30' } } });
  assert.deepEqual(s.lessonsDone, ['u1l1']);
  assert.equal(s.settings.name, 'Mama');
  assert.equal(s.settings.voice, 'es-ES');
  assert.equal(s.srs.hola.box, 2);
  assert.equal(s.streak.count, 0);
  assert.equal(s.v, 1);
});

test('migrate mit Müll liefert Standard', () => {
  assert.equal(migrate(null).v, 1);
  assert.deepEqual(migrate('x').lessonsDone, []);
});

test('save/load Rundreise', () => {
  const st = memStorage();
  const s = defaultState();
  s.lessonsDone.push('u1l1');
  save(s, st);
  assert.ok(st.map.has(KEY));
  assert.deepEqual(load(st).lessonsDone, ['u1l1']);
});

test('load mit kaputtem JSON verliert die alten Daten nicht', () => {
  const st = memStorage();
  st.setItem(KEY, '{kaputt');
  const s = load(st);
  assert.equal(s.v, 1);
  assert.ok([...st.map.keys()].some((k) => k.startsWith(KEY + '.broken.')));
});

test('Sicherungs-Code: export → import (mit Umlauten)', () => {
  const s = defaultState();
  s.settings.name = 'Jörg ñ 🙂';
  s.lessonsDone = ['u1l1', 'u1l2'];
  s.session = { pos: 3 };
  const code = exportCode(s);
  assert.match(code, /^VAMOS1-/);
  const back = importCode('  ' + code + '\n');
  assert.equal(back.settings.name, 'Jörg ñ 🙂');
  assert.deepEqual(back.lessonsDone, ['u1l1', 'u1l2']);
  assert.equal(back.session, null);
});

test('importCode wirft bei Unsinn', () => {
  assert.throws(() => importCode(''));
  assert.throws(() => importCode('VAMOS1-!!!'));
  assert.throws(() => importCode(btoa('{"a":1}')));
});
