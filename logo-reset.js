/* Tapping the brand logo resets the page, but never by accident.
 *
 * The logo sits in the top corner, exactly where a thumb lands by mistake,
 * and a reset throws away whatever the visitor was in the middle of, a
 * half-filled form, a search they had just typed. So the tap asks first and
 * only reloads on a yes. A plain reload: saved work (a trip already built
 * lives in the browser) comes back, only the unsaved in-between is cleared,
 * which is what the question promises.
 *
 * One copy, injected into every page by the server the same way the sign-in
 * chip is, so no template carries its own and none can drift.
 */
(function () {
  "use strict";

  function confirmReset() {
    var en = "Reset the page? Anything you have not saved will be lost.";
    var msg = (window.psxT && window.psxT(en)) || en;
    return window.confirm(msg);
  }

  function onTap(e) {
    if (e) e.preventDefault();
    if (confirmReset()) location.reload();
  }

  function onKey(e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") onTap(e);
  }

  // The logo is a bare <img> in the header on most pages; the landing page
  // wraps it in its own clickable box. Take the box where there is one, so a
  // container and its own image are never both armed.
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

  function arm() {
    logos().forEach(function (el) {
      if (el.__resetArmed) return;
      el.__resetArmed = true;
      // Drop any handler the page put on the logo itself (the landing page
      // sends it to the home view). The tap belongs to the reset now.
      el.onclick = null;
      el.style.cursor = "pointer";
      el.setAttribute("role", "button");
      if (el.tabIndex < 0) el.tabIndex = 0;
      if (!el.getAttribute("title")) el.setAttribute("title", "Reset the page");
      el.setAttribute("aria-label", "Reset the page");
      el.addEventListener("click", onTap);
      el.addEventListener("keydown", onKey);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arm);
  } else {
    arm();
  }
})();
