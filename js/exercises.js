// Renderer für die 6 Übungstypen. Generator: js/exgen.js.
// ctx: { item(id), f(text), grade(id, ok), result(ok), next(), state }
import { h, toast } from './dom.js';
import { speak, canRecord, startRecording, playUrl } from './speech.js';
import { sfx } from './sound.js';
import { pick } from './util.js';
import { checkBuild, tilesOf } from './exgen.js';

const PRAISE = ['¡Muy bien!', '¡Perfecto!', '¡Genial!', '¡Eso es!', '¡Estupendo!'];
const SOFT = ['Fast!', 'Nicht ganz.', 'Knapp daneben.'];

export const TYPE_LABEL = {
  listen: 'Hören',
  pic: 'Bild → Wort',
  de2es: 'Auf Spanisch',
  build: 'Satz bauen',
  pairs: 'Paare finden',
  speak: 'Nachsprechen',
};

export function sayText(item, f) {
  return f(item.say || item.es);
}

/** 🔊 + 🐢 Knöpfe */
export function audioButtons(text, { big = false } = {}) {
  return h('div.audio-row',
    h('button.icon-btn', { type: 'button', onclick: () => speak(text), style: big ? 'min-height:64px;font-size:20px;padding:10px 22px' : null },
      h('span.ico', { 'aria-hidden': 'true' }, '🔊'), 'Anhören'),
    h('button.icon-btn', { type: 'button', onclick: () => speak(text, { slow: true }) },
      h('span.ico', { 'aria-hidden': 'true' }, '🐢'), 'Langsam'));
}

function feedback(ok, item, ctx, extra) {
  const say = sayText(item, ctx.f);
  return h(`div.feedback.${ok ? 'right' : 'wrong'}`,
    h('b', ok ? pick(PRAISE) : `${pick(SOFT)} Richtig ist:`),
    h('div.sol',
      h('span', ctx.f(item.es), h('br'), h('span.muted.small', ctx.f(item.de))),
      h('button.icon-btn', { type: 'button', 'aria-label': 'Anhören', onclick: () => speak(say) }, h('span.ico', '🔊'))),
    extra || null);
}

function frame(label, body, foot) {
  return h('div.step',
    h('div.step-body', h('div.step-label', label), body),
    h('div.step-foot', foot));
}

function nextBtn(ctx, text = 'Weiter') {
  return h('button.btn', { type: 'button', onclick: () => ctx.next() }, text);
}

// ── Auswahl: Hören / Bild / Deutsch→Spanisch ──
function renderChoice(ex, ctx) {
  const item = ctx.item(ex.id);
  const say = sayText(item, ctx.f);
  const foot = h('div');
  const fb = h('div');
  let prompt;
  if (ex.type === 'listen') {
    prompt = [h('div.prompt', 'Was hörst du?'), audioButtons(say, { big: true })];
    setTimeout(() => speak(say), 250);
  } else if (ex.type === 'pic') {
    prompt = [h('div.prompt', 'Wie heißt das auf Spanisch?'), h('div.big-emoji', { 'aria-hidden': 'true' }, item.emoji)];
  } else {
    prompt = [h('div.prompt', 'Wie sagt man auf Spanisch?'), h('div.es-big', { style: 'font-size:28px;color:var(--azul)' }, `„${ctx.f(item.de)}“`)];
  }
  const field = ex.type === 'listen' ? 'de' : 'es';
  let answered = false;
  const buttons = ex.options.map((id) => {
    const it = ctx.item(id);
    const b = h('button.opt', { type: 'button' }, h('span', ctx.f(it[field])));
    b.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const ok = id === ex.id;
      buttons.forEach((x, i) => {
        if (ex.options[i] === ex.id) x.classList.add('right');
        else if (x === b) x.classList.add('wrong');
        else x.classList.add('dim');
      });
      ok ? sfx.right() : sfx.wrong();
      ctx.grade(ex.id, ok);
      ctx.result(ok);
      if (ex.type !== 'listen' || !ok) speak(say);
      fb.appendChild(feedback(ok, item, ctx));
      foot.appendChild(nextBtn(ctx));
      setTimeout(() => foot.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    });
    return b;
  });
  return frame(TYPE_LABEL[ex.type], [prompt, h('div.options', buttons), fb], foot);
}

