import { expect, test } from '@playwright/test';

const origin = 'https://www.kentengsari.desa.id';
const socialImage = `${origin}/og.png`;

const routes = [
  {
    path: '/index.html',
    title: 'Desa Kentengsari — Website Resmi',
    description: 'Website resmi Desa Kentengsari, Kecamatan Windusari, Kabupaten Magelang. Jelajahi keindahan alam lereng Gunung Sumbing, potensi pertanian, dan masyarakat yang guyub rukun.',
    active: 'Beranda',
    markers: ['Jelajahi Keindahan Di Desa Kentengsari', 'Selamat Datang Di Desa Kentengsari', 'Mengenal Desa Kentengsari', 'Hamparan Sawah Terasering'],
    assets: ['/assets/hero-background.jpg', '/assets/kata-sambutan-1.jpg', '/assets/kata-sambutan-2.jpg', '/assets/profil-desa-image.jpg', '/assets/destinasi-image-1.jpg', '/assets/destinasi-image-2.jpg'],
  },
  {
    path: '/profil-desa.html',
    title: 'Profil Desa — Desa Kentengsari',
    description: 'Profil lengkap Desa Kentengsari: sejarah, kondisi geografis, data kependudukan, visi misi, dan struktur organisasi pemerintahan desa.',
    active: 'Profil Desa',
    markers: ['Dari Kenteng dan Sari Menjadi Kentengsari', 'Kentengsari Dalam Angka', 'Landmark & Sarana Umum', 'Struktur Organisasi'],
    assets: ['/assets/profil-desa-image.jpg'],
  },
  {
    path: '/berita.html',
    title: 'Berita — Desa Kentengsari',
    description: 'Berita dan informasi terbaru seputar kegiatan, pembangunan, dan kehidupan masyarakat Desa Kentengsari, Kecamatan Windusari, Kabupaten Magelang.',
    active: 'Berita',
    markers: ['Berita Desa', 'Informasi & Kegiatan Desa', 'Belum Ada Berita'],
    assets: [],
  },
  {
    path: '/galeri.html',
    title: 'Galeri — Desa Kentengsari',
    description: 'Galeri foto Desa Kentengsari: panorama alam lereng Gunung Sumbing, persawahan, dan kehidupan masyarakat desa.',
    active: 'Galeri',
    markers: ['Momen & Panorama Kentengsari', 'Hamparan Persawahan', 'Gotong Royong Warga'],
    assets: ['/assets/galeri-1.jpg', '/assets/galeri-2.jpg', '/assets/galeri-3.jpg', '/assets/kata-sambutan-2.jpg', '/assets/destinasi-image-1.jpg', '/assets/destinasi-image-2.jpg'],
  },
  {
    path: '/dusun.html',
    title: 'Dusun — Desa Kentengsari',
    description: 'Lima dusun di Desa Kentengsari: Krajan 1, Krajan 2, Krajan 3, Kenteng Wetan, dan Nglarangan — wilayah administrasi dengan 8 RT dan 2 RW.',
    active: 'Dusun',
    markers: ['Dusun Krajan 1', 'Dusun Krajan 2', 'Dusun Krajan 3', 'Dusun Kenteng Wetan', 'Dusun Nglarangan'],
    assets: ['/assets/kata-sambutan-2.jpg'],
  },
  {
    path: '/destinasi.html',
    title: 'Destinasi — Desa Kentengsari',
    description: 'Destinasi dan tempat menarik di Desa Kentengsari: panorama Gunung Sumbing, hamparan sawah terasering, dan kebun tembakau di ketinggian 750 mdpl.',
    active: 'Destinasi',
    markers: ['Pesona Lereng Gunung Sumbing', 'Panorama Gunung Sumbing', 'Kebun Tembakau & Lahan Tani', 'Tips Berkunjung ke Kentengsari'],
    assets: ['/assets/destinasi-image-1.jpg', '/assets/destinasi-image-2.jpg', '/assets/galeri-1.jpg', '/assets/galeri-3.jpg'],
  },
  {
    path: '/umkm.html',
    title: 'UMKM - Desa Kentengsari',
    description: 'Direktori 24 usaha mikro, kecil, dan menengah Desa Kentengsari di bidang kuliner, perdagangan, pertanian, peternakan, kerajinan, dan jasa.',
    active: 'UMKM',
    markers: ['UMKM Desa Kentengsari', 'Tumbuh Bersama Usaha Warga', 'Daftar UMKM', 'Dukung Produk dan Usaha Warga'],
    assets: [],
  },
  {
    path: '/kontak.html',
    title: 'Kontak — Desa Kentengsari',
    description: 'Hubungi Pemerintah Desa Kentengsari, Kecamatan Windusari, Kabupaten Magelang. Alamat kantor desa, email, dan peta lokasi.',
    active: 'Kontak',
    markers: ['Kantor Desa Kentengsari', 'Jam Pelayanan', 'Sampaikan Aspirasi & Pertanyaan Anda', 'Formulir Kontak'],
    assets: [],
  },
] as const;

