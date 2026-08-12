/* 🎨 POLLOCK BUTTON, the site's mouse companion.
   A paint-splat dot FOLLOWS the mouse (smooth trailing, slightly offset so it
   never covers what you're pointing at). Reach toward it and it holds still so
   you can catch it; click it and it BURSTS into a ring of paint bubbles on stems
   (radial splat, Sean's sketch, 2026-07-22), each a shortcut.
   Same file as the old "← Back" pill, so every page gets it automatically. */
(function () {
    // ---- the palette ----------------------------------------------------
    // Measured, the old set ran L 0.55 to 0.98 and chroma 0.018 to 0.248, a
    // fourteen-fold saturation spread across ten bubbles, while the company's
    // own navy sits at L 0.35, C 0.073. Every droplet was brighter and louder
    // than the company colour, which is why a splat meant to look painted
    // read as a box of markers instead.
    //
    // These are one lightness (0.45) and one chroma (0.079, the navy's own),
    // with hue the only thing that moves: nine steps of 40 degrees starting at
    // the navy. Holding two of the three is what makes a set of colours look
    // like one hand rather than an assortment, and low chroma is what makes it
    // restful. Every one lands 7.0-7.7:1 against the paper disc it edges.
    var PAINTS = ['#385681', '#5a4b7c', '#714365', '#7b4246', '#764926',
                  '#62551a', '#405f32', '#0f6354', '#046072'];
    function paint(i) { return PAINTS[i % PAINTS.length]; }

    // ---- where it can take you ------------------------------------------
    // `at` is the path this bubble leads to. A bubble for the page you are
    // already standing on is a wasted droplet in a ring that has no room to
    // spare, so expand() drops it, the burst is different on every page and
    // always full of somewhere else.
    //
    // Dispatch is gone. It is the owner's console: a visitor who taps it gets
    // a login they cannot pass, and it was occupying one of ten places.
    // In its stead, the three free tools, the planner, the road trip, the
    // book, which are the reason most people are on this site at all and
    // were, remarkably, the only things the shortcut menu could not reach.
    var ACTIONS = [
        { icon: '←',  label: 'Back',
          act: function () { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; } },
        { icon: '🏠', label: 'Home',     at: '/',
          act: function () { window.location.href = '/'; } },
        { icon: '🚗', label: 'Book',     at: '/book',
          act: function () { window.location.href = '/book'; } },
        { icon: '🗺', label: 'Planner',  at: '/trip-planner',
          act: function () { window.location.href = '/trip-planner'; } },
        { icon: '🛣', label: 'Road trip', at: '/road-trip',
          act: function () { window.location.href = '/road-trip'; } },
        { icon: '📖', label: 'Places',   at: '/destination-book',
          act: function () { window.location.href = '/destination-book'; } },
        { icon: '📰', label: 'Ideas',    at: '/articles',
          act: function () { window.location.href = '/articles'; } },
        { icon: '🤝', label: 'Agents',   at: '/agent',
          act: function () { window.location.href = '/agent'; } },
        { icon: '🚙', label: 'Drivers',  at: '/renter',
          act: function () { window.location.href = '/renter'; } },
        { icon: '↑',  label: 'Top',
          act: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); } },
        // The dot fades three seconds after you stop reaching for it, which is
        // right when it is being helpful and wrong when you actually want it.
        // This is the option to keep it: pinned, it stops fading, and the choice
        // is remembered so it does not have to be made again on every page.
        { icon: '📌', label: 'Stay',     pin: true,
          act: function () { setPinned(!pinned); } }
    ];

    // Paint thrown at a surface does not land in equal drops, and a ring of
    // ten identical circles is a menu wearing a splat's clothes. Size varies
    // by a few per cent per position, the way the blob shapes and the tilt
    // already do.
    var SIZE = [1.00, 0.93, 1.06, 0.96, 1.03, 0.91, 1.05, 0.97, 1.02, 0.94, 1.00];
    function sizeOf(i) { return SIZE[i % SIZE.length]; }

    // The ring grows to fit. A 58px droplet needs about 76px of arc before
    // there is visible air between it and its neighbour, at 68 they touch,
    // which reads as a clump rather than a splat. Ten comes out at 121.
    function radiusFor(n) { return Math.max(108, Math.round(76 * n / (2 * Math.PI))); }

    // hand-drawn feel: slightly irregular blob shapes + a tiny tilt per bubble
    var BLOBS = ['47% 53% 51% 49% / 52% 48% 55% 45%', '52% 48% 47% 53% / 46% 54% 49% 51%',
                 '49% 51% 54% 46% / 53% 47% 50% 50%', '54% 46% 49% 51% / 48% 52% 46% 54%',
                 '46% 54% 52% 48% / 51% 49% 53% 47%'];
    var TILT = [-6, 5, -4, 7, -5, 6, -7, 4, -5, 6, -4];
    function blob(i) { return BLOBS[i % BLOBS.length]; }

    // Ink on paper, like the rest of the site. The splat keeps its shape, 
    // that is the idea, and it is the one playful thing here, but it is drawn
    // rather than lit: paper discs, hairline ink edges, thin stems. Neon
    // bubbles floating over a cream page looked like a different website.
    var css =
        '#pollock{position:fixed;z-index:640;left:0;top:0;width:50px;height:50px;background:#fffdf9;' +
        'border:1px solid rgba(20,17,12,.30);border-radius:47% 53% 50% 50%/52% 48% 54% 46%;cursor:pointer;' +
        'box-shadow:0 3px 12px rgba(20,17,12,.14);opacity:0;pointer-events:none;display:flex;align-items:center;justify-content:center;' +
        'transform:scale(.7);transition:opacity .18s ease,left .22s ease,top .22s ease;}' +
        '#pollock.shown{opacity:1;pointer-events:auto;transform:scale(1);}' +
        '#pollock:hover{border-color:rgba(20,17,12,.5);}' +
        '#pollock.expanded{transform:scale(1);background:#14110c;border-color:#14110c;}' +
        '#pollock svg{display:block;pointer-events:none;}' +
        '.pk-stem{position:fixed;z-index:638;height:1px;transform-origin:0 50%;pointer-events:none;' +
        'transform:scaleX(0);transition:transform .28s cubic-bezier(.3,1.2,.4,1);}' +
        '.pk-bubble{position:fixed;z-index:639;width:58px;height:58px;margin:-29px 0 0 -29px;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:1.15rem;' +
        'background:#fffdf9;color:#14110c;border:1px solid rgba(20,17,12,.22);' +
        'box-shadow:0 3px 14px rgba(20,17,12,.13);opacity:0;transform:scale(.15);pointer-events:none;' +
        'transition:transform .34s cubic-bezier(.2,1.55,.4,1),opacity .16s ease;}' +
        '.pk-bubble.on{pointer-events:auto;}' +
        '.pk-bubble .pk-lbl{font-size:.54rem;font-weight:700;letter-spacing:.5px;text-transform:uppercase;line-height:1;margin-top:3px;color:#4a453d;' +
        'font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}' +
        '.pk-bubble:hover{border-color:rgba(20,17,12,.45);box-shadow:0 5px 18px rgba(20,17,12,.18);}' +
        // A paper wash behind the burst. Without it the bubbles float over
        // the headline and neither is readable, worst on a phone, where
        // the splat covers most of the screen.
        '.pk-scrim{position:fixed;inset:0;z-index:637;background:rgba(250,248,244,.86);' +
        'opacity:0;pointer-events:none;transition:opacity .22s ease;}' +
        '.pk-scrim.on{opacity:1;pointer-events:auto;}' +
        // On a touch screen there is no cursor to follow and no idle to detect,
        // so it stopped existing entirely, which is why it went missing on the
        // phone. It anchors in the bottom-left instead and simply stays there.
        // Bottom-RIGHT is the language switcher's, and they must not stack.
        '@media (hover:none){#pollock{opacity:1;pointer-events:auto;transform:scale(1);' +
        'width:52px;height:52px;}}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'pollock';
    btn.setAttribute('aria-label', 'Pollock menu');
    // the face = a miniature of the sketch itself: five dots on stems
    btn.innerHTML =
        '<svg width="26" height="26" viewBox="0 0 26 26">' +
        ACTIONS.slice(0, 5).map(function (a, i) {
            var ang = (-90 + i * 72) * Math.PI / 180;
            var x = (13 + Math.cos(ang) * 8.6).toFixed(2), y = (13 + Math.sin(ang) * 8.6).toFixed(2);
            return '<line x1="13" y1="13" x2="' + x + '" y2="' + y + '" stroke="rgba(20,17,12,.3)" stroke-width="1"/>' +
                   '<circle cx="' + x + '" cy="' + y + '" r="3" fill="' + (i === 0 ? '#1b4d8f' : '#14110c') + '"/>';
        }).join('') +
        '<circle cx="13" cy="13" r="1.7" fill="#1b4d8f"/></svg>';
    document.body.appendChild(btn);

    var scrim = document.createElement('div');
    scrim.className = 'pk-scrim';
    scrim.addEventListener('click', function () { collapse(); });
    document.body.appendChild(scrim);

    // build bubbles + stems once, positioned on demand
    var bubbles = [], stems = [];
    ACTIONS.forEach(function (a, i) {
        var s = document.createElement('div');
        s.className = 'pk-stem';
        s.style.background = 'rgba(20,17,12,.28)';
        document.body.appendChild(s);
        stems.push(s);
        var b = document.createElement('button');
        b.className = 'pk-bubble';
        b.style.borderRadius = blob(i);
        b.style.borderColor = paint(i);         // a hint of its own colour, not a fill
        b.innerHTML = '<span>' + a.icon + '</span><span class="pk-lbl">' + a.label + '</span>';
        b.addEventListener('click', function (e) {
            e.stopPropagation();
            if (a.pin) { a.act(); return; }      // pinning is not a destination
            collapse();
            a.act();
        });
        document.body.appendChild(b);
        bubbles.push(b);
    });

    var expanded = false, shownAt = { x: 0, y: 0 };
    var PIN_KEY = 'ps_pollock_stay';
    var pinned = false;
    try { pinned = localStorage.getItem(PIN_KEY) === '1'; } catch (e) {}
    function setPinned(on) {
        pinned = !!on;
        try { on ? localStorage.setItem(PIN_KEY, '1') : localStorage.removeItem(PIN_KEY); } catch (e) {}
        labelPin();
        if (pinned) { clearTimeout(holdT); btn.classList.add('shown'); }
        else armHold();
    }
    // The bubble says what the next tap will DO, which is the only thing worth
    // printing on a button: "Stay" while it drifts, "Let go" once it is held.
    function labelPin() {
        var i = ACTIONS.length - 1;
        if (!bubbles || !bubbles[i]) return;
        var lab = bubbles[i].querySelector('.pk-lbl');
        if (lab) lab.textContent = pinned ? 'Let go' : 'Stay';
        bubbles[i].setAttribute('aria-pressed', pinned ? 'true' : 'false');
    }

    // Which droplets lead somewhere other than here. Trailing slashes are
    // stripped so /articles and /articles/ are the same page, which they are.
    function liveIndexes() {
        var here = (location.pathname || '/').replace(/\/+$/, '') || '/';
        var out = [];
        ACTIONS.forEach(function (a, i) {
            if (a.at && (a.at.replace(/\/+$/, '') || '/') === here) return;
            out.push(i);
        });
        return out;
    }

    function clampCenter(x, y, radius) {
        // a full-circle burst needs room on every side
        var m = (radius || 108) + 42, vw = window.innerWidth, vh = window.innerHeight;
        return { x: Math.min(Math.max(x, m), Math.max(vw - m, m)),
                 y: Math.min(Math.max(y, m), Math.max(vh - m, m)) };
    }

    function expand() {
        expanded = true;
        btn.classList.add('expanded');
        scrim.classList.add('on');
        clearTimeout(holdT);
        var live = liveIndexes();
        var R = radiusFor(live.length);
        shownAt = clampCenter(cur.x, cur.y, R);
        cur = { x: shownAt.x, y: shownAt.y };          // pin the dot at the burst center
        btn.style.left = (shownAt.x - 25) + 'px';
        btn.style.top = (shownAt.y - 25) + 'px';
        var base = -90, step = 360 / live.length;      // full radial splat, Back at the top

        // Anything not in `live` is the page we are standing on. Park it at the
        // centre and leave it invisible rather than skipping the element: it
        // still has to be un-clickable and still has to collapse cleanly.
        ACTIONS.forEach(function (a, i) {
            if (live.indexOf(i) !== -1) return;
            bubbles[i].style.opacity = '0';
            bubbles[i].classList.remove('on');
            stems[i].style.transform = 'rotate(0deg) scaleX(0)';
        });

        live.forEach(function (i, j) {
            var deg = base + j * step;
            var ang = deg * Math.PI / 180;
            var bx = shownAt.x + Math.cos(ang) * R;
            var by = shownAt.y + Math.sin(ang) * R;
            var s = stems[i];
            s.style.left = shownAt.x + 'px';
            s.style.top = shownAt.y + 'px';
            s.style.width = (R - 26) + 'px';
            s.style.transform = 'rotate(' + deg + 'deg) scaleX(1)';
            var b = bubbles[i];
            b.style.left = bx + 'px';
            b.style.top = by + 'px';
            b.style.transitionDelay = (j * 30) + 'ms';
            b.style.opacity = '1';
            b.style.transform = 'scale(' + sizeOf(i) + ') rotate(' + TILT[i] + 'deg)';
            b.classList.add('on');
        });
    }

    function collapse() {
        expanded = false;
        btn.classList.remove('expanded');
        scrim.classList.remove('on');
        bubbles.forEach(function (b) {
            b.style.transitionDelay = '0ms';
            b.style.opacity = '0';
            b.style.transform = 'scale(.15)';
            b.classList.remove('on');
        });
        stems.forEach(function (s) {
            var m = /rotate\(([-\d.]+)deg\)/.exec(s.style.transform);
            s.style.transform = 'rotate(' + (m ? m[1] : 0) + 'deg) scaleX(0)';
        });
        wake();                                        // resume following + idle fade
    }

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (expanded) collapse(); else expand();
    });
    document.addEventListener('click', function () { if (expanded) collapse(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && expanded) collapse(); });

    // ---- HIDDEN WHILE MOVING · APPEARS ON IDLE · HOLDS 3 SECONDS ----
    // The mouse moving → the dot stays away. The mouse resting → the dot
    // appears beside the cursor and holds for 3s, then slips off. Moving
    // TOWARD the dot (within reach) doesn't dismiss it, so it can be caught.
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var cur = { x: mx, y: my }, showT, holdT;
    labelPin();

    function armHold() {                                // visible for 3s, then gone
        clearTimeout(holdT);
        if (pinned) return;                       // asked to stay: it stays
        holdT = setTimeout(function () {
            if (!expanded && !btn.matches(':hover')) btn.classList.remove('shown');
        }, 3000);
    }
    function wake() { btn.classList.add('shown'); armHold(); }   // also used after collapse()

    // The paint dot must never land on something a person is in the middle of
    // using. Three of those, and each one was learned the hard way:
    //
    //   * An interactive map. Idling over a map is normal, you are reading it, 
    //     and a dot appearing under the cursor there steals the click.
    //
    //   * Any control. It avoided the map and then parked itself squarely on the
    //     Traffic menu instead. The dot only has to be somewhere clear, and a
    //     form control is not clear.
    //
    //   * The section rail. It opens when the cursor rests at the left edge, so
    //     resting there is now a deliberate act, and the dot's usual "appear
    //     beside the cursor after 450ms" would put it on top of the list you
    //     just asked for.
    //
    // Hidden, the rail is visibility:hidden and pointer-events:none, so
    // elementFromPoint never returns it, no need to test for .shown, and the
    // docked horizontal bar on a narrow window is covered by the same check.
    var HANDS_OFF = 'input,select,textarea,button,a,label,[role=button],[contenteditable]';
    function keepOut(x, y) {
        var el = document.elementFromPoint(x, y);
        if (el && el.closest && el.closest(HANDS_OFF)) return true;
        while (el && el !== document.body) {
            if (el.id === 'map' || (el.classList && (el.classList.contains('leaflet-container')
                || el.classList.contains('map-searchbar') || el.classList.contains('map-layers')
                || el.classList.contains('map-actions') || el.classList.contains('map-cats')
                || el.classList.contains('map-legend') || el.classList.contains('phase-tabs')))) return true;
            el = el.parentElement;
        }
        return false;
    }

    // Somewhere clear of the map for the dot to sit. On a full-width map page the
    // ordinary "beside the cursor" spot is always over the map, so instead of
    // vanishing the dot PARKS in the nearest margin and waits there.
    function parkSpot() {
        var m = document.getElementById('map');
        var vw = window.innerWidth, vh = window.innerHeight;
        if (!m) return null;
        var b = m.getBoundingClientRect();
        if (b.left > 74) return { x: Math.round(b.left / 2), y: Math.round(vh * 0.7) };      // left margin
        if (vw - b.right > 74) return { x: Math.round((vw + b.right) / 2), y: Math.round(vh * 0.7) };
        if (vh - b.bottom > 74) return { x: 46, y: Math.round(b.bottom + (vh - b.bottom) / 2) };
        if (b.top > 74) return { x: 46, y: Math.round(b.top / 2) };
        return null;
    }

    function appear() {
        // Reading a map is exactly when you idle. The dot never lands on it, it
        // follows the cursor only in the page's own space, and parks in the margin
        // whenever the cursor (or its natural spot) is over the map.
        var spot = null;
        if (!keepOut(mx, my)) {
            var offsets = [[46, 46], [-46, 46], [46, -46], [-46, -46]];
            for (var i = 0; i < offsets.length; i++) {
                var t = clampCenter(mx + offsets[i][0], my + offsets[i][1]);
                if (!keepOut(t.x, t.y)) { spot = t; break; }
            }
        }
        if (!spot) {
            var p = parkSpot();
            if (!p || keepOut(p.x, p.y)) { btn.classList.remove('shown'); return; }
            spot = p;
        }
        cur = spot;
        btn.style.left = (cur.x - 25) + 'px';
        btn.style.top = (cur.y - 25) + 'px';
        wake();
    }

    // ---- TOUCH: anchored, always there --------------------------------
    // Everything below this point is cursor logic, idle detection, reaching
    // for the dot, parking beside a map. None of it means anything without a
    // pointer, so on a touch screen the button simply sits in the bottom-left
    // corner and waits. That corner is chosen because the language switcher
    // owns the bottom-right; two round buttons stacked on each other was the
    // exact complaint about things blocking each other.
    var TOUCH = window.matchMedia && window.matchMedia('(hover:none)').matches;
    if (TOUCH) {
        var place = function () {
            if (expanded) return;
            var inset = 16;
            cur = { x: inset + 26, y: window.innerHeight - inset - 26 };
            btn.style.left = (cur.x - 26) + 'px';
            btn.style.top = (cur.y - 26) + 'px';
            btn.classList.add('shown');
        };
        place();
        window.addEventListener('resize', place);
        window.addEventListener('orientationchange', function () { setTimeout(place, 200); });
        // collapse() calls wake(), which arms a 3-second fade meant for a mouse.
        // Anchored, it should stay put, so put it back after every collapse.
        var _collapse = collapse;
        collapse = function () { _collapse(); clearTimeout(holdT); place(); };
        return;                                   // no cursor listeners at all
    }

    if (pinned) {
        // Bottom-LEFT, for the same reason the touch anchor sits there: the
        // language switcher owns the bottom-right, and two round buttons on top
        // of each other was the original complaint.
        var p0 = parkSpot() || clampCenter(42, window.innerHeight - 42);
        cur = p0;
        btn.style.left = (cur.x - 25) + 'px';
        btn.style.top = (cur.y - 25) + 'px';
        btn.classList.add('shown');
    }

    document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        if (expanded) return;                           // the burst is pinned
        if (pinned) return;                             // asked to stay: no chasing, no fading
        clearTimeout(showT);
        if (btn.classList.contains('shown')) {
            // parked in the margin while the cursor works the map, leave it be
            if (keepOut(mx, my)) { armHold(); return; }
            // reaching for the dot? keep it; real movement elsewhere? it disappears
            if (Math.hypot(mx - cur.x, my - cur.y) < 130) { armHold(); return; }
            btn.classList.remove('shown');
        }
        showT = setTimeout(appear, 450);                // mouse idling → appear
    });
    document.addEventListener('mouseleave', function () { if (!expanded && !pinned) btn.classList.remove('shown'); });
    btn.addEventListener('mouseenter', function () { clearTimeout(holdT); });
    btn.addEventListener('mouseleave', function () { if (!expanded) armHold(); });
})();
