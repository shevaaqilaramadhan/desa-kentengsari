# Litcq Report

- Waktu audit: 2026-08-15T18:57:00+07:00
- Base HEAD: 928aa5ba0bd798b17a90909bdf538b4e1a6da111
- Diff fingerprint: a2c63bcf67189b21356b745c30318e7feaca6dcd86165e676e82b2c7be80b15d
- Scope: `src/pages/profil-desa.astro`, `tests/site-parity.spec.ts`, `tests/umkm.spec.ts`, serta dependency runtime dan referensi yang terdampak
- Status: PASS_WITH_NOTES

## Ringkasan

Audit fungsi teknis dan regresi selesai setelah Orion berstatus `READY_FOR_AUDIT` pada 2026-08-15T18:53:58+07:00. Tidak ditemukan bug yang dapat ditindaklanjuti pada scope perubahan.

## Temuan

Tidak ada temuan.

## Pemeriksaan yang Dilakukan

- Fingerprint resmi `.agents/get-change-fingerprint.ps1`: PASS; Base HEAD dan fingerprint cocok dengan kandidat final, dengan tiga file scope yang sama.
- `npm run check`: PASS; 25 file, 0 error, 0 warning, 0 hint.
- `npm test`: PASS; build Astro menghasilkan 7 halaman dan Playwright lulus 15/15.
- `npx playwright test tests/site-parity.spec.ts`: PASS; 9/9 lulus.
- `git diff --check`: PASS; hanya warning normal line-ending Git, tanpa whitespace error.
- Route/link/SEO: `tests/site-parity.spec.ts:65-156` memverifikasi 7 route, canonical, metadata, navigasi, referensi lokal, sitemap 7 URL, robots, social card, dan tidak adanya route/link/sitemap Berita (`/berita.html`).
- Data Profil Desa: `src/pages/profil-desa.astro:4-23,65-140` memuat data 2025, dua wilayah administratif, tiga sebutan warga, riwayat Krajan, tepat satu item `Drainase & Irigasi`, visi/misi, dan struktur pemerintahan; divalidasi `tests/site-parity.spec.ts:158-190`.
- Gallery asset: `src/pages/profil-desa.astro:19-23,97-103` mereferensikan tiga aset yang tersedia di `public/assets/`, dengan alt text; count gallery diuji pada `tests/site-parity.spec.ts:184-190`.
- No-JS/reduced-motion: fallback konten tetap terlihat melalui reveal opt-in pada `src/pages/profil-desa.astro:146-189`; transition/transform dinonaktifkan pada `:182-189` dan `:659-670`; no-JS diuji `tests/site-parity.spec.ts:192-203`.
- Semantic/ARIA/keyboard: landmark, heading, label, alt, struktur organisasi, gallery close/Escape/backdrop/focus return, mobile navigation, dan validasi referensi ARIA diuji pada `src/pages/profil-desa.astro:27-140` serta `tests/site-parity.spec.ts:98-112,205-227,244-371`.
- Responsive/canonical/overflow: target width seluruh route, profile hero, dan overflow diuji `tests/site-parity.spec.ts:244-262,382-429`; UMKM 1/2/3 kolom tanpa horizontal overflow diuji `tests/umkm.spec.ts:345-359`.
- Observability UMKM: SSR/no-JS, filter count/order/zero-state, exit timing, 3D flip timing/interruption, AX state, keyboard/mouse/touch, reduced motion, dan responsive overflow tercakup `tests/umkm.spec.ts:40-359`; seluruhnya lulus dalam 15/15.

## Batasan

- Percobaan awal `npm test` di sandbox berhenti pada `spawn EPERM` sebelum assertion; pengulangan dengan izin proses tambahan berhasil 15/15. Ini keterbatasan lingkungan audit, bukan kegagalan aplikasi.
- Audit bersifat audit-only; tidak ada source, test, atau report agent lain yang diubah.
