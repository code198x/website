import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * HEAD a URL on another site, retrying only when that site reports a server
 * error (5xx).
 *
 * A 503 from GitHub Pages once turned a correct pull request red: the page
 * answered 200 minutes later. A server error says nothing about our links, so
 * it earns a retry. Every other answer, including a 404 or a redirect, comes
 * back at once, because those are what the test exists to catch.
 */
export async function headRetryingServerErrors(
  request: APIRequestContext,
  url: string,
  { attempts = 3, waitMs = 3000, maxRedirects = 0 } = {},
): Promise<APIResponse> {
  let response = await request.head(url, { maxRedirects });
  for (let attempt = 1; attempt < attempts && response.status() >= 500; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    response = await request.head(url, { maxRedirects });
  }
  return response;
}
