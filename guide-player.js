/* The spoken guide, in the reader's own language.
 *
 * Four sources, tried in order, so a guide is never silent:
 *   1. a recorded narration in the reader's language, guide-<slug>.<lang>.mp3
 *   2. the script in the reader's language, read aloud by the device
 *   3. the recorded English narration, guide-<slug>.mp3
 *   4. the English script, read aloud
 *
 * The order is deliberate: the right language beats the better recording.
 * A reader who set the site to Japanese wants Japanese, and a studio voice
 * speaking English at them is not a better answer than their own phone
 * speaking Japanese. Recording every guide in every language costs studio
 * time we have not spent, but every phone already carries speech voices in a
 * dozen languages, so the guide speaks the day a script is translated and a
 * recording simply takes its place later, quietly, with no change here.
 *
 * One guide plays at a time, whichever source it came from.
 */
(function () {
    var LANG_KEY = "ps_lang";
    var VOICE_KEY = "ps_guide_voice";
    var el = null;          // the current Audio, if any
    var speaking = false;   // or the device is reading
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
        if (speaking) { try { window.speechSynthesis.cancel(); } catch (e) {} speaking = false; }
        face(btn, false);
        btn = null;
    }
    window.stopGuide = stop;

    // Device voices load asynchronously in most browsers, so the first call
    // can legitimately return an empty list. Ask again once they arrive.
    var voicesReady = false;
    function voices() {
        try { return window.speechSynthesis.getVoices() || []; } catch (e) { return []; }
    }
    try {
        window.speechSynthesis.onvoiceschanged = function () { voicesReady = true; };
        voices();
    } catch (e) {}

    function voicesFor(l) {
        var want = (l || "en").toLowerCase().split("-")[0];
        return voices().filter(function (v) {
            return (v.lang || "").toLowerCase().split("-")[0] === want;
        });
    }
    window.guideVoices = voicesFor;

    function chosen(l) {
        var list = voicesFor(l);
        if (!list.length) return null;
        var saved = null;
        try { saved = localStorage.getItem(VOICE_KEY + "." + l); } catch (e) {}
        for (var i = 0; i < list.length; i++) if (list[i].name === saved) return list[i];
        // No preference yet. Prefer a local voice over a network one: it starts
        // instantly and it still works on a train with no signal.
        for (var j = 0; j < list.length; j++) if (list[j].localService) return list[j];
        return list[0];
    }
    window.setGuideVoice = function (l, name) {
        try { localStorage.setItem(VOICE_KEY + "." + l, name); } catch (e) {}
    };

    function speak(text, l, b) {
        if (!text || !window.speechSynthesis) return false;
        var u = new SpeechSynthesisUtterance(text);
        var v = chosen(l);
        if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = l; }
        u.rate = 0.95;      // a guide, not a newsreader
        u.onend = function () { speaking = false; face(b, false); };
        u.onerror = function () { speaking = false; face(b, false); };
        try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
        catch (e) { return false; }
        speaking = true;
        face(b, true);
        return true;
    }

    // Whether a recording is actually there. This is a HEAD request rather
    // than a hopeful play() because play() on a missing file resolves first
    // and errors afterwards, so a 404 read as success and the button sat
    // showing pause over silence. Asking first is unambiguous.
    function exists(url) {
        return fetch(url, { method: "HEAD" }).then(function (r) { return r.ok; })
                                             .catch(function () { return false; });
    }
    function start(src, b, onFail) {
        // Once, and only once. Both the error event and the rejected promise
        // can fire for the same failure, and a play that has already begun
        // must never fall through to the spoken script: that put a recorded
        // voice and a synthetic one on top of each other.
        var done = false;
        function fail() { if (!done) { done = true; onFail(); } }
        var a = new Audio(src);
        a.onerror = fail;
        a.onended = function () { el = null; face(b, false); };
        a.play().then(function () { done = true; el = a; face(b, true); })
                .catch(fail);
    }

    // src is the English recording from the registry, and may be absent.
    // slug is what every other source is found by.
    window.playGuide = function (b, src, key, slug) {
        var same = (btn === b) && (el || speaking);
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
        // want: only speak if the script comes back in this language.
        // Asking for Japanese and getting the English fallback means we have
        // no Japanese script, and a device voice reading English words with
        // Japanese phonetics sounds like a fault, so hand on to the English
        // recording instead.
        function readAloud(want, next) {
            fetch("/api/guide-script/" + encodeURIComponent(slug) + "?lang=" + encodeURIComponent(want))
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(function (d) {
                    if (!d || !d.text || (want && d.lang !== want)) return next();
                    if (!speak(d.text, d.lang, b)) next();
                })
                .catch(next);
        }
        function english() {
            if (!src) return readAloud("en", quiet);
            exists(src).then(function (ok) {
                if (ok) start(src, b, function () { readAloud("en", quiet); });
                else readAloud("en", quiet);
            });
        }
        if (l !== "en" && slug) {
            var mine = "/media/audio/guide-" + slug + "." + l + ".mp3";
            exists(mine).then(function (ok) {
                if (ok) start(mine, b, function () { readAloud(l, english); });
                else readAloud(l, english);
            });
        } else {
            english();
        }
    };
})();
