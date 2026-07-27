/* 🤖 JARVIS WIDGET — Sean's butler, floating on every page of the site.
   OWNER-ONLY: the widget asks /api/jarvis/status first and builds nothing
   unless the owner session is live — public visitors never see it and the
   chat endpoint is owner-gated server-side anyway. */
(function () {
    if (window.__jarvisWidget) return;
    window.__jarvisWidget = true;

    function build() {
        var css =
            '#jvBtn{position:fixed;bottom:18px;left:18px;z-index:650;width:56px;height:56px;border-radius:50%;border:2px solid rgba(77,166,255,.7);' +
            'background:#0b1220 url("/media/jarvis_avatar.png") center/cover no-repeat;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.5),0 0 18px rgba(77,166,255,.35);' +
            'transition:transform .16s ease,box-shadow .16s ease;padding:0;}' +
            '#jvBtn:hover{transform:scale(1.08);box-shadow:0 12px 32px rgba(0,0,0,.55),0 0 26px rgba(77,166,255,.55);}' +
            '#jvPanel{position:fixed;bottom:84px;left:18px;z-index:650;width:min(360px,calc(100vw - 36px));max-height:min(520px,70vh);display:none;' +
            'flex-direction:column;background:#0d1526;border:1px solid #26395c;border-radius:14px;box-shadow:0 18px 48px rgba(0,0,0,.6);overflow:hidden;' +
            'font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}' +
            '#jvPanel.open{display:flex;}' +
            '#jvHead{display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(135deg,#0f172a,#1e3a8a);}' +
            '#jvHead img{width:34px;height:34px;border-radius:50%;border:1px solid rgba(77,166,255,.6);}' +
            '#jvHead .t{color:#fff;font-weight:800;font-size:.95rem;}' +
            '#jvHead .s{color:#94a6c6;font-size:.68rem;margin-top:1px;}' +
            '#jvClose{margin-left:auto;background:none;border:none;color:#94a6c6;font-size:1.1rem;cursor:pointer;}' +
            '#jvLog{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:120px;}' +
            '.jvMsg{max-width:86%;padding:8px 11px;border-radius:12px;font-size:.84rem;line-height:1.45;white-space:pre-wrap;word-wrap:break-word;}' +
            '.jvMsg.me{align-self:flex-end;background:#2563eb;color:#fff;border-bottom-right-radius:4px;}' +
            '.jvMsg.jv{align-self:flex-start;background:#182845;color:#dfe8f7;border:1px solid #26395c;border-bottom-left-radius:4px;}' +
            '.jvMsg.typing{color:#94a6c6;font-style:italic;}' +
            '#jvForm{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #26395c;background:#121f38;}' +
            '#jvIn{flex:1;background:#1c2e4f;border:1px solid #26395c;border-radius:9px;color:#dfe8f7;padding:9px 11px;font-size:.86rem;outline:none;}' +
            '#jvIn::placeholder{color:#5d7195;}' +
            '#jvSend{background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;border-radius:9px;color:#fff;font-weight:800;padding:0 14px;cursor:pointer;font-size:.86rem;}' +
            '#jvSend:disabled{opacity:.55;cursor:default;}';
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        var btn = document.createElement('button');
        btn.id = 'jvBtn';
        btn.title = 'Jarvis';
        document.body.appendChild(btn);

        var panel = document.createElement('div');
        panel.id = 'jvPanel';
        panel.innerHTML =
            '<div id="jvHead"><img src="/media/jarvis_avatar.png" alt="Jarvis">' +
            '<div><div class="t">Jarvis</div><div class="s">your butler · knows the live business numbers</div></div>' +
            '<button id="jvClose">✕</button></div>' +
            '<div id="jvLog"></div>' +
            '<form id="jvForm"><input id="jvIn" placeholder="Ask about bookings, payouts, the day…" autocomplete="off">' +
            '<button id="jvSend" type="submit">Send</button></form>';
        document.body.appendChild(panel);

        var log = panel.querySelector('#jvLog');
        var input = panel.querySelector('#jvIn');
        var send = panel.querySelector('#jvSend');
        var history = [];
        try { history = JSON.parse(sessionStorage.getItem('jv_history') || '[]'); } catch (e) {}

        function add(role, text) {
            var d = document.createElement('div');
            d.className = 'jvMsg ' + (role === 'user' ? 'me' : 'jv');
            d.textContent = text;
            log.appendChild(d);
            log.scrollTop = log.scrollHeight;
            return d;
        }
        history.forEach(function (h) { add(h.role, h.text); });
        if (!history.length) add('jv', 'Good day, sir. The site and I are at your service — ask me about bookings, payouts, drivers, or anything on your mind.');

        function remember(role, text) {
            history.push({ role: role, text: text });
            history = history.slice(-12);
            try { sessionStorage.setItem('jv_history', JSON.stringify(history)); } catch (e) {}
        }

        btn.addEventListener('click', function () {
            panel.classList.toggle('open');
            if (panel.classList.contains('open')) input.focus();
        });
        panel.querySelector('#jvClose').addEventListener('click', function () { panel.classList.remove('open'); });

        panel.querySelector('#jvForm').addEventListener('submit', function (e) {
            e.preventDefault();
            var msg = (input.value || '').trim();
            if (!msg || send.disabled) return;
            input.value = '';
            add('user', msg);
            remember('user', msg);
            send.disabled = true;
            var typing = add('jv', 'thinking…');
            typing.classList.add('typing');
            fetch('/api/jarvis', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, history: history.slice(0, -1) })
            }).then(function (r) { return r.json(); }).then(function (j) {
                typing.remove();
                send.disabled = false;
                var reply = j.ok ? j.reply : ('⚠️ ' + (j.error || 'Something went wrong.'));
                add('jv', reply);
                if (j.ok) remember('jv', reply);
                input.focus();
            }).catch(function () {
                typing.remove();
                send.disabled = false;
                add('jv', '⚠️ Connection problem — try again.');
            });
        });
    }

    // owner-only: build nothing unless the owner session is live
    fetch('/api/jarvis/status').then(function (r) { return r.json(); }).then(function (j) {
        if (j && j.available) build();
    }).catch(function () {});
})();
