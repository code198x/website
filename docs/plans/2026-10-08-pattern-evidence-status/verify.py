"""Check rendered status coverage and the source identities behind its links."""

import argparse
import hashlib
import json
import re
import subprocess
from collections import Counter
from pathlib import Path


def git_file(repository: Path, revision: str, path: str) -> bytes:
    return subprocess.check_output(
        ["git", "show", f"{revision}:{path}"], cwd=repository
    )


def verify(site: Path, samples: Path) -> None:
    patterns = sorted((site / "src/content/patterns").rglob("*.mdx"))
    assert patterns, "No pattern sources found"
    counts: Counter[str] = Counter()
    hashes_checked = 0
    links_checked = 0
    for source in patterns:
        text = source.read_text()
        statements = re.findall(r"^\*\*Code status: (.+?)\*\*(.+)$", text, re.MULTILINE)
        assert len(statements) == 1, source
        label, statement = statements[0]
        counts[label] += 1
        slug = source.relative_to(site / "src/content/patterns").with_suffix("")
        html = (site / "dist/patterns" / slug / "index.html").read_text()
        assert html.count(f"<strong>Code status: {label}</strong>") == 1, slug
        links = re.findall(
            r"https://github.com/code198x/code-samples/blob/([0-9a-f]{40})/([^)]*)",
            statement,
        )
        executed = label == "assembled and emulator-executed."
        maintained = label == "maintained BASIC subroutine."
        assert len(links) == int(executed or maintained), source
        for revision, path in links:
            payload = git_file(samples, revision, path)
            assert payload == (samples / path).read_bytes(), path
            assert f"/blob/{revision}/{path}" in html, slug
            links_checked += 1
            if not executed:
                continue
            record = json.loads(payload)
            root = Path(path).parents[1]
            if Path(path).parent.name == "evidence":
                root = root.parent
            hashes = {**record.get("sources", {}), **record.get("includes", {})}
            if "profile-a-routine" in path:
                hashes = {
                    case["source"]: case["source_sha256"]
                    for case in record["cases"]
                }
            assert hashes, path
            for name, expected in hashes.items():
                relative = root / name
                if name == "probe.asm":
                    relative = root / "verification" / name
                pinned = git_file(samples, revision, str(relative))
                current = (samples / relative).read_bytes()
                assert pinned == current, relative
                assert hashlib.sha256(current).hexdigest() == expected, relative
                hashes_checked += 1
    print(json.dumps({
        "patterns": len(patterns), "statuses": dict(counts),
        "pinned_links": links_checked, "matching_source_hashes": hashes_checked,
    }, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--samples", required=True, type=Path)
    args = parser.parse_args()
    verify(Path(__file__).resolve().parents[3], args.samples)
