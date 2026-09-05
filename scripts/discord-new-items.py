#!/usr/bin/env python3
"""Work out what became newly live in this deploy, for announcing in Discord.

The site publishes on a date gate, not on merge: content carries a pubDate and
goes live on the daily 06:00 rebuild, so "what shipped" cannot be read from the
diff of a push. Six deploys out of seven publish nothing new at all.

The feed already knows. src/pages/rss.xml.ts filters every collection on
`!draft && pubDate <= now`, so the built rss.xml *is* the list of what is live.
Comparing the feed about to be deployed against the one currently live gives
the items that became visible in this deploy. This is a feed diff, not a
delivery ledger: a subsequent deployment will not retry failed announcements.
Retain the new-items artifact and inspect channel delivery before recovery.

Reads the two feeds, writes the new items as JSON.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from xml.etree import ElementTree


def items(path: Path) -> list[dict]:
    root = ElementTree.parse(path).getroot()
    out = []
    for node in root.iter("item"):
        link = (node.findtext("link") or "").strip()
        if not link:
            continue
        raw_date = (node.findtext("pubDate") or "").strip()
        try:
            published = parsedate_to_datetime(raw_date)
        except (TypeError, ValueError):
            published = None
        if published is not None and published.tzinfo is None:
            published = published.replace(tzinfo=timezone.utc)
        out.append(
            {
                "title": (node.findtext("title") or "").strip(),
                "link": link,
                "description": (node.findtext("description") or "").strip(),
                "published": published,
            }
        )
    return out


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--old", required=True, help="feed currently live")
    parser.add_argument("--new", required=True, help="feed about to be deployed")
    parser.add_argument("--out", required=True, help="JSON list to write")
    args = parser.parse_args()

    out_path = Path(args.out)
    old_path, new_path = Path(args.old), Path(args.new)

    def nothing(reason: str) -> int:
        # Announce nothing rather than guess. The failure that matters here is
        # treating an unreadable old feed as an empty one, which would announce
        # the entire back catalogue — several hundred items — as new.
        print(f"::warning::announcing nothing: {reason}")
        out_path.write_text("[]")
        return 0

    if not old_path.exists() or old_path.stat().st_size == 0:
        return nothing("the currently live feed could not be read")
    if not new_path.exists():
        return nothing(f"{new_path} does not exist — was the site built?")

    try:
        old_items = items(old_path)
    except ElementTree.ParseError as exc:
        return nothing(f"the currently live feed did not parse ({exc})")

    if not old_items:
        return nothing("the currently live feed has no items")

    new_items = items(new_path)
    known = {item["link"] for item in old_items}
    now = datetime.now(timezone.utc)

    fresh = []
    for item in new_items:
        if item["link"] in known:
            continue
        # Belt and braces. The feed is supposed to gate on pubDate, but the
        # curriculum-unit branch of rss.xml.ts only checks that a pubDate
        # exists, so a future-dated unit would reach the feed early. Announcing
        # it early is worse than skipping it. The RSS publisher must also apply
        # the date gate, or the next diff would consider it already known.
        if item["published"] is not None and item["published"] > now:
            print(f"::notice::not yet live, skipping: {item['title']}")
            continue
        fresh.append(item)

    fresh.sort(key=lambda item: (item["published"] or now))

    payload = [
        {
            "title": item["title"],
            "link": item["link"],
            "description": item["description"],
        }
        for item in fresh
    ]
    out_path.write_text(json.dumps(payload, indent=2))
    print(f"{len(payload)} newly live item(s) of {len(new_items)} in the feed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
