import { PRODUCTS } from './data.js';
import { productCard } from './cards.js';
import { bindTilt } from './common.js';

const grid = document.querySelector('[data-new-arrivals]');
if (grid) {
  grid.innerHTML = PRODUCTS.filter((p) => p.isNew)
    .slice(0, 4)
    .map((p) => productCard(p, { asLink: true }))
    .join('');
  bindTilt(grid);
}
