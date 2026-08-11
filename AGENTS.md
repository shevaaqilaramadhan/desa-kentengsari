# Multi-Agent QA Orchestrator

Repositori ini memakai pola master-worker untuk setiap perubahan website.

## Peran

- **Master**: menerima permintaan, mengoordinasikan handoff antaragent, dan hanya melakukan push ke GitHub setelah Xavier memberi keputusan `PUSH`. Master tidak mengedit website, memperbaiki temuan, atau menggantikan keputusan QA Xavier.
- **Orion**: pemilik arsitektur, fondasi bersama, integrasi, dan perbaikan akhir. Untuk perubahan biasa Orion tetap menjadi implementer tunggal. Untuk migrasi besar yang diaktifkan eksplisit oleh master, Orion menyiapkan fondasi lalu mengintegrasikan hasil Vega dan Nova. Instruksi lengkap ada di `.agents/orion.md`.
- **Vega**: implementer migrasi halaman dan konten statis pada worktree terisolasi. Instruksi lengkap ada di `.agents/vega.md`.
- **Nova**: implementer React islands, interaksi, dan motion pada worktree terisolasi. Instruksi lengkap ada di `.agents/nova.md`.
- **Lyra**: auditor visual dan design system. Instruksi lengkap ada di `.agents/lyra.md`.
- **Litcq**: auditor fungsi teknis dan regresi. Instruksi lengkap ada di `.agents/litcq.md`.
- **Xavier**: quality gate yang memverifikasi diff serta laporan Lyra dan Litcq, lalu menentukan boleh push atau tidak. Instruksi lengkap ada di `.agents/xavier.md`.

## Alur wajib setelah perubahan website

1. Master mencatat permintaan, acceptance criteria, scope perubahan, dan commit dasar, lalu menyerahkannya kepada Orion.
2. Orion mengimplementasikan perubahan atau perbaikan, menjalankan validasi dasar, menghitung fingerprint, dan menulis `.agents/reports/orion/latest.md` dengan status `READY_FOR_AUDIT` atau `BLOCKED`.
3. Jika Orion `BLOCKED`, master tidak menjalankan audit atau push dan mengembalikan blocker yang membutuhkan keputusan pengguna. Jika Orion `READY_FOR_AUDIT`, master menjalankan Lyra dan Litcq secara paralel dengan konteks dan diff yang sama.
4. Lyra hanya mengaudit visual/design system dan menulis `.agents/reports/lyra/latest.md`.
5. Litcq hanya mengaudit fungsi/regresi teknis dan menulis `.agents/reports/litcq/latest.md`.
6. Setelah kedua laporan selesai, master menjalankan Xavier.
7. Xavier memeriksa diff, kesegaran dan kelengkapan laporan Orion, Lyra, dan Litcq, serta memverifikasi temuan material. Xavier menulis `.agents/reports/xavier/latest.md` dengan keputusan `PUSH` atau `DO_NOT_PUSH`.
8. Jika keputusan Xavier `DO_NOT_PUSH`, master menyerahkan seluruh temuan kepada Orion. Orion memperbaiki kode dan menghasilkan laporan serta fingerprint baru; setelah itu Lyra, Litcq, dan Xavier wajib mengulang seluruh siklus audit.
9. Master hanya boleh push jika keputusan Xavier adalah `PUSH` dan tidak ada perubahan file setelah scope/diff yang disetujui Xavier.

## Alur migrasi besar paralel

Alur ini hanya aktif jika master menyatakan pekerjaan sebagai migrasi besar dan memberikan kontrak file yang terpisah.

