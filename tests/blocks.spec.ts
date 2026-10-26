import { test, expect } from '@playwright/test';

// Shared blocks (src/styles/blocks.css) give every component that wears them
// one style. A component's own rule outranks the block, so this checks that
// none has put back a size, weight or tracking of its own.
const ROUTES = [
  '/vault/',
  '/vault/people/al-alcorn/',
  '/curriculum/',
  '/crash-live/',
  '/systems/commodore-64/assembly/',
  '/family/asm198x/',
  '/field-notes/',
  '/updates/',
  '/craft/game-feel/',
];

for (const route of ROUTES) {
  test(`labels on ${route} are set at the micro step`, async ({ page }) => {
    await page.goto(route);
    const labels = await page.$$eval('.label', elements => elements
      .filter(element => element.getClientRects().length > 0)
      .map(element => {
        const style = getComputedStyle(element);
        return { text: (element.textContent ?? '').trim().slice(0, 40), size: style.fontSize, weight: style.fontWeight, tracking: style.letterSpacing };
      }));
    expect(labels.length, `${route} shows no labels`).toBeGreaterThan(0);
    for (const label of labels) {
      expect(label, `${route}: "${label.text}"`).toMatchObject({ size: '14px', weight: '600', tracking: 'normal' });
    }
  });
}

const CARD_ROUTES = ['/curriculum/', '/crash-live/', '/updates/', '/demoscene/'];

for (const route of CARD_ROUTES) {
  test(`link cards on ${route} answer hover without lifting`, async ({ page }) => {
    await page.goto(route);
    const cards = page.locator('a.ink-card');
    expect(await cards.count(), `${route} shows no link cards`).toBeGreaterThan(0);
    const card = cards.first();
    await card.scrollIntoViewIfNeeded();
    const edge = () => card.evaluate(element => getComputedStyle(element).borderTopColor);
    expect(await card.evaluate(element => getComputedStyle(element).borderTopWidth)).toBe('3px');
    const rest = await edge();
    await card.hover();
    await expect.poll(edge).not.toBe(rest);
    expect(await card.evaluate(element => getComputedStyle(element).transform)).toBe('none');
    expect(await card.evaluate(element => getComputedStyle(element).boxShadow)).toBe('none');
  });
}

const PILL_ROUTES = ['/craft/', '/demoscene/', '/crash-live/', '/family/asm198x/'];

for (const route of PILL_ROUTES) {
  test(`pills on ${route} share one box and the label type`, async ({ page }) => {
    await page.goto(route);
    const pills = await page.$$eval('.pill', elements => elements
      .filter(element => element.getClientRects().length > 0)
      .map(element => {
        const style = getComputedStyle(element);
        return {
          text: (element.textContent ?? '').trim().slice(0, 40),
          label: element.classList.contains('label'),
          size: style.fontSize,
          border: style.borderTopWidth,
          padding: style.padding,
        };
      }));
    expect(pills.length, `${route} shows no pills`).toBeGreaterThan(0);
    for (const pill of pills) {
      expect(pill, `${route}: "${pill.text}"`).toMatchObject({ label: true, size: '14px', border: '2px', padding: '2px 8px' });
    }
  });
}

// Section headings glide from the h3 step at 320px to h2 at 1100px and up.
// Headings written in Markdown can't take the class, so the prose ones are
// named here.
const SECTION_HEADINGS: Record<string, string> = {
  '/crash-live/': '.heading-h2',
  '/demoscene/': '.heading-h2',
  '/timeline/': '.heading-h2',
  '/vault/': '.heading-h2',
  '/systems/sinclair-zx-spectrum/': '.heading-h2',
  '/vault/studies/simcity/': '.feature-prose h2',
  '/from-the-metal/powers-of-two/': '.editorial-body h2',
  '/patterns/atari-7800/assembly/framework/turn-loop/': '.pattern-prose > h2',
};

