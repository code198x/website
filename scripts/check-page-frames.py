"""Require the shared shell on every built page and inventory rendering families."""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path

# These are executable/sample documents, loaded inside the site or supplied by
# the upstream browser player. They are not authored website page templates.
EMBEDDED_DOCUMENTS = {
    'emulators/index.html': 'Upstream standalone browser-player application',
    'emulators/template.html': 'Markup loaded by emulators/embed.js',
    'experiments/game-feel/playground.html': 'Game Feel page iframe',
    'experiments/game-feel/lessons.html': 'MovementExperiment lesson iframe',
    'experiments/aiming/lessons.html': 'AimingExperiment lesson iframe',
}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
        'link', 'meta', 'param', 'source', 'track', 'wbr'}


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.depth = 0
        self.roots: list[str] = []
        self.frames: set[str] = set()
        self.redirect = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == 'meta' and (attributes.get('http-equiv') or '').lower() == 'refresh':
            self.redirect = bool(attributes.get('content'))
        if 'data-site-frame' in attributes:
            self.frames.update((attributes.get('class') or '').split())
            if attributes.get('id') == 'main-content':
                self.frames.add('main-content')
        if tag == 'main' and attributes.get('id') == 'main-content':
            self.depth = 1
            return
        if self.depth:
            if self.depth == 1 and tag not in {'script', 'style'}:
                self.roots.append(tag + '.' + '.'.join((attributes.get('class') or '').split()))
            if tag not in VOID:
                self.depth += 1

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        if self.depth:
            self.depth -= 1


def inventory(root: Path) -> dict[str, list[str]]:
    families: dict[str, list[str]] = {}
    failures = []
    documents = sorted(root.rglob('*.html'))
    if not documents:
        raise ValueError(f'No HTML documents in {root}; build the site first.')
    for file in documents:
        relative = file.relative_to(root).as_posix()
        if relative in EMBEDDED_DOCUMENTS:
            continue
        page = Page()
        page.feed(file.read_text())
        if page.redirect:
            continue
        missing = {'main-content', 'site-bar', 'footer-container'} - page.frames
        if missing or not page.roots:
            failures.append(f'{relative}: missing shared frame/content ({", ".join(sorted(missing))})')
        route = '/' + relative.removesuffix('index.html')
        family = ' | '.join(page.roots)
        families.setdefault(family, []).append(route)
    if failures:
        raise ValueError('\n'.join(failures))
    if not families:
        raise ValueError('No public pages checked.')
    return families


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', type=Path, default=Path('dist'))
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    try:
        families = inventory(args.dist)
    except ValueError as error:
        parser.exit(1, f'{error}\n')
    if args.json:
        print(json.dumps(families))
    else:
        print(f'Shared frame verified on {sum(map(len, families.values()))} public pages ({len(families)} rendering families).')
