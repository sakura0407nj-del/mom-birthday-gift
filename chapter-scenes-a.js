(function () {
  'use strict';
  var MB = window.MB || {};
  var E = MB.chapterEnhance;
  if (!E || typeof E.register !== 'function') return;

  function intIn(min, max, fallback) {
    return function (raw) {
      var n = typeof raw === 'number' ? raw : (typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN);
      return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
    };
  }
  function sceneOf(ctx, id) { return (ctx && ctx.scene) || document.getElementById('panel-' + id); }
  function copyOf(ctx, id) {
    if (ctx && ctx.copy) return ctx.copy;
    var all = MB.chapterCopy && MB.chapterCopy.scenes;
    return (all && all[id]) || {};
  }
  function list(c, key) { return c && Array.isArray(c[key]) ? c[key] : []; }
  function pick(arr, i) { return typeof arr[i] === 'string' ? arr[i] : ''; }
  function savedText(c, value) {
    var s = c && typeof c.saved === 'string' ? c.saved : '';
    return s.split('{value}').join(value);
  }
  function responseMsg(c, v) { return pick(list(c, 'responses'), v) || savedText(c, pick(list(c, 'choices'), v)); }
  function savedMsg(c, v) { return savedText(c, pick(list(c, 'choices'), v)); }
  function hint(ctx) {
    var c = ctx.copy || {};
    if (c.hint) ctx.body.appendChild(E.el('p', { class: 'ce-label' }, c.hint));
  }
  function choicePanel(ctx, opts) {
    var c = ctx.copy || {};

    ctx.body.appendChild(E.choices(ctx, function (i) {
      ctx.set(i);
      ctx.refresh();
      ctx.message(opts.showResponse ? c.saved : opts.msg(c, ctx.value()));
    }));
    if (opts.showResponse) {
      var r = pick(list(c, 'responses'), ctx.value());
      if (r) ctx.body.appendChild(E.el('p', { class: 'ce-note', id: ctx.id + '-ce-response' }, r));
    }
  }
  function artSvg(scene) {
    var art = scene && scene.querySelector('.world-art');
    if (!art) return null;
    return art.tagName.toLowerCase() === 'svg' ? art : art.querySelector('svg');
  }

  
  E.register('timeline', {
    initial: -1,
    validate: intIn(-1, 3, -1),
    apply: function (ctx) {
      var s = sceneOf(ctx, 'timeline');
      if (!s) return;
      var v = ctx.value();
      var mark = document.getElementById('timeline-ce-mark');
      if (!mark) {
        var host = s.querySelector('.garden-visual') || s.querySelector('.garden-content') || s;
        mark = E.el('span', { class: 'ce-scene-mark', id: 'timeline-ce-mark' });
        host.appendChild(mark);
      }
      if (v >= 0) {
        s.dataset.ceSeason = String(v);
        mark.textContent = pick(list(copyOf(ctx, 'timeline'), 'choices'), v);
        mark.hidden = !mark.textContent;
      } else {
        delete s.dataset.ceSeason;
        mark.textContent = '';
        mark.hidden = true;
      }
    },
    render: function (ctx) { choicePanel(ctx, { showResponse: true, msg: responseMsg }); }
  });

  var plate = null;
  var plateOrig = null;
  function findPlate(s) {
    if (plate) return plate;
    var svg = artSvg(s);
    if (!svg) return null;
    var nodes = svg.querySelectorAll('text, tspan');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].textContent.trim() === 'FOR MOM' && !nodes[i].querySelector('tspan')) {
        plate = nodes[i];
        plateOrig = { size: plate.getAttribute('font-size'), ls: plate.getAttribute('letter-spacing') };
        return plate;
      }
    }
    return null;
  }
  function restoreAttr(node, name, value) {
    if (value === null) node.removeAttribute(name); else node.setAttribute(name, value);
  }
  function cleanName(raw) {
    var s = raw == null ? '' : String(raw);
    s = Array.from(s).filter(function (ch) { var code = ch.charCodeAt(0); return code > 31 && code !== 127; }).join('').trim();
    return Array.from(s).slice(0, 12).join('').trim();
  }
  E.register('greenhouse', {
    initial: '',
    validate: function (raw) { try { return cleanName(raw); } catch (e) { return ''; } },
    apply: function (ctx) {
      var t = findPlate(sceneOf(ctx, 'greenhouse'));
      if (!t) return;
      var v = ctx.value();
      if (!v) {
        t.textContent = 'FOR MOM';
        restoreAttr(t, 'font-size', plateOrig.size);
        restoreAttr(t, 'letter-spacing', plateOrig.ls);
        t.style.removeProperty('font-size');
        t.style.removeProperty('letter-spacing');
        return;
      }
      var chars = Array.from(v);
      var wide = chars.some(function (ch) { return ch.charCodeAt(0) > 255; });
      var size = 15, ls = 3;
      if (wide) { size = chars.length > 6 ? 12 : 14; ls = chars.length > 6 ? 0 : 1; }
      else if (chars.length > 9) { size = 13; ls = 1; }
      t.textContent = v;
      t.setAttribute('font-size', String(size));
      t.setAttribute('letter-spacing', String(ls));
      t.style.fontSize = size + 'px';
      t.style.letterSpacing = ls + 'px';
    },
    render: function (ctx) {
      var c = ctx.copy || {};
      var common = ctx.common || {};
  
      var form = E.el('form', { class: 'ce-row', id: 'greenhouse-ce-form', novalidate: '' });
      var label = E.el('label', { class: 'ce-label', for: 'greenhouse-ce-input' }, c.title || c.entry || '');
      var input = E.el('input', { class: 'ce-input', id: 'greenhouse-ce-input', type: 'text', maxlength: '12', autocomplete: 'off', 'data-focus': 'input', placeholder: c.placeholder || '' });
      input.value = ctx.value();
      function save() {
        var v = cleanName(input.value);
        if (!v) { ctx.message(c.hint || ''); input.focus(); return; }
        ctx.set(v);
        ctx.refresh();
        ctx.message(savedText(c, v));
      }
      form.addEventListener('submit', function (ev) { ev.preventDefault(); save(); });
      var saveBtn = E.button(common.save || c.action || '', save, { class: 'ce-primary', 'data-focus': 'save' });
      var clearBtn = E.button(common.clear || '', function () {
        ctx.set('');
        ctx.refresh();
        ctx.message(c.hint || '');
      }, { class: 'ce-secondary', 'data-focus': 'clear' });
      form.appendChild(label);
      form.appendChild(input);
      form.appendChild(saveBtn);
      form.appendChild(clearBtn);
      ctx.body.appendChild(form);
    }
  });

  var STAMP_BG = `<circle r='10' fill='#fff6e6' stroke='#c46f6c' stroke-width='1.5'/>`;
  var STAMPS = [
    `<path d='M-6 4Q-6-6 0-7Q6-6 6 4Z' fill='#f2b8a2'/><path d='M0 4V-6M-3 4L-4-4M3 4L4-4' stroke='#c46f6c' stroke-width='1' fill='none'/>`,
    `<path d='M2-6A6 6 0 1 0 2 6A4.5 4.5 0 1 1 2-6Z' fill='#e8c46a'/>`,
    `<path d='M-6-2H3Q6-2 6-5M-6 3H5Q7 3 7 6' stroke='#6f9fb0' stroke-width='1.6' fill='none' stroke-linecap='round'/>`
  ];
  E.register('seaside', {
    initial: 0,
    validate: intIn(0, 2, 0),
    apply: function (ctx) {
      var s = sceneOf(ctx, 'seaside');
      var bottle = s && s.querySelector('.bottle-bob');
      if (!bottle) return;
      var stamp = document.getElementById('seaside-ce-stamp');
      if (!stamp) {
        stamp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        stamp.setAttribute('id', 'seaside-ce-stamp');
        stamp.setAttribute('class', 'ce-stamp');
        stamp.setAttribute('transform', 'translate(34 30)');
        stamp.setAttribute('aria-hidden', 'true');
        (bottle.querySelector('g') || bottle).appendChild(stamp);
      }
      stamp.innerHTML = STAMP_BG + STAMPS[ctx.value()];
    },
    render: function (ctx) {
      var c = ctx.copy || {};
      choicePanel(ctx, { showResponse: false, msg: savedMsg });
      var note = E.el('p', { class: 'ce-note', id: 'seaside-ce-note', role: 'status' });
      note.hidden = true;
      var row = E.el('div', { class: 'ce-row' });
      row.appendChild(E.button((ctx.common && ctx.common.receive) || c.action || '', function () {
        note.textContent = pick(list(c, 'responses'), ctx.value());
        note.hidden = !note.textContent;
        ctx.message('');
      }, { class: 'ce-primary', 'data-focus': 'receive' }));
      ctx.body.appendChild(row);
      ctx.body.appendChild(note);
    }
  });

  var SHADOW = `<ellipse cx='0' cy='6' rx='44' ry='6' fill='#1f3a33' opacity='.4'/>`;
  var PAWS = `<g fill='#d8e6cc' opacity='.6'><ellipse cx='-72' cy='12' rx='3' ry='5'/><ellipse cx='-98' cy='16' rx='3' ry='5'/><ellipse cx='-124' cy='12' rx='3' ry='5'/><ellipse cx='-150' cy='16' rx='3' ry='5'/></g>`;
  var ANIMALS = [
    SHADOW + PAWS + `<path d='M-24-12V0M-14-12V0M14-12V0M24-12V0' stroke='#e8d7b4' stroke-width='4' stroke-linecap='round'/><ellipse cx='0' cy='-22' rx='30' ry='14' fill='#f1e2c2'/><path d='M20-28L30-48' stroke='#f1e2c2' stroke-width='9' stroke-linecap='round'/><ellipse cx='34' cy='-52' rx='9' ry='7' fill='#f1e2c2'/><path d='M30-58l-4-12m0 0l-5-4m5 4l3-6M38-58l4-12m0 0l5-4m-5 4l-3-6' stroke='#cdb48a' stroke-width='2.5' fill='none' stroke-linecap='round'/><circle cx='37' cy='-53' r='1.6' fill='#2f4a42'/><circle cx='-27' cy='-26' r='4' fill='#fffaf0'/><circle cx='-6' cy='-24' r='2' fill='#d9c49d'/><circle cx='6' cy='-19' r='2' fill='#d9c49d'/>`,
    SHADOW + PAWS + `<ellipse cx='-2' cy='-15' rx='22' ry='16' fill='#f1e2c2'/><circle cx='-24' cy='-16' r='6' fill='#fffaf0'/><circle cx='18' cy='-32' r='11' fill='#f1e2c2'/><ellipse cx='13' cy='-54' rx='4.5' ry='13' fill='#f1e2c2' transform='rotate(-12 13 -54)'/><ellipse cx='24' cy='-53' rx='4.5' ry='13' fill='#f1e2c2' transform='rotate(14 24 -53)'/><ellipse cx='13' cy='-54' rx='2' ry='9' fill='#e9b7a8' transform='rotate(-12 13 -54)'/><ellipse cx='24' cy='-53' rx='2' ry='9' fill='#e9b7a8' transform='rotate(14 24 -53)'/><circle cx='22' cy='-34' r='1.6' fill='#2f4a42'/><circle cx='28' cy='-30' r='1.6' fill='#d98f86'/><ellipse cx='6' cy='-1' rx='9' ry='4' fill='#e8d7b4'/>`,
    `<ellipse cx='0' cy='-4' rx='26' ry='9' fill='#7f9a86'/><path d='M-70 12l-4-4m4 4l4-4m-4 4v4M-96 16l-4-4m4 4l4-4m-4 4v4M-122 12l-4-4m4 4l4-4m-4 4v4' stroke='#d8e6cc' stroke-width='1.5' fill='none' opacity='.6'/><path d='M-16-20L-34-28L-30-14Z' fill='#cdb48a'/><ellipse cx='0' cy='-20' rx='17' ry='12' fill='#f1e2c2'/><circle cx='14' cy='-32' r='8' fill='#f1e2c2'/><path d='M21-33L29-30L21-28Z' fill='#e0a65c'/><path d='M-10-22Q0-30 10-20Q0-14-10-22Z' fill='#cdb48a'/><circle cx='16' cy='-34' r='1.5' fill='#2f4a42'/><path d='M-3-9V-3M4-9V-3' stroke='#cdb48a' stroke-width='2' stroke-linecap='round'/>`
  ];
  E.register('forest', {
    initial: -1,
    validate: intIn(-1, 2, -1),
    apply: function (ctx) {
      var svg = artSvg(sceneOf(ctx, 'forest'));
      if (!svg) return;
      var g = document.getElementById('forest-ce-animal');
      if (!g) {
        g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', 'forest-ce-animal');
        g.setAttribute('class', 'ce-animal');
        g.setAttribute('transform', 'translate(560 590)');
        g.setAttribute('aria-hidden', 'true');
        svg.appendChild(g);
      }
      var v = ctx.value();
      g.innerHTML = v >= 0 ? ANIMALS[v] : '';
      g.style.display = v >= 0 ? '' : 'none';
    },
    render: function (ctx) { choicePanel(ctx, { showResponse: true, msg: responseMsg }); }
  });

  var FLIGHT_X = ['-140px', '0px', '140px'];
  var cloudsLast = null;
  E.register('clouds', {
    initial: 1,
    validate: intIn(0, 2, 1),
    apply: function (ctx) {
      var s = sceneOf(ctx, 'clouds');
      if (!s) return;
      var v = ctx.value();
      s.style.setProperty('--ce-flight-x', FLIGHT_X[v]);
      var changed = cloudsLast !== null && cloudsLast !== v;
      cloudsLast = v;
      if (!changed) return;
      var released = s.classList.contains('balloon-released') || !!s.querySelector('.balloon-released');
      var btn = document.getElementById('release-balloon');
      if (released && btn) btn.click();
    },
    render: function (ctx) { choicePanel(ctx, { showResponse: true, msg: savedMsg }); }
  });

  var HORSE = ['5s', '3s', '1.8s'];
  var BOX = ['18s', '12s', '8s'];
  E.register('musicbox', {
    initial: 1,
    validate: intIn(0, 2, 1),
    apply: function (ctx) {
      var s = sceneOf(ctx, 'musicbox');
      if (!s) return;
      var v = ctx.value();
      s.style.setProperty('--ce-horse-duration', HORSE[v]);
      s.style.setProperty('--ce-box-duration', BOX[v]);
    },
    render: function (ctx) { choicePanel(ctx, { showResponse: true, msg: responseMsg }); }
  });
})();
