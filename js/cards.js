// Sammelkarten ziehen – Regeln aus SPEC §4 (DOM-frei). Darstellung: js/views/cardview.js.

export const RARITIES = ['bronze', 'silver', 'gold'];
export const ODDS = { bronze: 0.7, silver: 0.25, gold: 0.05 };
export const PITY = 12; // spätestens jede 12. Karte ohne Gold → Gold
export const RARITY_DE = { bronze: 'Bronze', silver: 'Silber', gold: 'Gold' };

const rank = (r) => RARITIES.indexOf(r);

/** Seltenheit würfeln (ohne Garantien). */
export function rollRarity(rand) {
  const x = rand();
  if (x < ODDS.gold) return 'gold';
  if (x < ODDS.gold + ODDS.silver) return 'silver';
  return 'bronze';
}

/** Reihenfolge der Stufen, falls eine leer ist: erst gleich, dann tiefer, dann höher – aber nie unter min. */
export function tierOrder(r, min = 'bronze') {
  const i = rank(r);
  const lower = RARITIES.slice(0, i).reverse();
  const higher = RARITIES.slice(i + 1);
  const all = [r, ...lower, ...higher];
  const ok = all.filter((x) => rank(x) >= rank(min));
  return [...ok, ...all.filter((x) => rank(x) < rank(min))];
}

/**
 * Zieht eine Karte und trägt sie in state ein.
 * opts: { day, rand, min: 'bronze'|'silver', streakDays }
 * → { card, rarity, rolled, duplicate, complete, reason }
 */
export function drawCard(state, cards, { day, rand, min = 'bronze', streakDays = 0 }) {
  let rolled = rollRarity(rand);
  let reason = null;
  if (rank(rolled) < rank(min)) { rolled = min; reason = 'finale'; }
  if (streakDays >= 7 && !state.goldStreakGiven) { rolled = 'gold'; reason = 'streak'; state.goldStreakGiven = true; }
  if ((state.sinceGold || 0) + 1 >= PITY) { rolled = 'gold'; reason = reason || 'pity'; }

  const owned = state.cards || (state.cards = {});
  let pool = [];
  let rarity = rolled;
  for (const r of tierOrder(rolled, min)) {
    pool = cards.filter((c) => c.rarity === r && !owned[c.id]);
    if (pool.length) { rarity = r; break; }
  }
  let duplicate = false;
  if (!pool.length) {
    duplicate = true;
    pool = cards.filter((c) => c.rarity === rolled);
    if (!pool.length) pool = cards.slice();
    rarity = rolled;
  }
  const card = pool[Math.floor(rand() * pool.length)];
  if (!card) return null;
  rarity = card.rarity;

  const prev = owned[card.id];
  owned[card.id] = prev ? { ...prev, count: (prev.count || 1) + 1 } : { count: 1, first: day };
  state.sinceGold = rarity === 'gold' ? 0 : (state.sinceGold || 0) + 1;
  const complete = cards.every((c) => owned[c.id]);
  return { id: card.id, rarity, rolled, duplicate, complete, reason };
}

export function collectionStats(state, cards) {
  const out = { total: cards.length, owned: 0 };
  for (const r of RARITIES) out[r] = { owned: 0, total: 0 };
  for (const c of cards) {
    out[c.rarity].total++;
    if (state.cards[c.id]) { out[c.rarity].owned++; out.owned++; }
  }
  return out;
}
