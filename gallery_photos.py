"""Publish a visitor's clean photograph only after an exact gallery confirmation.

Identification and publication are separate permissions. The browser retains
the original file until the visitor confirms a catalogue object; only this
endpoint may retain its re-encoded, metadata-free pixels. Source catalogue
images remain untouched. No original filename, raw photo, address or IP is
stored with an attachment.
"""

import hashlib
import hmac
import io
import os
from pathlib import Path
import re
import secrets
import sqlite3
import stat
import time

from flask import Blueprint, current_app, has_app_context, jsonify, request, send_file
from itsdangerous import BadSignature, URLSafeTimedSerializer
from werkzeug.exceptions import BadRequest, RequestEntityTooLarge
from werkzeug.formparser import parse_form_data

from gallery_identify import (MAX_IMAGE_BYTES, MAX_REQUEST_BYTES, _DECODE_SLOTS,
                              _client_ip, _setting, prepare_image)


gallery_photos_bp = Blueprint("gallery_photos", __name__)
CONSENT_VERSION = "gallery-photo-publication-v1"
CONSENT_STATEMENT = (
    "After I confirm the matching artifact, publish my photograph with its gallery "
    "record. I have permission to publish both this photograph and the pictured "
    "artwork. It contains no people or private information."
)
TOKEN_SALT = "gallery-photo-attachment-v1"
TOKEN_MAX_AGE = 900
_ARTIFACT_ID = re.compile(r"a_[0-9a-f]{24}\Z")
_PHOTO_ID = re.compile(r"p_[0-9a-f]{32}\Z")


def _data_dir():
    configured = current_app.config.get("DATA_DIR") if has_app_context() else None
    return configured or os.environ.get("DATA_DIR", "").strip() or os.path.dirname(__file__)


def _path():
    return os.path.join(_data_dir(), "gallery_photos.sqlite3")


