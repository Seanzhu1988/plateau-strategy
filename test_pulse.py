"""Pulse's read-only owner summaries, using synthetic traffic and temporary data."""
import datetime
import io
import json
import os
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest import mock

import gallery_archive as archive
import gallery_scout as scout
import pulse_summary as pulse


TODAY = datetime.date(2026, 9, 12)
NOW = datetime.datetime(2026, 9, 12, 12, tzinfo=datetime.timezone.utc).timestamp()
FACTS = {"title": "Pulse fixture vessel", "artist": "Fixture maker", "museum": "Fixture museum",
         "item_number": "FIX-101", "date": "1200", "provider": "fixture", "source_object_id": "101",
         "source_url": "https://example.org/objects/101"}


def day(offset):
    return (TODAY - datetime.timedelta(days=offset)).isoformat()


def fixture_log(*rows):
    return {"searches_total": sum(row.get("count", 0) for row in rows),
            "distinct": len(rows), "unanswered": sum(row.get("misses", 0) for row in rows),
            "top": list(rows), "wanted": [row for row in rows if row.get("misses", 0)]}


class TrafficSummaryTests(unittest.TestCase):
    def test_selected_window_previous_window_and_daily_uniques(self):
        records = {day(i): {"pageviews": 10, "unique_visitors": 2} for i in range(60)}
        records[day(0)] = {"pageviews": 15, "visitor_ids": ["same-person", "same-person", "another"],
                           "unique_visitors": 999}
        records[day(1)]["pageviews"] = 20
        traffic = {"days": records}
        today = pulse.traffic_summary(traffic, days=1, today=TODAY)
        self.assertEqual(today["selected"]["pageviews"], 15)
        self.assertEqual(today["selected"]["visitors"], 2)
        self.assertEqual(today["previous"]["pageviews"], 20)
        self.assertEqual(today["comparison"]["pageviews"]["pct"], -25)
        week = pulse.traffic_summary(traffic, days="7", today=TODAY)
        self.assertEqual(week["selected"]["pageviews"], 85)
        self.assertEqual(week["selected"]["visits"], 14)
        self.assertEqual(week["previous"]["pageviews"], 70)
        self.assertEqual(week["period"]["previous_start"], day(13))
        self.assertEqual(week["period"]["previous_end"], day(7))
        self.assertEqual(week["daily"][0]["date"], day(6))
        self.assertEqual(week["daily"][-1]["date"], day(0))
        self.assertEqual(len(week["spark"]), 14)
        self.assertEqual(week["period"]["visitor_convention"], "Visitor-days")
        self.assertEqual(week["d7"], {"pageviews": 85, "visits": 14})
        month = pulse.traffic_summary(traffic, days=30, today=TODAY)
        self.assertEqual(month["selected"]["pageviews"], 315)
        self.assertEqual(month["previous"]["pageviews"], 300)
        self.assertEqual(len(month["daily"]), 30)
        self.assertEqual(month["d30"]["visits"], 60)

    def test_audience_and_conversion_counts_follow_selected_period_and_exclude_ids(self):
        records = {
            day(0): {"pageviews": 5, "visitor_ids": ["PRIVATE-ID"],
                "sources": {"google": 2}, "paths": {"/universal-gallery": 5},
                "langs": {"zh": 2, "en": 1}, "devices": {"mobile": 3},
                "conversions": {"booking": {"google": 2}, "tour_inquiry": {"direct": 1},
                                "agent_signup": {"direct": 1}, "driver_signup": {"google": 3}},
                "customer_email": "NEVER-RETURN@example.org"},
            day(2): {"pageviews": 4, "unique_visitors": 2, "sources": {"direct": 3},
                "langs": {"en": 4}, "devices": {"desktop": 4}, "conversions": {"booking": {"direct": 1}}},
        }
        today = pulse.traffic_summary({"days": records}, 1, TODAY)
        self.assertEqual(today["languages"], [{"name": "zh", "n": 2}, {"name": "en", "n": 1}])
        self.assertEqual(today["devices"], [{"name": "mobile", "n": 3}])
        self.assertEqual(today["selected"]["bookings"], 2)
        self.assertEqual(today["selected"]["tour_inquiries"], 1)
        self.assertEqual(today["selected"]["agent_signups"], 1)
        self.assertEqual(today["selected"]["driver_signups"], 3)
        week = pulse.traffic_summary({"days": records}, 7, TODAY)
        self.assertEqual(week["languages"][0], {"name": "en", "n": 5})
        self.assertEqual(week["selected"]["bookings"], 3)
        self.assertEqual(week["channels"][0], {"name": "direct", "n": 3})
        self.assertNotIn("PRIVATE-ID", json.dumps(week))
        self.assertNotIn("NEVER-RETURN", json.dumps(week))

    def test_unavailable_traffic_is_not_zero_and_read_does_not_create_file(self):
        with tempfile.TemporaryDirectory(prefix="pulse-traffic-test-") as tmp:
            path = Path(tmp, "missing.json")
            missing = pulse.traffic_summary(path, today=TODAY)
            self.assertFalse(missing["traffic_available"])
            self.assertEqual(missing["traffic_reason"], "missing")
            self.assertIsNone(missing["today"]["visitors"])
            self.assertIsNone(missing["selected"]["bookings"])
            self.assertFalse(path.exists())
        invalid = pulse.traffic_summary({"unexpected": {}}, today=TODAY)
        self.assertFalse(invalid["traffic_available"])
        self.assertEqual(invalid["traffic_reason"], "unavailable")
        empty = pulse.traffic_summary({"days": {}}, today=TODAY)
        self.assertTrue(empty["traffic_available"])
        self.assertEqual(empty["selected"]["visits"], 0)

    def test_missing_previous_history_and_zero_baselines_never_make_a_growth_percentage(self):
        new = pulse.traffic_summary({"days": {day(0): {"pageviews": 5}}}, 7, TODAY)
        self.assertFalse(new["coverage"]["previous_available"])
        self.assertIsNone(new["previous"]["pageviews"])
        self.assertIsNone(new["comparison"]["pageviews"]["pct"])
        partial = pulse.traffic_summary({"days": {day(0): {"pageviews": 5}, day(8): {"pageviews": 2}}}, 7, TODAY)
        self.assertTrue(partial["coverage"]["previous_available"])
        self.assertFalse(partial["comparison"]["pageviews"]["comparable"])
        self.assertIsNone(partial["comparison"]["pageviews"]["pct"])
        zero = pulse.traffic_summary({"days": {day(0): {"pageviews": 5}, day(1): {"pageviews": 0}}}, 1, TODAY)
        self.assertIsNone(zero["comparison"]["pageviews"]["pct"])

    def test_invalid_period_and_malformed_counter_values_are_bounded(self):
        for period in ("bad", "365", -1, None):
            with self.subTest(period=period):
                report = pulse.traffic_summary({"days": {day(0): {"pageviews": "NaN",
                    "unique_visitors": None, "conversions": [], "devices": None}}}, period, TODAY)
                self.assertEqual(report["period"]["days"], 7)
                self.assertEqual(report["today"]["visitors"], 0)
                self.assertEqual(report["today"]["pageviews"], 0)
                self.assertEqual(report["devices"], [])


