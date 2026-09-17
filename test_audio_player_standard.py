"""The standard audio player, held in place.

[SEAN 2026-09-16, a sketch: a pill with play, time, seek, volume and a globe
that lists each recorded language with its guide. "do this now and it became
standard, no download is allowed".]

What this pins:
  * every page that has an <audio> element is served with /psx-audio.js;
  * the player takes the browser's own control, and its Download item, away;
  * /media refuses to open a recording as a page of its own, where a browser
    offers to save it, and still serves it to a player;
  * a guessed voice (an "adopted" ledger row) never names a narrator.
"""
import os
from pathlib import Path
import re
import tempfile
import unittest
from unittest.mock import patch

_boot = tempfile.TemporaryDirectory(prefix='audio-standard-')
os.environ['DATA_DIR'] = _boot.name
os.environ['DISCOVERY_ENABLED'] = 'false'
os.environ['DISPATCH_REMINDERS'] = 'false'
with patch('requests.sessions.Session.request', side_effect=AssertionError('No network in audio tests')):
    import app as site

ROOT = Path(__file__).resolve().parent
PLAYER = (ROOT / 'psx-audio.js').read_text(encoding='utf-8')
SAMPLE = 'guide-lincoln-memorial.mp3'


class AudioPlayerStandardTests(unittest.TestCase):
    def setUp(self):
        self.network = patch('requests.sessions.Session.request', side_effect=AssertionError('No network in audio tests'))
        self.network.start()
        self.addCleanup(self.network.stop)
        self.client = site.app.test_client()

    def test_every_public_page_with_audio_gets_the_player(self):
        pages = ['/national-mall', '/freedom-trail', '/tour/mount-rushmore',
                 '/name-protection', '/universal-gallery']
        for path in pages:
            body = self.client.get(path).get_data()
            self.assertIn(b'src="/psx-audio.js?v=', body, path)
            self.assertEqual(body.count(b'src="/psx-audio.js'), 1, path)

    def test_a_page_without_audio_is_left_alone(self):
        body = self.client.get('/inventory').get_data()
        self.assertNotIn(b'psx-audio.js', body)

    def test_the_player_removes_the_native_control_and_its_download(self):
        self.assertIn('a.removeAttribute("controls")', PLAYER)
        self.assertIn('nodownload', PLAYER)
        self.assertIn('"contextmenu"', PLAYER)
        self.assertIsNone(re.search(r'download\s*=|\.download\b', PLAYER))

    def test_a_guessed_voice_names_nobody(self):
        self.assertIn('!row.adopted', PLAYER)

    def test_opening_a_recording_as_a_page_is_refused(self):
        self.assertTrue((ROOT / 'media' / 'audio' / SAMPLE).exists())
        url = '/media/audio/' + SAMPLE
        for dest in ('document', 'iframe'):
            r = self.client.get(url, headers={'Sec-Fetch-Dest': dest})
            self.assertEqual(r.status_code, 403, dest)
        r = self.client.get(url, headers={'Sec-Fetch-Dest': 'audio'})
        self.assertEqual(r.status_code, 200)
        self.assertIn('Sec-Fetch-Dest', r.headers.get('Vary', ''))
        r.close()
        # A browser too old to send the header is let through, or the player
        # itself would go silent there.
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        r.close()

    def test_the_ledger_is_not_refused(self):
        r = self.client.get('/media/audio/_recorded.json', headers={'Sec-Fetch-Dest': 'document'})
        self.assertEqual(r.status_code, 200)


if __name__ == '__main__':
    unittest.main()
