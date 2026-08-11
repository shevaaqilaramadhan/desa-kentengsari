# Website Profil Desa Kentengsari

Website statis resmi Desa Kentengsari, Kecamatan Windusari, Kabupaten Magelang, Jawa Tengah. Struktur dan tata letak mengadaptasi kutavillage.com dengan identitas visual putih bersih dan aksen hijau yang merepresentasikan alam serta pertanian desa.

## Teknologi

HTML5, CSS3, dan JavaScript murni — tanpa framework atau proses build. Cukup buka di browser atau sajikan dengan server statis apa pun.

## Struktur Proyek

```
testing-web-cline/
├── index.html          Beranda (hero, kata sambutan, berita, profil, destinasi)
├── profil-desa.html    Sejarah, statistik, landmark, visi-misi, struktur organisasi
├── berita.html         Berita desa (empty state — siap diisi konten)
├── galeri.html         Galeri foto dengan lightbox
├── dusun.html          5 dusun: Krajan 1/2/3, Kenteng Wetan, Nglarangan
├── destinasi.html      Destinasi wisata + tips berkunjung
├── kontak.html         Info kontak, peta lokasi, formulir kontak
├── css/style.css       Seluruh styling (design system hijau-putih, responsif)
├── js/main.js          Navbar sticky, menu mobile, reveal on scroll, lightbox,
│                       scroll-to-top, formulir kontak (mailto)
├── assets/             Logo dan foto desa (sudah dioptimasi untuk web)
├── robots.txt          Izin crawling mesin pencari
├── sitemap.xml         Peta situs (ganti domain sesuai domain produksi)
└── optimize_assets.py  Skrip kompresi ulang aset gambar (opsional)
```

## Menjalankan Secara Lokal

```powershell
python -m http.server 8000 --directory D:\testing-web-cline
```

Lalu buka `http://localhost:8000`. Alternatif: klik dua kali `index.html` langsung di browser.

## Multi-Agent Orchestrator

Proyek ini memiliki protokol implementasi dan QA master-worker di `AGENTS.md`:

- **Orion** adalah satu-satunya implementer dan bug fixer. Orion menerima permintaan atau temuan `DO_NOT_PUSH`, mengubah kode tanpa commit/push, lalu menulis `.agents/reports/orion/latest.md` berdasarkan `.agents/orion.md`.
- **Lyra** memeriksa visual dan design system berdasarkan `.agents/lyra.md`, lalu menulis `.agents/reports/lyra/latest.md`.
- **Litcq** memeriksa fungsi teknis dan regresi berdasarkan `.agents/litcq.md`, lalu menulis `.agents/reports/litcq/latest.md`.
- **Xavier** memverifikasi diff serta laporan Orion, Lyra, dan Litcq berdasarkan `.agents/xavier.md`, lalu menulis keputusan `PUSH` atau `DO_NOT_PUSH` ke `.agents/reports/xavier/latest.md`.

Lyra, Litcq, dan Xavier bersifat audit-only. Master tidak mengubah website, memperbaiki kode, atau mengambil keputusan QA; master hanya mengoordinasikan siklus dan melakukan push ke GitHub jika Xavier memberi keputusan `PUSH` untuk diff yang masih sama. Jika Xavier memilih `DO_NOT_PUSH`, master mengembalikan temuan kepada Orion, lalu seluruh audit diulang setelah Orion menghasilkan fingerprint baru.

Kesegaran audit diverifikasi dengan fingerprint SHA-256 dari `.agents/get-change-fingerprint.ps1`. Artefak `.agents/reports/**` dikecualikan agar penulisan laporan tidak membatalkan gate; perubahan pada file lain tetap mewajibkan audit ulang.

## Mengoptimasi Ulang Aset Gambar

Jika ada foto baru berukuran besar, jalankan:

```powershell
python optimize_assets.py
```

Membutuhkan Pillow: `python -m pip install Pillow`.

## Catatan Pemeliharaan

- **Berita**: ganti blok `.empty-state` di `berita.html` dan `index.html` dengan kartu berita (kelas `.news-grid` / `.news-card` sudah tersedia di CSS).
- **Struktur organisasi**: nama jabatan masih generik — ganti dengan nama perangkat desa resmi di `profil-desa.html`.
- **Formulir kontak**: memakai `mailto:` agar berfungsi tanpa backend. Untuk pengiriman langsung, integrasikan layanan formulir statis (mis. Formspree) pada atribut `action`.
- **Domain**: perbarui URL pada `sitemap.xml` dan `robots.txt` saat domain produksi ditentukan.
