# Litcq Functional and Regression Audit Report

- Waktu audit: 2026-08-11T21:21:26.2153980+07:00
- Base HEAD: `785ed921d99853846968c64ad7f6b7cdbc080374`
- Diff fingerprint: `5ab4da43665c1fbd05ad58b881c7723b836e1bceffd6af80a0f3fe0ad116a2d4`
- Scope: Adaptasi pengelompokan bergaya CodePen pada `umkm.html`, `css/style.css`, dan `js/main.js`; filter multi-select, count/empty-state, FLIP/reduced-motion/no-JS, flip-card, aksesibilitas, referensi lokal, privasi, navigasi, sitemap, dan regresi lintas halaman.
- Status: PASS

## Ringkasan

Tidak ditemukan bug fungsional atau regresi yang dapat ditindaklanjuti pada fingerprint ini. Chromium headless membuktikan kondisi awal 24 usaha, hasil kategori 7/12/4/1, union 19, zero-state, sinkronisasi checkbox Semua, operasi keyboard, pengumuman hasil, pembatalan aman pada toggle cepat, urutan DOM stabil, animasi exit/retained FLIP/enter, reduced-motion instan, fallback no-JS, penghilangan kartu tersembunyi dari accessibility tree dan urutan fokus, serta flip-card setelah penyaringan. Tidak ada error console atau overflow horizontal pada viewport 320, 768, dan 1280 piksel.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum audit; Base HEAD dan fingerprint cocok dengan laporan Orion. Kandidat hanya memuat `umkm.html`, `css/style.css`, dan `js/main.js`; perubahan pada `.agents/reports/**` dikecualikan oleh script resmi.
- Menjalankan `node --check js/main.js` dan `git diff --check`; keduanya lulus tanpa syntax maupun whitespace error.
- Menguji kondisi awal di Microsoft Edge/Chromium headless: 24 kartu terlihat, seluruh empat kategori aktif, checkbox Semua checked dan tidak indeterminate, filter progressive-enhancement terlihat, empty-state tersembunyi, serta result count `24 usaha ditampilkan` (`umkm.html:90-125`, `js/main.js:259-285`).
- Menguji setiap filter secara terpisah: Nglarangan 7, Kenteng Krajan 12, Kenteng Wetan 4, dan Belum terverifikasi 1. Gabungan Nglarangan + Kenteng Krajan menghasilkan 19 usaha; tidak ada kategori menghasilkan 0 usaha dan menampilkan empty-state. Mengaktifkan Semua kembali memulihkan 24 kartu.
- Memastikan checkbox native memiliki satu label implisit dan `aria-controls="umkmGrid"`; Spasi men-toggle kategori sambil mempertahankan fokus dan focus outline terhitung aktif. Checkbox Semua menjadi indeterminate ketika sebagian kategori aktif, checked hanya ketika seluruh kategori aktif, dan unchecked/non-indeterminate ketika nol kategori aktif (`umkm.html:90-113`, `css/style.css:560-588`, `js/main.js:269-282`).
- Memastikan container hasil menggunakan `aria-live="polite"` dan `aria-atomic="true"`; teks berubah sesuai hasil pada setiap skenario (`umkm.html:116-118`, `js/main.js:173-174`).
- Membandingkan urutan 24 nama kartu sebelum dan setelah seluruh kombinasi filter; urutan DOM tetap identik karena implementasi tidak memindahkan node.
- Menguji toggle cepat tujuh kali dengan jeda 25 ms. Keadaan akhir cocok dengan checkbox terakhir (12 kartu terlihat), count tepat, serta tidak ada animasi aktif atau inline `opacity`, `transform`, dan `will-change` yang tertinggal (`js/main.js:130-148`).
- Menginspeksi Web Animations API: kartu keluar memakai opacity 1 ke 0 dan scale 1 ke 0.92; 17 kartu retained menjalankan keyframe translate FLIP; tujuh kartu masuk memakai opacity 0 ke 1 dan scale 0.92 ke 1 (`js/main.js:181-252`).
- Menguji `prefers-reduced-motion: reduce`: perubahan Nglarangan langsung menghasilkan 17 kartu, count tepat, dan nol animasi kartu (`js/main.js:163-178`, `css/style.css:660-664`).
- Menguji kartu tersembunyi setelah filter: `hidden`, `inert`, `aria-hidden="true"`, `tabindex=-1`, dan `aria-expanded="false"` semuanya konsisten. Snapshot penuh Chromium AX tidak memuat nama kartu tersembunyi tetapi tetap memuat kartu terlihat (`js/main.js:114-128`, `js/main.js:165-170`).
- Menguji flip-card sebelum dan sesudah penyaringan: Enter/Spasi membuka, Escape menutup, `aria-expanded` dan `aria-hidden` sisi depan/belakang sinkron, `aria-controls` menunjuk ID detail yang tersedia, kartu yang disaring keluar kembali ke sisi depan, dan kartu berfungsi lagi setelah ditampilkan (`js/main.js:31-86`).
- Menguji fallback JavaScript-off pada viewport 320 piksel: filter tetap `hidden`/`display:none`, seluruh 24 kartu dan detail tetap ada/terlihat, count awal tetap 24, serta tidak ada overflow horizontal (`umkm.html:90`, `css/style.css:554-556`).
- Menguji viewport 320, 768, dan 1280 piksel: `documentElement.scrollWidth` sama dengan lebar viewport, tanpa overflow horizontal; grid terhitung masing-masing 1, 2, dan 3 kolom (`css/style.css:599`, `css/style.css:727`, `css/style.css:752`).
- Memindai delapan halaman HTML: seluruh referensi file lokal tersedia dan tidak ada ID duplikat. Navbar UMKM tetap berisi link semua halaman dengan `aria-current="page"`, dan `sitemap.xml:9` tetap memuat URL UMKM (`umkm.html:30-37`).
- Menjalankan smoke test Chromium pada kedelapan halaman untuk JavaScript global dan menu mobile; tidak ada page error/console error, tombol membuka menu dengan `aria-expanded="true"`, dan navigasi menutup menu seperti semula.
- Memastikan PDF data, panduan desain, dan direktori sumber redesign tetap di-ignore melalui aturan exact-path `.gitignore`; tidak ada PDF/Markdown/arsip sumber UMKM yang terlacak atau masuk fingerprint calon push.

## Batasan

- Pengujian browser menggunakan Microsoft Edge/Chromium headless lokal pada Windows; tidak mencakup Safari/iOS, Firefox, perangkat sentuh fisik, atau pembaca layar manusia.
- Kehadiran/ketiadaan kartu pada accessibility tree diverifikasi melalui Chrome DevTools Protocol; kualitas pelafalan live announcement oleh kombinasi pembaca layar tertentu tidak diuji secara manual.
