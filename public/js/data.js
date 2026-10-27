/* Catalogue loader: Supabase -> (cache) -> /products.json fallback.
 * Exposes window.loadCatalogue(onUpdate) -> Promise<{categories, products, portfolio}> */
(function () {
  const C = window.P3D_CONFIG;

  function normalise(raw) {
    const categories = (raw.categories || []).slice().sort((a, b) => a.sort - b.sort);
    const products = (raw.products || [])
      .filter(p => p.active !== false)
      .sort((a, b) => a.sort - b.sort)
      .map(p => ({
        id: p.id, category: p.category, name: p.name, desc: p.description || '',
        meta: p.meta || {}, photo: p.photo || null, spin: p.spin || null, model: p.model || null,
        ringSeed: p.ring_seed || 1, accent: !!p.accent, soldOut: !!p.sold_out,
      }));
    const portfolio = {};
    (raw.portfolio || []).slice().sort((a, b) => a.sort - b.sort).forEach(r => {
      (portfolio[r.group_key] = portfolio[r.group_key] || { label: r.group_label, items: [] })
        .items.push({ caption: r.caption, seed: r.seed || 1, photo: r.photo || null });
    });
    return { categories, products, portfolio };
  }

  async function sb(table, signal) {
    const res = await fetch(`${C.SUPABASE_URL}/rest/v1/${table}?select=*`, {
      headers: { apikey: C.SUPABASE_KEY, Authorization: 'Bearer ' + C.SUPABASE_KEY },
      signal,
    });
    if (!res.ok) throw new Error(table + ' ' + res.status);
    return res.json();
  }

  async function fromSupabase() {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), C.TIMEOUT_MS);
    try {
      const [categories, products, portfolio] = await Promise.all([
        sb('p3d_categories', ctl.signal), sb('p3d_products', ctl.signal), sb('p3d_portfolio', ctl.signal),
      ]);
      if (!products.length) throw new Error('empty');
      return { categories, products, portfolio };
    } finally { clearTimeout(t); }
  }

  async function fromStatic() {
    const res = await fetch('/products.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('products.json ' + res.status);
    return res.json();
  }

  function readCache() {
    try {
      const c = JSON.parse(localStorage.getItem(C.CACHE_KEY) || 'null');
      return c && c.raw ? c : null;
    } catch (e) { return null; }
  }
  function writeCache(raw) {
    try { localStorage.setItem(C.CACHE_KEY, JSON.stringify({ t: Date.now(), raw })); } catch (e) {}
  }

  window.loadCatalogue = async function (onUpdate) {
    const cached = readCache();
    const refresh = fromSupabase().then(raw => { writeCache(raw); return normalise(raw); });

    if (cached) {                                   // instant paint from cache, refresh quietly
      if (Date.now() - cached.t > C.CACHE_TTL_MS) {
        refresh.then(d => onUpdate && onUpdate(d)).catch(() => {});
      }
      return normalise(cached.raw);
    }
    try { return await refresh; }                   // first visit: wait for Supabase
    catch (e) {
      console.warn('Supabase unavailable, using /products.json fallback:', e.message);
      return normalise(await fromStatic());
    }
  };
})();
