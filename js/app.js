// Einstieg: kleiner Hash-Router, Tab-Leiste, iOS-Audio-Entsperrung, Service Worker.
import { mount } from './dom.js';
import { app, C, go } from './ctx.js';
import { persist } from './store.js';
import { unlock } from './speech.js';
import { unlockAudio } from './sound.js';
import { homeView } from './views/home.js';
import { playerView } from './views/player.js';
import { routeView } from './views/route.js';
import { phrasesView } from './views/phrases.js';
import { collectionView } from './views/collection.js';
import { settingsView } from './views/settings.js';
import { onboardingView } from './views/onboarding.js';

const ROUTES = {
  '': { view: homeView, tab: 'start' },
  'lernen': { view: playerView, full: true },
  'route': { view: routeView, tab: 'route' },
  'saetze': { view: phrasesView, tab: 'saetze' },
  'sammlung': { view: collectionView, tab: 'sammlung' },
  'einstellungen': { view: settingsView, tab: 'start' },
  'willkommen': { view: onboardingView, full: true },
};

const root = document.getElementById('app');
const tabs = document.getElementById('tabs');

function render() {
  let key = location.hash.replace(/^#\/?/, '').split('?')[0];
  if (!app.state.onboarded && key !== 'willkommen') return go('#/willkommen');
  if (!ROUTES[key]) key = '';
  const r = ROUTES[key];
  document.querySelectorAll('.overlay, .picado').forEach((o) => o.remove());
  tabs.classList.toggle('hidden', !!r.full);
  tabs.querySelectorAll('a').forEach((a) => {
    const on = a.dataset.tab === r.tab;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  mount(root, r.view());
  if (!r.full) window.scrollTo(0, 0);
}

// iOS: Audio & Sprachausgabe erst nach einem Nutzer-Tipp möglich → beim ersten Tipp entsperren.
function firstGesture() {
  unlock();
  unlockAudio();
  document.removeEventListener('touchend', firstGesture, true);
  document.removeEventListener('click', firstGesture, true);
}
document.addEventListener('touchend', firstGesture, true);
document.addEventListener('click', firstGesture, true);

// Auf einen neuen Tag umspringen, wenn die App lange im Hintergrund war.
let shownDay = app.day();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && app.day() !== shownDay) {
    shownDay = app.day();
    if (!location.hash.startsWith('#/lernen')) render();
  }
});

app.applySettings();
window.addEventListener('hashchange', render);
render();
if (app.state.onboarded) persist();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then((reg) => {
      // Kartenbilder für offline vorab speichern
      const urls = C.cards.filter((c) => c.image).map((c) => './' + c.image.replace(/^\.?\//, ''));
      if (reg.active) reg.active.postMessage({ type: 'precache', urls });
    }).catch(() => {});
  });
}
