import json
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.tags = Counter()
        self.links = set()
        self.classes = Counter()
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        self.tags[tag] += 1
        attrs = dict(attrs)
        self.classes.update(attrs.get("class", "").split())
        if tag == "a" and attrs.get("href"):
            self.links.add(attrs["href"])


def check(site):
    for lang in ("", "hi"):
        root = site / lang
        home = Page(root / "index.html")
        assert home.tags["main"] == 1, f"{root}: expected one main landmark"
        assert home.classes["tw-feature-card"] == 3, f"{root}: expected three featured cards"
        assert home.classes["tw-latest-item"] > 0, f"{root}: expected latest articles"
        index = json.loads((root / "index.json").read_text(encoding="utf-8"))
        for entry in index:
            path = unquote(urlsplit(entry["permalink"]).path).strip("/")
            article = site / path / "index.html"
            assert Page(article).tags["h1"] == 1, f"{article}: expected one h1"

    for path in site.rglob("*.html"):
        for href in Page(path).links:
            url = urlsplit(href)
            if url.netloc not in ("", "techwadh.in") or not url.path.startswith("/"):
                continue
            target = site / unquote(url.path.lstrip("/"))
            assert target.is_file() or (target / "index.html").is_file(), f"{path}: broken link {href}"


if __name__ == "__main__":
    check(Path(sys.argv[1]))