// ── Satz bauen ──
function renderBuild(ex, ctx) {
  const item = ctx.item(ex.id);
  const say = sayText(item, ctx.f);
  const chosen = []; // Indizes in ex.tiles
  const line = h('div.build-line', { 'aria-label': 'Dein Satz' });
  const fb = h('div');
  const foot = h('div');
  let done = false;
  const tileBtns = ex.tiles.map((w, i) => h('button.tile', { type: 'button', onclick: () => {
    if (done || chosen.includes(i)) return;
    chosen.push(i);
    sfx.tap();
    draw();
  } }, ctx.f(w)));
  const check = h('button.btn', { type: 'button', disabled: true, onclick: () => {
    if (done) return;
    done = true;
    const ok = checkBuild(item, chosen.map((i) => ex.tiles[i]));
    line.classList.add(ok ? 'right' : 'wrong');
    ok ? sfx.right() : sfx.wrong();
    ctx.grade(ex.id, ok);
    ctx.result(ok);
    speak(say);
    fb.appendChild(feedback(ok, item, ctx));
    check.remove();
    foot.appendChild(nextBtn(ctx));
    setTimeout(() => foot.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
  } }, 'Prüfen');
  function draw() {
    line.textContent = '';
    chosen.forEach((i, pos) => line.appendChild(h('button.tile', { type: 'button', onclick: () => {
      if (done) return;
      chosen.splice(pos, 1);
      draw();
    } }, ctx.f(ex.tiles[i]))));
    tileBtns.forEach((b, i) => b.classList.toggle('used', chosen.includes(i)));
    check.disabled = chosen.length < Math.min(2, tilesOf(item.es).length);
  }
  draw();
  foot.appendChild(check);
  return frame(TYPE_LABEL.build, [
    h('div.prompt', 'Bau den Satz auf Spanisch:'),
    h('p', { style: 'font-size:22px;color:var(--azul);font-weight:600' }, `„${ctx.f(item.de)}“`),
    line,
    h('p.muted.small.center', 'Tippe die Wörter in der richtigen Reihenfolge an.'),
    h('div.tiles', tileBtns),
    fb,
  ], foot);
}

// ── Paare finden ──
function renderPairs(ex, ctx) {
  let sel = null; // { side, id, el }
  const missed = new Set();
  let left = ex.ids.length;
  const fb = h('div');
  const foot = h('div');
  const mk = (side, id) => {
    const it = ctx.item(id);
    const el = h('button.opt', { type: 'button' }, ctx.f(side === 'es' ? it.es : it.de));
    el.addEventListener('click', () => {
      if (el.classList.contains('done')) return;
      if (side === 'es') speak(sayText(it, ctx.f));
      if (!sel || sel.side === side) {
        if (sel) sel.el.classList.remove('sel');
        sel = { side, id, el };
        el.classList.add('sel');
        return;
      }
      const a = sel;
      sel = null;
      a.el.classList.remove('sel');
      if (a.id === id) {
        sfx.tap();
        [a.el, el].forEach((x) => { x.classList.add('right'); setTimeout(() => x.classList.add('done'), 220); });
        ctx.grade(id, !missed.has(id));
        if (--left === 0) {
          const ok = missed.size === 0;
          ok ? sfx.right() : sfx.done();
          ctx.result(ok);
          fb.appendChild(h('div.feedback.right', h('b', ok ? '¡Perfecto! Alle Paare gefunden.' : '¡Bien! Alle Paare gefunden.')));
          foot.appendChild(nextBtn(ctx));
        }
      } else {
        sfx.wrong();
        const esId = a.side === 'es' ? a.id : id;
        missed.add(esId);
        [a.el, el].forEach((x) => { x.classList.remove('shake'); void x.offsetWidth; x.classList.add('shake', 'wrong'); setTimeout(() => x.classList.remove('wrong'), 450); });
      }
    });
    return el;
  };
  const grid = h('div.pairs');
  for (let i = 0; i < ex.ids.length; i++) {
    grid.appendChild(mk('es', ex.left[i]));
    grid.appendChild(mk('de', ex.right[i]));
  }
  return frame(TYPE_LABEL.pairs, [h('div.prompt', 'Was gehört zusammen?'), grid, fb], foot);
}

// ── Nachsprechen ──
function renderSpeak(ex, ctx) {
  const item = ctx.item(ex.id);
  const say = sayText(item, ctx.f);
  const area = h('div');
  const foot = h('div');
  const st = ctx.state;
  setTimeout(() => speak(say), 250);

  const skip = (text = 'Weiter') => { foot.textContent = ''; foot.appendChild(nextBtn(ctx, text)); };

  function noMic(msg) {
    area.textContent = '';
    area.appendChild(h('div.card.tinted', h('p', msg), h('p', { style: 'margin:0' }, '🗣 Sprich den Satz einfach laut nach – das hilft genauso.')));
    skip();
  }

  function explain() {
    area.textContent = '';
    area.appendChild(h('div.card.blue',
      h('h3', '🎙 Gleich fragt dein iPhone nach dem Mikrofon'),
      h('p', 'Bitte tippe dann auf „Erlauben“. Deine Aufnahme bleibt nur auf deinem Handy und wird nirgends hingeschickt.'),
      h('button.btn.blue', { type: 'button', onclick: () => { st.settings.micExplained = true; ctx.save(); recorder(); } }, 'Verstanden')));
    skip('Überspringen');
  }

  let mine = null;
  function recorder() {
    area.textContent = '';
    let rec = null;
    const btn = h('button.rec-btn', { type: 'button' }, h('span.ico', '🎙'), h('span', 'Aufnehmen'));
    const hint = h('p.muted.center.small', 'Tippen zum Starten – nochmal tippen zum Stoppen (max. 6 Sek.)');
    btn.addEventListener('click', async () => {
      if (rec) { rec.stop(); return; }
      try {
        rec = await startRecording(6000);
      } catch (e) {
        noMic('Das Mikrofon ist nicht erlaubt oder nicht verfügbar. (Erlauben kannst du es in den iPhone-Einstellungen.)');
        return;
      }
      btn.classList.add('recording');
      btn.lastChild.textContent = 'Stopp';
      hint.textContent = 'Sprich jetzt …';
      const url = await rec.result;
      rec = null;
      if (!url) { noMic('Die Aufnahme hat leider nicht geklappt.'); return; }
      mine = url;
      compare();
    });
    area.appendChild(btn);
    area.appendChild(hint);
    skip('Überspringen');
  }

  function compare() {
    area.textContent = '';
    area.appendChild(h('div.btn-row', { style: 'margin:16px 0' },
      h('button.btn.green', { type: 'button', onclick: () => playUrl(mine) }, '▶ Ich'),
      h('button.btn.blue', { type: 'button', onclick: () => speak(say) }, '▶ Vorlage')));
    area.appendChild(h('p.center', 'Hör beides an. Wie klang es?'));
    foot.textContent = '';
    foot.appendChild(h('div.btn-row',
      h('button.btn.secondary', { type: 'button', onclick: () => recorder() }, '🔁 Nochmal'),
      h('button.btn', { type: 'button', onclick: () => { sfx.right(); ctx.result(true); ctx.next(); } }, '👍 Klang gut')));
  }

  if (!canRecord()) noMic('Aufnehmen geht auf diesem Gerät leider nicht.');
  else if (!st.settings.micExplained) explain();
  else recorder();

  return frame(TYPE_LABEL.speak, [
    h('div.prompt', 'Hör zu und sprich nach:'),
    h('div.big-emoji', { style: 'font-size:64px', 'aria-hidden': 'true' }, item.emoji),
    h('div.es-big', ctx.f(item.es)),
    h('div.note', ctx.f(item.de)),
    audioButtons(say),
    area,
  ], foot);
}

export function renderExercise(ex, ctx) {
  switch (ex.type) {
    case 'listen':
    case 'pic':
    case 'de2es':
      return renderChoice(ex, ctx);
    case 'build':
      return renderBuild(ex, ctx);
    case 'pairs':
      return renderPairs(ex, ctx);
    case 'speak':
      return renderSpeak(ex, ctx);
    default:
      toast('Unbekannte Übung');
      return frame('', h('p', '…'), nextBtn(ctx));
  }
}

