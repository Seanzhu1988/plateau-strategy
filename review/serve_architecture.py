"""Private loopback preview. No production application import or background jobs.

Run from a Python environment with Flask installed:
    python review/serve_architecture.py
Open http://127.0.0.1:8777/ on this computer.
"""
from pathlib import Path
from flask import Flask, abort, redirect, request, send_from_directory

ROOT = Path(__file__).resolve().parent.parent
app = Flask(__name__)
ASSETS = {
    'architecture-preview.html', 'architecture-preview.css', 'architecture-preview.js',
    'architecture-wtc.js', 'architecture-boston.js', 'architecture-camera.js', 'architecture-assets.js', 'architecture-navigation.js',
    'trail-3d.js', 'vendor/three/three.module.min.js',
    'vendor/three/three.core.min.js', 'vendor/three/OrbitControls.js',
    'tour-directory-preview.html', 'tour-directory-preview.css',
    'tour-directory-preview.js', 'tour-directory-preview-data.js', 'ivy-branding.js',
    'architecture-stories.js',
}
FORMS = {'state-house', 'park-street', 'old-south', 'old-state-house', 'faneuil-hall',
         'paul-revere', 'old-north', 'constitution', 'bunker-hill'}
ASSETS.update(f'trail-form-{key}.js' for key in FORMS)

@app.get('/')
def index():
    return asset('architecture-preview.html')

@app.get('/api/trails')
def tour_catalog():
    response = send_from_directory(ROOT, 'trails.json')
    response.headers['Cache-Control'] = 'no-store'
    return response

@app.get('/architecture')
@app.get('/national-mall')
@app.get('/freedom-trail')
@app.get('/tours')
@app.get('/tour/<slug>')
def open_local_tour(slug=None):
    if slug is not None and not all(c.isalnum() or c == '-' for c in slug):
        abort(404)
    # Review links stay local, against the isolated read-only app, never live.
    target = 'http://127.0.0.1:8778' + request.path
    if request.query_string:
        target += '?' + request.query_string.decode('ascii', errors='ignore')
    return redirect(target)

@app.get('/<path:name>')
def asset(name):
    if name not in ASSETS:
        abort(404)
    response = send_from_directory(ROOT, name)
    response.headers['Cache-Control'] = 'no-store'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'no-referrer'
    return response

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8777, threaded=True, debug=False)
