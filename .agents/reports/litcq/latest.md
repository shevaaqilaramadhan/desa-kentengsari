# Litcq Functional and Regression Audit Report

- Waktu audit: 2026-08-11T22:09:46.8138378+07:00
- Base HEAD: `0321c1ded8a258c99eb30cc97c98ad7507171c20`
- Diff fingerprint: `35e3cac46f00d170a28657944e781434e1b3ecb3da642a8ccc0f842fdd615f23`
- Scope: Penggantian filter checkbox UMKM menjadi lima tombol native pada `umkm.html`, `css/style.css`, dan `js/main.js`; state `aria-pressed`, multi-select/Semua, hitungan dan empty-state, input mouse/touch/keyboard, rapid FLIP, flip-card, hidden accessibility, no-JS, reduced-motion, responsivitas, referensi/ID, privasi, navigasi, dan sitemap.
- Status: PASS

## Ringkasan

Tidak ditemukan bug fungsional atau regresi yang dapat ditindaklanjuti pada fingerprint ini. Chromium headless mengonfirmasi lima tombol native tanpa checkbox atau copy status tambahan, grup filter berlabel, seluruh state `aria-pressed`, hitungan 24/7/12/4/1/19/0, sinkronisasi tombol Semua, operasi mouse/touch/Enter/Spasi, rapid FLIP yang stabil, kartu tersembunyi yang dikeluarkan dari accessibility tree, serta fallback no-JS dan reduced-motion. Tidak ada page error, console error, request gagal, ID duplikat, referensi lokal rusak, atau overflow horizontal pada viewport 320, 768, dan 1280 piksel.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum dan sesudah audit. Base HEAD dan fingerprint cocok dengan scope yang diberikan serta laporan Orion `READY_FOR_AUDIT`; kandidat hanya memuat `css/style.css`, `js/main.js`, dan `umkm.html` karena `.agents/reports/**` dikecualikan oleh script resmi.
- Menjalankan `node --check js/main.js` dan `git diff --check -- css/style.css js/main.js umkm.html`; keduanya lulus tanpa syntax error atau whitespace error.
- Memeriksa markup filter: tepat lima `<button type="button">`, nol `input[type="checkbox"]`, seluruh tombol memiliki `aria-controls="umkmGrid"` dan state awal `aria-pressed="true"`. Chromium mengenali `fieldset`/`legend` sebagai satu role `group` bernama "Saring UMKM berdasarkan dusun" (`umkm.html:90`, `umkm.html:91`, `umkm.html:93`).
- Memastikan copy visual `aktif`, `tidak aktif`, dan `sebagian aktif` serta selector checkbox lama sudah tidak digunakan. Styling state memakai `[aria-pressed="true"]`, `[aria-pressed="mixed"]`, dan `:focus-visible`; tidak tersisa `:has(input...)`, `input:checked`, `input:indeterminate`, `.checked`, `.indeterminate`, atau selector `.umkm-filter__option input` (`css/style.css:561`, `css/style.css:571`, `css/style.css:576`, `css/style.css:584`).
- Menguji keadaan awal dan hitungan kategori di Chromium: Semua 24; Nglarangan 7; Kenteng Krajan 12; Kenteng Wetan 4; Belum terverifikasi 1; Nglarangan + Kenteng Krajan 19; nol kategori 0. Urutan progressive 0 -> 7 -> 19 -> 23 -> 24 juga tepat, dan live result count mengikuti setiap state (`js/main.js:151`, `js/main.js:173`).
- Menguji sinkronisasi tombol Semua: seluruh kategori aktif menghasilkan `true`; sebagian aktif menghasilkan `mixed`; nol kategori menghasilkan `false`; mengaktifkan Semua dari state mixed memulihkan empat kategori dan 24 kartu (`js/main.js:271`, `js/main.js:280`).
- Menguji mouse dan keyboard pada tombol native. Enter mematikan Nglarangan, mengubah Semua menjadi `mixed`, dan menyisakan 17 kartu; Spasi mengaktifkannya kembali, mengubah Semua menjadi `true`, dan memulihkan 24 kartu. Fokus tetap berada pada tombol native. Pengujian touch emulation viewport 320 piksel berhasil menonaktifkan Kenteng Wetan dan menghasilkan 20 kartu.
- Menjalankan 37 toggle kategori cepat tanpa jeda, lalu menunggu seluruh animasi selesai. State terakhir, live count, `dataset.filterVisible`, dan jumlah kartu terlihat sama-sama 7; urutan DOM 24 usaha tetap identik; nol animasi aktif dan nol residu inline `opacity`, `transform`, atau `will-change` (`js/main.js:130`, `js/main.js:149`, `js/main.js:181`).
- Menguji hidden accessibility setelah hanya Nglarangan aktif: tujuh kartu terlihat dan tujuh kartu UMKM tersedia sebagai role button; 17 kartu lain semuanya `hidden`, `inert`, `aria-hidden="true"`, dan `tabindex="-1"` (`js/main.js:114`).
- Menguji flip-card: klik mouse membuka kartu dengan `aria-expanded="true"`, sisi depan `aria-hidden="true"`, dan sisi belakang `aria-hidden="false"`; klik di luar menutupnya. Enter dan Spasi membuka, Escape menutup, serta state tetap sinkron setelah penyaringan (`js/main.js:31`, `js/main.js:70`).
- Menguji `prefers-reduced-motion: reduce`: mematikan Semua langsung menghasilkan 0 kartu dan 0 animasi aktif. CSS juga menonaktifkan transisi tombol dan kartu (`js/main.js:162`, `css/style.css:656`).
- Menguji JavaScript-off: filter tetap tersembunyi, seluruh 24 kartu tetap terlihat/focusable, dan kelas `.js` tidak ditambahkan. Dengan JavaScript aktif, filter tampil melalui progressive enhancement (`umkm.html:90`, `css/style.css:554`).
- Menguji viewport 320, 768, dan 1280 piksel: kelima tombol filter terlihat dan `documentElement.scrollWidth` sama dengan lebar viewport pada ketiganya, sehingga tidak ada overflow horizontal. Menu mobile pada 320 piksel membuka dengan `aria-expanded="true"`, kelas `.open`, dan scroll lock, lalu link Beranda berhasil menavigasi ke `index.html`.
- Memindai seluruh `src`/`href` lokal pada `umkm.html`; semua halaman, stylesheet, script, logo, dan 23 aset WebP yang dirujuk tersedia. Referensi `aria-controls`/`aria-describedby` mengarah ke ID yang tersedia dan Chromium tidak menemukan ID duplikat.
- Memastikan link UMKM tetap tersedia pada navbar/footer seluruh delapan halaman HTML dan `sitemap.xml:9` tetap memuat URL `umkm.html`.
- Memeriksa privasi/deployment: halaman menyatakan informasi kontak dan data operasional pribadi tidak ditampilkan (`umkm.html:59`); satu-satunya email yang terdeteksi adalah email resmi desa di footer (`umkm.html:366`). PDF sumber tetap untracked/ignored melalui exact path di `.gitignore:41` dan dikecualikan dari deployment melalui `.vercelignore:2`; PDF tidak masuk fingerprint.

## Batasan

- Koneksi browser interaktif plugin tidak tersedia, sehingga pengujian UI dijalankan melalui Chromium headless lokal Playwright 1.62.1 pada Windows. Cakupan ini tidak mencakup Firefox, WebKit/Safari, perangkat sentuh fisik, atau pembaca layar manusia.
- Touch diverifikasi melalui emulasi Chromium `hasTouch`; kualitas pelafalan `aria-pressed="mixed"` dan live announcement belum diuji manual dengan kombinasi pembaca layar/peramban tertentu.
