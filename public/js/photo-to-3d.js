/**
 * PHOTO → 3D CONVERTER
 * ---------------------
 * Turns a single uploaded photo into an interactive, downloadable 3D relief
 * model, entirely in the browser (no server, no external AI service).
 *
 * How it works (be honest about this with users): it reads the brightness of
 * each pixel and uses that as a height value ("depth from luminance"), then
 * displaces a grid mesh accordingly and paints the original photo on top as
 * a texture. This gives a real, orbit-able, exportable 3D relief of the
 * surface facing the camera — great for flat/slab pieces (panel, meja,
 * aksesoris koleksi) where the texture and grain relief matter. It does NOT
 * reconstruct the back or sides of an object — for a full all-around 3D
 * model you still need multiple photos (Spin 360°) or a real 3D scan.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const els = {
  fileInput: document.getElementById('p3dFile'),
  dropZone: document.getElementById('p3dDropZone'),
  canvasWrap: document.getElementById('p3dCanvasWrap'),
  depth: document.getElementById('p3dDepth'),
  smooth: document.getElementById('p3dSmooth'),
  invert: document.getElementById('p3dInvert'),
  regenerate: document.getElementById('p3dRegenerate'),
  download: document.getElementById('p3dDownload'),
  status: document.getElementById('p3dStatus'),
  empty: document.getElementById('p3dEmpty'),
};

let renderer, scene, camera, controls, mesh, currentImage;
let sampleCanvas = document.createElement('canvas');
let sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

const GRID_W = 180; // mesh resolution (vertices across)
const GRID_H = 135;

function setStatus(msg) {
  if (els.status) els.status.textContent = msg;
}

function initScene() {
  if (renderer) return;

  const width = els.canvasWrap.clientWidth;
  const height = els.canvasWrap.clientHeight;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  els.canvasWrap.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 1.4, 4.2);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.5;
  controls.maxDistance = 9;

  scene.add(new THREE.AmbientLight(0xfff2df, 0.65));
  const key = new THREE.DirectionalLight(0xffe4bd, 1.1);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8899ff, 0.35);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  window.addEventListener('resize', onResize);
  animate();
}

function onResize() {
  if (!renderer) return;
  const width = els.canvasWrap.clientWidth;
  const height = els.canvasWrap.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

function boxBlur(data, w, h, passes) {
  let src = data;
  for (let p = 0; p < passes; p++) {
    const out = new Float32Array(src.length);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0, count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              sum += src[ny * w + nx];
              count++;
            }
          }
        }
        out[y * w + x] = sum / count;
      }
    }
    src = out;
  }
  return src;
}

function computeHeightMap(img) {
  sampleCanvas.width = GRID_W;
  sampleCanvas.height = GRID_H;
  sampleCtx.drawImage(img, 0, 0, GRID_W, GRID_H);
  const { data } = sampleCtx.getImageData(0, 0, GRID_W, GRID_H);

  const lum = new Float32Array(GRID_W * GRID_H);
  for (let i = 0; i < GRID_W * GRID_H; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    lum[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  const passes = parseInt(els.smooth.value, 10);
  return passes > 0 ? boxBlur(lum, GRID_W, GRID_H, passes) : lum;
}

function buildMesh(img) {
  const heightMap = computeHeightMap(img);
  const invert = els.invert.checked;
  const depthScale = parseFloat(els.depth.value) / 100 * 1.1; // 0..1.1 world units

  const aspect = img.naturalWidth / img.naturalHeight;
  const planeW = aspect >= 1 ? 3.2 : 3.2 * aspect;
  const planeH = aspect >= 1 ? 3.2 / aspect : 3.2;

  const geo = new THREE.PlaneGeometry(planeW, planeH, GRID_W - 1, GRID_H - 1);
  const pos = geo.attributes.position;

  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      // PlaneGeometry vertex order: row by row, y flipped vs image (top of plane = top of image)
      const vIndex = (GRID_H - 1 - y) * GRID_W + x;
      let h = heightMap[y * GRID_W + x];
      if (invert) h = 1 - h;
      pos.setZ(vIndex, h * depthScale);
    }
  }
  geo.computeVertexNormals();

  const texture = new THREE.Texture(img);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.82,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });

  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.map && mesh.material.map.dispose();
    mesh.material.dispose();
  }
  mesh = new THREE.Mesh(geo, material);
  mesh.rotation.x = -0.08;
  scene.add(mesh);

  fitCameraToMesh(planeW, planeH, depthScale);
}

function fitCameraToMesh(w, h, depth) {
  const dist = Math.max(w, h) * 1.55 + depth;
  camera.position.set(0, h * 0.18, dist);
  controls.target.set(0, 0, 0);
  controls.update();
}

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  setStatus('Memuat foto…');
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      els.empty.style.display = 'none';
      initScene();
      setStatus('Menghitung peta kedalaman…');
      requestAnimationFrame(() => {
        buildMesh(img);
        setStatus('Selesai — seret untuk memutar, scroll untuk zoom.');
        els.download.disabled = false;
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

els.fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

['dragover', 'dragenter'].forEach(evt =>
  els.dropZone.addEventListener(evt, (e) => { e.preventDefault(); els.dropZone.classList.add('is-drag'); })
);
['dragleave', 'drop'].forEach(evt =>
  els.dropZone.addEventListener(evt, (e) => { e.preventDefault(); els.dropZone.classList.remove('is-drag'); })
);
els.dropZone.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  handleFile(file);
});
els.dropZone.addEventListener('click', () => els.fileInput.click());

els.regenerate.addEventListener('click', () => {
  if (!currentImage) return;
  setStatus('Membangun ulang model…');
  requestAnimationFrame(() => {
    buildMesh(currentImage);
    setStatus('Selesai — seret untuk memutar, scroll untuk zoom.');
  });
});

els.download.addEventListener('click', () => {
  if (!mesh) return;
  setStatus('Mengekspor .glb…');
  const exporter = new GLTFExporter();
  exporter.parse(
    mesh,
    (result) => {
      const blob = new Blob([result], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relief-3d.glb';
      a.click();
      URL.revokeObjectURL(url);
      setStatus('Terunduh sebagai relief-3d.glb');
    },
    (err) => { console.error(err); setStatus('Gagal mengekspor.'); },
    { binary: true }
  );
});
