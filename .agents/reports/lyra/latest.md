# Lyra Report

- Waktu audit: 2026-08-11T15:41:10.8086608+07:00
- Base HEAD: `750e234b4d5b6a78b4229880fdcd5c4e443d4b38`
- Diff fingerprint: `0452ff7269d9f0a9e5db18d87b88ccd7c393d9487771f82c90d2d1e033f72f86`
- Scope: Audit ulang visual/design system pada `umkm.html`, `css/style.css`, serta konsistensi navbar/footer di `index.html`, `profil-desa.html`, `berita.html`, `galeri.html`, `dusun.html`, `destinasi.html`, dan `kontak.html`. Fingerprint juga mencakup file nonvisual `.gitignore`, `.vercelignore`, `sitemap.xml`, `README.md`, `AGENTS.md`, `.agents/get-change-fingerprint.ps1`, dan `.agents/*.md`; file-file tersebut dicatat sebagai bagian kandidat, tetapi tidak dinilai sebagai output visual. Setup lokal `.github/workflows/playwright.yml`, `package.json`, `playwright.config.js`, `tests/example.spec.js`, dan PDF sumber telah dikecualikan exact-path sehingga tidak muncul dalam fingerprint ini.
- Status: PASS

## Ringkasan

Kandidat visual identik dengan audit PASS sebelumnya: hash konten `css/style.css`, `umkm.html`, dan seluruh halaman yang memuat navbar/footer tidak berubah. Halaman UMKM konsisten dengan template halaman dalam dan design system situs pada palet, tipografi, container, hero, breadcrumb, hierarchy, spacing, radius, bayangan, kartu, navbar, dan footer. Modifier kartu tunggal tetap satu track pada tablet, sedangkan menu mobile tetap rata atas dan dapat digulir pada viewport pendek. Perubahan terbaru hanya aturan exact-path ignore yang nonvisual. Tidak ditemukan inkonsistensi visual yang perlu ditindaklanjuti.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum audit dan mengulangnya sesaat sebelum laporan; Base HEAD serta fingerprint identik dengan laporan Orion berstatus `READY_FOR_AUDIT`.
- Membaca laporan Orion terbaru dan memverifikasi bahwa perbedaan utama dari fingerprint audit sebelumnya terbatas pada `.gitignore` dan `.vercelignore`; hash seluruh file website visual tetap sama.
- Menghitung ulang `umkm.html` dan menemukan tepat 24 kartu UMKM. Struktur intro, ringkasan, jump links, empat kelompok lokasi, catatan data belum terverifikasi, CTA, dan footer tetap memakai hierarchy yang konsisten.
- Menelusuri cascade `css/style.css:661-667`: aturan umum `.umkm-grid` menjadi dua kolom sampai 992 px, lalu `.umkm-grid--single` pada `css/style.css:666` mengembalikannya ke satu kolom. Bersama `max-width: 370px` pada `css/style.css:580`, kartu tunggal `umkm.html:280-286` tidak dibagi menjadi dua track sempit pada tablet.
- Menelusuri menu mobile `css/style.css:669-679`: panel fixed memakai `justify-content: flex-start`, padding `6rem 1.5rem 2rem`, dan `overflow-y: auto`. Delapan tautan tetap dimulai dari area atas dan dapat digulir bila kontennya melampaui tinggi viewport.
- Memeriksa responsif direktori pada breakpoint 992 px, 860 px, dan 560 px: grid utama berubah 3/2/1 kolom; ringkasan menjadi satu kolom di mobile; jump links ditumpuk; header direktori beralih ke blok; dan footer berubah 4/2/1 kolom tanpa konflik modifier.
- Membandingkan komponen UMKM dengan baseline halaman dalam: `page-hero`, breadcrumb, `section-label`, `section-title`, container, section background, kartu, state peringatan, focus outline, dan footer memakai token serta aturan global yang sama.
- Memeriksa delapan halaman HTML: masing-masing memiliki delapan tautan navbar, tepat satu state aktif, tepat satu tautan UMKM di navbar, sembilan tautan footer, dan tepat satu tautan UMKM di footer. Tujuh halaman dalam memakai `page-hero`; `index.html` mempertahankan hero beranda.
- Memeriksa kategori/produk panjang pada kartu Rizqi, Rodiah, Bu Sofiyah, dan Zainal; grid 3/2/1 kolom, `minmax(0, 1fr)`, serta `overflow-wrap: anywhere` mempertahankan wrapping di dalam kartu.
- Menjalankan `git diff --check` pada file visual; tidak ada error whitespace, hanya peringatan normalisasi LF/CRLF dari Git.

## Batasan

- Browser in-app tetap tidak tersedia pada sesi audit (`agent.browsers.list()` sebelumnya mengembalikan daftar kosong), sehingga tidak ada screenshot atau pengukuran runtime. Verifikasi desktop, tablet, mobile, dan viewport pendek dilakukan dari markup, hash konten, urutan cascade, breakpoint, sizing, wrapping, dan overflow CSS.
- Perilaku JavaScript, klik/keyboard menu, link/aset, isi serta keamanan PDF, aturan ignore/deployment, sitemap, dan regresi teknis berada di luar scope Lyra.
- Perubahan exact-path ignore terbaru bersifat nonvisual dan tidak diperlakukan sebagai temuan tampilan.
