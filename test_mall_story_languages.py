"""Audit the Moongate connection and its shipped text in the shared packs."""
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parent


class DetourText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.lines = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == 'details' and values.get('id') == 'moongate-detour':
            self.active = True
        if self.active and values.get('placeholder'):
            self.lines.append(values['placeholder'])

    def handle_endtag(self, tag):
        if tag == 'details':
            self.active = False

    def handle_data(self, value):
        value = re.sub(r'\s+', ' ', value).strip()
        if self.active and re.search(r'[A-Za-z]', value):
            self.lines.append(value)


class MallStoryAudit(unittest.TestCase):
    def test_every_detour_line_and_search_placeholder_has_four_shipped_translations(self):
        parser = DetourText()
        parser.feed((ROOT / 'national-mall.html').read_text())
        self.assertGreater(len(parser.lines), 10)
        for lang in ('zh', 'es', 'ko', 'vi'):
            script = (ROOT / ('i18n.' + lang + '.js')).read_text()
            pack = json.loads(script[script.index('{'):script.rindex('}') + 1])
            for line in parser.lines:
                with self.subTest(lang=lang, line=line):
                    self.assertTrue(pack.get(line), 'Missing shared language-pack entry')
                    self.assertNotEqual(pack[line], line, 'English fallback is not a translation')

    def test_connected_return_names_the_actual_next_stop_without_reordering_the_walk(self):
        trails = json.loads((ROOT / 'trails.json').read_text())['trails']
        mall = next(t for t in trails if t['id'] == 'national-mall')
        castle = next(i for i, s in enumerate(mall['stops']) if s['model'] == 'castle')
        next_stop = mall['stops'][castle + 1]['name']
        page = (ROOT / 'national-mall.html').read_text()
        self.assertIn('The next numbered stop is the ' + next_stop + '.', page,
                      'Route changed: audit and translate the return narration again')
        self.assertIn('Recorded audio for this new detour is not available yet.', page)
        self.assertIn('https://gardens.si.edu/gardens/haupt-garden/', page)


if __name__ == '__main__':
    unittest.main()
