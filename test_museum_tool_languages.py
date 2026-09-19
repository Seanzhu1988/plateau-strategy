"""Language coverage for Universal Gallery museum-stop tools."""

import json
from pathlib import Path
import unittest

from i18n_museum_tools import EXTRA


ROOT = Path(__file__).resolve().parent


class MuseumToolLanguageTests(unittest.TestCase):
    def test_tool_lines_ship_in_each_shared_pack(self):
        for lang, column in (("zh", 0), ("es", 1), ("ko", 2), ("vi", 3)):
            script = (ROOT / ("i18n." + lang + ".js")).read_text()
            pack = json.loads(script[script.index("{"):script.rindex("}") + 1])
            for english, translations in EXTRA.items():
                with self.subTest(lang=lang, english=english):
                    self.assertEqual(pack.get(english), translations[column])


if __name__ == "__main__":
    unittest.main()
