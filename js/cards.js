import { CATEGORIES, formatPrice, imgUrl, imgSrcset } from './data.js';

export function productCard(p, { asLink = false } = {}) {
  const tag = asLink ? 'a' : 'button';
  const attrs = asLink ? `href="kiyimlar.html#${p.id}"` : `type="button" data-open="${p.id}"`;
  return `
    <article class="card">
      <${tag} class="card-hit" ${attrs} aria-label="${p.name}, ${formatPrice(p.price)}">
        <span class="card-img" data-tilt="10">
          <img src="${imgUrl(p.img, 600)}" srcset="${imgSrcset(p.img)}" sizes="(max-width: 700px) 50vw, 25vw" alt="" loading="lazy">
          ${p.isNew ? '<span class="card-badge">Yangi</span>' : ''}
        </span>
        <span class="card-meta">
          <span class="card-name">${p.name}</span>
          <span class="card-cat">${CATEGORIES[p.cat]}</span>
          <span class="card-price">${formatPrice(p.price)}</span>
        </span>
      </${tag}>
    </article>`;
}
