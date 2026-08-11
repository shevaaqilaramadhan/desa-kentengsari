# Orion Implementation Report

- Waktu implementasi: 2026-08-11T21:56:36.8456741+07:00
- Base HEAD: 0321c1ded8a258c99eb30cc97c98ad7507171c20
- Diff fingerprint: 35e3cac46f00d170a28657944e781434e1b3ecb3da642a8ccc0f842fdd615f23
- Permintaan/scope: Menghapus checklist/checkbox dan copy visual status `aktif`/`tidak aktif`/`sebagian aktif` dari filter UMKM; menggantinya dengan lima tombol native ber-state `aria-pressed` untuk Semua, Nglarangan, Kenteng Krajan, Kenteng Wetan, dan Belum terverifikasi, sambil mempertahankan multi-select, sinkronisasi Semua, seluruh hitungan, animasi/filter, aksesibilitas kartu, flip-card, fallback no-JS, reduced-motion, dan responsivitas. Scope kode hanya `umkm.html`, `css/style.css`, dan `js/main.js`.
- Status: READY_FOR_AUDIT

## Ringkasan Perubahan

- Mengganti lima struktur `label` + `input type="checkbox"` menjadi lima `<button type="button">` native di dalam `fieldset`/`legend` yang tetap menjadi grup filter berlabel aksesibel (`umkm.html:90`, `umkm.html:93`).
- Menyampaikan state tombol kepada screen reader dengan `aria-pressed="true"`/`"false"`; tombol Semua memakai `aria-pressed="mixed"` saat hanya sebagian kategori aktif. Tidak ada teks visual status tambahan atau ikon centang.
- Mengganti selector checkbox `:has(input:checked/indeterminate)`, input styling, dan generated state-copy dengan selector `[aria-pressed="true"]`/`[aria-pressed="mixed"]`; state aktif dibedakan melalui weight, elevation, border/background, dan sedikit offset, serta memiliki focus-visible yang jelas (`css/style.css:561`, `css/style.css:571`, `css/style.css:584`).
- Mengubah pembacaan pilihan dan event handler dari `.checked`/`.indeterminate` + `change` menjadi `aria-pressed` + `click`. Tombol kategori toggle independen; Semua true mematikan semua, sedangkan Semua false/mixed mengaktifkan semua (`js/main.js:153`, `js/main.js:271`, `js/main.js:280`).
- Tidak mengubah data/kartu, aset, navigasi, sitemap, pemetaan dusun, stable DOM order, FLIP animation, live count, empty state, atau perilaku flip-card.

## File yang Berubah

- `umkm.html` — lima tombol filter native dan state awal `aria-pressed` (`umkm.html:90`).
- `css/style.css` — styling tombol inactive/active/mixed/focus-visible tanpa selector atau copy checkbox (`css/style.css:561`).
- `js/main.js` — state multi-select berbasis `aria-pressed` serta sinkronisasi tombol Semua (`js/main.js:153`, `js/main.js:271`).

## Validasi

- `node --check js/main.js` — lulus tanpa syntax error.
- `git diff --check` — lulus tanpa whitespace error.
- Pemeriksaan statis markup/selectors — tepat lima tombol filter; nol checkbox/input pada grup filter; seluruh nama dan count awal tersedia; lima state awal `aria-pressed="true"`; tidak ada `:has(input...)`, `input:checked`, `input:indeterminate`, `.checked`, `.indeterminate`, atau copy visual `tidak aktif`/`sebagian aktif`; 24 kartu tetap ada.
- Pemeriksaan statis HTML — tidak ada ID duplikat, seluruh referensi file lokal tersedia, dan ID yang dipakai filter JS tersedia.
- Chromium headless — grup filter dikenali lewat role `group` dan legend; lima tombol dikenali sebagai button; state awal true, partial mixed, empty false, dan kembali-all true sinkron.
- Chromium headless — hitungan hasil terverifikasi: 24 (semua), 7 (Nglarangan), 12 (Kenteng Krajan), 4 (Kenteng Wetan), 1 (Belum terverifikasi), 19 (Nglarangan + Kenteng Krajan), dan 0 (tidak ada kategori); live count dan empty-state sinkron.
- Chromium headless — tombol native berfungsi melalui mouse/touch-equivalent click, keyboard Space dan Enter; active style berbeda bukan hanya melalui warna (font-weight dan shadow berubah); state Semua mixed tidak menambah teks visual.
- Chromium headless — rapid toggle menghasilkan hasil akhir sesuai state terbaru, seluruh animasi kartu selesai/dibatalkan bersih, dan urutan 24 kartu tetap identik setelah filter keluar/masuk.
- Chromium headless — kartu tersembunyi memiliki `inert`, `aria-hidden="true"`, dan `tabindex="-1"`; flip-card click dan Escape tetap sinkron dengan `aria-expanded`.
- Chromium headless — reduced-motion menerapkan perubahan secara instan; no-JS menyembunyikan kontrol dan menampilkan seluruh 24 kartu; tidak ada horizontal overflow pada viewport 320, 768, dan 1280 px.
- `.agents/get-change-fingerprint.ps1` setelah perubahan terakhir — Base HEAD `0321c1ded8a258c99eb30cc97c98ad7507171c20`, fingerprint `35e3cac46f00d170a28657944e781434e1b3ecb3da642a8ccc0f842fdd615f23`, dan hanya tiga file kode di atas masuk calon diff.

## Risiko dan Batasan

- `aria-pressed="mixed"` pada tombol Semua digunakan hanya sebagai state aksesibel saat sebagian kategori aktif; secara visual state ini dibedakan dengan border/elevation tanpa copy tambahan.
- Klasifikasi kartu masih diturunkan dari nilai Dusun/Lokasi yang sudah ada, sama seperti implementasi sebelumnya; tidak ada perubahan data.
- Pengujian browser dilakukan pada Chromium headless lokal; audit visual lintas-engine tetap menjadi kewenangan Lyra, dan audit fungsi independen menjadi kewenangan Litcq.
- Tidak ada laporan auditor, file aset, halaman lain, dependency/configuration, commit, push, atau deployment yang diubah.
