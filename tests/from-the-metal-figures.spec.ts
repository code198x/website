import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

async function expectNoClipping(figure: Locator) {
  await expect(figure).toBeVisible();
  const fits = await figure.evaluate((el) => {
    const width = document.documentElement.clientWidth;
    const { left, right } = el.getBoundingClientRect();
    return left >= 0 && right <= width
      && el.scrollWidth <= el.clientWidth + 1;
  });
  expect(fits).toBe(true);
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    await page.setViewportSize({ width: 320, height: 765 });
  }
});

test('byte order compares both processors at the same addresses', async ({ page }) => {
  await page.goto('/from-the-metal/endianness');
  const table = page.getByRole('table', { name: /The same value/ });
  await expect(table.getByRole('columnheader')).toHaveText(['Address', '6502', '68000']);
  await expect(table.getByRole('rowheader')).toHaveText(['$2000', '$2001']);
  await expect(table.getByRole('cell')).toHaveText(['$34 (low)', '$12 (high)', '$12 (high)', '$34 (low)']);
  await expect(table.locator('caption')).toContainText('$1234');
  await expectNoClipping(table);
});

test('ULA output identifies its fields and shows both masks without losing other bits', async ({ page }, testInfo) => {
  await page.goto('/from-the-metal/bitmasks-and-registers');
  if (testInfo.project.name === 'mobile') {
    const fields = page.getByRole('table', { name: /ULA output byte/ });
    await expect(fields.getByRole('rowheader')).toHaveText(['7–5', '4', '3', '2–0']);
    await expect(fields.getByRole('cell')).toHaveText([
      'Unused on write', '000', 'Speaker', '1', 'MIC', '0', 'Border', '010',
    ]);
    await expectNoClipping(fields);
  } else {
    const register = page.getByRole('img', { name: '$FE ULA output byte register' });
    for (const label of ['Unused on write', 'Speaker', 'MIC', 'Border']) {
      await expect(register.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(register.locator('..').locator('figcaption')).toContainText('speaker bit 4');
    await expectNoClipping(register);
  }
  const table = page.getByRole('table', { name: /A worked example/ });
  await expect(table.getByRole('columnheader')).toHaveText(['Step', 'Mask', 'Byte']);
  await expect(table.getByRole('rowheader')).toHaveText(['Start', 'OR (set)', 'AND (clear)']);
  await expect(table.getByRole('cell')).toHaveText([
    'None', '00000010', '00010000', '00010010', '11101111', '00000010',
  ]);
  await expectNoClipping(table);
});