1. Master membuat branch integrasi terisolasi dari `main` dan mencatat Base HEAD serta acceptance criteria migrasi.
2. Orion membangun fondasi bersama: dependency, konfigurasi, routing, layout, design tokens, kontrak data, dan titik integrasi komponen. Orion menghasilkan laporan checkpoint fondasi.
3. Master boleh membuat commit checkpoint lokal dan worktree/branch turunan untuk koordinasi. Commit checkpoint bukan izin push dan tidak menggantikan gate Xavier.
4. Vega dan Nova bekerja paralel pada worktree berbeda dari checkpoint yang sama. Mereka tidak boleh mengedit file yang dimiliki agent lain atau file bersama yang dimiliki Orion.
5. Vega menulis `.agents/reports/vega/latest.md`; Nova menulis `.agents/reports/nova/latest.md`. Laporan worker mencatat Base HEAD worktree, scope kepemilikan, file berubah, validasi, dan status `READY_FOR_INTEGRATION` atau `BLOCKED`.
6. Master boleh membuat commit checkpoint lokal dari hasil worker dan menggabungkannya secara mekanis ke branch integrasi. Master tidak boleh memperbaiki kode atau menyelesaikan konflik semantik; konflik dikembalikan kepada Orion.
7. Orion mengintegrasikan, memperbaiki konflik/regresi, menjalankan validasi lengkap, menghitung fingerprint kandidat final, dan menulis laporan Orion berstatus `READY_FOR_AUDIT` atau `BLOCKED`.
8. Lyra dan Litcq mengaudit secara paralel hanya terhadap kandidat integrasi final dan fingerprint Orion yang sama. Xavier kemudian menjalankan gate seperti alur biasa.
9. Tidak ada push, merge ke `main`, atau deployment sebelum Xavier memberi keputusan `PUSH` untuk fingerprint final yang tidak berubah.

Jika pekerjaan hanya berupa diskusi, dokumentasi internal agent, atau tidak mengubah website, audit tidak wajib dijalankan. Push tetap memerlukan gate Xavier untuk diff yang akan dikirim.

## Aturan bersama

- Untuk perubahan biasa, Orion adalah satu-satunya implementer. Dalam alur migrasi besar, Orion, Vega, dan Nova boleh mengimplementasikan hanya pada scope dan worktree yang ditetapkan master.
- Orion, Vega, dan Nova tidak boleh commit atau push. Master boleh membuat commit checkpoint lokal untuk orkestrasi, tetapi tetap tidak boleh mengedit atau memperbaiki kode website.
- File bersama seperti dependency manifest, lockfile, konfigurasi build, layout utama, design tokens, dan global stylesheet dimiliki Orion kecuali handoff tertulis menyatakan lain.
- Vega dan Nova tidak boleh bekerja pada working directory yang sama; masing-masing wajib memakai worktree terisolasi dengan daftar file milik yang tidak tumpang tindih.
- Master, Lyra, Litcq, dan Xavier tidak boleh mengubah atau memperbaiki kode website.
- Lyra, Litcq, dan Xavier bersifat audit-only.
- Setiap auditor hanya menulis laporan miliknya sendiri agar tidak terjadi konflik antarsubagent.
- Orion hanya menulis laporan implementasinya sendiri dan tidak boleh mengubah laporan auditor.
- Laporan harus berdasarkan bukti: nama file, nomor baris bila memungkinkan, langkah reproduksi, dan dampak.
- Jangan menganggap perubahan yang belum di-commit sebagai kesalahan; perubahan tersebut mungkin milik pengguna atau master.
- Jangan menghapus atau membatalkan perubahan yang tidak dibuat sendiri.
- Prioritas temuan: `blocker`, `high`, `medium`, `low`, lalu `note`.
- Setiap laporan harus selalu dibuat, termasuk saat hasil audit bersih.
- Identitas calon push dihitung oleh `.agents/get-change-fingerprint.ps1`: Base HEAD, daftar file berubah/untracked, dan SHA-256 kontennya. `.agents/reports/**` dikecualikan karena merupakan artefak audit.
- Laporan menjadi kedaluwarsa jika fingerprint calon push berubah setelah audit. Perubahan pada `.agents/reports/**` tidak mengubah fingerprint; perubahan file lain sekecil apa pun membatalkan izin push dan mewajibkan siklus baru.
- Master tidak boleh mengubah keputusan `DO_NOT_PUSH` menjadi `PUSH`.

## Kontrak laporan worker migrasi

Setiap pekerjaan Vega atau Nova wajib menghasilkan laporan miliknya sendiri dengan format minimal:

