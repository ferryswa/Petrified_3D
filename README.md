# Petrified3D

Web viewer 3D / immersive untuk produk **petrified wood stone** (batu kayu fosil).
Node.js + Express menyajikan static site, siap deploy ke Render.com dari GitHub.

**Tema:** light & clean, gaya etalase e-commerce (promo bar berjalan, breadcrumb, hero
dengan kartu produk mengambang, tombol WhatsApp mengambang) — terinspirasi dari referensi
yang diberikan, dibangun ulang dengan brand & ilustrasi orisinal milik Petrified3D (bukan
menyalin logo/foto pihak lain). Hero memakai ilustrasi vektor ruang tamu buatan sendiri
(bukan foto asli) dengan meja petrified wood bercincin sebagai elemen fokus — karena tidak
ada foto lifestyle asli yang tersedia untuk dipakai. Ganti dengan foto ruangan/produk asli
kapan pun sudah tersedia.

Demo ini punya **5 kategori**:
1. Meja & Furnitur
2. Panel Dinding
3. Ornamen & Dekorasi
4. Bongkahan Alami
5. Aksesoris & Koleksi

Setiap produk saat ini pakai **placeholder "cincin tahun"** (SVG bertanda `SAMPLE`) karena
belum ada foto/model asli yang bisa diambil otomatis dari Instagram/Facebook/Linktree
(platform tersebut butuh login, jadi tidak bisa di-scrape). Struktur kode sudah siap —
tinggal ganti path file di `public/js/products.js`.

**3 produk** (Meja Slab Amber Ring, Bola Batu Fosil, Bongkahan Raw XL) sudah dipasangi
**contoh model 3D** (`.glb`) di `public/assets/models/` supaya mode "3D Model" bisa langsung
dicoba — putar bebas + zoom + AR di HP. Model-model ini **dibuat secara prosedural**
(bentuk generik: orb, slab, boulder + tekstur cincin kayu), **bukan hasil scan produk asli**,
karena tidak ada file scan 3D nyata yang tersedia dari sumber yang dibagikan. Ganti dengan
file `.glb` hasil scan asli begitu tersedia (lihat bagian 4 di bawah).

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

*(Kalau nanti mau edit file kecil, buka file di GitHub lalu klik ikon pensil — sama
seperti workflow RenovBSD/Bantuin yang biasa dipakai.)*

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

## 4. Fitur baru: Convert Foto → 3D (di halaman utama, `#convert`)

Ini fitur **konversi foto ke model 3D langsung di browser**, tanpa server, tanpa API
eksternal, tanpa biaya tambahan — pakai Three.js (dimuat dari CDN saat halaman dibuka).

**Cara kerja:** kecerahan tiap piksel foto diubah jadi nilai ketinggian ("depth from
luminance"), lalu dipetakan ke mesh 3D dan diberi tekstur foto aslinya. Hasilnya adalah
**relief 3D** dari sisi yang difoto — bisa diputar, di-zoom, dan diunduh sebagai `.glb`.

**Yang perlu dipahami (biar ekspektasi tepat):**
- Ini **bukan** photogrammetry/scan 3D penuh. Sisi belakang & samping objek tidak ikut
  terbentuk, karena hanya ada 1 foto sebagai sumber.
- Paling bagus untuk objek **pipih/flat**: panel dinding, penampang meja, potongan
  aksesoris koleksi — di situ relief serat & cincin kayu terlihat jelas timbul.
- Untuk objek 3 dimensi penuh (bongkahan, bola, meja berkaki), hasil relief akan terlihat
  "gepeng" karena memang keterbatasan metode 1-foto. Untuk itu tetap pakai mode
  **Spin 360°** (banyak foto sekeliling objek) atau scan 3D asli (lihat bagian 4 di
  README ini soal `model`).
- Slider **Kedalaman relief** mengatur seberapa menonjol permukaannya, **Kehalusan**
  meredam noise foto biar tidak bergerigi, dan **Balik arah kedalaman** berguna kalau
  bagian gelap foto seharusnya yang menonjol (bukan yang terang).
- Hasil unduhan `.glb` bisa langsung dipakai sebagai nilai `model` di
  `public/js/products.js` untuk produk pipih yang cocok.

---

## 5. Mengganti placeholder dengan foto/model asli

Buka `public/js/products.js`. Tiap produk punya field:

```js
{
  id:'meja-01', category:'meja', name:'Meja Slab Amber Ring', ...
  photo: null,   // <- isi: '/assets/photos/meja-01.jpg'
  spin:  null,   // <- isi: array 12–36 foto keliling objek (opsional)
  model: null,   // <- isi: '/assets/models/meja-01.glb' (opsional, scan 3D asli)
}
```

- **`photo`** (wajib diisi untuk produk asli) — 1 foto resolusi tinggi (min. 1200px),
  taruh di `public/assets/photos/`.
- **`spin`** (opsional) — 12–36 foto objek difoto berputar 360° di atas turntable/meja
  putar dengan pencahayaan konsisten. Urutkan file `nama-01.jpg` s/d `nama-24.jpg`.
  Ini yang bikin efek "putar produk" tanpa perlu scan 3D sungguhan.
- **`model`** (opsional, paling immersive) — file `.glb` hasil 3D scan (misal dari
  aplikasi scan HP seperti Polycam/Scaniverse, atau photogrammetry dari foto `spin`
  di atas). Taruh di `public/assets/models/`. Viewer otomatis mengaktifkan mode
  "3D Model" dengan kontrol putar bebas + AR di HP begitu file ini ada.

Kalau `spin` atau `model` kosong (`null`), tombol mode terkait otomatis nonaktif —
tidak perlu ubah kode lain.

### Sumber foto asli
Karena Instagram (`@petrified_wood_art_craft`), Facebook, dan katalog Google Drive
butuh login untuk diakses otomatis, cara tercepat ambil foto asli:
- Download langsung dari HP/galeri Ferry, atau
- Screenshot/save dari WhatsApp Business katalog, atau
- Export dari Google Drive catalogue PDF (`Petrified Wood Art Craft_Catalogue IDR_April2026.pdf`)
  lalu crop tiap foto produk jadi file `.jpg` terpisah.

Upload hasilnya ke `public/assets/photos/` lalu update `products.js`.

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
│   │   ├── products.js    # data 5 kategori + produk (edit di sini)
│   │   ├── viewer.js       # engine viewer (3D model / spin 360 / zoom foto)
│   │   └── app.js          # render grid, tab kategori, buka modal
│   └── assets/
│       ├── photos/         # taruh foto asli di sini
│       └── models/         # 3 contoh .glb generik ada di sini (ganti dgn scan asli)
└── README.md
```
