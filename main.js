/* ============================================================
   页面主逻辑
   开场 → 剪影故事 → 夜空祝福 → 正文（时光/心愿/许愿/祝福）
   所有用户输入一律 textContent 渲染
   ============================================================ */
(function (global) {
  'use strict';

  var MB = global.MB = global.MB || {};
  var api = MB.api;

  var $ = function (id) { return document.getElementById(id); };

  // Motion policy follows the OS until the visitor explicitly chooses a mode.
  var timers = [];

  function reduced() { return MB.motion.reduced(); }

  function later(fn, ms) {
    var id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function setText(el, value) {
    if (el && value != null) el.textContent = String(value);
  }

  /* 把带 **强调** 的纯文本渲染成文本节点 + <em>，不使用 innerHTML */
  function appendRich(parent, text, markClass) {
    parseEmphasis(text).forEach(function (seg) {
      if (seg.marked) {
        var em = document.createElement('em');
        em.className = markClass || 'mark';
        em.textContent = seg.text;
        parent.appendChild(em);
      } else if (seg.text) {
        parent.appendChild(document.createTextNode(seg.text));
      }
    });
  }

  function trapTab(container, event) {
    if (event.key !== 'Tab') return;
    var items = container.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function codePointLength(value) {
    return Array.from(String(value)).length;
  }

  function toast(message) {
    var el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { el.classList.remove('is-show'); }, 2600);
  }

  /* ---------------- 配置绑定 ---------------- */
  var config = null;

  function applyConfig(cfg) {
    config = cfg;

    document.title = cfg.pageTitle || document.title;

    setText($('opening-eyebrow'), cfg.opening.eyebrow);
    setText($('opening-title'), cfg.opening.title);
    setText($('gift-label'), cfg.opening.buttonText);

    setText($('blessing-title'), cfg.blessing.title);

    setText($('timeline-title'), cfg.timeline.title);
    setText($('memory-title'), cfg.memoryGame.title);
    setText($('cake-title'), cfg.cake.title);
    setText($('wall-title'), cfg.messageWall.title);
    setText($('wall-intro'), cfg.messageWall.intro);
    setText($('wall-empty'), cfg.messageWall.emptyText);

    setText($('egg-title'), cfg.cake.easterEgg.title);
    setText($('egg-text'), cfg.cake.easterEgg.text);
    setText($('foot-line'), (cfg.recipientName || '妈妈') + '，愿这些细小的心意，你都收得到。');

    var closing = cfg.closing;
    if (closing) {
      setText($('closing-title'), closing.title);
      setText($('closing-sign'), closing.sign);
      var letterBody = $('closing-lines');
      if (letterBody) {
        letterBody.innerHTML = '';
        closing.lines.forEach(function (line) {
          var p = document.createElement('p');
          p.className = 'letter-line';
          appendRich(p, line);
          letterBody.appendChild(p);
        });
      }
    }

    var intro = $('cake-title');
    if (intro) intro.setAttribute('aria-label', cfg.cake.title);
  }

  /* ---------------- 动态背景 ---------------- */
  function buildBackground() {
    var bokeh = $('bg-bokeh');
    var dust = $('bg-dust');
    if (!bokeh || !dust) return;

    var bokehCount = 18;
    for (var i = 0; i < bokehCount; i++) {
      var dot = document.createElement('span');
      dot.className = 'bokeh-dot';
      var size = 3 + Math.random() * 7;
      dot.style.width = size.toFixed(1) + 'px';
      dot.style.height = size.toFixed(1) + 'px';
      dot.style.left = (Math.random() * 100).toFixed(2) + '%';
      dot.style.top = (Math.random() * 100).toFixed(2) + '%';
      dot.style.setProperty('--dur', (10 + Math.random() * 12).toFixed(1) + 's');
      dot.style.setProperty('--delay', (Math.random() * -20).toFixed(1) + 's');
      dot.style.setProperty('--peak', (0.22 + Math.random() * 0.42).toFixed(2));
      dot.style.setProperty('--dx', ((Math.random() - 0.5) * 34).toFixed(0) + 'px');
      dot.style.setProperty('--dy', (-18 - Math.random() * 46).toFixed(0) + 'px');
      bokeh.appendChild(dot);
    }

    var dustCount = 12;
    for (var j = 0; j < dustCount; j++) {
      var mote = document.createElement('span');
      mote.className = 'dust';
      var ds = 2 + Math.random() * 2.6;
      mote.style.width = ds.toFixed(1) + 'px';
      mote.style.height = ds.toFixed(1) + 'px';
      mote.style.left = (Math.random() * 100).toFixed(2) + '%';
      mote.style.setProperty('--dur', (22 + Math.random() * 18).toFixed(1) + 's');
      mote.style.setProperty('--delay', (Math.random() * -34).toFixed(1) + 's');
      mote.style.setProperty('--sway', ((Math.random() - 0.5) * 70).toFixed(0) + 'px');
      mote.style.setProperty('--peak', (0.18 + Math.random() * 0.3).toFixed(2));
      dust.appendChild(mote);
    }

    // 流星：频率低、轨迹慢，只划过一小段，不做满屏闪烁
    var meteorLayer = $('bg-meteors');
    if (meteorLayer) {
      for (var k = 0; k < 7; k++) {
        var meteor = document.createElement('span');
        meteor.className = 'meteor';
        meteor.style.left = (4 + Math.random() * 44).toFixed(1) + '%';
        meteor.style.top = (4 + Math.random() * 36).toFixed(1) + '%';
        meteor.style.setProperty('--len', (96 + Math.random() * 70).toFixed(0) + 'px');
        meteor.style.setProperty('--dx', (86 + Math.random() * 64).toFixed(0) + 'px');
        meteor.style.setProperty('--dy', (42 + Math.random() * 34).toFixed(0) + 'px');
        meteor.style.setProperty('--cycle', (9 + Math.random() * 8).toFixed(1) + 's');
        meteor.style.setProperty('--delay', (-Math.random() * 17).toFixed(1) + 's');
        meteorLayer.appendChild(meteor);
      }
    }
  }

  /* ---------------- 幕切换 ---------------- */
  function showAct(el) {
    if (!el) return;
    el.hidden = false;
    el.classList.add('is-entering');
    later(function () { el.classList.remove('is-entering'); }, 780);
  }

  function hideAct(el, done) {
    if (!el) { if (done) done(); return; }
    el.classList.add('is-fading');
    later(function () {
      el.hidden = true;
      el.classList.remove('is-fading');
      if (done) done();
    }, 700);
  }

  /* 幕间柔光：在光最亮的那一刻换内容，日夜切换不硬切 */
  function veilSwap(swap) {
    var veilEl = $('veil');
    if (!veilEl || reduced()) { swap(); return; }

    veilEl.classList.remove('is-on');
    void veilEl.offsetWidth;
    veilEl.classList.add('is-on');

    later(function () { swap(); }, 400);
    later(function () { veilEl.classList.remove('is-on'); }, 1180);
  }

  /* ---------------- 夜空祝福 ---------------- */
  /* 「**关键词**」→ 高亮段；未闭合的星号按普通文本处理 */
  function parseEmphasis(text) {
    var out = [];
    var re = /\*\*([^*]+)\*\*/g;
    var last = 0;
    var match;
    while ((match = re.exec(text)) !== null) {
      if (match.index > last) out.push({ text: text.slice(last, match.index), marked: false });
      out.push({ text: match[1], marked: true });
      last = match.index + match[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last), marked: false });
    return out.length ? out : [{ text: text, marked: false }];
  }

  function buildNightStars() {
    var layer = $('night-stars');
    if (!layer || layer.childNodes.length) return;
    for (var i = 0; i < 46; i++) {
      var star = document.createElement('span');
      star.className = 'night-star';
      var size = 1.2 + Math.random() * 1.8;
      star.style.width = size.toFixed(1) + 'px';
      star.style.height = size.toFixed(1) + 'px';
      star.style.left = (Math.random() * 100).toFixed(2) + '%';
      star.style.top = (Math.random() * 74).toFixed(2) + '%';
      star.style.setProperty('--dur', (3.4 + Math.random() * 4.5).toFixed(1) + 's');
      star.style.setProperty('--delay', (-Math.random() * 8).toFixed(1) + 's');
      star.style.setProperty('--peak', (0.35 + Math.random() * 0.55).toFixed(2));
      layer.appendChild(star);
    }
  }

  function spawnNightMeteors(count) {
    var layer = $('night-meteors');
    if (!layer) return;
    layer.innerHTML = '';

    var total = reduced() ? 0 : (count || 9);
    for (var i = 0; i < total; i++) {
      var m = document.createElement('span');
      m.className = 'night-meteor';
      // 集中在右上角天空，避开居中的标题
      m.style.left = (52 + Math.random() * 34).toFixed(1) + '%';
      m.style.top = (1 + Math.random() * 7).toFixed(1) + '%';
      m.style.setProperty('--len', (70 + Math.random() * 60).toFixed(0) + 'px');
      m.style.setProperty('--dx', (110 + Math.random() * 110).toFixed(0) + 'px');
      m.style.setProperty('--dy', (40 + Math.random() * 46).toFixed(0) + 'px');
      m.style.setProperty('--dur', (0.9 + Math.random() * 0.8).toFixed(2) + 's');
      m.style.setProperty('--delay', (Math.random() * 1.8).toFixed(2) + 's');
      layer.appendChild(m);
    }
  }

  /* 逐行、逐字浮现；每行完成后画出关键词下划线 */
  function runBlessing(onDone) {
    var linesEl = $('blessing-lines');
    var skipBtn = $('blessing-skip');
    var nextBtn = $('blessing-next');
    if (!linesEl) { if (onDone) onDone(); return { skip: function () {} }; }

    var lines = (config && config.blessing && config.blessing.lines) || [];
    var speed = (config && config.blessing && config.blessing.charIntervalMs) || 90;
    var done = false;
    var timerId = 0;
    var lineEls = [];

    buildNightStars();
    linesEl.innerHTML = '';

    lines.forEach(function (line) {
      var p = document.createElement('p');
      p.className = 'blessing-line';

      parseEmphasis(line).forEach(function (seg) {
        var host = p;
        if (seg.marked) {
          host = document.createElement('em');
          // 短关键词才加下划线，避免长句换行时下划线断在行尾
          host.className = Array.from(seg.text).length <= 10 ? 'mark mark--u' : 'mark';
          p.appendChild(host);
        }
        Array.from(seg.text).forEach(function (ch) {
          var span = document.createElement('span');
          span.className = 'ch';
          span.textContent = ch;
          host.appendChild(span);
        });
      });

      linesEl.appendChild(p);
      lineEls.push(p);
    });

    function revealAll() {
      lineEls.forEach(function (p) {
        var chars = p.querySelectorAll('.ch');
        for (var i = 0; i < chars.length; i++) chars[i].classList.add('is-on');
        p.classList.add('is-marked');
      });
    }

    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timerId);
      revealAll();
      if (skipBtn) skipBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = false;
      spawnNightMeteors(9);
      if (onDone) onDone();
    }

    if (reduced()) {
      finish();
      return { skip: finish, destroy: function () { done = true; } };
    }

    var li = 0;
    var ci = 0;

    function step() {
      if (done) return;

      if (li >= lineEls.length) { finish(); return; }

      var chars = lineEls[li].querySelectorAll('.ch');

      if (ci >= chars.length) {
        lineEls[li].classList.add('is-marked');
        li += 1;
        ci = 0;
        timerId = setTimeout(step, 430);
        return;
      }

      chars[ci].classList.add('is-on');
      ci += 1;
      timerId = setTimeout(step, speed);
    }

    if (skipBtn) {
      skipBtn.hidden = false;
      skipBtn.onclick = finish;
    }

    timerId = setTimeout(step, 420);

    return {
      skip: finish,
      destroy: function () { done = true; clearTimeout(timerId); }
    };
  }

  /* ---------------- 时间轴 ---------------- */
  function renderTimeline(photos) {
    var track = $('timeline-track');
    var empty = $('timeline-empty');
    if (!track) return;

    if (!Array.isArray(photos) || photos.length === 0) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    var observer = null;
    if ('IntersectionObserver' in global) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    }

    photos.forEach(function (photo) {
      var item = document.createElement('article');
      item.className = 'tl-item';

      var figure = document.createElement('button');
      figure.type = 'button';
      figure.className = 'tl-figure';
      figure.setAttribute('aria-label', '查看照片：' + (photo.alt || photo.caption || '回忆'));

      var shot = document.createElement('div');
      shot.className = 'tl-shot';

      var img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = photo.alt || '';
      if (photo.width) img.width = photo.width;
      if (photo.height) img.height = photo.height;
      img.src = photo.src;
      img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
      img.addEventListener('error', function () {
        shot.classList.add('is-broken');
        img.remove();
      }, { once: true });

      shot.appendChild(img);

      var meta = document.createElement('div');
      meta.className = 'tl-meta';
      if (photo.date) {
        var date = document.createElement('p');
        date.className = 'tl-date';
        date.textContent = photo.date;
        meta.appendChild(date);
      }
      var cap = document.createElement('p');
      cap.className = 'tl-cap';
      cap.textContent = photo.caption || '';
      meta.appendChild(cap);

      figure.appendChild(shot);
      figure.appendChild(meta);
      figure.addEventListener('click', function () { openLightbox(photo); });

      item.appendChild(figure);
      track.appendChild(item);

      if (observer) observer.observe(item);
      else item.classList.add('is-in');
    });
  }

  /* ---------------- 灯箱 ---------------- */
  var lightboxReturnFocus = null;

  function openLightbox(photo) {
    var box = $('lightbox');
    var img = $('lightbox-img');
    var cap = $('lightbox-cap');
    if (!box || !img) return;

    lightboxReturnFocus = document.activeElement;
    img.src = photo.src;
    img.alt = photo.alt || '';
    setText(cap, photo.caption || '');
    box.hidden = false;
    document.body.classList.add('is-locked');
    var close = $('lightbox-close');
    if (close) close.focus();
  }

  function closeLightbox() {
    var box = $('lightbox');
    if (!box || box.hidden) return;
    box.hidden = true;
    var img = $('lightbox-img');
    if (img) img.removeAttribute('src');
    document.body.classList.remove('is-locked');
    if (lightboxReturnFocus && lightboxReturnFocus.focus) lightboxReturnFocus.focus();
    lightboxReturnFocus = null;
  }

  /* ---------------- 点亮心愿（星空小游戏） ---------------- */
  var STAR_SVG =
    '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">' +
      '<path d="M12 1.8q1.2 8.6 10.2 10.2-9 1.6-10.2 10.2-1.2-8.6-10.2-10.2 9-1.6 10.2-10.2z" fill="currentColor"/>' +
    '</svg>';

  function initSky(pairs) {
    var sky = $('sky');
    var fall = $('sky-fall');
    var slotsEl = $('sky-slots');
    var stepsEl = $('memory-steps');
    var captionEl = $('sky-caption');
    var msgEl = $('memory-msg');
    var resetBtn = $('memory-reset');
    if (!sky || !fall || !slotsEl) return;

    var total = pairs.length;
    var lit = 0;
    var running = false;
    var spawnId = 0;
    var captionId = 0;
    var order = [];

    function shuffle(list) {
      var copy = list.slice();
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
      }
      return copy;
    }

    function updateSteps() {
      if (!stepsEl) return;
      stepsEl.innerHTML = '';
      stepsEl.appendChild(document.createTextNode('已点亮 '));
      var b = document.createElement('b');
      b.textContent = String(lit);
      stepsEl.appendChild(b);
      stepsEl.appendChild(document.createTextNode(' / ' + total));
    }

    function buildSlots() {
      slotsEl.innerHTML = '';
      order.forEach(function (pair) {
        var slot = document.createElement('span');
        slot.className = 'slot';
        slot.setAttribute('role', 'listitem');
        slot.setAttribute('aria-label', (pair.label || pair.symbol || '心愿') + '，未点亮');
        slot.textContent = pair.symbol || '';
        slotsEl.appendChild(slot);
      });
    }

    function showCaption(text) {
      if (!captionEl) return;
      clearTimeout(captionId);
      captionEl.textContent = text;
      captionEl.classList.add('is-show');
      captionId = setTimeout(function () { captionEl.classList.remove('is-show'); }, 2200);
    }

    function lightSlot(index, pair) {
      var slot = slotsEl.children[index];
      if (!slot) return;
      slot.classList.add('is-lit');
      slot.setAttribute('aria-label', (pair.label || '心愿') + '，已点亮');
      showCaption(pair.label || pair.symbol || '');
    }

    function clearFalling() {
      clearInterval(spawnId);
      spawnId = 0;
      var nodes = Array.prototype.slice.call(fall.querySelectorAll('.star-btn'));
      nodes.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    }

    function removeStar(btn) {
      if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
    }

    function makeStar() {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'star-btn';
      btn.setAttribute('aria-label', '接住落下的星光');
      btn.innerHTML = STAR_SVG;
      btn.style.left = (7 + Math.random() * 74).toFixed(1) + '%';
      btn.style.setProperty('--dur', (6.4 + Math.random() * 2.2).toFixed(1) + 's');
      btn.addEventListener('click', function () { catchStar(btn); });
      btn.addEventListener('animationend', function () { removeStar(btn); });
      return btn;
    }

    function spawnStar() {
      if (document.hidden || document.body.matches('.gala-open,.surprise-open') || !$('panel-memory').classList.contains('is-active')) return;
      if (!running || lit >= total) return;
      if (fall.querySelectorAll('.star-btn').length >= 3) return;
      fall.appendChild(makeStar());
    }

    function catchStar(btn) {
      if (!running || lit >= total) return;
      removeStar(btn);
      var pair = order[lit];
      if (!pair) return;
      lightSlot(lit, pair);
      lit += 1;
      updateSteps();

      if (lit >= total) complete();
    }

    function complete() {
      running = false;
      clearFalling();
      sky.classList.add('is-complete');
      if (captionEl) captionEl.classList.remove('is-show');
      if (msgEl) {
        msgEl.hidden = false;
        msgEl.textContent = (config && config.memoryGame && config.memoryGame.successMessage) || '六颗星都亮起来了。';
      }
    }

    function start() {
      clearFalling();
      sky.classList.remove('is-complete');
      if (msgEl) { msgEl.hidden = true; msgEl.textContent = ''; }
      if (captionEl) captionEl.classList.remove('is-show');

      lit = 0;
      updateSteps();
      order = shuffle(pairs);
      buildSlots();

      running = true;

      if (reduced()) {
        // 减少动态：不放动画，六颗星静止分布，直接点
        fall.classList.add('is-static');
        order.forEach(function (pair, index) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'star-btn';
          btn.setAttribute('aria-label', '点亮第 ' + (index + 1) + ' 颗星');
          btn.innerHTML = STAR_SVG;
          btn.style.left = (8 + index * 14) + '%';
          btn.style.top = (16 + (index % 2) * 16) + '%';
          btn.addEventListener('click', function () { catchStar(btn); });
          fall.appendChild(btn);
        });
        return;
      }

      fall.classList.remove('is-static');
      spawnStar();
      spawnId = setInterval(spawnStar, 1700);
    }

    if (resetBtn) resetBtn.addEventListener('click', start);
    start();
  }

  /* ---------------- 蛋糕 ---------------- */
  function initCake() {
    var stage = $('cake-stage');
    var cake = $('cake');
    var action = $('cake-action');
    var wish = $('cake-wish');
    if (!stage || !action) return;

    var lit = true;
    var tapCount = 0;
    var eggShown = false;
    var wishText = (config && config.cake && config.cake.wishMessage) || '愿你的心愿，被时光温柔珍藏。';

    function blow() {
      if (!lit) return;
      lit = false;
      stage.classList.add('is-out');
      stage.classList.add('is-smoking');
      if (wish) { wish.hidden = false; wish.textContent = wishText; }
      action.textContent = '重新点亮';
      later(function () { stage.classList.remove('is-smoking'); }, 3400);
    }

    function relight() {
      if (lit) return;
      lit = true;
      stage.classList.remove('is-out');
      stage.classList.remove('is-smoking');
      action.textContent = '吹灭蜡烛 · 开启庆典';
    }

    action.addEventListener('click', function () {
      if (lit) blow(); else relight();
    });

    if (cake) {
      cake.addEventListener('click', function () {
        if (eggShown) return;
        tapCount += 1;
        if (tapCount >= 5) {
          eggShown = true;
          showEgg();
        }
      });
    }
  }

  /* ---------------- 星河场景 ---------------- */
  var GALAXY_TONES = ['gold', 'rose', 'sage', 'lilac'];

  function initGalaxy() {
    var galaxy = $('galaxy');
    if (!galaxy) return;

    var bokeh = $('galaxy-bokeh');
    var dust = $('galaxy-dust');
    var meteors = $('galaxy-meteors');

    if (bokeh && !bokeh.childNodes.length) {
      for (var i = 0; i < 22; i++) {
        var orb = document.createElement('span');
        var size = 12 + Math.random() * 56;
        orb.className = 'orb orb--' + GALAXY_TONES[i % GALAXY_TONES.length];
        orb.style.width = size.toFixed(0) + 'px';
        orb.style.height = size.toFixed(0) + 'px';
        orb.style.left = (Math.random() * 100).toFixed(2) + '%';
        orb.style.top = (Math.random() * 100).toFixed(2) + '%';
        orb.style.setProperty('--dur', (12 + Math.random() * 10).toFixed(1) + 's');
        orb.style.setProperty('--delay', (-Math.random() * 14).toFixed(1) + 's');
        orb.style.setProperty('--dx', ((Math.random() - 0.5) * 44).toFixed(0) + 'px');
        orb.style.setProperty('--dy', ((Math.random() - 0.5) * 44).toFixed(0) + 'px');
        orb.style.setProperty('--peak', (0.22 + Math.random() * 0.38).toFixed(2));
        bokeh.appendChild(orb);
      }
    }

    if (dust && !dust.childNodes.length) {
      for (var j = 0; j < 34; j++) {
        var dot = document.createElement('span');
        var ds = 1 + Math.random() * 1.6;
        dot.className = 'dust-dot';
        dot.style.width = ds.toFixed(1) + 'px';
        dot.style.height = ds.toFixed(1) + 'px';
        dot.style.left = (Math.random() * 100).toFixed(2) + '%';
        dot.style.top = (Math.random() * 100).toFixed(2) + '%';
        dot.style.setProperty('--dur', (3 + Math.random() * 4).toFixed(1) + 's');
        dot.style.setProperty('--delay', (-Math.random() * 6).toFixed(1) + 's');
        dot.style.setProperty('--peak', (0.3 + Math.random() * 0.6).toFixed(2));
        dust.appendChild(dot);
      }
    }

    if (meteors && !meteors.childNodes.length) {
      for (var k = 0; k < 8; k++) {
        var m = document.createElement('span');
        m.className = 'night-meteor';
        m.style.left = (4 + Math.random() * 62).toFixed(1) + '%';
        m.style.top = (2 + Math.random() * 40).toFixed(1) + '%';
        m.style.setProperty('--len', (60 + Math.random() * 60).toFixed(0) + 'px');
        m.style.setProperty('--dx', (90 + Math.random() * 90).toFixed(0) + 'px');
        m.style.setProperty('--dy', (38 + Math.random() * 44).toFixed(0) + 'px');
        m.style.setProperty('--dur', (1.4 + Math.random() * 1.6).toFixed(2) + 's');
        m.style.setProperty('--delay', (Math.random() * 3).toFixed(2) + 's');
        meteors.appendChild(m);
      }
    }

    var chips = galaxy.parentNode.querySelectorAll('.chip');
    Array.prototype.slice.call(chips).forEach(function (chip) {
      var fx = chip.getAttribute('data-fx');
      if (!fx) return;

      var sync = function () {
        var on = galaxy.classList.contains('fx-' + fx);
        chip.classList.toggle('is-on', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      };
      sync();

      chip.addEventListener('click', function () {
        galaxy.classList.toggle('fx-' + fx);
        sync();
      });
    });
  }

  /* ---------------- 远景：纸剪山脊 ---------------- */
  function initSceneryLayers() {
    if (!MB || !MB.scenery) return;
    var layers = document.querySelectorAll('.scenery[data-scene]');
    Array.prototype.slice.call(layers).forEach(function (box) {
      MB.scenery.render(box.getAttribute('data-scene'), box);
    });
  }

  /* ---------------- 剪影小人 ---------------- */
  function initActors() {
    if (!MB || !MB.actors) return;
    var layers = document.querySelectorAll('.actors[data-act]');
    Array.prototype.slice.call(layers).forEach(function (box) {
      MB.actors.render(box.getAttribute('data-act'), box);
    });
  }

  /* ---------------- 收尾那屏的落花 ---------------- */
  function initPetals() {
    var box = $('petals');
    if (!box) return;
    if (reduced()) return; // 减少动态就不落花

    var count = (global.innerWidth || 375) < 420 ? 32 : 44;

    for (var i = 0; i < count; i++) {
      var near = i % 8 === 0;
      var size = near ? 30 + Math.random() * 12 : 15 + Math.random() * 12;
      var petal = document.createElement('span');
      petal.className = 'petal' + (near ? ' is-near' : '');

      petal.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      petal.style.setProperty('--w', size.toFixed(0) + 'px');
      petal.style.setProperty('--o', (near ? 0.5 : 0.68 + Math.random() * 0.3).toFixed(2));
      petal.style.setProperty('--dur', (11 + Math.random() * 9).toFixed(1) + 's');
      // 负延迟：一进来就已经在下半路了，不会空屏
      petal.style.setProperty('--delay', (-Math.random() * 24).toFixed(1) + 's');
      petal.style.setProperty('--dx', ((Math.random() - 0.5) * 64).toFixed(0) + 'px');
      petal.style.setProperty('--flip', (3.4 + Math.random() * 3.8).toFixed(1) + 's');
      petal.style.setProperty('--rz', (Math.random() * 360).toFixed(0) + 'deg');
      petal.style.setProperty('--img',
        'url("assets/textures/' + (i % 3 === 0 ? 'petal-cream.png' : 'petal.png') + '")');

      petal.appendChild(document.createElement('i'));
      box.appendChild(petal);
    }
  }

  /* ---------------- 蛋糕上飘的小火星 ---------------- */
  function initSparks() {
    var box = $('sparks');
    var scene = $('panel-cake');
    if (!box || !scene) return;

    function spawn() {
      if (document.hidden || document.body.matches('.gala-open,.surprise-open') || !scene.classList.contains('is-active')) {
        later(spawn, 900 + Math.random() * 600);
        return;
      }

      var dur = 3.4 + Math.random() * 2.2;
      var spark = document.createElement('span');
      spark.className = 'spark';
      spark.style.left = (28 + Math.random() * 44).toFixed(1) + '%';
      spark.style.top = (46 + Math.random() * 10).toFixed(1) + '%';
      spark.style.setProperty('--dur', dur.toFixed(1) + 's');
      spark.style.setProperty('--dx', ((Math.random() - 0.5) * 26).toFixed(0) + 'px');
      box.appendChild(spark);

      later(function () {
        if (spark.parentNode) spark.parentNode.removeChild(spark);
      }, dur * 1000 + 120);

      later(spawn, 520 + Math.random() * 760);
    }

    later(spawn, 600);
  }

  /* ---------------- 场景装饰：星点与浮尘 ---------------- */
  function initScenery() {
    var dusk = $('dusk-stars');
    if (dusk && !dusk.childNodes.length) {
      for (var i = 0; i < 42; i++) {
        var star = document.createElement('span');
        var size = 1.2 + Math.random() * 1.8;
        star.className = 'scene-star';
        star.style.width = size.toFixed(1) + 'px';
        star.style.height = size.toFixed(1) + 'px';
        star.style.left = (Math.random() * 100).toFixed(2) + '%';
        star.style.top = (Math.random() * 72).toFixed(2) + '%';
        star.style.setProperty('--dur', (3 + Math.random() * 4).toFixed(1) + 's');
        star.style.setProperty('--delay', (-Math.random() * 6).toFixed(1) + 's');
        star.style.setProperty('--peak', (0.4 + Math.random() * 0.6).toFixed(2));
        dusk.appendChild(star);
      }
    }

    var dust = $('dust-timeline');
    if (dust && !dust.childNodes.length) {
      for (var j = 0; j < 16; j++) {
        var mote = document.createElement('span');
        var ms = 2 + Math.random() * 3;
        mote.className = 'scene-mote';
        mote.style.width = ms.toFixed(1) + 'px';
        mote.style.height = ms.toFixed(1) + 'px';
        mote.style.left = (Math.random() * 100).toFixed(2) + '%';
        mote.style.top = (18 + Math.random() * 74).toFixed(2) + '%';
        mote.style.setProperty('--dur', (14 + Math.random() * 10).toFixed(1) + 's');
        mote.style.setProperty('--delay', (-Math.random() * 12).toFixed(1) + 's');
        mote.style.setProperty('--dx', ((Math.random() - 0.5) * 32).toFixed(0) + 'px');
        mote.style.setProperty('--peak', (0.22 + Math.random() * 0.38).toFixed(2));
        dust.appendChild(mote);
      }
    }
  }

  /* ---------------- 弹窗祝福雨（一整屏场景） ---------------- */
  var RAIN_PASTELS = ['#FFF6EA', '#FBEAD9', '#F6E3E0', '#EAF2E3', '#F3EAF7', '#FDF3DC'];
  var rainCtl = null;

  function initRain() {
    var scene = $('panel-rain');
    var field = $('rain-field');
    var line = $('rain-line');
    var list = $('rain-list');
    if (!scene || !field) return;

    var started = false;
    var timers = [];

    function rainData() { return (config && config.blessingRain) || {}; }

    function makePop(text, opts) {
      var o = opts || {};
      var pop = document.createElement('div');
      pop.className = 'pop';
      pop.style.setProperty('--bg', o.bg || RAIN_PASTELS[0]);
      if (o.w) pop.style.setProperty('--w', o.w);
      if (o.rot) pop.style.setProperty('--rot', o.rot);
      if (o.left) pop.style.left = o.left;
      if (o.top) pop.style.top = o.top;

      var head = document.createElement('div');
      head.className = 'pop-head';

      var title = document.createElement('span');
      title.className = 'pop-title';
      title.textContent = rainData().title || '温馨提示';
      head.appendChild(title);

      var dots = document.createElement('span');
      dots.className = 'pop-dots';
      for (var i = 0; i < 3; i++) dots.appendChild(document.createElement('i'));
      head.appendChild(dots);

      var body = document.createElement('p');
      body.className = 'pop-text';
      body.textContent = text;

      pop.appendChild(head);
      pop.appendChild(body);
      return pop;
    }

    /* 滚到这一屏才下雨，只下一次 */
    function start() {
      if (started) return;

      var cfgRain = rainData();
      var items = Array.isArray(cfgRain.items) ? cfgRain.items : [];
      if (!items.length) return;
      started = true;

      list.innerHTML = '';
      items.forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });

      line.textContent = cfgRain.closing || '';

      if (reduced()) {
        // 不做雨：静态两列，一屏读完
        scene.classList.add('is-static');
        items.forEach(function (text, i) {
          field.appendChild(makePop(text, { bg: RAIN_PASTELS[i % RAIN_PASTELS.length] }));
        });
        line.classList.add('is-show');
        return;
      }

      var w = field.clientWidth || global.innerWidth || 360;
      var h = field.clientHeight || global.innerHeight || 640;
      var cols = 3;
      var rows = Math.ceil(items.length / cols);
      var bottomReserve = 120;
      var delay = 260;

      items.forEach(function (text, i) {
        delay += 150 + Math.random() * 90;
        timers.push(setTimeout(function () {
          var width = 162 + Math.random() * 30;
          var half = width / 2 + 8;
          var col = i % cols;
          var row = Math.floor(i / cols);
          var x = ((col + 0.5) / cols) * w + (Math.random() - 0.5) * (w / cols) * 0.55;
          var y = ((row + 0.5) / rows) * (h - bottomReserve) + (Math.random() - 0.5) * ((h - bottomReserve) / rows) * 0.5 + 30;

          var pop = makePop(text, {
            bg: RAIN_PASTELS[i % RAIN_PASTELS.length],
            w: width.toFixed(0) + 'px',
            rot: ((Math.random() * 8) - 4).toFixed(1) + 'deg',
            // 按窗宽的一半收边，避免贴边被切掉
            left: Math.max(half, Math.min(w - half, x)).toFixed(0) + 'px',
            top: Math.max(54, Math.min(h - bottomReserve, y)).toFixed(0) + 'px'
          });
          field.appendChild(pop);
        }, delay));
      });

      // 雨停：小窗一起淡掉，只剩那句话
      timers.push(setTimeout(function () {
        Array.prototype.slice.call(field.querySelectorAll('.pop')).forEach(function (pop, i) {
          timers.push(setTimeout(function () { pop.classList.add('is-going'); }, i * 35));
        });
        line.classList.add('is-show');
      }, delay + 2200));
    }

    rainCtl = { start: start };
  }

  /* ---------------- 彩蛋 ---------------- */
  var eggReturnFocus = null;

  function showEgg() {
    var egg = $('egg');
    if (!egg || !egg.hidden) return;
    eggReturnFocus = document.activeElement;
    egg.hidden = false;
    var close = $('egg-close');
    if (close) close.focus();
  }

  function hideEgg() {
    var egg = $('egg');
    if (!egg || egg.hidden) return;
    egg.hidden = true;
    if (eggReturnFocus && eggReturnFocus.focus) eggReturnFocus.focus();
    eggReturnFocus = null;
  }

  /* ---------------- 留言墙 ---------------- */
  function initWall() {
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

  /* ---------------- 音乐 ---------------- */
  var musicEngine = null;

  function initMusic() {
    var toggle = $('music-toggle');
    var audio = $('music-audio');
    var label = $('music-text');
    if (!toggle) return;

    var cfgMusic = (config && config.music) || {};
    var src = cfgMusic.src;
    var engine = null;
    var canStore = true;

    if (src && audio) {
      audio.src = src;
      audio.loop = true;
      engine = {
        play: function () {
          var p = audio.play();
          return p && typeof p.then === 'function' ? p : Promise.resolve();
        },
        pause: function () { audio.pause(); }
      };
    } else if (global.MB && MB.music && MB.music.supported) {
      // 没有音频文件时用内置合成音，不加载任何外部资源
      engine = MB.music.createAmbient();
    }

    if (!engine) { toggle.hidden = true; return; }
    musicEngine = engine;

    toggle.hidden = false;
    setText(label, cfgMusic.title || '音乐');

    function readStored() {
      try { return global.localStorage.getItem('mb.music') === 'on'; }
      catch (e) { canStore = false; return false; }
    }

    function store(value) {
      if (!canStore) return;
      try { global.localStorage.setItem('mb.music', value ? 'on' : 'off'); }
      catch (e) { canStore = false; }
    }

    var desired = readStored();
    var playing = false;

    function paint() {
      toggle.classList.toggle('is-on', playing);
      toggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
      toggle.setAttribute('aria-label', '背景音乐：' + (playing ? '开启' : '关闭'));
      setText(label, playing ? '音乐中' : '音乐');
    }

    function play() {
      var result;
      try { result = engine.play(); }
      catch (e) { result = Promise.reject(e); }

      return result.then(function () {
        playing = true;
        paint();
        store(true);
      }).catch(function () {
        playing = false;
        paint();
        store(false);
        toast('这个浏览器没能播放声音');
      });
    }

    function pause() {
      engine.pause();
      playing = false;
      paint();
      store(false);
    }

    toggle.addEventListener('click', function () {
      if (playing) pause(); else play();
    });

    // 记住过「开」也不自动播放：必须等本次页面的第一次用户手势
    if (desired) {
      var unlock = function () {
        document.removeEventListener('pointerdown', unlock, true);
        document.removeEventListener('touchstart', unlock, true);
        if (!playing) play();
      };
      document.addEventListener('pointerdown', unlock, true);
      document.addEventListener('touchstart', unlock, true);
    }

    paint();
  }

  /* ---------------- 章节导航与段落激活 ---------------- */
  var journeyPanels = [];
  var railButtons = [];
  var activePanel = -1;
  var navBuilt = false;
  var scrollQueued = false;
  var revealObserver = null;

  /* 内容一进入视口就浮现（不等滚到中间），
     否则快速跳转时中途的段落会是空白 */
  function observePanelReveals() {
    if (!('IntersectionObserver' in global)) {
      journeyPanels.forEach(function (panel) { panel.classList.add('is-in'); });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      }, { root: $('journey'), threshold: 0.01, rootMargin: '0px 0px -2% 0px' });
    }

    journeyPanels.forEach(function (panel) {
      if (!panel.classList.contains('is-in')) revealObserver.observe(panel);
    });
  }

  function resetPanelReveals() {
    journeyPanels.forEach(function (panel) {
      panel.classList.remove('is-in', 'is-active');
    });
    activePanel = -1;
    observePanelReveals();
  }

  function buildJourneyNav() {
    if (navBuilt) return;
    navBuilt = true;

    journeyPanels = Array.prototype.slice.call(document.querySelectorAll('#journey .scene'));
    var list = $('rail-list');
    if (!list) return;

    journeyPanels.forEach(function (panel, i) {
      // 场景内容按顺序错开浮现；标题区拆成 kicker / title 两拍。
      // 祝福雨自己控制节奏（雨停后才出那句话），不参与浮现。
      if (panel.id !== 'panel-rain') {
        var host = panel.querySelector('.scene-inner') || panel;
        var order = 0;
        Array.prototype.slice.call(host.children).forEach(function (child) {
          if (child.classList.contains('panel-head')) {
            Array.prototype.slice.call(child.children).forEach(function (inner) {
              inner.classList.add('reveal');
              inner.style.setProperty('--d', String(Math.min(order, 6)));
              order += 1;
            });
            return;
          }
          child.classList.add('reveal');
          child.style.setProperty('--d', String(Math.min(order, 6)));
          order += 1;
        });
      }

      var item = document.createElement('li');
      var btn = document.createElement('button');
      var name = panel.getAttribute('data-name') || ('第 ' + (i + 1) + ' 节');

      btn.type = 'button';
      btn.className = 'rail-btn';
      btn.setAttribute('aria-label', '前往：' + name);
      btn.setAttribute('aria-current', 'false');

      var label = document.createElement('span');
      label.className = 'rail-label';
      label.textContent = ('0' + (i + 1)).slice(-2) + ' · ' + name;
      btn.appendChild(label);

      btn.addEventListener('click', function () {
        if (MB.theatre) MB.theatre.goTo(panel.id); else panel.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      });

      item.appendChild(btn);
      list.appendChild(item);
      railButtons.push(btn);
    });

    // 滚动容器是 #journey 自己，不是 window
    var deck = $('journey');
    if (deck) {
      deck.addEventListener('scroll', requestScrollUpdate, { passive: true });
      deck.addEventListener('scrollend', requestScrollUpdate);
    }
    global.addEventListener('resize', requestScrollUpdate);

    observePanelReveals();
  }

  function setJourneyChrome(visible) {
    var rail = $('rail');
    var bar = $('scroll-progress');
    if (rail) rail.hidden = !visible;
    if (bar) bar.hidden = !visible;
  }

  function requestScrollUpdate() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () {
      scrollQueued = false;
      updateJourneyScroll();
    });
  }

  function updateJourneyScroll() {
    if (MB.theatre && MB.theatre.active) return;
    var deck = $('journey');
    if (!deck || deck.hidden || !journeyPanels.length) return;

    var vh = deck.clientHeight;
    var top = deck.scrollTop;
    var probe = top + vh * 0.5;

    var index = 0;
    for (var i = 0; i < journeyPanels.length; i++) {
      if (probe >= journeyPanels[i].offsetTop) index = i;
    }
    if (top + vh >= deck.scrollHeight - 4) index = journeyPanels.length - 1;

    if (index !== activePanel) {
      activePanel = index;

      railButtons.forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === index);
        btn.setAttribute('aria-current', i === index ? 'true' : 'false');
      });

      // 只有当前屏的装饰继续动
      journeyPanels.forEach(function (panel, i) {
        panel.classList.toggle('is-active', i === index);
      });

      var current = journeyPanels[index];

      // 暗色场景里导航刻度要换成浅色
      document.body.classList.toggle(
        'is-scene-dark',
        current.classList.contains('scene--dusk') ||
        current.classList.contains('scene--galaxy') ||
        current.classList.contains('scene--rain')
      );

      if (current.id === 'panel-rain' && rainCtl) rainCtl.start();
    }

    var max = deck.scrollHeight - vh;
    var ratio = max > 0 ? Math.min(1, Math.max(0, top / max)) : 0;
    var fill = $('scroll-progress-fill');
    if (fill) fill.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
  }

  /* ---------------- 正文初始化 ---------------- */
  var journeyReady = false;

  function prepareJourney() {
    if (journeyReady) return;
    journeyReady = true;
    renderTimeline((config && config.timeline && config.timeline.photos) || []);
    initSky((config && config.memoryGame && config.memoryGame.pairs) || []);
    initScenery();
    initSceneryLayers();
    initActors();
    initGalaxy();
    initCake();
    initSparks();
    initPetals();
    initWall();
    initRain();
  }

  MB.activateScene = function (index) {
    activePanel = index;
    journeyPanels.forEach(function(p,i){p.classList.toggle('is-active',i===index); if(i===index)p.classList.add('is-in');});
    railButtons.forEach(function(b,i){b.classList.toggle('is-active',i===index);b.setAttribute('aria-current',String(i===index));});
    var current=journeyPanels[index];
    document.body.classList.toggle('is-scene-dark', current.classList.contains('scene--dusk')||current.classList.contains('scene--galaxy')||current.classList.contains('scene--rain'));
    if(current.id==='panel-rain'&&rainCtl)rainCtl.start();
    $('scroll-progress-fill').style.transform='scaleX('+((index+1)/journeyPanels.length)+')';
  };
  MB.openJourney = function(id) {
    if ($('journey').hidden) return;
    if(MB.theatre) MB.theatre.goTo(id||'panel-timeline');
    else requestAnimationFrame(function(){var target=$(id||'panel-timeline');if(target)target.scrollIntoView({behavior:'auto',block:'start'});updateJourneyScroll();});
  };

  function revealJourney(instant) {
    var journey = $('journey');
    if (!journey) return;

    var swap = function (revealDelay) {
      ['act-opening', 'act-story', 'act-blessing'].forEach(function (id) {
        var el = $(id);
        if (el) {
          el.hidden = true;
          el.classList.remove('is-fading', 'is-entering');
        }
      });

      journey.hidden = false;
      $('contents-open').hidden = false;
      // 正文是一屏一场景，页面本身不滚，滚动交给 #journey
      document.body.classList.add('is-locked');
      prepareJourney();
      buildJourneyNav();
      if(MB.theatre)MB.theatre.mount();
      setJourneyChrome(true);

      journey.scrollTop = 0;
      activePanel = -1;
      // 等柔光散开一些再让场景浮现，否则动画被盖住
      later(updateJourneyScroll, revealDelay || 60);

      var title = $('timeline-title');
      if (title && title.focus) title.focus({ preventScroll: true });
    };

    if (instant) swap(60);
    else veilSwap(function () { swap(520); });
  }

  /* ---------------- 流程 ---------------- */
  function boot() {
    buildBackground();
    document.body.classList.add('is-locked');



    api.loadConfig().then(function (result) {
      applyConfig(result.config);
      wire(result);

    }).catch(function () {
      applyConfig(api.FALLBACK_CONFIG);
      wire({ config: api.FALLBACK_CONFIG, source: 'builtin', error: null });

    });
  }

  function wire(loaded) {
    var gift = $('open-gift');
    var opening = $('act-opening');
    var storySection = $('act-story');
    var blessingSection = $('act-blessing');
    var currentStory = null;
    MB.stopIntro = function () { if(currentStory) currentStory.destroy(); timers.forEach(clearTimeout); timers.length=0; };

    // 音乐从开场就能用，不必等正文
    initMusic();

    /* --- 开场：打开礼物 --- */
    if (gift) {
      gift.addEventListener('click', function () {
        if (gift.dataset.opened) return;
        gift.dataset.opened = '1';
        gift.classList.add('is-open');
        later(function () {
          hideAct(opening, function () {
            showAct(storySection);
            startStory(loaded.config);
          });
        }, 640);
      });
    }

    /* --- 故事 --- */
    function startStory(cfg) {
      var root = $('story');
      var skipBtn = $('story-skip');
      var story;

      function toBlessing() {
        if (story && story.destroy) story.destroy();
        // 白天进入夜晚：用一次柔光过渡，避免硬切
        veilSwap(function () {
          storySection.hidden = true;
          storySection.classList.remove('is-fading', 'is-entering');
          showAct(blessingSection);
          startBlessing(cfg);
        });
      }

      try {
        story = MB.story.create(root, {
          scenes: cfg.story.scenes,
          durationMs: cfg.story.sceneDurationMs,
          transitionMs: cfg.story.transitionMs,
          onComplete: toBlessing
        });
      } catch (e) {
        toBlessing();
        return;
      }

      if (skipBtn) {
        skipBtn.onclick = function (event) {
          event.stopPropagation();
          story.skip();
        };
      }

      var frame = $('story-frame');
      if (frame) frame.onclick = function () { story.advance(); };

      currentStory = story;
      currentStory = story; story.start();
    }

    /* --- 夜空祝福 --- */
    function startBlessing(cfg) {
      var next = $('blessing-next');
      var writer = runBlessing(function () {});

      if (next) {
        next.onclick = function () {
          if (writer && writer.destroy) writer.destroy();
          revealJourney();
        };
      }
    }

    /* --- 通用关闭行为 --- */
    var egg = $('egg');
    if (egg) {
      egg.addEventListener('click', function (event) {
        if (event.target === egg) hideEgg();
      });
    }
    var eggClose = $('egg-close');
    if (eggClose) eggClose.addEventListener('click', hideEgg);

    var lightbox = $('lightbox');
    if (lightbox) {
      lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) closeLightbox();
      });
    }
    var lightboxClose = $('lightbox-close');
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { hideEgg(); closeLightbox(); return; }

      var overlayEgg = $('egg');
      if (overlayEgg && !overlayEgg.hidden) { trapTab(overlayEgg, event); return; }

      var overlayLightbox = $('lightbox');
      if (overlayLightbox && !overlayLightbox.hidden) { trapTab(overlayLightbox, event); return; }

      // 故事支持方向键 / 空格前进
      if (!storySection.hidden && (event.key === 'ArrowRight' || event.key === ' ')) {
        if (event.target && event.target.tagName === 'BUTTON') return;
        event.preventDefault();
        if (currentStory) currentStory.advance();
      }
    });

    /* 回到开头，重新走一遍 */
    var backTop = $('back-to-top');
    if (backTop) {
      backTop.onclick = function () {
        hideEgg();
        closeLightbox();

        if(MB.theatre)MB.theatre.unmount();
        $('contents-open').hidden = true;
        var journeyEl = $('journey');
        if (journeyEl) {
          journeyEl.hidden = true;
          journeyEl.scrollTop = 0;
        }
        storySection.hidden = true;
        blessingSection.hidden = true;

        // 收起章节导航，段落回到未激活状态，重走时重新浮现
        setJourneyChrome(false);
        resetPanelReveals();
        document.body.classList.remove('is-scene-dark');
        var progressFill = $('scroll-progress-fill');
        if (progressFill) progressFill.style.transform = 'scaleX(0)';

        if (currentStory && currentStory.destroy) currentStory.destroy();
        currentStory = null;

        var giftEl = $('open-gift');
        if (giftEl) {
          giftEl.classList.remove('is-open');
          delete giftEl.dataset.opened;
        }
        var linesEl = $('blessing-lines');
        if (linesEl) linesEl.innerHTML = '';
        var nextEl = $('blessing-next');
        if (nextEl) nextEl.hidden = true;

        document.body.classList.add('is-locked');
        opening.hidden = false;
        showAct(opening);
        if (global.scrollTo) global.scrollTo(0, 0);
      };
    }

    /* 首次加载时如果正文可见（刷新后），准备内容 */
    if (!$('journey').hidden) prepareJourney();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  global.addEventListener('pagehide', function () {
    timers.forEach(clearTimeout);
    timers.length = 0;
    if (musicEngine && musicEngine.destroy) {
      try { musicEngine.destroy(); } catch (e) { /* 上下文可能已关闭 */ }
      musicEngine = null;
    }
  });
})(window);
