#!/bin/zsh
# Fails loudly on anything that would break the content build.
#
# Two traps this guards against, both of which reached a commit before it existed:
#   1. `astro build` exits 0 through a pipe even when content sync rejects a file,
#      so the output is scanned as well as the exit code.
#   2. \' is not a valid escape in a YAML double-quoted scalar. It is easy to emit
#      by accident when generating frontmatter from a shell heredoc.
set -e
cd "${0:A:h}"
if grep -rn "\\\\'" src/content/vault --include='*.mdx' | head -5 | grep -q .; then
  print -- "Invalid YAML escape \\' in frontmatter:"
  grep -rn "\\\\'" src/content/vault --include='*.mdx' | head -10
  exit 1
fi
out=$(npx astro build 2>&1) || { print -- "$out" | tail -30; exit 1; }
if print -- "$out" | grep -qiE '\[ERROR\]|unknown escape|Could not parse|Invalid option|InvalidContent|bad indentation'; then
  print -- "$out" | grep -iE -A6 '\[ERROR\]|unknown escape|Could not parse|Invalid option|InvalidContent|bad indentation' | head -30
  exit 1
fi
print -- "$out" | tail -2
node scripts/check-vault-links.mjs | tail -1