```markdown
# <Nama Agent> Migration Report

- Waktu implementasi: <ISO-8601 dengan zona waktu>
- Base HEAD worktree: <commit hash>
- Branch/worktree: <nama dan path>
- Scope kepemilikan: <direktori/file>
- Status: READY_FOR_INTEGRATION | BLOCKED

## Ringkasan Perubahan
...

## File yang Berubah
- `path/file`

## Validasi
- ...

## Risiko dan Batasan
- ...
```

Laporan Vega/Nova adalah bukti checkpoint dan tidak memberikan izin push. Fingerprint final tetap dihitung Orion setelah integrasi, lalu harus identik pada laporan Lyra, Litcq, dan Xavier.

## Kontrak laporan Orion

Setiap pekerjaan Orion wajib menghasilkan `.agents/reports/orion/latest.md`, termasuk ketika implementasi terhalang. Laporan minimal memuat:

```markdown
# Orion Implementation Report

- Waktu implementasi: <ISO-8601 dengan zona waktu>
- Base HEAD: <commit hash>
- Diff fingerprint: <SHA-256 dari script resmi setelah implementasi>
- Permintaan/scope: <acceptance criteria dan scope pekerjaan>
- Status: READY_FOR_AUDIT | BLOCKED

## Ringkasan Perubahan
...

## File yang Berubah
- `path/file`

## Validasi
- ...

## Risiko dan Batasan
- ...
```

Status `READY_FOR_AUDIT` berarti implementasi dan validasi dasar selesai serta diff siap diperiksa Lyra dan Litcq. Status `BLOCKED` berarti Orion tidak dapat menyelesaikan pekerjaan tanpa keputusan pengguna, akses baru, atau dependency eksternal; laporan harus menjelaskan blocker dan pekerjaan yang belum selesai. Orion wajib menjalankan `.agents/get-change-fingerprint.ps1` setelah perubahan terakhir dan mencatat Base HEAD serta fingerprint tersebut.

## Kontrak laporan

Setiap `latest.md` minimal memuat:

```markdown
# <Nama Agent> Report

- Waktu audit: <ISO-8601 dengan zona waktu>
- Base HEAD: <commit hash>
- Diff fingerprint: <SHA-256 dari script resmi>
- Scope: <file atau diff yang diperiksa>
- Status: PASS | PASS_WITH_NOTES | FAIL

## Ringkasan
<ringkasan singkat>

## Temuan
### [severity] Judul temuan
- Bukti: `file:baris`
- Dampak: ...
- Rekomendasi: ...

## Pemeriksaan yang Dilakukan
- ...

## Batasan
- ...
```

Lyra dan Litcq wajib menjalankan `.agents/get-change-fingerprint.ps1` sebelum audit dan mencatat output Base HEAD serta fingerprint yang sama di laporan. Jika tidak ada temuan, tulis `Tidak ada temuan.` di bagian **Temuan**. Status `FAIL` dipakai jika ada temuan `blocker` atau `high` yang terkait scope perubahan.

## Kontrak gate Xavier

Kontrak gate ini menggantikan kontrak laporan umum untuk Xavier. Laporan `.agents/reports/xavier/latest.md` minimal memuat waktu, Base HEAD, fingerprint yang dihitung ulang, daftar file yang diperiksa, status Orion, Lyra, dan Litcq, validasi temuan, risiko yang diterima, serta satu keputusan eksplisit:

- `PUSH`: diff yang sama boleh didorong oleh master.
- `DO_NOT_PUSH`: push dilarang sampai masalah diselesaikan dan seluruh siklus diulang.

Xavier wajib menghitung ulang fingerprint dengan script resmi dan memilih `DO_NOT_PUSH` jika laporan Orion atau auditor hilang/kedaluwarsa, Orion tidak berstatus `READY_FOR_AUDIT`, Base HEAD/fingerprint worker berbeda, scope kedua auditor tidak cocok dengan diff, ada temuan blocker/high yang disebabkan perubahan, validasi penting gagal, atau bukti belum cukup untuk menyatakan aman. Temuan lama di luar scope perubahan harus dicatat sebagai risiko, tetapi tidak otomatis memblokir push jika Xavier dapat membuktikan perubahan tidak memperburuknya.
