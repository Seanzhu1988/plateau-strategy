#!/usr/bin/env python3
"""Bake real Met Open Access images for the works named in met-cards.js.

One-shot build tool, not a runtime dependency: the API sends no CORS header,
so the page could never call it live anyway. Output met-art.json is committed;
images hotlink to images.metmuseum.org per the Met's CC0 Open Access program.
Every match is scored and printed for human review; low-confidence matches are
DROPPED, never guessed (the Atlas rule: a wrong artwork is worse than none).
"""
import json, re, time, urllib.request, urllib.parse

API = "https://collectionapi.metmuseum.org/public/collection/v1"

# (stop, work) -> better query, or None to skip (not a collection object)
OVERRIDES = {
 ("great-hall", "The three saucer domes"): None,
 ("great-hall", "The fresh flower arrangements"): None,
 ("dendur", "The temple itself"): "Temple of Dendur",
 ("dendur", "The reflecting pool and glass wall"): None,
 ("dendur", "The old graffiti"): None,
 ("egyptian", "William the hippopotamus"): "Hippopotamus William faience",
 ("egyptian", "The statues of Hatshepsut"): "Seated Statue of Hatshepsut",
 ("egyptian", "The Tomb of Perneb"): "Tomb of Perneb",
 ("greek-roman", "The New York Kouros"): "Marble statue of a kouros",
 ("greek-roman", "The Leon Levy and Shelby White Court"): None,
 ("greek-roman", "The column from the Temple of Artemis at Sardis"): "column Temple of Artemis Sardis",
 ("arms-armor", "The Equestrian Court"): None,
 ("arms-armor", "The armor of Henry VIII"): "Armor Garniture Henry VIII",
 ("arms-armor", "The Japanese armor galleries"): None,
 ("medieval", "The choir screen from Valladolid Cathedral"): "choir screen Valladolid",
 ("medieval", "The Byzantine galleries"): None,
 ("medieval", "The medieval stained glass"): None,
 ("lehman", "The recreated townhouse rooms"): None,
 ("american-court", "The Tiffany loggia"): "loggia Laurelton Hall Tiffany",
 ("american-court", "Saint-Gaudens, Diana"): "Diana Saint-Gaudens",
 ("grand-stair", "The staircase itself"): None,
 ("asian-astor", "The Astor Chinese Garden Court"): None,
 ("asian-astor", "The Buddha of Medicine wall mural"): "Buddha of Medicine Bhaishajyaguru",
 ("asian-astor", "The Ming scholar's room"): None,
 ("islamic", "The Damascus Room"): "Damascus Room",
 ("islamic", "The mihrab from Isfahan"): "Mihrab Isfahan",
 ("islamic", "The Moroccan Court"): None,
}

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "PlateauStrategy-met-bake/1.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

def tokens(s):
    return set(re.findall(r"[a-z]{3,}", s.lower()))

STOP = {"the","and","with","from","for"}

def score(query, artist_hint, obj):
    qt = tokens(query) - STOP
    ot = tokens(obj.get("title","")) | tokens(obj.get("objectName",""))
    t = len(qt & ot) / max(1, len(qt))
    a = 0.0
    if artist_hint:
        if tokens(artist_hint) & tokens(obj.get("artistDisplayName","")): a = 1.0
    return t + 0.5 * a

cards = json.loads(re.search(r"window\.MET_CARDS\s*=\s*(\{.*\});?\s*$",
        open("met-cards.js").read(), re.S).group(1).rstrip(";\n "))

out, review = {}, []
try:
    out = json.load(open("met-art.json"))
except Exception:
    pass
done = {(k, a["work"]) for k, v in out.items() for a in v}
for stop_key, card in cards.items():
    for h in card.get("highlights", []):
        work = h["work"]
        key = (stop_key, work)
        if key in done:
            continue
        if key in OVERRIDES and OVERRIDES[key] is None:
            continue
        query = OVERRIDES.get(key)
        artist_hint = None
        if query is None:
            # "Artist, Title" convention in the cards
            if "," in work:
                artist_hint, query = [x.strip() for x in work.split(",", 1)]
            else:
                query = work
        try:
            ids = get(f"{API}/search?hasImages=true&q={urllib.parse.quote(query)}").get("objectIDs") or []
        except Exception as e:
            review.append((stop_key, work, "SEARCH-FAIL", str(e)[:40])); continue
        best, best_s = None, 0.0
        for oid in ids[:6]:
            time.sleep(0.6)
            try: o = get(f"{API}/objects/{oid}")
            except Exception: continue
            if not o.get("primaryImageSmall") or not o.get("isPublicDomain"): continue
            s = score(query, artist_hint, o)
            if s > best_s: best, best_s = o, s
        if best and best_s >= 0.6:
            out.setdefault(stop_key, []).append({
                "work": work,
                "title": best["title"],
                "artist": best.get("artistDisplayName") or "",
                "date": best.get("objectDate") or "",
                "img": best["primaryImageSmall"],
                "href": best["objectURL"],
            })
            review.append((stop_key, work, f"OK {best_s:.2f}", best["title"][:60]))
        else:
            review.append((stop_key, work, f"DROP {best_s:.2f}",
                           (best or {}).get("title","no candidate")[:60]))
        time.sleep(0.6)

json.dump(out, open("met-art.json", "w"), indent=1, ensure_ascii=False)
print(f"\n{sum(len(v) for v in out.values())} works matched across {len(out)} stops\n")
for r in review:
    print(f"  {r[2]:10s} {r[0]:16s} | {r[1][:44]:44s} -> {r[3]}")
