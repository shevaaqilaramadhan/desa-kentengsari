# Website Resmi Desa Kentengsari

Website statis Desa Kentengsari dibangun dengan Astro, React islands, Tailwind CSS, Motion, dan TypeScript. Astro menghasilkan delapan URL publik berekstensi `.html` ke `dist/`; Vercel hanya menerbitkan direktori tersebut.

## Prasyarat

- Node.js 22.12 atau lebih baru
- npm (lockfile `package-lock.json` wajib dipakai)

## Menjalankan proyek

```powershell
npm ci
npm run dev
```

Server pengembangan Astro menampilkan URL lokal di terminal. Perintah lain:

```powershell
npm run check    # validasi Astro dan TypeScript
npm run build    # build produksi ke dist/
npm run preview  # pratinjau build produksi
npm test         # build lalu regresi Playwright
```

Gunakan hanya server Astro (`npm run dev`) atau preview hasil build (`npm run build` lalu `npm run preview`) untuk melihat website. Jangan membuka berkas HTML langsung dengan Live Server/static root: source canonical berada di `src/pages/`, sedangkan delapan berkas HTML publik baru dihasilkan ke `dist/` saat build.

Implementasi HTML/CSS/JavaScript sebelum migrasi sengaja tidak dipertahankan sebagai entrypoint kedua di root agar browser tidak memuat UI dan flip-card lama. Baseline tersebut tetap dapat dipulihkan secara penuh dari commit `7a72f2d657c091666ad218b1f91fe2ee2db3c3ed` untuk keperluan audit visual.

Playwright memerlukan browser Chromium lokal. Jika belum tersedia, jalankan `npx playwright install chromium` satu kali.

## Struktur utama

```text
src/pages/              delapan halaman Astro
src/layouts/            layout, navigasi, footer, dan metadata bersama
src/components/astro/   komponen konten statis
src/components/react/   island interaktif UMKM dan Motion
src/data/umkm.ts        sumber canonical 24 UMKM
src/styles/global.css   Tailwind 4 dan design tokens Kentengsari
public/assets/          aset yang diterbitkan apa adanya
tests/                  parity, aksesibilitas, responsif, dan regresi interaksi
dist/                   output build (tidak di-track)
```

URL produksi yang dipertahankan: `/index.html`, `/profil-desa.html`, `/berita.html`, `/galeri.html`, `/dusun.html`, `/destinasi.html`, `/umkm.html`, dan `/kontak.html`.

## Data dan aset

- Aset deploy berada di `public/assets/`; social card berada di `public/og.png`.
- `optimize_assets.py` mengoptimasi foto JPEG/PNG langsung di `public/assets/` dan memerlukan Pillow.
- PDF survei, panduan desain, arsip, dan working source UMKM di root `assets/` bersifat privat. Path tersebut di-ignore secara eksplisit dan tidak boleh disalin ke `public/` atau `dist/`.
- Formulir kontak mempertahankan fallback `mailto:` karena situs tidak memiliki backend.

## Deployment dan QA

`vercel.json` menjalankan `npm run build` dan menerbitkan hanya `dist/` dengan `cleanUrls: false`. Perubahan website mengikuti alur master-worker di `AGENTS.md`: Orion mengintegrasikan, Lyra dan Litcq mengaudit, Xavier memberi gate, lalu hanya Master yang boleh commit/push/deploy setelah keputusan `PUSH` untuk fingerprint yang sama.
