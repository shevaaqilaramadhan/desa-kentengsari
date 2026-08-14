# Litcq Report

- Waktu audit: 2026-08-12T02:42:30+07:00
- Base HEAD: `8acb9e99bf592053ee8b3bc103bb78587617eec1`
- Diff fingerprint: `d143bba89aabbea4e8232d92b68581663f8ea3f20459742865d57d889de32e3b`
- Scope: Kandidat final debugging parity UI/UX dan physical 3D UMKM: `README.md`, `src/components/astro/CallToAction.astro`, `src/components/astro/PageHero.astro`, `src/components/react/UmkmExplorer.tsx`, `src/layouts/SiteLayout.astro`, `src/pages/index.astro`, `src/pages/umkm.astro`, `src/styles/global.css`, `tests/site-parity.spec.ts`, `tests/umkm.spec.ts`, serta penghapusan delapan HTML legacy, `css/style.css`, dan `js/main.js`.
- Status: PASS

## Ringkasan

Kandidat final lulus audit fungsi/regresi independen. Instalasi bersih, pemeriksaan Astro, build produksi, seluruh regression suite, dan stress-test serial flip 3D semuanya berhasil. Perbaikan gate kedua tervalidasi: hamburger benar-benar morph menjadi X dan kembali lagi pada 320/768; recorder flip dimulai relatif terhadap `pointerenter`, menghasilkan settled frame eksplisit, mempertahankan assertion fisik/durasi yang ketat, serta lulus 10 pengulangan serial tanpa flake. Tidak ditemukan bug yang dapat ditindaklanjuti pada fingerprint ini.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum dan sesudah audit. Base HEAD dan fingerprint identik dengan laporan Orion: `8acb9e99...` / `d143bba8...`.
- `npm ci`: 346 paket terpasang dari lockfile; audit dependency melaporkan 0 vulnerability.
- `npm run check`: 26 file, 0 error, 0 warning, 0 hint.
- `npm test`: build Astro sukses dan tepat delapan route statis dibuat; seluruh 13/13 Playwright Chromium test lulus.
- Stress test serial: `npx playwright test tests/umkm.spec.ts --project=chromium --grep "flip and unflip" --repeat-each=10 --workers=1` lulus 10/10 dalam 50,6 detik; setiap pengulangan 4,4-4,5 detik.
- Memeriksa implementasi recorder di `tests/umkm.spec.ts:137-180`: instrumentation dipasang sebelum interaksi, origin waktu dibuat dalam handler `pointerenter`, setiap frame memakai elapsed relatif, dan sampling berlanjut sampai 1180ms.
- Memeriksa settled-frame guard di `tests/umkm.spec.ts:234-241`: frame akhir wajib ada dan kegagalan melempar error eksplisit; durasi flip tetap dibatasi 900-1120ms tanpa sentinel/fallback yang dapat memberi false pass.
- Memeriksa assertion physical 3D di `tests/umkm.spec.ts:210-241`: transform progresif `matrix3d`, midpoint rotation/depth/scale/lighting, `perspective: 1100px`, `preserve-3d`, backface tersembunyi, serta durasi flip satu detik semuanya tetap diwajibkan.
- Memeriksa implementasi runtime di `src/components/react/UmkmExplorer.tsx:119-260`: perspective per shell, transform 3D pada surface, front/back terpisah dengan backface hidden, translateZ, shadow dan lighting dinamis, serta active-face `aria-hidden` sinkron.
- Menu mobile di `tests/site-parity.spec.ts:184-315` lulus pada 320x800 dan 768x800 untuk mouse dan touch: hamburger/X computed transform, accessible name, `aria-expanded`, overlay/backdrop, stacking toggle, body scroll lock/release, Escape, link close, focus return, resize 768->861->768, dan tidak ada horizontal overflow.
- UMKM tetap memuat 24 usaha dengan distribusi filter 7/12/4/1; multi-select, All mixed state, canonical order, zero-state, exit 180ms, keyboard/click/touch/outside/focusout, active-face AX, no-JS SSR, reduced motion, serta grid 1/2/3 tanpa overflow lulus.
- Delapan route yang dibangun: `berita.html`, `destinasi.html`, `dusun.html`, `galeri.html`, `index.html`, `kontak.html`, `profil-desa.html`, `umkm.html`.
- Memeriksa metadata, navigation, local reference, sitemap/social card, gallery dialog, contact fallback, dan published surface melalui regression suite; seluruhnya lulus.
- Pemeriksaan filesystem setelah build: 0 entrypoint legacy tersisa di root, 0 hit nama sumber privat di `dist`, dan 47 file artefak distribusi.
- `git diff --check -- . ':(exclude).agents/reports/**'` lulus; hanya ada peringatan normalisasi LF/CRLF, tanpa whitespace error.
- Tidak ada listener tersisa pada port audit 4321 setelah pengujian.

## Batasan

- Audit browser otomatis memakai Chromium headless. Safari/iOS, Firefox, dan perangkat fisik tidak diuji langsung.
- Google Fonts dan Google Maps bergantung pada jaringan saat runtime; dependency eksternal tersebut tidak diuji melalui jaringan pada audit lokal.
- Percobaan awal `npm ci` dan `npm test` di sandbox terkena `spawn EPERM`; keduanya dijalankan ulang dengan izin proses yang diperlukan dan kemudian lulus. Ini merupakan batasan sandbox audit, bukan kegagalan kandidat.
- Penilaian estetika murni dan keseragaman visual merupakan scope Lyra, bukan Litcq.
