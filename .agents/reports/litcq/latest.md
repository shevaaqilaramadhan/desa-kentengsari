# Litcq Report

- Waktu audit: 2026-08-15T23:50:00+07:00
- Base HEAD: 58a0293588c54cb380ef67dc03446734208c9b96
- Diff fingerprint: f135316ef22f310f2998c5cbba861b7f43225003242395b27671355f376f432d
- Scope: `src/layouts/SiteLayout.astro`, `src/pages/profil-desa.astro`, `src/styles/global.css`, `tests/site-parity.spec.ts`, serta regresi seluruh route publik
- Status: PASS

## Ringkasan

Audit fungsi dan regresi teknis kandidat profile-desa selesai tanpa temuan yang dapat ditindaklanjuti. Build, pemeriksaan Astro, suite Playwright, parity, referensi lokal, aksesibilitas dasar, no-JS, keyboard, reduced-motion, data profile, canonical, dan overflow lulus.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1`; Base HEAD dan fingerprint cocok persis dengan kandidat yang diberikan.
- `npm run check`: lulus, 0 error, 0 warning, 0 hint.
- `npm test`: build Astro lulus, 15/15 test Playwright lulus.
- `git diff --check`: lulus.
- Memeriksa route `/index.html`, `/destinasi.html`, `/dusun.html`, `/galeri.html`, `/kontak.html`, `/profil-desa.html`, dan `/umkm.html`: semuanya HTTP 200, title/canonical tersedia, tanpa error console/page, tanpa teks atau tautan `Berita`.
- Memeriksa seluruh referensi lokal `a`, `img`, dan `link`: tidak ada aset/route lokal yang rusak.
- Memeriksa seluruh route pada viewport 390, 768, dan 1440 px: `scrollWidth` sama dengan `clientWidth`; tidak ada horizontal overflow.
- Memverifikasi profile tanpa JavaScript: heading utama, data penduduk, dan navigasi tetap tersedia.
- Memverifikasi data exact: `1.201`, `626`, `575`, `390`; `2 wilayah administratif`; `3 sebutan warga`; dan `Drainase & Irigasi` tepat satu kali.
- Memverifikasi ARIA references tidak menunjuk ID yang hilang, menu dapat dibuka dengan keyboard dan ditutup Escape dengan focus return, serta gambar profile memiliki alt dan berhasil dimuat.
- Memverifikasi `prefers-reduced-motion`: aturan global dan profile mematikan animation/transition serta scroll behavior.
- Memverifikasi tidak ada mojibake pada file scope menggunakan pembacaan UTF-8 dan pencarian marker encoding rusak.
- Memeriksa footer/header lintas route; styling footer terang dan ukuran header tambahan hanya aktif pada `.profile-route`, sehingga tidak merusak route lain.

## Batasan

- Audit browser dilakukan terhadap output static hasil `astro build` melalui server HTTP lokal; `npm test` yang menjalankan build dan Playwright tetap lulus penuh.
- Tidak melakukan audit visual subjektif karena berada di luar scope Litcq.