// Card and sub-section headings glide from h4 at 320px to h3 at 1100px and up.
const CARD_HEADINGS: Record<string, string> = {
  '/craft/': '.heading-h3',
  '/field-notes/': '.heading-h3',
  '/updates/': '.heading-h3',
  '/colophon/': '.heading-h3',
  '/contribute/': '.heading-h3',
  '/timeline/': '.heading-h3',
  '/timeline/1980s/': '.heading-h3',
  '/vault/': '.heading-h3',
  '/systems/': '.heading-h3',
  '/systems/sinclair-zx-spectrum/assembly/': '.heading-h3',
  '/crash-live/': '.heading-h3',
  '/craft/game-feel/unit-01/': '.unit-content > h2',
  '/systems/sinclair-zx-spectrum/assembly/gloaming/': '.prose h2',
  '/try/': '.guide-prose h2',
};

// Small headings glide from the body step at 320px to h4 at 1100px and up.
// Lesson and Vault article h3s keep their lighter weight, so only size is
// checked here.
const SMALL_HEADINGS: Record<string, string> = {
  '/patterns/': '.pattern-results h3',
  '/vault/': '.vault-contribute h2',
  '/vault/category/techniques/': '.vault-path-list h3',
  '/vault/category/tools/': '.vault-directory-entries h3',
  '/timeline/': '.timeline-coverage h2',
  '/systems/': '.ghead h3',
  '/crash-live/': '.section-title',
  '/systems/sinclair-zx-spectrum/': ':is(.machine-setup h2, .language-routes h3, .machine-references h3, .system-launcher h2)',
  '/systems/sinclair-zx-spectrum/basic/': '.section-title',
  '/curriculum/': ':is(.panel h2, .section-head h2)',
  '/foundations/': ':is(.group-title, .card h3, .after h2)',
  '/start-here/': '.start-route-body h3',
  '/family/asm198x/': '.prose h2',
};

const GLIDES = [
  { name: 'section headings', from: '32px', to: '40px', weight: '700', routes: SECTION_HEADINGS },
  { name: 'card headings', from: '24px', to: '32px', weight: '700', routes: CARD_HEADINGS },
  { name: 'small headings', from: '20px', to: '24px', weight: undefined, routes: SMALL_HEADINGS },
];

for (const { name, from, to, weight, routes } of GLIDES) for (const [route, selector] of Object.entries(routes)) {
  test(`${name} on ${route} glide from ${from} to ${to}`, async ({ page }) => {
    for (const [width, size] of [[320, from], [1200, to]] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const headings = await page.$$eval(selector, elements => elements
        .filter(element => element.getClientRects().length > 0)
        .map(element => ({ text: (element.textContent ?? '').trim().slice(0, 40), size: getComputedStyle(element).fontSize, weight: getComputedStyle(element).fontWeight })));
      expect(headings.length, `${route} shows no ${name} at ${width}px`).toBeGreaterThan(0);
      for (const heading of headings) {
        expect(heading, `${route} at ${width}px: "${heading.text}"`).toMatchObject(weight ? { size, weight } : { size });
      }
    }
  });
}

// Controls are square, flat and on the 8px cell, with the small step's type.
const CONTROL_ROUTES = [
  '/patterns/',
  '/timeline/1980s/',
  '/vault/category/tools/',
  '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/',
  // The lesson widgets and the assembly sandbox around them.
  '/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-02/',
  '/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-05/',
  '/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-06/',
  '/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-08/',
  '/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-28/',
  '/systems/nintendo-entertainment-system/assembly/meet-the-machine/unit-01/',
];

for (const route of CONTROL_ROUTES) {
  test(`controls on ${route} are square, 48px and set at the small step`, async ({ page }) => {
    await page.goto(route);
    const controls = await page.$$eval('.control', elements => elements
      .filter(element => element.getClientRects().length > 0)
      .map(element => {
        const style = getComputedStyle(element);
        return {
          text: (element.textContent ?? element.getAttribute('name') ?? '').trim().slice(0, 30),
          height: Math.round(element.getBoundingClientRect().height) >= 48,
          radius: style.borderTopLeftRadius,
          border: style.borderTopWidth,
          size: style.fontSize,
        };
      }));
    expect(controls.length, `${route} shows no controls`).toBeGreaterThan(0);
    for (const control of controls) {
      expect(control, `${route}: "${control.text}"`).toMatchObject({ height: true, radius: '0px', border: '1px', size: '16px' });
    }
  });
}
