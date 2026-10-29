// Reise-Sätze (Phrasebook): alle gelernten Sätze nach Situation, Suche, 🔊 – offline.
import { h } from '../dom.js';
import { app, C } from '../ctx.js';
import { speak } from '../speech.js';
import { norm } from '../util.js';

let query = '';
let showAll = false;

export function phrasesView() {
  const list = h('div');
  const done = new Set(app.state.lessonsDone);

  function draw() {
    list.textContent = '';
    const q = norm(query);
    const groups = new Map();
    for (const l of C.order) {
      const learned = done.has(l.id);
      if (!learned && !showAll) continue;
      for (const it of l.items) {
        const es = app.f(it.es);
        const de = app.f(it.de);
        if (q && !norm(es + ' ' + de + ' ' + l.situation).includes(q)) continue;
        if (!groups.has(l.situation)) groups.set(l.situation, []);
        groups.get(l.situation).push({ it, es, de, learned });
      }
    }
    if (!groups.size) {
      list.appendChild(h('div.card.tinted', q
        ? h('p', { style: 'margin:0' }, 'Nichts gefunden. Versuch ein anderes Wort.')
        : h('p', { style: 'margin:0' }, 'Hier sammeln sich alle Sätze, die du gelernt hast – nach Situation sortiert, zum Nachschlagen im Urlaub.')));
      return;
    }
    for (const [sit, rows] of groups) {
      list.appendChild(h('div.section-title', sit));
      list.appendChild(h('div.card', { style: 'padding:6px 16px' }, rows.map(({ it, es, de, learned }) => {
        const say = app.f(it.say || it.es);
        return h(`div.phrase${learned ? '' : '.locked'}`,
          h('div.em', { 'aria-hidden': 'true' }, it.emoji),
          h('div.txt',
            h('div.es', es, it.region ? [' ', h('span.flag', it.region === 'MX' ? '🇲🇽' : '🇪🇸')] : null),
            h('div.de', de),
            it.note ? h('div.small.muted', it.note) : null),
          h('button.icon-btn', { type: 'button', 'aria-label': `${es} anhören`, onclick: () => speak(say) }, h('span.ico', '🔊')));
      })));
    }
  }

  const search = h('input.search', { type: 'search', placeholder: '🔍 Suchen (Deutsch oder Spanisch)', value: query, autocomplete: 'off', autocorrect: 'off', spellcheck: false });
  search.addEventListener('input', () => { query = search.value; draw(); });
  const sw = h('input', { type: 'checkbox', checked: showAll, 'aria-label': 'Auch noch nicht gelernte Sätze zeigen' });
  sw.addEventListener('change', () => { showAll = sw.checked; draw(); });

  draw();
  return h('div.page',
    h('h1', 'Reise-Sätze'),
    h('p.muted', 'Deine Sätze für unterwegs – mit 🔊 zum Vorspielen. Funktioniert auch ohne Internet.'),
    search,
    h('div.toggle-row', { style: 'margin-bottom:6px' }, h('span', 'Auch noch nicht gelernte zeigen'), h('label.switch', sw, h('span'))),
    list);
}
