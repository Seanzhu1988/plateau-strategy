/* The guide, standing next to the model.
 *
 * The 3D view answers WHERE. This answers WHAT, out loud, gallery by gallery,
 * and lights the room it is talking about so the two halves are never telling
 * different stories. It is the museum-sized rehearsal of the thing the whole
 * project is for: a voice that knows where you are and says the useful part.
 *
 * WHERE THE WORDS COME FROM. met-cards.js, already written and adversarially
 * fact-checked, which is why nothing here invents a sentence about a painting.
 * Each gallery narrates as its one-line opening, then its highlights, each a
 * work and a note.
 *
 * WHICH VOICE. A recorded guide if we have one for that key, so a traveller
 * hears the real voice rather than the phone's; otherwise the phone's own
 * speech, which is plain but always there and costs nothing. The recording is
 * a nicety, never a dependency: any failure to load falls through to speech
 * rather than to silence. Today only the museum overview is recorded, so the
 * opening line is in the guide's voice and the galleries are spoken by the
 * phone until voice_guides.py records the rest.
 *
 * WHAT IT WILL NOT DO. It does not claim to know where you are standing. The
 * proximity trigger belongs to /walk, which has GPS and a footprint to follow;
 * inside the Met the map goes grey and this is a rehearsal at the table, not a
 * guide at your shoulder. Saying so is cheaper than pretending.
 */
