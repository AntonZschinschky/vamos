// Edle Sammelkarte, Zieh-Animation, Papel picado.
import { h, reducedMotion } from '../dom.js';
import { sfx } from '../sound.js';
import { RARITY_DE } from '../cards.js';

const EPOCH_EMOJI = {
  'Steinzeit': '🦣', 'Altes Ägypten': '🏜️', 'Antikes Griechenland': '🏛️', 'Römisches Reich': '🏺',
  'Mittelalter': '🏰', 'Azteken': '🌞', 'Maya': '🗿', 'Inka': '🦙', 'Entdeckungen': '⛵',
  'Frühe Neuzeit': '📜', '19. Jahrhundert': '🎩', 'Frühes 20. Jh.': '📻', 'Erster Weltkrieg': '🕊️',
  'Weimarer Republik': '💶', 'Zwischenkriegszeit': '🎞️', 'Zweiter Weltkrieg': '✉️', 'DDR': '🚗', 'Moderne': '🚀',
};

export function epochEmoji(epoch) {
  return EPOCH_EMOJI[epoch] || '📜';
}

/** Bild mit Platzhalter, falls es fehlt. */
export function cardImage(card, cls = '') {
  const ph = () => h(`div.ph${cls}`, { 'aria-hidden': 'true' }, epochEmoji(card.epoch));
  if (!card.image) return ph();
  const img = h('img', { src: './' + card.image.replace(/^\.?\//, ''), alt: card.title, loading: 'lazy', decoding: 'async' });
  img.addEventListener('error', () => img.replaceWith(ph()));
  return img;
}

export function cardEl(card) {
  return h(`div.hcard.${card.rarity}`,
    h('div.hcard-paper',
      h('div.hcard-top', h('span', card.epoch), h('span.rar', RARITY_DE[card.rarity]), h('span', card.year)),
      h('div.hcard-img', cardImage(card)),
      h('div.ornament', { 'aria-hidden': 'true' }, '❦ ✦ ❦'),
      h('h2', card.title),
      h('p.fact', card.fact),
      card.imageCredit ? h('p.credit', 'Bild: ', card.imageCredit) : null,
      card.placeholder ? h('p.ph-badge', 'Platzhalter-Karte') : null));
}

/** Karte groß als Overlay zeigen. */
export function showCard(card, owned) {
  const close = () => ov.remove();
  const ov = h('div.overlay', { role: 'dialog', 'aria-modal': 'true', 'aria-label': card.title },
    h('div.overlay-inner',
      cardEl(card),
      owned && owned.count > 1 ? h('p.center', { style: 'color:white;margin:12px 0 0' }, `${owned.count}× gesammelt`) : null,
      h('button.btn.secondary', { type: 'button', style: 'margin-top:14px', onclick: close }, 'Schließen')));
  document.body.appendChild(ov);
  return ov;
}

const PICADO_COLORS = ['#D6336C', '#F2A541', '#2E7D6B', '#1F4E79', '#C8553D', '#8E44AD'];

/** Papel-picado-Fähnchen regnen lassen (nur ohne „weniger Bewegung“). */
export function papelPicado(n = 36) {
  if (reducedMotion()) return;
  const box = h('div.picado', { 'aria-hidden': 'true' });
  for (let i = 0; i < n; i++) {
    const dur = 2.6 + Math.random() * 2.2;
    box.appendChild(h('i', { style: `left:${Math.random() * 100}%;background:${PICADO_COLORS[i % PICADO_COLORS.length]};animation-duration:${dur}s;animation-delay:${Math.random() * 0.8}s;--rot:${Math.round(Math.random() * 720 - 360)}deg` }));
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 6000);
}

export function garland(n = 14) {
  return h('div.garland', { 'aria-hidden': 'true' }, Array.from({ length: n }, () => h('i')));
}

const MSG = {
  bronze: 'Eine Bronze-Karte!',
  silver: '✨ Eine Silber-Karte! ✨',
  gold: '🌟 ¡Increíble! Eine GOLD-Karte! 🌟',
};
const REASON = {
  finale: 'Station geschafft – mindestens Silber!',
  streak: '7 Tage in Folge – dafür gibt es Gold!',
  pity: 'Deine Geduld wird belohnt!',
};

/**
 * Zieh-Bühne: verdeckte Karte, Antippen → dreht sich um.
 * result: { id, rarity, duplicate, complete, reason }, onDone(): weiter
 */
export function drawStage(card, result, { onDone, onAlbum }) {
  const msg = h('div.draw-msg', 'Tippe auf die Karte!');
  const after = h('div.stack', { style: 'margin-top:12px' });
  const back = h('div.face.back', cardEl(card));
  const front = h('button.face.front', { type: 'button', 'aria-label': 'Karte umdrehen' },
    h('div.seal', '¡V!'), h('div.tap', 'Antippen zum Umdrehen'));
  const flipper = h('div.flipper', front, back);
  const stage = h('div.draw-stage.wiggle', flipper);
  let flipped = false;
  front.addEventListener('click', () => {
    if (flipped) return;
    flipped = true;
    sfx.flip();
    flipper.classList.add('flipped');
    setTimeout(() => {
      front.style.visibility = 'hidden';
      if (result.rarity === 'gold') { sfx.gold(); papelPicado(48); }
      else if (result.rarity === 'silver') sfx.silver();
      else sfx.done();
      msg.textContent = '';
      msg.appendChild(document.createTextNode(MSG[result.rarity]));
      if (result.reason && REASON[result.reason]) msg.appendChild(h('div.small', { style: 'font-weight:500;opacity:.9' }, REASON[result.reason]));
      if (result.duplicate) msg.appendChild(h('div.small', { style: 'font-weight:500;opacity:.9' }, result.complete ? '🏆 Sammlung komplett! Diese Karte hast du doppelt.' : 'Diese Karte hast du schon.'));
      else if (result.complete) msg.appendChild(h('div.small', { style: 'font-weight:500' }, '🏆 Sammlung komplett!'));
      after.appendChild(h('button.btn', { type: 'button', onclick: onDone }, 'Fertig'));
      after.appendChild(h('button.btn.secondary', { type: 'button', onclick: onAlbum }, '🃏 Zur Sammlung'));
    }, reducedMotion() ? 10 : 820);
  });
  return h('div.overlay', { style: 'animation:none' },
    h('div.overlay-inner', msg, stage, after));
}
