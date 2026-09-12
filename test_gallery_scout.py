"""Scout tests use disposable SQLite data, fake museum responses and no models."""
import concurrent.futures
import importlib
import json
import os
import tempfile
import threading
import unittest
from unittest.mock import patch

import gallery_archive as archive
import gallery_scout as scout


def aic_object(oid=1, public=True):
    return {"id": oid, "title": "Museum highlight %s" % oid, "artist_display": "An artist",
            "date_display": "1880", "main_reference_number": "A.%s" % oid,
            "medium_display": "Oil on canvas", "dimensions": "60 × 40 cm",
            "credit_line": "Gift of a collector", "place_of_origin": "France",
            "description": "<p>Made for an exhibition in <b>Paris</b>.</p><script>private()</script>",
            "is_public_domain": public, "image_id": "valid-image-id"}


def met_object(oid=101, public=True):
    return {"objectID": oid, "title": "Met highlight %s" % oid, "artistDisplayName": "A maker",
            "objectDate": "1200", "accessionNumber": "M.%s" % oid, "medium": "Bronze",
            "culture": "Chinese", "period": "Song dynasty", "creditLine": "Gift",
            "dimensions": "20 cm", "isPublicDomain": public,
            "primaryImage": "https://images.metmuseum.org/CRDImages/a.jpg",
            "additionalImages": ["https://evil.example/image.jpg"],
            "objectURL": "http://127.0.0.1/private"}


class ScoutTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="scout-test-")
        self.addCleanup(self.tmp.cleanup)
        self.env = patch.dict(os.environ, {"DATA_DIR": self.tmp.name,
            "GALLERY_SCOUT_ENABLED": "true", "GALLERY_SCOUT_DAILY_CAP": "4", "ANTHROPIC_API_KEY": ""})
        self.env.start()
        self.addCleanup(self.env.stop)
        self.base = patch.object(archive, "BASE_DIR", self.tmp.name)
        self.base.start()
        self.addCleanup(self.base.stop)
        # A fixed instant at UTC noon permits deterministic six-hour/day checks.
        self.clock = patch.object(scout.time, "time", return_value=1789214400.0)
        self.now = self.clock.start()
        self.addCleanup(self.clock.stop)
        self.transport = patch.object(scout._Client, "get", side_effect=self.response)
        self.http = self.transport.start()
        self.addCleanup(self.transport.stop)

    def response(self, url):
        if "artworks/search?" in url:
            return {"data": [{"id": i} for i in range(1, 9)], "pagination": {"total_pages": 2}}
        if "/v1.1/search?" in url:
            return {"total": 32, "objectIDs": list(range(101, 109))}
        if "/artworks/" in url:
            oid = int(url.split("/artworks/")[1].split("?")[0])
            return {"data": aic_object(oid)}
        return met_object(int(url.rsplit("/", 1)[1]))

    def advance(self, seconds):
        self.now.return_value += seconds

    def test_no_ai_key_gathers_evidence_and_does_not_invent_demand(self):
        result = scout.run_once()
        self.assertEqual(result["queued"], 4)
        status = scout.status()
        self.assertEqual(status["queued_today"], 4)
        self.assertEqual(status["reserved_today"], 0)
        with archive.database() as db:
            rows = db.execute("SELECT * FROM artifacts").fetchall()
            self.assertEqual(len(rows), 4)
            self.assertTrue(all(r["demand_count"] == r["confirmed_count"] == 0 for r in rows))
            self.assertEqual(db.execute("SELECT COUNT(*) FROM queries").fetchone()[0], 0)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM generation_spend").fetchone()[0], 0)
            facts = [json.loads(r["facts"]) for r in rows]
        self.assertEqual({f["provider"] for f in facts}, {"aic", "met"})
        aic = next(f for f in facts if f["provider"] == "aic")
        self.assertIn("Paris", aic["historical_context"])
        self.assertNotIn("private()", aic["historical_context"])
        self.assertEqual(aic["discovery_origin"], "museum_highlights")
        self.assertEqual(aic["research_source_url"], aic["source_url"])

    def test_persisted_restart_gate_and_daily_cap(self):
        scout.run_once()
        self.http.reset_mock()
        importlib.reload(scout)
        with patch.object(scout._Client, "get", side_effect=self.response) as http:
            self.assertEqual(scout.run_once()["status"], "waiting")
            self.advance(scout.INTERVAL)
            self.assertEqual(scout.run_once()["status"], "daily_cap")
            http.assert_not_called()
            self.advance(86400)
            self.assertEqual(scout.run_once()["queued"], 4)
        self.assertEqual(scout.status()["queued_today"], 4)

    def test_concurrent_call_reserves_gate_before_network_and_releases_lock(self):
        entered, finish = threading.Event(), threading.Event()
        original = self.response

        def blocking(url):
            entered.set()
            self.assertTrue(finish.wait(5))
            return original(url)

        self.http.side_effect = blocking
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            first = pool.submit(scout.run_once)
            self.assertTrue(entered.wait(5))
            # A second process-equivalent connection can both read and write
            # while the first worker is waiting on the museum.
            with archive.database() as db:
                db.execute("BEGIN IMMEDIATE")
                db.execute("INSERT OR IGNORE INTO worker_state VALUES('test',0)")
            second = pool.submit(scout.run_once).result(timeout=5)
            self.assertEqual(second["status"], "waiting")
            finish.set()
            self.assertEqual(first.result(timeout=5)["queued"], 4)

    def test_cached_and_existing_queue_release_slots_and_identity_deduplicates(self):
        client = scout._Client()
        first = scout._fetch_facts(client, "aic", "1", self.now.return_value)
        existing = archive.queue_background(first)
        second = scout._fetch_facts(client, "met", "101", self.now.return_value)
        saved = archive.remember(second)["artifact_id"]
        with archive.database() as db:
            archive._story_put(db, saved, "en", "A previously written story. " * 20, 3, "curated")
        result = scout.run_once()
        self.assertEqual(result["queued"], 4)
        self.assertGreater(result["checked"], result["queued"])
        with archive.database() as db:
            self.assertEqual(db.execute("SELECT COUNT(*) FROM writing_queue").fetchone()[0], 5)
            self.assertEqual(db.execute("SELECT demand_count FROM artifacts WHERE id=?",
                                        (existing["artifact_id"],)).fetchone()[0], 0)
        self.advance(86400)
        scout.run_once()
        with archive.database() as db:
            self.assertEqual(db.execute("SELECT COUNT(*) FROM artifacts WHERE accession='a.1'").fetchone()[0], 1)

    def test_source_failure_is_partial_and_other_source_continues_then_recovers(self):
        def failing(url):
            if "artworks/search" in url:
                raise RuntimeError("secret key and private account URL")
            return self.response(url)
        self.http.side_effect = failing
        result = scout.run_once()
        self.assertEqual(result["status"], "partial")
        self.assertEqual(result["queued"], 4)
        source = next(s for s in scout.status()["sources"] if s["provider"] == "aic")
        self.assertEqual(source["cursor"], 0)
        self.assertEqual(source["failures"], 1)
        self.assertNotIn("secret", json.dumps(scout.status()))
        self.advance(86400)
        self.http.side_effect = self.response
        scout.run_once()
        source = next(s for s in scout.status()["sources"] if s["provider"] == "aic")
        self.assertEqual(source["cursor"], 1)
        self.assertEqual(source["failures"], 0)

    def test_detail_failure_retries_without_spending_and_pass_is_bounded(self):
        def failing(url):
            if "/search?" not in url:
                raise scout.SourceError("http_503")
            return self.response(url)
        self.http.side_effect = failing
        self.assertEqual(scout.run_once()["queued"], 0)
        self.assertEqual(scout.status()["candidates"]["retry"], scout.MAX_DETAILS)
        self.assertEqual(scout.status()["reserved_today"], 0)
        self.assertEqual(self.http.call_count, 2 + scout.MAX_DETAILS)
        self.advance(scout.INTERVAL)
        self.http.side_effect = self.response
        self.assertEqual(scout.run_once()["queued"], 4)

    def test_queue_full_retries_and_uncertain_queue_exception_keeps_safe_reservation(self):
        self.advance(-6 * 3600)
        with patch.object(archive, "queue_background", return_value={"queued": False, "reason": "queue_full"}):
            self.assertEqual(scout.run_once()["queued"], 0)
        self.assertEqual(scout.status()["reserved_today"], 0)
        self.assertEqual(scout.status()["candidates"]["retry"], scout.MAX_DETAILS)
        self.advance(scout.INTERVAL)
        with patch.object(archive, "queue_background", side_effect=RuntimeError("uncertain commit")) as queue:
            scout.run_once()
            self.assertEqual(queue.call_count, 4)
        self.assertEqual(scout.status()["reserved_today"], 4)
        self.advance(scout.INTERVAL)
        self.assertEqual(scout.run_once()["status"], "daily_cap")

    def test_off_switch_stops_before_network_and_cap_configuration_is_bounded(self):
        os.environ["GALLERY_SCOUT_ENABLED"] = "false"
        self.assertEqual(scout.run_once()["status"], "disabled")
        self.http.assert_not_called()
        self.assertFalse(scout.status()["enabled"])
        os.environ["GALLERY_SCOUT_DAILY_CAP"] = "invalid"
        self.assertEqual(scout.status()["daily_cap"], 4)
        os.environ["GALLERY_SCOUT_DAILY_CAP"] = "9999"
        self.assertEqual(scout.status()["daily_cap"], 24)

    def test_only_public_domain_official_images_and_constructed_source_urls(self):
        for provider, oid, row in (("aic", "1", aic_object(1, False)),
                                   ("met", "101", met_object(101, False))):
            self.http.return_value = {"data": row} if provider == "aic" else row
            self.http.side_effect = None
            facts = scout._fetch_facts(scout._Client(), provider, oid, self.now.return_value)
            self.assertTrue(facts["copyright"])
            self.assertEqual(facts["images"], [])
            self.assertEqual(facts["image"], "")
            self.assertNotIn("127.0.0.1", facts["source_url"])
        self.http.side_effect = self.response
        facts = scout._fetch_facts(scout._Client(), "met", "101", self.now.return_value)
        self.assertEqual(len(facts["images"]), 1)
        with self.assertRaises(scout.SourceError):
            scout._fetch_facts(scout._Client(), "met", "../private", self.now.return_value)

    def test_live_feed_uses_highlights_and_saved_page_cursors(self):
        scout.run_once()
        urls = [c.args[0] for c in self.http.call_args_list]
        query = json.loads(scout.urllib.parse.parse_qs(scout.urllib.parse.urlsplit(urls[0]).query)["params"][0])
        self.assertEqual(query["query"], {"term": {"is_boosted": True}})
        self.assertIn("isHighlight=true", urls[1])
        self.advance(86400)
        self.http.reset_mock()
        scout.run_once()
        urls = [c.args[0] for c in self.http.call_args_list]
        query = json.loads(scout.urllib.parse.parse_qs(scout.urllib.parse.urlsplit(urls[0]).query)["params"][0])
        self.assertEqual(query["page"], 2)
        self.assertIn("offset=24", urls[1])

    def test_detail_crossing_midnight_uses_new_days_budget(self):
        # Start immediately before midnight; the first museum detail arrives
        # after midnight. The old day must have no charged queue entries.
        self.advance(12 * 3600 - 1)
        previous_day = scout._day(self.now.return_value)
        original = self.response

        def crossing(url):
            if "/search?" not in url:
                self.advance(2)
            return original(url)

        self.http.side_effect = crossing
        self.assertEqual(scout.run_once()["queued"], 4)
        with archive.database() as db:
            self.assertIsNone(db.execute("SELECT * FROM scout_daily WHERE day=?", (previous_day,)).fetchone())
        self.assertEqual(scout.status()["queued_today"], 4)

    def test_preserves_feed_priority_over_numeric_object_id(self):
        original = self.response

        def ranked(url):
            if "artworks/search?" in url:
                return {"data": [{"id": 9}, {"id": 2}, {"id": 1}], "pagination": {"total_pages": 1}}
            return original(url)

        self.http.side_effect = ranked
        scout.run_once()
        aic_details = [c.args[0] for c in self.http.call_args_list if "/artworks/" in c.args[0]
                       and "/search?" not in c.args[0]]
        self.assertIn("/artworks/9?", aic_details[0])
        self.assertIn("/artworks/2?", aic_details[1])


class TransportTests(unittest.TestCase):
    def test_rejects_external_target_redirects_and_large_response(self):
        client = scout._Client()
        with self.assertRaisesRegex(scout.SourceError, "unapproved_source"):
            client.get("https://127.0.0.1/admin")
        self.assertIsNone(scout._NoRedirect().redirect_request(None, None, 302, "", {}, "https://evil.example"))
        with patch.object(client.opener, "open") as opened:
            response = opened.return_value.__enter__.return_value
            response.read1.return_value = b"x" * (scout.MAX_RESPONSE + 1)
            with self.assertRaisesRegex(scout.SourceError, "response_too_large"):
                client.get(scout.AIC + "/1")
            self.assertLessEqual(opened.call_args.kwargs["timeout"], 6)

    def test_exhausted_network_budget_stops_before_request(self):
        client = scout._Client()
        client.deadline = 0
        with patch.object(client.opener, "open") as opened:
            with self.assertRaisesRegex(scout.SourceError, "network_budget"):
                client.get(scout.AIC + "/1")
            opened.assert_not_called()


if __name__ == "__main__":
    unittest.main()
