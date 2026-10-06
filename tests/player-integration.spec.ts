// Runs against Playwright's default dev server (astro dev) — the player is
// loaded via a <script> tag (src/lib/load-player.ts), not import(), so no
// A11Y_SWEEP/built-site workaround is needed. Run: npx playwright test tests/player-integration.spec.ts

import { expect, test, type Page } from '@playwright/test';

/**
 * Follows a link by ClientRouter soft navigation and waits for the new page's
 * astro:page-load. Without the wait, a locator can still match the old page's
 * Run button while the new page is being fetched.
 */
async function softNavigate(page: Page, linkName: string) {
  await page.evaluate(() => document.addEventListener('astro:page-load', () => { document.documentElement.dataset.softLoaded = 'true'; }, { once: true }));
  await page.getByRole('link', { name: linkName }).click();
  await page.waitForFunction(() => document.documentElement.dataset.softLoaded === 'true');
}

test.describe('system page modal', () => {
  test('loads the shared player only when requested and preserves the session on return', async ({page}) => {
    const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
    await page.goto('/systems/sinclair-zx-spectrum/');
    expect(requests.some(url=>url.includes('/emulators/embed.js'))).toBe(false);
    const play=page.getByRole('button',{name:/Play the/});await play.click();
    const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
    await expect(dialog.locator('emu198x-player')).toHaveAttribute('system','sinclair-zx-spectrum');
    expect(requests.some(url=>url.includes('/emulators/embed.js'))).toBe(true);
    await dialog.locator('emu198x-player').evaluate(el=>(el as HTMLElement).dataset.mark='same-session');
    await page.locator('.rp-close').click();await expect(dialog).toBeHidden();await expect(play).toBeFocused();
    await play.click();await expect(dialog.locator('emu198x-player')).toHaveAttribute('data-mark','same-session');
  });
  test('keeps language choices linked to their own routes',async({page})=>{
    await page.goto('/systems/sinclair-zx-spectrum/');
    const routes=page.getByLabel('Language routes');await expect(routes).toBeVisible();
    for(const link of await routes.locator('a').all())expect(await link.getAttribute('href')).toMatch(/^\/systems\/sinclair-zx-spectrum\//);
  });
  test('does not offer an inert Play button without JavaScript',async({browser})=>{
    const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
    await page.goto('/systems/sinclair-zx-spectrum/');await expect(page.getByRole('button',{name:/Play the/})).toBeHidden();await context.close();
  });
});

test.describe('lesson run panel', () => {
  const c64 = '/systems/commodore-64/assembly/starfield/unit-03/';
  const amiga = '/systems/commodore-amiga/assembly/meet-the-machine/unit-02/';

  test('opens a narrow machine in a modal without rearranging the lesson', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'modal');
    await expect(page.locator('.unit-layout')).not.toHaveClass(/is-docked/);
  });

  test('opens a wide machine in a modal, with its screen at 1×', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(amiga);
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'modal');
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
    // Esc while the player is still loading has nothing to close yet.
    await expect(page.locator('.rp-close')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('.rp-dialog')).toBeHidden();
    await expect(run).toBeFocused();
    await expect(page.locator('.unit-sidebar')).toBeVisible();
  });

  test('a second Run replaces the program rather than adding a player', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(c64);
    const run = page.getByRole('button', { name: 'Run it here' });
    await run.click();
    await expect(page.locator('run-panel emu198x-player')).toHaveCount(1);
    await page.locator('run-panel emu198x-player').evaluate(el => { (el as HTMLElement).dataset.mark = '1'; });
    await page.locator('.rp-close').click();
    // No lesson has two strips, so make a second one: a copy of the button
    // pointing at another staged C64 program, bound the way a page load binds it.
    await page.evaluate(() => {
      const original = document.querySelector<HTMLButtonElement>('.runit-button')!;
      const copy = original.cloneNode(true) as HTMLButtonElement;
      delete copy.dataset.runitBound;
      copy.classList.add('second-run');
      copy.dataset.runSrc = '/code-samples/commodore-64/assembly/meet-the-machine/unit-01/border.prg';
      copy.dataset.runTitle = 'border.prg';
      original.after(copy);
      document.dispatchEvent(new Event('astro:page-load'));
    });
    await page.locator('.second-run').click();
    const player = page.locator('run-panel emu198x-player');
    await expect(player).toHaveCount(1);
    await expect(player).toHaveAttribute('src', /border\.prg$/);
    await expect(player).not.toHaveAttribute('data-mark', '1');
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

  for(const width of [1440,1150,390])test(`protects focus in a native modal at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});await page.goto(c64);
    const run=page.getByRole('button',{name:'Run it here'});await run.click();
    const dialog=page.getByRole('dialog',{name:/Run /});await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(el=>el.matches(':modal'))).toBe(true);
    for(let i=0;i<16;i++){
      await page.keyboard.press('Tab');
      // Native dialogs may hand Tab to browser chrome. That is different
      // from focusing the inert lesson underneath the modal.
      expect(await page.evaluate(()=>!document.hasFocus() || document.activeElement?.closest('dialog')!==null)).toBe(true);
    }
    await run.evaluate(element=>element.focus());
    await expect(run).not.toBeFocused();
    await page.locator('.rp-close').click();await expect(dialog).toBeHidden();await expect(run).toBeFocused();
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

  test('shrinks the entire capture only when the viewport is narrower', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(amiga);
    const width = await page.locator('.runit-capture').evaluate(img => img.getBoundingClientRect().width);
    expect(width).toBe(390);
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
    await expect(page.locator('.rp-dialog')).toBeHidden();
  });

  test('shows a status message on the stage and re-enables Play', async ({ page }) => {
    await page.route('**/emulators/embed.js', route => route.abort());
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/sinclair-zx-spectrum/');
    const play = page.getByRole('button', { name: /Play the/ });
    await expect(page.locator('.system-launcher .runit-status')).toHaveAttribute('role', 'status');
    await play.click();
    await expect(page.locator('.system-launcher .runit-status')).toHaveText(/couldn't load/);
    await expect(play).toBeEnabled();
    await expect(play).not.toHaveAttribute('aria-busy', 'true');
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
    await expect(page.locator('.rp-dialog')).toBeVisible();
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
    await expect(page.locator('.system-launcher .runit-status')).toHaveText(/couldn't load/);
    await play.click();
    await expect(page.locator('run-panel emu198x-player')).toBeAttached();
  });
});

test.describe('soft navigation (Astro ClientRouter)', () => {
  test('a lesson keeps Run it here working after Next Unit', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // The point is that the strip on the page it navigates to still works
    // after a client-side transition.
    await page.goto('/systems/commodore-64/assembly/starfield/unit-02/');
    await softNavigate(page, 'Next Unit');
    const run = page.getByRole('button', { name: 'Run it here' });
    await expect(run).toBeVisible();
    await run.click();
    await expect(page.locator('.rp-dialog')).toBeVisible();
  });

  test('re-measures the breadcrumb bar after Next Unit, so it never covers Close', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/systems/commodore-64/assembly/starfield/unit-02/');
    await softNavigate(page, 'Next Unit');
    const run = page.getByRole('button', { name: 'Run it here' });
    await expect(run).toBeVisible();
    const bar = await page.locator('.breadcrumbs').evaluate(b => (b as HTMLElement).offsetHeight);
    const crumbs = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--crumbs-height'));
    expect(crumbs).toBe(`${bar}px`);
    await run.click();
    await expect(page.locator('run-panel')).toHaveAttribute('data-mode', 'modal');
    await page.evaluate(() => scrollTo(0, 3000));
    const close = page.locator('.rp-close');
    await expect(close).toBeVisible();
    const box = await close.boundingBox();
    if (!box) throw new Error('Close button has no layout box');
    const hitsClose = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('.rp-close') != null,
      { x: box.x + box.width / 2, y: box.y + 1 });
    expect(hitsClose).toBe(true);
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
    await softNavigate(page, 'Next Unit');
    await page.getByRole('button', { name: 'Run it here' }).click();
    await expect(page.locator('emu198x-player')).toHaveCount(1);
  });
});

test.describe('editable BASIC in the lesson', () => {
  const lesson='/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/';
  test('runs the edited listing and preserves that session when a later edit is invalid',async({page})=>{
    await page.goto(lesson);
    const source=page.getByRole('textbox',{name:'Your BASIC listing'});
    await source.fill('10 PRINT "Hello, world."\n20 PRINT 1.5');
    await expect(page.locator('.listing-changes')).not.toHaveText('Original code');
    await expect(page.locator('.listing-editor')).toHaveClass(/highlighted/);
    await page.getByRole('button',{name:'Run this code',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:'Your Spectrum'});
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.machine-transcript pre')).toContainText('Hello, world.');
    await expect(dialog.locator('.machine-transcript pre')).toContainText('1.5');
    await dialog.locator('canvas').press('Escape');
    await expect(dialog).toBeVisible();
    await page.getByRole('button',{name:'Back to the listing'}).click();
    await expect(source).toHaveValue('10 PRINT "Hello, world."\n20 PRINT 1.5');
    await source.fill('NOT BASIC');
    await page.getByRole('button',{name:'Run this code',exact:true}).click();
    await expect(page.getByRole('alert')).toContainText('line number');
    await expect(dialog).toBeHidden();
    await page.getByRole('button',{name:'Return to your Spectrum'}).click();
    await expect(dialog.locator('.machine-transcript pre')).toContainText('Hello, world.');
    await expect(dialog.locator('.machine-status')).toContainText('Paused');
  });
  test('resets the draft without reopening the machine',async({page})=>{
    await page.goto(lesson);
    const source=page.getByRole('textbox',{name:'Your BASIC listing'});
    const original=await source.inputValue();
    await source.fill('10 PRINT "CHANGED"');
    await page.getByText('Listing options',{exact:true}).click();
    await page.getByRole('button',{name:'Reset to original'}).click();
    await expect(source).toHaveValue(original);
    await expect(page.locator('.listing-changes')).toHaveText('Original code');
    await expect(page.getByRole('dialog',{name:'Your Spectrum'})).toBeHidden();
  });
});
