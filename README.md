# Petrified3D

Web viewer 3D / immersive untuk produk **petrified wood stone** (batu kayu fosil).
Node.js + Express menyajikan static site, siap deploy ke Render.com dari GitHub.

**Bahasa web:** seluruh isi website (bukan dokumen README ini) sekarang dalam
**Bahasa Inggris**, karena target audiencenya kebanyakan buyer luar negeri. README ini
tetap Bahasa Indonesia karena dokumentasi teknis untuk kamu.

**Tujuan website:** jadi katalog digital yang memungkinkan buyer di luar negeri "merasakan"
sebuah potongan petrified wood — skala, urat, dan bentuknya — dalam mode 3D, Zoom, dan AR,
seolah barangnya sudah ada di rumah mereka, sebelum mereka pesan.

**Tema:** light & clean, gaya etalase e-commerce (promo bar berjalan, breadcrumb, hero
dengan kartu produk mengambang, tombol WhatsApp mengambang). Hero memakai foto ruang tamu
(`public/assets/photos/hero-living-room-placeholder.jpg`) sebagai **placeholder** — ganti
dengan foto ruangan/produk asli begitu tersedia (tinggal timpa file yang sama, atau ubah
path `src` di `<img>` dalam `index.html` bagian `.hero__photo`).

**Nomor WhatsApp** dipakai konsisten di semua tombol (float button, section Location &
Order, dsb): **0811725511** → format internasional `62811725511`.

Demo ini punya **6 kategori**:
1. Tables & Furniture
2. Wall Panels
3. Sinks & Bathtubs
4. Ornaments & Decor
5. Raw Blocks
6. Accessories & Collectibles

Beberapa item ditandai `accent:true` di `products.js` — ini item pemanis/aksen kecil yang
sengaja **hanya tampil sebagai foto** (tanpa mode 3D/AR), karena bukan produk utama untuk
di-showcase penuh. Item lain yang belum punya foto asli pakai **placeholder "cincin tahun"**
(SVG bertanda `SAMPLE`).

**3 produk** (Amber Ring Slab Table, Fossil Stone Sphere, XL Raw Block) sudah dipasangi
**contoh model 3D** (`.glb`) di `public/assets/models/` supaya mode "3D Model" bisa langsung
dicoba — putar bebas + zoom + AR di HP.

- **4 produk sudah pakai model asli dari Meshy AI** (hasil image-to-3D dari foto referensi,
  lisensi CC0 — bebas dipakai komersial tanpa atribusi), masih tahap **testing** sebelum
  Ferry putuskan beli langganan Meshy Pro untuk produk lainnya:
  - **Amber Ring Slab Table** — `furn-01-petrified-forest-table-meshy.glb` (~400 KB)
  - **Rustic Iron-Leg Table** — `furn-02-rustic-iron-leg-table-meshy.glb` (~280 KB)
  - **Round Coffee Table** — `furn-03-round-coffee-table-meshy.glb` (~280 KB)
  - **Decorative Bowl** — `orn-01-decorative-bowl-meshy.glb` (~260 KB)

  Semua file ini **sudah dikompres** dari ukuran asli 8–19 MB turun ke kisaran 260–400 KB
  (pakai `@gltf-transform/cli`: simplify mesh ke ~15-17% vertex asli + Draco mesh compression
  + tekstur di-convert ke WebP, di-resize maks 1024px). Alasan dikompres:
  1. **File asli kena limit upload GitHub web** (~25MB, kadang gagal di bawah itu juga kalau
     upload beberapa file besar sekaligus) — dengan ukuran sekarang, upload jadi jauh lebih
     lancar.
  2. **Performa loading di HP jauh lebih cepat**, terutama buat buyer luar negeri dengan
     koneksi bervariasi.

  Kalau nanti generate model baru dari Meshy dan ukurannya besar lagi, jalankan perintah yang
  sama untuk kompres sebelum upload ke repo:
  ```bash
  npm install -g @gltf-transform/cli
  gltf-transform optimize input.glb output.glb \
    --compress draco --simplify true --simplify-ratio 0.15 --simplify-error 0.001 \
    --texture-compress webp --texture-size 1024
  ```
- **Fossil Stone Sphere** dan **XL Raw Block** masih pakai model **prosedural** (bentuk
  generik: orb, boulder + tekstur cincin kayu), **bukan hasil scan produk asli**.

Ganti dengan file `.glb` hasil scan/generate asli begitu tersedia (lihat bagian 4 di bawah).

---

## 1. Jalankan di lokal

```bash
npm install
npm start
```

Buka `http://localhost:3000`.

---

## 2. Push ke GitHub (via web editor, tanpa terminal)

