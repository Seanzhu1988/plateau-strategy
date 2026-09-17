/* THE STANDARD AUDIO PLAYER.
 *
 * [SEAN 2026-09-16, a sketch on paper: a pill with play, the time, a seek
 * line, volume and a globe; the globe opens a list of languages, each with
 * the guide who reads it, "English - Yiki or Jason whoever, Chinese -
 * Haoran, Spanish - etc." Then: "do this now and it became standard, no
 * download is allowed".]
 *
 * WHY ONE FILE. Every page that played audio showed the browser's own
 * control, which looks different in every browser, never says who is
 * speaking or in what language, and on Chrome carries a menu with Download
 * in it. This file replaces every <audio controls> on a page with the same
 * pill, and the server injects it into any page that has one, so a page
 * built next month gets it without anyone remembering.
 *
 * WHAT IT DOES NOT TOUCH. The page keeps its own <audio> element and all of
 * its own logic: which file to play, resuming a position, pausing one
 * player when another starts. The pill only drives that element. That is
 * deliberate, because the choosing of recordings is pinned byte for byte by
 * test_tour_photo_audio_integrity.cjs and has been paid for in bugs.
 *
 * THE LANGUAGE LIST comes from the recording ledger, not from a guess:
 * guide-x.mp3 is English, guide-x.zh.mp3 is Chinese, and the ledger row's
 * voice is turned into a name by /api/guide-voices, except on rows the
 * ledger marks adopted, whose voice was guessed, which name nobody. A language with no
 * recording is not offered. Choosing one plays that file; the page's own
 * language is left alone.
 *
 * NO DOWNLOAD, honestly stated. The native control and its Download item are
 * gone, the right-click menu on the player is gone, and /media refuses to
 * open an audio file as a page of its own. A person with the browser's
 * developer tools can still save what their browser is playing; no website
 * can stop that, and this file does not pretend to.
 */
