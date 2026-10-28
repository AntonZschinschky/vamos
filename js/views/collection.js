// Sammlung (Album): Raster aller Karten, Silhouetten für fehlende, Zähler je Stufe, Filter nach Epoche.
import { h, toast } from '../dom.js';
import { app, C } from '../ctx.js';
import { collectionStats, RARITY_DE } from '../cards.js';
import { cardImage, epochEmoji, showCard } from './cardview.js';

let filter = 'Alle';

export function collectionView() {
  const st = app.state;
  const stats = collectionStats(st, C.cards);
  const epochs = ['Alle', ...new Set(C.cards.map((c) => c.epoch))];
  const grid = h('div.album');
  const chips = h('div.chips');

  function draw() {
    chips.textContent = '';
    epochs.forEach((e) => chips.appendChild(h(`button.chip${e === filter ? '.on' : ''}`, { type: 'button', onclick: () => { filter = e; draw(); } },
      e === 'Alle' ? 'Alle' : `${epochEmoji(e)} ${e}`)));
    grid.textContent = '';
    C.cards.filter((c) => filter === 'Alle' || c.epoch === filter).forEach((c) => {
      const owned = st.cards[c.id];
      if (owned) {
        grid.appendChild(h(`button.mini.${c.rarity}`, { type: 'button', 'aria-label': `${c.title} (${RARITY_DE[c.rarity]})`, onclick: () => showCard(c, owned) },
          cardImage(c),
          h('div.t', c.title),
          owned.count > 1 ? h('span.n', `${owned.count}×`) : null));
      } else {
        grid.appendChild(h('button.mini.locked', { type: 'button', 'aria-label': `Noch nicht gesammelt: ${c.epoch}`, onclick: () => toast(`Noch nicht gesammelt · ${c.epoch} · ${RARITY_DE[c.rarity]}`) },
          h('div.ph', { 'aria-hidden': 'true' }, epochEmoji(c.epoch)),
          h('div.t', c.epoch)));
      }
    });
  }
  draw();

  return h('div.page',
    h('h1', 'Sammlung'),
    h('p.muted', `${stats.owned} von ${stats.total} Geschichtskarten gesammelt. Jeden Tag nach dem Lernen kommt eine dazu.`),
    h('div.counts',
      ['bronze', 'silver', 'gold'].map((r) => h(`div.${r}`, h('b', `${stats[r].owned}/${stats[r].total}`), h('span', RARITY_DE[r])))),
    chips,
    grid);
}
