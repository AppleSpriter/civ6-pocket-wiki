"""Build compact, attributed Civ VI rules data from Civilopedia pages.

Run: python3 -m pip install -r scripts/requirements.txt
     python3 scripts/build_data.py
The generated JSON contains game-rule facts and concise ability text, not history articles.
"""

from __future__ import annotations

import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


BASE = "https://www.civilopedia.net/zh-CN/gathering-storm/"
OUT = Path(__file__).resolve().parents[1] / "dist" / "data.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; Civ6PocketReference/1.0)"}


def soup(path: str) -> BeautifulSoup:
    url = urljoin(BASE, path)
    for attempt in range(3):
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.text, "html.parser")
        except requests.RequestException:
            if attempt == 2:
                raise
            time.sleep(attempt + 1)
    raise RuntimeError(url)


def text(node) -> str:
    return re.sub(r"\s+", " ", node.get_text(" ", strip=True)).strip() if node else ""


def item_id(path: str) -> str:
    return path.rstrip("/").split("/")[-1]


def get_catalog(category: str, prefix: str):
    page = soup(category + "/")
    result = []
    for group in page.select("[data-page-group]"):
        era = group.get("data-group-name", "")
        for link in group.select("a[data-page-link][href]"):
            path = link["href"]
            if item_id(path).startswith(prefix):
                result.append({"id": item_id(path), "name": text(link), "era": era, "path": path})
    return result


def detail_root(page):
    heading = page.find("h1")
    if not heading:
        raise ValueError("missing h1")
    return heading.parent.parent


def section(root, name):
    for block in root.select("div._8lp4s90"):
        title = block.find("p", class_="_8lp4s91")
        if text(title) == name:
            return block
    return None


def links(node, category=None):
    found = []
    if not node:
        return found
    for link in node.select("a[href]"):
        href = link["href"]
        if category and f"/{category}/" not in href:
            continue
        img = link.find("img")
        label = text(link) or (img.get("title") or img.get("alt", "") if img else "")
        if label:
            found.append({"name": label, "id": item_id(href), "category": href.split("/")[3], "url": urljoin(BASE, href)})
    return found


def field_rows(block):
    fields = {}
    current = ""
    if not block:
        return fields
    for row in block.find_all("div", class_="_8lp4s92"):
        label = row.find("div", class_="_8lp4s94")
        if label:
            current = text(label)
            fields.setdefault(current, [])
            continue
        content = text(row)
        row_links = links(row)
        if current and (content or row_links):
            fields[current].append({"text": content, "links": row_links})
    return fields


def strings(fields, name):
    return [r["text"] for r in fields.get(name, []) if r["text"]]


def linked(fields, name):
    return [link for row in fields.get(name, []) for link in row["links"]]


def get_unlocks(block):
    output = []
    if not block:
        return output
    for link in links(block):
        if link["category"] in {"wonders", "districts", "buildings", "units", "improvements", "governments"} and (link["category"] != "wonders" or link["id"].startswith("building_")):
            output.append(link)
    seen = set()
    return [x for x in output if not (x["url"] in seen or seen.add(x["url"]))]


def extract_tree(entry, category):
    page = soup(entry["path"])
    root = detail_root(page)
    req = field_rows(section(root, "要求"))
    prerequisite_field = "所需的科技" if category == "technologies" else "所需的市政"
    prereq_category = category
    prereqs = [x["id"] for x in linked(req, prerequisite_field) if x["category"] == prereq_category]
    cost_labels = strings(req, "研究费用" if category == "technologies" else "文化值消耗")
    cost_match = re.search(r"(\d[\d,]*)", " ".join(cost_labels))
    result = {
        "id": entry["id"], "name": entry["name"], "era": entry["era"],
        "prereq": prereqs,
        "boost": " ".join(strings(req, "提升条件")),
        "cost": int(cost_match.group(1).replace(",", "")) if cost_match else None,
        "unlocks": get_unlocks(section(root, "解锁")),
        "source": urljoin(BASE, entry["path"]),
    }
    return result