(function () {
    "use strict";
    if (window.PSXAudio) return;

    var LANGS = [["en", "English"], ["zh", "中文"], ["es", "Español"], ["ko", "한국어"],
                 ["vi", "Tiếng Việt"], ["ja", "日本語"], ["fr", "Français"],
                 ["de", "Deutsch"], ["pt", "Português"]];

    function T(en) { return (window.psxT && window.psxT(en)) || en; }

    var ledgerP = null, voicesP = null;
    function ledger() {
        return ledgerP || (ledgerP = fetch("/media/audio/_recorded.json")
            .then(function (r) { return r.ok ? r.json() : {}; })
            .catch(function () { return {}; }));
    }
    function voices() {
        return voicesP || (voicesP = fetch("/api/guide-voices")
            .then(function (r) { return r.ok ? r.json() : {}; })
            .then(function (d) { return (d && d.names) || {}; })
            .catch(function () { return {}; }));
    }

    /* "/media/audio/guide-x.zh.mp3?v=1" -> dir, base "guide-x", lang "zh", ext */
    function parse(src) {
        var path = String(src || "").split("#")[0].split("?")[0];
        try { path = new URL(path, location.href).pathname; } catch (e) {}
        var m = path.match(/^(.*\/)([^\/]+?)(?:\.([a-z]{2}))?\.(mp3|m4a|ogg|wav)$/i);
        if (!m) return null;
        return { dir: m[1], base: m[2], lang: (m[3] || "en").toLowerCase(), ext: m[4] };
    }
    function srcOf(a) {
        var s = a.currentSrc || a.getAttribute("src") || "";
        if (!s) { var so = a.querySelector("source[src]"); if (so) s = so.getAttribute("src"); }
        return s;
    }
    function clock(t) {
        if (!isFinite(t) || t < 0) return "--:--";
        t = Math.floor(t);
        var h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
        var ss = (s < 10 ? "0" : "") + s;
        return h ? h + ":" + (m < 10 ? "0" : "") + m + ":" + ss : m + ":" + ss;
    }

    var ICON = {
        play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
        pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>',
        vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
        muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
        globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5M12 3.5C9.4 5.9 8.1 8.7 8.1 12s1.3 6.1 3.9 8.5"/></g></svg>'
    };

    /* modern.css and paper.css restyle EVERY button on the site with
       !important (a green underline, no padding). A :not(#id) carries id
       weight, which outranks their long chains of class-weight :not()s, so
       these controls keep their own shape without an arms race. */
    var B = ".psxa button.psxa-b:not(#psxa-none)";
    var CSS = [
        ".psxa{position:relative;flex:1 1 auto;min-width:0;width:100%;max-width:min(34rem,100%);box-sizing:border-box;margin:.35rem 0 .6rem;font-family:inherit;color:#12305b;}",
        ".psxa-who{font-size:.8rem;font-weight:700;letter-spacing:.02em;margin:0 0 .25rem .9rem;color:#12305b;}",
        ".psxa-pill{display:flex;align-items:center;gap:.4rem;border:1.5px solid #12305b;border-radius:999px;background:#fff;padding:.2rem .45rem .2rem .3rem;}",
        B + "{display:inline-flex;align-items:center;justify-content:center;flex:none;width:2.2rem;height:2.2rem;margin:0;padding:0 !important;border:0 !important;border-radius:999px !important;background:transparent !important;color:#12305b !important;cursor:pointer;box-shadow:none !important;}",
        B + ":hover{color:#0b1f3d !important;background:transparent !important;}",
        B + ":focus-visible{outline:2px solid #12305b;outline-offset:1px;}",
        B + " svg{width:1.35rem;height:1.35rem;display:block;}",
        ".psxa .psxa-play:not(#psxa-none) svg{width:1.55rem;height:1.55rem;}",
        ".psxa-time{flex:none;font-size:.82rem;font-variant-numeric:tabular-nums;color:#12305b;white-space:nowrap;}",
        ".psxa input[type=range]{accent-color:#12305b;margin:0;background:transparent;}",
        ".psxa-seek{flex:1 1 auto;min-width:3rem;}",
        ".psxa-volr{flex:none;width:4.5rem;display:none;}",
        "@media (hover:hover) and (pointer:fine){.psxa.can-vol .psxa-volr{display:block;}}",
        ".psxa-menu{position:absolute;right:0;top:calc(100% + .35rem);z-index:40;min-width:min(14rem,calc(100vw - 2rem));max-width:calc(100vw - 2rem);background:#fff;border:1.5px solid #12305b;border-radius:12px;padding:.45rem 0;box-shadow:0 12px 30px -14px rgba(18,48,91,.35);}",
        ".psxa-menu[hidden]{display:none;}",
        ".psxa-menu-h{font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#6b655b;padding:.15rem .9rem .35rem;}",
        ".psxa .psxa-opt:not(#psxa-none){display:flex;width:100%;justify-content:space-between;gap:1rem;align-items:baseline;padding:.45rem .9rem !important;border:0 !important;border-radius:0 !important;background:transparent !important;color:#12305b !important;font-weight:500 !important;font-size:.92rem;text-align:left;cursor:pointer;box-shadow:none !important;}",
        ".psxa .psxa-opt[aria-checked=true]:not(#psxa-none){font-weight:750 !important;}",
        ".psxa .psxa-opt[aria-checked=true]:not(#psxa-none) .psxa-lang::before{content:'\\2713  ';}",
        ".psxa-by{font-size:.82rem;color:#6b655b;}",
        ".psxa .psxa-menu-note{font-size:.78rem;color:#6b655b !important;margin:.35rem 0 .1rem !important;padding:0 .9rem !important;line-height:1.45;}",
        "@media (max-width:420px){.psxa-time{font-size:.75rem;}.psxa-pill{gap:.15rem;}.psxa-seek{min-width:2rem;}}",
        /* A page's own "Listen:" caption sat beside the pill and pushed its globe
           off a phone screen. The guide's name above the pill says the same thing. */
        ".tw-guideplay:has(.psxa)>span:first-child,.nm-guide:has(.psxa)>span:first-child{display:none;}"
    ].join("\n");
    function injectCss() {
        if (document.getElementById("psxa-css")) return;
        var st = document.createElement("style");
        st.id = "psxa-css"; st.textContent = CSS;
        (document.head || document.documentElement).appendChild(st);
    }

    var VOL_SETTABLE = (function () {
        try { var a = document.createElement("audio"); a.volume = 0.5; return Math.abs(a.volume - 0.5) < 0.01; }
        catch (e) { return false; }
    })();

    var players = [];

    function enhance(a) {
        if (!a || a.__psxa) return null;
        a.__psxa = true;
        injectCss();
        a.controls = false;
        a.removeAttribute("controls");
        a.setAttribute("controlsList", "nodownload noplaybackrate");
        a.addEventListener("contextmenu", function (e) { e.preventDefault(); });

        var root = document.createElement("div");
        /* i18n-skip: the page's translation engine records any text written
           after its pack loads as if it were English, and would then hand
           the wrong language back on the next switch. The player writes its
           own labels in the reader's language and repaints them on psx:lang. */
        root.className = "psxa i18n-skip" + (VOL_SETTABLE ? " can-vol" : "");
        root.setAttribute("role", "group");
        root.addEventListener("contextmenu", function (e) { e.preventDefault(); });
        root.innerHTML =
            '<div class="psxa-who" hidden></div>' +
            '<div class="psxa-pill">' +
              '<button type="button" class="psxa-b psxa-play">' + ICON.play + '</button>' +
              '<span class="psxa-time">0:00 / --:--</span>' +
              '<input class="psxa-seek" type="range" min="0" max="1000" step="1" value="0">' +
              '<button type="button" class="psxa-b psxa-mute">' + ICON.vol + '</button>' +
              '<input class="psxa-volr" type="range" min="0" max="100" step="1" value="100">' +
              '<button type="button" class="psxa-b psxa-globe" aria-haspopup="true" aria-expanded="false">' + ICON.globe + '</button>' +
            '</div>' +
            '<div class="psxa-menu" role="menu" hidden></div>';
        a.parentNode.insertBefore(root, a.nextSibling);

        var q = function (c) { return root.querySelector(c); };
        var who = q(".psxa-who"), play = q(".psxa-play"), time = q(".psxa-time"),
            seek = q(".psxa-seek"), mute = q(".psxa-mute"), volr = q(".psxa-volr"),
            globe = q(".psxa-globe"), menu = q(".psxa-menu");
        var dragging = false, tracks = [], known = "";

        function labels() {
            root.setAttribute("aria-label", T("Audio player"));
            play.setAttribute("aria-label", a.paused ? T("Play") : T("Pause"));
            mute.setAttribute("aria-label", a.muted ? T("Unmute") : T("Mute"));
            seek.setAttribute("aria-label", T("Position in the recording"));
            volr.setAttribute("aria-label", T("Volume"));
            globe.setAttribute("aria-label", T("Language of the recording"));
        }
        function paintState() {
            play.innerHTML = a.paused ? ICON.play : ICON.pause;
            mute.innerHTML = a.muted || a.volume === 0 ? ICON.muted : ICON.vol;
            if (VOL_SETTABLE) volr.value = String(Math.round((a.muted ? 0 : a.volume) * 100));
            labels();
        }
        function paintTime() {
            var d = a.duration;
            time.textContent = clock(a.currentTime || 0) + " / " + clock(d);
            if (!dragging) seek.value = (isFinite(d) && d > 0) ? String(Math.round(a.currentTime / d * 1000)) : "0";
        }
        function paintMenu() {
            var cur = parse(srcOf(a));
            var html = '<div class="psxa-menu-h"></div>';
            tracks.forEach(function (t, i) {
                html += '<button type="button" role="menuitemradio" class="psxa-opt" data-i="' + i + '" aria-checked="' +
                        (cur && t.lang === cur.lang ? "true" : "false") + '"><span class="psxa-lang"></span><span class="psxa-by"></span></button>';
            });
            html += '<p class="psxa-menu-note" hidden></p>';
            menu.innerHTML = html;
            menu.querySelector(".psxa-menu-h").textContent = T("Language");
            var opts = menu.querySelectorAll(".psxa-opt");
            tracks.forEach(function (t, i) {
                opts[i].querySelector(".psxa-lang").textContent = t.label;
                opts[i].querySelector(".psxa-by").textContent = t.who;
            });
            if (tracks.length < 2) {
                var n = menu.querySelector(".psxa-menu-note");
                n.textContent = T("Other languages are not recorded yet."); n.hidden = false;
            }
        }
        function paintWho() {
            var cur = parse(srcOf(a)), t = null;
            tracks.forEach(function (x) { if (cur && x.lang === cur.lang) t = x; });
            who.textContent = t && t.who ? t.who : "";
            who.hidden = !who.textContent;
        }
        function refreshTracks() {
            var s = srcOf(a);
            if (s === known) return;
            known = s;
            var p = parse(s);
            if (!p) { tracks = []; paintWho(); paintMenu(); return; }
            Promise.all([ledger(), voices()]).then(function (res) {
                if (srcOf(a) !== s) return;               // the page moved on meanwhile
                var led = res[0] || {}, names = res[1] || {};
                tracks = [];
                LANGS.forEach(function (l) {
                    var file = p.base + (l[0] === "en" ? "" : "." + l[0]) + "." + p.ext;
                    var row = led[file];
                    if (!row && l[0] !== p.lang) return;
                    var url = l[0] === p.lang ? s
                        : p.dir + file + (row && row.sig ? "?v=" + encodeURIComponent(row.sig) : "");
                    /* An "adopted" ledger row is a recording found on disk and stamped
                       with whatever voice was current at the time, which the
                       voice script itself calls a guess (security-parameter-jason
                       is Jason and is stamped Yiki). A wrong name is worse than
                       none, so a guessed row names nobody. */
                    tracks.push({ lang: l[0], label: l[1], src: url,
                                  who: (row && !row.adopted && names[row.voice]) || "" });
                });
                paintWho(); paintMenu();
            });
        }
        function closeMenu() { menu.hidden = true; globe.setAttribute("aria-expanded", "false"); }

        play.addEventListener("click", function () {
            closeMenu();
            if (a.paused) { var pr = a.play(); if (pr && pr.catch) pr.catch(function () {}); }
            else a.pause();
        });
        mute.addEventListener("click", function () {
            if (a.muted || a.volume === 0) { a.muted = false; if (a.volume === 0 && VOL_SETTABLE) a.volume = 1; }
            else a.muted = true;
        });
        volr.addEventListener("input", function () {
            if (!VOL_SETTABLE) return;
            a.volume = Number(volr.value) / 100; a.muted = a.volume === 0;
        });
        seek.addEventListener("input", function () {
            dragging = true;
            var d = a.duration;
            if (isFinite(d) && d > 0) time.textContent = clock(Number(seek.value) / 1000 * d) + " / " + clock(d);
        });
        seek.addEventListener("change", function () {
            var d = a.duration;
            if (isFinite(d) && d > 0) { try { a.currentTime = Number(seek.value) / 1000 * d; } catch (e) {} }
            dragging = false; paintTime();
        });
        globe.addEventListener("click", function (e) {
            e.stopPropagation();
            refreshTracks();
            var open = menu.hidden;
            menu.hidden = !open;
            globe.setAttribute("aria-expanded", open ? "true" : "false");
            if (open) { var f = menu.querySelector(".psxa-opt[aria-checked=true]") || menu.querySelector(".psxa-opt"); if (f) f.focus(); }
        });
        menu.addEventListener("click", function (e) {
            var b = e.target.closest(".psxa-opt"); if (!b) return;
            var t = tracks[Number(b.getAttribute("data-i"))];
            closeMenu();
            if (!t) return;
            var cur = parse(srcOf(a));
            if (cur && cur.lang === t.lang) return;
            /* The tap is the permission to start sound on a phone, so play()
               is called right here, in the same handler, never after a wait. */
            [].forEach.call(a.querySelectorAll("source"), function (so) { so.parentNode.removeChild(so); });
            a.setAttribute("src", t.src);
            var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
        });
        root.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !menu.hidden) { closeMenu(); globe.focus(); }
        });
        /* One document listener per player. The gallery makes a new player each
           time an artwork opens and throws the old one away, so a player that
           has left the page removes its own listener the next time it fires. */
        function outside(e) {
            if (!root.isConnected) { document.removeEventListener("click", outside); return; }
            if (!root.contains(e.target)) closeMenu();
        }
        document.addEventListener("click", outside);

        ["play", "pause", "ended", "volumechange"].forEach(function (ev) { a.addEventListener(ev, paintState); });
        ["timeupdate", "durationchange", "loadedmetadata", "emptied", "seeked"].forEach(function (ev) { a.addEventListener(ev, paintTime); });
        ["loadstart", "emptied", "loadedmetadata"].forEach(function (ev) { a.addEventListener(ev, refreshTracks); });
        new MutationObserver(function () { refreshTracks(); paintTime(); }).observe(a, { attributes: true, attributeFilter: ["src"], childList: true });

        var p = { audio: a, root: root, repaint: function () { paintState(); paintTime(); paintMenu(); paintWho(); } };
        players.push(p);
        paintState(); paintTime(); refreshTracks();
        return p;
    }

    function scan(node) {
        if (!node || node.nodeType !== 1) return;
        if (node.tagName === "AUDIO" && node.hasAttribute("controls")) { enhance(node); return; }
        if (node.querySelectorAll) [].forEach.call(node.querySelectorAll("audio[controls]"), enhance);
    }

    document.addEventListener("psx:lang", function () {
        for (var i = players.length - 1; i >= 0; i--) {
            if (!players[i].root.isConnected) players.splice(i, 1); else players[i].repaint();
        }
    });

    function boot() {
        scan(document.body);
        new MutationObserver(function (muts) {
            muts.forEach(function (m) {
                [].forEach.call(m.addedNodes, scan);
                if (m.type === "attributes" && m.target.tagName === "AUDIO") scan(m.target);
            });
        }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["controls"] });
    }
    if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);

    window.PSXAudio = { enhance: enhance, players: players };
})();
