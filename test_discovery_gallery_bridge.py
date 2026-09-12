"""No network, no writing provider, and no production state in these tests."""
import os
import tempfile
import unittest
from unittest import mock

import discovery


class GalleryBridgeTests(unittest.TestCase):
    def setUp(self):
        self.data = tempfile.TemporaryDirectory(prefix="gallery-bridge-test-")
        self.env = mock.patch.dict(os.environ, {"DATA_DIR": self.data.name})
        self.env.start()
        self.previous = discovery._gallery_process

    def tearDown(self):
        discovery.set_gallery_bridge(self.previous)
        self.env.stop()
        self.data.cleanup()

    def test_absent_bridge_is_a_read_only_noop(self):
        discovery.set_gallery_bridge(None)
        self.assertEqual(discovery.gallery_refine()["status"], "no_bridge")
        self.assertEqual(os.listdir(self.data.name), [])

    def test_hourly_gate_survives_reload_of_persisted_state(self):
        callback = mock.Mock(return_value={"ok": True, "status": "written"})
        discovery.set_gallery_bridge(callback)
        with mock.patch.object(discovery.time, "time", return_value=10000):
            self.assertEqual(discovery.gallery_refine()["status"], "written")
        with mock.patch.object(discovery.time, "time", return_value=13599):
            self.assertEqual(discovery.gallery_refine()["status"], "not_due")
        self.assertEqual(callback.call_count, 1)
        self.assertEqual(discovery._load()["last_gallery_result"]["status"], "written")
        with mock.patch.object(discovery.time, "time", return_value=13600):
            discovery.gallery_refine()
        self.assertEqual(callback.call_count, 2)

    def test_callback_failure_is_contained_and_throttled(self):
        callback = mock.Mock(side_effect=RuntimeError("private provider details"))
        discovery.set_gallery_bridge(callback)
        with mock.patch.object(discovery.time, "time", return_value=10000):
            self.assertEqual(discovery.gallery_refine(), {"ok": False, "status": "failed"})
            self.assertEqual(discovery.gallery_refine()["status"], "not_due")
        self.assertEqual(callback.call_count, 1)
        self.assertNotIn("private", str(discovery._load()))


if __name__ == "__main__":
    unittest.main()
