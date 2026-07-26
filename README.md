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
