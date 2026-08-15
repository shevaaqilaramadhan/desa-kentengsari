# Litcq Report

- Waktu audit: 2026-08-15T12:14:06+07:00
- Base HEAD: 7a103af6b56c4b0b5c6ab1ae365929418b6027d0
- Diff fingerprint: 8b0c6d3d568067128758b3ab0d8a10c88f147893f59e9c926ac0da148280fb34
- Scope: `public/sitemap.xml`, `README.md`, `sitemap.xml`, `src/config/site.ts`, `src/pages/berita.astro` (deleted), `src/pages/dusun.astro`, `src/pages/index.astro`, `src/pages/profil-desa.astro`, `src/styles/global.css`, `src/types/site.ts`, `tests/site-parity.spec.ts`
- Status: PASS_WITH_NOTES

## Ringkasan

Kandidat lulus pemeriksaan fungsi dan regresi teknis. `npm run check` menghasilkan 0 error, 0 warning, dan 0 hint; `npm test` berhasil membangun 7 halaman dan menjalankan 15 test dengan hasil 15 passed. Tidak ditemukan temuan dalam scope audit.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1`; Base HEAD dan fingerprint identik dengan kandidat yang diberikan.
- Menjalankan `npm run check`: 0 error, 0 warning, 0 hint pada 25 file Astro.
- Menjalankan `npm test`: build Astro sukses dengan 7 page(s) built (`index`, `profil-desa`, `galeri`, `dusun`, `destinasi`, `umkm`, `kontak`) dan seluruh 15 test Playwright lulus.
- Memverifikasi 7 route, metadata, navigasi 7 item tanpa `Berita`, marker konten, aset lokal, sitemap, robots, social card, dan route `/berita.html` tidak tersedia melalui `tests/site-parity.spec.ts:65-151`.
- Memverifikasi data profil 2025, dua wilayah administratif, tiga sebutan dusun, fasilitas, dan struktur pemerintahan melalui `tests/site-parity.spec.ts:158-188`; struktur/fasilitas terlihat pada `src/pages/profil-desa.astro:59-124`.
- Memverifikasi konten editorial tetap tersedia tanpa JavaScript melalui `tests/site-parity.spec.ts:190-201`. Fallback observer juga aman: `src/pages/profil-desa.astro:131-139` hanya mengaktifkan reveal jika `IntersectionObserver` tersedia, sementara CSS default tetap terlihat pada `src/pages/profil-desa.astro:150-164`.
- Memverifikasi hero, rail, connector, dan header/nav runtime melalui test hierarki visual dan navigasi; implementasi berada pada `src/pages/index.astro:23`, `src/components/astro/PageHero.astro:11`, `src/pages/profil-desa.astro:38,112`, dan `src/layouts/SiteLayout.astro:163-194`.
- Memverifikasi duplicate IDs, referensi ARIA, serta referensi lokal pada seluruh route melalui `tests/site-parity.spec.ts:93-116`; inspeksi artefak `dist/profil-desa.html` juga menghasilkan `DUP_IDS=` dan `MISSING_ARIA=` kosong.
- Memverifikasi no-overflow pada lebar 320, 768, dan 1280 px serta perilaku menu mobile (keyboard Escape, backdrop, touch, scroll lock, breakpoint 861 px) melalui `tests/site-parity.spec.ts:242-373`.
- Memverifikasi hero/rail/connector dan fallback unsupported observer secara source-level; browser in-app tidak tersedia pada sesi audit ini, sehingga tidak ada inspeksi visual interaktif tambahan di browser tersebut.

## Batasan

- Browser in-app tidak tersedia (`agent.browsers.list()` mengembalikan daftar kosong). Validasi runtime tetap dilakukan melalui Playwright Chromium lokal yang dijalankan oleh `npm test` dan seluruhnya lulus.
- Tidak ada perubahan pada source, asset, test, docs, atau laporan agent lain; hanya laporan ini yang ditulis.
