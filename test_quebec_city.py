"""Public model delivery checks using only an isolated Flask blueprint."""
import json
import struct
import unittest
from pathlib import Path
from flask import Flask
from architecture_routes import create_architecture_blueprint

ROOT = Path(__file__).resolve().parent

class QuebecTests(unittest.TestCase):
    def setUp(self):
        app = Flask(__name__, static_folder=None)
        app.register_blueprint(create_architecture_blueprint(ROOT))
        self.client = app.test_client()

    def test_page_and_local_delivery(self):
        with self.client.get('/quebec-city') as response:
            self.assertEqual(response.status_code, 200)
            self.assertIn('Québec City', response.text)
            self.assertIn('architectural illustration', response.text)
            self.assertNotIn('higgsfield.ai', response.text)
        for name in ['quebec-city.js', 'quebec-city.css', 'frontenac-autumn-v4.png']:
            with self.client.get('/quebec-assets/' + name) as response:
                self.assertEqual(response.status_code, 200)
        with self.client.get('/quebec-assets/frontenac-autumn-v4.glb', headers={'Range':'bytes=0-19'}) as response:
            self.assertEqual(response.status_code, 206)
            self.assertEqual(response.mimetype, 'model/gltf-binary')
            self.assertEqual(response.data[:4], b'glTF')

    def test_only_public_assets_exposed(self):
        for path in ['/quebec-assets/app.py', '/quebec-assets/unknown.glb', '/quebec-assets/../app.py']:
            with self.client.get(path) as response:
                self.assertEqual(response.status_code, 404)

    def test_model_is_self_contained_and_has_autumn_trees(self):
        data = (ROOT/'media/quebec/frontenac-autumn-v4.glb').read_bytes()
        self.assertEqual(struct.unpack_from('<I', data, 8)[0], len(data))
        length = struct.unpack_from('<I', data, 12)[0]
        model = json.loads(data[20:20+length])
        self.assertTrue(any('maple canopy' in n.get('name', '') for n in model['nodes']))
        self.assertTrue(all('uri' not in image for image in model['images']))
        self.assertEqual(model.get('extensionsRequired'), ['KHR_lights_punctual'])

if __name__ == '__main__':
    unittest.main()
