# Lyra Report

- Waktu audit: 2026-08-15T12:14:00+07:00
- Base HEAD: 7a103af6b56c4b0b5c6ab1ae365929418b6027d0
- Diff fingerprint: 8b0c6d3d568067128758b3ab0d8a10c88f147893f59e9c926ac0da148280fb34
- Scope: `public/sitemap.xml`, `README.md`, `sitemap.xml`, `src/config/site.ts`, `src/pages/berita.astro` (deleted), `src/pages/dusun.astro`, `src/pages/index.astro`, `src/pages/profil-desa.astro`, `src/styles/global.css`, `src/types/site.ts`, `tests/site-parity.spec.ts`.
- Status: PASS

## Ringkasan

Kandidat memenuhi acceptance visual/design system dan menutup catatan kontras sebelumnya. Hero profil bersifat content-driven, hierarchy connector terbaca pada desktop/mobile, rail memiliki enam target dengan kicker `01`–`06` yang sinkron, reveal tetap terlihat tanpa JavaScript, dan rail/kicker pada latar terang menggunakan `var(--green-900)`. Layout responsif konsisten dengan token bersama, tanpa overflow pada lebar target, dan tidak ada UI Berita pada surface publik.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1`; Base HEAD dan fingerprint cocok persis dengan kandidat.
- Memeriksa hero profil pada `src/pages/profil-desa.astro:22-35` dan `src/pages/profil-desa.astro:147-173`; ukuran hero tidak lagi fixed-height, baseline reveal terlihat, dan class `profile-js` hanya mengaktifkan penyembunyian sementara ketika `IntersectionObserver` tersedia.
- Memeriksa rail pada `src/pages/profil-desa.astro:38` serta section/kicker pada `src/pages/profil-desa.astro:44-126`; enam anchor `#sejarah`, `#statistik`, `#wilayah`, `#landmark`, `#visi-misi`, `#struktur` selaras dengan nomor `01`–`06`.
- Memeriksa hierarchy pada `src/pages/profil-desa.astro:110-118` dan `src/pages/profil-desa.astro:284-440`; desktop memakai trunk, branch, dan stem ke tiga kartu, sedangkan mobile memakai connector vertikal dan connector horizontal ke setiap kartu.
- Memeriksa token dan kontras pada `src/styles/global.css:26`, `src/styles/global.css:286-308`; `.profile-kicker--dark` dan `.profile-rail a` memakai `var(--green-900)`, menutup catatan kontras sebelumnya.
- Memeriksa breakpoint dan overflow pada `src/styles/global.css:205-259`, `src/styles/global.css:358-359`, dan style lokal `src/pages/profil-desa.astro:393-440`; rail dapat di-scroll horizontal pada mobile, hierarchy turun menjadi satu kolom, dan konten tidak dipaksa keluar viewport.
- Memeriksa `NAV_ITEMS`, sitemap, dan penghapusan `src/pages/berita.astro`; tidak ada label, URL, atau UI Berita pada surface publik.
- Menjalankan `npm run check`: 0 error, 0 warning, 0 hint.
- Menjalankan `npm test`: build 7 halaman dan 15/15 test Playwright lulus, termasuk no-JS visibility, hero/rail/connector, overflow target widths, visual hierarchy, dan no-Berita.

## Batasan

- Audit ini berfokus pada visual/design system; tidak menilai isi bisnis atau implementasi fungsi yang tidak berdampak pada layout, kontras, hierarchy, dan consistency visual.
- Tidak ada screenshot pixel-level terpisah; verifikasi runtime dilakukan melalui Playwright pada breakpoint dan acceptance visual yang tersedia.
- Tidak mengubah source, asset, test, docs, atau laporan agent lain; hanya laporan Lyra ini yang ditulis.
