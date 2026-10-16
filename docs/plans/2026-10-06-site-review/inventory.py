"""Inventory the completed site and map routes to their Astro page owners."""

import csv
import json
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self.in_title = False
        self.in_main = False
        self.has_main = False
        self.redirect = False
        self.h1: list[str] = []
        self.in_h1 = False
        self.main_links: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "main":
            self.in_main = True
            self.has_main = True
        if tag == "h1":
            self.in_h1 = True
            self.h1.append("")
        if tag == "meta" and (attributes.get("http-equiv") or "").lower() == "refresh":
            self.redirect = True
        if tag == "a" and self.in_main:
            href = attributes.get("href") or ""
            if href.startswith("/") and not href.startswith("//"):
                self.main_links.add(urlsplit(href).path.rstrip("/") or "/")

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False
        if tag == "main":
            self.in_main = False
        if tag == "h1":
            self.in_h1 = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title += data
        if self.in_h1:
            self.h1[-1] += data


def source_pattern(source: Path) -> tuple[re.Pattern[str], tuple[int, int]]:
    route = str(source.relative_to(ROOT / "src/pages")).removesuffix(".astro")
    route = route.removesuffix("/index") if route != "index" else ""
    parts = route.split("/") if route else []
    segments = [".+" if part.startswith("[...") else "[^/]+" if part.startswith("[") else re.escape(part) for part in parts]
    priority = (sum(not part.startswith("[") for part in parts), -sum(part.startswith("[...") for part in parts))
    return re.compile("^/" + "/".join(segments) + "$"), priority


sources = sorted((ROOT / "src/pages").rglob("*.astro"))
patterns = [(source, *source_pattern(source)) for source in sources]
patterns.sort(key=lambda value: value[2], reverse=True)
records: list[dict] = []
for file in sorted((ROOT / "dist").rglob("*.html")):
    relative = file.relative_to(ROOT / "dist")
    route = "/" + (str(relative.parent) if file.name == "index.html" else str(relative))
    if route == "/.":
        route = "/"
    page = Page()
    page.feed(file.read_text())
    source = next((str(source.relative_to(ROOT)) for source, pattern, _ in patterns if pattern.fullmatch(route.removesuffix(".html"))), "")
    public_source = ROOT / "public" / relative
    kind = "redirect" if page.redirect else "standalone" if public_source.exists() and page.has_main else "page" if page.has_main else "auxiliary"
    if public_source.exists():
        source = str(public_source.relative_to(ROOT))
    elif route in {"/experiments/aiming/lessons.html", "/experiments/game-feel", "/experiments/game-feel/lessons.html"}:
        source = f"src/pages/experiments/{route.split('/')[2]}/[file].ts"
        kind = "embedded"
        assert (ROOT / source).exists(), source
    elif source == "src/pages/[...slug].astro" and kind == "page":
        content = ROOT / "src/content/curriculum" / route.removeprefix("/systems/").lstrip("/")
        if not content.with_suffix(".mdx").exists() and not (content / "index.mdx").exists():
            source = ""
    records.append({"route": route, "kind": kind, "source": source, "title": page.title.strip(), "h1": [" ".join(h.split()) for h in page.h1], "main_links": sorted(page.main_links)})

pages = [record for record in records if record["kind"] == "page"]
assert len(pages) > 100, f"Expected a completed site, found {len(pages)} content pages"
owners = Counter(record["source"] for record in pages)
inbound = Counter(link for record in pages for link in record["main_links"])
summary = {
    "html_artefacts": len(records),
    "kinds": dict(Counter(record["kind"] for record in records)),
    "astro_page_sources": len(sources),
    "source_page_counts": dict(owners),
    "unmatched_pages": [record["route"] for record in pages if not record["source"]],
    "main_heading_anomalies": [{"route": record["route"], "h1": record["h1"]} for record in pages if len(record["h1"]) != 1],
    "main_content_inbound": {route: inbound[route] for route in ["/vault", "/patterns", "/timeline", "/setup", "/start-here", "/foundations", "/craft"]},
    "records": records,
}
(OUT / "inventory.json").write_text(json.dumps(summary, indent=2) + "\n")
with (OUT / "routes.csv").open("w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["route", "kind", "source", "title", "h1_count", "main_content_inbound_pages"])
    for record in records:
        writer.writerow([record["route"], record["kind"], record["source"], record["title"], len(record["h1"]), inbound[record["route"]]])
with (OUT / "source-coverage.csv").open("w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["astro_source", "built_content_pages"])
    for source in sources:
        path = str(source.relative_to(ROOT))
        writer.writerow([path, owners[path]])
print(json.dumps({key: value for key, value in summary.items() if key != "records"}, indent=2))