class SearchTallyTests(unittest.TestCase):
    def read_fixture(self, value, top=60):
        raw = json.dumps(value).encode()
        with mock.patch("builtins.open", return_value=io.BytesIO(raw)) as opened:
            result = pulse.read_search_log("/synthetic/gallery_search_tally.json", top)
        opened.assert_called_once_with("/synthetic/gallery_search_tally.json", "rb")
        return result

    def test_missing_corrupt_or_wrong_schema_is_unavailable_but_empty_is_zero(self):
        with tempfile.TemporaryDirectory(prefix="pulse-search-tally-") as tmp:
            path = Path(tmp, "gallery_search_tally.json")
            self.assertIsNone(pulse.read_search_log(path))
            self.assertFalse(path.exists())
        with mock.patch("builtins.open", return_value=io.BytesIO(b"not-json")):
            self.assertIsNone(pulse.read_search_log("synthetic-tally"))
        for bad in ([], {"bad": []}, {"bad": {"q": "Example"}},
                    {"bad": {"q": "Example", "count": "bad", "hits": 0, "misses": 0}},
                    {"bad": {"q": "Example", "count": 1, "hits": 0, "misses": float("nan")}}):
            with self.subTest(bad=bad):
                self.assertIsNone(self.read_fixture(bad))
        self.assertEqual(self.read_fixture({}), {
            "searches_total": 0, "distinct": 0, "unanswered": 0, "top": [], "wanted": []})

    def test_compact_tally_preserves_popularity_and_miss_rankings_without_reading_raw_log(self):
        tally = {
            "older": {"q": "Older", "count": 6, "hits": 5, "misses": 1, "last": 100},
            "newer": {"q": "Newer", "count": 6, "hits": 4, "misses": 2, "last": 200},
            "missing": {"q": "Missing", "count": 4, "hits": 0, "misses": 4, "last": 50},
        }
        result = self.read_fixture(tally, top=2)
        self.assertEqual([row["q"] for row in result["top"]], ["Newer", "Older"])
        self.assertEqual([row["q"] for row in result["wanted"]], ["Missing", "Newer"])
        self.assertEqual(result["searches_total"], 16)
        self.assertEqual(result["unanswered"], 7)
        self.assertEqual(result["distinct"], 3)

    def test_oversized_tally_is_bounded_by_entry_count_and_bytes(self):
        row = {"q": "Fixture", "count": 1, "hits": 1, "misses": 0}
        self.assertIsNone(self.read_fixture({str(i): row for i in range(5001)}))
        with mock.patch("builtins.open", return_value=io.BytesIO(b" " * (pulse.SEARCH_TALLY_BYTES + 1))):
            self.assertIsNone(pulse.read_search_log("synthetic-tally"))
        boundary = self.read_fixture({str(i): row for i in range(5000)})
        self.assertEqual(boundary["distinct"], 5000)
        self.assertEqual(boundary["searches_total"], 5000)


