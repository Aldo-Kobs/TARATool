#!/usr/bin/env python3
"""Build a documentation PDF from Markdown; defaults to docs/user-guide.md.

Copyright (C) 2026 Aldo-Kobs. SPDX-License-Identifier: GPL-3.0-or-later
Added 2026-09-17; see NOTICE.md and docs/MODIFICATIONS.md.
"""
from __future__ import annotations

import argparse
from html import escape
import re
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.parse import urljoin

import markdown
import pymupdf
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs" / "user-guide.md"
DOC_URL = "https://github.com/Aldo-Kobs/TARATool/blob/master/docs/user-guide.md"
CSS = """
@page { size: A4; }
body { font: 10pt/1.45 Arial, sans-serif; color: #18232e; margin: 0; }
h1 { font-size: 24pt; margin: 0 0 16pt; color: #123f57; }
h2 { font-size: 16pt; margin: 22pt 0 9pt; color: #123f57; }
h3 { font-size: 12pt; margin: 16pt 0 7pt; }
h1, h2, h3, h4 { break-after: avoid; }
h2#contents { break-before: page; }
h2#contents + ol { break-inside: avoid; }
p, li { orphans: 3; widows: 3; }
p { margin: 7pt 0; }
ul, ol { padding-left: 19pt; }
li { margin: 3pt 0; }
a { color: #125b81; text-decoration: underline; overflow-wrap: anywhere; }
table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin: 10pt 0; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th, td { padding: 6pt; border: 0.5pt solid #c7d4db; text-align: left;
          vertical-align: top; overflow-wrap: anywhere; }
th { background: #e9f0f4; }
code { font-family: monospace; font-size: 0.9em; overflow-wrap: anywhere; }
pre { white-space: pre-wrap; padding: 9pt; background: #f0f4f6; break-inside: avoid; }
blockquote { border-left: 3pt solid #89a7b8; padding-left: 10pt; margin-left: 0; }
"""


def public_link(match: re.Match, doc_url: str = DOC_URL) -> str:
    """Keep internal/external links; make repository file links usable in a PDF."""
    href = match.group(1)
    if href.startswith("#") or re.match(r"[a-zA-Z][a-zA-Z0-9+.-]*:", href):
        return match.group(0)
    return f'href="{urljoin(doc_url, href)}"'


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser-executable", type=Path,
                        help="Use an installed Chrome/Chromium instead of Playwright Chromium.")
    parser.add_argument("--source", type=Path, default=SOURCE,
                        help="Markdown source (default: docs/user-guide.md); PDF is written beside it.")
    args = parser.parse_args()
    source_path = args.source.expanduser().resolve()
    output_path = source_path.with_suffix(".pdf")
    source = source_path.read_text(encoding="utf-8")
    title_match = re.search(r"^# (.+)$", source, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else source_path.stem
    doc_url = "https://github.com/Aldo-Kobs/TARATool/blob/master/" + source_path.relative_to(ROOT).as_posix()
    if re.search(r"^(<<<<<<< |=======\s*$|>>>>>>> )", source, re.MULTILINE):
        raise SystemExit("Resolve merge-conflict markers in the Markdown source before building.")
    edition_match = re.search(r"^Edition: ([^·\n]+)", source, re.MULTILINE)
    edition = escape(edition_match.group(1).strip()) if edition_match else ""
    content = markdown.markdown(source, extensions=["tables", "fenced_code", "toc"])
    content = re.sub(r'href="([^"]+)"', lambda match: public_link(match, doc_url), content)
    html = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<title>' + escape(title) + '</title><style>' + CSS +
            '</style></head><body>' + content + '</body></html>')
    with TemporaryDirectory(prefix="tara-user-guide-") as directory:
        rendered = Path(directory) / "rendered.pdf"
        complete = Path(directory) / "complete.pdf"
        with sync_playwright() as playwright:
            options = {"headless": True}
            if args.browser_executable:
                options["executable_path"] = str(args.browser_executable.expanduser().resolve())
            browser = playwright.chromium.launch(**options)
            try:
                page = browser.new_page()
                # Rendering the guide requires no CDN or other external requests.
                page.route("**/*", lambda route: route.abort())
                page.set_content(html, wait_until="load")
                page.pdf(
                    path=str(rendered), format="A4", print_background=True,
                    tagged=True, outline=True, display_header_footer=True,
                    margin={"top": "17mm", "bottom": "19mm", "left": "16mm", "right": "16mm"},
                    header_template="<span></span>",
                    footer_template=(
                        '<div style="font:9px Arial;width:100%;text-align:center;color:#536775">'
                        f'{escape(title)} · {edition} · '
                        '<span class="pageNumber"></span> / <span class="totalPages"></span></div>'
                    ),
                )
            finally:
                browser.close()
        with pymupdf.open(rendered) as pdf:
            metadata = pdf.metadata
            metadata.update(
                title=title,
                author="Aldo-Kobs",
                subject="TARA Tool documentation; GPL-3.0-or-later; see copyright notices in the document",
            )
            pdf.set_metadata(metadata)
            pdf.embfile_add("LICENSE", (ROOT / "LICENSE").read_bytes(), filename="LICENSE",
                            desc="GNU GPL v3 with original and fork notices; GPL-3.0-or-later")
            pdf.save(complete, garbage=4, deflate=True)
            page_count = len(pdf)
        output_path.write_bytes(complete.read_bytes())
    print(f"Built {output_path.relative_to(ROOT)}: {page_count} pages; LICENSE attached.")


if __name__ == "__main__":
    main()
