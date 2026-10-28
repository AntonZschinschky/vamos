// Einstellungen: Name, Stimme, Tempo, Ton, Home-Bildschirm, Sicherung, Zurücksetzen.
import { h, toast } from '../dom.js';
import { app, go } from '../ctx.js';
import { speak, availableRegions, hasTTS } from '../speech.js';
import { exportCode, importCode, defaultState } from '../store.js';
import { homeScreenHowto, isStandalone } from './onboarding.js';

function seg(options, value, onPick) {
  const wrap = h('div.seg', { role: 'radiogroup' });
  const draw = (v) => {
    wrap.textContent = '';
    options.forEach(([val, label]) => wrap.appendChild(h(`button${val === v ? '.on' : ''}`, {
      type: 'button', role: 'radio', 'aria-checked': String(val === v),
      onclick: () => { onPick(val); draw(val); },
    }, label)));
  };
  draw(value);
  return wrap;
}

export const VERSION_LABEL = 'Version 1';

export function settingsView() {
  const s = app.state.settings;
  const set = (k, v) => { s[k] = v; app.applySettings(); app.save(); };
  const regions = availableRegions();

  const name = h('input.field', { type: 'text', value: s.name || '', placeholder: 'Ana', autocomplete: 'given-name', autocapitalize: 'words' });
  name.addEventListener('change', () => { set('name', name.value.trim()); toast('Gespeichert ✓'); });

  let voiceNote = null;
  if (!hasTTS() || !regions.any) {
    voiceNote = h('p.small', { style: 'color:var(--terra-dark)' }, 'Auf diesem Gerät ist keine spanische Stimme gefunden worden. Am iPhone: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Spanisch → z. B. „Mónica“ (Spanien) oder „Paulina“ (Mexiko) laden.');
  } else if ((s.voice === 'es-MX' && !regions.MX) || (s.voice === 'es-ES' && !regions.ES)) {
    voiceNote = h('p.small.muted', 'Diese Stimme ist auf dem Gerät nicht installiert – es wird eine andere spanische Stimme genutzt.');
  }

  const sound = h('input', { type: 'checkbox', checked: !!s.sound, 'aria-label': 'Töne an' });
  sound.addEventListener('change', () => set('sound', sound.checked));

  const codeOut = h('textarea.field', { readonly: true, rows: 4, 'aria-label': 'Sicherungs-Code' });
  const codeIn = h('textarea.field', { rows: 4, placeholder: 'Code hier einfügen …', 'aria-label': 'Code einfügen' });

  async function copyCode() {
    const code = exportCode(app.state);
    codeOut.value = code;
    codeOut.classList.remove('hidden');
    try {
      await navigator.clipboard.writeText(code);
      toast('Code kopiert ✓ – zum Beispiel in eine Notiz einfügen.');
    } catch (e) {
      codeOut.focus();
      codeOut.select();
      toast('Bitte den markierten Code kopieren.');
    }
  }

  function restore() {
    let next;
    try {
      next = importCode(codeIn.value);
    } catch (e) {
      toast(e.message);
      return;
    }
    if (!confirm('Fortschritt aus dem Code wiederherstellen? Der jetzige Stand wird ersetzt.')) return;
    next.onboarded = true;
    app.state = next;
    app.applySettings();
    app.save();
    toast('Wiederhergestellt ✓');
    go('#/');
  }

  function reset() {
    if (!confirm('Wirklich ALLES zurücksetzen? Lektionen, Karten und Streak gehen verloren.')) return;
    if (!confirm('Ganz sicher? Das kann man nicht rückgängig machen.')) return;
    const keep = { ...app.state.settings };
    app.state = defaultState();
    app.state.settings = keep;
    app.state.onboarded = true;
    app.save();
    toast('Zurückgesetzt.');
    go('#/');
  }

  codeOut.classList.add('hidden');

  return h('div.page',
    h('div.page-head', h('h1', 'Einstellungen'), h('a.icon-btn', { href: '#/' }, '‹ Zurück')),

    h('div.card',
      h('label.lbl', 'Dein Vorname'),
      h('p.small.muted', 'Für Sätze wie „Me llamo …“.'),
      name),

    h('div.card',
      h('label.lbl', 'Stimme'),
      seg([['es-ES', '🇪🇸 Spanien'], ['es-MX', '🇲🇽 Mexiko']], s.voice, (v) => { set('voice', v); speak('¡Hola! ¿Qué tal?'); }),
      voiceNote,
      h('label.lbl', { style: 'margin-top:16px' }, 'Sprechtempo'),
      seg([[0.75, '🐢 Ruhig'], [0.9, 'Normal'], [1, '🐇 Zügig']], s.rate, (v) => { set('rate', v); speak('Buenos días, ¿cómo está usted?'); }),
      h('div', { style: 'margin-top:12px' }, h('button.icon-btn', { type: 'button', onclick: () => speak('Buenos días, ¿cómo está usted?') }, h('span.ico', '🔊'), 'Probe hören'))),

    h('div.card', h('div.toggle-row', h('span', '🔔 Töne bei richtig/falsch'), h('label.switch', sound, h('span')))),

    isStandalone() ? null : h('div.card.blue',
      h('h3', '📱 Auf den Home-Bildschirm'),
      h('p', 'Damit ¡Vamos! wie eine App startet und dein Fortschritt sicher bleibt:'),
      homeScreenHowto()),

    h('div.card',
      h('h3', '💾 Sicherung'),
      h('p.small.muted', 'Dein Fortschritt liegt nur auf diesem Handy. Kopiere ab und zu den Code und bewahre ihn auf (z. B. in einer Notiz oder per Nachricht an dich selbst).'),
      h('div.stack',
        h('button.btn.blue', { type: 'button', onclick: copyCode }, '📋 Code kopieren'),
        codeOut,
        h('label.lbl', { style: 'margin-top:12px' }, 'Wiederherstellen'),
        codeIn,
        h('button.btn.secondary', { type: 'button', onclick: restore }, 'Code einfügen & wiederherstellen'))),

    h('div.card',
      h('h3', 'Zurücksetzen'),
      h('p.small.muted', 'Löscht allen Lernfortschritt und alle Karten.'),
      h('button.btn.secondary', { type: 'button', style: 'color:var(--terra-dark)', onclick: reset }, 'Alles zurücksetzen …')),

    h('p.center.small.muted', `¡Vamos! · ${VERSION_LABEL} · funktioniert auch offline`));
}
