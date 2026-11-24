import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

test('both printable editions retain the maintained starting program', async ({ page, request }) => {
  const response = await request.get('/workbooks/spectrum-basic-first-session/sources.json');
  expect(response.ok()).toBe(true);
  const source = await response.json();
  expect(source.startingListing.trim().split('\n')).toHaveLength(3);
  expect(source.codeSha256).toMatch(/^[a-f0-9]{64}$/);
  for (const edition of ['learner', 'teacher']) {
    await page.goto(`/try/workbook/${edition}/`);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('.workbook-root pre code')).toHaveText(source.startingListing.trim());
    await expect(page.locator('.workbook-root')).toContainText('0.1');
    await page.setViewportSize({ width: 320, height: 1000 });
    expect(await page.locator('main').evaluate(main => main.scrollWidth <= main.clientWidth)).toBe(true);
  }
});

test('both workbook breadcrumbs return to the first-session guide', async ({ page }) => {
  for (const [edition, title] of [['learner', 'Learner workbook'], ['teacher', 'Teacher notes']]) {
    await page.goto(`/try/workbook/${edition}/`);
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb', exact: true });
    const guide = breadcrumb.getByRole('link', { name: 'Try Code198x', exact: true });
    await expect(guide).toHaveAttribute('href', '/try/');
    await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(title);
    await guide.click();
    await expect(page).toHaveURL(/\/try\/$/);
    await expect(page.getByRole('link', { name: 'Read the learner booklet as HTML' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'read the teacher notes as HTML' })).toBeVisible();
  }
});

test('downloaded PDFs match the reviewed manifest', async ({ request }) => {
  const response = await request.get('/workbooks/spectrum-basic-first-session/pdf-manifest.json');
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.files).toHaveLength(2);
  for (const file of manifest.files) {
    const pdf = await request.get(`/workbooks/spectrum-basic-first-session/${file.file}`);
    expect(pdf.ok()).toBe(true);
    const bytes = await pdf.body();
    expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
    expect(bytes.length).toBe(file.bytes);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(file.sha256);
  }
});

test('first-session and teaching pages expose pupil and separate teacher downloads', async ({page}) => {
  for (const route of ['/try/', '/teaching/']) {
    await page.goto(route);
    await expect(page.locator('main a[href="/workbooks/spectrum-basic-first-session/learner.pdf"]')).toHaveCount(1);
    const teacher = page.locator('main a[href="/workbooks/spectrum-basic-first-session/teacher.pdf"]');
    await expect(teacher).toHaveCount(1);
    await expect(teacher).toContainText(/answers/i);
    await expect(page.locator('main a[href="/try/workbook/learner/"]')).toHaveCount(1);
    await expect(page.locator('main a[href="/try/workbook/teacher/"]')).toHaveCount(1);
  }
});
