# Lyra Report

- Waktu audit: 2026-08-16T01:20:14+07:00
- Base HEAD: `b53434880e812c26d9065969d8cd0beb09fc3c82`
- Diff fingerprint: `e9a0e315b62a334074ff51d2eedc77176a7c11115750cd5e441ffe67ea9a50cc`
- Scope: `package.json`, `package-lock.json`, `src/layouts/SiteLayout.astro`, `src/pages/kontak.astro`, `src/styles/global.css`, `tests/site-parity.spec.ts`
- Status: `PASS`

## Ringkasan

Audit visual round 2 lulus. Shell bersama tetap konsisten pada seluruh tujuh route, dan blank map note round 1 sudah terselesaikan. Halaman Kontak kini memiliki loading placeholder yang intentional, transisi ke map ready tanpa layout shift, iframe no-JS yang tidak tertutup, dan reduced-motion yang tenang. Tidak ditemukan overlay blocking, clipping, overlap, overflow, mojibake, atau regresi visual.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Fingerprint resmi dijalankan sebelum audit dan setelah seluruh artefak sementara dihapus; Base HEAD serta fingerprint identik dengan kontrak round 2.
- Build Astro lulus dan menghasilkan tujuh route statis.
- Playwright khusus shell dan map lulus `2/2`: shared header/footer seluruh route serta state map loading/ready/no-JS.
- Screenshot full-page dan scroll nyata sampai footer pada `/index.html`, `/profil-desa.html`, `/destinasi.html`, `/dusun.html`, `/galeri.html`, `/umkm.html`, dan `/kontak.html` di `1440x1000` serta `390x844`.
- Shell desktop seluruh route identik: header inner `1140x76px`, footer sekitar `1440x322.09px`, grid footer empat kolom `253px`, dan tidak ada horizontal overflow.
- Shell mobile seluruh route identik: header inner `358x72px`, footer sekitar `390x689.64px`, grid footer dua kolom `171px`, serta brand/address span dan legal row membungkus secara rapi.
- Tidak ada console error maupun page error pada seluruh route yang diperiksa.
- Kontak diuji terpisah pada `1440x1000`, `768x900`, dan `390x844` dengan request map ditahan untuk menangkap initial loading secara deterministik.
- Loading state di `src/pages/kontak.astro:20`–`31` terlihat intentional: panel hijau muda, ikon pin, label jelas, hierarchy terpusat, `role="status"`, `aria-live="polite"`, dan iframe transparan selama loading.
- Transisi ready di `src/pages/kontak.astro:67`–`72` dan `171`–`175` menghasilkan geometri identik sebelum/sesudah: delta lebar `0px`, delta tinggi `0px` pada desktop/tablet/mobile. Placeholder menjadi `visibility:hidden`, `opacity:0`, `pointer-events:none`, sementara iframe menjadi `opacity:1`.
- Google Maps asli diverifikasi terpisah: map tergambar normal dan interaktif; fade placeholder 240 ms tidak memblokir map.
- Fallback no-JS di `src/pages/kontak.astro:32`–`37` lulus pada ketiga viewport: placeholder `display:none`, iframe terlihat dengan opacity penuh, dan ukuran panel tetap sama.
- Reduced-motion di `src/pages/kontak.astro:184`–`192` lulus: shimmer tidak berjalan (`animation-name:none`) dan durasi transisi efektif `0.01ms` dari aturan global.
- Form, card informasi, map shell, section rhythm, transisi content-to-footer, header fixed, serta footer Kontak tetap teratur pada desktop/tablet/mobile.
- Screenshot dan artefak sementara audit telah dihapus. Tidak ada source, test, dependency, laporan agent lain, commit, atau push yang diubah.

## Batasan

- Google Maps merupakan layanan eksternal; waktu pemuatan aktual tetap bergantung jaringan, tetapi loading placeholder sekarang menutup masa tunggu tersebut secara visual.
- Audit visual dijalankan pada Chromium headless; variasi rendering browser lain tidak diperiksa.
