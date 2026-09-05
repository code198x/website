#!/usr/bin/env python3
"""Build Discord messages from the newly-live feed items, without posting them.

Limits: https://docs.discord.com/developers/resources/message#embed-limits
Count UTF-16 code units conservatively, including supplementary characters.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urljoin, urlsplit


def size(text):
    return len(text.encode("utf-16-le")) // 2


def truncate(text, limit):
    if size(text) <= limit:
        return text
    result = []
    remaining = limit - 1
    for character in text:
        remaining -= size(character)
        if remaining < 0:
            break
        result.append(character)
    return "".join(result) + "…"


def messages(items):
    result, embeds, length = [], [], 0
    for item in items:
        url = urljoin("https://code198x.com/", item["link"])
        parsed = urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc != "code198x.com":
            raise ValueError("Announcement URL must belong to https://code198x.com")
        title = truncate(item["title"], 250)
        description = truncate(item["description"], 600)
        colour = 3066993
        for prefix, value in (("From the Metal:", 3447003),
                              ("Field Notes:", 10181046),
                              ("What's New:", 15844367)):
            if title.startswith(prefix):
                colour = value
        length_here = size(title) + size(description)
        if embeds and (len(embeds) == 10 or length + length_here > 6000):
            result.append({"username": "Code198x", "allowed_mentions": {"parse": []}, "embeds": embeds})
            embeds, length = [], 0
        embeds.append({"title": title, "url": url, "description": description, "color": colour})
        length += length_here
    if embeds:
        result.append({"username": "Code198x", "allowed_mentions": {"parse": []}, "embeds": embeds})
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--items", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    items = json.loads(Path(args.items).read_text())
    payloads = messages(items)
    # Preserve the five-message ceiling, but report the exact omitted count.
    selected = payloads[:5]
    included = sum(len(payload["embeds"]) for payload in selected)
    if included < len(items):
        print(f"::warning::{len(items) - included} newly live items exceed the five-message ceiling; review new-items.json for recovery.")
    Path(args.out).write_text(json.dumps(selected, indent=2) + "\n")
    print(f"Prepared {included} item(s) in {len(selected)} message(s).")


if __name__ == "__main__":
    main()
