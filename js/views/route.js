// Route: Stationen mit Reisepass-Stempeln, „Das kannst du schon“, Wortzahl.
import { h } from '../dom.js';
import { app, C } from '../ctx.js';
import { nextStep } from '../content.js';

export function routeView() {
  const st = app.state;
  const done = new Set(st.lessonsDone);
  const step = nextStep(C, st);
  const words = Object.keys(st.srs).filter((id) => C.items.has(id)).length;
  const candos = C.order.filter((l) => done.has(l.id)).map((l) => app.f(l.cando));

  const stations = C.units.map((u, ui) => {
    const allDone = u.lessons.every((l) => done.has(l.id)) && st.finalesDone.includes(u.id);
    const current = step && step.unitId === u.id;
    const stamps = u.lessons.map((l, li) => h(`div.stamp${done.has(l.id) ? '.on' : ''}`, { title: l.title },
      done.has(l.id) ? h('span.em', '✓') : null, `L${li + 1}`));
    stamps.push(h(`div.stamp${st.finalesDone.includes(u.id) ? '.on.fin' : ''}`, { title: 'Reise-Szene' },
      st.finalesDone.includes(u.id) ? h('span.em', u.emoji) : null, st.finalesDone.includes(u.id) ? '' : '★'));
    return h(`div.station.card${allDone ? '.done' : ''}${current ? '.current' : ''}`,
      h('div.station-head',
        h('div.em', { 'aria-hidden': 'true' }, u.emoji),
        h('div',
          h('small', `Station ${ui + 1} · ${u.country === 'MX' ? '🇲🇽 Mexiko' : '🇪🇸 Spanien'}`),
          h('b', `${u.place}`), ' – ', h('span', u.titleEs),
          h('small', u.title))),
      h('div.stamps', stamps),
      current ? h('p.small', { style: 'margin:10px 0 0;color:var(--terra);font-weight:600' }, '📍 Hier bist du gerade') : null);
  });

  return h('div.page',
    h('h1', 'Deine Reise'),
    h('div.tile-band', { 'aria-hidden': 'true' }),
    h('div.stats',
      h('div', h('b', words), h('span', 'Wörter & Sätze')),
      h('div', h('b', `${st.lessonsDone.length}/${C.order.length}`), h('span', 'Lektionen')),
      h('div', h('b', `${st.finalesDone.length}/${C.units.length}`), h('span', 'Stationen'))),
    h('div.route', stations),
    h('h2', { style: 'margin-top:24px' }, 'Das kannst du schon'),
    candos.length
      ? h('div.card', h('ul.cando-list', candos.map((c) => h('li', c))))
      : h('p.muted', 'Nach deiner ersten Lektion steht hier, was du schon kannst.'));
}
