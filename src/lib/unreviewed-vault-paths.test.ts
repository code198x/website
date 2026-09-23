import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { unreviewedVaultPaths } from './unreviewed-vault-paths.mjs';

function vaultWith(entries: Record<string, string>): string {
  const root = mkdtempSync(path.join(tmpdir(), 'vault-'));
  for (const [file, frontmatter] of Object.entries(entries)) {
    mkdirSync(path.join(root, path.dirname(file)), { recursive: true });
    writeFileSync(path.join(root, file), `---\n${frontmatter}\n---\n\nBody.\n`);
  }
  return root;
}

describe('unreviewedVaultPaths', () => {
  it('lists unreviewed entries by their page URL and omits reviewed ones', () => {
    const root = vaultWith({
      'systems/zx81.mdx': 'title: "ZX81"\nreviewed: false',
      'people/steven-vickers.mdx': 'title: "Steven Vickers"\nreviewed: true',
    });
    expect([...unreviewedVaultPaths(root)]).toEqual(['/vault/systems/zx81/']);
  });

  it('treats an entry without a reviewed flag as unreviewed', () => {
    const root = vaultWith({ 'games/manic-miner.mdx': 'title: "Manic Miner"' });
    expect(unreviewedVaultPaths(root).has('/vault/games/manic-miner/')).toBe(true);
  });

  it('reads the flag only from frontmatter, not from the body', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'vault-'));
    mkdirSync(path.join(root, 'tools'));
    writeFileSync(path.join(root, 'tools/paw.mdx'), '---\nreviewed: false\n---\n\nreviewed: true\n');
    expect(unreviewedVaultPaths(root).has('/vault/tools/paw/')).toBe(true);
  });
});
