# Product Requirements Document (PRD)
## Website Profil Desa Kentengsari

**Penulis:** Manus AI  
**Tanggal:** 26 Juli 2026  

### 1. Pendahuluan
Dokumen ini merinci kebutuhan produk untuk pembuatan website statis profil Desa Kentengsari, Kecamatan Windusari, Kabupaten Magelang. Website ini dirancang untuk memperkenalkan desa kepada publik, wisatawan, dan masyarakat luas. Struktur, tata letak, dan konsep visual website ini mengadaptasi website kutavillage.com, namun disesuaikan dengan identitas dan karakteristik Desa Kentengsari.

Website ini akan berfokus pada keindahan alam lereng Gunung Sumbing, potensi pertanian yang subur, serta kekompakan masyarakat Desa Kentengsari.

### 2. Tujuan dan Sasaran
- **Tujuan Utama:** Menyediakan informasi resmi, akurat, dan menarik mengenai Desa Kentengsari kepada masyarakat umum.
- **Sasaran:** 
  - Mempromosikan potensi alam dan pertanian Desa Kentengsari.
  - Meningkatkan transparansi dan informasi mengenai profil desa.
  - Menjadi portal informasi sederhana bagi wisatawan yang ingin berkunjung ke lereng Gunung Sumbing.

### 3. Struktur Halaman (Sitemap)
Mengacu pada struktur kutavillage.com, website Desa Kentengsari akan memiliki halaman-halaman berikut:
1. **Beranda (/):** Halaman utama yang menampilkan hero section, kata sambutan, berita terkini, profil singkat, dan destinasi.
2. **Profil Desa (/profile-desa):** Berisi sejarah, visi misi, statistik desa, landmark, dan struktur organisasi.
3. **Berita (/berita):** Menampilkan kegiatan dan pengumuman desa.
4. **Galeri (/galeri):** Kumpulan foto keindahan alam dan kegiatan desa.
5. **Dusun (/dusun):** *Adaptasi dari Banjar.* Berisi informasi mengenai 5 dusun yang ada di Desa Kentengsari.
6. **Destinasi (/destinasi):** Menampilkan tempat-tempat menarik di sekitar desa.
7. **Kontak (/kontak):** Informasi alamat, email, dan nomor telepon Kantor Desa.

### 4. Desain dan Tata Letak (Layout)
Desain akan mengadopsi gaya minimalis, modern, dan bersih dengan dominasi warna putih dan aksen hijau (merepresentasikan alam dan pertanian).

#### 4.1. Halaman Beranda
- **Header:** Sticky navigation bar dengan Logo "Kentengsari" di kiri, menu navigasi di kanan. Background gelap saat di-scroll.
- **Hero Section:** Menggunakan gambar `hero-background.jpg`. Teks putih dengan heading "Jelajahi Keindahan Di Desa Kentengsari", subteks "Rasakan kesejukan udara dan panorama menakjubkan lereng Gunung Sumbing.", serta tombol CTA "Jelajahi".
- **Kata Sambutan:** Layout 2 kolom. Kiri berisi teks sambutan dari Kepala Desa dengan line decoration "Kata Sambutan". Kanan berisi 2 gambar (`kata-sambutan-1.jpg` dan `kata-sambutan-2.jpg`).
- **Berita:** Menampilkan kartu berita (placeholder jika belum ada).
- **Profil Desa:** Layout 2 kolom terbalik. Kiri berisi gambar `profil-desa-image.jpg`. Kanan berisi heading "Perjalanan Dari Desa Kentengsari" dan deskripsi singkat, serta tombol "Baca Lebih Lanjut".
- **Destinasi:** Heading "Temukan destinasi impianmu di Desa Kentengsari" dengan deskripsi singkat.
- **Footer:** Background terang. 4 kolom (Logo, Navigasi, Media Sosial, Kontak Desa).

#### 4.2. Halaman Profil Desa
- **Hero Banner:** Gambar lebar penuh dengan overlay gelap. Heading "Jelajahi Kisah Menakjubkan Desa Kentengsari".
- **Sejarah & Statistik:** Teks sejarah desa dengan kartu statistik (Jumlah Dusun: 5, Populasi: 309).
- **Landmark:** Heading "Landmark Ikonik" dengan gambar `destinasi-image-1.jpg` dan `destinasi-image-2.jpg`.
- **Visi & Misi:** Menampilkan visi dan misi kepala desa.
- **Struktur Organisasi:** Placeholder untuk gambar struktur pemerintahan desa.

