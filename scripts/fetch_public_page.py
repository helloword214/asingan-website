#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import ssl
import sys
import urllib.error
import urllib.request
from html import unescape
from html.parser import HTMLParser
from pathlib import Path


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._skip_depth = 0
        self._chunks: list[str] = []
        self.title: str | None = None
        self._in_title = False

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in {"script", "style", "noscript"}:
            self._skip_depth += 1
        if tag == "title":
            self._in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self._skip_depth:
            self._skip_depth -= 1
        if tag == "title":
            self._in_title = False
        if tag in {"p", "div", "section", "article", "li", "h1", "h2", "h3", "br"}:
            self._chunks.append("\n")

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        text = unescape(data).strip()
        if not text:
            return
        if self._in_title and not self.title:
            self.title = text
        self._chunks.append(text)

    def get_text(self) -> str:
        raw = " ".join(self._chunks)
        lines = [" ".join(line.split()) for line in raw.splitlines()]
        return "\n".join(line for line in lines if line)


def fetch_url(url: str, insecure: bool, timeout: int) -> tuple[str, str]:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/136.0 Safari/537.36"
        )
    }
    request = urllib.request.Request(url, headers=headers)
    context = None
    if insecure:
        context = ssl._create_unverified_context()

    with urllib.request.urlopen(request, timeout=timeout, context=context) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        html = response.read().decode(charset, errors="replace")
        return response.geturl(), html


def write_output(data: dict, output_path: Path | None) -> None:
    payload = json.dumps(data, indent=2, ensure_ascii=False)
    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(payload + "\n", encoding="utf-8")
    else:
        print(payload)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Fetch a public web page and extract basic readable text."
    )
    parser.add_argument("url", help="Public URL to fetch")
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional JSON output path",
    )
    parser.add_argument(
        "--insecure",
        action="store_true",
        help="Skip SSL certificate verification for broken public sites",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=20,
        help="Request timeout in seconds",
    )
    parser.add_argument(
        "--save-html",
        type=Path,
        help="Optional path to also save the raw HTML response",
    )
    args = parser.parse_args()

    try:
        final_url, html = fetch_url(args.url, insecure=args.insecure, timeout=args.timeout)
    except urllib.error.HTTPError as exc:
        error = {
            "url": args.url,
            "error": f"HTTP {exc.code}",
            "reason": str(exc.reason),
        }
        write_output(error, args.output)
        return 1
    except urllib.error.URLError as exc:
        error = {
            "url": args.url,
            "error": "URL Error",
            "reason": str(exc.reason),
        }
        write_output(error, args.output)
        return 1

    if args.save_html:
        args.save_html.parent.mkdir(parents=True, exist_ok=True)
        args.save_html.write_text(html, encoding="utf-8")

    parser_ = TextExtractor()
    parser_.feed(html)

    data = {
        "requestedUrl": args.url,
        "finalUrl": final_url,
        "title": parser_.title,
        "text": parser_.get_text(),
    }
    write_output(data, args.output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
