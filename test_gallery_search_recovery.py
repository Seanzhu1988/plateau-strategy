"""Source outages are not catalogue misses. All providers and state are isolated."""
import os
import sqlite3
import tempfile
import time
import unittest
from unittest import mock

from test_gallery_journey import site, FACTS
import gallery_archive
import requests


class SearchRecoveryTests(unittest.TestCase):
    def setUp(self):
        self.data = tempfile.TemporaryDirectory(prefix="gallery-search-recovery-")
        self.addCleanup(self.data.cleanup)
        patcher = mock.patch.dict(os.environ, {"DATA_DIR": self.data.name})
        patcher.start()
        self.addCleanup(patcher.stop)
        site.app.config["TESTING"] = True
        self.client = site.app.test_client()
        site._GAL_CACHE.clear()
        site._GAL_SOURCE_CONTEXT.partial = False
        for name in ("_gal_aic", "_gal_moma", "_gal_wikidata"):
            patcher = mock.patch.object(site, name, return_value=[])
            patcher.start()
            self.addCleanup(patcher.stop)

    def search(self, query="Acceptance test vessel", discover="0"):
        return self.client.get("/api/gallery/search", query_string={"q": query, "discover": discover}).get_json()

    def test_http_failure_is_partial_and_not_cached_then_recovers(self):
        def provider(query):
            return [dict(FACTS)] if site._gal_get("https://example.org/catalogue") else []

        bad = mock.Mock()
        bad.raise_for_status.side_effect = requests.HTTPError("fixture 503")
        good = mock.Mock()
        good.json.return_value = {"data": "fixture"}
        with mock.patch.object(site, "_gal_met", side_effect=provider), \
                mock.patch("requests.get", side_effect=[bad, good]):
            first = self.search()
            self.assertTrue(first["partial"])
            self.assertEqual(first["source_failures"], 1)
            self.assertEqual(first["results"], [])
            self.assertNotIn("acceptance test vessel", site._GAL_CACHE)
            second = self.search()
        self.assertFalse(second["partial"])
        self.assertEqual(second["results"][0]["item_number"], FACTS["item_number"])

    def test_busy_sources_do_not_become_a_cached_empty_search(self):
        unavailable = mock.Mock()
        unavailable.acquire.return_value = False
        with mock.patch.object(site, "_GAL_SLOTS", unavailable):
            first = self.search(discover="1")
        self.assertTrue(first["partial"])
        self.assertEqual(first["source_failures"], 4)
        self.assertNotIn("acceptance test vessel", site._GAL_CACHE)
        with gallery_archive.database() as db:
            self.assertIsNone(db.execute("SELECT * FROM queries WHERE query='acceptance test vessel'").fetchone())
        with mock.patch.object(site, "_gal_met", return_value=[dict(FACTS)]):
            second = self.search()
        self.assertFalse(second["partial"])
        self.assertEqual(len(second["results"]), 1)

    def test_complete_negative_cache_expires_after_a_minute(self):
        with mock.patch.object(site, "_gal_met", return_value=[]) as provider:
            self.assertFalse(self.search()["partial"])
            self.search()
            self.assertEqual(provider.call_count, 1)
            _, payload = site._GAL_CACHE["acceptance test vessel"]
            site._GAL_CACHE["acceptance test vessel"] = (time.time() - 61, payload)
            self.search()
            self.assertEqual(provider.call_count, 2)

    def test_a_legacy_partial_cache_entry_is_never_reused(self):
        site._GAL_CACHE["acceptance test vessel"] = (time.time(), {"results": [], "partial": True})
        with mock.patch.object(site, "_gal_met", return_value=[dict(FACTS)]) as provider:
            result = self.search()
        provider.assert_called_once()
        self.assertFalse(result["partial"])
        self.assertEqual(len(result["results"]), 1)

    def test_missing_local_museum_index_is_incomplete(self):
        with mock.patch("os.path.exists", return_value=False):
            self.assertEqual(self._original_moma("fixture"), [])
        self.assertTrue(site._GAL_SOURCE_CONTEXT.partial)

    def test_broken_moma_text_index_is_incomplete_not_a_genuine_miss(self):
        db = mock.Mock()
        db.execute.side_effect = [[], mock.Mock(fetchall=lambda: []),
                                  sqlite3.OperationalError("fixture broken FTS")]
        with mock.patch("os.path.exists", return_value=True), \
                mock.patch.object(site.sqlite3, "connect", return_value=db):
            self.assertEqual(self._original_moma("fixture"), [])
        self.assertTrue(site._GAL_SOURCE_CONTEXT.partial)
        db.close.assert_called_once()

    def test_met_uses_bounded_replacement_for_retiring_search_endpoint(self):
        with mock.patch.object(site, "_gal_get", return_value={"objectIDs": []}) as fetch:
            self.assertEqual(site._gal_met("vessel", limit=8), [])
        self.assertIn("/v1.1/search?q=vessel&offset=0&limit=16", fetch.call_args.args[0])

    def test_wikidata_keeps_accessioned_artifacts_without_reference_images(self):
        def claim(value):
            return [{"mainsnak": {"datavalue": {"value": value}}}]

        responses = [
            {"search": [{"id": "Q100"}, {"id": "Q200"}]},
            {"entities": {
                "Q100": {"labels": {"en": {"value": "Fixture stone vessel"}},
                         "claims": {"P195": claim({"id": "Q300"}), "P217": claim("STONE-001")}},
                "Q200": {"labels": {"en": {"value": "A person with no artifact evidence"}}, "claims": {}}}},
            {"entities": {"Q300": {"labels": {"en": {"value": "Fixture museum"}}, "claims": {}}}},
        ]
        with mock.patch.object(site, "_gal_get", side_effect=responses):
            rows = self._original_wikidata("Fixture stone vessel")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["item_number"], "STONE-001")
        self.assertEqual(rows[0]["source"], "Fixture museum")
        self.assertEqual(rows[0]["image"], "")
        self.assertEqual(rows[0]["images"], [])
        self.assertEqual(rows[0]["source_url"], "https://www.wikidata.org/wiki/Q100")

    def test_wikidata_never_restarts_network_calls_after_its_deadline(self):
        with mock.patch.object(site.time, "monotonic", side_effect=[0, 17]), \
                mock.patch.object(site, "_gal_get") as network:
            self.assertEqual(self._original_wikidata("Unknown fixture object"), [])
        network.assert_not_called()
        self.assertTrue(site._GAL_SOURCE_CONTEXT.partial)

    _original_wikidata = staticmethod(site._gal_wikidata)
    _original_moma = staticmethod(site._gal_moma)


if __name__ == "__main__":
    unittest.main()
