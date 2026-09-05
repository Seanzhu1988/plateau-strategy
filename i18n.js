/* Plateau Strategy Solution Lab -- site-wide line-by-line translation.
   Zero markup changes: walks text nodes + placeholders/titles keyed by English.
   Persists the reader's choice and re-translates dynamically-injected content. */
(function () {
  var DICT = {};   // kept for shape; the real strings arrive in a pack
  var LANGS = [["en", "English"], ["zh", "中文"], ["es", "Español"], ["ko", "한국어"], ["vi", "Tiếng Việt"], ["ja", "日本語"]];
  var KEY = "ps_lang";
  // ?lang=zh wins over the stored choice, and is then stored, so a
  // language-targeted ad lands on the page already in that language instead of
  // in English with a switcher the visitor has to find. Only a language we
  // actually ship is accepted, anything else falls through to the stored
  // preference, so a stray query string cannot blank the page.
  var cur = (function () {
    var m = /[?&]lang=([a-zA-Z-]{2,5})/.exec(location.search);
    var want = m ? m[1].toLowerCase() : null;
    if (want && LANGS.some(function (l) { return l[0] === want; })) {
      try { localStorage.setItem(KEY, want); } catch (e) {}
      return want;
    }
    return localStorage.getItem(KEY) || "en";
  })();
  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function tr(k) {
    if (cur === "en") return null;
    var p = PACKS[cur];
    return (p && p[k]) ? p[k] : null;
  }

  // Strings a page builds itself, "Open till 17:00 · ~60 min visit", can never
  // be looked up whole: the dictionary would need an entry for every possible
  // time and duration. So the PATTERN is what gets translated, and the values
  // are dropped in afterwards. Word order differs between languages, which is
  // exactly why the placeholders are named rather than positional.
  //
  //   psxFmt("Open till {time} · ~{mins} min visit", {time: "17:00", mins: 60})
  //
  // Falls back to the English pattern when there is no translation, so a
  // missing entry shows English rather than "{time}".
  function fmt(pattern, vals) {
    var s = tr(pattern) || pattern;
    return s.replace(/\{(\w+)\}/g, function (m, k) {
      return (vals && vals[k] !== undefined) ? vals[k] : m;
    });
  }
  window.psxT = tr;
  window.psxFmt = fmt;
  window.psxLang = function () { return cur; };
  function doText(node) {
    var raw = node.nodeValue; if (!norm(raw)) return;
    if (node.__en === undefined) node.__en = raw;
    var en = node.__en;                 // always translate FROM the stored English source
    if (cur === "en") { node.nodeValue = en; return; }
    var t = tr(norm(en));
    if (t != null) {
      var lead = (en.match(/^\s*/) || [""])[0], tail = (en.match(/\s*$/) || [""])[0];
      node.nodeValue = lead + t + tail;
    } else { node.nodeValue = en; }
  }
  function skipEl(el) { return el && el.closest && el.closest(".i18n-skip"); }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 || skipEl(root)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode; if (!p) return NodeFilter.FILTER_REJECT;
        var t = p.nodeName;
        if (t === "SCRIPT" || t === "STYLE" || t === "NOSCRIPT" || t === "TEXTAREA") return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest(".i18n-skip")) return NodeFilter.FILTER_REJECT;
        if (!norm(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var arr = [], n; while (n = w.nextNode()) arr.push(n); arr.forEach(doText);
  }
  function doAttrs(root) {
    if (!root.querySelectorAll) return;
    root.querySelectorAll("[placeholder],[title]").forEach(function (el) {
      ["placeholder", "title"].forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var raw = el.getAttribute(a), store = "__en_" + a;
        if (el[store] === undefined) el[store] = raw;
        if (cur === "en") { el.setAttribute(a, el[store]); return; }
        var t = tr(norm(el[store])); el.setAttribute(a, t != null ? t : el[store]);
      });
    });
  }
  var applying = false;
  function apply() {
    applying = true;
    document.documentElement.setAttribute("lang", cur === "zh" ? "zh-CN" : cur);
    walk(document.body); doAttrs(document.body);
    var lbl = document.getElementById("i18nCur");
    if (lbl) LANGS.forEach(function (l) { if (l[0] === cur) lbl.textContent = l[1]; });
    var opts = document.querySelectorAll("#i18nMenu .i18n-opt");
    for (var i = 0; i < opts.length; i++) opts[i].setAttribute("aria-current", opts[i].getAttribute("data-l") === cur ? "true" : "false");
    applying = false;
  }
  function setLang(l) {
    cur = l; localStorage.setItem(KEY, l);
    // Apply straight away, going back to English needs no pack, and for
    // anything else this repaints from whatever is already loaded so the
    // switcher never looks stuck. The pack's own callback applies again
    // when it lands.
    needPack(l);
    apply();
    var m = document.getElementById("i18nMenu"); if (m) m.style.display = "none";
    // Text nodes are re-walked by apply(). Anything a page ASSEMBLED with
    // psxFmt is already baked into the DOM as one string and cannot be
    // re-walked, so the page has to rebuild it, this is how it finds out.
    try { document.dispatchEvent(new CustomEvent("psx:lang", { detail: l })); }
    catch (e) {}
  }
  function buildSwitcher() {
    var css = document.createElement("style");
    css.textContent =
      "#i18nSwitch{position:fixed;bottom:18px;right:18px;z-index:600;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}" +
      "#i18nBtn{display:flex;align-items:center;gap:.4rem;background:#0f172a;color:#fff;border:1px solid rgba(255,255,255,.18);" +
      "border-radius:999px;padding:.5rem .9rem;font-size:.86rem;font-weight:600;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.35);}" +
      "#i18nBtn:hover{background:#1e293b;}" +
      "#i18nMenu{display:none;position:absolute;bottom:52px;right:0;min-width:160px;background:#0f172a;border:1px solid rgba(255,255,255,.14);" +
      "border-radius:12px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,.45);}" +
      "#i18nMenu .i18n-opt{display:block;width:100%;text-align:left;background:none;border:none;color:#e2e8f0;padding:.62rem .95rem;" +
      "font-size:.9rem;cursor:pointer;}" +
      "#i18nMenu .i18n-opt:hover{background:#1e293b;}" +
      "#i18nMenu .i18n-opt[aria-current='true']{background:#2563eb;color:#fff;}" +
      // On a phone the switcher sits exactly where the next form field and the
      // submit button are. Shrink it to the globe alone, a round 44px target,
      // which is bigger to hit than the old pill and covers a third as much.
      "@media (max-width:640px){" +
        "#i18nSwitch{bottom:calc(12px + env(safe-area-inset-bottom,0px));right:12px;}" +
        "#i18nBtn{width:44px;height:44px;padding:0;gap:0;border-radius:50%;justify-content:center;font-size:1.05rem;}" +
        "#i18nBtn>span:not(:first-child){display:none;}" +
        "#i18nMenu{bottom:54px;}" +
      "}" +
      // And while someone is actually typing, get out of the way entirely.
      "#i18nSwitch{transition:opacity .2s ease,transform .2s ease;}" +
      "#i18nSwitch.i18n-away{opacity:0;transform:translateY(10px) scale(.92);pointer-events:none;}";
    document.head.appendChild(css);
    var wrap = document.createElement("div");
    wrap.id = "i18nSwitch"; wrap.className = "i18n-skip";
    var opts = LANGS.map(function (l) {
      return '<button class="i18n-opt" data-l="' + l[0] + '">' + l[1] + '</button>';
    }).join("");
    wrap.innerHTML =
      '<button id="i18nBtn" aria-label="Language"><span>🌐</span><span id="i18nCur">English</span><span style="opacity:.7">▾</span></button>' +
      '<div id="i18nMenu">' + opts + '</div>';
    document.body.appendChild(wrap);
    document.getElementById("i18nBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      var m = document.getElementById("i18nMenu");
      m.style.display = m.style.display === "block" ? "none" : "block";
    });
    wrap.querySelectorAll(".i18n-opt").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-l")); });
    });
    document.addEventListener("click", function () {
      var m = document.getElementById("i18nMenu"); if (m) m.style.display = "none";
    });
    // Typing wins. On a phone the on-screen keyboard shoves the page up and the
    // switcher lands on top of whatever field comes next, so it steps aside
    // while any field has focus and comes back when the form is done with.
    function typing(el) {
      return !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) &&
             !/^(submit|button|hidden)$/.test(el.type || "");
    }
    document.addEventListener("focusin", function (e) {
      if (typing(e.target)) wrap.classList.add("i18n-away");
    });
    document.addEventListener("focusout", function () {
      // A tick, so moving between two fields does not flicker it in and out.
      setTimeout(function () {
        if (!typing(document.activeElement)) wrap.classList.remove("i18n-away");
      }, 80);
    });
  }
  // ---- language packs ----
  //
  // The dictionary used to be baked in here: 1123 entries times four
  // languages, 265 KB on every page, and an English reader downloaded all
  // four and used none. Packs are fetched one at a time instead, and
  // English fetches nothing at all because English is the text already on
  // the page.
  //
  // A pack calls back into this on arrival. Loading is idempotent and
  // cached, so switching back and forth costs one request per language for
  // the life of the tab.
  var PACKS = {};
  window.psxPack = function (lang, dict) {
    PACKS[lang] = dict;
    if (lang === cur) { apply(); fire(lang); }
  };
  function fire(l) {
    try { document.dispatchEvent(new CustomEvent("psx:lang", { detail: l })); }
    catch (e) {}
  }
  function needPack(l, then) {
    if (l === "en" || PACKS[l]) { then && then(); return; }
    if (needPack["_" + l]) return;           // already in flight
    needPack["_" + l] = true;
    var sc = document.createElement("script");
    /* The stamp is the pack content. Without it a rebuilt pack never
       reaches anyone who has been here before: the HTML asset rewriter
       only versions href and src attributes it can see in the markup,
       and this URL is built in script, so the browser would serve its
       cached copy of yesterday's translations for as long as it kept it. */
    sc.src = "/i18n." + l + ".js?v=232cdfd537";
    sc.async = true;
    // A pack that fails to load must leave English standing rather than a
    // half-translated page, so there is nothing to undo here.
    sc.onerror = function () { needPack["_" + l] = false; };
    document.head.appendChild(sc);
  }

  function boot() {
    buildSwitcher();
    needPack(cur);
    apply();
    var obs = new MutationObserver(function (muts) {
      if (applying || cur === "en") return;   // English is the source, no re-walk needed on DOM churn
      applying = true;
      muts.forEach(function (m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var n = m.addedNodes[i];
          if (n.nodeType === 1) { if (!skipEl(n)) { walk(n); doAttrs(n); } }
          else if (n.nodeType === 3) doText(n);
        }
      });
      applying = false;
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
