# Lyra Report

- Waktu audit: 2026-08-12T02:41:45.7230808+07:00
- Base HEAD: `8acb9e99bf592053ee8b3bc103bb78587617eec1`
- Diff fingerprint: `d143bba89aabbea4e8232d92b68581663f8ea3f20459742865d57d889de32e3b`
- Scope: Audit visual final kandidat parity UI/UX pada delapan route di 320/768/1280; shared header, hero, CTA, typography, spacing, cards/forms/gallery/footer, navigation hamburger/overlay pada breakpoint 860/861, serta physical 3D flip/unflip UMKM termasuk reduced-motion. Scope kandidat meliputi `README.md`, komponen/layout/page/style/test yang tercantum pada fingerprint, dan penghapusan delapan entrypoint HTML beserta CSS/JS legacy.
- Status: PASS

## Ringkasan

Kandidat final mempertahankan bahasa visual legacy yang sebelumnya sudah diaudit: header transparan di atas hero fotografis, hierarchy heading dan CTA, palet hijau, typography, radius, shadow, section rhythm, serta grid responsif tetap konsisten pada delapan route. Pemeriksaan 320/768/1280 tidak menemukan clipping, overlap, atau horizontal overflow.

Temuan siklus sebelumnya tentang ikon hamburger sudah diperbaiki. Pada 320 dan 768 px, tiga garis berubah menjadi X ketika overlay dibuka: garis atas/bawah bergerak ke pusat dan berotasi berlawanan, garis tengah memudar, lalu seluruhnya kembali menjadi hamburger ketika ditutup. Toggle tetap 44x44 px, berada di atas overlay, memiliki kontras/focus ring yang konsisten, dan accessible name berubah selaras dari "Buka menu navigasi" ke "Tutup menu navigasi". Breakpoint 860/861 tetap bersih: overlay fullscreen hanya berlaku sampai 860 px dan desktop navigation muncul mulai 861 px tanpa state atau scroll lock tertinggal.

Flip kartu UMKM terbukti sebagai rotasi 3D fisik. Frame aktual 250/500/750 ms memperlihatkan front face mulai berotasi, kartu menyempit menjadi edge-on pada midpoint dengan perubahan depth/tilt/shadow/lighting, lalu back face membuka dari arah berlawanan dan menetap. Unflip mengembalikan urutan tersebut selama sekitar satu detik. Implementasi menggunakan perspective 1100 px, preserve-3d, matrix3d/rotateY, translate-Z dinamis, hidden backfaces, dan reduced-motion yang langsung settle.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum dan setelah audit; Base HEAD serta fingerprint identik dengan laporan Orion.
- Membandingkan perubahan presentasional terhadap Base HEAD dan laporan parity Lyra sebelumnya; perubahan runtime visual siklus kedua terbatas pada morph ikon menu, sementara template delapan route dan runtime UMKM selain test recorder tidak berubah.
- Memeriksa `src/layouts/SiteLayout.astro:73-85` dan `:166-172`: toggle memiliki tiga SVG path terpisah dan state visual mengikuti `aria-expanded`/accessible name yang sama.
- Memeriksa `src/styles/global.css:136-171`: target toggle 44x44 px, z-index 101, transform hamburger-ke-X 160-220 ms, serta closed state tanpa transform. Global reduced-motion di `src/styles/global.css:265-277` memangkas transition dengan konsisten.
- Memeriksa aturan overlay `src/styles/global.css:208-263`: nav fixed fullscreen, overflow-y aman, stacking overlay 99/toggle 101, kontras putih-hijau, dan breakpoint maksimum 860 px.
- Menjalankan `npx playwright test tests/site-parity.spec.ts tests/umkm.spec.ts --project=chromium --workers=1` pada server yang dikelola runner: 13/13 test lulus dalam 20,2 detik.
- Test parity membuktikan delapan route bebas horizontal overflow pada 320/768/1280; morph open/close, accessible name, overlay geometry, body scroll lock, Escape, backdrop, focus return, touch, dan transisi 768->861->768 semuanya lulus (`tests/site-parity.spec.ts:184-315`).
- Meninjau frame aktual `flip-250ms.png`, `flip-500ms.png`, `flip-750ms.png`, dan `flip-settled-back.png`; silhouette edge-on, perspektif, depth, lighting, shadow, sisi belakang, dan state akhir terlihat berbeda jelas.
- Memverifikasi implementasi `src/components/react/UmkmExplorer.tsx:50-60`, `:123-160`, dan `:249-264`: perspective 1100 px, rotateY, tilt, depth 34 px, preserve-3d, hidden backfaces, lighting dua sisi, dan dynamic shadow.
- Test UMKM membuktikan frame matrix3d progresif pada 250/500/750 ms, midpoint depth lebih dari 10 px, durasi flip 900-1120 ms, unflip 900-1150 ms, interruption recovery, active-face state, touch/focus, serta reduced-motion (`tests/umkm.spec.ts:124-328`).
- Memastikan paragraf instruksi panjang dan tiga summary box tetap tidak ada; filter tetap berupa tombol tanpa checklist atau suffix status aktif.
- Memastikan tidak ada server audit tertinggal pada port 4321.

## Batasan

- Browser terintegrasi tidak tersedia pada sesi ini. Audit visual menggunakan empat screenshot Chromium hasil runner kandidat, inspeksi source presentasional, bukti audit parity sebelumnya, dan regression suite proyek; Safari/iOS, Firefox, serta perangkat fisik belum diuji langsung.
- Percobaan regression pertama sempat memakai server audit lama yang berhenti di tengah run dan menghasilkan `ERR_CONNECTION_REFUSED`. Setelah port dipastikan kosong, pengulangan bersih dengan server yang dikelola Playwright lulus 13/13; kegagalan awal bukan perilaku kandidat.
- Google Fonts dan Google Maps bergantung pada jaringan runtime; fallback atau konten jaringan eksternal tidak menunjukkan perubahan design-system terkait kandidat.
