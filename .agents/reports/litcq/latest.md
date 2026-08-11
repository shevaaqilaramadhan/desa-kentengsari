# Litcq Functional and Regression Audit Report

- Waktu audit: 2026-08-11T22:50:50.0228317+07:00
- Base HEAD: `1d6efe103237fb11375fb74ff334f518def806fb`
- Diff fingerprint: `6bdc574ebbf5718dbe00bd5a8ab1a95b476edaed0a71da55c6d2e2f59b246c4d`
- Scope: Penghapusan paragraf instruksi direktori dan tiga box ringkasan beserta CSS yatim pada `umkm.html`/`css/style.css`; perpanjangan exit animation filter menjadi 460 ms pada `js/main.js`; regresi filter, FLIP, flip-card, aksesibilitas, no-JS, reduced-motion, referensi/ID/aset, privasi, navigasi, sitemap, dan responsivitas 320/768/1280.
- Status: PASS_WITH_NOTES

## Ringkasan

Tidak ditemukan bug fungsional atau regresi yang dapat ditindaklanjuti pada fingerprint ini. Delta memenuhi copy-removal yang diminta, tetap mempertahankan 24 kartu dan hitungan filter 24/7/12/4/1/19/0, serta secara statis mempertahankan progressive enhancement, aksesibilitas kartu/filter, FLIP, reduced-motion, privasi, navigasi, dan sitemap. Konfigurasi exit berubah dari 180 ms menjadi 460 ms. Verifikasi runtime Chromium dan pengukuran pixel overflow tidak dapat diulang secara independen karena tidak ada browser yang tersedia pada sesi audit; keterbatasan ini menjadi satu-satunya catatan.

## Temuan

### [note] Runtime Chromium tidak tersedia pada sesi audit

