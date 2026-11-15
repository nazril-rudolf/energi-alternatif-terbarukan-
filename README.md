# Solar Energy Laboratory 3D

Laboratorium virtual PLTS: React + Vite + React Three Fiber + drei + GSAP + Lucide.

## Menjalankan
```bash
npm install
npm run dev      # buka alamat yang tampil (mis. http://localhost:5173)
npm run build    # build produksi
```
Perlu Node.js 18 atau lebih baru dan koneksi internet saat `npm install`.

## Struktur
- `src/state` store UI (`store.js`) dan data simulasi per frame (`live.js`).
- `src/simulations` model energi (`energyModel.js`), loop simulasi, pemeriksa misi.
- `src/animations` kamera, exploded view, simulasi terpandu (GSAP).
- `src/controls/actions.js` semua aksi tombol.
- `src/scenes` objek 3D (satu file per objek), kabel, aliran partikel, cuaca, lingkungan.
- `src/components` antarmuka: sidebar, toolbar, dashboard, panel info, kuis, misi, tur, materi, pengaturan.
- `src/data` isi materi, kuis, misi, tur, informasi komponen.

## Menambah fitur
Objek baru: buat file di `src/scenes`, bungkus bagian dengan `<Part comp="kunci">`, tambahkan teks di `data/components.js` dan fokus kamera di `animations/camera.js`.

## Status
Dikerjakan: antarmuka, lingkungan 3D, model PLTS, aliran energi, dashboard baterai, Exploded View, X-Ray, cuaca, konsumsi daya 5 alat, tur (dengan suara), misi, kuis, materi, kualitas grafis, fullscreen, progres localStorage.
Belum dikerjakan: Smart City Solar (Bagian 17), tutorial interaktif bertahap, animasi komponen bergerak saat dipilih selain cincin sorot, model GLB.
**Belum diuji dijalankan**: kode ditulis tanpa akses internet untuk `npm install`, jadi belum pernah di-build atau dibuka di browser. Harap lakukan pengujian dan laporkan error yang muncul.
