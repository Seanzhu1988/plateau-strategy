/* "Continue with Apple", one implementation, any form.
 *
 * The Apple sibling of google-signin.js, and it holds to the same two rules.
 * First, it never decodes the credential: a browser can say anything, so the
 * identity token goes to /api/auth/apple and only what the SERVER returns,
 * after it has checked Apple's signature, is used. Second, it is silent when
 * it cannot run: no client id, Apple unreachable, script blocked, popup
 * closed, verification refused, every path out leaves a form the visitor can
 * still type into. A sign-in shortcut that shouts when it breaks is worse than
 * one that quietly is not there.
 *
 * It shares google-signin.js's mount, so a page that offers Google offers this
 * too with no extra markup:
 *
 *     <div id="gsiBox" hidden>
 *       <div id="gsiBtn"></div>
 *       <p class="gsi-note">…</p>
 *       <div class="gsi-or">or</div>
 *     </div>
 *
 * The Apple button is added just below the Google one. Fields are found the
 * same way, by data-gsi-* first, then name, then a best guess.
 */
(function () {
  "use strict";

  function field(scope, kind) {
    var tagged = scope.querySelector('[data-gsi-' + kind + ']');
    if (tagged) return tagged;
    var byName = scope.querySelector('input[name="' + kind + '"]');
    if (byName) return byName;
    var all = scope.querySelectorAll('input');
    for (var i = 0; i < all.length; i++) {
      var id = (all[i].id || all[i].name || '').toLowerCase();
      if (kind === 'email' && /mail/.test(id)) return all[i];
      if (kind === 'name' && /name/.test(id) && !/last|sur|user|file|company/.test(id)) return all[i];
    }
    return null;
  }

  // Apple's logo as a drawn mark, so the button reads the same on every
  // platform. The  glyph only renders on Apple devices.
  var APPLE_MARK = '<svg viewBox="0 0 384 512" width="15" height="15" fill="currentColor"'
    + ' aria-hidden="true" focusable="false"><path d="M318.7 268.7c-.2-36.7 16.4-64.4'
    + ' 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7'
    + '-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2'
    + ' 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5'
    + ' 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5'
    + '-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';

  function styleOnce() {
    if (document.getElementById('asiCss')) return;
    var s = document.createElement('style');
    s.id = 'asiCss';
    s.textContent = [
      '#asiBtn{display:flex;justify-content:center;margin-top:.6rem}',
      '.asi-button{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;',
      'min-height:44px;padding:0 1.15rem;border-radius:999px;border:1px solid #000;',
      'background:#000;color:#fff;font:inherit;font-weight:600;font-size:.92rem;cursor:pointer}',
      '.asi-button:hover{opacity:.88}',
      '.asi-button:disabled{opacity:.6;cursor:default}',
      '.asi-button svg{display:block}'
    ].join('');
    document.head.appendChild(s);
  }

  async function init() {
    var box = document.getElementById('gsiBox');
    if (!box || typeof psxJSON !== 'function') return;

    // Already signed in through the site-wide chip? google-signin.js fills the
    // fields from the session; there is nothing for this to add.
    try {
      var who = await psxJSON('/api/auth/reader');
      if (who && who.signed_in) return;
    } catch (e) { /* the button below still works */ }

    var cfg;
    try { cfg = await psxJSON('/api/auth/apple/config'); } catch (e) { return; }
    if (!cfg || !cfg.enabled || !cfg.client_id) return;      // stays hidden

    styleOnce();
    box.hidden = false;                       // the form offers a shortcut after all
    var scope = box.closest('form') || document;

    var mount = document.getElementById('asiBtn');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'asiBtn';
      var gsiBtn = document.getElementById('gsiBtn');
      if (gsiBtn && gsiBtn.parentNode) gsiBtn.parentNode.insertBefore(mount, gsiBtn.nextSibling);
      else box.appendChild(mount);
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'asi-button';
    btn.setAttribute('aria-label', 'Continue with Apple');
    btn.innerHTML = APPLE_MARK + '<span>Continue with Apple</span>';
    mount.appendChild(btn);

    // Apple's SDK loads on the first tap, not with the page, so a form that
    // only offers the shortcut pays nothing for it until a visitor wants it.
    var sdk = null;
    function loadSdk() {
      if (sdk) return sdk;
      sdk = new Promise(function (done) {
        var s = document.createElement('script');
        s.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        s.async = true; s.defer = true;
        s.onload = function () {
          try {
            // redirectURI must be a Return URL registered on the Services ID,
            // https, and match this origin exactly, or Apple refuses. That is
            // why the whole feature waits on the domain being configured there.
            AppleID.auth.init({ clientId: cfg.client_id, scope: 'name email',
              redirectURI: location.origin + '/', usePopup: true });
            done(true);
          } catch (e) { done(false); }
        };
        s.onerror = function () { done(false); };
        document.head.appendChild(s);
      });
      return sdk;
    }

    btn.addEventListener('click', function () {
      btn.disabled = true;
      loadSdk().then(function (ok) {
        if (!ok || !window.AppleID || !AppleID.auth) { btn.disabled = false; return; }
        return AppleID.auth.signIn().then(function (data) {
          var idt = data && data.authorization && data.authorization.id_token;
          var nm = '';
          // Apple hands over the name only on the first authorisation, never
          // in the token, so pass along whatever the SDK gave us this time.
          if (data && data.user && data.user.name) {
            nm = ((data.user.name.firstName || '') + ' ' + (data.user.name.lastName || '')).trim();
          }
          return psxJSON('/api/auth/apple', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: idt, name: nm })
          });
        }).then(function (d) {
          btn.disabled = false;
          if (!d || !d.ok) return;            // silent: they can still type
          var nameEl = field(scope, 'name');
          var mailEl = field(scope, 'email');
          if (nameEl && d.name && !nameEl.value) nameEl.value = d.name;
          if (mailEl && d.email && !mailEl.value) mailEl.value = d.email;
          var note = box.querySelector('.gsi-note');
          if (note) note.textContent = 'Signed in as ' + d.email + ', check the rest and send it.';
        }).catch(function () { btn.disabled = false; });   // closed the popup, or refused
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
