import test from 'node:test';
import assert from 'node:assert/strict';
import { units } from '../data/index.js';
import { lessonExercises, reviewExercises, distractors, tilesOf, checkBuild, canBuild } from '../js/exgen.js';
import { rng, norm } from '../js/util.js';

const all = units.flatMap((u) => u.lessons);
const byId = new Map(all.flatMap((l) => l.items).map((i) => [i.id, i]));
const earlierOf = (idx) => all.slice(0, idx).flatMap((l) => l.items);

test('deterministisch per Seed', () => {
  const a = lessonExercises(all[0], [], 42);
  const b = lessonExercises(all[0], [], 42);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, lessonExercises(all[0], [], 43));
});

test('jede Lektion: 10–14 Aufgaben, alle Typen gültig', () => {
  all.forEach((lesson, i) => {
    for (const seed of [1, 2, 3, 99]) {
      const exs = lessonExercises(lesson, earlierOf(i), seed);
      assert.ok(exs.length >= 10 && exs.length <= 14, `${lesson.id}: ${exs.length}`);
      const types = new Set(exs.map((e) => e.type));
      assert.ok(types.has('pairs') && types.has('speak'), lesson.id);
      for (const ex of exs) {
        if (['listen', 'pic', 'de2es'].includes(ex.type)) {
          assert.ok(ex.options.length >= 3 && ex.options.length <= 4);
          assert.equal(ex.options.filter((o) => o === ex.id).length, 1);
          assert.equal(new Set(ex.options).size, ex.options.length);
          const texts = ex.options.map((o) => norm(byId.get(o)[ex.type === 'listen' ? 'de' : 'es']));
          assert.equal(new Set(texts).size, texts.length, `doppelte Antworttexte in ${lesson.id}`);
          if (ex.type === 'pic') {
            const em = ex.options.map((o) => byId.get(o).emoji);
            assert.equal(new Set(em).size, em.length);
          }
          // Ablenker nur aus derselben oder früheren Lektionen
          const allowed = new Set([...lesson.items, ...earlierOf(i)].map((x) => x.id));
          ex.options.forEach((o) => assert.ok(allowed.has(o)));
        }
        if (ex.type === 'build') {
          const item = byId.get(ex.id);
          assert.ok(canBuild(item));
          const ans = tilesOf(item.es);
          assert.ok(ex.tiles.length >= ans.length && ex.tiles.length <= ans.length + 2);
          assert.ok(checkBuild(item, ans));
        }
        if (ex.type === 'pairs') {
          assert.ok(ex.ids.length >= 4 && ex.ids.length <= 5);
          assert.deepEqual([...ex.left].sort(), [...ex.ids].sort());
          assert.deepEqual([...ex.right].sort(), [...ex.ids].sort());
        }
      }
    }
  });
});

test('distractors: nie Ziel, nie gleicher Text', () => {
  const l = all[0];
  const t = l.items[0];
  const ds = distractors(t, l.items, [], 3, rng(5), 'pic');
  assert.equal(ds.length, 3);
  ds.forEach((d) => {
    assert.notEqual(d.id, t.id);
    assert.notEqual(d.emoji, t.emoji);
  });
});

test('Satz bauen: falsche Reihenfolge wird erkannt', () => {
  const item = { es: '¿Puede repetir, por favor?' };
  assert.ok(checkBuild(item, ['¿Puede', 'repetir,', 'por', 'favor?']));
  assert.ok(!checkBuild(item, ['repetir,', '¿Puede', 'por', 'favor?']));
  assert.ok(!checkBuild(item, ['¿Puede', 'repetir,', 'por']));
});

test('reviewExercises: eine Aufgabe je Item', () => {
  const pool = all.slice(0, 4).flatMap((l) => l.items);
  const items = pool.slice(0, 8);
  const exs = reviewExercises(items, pool, 7);
  assert.equal(exs.length, 8);
  assert.deepEqual(exs.map((e) => e.id), items.map((i) => i.id));
});
