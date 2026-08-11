# Litcq Report

- Waktu audit: 2026-08-12T01:18:23.9580505+07:00
- Base HEAD: `7a72f2d657c091666ad218b1f91fe2ee2db3c3ed`
- Diff fingerprint: `f95b1d87c29fe3840af48c9db11041864ab9a50d76f5c854cf3345c39b7c06c9`
- Scope: Kandidat migrasi final 76 file terhadap `main`: fondasi Astro 7/React 19/Tailwind 4/Motion 13, delapan route publik, shared layout, data dan island UMKM, seluruh aset publik, metadata/sitemap, Vercel static output, workflow, lockfile, dan suite Playwright.
- Status: PASS_WITH_NOTES

## Ringkasan

Tidak ditemukan bug blocker/high maupun regresi fungsi website pada fingerprint final. Clean install, Astro/TypeScript check, static build, dan suite Chromium mode CI lulus; build menghasilkan tepat delapan halaman dan 47 file deployment. Sebelas pengujian browser membuktikan parity route, referensi lokal, metadata/social sharing, nav, galeri, kontak, no-JS, 24 data UMKM, filter, flip 3D, seluruh input, aksesibilitas state, reduced-motion, dan responsive grid. Satu catatan low hanya menyangkut isolasi server pengujian lokal saat auditor berjalan paralel; workflow CI tidak terkena karena menggunakan server non-reuse dan satu worker.

## Temuan

### [low] Runner Playwright lokal dapat memakai server audit lain pada port tetap
- Bukti: `playwright.config.js:11`, `playwright.config.js:22-23`, dan `tests/serve-dist.mjs:41` memakai port tetap 4321 serta `reuseExistingServer: true` di luar CI. Saat Lyra dan Litcq berjalan paralel, percobaan `npm test -- --reporter=line` pertama menempel ke server audit lain dan menghasilkan tiga kegagalan 404 (`/index.html` dan `/umkm.html`). Setelah server paralel ditutup, pengulangan dengan `CI=true` pada fingerprint identik lulus 11/11.
- Dampak: pengembang atau auditor lokal yang menjalankan preview/test bersamaan dapat memperoleh false failure atau, lebih buruk, menguji artifact dari proses lain. Produk dan GitHub Actions tidak terdampak pada konfigurasi sekarang karena `playwright.config.js:8,23` menetapkan satu worker dan melarang reuse saat `CI` aktif.
- Rekomendasi: pada pekerjaan lanjutan, beri port unik yang dapat dikonfigurasi per worktree/auditor atau nonaktifkan `reuseExistingServer` untuk perintah validasi kandidat. Catatan ini tidak memblokir deployment karena suite CI final lulus penuh.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum dan sesudah audit; Base HEAD dan fingerprint selalu identik dengan laporan Orion: `7a72f2d...` / `f95b1d...`, dengan 76 file kandidat.
- Menjalankan `npm ci`: 346 package terpasang, 0 vulnerability. Menjalankan `npm run check`: 27 file, 0 error, 0 warning, 0 hint. `npm ls --all` keluar dengan status 0.
- Menjalankan build produksi melalui `CI=true npm test -- --reporter=line`: tepat 8 halaman (`index`, `profil-desa`, `berita`, `galeri`, `dusun`, `destinasi`, `umkm`, `kontak`) dan 11/11 test Chromium lulus dalam 16 detik.
- Memverifikasi route, title/description, canonical, absolute `og:url`/`og:image`, metadata X/Twitter, sitemap, nav aktif, footer, unique IDs, seluruh local link/aset, dan OG image melalui `tests/site-parity.spec.ts`; implementasi shared metadata berada di `src/layouts/SiteLayout.astro:14,30-42`.
- Memverifikasi menu mobile (open/close/Escape/focus return), delapan halaman tanpa overflow pada 320/768/1280 px, enam trigger galeri beserta close/Escape/backdrop/focus return, dan form kontak fallback/enhancement `mailto:` (`src/pages/kontak.astro:31,56`).
- Memverifikasi canonical data 24 UMKM dalam urutan sumber dan distribusi 7 Nglarangan, 12 Kenteng Krajan, 4 Kenteng Wetan, 1 belum terverifikasi (`src/data/umkm.ts:6-271`). Filter count 24/7/12/4/1, multi-select union, zero state, canonical order, rapid toggle, serta exit terukur 180 ms lulus.
- Memverifikasi physical flip/unflip: midpoint matrix/depth, `preserve-3d`, lighting/shadow, target satu detik, interruption recovery, hover/click/touch/focus/Enter/Spasi/Escape/outside/focusout. State `aria-expanded`, `aria-controls`, `aria-describedby`, dan `aria-hidden` kedua muka tersinkron (`src/components/react/UmkmExplorer.tsx:151,195,263-270`).
- Memverifikasi reduced-motion menyelesaikan flip/filter secara instan, SSR/no-JS tetap menampilkan 24 front/back detail dalam urutan canonical dan menonaktifkan filter dengan jujur, serta grid UMKM menjadi 1/2/3 kolom tanpa overflow (`src/components/react/UmkmExplorer.tsx:283,423`).
- Memastikan copy/box yang diminta dihapus tidak ditemukan: paragraf instruksi panjang, `24 usaha terdata`, `3 dusun teridentifikasi`, `6+ bidang usaha`, dan frasa `belum terverifikasi aktif` semuanya 0 match pada `src`, `public`, dan `dist`.
- Memeriksa artifact `dist`: 47 file, tepat 8 `.html`, tidak ada PDF/ZIP/Markdown atau marker nama sumber privat. `public/og.png` dan `dist/og.png` byte-identik dengan SHA-256 `74B035B5BB4853CF08D175E2408922075F6F68ECC487D871F3F00FDFD5ADCFA6`.
- Memastikan PDF survei, panduan Markdown, direktori/ZIP redesign, arsip aset, dan hasil ekstraksi di-ignore secara eksplisit. `vercel.json:4-6` hanya membangun Astro ke `dist` dengan `cleanUrls: false`; root legacy tidak masuk 47-file artifact deployment.
- Memeriksa `astro.config.mjs:6-9`, `vercel.json:4-6`, `.github/workflows/playwright.yml:17-28`, `package.json`, dan `package-lock.json` untuk static file routing, Node 22, clean install, check/build/test, serta dependency version yang terkunci.
- Menjalankan `git diff --check` terhadap Base HEAD; lulus tanpa whitespace error.

## Batasan

- Browser in-app tidak tersedia pada sesi Litcq (daftar backend kosong), sehingga eksekusi interaktif independen dilakukan melalui suite Chromium Playwright milik repo, bukan kontrol browser in-app.
- Audit runtime hanya menggunakan Chromium headless. Firefox, WebKit, perangkat fisik, integrasi klien email untuk `mailto:`, dan pemuatan eksternal Google Fonts/Google Maps tidak diuji end-to-end.
- Source HTML/CSS/JS legacy tetap berada di root repository sebagai baseline non-runtime; kesimpulan aman deployment berdasarkan `outputDirectory: "dist"` dan inspeksi 47 file hasil build.
