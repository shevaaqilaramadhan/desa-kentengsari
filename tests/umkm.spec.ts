import { expect, test } from '@playwright/test';

const canonicalNames = [
  'Sunarti',
  'Rina Hayati',
  'Siti Anah - Cireng Bu Anah',
  'Muntaha (Fajar Cabe)',
  'Ama Purnawati',
  'Bu Eni (Es Mambo Milky)',
  'Yuni Maisaroh',
  'Bu Wanti (Toko Farel)',
  'Solekah - Laundry Bu Solekah',
  'Wanti (Es Teller Caca)',
  'Rizqi Pelepah Pisang - Latif',
  'Mashun',
  'Dafinia',
  'Siti Bariro (Naufal Catering)',
  'Hanifah (Afifi Catering)',
  'Novita Sari - Warung Titik Temu',
  'Rodiah (Warung Mbak Diyah)',
  'Bu Sofiyah',
  'Septi Setianingrum',
  'Hanafi - Willo',
  'Mujajilun',
  'Lutmiyati',
  'Zainal Abidin',
  'Abrorin (SB Production)',
] as const;

const cardNames = async (page: import('@playwright/test').Page) =>
  page.locator('[data-umkm-face="front"] h3').allTextContents();

const openEnhanced = async (page: import('@playwright/test').Page) => {
  await page.goto('/umkm.html');
  const allFilter = page.getByRole('button', { name: /Semua/ });
  await allFilter.scrollIntoViewIfNeeded();
  await expect(allFilter).toBeEnabled();
};

test('SSR/no-JS keeps 24 businesses and essential details available', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4321',
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const page = await context.newPage();
  await page.goto('/umkm.html');

  await expect(page.locator('[data-umkm-card]')).toHaveCount(24);
  await expect(page.getByRole('button', { name: /Semua/ })).toBeDisabled();
  await expect(page.locator('[data-umkm-face="back"]')).toHaveCount(24);
  await expect(page.getByText('Detail usaha', { exact: true })).toHaveCount(24);
  expect(await cardNames(page)).toEqual(canonicalNames);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await context.close();
});

test('multi-select filters preserve counts, canonical order, zero-state, and 180ms exit', async ({ page }) => {
  await openEnhanced(page);
  const all = page.getByRole('button', { name: /Semua/ });
  const nglarangan = page.getByRole('button', { name: /Nglarangan/ });
  const krajan = page.getByRole('button', { name: /Kenteng Krajan/ });
  const wetan = page.getByRole('button', { name: /Kenteng Wetan/ });
  const uncertain = page.getByRole('button', { name: /Belum terverifikasi/ });
  const result = page.locator('p[role="status"][aria-live="polite"]');

  await expect(all).toContainText('24');
  await expect(nglarangan).toContainText('7');
  await expect(krajan).toContainText('12');
  await expect(wetan).toContainText('4');
  await expect(uncertain).toContainText('1');
  await expect(result).toHaveText('24 usaha ditampilkan');
  expect(await cardNames(page)).toEqual(canonicalNames);

  await page.evaluate(() => {
    const target = '[data-umkm-id="sunarti-sembako"]';
    const startedAt = performance.now();
    (window as typeof window & { __umkmExit?: Promise<number> }).__umkmExit = new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (!document.querySelector(target)) {
          observer.disconnect();
          resolve(performance.now() - startedAt);
        }
      });
      observer.observe(document.getElementById('umkm-grid')!, { childList: true });
    });
  });
  await nglarangan.click();
  await expect(result).toHaveText('17 usaha ditampilkan');
  const exitDuration = await page.evaluate(() =>
    (window as typeof window & { __umkmExit: Promise<number> }).__umkmExit,
  );
  expect(exitDuration).toBeGreaterThanOrEqual(140);
  expect(exitDuration).toBeLessThanOrEqual(420);
  await expect(page.locator('[data-umkm-card]')).toHaveCount(17);

  await all.click();
  await expect(result).toHaveText('24 usaha ditampilkan');
  await all.click();
  await expect(result).toHaveText('0 usaha ditampilkan');
  await expect(page.getByText('Tidak ada usaha yang ditampilkan')).toBeVisible();
  await expect(page.locator('[data-umkm-card]')).toHaveCount(0);

  await krajan.click();
  await expect(result).toHaveText('12 usaha ditampilkan');
  await expect(page.locator('[data-umkm-card]')).toHaveCount(12);
  expect(await cardNames(page)).toEqual(canonicalNames.slice(7, 19));
  await expect(all).toHaveAttribute('aria-pressed', 'mixed');

  await nglarangan.click();
  await wetan.click();
  await nglarangan.click();
  await wetan.click();
  await expect(result).toHaveText('12 usaha ditampilkan');
  await expect(page.locator('[data-umkm-card]')).toHaveCount(12);
  expect(await cardNames(page)).toEqual(canonicalNames.slice(7, 19));

  await expect(page.locator('body')).not.toContainText('Pilih satu atau beberapa dusun untuk menyaring daftar.');
  await expect(page.locator('body')).not.toContainText('24 Usaha terdata');
  await expect(page.locator('body')).not.toContainText('3 Dusun teridentifikasi');
  await expect(page.locator('body')).not.toContainText('6+ Bidang usaha');
});

