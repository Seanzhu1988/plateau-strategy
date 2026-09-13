"""Visitor originals are private. Synthetic files, isolated storage, no network.

The former publication/attachment tests are superseded by the unconditional
privacy policy. Real decoding/metadata/consent tests remain in
test_gallery_identify.py and test_gallery_photo_input.cjs.
"""
import hashlib
import io
import json
import os
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

from flask import Flask
from itsdangerous import URLSafeTimedSerializer

import gallery_archive as A
import gallery_photos as G


PHOTO_ID = "p_" + "d" * 32
PHOTO_URL = "/api/gallery/photos/" + PHOTO_ID
LICENSED_IMAGE = "https://museum.example/collection/licensed.jpg"
FACTS = {"title": "Privacy fixture vessel", "museum": "Fixture Museum",
         "provider": "fixture", "source_object_id": "42", "item_number": "TEST-42",
         "source_url": "https://museum.example/objects/42",
         "image": LICENSED_IMAGE, "images": [LICENSED_IMAGE]}
STORY = "This is an isolated written story fixture, not a public museum story."


def seed_legacy_photo(directory, artifact_id):
    """Only synthetic historical state, never a real visitor photograph."""
    directory = Path(directory)
    folder = directory / "gallery_photos"
    folder.mkdir(exist_ok=True)
    pixels = b"synthetic-private-photo-fixture-not-real-image"
    photo = folder / (PHOTO_ID + ".jpg")
    photo.write_bytes(pixels)
    with sqlite3.connect(str(directory / "gallery_photos.sqlite3")) as db:
        db.execute("CREATE TABLE IF NOT EXISTS photos (id TEXT PRIMARY KEY, artifact_id TEXT,"
                   "sha256 TEXT,size INTEGER,created REAL,consent_version TEXT,source_kind TEXT)")
        db.execute("INSERT INTO photos VALUES(?,?,?,?,?,?,?)",
                   (PHOTO_ID, artifact_id, hashlib.sha256(pixels).hexdigest(), len(pixels),
                    1000, G.CONSENT_VERSION, "visitor_photo"))
    return photo


class VisitorPhotoPrivacyTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="gallery-private-test-")
        self.addCleanup(self.directory.cleanup)
        env = patch.dict(os.environ, {"DATA_DIR": self.directory.name})
        env.start()
        self.addCleanup(env.stop)
        sources = patch.object(A, "sync_sources")
        sources.start()
        self.addCleanup(sources.stop)
        self.app = Flask(__name__, static_folder=None)
        self.app.config.update(TESTING=True, DATA_DIR=self.directory.name)
        self.app.secret_key = "isolated-privacy-test-secret"
        self.app.register_blueprint(G.gallery_photos_bp)
        self.client = self.app.test_client()
        self.artifact = A.remember(FACTS)["artifact_id"]
        self.photo = seed_legacy_photo(self.directory.name, self.artifact)

    def snapshot(self):
        return {str(p.relative_to(self.directory.name)): p.read_bytes()
                for p in Path(self.directory.name).rglob("*") if p.is_file()}

    def test_old_public_get_head_conditional_and_range_never_serve_original(self):
        before = self.snapshot()
        for method in ("GET", "HEAD"):
            for headers in ({}, {"If-None-Match": "*"}, {"Range": "bytes=0-9"},
                            {"If-Modified-Since": "Wed, 31 Dec 2099 23:59:59 GMT"}):
                with self.subTest(method=method, headers=headers):
                    response = self.client.open(PHOTO_URL, method=method, headers=headers)
                    self.assertEqual(response.status_code, 404)
                    self.assertIn("no-store", response.headers["Cache-Control"])
                    self.assertIn("max-age=0", response.headers["Cache-Control"])
                    self.assertNotEqual(response.mimetype, "image/jpeg")
                    self.assertNotIn(b"synthetic-private-photo", response.data)
                    self.assertNotIn("ETag", response.headers)
        self.assertEqual(before, self.snapshot())

    def test_known_unknown_and_missing_storage_are_indistinguishable(self):
        known = self.client.get(PHOTO_URL)
        for url in ("/api/gallery/photos/p_" + "0" * 32,
                    "/api/gallery/photos/not-an-id", "/api/gallery/photos/gallery_photos.sqlite3"):
            other = self.client.get(url)
            self.assertEqual(other.status_code, known.status_code)
            self.assertEqual(other.json, known.json)
        with patch.dict(os.environ, {"DATA_DIR": "/a/nonexistent/private/directory"}):
            self.assertEqual(self.client.get(PHOTO_URL).json, known.json)

    def test_all_new_publication_is_denied_even_true_consent_and_valid_legacy_token(self):
        before = self.snapshot()
        token = URLSafeTimedSerializer(self.app.secret_key, salt=G.TOKEN_SALT).dumps(
            {"artifact_id": self.artifact})
        for consent in (True, "true", "yes", G.CONSENT_VERSION, ""):
            for artifact in (self.artifact, "a_" + "0" * 24, "malformed"):
                with self.subTest(consent=consent, artifact=artifact):
                    response = self.client.post("/api/gallery/artifacts/" + artifact + "/photo",
                        data={"photo": (io.BytesIO(b"synthetic-unparsed-upload"), "private.jpg"),
                              "publication_consent": consent, "attachment_token": token})
                    self.assertEqual(response.status_code, 403)
                    self.assertEqual(response.json["reason"], "photo_publication_disabled")
                    self.assertIn("no-store", response.headers["Cache-Control"])
                    response.request.environ["wsgi.input"].close()
        self.assertEqual(before, self.snapshot())

    def test_json_and_malformed_multipart_do_not_reenable_publication(self):
        before = self.snapshot()
        url = "/api/gallery/artifacts/" + self.artifact + "/photo"
        for kwargs in ({"json": {"publication_consent": True, "photo_url": PHOTO_URL}},
                       {"data": b"not-multipart", "content_type": "multipart/form-data"}):
            response = self.client.post(url, **kwargs)
            self.assertEqual(response.status_code, 403)
        self.assertEqual(before, self.snapshot())

    def test_public_listing_never_reads_or_exposes_legacy_rows(self):
        with patch("sqlite3.connect", side_effect=AssertionError("No public photo DB read")):
            self.assertEqual(G.list_photos(self.artifact), [])
            self.assertEqual(G.list_photos(None), [])
            self.assertEqual(self.client.get(PHOTO_URL).status_code, 404)

    def test_legacy_serialization_strips_originals_but_keeps_story_discovery_and_catalogue(self):
        legacy = dict(FACTS, image=PHOTO_URL,
                      images=[PHOTO_URL, LICENSED_IMAGE, "https://example.test" + PHOTO_URL],
                      community_photos=[{"url": PHOTO_URL, "kind": "visitor_photo"}],
                      photo_url="https://example.test" + PHOTO_URL,
                      visitor_photos=[{"url": PHOTO_URL}], attachment_token="retired-token")
        with A.database() as db:
            db.execute("UPDATE artifacts SET facts=? WHERE id=?", (json.dumps(legacy), self.artifact))
        lease = A.reserve(self.artifact, "en", 10)
        self.assertTrue(A.finish(self.artifact, "en", lease["token"], STORY, model="fixture"))
        before = self.photo.read_bytes()
        samples = [A.get_artifact(self.artifact), A.confirm(self.artifact),
                   A.search_known("Privacy fixture")[0],
                   A.archive("Privacy fixture")["items"][0],
                   A.enrich([{"artifact_id": self.artifact}])["results"][0]]
        for result in samples:
            self.assertEqual(result["artifact_id"], self.artifact)
            self.assertTrue(result["written"])
            self.assertEqual(result["community_photos"], [])
            self.assertEqual(result["images"], [LICENSED_IMAGE])
            encoded = json.dumps(result)
            self.assertNotIn(PHOTO_ID, encoded)
            self.assertNotIn("retired-token", encoded)
        self.assertEqual(A.get_story(self.artifact)["text"], STORY)
        with A.database() as db:
            persisted = json.loads(db.execute("SELECT facts FROM artifacts WHERE id=?",
                                             (self.artifact,)).fetchone()[0])
        self.assertEqual(persisted, legacy, "Public reads must not erase private legacy records")
        self.assertEqual(self.photo.read_bytes(), before)
        self.assertEqual(A.archive("Privacy fixture")["total"], 1)

    def test_signed_candidate_cleaning_blocks_url_aliases_without_losing_licensed_images(self):
        for url in (PHOTO_URL, "https://example.test" + PHOTO_URL,
                    "/gallery_photos/" + PHOTO_ID + ".jpg",
                    "https://example.test/%61pi%2fgallery%2fphotos/" + PHOTO_ID,
                    "https://example.test/%2561pi%252fgallery%252fphotos/" + PHOTO_ID,
                    "https://example.test/api/gallery//photos/" + PHOTO_ID,
                    "https://example.test/api/gallery/unused/../photos/" + PHOTO_ID,
                    "https://example.test/api/gallery/photos/" + PHOTO_ID + "?download=1"):
            result = A.clean_facts(dict(FACTS, image=url, images=[url, LICENSED_IMAGE]))
            self.assertEqual(result["image"], LICENSED_IMAGE)
            self.assertEqual(result["images"], [LICENSED_IMAGE])
        for kind in ("visitor_photo", "visitor photograph", "visitor-photo"):
            result = A.clean_facts(dict(FACTS, source_kind=kind))
            self.assertEqual(result["image"], "")
            self.assertEqual(result["images"], [])
        self.assertEqual(A.clean_facts(FACTS)["image"], LICENSED_IMAGE)

    def test_chinese_confirmation_and_unidentified_research_still_work(self):
        confirmed = A.confirm(self.artifact, "zh")
        self.assertEqual(confirmed["writing_status"], "pending")
        self.assertEqual(confirmed["community_photos"], [])
        result = A.save_research("Unidentified fixture", lang="zh",
                                visual_description="A small carved stone vessel.")
        self.assertTrue(result["saved"])
        self.assertEqual(self.photo.read_bytes(), b"synthetic-private-photo-fixture-not-real-image")

    def test_legacy_nested_attachments_and_nullable_images_cannot_escape_filter(self):
        facts = dict(FACTS, images=None, photos=[
            {"kind": "visitor_photo", "url": "https://cdn.example/private.jpg"},
            {"kind": "museum_image", "url": LICENSED_IMAGE}],
            old_media={"unknown_alias": PHOTO_URL})
        result = A.public_facts(facts)
        self.assertEqual(result["images"], [])
        self.assertEqual(result["photos"], [{"kind": "museum_image", "url": LICENSED_IMAGE}])
        self.assertEqual(result["old_media"], {"unknown_alias": ""})
        self.assertNotIn("private.jpg", json.dumps(result))
        self.assertNotIn(PHOTO_ID, json.dumps(result))


if __name__ == "__main__":
    unittest.main()
