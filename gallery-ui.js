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
  var rows = [], canGenerate = false, page = 1, photoOrigin = false, savedSearchOnly = false;
  var photoFile = null, photoURL = null, photoSeq = 0, photoController = null, photoBusy = false, candidates = [], labelText = '', visualDescription = '';
  var pickerConsent = false, permittedPhoto = null, consentOpener = null;
  var selectedResultSeq = -1;
  var storyJobs = new Set(), confirmationJobs = new Set(), attachmentJobs = new Set(), attachmentRetries = new Map();
  var researchJobs = new Set(), pendingResearch = null, researchSavedSeq = -1;
  var explicitLang = params.get('lang') || '';
  var copy = {
    context: ['Art, objects and the stories they carry', '艺术、文物，以及它们的故事'],
    title: ['Universal Gallery', '环球艺廊'],
    lede: ['Start with something that caught your eye. Find its museum record, discover our story, and give the next visitor more to explore.', '从吸引你的那件作品开始。查阅博物馆记录，发现我们撰写的故事，也为下一位访客留下更多发现。'],
    searchLabel: ['Artwork, artist or label number', '作品、艺术家或藏品编号'], search: ['Search', '搜索'],
    searchHint: ['The number on the museum label is often the closest match.', '展品标签上的藏品编号通常能找到最准确的结果。'],
    searchPlaceholder: ['Try Cypresses or 49.30', '例如 Cypresses 或 49.30'],
    photoSearch: ['Search with a photograph', '拍照寻找藏品'],
    textInstead: ['Use text search instead', '改用文字搜索'],
    searchMuseumsToo: ['Search museum collections too', '也搜索博物馆馆藏'],
    savedMatches: ['Matches already in our gallery', '艺廊中已有的匹配藏品'],
    archiveLink: ['Written by us artifact archives', '我们撰写的藏品故事档案'],
    photoHeading: ['Your photograph', '你的照片'], close: ['Close', '关闭'],
    photoIntro: ['Take a photo, check the match, discover its story.', '拍张照片，确认藏品，发现它的故事。'],
    camera: ['Take a photograph', '拍摄照片'], choosePhoto: ['Take or choose a photo', '拍照或选择照片'],
    removePhoto: ['Remove photograph', '移除照片'], museumHint: ['Museum or location, if you know it', '博物馆或所在地（选填）'],
    addDetails: ['Add a museum or location (optional)', '补充博物馆或所在地（选填）'],
    identify: ['Try photo search again', '重试照片搜索'], optional: ['Optional', '选填'],
    photoDialogTitle: ['Search and save your photo?', '搜索并保存你的照片？'],
    photoDialogText: ['We’ll send the photo to Anthropic to identify the artwork. When you open the matching artifact, we’ll add the photo to its public page.', '我们会将照片发送给 Anthropic 识别藏品。你打开匹配的藏品时，照片会加入该藏品的公开页面。'],
    photoDialogNote: ['Continue only if you may share the photo and artwork. No people or private details. Metadata is removed.', '请确认你有权分享照片及其中的艺术作品。请勿包含人物或私人信息。元数据会被移除。'],
    photoYes: ['Yes, continue', '好的，继续'], photoNo: ['Not now', '暂时不用'],
    photoPrivacy: ['Shared only after you confirm the match. Please exclude people or private details. Photo metadata is removed.', '确认匹配后才会分享。照片请勿包含人物或私人信息。照片元数据会被移除。'],
    photoConsent: ['Send my photo and the details I enter to Anthropic to identify the artwork.', '同意将照片及填写的信息发送给 Anthropic 识别藏品。'],
    photoPermissions: ['Photo permissions', '照片授权'],
    photoPublish: ['Optional: Share my photo with this artifact. I have permission to publish the photo and artwork.', '选填：将照片分享至这件藏品。我有权公开照片及其中的艺术作品。'],
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
    confirm: ['Open artifact', '打开藏品'], confirmHint: ['Choose the matching artifact.', '选择匹配的藏品。'],
    saved: ['Object confirmed and saved to the gallery.', '藏品已确认并保存到艺廊。'],
    queued: ['Object saved. Its story is queued in your selected language and will join the archive when written.', '藏品已保存，所选语言的故事已加入待写队列，完成后会加入故事档案。'],
    queuedNoEngine: ['Saved. A story will be added when writing is available.', '已保存，写作服务可用后会添加故事。'],
    photoAttaching: ['Adding your permitted photograph to this object…', '正在将已授权的照片加入这件藏品…'],
    photoAttached: ['Your photograph is now part of this object’s public archive, credited as a visitor photograph.', '照片已加入这件藏品的公开档案，标注为访客照片。'],
    photoAttachFailed: ['The object is saved, but your photo was not added. You can retry the photo separately.', '藏品已保存，但照片未能加入。可以单独重试保存照片。'],
    photoAttachRetry: ['Retry adding photograph', '重试加入照片'],
    photoConsentWithdrawn: ['Your photo has not been added because publication permission is not selected.', '未选择公开授权，因此照片没有加入档案。'],
    visitorPhoto: ['Visitor photograph', '访客照片'],
    visitorPhotoCredit: ['Shared with publication permission. Separate from the museum’s collection photograph.', '已获公开授权，与博物馆官方馆藏照片分开标注。'],
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
    photoWaiting: ['Choose a photograph first.', '请先选择照片。'], photoConsentNeeded: ['Please read and select the photo identification consent before continuing.', '继续前，请阅读并勾选照片识别授权。'],
    photoLarge: ['Please choose a photograph smaller than 6 MB.', '请选择小于 6 MB 的照片。'],
    photoType: ['Please use a JPEG, PNG or WebP photograph. On iPhone, you can choose a compatible image from Photos.', '请使用 JPEG、PNG 或 WebP 照片。iPhone 用户可以从照片中选择兼容的图片。'],
    photoReady: ['Photo ready.', '照片已准备好。'],
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
    possibleMatches: ['Other possible matches', '其他可能的匹配'],
    checkCollection: ['Find this in the collections', '在馆藏中核对'], possible: ['Possible match', '可能匹配'],
    photoConfirmResults: ['Choose the matching artifact.', '选择匹配的藏品。'],
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
  function communityPhotos(row) {
    var photos = (row.community_photos || []).filter(function (photo) { return safeURL(photo.url, true); }).slice(0, 8);
    if (!photos.length) return '';
    return '<div class="ug-community-photos">' + photos.map(function (photo) {
      return '<figure class="ug-community-photo"><img src="' + esc(safeURL(photo.url, true)) + '" alt="' + esc(t('visitorPhoto') + ': ' + row.title) + '" loading="lazy"><figcaption>' + esc(t('visitorPhoto')) + '. ' + esc(t('visitorPhotoCredit')) + '</figcaption></figure>';
    }).join('') + '</div>';
  }
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
    if (available && !photoOrigin) actions += button('read', t('read'), 'aria-expanded="false" aria-controls="ugReading' + index + '"');
    else if (!photoOrigin) {
      if (languages.indexOf('en') !== -1 && lang() !== 'en') actions += button('read-en', t('readEnglish'), 'aria-expanded="false" aria-controls="ugReading' + index + '"');
      if (canGenerate && row.artifact_id && !photoOrigin) actions += button('generate', t('create'), 'aria-expanded="false" aria-controls="ugReading' + index + '"');
    }
    if (source) actions += '<a href="' + esc(source) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceLabel(row)) + ' ↗</a>';
    var discovery = photoOrigin ? '' : row.discovery_status === 'new' ? t('newDiscovery') : row.discovery_status === 'remembered' ? t('remembered') : '';
    return '<article class="ug-artifact' + (image ? '' : ' no-image') + '" data-row="' + index + '">' +
      (image ? '<img class="ug-artifact-image" src="' + esc(image) + '" alt="' + esc(row.title) + '" loading="lazy">' : '') +
      '<div class="ug-object-body"><p class="ug-mark' + (ourStory ? ' is-ours' : '') + '">' + esc(t(ourStory ? 'supplied' : 'museumRecord')) + '</p>' +
      '<h2 class="ug-object-title">' + (row.artifact_id && !photoOrigin && row.confirmed !== false && !/^p_/.test(row.artifact_id) ? '<a href="' + artifactURL(row) + '">' + esc(row.title) + '</a>' : esc(row.title)) + '</h2>' +
      '<p class="ug-by">' + esc(row.artist || t('makerUnknown')) + (row.date ? ', ' + esc(row.date) : '') + '</p>' +
      '<p class="ug-location"><span>' + esc(house) + '</span>' + (place ? '<span>' + esc(place) + '</span>' : '') +
      (row.item_number ? '<span class="ug-accession">' + esc(t('labelNumber')) + ': ' + esc(row.item_number) + '</span>' : '') +
      (row.on_view === false ? '<span>' + esc(t('notOnView')) + '</span>' : '') + '</p>' +
      (row.teaser ? '<p class="ug-teaser">' + esc(row.teaser) + '</p>' : '') +
      '<div class="ug-actions">' + actions + '</div>' +
      (!available && !photoOrigin ? '<p class="ug-note ug-story-note">' + esc(ourStory ? t('storyOtherLanguage') : canGenerate ? t('aiCreate') : t('noStory')) + '</p>' : '') +
      (discovery ? '<p class="ug-discovery">' + esc(discovery) + '</p>' : '') +
      '<p class="ug-card-status ug-status" role="status" aria-live="polite"></p><p class="ug-photo-attachment" role="status" aria-live="polite"></p></div>' + communityPhotos(row) +
      '<div id="ugReading' + index + '" class="ug-read-box" hidden></div></article>';
  }
  function render(list) {
    stopAudio(); rows = list;
    output.innerHTML = list.length ? '<h2 class="ug-results-heading">' + esc(t(archive ? 'archiveHeading' : savedSearchOnly ? 'savedMatches' : 'resultHeading')) + '</h2>' +
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
    if (!fromPhoto && photoFile) removePhoto();
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
      '<div class="ug-reading-text i18n-skip" lang="' + esc(selectedLang) + '"></div>' + historicalAttribution(data, row) + '<div class="ug-actions"><a href="' + artifactURL(row, selectedLang) + '">' + esc(t('permalink')) + '</a>' + button('close-story', t('hideStory')) + '</div>';
    box.querySelector('.ug-reading-text').textContent = data.text || '';
    box.hidden = false;
    var audioNode = box.querySelector('audio');
    if (audioNode) audioNode.addEventListener('error', function () { var note = box.querySelector('.ug-audio-wrap .ug-note'); if (note) note.textContent = t('audioFailed'); }, {once: true});
    host.querySelectorAll('[data-action="read"], [data-action="read-en"], [data-action="generate"]').forEach(function (node) { node.setAttribute('aria-expanded', 'true'); });
  }
  async function readStory(host, row, generate, selectedLang) {
    if (!row.artifact_id) return;
    var jobKey = row.artifact_id + ':' + selectedLang;
    if (storyJobs.has(jobKey)) return;
    storyJobs.add(jobKey);
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
      // A confirmed catalogue candidate can resolve to an existing archive
      // object. A successful read earns the same marker as a completed write.
      if (data.text && selectedLang === lang()) {
        row.written = true; row.story_available = true; row.has_narrative = true; row.provenance = data.provenance;
        row.story_languages = Array.from(new Set((row.story_languages || []).concat(selectedLang)));
        var marker = host.querySelector('.ug-mark'); marker.textContent = t('supplied'); marker.classList.add('is-ours');
        var create = host.querySelector('[data-action="generate"]'); if (create) { create.dataset.action = 'read'; create.textContent = t('read'); }
        var oldNote = host.querySelector('.ug-story-note'); if (oldNote) oldNote.remove();
      }
    } catch (error) {
      if (mine !== seq || error.name === 'AbortError' || !host.isConnected) return;
      var reason = error.data && error.data.reason;
      stamp(note, t(reason === 'story_missing' ? 'storyMissing' : reason === 'in_progress' ? 'storyBusy' : reason === 'no_engine' && row.confirmedByVisitor ? 'queuedNoEngine' : ['no_engine','monthly_limit','unavailable','provider_disabled'].indexOf(reason) !== -1 ? 'unavailable' : 'storyFailed'), true);
      if (reason === 'story_missing' && selectedLang !== 'en' && (error.data.available_languages || []).indexOf('en') !== -1 && !host.querySelector('[data-action="read-en"]')) {
        host.querySelector('.ug-actions').insertAdjacentHTML('beforeend', button('read-en', t('readEnglish')));
      }
    } finally { storyJobs.delete(jobKey); cardControllers.delete(controller); if (host.isConnected) buttons.forEach(function (node) { node.disabled = false; }); }
  }
  async function attachPhoto(host, row, attachment) {
    var note = host.querySelector('.ug-photo-attachment'), mine = seq;
    if (attachmentJobs.has(row.artifact_id)) return;
    if (!permittedPhoto || permittedPhoto !== attachment.file || attachment.file !== photoFile) {
      stamp(note, t('photoConsentWithdrawn')); return;
    }
    attachmentJobs.add(row.artifact_id);
    var retry = host.querySelector('[data-action="retry-photo"]'); if (retry) retry.disabled = true;
    stamp(note, '');
    try {
      var body = new FormData(); body.append('photo', attachment.file);
      body.append('publication_consent', 'gallery-photo-publication-v1'); body.append('attachment_token', attachment.token);
      var data = await jsonFetch('/api/gallery/artifacts/' + encodeURIComponent(row.artifact_id) + '/photo', {method: 'POST', body: body});
      if (mine !== seq || !host.isConnected) return;
      row.community_photos = data.photos || (row.community_photos || []).concat(data.photo ? [data.photo] : []);
      attachmentRetries.delete(row.artifact_id);
      if (retry) retry.remove();
      var old = host.querySelector('.ug-community-photos'); if (old) old.remove();
      host.insertAdjacentHTML('beforeend', communityPhotos(row)); stamp(note, '');
    } catch (_) {
      if (mine !== seq || !host.isConnected) return;
      attachmentRetries.set(row.artifact_id, attachment); stamp(note, t('photoAttachFailed'), true);
      if (!retry) host.querySelector('.ug-actions').insertAdjacentHTML('beforeend', button('retry-photo', t('photoAttachRetry')));
    } finally { attachmentJobs.delete(row.artifact_id); if (retry && host.isConnected) retry.disabled = false; }
  }
  async function confirmArtifact(host, row, btn) {
    if (confirmationJobs.has(row.artifact_id) || row.confirmedByVisitor) return;
    var jobKey = row.artifact_id, selectedLang = lang(); confirmationJobs.add(jobKey); selectedResultSeq = seq; stamp(status, '');
    var consentFile = photoFile, permitPublication = !!(consentFile && permittedPhoto === consentFile);
    var mine = seq, note = host.querySelector('.ug-card-status'), controller = new AbortController();
    cardControllers.add(controller); btn.disabled = true; stamp(note, t('saving'));
    try {
      var data = await jsonFetch('/api/gallery/discover', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({artifact_id: row.artifact_id, lang: selectedLang}), signal: controller.signal});
      if (mine !== seq || !host.isConnected) return;
      if (!data.saved) throw new Error('not_saved');
      Object.assign(row, data.artifact || {}); row.confirmedByVisitor = true; stamp(note, t('saved')); stamp(status, '');
      host.querySelector('.ug-object-title').innerHTML = '<a href="' + artifactURL(row) + '">' + esc(row.title) + '</a>';
      btn.remove(); var hint = host.querySelector('.ug-discovery'); if (hint) hint.textContent = t('remembered');
      if (permitPublication && data.attachment_token) attachPhoto(host, row, {file: consentFile, token: data.attachment_token});
      else if (permitPublication) stamp(host.querySelector('.ug-photo-attachment'), t('photoAttachFailed'), true);
      var ready = row.story_available || row.has_narrative;
      var enabled = typeof data.can_generate === 'boolean' ? data.can_generate : canGenerate;
      if (ready && !host.querySelector('[data-action="read"]')) host.querySelector('.ug-actions').insertAdjacentHTML('afterbegin', button('read', t('read')));
      if (!ready && enabled && !host.querySelector('[data-action="generate"]')) host.querySelector('.ug-actions').insertAdjacentHTML('afterbegin', button('generate', t('create')));
      if (ready) await readStory(host, row, false, selectedLang);
      else if (enabled) await readStory(host, row, true, selectedLang);
      else stamp(note, t(data.writing_status === 'queued' ? 'queued' : 'queuedNoEngine'));
    } catch (error) { if (mine === seq && error.name !== 'AbortError') { stamp(note, t('saveFailed'), true); btn.disabled = false; } }
    finally { confirmationJobs.delete(jobKey); cardControllers.delete(controller); }
  }
  output.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action]'); if (!btn) return;
    if (btn.dataset.action === 'search-catalogues') { search(input.value.trim(), photoOrigin, true); return; }
    var host = btn.closest('.ug-artifact'); if (!host) return;
    var row = rows[Number(host.dataset.row)]; if (!row) return;
    var action = btn.dataset.action;
    if (action === 'confirm') { confirmArtifact(host, row, btn); return; }
    if (action === 'retry-photo') { var attachment = attachmentRetries.get(row.artifact_id); if (attachment) attachPhoto(host, row, attachment); return; }
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
  document.getElementById('ugSearchForm').addEventListener('submit', function (event) { event.preventDefault(); page = 1; search(input.value.trim(), photoOrigin); });
  input.addEventListener('input', function () {
    invalidate(); clearResults(); page = 1;
    var query = input.value.trim();
    if (!archive && query.length < 2) { setLocation(query); return; }
    timer = setTimeout(function () { search(query, photoOrigin); }, 450);
  });
  function removePhoto() {
    ++photoSeq;
    // A submitted identification keeps its single-flight lock until the server
    // answers. Aborting only the browser would leave a paid provider call alive.
    if (photoController && !photoBusy) photoController.abort();
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = null; photoFile = null; permittedPhoto = null; pickerConsent = false; candidates = []; labelText = ''; visualDescription = ''; attachmentRetries.clear();
    var preview = document.getElementById('ugPhotoPreview'); if (!preview) return;
    preview.hidden = true; document.getElementById('ugPreviewImage').removeAttribute('src');
    document.getElementById('ugCamera').value = ''; document.getElementById('ugUpload').value = '';
    document.getElementById('ugCandidates').innerHTML = '';
    document.getElementById('ugPhotoPanel').classList.remove('has-photo');
    document.getElementById('ugIdentify').disabled = true; document.getElementById('ugIdentify').hidden = true;
    stamp(document.getElementById('ugPhotoStatus'), '');
  }
  function showPhoto(open) {
    var panel = document.getElementById('ugPhotoPanel'); if (!panel) return;
    panel.hidden = !open; document.getElementById('ugPhotoToggle').setAttribute('aria-expanded', String(open));
    if (!open) document.getElementById('ugPhotoToggle').focus();
    else document.getElementById('ugPhotoPick').focus();
  }
  function syncPhotoActions() {
    ['ugPhotoToggle', 'ugEmptyPhoto', 'ugPhotoPick'].forEach(function (id) { document.getElementById(id).disabled = photoBusy; });
    document.getElementById('ugIdentify').disabled = photoBusy || !photoFile || permittedPhoto !== photoFile;
  }
  function requestPhoto(event) {
    if (photoBusy) return;
    pickerConsent = false; consentOpener = event && event.currentTarget || document.getElementById('ugPhotoToggle');
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
    if (!dialog.open || photoBusy) return;
    pickerConsent = true; dialog.close();
    // Keep the native picker in this trusted click handler. Deferring it until
    // a promise or timer would break camera access in mobile browsers.
    var picker = document.getElementById('ugUpload'); picker.value = ''; picker.click();
  }
  function selectPhoto(event) {
    var file = event.target.files && event.target.files[0]; if (!file) return;
    if (!pickerConsent || photoBusy) { event.target.value = ''; return; }
    removePhoto(); invalidate(); clearResults(); photoOrigin = false; var note = document.getElementById('ugPhotoStatus');
    showPhoto(true);
    if (file.size > 6 * 1024 * 1024) { stamp(note, t('photoLarge'), true); return; }
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { stamp(note, t('photoType'), true); return; }
    photoFile = file; permittedPhoto = file; photoURL = URL.createObjectURL(file);
    document.getElementById('ugPhotoPanel').classList.add('has-photo');
    document.getElementById('ugPreviewImage').src = photoURL; document.getElementById('ugPhotoPreview').hidden = false;
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
    if (photoBusy) return;
    if (!photoFile) { stamp(note, t('photoWaiting'), true); return; }
    if (permittedPhoto !== photoFile) { stamp(note, t('photoConsentNeeded'), true); return; }
    var mine = ++photoSeq, searchAtIdentification = seq, btn = document.getElementById('ugIdentify'); photoOrigin = true;
    if (photoController) photoController.abort();
    var controller = new AbortController(); photoController = controller; photoBusy = true;
    var body = new FormData(); body.append('photo', photoFile); body.append('museum', document.getElementById('ugMuseum').value.trim());
    body.append('query', input.value.trim()); body.append('lang', lang()); body.append('consent', 'anthropic-photo-search-v1');
    btn.hidden = true; syncPhotoActions(); document.getElementById('ugCandidates').innerHTML = ''; stamp(note, t('photoIdentifying'));
    try {
      var data = await jsonFetch('/api/gallery/identify', {method: 'POST', body: body, signal: controller.signal});
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
        ['busy','rate_limited'].indexOf(reason) !== -1 ? 'photoRateLimit' : reason === 'monthly_limit' ? 'photoLimit' :
        ['provider_unavailable','invalid_response'].indexOf(reason) !== -1 ? 'photoProviderError' : 'photoFailed';
      stamp(note, t(message), true);
      btn.hidden = false;
      if (reason === 'no_match' && error.data && (error.data.label_text || error.data.visual_description)) presentIdentification(error.data, seq === searchAtIdentification);
    } finally {
      if (photoController === controller) {
        photoBusy = false;
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
    document.getElementById('ugPhotoYes').addEventListener('click', acceptPhoto);
    document.getElementById('ugPhotoNo').addEventListener('click', declinePhoto);
    document.getElementById('ugPhotoConsentDialog').addEventListener('cancel', declinePhoto);
    document.getElementById('ugPhotoClose').addEventListener('click', function () { showPhoto(false); });
    document.getElementById('ugPhotoRemove').addEventListener('click', function () { removePhoto(); invalidate(); clearResults(); photoOrigin = false; setLocation(input.value.trim()); });
    document.getElementById('ugPhotoText').addEventListener('click', function () { removePhoto(); photoOrigin = false; showPhoto(false); search(input.value.trim(), false); input.focus(); });
    document.getElementById('ugCamera').addEventListener('change', selectPhoto); document.getElementById('ugUpload').addEventListener('change', selectPhoto);
    document.getElementById('ugUpload').addEventListener('cancel', function () { pickerConsent = false; if (consentOpener) consentOpener.focus(); });
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
