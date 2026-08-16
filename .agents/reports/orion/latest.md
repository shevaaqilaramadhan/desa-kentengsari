# Orion Implementation Report

- Waktu implementasi: 2026-08-16T01:12:38.2297674+07:00
- Base HEAD: `b53434880e812c26d9065969d8cd0beb09fc3c82`
- Diff fingerprint: `e9a0e315b62a334074ff51d2eedc77176a7c11115750cd5e441ffe67ea9a50cc`
- Permintaan/scope: Menindaklanjuti audit round 1 dengan fallback loading Google Maps yang intentional, accessible, no-JS-safe, reduced-motion-safe, dan teruji deterministik; kandidat juga tetap mencakup penyamaan header/footer global serta self-host Plus Jakarta Sans dari round sebelumnya.
- Status: READY_FOR_AUDIT

## Ringkasan Perubahan

- Membungkus iframe Google Maps pada halaman Kontak dengan `map-shell` ber-state `loading` dan `ready`.
- Mengganti panel putih kosong selama lazy-load dengan placeholder design-system berupa pin SVG code-native, teks “Memuat peta lokasi…”, identitas lokasi, gradient hijau lembut, serta shimmer halus.
- Event `load` iframe mengubah state menjadi `ready`, membuat iframe terlihat penuh, menyembunyikan placeholder, menghapusnya dari accessibility tree, dan memastikan overlay tidak menghalangi interaksi map.
- Placeholder memakai `role="status"`, `aria-live="polite"`, dan `aria-atomic="true"`; setelah selesai diberi `aria-hidden="true"` agar tidak diumumkan berulang.
- Menambahkan aturan `prefers-reduced-motion` yang meniadakan transition serta shimmer.
- Menambahkan `<noscript>` sehingga placeholder disembunyikan dan iframe tetap terlihat ketika JavaScript nonaktif.
- Tidak mengubah Google Maps menjadi static image dan tidak mencoba mengontrol request font internal iframe pihak ketiga.
- Menambah regresi Playwright deterministik dengan menahan lalu memenuhi request iframe secara lokal, sehingga pengujian initial loading dan ready state tidak bergantung pada timing jaringan Google.
- Perubahan round sebelumnya tetap utuh: satu header/footer global pada tujuh route, footer dark branded yang compact, treatment logo konsisten, dan Plus Jakarta Sans Variable lokal versi tepat `5.3.0`.

## File yang Berubah

- `package.json`
- `package-lock.json`
- `src/layouts/SiteLayout.astro`
- `src/pages/kontak.astro`
- `src/styles/global.css`
- `tests/site-parity.spec.ts`

## Validasi

- `npm run check`: lulus, 25 file, 0 error, 0 warning, 0 hint.
- Regresi Playwright map terarah: lulus 1/1 setelah `dist` dibangun ulang.
- `npm test`: final lulus 18/18.
- Map loading/ready diuji deterministik pada viewport 390×844 dan 1440×1000.
- No-JS map diuji pada viewport mobile dan desktop: placeholder tidak menutup map, iframe terlihat, opacity 1, dan tinggi minimal 430 px.
- Geometri map shell/frame tetap stabil saat transisi loading ke ready; border shell 1 px diperhitungkan oleh assertion.
- Accessibility tervalidasi: status semantics initial, `aria-hidden` setelah ready, title iframe tetap, dan overlay memiliki `pointer-events: none` saat selesai.
- Screenshot QA loading/ready halaman Kontak dilakukan pada desktop 1440×1000, tablet 768×900, dan mobile 390×844. Placeholder tampak intentional, layout form/cards/footer tetap teratur, dan tidak ada blank white panel.
- Audit shell route tetap lulus: header/footer parity untuk 7 route × 3 viewport, seluruh image lazy-load, iframe dimensions/title/src, HTTP 200, console/page error, failed local request, overflow, duplicate ID, dan missing ARIA reference.
- Regresi lama tetap lulus: menu pointer/touch/Escape, no-JS, reduced-motion, canonical, data desa, tanpa Berita, galeri, form Kontak, dan interaksi UMKM.
- Satu final run sempat membaca ikon menu pada frame transition hampir selesai; test menu kemudian lulus 3/3 pada repeat dan full suite berikutnya lulus 18/18. Tidak ada kode menu yang diubah pada round ini.
- `git diff --check`: lulus.
- Artefak screenshot, script QA sementara, dan server QA telah dihapus/dihentikan sebelum fingerprint final.
- Fingerprint resmi setelah cleanup: `e9a0e315b62a334074ff51d2eedc77176a7c11115750cd5e441ffe67ea9a50cc` dengan Base HEAD `b53434880e812c26d9065969d8cd0beb09fc3c82`.

## Risiko dan Batasan

- Google Maps tetap merupakan iframe pihak ketiga. Waktu request internal Google tidak dijadikan syarat kelulusan; aplikasi menjamin pengalaman loading yang jelas dan state ready berdasarkan event iframe.
- Screenshot ready diambil pada handoff transition, sedangkan kondisi post-transition final diverifikasi deterministik oleh Playwright hingga placeholder benar-benar hidden dan iframe opacity 1.
- Browser interaktif aplikasi tidak tersedia pada sesi ini; implementasi diuji melalui Playwright lokal proyek.
- Laporan Lyra dan Litcq dari round 1 tidak diubah oleh Orion dan sekarang kedaluwarsa terhadap fingerprint baru; keduanya harus mengaudit ulang kandidat ini sebelum Xavier.
- Belum ada commit atau push.
