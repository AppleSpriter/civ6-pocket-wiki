"""Cache Civilopedia entry icons for the website and offline Android build.

Run after build_data.py: python3 scripts/fetch_icons.py
"""

from __future__ import annotations

import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from bs4 import BeautifulSoup


DIST = Path(__file__).resolve().parents[1] / "dist"
OUT = DIST / "images"
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; Civ6PocketReference/1.0)"}


def fetch(item):
    path = OUT / f"{item['id']}.png"
    if path.exists() and path.read_bytes().startswith(PNG_SIGNATURE):
        return path
    urls = [f"https://static.civilopedia.net/images/core/icon_{item['id']}.png"]
    for index, url in enumerate(urls):
        for attempt in range(3):
            try:
                response = requests.get(url, headers=HEADERS, timeout=25)
                response.raise_for_status()
                if not response.content.startswith(PNG_SIGNATURE):
                    raise ValueError(f"Not a PNG: {url}")
                path.write_bytes(response.content)
                return path
            except (requests.RequestException, ValueError):
                if attempt < 2:
                    time.sleep(attempt + 1)
        if index == 0:
            page = requests.get(item["source"], headers=HEADERS, timeout=25)
            page.raise_for_status()
            document = BeautifulSoup(page.text, "html.parser")
            icon = document.find("img", alt=item["name"])
            if icon and icon.get("src") and icon["src"] not in urls:
                urls.append(icon["src"])
    raise RuntimeError(f"No icon for {item['id']}")


def main():
    data = json.loads((DIST / "data.json").read_text(encoding="utf-8"))
    entries = sum((data[key] for key in ("technologies", "civics", "wonders", "mapFeatures", "resources", "cityStates")), [])
    OUT.mkdir(exist_ok=True)
    errors = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(fetch, item): item for item in entries}
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as exc:
                errors.append((futures[future]["id"], str(exc)))
    if errors:
        raise RuntimeError(f"{len(errors)} icons failed: {errors}")
    print(f"cached {len(entries)} icons in {OUT}")


if __name__ == "__main__":
    main()
