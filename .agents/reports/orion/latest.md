# Orion Implementation Report

- Waktu implementasi: 2026-08-11T23:18:10+07:00
- Base HEAD: e75c410a801a4715179fc1cdb0799f0bfefc906e
- Diff fingerprint: ab283fc6ebac5dc69e8a960e710acd3822b34dbdc785437101b6f45c2bc82076
- Permintaan/scope: Mengoreksi target perubahan durasi: mengembalikan exit animation filter UMKM ke konfigurasi semula 180 ms dan memperpanjang animasi flip/unflip kartu UMKM menjadi sekitar satu detik. Mempertahankan penghapusan paragraf instruksi dan tiga box statistik dari pekerjaan sebelumnya serta menjaga hover, focus, click/touch, Enter/Space, Escape, outside/focusout, ARIA, reduced-motion, filter FLIP, rapid toggle, no-JS, dan responsive. Scope kode: `css/style.css` dan `js/main.js`.
- Status: READY_FOR_AUDIT

## Ringkasan Perubahan

- Memperpanjang transisi `transform` pada `.umkm-card__flipper` dari 0,7 detik menjadi 1 detik dengan kurva `cubic-bezier(.4, .2, .2, 1)` yang sama (`css/style.css:585-589`). Nilai simetris ini berlaku saat kartu menuju sisi belakang maupun kembali ke depan, termasuk ketika hover atau fokus keluar.
- Memulihkan seluruh konfigurasi exit filter yang sebelumnya tidak sengaja diperlambat: durasi 180 ms, stagger 18 ms maksimal 90 ms, dan easing `ease-in` (`js/main.js:183-196`). Durasi reflow 540 ms dan enter 440 ms tidak diubah.
- Tidak mengubah HTML. Paragraf instruksi direktori dan tiga box statistik yang sudah dihapus tetap tidak ada.

## File yang Berubah

- `css/style.css` - durasi flip/unflip kartu UMKM menjadi 1 detik.
- `js/main.js` - exit filter kembali ke konfigurasi semula 180 ms.

## Validasi

- `node --check js/main.js` - lulus tanpa syntax error.
- `git diff --check` - lulus tanpa whitespace error.
- Pemeriksaan statis - hanya `css/style.css` dan `js/main.js` yang berubah; transisi flipper terdefinisi `1s`; durasi exit WAAPI terdefinisi `180`; nilai 460 ms sudah tidak ada; copy paragraf instruksi dan selector/markup `.umkm-summary` tetap tidak ditemukan.
- Chromium headless - 24 kartu dimuat dan computed `transition-duration` flipper adalah `1s`.
- Chromium headless - hover menyelesaikan flip ke sisi belakang; 120 ms setelah pointer keluar transform masih berada di tengah transisi, lalu kembali tepat ke `none` setelah durasi selesai, sehingga unflip tidak snap.
- Chromium headless - click, outside pointerdown, Enter, Space, Escape, dan focusout mempertahankan sinkronisasi `is-flipped`, `aria-expanded`, serta `aria-hidden` sisi depan/belakang.
- Chromium headless touch context - dua tap berturut-turut menghasilkan state terbuka lalu tertutup secara benar.
- Chromium headless - timing WAAPI exit terukur 180 ms. Rapid toggle filter berakhir sesuai input terakhir dengan 19 kartu untuk kombinasi Nglarangan dan Kenteng Krajan serta live count `19 usaha ditampilkan`.
- Chromium headless - reduced-motion menghasilkan computed transition 0 detik dan state ARIA tetap diperbarui; no-JS tetap menyembunyikan filter dan membalik kartu melalui focus CSS.
- Chromium headless - viewport 320/768/1280 px menghasilkan 1/2/3 kolom tanpa horizontal overflow.
- `.agents/get-change-fingerprint.ps1` setelah perubahan terakhir - Base HEAD `e75c410a801a4715179fc1cdb0799f0bfefc906e`, fingerprint `ab283fc6ebac5dc69e8a960e710acd3822b34dbdc785437101b6f45c2bc82076`.

## Risiko dan Batasan

- Durasi satu detik sengaja berada di batas tengah rentang 0,9-1,1 detik yang diminta; efeknya lebih jelas daripada nilai lama 0,7 detik, tetapi tetap merupakan preferensi gerak yang perlu dinilai secara visual oleh Lyra.
- Pengujian browser dilakukan pada Chromium headless lokal; pemeriksaan visual independen dan lintas-engine tetap menjadi lingkup Lyra/Litcq.
- Tidak ada HTML, data UMKM, aset, navigasi, sitemap, dependency/configuration, laporan auditor, commit, push, atau deployment yang diubah.
