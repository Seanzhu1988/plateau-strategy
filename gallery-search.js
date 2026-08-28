/* The Universal Gallery's search bar, carried into every museum page.
 *
 * [SEAN "i want the search bar to be appeared in any museum we have and will
 * built"] The gallery is the site's one brain for artworks: name or the
 * number on the label, answered from the Met, the Art Institute and Wikidata,
 * with every miss recorded as a discovery. A museum page that grew its own
 * little search would drift from that brain, so instead the ONE bar mounts
 * anywhere: a page writes <div data-gallery-search></div> and this file does
 * the rest. The Met page carries it today; every museum built after starts
 * with it.
 *
 * It searches the same /api/gallery/search the gallery itself uses, so the
 * ranking rules (an exact item number always wins; relevance beats museums
 * that answer nonsense confidently) are inherited, not reimplemented.
 */
(function () {
    "use strict";

    function css() {
        if (document.getElementById("psxGalSearchCss")) return;
        var st = document.createElement("style");
        st.id = "psxGalSearchCss";
        st.textContent =
            ".psx-galsearch { border: 1px solid #d3d3da; border-radius: 10px;" +
            "  background: #fff; padding: 1rem 1.1rem; margin: 1.6rem 0; }" +
            ".psx-galsearch .gs-kicker { font-size: .72rem; font-weight: 700;" +
            "  letter-spacing: .14em; color: #1b4d8f; }" +
            ".psx-galsearch input { width: 100%; font: inherit; box-sizing: border-box;" +
            "  padding: .7rem .85rem; margin-top: .55rem; min-height: 44px;" +
            "  border: 1px solid #d3d3da; border-radius: 8px; background: #fff; color: #14110c; }" +
            ".psx-galsearch .gs-note { font-size: .85rem; color: #6b655b; margin: .5rem 0 0; }" +
            ".psx-galsearch .gs-row { display: flex; gap: .7rem; align-items: center;" +
            "  padding: .6rem 0; border-top: 1px solid #eceae4; text-decoration: none; }" +
            ".psx-galsearch .gs-row img { width: 52px; height: 52px; object-fit: cover;" +
            "  border-radius: 6px; flex: 0 0 auto; background: #f1efe8; }" +
            ".psx-galsearch .gs-t { font-weight: 700; color: #14110c; font-size: .95rem; }" +
            ".psx-galsearch .gs-w { font-size: .82rem; color: #6b655b; }" +
            ".psx-galsearch .gs-all { display: inline-block; margin-top: .6rem;" +
            "  font-weight: 700; color: #1f3a5f; text-decoration: none; font-size: .9rem; }";
        document.head.appendChild(st);
    }

    function esc(t) {
        var d = document.createElement("div");
        d.textContent = t == null ? "" : String(t);
        return d.innerHTML;
    }

    function mount(host) {
        host.className = (host.className ? host.className + " " : "") + "psx-galsearch";
        host.innerHTML =
            '<span class="gs-kicker">THE UNIVERSAL GALLERY</span>' +
            '<input type="search" placeholder="Standing in front of something? A name, or the number on the label…"' +
            ' autocomplete="off" aria-label="Search any artwork">' +
            '<div class="gs-out"></div>' +
            '<p class="gs-note">Any artwork, any museum. A number wins when you cannot spell the name.</p>';
        var input = host.querySelector("input");
        var out = host.querySelector(".gs-out");
        var note = host.querySelector(".gs-note");
        var timer = null, seq = 0;

        function render(q, rows) {
            if (!rows.length) {
                out.innerHTML = "";
                note.textContent = "Nothing found for that yet. The search itself " +
                    "recorded it, which is how the gallery learns what to add.";
                return;
            }
            out.innerHTML = rows.slice(0, 5).map(function (r) {
                var where = [r.museum || r.source, r.where].filter(Boolean).join(" · ");
                if (r.on_view === false) where += " · not on view right now";
                return '<a class="gs-row" href="/universal-gallery?q=' +
                    encodeURIComponent(r.item_number || r.title || q) + '">' +
                    (r.image ? '<img loading="lazy" src="' + esc(r.image) + '" alt="">' : "") +
                    '<span><span class="gs-t">' + esc(r.title) + "</span><br>" +
                    '<span class="gs-w">' + esc([r.artist, r.date].filter(Boolean).join(", ")) +
                    (where ? " — " + esc(where) : "") + "</span></span></a>";
            }).join("") +
            '<a class="gs-all" href="/universal-gallery?q=' + encodeURIComponent(q) +
            '">Everything on this in the Universal Gallery →</a>';
            note.textContent = "";
        }

        input.addEventListener("input", function () {
            var q = input.value.trim();
            clearTimeout(timer);
            if (q.length < 2) { out.innerHTML = ""; return; }
            timer = setTimeout(function () {
                var my = ++seq;
                note.textContent = "Looking across the collections…";
                fetch("/api/gallery/search?q=" + encodeURIComponent(q))
                    .then(function (r) { return r.json(); })
                    .then(function (d) {
                        if (my !== seq) return;          // a newer keystroke owns the box
                        render(q, (d && d.results) || []);
                    })
                    .catch(function () {
                        if (my === seq) note.textContent =
                            "The collections did not answer just now. Try once more.";
                    });
            }, 350);
        });
    }

    function boot() {
        var hosts = document.querySelectorAll("[data-gallery-search]");
        if (!hosts.length) return;
        css();
        [].forEach.call(hosts, mount);
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else { boot(); }
})();
