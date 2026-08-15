# Litcq Report

- Waktu audit: 2026-08-15T10:44:30+07:00
- Base HEAD: 4091a794b138960cd758eb9f869dfcc659109bdb
- Diff fingerprint: 693052c67d632065c3cdc95d529eaa1ad0dc16ee68d4d957223cbc92581de804
- Scope: `astro.config.mjs`, `public/robots.txt`, `public/sitemap.xml`, `sitemap.xml`, `src/config/site.ts`, `src/pages/kontak.astro`, `src/styles/global.css`, `tests/site-parity.spec.ts`
- Status: PASS

## Ringkasan

Audit fungsi teknis/regresi kandidat selesai. Perubahan logo pada `src/styles/global.css:127-131` tidak mengubah markup, ukuran render, aset, navigasi, atau kontrol aksesibilitas. Perubahan kandidat lain juga lulus pemeriksaan statis dan pengujian browser.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1`: Base HEAD dan fingerprint cocok persis dengan konteks kandidat.
- Meninjau diff terhadap Base HEAD, termasuk referensi domain, sitemap/robots, halaman kontak, menu mobile, dan logo header/footer.
- `npm run check`: lulus, 0 error, 0 warning, 0 hint.
- `npm test`: build Astro berhasil; 12/13 tes lulus pada percobaan pertama. Satu tes midpoint animasi UMKM gagal sekali pada `tests/umkm.spec.ts:251`, lalu tes yang sama lulus 2/2 saat diulang; tidak terkait file scope kandidat.
- Pemeriksaan browser mencakup 8 rute, metadata, navigasi, referensi lokal, fallback formulir, dialog galeri, menu mobile, overflow, dan interaksi UMKM.

## Batasan

- Kegagalan satu kali pada assertion timing animasi UMKM tidak terulang pada rerun terisolasi dan berada di luar file scope kandidat.
- Audit tidak mencakup penilaian visual/design system di luar dampak fungsional.
