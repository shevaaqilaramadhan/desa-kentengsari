# Lyra Report

- Waktu audit: 2026-08-19T20:12:17+07:00
- Base HEAD: `b53434880e812c26d9065969d8cd0beb09fc3c82`
- Diff fingerprint: `f3757d27a910d0caa5c0d21d0c2f7bf7dd6e0aa40e492f4d72268951c4cc7a44`
- Scope: seluruh kandidat non-report pada fingerprint; fokus visual `src/pages/profil-desa.astro` dan regresi shell dari `src/layouts/SiteLayout.astro`, `src/styles/global.css`, `src/pages/kontak.astro`.
- Status: `PASS`

## Ringkasan

Perbaikan konektor membuat garis horizontal berhenti tepat di pusat kartu cabang, sehingga tidak lagi terlihat menggantung atau terputus di sisi kiri/kanan. Hierarki, warna garis, border kartu, dan treatment mobile tetap konsisten. Tidak ada temuan visual yang perlu ditindaklanjuti.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Fingerprint resmi dijalankan sebelum audit; Base HEAD dan fingerprint cocok dengan laporan Orion.
- Diff CSS pada `src/pages/profil-desa.astro:602-635` diperiksa langsung. Rumus endpoint mempertimbangkan dua gap grid sehingga selaras dengan pusat tiga kolom, dan `z-index` menjaga sambungan garis tetap terlihat.
- Assertion rendered geometry pada `tests/site-parity.spec.ts:241-292` lulus pada desktop 768 dan 1440 px dengan toleransi sambungan maksimal 1 px.
- Layout mobile pada lebar 390 px lulus dengan cabang satu kolom, gap konsisten, dan konektor horizontal tersembunyi agar tidak membentuk garis silang.
- Build Astro menghasilkan 7 route; suite Playwright lulus 18/18, termasuk pemeriksaan overflow dan shared shell lintas viewport.
- Tidak ada gambar statis baru, perubahan font, warna global, atau perubahan header/footer yang diperkenalkan oleh turn ini.

## Batasan

- Browser interaktif aplikasi tidak tersedia; audit visual didasarkan pada review CSS dan rendered geometry Chromium melalui suite Playwright lokal.
- Variasi rendering browser selain Chromium tidak diperiksa.
