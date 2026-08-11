# Litcq Functional and Regression Audit Report

- Waktu audit: 2026-08-11T20:28:16.6354811+07:00
- Base HEAD: `800fa37cdaf8139d73dafa895840d3acdcf0a79c`
- Diff fingerprint: `255bfc2ea01a258f6bddb3f23b497b0068dd04cd0e637061955bed2092fea33c`
- Scope: `.gitignore`, `.vercelignore`, `umkm.html`, `css/style.css`, `js/main.js`, 23 WebP publik dalam `assets/umkm/`, dependency navigasi/sitemap, serta pengecualian sumber lokal panduan, direktori redesign, dan `assets/umkm-card-redesign.zip`.
- Status: PASS

## Ringkasan

Tidak ditemukan bug fungsional atau regresi yang dapat ditindaklanjuti pada fingerprint ini. Temuan high sebelumnya tertutup: arsip sumber ZIP kini mempunyai aturan exact-path di Git dan Vercel, tetap ada secara lokal, tidak terlacak, dan tidak masuk fingerprint. Temuan semantik pembaca layar juga tertutup melalui progressive enhancement yang menyinkronkan role, nama, `aria-expanded`, `aria-controls`, ID target unik, serta `aria-hidden` komplementer.

Pengujian Chromium headless membuktikan click/tap, Enter, Spasi, Escape, pointer di luar, focusout, hover preview, fallback tanpa JavaScript, accessibility tree, reduced-motion, dan overflow 320/768/1280 bekerja sesuai kontrak. Seluruh 24 data UMKM tetap identik dengan Base HEAD, distribusi 7/12/4/1 tetap sama, dan pemeriksaan aset, privasi, referensi lokal, navigasi, serta sitemap lulus.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum dan sesudah audit; Base HEAD/fingerprint stabil dan cocok dengan laporan Orion. Semua 23 output `assets/umkm/*.webp` muncul pada kandidat, sedangkan ZIP, panduan, dan direktori sumber tidak muncul.
- Memastikan `.gitignore:43-45` dan `.vercelignore:4-6` memiliki aturan exact-path terpisah untuk panduan, direktori `assets/umkm-card-redesign/`, dan `assets/umkm-card-redesign.zip`. Arsip tetap ada secara lokal dengan ukuran 1.313.886 byte; `git check-ignore -v` menunjuk aturan exact ZIP, sementara `assets/umkm/anyaman.webp` tidak terabaikan.
- Membandingkan nama, produk, tahun/lama usaha, dan legalitas setiap kartu terhadap `HEAD:umkm.html`: `DATA_BASE=24`, `DATA_CURRENT=24`, dan `DATA_DELTA=0`; distribusi tetap Nglarangan 7, Kenteng Krajan 12, Kenteng Wetan 4, serta lokasi belum terverifikasi 1.
- Memeriksa 24 kartu, 24 sisi depan, 24 sisi belakang, 24 blok detail, dan 24 thumbnail. Seluruh gambar mempunyai `src`, alt nonkosong, lazy loading, async decoding, serta atribut 640x480; terdapat 22 path unik, 23 WebP publik valid 640x480, dan nol referensi hilang.
- Memindai isi kartu untuk URL, email, nomor Indonesia, WhatsApp/telepon, alamat, omzet, pendapatan, dan data produksi privat; tidak ada kecocokan.
- Memeriksa struktur statis: 15 ID markup awal unik, tidak ada fragment link yang kehilangan anchor, dan seluruh 33 referensi lokal unik tersedia. ID runtime `umkm-card-detail-1` sampai `umkm-card-detail-24` juga unik dan seluruh `aria-controls` tepat menunjuk pasangan sisi belakangnya.
- Memverifikasi inisialisasi seluruh kartu di Chromium: masing-masing menjadi `role="button"`, mendapat nama seperti `Detail UMKM Sunarti, produk Sembako`, `aria-expanded="false"`, sisi depan `aria-hidden="false"`, dan sisi belakang `aria-hidden="true"` (`js/main.js:31-61`).
- Menguji state: click pertama membuka dan click kedua menutup; Enter serta Spasi membuka/men-toggle; Escape menutup sambil mempertahankan fokus; perpindahan fokus ke kartu berikutnya menutup kartu lama; pointerdown pada body menutup serta melepas fokus (`js/main.js:62-83`).
- Memeriksa accessibility snapshot Chromium. State awal hanya mengekspos satu nama, gambar, kategori, heading, dan produk; sisi belakang tidak terduplikasi. Setelah dibuka, snapshot menunjukkan button berstatus expanded dan mengekspos `Detail Usaha`, satu heading, produk, serta pasangan term/definition untuk Berdiri, Legalitas, dan Dusun.
- Memverifikasi hover pada pointer halus: media query cocok dan flipper mencapai matriks rotasi Y 180 derajat. CSS tetap memisahkan preview hover dari state eksplisit `.is-flipped` (`css/style.css:592-600`).
- Menguji JavaScript-off: class `js`, role, serta `aria-hidden` runtime tidak ada; fokus tetap menghasilkan rotasi Y 180 derajat dan seluruh 24 `<dl>` tersedia. Ini menjaga detail dapat diakses ketika script gagal/dinonaktifkan.
- Menguji `prefers-reduced-motion: reduce`: durasi transisi flipper terhitung `0s` (`css/style.css:644-647`). Pada viewport 320, 768, dan 1280 piksel, `scrollWidth` sama dengan `clientWidth` (tidak ada overflow horizontal).
- Memeriksa navbar/footer halaman UMKM dan dependency halaman lain yang tidak berubah; link UMKM tetap tersedia. `sitemap.xml:9` tetap memuat URL kanonis UMKM.
- Menjalankan `node --check js/main.js` serta `git diff --check`; keduanya lulus, selain warning normalisasi LF/CRLF Git yang tidak mengubah konten.

## Batasan

- Pengujian browser menggunakan Chromium headless lokal; tidak mencakup Safari/iOS, Firefox, perangkat sentuh fisik, atau pembaca layar manusia. Accessibility snapshot Chromium digunakan untuk membuktikan state dan penghilangan duplikasi pada accessibility tree.
- Hover preview sengaja tidak mengubah `aria-expanded`; state aksesibel berubah saat pengguna mengaktifkan kontrol dengan click/tap atau keyboard.
