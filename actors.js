/* 六个场景的剪影小人。
   同一对人物（一个大人、一个小孩，许愿那屏再加一位家人）贯穿全程，
   动作依次是：并肩走 → 抬头望星 → 围到蛋糕旁 → 门口相迎 → 伸手接祝福 → 灯下相靠。 */

(function (global) {
  'use strict';

  var MB = global.MB || (global.MB = {});

  var VIEW_W = 375;
  var VIEW_H = 260;
  var GROUND = 250;

  /* 一个纸剪小人：脚在 y=0，身高约 146 单位 */
  function figure(x, opts) {
    var o = opts || {};
    var s = o.scale || 1;
    var flip = o.flip ? ' scale(-1 1)' : '';
    var bun = o.bun ? '<circle class="actor-bun" cx="14" cy="-145" r="7"/>' : '';
    var armFront = o.armFront != null ? ' style="transform: rotate(' + o.armFront + 'deg)"' : '';

    return '' +
      '<g class="actor" transform="translate(' + x + ' 0) scale(' + s + ')' + flip + '">' +
        '<g class="actor-inner">' +
          '<path class="actor-arm actor-arm--b" d="M-12 -104 L-20 -58"/>' +
          '<path class="actor-coat" d="M-21 -110 C-26 -76 -31 -40 -34 0 L34 0 C31 -40 26 -76 21 -110 Z"/>' +
          '<circle class="actor-head" cx="0" cy="-130" r="16"/>' +
          bun +
          '<path class="actor-arm actor-arm--f" d="M12 -104 L20 -58"' + armFront + '/>' +
        '</g>' +
      '</g>';
  }

  function stage(inner, extraClass) {
    return '<svg class="actors-svg ' + (extraClass || '') + '" viewBox="0 0 ' + VIEW_W + ' ' + VIEW_H +
      '" preserveAspectRatio="xMidYMax meet" focusable="false" aria-hidden="true">' +
      '<g transform="translate(0 ' + GROUND + ')">' + inner + '</g></svg>';
  }

  var ACTS = {
    /* 01 时光：一大一小并肩走着 */
    walk: function () {
      return stage(
        '<g class="act-group">' +
          figure(104, {}) +
          figure(178, { scale: 0.72, bun: true }) +
        '</g>'
      );
    },

    /* 02 心愿：停下来，抬头看星星，小孩抬手指着天上 */
    look: function () {
      return stage(
        '<g class="act-group">' +
          figure(92, { armFront: -96 }) +
          figure(164, { scale: 0.72, bun: true, armFront: -108 }) +
        '</g>',
        'is-looking'
      );
    },

    /* 03 许愿：三个人围到蛋糕旁边，小的在前面 */
    party: function () {
      return stage(
        '<g class="act-group">' +
          figure(58, { scale: 0.94 }) +
          figure(178, { scale: 0.66, bun: true }) +
          figure(316, { scale: 0.94 }) +
        '</g>',
        'is-gathered'
      );
    },

    /* 04 祝福：门口，家人陆续到来，有人在招手 */
    greet: function () {
      return stage(
        '<g class="act-group">' +
          figure(62, { scale: 0.9 }) +
          figure(130, { scale: 0.7, bun: true }) +
          figure(214, { scale: 1, flip: true }) +
        '</g>',
        'is-greeting'
      );
    },

    /* 05 祝福雨：抬头，张开手接落下来的话 */
    receive: function () {
      return stage(
        '<g class="act-group">' +
          figure(118, {}) +
          figure(196, { scale: 0.74, bun: true }) +
        '</g>',
        'is-receiving'
      );
    },

    /* 06 最后：灯下，两个人靠在一起 */
    lean: function () {
      return stage(
        '<g class="act-group">' +
          figure(78, {}) +
          figure(140, { scale: 0.72, bun: true }) +
        '</g>',
        'is-leaning'
      );
    }
  };

  MB.actors = {
    render: function (name, box) {
      var build = ACTS[name];
      if (!build || !box) return;
      box.innerHTML = build();
    }
  };
})(window);
