"""Private loopback preview. No production application import or background jobs.

Run from a Python environment with Flask installed:
    python review/serve_architecture.py
Open http://127.0.0.1:8777/ on this computer.
"""
from pathlib import Path
from flask import Flask, abort, send_from_directory

ROOT = Path(__file__).resolve().parent.parent
app = Flask(__name__)
ASSETS = {
    'architecture-preview.html', 'architecture-preview.css', 'architecture-preview.js',
    'architecture-wtc.js', 'architecture-boston.js', 'architecture-camera.js', 'architecture-assets.js',
    'trail-3d.js', 'vendor/three/three.module.min.js',
    'vendor/three/three.core.min.js', 'vendor/three/OrbitControls.js',
}
FORMS = {'state-house', 'park-street', 'old-south', 'old-state-house', 'faneuil-hall',
         'paul-revere', 'old-north', 'constitution', 'bunker-hill'}
ASSETS.update(f'trail-form-{key}.js' for key in FORMS)

@app.get('/')
def index():
    return asset('architecture-preview.html')

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
