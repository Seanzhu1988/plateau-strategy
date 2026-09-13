"""Reviewed, destination-specific photo overlays; never change audio or route data."""
from copy import deepcopy
import json
from pathlib import Path
from urllib.parse import urlsplit
from gallery_archive import _visitor_photo_url


def read_photo_manifest(base_dir):
    try:
        data = json.loads(Path(base_dir, 'tour-stop-photos.json').read_text(encoding='utf-8'))
        if data.get('version') == 1 and isinstance(data.get('trails'), dict):
            # Private research references are not publication permission.
            # Public JSON and tour APIs must never expose their image URLs.
            for stops in data['trails'].values():
                if not isinstance(stops, dict):
                    continue
                for stop in stops.values():
                    if isinstance(stop, dict):
                        candidates = stop.get('photos', [])
                        stop['photos'] = [p for p in (safe_photo(p) for p in candidates) if p] if isinstance(candidates, list) else []
            return data
    except (OSError, ValueError, AttributeError):
        pass
    return {'version': 1, 'trails': {}}


def safe_photo(photo):
    if not isinstance(photo, dict):
        return None
    if photo.get('previewOnly') or photo.get('needsRightsReview'):
        return None
    src = photo.get('src')
    if not isinstance(src, str):
        return None
    try:
        url = urlsplit(src)
        if url.scheme != 'https' or not url.hostname or url.username or url.password:
            return None
        if _visitor_photo_url(src):
            return None
    except ValueError:
        return None
    return {k: str(photo[k]) for k in ('src', 'alt', 'caption', 'credit', 'sourceUrl',
             'license', 'licenseUrl', 'rightsNote') if photo.get(k) is not None}


def with_stop_photos(catalog, manifest):
    """Overlay only exact stable IDs/numbers/names on a fresh public copy.

    Legacy pages still receive string URLs in photos; newer slideshows receive
    full attribution in photo_details. Never write the seed or an audio field.
    """
    result = deepcopy(catalog)
    for trail in result.get('trails', []):
        reviewed = manifest.get('trails', {}).get(trail.get('id'), {})
        if not isinstance(reviewed, dict):
            continue
        for stop in trail.get('stops', []):
            item = reviewed.get(str(stop.get('n')))
            if not isinstance(item, dict) or item.get('name') != stop.get('name'):
                continue
            candidates = item.get('photos', [])
            photos = [p for p in (safe_photo(p) for p in candidates) if p] if isinstance(candidates, list) else []
            if photos:
                stop['photos'] = [p['src'] for p in photos]
                stop['photo_details'] = photos
    return result
