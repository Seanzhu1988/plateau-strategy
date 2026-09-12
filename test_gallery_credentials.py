"""Gallery credential boundaries, with no network, secrets, or data storage."""

import json
import os
import unittest
from unittest.mock import patch

from flask import Flask

import gallery_credentials as credentials
import gallery_identify as identify
import gallery_reader as reader
import translator


class GalleryCredentialTests(unittest.TestCase):
    def setUp(self):
        self.enterContext(patch.dict(os.environ, {}, clear=True))
        self.post = self.enterContext(patch.object(identify.requests, "post"))
        self.archive = self.enterContext(patch.object(reader, "gallery_archive"))
        self.enterContext(patch.object(reader, "cached_reading", return_value=None))
        self.enterContext(patch.object(reader, "_prompt", return_value="Test reading request"))
        self.reserve = self.enterContext(patch.object(identify, "_reserve", return_value=True))
        self.enterContext(patch.object(identify, "read_upload", return_value=(
            b"test-prepared-image", {}, identify.CONSENT_VERSION)))
        self.app = Flask(__name__)
        self.app.config["TESTING"] = True
        self.app.register_blueprint(identify.gallery_identify_bp)
        self.client = self.app.test_client()

    def assert_reader_auth(self, expected):
        self.post.reset_mock()
        story = "Observe the outline and proportions of the object in front of you. " * 6
        self.archive.resolve.return_value = {"artifact_id": "test-object"}
        self.archive.generation_facts.return_value = {"title": "Test object"}
        self.archive.reserve.return_value = {"status": "reserved", "token": "test-lease"}
        self.archive.get_story.return_value = {"text": story, "minutes": 3}
        self.post.return_value.json.return_value = {
            "stop_reason": "end_turn", "content": [{"type": "text", "text": story}]}

        self.assertTrue(reader.available())
        self.assertFalse(reader.read_for({"artifact_id": "test-object"}, "en")["cached"])
        self.post.assert_called_once()
        self.assertEqual(self.post.call_args.kwargs["headers"]["x-api-key"], expected)

    def assert_identify_auth(self, expected):
        self.post.reset_mock()
        self.post.return_value.json.return_value = {
            "stop_reason": "end_turn", "content": [{"type": "text", "text": json.dumps({
                "candidates": [], "label_text": "", "visual_description": "",
                "reason": "No clear object in this test fixture.",
            })}]}

        self.assertTrue(identify.available())
        response = self.client.post("/api/gallery/identify")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["reason"], "no_match")
        self.post.assert_called_once()
        self.assertEqual(self.post.call_args.kwargs["headers"]["x-api-key"], expected)

    def assert_gallery_disabled(self):
        self.assertEqual(credentials.api_key(), "")
        self.assertFalse(reader.available())
        self.assertFalse(identify.available())
        self.assertEqual(reader.read_for({"artifact_id": "test-object"}, "en"),
                         {"reason": "no_engine"})
        response = self.client.post("/api/gallery/identify")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json["reason"], "no_engine")
        self.post.assert_not_called()
        self.archive.reserve.assert_not_called()
        self.assertNotIn(unittest.mock.call("generation"), self.reserve.call_args_list)

    def test_scoped_key_alone_enables_both_gallery_requests_without_translation(self):
        os.environ["GALLERY_ANTHROPIC_API_KEY"] = "  test-gallery-only  "
        self.assertEqual(credentials.api_key(), "test-gallery-only")
        self.assert_reader_auth("test-gallery-only")
        self.assert_identify_auth("test-gallery-only")
        self.assertFalse(translator.available())
        self.assertNotIn("ANTHROPIC_API_KEY", os.environ)

    def test_scoped_key_overrides_general_key_in_both_request_headers(self):
        os.environ.update({"GALLERY_ANTHROPIC_API_KEY": " test-gallery-override\n",
                           "ANTHROPIC_API_KEY": "test-general-key"})
        self.assertEqual(credentials.api_key(), "test-gallery-override")
        self.assert_reader_auth("test-gallery-override")
        self.assert_identify_auth("test-gallery-override")
        self.assertEqual(os.environ["ANTHROPIC_API_KEY"], "test-general-key")

    def test_empty_scoped_key_disables_gallery_even_with_general_key(self):
        os.environ.update({"GALLERY_ANTHROPIC_API_KEY": "",
                           "ANTHROPIC_API_KEY": "test-general-key"})
        self.assert_gallery_disabled()

    def test_whitespace_scoped_key_disables_gallery_even_with_general_key(self):
        os.environ.update({"GALLERY_ANTHROPIC_API_KEY": " \t\n ",
                           "ANTHROPIC_API_KEY": "test-general-key"})
        self.assert_gallery_disabled()

    def test_legacy_key_still_authenticates_both_paths_when_override_absent(self):
        os.environ["ANTHROPIC_API_KEY"] = "  test-legacy-key\n"
        self.assertEqual(credentials.api_key(), "test-legacy-key")
        self.assert_reader_auth("test-legacy-key")
        self.assert_identify_auth("test-legacy-key")

    def test_no_keys_leaves_both_paths_disabled(self):
        self.assert_gallery_disabled()

    def test_blank_legacy_key_leaves_both_paths_disabled(self):
        os.environ["ANTHROPIC_API_KEY"] = " \t\n "
        self.assert_gallery_disabled()


if __name__ == "__main__":
    unittest.main()
