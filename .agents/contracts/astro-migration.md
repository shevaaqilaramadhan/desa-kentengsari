# Kontrak Migrasi Astro + React + Tailwind + Motion

- Mode: migrasi besar paralel
- Branch integrasi: `migration/astro-react-motion`
- Base sebelum fondasi: `f75166d271c8b8e2ebf9d7c90df8158bb025d709`
- Checkpoint worker: commit lokal akan dibuat oleh Master setelah Orion menyatakan `FOUNDATION_CHECKPOINT`
- Output produksi: static HTML di `dist/`, `build.format: "file"`, dan URL lama berekstensi `.html`

## Riwayat checkpoint fondasi

Checkpoint fondasi menyediakan dependency, build, layout bersama, design tokens, kontrak data, aset publik, smoke route, dan titik mount React. Placeholder checkpoint telah diganti pada checkpoint Vega dan Nova, lalu digabungkan pada branch integrasi untuk validasi parity final oleh Orion. Source HTML/CSS/JS lama tetap berada di root sebagai baseline non-runtime; Vercel hanya menerbitkan hasil Astro dari `dist/`.

## Kepemilikan file setelah checkpoint

### Orion — shared dan integrasi

- `package.json`, `package-lock.json`
- `astro.config.mjs`, `tsconfig.json`, `vercel.json`
- `.gitignore`, `.vercelignore`, `.github/workflows/**`
- `playwright.config.js`, `tests/**`
- `src/layouts/**`, `src/styles/**`, `src/types/**`, `src/config/**`, `src/data/**`, `src/env.d.ts`
- `public/**`
- Kontrak ini dan laporan Orion
- Integrasi akhir setelah Master menggabungkan checkpoint Vega dan Nova

Vega dan Nova tidak mengubah file di atas. Permintaan perubahan kontrak shared dikembalikan tertulis kepada Master/Orion.

### Vega — halaman dan konten statis

- `src/pages/**`
- `src/components/astro/**`
- `src/content/**`
- Laporan `.agents/reports/vega/latest.md`

Vega mengganti smoke `src/pages/index.astro`, membuat delapan route parity, dan boleh membuat data konten non-UMKM di `src/content/**`. Vega tidak mengubah layout, stylesheet global, schema/type, data UMKM, atau React island.

### Nova — React islands dan motion

- `src/components/react/**`
- File motion yang component-local di bawah `src/components/react/**`
- Laporan `.agents/reports/nova/latest.md`

Nova mengganti stub `UmkmExplorer.tsx` dan membangun interaksi/filter/flip dengan Motion. Nova tidak mengubah page Astro, layout, global stylesheet, data, dependency, atau konfigurasi build.

## Kontrak URL publik

Semua link internal, canonical, sitemap, dan output build mempertahankan delapan URL baseline berikut:

| Route ID | URL publik | Pemilik halaman |
|---|---|---|
| `beranda` | `/index.html` | Vega |
| `profil-desa` | `/profil-desa.html` | Vega |
| `berita` | `/berita.html` | Vega |
| `galeri` | `/galeri.html` | Vega |
| `dusun` | `/dusun.html` | Vega |
| `destinasi` | `/destinasi.html` | Vega |
| `umkm` | `/umkm.html` | Vega, dengan island Nova |
| `kontak` | `/kontak.html` | Vega |

Nama file page Astro harus sama dengan URL, misalnya `src/pages/profil-desa.astro`. `astro.config.mjs` memakai `build.format: "file"` dan Vercel memakai `cleanUrls: false`; jangan membuat route tanpa ekstensi sebagai pengganti.

## Kontrak layout dan route props

Setiap page menggunakan default layout `src/layouts/SiteLayout.astro` dengan props `SiteLayoutProps`:

```astro
<SiteLayout
  title="Judul halaman — Desa Kentengsari"
  description="Deskripsi unik halaman"
  activeRoute="profil-desa"
  canonicalPath="/profil-desa.html"
  skipTarget="#main-content"
>
  <main id="main-content">...</main>
</SiteLayout>
```

- `activeRoute` harus salah satu dari delapan `RouteId`.
- `canonicalPath` wajib berupa URL `.html` yang cocok dengan file page.
- Setiap page memiliki tepat satu `<main>` dan satu heading `<h1>`.
- Header/footer, navigasi mobile, metadata bersama, dan focus baseline berada di layout; worker tidak menduplikasinya.

