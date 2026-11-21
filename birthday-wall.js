(function (MB) {
  'use strict';
  var api = MB.api;
  var $ = function (id) { return document.getElementById(id); };
  function codePointLength(value) { return Array.from(String(value)).length; }

  function initWall(toast, later) {
    var list = $('wall-list');
    var empty = $('wall-empty');
    var form = $('wall-form');
    var nameInput = $('wall-name');
    var contentInput = $('wall-content');
    var nameHint = $('wall-name-hint');
    var contentHint = $('wall-content-hint');
    var msg = $('wall-msg');
    var submit = $('wall-submit');
    var compose = $('wall-compose');
    var back = $('wall-back');
    var emptyEl = empty;
    var switcher = $('wall-switch');
    if (!list || !form) return;

    var cooldownUntil = 0;
    var hasMessages = false;

    /* 一屏放不下，看祝福和写祝福分成两个视图，切换不滚动 */
    function showForm(show) {
      form.hidden = !show;
      if (switcher) switcher.hidden = show;
      list.hidden = show;
      if (emptyEl) emptyEl.hidden = show || hasMessages;
      if (show && nameInput && nameInput.focus) nameInput.focus({ preventScroll: true });
    }

    if (compose) compose.addEventListener('click', function () { showForm(true); });
    if (back) back.addEventListener('click', function () { showForm(false); });

    function renderMessages(messages) {
      list.innerHTML = '';
      if (!messages || messages.length === 0) {
        if (empty) empty.hidden = false;
        hasMessages = false;
        return;
      }
      if (empty) empty.hidden = true;
      hasMessages = true;

      messages.forEach(function (item) {
        list.appendChild(messageCard(item, false));
      });
    }

    function messageCard(item, isDemo) {
      var card = document.createElement('article');
      card.className = 'msg';

      var head = document.createElement('div');
      head.className = 'msg-head';

      var nameEl = document.createElement('p');
      nameEl.className = 'msg-name';
      nameEl.textContent = item.name || '匿名';

      head.appendChild(nameEl);

      if (isDemo || item.local || item.status === 'pending') {
        var badge = document.createElement('span');
        badge.className = 'msg-badge';
        badge.textContent = item.local ? '本机收藏' : (isDemo ? '未保存' : '待审核');
        head.appendChild(badge);
      }

      if (item.createdAt) {
        var time = document.createElement('span');
        time.className = 'msg-time';
        time.textContent = formatTime(item.createdAt);
        head.appendChild(time);
      }

      var text = document.createElement('p');
      text.className = 'msg-text';
      text.textContent = item.content || '';

      card.appendChild(head);
      card.appendChild(text);
      return card;
    }

    function formatTime(value) {
      var date = new Date(value);
      if (isNaN(date.getTime())) return '';
      var now = new Date();
      var sameYear = date.getFullYear() === now.getFullYear();
      var mm = String(date.getMonth() + 1).padStart(2, '0');
      var dd = String(date.getDate()).padStart(2, '0');
      return sameYear ? (mm + '-' + dd) : (date.getFullYear() + '-' + mm + '-' + dd);
    }

    function showSkeletons() {
      list.innerHTML = '';
      if (empty) empty.hidden = true;
      for (var i = 0; i < 2; i++) {
        var s = document.createElement('div');
        s.className = 'skeleton';
        list.appendChild(s);
      }
    }

    function showError(error) {
      list.innerHTML = '';
      var box = document.createElement('div');
      box.className = 'wall-error';

      var p = document.createElement('p');
      p.textContent = '祝福暂时没有加载出来，请稍后再试。';

      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'ghost-btn ghost-btn--sm';
      retry.style.marginTop = '12px';
      retry.textContent = '重新加载';
      retry.addEventListener('click', load);

      box.appendChild(p);
      box.appendChild(retry);
      list.appendChild(box);
      if (empty) empty.hidden = true;
    }

    var hasLoaded = false;

    function load() {
      showSkeletons();
      api.loadMessages().then(function (result) {
        if (result.error) { showError(result.error); return; }
        hasLoaded = true;
        renderMessages(result.messages);
      }).catch(function () {
        showError();
      });
    }

    /* 回到页面时悄悄刷新一次，让新审核通过的祝福出现；
       正在填写、有未保存提交、或演示模式下都不打扰 */
    function quietRefresh() {
      if (!hasLoaded || api.isMock()) return;
      if (document.activeElement && form.contains(document.activeElement)) return;
      if (list.querySelector('.msg-badge')) return;
      api.loadMessages().then(function (result) {
        if (result.error || !Array.isArray(result.messages)) return;
        renderMessages(result.messages);
      }).catch(function () { /* 静默失败 */ });
    }

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) quietRefresh();
    });

    function setHint(el, value, max) {
      if (!el) return;
      var len = codePointLength(value);
      el.textContent = len + ' / ' + max;
      var field = el.parentNode;
      if (field) field.classList.toggle('is-invalid', len > max);
    }

    function validate() {
      var name = nameInput ? nameInput.value.trim() : '';
      var content = contentInput ? contentInput.value.trim() : '';
      var ok = true;

      if (codePointLength(name) < 1 || codePointLength(name) > 20) {
        ok = false;
        if (nameInput && nameInput.parentNode) nameInput.parentNode.classList.add('is-invalid');
      }
      if (codePointLength(content) < 2 || codePointLength(content) > 200) {
        ok = false;
        if (contentInput && contentInput.parentNode) contentInput.parentNode.classList.add('is-invalid');
      }
      return ok ? { name: name, content: content } : null;
    }

    function setMsg(text, kind) {
      if (!msg) return;
      msg.textContent = text || '';
      msg.classList.remove('is-error', 'is-ok');
      if (kind) msg.classList.add(kind);
    }

    [nameInput, contentInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () {
        if (input.parentNode) input.parentNode.classList.remove('is-invalid');
        if (input === nameInput) setHint(nameHint, input.value, 20);
        if (input === contentInput) setHint(contentHint, input.value, 200);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (Date.now() < cooldownUntil) {
        setMsg('请稍等一会儿再送出。', 'is-error');
        return;
      }

      var values = validate();
      if (!values) {
        setMsg('请检查一下名字和内容。', 'is-error');
        return;
      }

      submit.disabled = true;
      setMsg('正在收藏…', null);

      api.submitMessage(values.name, values.content).then(function (result) {
        if (!result.ok) {
          var error = result.error || {};
          if (error.code === 'RATE_LIMITED') {
            var wait = 60;
            cooldownUntil = Date.now() + wait * 1000;
            setMsg('送出得有点快，等一分钟再试试。', 'is-error');
            later(function () { submit.disabled = false; }, wait * 1000);
            return;
          }
          if (error.code === 'VALIDATION_ERROR') {
            setMsg('名字 1–20 字，内容 2–200 字。', 'is-error');
          } else {
            setMsg(error.friendly || '没有送出去，请稍后再试。', 'is-error');
          }
          submit.disabled = false;
          return;
        }

        var saved = result.local ? '已收藏在当前浏览器。没有发送给其他人。' : result.demo
          ? '演示模式：这句话只显示在这里，刷新后不会保存。'
          : '祝福已收到，审核通过后就会出现在墙上。';

        setMsg(saved, 'is-ok');
        list.insertBefore(messageCard({
          name: values.name,
          content: values.content,
          status: result.local ? 'approved' : 'pending', local: !!result.local,
          createdAt: result.createdAt || new Date().toISOString()
        }, !!result.demo), list.firstChild);
        if (empty) empty.hidden = true;

        if (contentInput) { contentInput.value = ''; setHint(contentHint, '', 200); }
        submit.disabled = false;
        toast(result.local ? '已收藏在这台设备' : (result.demo ? '这条没有保存' : '祝福已送出')); hasMessages = true; showForm(false);
      }).catch(function () {
        setMsg('没有送出去，请稍后再试。', 'is-error');
        submit.disabled = false;
      });
    });

    setHint(nameHint, '', 20);
    setHint(contentHint, '', 200);
    load();
  }

  MB.initBirthdayWall = initWall;
})(window.MB);
