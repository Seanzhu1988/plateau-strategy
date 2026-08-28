/* One click on the site's icon puts the site on the phone. [SEAN "the icon of
 * the site i want to make a change of it, one click it will form a add to
 * screen"]
 *
 * The honest mechanics, which differ by phone and cannot be papered over:
 *
 *   Android and desktop Chrome or Edge fire a beforeinstallprompt event the
 *   page may stash and replay later. So there the click on the logo really is
 *   one click: the browser's own Install sheet opens.
 *
 *   Apple allows no such thing. No site on iOS can open the Add to Home
 *   Screen sheet by itself; only the person can, from the Share menu. So on
 *   an iPhone the click shows the two taps that do it, drawn plainly, rather
 *   than pretending. A fake install button that does nothing on half the
 *   world's phones would be worse than none.
 *
 *   Already installed and running from the home screen: the click stays
 *   quiet, because offering to install what is already installed reads as a
 *   broken site.
 */
(function () {
    "use strict";

    // modern.css flattens every button behind a selector eight :not() clauses
    // deep, marked !important, and an inline style LOSES to a stylesheet
    // !important. Ids outrank the clause pile, so the three buttons this file
    // creates get their look from one injected sheet. Eighth encounter with
    // this rule; the pattern is always ids, never classes, never inline.
    (function css() {
        if (document.getElementById("psxInstallCss")) return;
        var st = document.createElement("style");
        st.id = "psxInstallCss";
        st.textContent =
            "#psxShare, #psxInstallYes, #psxInstallClose {" +
            "  font: inherit !important; font-weight: 700 !important;" +
            "  border-radius: 999px !important; text-decoration: none !important;" +
            "  cursor: pointer !important; min-height: 0 !important; min-width: 0 !important;" +
            "  display: inline-flex !important; align-items: center; gap: .3rem; }" +
            "#psxShare { font-size: .82rem !important; border: 1px solid #d3d3da !important;" +
            "  background: #fff !important; color: #1f3a5f !important;" +
            "  padding: .28rem .75rem !important; margin-left: .6rem; vertical-align: middle; }" +
            "#psxInstallYes { border: 0 !important; background: #1f3a5f !important;" +
            "  color: #fff !important; padding: .4rem 1.1rem !important; margin-right: .5rem; }" +
            "#psxInstallClose { border: 1px solid #d3d3da !important; background: #fff !important;" +
            "  color: #1f3a5f !important; padding: .4rem 1rem !important; }";
        document.head.appendChild(st);
    })();

    var stash = null;                    // the browser's install offer, held for the click

    window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();              // hold it for the logo click instead of
        stash = e;                       // whenever the browser felt like it
        mark();
    });

    // The service worker is a precondition of installability on Chrome, and
    // the walk pages already registered this same file for offline shells.
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch(function () {});
    }

    function standalone() {
        return window.matchMedia("(display-mode: standalone)").matches
            || window.navigator.standalone === true;   // older iOS spells it this way
    }
    function onIOS() {
        var ua = navigator.userAgent;
        return /iPhone|iPad|iPod/.test(ua)
            || (ua.indexOf("Mac") > -1 && navigator.maxTouchPoints > 1);  // iPadOS says Mac
    }

    // The logo is a bare <img> in the header on most pages; the landing page
    // wraps it in its own clickable box. Take the box where there is one, the
    // same rule logo-reset.js used when it owned this tap before [SEAN]
    // reassigned it to add-to-home-screen.
    function logos() {
        var out = [];
        var box = document.querySelector(".logo");
        if (box) out.push(box);
        var header = document.querySelector("header");
        if (header) {
            var img = header.querySelector("img");
            if (img && !(box && box.contains(img))) out.push(img);
        }
        return out;
    }
    function mark() {
        if (standalone()) return;
        logos().forEach(function (el) {
            el.style.cursor = "pointer";
            el.setAttribute("title", "Add this site to your home screen");
            el.setAttribute("aria-label", "Add this site to your home screen");
            el.setAttribute("role", "button");
            if (el.tabIndex < 0) el.tabIndex = 0;
        });
    }

    function sheet(html, opts) {
        opts = opts || {};
        var old = document.getElementById("psxInstallSheet");
        if (old) old.remove();                       // one sheet at a time
        var host = document.createElement("div");
        host.id = "psxInstallSheet";
        host.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(11,8,9,.45);" +
            "display:flex;align-items:flex-end;justify-content:center;";
        var yes = opts.onYes
            ? '<button id="psxInstallYes" style="font:inherit;font-weight:700;border:0;' +
              'border-radius:999px;background:#1f3a5f;color:#fff;padding:.4rem 1.1rem;' +
              'cursor:pointer;margin-right:.5rem">' + (opts.yesLabel || "Yes, add it") + "</button>"
            : "";
        host.innerHTML =
            '<div style="background:#fff;color:#14110c;border-radius:14px 14px 0 0;' +
            'max-width:480px;width:100%;padding:1.1rem 1.2rem 1.4rem;font-size:.95rem;' +
            'line-height:1.55;box-shadow:0 -4px 24px rgba(11,8,9,.25)">' + html +
            '<div style="margin-top:.9rem;text-align:right">' + yes +
            '<button id="psxInstallClose" style="font:inherit;font-weight:700;border:1px solid #d3d3da;' +
            'border-radius:999px;background:#fff;color:#1f3a5f;padding:.4rem 1rem;cursor:pointer">' +
            (opts.closeLabel || "Close") + "</button>" +
            "</div></div>";
        host.addEventListener("click", function (e) {
            if (e.target === host || e.target.id === "psxInstallClose") host.remove();
            if (e.target.id === "psxInstallYes") { host.remove(); opts.onYes(); }
        });
        document.body.appendChild(host);
    }

    function clicked() {
        if (standalone()) return;                      // already on the home screen
        // The question comes first, in every branch. [SEAN "i want it to do
        // are you sure you want to add this on to your home screen?"] The
        // logo sits exactly where a thumb lands by accident, the same reason
        // its previous tenant, the reset, asked before acting. A tap on Yes
        // is itself a user gesture, so the browser's install prompt is still
        // allowed to fire from inside it.
        sheet("<b>Are you sure you want to add this to your home screen?</b><br>" +
              "<span style=\"color:#6b655b\">One tap on your home screen brings you " +
              "straight back here.</span>",
              { onYes: proceed, closeLabel: "Not now" });
    }

    function proceed() {
        if (stash) {                                   // the real one-click path
            var p = stash; stash = null;
            p.prompt();
            return;
        }
        if (onIOS()) {
            sheet('<b>Put this site on your home screen</b><br>' +
                  'Two taps in Safari:<br>' +
                  '1&#41; the <b>Share</b> button ' +
                  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" ' +
                  'stroke-width="2" style="vertical-align:-2px"><path d="M12 3v12M8 6l4-4 4 4"/>' +
                  '<rect x="4" y="9" width="16" height="12" rx="2"/></svg> ' +
                  'at the bottom of the screen<br>' +
                  '2&#41; then <b>Add to Home Screen</b>.<br>' +
                  '<span style="color:#6b655b">Apple does not let a website open that sheet ' +
                  'itself, so those two taps are yours.</span>');
            return;
        }
        // A browser that never offered the prompt: point at its own menu
        // rather than inventing a button that cannot work.
        sheet('<b>Put this site on your home screen</b><br>' +
              'In your browser&#39;s menu, choose <b>Install app</b> or ' +
              '<b>Add to Home screen</b>.');
    }

    // ---- the visible Share button -----------------------------------------
    // [SEAN "share this added to every single page, i believe apple share
    // button doesnt do anything because noone notice it, we want to put this
    // on the page"] He is right about the why: the share control in the
    // browser chrome is furniture nobody sees. Unlike install, Apple DOES let
    // a page open the share sheet itself, so this one is a real one tap. The
    // sheet it opens on iOS also contains Add to Home Screen, which quietly
    // gives iPhones a second road to the install ask above.
    function shareGlyph() {
        return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" ' +
               'stroke="currentColor" stroke-width="2" style="vertical-align:-2px">' +
               '<path d="M12 3v12M8 6l4-4 4 4"/><rect x="4" y="9" width="16" height="12" rx="2"/></svg>';
    }
    function toast(msg) {
        var t = document.createElement("div");
        t.textContent = msg;
        t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);" +
            "background:#14110c;color:#fff;font-size:.88rem;border-radius:999px;" +
            "padding:.45rem 1rem;z-index:9999;box-shadow:0 2px 10px rgba(11,8,9,.3)";
        document.body.appendChild(t);
        setTimeout(function () { t.remove(); }, 2200);
    }
    function share() {
        var payload = { title: document.title, url: location.href };
        if (navigator.share) {
            navigator.share(payload).catch(function () {});   // person closed the sheet
            return;
        }
        // No native sheet on this browser: the copied link IS the share.
        var done = function () { toast("Link copied. Send it to someone."); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(location.href).then(done, function () {});
        }
    }
    function plantShare() {
        var head = document.querySelector("header"); if (!head) return;
        if (document.getElementById("psxShare")) return;
        var b = document.createElement("button");
        b.id = "psxShare";
        b.innerHTML = shareGlyph() + " Share";
        b.title = "Share this page";
        b.style.cssText = "font:inherit;font-size:.82rem;font-weight:700;cursor:pointer;" +
            "border:1px solid #d3d3da;border-radius:999px;background:#fff;color:#1f3a5f;" +
            "padding:.28rem .75rem;margin-left:.6rem;display:inline-flex;align-items:center;" +
            "gap:.3rem;vertical-align:middle";
        b.addEventListener("click", share);
        var right = head.querySelector(".right");
        (right || head).appendChild(b);
    }

    function boot() {
        plantShare();
        mark();
        logos().forEach(function (el) {
            if (el.__installArmed) return;
            el.__installArmed = true;
            el.onclick = null;           // the landing page sends it home; the tap is ours now
            el.addEventListener("click", function (e) { e.preventDefault(); clicked(); });
            el.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); clicked(); }
            });
        });
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else { boot(); }
})();
