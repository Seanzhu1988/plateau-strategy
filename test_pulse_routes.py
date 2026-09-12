"""Owner authorization and mobile Pulse route integration on isolated data."""
import datetime
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest import mock

_boot = tempfile.TemporaryDirectory(prefix="pulse-route-boot-")
os.environ["DATA_DIR"] = _boot.name
os.environ["DISCOVERY_ENABLED"] = "false"
os.environ["DISPATCH_REMINDERS"] = "false"

import app as site


class PulseRouteTests(unittest.TestCase):
    def setUp(self):
        self.data = tempfile.TemporaryDirectory(prefix="pulse-route-test-")
        self.addCleanup(self.data.cleanup)
        self.enterContext(mock.patch.dict(os.environ, {"DATA_DIR": self.data.name}))
        self.traffic = Path(self.data.name, "traffic.json")
        self.tally = Path(self.data.name, "gallery_search_tally.json")
        self.enterContext(mock.patch.object(site, "TRAFFIC_PATH", str(self.traffic)))
        self.enterContext(mock.patch.object(site.gallery_log, "TALLY_PATH", str(self.tally)))
        self.enterContext(mock.patch.object(site, "_presence_count", return_value=2))
        self.enterContext(mock.patch.object(site, "_revenue_snapshot", return_value={"ok": False}))
        self.enterContext(mock.patch.object(site, "_pulse_worklist", return_value={"ok": False}))
        self.enterContext(mock.patch("requests.sessions.Session.request", side_effect=AssertionError("No external requests")))
        site.app.config["TESTING"] = True
        self.client = site.app.test_client()

    def owner(self):
        with self.client.session_transaction() as session:
            session["owner"] = True

    def test_every_period_is_owner_only_and_public_shell_contains_no_metrics(self):
        for days in ("1", "7", "30", "invalid"):
            response = self.client.get("/api/pulse?days=" + days)
            self.assertEqual(response.status_code, 401)
            self.assertTrue(response.json["auth_required"])
            self.assertNotIn("revenue", response.json)
            self.assertNotIn("gallery", response.json)
        shell = self.client.get("/pulse")
        self.assertEqual(shell.status_code, 200)
        self.assertIn("no-store", shell.headers["Cache-Control"])
        self.assertIn("Owner sign in", shell.text)
        self.assertNotIn("REVENUE_PUSH_KEY", shell.text)
        self.assertNotIn('src="/site-auth.js', shell.text)
        self.assertNotIn('src="/install.js', shell.text)

    def test_visitor_tools_remain_on_the_public_gallery(self):
        with self.client.get("/universal-gallery") as shell:
            self.assertEqual(shell.status_code, 200)
            self.assertIn('src="/site-auth.js', shell.text)
            self.assertIn('src="/install.js', shell.text)

    def test_owner_period_numbers_and_private_cache_control(self):
        today = datetime.date.today()
        records = {(today - datetime.timedelta(days=i)).isoformat(): {
            "pageviews": 10, "unique_visitors": 2,
            "langs": {"zh": 3}, "devices": {"mobile": 4},
            "conversions": {"tour_inquiry": {"direct": 1}},
            "customer_email": "PRIVATE-FIXTURE@example.org",
        } for i in range(60)}
        self.traffic.write_text(json.dumps({"days": records}), encoding="utf-8")
        self.tally.write_text("{}", encoding="utf-8")
        before = self.traffic.read_bytes()
        self.owner()
        for days in (1, 7, 30):
            response = self.client.get("/api/pulse?days=" + str(days))
            self.assertEqual(response.status_code, 200)
            self.assertIn("private", response.headers["Cache-Control"])
            self.assertIn("no-store", response.headers["Cache-Control"])
            payload = response.json
            self.assertEqual(payload["period"]["days"], days)
            self.assertEqual(payload["selected"]["pageviews"], 10 * days)
            self.assertEqual(payload["selected"]["tour_inquiries"], days)
            self.assertEqual(payload["languages"][0]["n"], 3 * days)
            self.assertEqual(payload["comparison"]["pageviews"]["pct"], 0)
            self.assertEqual(payload["online"], 2)
            self.assertNotIn("PRIVATE-FIXTURE", response.text)
            self.assertIn("+00:00", payload["updated_at"])
        self.assertEqual(self.traffic.read_bytes(), before)
        self.assertFalse(Path(self.data.name, "gallery_archive.sqlite3").exists())

    def test_unavailable_stores_are_reported_without_creating_or_zeroing_them(self):
        self.owner()
        response = self.client.get("/api/pulse?days=invalid")
        self.assertEqual(response.status_code, 200)
        payload = response.json
        self.assertEqual(payload["period"]["days"], 7)
        self.assertFalse(payload["traffic_available"])
        self.assertIsNone(payload["selected"]["pageviews"])
        self.assertFalse(payload["gallery"]["available"])
        self.assertIsNone(payload["gallery"]["stories"])
        self.assertFalse(payload["searches"]["ok"])
        self.assertFalse(self.traffic.exists())
        self.assertFalse(self.tally.exists())

    def test_home_screen_manifest_keeps_private_pulse_destination(self):
        response = self.client.get("/pulse.webmanifest")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["start_url"], "/pulse")
        self.assertEqual(response.json["display"], "standalone")
        self.assertEqual(response.json["theme_color"], "#1f3a5f")


if __name__ == "__main__":
    unittest.main()
