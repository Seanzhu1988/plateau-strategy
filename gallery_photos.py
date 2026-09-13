"""Retired public visitor-photo endpoints, permanently fail-closed.

Visitor photographs are identification inputs, never public gallery assets.
Historical files and database records are deliberately left untouched and
private. Neither old consent nor an old signed token can restore publication.
Catalogue images and the separate identification service are unaffected.
"""

from flask import Blueprint, jsonify


gallery_photos_bp = Blueprint("gallery_photos", __name__)
# Retired protocol constants never grant permission to store or publish photos.
CONSENT_VERSION = "gallery-photo-publication-v1"
TOKEN_SALT = "gallery-photo-attachment-v1"


def list_photos(artifact_id):
    """Never enumerate historical visitor photographs for a public caller."""
    return []


def _response(reason, message, status):
    response = jsonify(ok=False, reason=reason, message=message)
    response.status_code = status
    response.headers["Cache-Control"] = "private, no-store, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Robots-Tag"] = "noindex, nofollow, noarchive"
    return response


@gallery_photos_bp.route("/api/gallery/artifacts/<artifact_id>/photo", methods=["POST"])
def attach_photo(artifact_id):
    # Do not parse/spool the request, decode its image, open storage, or inspect
    # a token. The policy is unconditional, even with publication_consent=true.
    return _response("photo_publication_disabled",
                     "Visitor photographs stay private. Artifact identification, "
                     "discoveries and written stories are still available.", 403)


@gallery_photos_bp.route("/api/gallery/photos/<photo_id>", methods=["GET"])
def published_photo(photo_id):
    # Known and unknown IDs are identical. No disk lookup, image, or 304.
    # Flask automatically routes HEAD here too; range requests cannot bypass it.
    return _response("photo_not_found", "This photograph is not publicly available.", 404)