test('flip and unflip are physical, one-second, interruptible, and synchronize active face AX', async ({ page }, testInfo) => {
  await openEnhanced(page);
  await expect(page.locator('[data-umkm-explorer]')).toHaveAttribute('data-motion-ready', 'true');
  const surface = page.locator('[data-umkm-flip-surface]').first();
  const shell = page.locator('[data-umkm-card-shell]').first();
  const control = page.locator('[data-umkm-flip-control]').first();
  const front = surface.locator('[data-umkm-face="front"]');
  const back = surface.locator('[data-umkm-face="back"]');

  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await expect(front).toHaveAttribute('aria-hidden', 'false');
  await expect(back).toHaveAttribute('aria-hidden', 'true');

  await page.mouse.move(0, 0);
  await surface.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const target = document.querySelector<HTMLElement>('[data-umkm-flip-surface]');
    const light = target?.querySelector<HTMLElement>('[data-umkm-lighting]');
    const cardShell = target?.parentElement;
    if (!target || !light || !cardShell) throw new Error('3D flip instrumentation target is missing');
    const frames: Array<{
      elapsed: number;
      transform: string;
      m11: number;
      m13: number;
      m43: number;
      shadow: string;
      lightOpacity: number;
      transformStyle: string;
    }> = [];
    const instrumentation = window as typeof window & {
      __umkmFlipRecording?: Promise<typeof frames>;
    };
    instrumentation.__umkmFlipRecording = new Promise((resolve, reject) => {
      cardShell.addEventListener('pointerenter', () => {
        const activationObservedAt = performance.now();
        const initialTransform = getComputedStyle(target).transform;
        let motionStartedAt: number | null = null;
        const sample = () => {
          const sampledAt = performance.now();
          const style = getComputedStyle(target);
          const matrix = new DOMMatrixReadOnly(style.transform);
          if (motionStartedAt === null) {
            if (style.transform === initialTransform) {
              if (sampledAt - activationObservedAt >= 500) {
                reject(new Error('The UMKM flip did not start within 500ms of pointerenter'));
                return;
              }
              requestAnimationFrame(sample);
              return;
            }
            // React schedules the Motion effect after pointerenter. Anchor the
            // one-second contract to the first visual change, not scheduler lag.
            motionStartedAt = sampledAt;
          }
          const elapsed = sampledAt - motionStartedAt;
          frames.push({
            elapsed,
            transform: style.transform,
            m11: matrix.m11,
            m13: matrix.m13,
            m43: matrix.m43,
            shadow: style.boxShadow,
            lightOpacity: Number.parseFloat(getComputedStyle(light).opacity),
            transformStyle: style.transformStyle,
          });
          if (elapsed < 1180) requestAnimationFrame(sample);
          else resolve(frames);
        };
        requestAnimationFrame(sample);
      }, { once: true });
    });
  });
  await control.hover();
  const flipStartedAt = Date.now();
  for (const target of [250, 500, 750]) {
    await page.waitForTimeout(Math.max(0, target - (Date.now() - flipStartedAt)));
    await page.screenshot({ path: testInfo.outputPath(`flip-${target}ms.png`), animations: 'allow' });
  }
  const recordedFrames = await page.evaluate(async () => {
    const instrumentation = window as typeof window & { __umkmFlipRecording?: Promise<Array<{
      elapsed: number;
      transform: string;
      m11: number;
      m13: number;
      m43: number;
      shadow: string;
      lightOpacity: number;
      transformStyle: string;
    }>> };
    if (!instrumentation.__umkmFlipRecording) throw new Error('3D flip recording promise was not installed');
    return instrumentation.__umkmFlipRecording;
  });
  expect(recordedFrames.length).toBeGreaterThan(40);
  const settledFrame = recordedFrames.find(({ elapsed, m11 }) => elapsed >= 800 && m11 < -0.999);
  if (!settledFrame) {
    const finalFrame = recordedFrames.at(-1);
    throw new Error(`No settled flip frame was recorded by 1180ms; final frame: ${JSON.stringify(finalFrame)}`);
  }
  const measuredFlipDuration = settledFrame.elapsed;
  expect(measuredFlipDuration).toBeGreaterThanOrEqual(900);
  expect(measuredFlipDuration).toBeLessThanOrEqual(1120);
  const samples = [0.25, 0.5, 0.75].map((phase) => {
    const target = measuredFlipDuration * phase;
    return recordedFrames.reduce((nearest, frame) =>
      Math.abs(frame.elapsed - target) < Math.abs(nearest.elapsed - target) ? frame : nearest,
    );
  });
  const quarter = samples[0]!;
  const midpoint = samples[1]!;
  const threeQuarter = samples[2]!;
  expect(samples.every(({ transform }) => transform.startsWith('matrix3d('))).toBe(true);
  expect(quarter.m11).toBeGreaterThan(midpoint.m11);
  expect(midpoint.m11).toBeGreaterThan(threeQuarter.m11);
  expect(Math.abs(midpoint.m11)).toBeLessThan(0.65);
  expect(Math.abs(midpoint.m13)).toBeGreaterThan(0.8);
  expect(Math.abs(midpoint.m43)).toBeGreaterThan(10);
  expect(midpoint.shadow).not.toBe('none');
  expect(midpoint.lightOpacity).toBeGreaterThan(0.15);
  expect(midpoint.transformStyle).toBe('preserve-3d');
  expect(await shell.evaluate((element) => getComputedStyle(element).perspective)).toBe('1100px');
  for (const face of [front, back]) {
    const faceStyles = await face.evaluate((element) => {
      const style = getComputedStyle(element);
      return { position: style.position, backfaceVisibility: style.backfaceVisibility, transform: style.transform };
    });
    expect(faceStyles.position).toBe('absolute');
    expect(faceStyles.backfaceVisibility).toBe('hidden');
    expect(faceStyles.transform).toMatch(/^matrix3d\(/);
  }

  await expect.poll(async () => {
    const matrix = await surface.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m11);
    return matrix;
  }, { intervals: [16], timeout: 1500 }).toBeLessThan(-0.999);
  await expect(control).toHaveAttribute('aria-expanded', 'true');
  await expect(front).toHaveAttribute('aria-hidden', 'true');
  await expect(back).toHaveAttribute('aria-hidden', 'false');
  await page.screenshot({ path: testInfo.outputPath('flip-settled-back.png'), animations: 'allow' });

  await page.mouse.move(0, 0);
  const unflipStartedAt = Date.now();
  await page.waitForTimeout(500);
  const reverseMidpoint = await surface.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m11);
  expect(Math.abs(reverseMidpoint)).toBeLessThan(0.65);
  await expect.poll(async () =>
    surface.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m11),
  { intervals: [16], timeout: 1500 }).toBeGreaterThan(0.999);
  const unflipDuration = Date.now() - unflipStartedAt;
  expect(unflipDuration).toBeGreaterThanOrEqual(900);
  expect(unflipDuration).toBeLessThanOrEqual(1150);
  await expect(control).toHaveAttribute('aria-expanded', 'false');

  await control.hover();
  await page.waitForTimeout(250);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(80);
  await control.hover();
  await page.waitForTimeout(1100);
  await expect(control).toHaveAttribute('aria-expanded', 'true');
  const settled = await surface.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m11);
  expect(settled).toBeLessThan(-0.999);
});

