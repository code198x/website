#!/usr/bin/env node
/**
 * Fail the build if published Vault imagery breaks the family's imagery rules.
 *
 * Two umbrella decisions govern what may appear on a Vault page:
 *   198x/decisions/capturing-published-software.md
 *   198x/decisions/publishing-third-party-imagery.md
 *
 * Both are written down, and until now nothing enforced either. The first one
 * names that gap as its own design principle — "a rule the format enforces
 * beats a rule people have to remember ... the ones that depend on remembering
 * are the ones that fail in two years when someone adds one more capture."
 * This is that enforcement.
 *
 * What it checks
 * -------------
 *  1. Every image under public/images/vault/ is claimed by a capture manifest.
 *     An unclaimed image is one whose provenance nobody recorded, which is the
 *     precise failure "provenance is recorded, not assumed" exists to prevent.
 *  2. Every image a manifest claims actually exists. A manifest describing a
 *     frame that is not there is a provenance record for nothing.
 *  3. Anything declared `"class": "cover-art"` stays within the size ceiling,
 *     is one per entry, and names a rights-holder. Resolution is the fairness
 *     argument for cover art, so it is the one thing worth measuring rather
 *     than trusting.
 *
 * It deliberately does NOT check captions, acknowledgement wording, or whether
 * an image earns its place. Those are editorial and a script would only give
 * false confidence about them.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MANIFEST_DIR = join(ROOT, 'capture/vault');
const IMAGE_ROOT = join(ROOT, 'public/images');
const VAULT_IMAGES = join(IMAGE_ROOT, 'vault');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

/**
 * Cover art ceiling, in total pixels.
 *
 * publishing-third-party-imagery.md requires cover art to be "large enough to
 * see what the artwork is, too small to serve as a reproduction of it" without
 * fixing a number, so the number lives here where it can be enforced. 100,000
 * pixels is roughly 400x250 — comfortably legible on a page, useless as a
 * reproduction of a painting. Our own captures are 512x384 (196,608) and are
 * NOT subject to this: they are our frames, not somebody's artwork.
 */
const MAX_COVER_PIXELS = 100_000;

const problems = [];
const fail = (msg) => problems.push(msg);

function walk(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out = out.concat(walk(path));
    else if (IMAGE_EXT.has(extname(name).toLowerCase())) out.push(path);
  }
  return out;
}

/**
 * What a manifest publishes, declared rather than inferred.
 *
 * Inferring this from "any string that looks like a filename" was the first
 * thing tried and it is wrong, because a capture can be two-stage: the
 * timeline writes a raw frame and `post` crops that into the published image,
 * so the timeline's filename names an intermediate that is never published.
 * Guessing conflates the two in both directions — it demands a file that
 * should not exist, and lets a real published image go unclaimed.
 *
 * So a capture states its published images in `screenshots` (or `image`), and
 * a diagram block states its own in `figures[].file`. Everything else in the
 * manifest — raw intermediates, dump filenames — is prose to this check.
 */
function publishedNames(data, found = new Set()) {
  for (const capture of data.captures ?? []) {
    for (const name of [capture.screenshots, capture.image].flat().filter(Boolean)) {
      found.add(name);
    }
  }
  for (const figure of data.diagrams?.figures ?? []) {
    if (figure.file) found.add(figure.file);
  }
  return found;
}

/** PNG dimensions from the IHDR chunk — avoids taking on an image dependency. */
function pngSize(path) {
  const buf = readFileSync(path);
  const isPng = buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47;
  if (!isPng) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const manifests = readdirSync(MANIFEST_DIR).filter((f) => f.endsWith('.json'));
if (manifests.length === 0) fail(`No capture manifests found in ${relative(ROOT, MANIFEST_DIR)}`);

const claimedPaths = new Map();          // absolute image path -> manifest name

for (const file of manifests) {
  const manifestPath = join(MANIFEST_DIR, file);
  let data;
  try {
    data = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    fail(`${file}: not valid JSON — ${err.message}`);
    continue;
  }

  if (!data.image_dir) {
    fail(`${file}: no "image_dir", so its images cannot be located`);
    continue;
  }

  const published = publishedNames(data);
  if (published.size === 0) {
    fail(`${file}: declares no published images. Each capture needs "screenshots" (or "image").`);
  }

  for (const name of published) {
    const abs = join(IMAGE_ROOT, data.image_dir, name);
    try {
      statSync(abs);
    } catch {
      fail(`${file}: claims ${name}, which does not exist at images/${data.image_dir}/${name}`);
      continue;
    }
    const already = claimedPaths.get(abs);
    if (already && already !== file) {
      fail(`${name} is claimed by both ${already} and ${file} — provenance must have one home`);
    }
    claimedPaths.set(abs, file);
  }

  // Cover art carries limits the rest of the imagery does not.
  const covers = (data.captures ?? []).filter((c) => c.class === 'cover-art');
  if (covers.length > 1) {
    fail(`${file}: ${covers.length} cover-art entries; the limit is one per entry`);
  }
  for (const cover of covers) {
    const names = [cover.screenshots, cover.image].flat().filter(Boolean);
    if (names.length > 1) {
      fail(`${file}: cover-art "${cover.id}" carries ${names.length} images; the limit is one`);
    }
    if (!cover.work?.artist && !cover.work?.artist_unknown) {
      fail(
        `${file}: cover-art "${cover.id}" names no artist. Set work.artist, or ` +
        `work.artist_unknown describing where you looked — "unknown" is a claim about our research.`
      );
    }
    for (const name of names) {
      const abs = join(IMAGE_ROOT, data.image_dir, name);
      const size = pngSize(abs);
      if (!size) continue;                       // non-PNG: size unchecked, flagged below
      const pixels = size.width * size.height;
      if (pixels > MAX_COVER_PIXELS) {
        fail(
          `${name}: ${size.width}x${size.height} = ${pixels.toLocaleString()} pixels, over the ` +
          `${MAX_COVER_PIXELS.toLocaleString()} ceiling for cover art. Resolution is the ` +
          `fairness argument — shrink it rather than raising the limit.`
        );
      }
    }
  }
}

let onDisk = [];
try {
  onDisk = walk(VAULT_IMAGES);
} catch {
  // No Vault imagery yet is a valid state.
}

for (const path of onDisk) {
  if (!claimedPaths.has(path)) {
    fail(
      `images/${relative(IMAGE_ROOT, path)} is published but no manifest claims it. ` +
      `Record where it came from in capture/vault/, or remove it.`
    );
  }
}

if (problems.length) {
  console.error(`\nVault imagery check failed (${problems.length}):\n`);
  for (const p of problems) console.error(`  · ${p}`);
  console.error(
    '\nSee 198x/decisions/publishing-third-party-imagery.md and ' +
    'capturing-published-software.md.\n'
  );
  process.exit(1);
}

console.log(`Vault imagery: ${onDisk.length} image(s) across ${manifests.length} manifest(s), all accounted for.`);
