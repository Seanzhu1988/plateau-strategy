"""End-to-end gallery API acceptance with isolated disk and mocked providers.

No credentials, external requests, live state or paid generation are used.
"""
import concurrent.futures
import io
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
        return {"stop_reason": "end_turn", "content": [{"type": "text", "text": STORY}]}


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

    def test_photo_search_checks_saved_archive_without_provider_or_discovery(self):
        with mock.patch.object(site, "_gal_met") as provider:
            result = self.client.get("/api/gallery/search?q=Acceptance&scope=archive&discover=0").get_json()
        self.assertTrue(result["ok"])
        self.assertEqual(result["results"], [])
        provider.assert_not_called()
        self.assertEqual(gallery_archive.search_known("Acceptance"), [])
        original = self.find()
        self.write(original["artifact_id"])
        with mock.patch.object(site, "_gal_met") as provider:
            result = self.client.get("/api/gallery/search?q=Acceptance&scope=archive&discover=0").get_json()
        provider.assert_not_called()
        self.assertEqual(result["results"][0]["artifact_id"], original["artifact_id"])
        self.assertTrue(result["results"][0]["story_available"])

    def test_photo_confirmation_queues_selected_language_and_grants_attachment(self):
        candidate = self.client.get("/api/gallery/search?q=Acceptance&discover=0&lang=zh").get_json()["results"][0]
        self.assertTrue(candidate["artifact_id"].startswith("p_"))
        self.assertEqual(gallery_archive.search_known("Acceptance"), [])
        with mock.patch.object(gallery_reader, "available", return_value=False):
            response = self.client.post("/api/gallery/discover", json={"artifact_id": candidate["artifact_id"], "lang": "zh"})
        body = response.get_json()
        self.assertTrue(body["ok"])
        self.assertFalse(body["can_generate"])
        self.assertFalse(body["artifact"]["written"])
        self.assertEqual(body["writing_status"], "pending")
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        from itsdangerous import URLSafeTimedSerializer
        payload = URLSafeTimedSerializer(site.app.secret_key, salt="gallery-photo-attachment-v1").loads(body["attachment_token"], max_age=900)
        self.assertEqual(payload, {"artifact_id": body["artifact"]["artifact_id"]})
        with gallery_archive.database() as db:
            row = db.execute("SELECT status FROM writing_queue WHERE artifact_id=? AND lang='zh'", (payload["artifact_id"],)).fetchone()
        self.assertEqual(row[0], "pending")
        self.assertEqual(self.client.get("/api/gallery/archive?q=Acceptance&lang=zh").get_json()["total"], 0)

    def test_confirmed_photo_is_retained_and_visible_on_repeat_lookup(self):
        from PIL import Image
        import gallery_photos
        artifact_id = self.find()["artifact_id"]
        confirmed = self.client.post("/api/gallery/discover", json={"artifact_id": artifact_id}).get_json()
        image = io.BytesIO()
        Image.new("RGB", (30, 30), "navy").save(image, "PNG")
        raw = image.getvalue()
        url = "/api/gallery/artifacts/%s/photo" % artifact_id
        refused = self.client.post(url, data={"photo": (io.BytesIO(raw), "private.png"),
                                           "attachment_token": confirmed["attachment_token"]})
        self.assertEqual(refused.status_code, 400)
        self.assertEqual(gallery_photos.list_photos(artifact_id), [])
        uploaded = self.client.post(url, data={"photo": (io.BytesIO(raw), "private.png"),
                                             "attachment_token": confirmed["attachment_token"],
                                             "publication_consent": "gallery-photo-publication-v1"})
        self.assertEqual(uploaded.status_code, 200, uploaded.get_json())
        photo = uploaded.get_json()["photo"]
        artifact = self.client.get("/api/gallery/artifacts/" + artifact_id).get_json()["artifact"]
        self.assertEqual(artifact["community_photos"][0]["url"], photo["url"])
        self.assertEqual(artifact["community_photos"][0]["kind"], "visitor_photo")
        with self.client.get(photo["url"]) as image_response:
            self.assertEqual(image_response.status_code, 200)
            self.assertEqual(image_response.mimetype, "image/jpeg")
            self.assertEqual(Image.open(io.BytesIO(image_response.data)).getexif(), {})

    def test_research_is_durable_private_and_deduplicated(self):
        clues = {"query": "Unidentified fixture carving", "museum": "Fixture museum", "lang": "zh",
                 "candidate_clues": [{"title": "Unidentified fixture carving", "confidence": "low"}],
                 "label_text": "Carved stone"}
        first = self.client.post("/api/gallery/research", json=clues).get_json()
        repeated = self.client.post("/api/gallery/research", json=clues).get_json()
        self.assertTrue(first["ok"])
        self.assertEqual(first["status"], "needs_research")
        self.assertEqual(repeated["id"], first["id"])
        self.assertTrue(repeated["duplicate"])
        self.assertEqual(gallery_archive.search_known(clues["query"]), [])
        self.assertEqual(self.client.get("/api/gallery/archive?q=Unidentified").get_json()["total"], 0)
        self.assertEqual(self.client.get("/api/gallery/queue").status_code, 401)
        with self.client.session_transaction() as session:
            session["owner"] = True
        owner = self.client.get("/api/gallery/queue").get_json()
        self.assertEqual(owner["writing"]["research"]["counts"]["needs_research"], 1)

    def test_invalid_research_and_confirmation_do_not_crash(self):
        for data in ([], {"lang": []}, {"query": []}, {"query": ""}):
            response = self.client.post("/api/gallery/research", json=data)
            self.assertEqual(response.status_code, 400)
        response = self.client.post("/api/gallery/discover", json={"artifact_id": "missing", "lang": []})
        self.assertEqual(response.status_code, 404)

    def test_research_body_is_bounded_without_content_length(self):
        raw = json.dumps({"query": "Private research fixture", "label_text": "x" * 20000}).encode()
        response = self.client.open("/api/gallery/research", method="POST", content_type="application/json",
                                    environ_overrides={"wsgi.input": io.BytesIO(raw),
                                                       "wsgi.input_terminated": True, "CONTENT_LENGTH": ""})
        self.assertEqual(response.status_code, 413)

    def test_unidentified_photo_keeps_its_description_without_inventing_a_public_story(self):
        first_description = "A carved stone figure with a rounded head and a narrow rectangular base."
        second_description = "A shallow ceramic bowl with a blue pattern around the outer rim."
        first = self.client.post("/api/gallery/research", json={"visual_description": first_description}).get_json()
        second = self.client.post("/api/gallery/research", json={"visual_description": second_description}).get_json()
        self.assertTrue(first["ok"])
        self.assertEqual(first["visual_description"], first_description)
        self.assertEqual(first["status"], "needs_research")
        self.assertNotEqual(first["id"], second["id"])
        self.assertEqual(gallery_archive.search_known("Unidentified artifact"), [])
        self.assertEqual(self.client.get("/api/gallery/archive?q=Unidentified").get_json()["total"], 0)

    def test_research_public_submission_has_hourly_limit(self):
        with mock.patch.dict(os.environ, {"GALLERY_RESEARCH_HOURLY_LIMIT": "1"}):
            response = self.client.post("/api/gallery/research", json={"query": "Private research fixture"})
            self.assertEqual(response.status_code, 200)
            response = self.client.post("/api/gallery/research", json={"query": "Another research fixture"})
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.headers["Retry-After"], "3600")

    def test_live_enrichment_prioritizes_new_story_over_stale_source_cache(self):
        unwritten = {**FACTS, "item_number": "TEST-002", "source_object_id": "002",
                     "source_url": "https://example.org/collection/test-002"}
        original = self.find()
        second = gallery_archive.enrich([unwritten])["results"][0]
        self.write(original["artifact_id"])
        payload = {"results": [unwritten, FACTS], "query": "Acceptance test vessel"}
        with site.app.test_request_context("/api/gallery/search?q=Acceptance"):
            result = site._gallery_finish(payload, "Acceptance test vessel", "en", True).get_json()
        self.assertEqual(result["results"][0]["artifact_id"], original["artifact_id"])
        with site.app.test_request_context("/api/gallery/search?q=TEST-002"):
            result = site._gallery_finish(payload, "TEST-002", "en", True).get_json()
        self.assertEqual(result["results"][0]["artifact_id"], second["artifact_id"])


if __name__ == "__main__":
    unittest.main()
