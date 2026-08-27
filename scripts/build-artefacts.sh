#!/usr/bin/env bash
# Build every unit's program from source and stage it for the site to serve.
#
# The artefacts are not committed to code-samples; they are produced here, at
# deploy time, by the same toolchain the units teach. See
# docs/decisions/built-artefacts-are-published-not-committed.md in the Code198x
# docs repo for why, and for what had to become true first — chiefly that the
# builds are now reproducible, so a hash describes a program rather than the
# moment someone built it.
#
# Usage: scripts/build-artefacts.sh <code-samples-path> [output-dir]
#   output-dir defaults to public/code-samples.
#
# Tools are taken from PATH when already present, so a developer with them
# installed pays nothing; otherwise the pinned release is fetched and its
# checksum verified.

set -euo pipefail

ASM198X_VERSION="${ASM198X_VERSION:-v0.0.35}"
BUILD198X_VERSION="${BUILD198X_VERSION:-v0.2.3}"

SAMPLES="${1:?usage: build-artefacts.sh <code-samples-path> [output-dir]}"
OUT="${2:-public/code-samples}"
SAMPLES="$(cd "$SAMPLES" && pwd)"
TOOLS="$(pwd)/.tools"

# Fetch one cargo-dist release tarball and put its binary on PATH.
install_tool() {
    local repo="$1" name="$2" tag="$3"
    if command -v "$name" >/dev/null 2>&1; then
        echo "  $name: already on PATH at $(command -v "$name")"
        return
    fi
    local target="x86_64-unknown-linux-gnu"
    case "$(uname -s)/$(uname -m)" in
        Darwin/arm64) target="aarch64-apple-darwin" ;;
        Darwin/*)     target="x86_64-apple-darwin" ;;
    esac
    local file="${name}-${target}.tar.xz"
    local base="https://github.com/${repo}/releases/download/${name}-${tag}"
    mkdir -p "$TOOLS"
    ( cd "$TOOLS"
      curl -fsSL -o "$file" "${base}/${file}"
      curl -fsSL -o "${file}.sha256" "${base}/${file}.sha256"
      # A tampered or truncated download must not become a published artefact.
      if command -v sha256sum >/dev/null 2>&1; then sha256sum -c "${file}.sha256"
      else shasum -a 256 -c "${file}.sha256"; fi
      tar xJf "$file"
      install -m 755 "${name}-${target}/${name}" "$TOOLS/${name}" )
    echo "  $name: installed ${tag}"
}

install_tool asm198x/asm198x asm198x "$ASM198X_VERSION"
install_tool build198x/build198x build198x "$BUILD198X_VERSION"
[ -d "$TOOLS" ] && PATH="$TOOLS:$PATH" && export PATH

echo "Building units from $SAMPLES"
built=0
failed=0
failures=""
while IFS= read -r mk; do
    dir="$(dirname "$mk")"
    if make -C "$dir" >/dev/null 2>&1; then
        built=$((built + 1))
    else
        failed=$((failed + 1))
        failures="${failures}\n  ${dir#"$SAMPLES"/}"
    fi
done < <(find "$SAMPLES" -name Makefile -not -path '*/_*' | sort)

if [ "$failed" -gt 0 ]; then
    # A unit that will not build must not ship a stale or missing download.
    printf 'FAILED to build %s unit(s):%b\n' "$failed" "$failures" >&2
    exit 1
fi
echo "  built $built unit(s)"

# Stage the outputs under the same relative path the unit has in code-samples,
# so a page can link to a unit's program without a lookup table.
mkdir -p "$OUT"
staged=0
while IFS= read -r artefact; do
    rel="${artefact#"$SAMPLES"/}"
    mkdir -p "$OUT/$(dirname "$rel")"
    cp "$artefact" "$OUT/$rel"
    staged=$((staged + 1))
done < <(find "$SAMPLES" \( -name '*.adf' -o -name '*.nes' -o -name '*.sna' -o -name '*.prg' \) -not -path '*/_*' | sort)

echo "  staged $staged artefact(s) under $OUT"
