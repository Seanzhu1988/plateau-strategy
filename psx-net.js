/* One network call, and it never throws.
 *
 * Reported as "the website had stall messages sometimes". The shape that
 * causes it was on 73 call sites across twelve pages:
 *
 *     msg.textContent = 'Enrolling…';
 *     const j = await (await fetch('/api/…', {…})).json();
 *     if (!j.ok) { msg.textContent = j.error; return; }
 *
 * That reads as if it handles failure, and it handles exactly one kind: the
 * server answering properly with {ok:false}. Two commoner kinds kill it:
 *
 *   1. fetch() itself rejects, phone in a lift, wifi dropped, DNS blip.
 *   2. The reply is not JSON, so .json() throws on the body. A 500 error
 *      page, a proxy timeout page, or Render restarting mid-deploy all
 *      answer with HTML, and HTML is not JSON.
 *
 * Either way the promise rejects, everything after that line never runs, and
 * "Enrolling…" sits on the screen until the visitor gives up and leaves. They
 * cannot tell that from the request still being in flight. Nothing in the
 * interface ever says otherwise, and nothing retries.
 *
 * So: return the failure instead of throwing it. Half the call sites already
 * check j.ok and print j.error, so an {ok:false, error:"…"} object flows into
 * the error path the page already has. The rest at least keep running instead
 * of dying mid-handler.
 *
 * The error strings say what a person can do about it, because "TypeError:
 * Failed to fetch" tells a traveller nothing.
 */
(function (w) {
  "use strict";

  function fail(msg) { return { ok: false, error: msg }; }

  w.psxJSON = async function psxJSON(url, opts) {
    var r;
    try {
      r = await fetch(url, opts);
    } catch (e) {
      // Never reached the server at all.
      return fail("No connection. Check your network and try again.");
    }

    var text;
    try {
      text = await r.text();
    } catch (e) {
      return fail("The connection dropped partway through. Please try again.");
    }

    var j = null;
    if (text) {
      try { j = JSON.parse(text); } catch (e) { j = null; }
    }

    if (j === null) {
      // Answered, but not with JSON. Almost always an error page.
      return fail(r.ok
        ? "The server sent something unexpected. Please try again."
        : "The server is having trouble (" + r.status + "). Please try again in a moment.");
    }

    // A list is a valid reply in its own right, the discoveries feed and the
    // destination list both return one. Only wrap it if the status was bad.
    if (Array.isArray(j)) return r.ok ? j : fail("The server is having trouble (" + r.status + ").");

    if (typeof j === "object" && !("ok" in j) && !r.ok) j.ok = false;
    return j;
  };

  /* For the handful of places that want the raw Response, a file download,
   * a HEAD check, without the throw. Returns null instead. */
  w.psxFetch = async function psxFetch(url, opts) {
    try { return await fetch(url, opts); } catch (e) { return null; }
  };

  /* Restore a swept opt-out.
   *
   * "Do not count this device" is a cookie, and privacy tools sweep cookies, 
   * psx_nocount looks exactly like a tracker because structurally it is one.
   * When it goes, the device silently starts counting again and there is no
   * symptom; the visitor numbers just drift up. /not-a-traveler leaves a copy
   * of the preference in localStorage, which those tools usually spare, and
   * this puts the cookie back.
   *
   * It has to live here rather than on that page, because a preference that
   * only repairs itself when you happen to revisit the page that set it is
   * not much of a repair.
   *
   * The cookie is httponly, so this cannot write it directly and asks the
   * server instead. One page view is counted before the repair lands, the
   * request is already finished by the time this runs. One is not forever.
   *
   * Only ever restores the opt-OUT. The same trick used to respawn a cleared
   * tracking cookie is a dark pattern; this respawns a cleared refusal. It
   * never resurrects consent, and "Count this device again" clears the backup
   * too, so turning it off stays off. */
  try {
    if (localStorage.getItem('psx_nocount_pref') === '1'
        && !/(^|;\s*)psx_nocount=/.test(document.cookie)) {
      fetch('/api/traffic/optout', { credentials: 'same-origin' }).catch(function () {});
    }
  } catch (e) { /* storage blocked, or a sandboxed frame, the cookie stands alone */ }
})(window);