class GalleryPulseTests(unittest.TestCase):
    def setUp(self):
        self.data = tempfile.TemporaryDirectory(prefix="pulse-gallery-test-")
        self.addCleanup(self.data.cleanup)
        self.enterContext(mock.patch.dict(os.environ, {"DATA_DIR": self.data.name}))
        self.enterContext(mock.patch.object(archive, "BASE_DIR", self.data.name))
        self.db_path = Path(self.data.name, "gallery_archive.sqlite3")
        # Even accidental API use cannot leave this test process.
        self.enterContext(mock.patch("urllib.request.urlopen", side_effect=AssertionError("Network forbidden")))
        self.enterContext(mock.patch("requests.sessions.Session.request", side_effect=AssertionError("Network forbidden")))

    def add_artifact(self, oid=101, query=None):
        facts = dict(FACTS, title="Pulse fixture vessel " + str(oid),
                     item_number="FIX-" + str(oid), source_object_id=str(oid),
                     source_url="https://example.org/objects/" + str(oid))
        if query:
            return archive.enrich([facts], query)["results"][0]["artifact_id"]
        return archive.remember(facts)["artifact_id"]

    def story(self, artifact_id, lang="en"):
        lease = archive.reserve(artifact_id, lang, 100)
        self.assertTrue(archive.finish(artifact_id, lang, lease["token"], "Synthetic saved story", 3, "test-only"))

    def test_absent_gallery_stays_absent_and_unknown_counts_are_null(self):
        report = pulse.gallery_summary(self.db_path, can_generate=False, monthly_cap=1500, now=NOW)
        self.assertFalse(report["available"])
        self.assertEqual(report["reason"], "missing")
        self.assertIsNone(report["artifacts"])
        self.assertIsNone(report["writing"]["pending"])
        self.assertIsNone(report["generation"]["attempted"])
        self.assertEqual(report["generation"]["status"], "not_configured")
        self.assertFalse(self.db_path.exists())

    def test_missing_optional_tables_remain_unavailable_in_existing_store(self):
        with sqlite3.connect(self.db_path) as db:
            db.executescript("CREATE TABLE artifacts(id TEXT); CREATE TABLE stories(artifact_id TEXT,lang TEXT,updated REAL);")
        before = self.db_path.read_bytes()
        report = pulse.gallery_summary(self.db_path, now=NOW)
        self.assertTrue(report["available"])
        self.assertEqual(report["artifacts"], 0)
        self.assertFalse(report["writing"]["available"])
        self.assertIsNone(report["writing"]["pending"])
        self.assertFalse(report["generation"]["available"])
        self.assertFalse(report["scout"]["available"])
        self.assertEqual(self.db_path.read_bytes(), before)

    def test_summary_counts_actual_stories_without_repairing_queue_or_exposing_private_data(self):
        first = self.add_artifact(101, "fixture")
        second = self.add_artifact(102, "second fixture")
        self.story(first)
        self.story(first, "zh")
        archive.save_research("Unidentified test object", label_text="PRIVATE VISITOR CLUE")
        with archive.database() as db:
            # Same raw queue status for completed and incomplete work: report
            # actual text correctly without making a queue-repair side effect.
            db.execute("UPDATE writing_queue SET status='retry',last_reason='PRIVATE ERROR',next_attempt=?", (NOW + 60,))
            db.execute("INSERT INTO generation_spend VALUES('2026-09',3) ON CONFLICT(month) DO UPDATE SET attempted=3")
        before = self.db_path.read_bytes()
        report = pulse.gallery_summary(self.db_path, can_generate=True, monthly_cap=10, now=NOW)
        self.assertEqual(report["artifacts"], 2)
        self.assertEqual(report["stories"], 2)
        self.assertEqual(report["written_artifacts"], 1)
        self.assertEqual(report["english_stories"], 1)
        self.assertEqual(report["writing"]["complete"], 1)
        self.assertEqual(report["writing"]["retry"], 1)
        self.assertEqual(report["writing"]["backlog"], 1)
        self.assertEqual(report["research"]["pending"], 1)
        self.assertEqual(report["generation"]["attempted"], 3)
        self.assertEqual(report["generation"]["remaining"], 7)
        self.assertEqual(report["generation"]["status"], "configured")
        self.assertEqual(self.db_path.read_bytes(), before)
        serialized = json.dumps(report)
        for private in ("PRIVATE VISITOR CLUE", "PRIVATE ERROR", "Synthetic saved story", first, second):
            self.assertNotIn(private, serialized)

    def test_scout_worker_freshness_and_source_health_are_aggregate_only(self):
        with scout._database() as db:
            db.execute("UPDATE scout_state SET last_status='partial',last_started=?,last_finished=?,next_run=?,token='PRIVATE_TOKEN'",
                       (NOW - 60, NOW - 20, NOW + 3600))
            db.execute("INSERT INTO scout_daily VALUES('2026-09-12',2,1)")
            db.execute("INSERT INTO scout_sources(provider,failures,last_success,last_error,next_attempt) VALUES('aic',1,?,'PRIVATE_SOURCE_ERROR',?)",
                       (NOW - 400, NOW + 100))
            db.execute("INSERT INTO worker_state VALUES('writing',?)", (NOW + 1800,))
        report = pulse.gallery_summary(self.db_path, scout_enabled=True, scout_daily_cap=4,
            discovery_path={"last_gallery": NOW - 30, "last_gallery_result": {"at": NOW - 30, "status": "complete"}, "secret": "PRIVATE_STATE"}, now=NOW)
        self.assertTrue(report["scout"]["available"])
        self.assertEqual(report["scout"]["status"], "partial")
        self.assertEqual(report["scout"]["queued_today"], 2)
        self.assertEqual(report["scout"]["daily_cap"], 4)
        self.assertEqual(report["scout"]["sources"][0]["status"], "retry")
        self.assertEqual(report["worker"]["last_run"], NOW - 30)
        self.assertEqual(report["worker"]["next_attempt"], NOW + 1800)
        self.assertEqual(report["worker"]["status"], "complete")
        self.assertNotIn("PRIVATE", json.dumps(report))

    def test_previous_worker_result_cannot_masquerade_as_a_newly_completed_attempt(self):
        state = {"last_gallery": NOW, "last_gallery_result": {"at": NOW - 3600, "status": "complete"}}
        report = pulse.gallery_summary(self.db_path, discovery_path=state, now=NOW)
        self.assertEqual(report["worker"]["last_run"], NOW)
        self.assertEqual(report["worker"]["last_result_at"], NOW - 3600)
        self.assertEqual(report["worker"]["status"], "pending")
        state["last_gallery_result"] = {"status": "complete"}
        self.assertEqual(pulse.gallery_summary(self.db_path, discovery_path=state, now=NOW)["worker"]["status"], "pending")
        state["last_gallery_result"] = {"at": NOW, "status": "complete"}
        self.assertEqual(pulse.gallery_summary(self.db_path, discovery_path=state, now=NOW)["worker"]["status"], "complete")
        self.assertFalse(self.db_path.exists())

    def test_canonical_ai_story_no_longer_appears_unwritten_in_search_demand(self):
        artifact_id = self.add_artifact(query="ceremony vessel")
        log = fixture_log({"q": "ceremony vessel", "count": 5, "hits": 5, "misses": 0})
        before = pulse.search_summary(log, self.db_path)
        self.assertEqual(before["unwritten"][0]["unwritten_artifacts"], 1)
        self.story(artifact_id)
        after = pulse.search_summary(log, self.db_path)
        self.assertTrue(after["canonical_available"])
        self.assertEqual(after["unwritten"], [])

    def test_same_artist_or_broad_query_cannot_hide_an_unwritten_artifact(self):
        first = self.add_artifact(101, "Fixture maker")
        self.add_artifact(102, "Fixture maker")
        self.story(first)
        log = fixture_log({"q": "Fixture maker", "count": 5, "hits": 5, "misses": 0})
        report = pulse.search_summary(log, self.db_path, curated_items={"items": {"one": FACTS}})
        self.assertEqual(report["unwritten"][0]["unwritten_artifacts"], 1)
        self.assertEqual(report["unwritten"][0]["basis"], "canonical_archive")

    def test_accession_and_requested_language_cannot_borrow_other_stories(self):
        first = self.add_artifact(101, "FIX-102")
        second = self.add_artifact(102)
        self.story(first)
        self.story(second, "zh")
        log = fixture_log({"q": "FIX-102", "count": 4, "hits": 4})
        self.assertEqual(len(pulse.search_summary(log, self.db_path, lang="en")["unwritten"]), 1)
        self.assertEqual(pulse.search_summary(log, self.db_path, lang="zh")["unwritten"], [])

    def test_search_log_misses_remain_historical_and_test_queries_are_hidden(self):
        self.add_artifact()
        log = fixture_log({"q": "test", "count": 10, "hits": 0, "misses": 10},
                          {"q": "Ancient fixture", "count": 6, "hits": 0, "misses": 6})
        report = pulse.search_summary(log, self.db_path)
        self.assertEqual(report["missed"], [{"q": "Ancient fixture", "n": 6}])
        self.assertEqual(report["total"], 16)
        self.assertEqual(report["timeframe"], "All recorded searches")

    def test_missing_canonical_store_is_unavailable_not_everything_written(self):
        log = fixture_log({"q": "Unknown fixture", "count": 2, "hits": 2})
        report = pulse.search_summary(log, self.db_path)
        self.assertTrue(report["available"])
        self.assertFalse(report["canonical_available"])
        self.assertFalse(self.db_path.exists())
        self.assertFalse(pulse.search_summary(None, self.db_path)["available"])


if __name__ == "__main__":
    unittest.main()