(function () {
  'use strict';

  var AUDIO = { 'the-met-museum': '/media/audio/guide-the-met-museum.mp3' };
  var OPENING = 'the-met-museum';

  var seq = [];          /* gallery keys to narrate, in order */
  var at = -1;           /* which gallery */
  var seg = 0;           /* which segment inside it */
  var playing = false;
  var audio = null;
  var host = null, onChange = null;

  function cards() { return window.MET_CARDS || {}; }

  function segmentsFor(key) {
    var c = cards()[key];
    if (!c) return [];
    var out = [];
    if (c.one_line) out.push(c.one_line);
    (c.highlights || []).forEach(function (h) {
      if (!h) return;
      var w = (h.work || '').trim(), n = (h.note || '').trim();
      out.push(w && n ? w + '. ' + n : (w || n));
    });
    return out.filter(Boolean);
  }

  function nameOf(key) {
    var c = cards()[key];
    return (c && c.name) || key.replace(/-/g, ' ');
  }

  /* ---- speaking ---- */
  function stopSound() {
    try { window.speechSynthesis.cancel(); } catch (e) {}
    if (audio) { try { audio.pause(); } catch (e) {} audio = null; }
  }

  function speak(text, url, done) {
    stopSound();
    if (url) {
      try {
        var a = new Audio(url);
        audio = a;
        var fell = false;
        var fallback = function () { if (fell) return; fell = true; audio = null; speakPlain(text, done); };
        a.addEventListener('ended', function () { audio = null; done(); });
        a.addEventListener('error', fallback);
        var pr = a.play();
        if (pr && pr.catch) pr.catch(fallback);
        return;
      } catch (e) { /* fall through */ }
    }
    speakPlain(text, done);
  }

  function speakPlain(text, done) {
    /* A speech engine that never fires onend is common enough — a locked
       screen, a browser with no installed voice — and a tour that waits
       forever for it looks broken. One watchdog, roughly reading speed, and
       the guide keeps walking whatever the phone does. */
    var fired = false;
    function once() { if (fired) return; fired = true; clearTimeout(guard); done(); }
    var guard = setTimeout(once, Math.min(22000, 2200 + (text || '').length * 62));
    try {
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.98;
      u.lang = document.documentElement.lang || 'en-US';
      u.onend = once;
      u.onerror = once;
      window.speechSynthesis.speak(u);
    } catch (e) { once(); }
  }

  /* ---- the tour ---- */
  function step() {
    if (!playing) return;
    if (at < 0) {                         /* the opening, in the guide's voice */
      at = 0; seg = 0;
      paint('The Metropolitan Museum of Art', null,
            'Five thousand years of art, in a building of eleven and a half acres.');
      speak('The Metropolitan Museum of Art. Five thousand years of human ' +
            'making, in a building that covers eleven and a half acres. ' +
            'Here is the walk you picked.', AUDIO[OPENING], step);
      return;
    }
    if (at >= seq.length) { stop(); return; }
    var key = seq[at];
    var parts = segmentsFor(key);
    if (seg >= parts.length) { at++; seg = 0; step(); return; }
    var text = parts[seg];
    paint(nameOf(key), key, text);
    seg++;
    speak(text, AUDIO[key] || null, step);
  }

  function paint(title, key, text) {
    if (!host) return;
    var t = host.querySelector('[data-guide-title]');
    var b = host.querySelector('[data-guide-text]');
    if (t) t.textContent = title;
    if (b) b.textContent = text || '';
    if (onChange) onChange(key || null);
  }

  function start(keys) {
    seq = (keys || []).filter(function (k) { return segmentsFor(k).length; });
    if (!seq.length) {
      paint('Nothing picked yet', null,
            'Tap the galleries you want on the model, then press play and the guide walks you through them.');
      return;
    }
    playing = true; at = -1; seg = 0;
    setBtn(true);
    step();
  }

  function stop() {
    playing = false;
    stopSound();
    setBtn(false);
    if (onChange) onChange(null);
  }

  function skip() {
    if (!playing) return;
    stopSound();
    at = at < 0 ? 0 : at + 1;
    seg = 0;
    step();
  }

  /* The room overview, in the panel: when the model dives into a gallery,
     the guide turns to face it. preview only paints, so looking never makes
     sound; playRoom narrates that one gallery, skipping the museum opening,
     because you are already standing in front of the room you asked about. */
  function preview(key) {
    if (playing) return;
    var c = cards()[key];
    paint(nameOf(key), key, (c && c.one_line) || '');
  }

  function playRoom(key) {
    stop();
    if (!segmentsFor(key).length) return;
    seq = [key];
    playing = true; at = 0; seg = 0;
    setBtn(true);
    step();
  }

  function setBtn(on) {
    if (!host) return;
    var b = host.querySelector('[data-guide-play]');
    if (b) b.textContent = on ? '❚❚ Pause the guide' : '▶ Play the guide';
  }

  /* ---- wiring ---- */
  function mount(el, opts) {
    host = el;
    var o = opts || {};
    onChange = o.onRoom || null;
    host.innerHTML =
      '<div class="mg-head">' +
        '<span class="mg-kicker">The guide</span>' +
        '<h3 data-guide-title>Your walk, narrated</h3>' +
      '</div>' +
      '<p class="mg-text" data-guide-text>Pick galleries on the model and press play. ' +
        'The guide talks you through them in order, and the room it is describing ' +
        'lights up beside it.</p>' +
      '<div class="mg-controls">' +
        '<button type="button" data-guide-play>▶ Play the guide</button>' +
        '<button type="button" class="quiet" data-guide-skip>Skip ahead</button>' +
      '</div>' +
      '<p class="mg-note">Recorded voice where we have one, your phone\'s voice ' +
        'otherwise. Inside the Met the map goes grey, so this is the guide at ' +
        'the table; the one that knows where you are standing lives on ' +
        '<a href="/walk">the walking guide</a>.</p>';

    host.querySelector('[data-guide-play]').addEventListener('click', function () {
      if (playing) { stop(); return; }
      start(typeof o.route === 'function' ? o.route() : (o.route || []));
    });
    host.querySelector('[data-guide-skip]').addEventListener('click', skip);
  }

  window.MetGuide = { mount: mount, start: start, stop: stop, skip: skip,
                      preview: preview, playRoom: playRoom,
                      isPlaying: function () { return playing; } };
})();
