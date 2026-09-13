"""Read-only public directory assets; never expose private preview files."""
from pathlib import Path
from flask import Blueprint, abort, send_from_directory


def create_tour_directory_blueprint(base_dir):
    root = Path(base_dir).resolve()
    bp = Blueprint('tour_directory', __name__)
    assets = {'tour-directory.js', 'tour-directory-data.js',
              'tour-directory.css', 'ivy-branding-public.js'}

    @bp.get('/tour-directory.<extension>')
    def directory_asset(extension):
        return serve('tour-directory.' + extension)

    @bp.get('/tour-directory-data.js')
    def directory_data():
        return serve('tour-directory-data.js')

    @bp.get('/ivy-branding-public.js')
    def public_school_identities():
        return serve('ivy-branding-public.js')

    def serve(name):
        if name not in assets:
            abort(404)
        response = send_from_directory(root, name)
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    return bp
