"""National Mall museum-tool coverage follows explicit stop metadata."""

import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parent


class MallMuseumToolTests(unittest.TestCase):
    def test_all_mall_museums_and_gallery_are_explicitly_enabled(self):
        trails = json.loads((ROOT / "trails.json").read_text())["trails"]
        mall = next(t for t in trails if t["id"] == "national-mall")
        flagged = [s["name"] for s in mall["stops"] if s.get("universal_gallery") is True]
        self.assertEqual(flagged, [
            "National Museum of the American Indian",
            "National Air and Space Museum",
            "National Gallery of Art",
            "Hirshhorn Museum",
            "National Museum of Natural History",
            "National Museum of American History",
            "National Museum of African American History and Culture",
        ])

    def test_handmade_player_uses_metadata_and_existing_consent_photo_flow(self):
        page = (ROOT / "national-mall.html").read_text()
        self.assertIn('id="nmGalleryTool" hidden', page)
        self.assertIn('galleryTool.hidden = s.universal_gallery !== true', page)
        self.assertIn('action="/universal-gallery"', page)
        self.assertIn('href="/universal-gallery?photo=1"', page)


if __name__ == "__main__":
    unittest.main()
