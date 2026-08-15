# Lyra Report

- Waktu audit: 2026-08-15T11:37:00+07:00
- Base HEAD: 281fe14ce1fc84c4c7ac66e08e3543ad4869604e
- Diff fingerprint: 07ce2b55da7271bb7992c9b16b54cbbc3569a3259f8c01a16f352b3a8f01ac48
- Scope: README.md, public/sitemap.xml, sitemap.xml, src/config/site.ts, src/pages/berita.astro (deleted), src/pages/dusun.astro, src/pages/index.astro, src/pages/profil-desa.astro, src/types/site.ts, tests/site-parity.spec.ts
- Status: PASS_WITH_NOTES

## Ringkasan

Tidak ada temuan visual/design-system yang material pada kandidat. Struktur profil memakai hierarki section, card, radius, spacing, warna, dan shadow yang konsisten dengan token yang sudah ada. Bagan pemerintahan membedakan level utama, unsur pelaksana, wilayah administratif, sebutan warga, dan riwayat secara jelas pada markup serta styling. UI Berita yang dihapus tidak tersisa pada scope yang diperiksa.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Memeriksa diff pada halaman beranda, dusun, dan profil desa untuk perubahan hierarki section, heading, card, spacing, radius, warna, dan shadow.
- Memeriksa `src/pages/profil-desa.astro:52-78` untuk pemisahan visual administratif pemerintah, sebutan dusun warga, dan riwayat Krajan 1–3.
- Memeriksa `src/pages/profil-desa.astro:112-164` untuk hierarki bagan, pembedaan level, connector, dua wilayah administratif, serta catatan sebutan/riwayat.
- Memeriksa `src/pages/profil-desa.astro:168-341` untuk connector dan wrapping pada layout mobile serta layout tiga cabang pada breakpoint `min-width: 768px`.
- Memeriksa penggunaan token eksisting `rounded-card`, `rounded-panel`, `shadow-card`, `shadow-raised`, `--green-*`, dan `--line` terhadap komponen visual yang sudah ada.
- Memeriksa penghapusan Berita pada `src/config/site.ts`, `src/types/site.ts`, `src/pages/index.astro`, sitemap, serta deleted page `src/pages/berita.astro`; tidak ditemukan orphaned Berita UI pada scope.
- Menjalankan `git diff --check`; tidak ditemukan whitespace error.
- Menghitung ulang `.agents/get-change-fingerprint.ps1`; hasil Base HEAD dan fingerprint cocok dengan konteks audit.

## Batasan

- Runtime/screenshot lokal tidak dapat diverifikasi karena `npm run build` berhenti pada `spawn EPERM` dari esbuild sebelum menghasilkan build yang dapat dipreview. Tidak ada external preview yang digunakan.
- Audit visual dilakukan melalui inspeksi diff, markup, dan CSS lokal; perubahan di luar scope tidak dinilai.
