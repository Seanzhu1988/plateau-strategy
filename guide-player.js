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

    // src is the English recording from the registry, and may be absent.
    // slug is what the per-language recording is found by.
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
        function english() {
            if (!src) return quiet();
            exists(src).then(function (ok) {
                if (ok) start(src, b, quiet);
                else quiet();
            });
        }
        if (l !== "en" && slug) {
            var mine = "/media/audio/guide-" + slug + "." + l + ".mp3";
            exists(mine).then(function (ok) {
                if (ok) start(mine, b, english);
                else english();
            });
        } else {
            english();
        }
    };
})();
