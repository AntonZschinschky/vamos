// Szenen-Dialog: Gegenüber spricht (Audio), sie wählt die passende Antwort und sagt sie laut.
import { h } from './dom.js';
import { speak, stopSpeaking } from './speech.js';
import { sfx } from './sound.js';
import { shuffle, rng } from './util.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * ctx: { f(text), result(ok), next(), seed, label }
 */
export function renderScene(scene, ctx) {
  const chat = h('div.chat');
  const choices = h('div.options');
  const foot = h('div');
  const rand = rng(ctx.seed || 1);
  let alive = true;
  let i = 0;

  const scrollEnd = (el) => setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'end' }), 30);

  async function step() {
    if (!alive) return;
    if (i >= scene.lines.length) {
      foot.appendChild(h('button.btn', { type: 'button', onclick: () => { alive = false; stopSpeaking(); ctx.next(); } }, 'Weiter'));
      scrollEnd(foot);
      return;
    }
    const line = scene.lines[i++];
    if (line.who === 'note') {
      const b = h('div.bubble.note', ctx.f(line.de));
      chat.appendChild(b);
      scrollEnd(b);
      await wait(1100);
      return step();
    }
    if (line.who === 'npc') {
      const de = h('span.de.hidden', ctx.f(line.de));
      const b = h('button.bubble.npc', { type: 'button', onclick: () => { de.classList.toggle('hidden'); speak(ctx.f(line.es)); } },
        h('span.who', line.name || ''), ctx.f(line.es), de);
      chat.appendChild(b);
      scrollEnd(b);
      await speak(ctx.f(line.es));
      await wait(350);
      return step();
    }
    // who: 'you'
    let firstTry = true;
    const opts = shuffle(line.options, rand);
    const why = h('div');
    choices.textContent = '';
    choices.appendChild(h('div.step-label', { style: 'margin-top:6px' }, 'Deine Antwort:'));
    opts.forEach((o) => {
      const b = h('button.opt', { type: 'button' }, ctx.f(o.es));
      b.addEventListener('click', async () => {
        if (b.disabled) return;
        if (o.ok) {
          sfx.right();
          ctx.result(firstTry);
          choices.textContent = '';
          const bub = h('div.bubble.you', ctx.f(o.es), h('span.de', ctx.f(o.de)));
          chat.appendChild(bub);
          chat.appendChild(h('div.muted.small', { style: 'align-self:flex-end' }, '🗣 Sag es laut!'));
          scrollEnd(bub);
          await speak(ctx.f(o.es));
          await wait(600);
          step();
        } else {
          firstTry = false;
          sfx.wrong();
          b.classList.add('wrong');
          b.disabled = true;
          why.textContent = '';
          why.appendChild(h('div.feedback.wrong', h('b', 'Nicht ganz.'), o.why || 'Versuch eine andere Antwort.'));
          scrollEnd(why);
        }
      });
      choices.appendChild(b);
    });
    choices.appendChild(why);
    scrollEnd(choices);
  }

  setTimeout(step, 300);

  return h('div.step',
    h('div.step-body',
      h('div.step-label', ctx.label || 'Szene'),
      h('h2', scene.title),
      h('p.scene-intro', ctx.f(scene.intro || '')),
      h('p.muted.small', 'Tipp: Tippe auf eine Sprechblase für die Übersetzung.'),
      chat,
      choices),
    h('div.step-foot', foot));
}
