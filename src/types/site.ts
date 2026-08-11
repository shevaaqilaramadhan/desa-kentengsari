export type RouteId =
  | 'beranda'
  | 'profil-desa'
  | 'berita'
  | 'galeri'
  | 'dusun'
  | 'destinasi'
  | 'umkm'
  | 'kontak';

export interface NavItem {
  id: RouteId;
  label: string;
  href: `/${string}.html`;
}

export interface SiteLayoutProps {
  title: string;
  description: string;
  activeRoute: RouteId;
  canonicalPath: `/${string}.html`;
  skipTarget?: `#${string}`;
}

export type UmkmFilterKey =
  | 'nglarangan'
  | 'kenteng-krajan'
  | 'kenteng-wetan'
  | 'belum-terverifikasi';

export interface UmkmBusiness {
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
    filterKey: UmkmFilterKey;
  };
  uncertain?: boolean;
}

export interface UmkmExplorerProps {
  businesses: readonly UmkmBusiness[];
  initialFilters?: readonly UmkmFilterKey[];
}
