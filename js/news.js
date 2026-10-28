// „Echt jetzt!“ – ein echter Zeitungssatz mit antippbaren Wörtern und Verständnisfrage.
import { h } from './dom.js';
import { speak } from './speech.js';
import { sfx } from './sound.js';
import { norm, shuffle, rng, words } from './util.js';

const COUNTRY = { ES: '🇪🇸 Spanien', MX: '🇲🇽 Mexiko', AR: '🇦🇷 Argentinien', CO: '🇨🇴 Kolumbien', PE: '🇵🇪 Peru', CL: '🇨🇱 Chile', CU: '🇨🇺 Kuba' };

export function formatDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  const mon = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return d && m ? `${d}. ${mon[m - 1]} ${y}` : iso;
}

/** Glossar-Eintrag zu einem Wort (Vergleich klein, ohne Satzzeichen, notfalls ohne Akzente). */
export function lookup(glossary, token) {
  const key = norm(token);
  if (!key) return null;
  const plain = token.toLowerCase().replace(/[¿¡.,;:!?«»“”„"'’‘()…]/g, '');
  if (glossary[plain]) return glossary[plain];
  for (const [k, v] of Object.entries(glossary)) if (norm(k) === key) return v;
  return null;
}

/** Wie viele (verschiedene) Wörter des Satzes sind schon bekannt? */
export function knownStats(es, known) {
  const uniq = [...new Set(words(es))];
  return { known: uniq.filter((w) => known.has(w)).length, total: uniq.length };
}

/** ctx: { known:Set, result(ok), next(), seed } */
export function renderNews(n, ctx) {
  const gloss = h('div.gloss', 'Tippe auf ein Wort, um es zu übersetzen.');
  let selEl = null;
  const tokens = n.es.split(/\s+/).map((tok) => {
    const isKnown = ctx.known.has(norm(tok));
    const el = h(`button.w${isKnown ? '.known' : ''}`, { type: 'button' }, tok);
    el.addEventListener('click', () => {
      if (selEl) selEl.classList.remove('sel');
      selEl = el;
      el.classList.add('sel');
      const g = lookup(n.glossary || {}, tok);
      gloss.textContent = '';
      gloss.appendChild(h('b', tok.replace(/[¿¡.,;:!?«»“”„"…]/g, '')));
      gloss.appendChild(document.createTextNode(g ? ` – ${g}` : ' – (kein Eintrag)'));
      speak(tok.replace(/[¿¡«»“”„"]/g, ''));
    });
    return [el, ' '];
  });
  const st = knownStats(n.es, ctx.known);
  const fb = h('div');
  const foot = h('div');
  const q = n.question;
  const rand = rng(ctx.seed || 7);
  const order = shuffle(q.options.map((_, i) => i), rand);
  let answered = false;
  const btns = order.map((i) => {
    const b = h('button.opt', { type: 'button' }, q.options[i]);
    b.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const ok = i === q.answer;
      btns.forEach((x, j) => {
        if (order[j] === q.answer) x.classList.add('right');
        else if (x === b) x.classList.add('wrong');
        else x.classList.add('dim');
      });
      ok ? sfx.right() : sfx.wrong();
      ctx.result(ok);
      fb.appendChild(h(`div.feedback.${ok ? 'right' : 'wrong'}`,
        h('b', ok ? '¡Muy bien! Richtig verstanden.' : 'Nicht ganz – so ist es gemeint:'),
        h('p', { style: 'margin:6px 0;color:var(--ink)' }, `„${n.de}“`),
        h('p', { style: 'margin:0' }, `Du hast ${st.known} von ${st.total} Wörtern schon gekannt.`)));
      foot.appendChild(h('button.btn', { type: 'button', onclick: () => ctx.next() }, 'Weiter'));
      setTimeout(() => foot.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    });
    return b;
  });

  return h('div.step',
    h('div.step-body',
      h('div.step-label', 'Echt jetzt! 📰'),
      h('p', 'Ein echter Satz aus einer Zeitung. Keine Sorge – du musst nicht alles verstehen.'),
      h('div.news-paper',
        h('div', tokens),
        h('div.src', `${n.source} · ${COUNTRY[n.country] || n.country} · ${formatDate(n.date)}`,
          n.url ? [' · ', h('a', { href: n.url, target: '_blank', rel: 'noopener' }, 'Artikel')] : null,
          n.placeholder ? ' · (Platzhalter)' : null)),
      h('div.audio-row',
        h('button.icon-btn', { type: 'button', onclick: () => speak(n.es) }, h('span.ico', '🔊'), 'Vorlesen'),
        h('button.icon-btn', { type: 'button', onclick: () => speak(n.es, { slow: true }) }, h('span.ico', '🐢'), 'Langsam')),
      gloss,
      h('p.small.muted', h('span', { style: 'color:var(--agave);font-weight:700' }, 'Grün'), ' = kennst du schon'),
      h('div.prompt', { style: 'margin-top:18px' }, q.prompt),
      h('div.options', btns),
      fb),
    h('div.step-foot', foot));
}
