"""Public directory route surface; synthetic app with no site data or network."""
from pathlib import Path
import unittest
from flask import Flask
from tour_directory_routes import create_tour_directory_blueprint

ROOT = Path(__file__).resolve().parent


class DirectoryRoutesTests(unittest.TestCase):
    def setUp(self):
        app = Flask(__name__, static_folder=None)
        app.register_blueprint(create_tour_directory_blueprint(ROOT))
        self.client = app.test_client()

    def test_only_public_assets_are_served_with_safe_types_and_fresh_versions(self):
        for path in ['/tour-directory.js','/tour-directory-data.js','/tour-directory.css','/ivy-branding-public.js']:
            with self.subTest(path=path), self.client.get(path) as response:
                self.assertEqual(response.status_code,200)
                self.assertEqual(response.headers['Cache-Control'],'no-store')
                self.assertEqual(response.headers['X-Content-Type-Options'],'nosniff')
                self.assertNotEqual(response.mimetype,'text/html')

    def test_private_preview_and_repository_files_are_not_exposed(self):
        for path in ['/tour-directory-preview.html','/tour-directory-preview.js','/ivy-branding.js','/tour-directory.py','/tour-directory.html','/tour-directory.json','/tour-directory.../app.py','/audits/ivy-branding-sources.md']:
            with self.subTest(path=path), self.client.get(path) as response:
                self.assertEqual(response.status_code,404)

    def test_directory_assets_are_read_only(self):
        self.assertEqual(self.client.post('/tour-directory.js').status_code,405)


if __name__ == '__main__': unittest.main()
