"""Read-only catalogue acceptance with temporary data and all providers blocked."""
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

_boot = tempfile.TemporaryDirectory(prefix='tour-photo-api-')
os.environ['DATA_DIR'] = _boot.name
os.environ['DISCOVERY_ENABLED'] = 'false'
os.environ['DISPATCH_REMINDERS'] = 'false'
with patch('requests.sessions.Session.request', side_effect=AssertionError('No network in photo API tests')):
    import app as site

ROOT = Path(__file__).resolve().parent


class PhotoCatalogueAPITests(unittest.TestCase):
    def setUp(self):
        self.network = patch('requests.sessions.Session.request', side_effect=AssertionError('No network in photo API tests'))
        self.network.start()
        self.addCleanup(self.network.stop)
        self.client = site.app.test_client()
        self.seed = json.loads((ROOT/'trails.json').read_text())
        self.manifest = json.loads((ROOT/'tour-stop-photos.json').read_text())

    def test_every_stop_has_an_exact_private_preview_photo_with_credit(self):
        count = images = 0
        for trail in self.seed['trails']:
            for stop in trail.get('stops', []):
                row = self.manifest['trails'][trail['id']][str(stop['n'])]
                self.assertEqual(row['name'], stop['name'])
                self.assertTrue(row['photos'], (trail['id'], stop['n']))
                count += 1
                images += len(row['photos'])
                for photo in row['photos']:
                    for key in ('src', 'alt', 'caption', 'credit', 'sourceUrl', 'license'):
                        self.assertTrue(photo.get(key), (trail['id'], stop['n'], key))
                    self.assertTrue(photo['src'].startswith('https://'))
                    self.assertTrue(photo['sourceUrl'].startswith('https://'))
                    if photo.get('previewOnly') or photo.get('needsRightsReview'):
                        self.assertTrue(photo.get('rightsNote'))
        self.assertEqual(count, 148)
        self.assertEqual(images, 165)

    def test_public_api_never_changes_guide_audio_narratives_ids_or_walking_order(self):
        response = self.client.get('/api/trails')
        self.assertEqual(response.status_code, 200)
        result = response.get_json()
        self.assertEqual(len(result['trails']), len(self.seed['trails']))
        covered = 0
        for old, new in zip(self.seed['trails'], result['trails']):
            self.assertEqual({k:v for k,v in old.items() if k != 'stops'},
                             {k:v for k,v in new.items() if k != 'stops'})
            self.assertEqual(len(old.get('stops', [])), len(new.get('stops', [])))
            for before, after in zip(old.get('stops', []), new.get('stops', [])):
                self.assertEqual({k:v for k,v in before.items() if k not in ('photos','photo_details')},
                                 {k:v for k,v in after.items() if k not in ('photos','photo_details')})
                if after.get('photo_details'):
                    covered += 1
        self.assertEqual(covered, 141, 'Seven exact sources still need permission review')

    def test_private_reference_images_are_filtered_from_both_public_endpoints(self):
        restricted = [p['src'] for stops in self.manifest['trails'].values()
                      for stop in stops.values() for p in stop['photos']
                      if p.get('previewOnly') or p.get('needsRightsReview')]
        self.assertEqual(len(restricted), 7)
        for route in ('/tour-stop-photos.json', '/api/trails'):
            response = self.client.get(route)
            self.assertEqual(response.status_code, 200)
            encoded = json.dumps(response.get_json(), ensure_ascii=False)
            for src in restricted:
                self.assertNotIn(src, encoded)

    def test_slideshow_files_are_served_with_safe_types_and_without_caching(self):
        for extension, mime in (('js','text/javascript'), ('css','text/css')):
            with self.client.get('/tour-stop-slideshow.'+extension) as response:
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.mimetype, mime)
                self.assertEqual(response.headers['Cache-Control'], 'no-store')
                self.assertEqual(response.headers['X-Content-Type-Options'], 'nosniff')
        self.assertEqual(self.client.get('/tour-stop-slideshow.py').status_code, 404)


if __name__ == '__main__': unittest.main()