def _connection(create=True):
    path = _path()
    if not create:
        if not os.path.isfile(path):
            return None
        db = sqlite3.connect(Path(path).resolve().as_uri() + "?mode=ro", uri=True, timeout=5)
    else:
        os.makedirs(_data_dir(), exist_ok=True)
        db = sqlite3.connect(path, timeout=5)
    db.row_factory = sqlite3.Row
    if create:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS photos (
                id TEXT PRIMARY KEY, artifact_id TEXT NOT NULL,
                sha256 TEXT NOT NULL, size INTEGER NOT NULL CHECK(size > 0),
                created REAL NOT NULL, consent_version TEXT NOT NULL,
                source_kind TEXT NOT NULL CHECK(source_kind = 'visitor_photo'),
                UNIQUE(artifact_id, sha256));
            CREATE INDEX IF NOT EXISTS photos_artifact ON photos(artifact_id, created);
            CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS attempts (
                client_hash TEXT NOT NULL, hour INTEGER NOT NULL, hits INTEGER NOT NULL,
                PRIMARY KEY(client_hash, hour));
        """)
        db.commit()
    return db


def _public(row):
    return {"photo_id": row["id"], "url": "/api/gallery/photos/" + row["id"],
            "kind": "visitor_photo", "label": "Visitor photograph",
            "published_at": row["created"], "consent_version": row["consent_version"],
            "publication_basis": "Visitor permission for the photograph and pictured artwork"}


def list_photos(artifact_id):
    """Separate visitor photos, never replacements for a catalogue image.

    A catalogue read does not create a photo database. Storage failures are not
    hidden: callers can decide how to report an unavailable attachment service.
    """
    if not _ARTIFACT_ID.fullmatch(str(artifact_id or "")):
        return []
    db = _connection(create=False)
    if db is None:
        return []
    try:
        return [_public(row) for row in db.execute(
            "SELECT * FROM photos WHERE artifact_id=? ORDER BY created,id", (artifact_id,))]
    finally:
        db.close()


def _attempt_allowed():
    db = _connection()
    try:
        db.execute("BEGIN IMMEDIATE")
        hour = int(time.time() // 3600)
        db.execute("INSERT OR IGNORE INTO settings VALUES('salt',?)", (secrets.token_hex(32),))
        salt = db.execute("SELECT value FROM settings WHERE key='salt'").fetchone()[0]
        digest = hmac.new(salt.encode(), (str(hour) + ":" + _client_ip()).encode(),
                          hashlib.sha256).hexdigest()
        row = db.execute("SELECT hits FROM attempts WHERE client_hash=? AND hour=?", (digest, hour)).fetchone()
        allowed = (row[0] if row else 0) < _setting("GALLERY_PHOTO_HOURLY_LIMIT", 12, 1000)
        if allowed:
            db.execute("INSERT INTO attempts VALUES(?,?,1) ON CONFLICT(client_hash,hour) "
                       "DO UPDATE SET hits=hits+1", (digest, hour))
        db.execute("DELETE FROM attempts WHERE hour < ?", (hour - 24,))
        db.commit()
        return allowed
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def _response(reason, message, status):
    response = jsonify(ok=False, reason=reason, message=message)
    response.status_code = status
    response.headers["Cache-Control"] = "no-store"
    if reason == "rate_limited":
        response.headers["Retry-After"] = "3600"
    return response


class UploadError(Exception):
    def __init__(self, reason, message, status=400):
        self.reason, self.message, self.status = reason, message, status


def _read_upload(artifact_id):
    if request.mimetype != "multipart/form-data":
        raise UploadError("bad_image", "Choose one photograph to attach.")
    # Default multipart parsing may spool a raw phone photo onto disk. These
    # bounded streams remain in memory until consent and confirmation pass.
    _, fields, files = parse_form_data(
        request.environ, stream_factory=lambda **kwargs: io.BytesIO(),
        max_form_memory_size=128 * 1024, max_content_length=MAX_REQUEST_BYTES,
        max_form_parts=5, silent=False)
    uploads = list(files.items(multi=True))
    try:
        if fields.getlist("publication_consent") != [CONSENT_VERSION]:
            raise UploadError("consent_required", "Please give permission to publish both your photograph "
                              "and the pictured artwork before attaching it.")
        tokens = fields.getlist("attachment_token")
        if len(tokens) != 1 or len(tokens[0]) > 2000 or not current_app.secret_key:
            raise UploadError("confirmation_required", "Confirm the matching gallery object before attaching the photograph.", 403)
        try:
            payload = URLSafeTimedSerializer(current_app.secret_key, salt=TOKEN_SALT).loads(
                tokens[0], max_age=TOKEN_MAX_AGE)
        except BadSignature:
            raise UploadError("confirmation_required", "Confirm the matching gallery object again before attaching the photograph.", 403)
        if not isinstance(payload, dict) or payload.get("artifact_id") != artifact_id:
            raise UploadError("confirmation_required", "Confirm this gallery object before attaching the photograph.", 403)
        if len(uploads) != 1 or uploads[0][0] != "photo":
            raise UploadError("bad_image", "Choose exactly one JPEG, PNG or WebP photograph.")
        raw = uploads[0][1].stream.read(MAX_IMAGE_BYTES + 1)
        if len(raw) > MAX_IMAGE_BYTES:
            raise RequestEntityTooLarge()
        return prepare_image(raw)
    finally:
        for _, uploaded in uploads:
            uploaded.close()


def _write_clean(path, prepared):
    # A cryptographic filename is exclusively reserved. Until the subsequent
    # database commit, no public route can read this file, including a partial
    # write. Only clean JPEG bytes ever reach the disk.
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, "wb") as output:
        output.write(prepared)
        output.flush()
        os.fsync(output.fileno())


def _store(artifact_id, prepared):
    digest = hashlib.sha256(prepared).hexdigest()
    db = _connection()
    owned_path = None
    commit_attempted = False
    try:
        # The lock covers cap checks, the exclusive file write and registration.
        # Competing processes cannot exceed the cap or publish duplicates.
        db.execute("BEGIN IMMEDIATE")
        row = db.execute("SELECT * FROM photos WHERE artifact_id=? AND sha256=?", (artifact_id, digest)).fetchone()
        if row:
            db.commit()
            return _public(row), True
        count = db.execute("SELECT COUNT(*) FROM photos WHERE artifact_id=?", (artifact_id,)).fetchone()[0]
        if count >= _setting("GALLERY_PHOTO_MAX_PER_ARTIFACT", 3, 20):
            raise UploadError("artifact_limit", "This artifact already has its visitor photographs.", 409)
        directory = os.path.join(_data_dir(), "gallery_photos")
        os.makedirs(directory, mode=0o700, exist_ok=True)
        # Count disk files, not only committed rows: a crash may leave an
        # unregistered clean JPEG, which must still count against the budget.
        used = sum(entry.stat(follow_symlinks=False).st_size for entry in os.scandir(directory)
                   if entry.is_file(follow_symlinks=False))
        limit = _setting("GALLERY_PHOTO_STORAGE_BYTES", 128 * 1024 * 1024, 512 * 1024 * 1024)
        if used + len(prepared) > limit:
            raise UploadError("storage_limit", "The photograph archive is full for now. The artifact and its story remain saved.", 507)
        photo_id = "p_" + secrets.token_hex(16)
        filename = os.path.join(directory, photo_id + ".jpg")
        # Mark ownership only after exclusive creation, so even a mocked ID
        # collision can never remove or overwrite an existing image.
        try:
            _write_clean(filename, prepared)
            owned_path = filename
        except FileExistsError:
            raise UploadError("storage_unavailable", "The photograph could not be saved. Please try again.", 503)
        except Exception:
            # Exclusive creation succeeded unless the file already existed,
            # handled separately above. Remove only our own partial JPEG.
            owned_path = filename
            raise
        db.execute("INSERT INTO photos VALUES(?,?,?,?,?,?,?)", (photo_id, artifact_id, digest,
                   len(prepared), time.time(), CONSENT_VERSION, "visitor_photo"))
        row = db.execute("SELECT * FROM photos WHERE id=?", (photo_id,)).fetchone()
        commit_attempted = True
        db.commit()
        owned_path = None
        return _public(row), False
    except Exception:
        # Before commit, failed registration can safely discard our own pixels.
        # Once commit is attempted, an exception may follow an actual commit.
        # Rollback cannot undo that completed commit, so retain the clean file
        # on uncertainty. An unregistered file is private and still counts
        # against the disk budget; a committed row must never lose its image.
        db.rollback()
        if owned_path is not None and not commit_attempted:
            try:
                os.unlink(owned_path)
            except FileNotFoundError:
                pass
        raise
    finally:
        db.close()


@gallery_photos_bp.route("/api/gallery/artifacts/<artifact_id>/photo", methods=["POST"])
def attach_photo(artifact_id):
    if not _ARTIFACT_ID.fullmatch(artifact_id):
        return _response("artifact_not_found", "This gallery object was not found.", 404)
    if request.content_length and request.content_length > MAX_REQUEST_BYTES:
        return _response("bad_image", "Choose a photograph up to 6 MB.", 413)
    try:
        if not _attempt_allowed():
            return _response("rate_limited", "You have attached several photographs. Please try again later.", 429)
        import gallery_archive
        if not gallery_archive.get_artifact(artifact_id):
            return _response("artifact_not_found", "This gallery object was not found.", 404)
        if not _DECODE_SLOTS.acquire(blocking=False):
            return _response("busy", "Photo attachment is busy. Please try again in a moment.", 429)
        try:
            prepared = _read_upload(artifact_id)
        finally:
            _DECODE_SLOTS.release()
        photo, duplicate = _store(artifact_id, prepared)
        response = jsonify(ok=True, photo=photo, photos=list_photos(artifact_id), duplicate=duplicate)
        response.headers["Cache-Control"] = "no-store"
        return response
    except UploadError as exc:
        return _response(exc.reason, exc.message, exc.status)
    except RequestEntityTooLarge:
        return _response("bad_image", "Choose a photograph up to 6 MB.", 413)
    except (ValueError, BadRequest) as exc:
        return _response("bad_image", str(exc) if isinstance(exc, ValueError)
                         else "The photo upload was incomplete. Please try again.", 400)
    except (OSError, sqlite3.Error):
        return _response("storage_unavailable", "The photograph could not be saved right now. The artifact remains in the gallery.", 503)


@gallery_photos_bp.route("/api/gallery/photos/<photo_id>", methods=["GET"])
def published_photo(photo_id):
    if not _PHOTO_ID.fullmatch(photo_id):
        return _response("photo_not_found", "This photograph was not found.", 404)
    db = None
    handle = None
    try:
        db = _connection(create=False)
        row = db.execute("SELECT * FROM photos WHERE id=?", (photo_id,)).fetchone() if db else None
        if not row:
            return _response("photo_not_found", "This photograph was not found.", 404)
        filename = os.path.join(_data_dir(), "gallery_photos", photo_id + ".jpg")
        descriptor = os.open(filename, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
        handle = os.fdopen(descriptor, "rb")
        info = os.fstat(handle.fileno())
        if not stat.S_ISREG(info.st_mode) or info.st_size != row["size"]:
            handle.close()
            return _response("photo_not_found", "This photograph was not found.", 404)
        response = send_file(handle, mimetype="image/jpeg", download_name="visitor-photograph.jpg",
                             conditional=True, etag=row["sha256"], max_age=86400)
        response.headers["Content-Length"] = str(row["size"])
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Content-Security-Policy"] = "default-src 'none'; sandbox"
        response.call_on_close(handle.close)
        return response
    except (OSError, sqlite3.Error):
        if handle:
            handle.close()
        return _response("photo_not_found", "This photograph was not found.", 404)
    finally:
        if db:
            db.close()
