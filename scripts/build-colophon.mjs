#!/usr/bin/env node
/**
 * Collect everyone who has contributed to the organisation's repositories and
 * write them to src/data/contributors.json, which the colophon reads.
 *
 * This is run by hand or by a scheduled workflow that opens a pull request —
 * never by the site build. The site deploys from a daily cron, and a GitHub
 * API call inside that build would add a network dependency and a rate limit
 * to an unattended publish. The failure would be quiet in the worst way: a
 * rate-limited fetch renders an *empty* colophon rather than failing.
 *
 * Nobody types a name into the output. A hand-kept credits list is only ever
 * as fresh as the last person who remembered to update it, and a missing name
 * is a worse failure than a missing page.
 *
 * See Code198x docs/website.md#rendering-and-design
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * The retired *-dev repositories are here deliberately. They hold work that
 * really happened, and dropping them because their containers were retired
 * would erase contributions rather than archive them.
 *
 * `.github` is organisation configuration, and `substack-drafts` is drafts —
 * neither is the project.
 */
const REPOS = [
  'website',
  'docs',
  'code-samples',
  'scripts',
  'sinclair-zx-spectrum-dev',
  'nintendo-entertainment-system-dev',
  'commodore-amiga-dev',
  'commodore-64-dev',
];

const NOT_PEOPLE = new Set([
  'claude',             // drafting help — credited under tools
  'astrobot-houston',   // Astro's release bot — credited under tools
]);

const OUT = path.join(import.meta.dirname, '..', 'src', 'data', 'contributors.json');

/** `gh` carries the auth; in Actions it is present with GITHUB_TOKEN already set. */
function gh(endpoint, jq) {
  const args = ['api', endpoint, '--paginate'];
  if (jq) args.push('--jq', jq);
  return execFileSync('gh', args, { encoding: 'utf8' });
}

const logins = new Set();
const missing = [];

for (const repo of REPOS) {
  try {
    const out = gh(`repos/code198x/${repo}/contributors`, '.[].login');
    for (const login of out.split('\n').map((l) => l.trim()).filter(Boolean)) {
      // Excluded from the *people* list, and named in the colophon's tools
      // section instead — which is the honest placement, not a way of hiding
      // them. The GitHub API reports all three as `type: User`, so there is no
      // programmatic tell; the list has to be explicit.
      if (login.endsWith('[bot]')) continue;
      if (NOT_PEOPLE.has(login)) continue;
      logins.add(login);
    }
  } catch {
    // A repository that has moved or gone private should not fail the run and
    // silently shrink the list — say which one, and carry on with the rest.
    missing.push(repo);
  }
}

if (!logins.size) {
  console.error('\nColophon: no contributors returned for any repository.');
  console.error('  Refusing to write an empty list over a good one. Check `gh auth status`.\n');
  process.exit(1);
}

const people = [];
for (const login of logins) {
  let name = '';
  try {
    name = gh(`users/${login}`, '.name').trim();
  } catch {
    // A profile with no name, or an account since deleted: the login stands on
    // its own and is how the person is known here anyway.
  }
  people.push({
    login,
    name: name && name !== 'null' ? name : null,
    url: `https://github.com/${login}`,
  });
}

// Alphabetical, by whatever the page will display. No counts and no ranking:
// a Vault entry and a corrected typo are both one commit, and any number makes
// that comparison visible when it is the wrong comparison to draw.
const collator = new Intl.Collator('en-GB', { sensitivity: 'base' });
people.sort((a, b) => collator.compare(a.name ?? a.login, b.name ?? b.login));

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify({ people }, null, 2)}\n`);

console.log(`\nColophon: ${people.length} contributor(s) across ${REPOS.length - missing.length} repositories.`);
for (const p of people) console.log(`  · ${p.name ? `${p.name} (${p.login})` : p.login}`);
if (missing.length) {
  console.warn(`\n  warning: could not read ${missing.join(', ')} — the list is short by whoever contributed there.`);
}
console.log(`\nWrote ${path.relative(process.cwd(), OUT)}\n`);
