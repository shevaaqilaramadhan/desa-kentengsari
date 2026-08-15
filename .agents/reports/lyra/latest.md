# Lyra Report

- Waktu audit: 2026-08-15T23:47:08.5496798+07:00
- Base HEAD: `58a0293588c54cb380ef67dc03446734208c9b96`
- Diff fingerprint: `f135316ef22f310f2998c5cbba861b7f43225003242395b27671355f376f432d`
- Scope: `src/layouts/SiteLayout.astro`, `src/pages/profil-desa.astro`, `src/styles/global.css`, `tests/site-parity.spec.ts`
- Status: PASS

## Ringkasan

Kandidat final secara visual telah mengikuti struktur dan proporsi utama referensi [Kuta Village](https://www.kutavillage.com/profile-desa): hero penuh viewport, header transparan, blok sejarah putih yang ringkas, kolase landmark, blok Visi/Misi biru muda, bagan organisasi putih, dan footer terang khusus halaman profil. Hierarki sans-serif, warna, whitespace, dan perilaku mobile konsisten dengan arah referensi serta konten Kentengsari.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Menjalankan `.agents/get-change-fingerprint.ps1`; Base HEAD dan fingerprint sama persis dengan kandidat yang diberikan.
- Meninjau markup dan CSS presentasional pada file scope, termasuk selector `.profile-hero`, `.profile-history`, `.profile-landmark`, `.profile-vision`, `.profile-structure`, breakpoint `max-width: 760px`, dan aturan `prefers-reduced-motion`.
- Mengambil screenshot Playwright halaman `/profil-desa` pada 1440×1000, 768×900, dan 390×844.
- Hasil layout: hero 1000px, 900px, dan 844px; tidak ada horizontal overflow pada ketiga breakpoint.
- Desktop: section tersusun sebagai hero → sejarah/statistik → landmark → Visi/Misi → struktur → footer dengan layout dua kolom dan whitespace yang sebanding dengan referensi.
- Mobile: hero tetap penuh viewport; gambar sejarah muncul sebelum teks; kolase, kartu Visi/Misi, bagan organisasi, dan footer tersusun satu kolom tanpa clipping atau wrapping yang merusak hierarchy.
- Memastikan tidak ada elemen lama berbasis rail, endcap, atau editorial ornament pada DOM kandidat.
- Memastikan tidak ada kecocokan mojibake (`â`, `Â`, `�`) pada file visual scope.
- Memastikan scoping visual: `/profil-desa` memakai `profile-route` dan `profile-site-footer`, sementara `/` dan `/kontak` tetap memakai footer global.
- Menjalankan `git diff --check`; tidak ada whitespace error.

## Batasan

- Audit ini visual/design-only; validasi fungsi, route, aksesibilitas fungsional, dan regresi teknis menjadi tanggung jawab Litcq.
- Screenshot referensi dan kandidat dibandingkan secara visual pada breakpoint yang sama; audit tidak menilai kesamaan pixel-per-pixel atau aset yang tidak dimiliki proyek.