def primary_copy(root, heading):
    panel = root.find("div", class_="_1kgronc")
    if not panel:
        return ""
    for block in panel.select("._1kgronf"):
        label = block.find("div", class_="_1k50iii3")
        if text(label) == heading:
            value = block.find("div", class_="_1k50iii1")
            if value:
                return text(value)
    return ""


def extract_wonder(entry):
    page = soup(entry["path"])
    root = detail_root(page)
    req = field_rows(section(root, "要求"))
    prod_match = re.search(r"(\d[\d,]*)", " ".join(strings(req, "生产力消耗")))
    prereq = linked(req, "科技") + linked(req, "市政")
    placement = strings(req, "放置")
    adjacent = strings(req, "邻接物")
    buildings = strings(req, "建筑")
    features = section(root, "特点")
    traits = []
    skip_next = False
    if features:
        for row in features.find_all("div", class_="_8lp4s92"):
            value = text(row)
            if not value:
                continue
            if value.startswith("游戏开始的时代如晚于以下时代"):
                skip_next = True
                continue
            if skip_next:
                skip_next = False
                continue
            if "摇滚音乐会提供的旅游业绩" in value:
                continue
            traits.append(value)
    return {
        "id": entry["id"], "name": entry["name"], "era": entry["era"],
        "effect": primary_copy(root, "说明"),
        "traits": traits,
        "prereq": prereq, "requiresBuilding": buildings,
        "adjacent": adjacent, "terrain": placement,
        "cost": int(prod_match.group(1).replace(",", "")) if prod_match else None,
        "source": urljoin(BASE, entry["path"]),
    }


def extract_ability(root):
    panel = root.find("div", class_="_1kgronc")
    return {
        "name": text(panel.find("p", class_="_1k50iii4")) if panel else "",
        "text": text(panel.find("p", class_="_1k50iii5")) if panel else "",
    }


def extract_civilization(entry):
    page = soup(entry["path"])
    return {"id": entry["id"], "name": entry["name"], "ability": extract_ability(detail_root(page)), "source": urljoin(BASE, entry["path"])}


def extract_leader(entry):
    page = soup(entry["path"])
    root = detail_root(page)
    features = field_rows(section(root, "特点"))
    civs = linked(features, "文明")
    if not civs:
        civs = links(section(root, "特点"), "civilizations")
    return {
        "id": entry["id"], "name": entry["name"], "civilizations": [x["id"] for x in civs],
        "ability": extract_ability(root), "source": urljoin(BASE, entry["path"]),
    }


def extract_great_person(entry):
    root = detail_root(soup(entry["path"]))
    panel = root.find("div", class_="_1kgronc")
    overview = panel.find("div", class_="_1kgronh") if panel else None
    features = section(root, "特点")
    feature_text = text(features)
    era = next((name for name in ERA_ORDER if name in feature_text), "")
    effects = []
    works = []
    activation = []
    current = ""
    if overview:
        for block in overview.find_all("div", class_="_1kgronf", recursive=False):
            label = text(block.find("div", class_="_1k50iii3"))
            if label:
                current = label
                continue
            if current == "历史背景":
                continue
            names = block.find_all("p", class_="_1k50iii4")
            descriptions = block.find_all("p", class_="_1k50iii5")
            if names and descriptions:
                effects.extend({"name": text(name), "text": text(description)} for name, description in zip(names, descriptions))
                continue
            value = text(block)
            if not value:
                continue
            if current == "巨作":
                if "激活" not in value:
                    works.extend(text_part for text_part in block.stripped_strings if text_part.strip())
                    continue
            if current == "特色能力" and not effects:
                effects.append({"name": "能力", "text": value})
            else:
                activation.append(value)
    return {
        "id": entry["id"], "name": entry["name"], "type": entry["type"], "era": era,
        "effects": effects, "works": works, "activation": " ".join(activation),
        "source": urljoin(BASE, entry["path"]),
    }


