import { PRODUCTS, CATEGORIES, formatPrice, imgUrl, orderLink } from './data.js';
import { productCard } from './cards.js';
import { bindTilt } from './common.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

/* ---------- Ro'yxat, filtr, saralash ---------- */
const grid = document.querySelector('[data-grid]');
const count = document.querySelector('[data-count]');
const chips = document.querySelectorAll('[data-filter]');
const sortSel = document.querySelector('[data-sort]');

const params = new URLSearchParams(location.search);
let filter = CATEGORIES[params.get('cat')] ? params.get('cat') : 'all';

function renderGrid() {
  let list = PRODUCTS.filter((p) => filter === 'all' || p.cat === filter);
  if (sortSel.value === 'asc') list = [...list].sort((a, b) => a.price - b.price);
  if (sortSel.value === 'desc') list = [...list].sort((a, b) => b.price - a.price);
  if (sortSel.value === 'default') list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  grid.innerHTML = list.map((p) => productCard(p)).join('');
  count.textContent = `${list.length} ta kiyim`;
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
  bindTilt(grid);
}

chips.forEach((c) =>
  c.addEventListener('click', () => {
    filter = c.dataset.filter;
    const url = new URL(location.href);
    if (filter === 'all') url.searchParams.delete('cat');
    else url.searchParams.set('cat', filter);
    history.replaceState(null, '', url);
    renderGrid();
  })
);
sortSel.addEventListener('change', renderGrid);
grid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open]');
  if (btn) openProduct(btn.dataset.open);
});
renderGrid();

/* ---------- 3D halqa ---------- */
const ring = document.querySelector('[data-ring]');
const track = document.querySelector('[data-ring-track]');
const ringItems = PRODUCTS.filter((_, i) => i % 2 === 0).slice(0, 10);
const N = ringItems.length;
const step = 360 / N;

track.innerHTML = ringItems
  .map(
    (p, i) => `
    <button type="button" class="ring-item" data-open="${p.id}" style="--i:${i}" aria-label="${p.name}">
      <img src="${imgUrl(p.img, 500)}" alt="" draggable="false">
    </button>`
  )
  .join('');
const ringEls = [...track.children];

let angle = 0;
let velocity = reduceMotion ? 0 : -0.08;
let dragging = false;
let lastX = 0;
let moved = 0;

function layoutRing() {
  const w = ringEls[0].offsetWidth;
  const radius = Math.round((w / 2 / Math.tan(Math.PI / N)) * 1.7);
  ring.style.setProperty('--radius', `${radius}px`);
}
layoutRing();
window.addEventListener('resize', layoutRing);

function paintRing() {
  track.style.transform = `translateZ(calc(var(--radius) * -1)) rotateY(${angle}deg)`;
  ringEls.forEach((el, i) => {
    // Orqadagi kiyimlar xiralashadi, oldindagilar yorqin
    const a = ((i * step + angle) * Math.PI) / 180;
    const depth = (Math.cos(a) + 1) / 2;
    el.style.setProperty('--depth', depth.toFixed(3));
    el.style.zIndex = Math.round(depth * 100);
  });
}

function tick() {
  if (!dragging) {
    angle += velocity;
    // Sudrashdan keyin sekin-asta odatiy tezlikka qaytadi
    const base = reduceMotion ? 0 : -0.08;
    velocity += (base - velocity) * 0.03;
  }
  paintRing();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

ring.addEventListener('pointerdown', (e) => {
  dragging = true;
  moved = 0;
  lastX = e.clientX;
  ring.setPointerCapture(e.pointerId);
  ring.classList.add('is-dragging');
});
ring.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  moved += Math.abs(dx);
  velocity = dx * 0.25;
  angle += velocity;
});
function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  ring.classList.remove('is-dragging');
  if (moved < 6) {
    const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-open]');
    if (hit) openProduct(hit.dataset.open);
  }
}
ring.addEventListener('pointerup', endDrag);
ring.addEventListener('pointercancel', () => {
  dragging = false;
  ring.classList.remove('is-dragging');
});
// Klaviatura: Enter tugmasi
track.addEventListener('keydown', (e) => {
  const btn = e.target.closest('[data-open]');
  if (btn && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    openProduct(btn.dataset.open);
  }
});
track.addEventListener('click', (e) => {
  // Sichqoncha bosilishi pointerup orqali ishlanadi; bu faqat klaviatura uchun
  if (e.detail === 0) {
    const btn = e.target.closest('[data-open]');
    if (btn) openProduct(btn.dataset.open);
  }
});

