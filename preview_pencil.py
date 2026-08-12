# -*- coding: utf-8 -*-
"""Render the Real Estate elevation at several pencil weights, side by side.

Not a gate, a way to decide. "More pencil" has a direction but no scale, and
guessing at it costs a round trip each time, so this prints the range on the
same drawing and the choice gets made by looking.

Edit VARIANTS and re-run. Each tuple is
    (baseFrequency, numOctaves, alpha, alphaShift, groupOpacity, label)
against the #graphite filter in landing-page.html, the values are overridden
in the live page rather than in the file, so nothing is written until a
setting is actually chosen.

    python3 app.py &
    python3 preview_pencil.py      # writes pencils.png
"""
import base64, pathlib
from playwright.sync_api import sync_playwright

# freq, octaves, alpha, alphaShift, groupOpacity, label
VARIANTS = [
 (0.42, 4, 1.10, -0.15, 0.88, "A · what is live now"),
 (0.30, 5, 1.60, -0.25, 0.80, "B · softer lead, more tooth"),
 (0.18, 5, 2.20, -0.35, 0.72, "C · heavy graphite, drawing-board"),
 (0.42, 4, 0.00,  0.00, 1.00, "D · no pencil at all, plotted"),
]
imgs = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=2)
    for freq, oct_, a, shift, op, label in VARIANTS:
        pg.goto("http://127.0.0.1:5055/", wait_until="domcontentloaded")
        pg.wait_for_timeout(800)
        pg.evaluate("showView('realestate')")
        pg.wait_for_timeout(700)
        pg.evaluate("""([f,o,a,s,op]) => {
            const t = document.querySelector('#graphite feTurbulence');
            const m = document.querySelector('#graphite feColorMatrix');
            const g = document.querySelector('.bp-svg > g[filter]');
            if (t) { t.setAttribute('baseFrequency', f); t.setAttribute('numOctaves', o); }
            if (m) m.setAttribute('values',
                '0 0 0 0 0.40  0 0 0 0 0.55  0 0 0 0 0.78  0 0 0 ' + a + ' ' + s);
            if (g) { g.setAttribute('opacity', op); if (a === 0) g.removeAttribute('filter'); }
        }""", [freq, oct_, a, shift, op])
        pg.wait_for_timeout(400)
        el = pg.query_selector(".bp-sheet"); bx = el.bounding_box()
        pg.screenshot(path="/tmp/pv.png", clip={"x": bx["x"]+300, "y": bx["y"]+250,
                                                "width": 560, "height": 330})
        imgs.append((label, base64.b64encode(pathlib.Path("/tmp/pv.png").read_bytes()).decode()))

    cells = "".join(
      '<div style="border:1px solid #ddd"><div style="font:600 13px sans-serif;padding:6px 9px;'
      'background:#f5f1e8">%s</div><img src="data:image/png;base64,%s" style="width:100%%;display:block"></div>'
      % (lab, b64) for lab, b64 in imgs)
    pg2 = b.new_page(viewport={"width": 1240, "height": 800}, device_scale_factor=2)
    pg2.set_content('<body style="margin:0;background:#fff;padding:10px">'
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">%s</div></body>' % cells)
    pg2.wait_for_timeout(400)
    pg2.screenshot(path="pencils.png", full_page=True)
    b.close()
print("ok")