1. Buat repo baru di GitHub, misal `petrified3d`.
2. Di GitHub, klik **Add file → Upload files**, lalu upload seluruh isi folder ini
   (pertahankan struktur folder: `public/css`, `public/js`, `public/assets`, dll).
3. Commit ke branch `main`.

*(Kalau nanti mau edit file kecil, buka file di GitHub lalu klik ikon pensil.)*

---

## 3. Deploy ke Render.com

1. Render Dashboard → **New → Web Service** (bukan Static Site, karena ada `server.js`).
2. Connect ke repo GitHub `petrified3d`.
3. Isi:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Deploy. Render otomatis kasih URL publik `https://petrified3d.onrender.com` (atau sesuai nama service).

---

## 4. Mengganti placeholder dengan foto/model asli

Buka `public/js/products.js`. Tiap produk punya field:

```js
{
  id:'furn-01', category:'furniture', name:'Amber Ring Slab Table', ...
  photo: null,     // <- isi: '/assets/photos/furn-01.jpg'
  spin:  null,     // <- isi: array 12–36 foto keliling objek (opsional)
  model: null,     // <- isi: '/assets/models/furn-01.glb' (opsional, scan 3D asli)
  accent: false,   // <- true untuk item pemanis kecil yang cukup foto saja (skip 3D/AR)
}
```

- **`photo`** (wajib diisi untuk produk asli) — 1 foto resolusi tinggi (min. 1200px),
  taruh di `public/assets/photos/`.
- **`spin`** (opsional) — 12–36 foto objek difoto berputar 360° di atas turntable/meja
  putar dengan pencahayaan konsisten. Urutkan file `nama-01.jpg` s/d `nama-24.jpg`.
- **`model`** (opsional, paling immersive) — file `.glb` hasil 3D scan (misal dari aplikasi
  scan HP seperti Polycam/Scaniverse). Taruh di `public/assets/models/`. Viewer otomatis
  mengaktifkan mode "3D Model" dengan kontrol putar bebas + AR di HP begitu file ini ada.
- **`accent`** — set `true` untuk item kecil yang memang cuma perlu tampil sebagai foto
  (aksesoris pemanis, bukan barang utama). Viewer otomatis menyembunyikan tombol pilihan
  mode (karena cuma ada 1 mode: foto) supaya tampilannya lebih rapi.

Kalau `spin` atau `model` kosong (`null`), tombol mode terkait otomatis nonaktif — tidak
perlu ubah kode lain.

### Sumber foto asli
Karena Instagram, Facebook, dan katalog Google Drive butuh login untuk diakses otomatis,
cara tercepat ambil foto asli:
- Download langsung dari HP/galeri, atau
- Screenshot/save dari WhatsApp Business katalog, atau
- Export dari file katalog PDF yang sudah ada lalu crop tiap foto produk jadi file `.jpg` terpisah.

Upload hasilnya ke `public/assets/photos/` lalu update `products.js`.

---

## 5. Section Portfolio (Buyer Visit / Production / Stuffing & Export)

Section baru `#portfolio` menampilkan 3 tab: **Buyer Visit**, **Production**, **Stuffing &
Export** — masing-masing berisi grid foto placeholder (SVG cincin + caption). Data ada di
`public/js/app.js`, cari objek `PORTFOLIO`:

```js
const PORTFOLIO = {
  visit:      { label: 'Buyer Visit', items: [{ caption: '...', seed: 20 }, ...] },
  production: { label: 'Production', items: [...] },
  stuffing:   { label: 'Stuffing & Export', items: [...] },
};
```

Ganti tiap item jadi foto asli dengan menambahkan field `photo: '/assets/photos/xxx.jpg'`
lalu sesuaikan render di `renderPortfolio()` (`app.js`) untuk pakai `<img>` kalau field
`photo` terisi — sama seperti pola yang dipakai di grid produk.

---

## 6. Section Location, Catalogue & Order

Section `#location` menampilkan alamat warehouse (Tulungagung, Jawa Timur, plus-code
`WV4M+MJ`) dengan tombol **Get Directions** (Google Maps), **Request Catalogue**, dan
**Order via WhatsApp** — keduanya memakai nomor `62811725511` dengan pesan pre-filled
berbeda. Edit teks pesan atau alamat langsung di `index.html` bagian `<section id="location">`.

---

## Struktur folder

```
petrified3d/
├── server.js              # Express static server
├── package.json
├── public/
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   │   ├── products.js    # data 6 kategori + produk (edit di sini)
│   │   ├── viewer.js       # engine viewer (3D model / spin 360 / photo zoom)
│   │   └── app.js          # render grid, tabs, portfolio, buka modal
│   └── assets/
│       ├── photos/         # taruh foto asli di sini
│       └── models/         # 3 contoh .glb generik ada di sini (ganti dgn scan asli)
└── README.md
```