/* ---------- Mahsulot oynasi ---------- */
const dialog = document.querySelector('[data-dialog]');
const garment = dialog.querySelector('[data-garment]');
const stage = dialog.querySelector('[data-stage]');
const flipBtn = dialog.querySelector('[data-flip]');
const orderBtn = dialog.querySelector('[data-order]');
const colorsEl = dialog.querySelector('[data-colors]');
const sizesEl = dialog.querySelector('[data-sizes]');
const colorLabel = dialog.querySelector('[data-color-label]');

let current = null;
let state = { color: '', size: '' };
let turn = 0; // garment aylanish burchagi (gradus)

function setTurn(deg, animate = true) {
  turn = deg;
  garment.classList.toggle('is-animating', animate);
  garment.style.setProperty('--turn', `${turn}deg`);
  const back = Math.abs(((turn % 360) + 360) % 360 - 180) < 90;
  flipBtn.textContent = back ? 'Old tomonini koʻrish' : 'Yorligʻini koʻrish';
}

function updateOrder() {
  const ready = state.size && state.color;
  orderBtn.classList.toggle('is-disabled', !ready);
  orderBtn.setAttribute('aria-disabled', String(!ready));
  orderBtn.textContent = ready ? 'Telegram orqali buyurtma berish' : 'Oʻlchamni tanlang';
  orderBtn.href = ready ? orderLink(current, state.color, state.size) : '#';
}

function openProduct(id) {
  const p = byId[id];
  if (!p) return;
  current = p;
  state = { color: p.colors[0], size: '' };

  dialog.querySelector('[data-pd-img]').src = imgUrl(p.img, 900);
  dialog.querySelector('[data-pd-img]').alt = p.name;
  dialog.querySelector('[data-pd-cat]').textContent = CATEGORIES[p.cat];
  dialog.querySelector('[data-pd-name]').textContent = p.name;
  dialog.querySelector('[data-pd-price]').textContent = formatPrice(p.price);
  dialog.querySelector('[data-tag-name]').textContent = p.name;
  dialog.querySelector('[data-tag-fabric]').textContent = p.fabric;
  dialog.querySelector('[data-tag-care]').textContent = p.care;

  colorsEl.innerHTML = p.colors
    .map(
      (c) => `<label class="swatch swatch-${c === 'Oq' ? 'white' : 'black'}">
        <input type="radio" name="color" value="${c}" ${c === state.color ? 'checked' : ''}>
        <span class="sr-only">${c}</span></label>`
    )
    .join('');
  colorLabel.textContent = state.color;
  sizesEl.innerHTML = p.sizes
    .map((s) => `<label class="size"><input type="radio" name="size" value="${s}"><span>${s}</span></label>`)
    .join('');

  setTurn(0, false);
  updateOrder();
  history.replaceState(null, '', `#${p.id}`);
  if (!dialog.open) dialog.showModal();
}

colorsEl.addEventListener('change', (e) => {
  state.color = e.target.value;
  colorLabel.textContent = state.color;
  updateOrder();
});
sizesEl.addEventListener('change', (e) => {
  state.size = e.target.value;
  updateOrder();
});
orderBtn.addEventListener('click', (e) => {
  if (orderBtn.classList.contains('is-disabled')) {
    e.preventDefault();
    sizesEl.classList.remove('is-shake');
    void sizesEl.offsetWidth;
    sizesEl.classList.add('is-shake');
    sizesEl.querySelector('input')?.focus();
  }
});
flipBtn.addEventListener('click', () => setTurn(Math.round(turn / 180) * 180 + 180));

dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  history.replaceState(null, '', location.pathname + location.search);
});

// Kiyimni sudrab aylantirish
let gDrag = null;
stage.addEventListener('pointerdown', (e) => {
  gDrag = { x: e.clientX, start: turn };
  stage.setPointerCapture(e.pointerId);
  garment.classList.remove('is-animating');
});
stage.addEventListener('pointermove', (e) => {
  if (!gDrag) return;
  setTurn(gDrag.start + (e.clientX - gDrag.x) * 0.6, false);
});
function endGarmentDrag() {
  if (!gDrag) return;
  gDrag = null;
  setTurn(Math.round(turn / 180) * 180); // eng yaqin tomonga to'xtaydi
}
stage.addEventListener('pointerup', endGarmentDrag);
stage.addEventListener('pointercancel', endGarmentDrag);

// Bosh sahifadan kiyim havolasi bilan kelinsa (kiyimlar.html#id)
if (location.hash) openProduct(location.hash.slice(1));
