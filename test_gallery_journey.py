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

    def test_camera_preparer_is_served_before_controller(self):
        with self.client.get('/universal-gallery') as response:
            self.assertEqual(response.status_code, 200)
            html = response.get_data(as_text=True)
        # The production response rewrites shared asset versions for caching.
        self.assertLess(html.index('/gallery-photo-input.js?'), html.index('/gallery-ui.js?'))
        with self.client.get('/gallery-photo-input.js?v=1') as response:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.mimetype, 'application/javascript')
            self.assertIn('root.PSXGalleryPhoto', response.get_data(as_text=True))
        self.assertEqual(self.provider.call_count, 0)

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

    def test_explicit_story_request_queues_language_without_confirming_photo(self):
        candidate = self.client.get("/api/gallery/search?q=Acceptance&discover=0&lang=zh").get_json()["results"][0]
        self.assertTrue(candidate["artifact_id"].startswith("p_"))
        self.assertEqual(gallery_archive.search_known("Acceptance"), [])
        with mock.patch.object(gallery_reader, "available", return_value=False):
            response = self.client.post("/api/gallery/discover", json={"artifact_id": candidate["artifact_id"], "lang": "zh", "intent": "write_story"})
        body = response.get_json()
        self.assertTrue(body["ok"])
        self.assertFalse(body["can_generate"])
        self.assertFalse(body["artifact"]["written"])
        self.assertEqual(body["writing_status"], "pending")
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        self.assertNotIn("attachment_token", body)
        self.assertFalse(body["photo_match_verified"])
        artifact_id = body["artifact"]["artifact_id"]
        with gallery_archive.database() as db:
            row = db.execute("SELECT status FROM writing_queue WHERE artifact_id=? AND lang='zh'", (artifact_id,)).fetchone()
        self.assertEqual(row[0], "pending")
        self.assertEqual(self.client.get("/api/gallery/archive?q=Acceptance&lang=zh").get_json()["total"], 0)

    def test_confirmed_photo_is_private_on_every_public_lookup_and_asset_route(self):
        from test_gallery_photos import seed_legacy_photo, PHOTO_ID, PHOTO_URL
        import gallery_photos
        artifact_id = self.find()["artifact_id"]
        photo = seed_legacy_photo(self.data.name, artifact_id)
        original = photo.read_bytes()
        confirmed = self.client.post("/api/gallery/discover", json={"artifact_id": artifact_id, "intent": "write_story"}).get_json()
        self.assertTrue(confirmed["saved"])
        self.assertNotIn("attachment_token", confirmed)
        url = "/api/gallery/artifacts/%s/photo" % artifact_id
        from itsdangerous import URLSafeTimedSerializer
        token = URLSafeTimedSerializer(site.app.secret_key, salt=gallery_photos.TOKEN_SALT).dumps({"artifact_id": artifact_id})
        refused = self.client.post(url, data={"photo": (io.BytesIO(b"synthetic"), "private.png"),
                                            "publication_consent": gallery_photos.CONSENT_VERSION,
                                            "attachment_token": token})
        self.assertEqual(refused.status_code, 403)
        self.assertIn("no-store", refused.headers["Cache-Control"])
        self.assertEqual(gallery_photos.list_photos(artifact_id), [])
        lease = gallery_archive.reserve(artifact_id, "en", 10)
        self.assertTrue(gallery_archive.finish(artifact_id, "en", lease["token"], STORY, model="fixture"))
        for endpoint in ("/api/gallery/artifacts/" + artifact_id,
                         "/api/gallery/archive?q=Acceptance",
                         "/api/gallery/search?q=Acceptance",
                         "/api/gallery/search?q=Acceptance&scope=archive",
                         "/api/gallery/search?q=Acceptance&discover=0"):
            result = self.client.get(endpoint)
            self.assertEqual(result.status_code, 200)
            self.assertNotIn(PHOTO_ID, result.get_data(as_text=True))
        story = self.client.get("/api/gallery/artifacts/" + artifact_id + "/story").get_json()
        self.assertEqual(story["text"], STORY)
        for method in ("GET", "HEAD"):
            for headers in ({}, {"If-None-Match": "*"}, {"Range": "bytes=0-4"}):
                response = self.client.open(PHOTO_URL, method=method, headers=headers)
                self.assertEqual(response.status_code, 404)
                self.assertIn("no-store", response.headers["Cache-Control"])
                self.assertNotEqual(response.mimetype, "image/jpeg")
        for alias in ("/gallery_photos/", "/media/gallery_photos/", "/static/gallery_photos/"):
            self.assertEqual(self.client.get(alias + PHOTO_ID + ".jpg").status_code, 404)
        self.assertEqual(photo.read_bytes(), original)

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
        response = self.client.post("/api/gallery/discover", json={"artifact_id": "missing", "lang": [], "intent": "write_story"})
        self.assertEqual(response.status_code, 404)

    def test_stale_open_button_cannot_archive_confirm_queue_or_generate(self):
        candidate = self.client.get("/api/gallery/search?q=Acceptance&discover=0").get_json()["results"][0]
        self.assertFalse(candidate["photo_match_verified"])
        for intent in (None, "view", "open", "confirm", True, ["write_story"]):
            response = self.client.post("/api/gallery/discover", json={
                "artifact_id": candidate["artifact_id"], "intent": intent})
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.get_json()["reason"], "story_request_required")
        self.assertEqual(gallery_archive.search_known("Acceptance"), [])
        with gallery_archive.database() as db:
            for table in ("writing_requests", "generation_spend"):
                self.assertEqual(db.execute("SELECT COUNT(*) FROM " + table).fetchone()[0], 0)
        self.assertEqual(self.provider.call_count, 0)

    def test_reading_saved_result_never_changes_match_count_or_writing_queue(self):
        row = self.find()
        self.write(row["artifact_id"])
        with gallery_archive.database() as db:
            before = [tuple(r) for r in db.execute("SELECT * FROM writing_queue")]
            confirmations = db.execute("SELECT SUM(confirmed_count) FROM artifacts").fetchone()[0]
        for _ in range(2):
            self.assertEqual(self.client.get("/api/gallery/artifacts/" + row["artifact_id"] + "/story").status_code, 200)
        with gallery_archive.database() as db:
            self.assertEqual(before, [tuple(r) for r in db.execute("SELECT * FROM writing_queue")])
            self.assertEqual(confirmations, db.execute("SELECT SUM(confirmed_count) FROM artifacts").fetchone()[0])
        self.assertEqual(self.provider.call_count, 1)

    def test_request_for_interesting_second_result_never_becomes_first_photo_identity(self):
        other = {**FACTS, "title": "A different interesting bowl", "item_number": "TEST-002",
                 "source_object_id": "002", "source_url": "https://example.org/collection/test-002"}
        with mock.patch.object(site, "_gal_met", return_value=[dict(FACTS), other]):
            result = self.client.get("/api/gallery/search?q=Acceptance&discover=0").get_json()
        selected = next(r for r in result["results"] if r["item_number"] == "TEST-002")
        response = self.client.post("/api/gallery/discover", json={"artifact_id": selected["artifact_id"],
                                   "lang": "zh", "intent": "write_story"}).get_json()
        self.assertFalse(response["photo_match_verified"])
        self.assertEqual(response["artifact"]["item_number"], "TEST-002")
        with gallery_archive.database() as db:
            row = db.execute("SELECT accession, confirmed_count FROM artifacts WHERE id=?",
                             (response["artifact"]["artifact_id"],)).fetchone()
            self.assertEqual(tuple(row), ("test-002", 0))
            requests = list(db.execute("SELECT artifact_id, lang FROM writing_requests"))
            self.assertEqual([tuple(r) for r in requests], [(response["artifact"]["artifact_id"], "zh")])
            queued = list(db.execute("SELECT lang FROM writing_queue WHERE artifact_id=?",
                                    (response["artifact"]["artifact_id"],)))
            self.assertEqual([r[0] for r in queued], ["zh"], "No automatic extra English story")
        self.assertEqual(self.provider.call_count, 0)

    def test_tapping_two_items_saves_independent_stories_and_reuses_both(self):
        other = {**FACTS, "title": "Acceptance discovery bowl", "item_number": "TEST-002",
                 "source_object_id": "002", "source_url": "https://example.org/collection/test-002"}
        with mock.patch.object(site, "_gal_met", return_value=[dict(FACTS), other]):
            candidates = self.client.get("/api/gallery/search?q=Acceptance&origin=photo").get_json()["results"]
        selected = {}
        for number in ("TEST-001", "TEST-002"):
            candidate = next(row for row in candidates if row["item_number"] == number)
            saved = self.client.post("/api/gallery/discover", json={
                "artifact_id": candidate["artifact_id"], "lang": "en", "intent": "write_story"}).get_json()
            self.assertTrue(saved["saved"])
            self.assertFalse(saved["photo_match_verified"])
            self.assertEqual(saved["artifact"]["item_number"], number)
            selected[number] = saved["artifact"]["artifact_id"]
        self.assertNotEqual(selected["TEST-001"], selected["TEST-002"])
        stories = {number: STORY + " This independent fixture belongs only to " + number + "."
                   for number in selected}
        # Finish the unrelated discovery first, then the initial result.
        for number in ("TEST-002", "TEST-001"):
            text = stories[number]
            self.provider.return_value = SimpleNamespace(raise_for_status=lambda: None,
                json=lambda text=text: {"stop_reason": "end_turn", "content": [{"type": "text", "text": text}]})
            generated = self.client.post("/api/gallery/generate", json={
                "artifact_id": selected[number], "lang": "en"}).get_json()
            self.assertEqual(generated["artifact_id"], selected[number])
            self.assertEqual(generated["text"], text)
        self.assertEqual(self.provider.call_count, 2)
        for number, artifact_id in selected.items():
            for _ in range(2):
                saved = self.client.post("/api/gallery/discover", json={
                    "artifact_id": artifact_id, "lang": "en", "intent": "write_story"}).get_json()
                self.assertEqual(saved["artifact"]["artifact_id"], artifact_id)
                cached = self.client.post("/api/gallery/generate", json={
                    "artifact_id": artifact_id, "lang": "en"}).get_json()
                self.assertTrue(cached["cached"])
                self.assertEqual(cached["text"], stories[number])
        archive = self.client.get("/api/gallery/archive?q=Acceptance").get_json()
        self.assertEqual({r["artifact_id"] for r in archive["items"]}, set(selected.values()))
        with gallery_archive.database() as db:
            self.assertEqual(db.execute("SELECT COUNT(*) FROM artifacts WHERE id IN (?,?)",
                                       tuple(selected.values())).fetchone()[0], 2)
            self.assertEqual(db.execute("SELECT SUM(confirmed_count) FROM artifacts").fetchone()[0], 0)
        self.assertEqual(self.provider.call_count, 2, "Saved discoveries never need duplicate generation")

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
