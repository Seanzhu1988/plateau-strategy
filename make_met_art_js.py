#!/usr/bin/env python3
"""met-art.json -> met-art.js. Run after bake_met_art.py."""
import json
art = json.load(open("met-art.json"))
n = sum(len(v) for v in art.values())
js = ("/* Baked from the Met's Open Access API (CC0) by bake_met_art.py.\n"
      f" * {n} works across {len(art)} stops. Regenerate: python3 bake_met_art.py\n"
      " * && python3 make_met_art_js.py. Never hand-edit; fix the bake instead. */\n"
      "window.MET_ART = " + json.dumps(art, indent=1, ensure_ascii=False) + ";\n")
open("met-art.js", "w").write(js)
print(f"met-art.js written: {n} works, {len(art)} stops")
