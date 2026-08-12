/* "Continue with Google", one implementation, any form.
 *
 * Lifted out of booking.html, which had the only copy. Putting the same forty
 * lines into the driver and agent forms as well would have made three copies
 * of a security-sensitive routine, and the next person to fix a bug in it
 * would fix one of them.
 *
 * What it does NOT do, and this is the whole security of the feature: it never
 * decodes the credential. A browser can say anything, so a token read here and
 * believed would let anyone book, register or sign up as anyone. The token
 * goes to /api/auth/google, the server checks the signature against Google's
 * own keys, and only what comes back from that is used.
 *
 * Nothing is stored on either side. The reply fills two fields.
 *
 * Silent about failures on purpose. Every path out of here, no client id
 * configured, Google unreachable, script blocked, verification refused, 
 * leaves the visitor with a form they can still type into. A sign-in shortcut
 * that shouts when it breaks is worse than one that quietly is not there.
 *
 * Usage: put a mount point in the page and let this find it.
 *
 *     <div id="gsiBox" hidden>
 *       <div id="gsiBtn"></div>
 *       <p class="gsi-note">…optional wording…</p>
 *       <div class="gsi-or">or</div>
 *     </div>
 *
 * Fields are found by name or id: it fills the first it sees of name/email,
 * trying data-gsi-name / data-gsi-email first for a form that calls them
 * something else (r_name, a_email, and so on).
 */
(function () {
  "use strict";

  function field(scope, kind) {
    // Explicit wins: a form can label its own fields for this.
    var tagged = scope.querySelector('[data-gsi-' + kind + ']');
    if (tagged) return tagged;
    var byName = scope.querySelector('input[name="' + kind + '"]');
    if (byName) return byName;
    // Otherwise the first identity-ish field of that kind that is empty.
    var all = scope.querySelectorAll('input');
    for (var i = 0; i < all.length; i++) {
      var id = (all[i].id || all[i].name || '').toLowerCase();
      if (kind === 'email' && /mail/.test(id)) return all[i];
      if (kind === 'name' && /name/.test(id) && !/last|sur|user|file|company/.test(id)) return all[i];
    }
    return null;
  }

  async function init() {
    var box = document.getElementById('gsiBox');
    if (!box || typeof psxJSON !== 'function') return;

    var cfg;
    try { cfg = await psxJSON('/api/auth/google/config'); } catch (e) { return; }
    if (!cfg || !cfg.enabled || !cfg.client_id) return;      // stays hidden

    var loaded = await new Promise(function (done) {
      var s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true; s.defer = true;
      s.onload = function () { done(true); };
      s.onerror = function () { done(false); };
      document.head.appendChild(s);
    });
    if (!loaded || !window.google || !google.accounts || !google.accounts.id) return;

    // The fields this button belongs to. A <form> around them is the clean
    // answer, but only booking.html has one, the driver and agent pages are
    // loose <label>/<input> pairs in a card, so there is no element to scope
    // to and the search has to be the whole document. That is safe because
    // both of those pages tag their fields explicitly.
    var scope = box.closest('form') || document;

    google.accounts.id.initialize({
      client_id: cfg.client_id,
      callback: async function (resp) {
        try {
          var d = await psxJSON('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: resp.credential })
          });
          if (!d || !d.ok) return;                  // silent: they can still type
          var nameEl = field(scope, 'name');
          var mailEl = field(scope, 'email');
          // Never overwrite something they have already typed.
          if (nameEl && d.name && !nameEl.value) nameEl.value = d.name;
          if (mailEl && d.email && !mailEl.value) mailEl.value = d.email;
          var note = box.querySelector('.gsi-note');
          if (note) note.textContent = 'Signed in as ' + d.email
                                     + ', check the rest and send it.';
          // Move them to the first thing still empty, so the shortcut ends
          // with the cursor where the work is, but only forwards. The driver
          // page puts a "returning driver" sign-in box ABOVE this button, in
          // the same card and with no form between them, so "first empty field
          // on the page" is that page's VIN box: the shortcut would fill the
          // registration fields and then throw the cursor back into a sign-in
          // form the visitor is not using. Start from what was just filled.
          var anchor = mailEl || nameEl;
          var rest = scope.querySelectorAll('input:not([type=hidden]), select, textarea');
          for (var i = 0; i < rest.length; i++) {
            var el = rest[i];
            if (el.value || el.disabled || el.readOnly || el.hidden) continue;
            // Not on screen: the agent form keeps an organization field in a
            // display:none block until "Agency" is picked. focus() on one of
            // those is a no-op, so it would silently swallow the jump.
            if (!el.getClientRects().length) continue;
            // Node.DOCUMENT_POSITION_FOLLOWING, el comes after the anchor.
            if (anchor && !(anchor.compareDocumentPosition(el) & 4)) continue;
            el.focus();
            break;
          }
        } catch (e) { /* typing still works */ }
      }
    });

    google.accounts.id.renderButton(document.getElementById('gsiBtn'),
      { theme: 'outline', size: 'large', text: 'continue_with',
        shape: 'pill', width: 280 });
    box.hidden = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
