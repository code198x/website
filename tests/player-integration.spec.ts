// Runs against Playwright's default dev server (astro dev) — the player is
// loaded via a <script> tag (src/lib/load-player.ts), not import(), so no
// A11Y_SWEEP/built-site workaround is needed. Run: npx playwright test tests/player-integration.spec.ts

import { expect, test } from '@playwright/test';

test.describe('system page stage', () => {
  test('loads no player script before Play, then swaps in the player', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', r => requests.push(r.url()));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/sinclair-zx-spectrum/');
    await expect(page.locator('.stage .pf-well img')).toBeVisible();
    expect(requests.some(u => u.includes('/emulators/embed.js'))).toBe(false);
    const width = await page.locator('.stage .pf-well img').evaluate(i => i.getBoundingClientRect().width);
    expect(width % 352).toBe(0);
    await page.getByRole('button', { name: /Play the/ }).click();
    await expect(page.locator('.stage emu198x-player')).toBeAttached();
    expect(requests.some(u => u.includes('/emulators/embed.js'))).toBe(true);
  });

  test('keeps route choice above the fold at 1440×900', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/sinclair-zx-spectrum/');
    const top = await page.locator('#routes').evaluate(h => h.getBoundingClientRect().top);
    expect(top).toBeLessThan(900 + 200);
  });

  test('has no Play button without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/systems/sinclair-zx-spectrum/');
    await expect(page.locator('.stage .pf-well img')).toBeVisible();
    await expect(page.getByRole('button', { name: /Play the/ })).toBeHidden();
    await context.close();
  });
});

test.describe('lesson run panel', () => {
  const c64 = '/systems/commodore-64/assembly/starfield/unit-03/';
  const amiga = '/systems/commodore-amiga/assembly/meet-the-machine/unit-02/';

  test('docks a narrow machine at 1440 and hides the contents list', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'docked');
    await expect(page.locator('.unit-sidebar')).toBeHidden();
  });

  test('overlays a wide machine at 1440, with its screen at 1×', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(amiga);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'overlay');
    const canvas = await page.locator('run-panel emu198x-player').evaluate(async p => {
      for (let i = 0; i < 100 && !p.shadowRoot?.querySelector('canvas'); i++) await new Promise(r => setTimeout(r, 50));
      return p.shadowRoot?.querySelector('canvas')?.getBoundingClientRect().width;
    });
    // Within float error of exactly 768: one machine pixel per CSS pixel.
    expect(Math.abs(canvas! - 768)).toBeLessThan(0.01);
  });

  test('goes fullscreen on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(c64);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'fullscreen');
  });

  test('Esc closes the panel and returns focus to the button', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    const run = page.getByRole('button', { name: 'Run it here' });
    await run.click();
    await page.keyboard.press('Escape');
    await expect(page.locator('run-panel')).toBeHidden();
    await expect(run).toBeFocused();
    await expect(page.locator('.unit-sidebar')).toBeVisible();
  });

  test('a second Run replaces the program rather than adding a player', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    const run = page.getByRole('button', { name: 'Run it here' });
    await run.click();
    await page.locator('.rp-close').click();
    await run.click();
    await expect(page.locator('run-panel emu198x-player')).toHaveCount(1);
  });

  test('never scrolls the page sideways on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of [c64, amiga, '/systems/sinclair-zx-spectrum/', '/systems/commodore-vic-20/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });

  test('the Close button stays fully visible and unobscured on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(c64);
    await page.getByRole('button', { name: 'Run it here' }).click();
    const close = page.locator('.rp-close');
    await expect(close).toBeVisible();
    const box = await close.boundingBox();
    if (!box) throw new Error('Close button has no layout box');
    const hitsClose = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      return el != null && el.closest('.rp-close') !== null;
    }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
    expect(hitsClose).toBe(true);
  });

  test('reopening the same program reuses the existing player element', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    const run = page.getByRole('button', { name: 'Run it here' });
    await run.click();
    await expect(page.locator('run-panel emu198x-player')).toHaveCount(1);
    await page.locator('run-panel emu198x-player').evaluate(el => { (el as HTMLElement).dataset.mark = '1'; });
    await page.locator('.rp-close').click();
    await run.click();
    await expect(page.locator('run-panel emu198x-player')).toHaveCount(1);
    await expect(page.locator('run-panel emu198x-player')).toHaveAttribute('data-mark', '1');
  });

  test('docks a C64 panel at 1150px, hiding the sidebar and keeping prose in the first column', async ({ page }) => {
    await page.setViewportSize({ width: 1150, height: 900 });
    await page.goto(c64);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'docked');
    await expect(page.locator('.unit-sidebar')).toBeHidden();
    const proseLeft = await page.locator('.unit-content').evaluate(el => el.getBoundingClientRect().left);
    const panelLeft = await page.locator('run-panel').evaluate(el => el.getBoundingClientRect().left);
    expect(proseLeft).toBeLessThan(panelLeft);
  });

  test.describe('ARIA roles', () => {
    test('a docked panel is a labelled region, not a dialog', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(c64);
      await page.getByRole('button', { name: 'Run it here' }).click();
      const panel = page.locator('run-panel');
      await expect(panel).toHaveAttribute('data-mode', 'docked');
      await expect(panel).toHaveAttribute('role', 'region');
      await expect(panel).not.toHaveAttribute('aria-modal', 'true');
      await expect(panel).toHaveAttribute('aria-label', /^Run /);
    });

    test('an overlay panel is a modal dialog', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(amiga);
      await page.getByRole('button', { name: 'Run it here' }).click();
      const panel = page.locator('run-panel');
      await expect(panel).toHaveAttribute('data-mode', 'overlay');
      await expect(panel).toHaveAttribute('role', 'dialog');
      await expect(panel).toHaveAttribute('aria-modal', 'true');
      await expect(panel).toHaveAttribute('aria-label', /^Run /);
    });
  });
});

