import test from 'node:test';
import assert from 'node:assert/strict';
import { drawCard, rollRarity, tierOrder, collectionStats, PITY } from '../js/cards.js';
import { defaultState } from '../js/store.js';
import { rng } from '../js/util.js';

const D = '2026-10-28';
const mk = (n, rarity) => Array.from({ length: n }, (_, i) => ({ id: `${rarity}-${i}`, rarity }));
const deck = [...mk(10, 'bronze'), ...mk(5, 'silver'), ...mk(2, 'gold')];
const fixed = (x) => () => x; // „Zufall“, der immer x liefert

test('Wahrscheinlichkeiten ungefähr 70/25/5', () => {
  const r = rng(1);
  const c = { bronze: 0, silver: 0, gold: 0 };
  for (let i = 0; i < 20000; i++) c[rollRarity(r)]++;
  assert.ok(Math.abs(c.bronze / 20000 - 0.7) < 0.02);
  assert.ok(Math.abs(c.silver / 20000 - 0.25) < 0.02);
  assert.ok(Math.abs(c.gold / 20000 - 0.05) < 0.01);
});

test('tierOrder: gleich → tiefer → höher, nie unter Minimum zuerst', () => {
  assert.deepEqual(tierOrder('silver'), ['silver', 'bronze', 'gold']);
  assert.deepEqual(tierOrder('gold'), ['gold', 'silver', 'bronze']);
  assert.deepEqual(tierOrder('silver', 'silver'), ['silver', 'gold', 'bronze']);
});

test('Einheiten-Abschluss: mindestens Silber', () => {
  const s = defaultState(D);
  const r = drawCard(s, deck, { day: D, rand: fixed(0.99), min: 'silver' });
  assert.equal(r.rarity, 'silver');
  assert.equal(r.reason, 'finale');
});

test('7-Tage-Streak: einmalig Gold', () => {
  const s = defaultState(D);
  const r = drawCard(s, deck, { day: D, rand: fixed(0.99), streakDays: 7 });
  assert.equal(r.rarity, 'gold');
  assert.equal(s.goldStreakGiven, true);
  const r2 = drawCard(s, deck, { day: D, rand: fixed(0.99), streakDays: 8 });
  assert.equal(r2.rarity, 'bronze');
});

test('Pity: spätestens die 12. Karte ohne Gold ist Gold', () => {
  const s = defaultState(D);
  const big = [...mk(20, 'bronze'), ...mk(2, 'gold')];
  const got = [];
  for (let i = 0; i < PITY; i++) got.push(drawCard(s, big, { day: D, rand: fixed(0.99) }).rarity);
  assert.deepEqual(got.slice(0, PITY - 1), Array(PITY - 1).fill('bronze'));
  assert.equal(got[PITY - 1], 'gold');
  assert.equal(s.sinceGold, 0);
});

test('keine Doppelten, solange etwas fehlt; leere Stufe → Nachbarstufe', () => {
  const s = defaultState(D);
  const r = rng(3);
  const seen = new Set();
  for (let i = 0; i < deck.length; i++) {
    const res = drawCard(s, deck, { day: D, rand: r });
    assert.ok(!seen.has(res.id), 'Doppelte trotz fehlender Karten');
    assert.ok(!res.duplicate);
    seen.add(res.id);
  }
  assert.equal(seen.size, deck.length);
  const last = drawCard(s, deck, { day: D, rand: r });
  assert.ok(last.duplicate && last.complete);
  assert.equal(s.cards[last.id].count, 2);
});

test('Gold leer → Silber statt Doppelter', () => {
  const s = defaultState(D);
  s.cards = { 'gold-0': { count: 1 }, 'gold-1': { count: 1 } };
  const r = drawCard(s, deck, { day: D, rand: fixed(0.01) }); // würfelt Gold
  assert.equal(r.rolled, 'gold');
  assert.equal(r.rarity, 'silver');
  assert.ok(!r.duplicate);
});

test('collectionStats zählt je Stufe', () => {
  const s = defaultState(D);
  s.cards = { 'gold-0': { count: 1 }, 'bronze-3': { count: 2 } };
  const st = collectionStats(s, deck);
  assert.equal(st.owned, 2);
  assert.deepEqual(st.gold, { owned: 1, total: 2 });
  assert.deepEqual(st.silver, { owned: 0, total: 5 });
});
