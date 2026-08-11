# Lyra Report

- Waktu audit: 2026-08-12T01:15:59.0224189+07:00
- Base HEAD: `7a72f2d657c091666ad218b1f91fe2ee2db3c3ed`
- Diff fingerprint: `f95b1d87c29fe3840af48c9db11041864ab9a50d76f5c854cf3345c39b7c06c9`
- Scope: Kandidat migrasi final 76 file terhadap `main`; delapan route Astro, shared layout/components/design tokens, halaman dan island UMKM React/Motion, responsive 320/768/1280, serta social preview `public/og.png`.
- Status: PASS

## Ringkasan

Kandidat final mempertahankan satu bahasa visual Kentengsari yang konsisten pada seluruh delapan halaman: palet hijau, tipografi Plus Jakarta Sans dengan system fallback, skala radius/bayangan, ritme section, container, hierarchy heading, tombol, kartu, form, header, hero, dan footer memakai token serta komponen bersama. Halaman UMKM mengikuti sistem yang sama dan animasi flip memiliki bukti transformasi 3D fisik pada midpoint, flip/unflip satu detik, transisi filter 180 ms, serta versi reduced-motion. Tidak ditemukan inkonsistensi visual yang perlu ditindaklanjuti.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menghitung ulang fingerprint resmi sebelum dan sesudah validasi. Base HEAD dan fingerprint identik dengan laporan Orion.
- Menelaah token warna, tipografi, radius, shadow, focus ring, dan reduced-motion di `src/styles/global.css:3`, `src/styles/global.css:43`, dan `src/styles/global.css:81`.
- Memeriksa konsistensi header, navigasi aktif, container, footer, serta breakpoint mobile/desktop pada `src/layouts/SiteLayout.astro:60` dan `src/layouts/SiteLayout.astro:113`.
- Memeriksa template presentasional bersama: `src/components/astro/PageHero.astro:11`, `src/components/astro/SectionHeading.astro:14`, `src/components/astro/InfoCard.astro:10`, `src/components/astro/DestinationCard.astro:13`, `src/components/astro/StatGrid.astro:15`, dan `src/components/astro/CallToAction.astro:11`.
- Membandingkan hierarchy, spacing, grid, kartu, imagery, CTA, galeri/dialog, peta, dan form pada `/index.html`, `/profil-desa.html`, `/berita.html`, `/galeri.html`, `/dusun.html`, `/destinasi.html`, `/umkm.html`, dan `/kontak.html` melalui source Astro dan hasil build produksi.
- Memeriksa sistem visual UMKM: perspective 1400 px (`src/components/react/UmkmExplorer.tsx:124`), `preserve-3d` (`src/components/react/UmkmExplorer.tsx:144`), front/back face, depth, midpoint lighting (`src/components/react/UmkmExplorer.tsx:243`), shadow/scale, active filter state, count badge, empty state, dan grid 1/2/3 kolom (`src/components/react/UmkmExplorer.tsx:423`).
- Memastikan paragraf instruksi panjang dan tiga summary box yang diminta dihapus tidak hadir; assertion regresinya terdapat di `tests/umkm.spec.ts:118`. Filter hanya menampilkan state aktif melalui styling tombol/`aria-pressed`, tanpa checklist atau label status aktivitas.
- Menjalankan build produksi dan seluruh suite Chromium Playwright: 8 halaman berhasil dibangun dan 11/11 test lulus. Suite membuktikan tidak ada horizontal overflow di semua route pada 320/768/1280 (`tests/site-parity.spec.ts:184`), grid UMKM 1/2/3 kolom (`tests/umkm.spec.ts:247`), exit filter sekitar 180 ms (`tests/umkm.spec.ts:58`), physical midpoint serta flip/unflip 0,9–1,15 detik (`tests/umkm.spec.ts:124`), dan reduced-motion instan (`tests/umkm.spec.ts:230`).
- Memeriksa `public/og.png` pada resolusi asli: logo, judul, lokasi, kontras overlay, dan komposisi gunung/desa terbaca jelas dan selaras dengan identitas hijau website.
- Menjalankan `git diff --check`; tidak ada whitespace error.

## Batasan

- Browser interaktif bawaan tidak tersedia pada sesi audit (`agent.browsers.list()` mengembalikan daftar kosong), sehingga tidak ada inspeksi screenshot manual seluruh halaman atau pengujian visual Firefox/WebKit. Audit visual runtime memakai suite Chromium Playwright yang ada, pengukuran computed layout/transform di suite tersebut, inspeksi source/build, dan inspeksi visual langsung untuk social preview.
- Google Fonts dan Google Maps memerlukan jaringan runtime. Layout menyediakan font fallback dan pengujian overflow tidak bergantung pada koneksi eksternal, tetapi variasi rendering font antarplatform tetap mungkin kecil.
