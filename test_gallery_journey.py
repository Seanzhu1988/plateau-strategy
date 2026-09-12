"""End-to-end gallery API acceptance with isolated disk and mocked providers.

No credentials, external requests, live state or paid generation are used.
"""
import concurrent.futures
import json
import os
import subprocess
import sys
import tempfile
import threading
import unittest
from types import SimpleNamespace
from unittest import mock

_boot_data = tempfile.TemporaryDirectory(prefix="gallery-journey-boot-")
os.environ["DATA_DIR"] = _boot_data.name
os.environ["DISCOVERY_ENABLED"] = "false"
os.environ["DISPATCH_REMINDERS"] = "false"
os.environ.pop("ANTHROPIC_API_KEY", None)
os.environ.pop("ELEVENLABS_API_KEY", None)

import app as site
import gallery_archive
import gallery_reader


FACTS = {
    "title": "Acceptance test vessel", "artist": "Test fixture maker",
    "date": "2026", "museum": "Acceptance test museum",
    "source": "Acceptance test museum", "item_number": "TEST-001",
    "provider": "acceptance", "source_object_id": "001",
    "source_url": "https://example.org/collection/test-001",
}
STORY = ("This is an isolated acceptance fixture, not a published museum story. "
         "It proves that the artifact and its narrative are stored together. "
         "The next visitor should read the same saved narrative without another "
         "generation request. The archive should identify its actual authorship "
         "and language, preserve the source link, and survive a fresh process.")


class FakeResponse:
    def raise_for_status(self):
        return None

    def json(self):
        return {"content": [{"type": "text", "text": STORY}]}


class GalleryJourneyTests(unittest.TestCase):
    def setUp(self):
        self.data = tempfile.TemporaryDirectory(prefix="gallery-journey-test-")
        self.addCleanup(self.data.cleanup)
        self.env = mock.patch.dict(os.environ, {"DATA_DIR": self.data.name})
        self.env.start()
        self.addCleanup(self.env.stop)
        site.app.config["TESTING"] = True
        site._GAL_CACHE.clear()
        self.client = site.app.test_client()
        for name in ("_gal_met", "_gal_aic", "_gal_moma", "_gal_wikidata"):
            patcher = mock.patch.object(site, name, return_value=[dict(FACTS)] if name == "_gal_met" else [])
            patcher.start()
            self.addCleanup(patcher.stop)
        self.provider = mock.Mock(return_value=FakeResponse())
        patcher = mock.patch.object(gallery_reader, "requests", SimpleNamespace(post=self.provider))
        patcher.start()
        self.addCleanup(patcher.stop)
        patcher = mock.patch.object(gallery_reader, "available", return_value=True)
        patcher.start()
        self.addCleanup(patcher.stop)

    def find(self):
        response = self.client.get("/api/gallery/search", query_string={"q": "Acceptance test vessel"})
        self.assertEqual(response.status_code, 200)
        result = next(row for row in response.get_json()["results"] if row["item_number"] == "TEST-001")
        self.assertTrue(result["artifact_id"])
        return result

    def write(self, artifact_id):
        response = self.client.post("/api/gallery/generate", json={"artifact_id": artifact_id, "lang": "en"})
        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertTrue(body.get("ok"), body)
        self.assertEqual(body["text"], STORY)
        return body

    def test_search_write_repeat_archive_and_permanent_link(self):
        original = self.find()
        self.assertFalse(original["written"])
        self.assertTrue(original["new_discovery"])
        self.assertEqual(self.client.get("/api/gallery/archive?q=Acceptance").get_json()["total"], 0)
        written = self.write(original["artifact_id"])
        self.assertFalse(written["cached"])
        self.assertEqual(written["provenance"]["kind"], "ai_assisted")
        repeated = self.find()
        self.assertEqual(repeated["artifact_id"], original["artifact_id"])
        self.assertTrue(repeated["written"])
        self.assertFalse(repeated["new_discovery"])
        self.assertTrue(self.write(original["artifact_id"])["cached"])
        self.assertEqual(self.provider.call_count, 1)
        archive = self.client.get("/api/gallery/archive?q=Acceptance").get_json()
        self.assertEqual(archive["total"], 1)
        row = archive["items"][0]
        self.assertEqual(row["artifact_id"], original["artifact_id"])
        with self.client.get(row["artifact_url"]) as page:
            self.assertEqual(page.status_code, 200)
        story = self.client.get(row["story_url"]).get_json()
        self.assertEqual(story["text"], STORY)
        self.assertEqual(story["source_url"], FACTS["source_url"])
        self.assertIsNone(story["audio"])

    def test_fresh_process_reads_story_without_generation_key(self):
        artifact_id = self.find()["artifact_id"]
        self.write(artifact_id)
        code = "import json,gallery_archive; print(json.dumps(gallery_archive.get_story(%r,'en')))" % artifact_id
        result = subprocess.run([sys.executable, "-c", code], cwd=os.path.dirname(__file__),
                                env=dict(os.environ), text=True, capture_output=True, check=True)
        reopened = json.loads(result.stdout)
        self.assertEqual(reopened["text"], STORY)
        self.assertEqual(reopened["artifact_id"], artifact_id)
        with mock.patch.object(gallery_reader, "available", return_value=False):
            self.assertTrue(self.write(artifact_id)["cached"])
        self.assertEqual(self.provider.call_count, 1)

    def test_wrong_language_is_explicit_not_silent_english(self):
        artifact_id = self.find()["artifact_id"]
        self.write(artifact_id)
        response = self.client.get("/api/gallery/artifacts/%s/story?lang=zh" % artifact_id)
        self.assertEqual(response.status_code, 404)
        self.assertIn("en", response.get_json()["available_languages"])
        self.assertFalse(response.get_json().get("text"))

    def test_failed_generation_never_marks_a_story_as_written(self):
        artifact_id = self.find()["artifact_id"]
        self.provider.side_effect = RuntimeError("fixture provider outage")
        response = self.client.post("/api/gallery/generate", json={"artifact_id": artifact_id, "lang": "en"})
        self.assertFalse(response.get_json()["ok"])
        self.assertFalse(self.find()["written"])
        self.assertEqual(self.client.get("/api/gallery/archive?q=Acceptance").get_json()["total"], 0)

    def test_simultaneous_writes_make_one_provider_request(self):
        artifact_id = self.find()["artifact_id"]
        started, release = threading.Event(), threading.Event()

        def delayed(*args, **kwargs):
            started.set()
            self.assertTrue(release.wait(10))
            return FakeResponse()

        self.provider.side_effect = delayed

        def ask():
            with site.app.test_client() as client:
                return client.post("/api/gallery/generate", json={"artifact_id": artifact_id, "lang": "en"}).get_json()

        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            first = pool.submit(ask)
            self.assertTrue(started.wait(5))
            try:
                following = list(pool.map(lambda _: ask(), range(4)))
                self.assertTrue(all(row.get("reason") == "in_progress" for row in following), following)
            finally:
                release.set()
            self.assertTrue(first.result()["ok"])
        self.assertEqual(self.provider.call_count, 1)
        self.assertTrue(self.write(artifact_id)["cached"])


if __name__ == "__main__":
    unittest.main()