ERA_ORDER = ["远古时代", "古典时期", "中世纪", "文艺复兴时期", "工业时代", "现代", "原子能时代", "信息时代", "未来时代"]

UNLOCK_CATEGORIES = {
    "units": "unit_",
    "buildings": "building_",
    "districts": "district_",
    "improvements": "",  # Includes route_* entries from the same source catalog.
    "governments": "",
}


def unlock_catalog():
    entries = []
    for category, prefix in UNLOCK_CATEGORIES.items():
        entries.extend(
            {**entry, "category": category}
            for entry in get_catalog(category, prefix)
            if entry["id"] != "intro"
        )
    return entries


def rows_by_label(block):
    """Keep the source's named groups and unlabelled game stats in display order."""
    groups = []
    current = None
    if not block:
        return groups
    for row in block.find_all("div", class_="_8lp4s92", recursive=False):
        label = row.find("div", class_="_8lp4s94")
        if label:
            current = {"label": text(label), "items": []}
            groups.append(current)
            continue
        value = text(row)
        if not value:
            current = None
            continue
        row_links = links(row)
        if current and current["label"] == "科技" and row_links and all(
            link["category"] in {"features", "resources"} for link in row_links
        ):
            current = None
        if current is None:
            current = {"label": "", "items": []}
            groups.append(current)
        current["items"].append({"text": value, "links": row_links})
    return [group for group in groups if group["items"]]


def extract_unlock(entry):
    root = detail_root(soup(entry["path"]))
    panel = root.find("div", class_="_1kgronc")
    abilities = []
    if panel:
        for block in panel.select("div._1kgronf"):
            name = text(block.find("p", class_="_1k50iii4"))
            value = text(block.find("p", class_="_1k50iii5"))
            if name and value:
                abilities.append({"name": name, "text": value})
    return {
        "id": entry["id"], "name": entry["name"], "category": entry["category"],
        "group": entry["era"], "description": primary_copy(root, "说明"),
        "abilities": abilities,
        "features": rows_by_label(section(root, "特点")),
        "requirements": rows_by_label(section(root, "要求")),
        "source": urljoin(BASE, entry["path"]),
    }


def map_feature_catalog():
    return [entry for entry in get_catalog("features", "") if entry["era"] in {"地形", "地貌", "自然奇观"}]


def resource_catalog():
    return get_catalog("resources", "resource_")


def city_state_catalog():
    return get_catalog("citystates", "civilization_")


def extract_map_feature(entry):
    root = detail_root(soup(entry["path"]))
    groups = rows_by_label(section(root, "特点"))
    return {
        "id": entry["id"], "name": entry["name"], "kind": entry["era"],
        "description": primary_copy(root, "说明"),
        "traits": [row["text"] for group in groups if group["label"] != "有效资源" for row in group["items"]],
        "validResources": [link for group in groups if group["label"] == "有效资源" for row in group["items"] for link in row["links"] if link["category"] == "resources"],
        "source": urljoin(BASE, entry["path"]),
    }


def extract_resource(entry):
    root = detail_root(soup(entry["path"]))
    traits = rows_by_label(section(root, "特点"))
    requirements = rows_by_label(section(root, "要求"))
    uses = rows_by_label(section(root, "用途"))
    return {
        "id": entry["id"], "name": entry["name"], "type": entry["era"] or "特殊",
        "traits": [row["text"] for group in traits for row in group["items"]],
        "placements": [link for group in requirements if group["label"] == "放置" for row in group["items"] for link in row["links"] if link["category"] == "features"],
        "improvements": [link for group in uses if group["label"] == "提高" for row in group["items"] for link in row["links"] if link["category"] == "improvements"],
        "requirements": requirements, "uses": uses,
        "source": urljoin(BASE, entry["path"]),
    }


