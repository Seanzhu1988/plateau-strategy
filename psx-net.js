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
 *   1. fetch() itself rejects — phone in a lift, wifi dropped, DNS blip.
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

    // A list is a valid reply in its own right — the discoveries feed and the
    // destination list both return one. Only wrap it if the status was bad.
    if (Array.isArray(j)) return r.ok ? j : fail("The server is having trouble (" + r.status + ").");

    if (typeof j === "object" && !("ok" in j) && !r.ok) j.ok = false;
    return j;
  };

  /* For the handful of places that want the raw Response — a file download,
   * a HEAD check — without the throw. Returns null instead. */
  w.psxFetch = async function psxFetch(url, opts) {
    try { return await fetch(url, opts); } catch (e) { return null; }
  };
})(window);
