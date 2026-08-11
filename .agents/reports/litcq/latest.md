# Litcq Report

- Waktu audit: 2026-08-11T23:21:55+07:00
- Base HEAD: e75c410a801a4715179fc1cdb0799f0bfefc906e
- Diff fingerprint: ab283fc6ebac5dc69e8a960e710acd3822b34dbdc785437101b6f45c2bc82076
- Scope: `css/style.css`, `js/main.js`; regresi terkait `umkm.html` dan laporan implementasi Orion
- Status: PASS_WITH_NOTES

## Ringkasan

Perubahan tepat mengoreksi target durasi: flip dan unflip `.umkm-card__flipper` kini memakai transisi `transform` simetris 1 detik, sedangkan exit filter kembali ke konfigurasi awal 180 ms. Tidak ditemukan bug fungsional atau regresi yang dapat ditindaklanjuti pada diff. Jalur state kartu, keyboard/pointer, ARIA, reduced-motion, pembatalan rapid filter, urutan/kalkulasi jumlah, fallback tanpa JavaScript, referensi lokal, dan breakpoint responsif tetap utuh secara statis. Bukti Chromium Orion juga meliputi seluruh interaksi dan viewport material yang diminta.

## Temuan

### [note] Browser interaktif Litcq tidak tersedia
- Bukti: runtime browser auditor mengembalikan daftar backend kosong (`[]`), sehingga Litcq tidak dapat menjalankan pengujian browser independen pada sesi ini.
- Dampak: computed style, accessibility tree, timing aktual, touch, dan overflow tidak diukur ulang secara independen oleh Litcq.
- Rekomendasi: Xavier dapat memverifikasi bukti Chromium pada `.agents/reports/orion/latest.md`; Orion mencatat computed duration `1s`, unflip tanpa snap, sinkronisasi ARIA untuk seluruh input, exit terukur 180 ms, rapid-toggle last-input-wins, reduced-motion, no-JS, serta viewport 320/768/1280 px tanpa overflow.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1` sebelum audit: Base HEAD dan fingerprint cocok dengan laporan Orion; scope kode hanya `css/style.css` dan `js/main.js`.
- Memeriksa diff: `css/style.css:588` mengubah satu-satunya durasi flipper dari `.7s` menjadi `1s`; karena transition berada pada base rule, arah flip dan unflip memakai durasi/easing yang sama. Selector hover dan state `.is-flipped` tetap mengubah properti `transform` yang sama (`css/style.css:592-596`).
- Memeriksa exit filter: `js/main.js:191-193` kembali ke `duration: 180`, stagger 18 ms maksimal 90 ms, dan `ease-in`; konfigurasi 460 ms tidak lagi ditemukan. Durasi reflow 540 ms dan enter 440 ms tetap tidak berubah.
- Menelusuri kontrol kartu pada `js/main.js:35-84`: click/touch, Enter, Spasi, Escape, outside `pointerdown`, dan `focusout` tetap menuju `setCardExpanded`; fungsi yang sama menyinkronkan `.is-flipped`, `aria-expanded`, dan `aria-hidden` kedua muka kartu.
- Memeriksa aksesibilitas fungsional: 24 kartu tetap memiliki `tabindex="0"`; JavaScript memberi `role="button"`, label, `aria-controls`, dan ID detail unik. Filter tersembunyi memakai `inert`, `tabIndex=-1`, `aria-hidden`, dan `hidden`. Live result count tetap memakai `aria-live="polite"` serta `aria-atomic="true"`.
- Memeriksa reduced-motion: media query `prefers-reduced-motion: reduce` menghapus transition flipper (`css/style.css:641-644`), dan jalur filter menjadi instan ketika media query cocok atau WAAPI tidak tersedia (`js/main.js:163-178`).
- Memeriksa filter FLIP dan rapid toggle secara statis: setiap run membatalkan animasi lama, menaikkan token `filterRun`, mengabaikan completion kedaluwarsa, dan mempertahankan urutan DOM melalui array `cards`. Jumlah sumber cocok: 24 total = 7 Nglarangan + 12 Kenteng Krajan + 4 Kenteng Wetan + 1 belum terverifikasi; kombinasi Nglarangan dan Kenteng Krajan adalah 19.
- Memeriksa fallback no-JS: filter tetap `hidden`; rule `.umkm-card:focus .umkm-card__flipper` tetap membuka detail, sementara override `.js` hanya aktif ketika script berjalan (`css/style.css:590-594`, `js/main.js:4`).
- Memeriksa responsif secara statis: grid 3 kolom default, 2 kolom pada breakpoint tablet, dan 1 kolom pada breakpoint kecil; `minmax(0, 1fr)`, `min-width: 0`, serta `overflow-wrap` tetap tersedia untuk mencegah overflow.
- Menjalankan `node --check js/main.js` dan `git diff --check`; keduanya lulus.
- Memeriksa 33 referensi lokal pada `umkm.html`; semuanya ada. Struktur kartu konsisten: 24 artikel, 24 muka depan, dan 24 muka belakang.
- Memastikan copy instruksi yang diminta, tiga box statistik, selector `.umkm-summary`, dan konfigurasi exit 460 ms tetap tidak ditemukan.
- Membaca bukti validasi Chromium Orion pada `.agents/reports/orion/latest.md`: flip/unflip 1 detik tanpa snap; hover/focus/click/touch/Enter/Spasi/Escape/outside/focusout dan ARIA lulus; exit 180 ms; rapid toggle/count 19; reduced-motion/no-JS; viewport 320/768/1280 tanpa overflow.

## Batasan

- Audit browser independen tidak dapat dijalankan karena tidak ada backend browser yang tersedia pada runtime Litcq. Hasil runtime bergantung pada bukti Chromium Orion dan pemeriksaan statis Litcq.
- Pengujian lintas-engine Firefox/WebKit tidak tersedia.
