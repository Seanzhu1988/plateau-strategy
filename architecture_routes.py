"""Public, read-only architecture pages and a deliberately small asset surface."""
import json
from pathlib import Path
from flask import Blueprint, Response, abort, request, send_from_directory

MODEL_STOPS = {
    'state-house': 2, 'park-street': 3, 'old-south': 8,
    'old-state-house': 9, 'faneuil-hall': 11, 'paul-revere': 12,
    'old-north': 13, 'constitution': 15, 'bunker-hill': 16,
}
MODEL_KEYS = ('world-trade-center', *MODEL_STOPS)
MODULES = {
    'preview.js', 'boston.js', 'wtc.js', 'camera.js', 'assets.js',
    'navigation.js', 'public.js', 'stories.js',
}
STYLES = {'preview.css', 'public.css'}
THREE_FILES = {'three.module.min.js', 'three.core.min.js', 'OrbitControls.js', 'LICENSE'}


def model_catalog(base_dir):
    with open(Path(base_dir, 'trails.json'), encoding='utf-8') as stream:
        trails = json.load(stream)['trails']
    stops = {stop['n']: stop for tour in trails if tour['id'] == 'freedom-trail'
             for stop in tour['stops']}
    result = {}
    for key, number in MODEL_STOPS.items():
        stop = stops[number]
        photos = [url for url in (stop.get('photos') or [])[:1]
                  if isinstance(url, str) and url.startswith('https://')]
        photo = photos[0] if photos else ''
        source = photo
        if 'commons.wikimedia.org/wiki/Special:FilePath/' in photo:
            source = photo.replace('/wiki/Special:FilePath/', '/wiki/File:').split('?')[0]
        result[key] = {'name': stop['name'], 'photos': photos, 'photoSource': source,
                       'destinationHref': '/freedom-trail#ft-stop-' + str(number), 'stop': number}
    # A real destination photograph, released into the public domain by its
    # creator Marco Almbauer. Keep the file-description page as the credit.
    result['world-trade-center'] = {
        'name': 'One World Trade Center and the 9/11 Memorial',
        'photos': ['https://commons.wikimedia.org/wiki/Special:FilePath/National_September_11_Memorial_South_Pool.jpg?width=1280'],
        'photoSource': 'https://commons.wikimedia.org/wiki/File:National_September_11_Memorial_South_Pool.jpg',
        'photoCredit': 'Marco Almbauer, public domain',
        'destinationHref': '/destination/9-11-memorial-and-museum',
    }
    return result


def create_architecture_blueprint(base_dir):
    root = Path(base_dir).resolve()
    bp = Blueprint('architecture', __name__)

    @bp.get('/architecture')
    def architecture_page():
        key = request.args.get('model', 'world-trade-center')
        if key not in MODEL_KEYS:
            abort(404)
        context = json.dumps({'models': model_catalog(root)}, ensure_ascii=False)
        context = context.replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
        body = Path(root, 'architecture.html').read_text(encoding='utf-8')
        body = body.replace('__ARCHITECTURE_CONTEXT__', context)
        if request.args.get('embed') == '1':
            body = body.replace('<title>', '<meta name="robots" content="noindex,follow"><title>', 1)
        response = Response(body, mimetype='text/html')
        response.headers['Cache-Control'] = 'no-store'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        return response

    @bp.get('/architecture-<name>')
    def architecture_asset(name):
        if name not in MODULES | STYLES:
            abort(404)
        response = send_from_directory(root, 'architecture-' + name)
        # ES module dependencies do not pass through the site's HTML stamping.
        # Revalidate the small changing source graph, not a stale mixed release.
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    @bp.get('/vendor/three/<path:name>')
    def architecture_vendor(name):
        if name not in THREE_FILES:
            abort(404)
        response = send_from_directory(root / 'vendor' / 'three', name)
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    return bp
