/* The spoken guide: Jason's recording, or silence.
 *
 * This player used to carry four fallbacks, two of them the device's own
 * speech engine reading the script aloud. Sean heard that robot in the
 * Destination Book and called it what it was: embarrassing. The law now is
 * simple, and it is his sentence: either Jason or no guide voices.
 *
 *   1. a recorded narration in the reader's language, guide-<slug>.<lang>.mp3
 *   2. the recorded English narration, guide-<slug>.mp3
 *   3. nothing. The Listen button only renders where a recording exists,
 *      so silence here means a stale link, not a dead end a reader sees.
 *
 * The demand beacon stays: every tap is a vote telling us which guide to
 * record next, and in which language.
 *
 * One guide plays at a time.
 */
(function () {
    var LANG_KEY = "ps_lang";
    var el = null;          // the current Audio, if any
    var btn = null;

    function lang() {
        try { return localStorage.getItem(LANG_KEY) || "en"; } catch (e) { return "en"; }
    }
    function face(b, on) {
        if (!b) return;
        b.innerHTML = on ? b.innerHTML.replace("▶", "❚❚")
                         : b.innerHTML.replace("❚❚", "▶");
    }
    function stop() {
        if (el) { try { el.pause(); } catch (e) {} el = null; }
        face(btn, false);
        btn = null;
    }
    window.stopGuide = stop;

    /* The device-voice picker is gone with the device voice; these stubs
       keep any page that still calls them from throwing. */
    window.guideVoices = function () { return []; };
    window.setGuideVoice = function () {};

    // Whether a recording is actually there. A HEAD request rather than a
    // hopeful play(), because play() on a missing file resolves first and
    // errors afterwards, so a 404 read as success and the button sat
    // showing pause over silence.
    function exists(url) {
        return fetch(url, { method: "HEAD" }).then(function (r) { return r.ok; })
                                             .catch(function () { return false; });
    }
    function start(src, b, onFail) {
        var done = false;
        function fail() { if (!done) { done = true; onFail(); } }
        var a = new Audio(src);
        a.onerror = fail;
        a.onended = function () { el = null; face(b, false); };
        a.play().then(function () { done = true; el = a; face(b, true); })
                .catch(fail);
    }

    // WHICH FILE TO PLAY IS DECIDED BEFORE THE TAP, NEVER DURING IT.
    //
    // This used to check the file existed with fetch and then call play() in the
    // callback. On a desktop that is fine. On a phone it is silence: iOS and
    // Android only allow audio to start from a handler that calls play()
    // SYNCHRONOUSLY, and awaiting a network round trip spends the permission the
    // tap granted. play() is then rejected, the failure path tried the English
    // file the same way and was rejected again, and the button did nothing at
    // all. WeChat's browser is stricter still. [SEAN "i used the cellphone and
    // the audio didnt work"]
    //
    // So the language check happens once, in the background, and the answer is
    // stamped on the button. The tap itself does nothing but play.
    var resolved = {};                    // url asked for -> url to actually play

    function pick(b, src, slug, l) {
        var k = (slug || "") + "|" + l;
        if (resolved[k] !== undefined) return Promise.resolve(resolved[k]);
        if (l === "en" || !slug) { resolved[k] = src || null; return Promise.resolve(resolved[k]); }
        var mine = "/media/audio/guide-" + slug + "." + l + ".mp3";
        return exists(mine).then(function (ok) {
            resolved[k] = ok ? mine : (src || null);
            return resolved[k];
        }).catch(function () { resolved[k] = src || null; return resolved[k]; });
    }

    window.playGuide = function (b, src, key, slug) {
        var same = (btn === b) && el;
        stop();
        if (same) return;                 // second tap on the same button stops it
        btn = b;
        var l = lang();
        slug = slug || key;

        try {
            fetch("/api/guide-demand/beacon", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kind: "audio", key: key, lang: l })
            });
        } catch (e) {}

        function quiet() { face(b, false); btn = null; }

        // Already know the answer: play right now, inside the tap.
        var k = (slug || "") + "|" + l;
        if (resolved[k] !== undefined) {
            if (!resolved[k]) return quiet();
            return start(resolved[k], b, quiet);
        }
        // First tap for this language: play the English immediately so the tap
        // is never wasted, and learn the better file for next time.
        if (src) start(src, b, quiet); else face(b, true);
        pick(b, src, slug, l);
    };

    // Warm the answer for whatever is on screen, so the FIRST tap is already
    // right rather than the second.
    window.warmGuides = function () {
        var l = lang();
        if (l === "en") return;
        [].forEach.call(document.querySelectorAll("[data-guide-slug]"), function (n) {
            pick(null, n.getAttribute("data-guide-src") || "", n.getAttribute("data-guide-slug"), l);
        });
    };
})();