## Kontrak design system

Tailwind CSS 4 terpasang melalui plugin Vite dan `src/styles/global.css`. Gunakan token `kenteng-*`, bukan warna hijau arbitrer:

- Brand: `kenteng-950`, `kenteng-900`, `kenteng-800`, `kenteng-700`, `kenteng-600`, `kenteng-500`, `kenteng-100`, `kenteng-50`
- Surface/text: `surface-soft`, `ink`, `muted`, `line`
- Radius: `rounded-card` (14px), `rounded-panel` (22px)
- Shadow: `shadow-card`, `shadow-raised`
- Font: `font-sans` (Plus Jakarta Sans dengan system fallback)
- Lebar konten bersama: `w-[min(1120px,calc(100%-2rem))] mx-auto`

Global `prefers-reduced-motion` sudah menetapkan fallback dasar. Nova tetap wajib memakai `useReducedMotion()` pada motion yang material.

## Kontrak canonical 24 UMKM

Sumber tunggal adalah `src/data/umkm.ts`; jumlahnya wajib tepat 24 dan urutan baseline dipertahankan. Worker tidak menyalin data ke file lain.

Schema serializable `UmkmBusiness`:

```ts
interface UmkmBusiness {
  id: string;
  name: string;
  product: string;
  category: string;
  image: `/assets/umkm/${string}.webp`;
  imageAlt: string;
  established: {
    label: 'Berdiri' | 'Lama usaha';
    value: string;
  };
  legalStatus: string;
  location: {
    label: 'Dusun' | 'Lokasi';
    value: string;
    filterKey:
      | 'nglarangan'
      | 'kenteng-krajan'
      | 'kenteng-wetan'
      | 'belum-terverifikasi';
  };
  uncertain?: boolean;
}
```

Invarian baseline: 24 total; 7 `nglarangan`; 12 `kenteng-krajan`; 4 `kenteng-wetan`; 1 `belum-terverifikasi`. Label legalitas adalah data sumber, bukan status aktivitas usaha, dan tidak ditampilkan sebagai checklist.

## Titik integrasi UMKM tanpa file overlap

Nova mempertahankan default export dan props `UmkmExplorerProps` pada `src/components/react/UmkmExplorer.tsx`.

Vega hanya memasang island tersebut di `src/pages/umkm.astro`:

```astro
---
import UmkmExplorer from '../components/react/UmkmExplorer';
import { umkmBusinesses } from '../data/umkm';
---

<UmkmExplorer businesses={umkmBusinesses} client:visible />
```

`initialFilters` bersifat opsional dan, bila tidak diberikan, Nova menampilkan semua empat kelompok. Komponen harus SSR-safe, keyboard/touch accessible, tidak mengakses `window` saat render server, dan menghormati reduced motion.

## Kebijakan aset dan sumber privat

- URL aset publik selalu absolut dari root: `/assets/...`.
- `public/assets/**` hanya berasal dari file aset yang sudah tracked pada checkpoint.
- Runtime produksi bersumber dari `src/**` dan `public/**`, lalu dibangun ke `dist/`. Root `assets/**`, HTML lama, `css/style.css`, dan `js/main.js` bukan input build atau deployment.
- Sumber berikut exact-path ignored dan dilarang masuk `public/` maupun `dist/`:
  - `assets/DATA UMKM GIAT 16 DESA KENTENGSARI - Form Responses 1.pdf`
  - `assets/Panduan Integrasi Desain Card Flip UMKM.md`
  - `assets/umkm-card-redesign/`
  - `assets/umkm-card-redesign.zip`
- Jangan menyalin arsip, PDF sumber, panduan internal, credential, atau file lokal ignored ke source/deployment.

## Handoff dan integrasi

1. Master membuat commit checkpoint lokal dari fondasi ini.
2. Master membuat branch/worktree Vega dan Nova dari commit yang identik.
3. Worker hanya mengubah scope miliknya dan menulis laporan masing-masing.
4. Master membuat checkpoint lokal worker dan menggabungkan secara mekanis ke branch integrasi.
5. Orion melakukan integrasi semantik, parity/regression validation, memasang metadata social card bersama, dan baru kemudian membuat fingerprint final `READY_FOR_AUDIT`.
6. Lyra/Litcq/Xavier hanya memeriksa kandidat final, bukan checkpoint fondasi ini.
