// Erster Start: 3 Willkommens-Seiten (inkl. Vorname) + Home-Bildschirm-Anleitung (nur im Browser).
import { h } from '../dom.js';
import { app, go } from '../ctx.js';
import { persist } from '../store.js';
import { unlock, speak } from '../speech.js';
import { unlockAudio } from '../sound.js';

export function isStandalone() {
  return window.navigator.standalone === true ||
    (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches);
}

const SHARE_ICON = '<svg class="share-ico" width="22" height="26" viewBox="0 0 22 26" aria-hidden="true"><path d="M11 1v15M6 6l5-5 5 5" fill="none" stroke="#1F4E79" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10H3v14h16V10h-4" fill="none" stroke="#1F4E79" stroke-width="2" stroke-linejoin="round"/></svg>';

export function homeScreenHowto() {
  return h('ol.howto',
    h('li', 'Diese Seite in ', h('b', 'Safari'), ' öffnen.'),
    h('li', { html: `Unten in der Mitte auf das <b>Teilen-Symbol</b> ${SHARE_ICON} tippen.` }),
    h('li', 'Etwas nach unten wischen und ', h('b', '„Zum Home-Bildschirm“'), ' antippen.'),
    h('li', 'Oben rechts auf ', h('b', '„Hinzufügen“'), ' tippen.'),
    h('li', 'Ab jetzt ¡Vamos! immer über das neue Symbol auf dem Home-Bildschirm öffnen – dann bleibt dein Fortschritt sicher gespeichert.'));
}

export function onboardingView() {
  let page = 0;
  const root = h('div.onb');
  const pages = isStandalone() ? 3 : 4;

  function finish() {
    app.state.onboarded = true;
    app.save();
    persist();
    go('#/');
  }

  function draw() {
    root.textContent = '';
    let body;
    let btn = 'Weiter';
    let action = () => { page++; draw(); };
    if (page === 0) {
      body = [
        h('div.hero', { 'aria-hidden': 'true' }, '☀️'),
        h('h1', '¡Hola!'),
        h('p', 'Mit ¡Vamos! lernst du Spanisch für deine Reise – nach Spanien, Mexiko und Lateinamerika.'),
        h('p.muted', 'Nur 15 Minuten am Tag. Ganz ohne Vorkenntnisse.'),
      ];
      btn = 'Los geht’s';
      action = () => { unlock(); unlockAudio(); speak('¡Hola! ¡Bienvenida!'); page++; draw(); };
    } else if (page === 1) {
      body = [
        h('div.hero', { 'aria-hidden': 'true' }, '🗺️'),
        h('h1', 'So geht’s'),
        h('div.card', { style: 'text-align:left' },
          h('p', '👆 Jeden Tag ', h('b', 'ein Knopf:'), ' „Heute lernen“. Die App plant alles für dich.'),
          h('p', '🔊 Hören, verstehen, nachsprechen – mit kleinen Tipps auf Deutsch.'),
          h('p', '📰 Echte Sätze aus spanischen und mexikanischen Zeitungen.'),
          h('p', { style: 'margin:0' }, '🃏 Zur Belohnung: eine ', h('b', 'Geschichts-Sammelkarte'), ' jeden Tag.')),
      ];
    } else if (page === 2) {
      const input = h('input.field', { type: 'text', placeholder: 'Dein Vorname', value: app.state.settings.name || '', autocomplete: 'given-name', autocapitalize: 'words', 'aria-label': 'Vorname' });
      body = [
        h('div.hero', { 'aria-hidden': 'true' }, '🙋‍♀️'),
        h('h1', '¿Cómo te llamas?'),
        h('p', 'Wie heißt du? Dann übst du gleich: „Me llamo …“'),
        input,
      ];
      action = () => {
        app.state.settings.name = input.value.trim();
        app.save();
        if (pages === 3) finish();
        else { page++; draw(); }
      };
      btn = pages === 3 ? 'Fertig – los geht’s!' : 'Weiter';
      setTimeout(() => input.focus(), 300);
    } else {
      body = [
        h('div.hero', { 'aria-hidden': 'true' }, '📱'),
        h('h1', { style: 'font-size:32px' }, 'Auf den Home-Bildschirm'),
        h('p', 'So startest du ¡Vamos! wie eine richtige App – auch ohne Internet:'),
        homeScreenHowto(),
      ];
      btn = 'Fertig – los geht’s!';
      action = finish;
    }
    root.appendChild(h('div.step-body', { style: 'flex:1' }, body));
    root.appendChild(h('div.dots', { 'aria-hidden': 'true' }, Array.from({ length: pages }, (_, i) => h(`i${i === page ? '.on' : ''}`))));
    root.appendChild(h('button.btn.big', { type: 'button', onclick: action }, btn));
    if (page > 0) root.appendChild(h('button.btn.ghost', { type: 'button', onclick: () => { page--; draw(); } }, 'Zurück'));
  }
  draw();
  return root;
}
