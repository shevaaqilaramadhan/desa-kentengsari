# Lyra Report — Audit Round 2

- Waktu audit: 2026-08-16T00:22:16.0429469+07:00
- Base HEAD: `32ad61ae099ff41841dad020920468667e7310aa`
- Diff fingerprint: `d5938c045c2fca314c2ecca85d74d90442323cb971712fe8217851b7e374e26e`
- Scope: `src/pages/profil-desa.astro`, `tests/site-parity.spec.ts`
- Status: PASS

## Ringkasan

Audit visual round 2 lulus. Penggantian breakpoint spacing yang keras dengan nilai `clamp()` fluid menghasilkan transisi padding dan geometri section yang halus pada 1023/1024/1025px. Seluruh layout tetap teratur pada 390, 768, 1023, 1024, 1025, dan 1440px tanpa whitespace ekstrem, clipping, overlap, atau horizontal overflow. Hero, collage, card Visi/Misi, bagan organisasi, dan footer mempertahankan hierarchy visual Kentengsari/Kuta.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum dan setelah audit; Base HEAD serta fingerprint identik dengan kandidat round 2.
- Meninjau diff presentasional pada `src/pages/profil-desa.astro`, khususnya fluid spacing, gap, tinggi image/collage, margin card, margin bagan, penghapusan forced `min-height`, dan mobile spacing.
- Mengambil dan memeriksa screenshot full-page Chromium Playwright pada 390x844, 768x900, 1023x900, 1024x900, 1025x900, dan 1440x1000 dengan `prefers-reduced-motion: reduce`.
- Hero terukur tepat satu viewport: 844px pada mobile, 900px pada 768–1025px, dan 1000px pada desktop 1440px.
- Seluruh section memiliki `min-height: 0`, continuity antar-section 0px, dan tidak ada horizontal overflow pada keenam viewport.
- Padding 1023/1024/1025 bergerak fluid tanpa lonjakan: history 84.143/84.191/84.238px; landmark 80.143/80.191/80.238px; vision 81.107/81.142/81.178px; structure 86.625/86.667/86.709px.
- Tinggi section 1023/1024/1025 juga berubah mulus: history 798.11/798.28/798.45px; landmark 740.70/740.94/741.17px; vision 744.42/744.58/744.69px; structure 817.41/817.53/817.67px.
- History image-content dan landmark collage-content tetap sejajar pada tablet/desktop; mobile tersusun satu kolom dengan gambar lebih dahulu dan gap yang konsisten.
- Ketiga image collage memiliki ukuran positif dan grid yang stabil pada semua viewport; crop gambar konsisten tanpa distorsi visual.
- Kedua card Visi/Misi sejajar dan sama tinggi pada 768–1440px; pada 390px keduanya menjadi satu kolom dengan lebar identik dan spacing teratur.
- Tiga node organisasi sejajar dan sama tinggi pada 768–1440px; pada 390px menjadi satu kolom dengan lebar identik. Head node, connector, territory chips, dan dua notes tetap terpusat dan tidak terpotong.
- Footer beralih dari grid dua kolom pada 1023px menjadi empat kolom pada 1024px sesuai breakpoint `lg`. Tingginya berubah dari 525.16px menjadi 376.67px, tetapi reflow terlihat teratur, tidak menggeser section profile, dan tidak menimbulkan overlap, clipping, atau whitespace abnormal; 1024 dan 1025 identik secara visual.
- Tidak terlihat mojibake/karakter UTF-8 rusak, teks terpotong, card acak, border tidak sejajar, atau transisi warna section yang membingungkan.
- `git diff --check` lulus tanpa whitespace error.

## Batasan

- Browser terintegrasi tidak tersedia pada sesi ini; audit dilakukan pada preview lokal terbaru menggunakan Chromium Playwright standalone.
- Audit ini visual/design-only. Validasi fungsi runtime, link/aset, HTTP, SEO, keyboard, dan ARIA fungsional berada di luar scope Lyra.
