"""The preview must not expose site data or start the production application."""
import unittest
from review.serve_architecture import app, ASSETS

class PreviewTests(unittest.TestCase):
    def setUp(self):
        self.client=app.test_client()

    def test_only_explicit_static_assets_are_served(self):
        for name in sorted(ASSETS):
            with self.subTest(name=name):
                response=self.client.get('/'+name)
                self.assertEqual(response.status_code,200)
                self.assertEqual(response.headers['Cache-Control'],'no-store')
                response.close()

    def test_home_is_private_and_has_reconstruction_disclosure(self):
        response=self.client.get('/')
        self.assertIn(b'noindex,nofollow',response.data)
        self.assertIn(b'not photographic scans',response.data)
        response.close()

    def test_no_data_source_or_parent_file_serving(self):
        for name in ['app.py','.env','customers.json','gallery_archive.sqlite','api/gallery/search',
                     'api/persistence','../app.py','vendor/three/../../../app.py']:
            with self.subTest(name=name):
                response=self.client.get('/'+name)
                self.assertEqual(response.status_code,404)
                response.close()

if __name__=='__main__':
    unittest.main()
