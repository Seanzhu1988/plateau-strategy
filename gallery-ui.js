/* One tap reads or creates the selected object's own story, never a photo confirmation. */
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
  var rows = [], canGenerate = false, page = 1, photoOrigin = false, savedSearchOnly = false;
  var photoFile = null, photoURL = null, photoSeq = 0, photoController = null, photoBusy = false, candidates = [], labelText = '', visualDescription = '';
  var pickerConsent = false, permittedPhoto = null, consentOpener = null, photoPickerTarget = 'ugCamera';
  var photoPreparing = false, photoPrepareController = null;
  var selectedResultSeq = -1;
  var storyJobs = new Set(), storyRequestJobs = new Set();
  var cardRevisions = new WeakMap();
  var researchJobs = new Set(), pendingResearch = null, researchSavedSeq = -1;
  var explicitLang = params.get('lang') || '';
  var copy = {
    context: ['Art, objects and the stories they carry', '艺术、文物，以及它们的故事'],
    title: ['Universal Gallery', '环球艺廊'],
    lede: ['Tap any object to read its story. If it is new to us, we’ll write and save its own story for the next visitor.', '点击任意藏品即可阅读故事。如果还没有，我们会为这件藏品撰写并保存故事，让下一位访客也能读到。'],
    searchLabel: ['Artwork, artist or label number', '作品、艺术家或藏品编号'], search: ['Search', '搜索'],
    searchHint: ['The number on the museum label is often the closest match.', '展品标签上的藏品编号通常能找到最准确的结果。'],
    searchPlaceholder: ['Try Cypresses or 49.30', '例如 Cypresses 或 49.30'],
    photoSearch: ['Search with a photograph', '拍照寻找藏品'],
    textInstead: ['Use text search instead', '改用文字搜索'],
    searchMuseumsToo: ['Search museum collections too', '也搜索博物馆馆藏'],
    savedMatches: ['Matches already in our gallery', '艺廊中已有的匹配藏品'],
    archiveLink: ['Written by us artifact archives', '我们撰写的藏品故事档案'],
    photoHeading: ['Your photograph', '你的照片'], close: ['Close', '关闭'],
    photoIntro: ['Take a photo and explore the collection results.', '拍张照片，浏览相关馆藏。'],
    camera: ['Take a photograph', '拍摄照片'], choosePhoto: ['Choose a photo', '选择照片'],
    removePhoto: ['Remove photograph', '移除照片'], museumHint: ['Museum or location, if you know it', '博物馆或所在地（选填）'],
    addDetails: ['Add a museum or location (optional)', '补充博物馆或所在地（选填）'],
    identify: ['Try photo search again', '重试照片搜索'], optional: ['Optional', '选填'],
    photoDialogTitle: ['Identify this artwork?', '识别这件藏品？'],
    photoDialogText: ['We’ll send the photo to Anthropic to identify the artwork. We save the discovery and its story, never publish your photograph.', '我们会将照片发送给 Anthropic 识别藏品，保存发现及其故事，绝不公开你的照片。'],
    photoDialogNote: ['Photo metadata is removed. No people or private details, please.', '照片元数据会被移除。请勿包含人物或私人信息。'],
    photoYes: ['Yes, continue', '好的，继续'], photoNo: ['Not now', '暂时不用'],
    photoPrivacy: ['Your photograph is used for identification, never published. Photo metadata is removed.', '照片仅用于识别，绝不公开。照片元数据会被移除。'],
    photoConsent: ['Send my photo and the details I enter to Anthropic to identify the artwork.', '同意将照片及填写的信息发送给 Anthropic 识别藏品。'],
    research: ['Not found? Save for research', '没找到？保存供研究'],
    pendingDiscovery: ['New discovery', '新发现'], unverified: ['Identity not yet verified', '身份尚未核实'],
    pendingPrivate: ['Saved for research. Your photo stays private.', '已保存供研究，照片保持私密。'],
    researchHelp: ['Cannot find it in the collections? Save the label and possible identity for research. It will stay a pending discovery, not a verified artifact or a written story.', '馆藏中没有找到？可保存展签和可能的身份供研究。这只是待核实的发现，不是已经确认的藏品或已撰写的故事。'],
    researchSaved: ['Discovery saved for research. Your photo stays private.', '发现已保存供研究，照片保持私密。'],
    researchFailed: ['The research request could not be saved. Your photo has not been published. Please try again.', '研究请求保存失败，照片没有公开。请重试。'],
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
    searching: ['Looking across the collections…', '正在查找各馆收藏…'], searchingSaved: ['Looking for this object in our gallery first…', '正在先查找艺廊中已有的藏品…'], loadingArchive: ['Opening the story archive…', '正在打开故事档案…'],
    searchFailed: ['The collections did not answer just now. Please try your search again.', '馆藏服务暂时未响应，请重新搜索。'],
    partialCollections: ['Showing matches. Some museum collections are unavailable right now.', '已显示匹配藏品，部分博物馆馆藏暂时无法访问。'],
    collectionsUnavailable: ['Some collections are unavailable. We’re keeping the clues from your photo.', '部分馆藏暂时无法访问，我们会保留照片中的线索。'],
    discoveryCollectionsUnavailable: ['Some collections are unavailable. We kept your discovery.', '部分馆藏暂时无法访问，你的发现已保存。'],
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
    viewItem: ['Read story', '阅读故事'],
    closeItem: ['Close item', '收起藏品'],
    photoUnverified: ['Photo match not verified.', '尚未核实与照片的匹配。'],
    browseHint: ['Tap anything that interests you. We’ll open or write its own story, without confirming it as a match to your photo.', '看到感兴趣的藏品就点击。我们会打开或撰写它自己的故事，不会因此认定它与你的照片匹配。'],
    storyAbout: ['Story about this collection item', '关于这件馆藏的故事'],
    saved: ['Collection item saved for its story. Your photo match is still unverified.', '已保存这件馆藏以撰写故事，照片匹配仍未核实。'],
    queued: ['Object saved. Its story is queued in your selected language and will join the archive when written.', '藏品已保存，所选语言的故事已加入待写队列，完成后会加入故事档案。'],
    queuedNoEngine: ['Saved. A story will be added when writing is available.', '已保存，写作服务可用后会添加故事。'],
    saveFailed: ['The object could not be saved. Please try again.', '藏品保存失败，请重试。'], saving: ['Saving…', '正在保存…'],
    opening: ['Opening the story…', '正在打开故事…'], writing: ['Writing your story. This can take a little time…', '正在撰写故事，请稍候…'],
    hideStory: ['Close story', '收起故事'], originalCredit: ['Original story by Plateau Strategy', 'Plateau Strategy 原创故事'],
    aiCredit: ['AI-assisted writing', 'AI 协助撰写'], editorialCredit: ['Site-curated story', '网站编辑故事'],
    historicalSource: ['Historical source', '历史资料来源'], adaptedWithAI: ['Adapted with AI.', '经 AI 辅助改编。'],
    minuteRead: ['min read', '分钟阅读'], listen: ['Listen to the story', '收听故事'], headphones: ['Headphones, please, for the people around you.', '为了身边的人，请使用耳机收听。'],
    audioFailed: ['This recording could not be loaded. The written story is available below.', '录音暂时无法加载，可以阅读下方故事。'],
    unavailable: ['Story writing is unavailable right now. The museum record is still here, and any saved story remains in the archive.', '目前暂时无法撰写新故事。馆藏记录仍可查阅，已保存的故事也仍在档案中。'],
    storyFailed: ['The story could not be opened. Please try again.', '故事暂时无法打开，请重试。'],
    storyBusy: ['This story is already being written. Please try opening it again shortly.', '这篇故事正在撰写中，请稍后再打开。'],
    storyMissing: ['We have not written this story in your selected language yet.', '这篇故事还没有当前所选语言的版本。'],
    collectionPhoto: ['Collection photograph', '馆藏照片'], noImage: ['Image unavailable. Check the collection source.', '暂无图片，请查阅馆藏来源。'],
    photoWaiting: ['Choose a photograph first.', '请先选择照片。'], photoConsentNeeded: ['Tap the camera and allow identification to continue.', '请点击相机并同意识别后继续。'],
    photoLarge: ['This photo is too large. Take a new photo or choose a smaller copy.', '这张照片太大，请重新拍照或选择较小的副本。'],
    photoType: ['Please use a JPEG, PNG or WebP photograph. On iPhone, you can choose a compatible image from Photos.', '请使用 JPEG、PNG 或 WebP 照片。iPhone 用户可以从照片中选择兼容的图片。'],
    photoReady: ['Photo ready.', '照片已准备好。'],
    photoPreparing: ['Preparing your photo…', '正在处理照片…'],
    photoPrepareFailed: ['Your photo could not be prepared. Take a new photo or choose a JPEG.', '无法处理这张照片，请重新拍照或选择 JPEG 照片。'],
    photoFormat: ['This browser cannot read that photo format. Take a new photo or choose a JPEG.', '此浏览器无法读取该照片格式，请重新拍照或选择 JPEG 照片。'],
    photoIdentifying: ['Reading the object and its label…', '正在识别藏品和展签…'],
    photoUnavailable: ['Photo identification is not connected yet. Search the title, artist, or museum label instead.', '照片识别尚未连接。请先使用作品名称、艺术家或展签编号搜索。'],
    photoNoMatch: ['We could not identify a reliable match. Try a clearer photograph of the label, or search its words directly.', '未能找到可靠匹配。请试试更清晰的展签照片，或直接搜索标签上的文字。'],
    photoCorrupt: ['This photograph could not be read. Please choose another JPEG, PNG or WebP image.', '无法读取这张照片，请选择其他 JPEG、PNG 或 WebP 图片。'],
    photoFailed: ['Identification did not finish. You can try again or search the words on the label.', '识别未能完成，可以重试，或搜索展签上的文字。'],
    photoTimeout: ['Photo search did not finish in time. Your photo is ready if you want to try again.', '照片搜索未及时完成，照片已保留，可以重试。'],
    photoRateLimit: ['Photo search is busy. Please wait a minute before trying again.', '照片搜索目前繁忙，请稍等一分钟后重试。'],
    photoLimit: ['Photo identification has reached its current allowance. You can still search by title, artist or label number.', '照片识别已达到当前额度，仍可使用名称、艺术家或藏品编号搜索。'],
    photoProviderError: ['Photo identification is temporarily unavailable. Please try again later or search the words on the label.', '照片识别服务暂时无法使用，请稍后重试，或搜索展签上的文字。'],
    photoServicePaused: ['Photo identification is paused on our side. You can still search by name or label.', '网站照片识别服务暂时暂停，仍可搜索名称或展签文字。'],
    labelRead: ['Text found on the label', '识别到的展签文字'],
    possibleMatches: ['Other possible matches', '其他可能的匹配'],
    checkCollection: ['Find this in the collections', '在馆藏中核对'], possible: ['Possible match', '可能匹配'],
    photoConfirmResults: ['Explore these collection results. Photo match not verified.', '浏览这些馆藏结果，照片匹配尚未核实。'],
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
    // Also refuse stale API/cache responses containing retired visitor assets.
    var decoded = value;
    try { for (var i = 0; i < 3; i++) decoded = decodeURIComponent(decoded); } catch (_) { return ''; }
    try { decoded = new URL(decoded.replace(/\\/g, '/'), location.origin).pathname.replace(/\/+/g, '/'); } catch (_) { return ''; }
    if (/(?:^|\/)(?:api\/gallery\/photos|gallery_photos)(?:\/|[?#]|$)/i.test(decoded)) return '';
    try { var u = new URL(value, location.origin); if (!/^https?:$/.test(u.protocol)) return ''; if (!local && !/^https?:\/\//i.test(value)) return ''; return u.href; } catch (_) { return ''; }
  }
  function catalogueImage(row) {
    if (row.copyright || [row.source_kind, row.image_kind, row.photo_kind].some(function (kind) {
      return /^visitor[_ -]photo(?:graph)?$/i.test(kind || '');
    })) return '';
    return safeURL(row.image || (row.images || [])[0]);
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
    pendingResearch = null;
    if (searchController) searchController.abort();
    cardControllers.forEach(function (controller) { controller.abort(); }); cardControllers.clear();
    stopAudio(); output.setAttribute('aria-busy', 'false');
  }
  function clearResults() {
    output.innerHTML = ''; rows = []; savedSearchOnly = false; empty.hidden = true; stamp(status, '');
    var research = document.getElementById('ugResearch'); if (research) research.hidden = true;
    var researchStatus = document.getElementById('ugResearchStatus'); if (researchStatus) stamp(researchStatus, '');
    var researchButton = document.getElementById('ugResearchSave'); if (researchButton) researchButton.disabled = researchJobs.has(seq);
    var welcome = document.getElementById('ugWelcome'); if (welcome) welcome.hidden = false;
    var pagination = document.getElementById('ugPagination'); if (pagination) pagination.hidden = true;
  }
  function button(action, text, attributes) { return '<button type="button" data-action="' + action + '" ' + (attributes || '') + '>' + esc(text) + '</button>'; }
  function cardRevision(host) { return cardRevisions.get(host) || 0; }
  function card(row, index) {
    var image = catalogueImage(row);
    var source = safeURL(row.source_url);
    var languages = row.story_languages || [];
    var ourStory = !!(row.written || row.story_available || languages.length);
    var available = !!(row.story_available || row.has_narrative);
    var house = row.museum || row.source || '';
    var place = row.where && row.where !== house ? row.where : '';
    var actions = '';
    if (row.artifact_id) actions += button('view-item', t('viewItem'), 'class="ug-primary" aria-expanded="false" aria-controls="ugReading' + index + '"');
    if (languages.indexOf('en') !== -1 && lang() !== 'en') actions += button('read-en', t('readEnglish'), 'aria-expanded="false" aria-controls="ugReading' + index + '"');
    if (source) actions += '<a href="' + esc(source) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceLabel(row)) + ' ↗</a>';
    var discovery = photoOrigin ? '' : row.discovery_status === 'new' ? t('newDiscovery') : row.discovery_status === 'remembered' ? t('remembered') : '';
    return '<article class="ug-artifact' + (image ? '' : ' no-image') + '" data-row="' + index + '">' +
      (image ? '<img class="ug-artifact-image" src="' + esc(image) + '" alt="' + esc(row.title) + '" loading="lazy">' : '') +
      '<div class="ug-object-body"><p class="ug-mark' + (ourStory ? ' is-ours' : '') + '">' + esc(t(ourStory ? 'supplied' : 'museumRecord')) + '</p>' +
      '<h2 class="ug-object-title">' + esc(row.title) + '</h2>' +
      '<p class="ug-by">' + esc(row.artist || t('makerUnknown')) + (row.date ? ', ' + esc(row.date) : '') + '</p>' +
      '<p class="ug-location"><span>' + esc(house) + '</span>' + (place ? '<span>' + esc(place) + '</span>' : '') +
      (row.item_number ? '<span class="ug-accession">' + esc(t('labelNumber')) + ': ' + esc(row.item_number) + '</span>' : '') +
      (row.on_view === false ? '<span>' + esc(t('notOnView')) + '</span>' : '') + '</p>' +
      (row.teaser ? '<p class="ug-teaser">' + esc(row.teaser) + '</p>' : '') +
      (photoOrigin ? '<p class="ug-note ug-match-note">' + esc(t('photoUnverified')) + '</p>' : '') +
      '<div class="ug-actions">' + actions + '</div>' +
      (!available && !photoOrigin ? '<p class="ug-note ug-story-note">' + esc(ourStory ? t('storyOtherLanguage') : canGenerate ? t('aiCreate') : t('noStory')) + '</p>' : '') +
      (discovery ? '<p class="ug-discovery">' + esc(discovery) + '</p>' : '') +
      '<p class="ug-card-status ug-status" role="status" aria-live="polite"></p></div>' +
      '<div id="ugReading' + index + '" class="ug-read-box" hidden></div></article>';
  }
  function render(list) {
    stopAudio(); rows = list;
    output.innerHTML = list.length ? '<h2 class="ug-results-heading">' + esc(t(archive ? 'archiveHeading' : savedSearchOnly ? 'savedMatches' : 'resultHeading')) + '</h2>' +
      (photoOrigin ? '<p class="ug-note">' + esc(t('browseHint')) + '</p>' : '') +
      list.map(card).join('') : '';
    empty.hidden = list.length !== 0;
    var research = document.getElementById('ugResearch'); if (research) research.hidden = !photoOrigin || list.length !== 0;
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
  async function search(query, fromPhoto, includeCatalogues, bringIntoView) {
    invalidate(); clearResults(); photoOrigin = !!fromPhoto;
    if (!fromPhoto && (photoFile || photoPreparing)) removePhoto();
    if (!archive && query.length < 2) { if (query) stamp(status, t('minQuery')); setLocation(query); return; }
    var mine = seq, requestLang = lang();
    searchController = new AbortController();
    output.setAttribute('aria-busy', 'true'); stamp(status, t(archive ? 'loadingArchive' : fromPhoto && !includeCatalogues ? 'searchingSaved' : 'searching'));
    var welcome = document.getElementById('ugWelcome'); if (welcome) welcome.hidden = true;
    setLocation(query);
    var endpoint = archive ? '/api/gallery/archive' : '/api/gallery/search';
    var queryString = '?q=' + encodeURIComponent(query) + '&lang=' + encodeURIComponent(requestLang);
    if (archive) queryString += '&page=' + page;
    if (fromPhoto) queryString += '&discover=0&origin=photo';
    try {
      var data, collectionsUnavailable = false;
      if (fromPhoto && !archive) {
        var remembered = [], archiveUnavailable = false, outcomes = [];
        if (!includeCatalogues) {
          try {
            data = await jsonFetch(endpoint + queryString + '&scope=archive', {signal: searchController.signal});
            remembered = data.results || []; canGenerate = !!data.can_generate;
          } catch (error) {
            if (error.name === 'AbortError') throw error;
            archiveUnavailable = true;
          }
          if (mine !== seq) return;
        }
        // Keep saved stories visible while checking other collections. Opening one
        // owns this view, so late search responses must never replace its reading.
        savedSearchOnly = remembered.length > 0;
        if (remembered.length) render(remembered);
        stamp(status, t('searching'));
        var planned = bringIntoView ? photoSearchPlan(query) : [query];
        var controller = searchController;
        async function catalogue(next) {
          try {
            var result = await jsonFetch(endpoint + '?q=' + encodeURIComponent(next) + '&lang=' + encodeURIComponent(requestLang) + '&discover=0&origin=photo', {signal: controller.signal});
            return {query: next, data: result, partial: result.partial === true || Number(result.source_failures) > 0};
          } catch (error) {
            if (error.name === 'AbortError') throw error;
            return {query: next, error: error};
          }
        }
        function matches(outcome) { return outcome.data && outcome.data.results || []; }
        outcomes.push(await catalogue(planned[0]));
        if (mine !== seq || selectedResultSeq === mine) return;
        if (!remembered.length && !matches(outcomes[0]).length && planned.length > 1) {
          // Each lookup fans out to four sources, and the server has eight
          // source slots. Two fair workers leave every hypothesis a real turn.
          var alternatives = planned.slice(1), nextAlternative = 0, alternativeResults = [];
          async function searchAlternative() {
            while (nextAlternative < alternatives.length) {
              var position = nextAlternative++;
              alternativeResults[position] = await catalogue(alternatives[position]);
              if (mine !== seq || selectedResultSeq === mine) return;
            }
          }
          await Promise.all([searchAlternative(), searchAlternative()]);
          outcomes = outcomes.concat(alternativeResults);
          if (mine !== seq || selectedResultSeq === mine) return;
        }
        if (!remembered.length && !outcomes.some(function (outcome) { return matches(outcome).length; })) {
          var retry = outcomes.find(function (outcome) {
            return outcome.partial || outcome.error && (!outcome.error.status || outcome.error.status >= 500 || outcome.error.status === 408);
          });
          if (retry) {
            // One safe catalogue retry only: never repeat the paid photo call.
            var recovered = await catalogue(retry.query);
            if (mine !== seq || selectedResultSeq === mine) return;
            outcomes[outcomes.indexOf(retry)] = recovered;
          }
        }
        collectionsUnavailable = archiveUnavailable || outcomes.some(function (outcome) { return outcome.partial || outcome.error; });
        var seen = new Set(), combined = remembered.slice();
        outcomes.forEach(function (outcome) {
          if (outcome.data) {
            if (typeof outcome.data.can_generate === 'boolean') canGenerate = outcome.data.can_generate;
            combined = combined.concat(matches(outcome));
          }
        });
        data = {can_generate: canGenerate, results: combined.filter(function (row) {
          var identity = row.artifact_id || [row.museum, row.item_number, row.title].join('|');
          if (seen.has(identity)) return false; seen.add(identity); return true;
        })};
        var winning = outcomes.find(function (outcome) { return matches(outcome).length; });
        if (!remembered.length && winning && winning.query !== query) { input.value = winning.query; setLocation(winning.query); }
        savedSearchOnly = false;
      } else {
        data = await jsonFetch(endpoint + queryString, {signal: searchController.signal});
      }
      if (mine !== seq) return;
      canGenerate = !!data.can_generate;
      var list = archive ? data.items || [] : data.results || [];
      render(list);
      if (collectionsUnavailable && !list.length) empty.hidden = true;
      if (bringIntoView) {
        var destination = list.length || collectionsUnavailable ? output : empty;
        if (typeof destination.scrollIntoView === 'function') destination.scrollIntoView({block: 'start'});
        destination.setAttribute('tabindex', '-1'); destination.focus({preventScroll: true});
      }
      var count = archive ? data.total || 0 : list.length;
      stamp(status, collectionsUnavailable ? t(list.length ? 'partialCollections' : 'collectionsUnavailable') : fromPhoto && list.length ? t('photoConfirmResults') : count ? count + ' ' + t(archive ? count === 1 ? 'storySingle' : 'storiesCount' : count === 1 ? 'resultSingle' : 'resultCount') : '');
      if (fromPhoto && bringIntoView && !list.length && (candidates.length || labelText || visualDescription)) saveResearch({collectionsUnavailable: collectionsUnavailable});
      if (archive) {
        page = data.page || page;
        document.getElementById('ugPagination').hidden = page <= 1 && !data.has_more;
        document.getElementById('ugPrevious').disabled = page <= 1;
        document.getElementById('ugNext').disabled = !data.has_more;
        document.getElementById('ugPageNumber').textContent = t('page') + ' ' + page;
      }
    } catch (error) {
      if (mine !== seq || selectedResultSeq === mine || error.name === 'AbortError') return;
      stamp(status, rows.length && fromPhoto ? t('partialCollections') : t(archive ? 'archiveFailed' : 'searchFailed'), true);
      if (fromPhoto && !rows.length && (candidates.length || labelText || visualDescription)) {
        render([]); empty.hidden = true;
        saveResearch({collectionsUnavailable: true});
      }
    } finally { if (mine === seq) output.setAttribute('aria-busy', 'false'); }
  }
  function historicalAttribution(data, row) {
    var source = data.research_source || row.research_source;
    if (!source || typeof source !== 'object' || Array.isArray(source) || typeof source.label !== 'string') return '';
    function credit(value, address) {
      var url = safeURL(address);
      return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(value) + '</a>' : esc(value);
    }
    var line = esc(t('historicalSource')) + ': ' + credit(source.label, source.url);
    if (typeof source.license === 'string' && source.license) line += ' · ' + credit(source.license, source.license_url);
    if (source.adapted === true) line += '. ' + esc(t('adaptedWithAI'));
    return '<p class="ug-note ug-research-source">' + line + '</p>';
  }
  function collectionFigure(row) {
    var image = catalogueImage(row), source = safeURL(row.source_url);
    if (!image) return '';
    var attribution = [t('collectionPhoto'), row.image_credit || row.source || row.museum || ''].filter(Boolean).join(' · ');
    return '<figure class="ug-figure"><img class="ug-reading-image" src="' + esc(image) + '" alt="' + esc(row.title) + '"><figcaption>' + esc(attribution) + (source ? ' · <a href="' + esc(source) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceLabel(row)) + '</a>' : '') + '</figcaption></figure>';
  }
  function showStory(host, row, data, selectedLang) {
    var box = host.querySelector('.ug-read-box');
    var audio = data.lang === selectedLang || !data.lang ? safeURL(data.audio, true) : '';
    var credit = data.provenance && data.provenance.kind === 'ai_assisted' ? t('aiCredit') : t('editorialCredit');
    box.innerHTML = '<h3>' + esc(row.title) + '</h3>' + (photoOrigin ? '<p class="ug-note">' + esc(t('storyAbout') + '. ' + t('photoUnverified')) + '</p>' : '') +
      collectionFigure(row) +
      '<p class="ug-reading-credit">' + esc(t('originalCredit')) + '</p><p class="ug-reading-meta">' + esc(credit) + (data.minutes ? ' · ' + esc(data.minutes) + ' ' + esc(t('minuteRead')) : '') + '</p>' +
      (audio ? '<div class="ug-audio-wrap"><audio controls preload="none" aria-label="' + esc(t('listen')) + '" src="' + esc(audio) + '"></audio><p class="ug-note">' + esc(t('headphones')) + '</p></div>' : '') +
      '<div class="ug-reading-text i18n-skip" lang="' + esc(selectedLang) + '"></div>' + historicalAttribution(data, row) + '<div class="ug-actions"><a href="' + artifactURL(row, selectedLang) + '">' + esc(t('permalink')) + '</a>' + button('close-story', t('hideStory')) + '</div>';
    box.querySelector('.ug-reading-text').textContent = data.text || '';
    box.hidden = false;
    var audioNode = box.querySelector('audio');
    if (audioNode) audioNode.addEventListener('error', function () { var note = box.querySelector('.ug-audio-wrap .ug-note'); if (note) note.textContent = t('audioFailed'); }, {once: true});
    host.querySelectorAll('[data-action="view-item"], [data-action="read"], [data-action="read-en"], [data-action="generate"]').forEach(function (node) { node.setAttribute('aria-expanded', 'true'); });
  }
  async function readStory(host, row, generate, selectedLang) {
    if (!row.artifact_id) return;
    var jobKey = row.artifact_id + ':' + selectedLang;
    if (storyJobs.has(jobKey)) return;
    storyJobs.add(jobKey);
    var mine = seq, viewRevision = cardRevision(host), note = host.querySelector('.ug-card-status'), controller = new AbortController();
    controller.galleryHost = host;
    cardControllers.add(controller);
    var buttons = host.querySelectorAll('[data-action="view-item"], [data-action="read"], [data-action="read-en"], [data-action="generate"]');
    buttons.forEach(function (node) { node.disabled = true; });
    stamp(note, t(generate ? 'writing' : 'opening'));
    try {
      var data = await jsonFetch(generate ? '/api/gallery/generate' : '/api/gallery/artifacts/' + encodeURIComponent(row.artifact_id) + '/story?lang=' + encodeURIComponent(selectedLang),
        generate ? {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({artifact_id: row.artifact_id, lang: selectedLang}), signal: controller.signal} : {signal: controller.signal});
      if (mine !== seq || !host.isConnected || viewRevision !== cardRevision(host)) return;
      // Never put another object's or language's response under this card.
      if (data.artifact_id && data.artifact_id !== row.artifact_id || data.lang && data.lang !== selectedLang) throw new Error('story_identity_mismatch');
      if (!data.text) throw new Error('empty_story');
      showStory(host, row, data, selectedLang); stamp(note, generate ? t('savedStory') : '');
      // A confirmed catalogue candidate can resolve to an existing archive
      // object. A successful read earns the same marker as a completed write.
      if (data.text && selectedLang === lang()) {
        row.written = true; row.story_available = true; row.has_narrative = true; row.provenance = data.provenance;
        row.story_languages = Array.from(new Set((row.story_languages || []).concat(selectedLang)));
        var marker = host.querySelector('.ug-mark'); marker.textContent = t('supplied'); marker.classList.add('is-ours');
        var create = host.querySelector('[data-action="generate"]'); if (create) { create.dataset.action = 'read'; create.textContent = t('read'); }
        var oldNote = host.querySelector('.ug-story-note'); if (oldNote) oldNote.remove();
      }
      return 'ready';
    } catch (error) {
      if (mine !== seq || error.name === 'AbortError' || !host.isConnected || viewRevision !== cardRevision(host)) return;
      var reason = error.data && error.data.reason;
      stamp(note, t(reason === 'story_missing' ? 'storyMissing' : reason === 'in_progress' ? 'storyBusy' : reason === 'no_engine' && row.storyRequested ? 'queuedNoEngine' : ['no_engine','monthly_limit','unavailable','provider_disabled'].indexOf(reason) !== -1 ? 'unavailable' : 'storyFailed'), true);
      if (reason === 'story_missing' && selectedLang !== 'en' && (error.data.available_languages || []).indexOf('en') !== -1 && !host.querySelector('[data-action="read-en"]')) {
        host.querySelector('.ug-actions').insertAdjacentHTML('beforeend', button('read-en', t('readEnglish')));
      }
      return reason === 'story_missing' ? 'missing' : 'failed';
    } finally { storyJobs.delete(jobKey); cardControllers.delete(controller); if (host.isConnected) buttons.forEach(function (node) { node.disabled = false; }); }
  }
  async function viewItem(host, row, btn) {
    if (!row.artifact_id) return;
    var selectedLang = lang(), key = row.artifact_id + ':' + selectedLang;
    if (storyRequestJobs.has(key) || storyJobs.has(key)) return;
    var mine = seq, viewRevision = cardRevision(host);
    selectedResultSeq = seq; stamp(status, '');
    // The tap asks for THIS item's story, even if it is unrelated to the photo.
    // Open a closeable reading panel before any asynchronous save/read/write.
    var box = host.querySelector('.ug-read-box');
    box.innerHTML = '<h3>' + esc(row.title) + '</h3><p class="ug-note">' + esc(t('museumRecord') + (photoOrigin ? '. ' + t('photoUnverified') : '')) + '</p>' +
      collectionFigure(row) +
      '<p class="ug-reading-text">' + esc([row.teaser, row.medium, row.culture, row.dimensions].filter(Boolean).join('\n\n')) + '</p>' +
      '<div class="ug-actions">' + button('close-story', t('closeItem')) + '</div>';
    box.hidden = false; btn.setAttribute('aria-expanded', 'true');
    if (lang() !== 'en' && (row.story_languages || []).indexOf('en') !== -1 && !host.querySelector('[data-action="read-en"]')) {
      host.querySelector('.ug-actions').insertAdjacentHTML('beforeend', button('read-en', t('readEnglish')));
    }
    if (row.story_available || row.has_narrative || row.storyRequested) {
      var result = await readStory(host, row, false, selectedLang);
      if (result !== 'missing' || mine !== seq || viewRevision !== cardRevision(host) || !host.isConnected) return;
      row.story_available = false; row.has_narrative = false;
    }
    await requestSelectedStory(host, row, btn, selectedLang);
  }
  async function requestSelectedStory(host, row, btn, selectedLang) {
    var jobKey = row.artifact_id, lockKey = jobKey + ':' + selectedLang, canonicalLock = null;
    if (storyRequestJobs.has(lockKey)) return;
    storyRequestJobs.add(lockKey); selectedResultSeq = seq; stamp(status, '');
    var mine = seq, viewRevision = cardRevision(host), note = host.querySelector('.ug-card-status'), controller = new AbortController();
    controller.galleryHost = host;
    cardControllers.add(controller); btn.disabled = true; stamp(note, t('saving'));
    try {
      var data = {};
      if (!(row.storyRequestedLanguages || []).includes(selectedLang) || row.storyCanGenerate === false) {
        data = await jsonFetch('/api/gallery/discover', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({artifact_id: jobKey, lang: selectedLang, intent: 'write_story'}), signal: controller.signal});
        if (mine !== seq || !host.isConnected || viewRevision !== cardRevision(host)) return;
        if (!data.saved) throw new Error('not_saved');
        // A candidate may acquire a canonical ID, but an existing object must
        // never be retargeted. Bind every save reply to this request/language.
        var canonical = data.artifact;
        if (data.requested_artifact_id !== jobKey || data.lang !== selectedLang ||
            !canonical || typeof canonical.artifact_id !== 'string' || !/^a_/.test(canonical.artifact_id) ||
            !/^p_/.test(jobKey) && canonical.artifact_id !== jobKey) throw new Error('saved_identity_mismatch');
        Object.assign(row, canonical); row.storyRequested = true;
        row.storyRequestedLanguages = Array.from(new Set((row.storyRequestedLanguages || []).concat(selectedLang)));
        row.storyCanGenerate = typeof data.can_generate === 'boolean' ? data.can_generate : canGenerate;
        canonicalLock = row.artifact_id + ':' + selectedLang; storyRequestJobs.add(canonicalLock);
        host.querySelector('.ug-object-title').textContent = row.title;
      }
      stamp(note, t(photoOrigin ? 'saved' : 'remembered')); stamp(status, '');
      var hint = host.querySelector('.ug-discovery'); if (hint) hint.textContent = t('remembered');
      var ready = row.story_available || row.has_narrative;
      var enabled = row.storyCanGenerate;
      if (ready) {
        var existing = await readStory(host, row, false, selectedLang);
        if (existing !== 'missing' || mine !== seq || !host.isConnected || viewRevision !== cardRevision(host)) return;
        row.story_available = false; row.has_narrative = false;
      }
      if (enabled) await readStory(host, row, true, selectedLang);
      else stamp(note, t(data.writing_status === 'queued' ? 'queued' : 'queuedNoEngine'));
    } catch (error) { if (mine === seq && viewRevision === cardRevision(host) && host.isConnected && error.name !== 'AbortError') { stamp(note, t('saveFailed'), true); btn.disabled = false; } }
    finally { storyRequestJobs.delete(lockKey); if (canonicalLock) storyRequestJobs.delete(canonicalLock); cardControllers.delete(controller); if (host.isConnected) btn.disabled = false; }
  }
  output.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action]');
    if (!btn) {
      // Images, names and non-interactive card space share the same one-tap
      // action. Source links, reading text and audio retain their own behavior.
      if (event.target.closest('a, button, audio, .ug-read-box')) return;
      var tapped = event.target.closest('.ug-artifact');
      if (!tapped) return;
      btn = tapped.querySelector('[data-action="view-item"]'); if (!btn) return;
    }
    event.preventDefault();
    if (btn.dataset.action === 'search-catalogues') { search(input.value.trim(), photoOrigin, true); return; }
    var host = btn.closest('.ug-artifact'); if (!host) return;
    var row = rows[Number(host.dataset.row)]; if (!row) return;
    var action = btn.dataset.action;
    if (action === 'view-item') { viewItem(host, row, btn); return; }
    if (action === 'close-story') {
      cardRevisions.set(host, cardRevision(host) + 1);
      cardControllers.forEach(function (controller) { if (controller.galleryHost === host) controller.abort(); });
      stamp(host.querySelector('.ug-card-status'), '');
      var box = host.querySelector('.ug-read-box'); box.querySelectorAll('audio').forEach(function (audio) { audio.pause(); }); box.hidden = true;
      host.querySelectorAll('[aria-expanded]').forEach(function (node) { node.setAttribute('aria-expanded', 'false'); });
      var read = host.querySelector('[data-action="view-item"], [data-action="read"], [data-action="read-en"]'); if (read) read.focus(); return;
    }
    if (['read', 'read-en', 'generate'].indexOf(action) === -1) return;
    if (action === 'read-en') {
      cardRevisions.set(host, cardRevision(host) + 1);
      cardControllers.forEach(function (controller) { if (controller.galleryHost === host) controller.abort(); });
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
  document.getElementById('ugSearchForm').addEventListener('submit', function (event) { event.preventDefault(); page = 1; search(input.value.trim(), photoOrigin); });
  input.addEventListener('input', function () {
    // Typing starts a new journey immediately, before the search debounce.
    // An unsubmitted prepared photo must not start a paid job over that query.
    if (photoPreparing) removePhoto();
    invalidate(); clearResults(); page = 1;
    var query = input.value.trim();
    if (!archive && query.length < 2) { setLocation(query); return; }
    timer = setTimeout(function () { search(query, photoOrigin); }, 450);
  });
  function removePhoto() {
    ++photoSeq;
    if (photoPrepareController) photoPrepareController.abort();
    photoPrepareController = null; photoPreparing = false;
    // A submitted identification keeps its single-flight lock until the server
    // answers. Aborting only the browser would leave a paid provider call alive.
    if (photoController && !photoBusy) photoController.abort();
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = null; photoFile = null; permittedPhoto = null; pickerConsent = false; candidates = []; labelText = ''; visualDescription = '';
    var preview = document.getElementById('ugPhotoPreview'); if (!preview) return;
    preview.hidden = true; document.getElementById('ugPreviewImage').removeAttribute('src');
    document.getElementById('ugCamera').value = ''; document.getElementById('ugUpload').value = '';
    document.getElementById('ugCandidates').innerHTML = '';
    document.getElementById('ugPhotoPanel').classList.remove('has-photo');
    document.getElementById('ugIdentify').disabled = true; document.getElementById('ugIdentify').hidden = true;
    stamp(document.getElementById('ugPhotoStatus'), '');
    syncPhotoActions();
  }
  function showPhoto(open) {
    var panel = document.getElementById('ugPhotoPanel'); if (!panel) return;
    panel.hidden = !open; document.getElementById('ugPhotoToggle').setAttribute('aria-expanded', String(open));
    if (!open) document.getElementById('ugPhotoToggle').focus();
    else document.getElementById('ugPhotoPick').focus();
  }
  function syncPhotoActions() {
    ['ugPhotoToggle', 'ugEmptyPhoto', 'ugPhotoPick', 'ugPhotoLibrary', 'ugPhotoRetake'].forEach(function (id) {
      var action = document.getElementById(id); if (action) action.disabled = photoBusy || photoPreparing;
    });
    document.getElementById('ugIdentify').disabled = photoBusy || photoPreparing || !photoFile || permittedPhoto !== photoFile;
  }
  function requestPhoto(event) {
    if (photoBusy || photoPreparing) return;
    pickerConsent = false; consentOpener = event && event.currentTarget || document.getElementById('ugPhotoToggle');
    photoPickerTarget = consentOpener.id === 'ugPhotoLibrary' || consentOpener.id === 'ugPhotoPick' ? 'ugUpload' : 'ugCamera';
    var dialog = document.getElementById('ugPhotoConsentDialog');
    if (dialog.open) return;
    dialog.showModal(); document.getElementById('ugPhotoYes').focus();
  }
  function declinePhoto(event) {
    if (event) event.preventDefault();
    pickerConsent = false;
    var dialog = document.getElementById('ugPhotoConsentDialog'); if (dialog.open) dialog.close();
    if (consentOpener) consentOpener.focus();
  }
  function acceptPhoto() {
    var dialog = document.getElementById('ugPhotoConsentDialog');
    if (!dialog.open || photoBusy || photoPreparing) return;
    pickerConsent = true; dialog.close();
    // Keep the native picker in this trusted click handler. Deferring it until
    // a promise or timer would break camera access in mobile browsers.
    var picker = document.getElementById(photoPickerTarget); picker.value = ''; picker.click();
  }
  async function selectPhoto(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) { pickerConsent = false; return; }
    if (!pickerConsent || photoBusy || photoPreparing || event.target.id !== photoPickerTarget) { event.target.value = ''; return; }
    removePhoto(); invalidate(); clearResults(); photoOrigin = false; var note = document.getElementById('ugPhotoStatus');
    showPhoto(true);
    var controller = new AbortController(), mine = photoSeq;
    photoPrepareController = controller; photoPreparing = true; syncPhotoActions(); stamp(note, t('photoPreparing'));
    try {
      if (!window.PSXGalleryPhoto || typeof window.PSXGalleryPhoto.prepare !== 'function') throw new Error('preparation_unavailable');
      var prepared = await window.PSXGalleryPhoto.prepare(file, {signal: controller.signal});
      if (mine !== photoSeq || controller.signal.aborted) return;
      // Consent follows this sanitized copy of the selected photograph only.
      photoFile = prepared; permittedPhoto = prepared; photoURL = URL.createObjectURL(prepared);
      document.getElementById('ugPhotoPanel').classList.add('has-photo');
      document.getElementById('ugPreviewImage').src = photoURL; document.getElementById('ugPhotoPreview').hidden = false;
    } catch (error) {
      if (mine !== photoSeq || controller.signal.aborted) return;
      var reason = error.code || error.reason;
      stamp(note, t(reason === 'image_too_large' ? 'photoLarge' : reason === 'unsupported_format' ? 'photoFormat' : 'photoPrepareFailed'), true);
      return;
    } finally {
      if (photoPrepareController === controller) { photoPrepareController = null; photoPreparing = false; syncPhotoActions(); }
    }
    identifyPhoto();
  }
  function cleanQuery(value) { return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, 80) : ''; }
  function candidateQuery(candidate) {
    if (!candidate || typeof candidate !== 'object') return '';
    // A provider's explicit label number is stronger than its suggested prose.
    return cleanQuery(candidate.item_number) || cleanQuery(candidate.query) || cleanQuery(candidate.title);
  }
  function labelQuery() {
    // Keep real label words together. Never promote a year, dimension or an
    // arbitrary number inside OCR text into a supposed accession number.
    return cleanQuery(labelText.split(/\r?\n/).filter(function (line) {
      return /[A-Za-z\u00c0-\uffff]/.test(line) || /^\s*[A-Za-z]*\d+(?:[.\/-]\d+)+[A-Za-z]?\s*$/.test(line);
    }).slice(0, 2).join(' '));
  }
  function photoSearchPlan(first) {
    var plan = [], used = new Set();
    function add(value) {
      var query = cleanQuery(value);
      if (query.length >= 2 && !used.has(query.toLowerCase()) && plan.length < 4) { used.add(query.toLowerCase()); plan.push(query); }
    }
    add(first);
    candidates.forEach(function (candidate) { add(candidateQuery(candidate)); });
    add(labelQuery());
    // Each identity gets a turn before alternate wording for the same object.
    ['title', 'query'].forEach(function (key) { candidates.forEach(function (candidate) { add(candidate[key]); }); });
    return plan;
  }
  function searchCandidate(candidate) {
    var query = candidateQuery(candidate); if (query.length < 2) return false;
    input.value = query; search(query, true, false, true); return true;
  }
  function presentIdentification(data, automaticSearch) {
    var confidence = {high: 3, medium: 2, low: 1};
    candidates = (Array.isArray(data.candidates) ? data.candidates : []).filter(function (candidate) { return candidateQuery(candidate).length >= 2; }).slice(0, 3).sort(function (a, b) {
      return (confidence[b.confidence] || 0) - (confidence[a.confidence] || 0) || Number(!!cleanQuery(b.item_number)) - Number(!!cleanQuery(a.item_number));
    });
    labelText = typeof data.label_text === 'string' ? data.label_text.trim().slice(0, 1200) : '';
    visualDescription = typeof data.visual_description === 'string' ? data.visual_description.trim().slice(0, 1200) : '';
    if (visualDescription.length < 20) visualDescription = '';
    document.getElementById('ugCandidates').innerHTML = '<details class="ug-photo-alternatives"><summary>' + esc(t('possibleMatches')) + '</summary>' + (labelText ? '<p class="ug-note">' + esc(t('labelRead')) + ': ' + esc(labelText) + '</p>' : '') +
      (candidates.length ? '<ol class="ug-candidates">' + candidates.map(function (candidate, index) {
        return '<li><h3>' + esc(candidate.title || candidate.query || t('possible')) + '</h3><p>' + esc([candidate.artist, candidate.museum, candidate.item_number].filter(Boolean).join(' · ')) + '</p>' +
          (candidate.reason ? '<p>' + esc(candidate.reason) + '</p>' : '') + '<button type="button" data-candidate="' + index + '">' + esc(t('checkCollection')) + '</button></li>';
      }).join('') + '</ol>' : '') + '</details>';
    if (!candidates.length && !labelText) document.getElementById('ugCandidates').innerHTML = '';
    var strongest = candidates[0];
    var searched = automaticSearch && (strongest ? searchCandidate(strongest) : searchCandidate({query: labelQuery()}));
    stamp(document.getElementById('ugPhotoStatus'), searched || candidates.length || labelQuery() ? '' : t('photoNoMatch'));
    if (automaticSearch && !searched && visualDescription) {
      invalidate(); clearResults(); photoOrigin = true; render([]); saveResearch();
    }
  }
  async function identifyPhoto(event) {
    if (event) event.preventDefault(); var note = document.getElementById('ugPhotoStatus');
    if (photoBusy || photoPreparing) return;
    if (!photoFile) { stamp(note, t('photoWaiting'), true); return; }
    if (permittedPhoto !== photoFile) { stamp(note, t('photoConsentNeeded'), true); return; }
    var mine = ++photoSeq, searchAtIdentification = seq, btn = document.getElementById('ugIdentify'); photoOrigin = true;
    if (photoController) photoController.abort();
    var controller = new AbortController(); photoController = controller; photoBusy = true;
    var body = new FormData(); body.append('photo', photoFile); body.append('museum', document.getElementById('ugMuseum').value.trim());
    body.append('query', input.value.trim()); body.append('lang', lang()); body.append('consent', 'anthropic-photo-search-v1');
    btn.hidden = true; syncPhotoActions(); document.getElementById('ugCandidates').innerHTML = ''; stamp(note, t('photoIdentifying'));
    var deadline;
    try {
      // Bound both fetch and response-body reads. No automatic paid retry.
      // This exceeds the server's provider timeout and also releases a stuck
      // browser transport which does not settle promptly after abort.
      var timeout = new Promise(function (_, reject) {
        deadline = setTimeout(function () {
          var error = new Error('photo_timeout'); error.data = {reason: 'provider_timeout'};
          reject(error); controller.abort();
        }, 90000);
      });
      var data = await Promise.race([jsonFetch('/api/gallery/identify', {method: 'POST', body: body, signal: controller.signal}), timeout]);
      if (mine !== photoSeq) return;
      presentIdentification(data, seq === searchAtIdentification);
      if (!candidates.length && !labelQuery() && !visualDescription) btn.hidden = false;
    } catch (error) {
      if (mine !== photoSeq || error.name === 'AbortError') return;
      var reason = error.data && error.data.reason;
      var message = ['unavailable','no_engine','provider_disabled','not_configured'].indexOf(reason) !== -1 ? 'photoUnavailable' :
        reason === 'consent_required' ? 'photoConsentNeeded' :
        error.status === 413 ? 'photoLarge' :
        ['bad_image','invalid_image','corrupt_image','unsupported_image','unsupported_type'].indexOf(reason) !== -1 ? 'photoCorrupt' :
        reason === 'no_match' ? 'photoNoMatch' : reason === 'provider_timeout' ? 'photoTimeout' :
        ['busy','rate_limited','provider_rate_limited'].indexOf(reason) !== -1 ? 'photoRateLimit' : reason === 'monthly_limit' ? 'photoLimit' :
        reason === 'provider_billing' ? 'photoServicePaused' :
        ['provider_unavailable','provider_auth','provider_model_unavailable','invalid_response'].indexOf(reason) !== -1 ? 'photoProviderError' : 'photoFailed';
      stamp(note, t(message), true);
      btn.hidden = false;
      if (reason === 'no_match' && error.data && (error.data.label_text || error.data.visual_description)) presentIdentification(error.data, seq === searchAtIdentification);
    } finally {
      clearTimeout(deadline);
      if (photoController === controller) {
        photoBusy = false; photoController = null;
        syncPhotoActions();
      }
    }
  }
  async function saveResearch(options) {
    if (researchJobs.has(seq) || researchSavedSeq === seq || !photoOrigin || rows.length || (input.value.trim().length < 2 && !visualDescription)) return;
    var collectionsUnavailable = !!(options && options.collectionsUnavailable);
    var mine = seq, btn = document.getElementById('ugResearchSave'), note = document.getElementById('ugResearchStatus');
    btn.disabled = true; stamp(note, t('saving'));
    // A new photograph must not lose its discovery because an older save is
    // still finishing. Keep at most two saves in flight and one current-flow
    // continuation; leaving that flow cancels only the unstarted continuation.
    if (researchJobs.size >= 2) { pendingResearch = {seq: mine, collectionsUnavailable: collectionsUnavailable}; return; }
    researchJobs.add(mine);
    var description = visualDescription, label = labelText;
    var clues = candidates.slice(0, 3).map(function (candidate) {
      var clue = {}; ['title','artist','museum','item_number','query','confidence'].forEach(function (key) {
        if (typeof candidate[key] === 'string') clue[key] = candidate[key].slice(0, 160);
      }); return clue;
    });
    try {
      var data = await jsonFetch('/api/gallery/research', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({query: input.value.trim().slice(0, 80), museum: document.getElementById('ugMuseum').value.trim().slice(0, 160), lang: lang(), candidate_clues: clues, label_text: label, visual_description: description})});
      if (mine !== seq) return;
      if (!data.saved) throw new Error('not_saved');
      researchSavedSeq = mine;
      stamp(note, t(collectionsUnavailable ? 'discoveryCollectionsUnavailable' : 'researchSaved'));
      output.innerHTML = '<section class="ug-pending-discovery"><h2>' + esc(t('pendingDiscovery')) + '</h2><p class="ug-mark">' + esc(t('unverified')) + '</p>' +
        (description ? '<p class="ug-reading-text">' + esc(description) + '</p>' : label ? '<p>' + esc(t('labelRead') + ': ' + label) + '</p>' : '') + '<p class="ug-note">' + esc(t('pendingPrivate')) + '</p></section>';
      empty.hidden = true; stamp(status, collectionsUnavailable ? t('discoveryCollectionsUnavailable') : ''); stamp(document.getElementById('ugPhotoStatus'), '');
      if (typeof output.scrollIntoView === 'function') output.scrollIntoView({block: 'start'});
    } catch (_) { if (mine === seq) {
      stamp(note, t('researchFailed'), true); btn.disabled = false;
      // A storage outage must not throw away the useful recognition response.
      // This is a local preview, not a claim that a public artifact was saved.
      if (description || label) {
        output.innerHTML = '<section class="ug-pending-discovery"><h2>' + esc(t('pendingDiscovery')) + '</h2><p class="ug-mark">' + esc(t('unverified')) + '</p>' +
          '<p class="ug-reading-text">' + esc(description || label) + '</p><p class="ug-note">' + esc(t('researchFailed')) + '</p></section>';
        empty.hidden = true;
      }
    } }
    finally {
      researchJobs.delete(mine);
      btn.disabled = researchJobs.has(seq) || researchSavedSeq === seq || !!(pendingResearch && pendingResearch.seq === seq);
      if (pendingResearch && pendingResearch.seq === seq && researchJobs.size < 2) {
        var pending = pendingResearch; pendingResearch = null; saveResearch(pending);
      }
    }
  }
  if (!archive) {
    document.getElementById('ugPhotoToggle').addEventListener('click', requestPhoto);
    document.getElementById('ugEmptyPhoto').addEventListener('click', requestPhoto);
    document.getElementById('ugPhotoPick').addEventListener('click', requestPhoto);
    document.getElementById('ugPhotoLibrary').addEventListener('click', requestPhoto);
    document.getElementById('ugPhotoRetake').addEventListener('click', requestPhoto);
    document.getElementById('ugPhotoYes').addEventListener('click', acceptPhoto);
    document.getElementById('ugPhotoNo').addEventListener('click', declinePhoto);
    document.getElementById('ugPhotoConsentDialog').addEventListener('cancel', declinePhoto);
    document.getElementById('ugPhotoClose').addEventListener('click', function () { showPhoto(false); });
    document.getElementById('ugPhotoRemove').addEventListener('click', function () { removePhoto(); invalidate(); clearResults(); photoOrigin = false; setLocation(input.value.trim()); });
    document.getElementById('ugPhotoText').addEventListener('click', function () { removePhoto(); photoOrigin = false; showPhoto(false); search(input.value.trim(), false); input.focus(); });
    document.getElementById('ugCamera').addEventListener('change', selectPhoto); document.getElementById('ugUpload').addEventListener('change', selectPhoto);
    ['ugCamera', 'ugUpload'].forEach(function (id) {
      document.getElementById(id).addEventListener('cancel', function () { pickerConsent = false; if (consentOpener) consentOpener.focus(); });
    });
    document.getElementById('ugPhotoForm').addEventListener('submit', identifyPhoto);
    document.getElementById('ugResearchSave').addEventListener('click', saveResearch);
    document.getElementById('ugCandidates').addEventListener('click', function (event) {
      var btn = event.target.closest('[data-candidate]'); if (!btn) return;
      var candidate = candidates[Number(btn.dataset.candidate)]; if (!candidate) return;
      searchCandidate(candidate);
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
    translate(); var match = location.pathname.match(/^\/universal-gallery\/artifacts\/([^/]+)\/?$/);
    if (match) openArtifact(decodeURIComponent(match[1])); else if (archive || input.value.trim().length >= 2) search(input.value.trim(), photoOrigin);
  });
  window.addEventListener('pagehide', function () { invalidate(); removePhoto(); });
  translate(); input.value = (params.get('q') || '').slice(0, 80); page = Math.max(1, Number(params.get('page')) || 1);
  var artifactMatch = location.pathname.match(/^\/universal-gallery\/artifacts\/([^/]+)\/?$/);
  if (artifactMatch) openArtifact(decodeURIComponent(artifactMatch[1]));
  else if (archive || input.value.trim().length >= 2) search(input.value.trim(), !archive && params.get('origin') === 'photo');
  if (params.get('photo') === '1' && !archive) requestPhoto();
})();
