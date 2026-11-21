#!/usr/bin/env python3
"""Site audit over the built dist/ folder.

Run from astro/ after `npm run build`:
    python3 scripts/audit-site.py            # summary + gate result
    python3 scripts/audit-site.py --csv out.csv --json out.json

Body links = <a href> inside <main>, excluding breadcrumb <nav>s.
Exit code 1 when a gate check fails (broken links, H1 != 1, title > 60,
description > 160, invalid JSON-LD, orphan indexable pages).
"""
import json, os, re, sys, difflib
from collections import defaultdict
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

DIST = "dist"
SITE = "https://www.fairclaimcalculator.com"
# Legal pages are linked from the footer on every page; that is their normal
# home, so they are exempt from the body-link orphan check (reported in warns).
FOOTER_ONLY = {"/privacy/", "/terms/", "/accessibility/", "/disclaimer/", "/advertising-disclosure/"}
PLACEHOLDER = re.compile(r"\b(TODO|TBD|lorem ipsum|FIXME|XXX)\b", re.I)


def pages():
    for root, _, files in os.walk(DIST):
        for f in files:
            if f.endswith(".html"):
                p = os.path.join(root, f)
                url = "/" + os.path.relpath(p, DIST).replace("index.html", "").replace(os.sep, "/")
                yield url, p


def norm(href, base):
    if not href or href.startswith(("mailto:", "tel:", "javascript:", "#")):
        return None
    u = urljoin(SITE + base, href)
    pu = urlparse(u)
    if pu.netloc not in ("www.fairclaimcalculator.com", "fairclaimcalculator.com"):
        return None
    path = pu.path
    if not os.path.splitext(path)[1] and not path.endswith("/"):
        path += "/"
    return path


def exists(path):
    f = os.path.join(DIST, path.lstrip("/"))
    if path.endswith("/"):
        return os.path.exists(os.path.join(f, "index.html"))
    return os.path.exists(f)


