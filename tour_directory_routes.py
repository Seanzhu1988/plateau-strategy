"""Read-only public directory assets; never expose private preview files."""
from pathlib import Path
from flask import Blueprint, abort, send_from_directory


def create_tour_directory_blueprint(base_dir):
    root = Path(base_dir).resolve()
    bp = Blueprint('tour_directory', __name__)
    assets = {'tour-directory.js', 'tour-directory-data.js',
              'tour-directory.css', 'ivy-branding-public.js', 'tour-routing.js',
              'national-mall-walking.json', 'philadelphia-walking.json',
              'harvard-walking.json'}

    @bp.get('/tour-directory.<extension>')
    def directory_asset(extension):
        return serve('tour-directory.' + extension)

    @bp.get('/tour-directory-data.js')
    def directory_data():
        return serve('tour-directory-data.js')

    @bp.get('/ivy-branding-public.js')
    def public_school_identities():
        return serve('ivy-branding-public.js')

    @bp.get('/tour-routing.js')
    def walking_routes():
        return serve('tour-routing.js')

    @bp.get('/national-mall-walking.json')
    def mall_walking_snapshot():
        return serve('national-mall-walking.json')

    @bp.get('/philadelphia-walking.json')
    def philadelphia_walking_snapshot():
        return serve('philadelphia-walking.json')

    @bp.get('/harvard-walking.json')
    def harvard_walking_snapshot():
        return serve('harvard-walking.json')

    def serve(name):
        if name not in assets:
            abort(404)
        response = send_from_directory(root, name)
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    return bp
