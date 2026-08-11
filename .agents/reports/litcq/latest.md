# Litcq Functional and Regression Audit Report

- Waktu audit: 2026-08-11T15:42:22.2307698+07:00
- Base HEAD: `750e234b4d5b6a78b4229880fdcd5c4e443d4b38`
- Diff fingerprint: `0452ff7269d9f0a9e5db18d87b88ccd7c393d9487771f82c90d2d1e033f72f86`
- Scope: `.gitignore`, `.vercelignore`, `berita.html`, `css/style.css`, `destinasi.html`, `dusun.html`, `galeri.html`, `index.html`, `kontak.html`, `profil-desa.html`, `sitemap.xml`, `umkm.html`, dependency `js/main.js`, serta verifikasi pengecualian lokal PDF survei dan empat file setup Playwright; file agent/orchestrator lain dalam fingerprint hanya dicocokkan sebagai identitas kandidat.
- Status: PASS

## Ringkasan

Tidak ditemukan bug fungsional atau regresi yang dapat ditindaklanjuti pada fingerprint ini. Blocker PDF dan temuan high CI lama telah tertutup: PDF survei serta `.github/workflows/playwright.yml`, `package.json`, `playwright.config.js`, dan `tests/example.spec.js` tetap ada secara lokal, tidak tracked, diabaikan Git dengan aturan exact-path, dikecualikan Vercel, dan tidak muncul dalam fingerprint. Karena workflow/package/config/test bukan lagi kandidat, kegagalan `npm ci` pada audit sebelumnya tidak berlaku pada calon push ini.

Halaman UMKM tetap memuat tepat 24 kartu dengan distribusi 7/12/4/1, tidak memuat pola data privat yang diperiksa, empat entri publik yang sebelumnya terpotong tetap lengkap, dan pemeriksaan navigasi, footer, referensi lokal, ID/ARIA, sitemap, JavaScript, CSS, serta fallback responsif statis lulus.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum audit dan sesudah seluruh pemeriksaan; Base HEAD/fingerprint stabil dan cocok dengan laporan Orion.
- Memastikan lima file lokal tetap ada: `.github/workflows/playwright.yml`, `package.json`, `playwright.config.js`, `tests/example.spec.js`, dan `assets/DATA UMKM GIAT 16 DESA KENTENGSARI - Form Responses 1.pdf`; PDF tetap berukuran 43.041 byte.
- Menjalankan `git check-ignore -v` pada kelima file; masing-masing menunjuk aturan exact-path di `.gitignore:41` dan `.gitignore:103-106`, tidak tracked, dan tidak muncul dalam fingerprint resmi.
- Memastikan aturan deployment exact-path tersedia tepat sekali di `.vercelignore:2` dan `.vercelignore:4-7`.
- Menguji path pembanding `.github/workflows/other.yml`, `package-other.json`, `playwright.other.js`, `tests/other.spec.js`, dan `assets/other-document.pdf`; tidak ada yang ikut terabaikan sehingga aturan terbukti tidak melebar.
- Menghitung tepat 24 elemen `.umkm-card`: Nglarangan 7, Kenteng Krajan 12, Kenteng Wetan 4, dan lokasi belum terverifikasi 1.
- Memindai `umkm.html` untuk pola nomor telepon, Google Drive/Docs/Maps, RT/RW, nama pengisi form, pembukuan, keuangan usaha, dan jumlah tenaga kerja; seluruh hitungan nol.
- Memverifikasi data publik lengkap: Rizqi `Kerajinan & Perdagangan` dan `Pelepah pisang dan sembako` (`umkm.html:179-181`); Rodiah `Kuliner & Perdagangan` dan `Gorengan dan snack` (`umkm.html:215-217`); Bu Sofiyah dengan keripik singkong, keripik talas, dan peyek kacang (`umkm.html:221-223`); Zainal Abidin dengan keripik singkong, pangsit, dan putil (`umkm.html:263-265`).
- Memeriksa delapan halaman HTML; masing-masing memiliki tepat satu `main`, satu link UMKM di navbar, satu link UMKM di footer, ID unik, fragment dan referensi ARIA yang valid, seluruh gambar beratribut alt, serta seluruh referensi lokal tersedia.
- Memeriksa seluruh referensi `url(...)` lokal CSS tersedia dan pasangan kurung CSS seimbang 291/291.
- Menjalankan `node --check js/main.js` dengan exit `0`; ID selector navbar yang digunakan script tersedia pada seluruh delapan halaman.
- Mem-parse `sitemap.xml`; XML valid, memiliki delapan URL, dan URL kanonis `https://www.kentengsari.desa.id/umkm.html` muncul tepat sekali.
- Menelusuri cascade responsif: `.umkm-grid--single` tetap satu kolom pada breakpoint tablet (`css/style.css:665-666`); menu mobile rata atas dengan padding dan `overflow-y: auto`, sehingga delapan tautan dapat digulir pada viewport pendek (`css/style.css:669-675`).
- Menjalankan `git diff --check`; lulus selain peringatan normalisasi LF/CRLF Git.
- Tidak menjalankan atau mengubah setup Playwright lokal karena keempat file tersebut sengaja berada di luar kandidat/fingerprint dan dependency tidak termasuk scope perubahan.

## Batasan

- Backend browser in-app tidak tersedia, sehingga verifikasi responsif dilakukan dari markup, cascade CSS, dan alur JavaScript, bukan inspeksi interaktif halaman lokal.
- Isi atau layout PDF tidak diaudit ulang karena PDF tidak berubah dan sengaja dikecualikan dari kandidat/deployment; audit ini memverifikasi keberadaan lokal serta efektivitas pengecualiannya.
