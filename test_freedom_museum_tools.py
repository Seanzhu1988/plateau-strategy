"""Freedom Trail museum tools follow explicit stop metadata."""

import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parent


class FreedomMuseumToolTests(unittest.TestCase):
    def test_reviewed_freedom_trail_museums_are_explicitly_enabled(self):
        trails = json.loads((ROOT / "trails.json").read_text())["trails"]
        trail = next(t for t in trails if t["id"] == "freedom-trail")
        flagged = [s["name"] for s in trail["stops"] if s.get("universal_gallery") is True]
        self.assertEqual(flagged, [
            "Old South Meeting House",
            "Old State House",
            "Paul Revere House",
            "USS Constitution",
        ])

    def test_handmade_player_uses_metadata_and_existing_photo_flow(self):
        page = (ROOT / "freedom-trail.html").read_text()
        self.assertIn("s.universal_gallery === true", page)
        self.assertIn('class="ft-gallery-tool i18n-skip"', page)
        self.assertIn('action="/universal-gallery"', page)
        self.assertIn('href="/universal-gallery?photo=1"', page)


if __name__ == "__main__":
    unittest.main()
