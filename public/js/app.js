document.getElementById('year').textContent = new Date().getFullYear();

let CATEGORIES = [];
let PRODUCTS = [];

const tabsEl = document.querySelector('.tabs');
const gridEl = document.getElementById('productGrid');
const modal = document.getElementById('viewerModal');

let activeCategory = 'all';

function cardMediaSVG(product) {
  return Viewer.placeholderSVG(product.ringSeed || 1);
}

function viewerTagFor(product) {
  if (product.model) return '3D MODEL';
  if (product.spin && product.spin.length > 2) return '360° SPIN';
  return product.accent ? 'PHOTO' : 'PHOTO ZOOM';
}

function renderTabs() {
  tabsEl.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'tab';
  all.textContent = 'All';
  all.dataset.cat = 'all';
  all.setAttribute('role', 'tab');
  all.setAttribute('aria-selected', activeCategory === 'all');
  all.addEventListener('click', () => { activeCategory = 'all'; render(); });
  tabsEl.appendChild(all);

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.textContent = cat.label;
    btn.dataset.cat = cat.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', activeCategory === cat.id);
    btn.addEventListener('click', () => { activeCategory = cat.id; render(); });
    tabsEl.appendChild(btn);
  });
}

function renderGrid() {
  gridEl.innerHTML = '';
  const items = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  items.forEach(product => {
    const card = document.createElement('button');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__media">
        ${product.photo ? `<img src="${product.photo}" alt="${product.name}">` : cardMediaSVG(product)}
        ${product.photo ? '' : '<span class="card__badge">SAMPLE</span>'}
        ${product.soldOut ? '<span class="badge-soldout card__soldout">Sold Out</span>' : ''}
        <span class="card__viewer-tag">${viewerTagFor(product)}</span>
      </div>
      <div class="card__body">
        <h3>${product.name}</h3>
        <p>${CATEGORIES.find(c => c.id === product.category).label}</p>
        <p class="card__price">Ask for Price</p>
      </div>
    `;
    card.addEventListener('click', () => openProduct(product));
    gridEl.appendChild(card);
  });
}

function render() {
  [...tabsEl.children].forEach(btn => {
    btn.setAttribute('aria-selected', String(btn.dataset.cat === activeCategory));
  });
  renderGrid();
}

function openProduct(product) {
  document.getElementById('viewerCat').textContent = CATEGORIES.find(c => c.id === product.category).label;
  document.getElementById('viewerTitle').textContent = product.name;
  document.getElementById('viewerDesc').textContent = product.desc;

  const soldOutEl = document.getElementById('viewerSoldOut');
  soldOutEl.hidden = !product.soldOut;

  const metaEl = document.getElementById('viewerMeta');
  metaEl.innerHTML = Object.entries(product.meta || {})
    .map(([k, v]) => `<span>${k}: ${v}</span>`)
    .join('');

  const priceEl = document.getElementById('viewerPrices');
  const waUrl = 'https://wa.me/62811725511?text=' + encodeURIComponent("Hi, I'd like to ask for the price of: " + product.name);
  priceEl.innerHTML = '<h4>Available sizes</h4>'
    + ((product.variants || []).length ? '<table>' + product.variants.map(v => `<tr><td>${v.size}</td></tr>`).join('') + '</table>' : '')
    + `<a class="btn btn--primary price-cta" href="${waUrl}" target="_blank" rel="noopener">Ask for Price on WhatsApp</a>`
    + '<p class="price-note">Each piece is unique — contact us for current stock, motifs and shipping.</p>';
  priceEl.hidden = false;

  Viewer.open(product);

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  Viewer.close();
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });


// ---- Floating WhatsApp button: hidden until user scrolls past the hero on mobile ----
const floatWa = document.querySelector('.float-wa');
if (floatWa) {
  const toggleWa = () => {
    if (window.innerWidth > 640 || window.scrollY > 420) {
      floatWa.classList.add('is-visible');
    } else {
      floatWa.classList.remove('is-visible');
    }
  };
  toggleWa();
  window.addEventListener('scroll', toggleWa, { passive: true });
  window.addEventListener('resize', toggleWa);
}

// ---- Hero featured product card ----
function renderHero() { /* landing hero is static; nothing to render */ }

function renderAll() {
  renderTabs();
  render();
  renderHero();
}

function applyData(d) {
  CATEGORIES = d.categories; PRODUCTS = d.products;
  renderAll();
}

// skeleton cards while the catalogue loads
gridEl.innerHTML = Array.from({ length: 6 }, () => '<div class="card card--skeleton" aria-hidden="true"><div class="card__media"></div><div class="card__body"><h3>&nbsp;</h3><p>&nbsp;</p></div></div>').join('');

window.loadCatalogue(applyData)
  .then(applyData)
  .catch(() => {
    gridEl.innerHTML = '<p class="load-error">Catalogue could not be loaded. Please refresh, or message us on WhatsApp.</p>';
  });
