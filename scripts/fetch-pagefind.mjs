/**
 * Fetch a local Pagefind binary on Apple Silicon, where the npm shim cannot.
 *
 * `pagefind` ships no binary. It resolves `@pagefind/<platform>`, and that
 * package ships only `.sha256` files — the executables are fetched from GitHub
 * on demand. On darwin-arm64 that fetch fails, every time, and the shim reports
 * it as "most likely the platform darwin-arm64 is not yet a supported
 * architecture", which reads like a portability problem rather than a failed
 * download. The build ends in `pagefind --site dist`, so the whole build exits
 * non-zero and everything gated behind it — the accessibility sweep above all —
 * never runs.
 *
 * So we fetch the same tarball ourselves and verify it against the checksum npm
 * already delivered. The integrity story is the point: the hash comes from the
 * registry, the bytes come from GitHub, and nothing is installed unless the two
 * agree.
 *
 * Only darwin-arm64. Linux resolves the shim without trouble, which is why CI
 * has always been fine, and downloading 53MB there to fix nothing would be
 * silly. Anywhere else this is a no-op.
 *
 * This runs from `postinstall`, so it must never fail an install. Every path
 * out of here is exit 0 with an explanation; a missing search index is a
 * degraded build, not a broken checkout.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(root, 'tools/pagefind/pagefind');

const skip = (why) => {
  console.log(`pagefind: ${why}`);
  process.exit(0);
};

if (process.platform !== 'darwin' || process.arch !== 'arm64') {
  skip(`nothing to do on ${process.platform}-${process.arch}; the npm shim works here`);
}

// The version the shim is pinned to, so the local binary and CI's agree.
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const want = (pkg.devDependencies?.pagefind ?? '').replace(/^[^0-9]*/, '');
if (!want) skip('no `pagefind` version in devDependencies');

if (existsSync(DEST)) {
  try {
    const have = execFileSync(DEST, ['--version'], { encoding: 'utf8' }).trim();
    if (have.endsWith(want)) skip(`${have} already in tools/pagefind`);
    console.log(`pagefind: have "${have}", want ${want} — replacing`);
  } catch {
    console.log('pagefind: existing binary would not run — replacing');
  }
}

// `pagefind_extended` first, matching the shim's own order, so a Mac and CI
// index with the same build rather than merely the same version number.
const NAME = `pagefind_extended-v${want}-aarch64-apple-darwin.tar.gz`;
const sums = join(root, 'node_modules/@pagefind/darwin-arm64/bin', `${NAME}.sha256`);
if (!existsSync(sums)) {
  skip(`no checksum at ${sums} — refusing to install a binary it cannot verify`);
}
const expected = readFileSync(sums, 'utf8').trim().split(/\s+/)[0];

const url = `https://github.com/pagefind/pagefind/releases/download/v${want}/${NAME}`;
const scratch = join(tmpdir(), `pagefind-${want}-${process.pid}`);

try {
  console.log(`pagefind: fetching ${NAME}`);
  const res = await fetch(url);
  if (!res.ok) skip(`${url} returned ${res.status}`);
  const bytes = Buffer.from(await res.arrayBuffer());

  const actual = createHash('sha256').update(bytes).digest('hex');
  if (actual !== expected) {
    skip(`checksum mismatch — expected ${expected}, got ${actual}. Nothing installed.`);
  }

  mkdirSync(scratch, { recursive: true });
  const tarball = join(scratch, NAME);
  writeFileSync(tarball, bytes);
  execFileSync('tar', ['-xzf', tarball, '-C', scratch]);

  mkdirSync(dirname(DEST), { recursive: true });
  renameSync(join(scratch, 'pagefind_extended'), DEST);
  execFileSync('chmod', ['+x', DEST]);

  const version = execFileSync(DEST, ['--version'], { encoding: 'utf8' }).trim();
  console.log(`pagefind: installed ${version} to tools/pagefind/pagefind`);
} catch (err) {
  skip(`could not install a local binary (${err.message}). The build will try the npm shim.`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