def extract_city_state(entry):
    root = detail_root(soup(entry["path"]))
    panel = root.find("div", class_="_1kgronc")
    envoy_text = suzerain = ""
    if panel:
        for block in panel.select("div._1kgronf"):
            name = text(block.find("p", class_="_1k50iii4"))
            value = text(block.find("p", class_="_1k50iii5"))
            if name.endswith("城邦") and value and not envoy_text:
                envoy_text = value
            if "宗主国加成" in name and value and not suzerain:
                suzerain = value
    if not envoy_text or not suzerain:
        raise ValueError(f"missing city-state bonuses: {entry['id']}")
    return {
        "id": entry["id"], "name": entry["name"], "type": entry["era"],
        "envoyBonuses": [part.strip() for part in re.split(r"(?=派遣\d+位)", envoy_text) if part.strip()],
        "suzerain": suzerain,
        "source": urljoin(BASE, entry["path"]),
    }


def collect_map_data():
    return {
        "mapFeatures": collect(map_feature_catalog(), extract_map_feature, "mapFeatures"),
        "resources": collect(resource_catalog(), extract_resource, "resources"),
        "cityStates": collect(city_state_catalog(), extract_city_state, "cityStates"),
    }


def great_people_catalog():
    return [
        {**entry, "type": entry["era"]}
        for entry in get_catalog("greatpeople", "great_person_individual_")
    ]


def collect(entries, extractor, label):
    result = []
    errors = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(extractor, item): item for item in entries}
        for future in as_completed(futures):
            try:
                result.append(future.result())
            except Exception as exc:
                errors.append((futures[future]["path"], str(exc)))
    if errors:
        print(label, "failed:", errors)
        raise RuntimeError(f"{label}: {len(errors)} pages failed")
    by_id = {item["id"]: item for item in result}
    print(label, len(by_id))
    return [by_id[item["id"]] for item in entries if item["id"] in by_id]


def main():
    if sys.argv[1:] == ["--map-only"]:
        data = json.loads(OUT.read_text(encoding="utf-8"))
        data.update(collect_map_data())
        OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print("wrote", OUT, OUT.stat().st_size, "bytes")
        return
    if sys.argv[1:] == ["--unlocks-only"]:
        data = json.loads(OUT.read_text(encoding="utf-8"))
        data["unlocks"] = collect(unlock_catalog(), extract_unlock, "unlocks")
        OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print("wrote", OUT, OUT.stat().st_size, "bytes")
        return
    if sys.argv[1:] == ["--great-people-only"]:
        data = json.loads(OUT.read_text(encoding="utf-8"))
        data["greatPeople"] = collect(great_people_catalog(), extract_great_person, "greatPeople")
        OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print("wrote", OUT, OUT.stat().st_size, "bytes")
        return
    tech_catalog = get_catalog("technologies", "tech_")
    civic_catalog = get_catalog("civics", "civic_")
    wonder_catalog = get_catalog("wonders", "building_")
    civ_catalog = get_catalog("civilizations", "civilization_")
    leader_catalog = get_catalog("civilizations", "leader_")
    data = {
        "ruleset": "资料片：风云变幻（含相关 DLC 条目）",
        "source": BASE,
        "technologies": collect(tech_catalog, lambda x: extract_tree(x, "technologies"), "technologies"),
        "civics": collect(civic_catalog, lambda x: extract_tree(x, "civics"), "civics"),
        "wonders": collect(wonder_catalog, extract_wonder, "wonders"),
        "civilizations": collect(civ_catalog, extract_civilization, "civilizations"),
        "leaders": collect(leader_catalog, extract_leader, "leaders"),
        "greatPeople": collect(great_people_catalog(), extract_great_person, "greatPeople"),
        "unlocks": collect(unlock_catalog(), extract_unlock, "unlocks"),
    }
    data.update(collect_map_data())
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
