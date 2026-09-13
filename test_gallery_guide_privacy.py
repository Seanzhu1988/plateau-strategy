"""The alternate public guide must never revive a visitor photograph.

Full Flask responses, synthetic guide records, throwaway startup storage, and
blocked network/generation calls. No real photographs or production data.
Run: python3 -m unittest test_gallery_guide_privacy
"""

import copy
from contextlib import ExitStack
from html.parser import HTMLParser
import json
import os
import re
import tempfile
import unittest
from unittest.mock import patch


_boot_data = tempfile.TemporaryDirectory(prefix="gallery-guide-privacy-boot-")
os.environ["DATA_DIR"] = _boot_data.name
os.environ["DISCOVERY_ENABLED"] = "false"
os.environ["DISPATCH_REMINDERS"] = "false"

import app as site
import gallery_reader


PHOTO_ID = "p_" + "e" * 32
PHOTO_URL = "/api/gallery/photos/" + PHOTO_ID
LICENSED_IMAGE = "https://museum.example/collection/licensed.jpg"
STORY = "This synthetic saved guide remains readable without any new generation."
GUIDE = {
    "title": "Synthetic privacy audit vessel",
    "artist": "Fixture maker",
    "museum": "Fixture Museum",
    "city": "fixture-city",
    "item_number": "PRIVACY-42",
    "slug": "synthetic-privacy-audit-vessel",
}


class GuideMarkup(HTMLParser):
    def __init__(self, markup):
        super().__init__()
        self.heroes = []
        self.structured = []
        self._collecting = False
        self._parts = []
        self.feed(markup)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "img" and "hero" in attrs.get("class", "").split():
            self.heroes.append(attrs)
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._collecting = True
            self._parts = []

    def handle_data(self, data):
        if self._collecting:
            self._parts.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._collecting:
            self.structured.append(json.loads("".join(self._parts)))
            self._collecting = False


class GalleryGuidePrivacyTests(unittest.TestCase):
    def setUp(self):
        self.data = tempfile.TemporaryDirectory(prefix="gallery-guide-privacy-")
        self.addCleanup(self.data.cleanup)
        self.context = ExitStack()
        self.addCleanup(self.context.close)
        self.context.enter_context(patch.dict(os.environ, {
            "DATA_DIR": self.data.name,
            "ANTHROPIC_API_KEY": "",
            "ELEVENLABS_API_KEY": "",
        }))
        self.context.enter_context(patch.dict(site.app.config, TESTING=True))
        self.context.enter_context(patch.object(site, "DATA_DIR", self.data.name))
        self.context.enter_context(patch.object(site, "_skip_traffic", return_value=True))
        self.context.enter_context(patch.object(site, "_ticket_offer", return_value=None))
        self.network = self.context.enter_context(patch(
            "requests.sessions.Session.request",
            side_effect=AssertionError("Network prohibited in guide privacy tests")))
        self.generation = self.context.enter_context(patch.object(
            gallery_reader, "read_for",
            side_effect=AssertionError("Generation prohibited in guide privacy tests")))
        self.client = site.app.test_client()

    def tearDown(self):
        self.network.assert_not_called()
        self.generation.assert_not_called()

    def render(self, guide, cached):
        before = copy.deepcopy(guide)
        reading = {"text": STORY} if cached else None
        with patch.object(site.discovery_mod, "gallery_guide", return_value=guide), \
                patch.object(gallery_reader, "cached_reading", return_value=reading):
            response = self.client.get("/gallery-guides/" + GUIDE["slug"])
        self.assertEqual(response.status_code, 200)
        self.assertEqual(guide, before, "Public rendering must not mutate the stored discovery")
        markup = response.get_data(as_text=True)
        parsed = GuideMarkup(markup)
        self.assertEqual(len(parsed.structured), 1)
        self.assertEqual(parsed.structured[0]["name"], GUIDE["title"])
        match = re.search(r"var f=(.*?);fetch\(", markup, flags=re.S)
        payload = json.loads(match.group(1)) if match else None
        if cached:
            self.assertIn(STORY, markup)
            self.assertIsNone(payload)
        else:
            self.assertIsNotNone(payload)
            self.assertEqual(payload["title"], GUIDE["title"])
            self.assertEqual(payload["item_number"], GUIDE["item_number"])
        return markup, parsed, payload

    def test_retired_relative_absolute_and_encoded_urls_never_reach_public_markup(self):
        aliases = [
            PHOTO_URL,
            "https://example.test" + PHOTO_URL,
            "https://example.test/%2561pi%252fgallery%252fphotos/" + PHOTO_ID,
            "https://example.test/api//gallery/photos/" + PHOTO_ID,
            "/gallery_photos/" + PHOTO_ID + ".jpg",
        ]
        for image in aliases:
            for cached in (False, True):
                with self.subTest(image=image, cached=cached):
                    guide = dict(GUIDE, image=image, images=[image],
                                 community_photos=[{"url": image, "kind": "visitor_photo"}],
                                 attachment_token="synthetic-retired-token")
                    markup, parsed, payload = self.render(guide, cached)
                    self.assertEqual(parsed.heroes, [])
                    self.assertNotIn("image", parsed.structured[0])
                    self.assertNotIn(PHOTO_ID, markup)
                    self.assertNotIn("synthetic-retired-token", markup)
                    self.assertNotIn("gallery_photos", markup)
                    self.assertNotIn("api/gallery/photos", markup)
                    if payload:
                        self.assertNotIn("image", payload)
                        self.assertNotIn("community_photos", payload)

    def test_explicit_visitor_provenance_also_hides_external_photo_aliases(self):
        private = "https://cdn.example/private-visitor-original.jpg"
        for key in ("source_kind", "image_kind", "photo_kind"):
            with self.subTest(key=key):
                guide = dict(GUIDE, image=private, images=[private], **{key: "visitor_photo"})
                markup, parsed, _ = self.render(guide, cached=False)
                self.assertEqual(parsed.heroes, [])
                self.assertNotIn("image", parsed.structured[0])
                self.assertNotIn(private, markup)

    def test_licensed_catalogue_hero_and_structured_image_survive_in_both_story_states(self):
        for cached in (False, True):
            with self.subTest(cached=cached):
                guide = dict(GUIDE, image=LICENSED_IMAGE,
                             community_photos=[{"url": PHOTO_URL, "kind": "visitor_photo"}])
                markup, parsed, payload = self.render(guide, cached)
                self.assertEqual(len(parsed.heroes), 1)
                self.assertEqual(parsed.heroes[0]["src"], LICENSED_IMAGE)
                self.assertEqual(parsed.heroes[0]["alt"], GUIDE["title"])
                self.assertEqual(parsed.structured[0]["image"], LICENSED_IMAGE)
                self.assertNotIn(PHOTO_ID, markup)
                if payload:
                    self.assertEqual(payload["museum"], GUIDE["museum"])

    def test_unknown_guide_is_404_without_reading_or_generation(self):
        with patch.object(site.discovery_mod, "gallery_guide", return_value=None), \
                patch.object(gallery_reader, "cached_reading") as reading:
            response = self.client.get("/gallery-guides/missing-fixture")
        self.assertEqual(response.status_code, 404)
        reading.assert_not_called()


if __name__ == "__main__":
    unittest.main()