def main():
    rows, outlinks, texts = {}, {}, {}
    broken = []
    for url, p in sorted(pages()):
        html = open(p, encoding="utf8").read()
        s = BeautifulSoup(html, "lxml")
        robots = (s.find("meta", attrs={"name": "robots"}) or {}).get("content", "")
        refresh = s.find("meta", attrs={"http-equiv": re.compile("refresh", re.I)})
        title = (s.title.string or "").strip() if s.title else ""
        desc = (s.find("meta", attrs={"name": "description"}) or {}).get("content", "")
        canon = (s.find("link", rel="canonical") or {}).get("href", "")
        schema, bad_ld = [], 0
        for tag in s.find_all("script", type="application/ld+json"):
            try:
                d = json.loads(tag.string or "")
            except Exception:
                bad_ld += 1
                continue
            items = d.get("@graph", [d]) if isinstance(d, dict) else d
            for it in items:
                t = it.get("@type") if isinstance(it, dict) else None
                schema += t if isinstance(t, list) else [t]
        main = s.find("main")
        words, body_links, missing_alt = 0, [], 0
        anchors = defaultdict(int)
        if main:
            for n in main.find_all("nav"):
                if "breadcrumb" in (n.get("aria-label", "") + " ".join(n.get("class", []))).lower():
                    n.decompose()
            for a in main.find_all("a", href=True):
                t = norm(a["href"], url)
                if t:
                    body_links.append(t)
                    anchors[(t, a.get_text(" ", strip=True).lower())] += 1
            for sc in main.find_all(["script", "style", "noscript", "template"]):
                sc.decompose()
            txt = main.get_text(" ", strip=True)
            words = len(re.findall(r"[A-Za-z0-9$%][\w$%.,'-]*", txt))
            texts[url] = txt
            missing_alt = sum(1 for i in main.find_all("img") if not i.has_attr("alt"))
        for a in s.find_all("a", href=True):
            t = norm(a["href"], url)
            if t and not exists(t):
                broken.append((url, a["href"]))
        m = re.search(r"Last (?:reviewed|updated)[:\s]*([A-Z][a-z]+ \d{1,2}, \d{4}|\d{4}-\d{2}-\d{2}|[A-Z][a-z]+ \d{4})", html)
        outlinks[url] = sorted(set(body_links) - {url})
        rows[url] = dict(
            url=url, title=title, title_len=len(title), desc_len=len(desc),
            h1=len(s.find_all("h1")), words=words, canonical=canon,
            noindex="noindex" in robots.lower(), redirect=bool(refresh),
            schema=sorted({x for x in schema if x}), bad_jsonld=bad_ld,
            out=len(outlinks[url]), last_reviewed=m.group(1) if m else "",
            placeholder=bool(PLACEHOLDER.search(texts.get(url, ""))), missing_alt=missing_alt,
            repeated_anchor=[f"{k[1]} -> {k[0]} x{v}" for k, v in anchors.items() if v > 2 and k[1]],
            ext_sources=len({a["href"] for a in (main.find_all("a", href=True) if main else []) if a["href"].startswith("http") and "fairclaimcalculator" not in a["href"]}),
        )
    inbound = defaultdict(set)
    for src, outs in outlinks.items():
        if rows[src]["redirect"]:
            continue
        for t in outs:
            inbound[t].add(src)
    for u, r in rows.items():
        r["in"] = len(inbound[u])

    live = {u: r for u, r in rows.items() if not r["redirect"] and u != "/404.html"}
    idx = {u: r for u, r in live.items() if not r["noindex"]}

    def dup(field):
        seen = defaultdict(list)
        for u, r in idx.items():
            seen[r[field]].append(u)
        return {k: v for k, v in seen.items() if len(v) > 1 and k}

    fails = {
        "broken_links": broken,
        "h1_not_1": [u for u, r in live.items() if r["h1"] != 1],
        "title_over_60": [(u, r["title_len"]) for u, r in idx.items() if r["title_len"] > 60],
        "desc_over_160": [(u, r["desc_len"]) for u, r in idx.items() if r["desc_len"] > 160],
        "bad_jsonld": [u for u, r in live.items() if r["bad_jsonld"]],
        "orphans_lt3_in": [(u, r["in"]) for u, r in idx.items() if r["in"] < 3 and u != "/" and u not in FOOTER_ONLY],
        "anchor_repeated_gt2": [(u, r["repeated_anchor"]) for u, r in idx.items() if r["repeated_anchor"]],
    }
    warns = {
        "dup_titles": dup("title"),
        "desc_under_110": [(u, r["desc_len"]) for u, r in idx.items() if r["desc_len"] < 110],
        "thin_lt700": [(u, r["words"]) for u, r in idx.items() if r["words"] < 700],
        "in_lt4": [(u, r["in"]) for u, r in idx.items() if r["in"] < 4],
        "footer_only_pages": [(u, r["in"]) for u, r in idx.items() if u in FOOTER_ONLY and r["in"] < 3],
        "out_lt3": [(u, r["out"]) for u, r in idx.items() if r["out"] < 3],
        "no_last_reviewed": [u for u, r in idx.items() if not r["last_reviewed"]],
        "placeholder": [u for u, r in live.items() if r["placeholder"]],
        "missing_alt": [u for u, r in live.items() if r["missing_alt"]],
    }
    args = sys.argv[1:]
    if "--csv" in args:
        import csv
        with open(args[args.index("--csv") + 1], "w", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=list(next(iter(rows.values())).keys()))
            w.writeheader()
            for r in rows.values():
                w.writerow({**r, "schema": "|".join(r["schema"])})
    if "--json" in args:
        json.dump({"rows": rows, "fails": fails, "warns": {k: v for k, v in warns.items()}},
                  open(args[args.index("--json") + 1], "w"), indent=1, default=list)
    if "--similarity" in args:
        prefix = args[args.index("--similarity") + 1]
        grp = sorted(u for u in live if u.startswith(prefix) and u != prefix)
        for u in grp:
            a = texts[u].split()
            best = max((difflib.SequenceMatcher(None, a, texts[v].split(), autojunk=False).ratio(), v)
                       for v in grp if v != u)
            print(f"{best[0]:.2f} {u} ~ {best[1]}")
    print(f"pages {len(rows)} | live {len(live)} | indexable {len(idx)} | noindex {len(live)-len(idx)} | redirects {sum(r['redirect'] for r in rows.values())}")
    bad = False
    for k, v in fails.items():
        print(f"GATE {k}: {len(v)}" + (f"  e.g. {v[:5]}" if v else ""))
        bad |= bool(v)
    for k, v in warns.items():
        print(f"warn {k}: {len(v)}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
