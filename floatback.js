/* 🎨 POLLOCK BUTTON — the site's mouse companion.
   A paint-splat dot FOLLOWS the mouse (smooth trailing, slightly offset so it
   never covers what you're pointing at). Reach toward it and it holds still so
   you can catch it; click it and it BURSTS into nine paint bubbles on stems
   (radial splat — Sean's sketch, 2026-07-22), each a shortcut.
   Same file as the old "← Back" pill, so every page gets it automatically. */
(function () {
    var DIST = 108;                       // stem length (px, center → bubble)
    var ACTIONS = [
        { icon: '←',  label: 'Back',     color: '#f1faee', ink: '#0f172a',
          act: function () { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; } },
        { icon: '🏠', label: 'Home',     color: '#e63946', ink: '#fff',
          act: function () { window.location.href = '/'; } },
        { icon: '🦅', label: 'Finance',  color: '#e6c56a', ink: '#231b00',
          act: function () { window.location.href = '/#finance'; } },
        { icon: '🚗', label: 'Book',     color: '#ffb703', ink: '#231b00',
          act: function () { window.location.href = '/book'; } },
        { icon: '📰', label: 'Articles', color: '#219ebc', ink: '#fff',
          act: function () { window.location.href = '/articles'; } },
        { icon: '🤝', label: 'Agents',   color: '#ff6d00', ink: '#fff',
          act: function () { window.location.href = '/agent'; } },
        { icon: '🚙', label: 'Drivers',  color: '#8ac926', ink: '#13290a',
          act: function () { window.location.href = '/renter'; } },
        { icon: '🎯', label: 'Dispatch', color: '#8338ec', ink: '#fff',
          act: function () { window.location.href = '/dispatch'; } },
        { icon: '↑',  label: 'Top',      color: '#06d6a0', ink: '#04281e',
          act: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); } }
    ];
    // hand-drawn feel: slightly irregular blob shapes + a tiny tilt per bubble
    var BLOBS = ['47% 53% 51% 49% / 52% 48% 55% 45%', '52% 48% 47% 53% / 46% 54% 49% 51%',
                 '49% 51% 54% 46% / 53% 47% 50% 50%', '54% 46% 49% 51% / 48% 52% 46% 54%',
                 '46% 54% 52% 48% / 51% 49% 53% 47%'];
    var TILT = [-6, 5, -4, 7, -5, 6, -7, 4, -5];
    function blob(i) { return BLOBS[i % BLOBS.length]; }

    var css =
        '#pollock{position:fixed;z-index:640;left:0;top:0;width:50px;height:50px;background:#0f172a;' +
        'border:2px solid rgba(230,197,106,.65);border-radius:47% 53% 50% 50%/52% 48% 54% 46%;cursor:pointer;' +
        'box-shadow:0 10px 28px rgba(0,0,0,.45);opacity:0;pointer-events:none;display:flex;align-items:center;justify-content:center;' +
        'transform:scale(.7);transition:opacity .18s ease;}' +
        '#pollock.shown{opacity:1;pointer-events:auto;transform:scale(1);}' +
        '#pollock:hover{transform:scale(1.1);}' +
        '#pollock.expanded{transform:scale(1);background:#1e293b;}' +
        '#pollock svg{display:block;pointer-events:none;}' +
        '.pk-stem{position:fixed;z-index:638;height:2px;transform-origin:0 50%;pointer-events:none;' +
        'transform:scaleX(0);transition:transform .28s cubic-bezier(.3,1.2,.4,1);border-radius:2px;}' +
        '.pk-bubble{position:fixed;z-index:639;width:56px;height:56px;margin:-28px 0 0 -28px;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:1.25rem;' +
        'box-shadow:0 10px 24px rgba(0,0,0,.45);opacity:0;transform:scale(.15);pointer-events:none;' +
        'transition:transform .34s cubic-bezier(.2,1.55,.4,1),opacity .16s ease;}' +
        '.pk-bubble.on{pointer-events:auto;}' +
        '.pk-bubble .pk-lbl{font-size:.56rem;font-weight:800;letter-spacing:.4px;text-transform:uppercase;line-height:1;margin-top:2px;' +
        'font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}' +
        '.pk-bubble:hover{filter:brightness(1.12);}' +
        '@media (hover:none){#pollock{display:none;}}';
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
            return '<line x1="13" y1="13" x2="' + x + '" y2="' + y + '" stroke="rgba(255,255,255,.5)" stroke-width="1"/>' +
                   '<circle cx="' + x + '" cy="' + y + '" r="3.1" fill="' + a.color + '"/>';
        }).join('') +
        '<circle cx="13" cy="13" r="1.6" fill="#e6c56a"/></svg>';
    document.body.appendChild(btn);

    // build bubbles + stems once, positioned on demand
    var bubbles = [], stems = [];
    ACTIONS.forEach(function (a, i) {
        var s = document.createElement('div');
        s.className = 'pk-stem';
        s.style.background = a.color;
        s.style.opacity = '.55';
        document.body.appendChild(s);
        stems.push(s);
        var b = document.createElement('button');
        b.className = 'pk-bubble';
        b.style.background = a.color;
        b.style.color = a.ink;
        b.style.borderRadius = blob(i);
        b.style.border = 'none';
        b.innerHTML = '<span>' + a.icon + '</span><span class="pk-lbl">' + a.label + '</span>';
        b.addEventListener('click', function (e) {
            e.stopPropagation();
            collapse();
            a.act();
        });
        document.body.appendChild(b);
        bubbles.push(b);
    });

    var expanded = false, shownAt = { x: 0, y: 0 };

    function clampCenter(x, y) {
        // a full-circle burst needs room on every side
        var m = DIST + 42, vw = window.innerWidth, vh = window.innerHeight;
        return { x: Math.min(Math.max(x, m), Math.max(vw - m, m)),
                 y: Math.min(Math.max(y, m), Math.max(vh - m, m)) };
    }

    function expand() {
        expanded = true;
        btn.classList.add('expanded');
        clearTimeout(holdT);
        shownAt = clampCenter(cur.x, cur.y);
        cur = { x: shownAt.x, y: shownAt.y };          // pin the dot at the burst center
        btn.style.left = (shownAt.x - 25) + 'px';
        btn.style.top = (shownAt.y - 25) + 'px';
        var base = -90, step = 360 / ACTIONS.length;   // full radial splat, Back at the top
        ACTIONS.forEach(function (a, i) {
            var deg = base + i * step;
            var ang = deg * Math.PI / 180;
            var bx = shownAt.x + Math.cos(ang) * DIST;
            var by = shownAt.y + Math.sin(ang) * DIST;
            var s = stems[i];
            s.style.left = shownAt.x + 'px';
            s.style.top = shownAt.y + 'px';
            s.style.width = (DIST - 26) + 'px';
            s.style.transform = 'rotate(' + deg + 'deg) scaleX(1)';
            var b = bubbles[i];
            b.style.left = bx + 'px';
            b.style.top = by + 'px';
            b.style.transitionDelay = (i * 30) + 'ms';
            b.style.opacity = '1';
            b.style.transform = 'scale(1) rotate(' + TILT[i] + 'deg)';
            b.classList.add('on');
        });
    }

    function collapse() {
        expanded = false;
        btn.classList.remove('expanded');
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
    // TOWARD the dot (within reach) doesn't dismiss it — so it can be caught.
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var cur = { x: mx, y: my }, showT, holdT;

    function armHold() {                                // visible for 3s, then gone
        clearTimeout(holdT);
        holdT = setTimeout(function () {
            if (!expanded && !btn.matches(':hover')) btn.classList.remove('shown');
        }, 3000);
    }
    function wake() { btn.classList.add('shown'); armHold(); }   // also used after collapse()

    function appear() {
        // beside the cursor, clamped so a full burst always fits on-screen
        cur = clampCenter(mx + 46, my + 46);
        btn.style.left = (cur.x - 25) + 'px';
        btn.style.top = (cur.y - 25) + 'px';
        wake();
    }

    document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        if (expanded) return;                           // the burst is pinned
        clearTimeout(showT);
        if (btn.classList.contains('shown')) {
            // reaching for the dot? keep it; real movement elsewhere? it disappears
            if (Math.hypot(mx - cur.x, my - cur.y) < 130) { armHold(); return; }
            btn.classList.remove('shown');
        }
        showT = setTimeout(appear, 450);                // mouse idling → appear
    });
    document.addEventListener('mouseleave', function () { if (!expanded) btn.classList.remove('shown'); });
    btn.addEventListener('mouseenter', function () { clearTimeout(holdT); });
    btn.addEventListener('mouseleave', function () { if (!expanded) armHold(); });
})();