- Bukti: discovery browser resmi mengembalikan daftar kosong; pemeriksaan statis menunjukkan breakpoint grid 1/2/3 kolom pada `css/style.css:703` dan `css/style.css:729`, serta durasi exit 460 ms pada `js/main.js:191`, tetapi elapsed runtime dan `scrollWidth` viewport 320/768/1280 tidak dapat diukur ulang.
- Dampak: Tidak ada regresi yang teridentifikasi, tetapi rasa durasi aktual, perilaku rapid-toggle di engine browser, reduced-motion runtime, dan overflow pixel belum mendapat pengujian Chromium independen oleh Litcq pada siklus ini.
- Rekomendasi: Xavier dapat menggabungkan bukti statis Litcq dengan bukti runtime fingerprint-identik dari laporan Orion dan audit visual Lyra; lakukan smoke test Chromium tambahan bila quality gate mengharuskan bukti runtime independen.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum dan sesudah audit. Base HEAD `1d6efe103237fb11375fb74ff334f518def806fb` dan fingerprint `6bdc574ebbf5718dbe00bd5a8ab1a95b476edaed0a71da55c6d2e2f59b246c4d` cocok dengan konteks master dan laporan Orion `READY_FOR_AUDIT`; kandidat kode hanya `css/style.css`, `js/main.js`, dan `umkm.html`.
- Menjalankan `node --check js/main.js` dan `git diff --check`; keduanya lulus tanpa syntax error atau whitespace error.
- Memastikan paragraf persis “Pilih satu atau beberapa dusun ... Status legalitas mengikuti data sumber.” tidak ada; wrapper/kelas `.umkm-summary`, label “Usaha terdata”, “Dusun teridentifikasi”, dan “Bidang usaha” tidak ada di HTML; tidak ada selector `.umkm-summary`/`.umkm-summary__*` yang tertinggal di CSS (`umkm.html:54`, `umkm.html:65`, `css/style.css:527`).
- Memeriksa exit WAAPI: `duration: 460`, stagger 24 ms dibatasi 120 ms, easing `cubic-bezier(.4, 0, .6, 1)`, sehingga durasi sumber 280 ms lebih panjang dan 2,56 kali durasi lama 180 ms (`js/main.js:183`).
- Menelaah keamanan rapid-toggle: setiap run menaikkan `filterRun`, membatalkan seluruh animasi kartu dan membersihkan inline style sebelum pengukuran, menormalisasi target terdahulu melalui `data-filter-visible`, serta menghentikan async run lama setelah `Promise.allSettled` bila token run tidak lagi aktif (`js/main.js:130`, `js/main.js:139`, `js/main.js:199`). Tidak ditemukan jalur stale run yang dapat menimpa input terakhir.
- Memeriksa reduced-motion/no-WAAPI: `reducedMotion.matches || !Element.prototype.animate` mengambil jalur instan yang langsung menerapkan visibility tanpa exit/reflow/enter; CSS menonaktifkan transisi kartu dan tombol pada preferensi reduce (`js/main.js:163`, `css/style.css:641`).
- Menghitung markup 24 kartu: 7 Nglarangan, 12 Kenteng Krajan, 4 Kenteng Wetan, dan 1 Belum terverifikasi. Algoritme Set menghasilkan 19 untuk Nglarangan + Kenteng Krajan dan 0 ketika tidak ada kategori; live count dan empty state diperbarui dari target yang sama (`js/main.js:153`, `js/main.js:162`, `js/main.js:175`).
- Memeriksa lima tombol filter native: seluruhnya `type="button"`, memiliki `aria-controls="umkmGrid"` dan state `aria-pressed`; sinkronisasi Semua mendukung `true`/`mixed`/`false`. Fieldset/legend tetap memberi nama grup, result count tetap `aria-live`, dan kartu tersembunyi menjadi `hidden`, `inert`, `aria-hidden="true"`, serta `tabindex="-1"` (`umkm.html:74`, `umkm.html:95`, `js/main.js:114`, `js/main.js:271`).
- Memeriksa 24 kartu focusable dan 24 pasangan front/back: JS menetapkan role button, label, `aria-controls`, `aria-expanded`, dan sinkronisasi `aria-hidden`; click, Enter, Spasi, Escape, pointer-outside, dan focusout tetap memiliki handler (`js/main.js:32`).
- Memeriksa fallback no-JS: filter memiliki atribut `hidden`, seluruh kartu tidak memiliki `hidden`, dan CSS `:focus` tetap membalik flipper saat kelas `.js` tidak ada (`umkm.html:74`, `css/style.css:590`).
- Memindai delapan halaman HTML: tidak ada referensi lokal atau anchor rusak, ID duplikat, referensi `aria-controls`/`aria-describedby` putus, atau gambar tanpa `alt`. Seluruh halaman tetap memiliki link navbar UMKM dan `sitemap.xml` tetap memuat URL UMKM.
- Memeriksa privasi UMKM: tidak ada nomor telepon, NIK, email pribadi, label alamat lengkap, pendapatan, atau omzet pada direktori; email yang terdeteksi hanya email resmi desa di footer. Seluruh 24 ilustrasi lokal tersedia.
- Menelaah responsivitas secara statis: grid memakai tiga kolom `minmax(0, 1fr)`, menjadi dua pada ≤992 px dan satu pada ≤560 px; filter flex-wrap dan berubah menjadi grid satu kolom pada ≤560 px. Ini sesuai target 1280/768/320, tetapi overflow pixel tidak diukur karena keterbatasan browser.

## Batasan

- Browser in-app/Chromium tidak tersedia pada discovery sesi ini. Sesuai prosedur browser yang berlaku, Litcq tidak menggantinya dengan backend kontrol browser lain; karena itu elapsed aktual exit sekitar 460 ms, rapid-toggle runtime, reduced-motion runtime, flip interaktif, console/page errors, dan `scrollWidth` 320/768/1280 belum dieksekusi ulang oleh Litcq.
- Audit runtime hanya dapat mengandalkan pembacaan kode dan bukti worker pada fingerprint yang sama; pengujian lintas-engine, perangkat sentuh fisik, serta pembaca layar manusia tidak dilakukan.
