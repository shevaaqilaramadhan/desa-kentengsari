# Litcq Report

- Waktu audit: 2026-08-15T11:37:30+07:00
- Base HEAD: 281fe14ce1fc84c4c7ac66e08e3543ad4869604e
- Diff fingerprint: 07ce2b55da7271bb7992c9b16b54cbbc3569a3259f8c01a16f352b3a8f01ac48
- Scope: `README.md`, `public/sitemap.xml`, `sitemap.xml`, `src/config/site.ts`, `src/pages/berita.astro` (deleted), `src/pages/dusun.astro`, `src/pages/index.astro`, `src/pages/profil-desa.astro`, `src/types/site.ts`, `tests/site-parity.spec.ts`
- Status: PASS

## Ringkasan

Audit fungsi/regresi teknis kandidat selesai. Tujuh route berhasil dibuild dan diuji; route `/berita.html` tidak dibuild, tidak ditautkan, tidak tercantum di sitemap, dan request-nya gagal sebagaimana diharapkan. Data 2025, pemisahan nama administratif/sebutan warga/riwayat, metadata, referensi lokal, aksesibilitas dasar, navigasi mobile, serta overflow lulus pemeriksaan.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1`: Base HEAD dan fingerprint cocok persis dengan konteks kandidat.
- Meninjau diff seluruh scope; penghapusan `src/pages/berita.astro`, item nav, tipe route, dan dua sitemap konsisten.
- `npm run check`: lulus, 0 error, 0 warning, 0 hint.
- `npm test`: build Astro lulus dengan tujuh output (`index.html`, `profil-desa.html`, `galeri.html`, `dusun.html`, `destinasi.html`, `umkm.html`, `kontak.html`) dan Playwright lulus 14/14 tes.
- Memverifikasi tujuh route, title/description/canonical/OG/Twitter metadata, satu `main`, satu heading level 1, tujuh link navigasi, active `aria-current`, footer, serta ketiadaan teks/referensi `/berita.html` melalui `tests/site-parity.spec.ts:65-123`.
- Memverifikasi sitemap berisi tujuh URL, tanpa `/berita.html`, serta `GET /berita.html` non-OK melalui `tests/site-parity.spec.ts:125-155`.
- Memverifikasi data `1.201`, `626`, `575`, `390`, wilayah administratif, sebutan warga, riwayat, dan struktur organisasi melalui `tests/site-parity.spec.ts:158-188`; sumber data berada di `src/pages/index.astro:9-12` dan `src/pages/profil-desa.astro:9-12`.
- Verifikasi aksesibilitas/regresi: tidak ada duplicate ID atau referensi ARIA invalid; seluruh referensi lokal asset/link merespons OK. `git diff --check` juga lulus.
- Verifikasi responsif pada lebar 320, 768, dan 1280 tanpa horizontal overflow serta navigasi mobile melalui `tests/site-parity.spec.ts:229`; seluruh tes terkait lulus.

## Batasan

- Percobaan `npm test` pertama di sandbox terhenti oleh `spawn EPERM` pada child process esbuild; pengulangan dengan izin eksekusi yang diperlukan lulus penuh dan tidak menunjukkan regresi kandidat.
- Audit ini berfokus pada fungsi/regresi teknis; penilaian visual mendalam berada pada scope auditor Lyra.
