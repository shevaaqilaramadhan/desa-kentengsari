# Lyra Report

- Waktu audit: 2026-08-11T23:25:07+07:00
- Base HEAD: e75c410a801a4715179fc1cdb0799f0bfefc906e
- Diff fingerprint: ab283fc6ebac5dc69e8a960e710acd3822b34dbdc785437101b6f45c2bc82076
- Scope: `css/style.css` dan `js/main.js`; audit visual animasi flip/unflip kartu UMKM, reduced motion, exit filter, keberlanjutan penghapusan paragraf/statistik sebelumnya, serta layout responsif.
- Status: PASS

## Ringkasan

Perubahan menempatkan tambahan durasi pada animasi yang dimaksud pengguna: flip dan unflip kartu kini berlangsung 1 detik dengan kurva yang sama pada kedua arah. Gerak terlihat halus dan natural, tidak snap ketika hover/focus keluar, sementara exit filter kembali singkat pada 180 ms sehingga penyaringan tidak terasa tertahan. Bahasa visual kartu, filter, hierarchy, dan layout responsif tetap konsisten.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menghitung fingerprint resmi sebelum dan sesudah audit; Base HEAD dan fingerprint sama dengan laporan Orion.
- Memeriksa diff kandidat: `.umkm-card__flipper` berubah dari 0,7 detik menjadi 1 detik tanpa perubahan kurva `cubic-bezier(.4, .2, .2, 1)` (`css/style.css:585-589`), sedangkan exit filter kembali ke 180 ms, stagger maksimum 90 ms, dan `ease-in` (`js/main.js:183-196`).
- Menjalankan Microsoft Edge/Chromium headless lokal dan memverifikasi computed transition `1s`. Pada 500 ms kartu masih berada di tengah rotasi; setelah hover keluar selama 120 ms transform juga masih berada di antara 180 dan 0 derajat, lalu berakhir tepat pada sisi depan. Bukti ini menunjukkan flip dan unflip menggunakan interpolasi yang sama dan tidak snap.
- Memeriksa tampilan sisi depan dan belakang pada viewport 1280 px. Border, radius, bayangan, badge, gambar, hierarchy judul/detail, warna hijau, dan keterbacaan tetap konsisten dengan design system.
- Memeriksa viewport 320, 768, dan 1280 px: grid masing-masing 1, 2, dan 3 kolom; seluruh 24 kartu tampil; tidak ada horizontal overflow.
- Memverifikasi `prefers-reduced-motion: reduce` menghasilkan computed duration `0s`/transition `none` pada flipper (`css/style.css:641-645`).
- Memastikan tidak ada perubahan HTML pada kandidat. Paragraf instruksi spesifik yang dihapus pada pekerjaan sebelumnya dan wrapper `.umkm-summary` tetap tidak ada; tiga box statistik tidak muncul pada pemeriksaan visual desktop/mobile.
- Meninjau bukti Orion untuk state click/touch, Enter/Space, Escape, outside/focusout, ARIA, rapid filter toggle, dan no-JS sebagai konteks pendukung; audit Lyra berfokus pada hasil visualnya.
- Menjalankan `git diff --check`; tidak ada error whitespace.

## Batasan

- Audit browser independen dilakukan pada Microsoft Edge berbasis Chromium secara headless; tidak dilakukan perbandingan visual lintas-engine Firefox/Safari.
- Timing exit filter dan sinkronisasi state interaksi merupakan ranah utama Litcq; Lyra menilai dampak visual dan menggunakan bukti Orion sebagai pendukung.
