/**
 * VIEWER ENGINE
 * Handles three immersive modes inside the modal stage:
 *   - "model": real .glb 3D scan via <model-viewer> (drag to orbit, pinch to zoom, AR on phone)
 *   - "spin":  a sequence of photos, dragged left/right to fake a 360° turntable
 *   - "photo": a single image with drag-to-pan + pinch/scroll-to-zoom
 *
 * When a product has no real "photo" yet, a generated tree-ring placeholder
 * (clearly labeled SAMPLE) is used instead so the interaction still works end to end.
 */

const Viewer = (() => {
  const stage = document.getElementById('viewerStage');
  const modeSwitch = document.getElementById('viewerModeSwitch');
  let current = null;
  let activeMode = null;
  let cleanupFn = null;

  const RING_PALETTES = [
    ['#c9863f', '#93472a', '#e8b876', '#5a4632'],
    ['#b97a3a', '#7a3a22', '#dba55f', '#4b3a2a'],
    ['#c47a3e', '#8a4020', '#e0a862', '#5f4a35'],
  ];

  function placeholderSVG(seed = 1) {
    const pal = RING_PALETTES[seed % RING_PALETTES.length];
    const rings = 9 + (seed % 4);
    let circles = '';
    for (let i = rings; i > 0; i--) {
      const r = (i / rings) * 46;
      const color = pal[i % pal.length];
      const wobble = (seed * i) % 3;
      circles += `<circle cx="${50 + wobble * 0.4}" cy="${50 - wobble * 0.3}" r="${r}" fill="none" stroke="${color}" stroke-width="${1.4 + (i % 3) * 0.6}" opacity="0.9"/>`;
    }
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sample placeholder texture">
        <rect width="100" height="100" fill="#241d18"/>
        ${circles}
        <text x="50" y="97" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="3.6" fill="#ede3d0" opacity="0.55">SAMPLE — ganti dengan foto asli</text>
      </svg>`;
  }

  function clearStage() {
    if (cleanupFn) { cleanupFn(); cleanupFn = null; }
    stage.innerHTML = '';
  }

  function buildModeButtons(product) {
    const modes = [
      { key: 'model', label: '3D Model', available: !!product.model },
      { key: 'spin', label: 'Spin 360°', available: !!(product.spin && product.spin.length > 2) },
      { key: 'photo', label: 'Foto Zoom', available: true },
    ];
    modeSwitch.innerHTML = '';
    modes.forEach(m => {
      const btn = document.createElement('button');
      btn.textContent = m.label;
      btn.disabled = !m.available;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => setMode(m.key));
      btn.dataset.mode = m.key;
      modeSwitch.appendChild(btn);
    });
    return modes;
  }

  function highlightModeButton(mode) {
    [...modeSwitch.children].forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === mode));
    });
  }

  function setMode(mode) {
    if (!current) return;
    activeMode = mode;
    highlightModeButton(mode);
    clearStage();

    if (mode === 'model') renderModel(current);
    else if (mode === 'spin') renderSpin(current);
    else renderPhotoZoom(current);
  }

  // ---- MODE: real 3D model via model-viewer ----
  function renderModel(product) {
    const mv = document.createElement('model-viewer');
    mv.setAttribute('src', product.model);
    mv.setAttribute('camera-controls', '');
    mv.setAttribute('auto-rotate', '');
    mv.setAttribute('ar', '');
    mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    mv.setAttribute('shadow-intensity', '1');
    mv.setAttribute('exposure', '1');
    mv.style.background = '#0f0c0a';
    stage.appendChild(mv);

    const hint = document.createElement('div');
    hint.className = 'viewer-stage__hint';
    hint.textContent = 'Seret untuk putar • cubit/scroll untuk zoom • AR tersedia di HP';
    stage.appendChild(hint);
  }

  // ---- MODE: 360 photo spin (drag through frame sequence) ----
  function renderSpin(product) {
    const frames = product.spin;
    let index = 0;
    const img = document.createElement('img');
    img.className = 'spin-frame';
    img.src = frames[0];
    img.draggable = false;
    stage.appendChild(img);

    const hint = document.createElement('div');
    hint.className = 'viewer-stage__hint';
    hint.textContent = 'Seret ke kiri / kanan untuk memutar';
    stage.appendChild(hint);

    let dragging = false;
    let startX = 0;
    let startIndex = 0;

    const onDown = (e) => {
      dragging = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      startIndex = index;
    };
    const onMove = (e) => {
      if (!dragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      const dx = x - startX;
      const step = Math.round(dx / 12);
      index = ((startIndex - step) % frames.length + frames.length) % frames.length;
      img.src = frames[index];
    };
    const onUp = () => { dragging = false; };

    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    cleanupFn = () => {
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }

  // ---- MODE: single photo (or placeholder) with drag-pan + zoom ----
  function renderPhotoZoom(product) {
    let scale = 1, panX = 0, panY = 0;
    let dragging = false, lastX = 0, lastY = 0;

    let mediaEl;
    if (product.photo) {
      mediaEl = document.createElement('img');
      mediaEl.className = 'zoom-img';
      mediaEl.src = product.photo;
      mediaEl.draggable = false;
      stage.appendChild(mediaEl);
    } else {
      const wrap = document.createElement('div');
      wrap.className = 'viewer-stage__placeholder';
      wrap.innerHTML = placeholderSVG(product.ringSeed || 1);
      mediaEl = wrap.querySelector('svg');
      wrap.style.transformOrigin = 'center center';
      stage.appendChild(wrap);
      mediaEl = wrap;
    }

    const hint = document.createElement('div');
    hint.className = 'viewer-stage__hint';
    hint.textContent = 'Seret untuk geser • scroll / cubit untuk zoom';
    stage.appendChild(hint);

    function applyTransform() {
      mediaEl.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    }

    const onWheel = (e) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.0015;
      scale = Math.min(3, Math.max(1, scale + delta));
      applyTransform();
    };
    const onDown = (e) => {
      dragging = true;
      lastX = e.touches ? e.touches[0].clientX : e.clientX;
      lastY = e.touches ? e.touches[0].clientY : e.clientY;
    };
    const onMove = (e) => {
      if (!dragging || scale === 1) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      panX += x - lastX;
      panY += y - lastY;
      lastX = x; lastY = y;
      applyTransform();
    };
    const onUp = () => { dragging = false; };

    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    cleanupFn = () => {
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }

  function open(product) {
    current = product;
    const modes = buildModeButtons(product);
    const first = modes.find(m => m.available);
    setMode(first.key);
  }

  function close() {
    clearStage();
    current = null;
    activeMode = null;
  }

  return { open, close, placeholderSVG };
})();
