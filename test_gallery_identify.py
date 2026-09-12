"""Photo-search boundary tests. All provider calls are mocked; no live spend."""

import base64
import concurrent.futures
import io
import json
import os
import sqlite3
import struct
import tempfile
import unittest
import zlib
from unittest.mock import Mock, patch

from flask import Flask
from PIL import Image, PngImagePlugin
from werkzeug.datastructures import MultiDict

import gallery_identify as G


def photo(kind="PNG", size=(96, 64), metadata=False, transparent=False):
    image = Image.new("RGBA" if transparent else "RGB", size,
                      (255, 0, 0, 0) if transparent else (40, 90, 150))
    output = io.BytesIO()
    options = {}
    if metadata and kind == "JPEG":
        exif = Image.Exif()
        exif[315] = "Private Photographer"
        exif[271] = "Private Camera"
        exif[274] = 6
        options.update(exif=exif.tobytes(), icc_profile=b"private profile bytes")
    elif metadata and kind == "PNG":
        info = PngImagePlugin.PngInfo()
        info.add_text("Author", "Private Photographer")
        info.add_text("Location", "Private Street")
        options["pnginfo"] = info
    image.save(output, format=kind, **options)
    return output.getvalue()


def provider_response(candidates=None, label="Example artifact label", stop="end_turn"):
    if candidates is None:
        candidates = [{"title": "The Starry Night", "artist": "Vincent van Gogh",
                       "museum": "Museum of Modern Art", "item_number": "472.1941",
                       "query": "The Starry Night Vincent van Gogh", "confidence": "high",
                       "reason": "The label names the title and artist. Confirm the collection result."}]
    response = Mock()
    response.raise_for_status.return_value = None
    response.json.return_value = {
        "stop_reason": stop, "content": [{"type": "text", "text": json.dumps({
            "candidates": candidates, "label_text": label,
            "reason": "Check the museum's collection record." if candidates else "The label is not readable.",
        })}],
    }
    return response


class PhotoIntakeTests(unittest.TestCase):
    def test_jpeg_pixels_are_preserved_and_orientation_applied_without_metadata(self):
        raw = photo("JPEG", metadata=True)
        clean = G.prepare_image(raw)
        self.assertNotIn(b"Private", clean)
        self.assertNotIn(b"private profile", clean)
        with Image.open(io.BytesIO(clean)) as image:
            image.load()
            self.assertEqual(image.size, (64, 96))
            self.assertFalse(image.getexif())
            self.assertNotIn("icc_profile", image.info)

    def test_png_text_and_transparency_do_not_survive_as_private_metadata(self):
        clean = G.prepare_image(photo("PNG", metadata=True, transparent=True))
        self.assertNotIn(b"Private", clean)
        with Image.open(io.BytesIO(clean)) as image:
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(image.getpixel((40, 40)), (255, 255, 255))

    def test_webp_is_decoded_and_reencoded(self):
        clean = G.prepare_image(photo("WEBP"))
        self.assertTrue(clean.startswith(b"\xff\xd8\xff"))
        with Image.open(io.BytesIO(clean)) as image:
            self.assertEqual(image.size, (96, 64))

    def test_large_valid_photo_is_downscaled_by_pixels_and_long_edge(self):
        clean = G.prepare_image(photo("JPEG", (3600, 2400)))
        with Image.open(io.BytesIO(clean)) as image:
            self.assertLessEqual(max(image.size), G.MAX_LONG_EDGE)
            self.assertLessEqual(image.width * image.height, G.MAX_PREPARED_PIXELS)

    def test_magic_without_valid_pixels_is_rejected(self):
        for raw in (b"not a photo", b"\xff\xd8\xff\xe0" + b"0" * 100,
                    b"\x89PNG\r\n\x1a\n" + b"0" * 100, photo()[:100]):
            with self.subTest(raw=raw[:12]), self.assertRaises(ValueError):
                G.prepare_image(raw)

    def test_oversized_bytes_and_tiny_images_are_rejected(self):
        with self.assertRaises(ValueError):
            G.prepare_image(b"\xff\xd8\xff" + b"0" * G.MAX_IMAGE_BYTES)
        with self.assertRaises(ValueError):
            G.prepare_image(photo(size=(2, 2)))

    def test_dimension_bomb_is_rejected_before_pixel_decode(self):
        def chunk(kind, value):
            return struct.pack(">I", len(value)) + kind + value + struct.pack(">I", zlib.crc32(kind + value))
        raw = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", 30000, 30000, 8, 2, 0, 0, 0))
               + chunk(b"IDAT", zlib.compress(b"\0")) + chunk(b"IEND", b""))
        with self.assertRaises(ValueError):
            G.prepare_image(raw)

    def test_animation_is_rejected(self):
        frames = [Image.new("RGB", (64, 64), color) for color in ("red", "blue")]
        output = io.BytesIO()
        frames[0].save(output, format="PNG", save_all=True, append_images=frames[1:], duration=100)
        with self.assertRaises(ValueError):
            G.prepare_image(output.getvalue())