test('eight legacy routes preserve metadata, navigation, material content, and local references', async ({ page, request }) => {
  for (const route of routes) {
    const response = await page.goto(route.path);
    expect(response?.ok(), route.path).toBeTruthy();
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', route.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${route.path}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${origin}${route.path}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', socialImage);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', socialImage);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

    const navigation = page.getByRole('navigation', { name: 'Navigasi utama' });
    await expect(navigation.getByRole('link')).toHaveCount(8);
    await expect(navigation.getByRole('link', { name: route.active, exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('footer')).toContainText('Hak cipta dilindungi undang-undang.');

    for (const marker of route.markers) await expect(page.getByText(marker, { exact: false }).first()).toBeVisible();

    const imagePaths = await page.locator('img[src]').evaluateAll((images) =>
      images.map((image) => new URL((image as HTMLImageElement).src).pathname),
    );
    for (const asset of route.assets) expect(imagePaths, `${route.path}: ${asset}`).toContain(asset);

    const integrity = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>('[id]')].map((element) => element.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      const invalidAriaReferences: string[] = [];
      for (const element of document.querySelectorAll<HTMLElement>('[aria-controls],[aria-describedby],[aria-labelledby]')) {
        for (const attribute of ['aria-controls', 'aria-describedby', 'aria-labelledby']) {
          for (const id of (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean)) {
            if (!document.getElementById(id)) invalidAriaReferences.push(`${attribute}:${id}`);
          }
        }
      }
      return { duplicateIds, invalidAriaReferences };
    });
    expect(integrity.duplicateIds, route.path).toEqual([]);
    expect(integrity.invalidAriaReferences, route.path).toEqual([]);

    const localReferences = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('[src],[href]')]
        .flatMap((element) => [element.getAttribute('src'), element.getAttribute('href')])
        .filter((value): value is string => Boolean(value?.startsWith('/'))),
    );
    for (const reference of [...new Set(localReferences)]) {
      expect((await request.get(reference)).ok(), `${route.path}: ${reference}`).toBeTruthy();
    }
  }
});

test('sitemap and social card cover the production surface', async ({ page, request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const sitemapText = await sitemap.text();
  for (const route of routes) expect(sitemapText).toContain(`${origin}${route.path}`);

  const imageResponse = await request.get('/og.png');
  expect(imageResponse.ok()).toBeTruthy();
  expect(imageResponse.headers()['content-type']).toContain('image/png');

  await page.goto('/index.html');
  const dimensions = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/og.png';
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  expect(dimensions).toEqual({ width: 1731, height: 909 });
});

test('gallery dialog supports close button, Escape, backdrop, and focus return', async ({ page }) => {
  await page.goto('/galeri.html');
  const triggers = page.locator('[data-lightbox]');
  const dialog = page.locator('[data-gallery-dialog]');
  await expect(triggers).toHaveCount(6);

  await triggers.nth(0).click();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('[data-gallery-image]')).toHaveAttribute('alt', 'Hamparan hijau persawahan Desa Kentengsari');
  await page.locator('[data-gallery-close]').click();
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(triggers.nth(0)).toBeFocused();

  await triggers.nth(1).click();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(triggers.nth(1)).toBeFocused();

  await triggers.nth(2).click();
  await dialog.evaluate((element) => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(triggers.nth(2)).toBeFocused();
});

test('contact form keeps its no-JS mailto fallback and enhanced status', async ({ page }) => {
  await page.goto('/kontak.html');
  const form = page.locator('#contactForm');
  await expect(form).toHaveAttribute('action', 'mailto:pemdeskentengsari@gmail.com');
  await expect(form).toHaveAttribute('method', 'post');
  await expect(form).toHaveAttribute('enctype', 'text/plain');
  await expect(page.locator('iframe[title*="Peta lokasi"]')).toHaveAttribute('src', /maps\.google\.com/);

  await page.getByLabel('Nama Lengkap').fill('Warga Kentengsari');
  await page.getByLabel('Alamat Email').fill('warga@example.com');
  await page.getByLabel('Pesan').fill('Mohon informasi pelayanan desa.');
  await form.evaluate((element) => element.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await expect(page.locator('#formNote')).toContainText('Aplikasi email Anda akan terbuka');
});

test('mobile navigation and every page remain overflow-free at target widths', async ({ page }) => {
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route.path);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }

  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/index.html');
  const toggle = page.locator('[data-nav-toggle]');
  const navigation = page.getByRole('navigation', { name: 'Navigasi utama' });
  await expect(toggle).toBeVisible();
  await expect(navigation).toBeHidden();
  await toggle.click();
  await expect(navigation).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(toggle).toBeFocused();

  await page.setViewportSize({ width: 768, height: 800 });
  await expect(toggle).toBeHidden();
  await expect(navigation).toBeVisible();
});
