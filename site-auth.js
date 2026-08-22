/* One sign-in for the whole site.
 *
 * The session behind the blueprint seal was already site-wide; what was
 * missing was a door on every page. This is that door, one copy, injected
 * into every page by the server the same way asset versions are stamped,
 * so no template carries its own and none can drift.
 *
 * What it does: a small chip in the page header. Signed out, it offers
 * Google sign-in, and only when sign-in is actually configured, a button
 * that cannot work should not exist. Signed in, it shows who, and a way
 * out; the way out matters as much as the way in, because this identity
 * stamps the blueprint reader log.
 *
 * Google's script is NOT loaded with the page. It loads on the first tap
 * of Sign in, so the thirty pages this rides on pay nothing for it until
 * a visitor actually wants it. After a successful sign-in or sign-out the
 * page reloads: the server re-renders everything for the new state, which
 * is simpler and more honest than patching the page piecemeal.
 *
 * The credential is verified on the SERVER (/api/auth/google/session);
 * nothing here decodes or trusts it. A page with no <header> gets nothing.
 */
(function () {
  "use strict";

  function el(tag, cls, text) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (text) d.textContent = text;
    return d;
  }

  function ensureStyle() {
    if (document.getElementById("psxAuthCss")) return;
    var s = document.createElement("style");
    s.id = "psxAuthCss";
    s.textContent = [
      ".psx-auth{display:inline-flex;align-items:center;gap:.55rem;margin-left:.9rem;white-space:nowrap}",
      ".psx-auth-btn{font:inherit;font-weight:600;font-size:.85rem;color:inherit;",
      "background:none;border:1px solid currentColor;border-radius:999px;",
      "padding:.3rem .85rem;min-height:34px;cursor:pointer;opacity:.85}",
      ".psx-auth-btn:hover{opacity:1}",
      ".psx-auth-apple{display:inline-flex;align-items:center;gap:.35rem}",
      ".psx-auth-apple svg{display:block}",
      ".psx-auth-name{font-size:.85rem;opacity:.8;max-width:11ch;overflow:hidden;text-overflow:ellipsis}",
      ".psx-auth-out{background:none;border:0;padding:0;font:inherit;font-size:.78rem;",
      "color:inherit;opacity:.7;text-decoration:underline;cursor:pointer}",
      ".psx-auth-out:hover{opacity:1}",
      "@media (max-width:640px){.psx-auth{margin-left:.5rem}.psx-auth-name{max-width:8ch}}"
    ].join("");
    document.head.appendChild(s);
  }

  function mountPoint() {
    var header = document.querySelector("header");
    if (!header) return null;
    return header.querySelector(".right") || header.querySelector("nav") || header;
  }

  async function jget(url) {
    try { return await (await fetch(url)).json(); } catch (e) { return null; }
  }

  function renderSigned(box, who) {
    box.innerHTML = "";
    var first = (who.name || who.email || "").split(" ")[0];
    box.appendChild(el("span", "psx-auth-name", first));
    var out = el("button", "psx-auth-out", "Sign out");
    out.addEventListener("click", function () {
      fetch("/api/auth/reader/logout", { method: "POST" })
        .then(function () { location.reload(); })
        .catch(function () { location.reload(); });
    });
    box.appendChild(out);
  }

  function renderGoogleSignin(box, clientId) {
    var btn = el("button", "psx-auth-btn", "Sign in");
    btn.addEventListener("click", function () {
      btn.textContent = "One moment";
      btn.disabled = true;
      var s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true; s.defer = true;
      s.onload = function () {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: function (resp) {
              fetch("/api/auth/google/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: resp && resp.credential })
              }).then(function (r) { return r.json(); }).then(function (j) {
                if (j.ok) { location.reload(); return; }
                btn.textContent = "Sign in";
                btn.disabled = false;
                alert(j.error || "Could not verify that sign-in.");
              }).catch(function () {
                btn.textContent = "Sign in";
                btn.disabled = false;
              });
            }
          });
          var slot = el("span", "");
          box.replaceChild(slot, btn);
          google.accounts.id.renderButton(slot, {
            type: "standard", size: "medium", text: "signin_with", shape: "pill"
          });
          google.accounts.id.prompt();
        } catch (e) {
          btn.textContent = "Sign in";
          btn.disabled = false;
        }
      };
      s.onerror = function () {
        btn.textContent = "Sign in";
        btn.disabled = false;
      };
      document.head.appendChild(s);
    });
    box.appendChild(btn);
  }

  // The Apple logo as a drawn mark, so the button reads the same on every
  // platform (the  glyph only renders on Apple devices, a tofu box on the rest).
  var APPLE_MARK = '<svg viewBox="0 0 384 512" width="13" height="13" fill="currentColor"'
    + ' aria-hidden="true" focusable="false"><path d="M318.7 268.7c-.2-36.7 16.4-64.4'
    + ' 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7'
    + '-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2'
    + ' 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5'
    + ' 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5'
    + '-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';

  function resetApple(btn) {
    btn.innerHTML = APPLE_MARK + "<span>Apple</span>";
    btn.disabled = false;
  }

  function renderAppleSignin(box, clientId) {
    var btn = el("button", "psx-auth-btn psx-auth-apple", "");
    btn.setAttribute("aria-label", "Sign in with Apple");
    btn.innerHTML = APPLE_MARK + "<span>Apple</span>";
    btn.addEventListener("click", function () {
      btn.textContent = "One moment";
      btn.disabled = true;
      var s = document.createElement("script");
      s.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      s.async = true; s.defer = true;
      s.onload = function () {
        try {
          // redirectURI must be a Return URL registered on the Services ID,
          // https, and match this origin. Apple rejects anything else, which
          // is why this stays dormant until the domain is configured there.
          AppleID.auth.init({
            clientId: clientId, scope: "name email",
            redirectURI: location.origin + "/", usePopup: true
          });
          AppleID.auth.signIn().then(function (data) {
            var idt = data && data.authorization && data.authorization.id_token;
            var nm = "";
            if (data && data.user && data.user.name) {
              nm = ((data.user.name.firstName || "") + " "
                  + (data.user.name.lastName || "")).trim();
            }
            fetch("/api/auth/apple/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_token: idt, name: nm })
            }).then(function (r) { return r.json(); }).then(function (j) {
              if (j.ok) { location.reload(); return; }
              resetApple(btn);
              alert(j.error || "Could not verify that sign-in.");
            }).catch(function () { resetApple(btn); });
          }).catch(function () { resetApple(btn); });   // closed the popup, or refused
        } catch (e) { resetApple(btn); }
      };
      s.onerror = function () { resetApple(btn); };
      document.head.appendChild(s);
    });
    box.appendChild(btn);
  }

  async function init() {
    var mount = mountPoint();
    if (!mount) return;
    var who = await jget("/api/auth/reader");
    if (!who || !who.ok) return;
    if (who.owner && !who.signed_in) return;   // owner consoles have their own door
    ensureStyle();
    var box = el("span", "psx-auth", "");
    if (who.signed_in) {
      mount.appendChild(box);
      renderSigned(box, who);
      return;
    }
    // A button for each provider that is actually configured. A button that
    // cannot work should not exist, so an unset provider adds nothing, and if
    // neither is set the chip stays away entirely.
    var g = await jget("/api/auth/google/config");
    var a = await jget("/api/auth/apple/config");
    var gOn = g && g.enabled && g.client_id;
    var aOn = a && a.enabled && a.client_id;
    if (!gOn && !aOn) return;
    mount.appendChild(box);
    if (gOn) renderGoogleSignin(box, g.client_id);
    if (aOn) renderAppleSignin(box, a.client_id);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
