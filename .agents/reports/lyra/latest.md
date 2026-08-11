# Lyra Report

- Waktu audit: 2026-08-11T22:08:19.0907336+07:00
- Base HEAD: `0321c1ded8a258c99eb30cc97c98ad7507171c20`
- Diff fingerprint: `35e3cac46f00d170a28657944e781434e1b3ecb3da642a8ccc0f842fdd615f23`
- Scope: Audit visual/design system perubahan filter UMKM dari checkbox menjadi lima tombol toggle pada `umkm.html`, `css/style.css`, dan `js/main.js`: penghilangan checkbox/checkmark serta copy status aktif, pembeda state aktif/nonaktif/parsial Semua, focus-visible, wrapping desktop/mobile, live count, empty state, dan kerapian reflow kartu.
- Status: PASS

## Ringkasan

Filter UMKM kini tampil sebagai lima tombol pill tanpa checkbox, checkmark, atau suffix teks “aktif/tidak aktif/sebagian aktif”. State aktif memakai hijau solid, state nonaktif memakai permukaan hijau muda/putih dengan border hijau, dan state parsial tombol Semua memakai aksen kuning yang terbaca sebagai state khusus tanpa menyerupai tombol aktif. Komponen tetap konsisten dengan palet, radius, bayangan, tipografi, serta focus ring situs. Render desktop dan mobile memperlihatkan wrapping rapi tanpa overflow; live count, kartu hasil, dan empty state tetap menjaga hierarchy dan spacing yang baik.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum dan setelah audit. Base HEAD serta fingerprint cocok dengan scope yang diberikan: `css/style.css`, `js/main.js`, dan `umkm.html`.
- Membaca diff terhadap Base HEAD. Lima kontrol kini berupa elemen `button` dengan `aria-pressed`, tanpa elemen checkbox pada `umkm.html:93-107`.
- Memeriksa state visual di `css/style.css:561-584`: aktif memakai hijau solid, teks putih, shadow, dan elevasi 1 px; parsial memakai latar kuning muda dan border emas; nonaktif kembali ke permukaan hijau muda dengan border. Tidak ada pseudo-element copy status atau checkmark.
- Render desktop 1440 px menampilkan kelima tombol dalam satu baris dengan tinggi seragam 44 px. Pemeriksaan computed style memastikan `span::after` bernilai `none` pada semua tombol, sehingga copy “Belum terverifikasi aktif” dan suffix status lain tidak muncul.
- Mengubah satu kategori pada runtime menghasilkan tombol Semua ber-state parsial, satu tombol nonaktif, dan kategori lain tetap aktif. Screenshot menunjukkan state parsial Semua terpisah jelas dari hijau aktif dan outline hijau nonaktif tanpa mengganggu hierarchy panel.
- Memeriksa focus-visible melalui navigasi Tab. Tombol Semua memperoleh outline kuning solid 3 px dengan offset 3 px sesuai `css/style.css:584`; ring tampak utuh dan tidak terpotong oleh panel.
- Render mobile 390 px menunjukkan lima tombol menjadi satu kolom penuh melalui `css/style.css:749-752`; seluruh tombol memiliki lebar 316 px, badge jumlah rata kanan, dan panel `scrollWidth` sama dengan `clientWidth` 348 px, sehingga tidak ada overflow horizontal.
- Memeriksa live result count dan reflow visual setelah kategori dinonaktifkan. `js/main.js:139-176` menata ulang visibility serta jumlah hasil; screenshot runtime memperlihatkan count tetap tepat di atas grid dan tiga kolom kartu tetap sejajar tanpa celah kosong.
- Memeriksa empty state setelah seluruh filter dimatikan. Runtime menghasilkan “0 usaha ditampilkan”, menyembunyikan semua kartu, dan menampilkan panel empty state terpusat dengan border dashed, spacing, serta tipografi yang konsisten (`js/main.js:175-176`, `css/style.css:585-592`).
- Memeriksa reduced-motion pada `css/style.css:656-659`; transisi tombol tetap dinonaktifkan ketika preferensi reduced motion aktif.

## Batasan

- Browser terintegrasi tidak tersedia pada sesi ini. Audit runtime dan screenshot dilakukan dengan Chromium headless lokal melalui Playwright pada viewport 1440×1000 dan 390×844.
- Validitas state ARIA, handler keyboard, akurasi logika filter, serta regresi teknis merupakan scope Litcq/Xavier; Lyra menilai hasil visual dan konsistensi design system.
