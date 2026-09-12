"""Isolated regression tests. No live data, outbound requests, or paid models."""
import concurrent.futures
import json
import os
from pathlib import Path
import tempfile
import threading
import time
import unittest
from unittest.mock import patch

# App startup is allowed only against throwaway data with workers disabled.
_startup = tempfile.TemporaryDirectory(prefix="gallery-api-test-")
os.environ["DATA_DIR"] = _startup.name
os.environ["DISPATCH_REMINDERS"] = "false"
os.environ["DISCOVERY_ENABLED"] = "false"
import app as web
import gallery_archive as archive
import gallery_reader as reader


FACTS = {"title": "Bronze vessel", "artist": "Maker unknown", "museum": "Test Museum",
         "item_number": "2020.15", "date": "1200", "source_url": "https://museum.example/objects/15",
         "provider": "test-museum", "source_object_id": "15"}
STORY = "Look at the bronze vessel in front of you. Notice its outline and compare the proportions. " * 6


class ArchiveTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="gallery-archive-test-")
        self.env = patch.dict(os.environ, {"DATA_DIR": self.tmp.name, "ANTHROPIC_API_KEY": ""})
        self.env.start()
        self.base = patch.object(archive, "BASE_DIR", self.tmp.name)
        self.base.start()
        self.network = patch.object(reader, "requests")
        self.requests = self.network.start()
        self.requests.post.side_effect = AssertionError("Paid network prohibited by test")
        web._GAL_CACHE.clear()
        self.client = web.app.test_client()

    def tearDown(self):
        self.network.stop()
        self.base.stop()
        self.env.stop()
        self.tmp.cleanup()

    def save_story(self, artifact_id, lang="en"):
        lease = archive.reserve(artifact_id, lang, 10)
        self.assertEqual(lease["status"], "reserved")
        archive.finish(artifact_id, lang, lease["token"], STORY, 3, "test-only")

    def test_identity_title_changes_aliases_and_museum_collision(self):
        a = archive.remember(dict(FACTS, museum="The Met, New York"))["artifact_id"]
        b = archive.remember(dict(FACTS, title="Vessel with revised title", museum="The Metropolitan Museum of Art"))["artifact_id"]
        c = archive.remember(dict(FACTS, museum="Another Museum"))["artifact_id"]
        self.assertEqual(a, b)
        self.assertNotEqual(a, c)
        self.assertEqual(archive.get_artifact(a)["title"], "Vessel with revised title")

    def test_accession_upgrade_does_not_merge_conflicting_secondary_url(self):
        first = dict(FACTS, item_number="", source_object_id="")
        a = archive.remember(first)["artifact_id"]
        upgraded = archive.remember(dict(first, item_number="A"))["artifact_id"]
        b = archive.remember(dict(first, item_number="B"))["artifact_id"]
        self.assertEqual(a, upgraded)
        self.assertNotEqual(a, b)
        self.assertEqual(archive.get_artifact(a)["item_number"], "A")

    def test_object_query_parameters_are_identity_not_tracking(self):
        a = archive.remember(dict(FACTS, item_number="", source_object_id="", source_url="https://museum.example/object?id=1&utm_source=test"))["artifact_id"]
        same = archive.remember(dict(FACTS, item_number="", source_object_id="", source_url="https://museum.example/object?utm_source=other&id=1"))["artifact_id"]
        b = archive.remember(dict(FACTS, item_number="", source_object_id="", source_url="https://museum.example/object?id=2"))["artifact_id"]
        self.assertEqual(a, same)
        self.assertNotEqual(a, b)

    def test_fresh_source_survives_saved_snapshot_and_older_query_cache(self):
        old = dict(FACTS, where="Gallery 1", on_view=True, copyright=False, catalogue_observed_at=100)
        a = archive.enrich([old])["results"][0]["artifact_id"]
        snapshot = archive.get_artifact(a)
        fresh = dict(FACTS, where="Storage", on_view=False, copyright=True, catalogue_observed_at=200)
        returned = archive.enrich([snapshot, fresh, snapshot])["results"][0]
        self.assertEqual(returned["where"], "Storage")
        self.assertFalse(returned["on_view"])
        archive.enrich([old, snapshot])
        persisted = archive.get_artifact(a)
        self.assertEqual(persisted["where"], "Storage")
        self.assertTrue(persisted["copyright"])

    def test_non_english_story_still_queues_english_and_new_story_is_reused(self):
        a = archive.remember(FACTS)["artifact_id"]
        self.save_story(a, "zh")
        archive.enrich([FACTS])
        self.assertEqual(archive.queue_status()["counts"]["pending"], 1)
        response = self.requests.post.return_value
        self.requests.post.side_effect = None
        response.json.return_value = {"content": [{"type": "text", "text": STORY}]}
        with patch.object(reader, "available", return_value=True):
            first = reader.read_for({"artifact_id": a}, "en")
        with patch.object(reader, "available", return_value=False):
            second = reader.read_for({"artifact_id": a}, "en")
        self.assertFalse(first["cached"])
        self.assertTrue(second["cached"])
        self.assertEqual(second["text"], STORY.strip())
        self.requests.post.assert_called_once()
        self.assertEqual(archive.queue_status()["counts"]["complete"], 1)

    def test_saved_facts_story_and_private_demand(self):
        first = archive.enrich([FACTS], "my private query")
        a = first["results"][0]["artifact_id"]
        self.assertEqual(first["new_discoveries"], 1)
        self.assertEqual(archive.archive()["total"], 0)
        self.save_story(a)
        again = archive.enrich([dict(FACTS, title="Vessel")], "my private query")
        self.assertTrue(again["results"][0]["written"])
        self.assertEqual(again["new_discoveries"], 0)
        result = archive.archive()
        self.assertEqual(result["total"], 1)
        self.assertNotIn("my private query", json.dumps(result))
        self.assertEqual(archive.search_known("my private query")[0]["artifact_id"], a)
        self.assertEqual(result["items"][0]["provenance"]["kind"], "ai_assisted")

    def test_miss_is_demand_never_fake_artifact(self):
        archive.enrich([], "unresolved personal search")
        self.assertEqual(archive.archive()["stats"]["artifacts"], 0)
        with archive.database() as db:
            self.assertEqual(db.execute("SELECT misses FROM queries").fetchone()[0], 1)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM writing_queue").fetchone()[0], 0)

    def test_curated_and_legacy_text_import_without_key_and_language_honesty(self):
        scripts = Path(self.tmp.name, "gallery_scripts")
        scripts.mkdir()
        scripts.joinpath("vessel.txt").write_text("Curated English story.", encoding="utf-8")
        Path(self.tmp.name, "gallery_items.json").write_text(json.dumps({"items": {
            "test:15": dict(FACTS, script="gallery_scripts/vessel.txt", minutes=3)}}), encoding="utf-8")
        Path(self.tmp.name, "gallery_readings_runtime.json").write_text(json.dumps({
            "by_key": {"old-key": {"zh": dict(FACTS, text="保存的中文故事。" * 30, minutes=3)}}, "spend": {}}), encoding="utf-8")
        a = archive.resolve(FACTS)["artifact_id"]
        self.assertEqual(reader.read_for({"artifact_id": a}, "en")["text"], "Curated English story.")
        self.assertTrue(reader.read_for({"artifact_id": a}, "zh")["text"].startswith("保存"))
        self.assertEqual(set(archive.get_artifact(a)["story_languages"]), {"en", "zh"})
        missing = self.client.get("/api/gallery/artifacts/%s/story?lang=fr" % a)
        self.assertEqual(missing.status_code, 404)
        self.assertEqual(missing.json["fallback_lang"], "en")
        self.assertEqual(archive.archive(lang="fr")["total"], 0)
        self.requests.post.assert_not_called()

    def test_legacy_record_without_facts_is_kept_until_exact_hash_resolution(self):
        key = reader.work_key(FACTS)
        reader._save_store({"by_key": {key: {"ko": {"text": STORY, "minutes": 3}}}, "spend": {}})
        self.assertEqual(archive.archive()["total"], 0)
        resolved = reader.cached_reading(FACTS, "ko")
        self.assertEqual(resolved["text"], STORY)
        self.assertEqual(archive.archive(lang="ko")["total"], 1)

    def test_concurrent_reservations_and_monthly_attempt_cap(self):
        a = archive.remember(FACTS)["artifact_id"]
        barrier = threading.Barrier(6)
        def reserve(_):
            barrier.wait()
            return archive.reserve(a, "en", 1)
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            leases = list(executor.map(reserve, range(6)))
        self.assertEqual(sum(x["status"] == "reserved" for x in leases), 1)
        self.assertEqual(sum(x["status"] == "in_progress" for x in leases), 5)
        lease = next(x for x in leases if x["status"] == "reserved")
        archive.finish(a, "en", lease["token"])
        self.assertEqual(archive.reserve(a, "en", 1)["status"], "monthly_limit")

    def test_public_generation_uses_saved_facts_and_cache_before_engine(self):
        a = archive.remember(FACTS)["artifact_id"]
        self.save_story(a)
        response = self.client.post("/api/gallery/generate", json={"artifact_id": a, "title": "INVENTED", "lang": "en"})
        self.assertTrue(response.json["ok"])
        self.assertTrue(response.json["cached"])
        self.assertEqual(response.json["text"], STORY)
        with patch.object(reader, "available", return_value=True):
            detail = self.client.get("/api/gallery/artifacts/" + a)
            self.assertTrue(detail.json["can_generate"])
        self.assertEqual(self.client.post("/api/gallery/generate", json={"title": "INVENTED", "museum": "fake"}).status_code, 404)
        self.assertEqual(self.client.post("/api/gallery/generate", json=[]).status_code, 400)
        with patch.object(reader, "read_for", return_value={"text": STORY, "minutes": 3, "cached": False}) as called:
            self.client.post("/api/gallery/generate", json={"artifact_id": a, "title": "malicious instructions", "lang": "fr"})
            self.assertEqual(called.call_args.args[0]["title"], FACTS["title"])

    def test_search_cache_reenrich_and_saved_match_after_remote_failure(self):
        with patch.object(web, "_gal_met", return_value=[FACTS]), patch.object(web, "_gal_aic", return_value=[]), \
                patch.object(web, "_gal_moma", return_value=[]), patch.object(web, "_gal_wikidata", return_value=[]):
            first = self.client.get("/api/gallery/search?q=Bronze%20vessel").json
        a = first["results"][0]["artifact_id"]
        self.save_story(a)
        cached = self.client.get("/api/gallery/search?q=Bronze%20vessel").json
        self.assertTrue(cached["cached"])
        self.assertTrue(cached["results"][0]["story_available"])
        web._GAL_CACHE.clear()
        def offline(q):
            raise RuntimeError("source offline")
        with patch.object(web, "_gal_met", offline), patch.object(web, "_gal_aic", offline), \
                patch.object(web, "_gal_moma", offline), patch.object(web, "_gal_wikidata", offline):
            found = self.client.get("/api/gallery/search?q=Bronze%20vessel").json
            by_accession = self.client.get("/api/gallery/search?q=2020.15").json
        self.assertEqual(found["results"][0]["artifact_id"], a)
        self.assertTrue(found["results"][0]["written"])
        self.assertEqual(by_accession["results"][0]["artifact_id"], a)

    def test_photo_candidates_only_persist_on_explicit_confirmation(self):
        with patch.object(web, "_gal_met", return_value=[FACTS]), patch.object(web, "_gal_aic", return_value=[]), \
                patch.object(web, "_gal_moma", return_value=[]), patch.object(web, "_gal_wikidata", return_value=[]), \
                patch.object(web.gallery_log, "record") as log:
            suggested = self.client.get("/api/gallery/search?q=Bronze%20vessel&discover=0&origin=photo").json
            log.assert_not_called()
        candidate = suggested["results"][0]
        self.assertTrue(candidate["artifact_id"].startswith("p_"))
        self.assertEqual(archive.archive()["stats"]["artifacts"], 0)
        tampered = self.client.post("/api/gallery/discover", json={"artifact_id": candidate["artifact_id"] + "x"})
        self.assertEqual(tampered.status_code, 410)
        accepted = self.client.post("/api/gallery/discover", json={"artifact_id": candidate["artifact_id"]}).json
        self.assertTrue(accepted["saved"])
        self.assertTrue(accepted["artifact"]["artifact_id"].startswith("a_"))
        self.assertEqual(archive.archive()["stats"]["artifacts"], 1)
        self.assertEqual(archive.queue_status()["counts"]["pending"], 1)

    def test_queue_processes_one_and_retry_remains_recoverable(self):
        archive.enrich([FACTS], "bronze vessel")
        with patch.object(reader, "available", return_value=False):
            self.assertEqual(archive.process_next()["status"], "no_engine")
        with patch.object(reader, "available", return_value=True), patch.object(reader, "read_for", return_value={"reason": "monthly_limit"}) as call:
            first = archive.process_next()
            second = archive.process_next()
        self.assertEqual(first["status"], "retry")
        self.assertEqual(second["status"], "waiting")
        call.assert_called_once()
        with archive.database() as db:
            db.execute("UPDATE writing_queue SET attempts=7,next_attempt=0")
            db.execute("UPDATE worker_state SET until=0")
        with patch.object(reader, "available", return_value=True), patch.object(reader, "read_for", return_value={"reason": "failed"}):
            self.assertEqual(archive.process_next()["status"], "retry")


if __name__ == "__main__":
    unittest.main()
