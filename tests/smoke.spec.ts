import { expect, test } from '@playwright/test';

const legacyRoutes = [
  '/index.html',
  '/profil-desa.html',
  '/berita.html',
  '/galeri.html',
  '/dusun.html',
  '/destinasi.html',
  '/umkm.html',
  '/kontak.html',
] as const;

test('all legacy URLs are emitted as static HTML', async ({ page }) => {
  for (const route of legacyRoutes) {
    const response = await page.goto(route);
    expect(response?.ok(), route).toBeTruthy();
    await expect(page).toHaveTitle(/Desa Kentengsari/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('UMKM route renders the serialized React island contract', async ({ page }) => {
  await page.goto('/umkm.html');
  await expect(page.getByText('24 data UMKM')).toBeVisible();
});