class IdentifyRouteTests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory(prefix="gallery-identify-test-")
        self.environment = patch.dict(os.environ, {
            "DATA_DIR": self.folder.name, "ANTHROPIC_API_KEY": "test-placeholder-not-live",
            "GALLERY_IDENTIFY_HOURLY_LIMIT": "100", "GALLERY_IDENTIFY_MONTHLY_CAP": "500",
            "GALLERY_IDENTIFY_TRUST_PROXY": "0", "RENDER": "false", "GALLERY_VISION_MODEL": "",
        })
        self.environment.start()
        self.app = Flask(__name__)
        self.app.config.update(TESTING=True, DATA_DIR=self.folder.name)
        self.app.register_blueprint(G.gallery_identify_bp)
        self.client = self.app.test_client()
        self.provider = patch.object(G.requests, "post", return_value=provider_response())
        self.post = self.provider.start()

    def tearDown(self):
        self.provider.stop()
        self.environment.stop()
        self.folder.cleanup()

    def upload(self, raw=None, consent=G.CONSENT_VERSION, **fields):
        data = {"photo": (io.BytesIO(raw if raw is not None else photo()), "photo.png"),
                "consent": consent}
        data.update(fields)
        response = self.client.post("/api/gallery/identify", data=data, content_type="multipart/form-data")
        # EnvironBuilder may spool its synthetic HTTP body, outside the server's
        # photo parser. Close that test-only input as a real WSGI server would.
        response.request.environ["wsgi.input"].close()
        return response

    def test_success_sends_clean_image_and_requires_source_confirmation(self):
        response = self.upload(photo("JPEG", metadata=True), museum="MoMA", lang="zh")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["ok"])
        self.assertTrue(data["needs_confirmation"])
        self.assertEqual(data["candidates"][0]["confidence"], "high")
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        self.post.assert_called_once()
        call = self.post.call_args
        self.assertEqual(call.args[0], "https://api.anthropic.com/v1/messages")
        self.assertEqual(call.kwargs["timeout"], (5, 45))
        body = call.kwargs["json"]
        self.assertEqual(body["model"], G.DEFAULT_MODEL)
        self.assertEqual(body["output_config"]["format"]["type"], "json_schema")
        content = body["messages"][0]["content"]
        image_data = base64.b64decode(content[0]["source"]["data"])
        self.assertNotIn(b"Private", image_data)
        self.assertIn('"lang": "zh"', content[1]["text"])
        self.assertEqual(os.listdir(self.folder.name), ["gallery_identify_usage.sqlite3"])
        with sqlite3.connect(os.path.join(self.folder.name, "gallery_identify_usage.sqlite3")) as db:
            dump = "\n".join(db.iterdump())
        self.assertNotIn("Starry", dump)
        self.assertNotIn("127.0.0.1", dump)
        self.assertNotIn("MoMA", dump)

    def test_consent_is_required_even_if_api_key_exists(self):
        for consent in ("", "true", "yes", "anthropic-photo-search-v0"):
            with self.subTest(consent=consent):
                response = self.upload(consent=consent)
                self.assertEqual(response.status_code, 400)
                self.assertEqual(response.get_json()["reason"], "consent_required")
        self.post.assert_not_called()

    def test_upload_uses_memory_streams_even_for_large_photo(self):
        # Random pixels make this valid PNG larger than Werkzeug's spool threshold.
        raw = io.BytesIO()
        Image.frombytes("RGB", (700, 700), os.urandom(700 * 700 * 3)).save(raw, "PNG")
        with patch("werkzeug.formparser.default_stream_factory", side_effect=AssertionError("disk spooling")):
            response = self.upload(raw.getvalue())
        self.assertEqual(response.status_code, 200)

    def test_bad_images_do_not_call_provider_or_charge_monthly_budget(self):
        for raw in (b"\xff\xd8\xff\xe0fake", photo()[:100], b"not an image"):
            response = self.upload(raw)
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.get_json()["reason"], "bad_image")
        self.post.assert_not_called()
        with sqlite3.connect(os.path.join(self.folder.name, "gallery_identify_usage.sqlite3")) as db:
            self.assertEqual(db.execute("SELECT count(*) FROM monthly").fetchone()[0], 0)

    def test_oversized_fake_bytes_rejected_before_provider(self):
        response = self.upload(b"\xff\xd8\xff" + b"0" * G.MAX_IMAGE_BYTES)
        self.assertEqual(response.status_code, 413)
        self.assertEqual(response.get_json()["reason"], "bad_image")
        self.post.assert_not_called()

    def test_duplicate_files_and_remote_url_are_rejected(self):
        data = MultiDict([("consent", G.CONSENT_VERSION),
                          ("photo", (io.BytesIO(photo()), "one.png")),
                          ("photo", (io.BytesIO(photo()), "two.png"))])
        response = self.client.post("/api/gallery/identify", data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400)
        response = self.client.post("/api/gallery/identify", json={"url": "http://127.0.0.1/private"})
        self.assertEqual(response.status_code, 400)
        self.post.assert_not_called()

    def test_missing_engine_is_different_from_a_failed_match(self):
        with patch.dict(os.environ, {"ANTHROPIC_API_KEY": ""}):
            response = self.upload()
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.get_json()["reason"], "no_engine")
        self.post.assert_not_called()

    def test_busy_decoder_does_not_start_a_provider_call(self):
        with patch.object(G, "_DECODE_SLOTS") as slots:
            slots.acquire.return_value = False
            response = self.upload()
            slots.release.assert_not_called()
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.get_json()["reason"], "busy")
        self.post.assert_not_called()

    def test_no_match_can_return_real_label_text_without_claiming_success(self):
        self.post.return_value = provider_response([], label="Gift of Example Collection")
        response = self.upload()
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.get_json()["ok"])
        self.assertEqual(response.get_json()["reason"], "no_match")
        self.assertEqual(response.get_json()["label_text"], "Gift of Example Collection")

    def test_timeouts_and_provider_failures_never_return_fake_candidates(self):
        for error, reason, status in ((G.requests.Timeout(), "provider_timeout", 504),
                                      (G.requests.HTTPError("private-account-detail"), "provider_unavailable", 503)):
            self.post.side_effect = error
            response = self.upload()
            self.assertEqual(response.status_code, status)
            self.assertEqual(response.get_json()["reason"], reason)
            self.assertEqual(response.get_json()["candidates"], [])
            self.assertNotIn("private-account-detail", response.get_data(as_text=True))

    def test_invalid_or_truncated_provider_output_is_not_a_match(self):
        cases = [provider_response(stop="max_tokens"), provider_response()]
        cases[1].json.return_value["content"][0]["text"] = "{broken"
        for provider in cases:
            self.post.return_value = provider
            response = self.upload()
            self.assertEqual(response.status_code, 502)
            self.assertEqual(response.get_json()["reason"], "invalid_response")

    def test_refusal_is_no_match_and_never_fake_ocr(self):
        self.post.return_value = provider_response(stop="refusal")
        response = self.upload()
        self.assertEqual(response.get_json()["reason"], "no_match")
        self.assertEqual(response.get_json()["label_text"], "")

    def test_per_ip_limit_persists_across_app_clients_and_rejects_spoofing(self):
        with patch.dict(os.environ, {"GALLERY_IDENTIFY_HOURLY_LIMIT": "1"}):
            self.assertEqual(self.upload().status_code, 200)
            response = self.app.test_client().post("/api/gallery/identify", data={
                "photo": (io.BytesIO(photo()), "photo.png"), "consent": G.CONSENT_VERSION,
            }, headers={"X-Forwarded-For": "203.0.113.1"}, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.get_json()["reason"], "rate_limited")
        self.assertEqual(self.post.call_count, 1)

    def test_global_monthly_cap_cannot_be_raced_across_threads(self):
        def reserve():
            with self.app.app_context():
                return G._reserve("generation")
        with patch.dict(os.environ, {"GALLERY_IDENTIFY_MONTHLY_CAP": "2"}):
            with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
                allowed = list(executor.map(lambda _: reserve(), range(10)))
            response = self.upload()
        self.assertEqual(sum(allowed), 2)
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.get_json()["reason"], "monthly_limit")
        self.post.assert_not_called()

    def test_configured_model_is_used(self):
        with patch.dict(os.environ, {"GALLERY_VISION_MODEL": "approved-configured-model"}):
            self.assertEqual(self.upload().status_code, 200)
        self.assertEqual(self.post.call_args.kwargs["json"]["model"], "approved-configured-model")


if __name__ == "__main__":
    unittest.main()
