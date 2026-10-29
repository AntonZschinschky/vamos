// Lern-Player: führt durch die Aufgabenliste der Tageseinheit; speichert nach jedem Schritt.
import { h, mount } from '../dom.js';
import { app, C, go } from '../ctx.js';
import { speak, stopSpeaking } from '../speech.js';
import { sfx } from '../sound.js';
import { introduce, grade } from '../srs.js';
import { renderExercise, audioButtons, sayText } from '../exercises.js';
import { renderScene } from '../scene.js';
import { renderNews } from '../news.js';
import { completeSession, cardEligible, currentStreak } from '../session.js';
import { drawCard } from '../cards.js';
import { learnedItems } from '../content.js';
import { rng, words } from '../util.js';
import { drawStage, garland, papelPicado } from './cardview.js';

let lastTick = Date.now();

function tick() {
  const now = Date.now();
  const sec = Math.min(120, Math.max(0, (now - lastTick) / 1000));
  lastTick = now;
  return sec;
}

export function playerView() {
  const s = app.state.session;
  if (!s) {
    setTimeout(() => go('#/'), 0);
    return h('div');
  }
  lastTick = Date.now();
  const bar = h('div');
  const root = h('div.player',
    h('div.player-top',
      h('div.progress', { role: 'progressbar', 'aria-label': 'Fortschritt' }, bar),
      h('button.close-btn', { type: 'button', onclick: close }, '✕ Schließen')),
  );
  const slot = h('div', { style: 'flex:1;display:flex;flex-direction:column' });
  root.appendChild(slot);

  function close() {
    stopSpeaking();
    const sec = tick();
    s.seconds += sec;
    app.addSeconds(sec);
    app.save();
    go('#/');
  }

  function next() {
    stopSpeaking();
    const sec = tick();
    s.seconds += sec;
    app.addSeconds(sec);
    s.pos++;
    app.save();
    render();
    window.scrollTo(0, 0);
  }

  const result = (ok) => { ok ? s.right++ : s.wrong++; };
  const ctx = {
    state: app.state,
    item: (id) => C.items.get(id),
    f: (t) => app.f(t),
    grade: (id, ok) => { grade(app.state.srs, id, ok, app.day()); },
    result,
    next,
    save: () => app.save(),
  };

  function render() {
    if (s.pos >= s.tasks.length) return finish();
    const task = s.tasks[s.pos];
    if (task.t === 'card' && !s.card) return finish();
    bar.style.width = `${Math.round((s.pos / (s.tasks.length - 1)) * 100)}%`;
    root.querySelector('.player-top').classList.toggle('hidden', task.t === 'card');
    mount(slot, renderTask(task));
  }

  function renderTask(task) {
    const lesson = s.kind === 'lesson' ? C.lessons.get(s.ref) : null;
    const unit = lesson ? C.unitById.get(lesson.unitId) : s.kind === 'finale' ? C.unitById.get(s.ref) : null;
    switch (task.t) {
      case 'warmup':
        return simple('Aufwärmen', '🔁', 'Zuerst wiederholen wir',
          [h('p', `${task.n} ${task.n === 1 ? 'Wort' : 'Wörter'} von früher – damit nichts verloren geht.`)], 'Los geht’s');
      case 'goal':
        if (s.kind === 'finale') {
          return simple(`Reise-Szene · ${unit.place}`, unit.emoji, unit.finale.title,
            [h('p', `Zeig, was du in ${unit.place} gelernt hast: erst ein paar Übungen, dann ein längeres Gespräch.`),
              h('p.card.tinted', '🥈 Dafür bekommst du mindestens eine Silber-Karte!')], 'Los geht’s');
        }
        return simple(`Einheit ${lesson.unitIndex + 1} · ${unit.place} · Lektion ${lesson.index + 1}`, unit.emoji, lesson.title,
          [h('p', { style: 'font-size:21px' }, lesson.goal)], 'Los geht’s');
      case 'learn':
        return learn(task, lesson);
      case 'tip':
        return simple('Mini-Tipp', '💡', lesson.tip.title, [h('p', { style: 'font-size:20px' }, app.f(lesson.tip.text))], 'Weiter');
      case 'ex':
        return renderExercise(task.ex, ctx);
      case 'scene': {
        const sc = task.lesson ? C.lessons.get(task.lesson).scene : C.unitById.get(task.finale).finale;
        return renderScene(sc, { ...ctx, seed: s.seed + s.pos, label: task.finale ? 'Reise-Szene' : 'Szene' });
      }
      case 'news': {
        const known = new Set(learnedItems(C, app.state).concat(lesson ? lesson.items : []).flatMap((it) => words(app.f(it.es))));
        return renderNews(C.newsById.get(task.id), { ...ctx, known, seed: s.seed + 11 });
      }
      case 'done':
        return done(lesson, unit);
      case 'card':
        return cardStep();
      default:
        return simple('', '🤔', '…', [], 'Weiter');
    }
  }

  function simple(label, emoji, title, body, btn) {
    return h('div.step',
      h('div.step-body',
        label ? h('div.step-label', label) : null,
        h('div.big-emoji', { 'aria-hidden': 'true' }, emoji),
        h('h1.center', title),
        h('div', { style: 'text-align:center' }, body)),
      h('div.step-foot', h('button.btn', { type: 'button', onclick: next }, btn)));
  }

  function learn(task, lesson) {
    const it = C.items.get(task.id);
    const idx = lesson.items.findIndex((x) => x.id === it.id);
    introduce(app.state.srs, [it.id], app.day());
    const say = sayText(it, app.f.bind(app));
    setTimeout(() => speak(say), 300);
    const de = h('button.de-reveal', { type: 'button', onclick: () => {
      de.textContent = app.f(it.de);
      de.classList.add('shown');
    } }, '👁 Deutsch anzeigen');
    return h('div.step',
      h('div.step-body',
        h('div.step-label', `Neu · ${idx + 1} von ${lesson.items.length}`),
        h('div.big-emoji', { 'aria-hidden': 'true' }, it.emoji),
        h('div.es-big', app.f(it.es), it.region ? [' ', h('span.flag', it.region === 'MX' ? '🇲🇽 Mexiko' : '🇪🇸 Spanien')] : null),
        it.alt && it.alt.length ? h('div.note', 'auch: ', it.alt.join(' · ')) : null,
        audioButtons(say, { big: true }),
        de,
        it.note ? h('div.note', 'ℹ️ ', it.note) : null),
      h('div.step-foot', h('button.btn', { type: 'button', onclick: next }, 'Weiter')));
  }

  function finish() {
    app.state.session = null;
    app.save();
    go('#/');
  }

  /** Abschluss: einmalig eintragen + ggf. Karte ziehen (Ergebnis wird gespeichert → kein Neu-Ziehen bei Abbruch). */
  function settle() {
    if (s.finished) return;
    const day = app.day();
    const eligible = cardEligible(app.state, s, day);
    completeSession(app.state, s, day);
    if (s.kind === 'lesson') s.newWords = C.lessons.get(s.ref).items.length;
    if (eligible) {
      const res = drawCard(app.state, C.cards, {
        day,
        rand: rng(s.seed ^ 0x5bd1e995),
        min: s.kind === 'finale' ? 'silver' : 'bronze',
        streakDays: currentStreak(app.state.streak, day),
      });
      if (res) {
        s.card = res;
        app.state.days[day].card = res.id;
      }
    }
    app.save();
  }

  function done(lesson, unit) {
    settle();
    sfx.done();
    if (s.right + s.wrong > 0 && s.wrong === 0) papelPicado(24);
    const total = s.right + s.wrong;
    const pct = total ? Math.round((s.right / total) * 100) : 100;
    const minutes = Math.max(1, Math.round(s.seconds / 60));
    let cando;
    if (s.kind === 'lesson') cando = lesson.cando;
    else if (s.kind === 'finale') cando = `Ich habe die Station ${unit.place} geschafft!`;
    else cando = 'Ich habe heute wiederholt – so bleibt alles im Kopf.';
    return h('div.step',
      h('div.step-body',
        garland(),
        h('div.done-hero', h('div.em', s.kind === 'finale' ? '🏅' : '🎉'), h('h1', '¡Lo lograste!'), h('p.muted', 'Geschafft für heute.')),
        h('div.card.green', h('div.step-label', { style: 'color:var(--agave)' }, 'Das kannst du jetzt'), h('div.cando', app.f(cando))),
        h('div.stats',
          h('div', h('b', `${pct}%`), h('span', 'richtig')),
          h('div', h('b', minutes), h('span', minutes === 1 ? 'Minute' : 'Minuten')),
          s.kind === 'lesson'
            ? h('div', h('b', s.newWords || 0), h('span', 'neue Wörter'))
            : h('div', h('b', currentStreak(app.state.streak, app.day())), h('span', 'Tage in Folge'))),
        s.card ? null : h('p.center.muted', 'Heute hast du schon eine Karte gezogen – morgen wartet die nächste!')),
      h('div.step-foot',
        h('button.btn', { type: 'button', onclick: s.card ? next : finish }, s.card ? '🃏 Karte ziehen' : 'Fertig')));
  }

  function cardStep() {
    const card = C.cardById.get(s.card.id);
    return drawStage(card, s.card, {
      onDone: () => { document.querySelectorAll('.picado').forEach((p) => p.remove()); finish(); },
      onAlbum: () => { app.state.session = null; app.save(); go('#/sammlung'); },
    });
  }

  render();
  return root;
}
