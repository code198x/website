/**
 * URL paths of Vault entries a person has not yet reviewed.
 *
 * Unreviewed entries stay published, with their "Not yet fact-checked"
 * footer, but are kept out of search engines until reviewed
 * (Code198x docs, specifications/vault.md, "Reviewing existing entries").
 * The page template adds a robots noindex tag; this list lets the sitemap
 * leave the same pages out. It reads frontmatter directly because
 * astro.config.mjs runs before content collections exist, and it mirrors
 * src/pages/vault/[...slug].astro, whose URL is the entry's file path.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function unreviewedVaultPaths(vault = './src/content/vault') {
  const paths = new Set();
  for (const category of readdirSync(vault, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;
    for (const file of readdirSync(path.join(vault, category.name))) {
      if (!file.endsWith('.mdx')) continue;
      const text = readFileSync(path.join(vault, category.name, file), 'utf8');
      const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      if (!/^reviewed:\s*true\s*$/m.test(frontmatter)) {
        paths.add(`/vault/${category.name}/${file.replace(/\.mdx$/, '')}/`);
      }
    }
  }
  return paths;
}
