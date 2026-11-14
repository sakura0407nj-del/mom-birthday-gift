/* 每个场景的远景：云、三层纸剪山脊、树、草。
   和剪影小人同一套语言，只负责把空间撑开，不抢内容。 */

(function (global) {
  'use strict';

  var MB = global.MB || (global.MB = {});

  /* 由远到近：天光 → 云 → 远山 → 中山 → 近坡 → 草 */
  var PALETTES = {
    timeline: { sky: '#FFF3DF', cloud: '#F6E4C8', far: '#E6CFAC', mid: '#D3B48A', near: '#BB976A', ink: '#8E6B44' },
    look: { sky: '#3B2E3E', cloud: '#4A3A4E', far: '#3C2F40', mid: '#2A2132', near: '#191221', ink: '#0F0A16' },
    party: { sky: '#2A2033', cloud: '#33263D', far: '#241B2D', mid: '#1A1323', near: '#100C16', ink: '#090610' },
    greet: { sky: '#FFF0E8', cloud: '#F8DDD0', far: '#EDCBB9', mid: '#DFB39E', near: '#C99A83', ink: '#A97A63' },
    receive: { sky: '#2B2020', cloud: '#372828', far: '#312424', mid: '#241A1A', near: '#171010', ink: '#0F0A0A' },
    lean: { sky: '#FFF2D8', cloud: '#F7E3BE', far: '#E9CFA4', mid: '#D7B886', near: '#C09B6A', ink: '#98723F' }
  };

  function ridge(y, amp, seed) {
    var pts = [];
    for (var x = 0; x <= 375; x += 12) {
      var t = x / 375;
      var h = Math.sin(t * 5.3 + seed) * amp * 0.6
        + Math.sin(t * 10.1 + seed * 2.1) * amp * 0.28
        + Math.sin(t * 2.1 + seed * 0.6) * amp * 0.5;
      pts.push(x + ' ' + (y + h).toFixed(1));
    }
    return 'M0 300 L0 ' + pts[0].split(' ')[1] + ' L' + pts.join(' L') + ' L375 300 Z';
  }

  function cloud(x, y, s, color, op, dur) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + color + '" opacity="' + op + '">' +
      '<g class="cloud-inner" style="--dur:' + (dur || 64) + 's">' +
      '<ellipse cx="0" cy="0" rx="36" ry="11"/>' +
      '<ellipse cx="-22" cy="-7" rx="21" ry="10"/>' +
      '<ellipse cx="20" cy="-6" rx="24" ry="10"/>' +
      '<ellipse cx="2" cy="-12" rx="18" ry="9"/>' +
      '</g></g>';
  }

  function tree(x, base, scale, color) {
    return '<g transform="translate(' + x + ' ' + base + ') scale(' + scale + ')" fill="' + color + '">' +
      '<path d="M-3 0 L-2 -30 L2 -30 L3 0 Z"/>' +
      '<ellipse cx="0" cy="-46" rx="21" ry="19"/>' +
      '<ellipse cx="-15" cy="-34" rx="14" ry="12"/>' +
      '<ellipse cx="15" cy="-35" rx="15" ry="12"/>' +
      '<ellipse cx="2" cy="-27" rx="16" ry="11"/>' +
      '</g>';
  }

  function house(x, base, scale, color, lit) {
    return '<g transform="translate(' + x + ' ' + base + ') scale(' + scale + ')" fill="' + color + '">' +
      '<path d="M-34 0 V-38 L0 -60 L34 -38 V0 Z"/>' +
      '<rect x="-24" y="-30" width="17" height="16" fill="' + lit + '" opacity=".55"/>' +
      '<rect x="7" y="-30" width="13" height="16" fill="' + lit + '" opacity=".35"/>' +
      '</g>';
  }

  function grass(baseY, color) {
    var out = '';
    for (var i = 0; i < 30; i++) {
      var x = (i * 13 + (i % 4) * 4) % 375;
      var h = 9 + (i % 5) * 5;
      var lean = (i % 3) - 1;
      out += '<path d="M' + x + ' ' + baseY + ' q ' + (2 + lean) + ' -' + (h * 0.6) + ' ' +
        (4 + lean * 3) + ' -' + h + '" stroke="' + color + '" stroke-width="2.2" fill="none" ' +
        'stroke-linecap="round" opacity=".42"/>';
    }
    return out;
  }

  var SCENES = {
    timeline: {
      seed: 1.2,
      sky: function (p) {
        return cloud(296, 60, 1.15, p.cloud, 0.7, 62) + cloud(120, 104, 0.8, p.cloud, 0.5, 76)
          + cloud(60, 42, 0.62, p.cloud, 0.38, 88);
      },
      items: function (p) {
        return tree(40, 268, 1.9, p.ink) + tree(96, 272, 1.15, p.ink) + tree(330, 270, 1.5, p.ink);
      }
    },
    look: {
      seed: 2.6,
      sky: function () { return ''; },
      items: function (p) { return tree(30, 270, 2.0, p.ink) + tree(76, 273, 1.2, p.ink); }
    },
    party: {
      seed: 3.4,
      sky: function () { return ''; },
      items: function () { return ''; }
    },
    greet: {
      seed: 4.1,
      sky: function (p) { return cloud(110, 70, 1.0, p.cloud, 0.62, 58) + cloud(300, 118, 0.75, p.cloud, 0.44, 72); },
      items: function (p) {
        return house(310, 266, 1.5, p.ink, '#FFE7B8') + tree(240, 272, 1.5, p.ink) + tree(38, 270, 1.7, p.ink);
      }
    },
    receive: {
      seed: 5.3,
      sky: function () { return ''; },
      items: function (p) { return tree(28, 270, 1.9, p.ink) + tree(340, 271, 1.4, p.ink); }
    },
    lean: {
      seed: 6.2,
      sky: function (p) { return cloud(250, 84, 0.9, p.cloud, 0.55, 70) + cloud(90, 130, 0.6, p.cloud, 0.4, 84); },
      items: function () { return ''; }
    }
  };

  MB.scenery = {
    render: function (name, box) {
      var cfg = SCENES[name];
      var p = PALETTES[name];
      if (!cfg || !p || !box) return;

      var svg = '' +
        '<svg class="hills" viewBox="0 0 375 300" preserveAspectRatio="none" focusable="false" aria-hidden="true">' +
          cfg.sky(p) +
          '<path class="hill hill--far" d="' + ridge(196, 20, cfg.seed) + '" fill="' + p.far + '"/>' +
          '<path class="hill hill--mid" d="' + ridge(228, 14, cfg.seed + 2.1) + '" fill="' + p.mid + '"/>' +
          '<path class="hill hill--near" d="' + ridge(258, 8, cfg.seed + 4.4) + '" fill="' + p.near + '"/>' +
          cfg.items(p) +
          grass(296, p.ink) +
        '</svg>';

      box.insertAdjacentHTML('afterbegin', svg);
    }
  };
})(window);
