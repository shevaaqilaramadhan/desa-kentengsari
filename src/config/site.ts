import type { NavItem } from '../types/site';

export const SITE = {
  name: 'Desa Kentengsari',
  shortName: 'Kentengsari',
  origin: 'https://www.desakentengsari.web.id',
  locale: 'id_ID',
  email: 'pemdeskentengsari@gmail.com',
  address: [
    'Kantor Desa Kentengsari',
    'Kecamatan Windusari',
    'Kabupaten Magelang, Jawa Tengah',
    'Indonesia',
  ],
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'beranda', label: 'Beranda', href: '/index.html' },
  { id: 'profil-desa', label: 'Profil Desa', href: '/profil-desa.html' },
  { id: 'berita', label: 'Berita', href: '/berita.html' },
  { id: 'galeri', label: 'Galeri', href: '/galeri.html' },
  { id: 'dusun', label: 'Dusun', href: '/dusun.html' },
  { id: 'destinasi', label: 'Destinasi', href: '/destinasi.html' },
  { id: 'umkm', label: 'UMKM', href: '/umkm.html' },
  { id: 'kontak', label: 'Kontak', href: '/kontak.html' },
] as const;
