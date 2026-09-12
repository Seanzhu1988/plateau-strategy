"""Private research inbox regression tests. No network and no public fixtures."""
import concurrent.futures
import json
import os
import tempfile
import threading
import unittest
from unittest.mock import patch

import gallery_archive as archive


class ResearchTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="gallery-research-test-")
        self.env = patch.dict(os.environ, {"DATA_DIR": self.tmp.name, "ANTHROPIC_API_KEY": ""})
        self.env.start()
        self.base = patch.object(archive, "BASE_DIR", self.tmp.name)
        self.base.start()

    def tearDown(self):
        self.base.stop()
        self.env.stop()
        self.tmp.cleanup()

    def test_discovery_is_private_and_never_a_verified_artifact_or_story(self):
        saved = archive.save_research("Unidentified bronze vessel", museum="Test Museum", lang="zh",
                                      candidate_clues=[{"title": "Possible vessel", "confidence": "low"}],
                                      label_text="Fragment of an artifact label")
        self.assertTrue(saved["saved"])
        self.assertEqual(saved["status"], "needs_research")
        self.assertFalse(saved["duplicate"])
        self.assertEqual(archive.search_known("Unidentified bronze vessel"), [])
        self.assertEqual(archive.archive()["total"], 0)
        self.assertEqual(archive.archive()["stats"]["artifacts"], 0)
        self.assertIsNone(archive.get_artifact(saved["id"]))
        inbox = archive.queue_status()
        self.assertEqual(inbox["counts"], {})
        self.assertEqual(inbox["research"]["counts"], {"needs_research": 1})
        self.assertEqual(inbox["research"]["items"][0]["languages"], ["zh"])
        self.assertEqual(inbox["research"]["items"][0]["label_text"], "Fragment of an artifact label")

    def test_repeat_query_and_institution_alias_merge_without_losing_languages(self):
        first = archive.save_research("  BRONZE   Vessel  ", "The Met", "en")
        second = archive.save_research("bronze vessel", "The Metropolitan Museum of Art", "zh")
        self.assertEqual(first["id"], second["id"])
        self.assertTrue(second["duplicate"])
        again = archive.queue_status()["research"]["items"][0]
        self.assertEqual(again["sightings"], 2)
        self.assertEqual(again["languages"], ["en", "zh"])
        distinct = archive.save_research("bronze vessel", "Another Museum", "en")
        self.assertNotEqual(distinct["id"], first["id"])

    def test_clue_only_or_real_label_can_seed_research(self):
        clue = archive.save_research("", candidate_clues=[{"title": "Mysterious vase", "museum": "Test Museum"}])
        label = archive.save_research("", label_text="Fragmentary label number 2020.12")
        self.assertTrue(clue["saved"])
        self.assertTrue(label["saved"])
        self.assertNotEqual(clue["id"], label["id"])
        for values in ({"query": ""}, {"query": " "}, {"query": "x"},
                       {"query": "", "candidate_clues": [{"reason": "Cannot identify"}]}):
            with self.assertRaises(ValueError):
                archive.save_research(**values)
        with self.assertRaises(ValueError):
            archive.save_research("Vase", lang="invalid")

    def test_only_bounded_known_text_is_saved_not_photos_or_visitor_identifiers(self):
        suspicious = {"title": "<Vase>\x00" + "v" * 1000, "artist": ["invalid"],
                      "query": "some vase", "confidence": "certain", "reason": "r" * 2000,
                      "photo": "data:image/jpeg;base64,PRIVATE", "ip": "192.0.2.1",
                      "filename": "visitor-secret.jpg", "source_url": "https://fake.example/guessed"}
        archive.save_research("<unverified>\u2014vase\x00", museum="m" * 400,
                              candidate_clues=[suspicious] * 10, label_text="l" * 4000)
        item = archive.queue_status()["research"]["items"][0]
        self.assertNotIn("<", item["query"])
        self.assertNotIn("\x00", item["query"])
        self.assertNotIn("\u2014", item["query"])
        self.assertEqual(len(item["museum"]), 240)
        self.assertEqual(len(item["label_text"]), 1200)
        self.assertEqual(len(item["candidate_clues"]), 3)
        first = item["candidate_clues"][0]
        self.assertEqual(len(first["title"]), 240)
        self.assertEqual(len(first["reason"]), 500)
        self.assertNotIn("artist", first)
        self.assertNotIn("confidence", first)
        dumped = json.dumps(item)
        for forbidden in ("PRIVATE", "192.0.2.1", "visitor-secret.jpg", "fake.example"):
            self.assertNotIn(forbidden, dumped)

    def test_concurrent_duplicates_are_one_record_and_preserve_every_sighting(self):
        barrier = threading.Barrier(6)
        def save(_):
            barrier.wait()
            return archive.save_research("Shared unknown object", "Test Museum")
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            results = list(executor.map(save, range(6)))
        self.assertEqual(len({r["id"] for r in results}), 1)
        self.assertEqual(sum(not r["duplicate"] for r in results), 1)
        self.assertEqual(archive.queue_status()["research"]["items"][0]["sightings"], 6)

    def test_capacity_is_transactional_and_existing_discoveries_are_not_deleted(self):
        barrier = threading.Barrier(6)
        def save(index):
            barrier.wait()
            try:
                return archive.save_research("Unknown object " + str(index))
            except archive.ResearchQueueFull:
                return {"full": True}
        with patch.object(archive, "RESEARCH_LIMIT", 3), \
                concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            results = list(executor.map(save, range(6)))
            saved = [r for r in results if r.get("saved")]
            self.assertEqual(len(saved), 3)
            inbox = archive.queue_status()["research"]
            self.assertEqual(inbox["counts"], {"needs_research": 3})
            self.assertTrue(archive.save_research(inbox["items"][0]["query"])["duplicate"])
        self.assertEqual(len(archive.queue_status()["research"]["items"]), 3)

    def test_throttle_is_persistent_private_and_counts_invalid_attempts(self):
        with patch.dict(os.environ, {"GALLERY_RESEARCH_HOURLY_LIMIT": "2"}):
            self.assertTrue(archive.allow_research_attempt("192.0.2.1"))
            self.assertTrue(archive.allow_research_attempt("192.0.2.1"))
            self.assertFalse(archive.allow_research_attempt("192.0.2.1"))
            self.assertTrue(archive.allow_research_attempt("192.0.2.2"))
        with archive.database() as db:
            records = [dict(row) for row in db.execute("SELECT * FROM research_usage")]
            self.assertEqual(len(records), 2)
            self.assertNotIn("192.0.2", json.dumps(records))
            self.assertEqual(len({r["client_hash"] for r in records}), 2)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM research_queue").fetchone()[0], 0)

    def test_throttle_rotates_hour_keys_and_removes_old_counters(self):
        with patch.object(archive.time, "time", return_value=100 * 3600):
            archive.allow_research_attempt("192.0.2.1")
        with patch.object(archive.time, "time", return_value=101 * 3600):
            archive.allow_research_attempt("192.0.2.1")
        with archive.database() as db:
            hashes = [r[0] for r in db.execute("SELECT client_hash FROM research_usage")]
            self.assertEqual(len(set(hashes)), 2)
        with patch.object(archive.time, "time", return_value=125 * 3600):
            archive.allow_research_attempt("192.0.2.1")
        with archive.database() as db:
            self.assertEqual(db.execute("SELECT COUNT(*) FROM research_usage").fetchone()[0], 1)

    def test_throttle_concurrency_cannot_overrun_configured_limit(self):
        barrier = threading.Barrier(6)
        def attempt(_):
            barrier.wait()
            return archive.allow_research_attempt("192.0.2.1")
        with patch.dict(os.environ, {"GALLERY_RESEARCH_HOURLY_LIMIT": "3"}), \
                concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            self.assertEqual(sum(executor.map(attempt, range(6))), 3)


if __name__ == "__main__":
    unittest.main()
