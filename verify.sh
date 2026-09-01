#!/bin/zsh
# Fails loudly on anything that would break the content build.
#
# `astro build` exits 0 through a pipe even when content sync rejects a file, so a
# broken entry is otherwise invisible until it reaches main. The frontmatter check
# runs first because YAML quoting is where the breakage has actually come from.
set -e
cd "${0:A:h}"
node scripts/check-frontmatter-quoting.mjs
out=$(npx astro build 2>&1) || { print -- "$out" | tail -30; exit 1; }
if print -- "$out" | grep -qiE '\[ERROR\]|unknown escape|Could not parse|Invalid option|InvalidContent|bad indentation'; then
  print -- "$out" | grep -iE -A6 '\[ERROR\]|unknown escape|Could not parse|Invalid option|InvalidContent|bad indentation' | head -30
  exit 1
fi
print -- "$out" | tail -2
node scripts/check-vault-links.mjs | tail -1
