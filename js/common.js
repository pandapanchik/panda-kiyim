import { SHOP } from './data.js';

// Do'kon ma'lumotlarini sahifaga qo'yish
const links = {
  phone: `tel:${SHOP.phone.replace(/\s/g, '')}`,
  telegram: `https://t.me/${SHOP.telegram}`,
  instagram: `https://instagram.com/${SHOP.instagram}`,
};
document.querySelectorAll('[data-shop]').forEach((el) => {
  const key = el.dataset.shop;
  if (el.tagName === 'A' && links[key]) el.href = links[key];
  if (!el.hasAttribute('data-shop-keep')) {
    el.textContent = key === 'telegram' || key === 'instagram' ? '@' + SHOP[key] : SHOP[key];
  }
});
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// Mobil menyu
const toggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
toggle?.addEventListener('click', () => {
  const open = header.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? 'Yopish' : 'Menyu';
});
header?.querySelectorAll('.site-nav a').forEach((a) =>
  a.addEventListener('click', () => {
    header.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = 'Menyu';
  })
);

// 3D og'ish: [data-tilt] elementlari sichqoncha tomonga buriladi
const canTilt =
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches;

export function bindTilt(root = document) {
  if (!canTilt) return;
  root.querySelectorAll('[data-tilt]:not([data-tilt-bound])').forEach((el) => {
    el.setAttribute('data-tilt-bound', '');
    const max = Number(el.dataset.tilt) || 10;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
      el.classList.add('is-tilting');
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.classList.remove('is-tilting');
    });
  });
}
bindTilt();
