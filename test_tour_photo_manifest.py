import copy
import json
from pathlib import Path
import tempfile
import unittest
from tour_photos import read_photo_manifest, safe_photo, with_stop_photos


class StopPhotoManifestTests(unittest.TestCase):
    def setUp(self):
        self.catalog = {'trails': [{'id': 'example', 'name': 'A walk', 'audio': '/intro.mp3',
            'stops': [{'n': 1, 'name': 'Exact building', 'photos': ['https://old.test/a.jpg'],
                       'audio': '/stop-1.mp3', 'desc': 'Original words', 'model': 'original-model'}]}]}
        self.manifest = {'version': 1, 'trails': {'example': {'1': {'name': 'Exact building',
            'photos': [{'src': 'https://commons.wikimedia.org/a.jpg', 'alt': 'Exact building',
                        'credit': 'Photographer', 'license': 'CC0',
                        'sourceUrl': 'https://commons.wikimedia.org/wiki/File:A.jpg'}]}}}}

    def test_overlay_changes_only_photo_fields_and_never_mutates_input(self):
        before = copy.deepcopy(self.catalog)
        result = with_stop_photos(self.catalog, self.manifest)
        self.assertEqual(before, self.catalog)
        self.assertEqual(result['trails'][0]['audio'], '/intro.mp3')
        old, new = before['trails'][0]['stops'][0], result['trails'][0]['stops'][0]
        self.assertEqual({k: v for k,v in old.items() if k != 'photos'},
                         {k: v for k,v in new.items() if k not in ('photos','photo_details')})
        self.assertEqual(new['photos'], ['https://commons.wikimedia.org/a.jpg'])
        self.assertEqual(new['photo_details'][0]['credit'], 'Photographer')

    def test_same_number_with_wrong_name_or_trail_never_matches(self):
        for change in ('name', 'trail'):
            m = copy.deepcopy(self.manifest)
            if change == 'name': m['trails']['example']['1']['name'] = 'Different building'
            else: m['trails']['other'] = m['trails'].pop('example')
            self.assertEqual(with_stop_photos(self.catalog, m), self.catalog)

    def test_missing_or_corrupt_manifest_keeps_catalog(self):
        with tempfile.TemporaryDirectory() as folder:
            for content in (None, '{broken', '{}', '[]'):
                if content is not None: Path(folder, 'tour-stop-photos.json').write_text(content)
                self.assertEqual(with_stop_photos(self.catalog, read_photo_manifest(folder)), self.catalog)

    def test_unsafe_and_visitor_photo_inputs_are_refused(self):
        for src in ('javascript:alert(1)', 'data:image/svg+xml,<svg/>', '/api/gallery/photos/x',
                    'https://site.test/api/gallery/photos/x', 'https://site.test/%2561pi%252fgallery%252fphotos/private',
                    'https://user:pass@site.test/a.jpg'):
            self.assertIsNone(safe_photo({'src': src}))

    def test_private_reference_photos_never_leave_public_manifest_or_tour_api(self):
        stop = self.manifest['trails']['example']['1']
        good = stop['photos'][0]
        stop['photos'] += [{**good, 'src': 'https://private.test/reference.jpg', 'previewOnly': True},
                           {**good, 'src': 'https://private.test/artwork.jpg', 'needsRightsReview': True}]
        with tempfile.TemporaryDirectory() as folder:
            Path(folder, 'tour-stop-photos.json').write_text(json.dumps(self.manifest))
            public = read_photo_manifest(folder)
        self.assertNotIn('private.test', json.dumps(public))
        overlaid = with_stop_photos(self.catalog, self.manifest)
        self.assertEqual(len(overlaid['trails'][0]['stops'][0]['photo_details']), 1)

    def test_malformed_optional_photo_rows_do_not_break_audio_catalog(self):
        for bad in (None, [], 'not a mapping'):
            manifest = {'version': 1, 'trails': {'example': bad}}
            self.assertEqual(with_stop_photos(self.catalog, manifest), self.catalog)
        self.manifest['trails']['example']['1']['photos'] = None
        self.assertEqual(with_stop_photos(self.catalog, self.manifest), self.catalog)

    def test_empty_research_row_does_not_destroy_existing_photo(self):
        self.manifest['trails']['example']['1']['photos'] = []
        self.assertEqual(with_stop_photos(self.catalog, self.manifest), self.catalog)


if __name__ == '__main__': unittest.main()
