/** Execution fixtures open the native drawers before inspecting or editing code. */
export async function openSourceEditors(page) {
  const drawers = page.locator('.source-drawer');
  await drawers.first().waitFor({state:'attached'});
  for (const drawer of await drawers.all()) {
    if (await drawer.getAttribute('open') === null) await drawer.locator('summary').click();
  }
}
