"""Visitor-facing private artwork guidance and language coverage."""

import json
from pathlib import Path
import unittest

from i18n_gallery_private import EXTRA


ROOT = Path(__file__).resolve().parent


class PrivateArtworkGuidanceTests(unittest.TestCase):
    def test_guidance_has_a_closeable_details_control_and_safe_boundaries(self):
        page = (ROOT / "universal-gallery.html").read_text()
        self.assertIn("<details class=\"ug-welcome\">", page)
        self.assertIn("Research a private artwork or an unidentified object", page)
        self.assertIn("Start with a photograph", page)
        self.assertIn("/universal-gallery?photo=1", page)
        for boundary in ("not authentication", "provenance", "sale valuation"):
            self.assertIn(boundary, page)

    def test_every_guidance_line_is_in_each_shipped_language_pack(self):
        for lang, column in (("zh", 0), ("es", 1), ("ko", 2), ("vi", 3)):
            script = (ROOT / ("i18n." + lang + ".js")).read_text()
            pack = json.loads(script[script.index("{"):script.rindex("}") + 1])
            for english, translations in EXTRA.items():
                with self.subTest(lang=lang, english=english):
                    self.assertEqual(pack.get(english), translations[column])


if __name__ == "__main__":
    unittest.main()
