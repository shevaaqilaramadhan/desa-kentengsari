# Litcq Report

- Waktu audit: 2026-08-16T01:21:00+07:00
- Base HEAD: `b53434880e812c26d9065969d8cd0beb09fc3c82`
- Diff fingerprint: `e9a0e315b62a334074ff51d2eedc77176a7c11115750cd5e441ffe67ea9a50cc`
- Scope: `package.json`, `package-lock.json`, `src/layouts/SiteLayout.astro`, `src/pages/kontak.astro`, `src/styles/global.css`, `tests/site-parity.spec.ts`, build output, dan regresi seluruh route
- Status: PASS

## Ringkasan

Kandidat round 2 lulus audit teknis dan regresi. Shell header/footer identik pada seluruh tujuh route, font utama dilayani lokal, dan placeholder Google Maps berpindah secara deterministik dari loading ke ready. Fallback no-JS, reduced-motion, interaksi iframe, ukuran mobile/desktop, serta batas pihak ketiga Google Maps tervalidasi tanpa error atau request failure.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Fingerprint resmi dihitung sebelum dan sesudah audit; Base HEAD dan fingerprint cocok persis dengan kontrak round 2.
- `npm run check`: lulus, 0 error, 0 warning, 0 hint.
- `npm test`: lulus; build Astro menghasilkan 7 halaman dan Playwright penuh lulus 18/18.
- `git diff --check`: lulus tanpa whitespace error.
- Dependency font `@fontsource-variable/plus-jakarta-sans` tepat `5.3.0` pada manifest, lockfile, dan instalasi lokal. Integrity SHA-512 tersedia dan license lock/package sama-sama `OFL-1.1`.
- HTML dan CSS hasil build tidak mengandung `fonts.googleapis` atau `fonts.gstatic`; computed body font seluruh route menggunakan `Plus Jakarta Sans Variable` dari build lokal.
- Request font yang dibuat di dalam Google Maps iframe diterima sebagai boundary pihak ketiga. Main document tidak meminta font eksternal; actual map load tidak menghasilkan console error, page error, atau failed Google request pada audit ini.
- Extended Playwright shell audit menjalankan 42 kasus: 7 route pada viewport 390, 768, 1023, 1024, 1025, dan 1440 px. Seluruhnya HTTP 200, tanpa overflow, broken image setelah scroll, duplicate ID, missing ARIA reference, failed local request, atau signature header/footer yang berbeda.
- Signature shell yang dibandingkan mencakup tinggi header, geometri logo, background/color footer, grid columns, gap, padding, tinggi footer, geometri logo footer, dan computed body font. Reflow 1023/1024/1025 tetap konsisten.
- Test map deterministik di `tests/site-parity.spec.ts:509` bermakna dan stabil: request map ditahan dengan route gate, state loading diverifikasi sebelum respons dilepas, lalu state ready dan geometri tetap diverifikasi. Test diulang 3 kali dan lulus 3/3 tanpa timing flake.
- State loading pada 390x844 dan 1440x1000: placeholder terlihat, `role="status"`, `aria-live="polite"`, shell `data-map-state="loading"`, dan iframe disembunyikan secara visual.
- State ready simulasi dan aktual pada mobile/desktop: shell menjadi `ready`, placeholder mendapat `aria-hidden="true"`, `visibility:hidden`, `pointer-events:none`, iframe opacity 1, pointer-events aktif, serta iframe menjadi hit target setelah transisi selesai.
- Fallback no-JS pada mobile/desktop: placeholder `display:none`, iframe opacity 1, ukuran minimal 430 px, dan iframe menjadi hit target; overlay tidak menutup interaksi peta.
- Reduced-motion pada mobile/desktop: shimmer tidak berjalan (`animation-name:none`) dan durasi transisi/animasi efektif dipangkas menjadi `0.01ms` oleh aturan global.
- Dimensi map tervalidasi: sekitar 356x430 px pada mobile dan 542x534 px pada desktop; tidak ada perubahan geometri antara loading dan ready.
- Regresi seluruh route mencakup metadata/canonical/sitemap/no-Berita, local references/assets, no-JS profile, data desa, navigation pointer/touch/Escape/focus, gallery dialog, contact form, UMKM filter/flip/touch/keyboard, reduced-motion, UTF-8, ARIA, iframe contract, console/page errors, dan overflow.
- Tidak terjadi UMKM timing flake pada full run.
- Tidak ada source, test, dependency, laporan agent lain, commit, atau push yang diubah oleh Litcq.

## Batasan

- Browser in-app tidak tersedia pada sesi ini; audit runtime dilakukan dengan Playwright Chromium lokal terhadap static build kandidat.
- Isi internal Google Maps tetap merupakan layanan pihak ketiga. Audit memverifikasi boundary iframe, loading/ready contract, interaktivitas host, ukuran, dan ketiadaan error/request failure yang terlihat dari halaman.
