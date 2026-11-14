/* ============================================================
   六幕剪影故事
   纸雕插画：暖色纸底 + 深墨剪影 + 一处暖光
   人物统一用「长衫剪影」：头 + 落肩长衣 + 露出一双脚
   ============================================================ */
(function (global) {
  'use strict';

  var INK = '#2A2420';
  var SVG_OPEN = '<svg viewBox="0 0 360 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">';

  /* 长衫人物：原点在双脚中心，总高约 120 个本地单位 */
  function figure(x, y, height, options) {
    var opt = options || {};
    var scale = (height / 120).toFixed(4);
    var flip = opt.flip ? ' scale(-1 1)' : '';
    var opacity = opt.opacity != null ? ' opacity="' + opt.opacity + '"' : '';
    var bun = opt.bun ? '<circle cx="-9.5" cy="-104" r="6.4"/>' : '';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + scale + ')' + flip + '" fill="' + (opt.fill || INK) + '"' + opacity + '>' +
      '<circle cx="0" cy="-96" r="11.5"/>' +
      bun +
      '<path d="M-26 -84q26-13 52 0l7 78q-33 9-66 0z"/>' +
      '<ellipse cx="-10" cy="-2" rx="8.5" ry="4.2"/>' +
      '<ellipse cx="10" cy="-2" rx="8.5" ry="4.2"/>' +
    '</g>';
  }

  /* ---------------- 第 1 幕：黄昏小路牵手 ---------------- */
  var SCENE_1 =
    '<defs>' +
      '<linearGradient id="s1sky" x1="0" y1="0" x2="0.22" y2="1">' +
        '<stop offset="0" stop-color="#FCEDD6"/>' +
        '<stop offset=".38" stop-color="#F7D8AC"/>' +
        '<stop offset=".7" stop-color="#EFBC84"/>' +
        '<stop offset="1" stop-color="#E4A46E"/>' +
      '</linearGradient>' +
      '<radialGradient id="s1sun" cx=".5" cy=".5" r=".5">' +
        '<stop offset="0" stop-color="#FFF3D6" stop-opacity=".98"/>' +
        '<stop offset=".42" stop-color="#FFDFA6" stop-opacity=".5"/>' +
        '<stop offset="1" stop-color="#FFD794" stop-opacity="0"/>' +
      '</radialGradient>' +
    '</defs>' +
    '<rect width="360" height="440" fill="url(#s1sky)"/>' +
    '<circle cx="254" cy="204" r="88" fill="url(#s1sun)"/>' +
    '<circle cx="254" cy="204" r="28" fill="#FFF0CB" opacity=".92"/>' +

    '<path d="M0 296q52-38 106-16t98-8 88 14 68-8v162H0z" fill="#CE9364" opacity=".18"/>' +
    '<path d="M0 312q64-26 130-8t116-10 114 16v130H0z" fill="#B7784C" opacity=".24"/>' +
    '<path d="M190 300h18l68 140H88z" fill="#A76A42" opacity=".26"/>' +

    '<g fill="' + INK + '" opacity=".32">' +
      '<rect x="47" y="302" width="6" height="140" rx="3"/>' +
      '<circle cx="43" cy="292" r="25"/>' +
      '<circle cx="62" cy="274" r="21"/>' +
      '<circle cx="29" cy="270" r="17"/>' +
    '</g>' +
    '<g fill="' + INK + '" opacity=".22">' +
      '<rect x="321" y="330" width="5" height="112" rx="2.5"/>' +
      '<circle cx="318" cy="322" r="18"/>' +
      '<circle cx="332" cy="308" r="15"/>' +
      '<circle cx="307" cy="306" r="12"/>' +
    '</g>' +

    figure(158, 376, 118, { bun: true }) +
    figure(214, 390, 86) +

    '<g stroke="' + INK + '" stroke-width="8" stroke-linecap="round" fill="none">' +
      '<path d="M183 295l18 33"/>' +
      '<path d="M197 334l6-5"/>' +
    '</g>';

  /* ---------------- 第 2 幕：灯下缝补 ---------------- */
  var SCENE_2 =
    '<defs>' +
      '<linearGradient id="s2wall" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#F5E6CF"/>' +
        '<stop offset="1" stop-color="#E2C7A3"/>' +
      '</linearGradient>' +
      '<linearGradient id="s2night" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#4E3F32"/>' +
        '<stop offset="1" stop-color="#382C23"/>' +
      '</linearGradient>' +
      '<radialGradient id="s2lamp" cx=".5" cy=".5" r=".5">' +
        '<stop offset="0" stop-color="#FFE7B8" stop-opacity=".92"/>' +
        '<stop offset=".42" stop-color="#F8C98A" stop-opacity=".34"/>' +
        '<stop offset="1" stop-color="#F8C98A" stop-opacity="0"/>' +
      '</radialGradient>' +
    '</defs>' +
    '<rect width="360" height="440" fill="url(#s2wall)"/>' +

    '<rect x="232" y="74" width="98" height="136" rx="4" fill="' + INK + '"/>' +
    '<rect x="240" y="82" width="82" height="120" fill="url(#s2night)"/>' +
    '<circle cx="304" cy="110" r="9" fill="#F6E1BC" opacity=".85"/>' +
    '<path d="M281 82v120M240 142h82" stroke="' + INK + '" stroke-width="3.5"/>' +

    '<ellipse cx="86" cy="300" rx="104" ry="94" fill="url(#s2lamp)"/>' +

    '<g fill="' + INK + '">' +
      '<ellipse cx="86" cy="330" rx="26" ry="6"/>' +
      '<path d="M86 324v-12" stroke="' + INK + '" stroke-width="4.5"/>' +
      '<path d="M72 312h28l-6-22H78z"/>' +
    '</g>' +
    '<ellipse cx="86" cy="312" rx="12" ry="3.4" fill="#FFEBC6"/>' +

    '<rect x="22" y="330" width="316" height="9" rx="4" fill="' + INK + '"/>' +
    '<rect x="22" y="339" width="316" height="4" fill="' + INK + '" opacity=".45"/>' +

    '<g fill="' + INK + '">' +
      '<circle cx="176" cy="248" r="12"/>' +
      '<circle cx="164" cy="240" r="6.6"/>' +
      '<path d="M176 260c-16 0-25 11-26 26l-2 44h56l-2-44c-1-15-10-26-26-26z"/>' +
    '</g>' +
    '<path d="M206 330q4-20 24-20t26 17l-1 3z" fill="' + INK + '"/>' +
    '<g stroke="' + INK + '" stroke-width="9" stroke-linecap="round" fill="none">' +
      '<path d="M198 290l14 22"/>' +
      '<path d="M190 302l12 14"/>' +
    '</g>';

  /* ---------------- 第 3 幕：门口目送 ---------------- */
  var SCENE_3 =
    '<defs>' +
      '<linearGradient id="s3sky" x1="0" y1="0" x2="0.1" y2="1">' +
        '<stop offset="0" stop-color="#F7E1C5"/>' +
        '<stop offset=".55" stop-color="#EBBC8C"/>' +
        '<stop offset="1" stop-color="#D99A6A"/>' +
      '</linearGradient>' +
      '<linearGradient id="s3room" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FFF2DA"/>' +
        '<stop offset="1" stop-color="#F6CD93"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<rect width="360" height="440" fill="url(#s3sky)"/>' +
    '<path d="M0 396h360v44H0z" fill="#B07A50" opacity=".26"/>' +
    '<path d="M184 406q62-16 176-56v36q-114 42-176 60z" fill="#A96B41" opacity=".26"/>' +

    '<rect x="34" y="84" width="152" height="318" fill="' + INK + '"/>' +
    '<rect x="46" y="96" width="128" height="306" fill="url(#s3room)"/>' +
    '<path d="M46 402h128l106 38H2z" fill="#FFE2B2" opacity=".45"/>' +

    figure(110, 402, 132, { opacity: 0.96, bun: true }) +

    '<g fill="' + INK + '" opacity=".9">' +
      '<circle cx="300" cy="322" r="6.5"/>' +
      '<path d="M300 330c-7 0-11 5-12 11l-1 11h26l-1-11c-1-6-5-11-12-11z"/>' +
      '<ellipse cx="296" cy="353" rx="4" ry="2"/>' +
      '<ellipse cx="304" cy="353" rx="4" ry="2"/>' +
    '</g>' +
    '<path d="M294 334l-6 11" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round" fill="none" opacity=".9"/>';

  /* ---------------- 第 4 幕：窗后 ---------------- */
  var SCENE_4 =
    '<defs>' +
      '<linearGradient id="s4night" x1="0" y1="0" x2="0.12" y2="1">' +
        '<stop offset="0" stop-color="#57452F"/>' +
        '<stop offset="1" stop-color="#362A1E"/>' +
      '</linearGradient>' +
      '<radialGradient id="s4moon" cx=".5" cy=".5" r=".5">' +
        '<stop offset="0" stop-color="#FFF2D2" stop-opacity=".95"/>' +
        '<stop offset=".45" stop-color="#FFE9BE" stop-opacity=".24"/>' +
        '<stop offset="1" stop-color="#FFE9BE" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="s4room" x1="0" y1="0" x2="0.1" y2="1">' +
        '<stop offset="0" stop-color="#FFEECB"/>' +
        '<stop offset="1" stop-color="#F1C489"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<rect width="360" height="440" fill="url(#s4night)"/>' +
    '<circle cx="74" cy="104" r="52" fill="url(#s4moon)"/>' +
    '<circle cx="74" cy="104" r="19" fill="#FFF4DA" opacity=".85"/>' +

    '<rect x="116" y="84" width="208" height="316" rx="5" fill="' + INK + '"/>' +
    '<rect x="128" y="96" width="184" height="292" fill="url(#s4room)"/>' +
    '<path d="M128 388h184l46 38H82z" fill="#F6CE96" opacity=".2"/>' +

    '<g fill="#2E231A">' +
      '<circle cx="220" cy="272" r="25"/>' +
      '<circle cx="198" cy="260" r="11"/>' +
      '<path d="M220 300c-30 0-50 21-52 52l-2 36h108l-2-36c-2-31-22-52-52-52z"/>' +
    '</g>' +

    '<path d="M150 96v292M290 96v292M128 186h184" stroke="' + INK + '" stroke-width="9"/>' +
    '<path d="M128 96h184v292H128z" fill="none" stroke="#FFEFD2" stroke-width="1.4" opacity=".3"/>';

  /* ---------------- 第 5 幕：归来拥抱 ---------------- */
  var SCENE_5 =
    '<defs>' +
      '<linearGradient id="s5wall" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#E8CFAC"/>' +
        '<stop offset="1" stop-color="#CFAE84"/>' +
      '</linearGradient>' +
      '<linearGradient id="s5door" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FFF2D8"/>' +
        '<stop offset="1" stop-color="#F7D09A"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<rect width="360" height="440" fill="url(#s5wall)"/>' +
    '<rect x="112" y="44" width="172" height="396" fill="#E9C49B" opacity=".45"/>' +
    '<rect x="124" y="56" width="148" height="384" fill="url(#s5door)"/>' +
    '<path d="M112 44h172v7H112z" fill="' + INK + '" opacity=".14"/>' +
    '<path d="M0 396h360v44H0z" fill="#B07A50" opacity=".14"/>' +

    figure(150, 398, 150, { bun: true }) +
    figure(224, 398, 144) +

    '<g stroke="' + INK + '" stroke-width="10" stroke-linecap="round" fill="none">' +
      '<path d="M180 302q16 10 26 18"/>' +
      '<path d="M196 318q-16 6-26 12"/>' +
    '</g>' +

    '<g fill="' + INK + '" opacity=".92">' +
      '<path d="M58 344h52v34H58z"/>' +
      '<path d="M64 344v-6h40v6" fill="none" stroke="' + INK + '" stroke-width="4"/>' +
      '<path d="M58 356h52" stroke="#EFDCC2" stroke-width="2.4"/>' +
    '</g>';

  /* ---------------- 第 6 幕：一起吹蜡烛 ---------------- */
  var SCENE_6 =
    '<defs>' +
      '<linearGradient id="s6wall" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FBEFD9"/>' +
        '<stop offset="1" stop-color="#EACD9F"/>' +
      '</linearGradient>' +
      '<radialGradient id="s6glow" cx=".5" cy=".5" r=".5">' +
        '<stop offset="0" stop-color="#FFEBC2" stop-opacity=".92"/>' +
        '<stop offset=".5" stop-color="#FFD79B" stop-opacity=".3"/>' +
        '<stop offset="1" stop-color="#FFD79B" stop-opacity="0"/>' +
      '</radialGradient>' +
    '</defs>' +
    '<rect width="360" height="440" fill="url(#s6wall)"/>' +
    '<ellipse cx="180" cy="262" rx="132" ry="108" fill="url(#s6glow)"/>' +

    '<g fill="' + INK + '">' +
      '<circle cx="64" cy="246" r="15"/>' +
      '<circle cx="49" cy="238" r="8"/>' +
      '<path d="M64 262c-24 0-38 20-40 46l-2 30h84l-2-30c-2-26-16-46-40-46z"/>' +
      '<circle cx="298" cy="252" r="14"/>' +
      '<path d="M298 267c-23 0-36 19-38 44l-2 27h80l-2-27c-2-25-15-44-38-44z"/>' +
    '</g>' +

    '<rect x="16" y="332" width="328" height="8" rx="4" fill="' + INK + '"/>' +
    '<rect x="16" y="340" width="328" height="100" fill="' + INK + '" opacity=".12"/>' +

    '<ellipse cx="180" cy="331" rx="92" ry="8" fill="' + INK + '" opacity=".1"/>' +
    '<rect x="94" y="288" width="172" height="42" rx="5" fill="#F3DDBB"/>' +
    '<path d="M94 298q15-13 30 0t30 0 30 0 30 0 30 0 26 0v-10H94z" fill="#FFFBF2"/>' +
    '<rect x="120" y="252" width="120" height="36" rx="5" fill="#F8E8CE"/>' +
    '<path d="M120 262q14-12 28 0t28 0 28 0 28 0 8 0v-10H120z" fill="#FFFDF8"/>' +

    '<g fill="#C08A5A">' +
      '<rect x="151" y="216" width="6" height="40" rx="3"/>' +
      '<rect x="177" y="210" width="6" height="46" rx="3"/>' +
      '<rect x="203" y="216" width="6" height="40" rx="3"/>' +
    '</g>' +
    '<g fill="#F6B24C">' +
      '<path d="M154 216c4-6 6-10 6-13a6 6 0 0 0-12 0c0 3 2 7 6 13z"/>' +
      '<path d="M180 210c4-6 6-10 6-13a6 6 0 0 0-12 0c0 3 2 7 6 13z"/>' +
      '<path d="M206 216c4-6 6-10 6-13a6 6 0 0 0-12 0c0 3 2 7 6 13z"/>' +
    '</g>' +
    '<g fill="#FFE3AE" opacity=".8">' +
      '<ellipse cx="154" cy="213" rx="2.4" ry="3.6"/>' +
      '<ellipse cx="180" cy="207" rx="2.4" ry="3.6"/>' +
      '<ellipse cx="206" cy="213" rx="2.4" ry="3.6"/>' +
    '</g>';

  var SCENES = {
    'hand-in-hand': SCENE_1,
    'lamplight':    SCENE_2,
    'doorway':      SCENE_3,
    'window':       SCENE_4,
    'homecoming':   SCENE_5,
    'candles':      SCENE_6
  };

  function sceneHtml(id, index) {
    return '<div class="story-scene" data-index="' + index + '" aria-hidden="true">' +
             SVG_OPEN + (SCENES[id] || SCENE_1) + '</svg>' +
           '</div>';
  }

  /* ---------------- 播放控制 ---------------- */
  function Story(root, options) {
    this.root = root;
    this.opts = options || {};
    this.scenes = this.opts.scenes || [];
    this.duration = this.opts.durationMs || 7000;
    this.fade = this.opts.transitionMs != null ? this.opts.transitionMs : 700;
    this.index = -1;
    this.elapsed = 0;
    this.lastTs = 0;
    this.rafId = 0;
    this.running = false;
    this.finished = false;
    this.captionTimer = 0;
    this.boundFrame = this.frame.bind(this);
    this.onVisibility = this.handleVisibility.bind(this);
  }

  Story.prototype.build = function () {
    var scenesEl = this.root.querySelector('.story-scenes');
    var captionEl = this.root.querySelector('.story-caption');
    var dotsEl = this.root.querySelector('.story-dots');

    if (!scenesEl || !captionEl) return false;

    scenesEl.innerHTML = this.scenes.map(function (scene, i) {
      return sceneHtml(scene.id, i);
    }).join('');

    if (dotsEl) {
      dotsEl.innerHTML = this.scenes.map(function () {
        return '<li class="story-dot"></li>';
      }).join('');
    }

    this.sceneEls = Array.prototype.slice.call(scenesEl.querySelectorAll('.story-scene'));
    this.captionEl = captionEl;
    this.dotEls = dotsEl ? Array.prototype.slice.call(dotsEl.querySelectorAll('.story-dot')) : [];

    this.root.style.setProperty('--story-fade', (this.fade / 1000) + 's');

    return this.sceneEls.length > 0;
  };

  Story.prototype.show = function (index) {
    var self = this;
    if (index < 0 || index >= this.sceneEls.length) return;

    this.sceneEls.forEach(function (el, i) {
      var active = i === index;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    this.dotEls.forEach(function (el, i) {
      el.classList.toggle('is-active', i === index);
      el.classList.toggle('is-done', i < index);
    });

    var caption = this.scenes[index] && this.scenes[index].caption;
    if (this.captionEl && caption) {
      clearTimeout(this.captionTimer);
      this.captionEl.classList.remove('is-in');
      this.captionTimer = setTimeout(function () {
        self.captionEl.textContent = caption;
        void self.captionEl.offsetWidth;
        self.captionEl.classList.add('is-in');
      }, 180);
    }

    if (typeof this.opts.onProgress === 'function') {
      this.opts.onProgress(index, this.scenes[index]);
    }
  };

  Story.prototype.start = function () {
    if (this.running || this.finished) return;
    if (!this.build()) return;

    this.running = true;
    this.index = 0;
    this.elapsed = 0;
    this.lastTs = 0;
    this.show(0);

    document.addEventListener('visibilitychange', this.onVisibility);
    this.rafId = requestAnimationFrame(this.boundFrame);
  };

  Story.prototype.frame = function (ts) {
    if (!this.running) return;

    if (!this.lastTs) this.lastTs = ts;
    var delta = ts - this.lastTs;
    this.lastTs = ts;

    if (delta > 0 && delta < 400 && !document.hidden) this.elapsed += delta;

    if (this.elapsed >= this.duration) {
      this.elapsed = 0;
      this.advance();
      if (!this.running) return;
    }

    this.rafId = requestAnimationFrame(this.boundFrame);
  };

  Story.prototype.handleVisibility = function () {
    this.lastTs = 0;
  };

  Story.prototype.advance = function () {
    if (!this.running) return;
    var next = this.index + 1;
    if (next >= this.sceneEls.length) { this.finish(); return; }
    this.index = next;
    this.elapsed = 0;
    this.show(next);
  };

  Story.prototype.finish = function () {
    if (this.finished) return;
    this.finished = true;
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    clearTimeout(this.captionTimer);
    document.removeEventListener('visibilitychange', this.onVisibility);

    var last = this.sceneEls.length - 1;
    this.sceneEls.forEach(function (el, i) {
      el.classList.toggle('is-active', i === last);
    });
    this.dotEls.forEach(function (el, i) {
      el.classList.toggle('is-active', i === last);
      el.classList.toggle('is-done', i < last);
    });

    if (typeof this.opts.onComplete === 'function') this.opts.onComplete();
  };

  Story.prototype.skip = function () {
    if (this.finished) return;
    if (!this.running && !this.build()) return;
    this.finish();
  };

  Story.prototype.destroy = function () {
    this.running = false;
    this.finished = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    clearTimeout(this.captionTimer);
    document.removeEventListener('visibilitychange', this.onVisibility);
  };

  global.MB = global.MB || {};
  global.MB.story = {
    create: function (root, options) { return new Story(root, options); },
    sceneIds: Object.keys(SCENES)
  };
})(window);