test('keyboard, mouse click, outside pointer, focusout, and touch operate the card', async ({ page, browser }) => {
  await openEnhanced(page);
  const control = page.locator('[data-umkm-flip-control]').first();

  await page.mouse.move(0, 0);
  await control.click();
  await expect(control).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('heading', { name: 'Daftar UMKM' }).click();
  await expect(control).toHaveAttribute('aria-expanded', 'false');

  const keyboardControl = page.locator('[data-umkm-flip-control]').first();
  await keyboardControl.focus();
  await expect(keyboardControl).toHaveAttribute('aria-expanded', 'true');
  await keyboardControl.press('Enter');
  await expect(keyboardControl).toHaveAttribute('aria-expanded', 'false');
  await keyboardControl.press('Space');
  await expect(keyboardControl).toHaveAttribute('aria-expanded', 'true');
  await keyboardControl.press('Escape');
  await expect(keyboardControl).toHaveAttribute('aria-expanded', 'false');
  await keyboardControl.focus();
  await page.locator('header a').first().focus();
  await expect(keyboardControl).toHaveAttribute('aria-expanded', 'false');

  const touchContext = await browser.newContext({
    baseURL: 'http://127.0.0.1:4321',
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto('/umkm.html');
  const touchControl = touchPage.locator('[data-umkm-flip-control]').first();
  await touchControl.scrollIntoViewIfNeeded();
  await expect(touchControl).toBeEnabled();
  await touchControl.tap();
  await expect(touchControl).toHaveAttribute('aria-expanded', 'true');
  await touchControl.tap();
  await expect(touchControl).toHaveAttribute('aria-expanded', 'false');
  await touchContext.close();
});

test('reduced motion settles flip and filter changes immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openEnhanced(page);
  const surface = page.locator('[data-umkm-flip-surface]').first();
  const control = page.locator('[data-umkm-flip-control]').first();
  await expect(control).toBeEnabled();

  const startedAt = Date.now();
  await control.evaluate((button: HTMLButtonElement) => button.click());
  await expect.poll(() => surface.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m11)).toBeLessThan(-0.98);
  expect(Date.now() - startedAt).toBeLessThan(250);
  await expect(surface.locator('[data-umkm-lighting]')).toHaveCount(0);

  await page.getByRole('button', { name: /Nglarangan/ }).click();
  await expect(page.locator('[data-umkm-card]')).toHaveCount(17, { timeout: 300 });
});

test('UMKM grid uses 1/2/3 columns without horizontal overflow', async ({ page }) => {
  await openEnhanced(page);
  for (const [width, columns] of [[320, 1], [768, 2], [1280, 3]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.reload();
    const allFilter = page.getByRole('button', { name: /Semua/ });
    await allFilter.scrollIntoViewIfNeeded();
    await expect(allFilter).toBeEnabled();
    const columnCount = await page.locator('#umkm-grid').evaluate((grid) =>
      getComputedStyle(grid).gridTemplateColumns.split(' ').length,
    );
    expect(columnCount).toBe(columns);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
