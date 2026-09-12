/* One artifact identity across search, stories, the archive and photo confirmation. */
(function () {
  'use strict';
  var main = document.getElementById('ugMain');
  if (!main) return;
  var archive = document.body.dataset.galleryPage === 'archive';
  var input = document.getElementById('ugFind');
  var output = document.getElementById('ugFound');
  var status = document.getElementById('ugStatus');
  var empty = document.getElementById('ugEmpty');
  var params = new URLSearchParams(location.search);
  var seq = 0, timer = null, searchController = null, cardControllers = new Set();
  var rows = [], canGenerate = false, page = 1, photoOrigin = false;
  var photoFile = null, photoURL = null, photoSeq = 0, photoController = null, photoBusy = false, candidates = [];
  var explicitLang = params.get('lang') || '';
  var copy = {
    context: ['Art, objects and the stories they carry', '艺术、文物，以及它们的故事'],
    title: ['Universal Gallery', '环球艺廊'],
    lede: ['Start with something that caught your eye. Find its museum record, discover our story, and give the next visitor more to explore.', '从吸引你的那件作品开始。查阅博物馆记录，发现我们撰写的故事，也为下一位访客留下更多发现。'],
    searchLabel: ['Artwork, artist or label number', '作品、艺术家或藏品编号'], search: ['Search', '搜索'],
    searchHint: ['The number on the museum label is often the closest match.', '展品标签上的藏品编号通常能找到最准确的结果。'],
    searchPlaceholder: ['Try Cypresses or 49.30', '例如 Cypresses 或 49.30'],
    photoSearch: ['Search with a photograph', '拍照寻找藏品'],
    archiveLink: ['Written by us artifact archives', '我们撰写的藏品故事档案'],
    photoHeading: ['What are you looking at?', '你面前的是什么藏品？'], close: ['Close', '关闭'],
    photoIntro: ['Photograph the object or its museum label. We will suggest possible matches for you to check against the collection.', '拍下藏品或展签，我们会寻找可能的匹配，再由你对照博物馆记录确认。'],
    camera: ['Take a photograph', '拍摄照片'], choosePhoto: ['Choose a photograph', '选择照片'],
    removePhoto: ['Remove photograph', '移除照片'], museumHint: ['Museum or location, if you know it', '博物馆或所在地（选填）'],
    identify: ['Find possible matches', '寻找可能的匹配'], optional: ['Optional', '选填'],
    photoPrivacy: ['Your photograph is sent for identification. It is not published or added to the archive. Only an object you confirm can become a discovery.', '照片仅用于识别，不会公开或加入档案。只有你确认的藏品才能成为新的发现。'],
    photoConsent: ['I agree to send this photo and the details I enter to Anthropic for artifact identification. The site removes photo metadata and does not save the photo.', '我同意将照片及填写的信息发送给 Anthropic 进行藏品识别。网站会移除照片元数据，并且不保存照片。'],
    noMatch: ['No matching object yet', '暂未找到匹配的藏品'],
    noMatchHelp: ['Try the title or accession number exactly as it appears on the label. A photograph of the label can help when the name is difficult to read.', '试试展签上的完整名称或藏品编号。如果名称难以辨认，可以拍下标签。'],
    welcome: ['Our stories stay with the objects. When you find an artwork we have written about, look for “Provided by us” beside it.', '我们的故事与藏品相连。搜索到我们已撰写的作品时，你会看到“由我们提供”的标记。'],
    welcomeNext: ['Newly discovered objects help our collection grow. The archive has its own quiet home, ready when you want it.', '新的藏品发现让艺廊不断成长。故事档案有独立的入口，需要时随时可读。'],
    sourceNote: ['Collection records belong to their museums. Our stories are separately credited, with AI assistance identified where used.', '馆藏记录来自各博物馆。我们的故事单独署名，使用 AI 协助的内容会明确标注。'],
    browseGuides: ['Explore our museum guides', '浏览我们的博物馆指南'],
    backGallery: ['Universal Gallery', '环球艺廊'], archiveContext: ['The Universal Gallery collection', '环球艺廊的故事收藏'],
    archiveIntro: ['A place for the stories we have made. Each one belongs to an object, and travels with it whenever someone searches again.', '这里收藏我们撰写的故事。每篇都与一件藏品相连，再次搜索时，故事便会随它一同出现。'],
    archiveSearch: ['Search our stories', '搜索我们的故事'], archivePlaceholder: ['Artwork, artist or museum', '作品、艺术家或博物馆'],
    storyLanguage: ['Story language', '故事语言'], searchCollections: ['Search all the collections', '搜索全部馆藏'],
    archiveEmpty: ['No stories here yet', '暂时没有相关故事'],
    archiveEmptyHelp: ['Try another title or story language. You can also look for the object in the Universal Gallery.', '可以换个名称或故事语言，也可以返回环球艺廊寻找这件藏品。'],
    previous: ['Previous', '上一页'], next: ['Next', '下一页'], page: ['Page', '第'],
    searching: ['Looking across the collections…', '正在查找各馆收藏…'], loadingArchive: ['Opening the story archive…', '正在打开故事档案…'],
    searchFailed: ['The collections did not answer just now. Please try your search again.', '馆藏服务暂时未响应，请重新搜索。'],
    archiveFailed: ['The archive could not be opened just now. Please try again.', '暂时无法打开档案，请重试。'],
    minQuery: ['Enter at least two characters, or try the label number.', '请输入至少两个字符，或试试藏品编号。'],
    resultHeading: ['From the collections', '馆藏搜索结果'], archiveHeading: ['Our stories', '我们的故事'],
    resultCount: ['matching objects', '件匹配藏品'], resultSingle: ['matching object', '件匹配藏品'], storiesCount: ['stories', '篇故事'], storySingle: ['story', '篇故事'],
    newDiscovery: ['A new discovery for the gallery. This object is saved for future stories.', '艺廊的新发现。这件藏品已保存，供今后撰写故事。'],
    remembered: ['Part of our growing collection', '已收录于我们的收藏'],
    savedStory: ['Story saved. It will appear with this object in future searches.', '故事已保存，下次搜索这件藏品时会一同出现。'],
    supplied: ['Provided by us', '由我们提供'], museumRecord: ['Museum collection record', '博物馆馆藏记录'],
    makerUnknown: ['Maker unrecorded', '创作者未记录'], labelNumber: ['Label number', '藏品编号'],
    notOnView: ['Not currently on view', '目前未展出'], read: ['Read our story', '阅读我们的故事'],
    readEnglish: ['Read in English', '阅读英文故事'], create: ['Create a story for this object', '为这件藏品撰写故事'],
    source: ['Museum / collection source', '博物馆／馆藏来源'], sourceSearch: ['Search the museum catalogue', '搜索博物馆目录'], permalink: ['Link to this object', '这件藏品的独立页面'],
    storyOtherLanguage: ['Our story is available in another language.', '这件藏品的故事已有其他语言版本。'],
    noStory: ['An original story has not been written for this object yet.', '这件藏品暂时还没有原创故事。'],
    aiCreate: ['A new story uses AI assistance and is saved with that credit.', '新故事将使用 AI 协助撰写，并保存这一署名信息。'],
    confirm: ['This is the object', '确认是这件藏品'], confirmHint: ['Compare the title, image and label number before confirming.', '请先核对名称、照片和藏品编号，再确认。'],
    saved: ['Object confirmed and saved to the gallery.', '藏品已确认并保存到艺廊。'],
    saveFailed: ['The object could not be saved. Please try again.', '藏品保存失败，请重试。'], saving: ['Saving…', '正在保存…'],
    opening: ['Opening the story…', '正在打开故事…'], writing: ['Writing your story. This can take a little time…', '正在撰写故事，请稍候…'],
    hideStory: ['Close story', '收起故事'], originalCredit: ['Original story by Plateau Strategy', 'Plateau Strategy 原创故事'],
    aiCredit: ['AI-assisted writing', 'AI 协助撰写'], editorialCredit: ['Site-curated story', '网站编辑故事'],
    minuteRead: ['min read', '分钟阅读'], listen: ['Listen to the story', '收听故事'], headphones: ['Headphones, please, for the people around you.', '为了身边的人，请使用耳机收听。'],
    audioFailed: ['This recording could not be loaded. The written story is available below.', '录音暂时无法加载，可以阅读下方故事。'],
    unavailable: ['Story writing is unavailable right now. The museum record is still here, and any saved story remains in the archive.', '目前暂时无法撰写新故事。馆藏记录仍可查阅，已保存的故事也仍在档案中。'],
    storyFailed: ['The story could not be opened. Please try again.', '故事暂时无法打开，请重试。'],
    storyBusy: ['This story is already being written. Please try opening it again shortly.', '这篇故事正在撰写中，请稍后再打开。'],
    storyMissing: ['We have not written this story in your selected language yet.', '这篇故事还没有当前所选语言的版本。'],
    collectionPhoto: ['Collection photograph', '馆藏照片'], noImage: ['Image unavailable. Check the collection source.', '暂无图片，请查阅馆藏来源。'],
    photoWaiting: ['Choose a photograph first.', '请先选择照片。'], photoConsentNeeded: ['Please read and select the photo identification consent before continuing.', '继续前，请阅读并勾选照片识别授权。'],
    photoLarge: ['Please choose a photograph smaller than 6 MB.', '请选择小于 6 MB 的照片。'],
    photoType: ['Please use a JPEG, PNG or WebP photograph. On iPhone, you can choose a compatible image from Photos.', '请使用 JPEG、PNG 或 WebP 照片。iPhone 用户可以从照片中选择兼容的图片。'],
    photoReady: ['Photograph ready. Add a museum name if you know it, then find possible matches.', '照片已准备好。可以补充博物馆名称，然后寻找匹配。'],
    photoIdentifying: ['Reading the object and its label…', '正在识别藏品和展签…'],
    photoUnavailable: ['Photo identification is not connected yet. Search the title, artist, or museum label instead.', '照片识别尚未连接。请先使用作品名称、艺术家或展签编号搜索。'],
    photoNoMatch: ['We could not identify a reliable match. Try a clearer photograph of the label, or search its words directly.', '未能找到可靠匹配。请试试更清晰的展签照片，或直接搜索标签上的文字。'],
    photoCorrupt: ['This photograph could not be read. Please choose another JPEG, PNG or WebP image.', '无法读取这张照片，请选择其他 JPEG、PNG 或 WebP 图片。'],
    photoFailed: ['Identification did not finish. You can try again or search the words on the label.', '识别未能完成，可以重试，或搜索展签上的文字。'],
    photoTimeout: ['Identification took too long. Try again with a clear photograph of the label.', '识别时间过长，请使用清晰的展签照片重试。'],
    photoRateLimit: ['Photo search is busy. Please wait a minute before trying again.', '照片搜索目前繁忙，请稍等一分钟后重试。'],
    photoLimit: ['Photo identification has reached its current allowance. You can still search by title, artist or label number.', '照片识别已达到当前额度，仍可使用名称、艺术家或藏品编号搜索。'],
    photoProviderError: ['Photo identification is temporarily unavailable. Please try again later or search the words on the label.', '照片识别服务暂时无法使用，请稍后重试，或搜索展签上的文字。'],
    labelRead: ['Text found on the label', '识别到的展签文字'],
    possibleMatches: ['These are suggestions, ready for you to check.', '以下是可能的结果，请进一步核对。'],
    checkCollection: ['Find this in the collections', '在馆藏中核对'], possible: ['Possible match', '可能匹配'],
    photoConfirmResults: ['Check these collection records against your photograph, then confirm the right object.', '请用照片核对这些馆藏记录，再确认正确的藏品。'],
    artifactMissing: ['This object could not be found. Try searching its title or label number.', '未找到这件藏品，请试试搜索名称或编号。']
  };
  function lang() {
    if (archive && document.getElementById('ugArchiveLang')) return document.getElementById('ugArchiveLang').value;
    if (explicitLang) return explicitLang;
    try { if (window.psxLang) return window.psxLang().slice(0, 2); } catch (_) {}
    return (document.documentElement.lang || 'en').slice(0, 2);
  }
  function t(key) {
    var pair = copy[key] || [key, key];
    if (lang() === 'zh') return pair[1];
    return window.psxT ? (window.psxT(pair[0]) || pair[0]) : pair[0];
  }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function safeURL(value, local) {
    if (!value || typeof value !== 'string') return '';
    try { var u = new URL(value, location.origin); if (!/^https?:$/.test(u.protocol)) return ''; if (!local && !/^https?:\/\//i.test(value)) return ''; return u.href; } catch (_) { return ''; }
  }
  function artifactURL(row, selectedLang) { return '/universal-gallery/artifacts/' + encodeURIComponent(row.artifact_id) + '?lang=' + encodeURIComponent(selectedLang || lang()); }
  function sourceLabel(row) { return row.source_kind === 'catalogue_search' ? t('sourceSearch') : row.source_label || t('source'); }
  function stamp(node, text, error) { node.textContent = text || ''; node.classList.toggle('is-error', !!error); }
  function translate() {
    main.querySelectorAll('[data-ug-text]').forEach(function (node) { node.textContent = t(node.dataset.ugText); });
    input.placeholder = t(archive ? 'archivePlaceholder' : 'searchPlaceholder');
    var museum = document.getElementById('ugMuseum'); if (museum) museum.placeholder = t('optional');
    var archiveLink = document.getElementById('ugArchiveLink'); if (archiveLink) archiveLink.href = '/universal-gallery/archives?lang=' + encodeURIComponent(lang());
  }
  async function jsonFetch(url, options) {
    var response = await fetch(url, options);
    var data;
    try { data = await response.json(); } catch (_) { throw new Error('Invalid response'); }
    if (!response.ok || data.ok === false) { var error = new Error(data.reason || 'request_failed'); error.data = data; error.status = response.status; throw error; }
    return data;
  }
  function stopAudio() { output.querySelectorAll('audio').forEach(function (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }); }
  function invalidate() {
    ++seq; clearTimeout(timer);
    if (searchController) searchController.abort();
    cardControllers.forEach(function (controller) { controller.abort(); }); cardControllers.clear();
    stopAudio(); output.setAttribute('aria-busy', 'false');
  }
  function clearResults() {
    output.innerHTML = ''; rows = []; empty.hidden = true; stamp(status, '');
    var welcome = document.getElementById('ugWelcome'); if (welcome) welcome.hidden = false;
    var pagination = document.getElementById('ugPagination'); if (pagination) pagination.hidden = true;
  }
  function button(action, text, attributes) { return '<button type="button" data-action="' + action + '" ' + (attributes || '') + '>' + esc(text) + '</button>'; }
  function card(row, index) {
    var image = !row.copyright && safeURL(row.image || (row.images || [])[0]);
    var source = safeURL(row.source_url);
    var languages = row.story_languages || [];
    var ourStory = !!(row.written || row.story_available || languages.length);
    var available = !!(row.story_available || row.has_narrative);
    var house = row.museum || row.source || '';
    var place = row.where && row.where !== house ? row.where : '';
    var actions = '';
    if (photoOrigin) actions += button('confirm', t('confirm'), 'class="ug-primary"');
    if (available) actions += button('read', t('read'), 'aria-expanded="false" aria-controls="ugReading' + index + '"');
    else {
      if (languages.indexOf('en') !== -1 && lang() !== 'en') actions += button('read-en', t('readEnglish'), 'aria-expanded="false" aria-controls="ugReading' + index + '"');
      if (canGenerate && row.artifact_id && !photoOrigin) actions += button('generate', t('create'), 'aria-expanded="false" aria-controls="ugReading' + index + '"');
    }
    if (source) actions += '<a href="' + esc(source) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceLabel(row)) + ' ↗</a>';
    var discovery = photoOrigin ? t('confirmHint') : row.discovery_status === 'new' ? t('newDiscovery') : row.discovery_status === 'remembered' ? t('remembered') : '';
    return '<article class="ug-artifact' + (image ? '' : ' no-image') + '" data-row="' + index + '">' +
      (image ? '<img class="ug-artifact-image" src="' + esc(image) + '" alt="' + esc(row.title) + '" loading="lazy">' : '') +
      '<div class="ug-object-body"><p class="ug-mark' + (ourStory ? ' is-ours' : '') + '">' + esc(t(ourStory ? 'supplied' : 'museumRecord')) + '</p>' +
      '<h2 class="ug-object-title">' + (row.artifact_id && row.confirmed !== false && !/^p_/.test(row.artifact_id) ? '<a href="' + artifactURL(row) + '">' + esc(row.title) + '</a>' : esc(row.title)) + '</h2>' +
      '<p class="ug-by">' + esc(row.artist || t('makerUnknown')) + (row.date ? ', ' + esc(row.date) : '') + '</p>' +
      '<p class="ug-location"><span>' + esc(house) + '</span>' + (place ? '<span>' + esc(place) + '</span>' : '') +
      (row.item_number ? '<span class="ug-accession">' + esc(t('labelNumber')) + ': ' + esc(row.item_number) + '</span>' : '') +
      (row.on_view === false ? '<span>' + esc(t('notOnView')) + '</span>' : '') + '</p>' +
      (row.teaser ? '<p class="ug-teaser">' + esc(row.teaser) + '</p>' : '') +
      '<div class="ug-actions">' + actions + '</div>' +
      (!available ? '<p class="ug-note ug-story-note">' + esc(ourStory ? t('storyOtherLanguage') : canGenerate ? t('aiCreate') : t('noStory')) + '</p>' : '') +
      (discovery ? '<p class="ug-discovery">' + esc(discovery) + '</p>' : '') +
      '<p class="ug-card-status ug-status" role="status" aria-live="polite"></p></div>' +
      '<div id="ugReading' + index + '" class="ug-read-box" hidden></div></article>';
  }
  function render(list) {
    stopAudio(); rows = list;
    output.innerHTML = list.length ? '<h2 class="ug-results-heading">' + esc(t(archive ? 'archiveHeading' : 'resultHeading')) + '</h2>' + list.map(card).join('') : '';
    empty.hidden = list.length !== 0;
    var welcome = document.getElementById('ugWelcome'); if (welcome) welcome.hidden = true;
  }
  function setLocation(query) {
    var url = new URL(archive ? '/universal-gallery/archives' : '/universal-gallery', location.origin);
    if (query) url.searchParams.set('q', query);
    url.searchParams.set('lang', lang());
    if (photoOrigin && !archive) { url.searchParams.set('origin', 'photo'); url.searchParams.set('discover', '0'); }
    if (archive && page > 1) url.searchParams.set('page', page);
    history.replaceState({}, '', url.pathname + url.search);
  }
  async function search(query, fromPhoto) {
    invalidate(); clearResults(); photoOrigin = !!fromPhoto;
    if (!fromPhoto && photoFile) removePhoto();
    if (!archive && query.length < 2) { if (query) stamp(status, t('minQuery')); setLocation(query); return; }
    var mine = seq, requestLang = lang();
    searchController = new AbortController();
    output.setAttribute('aria-busy', 'true'); stamp(status, t(archive ? 'loadingArchive' : 'searching'));
    var welcome = document.getElementById('ugWelcome'); if (welcome) welcome.hidden = true;
    setLocation(query);
    var endpoint = archive ? '/api/gallery/archive' : '/api/gallery/search';
    var queryString = '?q=' + encodeURIComponent(query) + '&lang=' + encodeURIComponent(requestLang);
    if (archive) queryString += '&page=' + page;
    if (fromPhoto) queryString += '&discover=0&origin=photo';
    try {
      var data = await jsonFetch(endpoint + queryString, {signal: searchController.signal});
      if (mine !== seq) return;
      canGenerate = !!data.can_generate;
      var list = archive ? data.items || [] : data.results || [];
      render(list);
      var count = archive ? data.total || 0 : list.length;
      stamp(status, fromPhoto && list.length ? t('photoConfirmResults') : count ? count + ' ' + t(archive ? count === 1 ? 'storySingle' : 'storiesCount' : count === 1 ? 'resultSingle' : 'resultCount') : '');
      if (archive) {
        page = data.page || page;
        document.getElementById('ugPagination').hidden = page <= 1 && !data.has_more;
        document.getElementById('ugPrevious').disabled = page <= 1;
        document.getElementById('ugNext').disabled = !data.has_more;
        document.getElementById('ugPageNumber').textContent = t('page') + ' ' + page;
      }
    } catch (error) {
      if (mine !== seq || error.name === 'AbortError') return;
      stamp(status, t(archive ? 'archiveFailed' : 'searchFailed'), true);
    } finally { if (mine === seq) output.setAttribute('aria-busy', 'false'); }
  }
  function showStory(host, row, data, selectedLang) {
    var box = host.querySelector('.ug-read-box');
    var image = !row.copyright && safeURL(row.image || (row.images || [])[0]);
    var source = safeURL(row.source_url);
    var audio = data.lang === selectedLang || !data.lang ? safeURL(data.audio, true) : '';
    var attribution = [t('collectionPhoto'), row.image_credit || row.source || row.museum || ''].filter(Boolean).join(' · ');
    var credit = data.provenance && data.provenance.kind === 'ai_assisted' ? t('aiCredit') : t('editorialCredit');
    box.innerHTML = (image ? '<figure class="ug-figure"><img class="ug-reading-image" src="' + esc(image) + '" alt="' + esc(row.title) + '"><figcaption>' + esc(attribution) + (source ? ' · <a href="' + esc(source) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceLabel(row)) + '</a>' : '') + '</figcaption></figure>' : '') +
      '<p class="ug-reading-credit">' + esc(t('originalCredit')) + '</p><p class="ug-reading-meta">' + esc(credit) + (data.minutes ? ' · ' + esc(data.minutes) + ' ' + esc(t('minuteRead')) : '') + '</p>' +
      (audio ? '<div class="ug-audio-wrap"><audio controls preload="none" aria-label="' + esc(t('listen')) + '" src="' + esc(audio) + '"></audio><p class="ug-note">' + esc(t('headphones')) + '</p></div>' : '') +
      '<div class="ug-reading-text i18n-skip" lang="' + esc(selectedLang) + '"></div><div class="ug-actions"><a href="' + artifactURL(row, selectedLang) + '">' + esc(t('permalink')) + '</a>' + button('close-story', t('hideStory')) + '</div>';
    box.querySelector('.ug-reading-text').textContent = data.text || '';
    box.hidden = false;
    var audioNode = box.querySelector('audio');
    if (audioNode) audioNode.addEventListener('error', function () { var note = box.querySelector('.ug-audio-wrap .ug-note'); if (note) note.textContent = t('audioFailed'); }, {once: true});
    host.querySelectorAll('[data-action="read"], [data-action="read-en"], [data-action="generate"]').forEach(function (node) { node.setAttribute('aria-expanded', 'true'); });
  }
  async function readStory(host, row, generate, selectedLang) {
    if (!row.artifact_id) return;
    var mine = seq, note = host.querySelector('.ug-card-status'), controller = new AbortController();
    cardControllers.add(controller);
    var buttons = host.querySelectorAll('[data-action="read"], [data-action="read-en"], [data-action="generate"]');
    buttons.forEach(function (node) { node.disabled = true; });
    stamp(note, t(generate ? 'writing' : 'opening'));
    try {
      var data = await jsonFetch(generate ? '/api/gallery/generate' : '/api/gallery/artifacts/' + encodeURIComponent(row.artifact_id) + '/story?lang=' + encodeURIComponent(selectedLang),
        generate ? {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({artifact_id: row.artifact_id, lang: selectedLang}), signal: controller.signal} : {signal: controller.signal});
      if (mine !== seq || !host.isConnected) return;
      if (!data.text) throw new Error('empty_story');
      showStory(host, row, data, selectedLang); stamp(note, generate ? t('savedStory') : '');
      if (generate) {
        row.written = true; row.story_available = true; row.has_narrative = true; row.provenance = data.provenance;
        row.story_languages = Array.from(new Set((row.story_languages || []).concat(selectedLang)));
        var marker = host.querySelector('.ug-mark'); marker.textContent = t('supplied'); marker.classList.add('is-ours');
        var create = host.querySelector('[data-action="generate"]'); if (create) { create.dataset.action = 'read'; create.textContent = t('read'); }
        var oldNote = host.querySelector('.ug-story-note'); if (oldNote) oldNote.remove();
      }
    } catch (error) {
      if (mine !== seq || error.name === 'AbortError' || !host.isConnected) return;
      var reason = error.data && error.data.reason;
      stamp(note, t(reason === 'story_missing' ? 'storyMissing' : reason === 'in_progress' ? 'storyBusy' : ['no_engine','monthly_limit','unavailable','provider_disabled'].indexOf(reason) !== -1 ? 'unavailable' : 'storyFailed'), true);
      if (reason === 'story_missing' && selectedLang !== 'en' && (error.data.available_languages || []).indexOf('en') !== -1 && !host.querySelector('[data-action="read-en"]')) {
        host.querySelector('.ug-actions').insertAdjacentHTML('beforeend', button('read-en', t('readEnglish')));
      }
    } finally { cardControllers.delete(controller); if (host.isConnected) buttons.forEach(function (node) { node.disabled = false; }); }
  }
  async function confirmArtifact(host, row, btn) {
    var mine = seq, note = host.querySelector('.ug-card-status'), controller = new AbortController();
    cardControllers.add(controller); btn.disabled = true; stamp(note, t('saving'));
    try {
      var data = await jsonFetch('/api/gallery/discover', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({artifact_id: row.artifact_id, lang: lang()}), signal: controller.signal});
      if (mine !== seq || !host.isConnected) return;
      if (!data.saved) throw new Error('not_saved');
      Object.assign(row, data.artifact || {}); stamp(note, t('saved'));
      host.querySelector('.ug-object-title').innerHTML = '<a href="' + artifactURL(row) + '">' + esc(row.title) + '</a>';
      btn.remove(); var hint = host.querySelector('.ug-discovery'); if (hint) hint.textContent = t('remembered');
      if (canGenerate && !row.story_available && !host.querySelector('[data-action="generate"]')) host.querySelector('.ug-actions').insertAdjacentHTML('afterbegin', button('generate', t('create')));
    } catch (error) { if (mine === seq && error.name !== 'AbortError') { stamp(note, t('saveFailed'), true); btn.disabled = false; } }
    finally { cardControllers.delete(controller); }
  }
  output.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action]'); if (!btn) return;
    var host = btn.closest('.ug-artifact'); if (!host) return;
    var row = rows[Number(host.dataset.row)]; if (!row) return;
    var action = btn.dataset.action;
    if (action === 'confirm') { confirmArtifact(host, row, btn); return; }
    if (action === 'close-story') {
      var box = host.querySelector('.ug-read-box'); box.querySelectorAll('audio').forEach(function (audio) { audio.pause(); }); box.hidden = true;
      host.querySelectorAll('[aria-expanded]').forEach(function (node) { node.setAttribute('aria-expanded', 'false'); });
      var read = host.querySelector('[data-action="read"], [data-action="read-en"]'); if (read) read.focus(); return;
    }
    readStory(host, row, action === 'generate', action === 'read-en' ? 'en' : lang());
  });
  output.addEventListener('error', function (event) {
    var image = event.target;
    if (image.tagName !== 'IMG') return;
    var host = image.closest('.ug-artifact');
    if (image.classList.contains('ug-artifact-image') && host) host.classList.add('no-image');
    image.remove();
  }, true);
  output.addEventListener('play', function (event) {
    if (event.target.tagName === 'AUDIO') output.querySelectorAll('audio').forEach(function (audio) { if (audio !== event.target) audio.pause(); });
  }, true);
  document.getElementById('ugSearchForm').addEventListener('submit', function (event) { event.preventDefault(); page = 1; search(input.value.trim(), false); });
  input.addEventListener('input', function () {
    invalidate(); clearResults(); photoOrigin = false; page = 1;
    var query = input.value.trim();
    if (!archive && query.length < 2) { setLocation(query); return; }
    timer = setTimeout(function () { search(query, false); }, 450);
  });
  function removePhoto() {
    ++photoSeq;
    // A submitted identification keeps its single-flight lock until the server
    // answers. Aborting only the browser would leave a paid provider call alive.
    if (photoController && !photoBusy) photoController.abort();
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = null; photoFile = null; candidates = [];
    var preview = document.getElementById('ugPhotoPreview'); if (!preview) return;
    preview.hidden = true; document.getElementById('ugPreviewImage').removeAttribute('src');
    document.getElementById('ugCamera').value = ''; document.getElementById('ugUpload').value = '';
    document.getElementById('ugCandidates').innerHTML = ''; document.getElementById('ugPhotoConsent').checked = false;
    document.getElementById('ugIdentify').disabled = true; stamp(document.getElementById('ugPhotoStatus'), '');
  }
  function showPhoto(open) {
    var panel = document.getElementById('ugPhotoPanel'); if (!panel) return;
    panel.hidden = !open; document.getElementById('ugPhotoToggle').setAttribute('aria-expanded', String(open));
    if (!open) { removePhoto(); document.getElementById('ugPhotoToggle').focus(); }
    else document.getElementById('ugCamera').focus();
  }
  function selectPhoto(event) {
    var file = event.target.files && event.target.files[0]; if (!file) return;
    removePhoto(); var note = document.getElementById('ugPhotoStatus');
    if (file.size > 6 * 1024 * 1024) { stamp(note, t('photoLarge'), true); return; }
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { stamp(note, t('photoType'), true); return; }
    photoFile = file; photoURL = URL.createObjectURL(file);
    document.getElementById('ugPreviewImage').src = photoURL; document.getElementById('ugPhotoPreview').hidden = false;
    stamp(note, t('photoReady'));
  }
  async function identifyPhoto(event) {
    event.preventDefault(); var note = document.getElementById('ugPhotoStatus');
    if (photoBusy) return;
    if (!photoFile) { stamp(note, t('photoWaiting'), true); return; }
    if (!document.getElementById('ugPhotoConsent').checked) { stamp(note, t('photoConsentNeeded'), true); return; }
    var mine = ++photoSeq, btn = document.getElementById('ugIdentify');
    if (photoController) photoController.abort();
    var controller = new AbortController(); photoController = controller; photoBusy = true;
    var body = new FormData(); body.append('photo', photoFile); body.append('museum', document.getElementById('ugMuseum').value.trim());
    body.append('query', input.value.trim()); body.append('lang', lang()); body.append('consent', 'anthropic-photo-search-v1');
    btn.disabled = true; document.getElementById('ugCandidates').innerHTML = ''; stamp(note, t('photoIdentifying'));
    try {
      var data = await jsonFetch('/api/gallery/identify', {method: 'POST', body: body, signal: controller.signal});
      if (mine !== photoSeq) return;
      candidates = data.candidates || [];
      if (!candidates.length) { stamp(note, t('photoNoMatch')); return; }
      stamp(note, t('possibleMatches'));
      document.getElementById('ugCandidates').innerHTML = '<ol class="ug-candidates">' + candidates.map(function (candidate, index) {
        return '<li><h3>' + esc(candidate.title || candidate.query || t('possible')) + '</h3><p>' + esc([candidate.artist, candidate.museum, candidate.item_number].filter(Boolean).join(' · ')) + '</p>' +
          (candidate.reason ? '<p>' + esc(candidate.reason) + '</p>' : '') + '<button type="button" data-candidate="' + index + '">' + esc(t('checkCollection')) + '</button></li>';
      }).join('') + '</ol>';
    } catch (error) {
      if (mine !== photoSeq || error.name === 'AbortError') return;
      var reason = error.data && error.data.reason;
      var message = ['unavailable','no_engine','provider_disabled','not_configured'].indexOf(reason) !== -1 ? 'photoUnavailable' :
        reason === 'consent_required' ? 'photoConsentNeeded' :
        error.status === 413 ? 'photoLarge' :
        ['bad_image','invalid_image','corrupt_image','unsupported_image','unsupported_type'].indexOf(reason) !== -1 ? 'photoCorrupt' :
        reason === 'no_match' ? 'photoNoMatch' : reason === 'provider_timeout' ? 'photoTimeout' :
        ['busy','rate_limited'].indexOf(reason) !== -1 ? 'photoRateLimit' : reason === 'monthly_limit' ? 'photoLimit' :
        ['provider_unavailable','invalid_response'].indexOf(reason) !== -1 ? 'photoProviderError' : 'photoFailed';
      stamp(note, t(message), true);
      if (error.data && error.data.label_text) document.getElementById('ugCandidates').innerHTML = '<p class="ug-note">' + esc(t('labelRead')) + ': ' + esc(error.data.label_text) + '</p>';
    } finally {
      if (photoController === controller) {
        photoBusy = false;
        btn.disabled = !photoFile || !document.getElementById('ugPhotoConsent').checked;
      }
    }
  }
  if (!archive) {
    document.getElementById('ugPhotoToggle').addEventListener('click', function () { showPhoto(document.getElementById('ugPhotoPanel').hidden); });
    document.getElementById('ugEmptyPhoto').addEventListener('click', function () { showPhoto(true); });
    document.getElementById('ugPhotoClose').addEventListener('click', function () { showPhoto(false); });
    document.getElementById('ugPhotoRemove').addEventListener('click', removePhoto);
    document.getElementById('ugCamera').addEventListener('change', selectPhoto); document.getElementById('ugUpload').addEventListener('change', selectPhoto);
    document.getElementById('ugPhotoConsent').addEventListener('change', function () { document.getElementById('ugIdentify').disabled = photoBusy || !photoFile || !this.checked; });
    document.getElementById('ugPhotoForm').addEventListener('submit', identifyPhoto);
    document.getElementById('ugCandidates').addEventListener('click', function (event) {
      var btn = event.target.closest('[data-candidate]'); if (!btn) return;
      var candidate = candidates[Number(btn.dataset.candidate)]; if (!candidate) return;
      var query = candidate.query || candidate.item_number || candidate.title;
      if (!query) return; input.value = query.slice(0, 80); search(input.value, true);
    });
  } else {
    var select = document.getElementById('ugArchiveLang');
    var initialLang = explicitLang || (window.psxLang ? window.psxLang() : 'en');
    select.value = [].some.call(select.options, function (option) { return option.value === initialLang; }) ? initialLang : 'en';
    function syncArchiveLanguages() {
      var canonical = document.querySelectorAll('#i18nMenu [data-l]');
      if (!canonical.length) return;
      var current = select.value;
      select.innerHTML = Array.from(canonical).map(function (option) { return '<option value="' + esc(option.dataset.l) + '">' + esc(option.textContent) + '</option>'; }).join('');
      select.value = current;
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncArchiveLanguages, {once: true}); else syncArchiveLanguages();
    select.addEventListener('change', function () { explicitLang = this.value; translate(); page = 1; search(input.value.trim(), false); });
    document.getElementById('ugPrevious').addEventListener('click', function () { if (page > 1) { --page; search(input.value.trim(), false); } });
    document.getElementById('ugNext').addEventListener('click', function () { ++page; search(input.value.trim(), false); });
  }
  async function openArtifact(id) {
    invalidate(); clearResults(); var mine = seq; searchController = new AbortController();
    stamp(status, t('opening')); output.setAttribute('aria-busy', 'true');
    try {
      var data = await jsonFetch('/api/gallery/artifacts/' + encodeURIComponent(id) + '?lang=' + encodeURIComponent(lang()), {signal: searchController.signal});
      if (mine !== seq) return;
      canGenerate = !!data.can_generate; var row = data.artifact || data;
      if (!row.artifact_id) throw new Error('missing_artifact');
      input.value = row.title || ''; render([row]); stamp(status, '');
      document.title = row.title + ' · Universal Gallery';
      if (row.story_available || row.has_narrative) readStory(output.querySelector('.ug-artifact'), row, false, lang());
    } catch (error) { if (mine === seq && error.name !== 'AbortError') stamp(status, t('artifactMissing'), true); }
    finally { if (mine === seq) output.setAttribute('aria-busy', 'false'); }
  }
  document.addEventListener('psx:lang', function () {
    explicitLang = window.psxLang ? window.psxLang() : document.documentElement.lang.slice(0, 2);
    if (archive) { var select = document.getElementById('ugArchiveLang'); if ([].some.call(select.options, function (o) { return o.value === explicitLang; })) select.value = explicitLang; }
    translate(); removePhoto(); var match = location.pathname.match(/^\/universal-gallery\/artifacts\/([^/]+)\/?$/);
    if (match) openArtifact(decodeURIComponent(match[1])); else if (archive || input.value.trim().length >= 2) search(input.value.trim(), photoOrigin);
  });
  window.addEventListener('pagehide', function () { invalidate(); removePhoto(); });
  translate(); input.value = (params.get('q') || '').slice(0, 80); page = Math.max(1, Number(params.get('page')) || 1);
  var artifactMatch = location.pathname.match(/^\/universal-gallery\/artifacts\/([^/]+)\/?$/);
  if (artifactMatch) openArtifact(decodeURIComponent(artifactMatch[1]));
  else if (archive || input.value.trim().length >= 2) search(input.value.trim(), !archive && params.get('origin') === 'photo');
  if (params.get('photo') === '1' && !archive) showPhoto(true);
})();