test.describe('the Amiga capture renders at 1x', () => {
  const amiga = '/systems/commodore-amiga/assembly/meet-the-machine/unit-02/';

  test('768px wide at 1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(amiga);
    const width = await page.locator('.runit-capture').evaluate(img => img.getBoundingClientRect().width);
    expect(width).toBe(768);
  });

  test('still 768px wide at 390, without page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(amiga);
    const width = await page.locator('.runit-capture').evaluate(img => img.getBoundingClientRect().width);
    expect(width).toBe(768);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('a failed embed.js load', () => {
  test('shows a status message on the run strip and keeps the panel hidden', async ({ page }) => {
    await page.route('**/emulators/embed.js', route => route.abort());
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/commodore-64/assembly/starfield/unit-03/');
    await page.getByRole('button', { name: 'Run it here' }).click();
    const status = page.locator('.runit-status');
    await expect(status).toBeVisible();
    await expect(status).not.toBeEmpty();
    await expect(page.locator('run-panel')).toBeHidden();
  });

  test('shows a status message on the stage and re-enables Play', async ({ page }) => {
    await page.route('**/emulators/embed.js', route => route.abort());
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/sinclair-zx-spectrum/');
    const play = page.getByRole('button', { name: /Play the/ });
    await play.click();
    const note = page.locator('.stage-note');
    await expect(note).toHaveText(/couldn't load/);
    await expect(play).toBeEnabled();
  });

  test('a second Run after a failed load retries and succeeds', async ({ page }) => {
    let requests = 0;
    await page.route('**/emulators/embed.js*', route => {
      requests += 1;
      if (requests === 1) return route.abort();
      return route.continue();
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/commodore-64/assembly/starfield/unit-03/');
    const run = page.getByRole('button', { name: 'Run it here' });
    await run.click();
    await expect(page.locator('.runit-status')).toBeVisible();
    await run.click();
    await expect(page.locator('run-panel')).toBeVisible();
    await expect(page.locator('run-panel emu198x-player')).toHaveCount(1);
  });

  test('a second Play after a failed load retries and succeeds', async ({ page }) => {
    let requests = 0;
    await page.route('**/emulators/embed.js*', route => {
      requests += 1;
      if (requests === 1) return route.abort();
      return route.continue();
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/sinclair-zx-spectrum/');
    const play = page.getByRole('button', { name: /Play the/ });
    await play.click();
    await expect(page.locator('.stage-note')).toHaveText(/couldn't load/);
    await play.click();
    await expect(page.locator('.stage emu198x-player')).toBeAttached();
  });
});

test.describe('soft navigation (Astro ClientRouter)', () => {
  test('a lesson keeps Run it here working after Next Unit', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // unit-02 itself stages no runnable file, so it shows no strip — the
    // point is that the strip on the page it navigates to still works after
    // a client-side transition, not that this starting page has one.
    await page.goto('/systems/commodore-64/assembly/starfield/unit-02/');
    await page.getByRole('link', { name: 'Next Unit' }).click();
    const run = page.getByRole('button', { name: 'Run it here' });
    await expect(run).toBeVisible();
    await run.click();
    await expect(page.locator('run-panel')).toBeVisible();
  });

  test('a system page reaches the Spectrum stage from the systems index', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/');
    await page.locator('a[href="/systems/sinclair-zx-spectrum"]').first().click();
    await expect(page.getByRole('button', { name: /Play the Spectrum/ })).toBeVisible();
  });

  test('leaves exactly one emu198x-player after one Run click between two strip pages', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/commodore-amiga/assembly/meet-the-machine/unit-01/');
    await page.getByRole('link', { name: 'Next Unit' }).click();
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('emu198x-player')).toHaveCount(1);
  });
});