### 5. Daftar Aset Visual
Berkas aset visual yang telah disiapkan untuk digunakan pada website (terlampir dalam folder `assets/`):

| Nama File | Deskripsi Penggunaan | Dimensi |
|-----------|----------------------|---------|
| `kentengsari-logo.png` | Logo desa untuk Header dan Footer | 1920x1920 px |
| `hero-background.jpg` | Background utama halaman Beranda | 2560x1440 px |
| `profil-desa-image.jpg` | Gambar pada section Profil Desa di Beranda | 2176x1632 px |
| `kata-sambutan-1.jpg` | Foto Perangkat Desa (Kata Sambutan) | 2176x1632 px |
| `kata-sambutan-2.jpg` | Foto Kegiatan Gotong Royong (Kata Sambutan) | 2176x1632 px |
| `destinasi-image-1.jpg` | Gambar Terasering Padi (Destinasi/Profil) | 2304x1536 px |
| `destinasi-image-2.jpg` | Gambar Petani Bekerja (Destinasi/Profil) | 2304x1536 px |
| `galeri-1.jpg` | Foto Sunrise Gunung Sumbing (Galeri) | 2560x1440 px |
| `galeri-2.jpg` | Foto Hasil Pertanian (Galeri) | 2304x1536 px |
| `galeri-3.jpg` | Foto Sunset Desa (Galeri) | 2560x1440 px |

### 6. Konten Teks (Copywriting)
Berikut adalah draf konten teks untuk beberapa bagian utama:

**Hero Section:**
> Jelajahi Keindahan Di Desa Kentengsari
> Rasakan kesejukan udara dan panorama menakjubkan lereng Gunung Sumbing yang menjadikan desa kami begitu istimewa.

**Kata Sambutan (Sambutan Kepala Desa):**
> Selamat Datang Di Desa Kentengsari
> 
> Assalamu'alaikum Warahmatullahi Wabarakatuh,
> 
> Selamat datang di website resmi Desa Kentengsari, Kecamatan Windusari, Kabupaten Magelang. Desa Kentengsari merupakan desa terkecil di Kecamatan Windusari, namun memiliki kekayaan alam yang luar biasa. Berada di ketinggian 750 mdpl di lereng Gunung Sumbing, tanah kami yang subur memungkinkan masyarakat untuk bertani padi, tembakau, sayuran, dan berbagai komoditas pertanian lainnya.
> 
> Website ini kami hadirkan sebagai media informasi dan komunikasi bagi warga desa maupun masyarakat luar. Kami berharap melalui platform ini, kearifan lokal, suasana asri, dan semangat gotong royong masyarakat Desa Kentengsari dapat lebih dikenal luas.
> 
> Terima kasih atas kunjungan Anda.
> 
> Kepala Desa Kentengsari

**Profil Desa:**
> Perjalanan Dari Desa Kentengsari
> 
> Desa Kentengsari terdiri dari 5 dusun yaitu Dusun Krajan 1, Krajan 2, Krajan 3, Kenteng Wetan, dan Nglarangan. Secara sekilas, suasana dan alamnya yang asri serta masyarakatnya yang ramah akan menyambut Anda. Aktivitas keseharian mayoritas penduduk adalah sebagai petani karena potensi alamnya yang subur. Masyarakat yang sangat guyub rukun dan suka gotong royong menjadikan desa ini tempat yang nyaman dan damai untuk ditinggali.

### 7. Referensi Sumber Data
[1] Wikipedia Indonesia. "Kentengsari, Windusari, Magelang". https://id.wikipedia.org/wiki/Kentengsari,_Windusari,_Magelang
[2] Website Desa Kentengsari (SID Magelang). "Data Dusun". https://desakentengsari.magelangkab.go.id/First/data_dusun
[3] Blog Desa Kentengsari. "Profil Desa Kentengsari". http://kentengsaridesa.blogspot.com/
[4] Wikimedia Commons / YouTube Thumbnails. "Dokumentasi Desa Kentengsari".
