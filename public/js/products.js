/**
 * CATEGORY & PRODUCT DATA
 * -----------------------
 * This is sample/demo data. Every product below is a PLACEHOLDER (a generated
 * "cross-section ring" graphic) so the site runs and looks right before real
 * assets exist.
 *
 * To use real content, for each product set:
 *   - photo:  "/assets/photos/xxx.jpg"        (always recommended)
 *   - spin:   ["/assets/photos/xxx-01.jpg", ... "-24.jpg"]  (optional, 12-36 frames
 *              shot in a circle around the object = 360° spin viewer)
 *   - model:  "/assets/models/xxx.glb"        (optional, real 3D scan = full 3D viewer)
 *
 * Only "photo" is required. If "spin" or "model" are omitted, the viewer
 * simply won't offer that mode for that product.
 */

const CATEGORIES = [
  { id: 'meja',      label: 'Meja & Furnitur' },
  { id: 'panel',     label: 'Panel Dinding' },
  { id: 'ornamen',   label: 'Ornamen & Dekorasi' },
  { id: 'bongkahan', label: 'Bongkahan Alami' },
  { id: 'aksesoris', label: 'Aksesoris & Koleksi' },
];

const PRODUCTS = [
  // ---- MEJA & FURNITUR ----
  { id:'meja-01', category:'meja', name:'Meja Slab Amber Ring', desc:'Meja tunggal dari potongan batu kayu fosil dengan lingkar tahun yang masih utuh, finishing poles glossy. (Model 3D di bawah adalah bentuk generik contoh — bukan hasil scan produk asli.)',
    meta:{ Ukuran:'150 x 80 x 5 cm', Berat:'~180 kg', Finishing:'Poles glossy' },
    photo:null, spin:null, model:'/assets/models/meja-01-slab-amber.glb', ringSeed:1 },
  { id:'meja-02', category:'meja', name:'Meja Kaki Besi Rustic', desc:'Slab petrified wood dipadukan kaki besi hitam untuk tampilan industrial-rustic.',
    meta:{ Ukuran:'120 x 65 x 4 cm', Berat:'~110 kg', Finishing:'Matte' },
    photo:null, spin:null, model:null, ringSeed:2 },
  { id:'meja-03', category:'meja', name:'Coffee Table Bulat', desc:'Meja tamu bundar mengikuti bentuk asli batang pohon yang membatu.',
    meta:{ Ukuran:'Ø70 x 45 cm', Berat:'~65 kg', Finishing:'Poles glossy' },
    photo:null, spin:null, model:null, ringSeed:3 },

  // ---- PANEL DINDING ----
  { id:'panel-01', category:'panel', name:'Panel Dinding Mosaic', desc:'Susunan potongan tipis petrified wood membentuk pola mosaic untuk aksen dinding.',
    meta:{ Ukuran:'60 x 60 cm / modul', Ketebalan:'1.5 cm', Finishing:'Natural' },
    photo:null, spin:null, model:null, ringSeed:4 },
  { id:'panel-02', category:'panel', name:'Panel Backdrop TV', desc:'Panel besar satu lempeng untuk latar TV atau feature wall.',
    meta:{ Ukuran:'200 x 100 cm', Ketebalan:'3 cm', Finishing:'Semi-gloss' },
    photo:null, spin:null, model:null, ringSeed:5 },

  // ---- ORNAMEN & DEKORASI ----
  { id:'orn-01', category:'ornamen', name:'Mangkuk Dekoratif', desc:'Mangkuk hias hasil bubut dari bongkahan solid, memperlihatkan urat warna alami.',
    meta:{ Ukuran:'Ø25 x 12 cm', Berat:'~4 kg', Finishing:'Poles glossy' },
    photo:null, spin:null, model:null, ringSeed:6 },
  { id:'orn-02', category:'ornamen', name:'Bola Batu Fosil', desc:'Bola dekoratif polos, cocok untuk meja kerja atau rak pajangan. (Model 3D di bawah adalah bentuk generik contoh — bukan hasil scan produk asli.)',
    meta:{ Diameter:'15 cm', Berat:'~5.5 kg', Finishing:'Poles glossy' },
    photo:null, spin:null, model:'/assets/models/orn-02-bola-fosil.glb', ringSeed:7 },
  { id:'orn-03', category:'ornamen', name:'Lampu Meja Fosil', desc:'Dasar lampu meja dari potongan batu kayu fosil dengan lubang kabel tersembunyi.',
    meta:{ Ukuran:'20 x 20 x 30 cm', Berat:'~7 kg', Finishing:'Semi-gloss' },
    photo:null, spin:null, model:null, ringSeed:8 },

  // ---- BONGKAHAN ALAMI ----
  { id:'bong-01', category:'bongkahan', name:'Bongkahan Raw XL', desc:'Bongkahan besar tanpa finishing, memperlihatkan tekstur kulit kayu yang membatu. (Model 3D di bawah adalah bentuk generik contoh — bukan hasil scan produk asli.)',
    meta:{ Ukuran:'80 x 50 x 40 cm', Berat:'~220 kg', Finishing:'Raw / natural' },
    photo:null, spin:null, model:'/assets/models/bong-01-raw-boulder.glb', ringSeed:9 },
  { id:'bong-02', category:'bongkahan', name:'Bongkahan Batang Utuh', desc:'Potongan batang pohon fosil yang masih menampakkan bentuk aslinya secara utuh.',
    meta:{ Panjang:'110 cm', Berat:'~300 kg', Finishing:'Raw / natural' },
    photo:null, spin:null, model:null, ringSeed:10 },

  // ---- AKSESORIS & KOLEKSI ----
  { id:'aks-01', category:'aksesoris', name:'Liontin Fosil Mini', desc:'Potongan kecil kualitas koleksi untuk liontin kalung, menampilkan warna amber tajam.',
    meta:{ Ukuran:'3 x 2 cm', Berat:'~15 g', Finishing:'Poles glossy' },
    photo:null, spin:null, model:null, ringSeed:11 },
  { id:'aks-02', category:'aksesoris', name:'Paperweight Kolektor', desc:'Potongan grade koleksi untuk pajangan meja kerja, disertai sertifikat keaslian.',
    meta:{ Ukuran:'6 x 5 x 3 cm', Berat:'~180 g', Finishing:'Poles glossy' },
    photo:null, spin:null, model:null, ringSeed:12 },
];
