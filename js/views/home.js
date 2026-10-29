// Start: Begrüßung, großer Knopf, Streak mit Joker, nächste Station.
import { h } from '../dom.js';
import { app, C, go } from '../ctx.js';
import { nextStep } from '../content.js';
import { planSession, currentStreak } from '../session.js';
import { addDays, isoWeek, parseDay } from '../util.js';
import { unlock } from '../speech.js';

export function greeting(hour = new Date().getHours()) {
  if (hour >= 5 && hour < 13) return '¡Buenos días';
  if (hour >= 13 && hour < 20) return '¡Buenas tardes';
  return '¡Buenas noches';
}

export function startSession(extra = false) {
  unlock();
  app.state.session = planSession(C, app.state, app.day(), { extra });
  app.save();
  go('#/lernen');
}

function weekDots(day) {
  const d = parseDay(day);
  const monday = addDays(day, -((d.getDay() + 6) % 7));
  const names = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const st = app.state.streak;
  return h('div.week-dots', names.map((n, i) => {
    const dd = addDays(monday, i);
    const done = app.state.days[dd] && app.state.days[dd].done;
    const joker = st.jokerDay === dd && isoWeek(dd) === st.jokerWeek && st.jokerUsed;
    const cls = done ? '.on' : joker ? '.joker' : '';
    return h('span', h(`i${cls}${dd === day ? '.today' : ''}`, done ? '✓' : joker ? '🃏' : ''), n);
  }));
}

export function homeView() {
  const st = app.state;
  const day = app.day();
  const step = nextStep(C, st);
  const s = st.session;
  const todayDone = st.days[day] && st.days[day].done;
  const streak = currentStreak(st.streak, day);
  const jokerFree = st.streak.jokerWeek !== isoWeek(day) || !st.streak.jokerUsed;

  let main;
  if (s && s.finished && s.card) {
    main = [h('button.btn.big', { type: 'button', onclick: () => go('#/lernen') }, '🃏 Deine Karte wartet!')];
  } else if (s) {
    const pct = Math.round((s.pos / Math.max(1, s.tasks.length - 1)) * 100);
    main = [
      h('button.btn.big', { type: 'button', onclick: () => { unlock(); go('#/lernen'); } }, '▶ Weitermachen'),
      h('p.center.muted.small', { style: 'margin-top:8px' }, `Du warst bei ${pct} %. Es geht genau dort weiter.`),
    ];
  } else if (todayDone) {
    main = [
      h('div.card.green.center', h('div', { style: 'font-size:44px' }, '✅'), h('h2', 'Heute geschafft!'), h('p', { style: 'margin:0' }, '¡Hasta mañana! Morgen geht’s weiter.')),
      step ? h('button.btn.secondary', { type: 'button', onclick: () => startSession(true) }, '➕ Noch eine Lektion') : null,
    ];
  } else {
    main = [h('button.btn.big', { type: 'button', onclick: () => startSession(false) }, 'Heute lernen · 15 Min')];
  }

  let station = null;
  if (step) {
    const unit = C.unitById.get(step.unitId);
    const sub = step.kind === 'lesson' ? `Lektion ${C.lessons.get(step.id).index + 1}: ${C.lessons.get(step.id).title}` : `Reise-Szene: ${unit.finale.title}`;
    station = h('div.card', h('div.next-station',
      h('div.em', { 'aria-hidden': 'true' }, unit.emoji),
      h('div', h('div.small.muted', `Nächste Station · ${unit.country === 'MX' ? '🇲🇽' : '🇪🇸'}`), h('b', `${unit.place} – ${unit.titleEs}`), h('div.muted', sub))));
  } else {
    station = h('div.card', h('b', '🏆 Alle Stationen geschafft!'), h('p.muted', { style: 'margin:0' }, 'Jetzt wiederholst du jeden Tag – so bleibt alles frisch für die Reise.'));
  }

  return h('div.page',
    h('div.page-head',
      h('div'),
      h('a.icon-btn', { href: '#/einstellungen' }, h('span.ico', { 'aria-hidden': 'true' }, '⚙️'), 'Einstellungen')),
    h('div.hello', `${greeting()}, ${app.name()}!`),
    h('p.hello-sub', 'Schön, dass du da bist.'),
    h('div.tile-band', { 'aria-hidden': 'true' }),
    h('div.stack', main),
    h('div', { style: 'height:18px' }),
    h('div.card',
      h('div.streak',
        h('div.flame', { 'aria-hidden': 'true' }, streak ? '🔥' : '🌱'),
        h('div',
          h('b', streak === 1 ? '1 Tag in Folge' : `${streak} Tage in Folge`),
          h('div.small.muted', jokerFree ? '🃏 Joker diese Woche frei: 1 verpasster Tag ist erlaubt.' : '🃏 Joker diese Woche schon genutzt.'))),
      weekDots(day)),
    station);
}
