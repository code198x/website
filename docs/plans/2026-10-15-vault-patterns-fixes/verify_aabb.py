"""Check the published AABB pseudocode against independent overlap oracles."""

from __future__ import annotations

import hashlib
import itertools
import json
import math
import random
import re
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
PAGE = (
    HERE.parents[2] / "src/content/patterns/cross-platform/physics/aabb-collision.mdx"
)


def expression(text: str) -> str:
    text = text.replace("ROUND DOWN", "floor").replace("<>", "!=")
    text = re.sub(r"(?<![<>=!])=(?!=)", "==", text)
    for before, after in [
        ("TRUE", "True"),
        ("FALSE", "False"),
        ("AND", "and"),
        ("OR", "or"),
        ("NOT", "not"),
    ]:
        text = re.sub(r"\b" + before + r"\b", after, text)
    return text


def compile_routines(text: str) -> dict[str, Any]:
    """Translate only the three published DEFINE blocks; reject unknown syntax."""
    blocks = [
        b
        for b in re.findall(r"```text\n(.*?)```", text, re.DOTALL)
        if b.startswith("DEFINE ")
    ]
    assert len(blocks) == 3
    lines: list[str] = []
    for block in blocks:
        depth = 0
        for raw in block.splitlines():
            line = raw.strip()
            if line.startswith("DEFINE "):
                emitted = "def " + line[7:] + ":"
                lines.append("    " * depth + emitted)
                depth += 1
            elif line == "END":
                depth -= 1
                assert depth >= 0
            elif line.startswith("LET "):
                name, value = line[4:].split(" = ", 1)
                lines.append("    " * depth + name + " = " + expression(value))
            elif line.startswith("RETURN "):
                lines.append("    " * depth + "return " + expression(line[7:]))
            elif line.startswith("IF "):
                condition, statement = line[3:].split(" THEN", 1)
                emitted = "if " + expression(condition) + ":"
                if statement:
                    assert statement.startswith(" RETURN ")
                    emitted += " return " + expression(statement[8:])
                lines.append("    " * depth + emitted)
                if not statement:
                    depth += 1
            elif line.startswith("FOR "):
                name, rest = line[4:].split(" = ")
                first, last = rest.split(" TO ")
                lines.append(
                    "    " * depth + f"for {name} in range({first}, {last} + 1):"
                )
                depth += 1
            elif line.startswith("APPEND "):
                value, name = line[7:].split(" TO ")
                lines.append(
                    "    " * depth + name + ".append(" + expression(value) + ")"
                )
            else:
                raise ValueError(f"Unknown published syntax: {line}")
        assert depth == 0
    namespace: dict[str, Any] = {"floor": math.floor}
    exec("\n".join(lines), namespace)  # noqa: S102 -- Translate only the three repository-owned pseudocode blocks.
    return namespace


def occupied(box: tuple[int, int, int, int]) -> set[tuple[int, int]]:
    x, y, width, height = box
    return {
        (px, py)
        for px in range(x, x + max(0, width))
        for py in range(y, y + max(0, height))
    }


def candidates(
    boxes: list[tuple[int, int, int, int]], functions: dict[str, Any]
) -> list[tuple[int, int]]:
    buckets: list[list[int]] = [[] for _ in range(64)]
    for i, box in enumerate(boxes):
        index = functions["bucket_index"](*box)
        if index == 0:
            raise ValueError(f"Unsupported box: {box}")
        buckets[index - 1].append(i)
    pairs = []
    for index, bucket in enumerate(buckets):
        pairs.extend(itertools.combinations(bucket, 2))
        row, col = divmod(index, 8)
        for neighbour in functions["neighbour_indices"](col, row):
            pairs.extend(
                (min(a, b), max(a, b)) for a in bucket for b in buckets[neighbour - 1]
            )
    assert len(pairs) == len(set(pairs)), "Duplicate candidate pair"
    return pairs


def main() -> None:
    text = PAGE.read_text()
    f = compile_routines(text)
    narrow = 0
    for ax, ay, bx, by, aw, ah in itertools.product(
        range(-2, 3),
        range(-2, 3),
        range(-2, 3),
        range(-2, 3),
        [-1, 0, 1, 2],
        [-1, 0, 1, 2],
    ):
        a, b = (ax, ay, aw, ah), (bx, by, 2, 2)
        assert f["check_collision"](*a, *b) == bool(occupied(a) & occupied(b)), (a, b)
        narrow += 1
    for invalid in [
        (-1, 0, 1, 1),
        (0, -1, 1, 1),
        (0, 0, 0, 1),
        (0, 0, 1, 0),
        (0, 0, 33, 1),
        (0, 0, 1, 25),
        (255, 0, 2, 1),
        (0, 191, 1, 2),
    ]:
        assert f["bucket_index"](*invalid) == 0, invalid
    assert f["bucket_index"](224, 168, 32, 24) == 64
    assert not f["check_collision"](0, 0, 2, 2, 2, 0, 2, 2)
    # One object per cell proves every geometrically neighbouring cell pair is
    # visited exactly once; comparing all cell pairs is the independent oracle.
    cells = [(col * 32, row * 24, 1, 1) for row in range(8) for col in range(8)]
    actual = set(candidates(cells, f))
    expected = {
        (a, b)
        for a, b in itertools.combinations(range(64), 2)
        if max(abs(a // 8 - b // 8), abs(a % 8 - b % 8)) == 1
    }
    assert actual == expected
    reported = [(31, 24, 2, 2), (32, 23, 2, 2)]
    assert (0, 1) in candidates(reported, f)
    rng = random.Random(690)
    pair_checks = 0
    for _ in range(100):
        boxes = []
        for _ in range(64):
            width, height = rng.randint(1, 32), rng.randint(1, 24)
            boxes.append(
                (
                    rng.randint(0, 256 - width),
                    rng.randint(0, 192 - height),
                    width,
                    height,
                )
            )
        found = set(candidates(boxes, f))
        for a, b in itertools.combinations(range(len(boxes)), 2):
            ax, ay, aw, ah = boxes[a]
            bx, by, bw, bh = boxes[b]
            # Independent interval-intersection length, not separating-axis code.
            overlaps = min(ax + aw, bx + bw) > max(ax, bx) and min(
                ay + ah, by + bh
            ) > max(ay, by)
            if overlaps:
                assert (a, b) in found, (boxes[a], boxes[b])
            assert f["check_collision"](*boxes[a], *boxes[b]) == overlaps
            pair_checks += 1
    mutant = compile_routines(text.replace("FOR dx = -1 TO 1", "FOR dx = 0 TO 1"))
    assert (0, 1) not in candidates(reported, mutant), (
        "Missing-diagonal mutation was not exposed"
    )
    result = {
        "page_sha256": hashlib.sha256(PAGE.read_bytes()).hexdigest(),
        "method": "Translate actual published DEFINE blocks; independent occupied-cell and interval oracles",
        "narrow_phase_cases": narrow,
        "random_pair_checks": pair_checks,
        "all_cell_pairs": "all adjacent pairs exactly once, no wrapped/non-neighbour cells",
        "unsupported_boxes": "rejected with bucket index 0",
        "reported_diagonal_pair": "included",
        "missing_diagonal_mutation": "rejected",
        "limits": "Host semantic checks; no machine performance or assembly claim",
    }
    (HERE / "aabb-results.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
