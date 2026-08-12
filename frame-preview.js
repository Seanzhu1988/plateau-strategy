/* Section-framing preview, three candidates, side by side, on the real page.
 *
 * Dormant unless the URL carries ?frame=. A visitor never sees this, and
 * nothing about the published site changes while it sleeps. That matters:
 * this is a live business site, not a staging box.
 *
 * The switcher stamps data-frame on <html>; every visual difference lives in
 * modern.css against that attribute, so what is being judged here is real CSS
 * that can ship as-is, not a mock-up that would have to be rebuilt.
 */
(function () {
  var MODES = [
    { key: '',          label: 'Now',        note: 'hairline + small centred mark' },
    { key: 'numbered',  label: '01 Numbered', note: 'a number opens each chapter' },
    { key: 'bands',     label: 'Bands',      note: 'alternating grounds, only the overview has two sections to alternate' },
    { key: 'rule',      label: 'Heavy rule', note: 'full-width 3px navy, much more air' }
  ];

  function param() {
    var m = /[?&]frame=([a-z]*)/.exec(location.search);
    return m ? m[1] : null;
  }
  if (param() === null) return;              // dormant for everybody else

  function apply(mode) {
    document.documentElement.setAttribute('data-frame', mode || 'now');
    try {
      var u = new URL(location.href);
      u.searchParams.set('frame', mode);
      history.replaceState(null, '', u);
    } catch (e) {}
    paintSwitcher(mode);
  }

  /* Each chapter gets a head carrying its own number and its own name. The
     name is read from the h2 already on the page, no new copy is invented
     here, because the thing being judged is framing, not wording. */
  function stampChapters() {
    var secs = document.querySelectorAll('.view section.phases, #view-overview .psx-section');
    Array.prototype.forEach.call(secs, function (s, i) {
      s.setAttribute('data-chapter', String(i + 1).padStart(2, '0'));
      if (s.querySelector(':scope > .fp-head')) return;
      var h2 = s.querySelector('h2');
      var name = h2 ? h2.textContent.replace(/[^\p{L}\p{N} &'’-]/gu, '').trim() : '';
      var head = document.createElement('div');
      head.className = 'fp-head';
      head.innerHTML = '<span class="fp-n"></span><span class="fp-name"></span>';
      head.querySelector('.fp-name').textContent = name;
      head.querySelector('.fp-n').setAttribute('data-n', s.getAttribute('data-chapter'));
      s.insertBefore(head, s.firstChild);
    });
  }

  var box;
  function paintSwitcher(active) {
    if (!box) {
      box = document.createElement('div');
      box.id = 'fp-switch';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-mode]');
        if (b) apply(b.getAttribute('data-mode'));
      });
    }
    var cur = MODES.filter(function (m) { return m.key === (active || ''); })[0] || MODES[0];
    box.innerHTML =
      '<div class="fp-t">Section framing, pick one</div>' +
      MODES.map(function (m) {
        return '<button data-mode="' + m.key + '"' +
               (m.key === (active || '') ? ' class="on"' : '') + '>' + m.label + '</button>';
      }).join('') +
      '<div class="fp-note">' + cur.note + '</div>' +
      '<div class="fp-note fp-fine">only you see this, it needs ?frame= in the address</div>';
  }

  function boot() {
    stampChapters();
    apply(param());
    // Views swap without a page load, so a newly shown view needs stamping too.
    var seen = setInterval(stampChapters, 1200);
    setTimeout(function () { clearInterval(seen); }, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
