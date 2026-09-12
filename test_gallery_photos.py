"""Visitor-photo publication tests. Isolated state, real decoding, no network."""

import concurrent.futures
import io
import os
from pathlib import Path
import sqlite3
import tempfile
import time
import unittest
from unittest.mock import patch

from flask import Flask
from itsdangerous import URLSafeTimedSerializer
from PIL import Image, PngImagePlugin
from werkzeug.datastructures import MultiDict

import gallery_archive as A
import gallery_photos as G


def photograph(kind="PNG", color=(24, 70, 120), private=False):
    image = Image.new("RGB", (96, 64), color)
    output = io.BytesIO()
    options = {}
    if kind == "PNG" and private:
        metadata = PngImagePlugin.PngInfo()
        metadata.add_text("Location", "Private Street and Visitor")
        options["pnginfo"] = metadata
    if kind == "JPEG" and private:
        exif = Image.Exif()
        exif[315] = "Private Visitor"
        exif[274] = 6
        options["exif"] = exif
    image.save(output, kind, **options)
    return output.getvalue()


class VisitorPhotoTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="gallery-photos-test-")
        self.env = patch.dict(os.environ, {
            "DATA_DIR": self.directory.name, "GALLERY_PHOTO_HOURLY_LIMIT": "100",
            "GALLERY_PHOTO_MAX_PER_ARTIFACT": "3", "GALLERY_PHOTO_STORAGE_BYTES": str(128 * 1024 * 1024),
            "GALLERY_IDENTIFY_TRUST_PROXY": "0", "RENDER": "false",
        })
        self.env.start()
        self.sources = patch.object(A, "sync_sources")
        self.sources.start()
        self.app = Flask(__name__)
        self.app.secret_key = "isolated-photo-test-secret"
        self.app.register_blueprint(G.gallery_photos_bp)
        self.client = self.app.test_client()
        self.artifact = A.remember({"title": "Example artifact", "museum": "Example Museum",
                                  "item_number": "photo-test-1", "image": "https://example.org/official.jpg",
                                  "copyright": True})["artifact_id"]
        self.raw = photograph(private=True)

    def tearDown(self):
        self.sources.stop()
        self.env.stop()
        self.directory.cleanup()

    def token(self, artifact=None):
        return URLSafeTimedSerializer(self.app.secret_key, salt=G.TOKEN_SALT).dumps(
            {"artifact_id": artifact or self.artifact})

    def post(self, raw=None, artifact=None, fields=None, filename="Private Phone Photograph.png"):
        data = {"publication_consent": G.CONSENT_VERSION,
                "attachment_token": self.token(artifact),
                "photo": (io.BytesIO(self.raw if raw is None else raw), filename)}
        data.update(fields or {})
        return self.client.post("/api/gallery/artifacts/%s/photo" % (artifact or self.artifact), data=data)

    def photos(self):
        folder = Path(self.directory.name) / "gallery_photos"
        return list(folder.iterdir()) if folder.exists() else []

    def test_clean_picture_is_published_and_never_overwrites_official_source(self):
        result = self.post()
        self.assertEqual(result.status_code, 200, result.json)
        photo = result.json["photo"]
        self.assertEqual(photo["kind"], "visitor_photo")
        self.assertFalse(result.json["duplicate"])
        self.assertEqual(result.json["photos"], [photo])
        self.assertEqual(A.get_artifact(self.artifact)["image"], "https://example.org/official.jpg")
        served = self.client.get(photo["url"])
        self.assertEqual(served.status_code, 200)
        self.assertEqual(served.mimetype, "image/jpeg")
        self.assertEqual(served.headers["X-Content-Type-Options"], "nosniff")
        self.assertNotIn(b"Private", served.data)
        with Image.open(io.BytesIO(served.data)) as image:
            self.assertEqual(image.format, "JPEG")
            self.assertFalse(image.getexif())
            self.assertNotIn("Location", image.info)
        served.close()
        with sqlite3.connect(G._path()) as db:
            dump = "\n".join(db.iterdump())
        self.assertNotIn("Private Phone", dump)
        self.assertNotIn("127.0.0.1", dump)

    def test_publication_requires_separate_rights_permission(self):
        for consent in ("", "anthropic-photo-search-v1", "yes", "gallery-photo-publication-v0"):
            result = self.post(fields={"publication_consent": consent})
            self.assertEqual(result.status_code, 400)
            self.assertEqual(result.json["reason"], "consent_required")
        self.assertEqual(self.photos(), [])
        self.assertIn("pictured artwork", G.CONSENT_STATEMENT)

    def test_exact_confirmation_token_is_required(self):
        for token in ("", "pretend", self.token("a_" + "0" * 24)):
            result = self.post(fields={"attachment_token": token})
            self.assertEqual(result.status_code, 403)
            self.assertEqual(result.json["reason"], "confirmation_required")
        self.assertEqual(self.photos(), [])

    def test_expired_token_needs_confirmation_again(self):
        with patch("itsdangerous.timed.TimestampSigner.get_timestamp", return_value=int(time.time()) - 1000):
            token = self.token()
        response = self.post(fields={"attachment_token": token})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.photos(), [])

    def test_nonexistent_or_malformed_artifact_cannot_receive_a_photo(self):
        self.assertEqual(self.post(artifact="a_" + "f" * 24).status_code, 404)
        self.assertEqual(self.post(artifact="not-an-artifact").status_code, 404)
        self.assertEqual(self.client.post("/api/gallery/artifacts/../photo").status_code, 404)
        self.assertEqual(self.photos(), [])

    def test_repeat_confirmation_and_upload_is_idempotent(self):
        first = self.post().json
        repeat = self.post(raw=photograph(private=False)).json
        self.assertEqual(first["photo"], repeat["photo"])
        self.assertTrue(repeat["duplicate"])
        self.assertEqual(len(self.photos()), 1)

    def test_jpeg_and_webp_are_clean_decoded_jpegs(self):
        for kind in ("JPEG", "WEBP"):
            response = self.post(raw=photograph(kind, private=True))
            self.assertEqual(response.status_code, 200, response.json)
            served = self.client.get(response.json["photo"]["url"])
            self.assertNotIn(b"Private", served.data)
            with Image.open(io.BytesIO(served.data)) as image:
                self.assertFalse(image.getexif())
                self.assertEqual(image.format, "JPEG")
            served.close()

    def test_filename_is_never_used_as_a_path(self):
        response = self.post(filename="../../Private.png")
        self.assertEqual(response.status_code, 200)
        self.assertRegex(self.photos()[0].name, r"^p_[0-9a-f]{32}\.jpg$")
        self.assertFalse((Path(self.directory.name) / "Private.png").exists())

    def test_raw_multipart_stream_stays_in_memory(self):
        original = G.parse_form_data
        def parse(*args, **kwargs):
            self.assertIsInstance(kwargs["stream_factory"](), io.BytesIO)
            self.assertEqual(kwargs["max_content_length"], G.MAX_REQUEST_BYTES)
            return original(*args, **kwargs)
        with patch.object(G, "parse_form_data", side_effect=parse):
            self.assertEqual(self.post().status_code, 200)

    def test_duplicate_uploads_fields_and_url_inputs_are_rejected(self):
        cases = [
            MultiDict([("publication_consent", G.CONSENT_VERSION), ("attachment_token", self.token()),
                       ("photo", (io.BytesIO(self.raw), "one.png")), ("photo", (io.BytesIO(self.raw), "two.png"))]),
            MultiDict([("publication_consent", G.CONSENT_VERSION), ("publication_consent", G.CONSENT_VERSION),
                       ("attachment_token", self.token()), ("photo", (io.BytesIO(self.raw), "one.png"))]),
            {"publication_consent": G.CONSENT_VERSION, "attachment_token": self.token(),
             "photo_url": "https://example.org/private-photo.jpg"},
        ]
        for data in cases:
            response = self.client.post("/api/gallery/artifacts/%s/photo" % self.artifact, data=data)
            self.assertEqual(response.status_code, 400)
        self.assertEqual(self.photos(), [])

    def test_bad_and_oversized_images_are_not_retained(self):
        for raw in (b"", b"<svg onload='alert(1)'></svg>", b"\xff\xd8\xffnot-a-photo"):
            response = self.post(raw=raw)
            self.assertEqual(response.status_code, 400)
        oversized = self.post(raw=b"x" * (G.MAX_IMAGE_BYTES + 1))
        self.assertEqual(oversized.status_code, 413)
        self.assertEqual(self.photos(), [])

    def test_per_artifact_cap_does_not_break_duplicate_retry(self):
        first = self.post().json["photo"]
        for color in ((70, 20, 30), (50, 160, 20)):
            self.assertEqual(self.post(raw=photograph(color=color)).status_code, 200)
        response = self.post(raw=photograph(color=(0, 0, 255)))
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json["reason"], "artifact_limit")
        self.assertEqual(self.post().json["photo"], first)
        self.assertEqual(len(self.photos()), 3)

    def test_global_storage_cap_includes_unregistered_clean_files(self):
        folder = Path(self.directory.name) / "gallery_photos"
        folder.mkdir()
        with open(folder / ("p_" + "d" * 32 + ".jpg"), "wb") as output:
            output.write(b"pre-existing-clean-file")
        prepared = G.prepare_image(self.raw)
        with patch.dict(os.environ, {"GALLERY_PHOTO_STORAGE_BYTES": str(len(prepared))}):
            response = self.post()
        self.assertEqual(response.status_code, 507)
        self.assertEqual(response.json["reason"], "storage_limit")
        self.assertEqual(len(self.photos()), 1)
        self.assertEqual(G.list_photos(self.artifact), [])

    def test_only_database_registered_images_can_be_served(self):
        folder = Path(self.directory.name) / "gallery_photos"
        folder.mkdir()
        unknown = "p_" + "a" * 32
        with open(folder / (unknown + ".jpg"), "wb") as output:
            output.write(G.prepare_image(self.raw))
        self.assertEqual(self.client.get("/api/gallery/photos/" + unknown).status_code, 404)
        for value in ("gallery_photos.sqlite3", "..%2Fgallery_photos.sqlite3", "p_" + "z" * 32):
            self.assertEqual(self.client.get("/api/gallery/photos/" + value).status_code, 404)

    def test_registered_path_cannot_serve_a_symlink(self):
        photo = self.post().json["photo"]
        target = self.photos()[0]
        original = target.read_bytes()
        replacement = Path(self.directory.name) / "unrelated.jpg"
        with open(replacement, "wb") as output:
            output.write(original)
        target.unlink()
        target.symlink_to(replacement)
        self.assertEqual(self.client.get(photo["url"]).status_code, 404)

    def test_clean_pixel_file_write_failure_does_not_leave_a_public_record(self):
        real_write = G._write_clean
        def fail_after_write(path, data):
            real_write(path, data)
            raise OSError("simulated disk fault")
        with patch.object(G, "_write_clean", side_effect=fail_after_write):
            response = self.post()
        self.assertEqual(response.status_code, 503)
        self.assertEqual(self.photos(), [])
        self.assertEqual(G.list_photos(self.artifact), [])

    def test_failed_database_registration_removes_its_file(self):
        db = G._connection()
        class BrokenRegistration:
            def execute(self, sql, args=()):
                if sql.startswith("INSERT INTO photos"):
                    raise sqlite3.OperationalError("simulated registration failure")
                return db.execute(sql, args)
            def commit(self):
                return db.commit()
            def rollback(self):
                return db.rollback()
            def close(self):
                return db.close()
        with patch.object(G, "_connection", return_value=BrokenRegistration()):
            with self.assertRaises(sqlite3.OperationalError):
                G._store(self.artifact, G.prepare_image(self.raw))
        self.assertEqual(self.photos(), [])
        self.assertEqual(G.list_photos(self.artifact), [])

    def test_successful_commit_followed_by_exception_preserves_registered_photo(self):
        db = G._connection()
        class UncertainCommit:
            def execute(self, sql, args=()):
                return db.execute(sql, args)
            def commit(self):
                db.commit()
                raise sqlite3.OperationalError("commit succeeded but acknowledgement failed")
            def rollback(self):
                return db.rollback()
            def close(self):
                return db.close()
        with patch.object(G, "_connection", return_value=UncertainCommit()):
            with self.assertRaises(sqlite3.OperationalError):
                G._store(self.artifact, G.prepare_image(self.raw))
        photos = G.list_photos(self.artifact)
        self.assertEqual(len(photos), 1)
        self.assertEqual(len(self.photos()), 1)
        served = self.client.get(photos[0]["url"])
        self.assertEqual(served.status_code, 200)
        self.assertEqual(served.data, G.prepare_image(self.raw))
        served.close()
        retry = self.post()
        self.assertEqual(retry.status_code, 200)
        self.assertTrue(retry.json["duplicate"])
        self.assertEqual(retry.json["photo"], photos[0])

    def test_uncertain_uncommitted_file_remains_private_and_budgeted(self):
        db = G._connection()
        class FailedCommit:
            def execute(self, sql, args=()):
                return db.execute(sql, args)
            def commit(self):
                raise sqlite3.OperationalError("commit outcome unavailable")
            def rollback(self):
                return db.rollback()
            def close(self):
                return db.close()
        with patch.object(G, "_connection", return_value=FailedCommit()):
            with self.assertRaises(sqlite3.OperationalError):
                G._store(self.artifact, G.prepare_image(self.raw))
        self.assertEqual(G.list_photos(self.artifact), [])
        self.assertEqual(len(self.photos()), 1)
        photo_id = self.photos()[0].stem
        self.assertEqual(self.client.get("/api/gallery/photos/" + photo_id).status_code, 404)
        with patch.dict(os.environ, {"GALLERY_PHOTO_STORAGE_BYTES": str(self.photos()[0].stat().st_size)}):
            response = self.post()
        self.assertEqual(response.status_code, 507)
        self.assertEqual(response.json["reason"], "storage_limit")

    def test_exclusive_filename_collision_does_not_overwrite_or_remove_an_image(self):
        photo = self.post().json["photo"]
        target = self.photos()[0]
        original = target.read_bytes()
        with patch.object(G.secrets, "token_hex", return_value=photo["photo_id"][2:]):
            response = self.post(raw=photograph(color=(255, 0, 255)))
        self.assertEqual(response.status_code, 503)
        self.assertEqual(target.read_bytes(), original)

    def test_rate_limit_persists_and_forwarded_headers_cannot_bypass_it(self):
        with patch.dict(os.environ, {"GALLERY_PHOTO_HOURLY_LIMIT": "1"}):
            self.assertEqual(self.post().status_code, 200)
            response = self.app.test_client().post("/api/gallery/artifacts/%s/photo" % self.artifact,
                headers={"X-Forwarded-For": "1.2.3.4"})
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.json["reason"], "rate_limited")

    def test_reading_artifact_without_photos_creates_no_photo_storage(self):
        self.assertEqual(G.list_photos(self.artifact), [])
        self.assertFalse(Path(G._path()).exists())

    def test_cross_worker_deduplication_publishes_exactly_once(self):
        prepared = G.prepare_image(self.raw)
        def upload(_):
            return G._store(self.artifact, prepared)
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            result = list(pool.map(upload, range(6)))
        self.assertEqual(len({row[0]["photo_id"] for row in result}), 1)
        self.assertEqual(sum(not row[1] for row in result), 1)
        self.assertEqual(len(self.photos()), 1)

    def test_cross_worker_cap_cannot_be_raced(self):
        prepared = [G.prepare_image(photograph(color=(i * 20, 50, 30))) for i in range(6)]
        def upload(data):
            try:
                return G._store(self.artifact, data)[0]
            except G.UploadError as exc:
                return exc.reason
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            result = list(pool.map(upload, prepared))
        self.assertEqual(sum(isinstance(row, dict) for row in result), 3)
        self.assertEqual(result.count("artifact_limit"), 3)
        self.assertEqual(len(self.photos()), 3)


if __name__ == "__main__":
    unittest.main()
