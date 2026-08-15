# Lyra Report

- Waktu audit: 2026-08-15T18:57:03+07:00
- Base HEAD: 928aa5ba0bd798b17a90909bdf538b4e1a6da111
- Diff fingerprint: a2c63bcf67189b21356b745c30318e7feaca6dcd86165e676e82b2c7be80b15d
- Scope: `src/pages/profil-desa.astro`, `tests/site-parity.spec.ts`, `tests/umkm.spec.ts`
- Status: PASS

## Ringkasan

Kandidat final konsisten secara visual pada desktop, tablet, dan mobile. Hero editorial, sejarah, statistik, wilayah, gallery landmark, visi-misi, struktur beserta connector, rail/nav, dan endcap terbaca serta mempertahankan hierarchy dan bahasa visual hijau-editorial yang sama. Tidak terlihat overflow horizontal atau kerusakan layout pada screenshot kandidat.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Screenshot visual: `.agents/reports/orion/profil-desktop.png`, `.agents/reports/orion/profil-tablet.png`, `.agents/reports/orion/profil-mobile.png`; diperiksa untuk proporsi, wrapping, alignment, contrast, rail/nav, gallery, connector, dan endcap.
- Markup presentasional: `src/pages/profil-desa.astro:28-142` mencakup seluruh section yang diminta; gallery memakai tiga figure ber-caption di `:97-103`, struktur dan connector di `:123-138`.
- Responsive rules: `src/pages/profil-desa.astro:409-457` dan `:622-657` mengubah rail menjadi scrollable, grid menjadi single-column, connector menjadi vertikal, serta gallery menjadi susunan mobile yang terbaca.
- Reduced motion: `src/styles/global.css:293-356` dan override `src/pages/profil-desa.astro:659-671` mencakup hover transform CTA, sejarah, statistik, gallery, struktur, dan endcap; reveal juga dinonaktifkan di `src/pages/profil-desa.astro:182-189`.
- No-JS/readability: markup default di `src/pages/profil-desa.astro:164-169` tetap terlihat sebelum `.profile-js` aktif; no-JS assertion yang relevan tersedia di `tests/site-parity.spec.ts:192-203`.
- UTF-8: source berhasil didekode sebagai UTF-8 strict dan tidak memuat pola mojibake.
- Fingerprint resmi dijalankan sebelum laporan dan cocok dengan kandidat yang diberikan.

## Batasan

- `npm run build` dan Playwright tidak dapat dijalankan di lingkungan audit karena proses child-process gagal dengan `spawn EPERM`; tidak ada assertion failure yang teramati. Pemeriksaan visual dan source tetap selesai berdasarkan kandidat screenshot serta source/test scope.
