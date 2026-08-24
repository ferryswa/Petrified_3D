document.getElementById('year').textContent = new Date().getFullYear();

const tabsEl = document.querySelector('.tabs');
const gridEl = document.getElementById('productGrid');
const modal = document.getElementById('viewerModal');

let activeCategory = 'all';

function cardMediaSVG(product) {
  return Viewer.placeholderSVG(product.ringSeed || 1);
}

function viewerTagFor(product) {
  if (product.model) return '3D MODEL';
  if (product.spin && product.spin.length > 2) return 'SPIN 360°';
  return 'FOTO ZOOM';
}

function renderTabs() {
  const all = document.createElement('button');
  all.className = 'tab';
  all.textContent = 'Semua';
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
        <span class="card__viewer-tag">${viewerTagFor(product)}</span>
      </div>
      <div class="card__body">
        <h3>${product.name}</h3>
        <p>${CATEGORIES.find(c => c.id === product.category).label}</p>
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

  const metaEl = document.getElementById('viewerMeta');
  metaEl.innerHTML = Object.entries(product.meta || {})
    .map(([k, v]) => `<span>${k}: ${v}</span>`)
    .join('');

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

renderTabs();
render();

// ---- Hero featured product card ----
const heroProduct = PRODUCTS.find(p => p.id === 'meja-01') || PRODUCTS[0];
if (heroProduct) {
  document.getElementById('heroProductName').textContent = heroProduct.name;
  document.getElementById('heroProductThumb').innerHTML = cardMediaSVG(heroProduct);
  document.getElementById('heroProductCard').addEventListener('click', () => openProduct(heroProduct));
}
