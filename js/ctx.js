// Gemeinsamer App-Zustand für alle Ansichten.
import * as data from '../data/index.js';
import { indexContent } from './content.js';
import { load, save } from './store.js';
import { today, fill } from './util.js';
import { configure } from './speech.js';
import { setSound } from './sound.js';

export const C = indexContent(data);

export const app = {
  state: load(),
  save() {
    save(this.state);
  },
  day() {
    return today();
  },
  name() {
    return (this.state.settings.name || '').trim() || 'Ana';
  },
  /** {name} ersetzen */
  f(s) {
    return fill(s, this.name());
  },
  applySettings() {
    const s = this.state.settings;
    configure({ rate: s.rate, voice: s.voice });
    setSound(s.sound);
  },
  /** Lernminuten für heute gutschreiben. */
  addSeconds(sec) {
    const d = this.day();
    const day = this.state.days[d] || (this.state.days[d] = { minutes: 0, done: false });
    day.minutes = Math.round(((day.minutes || 0) + sec / 60) * 10) / 10;
  },
};

export function go(hash) {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = hash;
}
