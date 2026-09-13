"""Loopback-only review of release pages, with temporary data and jobs disabled."""
import os
from pathlib import Path
import sys
import tempfile
from unittest.mock import patch

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT))
review_data=tempfile.TemporaryDirectory(prefix='architecture-release-data-')
os.environ['DATA_DIR']=review_data.name
os.environ['DISCOVERY_ENABLED']='false'
os.environ['DISPATCH_REMINDERS']='false'
os.environ['FLASK_SECRET']='local-architecture-review-not-production'

if __name__=='__main__':
    # No backend provider, messaging, payment or geolocation requests during
    # a layout review. Images are requested by the browser, not the app.
    with patch('requests.sessions.Session.request',side_effect=RuntimeError('External calls disabled in local review')):
        import app as site
        from flask import abort,request
        @site.app.get('/review/architecture-no-webgl')
        def architecture_without_renderer():
            # Private failure fixture: prove photo + story survive a failed
            # graphics module. This route is never registered in production.
            response=site.app.view_functions['architecture.architecture_page']()
            response.set_data(response.get_data(as_text=True).replace(
                'src="/architecture-preview.js"',
                'src="/review/renderer-unavailable.js"'))
            return response
        @site.app.before_request
        def review_read_only():
            if request.method not in {'GET','HEAD','OPTIONS'}:
                abort(405)
            if request.path.startswith(('/dispatch','/setup','/archive','/access','/api/persistence')):
                abort(404)
        site.app.run(host='127.0.0.1',port=8778,threaded=True,debug=False)
