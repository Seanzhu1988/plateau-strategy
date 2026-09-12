/* Museum pages use the same collection search and stable artifact identities. */
(function () {
  'use strict';
  function language() { try { if (window.psxLang) return window.psxLang().slice(0, 2); } catch (_) {} return (document.documentElement.lang || 'en').slice(0, 2); }
  function text(en, zh) { return language() === 'zh' ? zh : window.psxT ? window.psxT(en) || en : en; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function imageURL(value) { try { var u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch (_) { return ''; } }
  function mount(host, index) {
    host.classList.add('psx-galsearch');
    host.innerHTML = '<h2 class="gs-heading">' + esc(text('Universal Gallery', '环球艺廊')) + '</h2>' +
      '<form role="search"><label for="gsInput' + index + '">' + esc(text('Artwork, artist or label number', '作品、艺术家或藏品编号')) + '</label>' +
      '<div class="gs-form-row"><input id="gsInput' + index + '" type="search" autocomplete="off" maxlength="80" placeholder="' + esc(text('A name or a label number', '名称或藏品编号')) + '">' +
      '<button type="submit">' + esc(text('Search', '搜索')) + '</button></div></form>' +
      '<p class="gs-note" role="status" aria-live="polite">' + esc(text('Find the museum record and any original story we have written for the object.', '寻找馆藏记录，以及我们为这件藏品撰写的原创故事。')) + '</p><div class="gs-out"></div>' +
      '<div class="gs-links"><a class="gs-camera" href="/universal-gallery?photo=1&lang=' + encodeURIComponent(language()) + '">' + esc(text('Search with a photograph', '拍照寻找藏品')) + '</a>' +
      '<a href="/universal-gallery/archives?lang=' + encodeURIComponent(language()) + '">' + esc(text('Written by us artifact archives', '我们撰写的藏品故事档案')) + '</a></div>';
    var input = host.querySelector('input'), output = host.querySelector('.gs-out'), note = host.querySelector('.gs-note');
    var seq = 0, timer = null, controller = null;
    function translate() {
      host.querySelector('.gs-heading').textContent = text('Universal Gallery', '环球艺廊');
      host.querySelector('form label').textContent = text('Artwork, artist or label number', '作品、艺术家或藏品编号');
      host.querySelector('form button').textContent = text('Search', '搜索');
      input.placeholder = text('A name or a label number', '名称或藏品编号');
      var links = host.querySelectorAll('.gs-links a');
      links[0].textContent = text('Search with a photograph', '拍照寻找藏品');
      links[0].href = '/universal-gallery?photo=1&lang=' + encodeURIComponent(language());
      links[1].textContent = text('Written by us artifact archives', '我们撰写的藏品故事档案');
      links[1].href = '/universal-gallery/archives?lang=' + encodeURIComponent(language());
    }
    function cancel() { ++seq; clearTimeout(timer); if (controller) controller.abort(); output.setAttribute('aria-busy', 'false'); }
    async function search() {
      cancel(); var q = input.value.trim(), mine = seq;
      output.innerHTML = '';
      if (q.length < 2) { note.textContent = q ? text('Enter at least two characters.', '请输入至少两个字符。') : ''; return; }
      controller = new AbortController(); note.textContent = text('Looking across the collections…', '正在查找各馆收藏…'); output.setAttribute('aria-busy', 'true');
      try {
        var response = await fetch('/api/gallery/search?q=' + encodeURIComponent(q) + '&lang=' + encodeURIComponent(language()), {signal: controller.signal});
        var data = await response.json(); if (!response.ok || data.ok === false) throw new Error('search_failed');
        if (mine !== seq) return;
        var rows = data.results || [];
        note.textContent = rows.length ? '' : text('No matching object yet. Try the label number, or use a photograph in the Universal Gallery.', '暂时没有匹配藏品。试试藏品编号，或在环球艺廊中用照片寻找。');
        output.innerHTML = rows.slice(0, 5).map(function (row) {
          var photo = row.copyright ? '' : imageURL(row.image || (row.images || [])[0]);
          var link = row.artifact_id ? '/universal-gallery/artifacts/' + encodeURIComponent(row.artifact_id) + '?lang=' + encodeURIComponent(language()) : '/universal-gallery?q=' + encodeURIComponent(row.item_number || row.title || q) + '&lang=' + encodeURIComponent(language());
          var ourStory = !!(row.written || row.story_available || (row.story_languages || []).length);
          return '<a class="gs-row" href="' + link + '">' + (photo ? '<img src="' + esc(photo) + '" alt="" loading="lazy">' : '') +
            '<span class="gs-body"><span class="gs-title">' + esc(row.title) + '</span><span class="gs-detail">' + esc([row.artist, row.museum || row.source].filter(Boolean).join(' · ')) + '</span>' +
            (ourStory ? '<span class="gs-credit">' + esc(text('Provided by us', '由我们提供')) + '</span>' : '') + '</span></a>';
        }).join('') + (rows.length ? '<a class="gs-all" href="/universal-gallery?q=' + encodeURIComponent(q) + '&lang=' + encodeURIComponent(language()) + '">' + esc(text('See all matches in Universal Gallery', '在环球艺廊查看全部结果')) + ' →</a>' : '');
      } catch (error) { if (mine === seq && error.name !== 'AbortError') note.textContent = text('The collections did not answer just now. Please try again.', '馆藏服务暂时未响应，请重试。'); }
      finally { if (mine === seq) output.setAttribute('aria-busy', 'false'); }
    }
    input.addEventListener('input', function () {
      cancel(); output.innerHTML = ''; note.textContent = '';
      if (input.value.trim().length >= 2) timer = setTimeout(search, 450);
    });
    host.querySelector('form').addEventListener('submit', function (event) { event.preventDefault(); search(); });
    output.addEventListener('error', function (event) { if (event.target.tagName === 'IMG') event.target.remove(); }, true);
    window.addEventListener('pagehide', cancel);
    document.addEventListener('psx:lang', function () { cancel(); translate(); if (input.value.trim().length >= 2) search(); else note.textContent = text('Find the museum record and any original story we have written for the object.', '寻找馆藏记录，以及我们为这件藏品撰写的原创故事。'); });
  }
  function boot() {
    var hosts = document.querySelectorAll('[data-gallery-search]'); if (!hosts.length) return;
    var style = document.createElement('style'); style.id = 'psxGalSearchCss';
    style.textContent = '.psx-galsearch{margin:2rem 0;padding:1.5rem 0;border-top:1px solid #e6e2da;border-bottom:1px solid #e6e2da;max-width:100%;}.psx-galsearch .gs-heading{font-size:1.5rem;font-weight:500;margin:0 0 1rem}.psx-galsearch form label{font-size:.88rem;color:#4a453d}.psx-galsearch .gs-form-row{display:flex;gap:1rem}.psx-galsearch input{font:inherit!important;min-width:0;width:100%;min-height:48px;box-sizing:border-box;padding:.65rem .1rem!important;border:0!important;border-bottom:1px solid #6b655b!important;border-radius:0!important;color:#14110c!important;background:transparent!important}.psx-galsearch button{font:inherit!important;background:transparent!important;color:#1f3a5f!important;border:0!important;border-bottom:2px solid #1f3a5f!important;border-radius:0!important;min-width:0!important;min-height:44px;padding:.4rem .1rem!important;flex:0 0 auto!important}.psx-galsearch .gs-note{font-size:.88rem;color:#6b655b;line-height:1.65}.psx-galsearch .gs-row{display:flex;align-items:center;gap:.85rem;border-top:1px solid #e6e2da;padding:.8rem 0;text-decoration:none}.psx-galsearch .gs-row img{width:56px;height:65px;object-fit:contain;flex:0 0 56px}.psx-galsearch .gs-body{min-width:0}.psx-galsearch .gs-title{display:block;font-weight:650;color:#14110c}.psx-galsearch .gs-detail{display:block;font-size:.84rem;line-height:1.55;color:#6b655b}.psx-galsearch .gs-credit{display:block;font-size:.8rem;color:#1f3a5f;margin-top:.3rem}.psx-galsearch .gs-links{display:flex;gap:.5rem 1.3rem;flex-wrap:wrap}.psx-galsearch .gs-links a,.psx-galsearch .gs-all{display:inline-flex;align-items:center;min-height:44px;font-size:.86rem;color:#4a453d;text-underline-offset:.25rem}.psx-galsearch :focus-visible{outline:0!important;box-shadow:inset 0 -3px 0 #1f3a5f!important}';
    document.head.appendChild(style); hosts.forEach(mount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
