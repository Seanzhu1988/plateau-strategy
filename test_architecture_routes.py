"""Read-only public architecture routes, without the production app or data."""
import json
from pathlib import Path
import unittest
from unittest.mock import patch
from flask import Flask
from architecture_routes import (create_architecture_blueprint, model_catalog,
                                 MODEL_KEYS, MODULES, STYLES, THREE_FILES)

ROOT = Path(__file__).resolve().parent


class ArchitectureRoutesTests(unittest.TestCase):
    def setUp(self):
        app = Flask(__name__, static_folder=None)
        app.register_blueprint(create_architecture_blueprint(ROOT))
        self.client = app.test_client()

    def test_every_approved_model_has_a_public_page_and_correct_story_key(self):
        for key in MODEL_KEYS:
            with self.subTest(key=key), self.client.get('/architecture?model='+key) as response:
                self.assertEqual(response.status_code, 200)
                self.assertIn('architecture-public.js', response.text)
                self.assertIn('architecture-preview.js', response.text)
                self.assertNotIn('__ARCHITECTURE_CONTEXT__', response.text)
                self.assertNotIn('Private model review', response.text)
                self.assertNotIn('invented geometry', response.text)
                self.assertEqual(response.headers['Cache-Control'], 'no-store')

    def test_embeds_are_same_origin_and_noindex(self):
        with self.client.get('/architecture?model=state-house&embed=1&lang=zh') as response:
            self.assertEqual(response.headers['X-Frame-Options'], 'SAMEORIGIN')
            self.assertIn('noindex,follow', response.text)

    def test_unknown_models_and_private_files_are_not_served(self):
        for path in ['/architecture?model=peace-fountain', '/architecture?model=../app.py',
                     '/architecture-preview.html', '/architecture-routes.py',
                     '/architecture-stories-sources.md', '/vendor/three/../../../.env',
                     '/vendor/three/README.md', '/vendor/three/not-a-module.js']:
            with self.subTest(path=path), self.client.get(path) as response:
                self.assertEqual(response.status_code, 404)

    def test_only_explicit_modules_and_styles_are_published_without_stale_caching(self):
        paths=['/architecture-'+name for name in MODULES|STYLES]
        paths+=['/vendor/three/'+name for name in THREE_FILES]
        for path in paths:
            with self.subTest(path=path), self.client.get(path) as response:
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.headers['Cache-Control'], 'no-store')
                self.assertEqual(response.headers['X-Content-Type-Options'], 'nosniff')

    def test_inline_catalog_cannot_break_out_of_its_json_element(self):
        hostile={'world-trade-center':{'name':'</script><script>alert(1)</script>'}}
        with patch('architecture_routes.model_catalog', return_value=hostile):
            with self.client.get('/architecture') as response:
                self.assertNotIn('</script><script>alert(1)', response.text)
                self.assertIn('\\u003c/script\\u003e', response.text)

    def test_catalog_preserves_exact_stop_identity_and_specific_photos(self):
        catalog=model_catalog(ROOT)
        self.assertEqual(set(catalog), set(MODEL_KEYS))
        for key, row in catalog.items():
            self.assertTrue(row['photos'], key)
            self.assertTrue(all(url.startswith('https://') for url in row['photos']))
            if key!='world-trade-center':
                self.assertEqual(row['destinationHref'], '/freedom-trail#ft-stop-'+str(row['stop']))
        self.assertEqual(catalog['state-house']['stop'], 2)
        self.assertEqual(catalog['old-state-house']['stop'], 9)
        self.assertEqual(catalog['world-trade-center']['destinationHref'], '/destination/9-11-memorial-and-museum')


if __name__=='__main__':
    unittest.main()
