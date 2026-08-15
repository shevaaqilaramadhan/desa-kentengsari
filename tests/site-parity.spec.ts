import { expect, test } from '@playwright/test';

const origin = 'https://www.desakentengsari.web.id';
const socialImage = `${origin}/og.png`;

const routes = [
  {
    path: '/index.html',
    title: 'Desa Kentengsari — Website Resmi',
    description: 'Website resmi Desa Kentengsari, Kecamatan Windusari, Kabupaten Magelang. Temukan profil desa, data penduduk 2025, pembagian wilayah, dan potensi alam lereng Gunung Sumbing.',
    active: 'Beranda',
    markers: ['Jelajahi Keindahan Di Desa Kentengsari', 'Selamat Datang Di Desa Kentengsari', 'Mengenal Desa Kentengsari', 'Hamparan Sawah Terasering'],
    assets: ['/assets/hero-background.jpg', '/assets/kata-sambutan-1.jpg', '/assets/kata-sambutan-2.jpg', '/assets/profil-desa-image.jpg', '/assets/destinasi-image-1.jpg', '/assets/destinasi-image-2.jpg'],
  },
  {
    path: '/profil-desa.html',
    title: 'Profil Desa — Desa Kentengsari',
    description: 'Profil Desa Kentengsari: data penduduk 2025, dua wilayah administratif, tiga sebutan dusun warga, sejarah, dan struktur pemerintahan desa.',
    active: 'Profil Desa',
    markers: ['Jelajahi Kisah Menakjubkan Desa Kentengsari', 'Awal Dari Perjalanan Kami', '2 wilayah administratif', 'Visi & Misi Kita', 'Drainase & Irigasi', 'Struktur Organisasi Desa'],
    assets: ['/assets/profil-desa-image.jpg'],
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
    description: 'Pembagian wilayah Desa Kentengsari: dua wilayah administratif Kentengsari 1 dan Kentengsari 2, serta tiga sebutan dusun warga.',
    active: 'Dusun',
    markers: ['Dua Wilayah Kewilayahan', 'Kentengsari 1', 'Kentengsari 2', 'Tiga Sebutan Dusun', 'Nglarangan', 'Kenteng Wetan', 'Krajan 1, Krajan 2, dan Krajan 3'],
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

test('seven public routes preserve metadata, navigation, material content, and local references', async ({ page, request }) => {
  expect(routes).toHaveLength(7);

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
    await expect(navigation.getByRole('link')).toHaveCount(7);
    await expect(navigation.getByRole('link', { name: 'Berita', exact: true })).toHaveCount(0);
    await expect(navigation.getByRole('link', { name: route.active, exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('footer')).toContainText('Hak cipta dilindungi undang-undang.');

    for (const marker of route.markers) await expect(page.getByText(marker, { exact: false }).first()).toBeVisible();

    const publicText = await page.locator('body').innerText();
    expect(publicText, route.path).not.toMatch(/\bBerita\b/i);
    expect(publicText, route.path).not.toMatch(/\b(?:309|92)\b|lima dusun|8\s*RT|2\s*RW/i);
    expect(await page.content(), route.path).not.toContain('/berita.html');

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
  expect(sitemapText).not.toContain('/berita.html');
  expect(sitemapText.match(/<url>/g)).toHaveLength(7);

  const removedRoute = await request.get('/berita.html');
  expect(removedRoute.ok()).toBe(false);

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(robots.headers()['content-type']).toMatch(/^(?:text\/plain|application\/octet-stream)(?:;|$)/);
  const robotsText = await robots.text();
  expect(robotsText).toContain('User-agent: *');
  expect(robotsText).toContain('Allow: /');
  expect(robotsText).toContain(`Sitemap: ${origin}/sitemap.xml`);

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

test('profile presents official 2025 data and separates administrative, community, and historical names', async ({ page }) => {
  await page.goto('/profil-desa.html');

  const statistics = page.locator('#statistik');
  await expect(statistics.locator('article')).toHaveCount(4);
  for (const value of ['1.201', '626', '575', '390']) {
    await expect(statistics.getByText(value, { exact: true })).toBeVisible();
  }
  for (const label of ['Total Penduduk', 'Pria', 'Wanita', 'Kepala Keluarga']) {
    await expect(statistics.getByRole('heading', { name: label, exact: true })).toBeVisible();
  }

  const territory = page.locator('#wilayah');
  await expect(territory).toContainText('Kentengsari 1');
  await expect(territory).toContainText('Kentengsari 2');
  await expect(territory).toContainText('Nglarangan');
  await expect(territory).toContainText('Kenteng Wetan');
  await expect(territory).toContainText('Krajan 1, Krajan 2, dan Krajan 3');
  const communityNames = territory.getByRole('list', { name: 'Sebutan dusun warga' }).getByRole('listitem');
  await expect(communityNames).toHaveCount(3);
  for (const name of ['Nglarangan', 'Kentengsari', 'Kenteng Wetan']) {
    await expect(communityNames.getByText(name, { exact: true })).toBeVisible();
  }

  const organization = page.getByRole('group', { name: 'Bagan hierarki pemerintahan Desa Kentengsari' });
  for (const role of ['Kepala Desa', 'Sekretaris Desa', 'Kaur & Kasi', 'Kepala Kewilayahan']) {
    await expect(organization.getByRole('heading', { name: role, exact: true })).toBeVisible();
  }
  const landmark = page.locator('#landmark');
  await expect(landmark.locator('[data-profile-landmark-gallery] img')).toHaveCount(3);
  await expect(landmark.getByRole('listitem').filter({ hasText: 'Drainase & Irigasi' })).toBeVisible();
  await expect(page.getByText('Drainase & Irigasi', { exact: true })).toHaveCount(1);
  await expect(page.locator('.profile-rail, .profile-endcap, .profile-hero__cta, .profile-hero__aside')).toHaveCount(0);
});

test('profile content remains visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/profil-desa.html');

  await expect(page.getByText('1.201', { exact: true })).toBeVisible();
  await expect(page.getByText('Struktur Organisasi', { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kepala Desa', exact: true })).toBeVisible();

  await context.close();
});

test('profile sections keep balanced responsive spacing and orderly geometry', async ({ page }) => {
  const viewports = [
    { width: 390, height: 844, padding: { min: 48, max: 64 }, document: { min: 5000, max: 6500 } },
    { width: 768, height: 900, padding: { min: 64, max: 80 }, document: { min: 4000, max: 5400 } },
    { width: 1440, height: 1000, padding: { min: 80, max: 112 }, document: { min: 4400, max: 5300 } },
  ] as const;

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/profil-desa.html');

    const layout = await page.evaluate(() => {
      const selectors = ['.profile-history', '.profile-landmark', '.profile-vision', '.profile-structure'];
      const sections = selectors.map((selector) => {
        const section = document.querySelector<HTMLElement>(selector)!;
        const content = section.querySelector<HTMLElement>(':scope > .profile-container')!;
        const sectionRect = section.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const style = getComputedStyle(section);
        return {
          selector,
          top: sectionRect.top + scrollY,
          bottom: sectionRect.bottom + scrollY,
          height: sectionRect.height,
          contentHeight: contentRect.height,
          paddingTop: Number.parseFloat(style.paddingTop),
          paddingBottom: Number.parseFloat(style.paddingBottom),
          minHeight: Number.parseFloat(style.minHeight) || 0,
        };
      });

      const boxes = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)].map((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top + scrollY, bottom: rect.bottom + scrollY, left: rect.left, width: rect.width };
      });

      return {
        heroHeight: document.querySelector<HTMLElement>('.profile-hero')!.getBoundingClientRect().height,
        documentHeight: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth - innerWidth,
        sections,
        visionCards: boxes('.profile-vision__card'),
        organizationNodes: boxes('.profile-org__branches > article'),
        collage: boxes('.profile-landmark__image'),
      };
    });

    expect(Math.abs(layout.heroHeight - viewport.height), `${viewport.width}px hero`).toBeLessThanOrEqual(2);
    expect(layout.overflow, `${viewport.width}px horizontal overflow`).toBeLessThanOrEqual(0);
    expect(layout.documentHeight, `${viewport.width}px document height`).toBeGreaterThanOrEqual(viewport.document.min);
    expect(layout.documentHeight, `${viewport.width}px document height`).toBeLessThanOrEqual(viewport.document.max);

    for (const section of layout.sections) {
      expect(section.minHeight, `${viewport.width}px ${section.selector} forced min-height`).toBe(0);
      expect(section.paddingTop, `${viewport.width}px ${section.selector} top padding`).toBeGreaterThanOrEqual(viewport.padding.min);
      expect(section.paddingTop, `${viewport.width}px ${section.selector} top padding`).toBeLessThanOrEqual(viewport.padding.max);
      expect(section.paddingBottom, `${viewport.width}px ${section.selector} bottom padding`).toBeGreaterThanOrEqual(viewport.padding.min);
      expect(section.paddingBottom, `${viewport.width}px ${section.selector} bottom padding`).toBeLessThanOrEqual(viewport.padding.max);
      expect(section.height / section.contentHeight, `${viewport.width}px ${section.selector} whitespace ratio`).toBeLessThan(1.5);
    }

    for (let index = 1; index < layout.sections.length; index += 1) {
      const gap = layout.sections[index]!.top - layout.sections[index - 1]!.bottom;
      expect(Math.abs(gap), `${viewport.width}px section continuity`).toBeLessThanOrEqual(2);
    }

    if (viewport.width > 760) {
      expect(Math.abs(layout.visionCards[0]!.top - layout.visionCards[1]!.top), `${viewport.width}px vision card rows`).toBeLessThanOrEqual(2);
      expect(Math.abs(layout.visionCards[0]!.bottom - layout.visionCards[1]!.bottom), `${viewport.width}px equal-height vision cards`).toBeLessThanOrEqual(2);
      const organizationTops = layout.organizationNodes.map(({ top }) => Math.round(top));
      const organizationBottoms = layout.organizationNodes.map(({ bottom }) => Math.round(bottom));
      expect(new Set(organizationTops).size, `${viewport.width}px organization row alignment`).toBe(1);
      expect(new Set(organizationBottoms).size, `${viewport.width}px equal-height organization nodes`).toBe(1);
    } else {
      const cardWidths = layout.visionCards.map(({ width }) => Math.round(width));
      const nodeWidths = layout.organizationNodes.map(({ width }) => Math.round(width));
      expect(new Set(cardWidths).size, 'mobile vision card widths').toBe(1);
      expect(new Set(nodeWidths).size, 'mobile organization node widths').toBe(1);
    }

    expect(layout.collage).toHaveLength(3);
    expect(layout.collage.every(({ width }) => width > 0)).toBe(true);
  }

  const breakpointPadding = [];
  for (const width of [1023, 1024, 1025]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/profil-desa.html');
    breakpointPadding.push(await page.evaluate(() => {
      const selectors = ['.profile-history', '.profile-landmark', '.profile-vision', '.profile-structure'];
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        values: Object.fromEntries(selectors.map((selector) => {
          const section = document.querySelector<HTMLElement>(selector)!;
          return [selector, {
            height: section.getBoundingClientRect().height,
            padding: Number.parseFloat(getComputedStyle(section).paddingTop),
          }];
        })),
      };
    }));
  }

  for (const result of breakpointPadding) expect(result.overflow, '1024px breakpoint overflow').toBeLessThanOrEqual(0);
  for (const selector of ['.profile-history', '.profile-landmark', '.profile-vision', '.profile-structure']) {
    const padding = breakpointPadding.map((result) => result.values[selector]!.padding);
    const height = breakpointPadding.map((result) => result.values[selector]!.height);
    expect(Math.max(...padding) - Math.min(...padding), `${selector} padding must transition smoothly at 1024px`).toBeLessThanOrEqual(1);
    expect(Math.max(...height) - Math.min(...height), `${selector} geometry must transition smoothly at 1024px`).toBeLessThanOrEqual(4);
  }
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

test('mobile navigation and every page remain overflow-free at target widths', async ({ page, browser }) => {
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
  const menuIconState = () => toggle.evaluate((button) => {
    const line = (name: string) => button.querySelector<SVGPathElement>(`[data-menu-icon-line="${name}"]`)!;
    return {
      topTransform: getComputedStyle(line('top')).transform,
      middleOpacity: getComputedStyle(line('middle')).opacity,
      bottomTransform: getComputedStyle(line('bottom')).transform,
    };
  });
  await expect(toggle).toBeVisible();
  await expect(navigation).toBeHidden();
  await expect(toggle).toHaveAccessibleName('Buka menu navigasi');
  expect(await menuIconState()).toEqual({
    topTransform: 'none',
    middleOpacity: '1',
    bottomTransform: 'none',
  });
  await toggle.click();
  await expect(navigation).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Tutup menu navigasi');
  await expect.poll(async () => (await menuIconState()).middleOpacity).toBe('0');
  const openIcon = await menuIconState();
  expect(openIcon.topTransform).not.toBe('none');
  expect(openIcon.bottomTransform).not.toBe('none');
  expect(openIcon.topTransform).not.toBe(openIcon.bottomTransform);
  const mobileMenuGeometry = await navigation.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      position: getComputedStyle(element).position,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      bodyOverflow: getComputedStyle(document.body).overflow,
    };
  });
  expect(mobileMenuGeometry).toEqual({
    position: 'fixed',
    width: 320,
    height: 800,
    bodyOverflow: 'hidden',
  });

  // The visible close toggle must stay above the fullscreen overlay for pointer users.
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Buka menu navigasi');
  await expect(navigation).toBeHidden();
  await expect.poll(async () => (await menuIconState()).middleOpacity).toBe('1');
  expect(await menuIconState()).toEqual({
    topTransform: 'none',
    middleOpacity: '1',
    bottomTransform: 'none',
  });
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');

  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(toggle).toBeFocused();

  // A real pointer press on the empty overlay backdrop also dismisses safely.
  await toggle.click();
  await navigation.click({ position: { x: 10, y: 700 } });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();
  await expect(toggle).toBeFocused();

  await page.setViewportSize({ width: 768, height: 800 });
  await expect(toggle).toBeVisible();
  await expect(navigation).toBeHidden();
  await toggle.click();
  await expect(navigation).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Tutup menu navigasi');
  await expect.poll(async () => (await menuIconState()).middleOpacity).toBe('0');
  const tabletMenuGeometry = await navigation.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  });
  expect(tabletMenuGeometry).toEqual({ width: 768, height: 800 });

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Buka menu navigasi');
  await expect.poll(async () => (await menuIconState()).middleOpacity).toBe('1');
  expect((await menuIconState()).topTransform).toBe('none');
  expect((await menuIconState()).bottomTransform).toBe('none');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  // Crossing the 861px desktop breakpoint closes state and releases scroll lock.
  await page.setViewportSize({ width: 861, height: 800 });
  await expect(toggle).toBeHidden();
  await expect(navigation).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  await page.setViewportSize({ width: 768, height: 800 });
  await expect(toggle).toBeVisible();
  await expect(navigation).toBeHidden();

  // Touch must be able to tap the same visible toggle to open and close.
  const touchContext = await browser.newContext({
    baseURL: 'http://127.0.0.1:4321',
    hasTouch: true,
    viewport: { width: 320, height: 800 },
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto('/index.html');
  const touchToggle = touchPage.locator('[data-nav-toggle]');
  const touchNavigation = touchPage.getByRole('navigation', { name: 'Navigasi utama' });
  await touchToggle.tap();
  await expect(touchToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(touchNavigation).toBeVisible();
  await expect.poll(() => touchPage.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
  await touchToggle.tap();
  await expect(touchToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(touchNavigation).toBeHidden();
  await expect.poll(() => touchPage.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  await touchContext.close();
});

test('published surface does not expose the removed legacy CSS or JavaScript entrypoint', async ({ request }) => {
  expect((await request.get('/css/style.css')).ok()).toBe(false);
  expect((await request.get('/js/main.js')).ok()).toBe(false);
});

test('pre-migration visual hierarchy is retained by the shared header, photographic heroes, and CTA', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/index.html');

  const header = page.locator('[data-site-header]');
  const homeHero = page.locator('[data-home-hero]');
  await expect(header).toHaveAttribute('data-scrolled', 'false');
  const initialHeader = await header.evaluate((element) => {
    const style = getComputedStyle(element);
    return { position: style.position, color: style.color, background: style.backgroundColor };
  });
  expect(initialHeader.position).toBe('fixed');
  expect(initialHeader.color).toBe('rgb(255, 255, 255)');
  expect(initialHeader.background).toBe('rgba(0, 0, 0, 0)');
  expect(await homeHero.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBeGreaterThanOrEqual(898);
  await expect(homeHero.locator('img[src="/assets/hero-background.jpg"]')).toHaveCount(1);
  await expect(page.locator('[data-call-to-action] img[src="/assets/hero-background.jpg"]')).toHaveCount(1);

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(header).toHaveAttribute('data-scrolled', 'true');
  await expect.poll(() => header.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');

  for (const [width, expectedMinimum, expectedMaximum] of [
    [320, 460, 470],
    [768, 380, 390],
    [1280, 380, 390],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes.filter(({ path }) => path !== '/index.html')) {
      await page.goto(route.path);
      const hero = page.locator('[data-page-hero]');
      const height = await hero.evaluate((element) => Math.round(element.getBoundingClientRect().height));
      if (route.path === '/profil-desa.html') {
        expect(height, `${width}px ${route.path}: profile hero must match the viewport`).toBe(900);
      } else {
        expect(height, `${width}px ${route.path}`).toBeGreaterThanOrEqual(expectedMinimum);
        expect(height, `${width}px ${route.path}`).toBeLessThanOrEqual(expectedMaximum);
      }
      await expect(hero.locator('img[src="/assets/hero-background.jpg"]')).toHaveCount(1);
      const alignment = await hero.evaluate((element) => getComputedStyle(element).textAlign);
      const expectedAlignment = route.path === '/profil-desa.html' ? 'left' : 'center';
      expect(alignment, `${width}px ${route.path}: unexpected page-hero text alignment`).toBe(expectedAlignment);
    }
  }
});
