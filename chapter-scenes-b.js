(function () {
  'use strict';
  var MB = window.MB = window.MB || {};
  var E = MB.chapterEnhance;
  if (!E || typeof E.register !== 'function') return;
  var COPY = MB.chapterCopy || {};

  function list(a) { return Array.isArray(a) ? a : []; }
  function chars(s) { return Array.from(String(s == null ? '' : s)); }
  function intIn(raw, min, max, fb) {
    var n = NaN;
    if (typeof raw === 'number') n = raw;
    else if (typeof raw === 'string' && /^-?[0-9]+$/.test(raw.trim())) n = Number(raw.trim());
    return Number.isInteger(n) && n >= min && n <= max ? n : fb;
  }
  function textIn(raw, max) {
    if (typeof raw !== 'string') return '';
    var a = chars(raw.trim());
    return a.length > max ? a.slice(0, max).join('').trim() : a.join('');
  }
  function fill(tpl, v) { return String(tpl || '').split('{value}').join(v); }
  function hint(ctx) {
    if (ctx.copy && ctx.copy.hint) ctx.body.appendChild(E.el('p', { class: 'ce-label' }, ctx.copy.hint));
  }
  function root(ctx, id) { return ctx.scene || document.getElementById('panel-' + id); }
  function byAttr(nodes, name, val) {
    for (var i = 0; i < nodes.length; i++) if (nodes[i].getAttribute(name) === val) return nodes[i];
    return null;
  }
  function clip(s, max) {
    var out = s.slice(0, max);
    var code = out.charCodeAt(out.length - 1);
    if (code >= 0xD800 && code <= 0xDBFF) out = out.slice(0, -1);
    return out;
  }

  var lanternIndex = 0;
  var lanternRoot = document.getElementById('panel-lanterns');
  var lanternButtons = lanternRoot ? Array.prototype.slice.call(lanternRoot.querySelectorAll('[data-lantern]')) : [];
  function isOn(b) { return b.getAttribute('aria-pressed') === 'true'; }
  function lanternStatus(force) {
    var st = document.getElementById('lanterns-status');
    if (!st) return '';
    var total = lanternButtons.length || 6;
    var n = lanternButtons.filter(isOn).length;
    var ph = list(COPY.lanternPhrases)[lanternIndex];
    if (n === total && ph && ph.caption) st.textContent = ph.caption;
    return st.textContent;
  }
  lanternButtons.forEach(function (b) {
    b.addEventListener('click', function () { lanternStatus(true); });
  });
  function setAll(on) {
    lanternButtons.forEach(function (b) { if (isOn(b) !== on) b.click(); });
    return lanternStatus(true);
  }

  E.register('lanterns', {
    initial: 0,
    validate: function (r) { return intIn(r, 0, 2, 0); },
    apply: function (ctx) {
      lanternIndex = intIn(ctx.value(), 0, 2, 0);
      var el = root(ctx, 'lanterns');
      if (!el) return;
      var ph = list(COPY.lanternPhrases)[lanternIndex];
      var cs = ph ? chars(ph.text) : [];
      if (cs.length !== 6) return;
      var lamps = el.querySelectorAll('[data-lamp]');
      cs.forEach(function (c, i) {
        var lamp = byAttr(lamps, 'data-lamp', String(i));
        var btn = byAttr(lanternButtons, 'data-lantern', String(i));
        var label = lamp && lamp.querySelector('text');
        if (label) label.textContent = c;
        if (btn) btn.setAttribute('aria-label', '点亮第' + (i + 1) + '盏灯：' + c);
        if (btn && !(lamp && btn.contains(lamp)) && btn.children.length === 0) btn.textContent = c;
      });
      lanternStatus(false);
    },
    render: function (ctx) {
  
      ctx.body.appendChild(E.choices(ctx, function (i) {
        ctx.set(i);
        ctx.refresh();
        ctx.message(list(ctx.copy.responses)[i] || '');
      }));
      var row = E.el('div', { class: 'ce-row' });
      row.appendChild(E.button(ctx.common.allOn, function () { ctx.message(setAll(true)); }, { class: 'ce-secondary', 'data-focus': 'lantern-all-on' }));
      row.appendChild(E.button(ctx.common.allOff, function () { ctx.message(setAll(false)); }, { class: 'ce-secondary', 'data-focus': 'lantern-all-off' }));
      ctx.body.appendChild(row);
    }
  });

  E.register('memory', {
    initial: '',
    validate: function (r) { return textIn(r, 12); },
    apply: function (ctx) {
      var sky = document.getElementById('sky');
      if (!sky || !sky.parentNode) return;
      var mark = document.getElementById('memory-sky-mark');
      if (!mark) {
        mark = E.el('p', { id: 'memory-sky-mark', class: 'ce-scene-mark' });
        sky.insertAdjacentElement('afterend', mark);
      }
      var v = ctx.value();
      mark.textContent = v;
      mark.hidden = !v;
    },
    render: function (ctx) {
  
      var form = E.el('form', { novalidate: '' });
      form.appendChild(E.el('label', { class: 'ce-label', for: 'memory-sky-input' }, ctx.copy.title || ''));
      var input = E.el('input', { id: 'memory-sky-input', class: 'ce-input', type: 'text', maxlength: '12', autocomplete: 'off', 'data-focus': 'memory-input', placeholder: ctx.copy.placeholder || '' });
      input.value = ctx.value();
      form.appendChild(input);
      function save() {
        ctx.set(input.value);
        var v = ctx.value();
        ctx.refresh();
        ctx.message(v ? fill(ctx.copy.saved, v) : '');
      }
      form.addEventListener('submit', function (ev) { ev.preventDefault(); save(); });
      var row = E.el('div', { class: 'ce-row' });
      row.appendChild(E.button(ctx.common.save, save, { class: 'ce-primary', 'data-focus': 'memory-save' }));
      row.appendChild(E.button(ctx.common.clear, function () {
        ctx.set('');
        ctx.refresh();
        ctx.message('');
      }, { class: 'ce-secondary', 'data-focus': 'memory-clear' }));
      form.appendChild(row);
      ctx.body.appendChild(form);
    }
  });

  function cakeGeneric(ctx) {
    var s = ctx.copy.saved;
    return s && s.indexOf('{value}') < 0 ? s : (ctx.common.storageNote || '');
  }
  E.register('cake', {
    initial: '',
    validate: function (r) { return textIn(r, 60); },
    apply: function (ctx) {
      var el = root(ctx, 'cake');
      if (!el) return;
      var mark = document.getElementById('cake-wish-mark');
      if (!mark) {
        mark = E.el('p', { id: 'cake-wish-mark', class: 'ce-scene-mark' });
        (el.querySelector('.scene-inner') || el).appendChild(mark);
      }
      var has = !!ctx.value();
      mark.textContent = has ? cakeGeneric(ctx) : '';
      mark.hidden = !has;
    },
    render: function (ctx) {
      var body = ctx.body;
      function focusKey(k) {
        var t = body.querySelector('[data-focus=' + JSON.stringify(k) + ']');
        if (t) t.focus();
      }
      function draw(mode, key) {
        body.textContent = '';
    
        var stored = ctx.value();
        if (mode === 'view' && stored) {
          body.appendChild(E.el('p', { class: 'ce-note' }, cakeGeneric(ctx)));
          var secret = E.el('p', { class: 'ce-secret', id: 'cake-secret' });
          secret.hidden = true;
          var row = E.el('div', { class: 'ce-row' });
          var reveal = E.button(ctx.common.reveal, function () {
            var show = secret.hidden;
            secret.textContent = show ? ctx.value() : '';
            secret.hidden = !show;
            reveal.textContent = show ? ctx.common.hide : ctx.common.reveal;
            reveal.setAttribute('aria-expanded', show ? 'true' : 'false');
          }, { class: 'ce-primary', 'data-focus': 'cake-reveal', 'aria-controls': 'cake-secret', 'aria-expanded': 'false' });
          row.appendChild(reveal);
          row.appendChild(E.button(ctx.common.edit, function () { draw('edit', 'cake-input'); }, { class: 'ce-secondary', 'data-focus': 'cake-edit' }));
          row.appendChild(E.button(ctx.common.clear, function () {
            ctx.set('');
            ctx.message('');
            draw('edit', 'cake-input');
          }, { class: 'ce-secondary', 'data-focus': 'cake-clear' }));
          body.appendChild(row);
          body.appendChild(secret);
        } else {
          var form = E.el('form', { novalidate: '' });
          form.appendChild(E.el('label', { class: 'ce-label', for: 'cake-wish-input' }, ctx.copy.title || ''));
          var ta = E.el('textarea', { id: 'cake-wish-input', class: 'ce-input', maxlength: '60', rows: '3', autocomplete: 'off', 'data-focus': 'cake-input', placeholder: ctx.copy.placeholder || '' });
          if (stored) ta.value = stored;
          form.appendChild(ta);
          var save = function () {
            ctx.set(ta.value);
            if (ctx.value()) {
              ctx.message('');
              draw('view', 'cake-reveal');
            } else {
              ctx.message('');
              draw('edit', 'cake-input');
            }
          };
          form.addEventListener('submit', function (ev) { ev.preventDefault(); save(); });
          var frow = E.el('div', { class: 'ce-row' });
          frow.appendChild(E.button(ctx.common.save, save, { class: 'ce-primary', 'data-focus': 'cake-save' }));
          if (stored) frow.appendChild(E.button(ctx.common.back, function () { draw('view', 'cake-edit'); }, { class: 'ce-secondary', 'data-focus': 'cake-back' }));
          form.appendChild(frow);
          body.appendChild(form);
        }
        if (key) focusKey(key);
      }
      draw(ctx.value() ? 'view' : 'edit', null);
    }
  });

  E.register('wall', {
    initial: 0,
    validate: function (r) { return intIn(r, 0, 2, 0); },
    apply: function () {},
    render: function (ctx) {
  
      ctx.body.appendChild(E.choices(ctx, function (i) {
        ctx.set(i);
        var ta = document.getElementById('wall-content');
        var starter = list(COPY.wallStarters)[i];
        if (!ta || !starter) { ctx.refresh(); return; }
        var max = ta.maxLength > 0 ? ta.maxLength : 200;
        var cur = ta.value;
        if (cur.length >= max) {
          ctx.refresh();
          ctx.message(cur.length + ' / ' + max);
          return;
        }
        var next = clip(cur + (cur ? '\n\n' : '') + starter, max);
        ctx.close();
        queueMicrotask(function () {
          var form = document.getElementById('wall-form');
          var compose = document.getElementById('wall-compose');
          if (form && form.hidden && compose) compose.click();
          var t = document.getElementById('wall-content') || ta;
          if (t.value !== next) {
            t.value = next;
            t.dispatchEvent(new Event('input', { bubbles: true }));
          }
          t.focus();
          try { t.setSelectionRange(next.length, next.length); } catch (e) {}
        });
      }));
    }
  });

  E.register('rain', {
    initial: -1,
    validate: function (r) { return intIn(r, -1, 2, -1); },
    apply: function () {},
    render: function (ctx) {
  
      var row = E.el('div', { class: 'ce-row' });
      row.appendChild(E.button(ctx.copy.action || '', function () {
        var n = (ctx.value() + 1) % 3;
        ctx.set(n);
        ctx.refresh();
        ctx.message(list(ctx.copy.choices)[n] || '');
      }, { class: 'ce-primary', 'data-focus': 'rain-action' }));
      ctx.body.appendChild(row);
      var v = ctx.value();
      if (v >= 0) {
        var paper = E.el('div', { class: 'ce-paper' });
        paper.appendChild(E.el('p', { class: 'ce-label' }, list(ctx.copy.choices)[v] || ''));
        paper.appendChild(E.el('p', {}, list(ctx.copy.responses)[v] || ''));
        ctx.body.appendChild(paper);
      }
    }
  });

  function sealSvg(inner) {
    return `<svg viewBox='0 0 80 80' width='80' height='80' aria-hidden='true' focusable='false'><circle cx='40' cy='40' r='34' fill='#9e2a2f'/><circle cx='40' cy='40' r='27' fill='none' stroke='#d9757b' stroke-width='2'/>` + inner + `</svg>`;
  }
  var SEALS = [
    sealSvg(`<path d='M40 56C22 44 24 28 33 28C37 28 39 31 40 33C41 31 43 28 47 28C56 28 58 44 40 56Z' fill='#f7d6d0'/>`),
    sealSvg(`<g fill='#f7d6d0'><circle cx='40' cy='30' r='7'/><circle cx='49.5' cy='37' r='7'/><circle cx='46' cy='48' r='7'/><circle cx='34' cy='48' r='7'/><circle cx='30.5' cy='37' r='7'/></g><circle cx='40' cy='40' r='5' fill='#9e2a2f'/>`),
    sealSvg(`<circle cx='40' cy='40' r='9' fill='#f7d6d0'/><path d='M40 20v8M40 52v8M20 40h8M52 40h8M26 26l6 6M48 48l6 6M54 26l-6 6M32 48l-6 6' stroke='#f7d6d0' stroke-width='3' stroke-linecap='round'/>`)
  ];
  E.register('closing', {
    initial: -1,
    validate: function (r) { return intIn(r, -1, 2, -1); },
    apply: function (ctx) {
      var el = root(ctx, 'closing');
      var letter = el && el.querySelector('.letter');
      if (!letter) return;
      var seal = document.getElementById('closing-seal');
      if (!seal) {
        seal = E.el('div', { id: 'closing-seal', class: 'ce-seal' });
        var sign = letter.querySelector('.letter-sign');
        if (sign) sign.insertAdjacentElement('afterend', seal);
        else letter.appendChild(seal);
      }
      var v = ctx.value();
      if (v < 0 || !SEALS[v]) {
        seal.textContent = '';
        seal.hidden = true;
        return;
      }
      seal.innerHTML = SEALS[v];
      seal.appendChild(E.el('span', { class: 'ce-seal-caption' }, list(ctx.copy.choices)[v] || ''));
      seal.hidden = false;
    },
    render: function (ctx) {
  
      ctx.body.appendChild(E.choices(ctx, function (i) {
        ctx.set(i);
        ctx.refresh();
        ctx.message(ctx.copy.saved || '');
      }));
      var v = ctx.value();
      if (v >= 0) ctx.body.appendChild(E.el('p', { class: 'ce-note' }, list(ctx.copy.responses)[v] || ''));
    }
  });
})();
