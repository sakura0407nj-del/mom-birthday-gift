/* ============================================================
   数据层：统一请求封装
   - 默认 mock 模式（读取 docs/mock/，失败则用内置文案）
   - 配置真实 API 前缀后自动切换到在线模式
   - 任何失败都降级，绝不阻断页面渲染
   经典脚本，不使用 ES module，便于 file:// 直接打开
   ============================================================ */
(function (global) {
  'use strict';

  /* 线上 API 前缀。留空 = mock 模式。
     部署后端后改成完整前缀，例如 'https://api.example.com/api'。
     也可在页面里用 window.MB_API_BASE 覆盖（方便联调）。 */
  var API_BASE = '';

  var MOCK_BASE = 'data/';
  var TIMEOUT_MS = 9000;

  /* ---------- 内置默认文案（与 docs/mock/config.json 保持一致） ---------- */
  var FALLBACK_CONFIG = {
    recipientName: '妈妈',
    pageTitle: '妈妈，生日快乐',
    opening: {
      eyebrow: '今天，想把时间慢下来',
      title: '有一份礼物，想亲手交给你',
      buttonText: '打开礼物'
    },
    story: {
      sceneDurationMs: 7000,
      transitionMs: 700,
      scenes: [
        { id: 'hand-in-hand', caption: '有你的陪伴，小路也有了方向。' },
        { id: 'lamplight',    caption: '一盏暖灯，照亮了细小而长久的爱。' },
        { id: 'doorway',      caption: '门口的目光，总把牵挂送得很远。' },
        { id: 'window',       caption: '走向远方时，心里始终留着家的窗。' },
        { id: 'homecoming',   caption: '回到你身边，就有一个温暖的拥抱。' },
        { id: 'candles',      caption: '今天，让我们一起，把心愿交给烛光。' }
      ]
    },
    blessing: {
      title: '妈妈，生日快乐',
      lines: [
        '谢谢你，把许多平常的日子，过成了温暖的记忆。',
        '愿往后的时光，对你温柔一些，再温柔一些。',
        '愿你健康、自在，也记得把喜欢的事留给自己。',
        '今天不必忙碌，只管收下这一份爱。'
      ],
      charIntervalMs: 90
    },
    timeline: { title: '把时光，轻轻收藏', photos: [] },
    memoryGame: {
      title: '把爱，慢慢翻出来',
      pairs: [
        { id: 'lamp',   label: '一盏暖灯', symbol: '灯' },
        { id: 'letter', label: '一封家书', symbol: '信' },
        { id: 'flower', label: '一束小花', symbol: '花' },
        { id: 'tea',    label: '一杯热茶', symbol: '茶' },
        { id: 'home',   label: '一处归途', symbol: '家' },
        { id: 'cake',   label: '一份心愿', symbol: '愿' }
      ],
      successMessage: '每一份小小的记忆，都藏着同样的答案：爱你。'
    },
    cake: {
      title: '许一个心愿吧',
      wishMessage: '愿你的心愿，被时光温柔珍藏。',
      easterEgg: {
        title: '还有一句悄悄话',
        text: '不只今天，往后的每一天，都想让你知道：你值得被好好爱着。'
      }
    },
    music: { src: null, title: '背景音乐', enabled: false },
    messageWall: {
      title: '把祝福留在这里',
      intro: '写一句想对妈妈说的话，审核后会出现在这里。',
      emptyText: '第一份祝福，正等着你。',
      pendingText: '祝福已收到，审核通过后就会展示。'
    },
    closing: {
      title: '最后，想说一句',
      lines: [
        '这一页能说的话不多，**说不完的，我们留着以后慢慢说**。',
        '往后的每一天，都算数。'
      ],
      sign: '爱你的家人'
    },
    blessingRain: {
      title: '温馨提示',
      items: [
        '记得按时吃饭',
        '天冷了，多穿一件',
        '别熬太晚，早点睡',
        '今天也要开心',
        '累了就歇一会儿',
        '多喝热水',
        '想吃什么就买',
        '出门记得带伞',
        '有不开心就说出来',
        '多出去走走',
        '别总惦记我们，也顾顾自己',
        '你值得被好好爱着'
      ],
      closing: '这些话很平常，但每一句都是真的。'
    }
  };

  /* ---------- 工具 ---------- */
  function resolveBase() {
    var override = global.MB_API_BASE;
    var base = typeof override === 'string' ? override : API_BASE;
    base = String(base || '').trim();
    while (base.length > 1 && base.charAt(base.length - 1) === '/') base = base.slice(0, -1);
    return base;
  }

  function isMock() { return resolveBase() === ''; }

  function endpoint(path) {
    var base = resolveBase();
    if (!base) return MOCK_BASE + path;
    return base + '/' + path;
  }

  function fetchJson(url, options) {
    var opts = options || {};
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = null;

    var init = {
      method: opts.method || 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
      credentials: 'omit'
    };
    if (opts.method === 'POST') init.headers['Content-Type'] = 'application/json; charset=utf-8';
    if (opts.body !== undefined) init.body = JSON.stringify(opts.body);
    if (controller) init.signal = controller.signal;

    return new Promise(function (resolve, reject) {
      if (controller) {
        timer = setTimeout(function () { controller.abort(); }, opts.timeout || TIMEOUT_MS);
      }
      var settled = false;
      function done(fn) {
        return function (value) {
          if (settled) return;
          settled = true;
          if (timer) clearTimeout(timer);
          fn(value);
        };
      }
      var ok = done(resolve);
      var fail = done(reject);

      if (typeof global.fetch !== 'function') {
        fail(new Error('NO_FETCH'));
        return;
      }

      global.fetch(url, init).then(function (response) {
        return response.text().then(function (text) {
          var body = null;
          if (text) {
            try { body = JSON.parse(text); } catch (e) { body = null; }
          }
          return { response: response, body: body };
        });
      }).then(function (result) {
        var response = result.response;
        var body = result.body;

        if (body && body.ok === true) { ok({ data: body.data, status: response.status }); return; }

        var code = (body && body.error && body.error.code) || httpCode(response.status);
        var message = (body && body.error && body.error.message) || '网络不太顺畅，请稍后再试。';
        fail(makeError(code, message, response.status));
      }).catch(function (error) {
        if (error && error.code) { fail(error); return; }
        fail(makeError(error && error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
                       '网络不太顺畅，请稍后再试。', 0));
      });
    });
  }

  function httpCode(status) {
    if (status === 400) return 'VALIDATION_ERROR';
    if (status === 401) return 'UNAUTHORIZED';
    if (status === 403) return 'CORS_FORBIDDEN';
    if (status === 404) return 'NOT_FOUND';
    if (status === 413) return 'PAYLOAD_TOO_LARGE';
    if (status === 415) return 'UNSUPPORTED_MEDIA_TYPE';
    if (status === 429) return 'RATE_LIMITED';
    if (status >= 500) return 'SERVICE_UNAVAILABLE';
    return 'NETWORK_ERROR';
  }

  function makeError(code, message, status) {
    var error = new Error(message);
    error.code = code;
    error.status = status || 0;
    error.friendly = message;
    return error;
  }

  /* ---------- 配置形状校验：不合法就不用它 ---------- */
  function looksLikeConfig(value) {
    if (!value || typeof value !== 'object') return false;
    if (!value.opening || !value.story || !value.blessing) return false;
    var scenes = value.story.scenes;
    if (!Array.isArray(scenes) || scenes.length !== 6) return false;
    var pairs = value.memoryGame && value.memoryGame.pairs;
    if (!Array.isArray(pairs) || pairs.length !== 6) return false;
    if (!Array.isArray(value.blessing.lines) || value.blessing.lines.length === 0) return false;
    if (!value.cake || !value.cake.easterEgg) return false;
    if (!value.messageWall) return false;
    if (!value.closing || !Array.isArray(value.closing.lines)) return false;
    if (!value.blessingRain || !Array.isArray(value.blessingRain.items) || value.blessingRain.items.length === 0) return false;
    return true;
  }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  /* ---------- 对外接口 ---------- */
  /* mock 读静态文件（.json），在线走真实路由；两者路径不同，不能共用 */
  function mockOrLive(mockFile, livePath) {
    return isMock() ? mockFile : livePath;
  }

  function loadConfig() {
    // 离线包把内容内联成脚本，双击（file://）也能读到，不依赖 fetch
    if (global.MB_CONFIG && looksLikeConfig(global.MB_CONFIG)) {
      return Promise.resolve({ config: clone(global.MB_CONFIG), source: 'inline', error: null });
    }

    return fetchJson(endpoint(mockOrLive('config.json', 'config')), { timeout: TIMEOUT_MS })
      .then(function (result) {
        if (looksLikeConfig(result.data)) {
          return { config: result.data, source: isMock() ? 'mock' : 'live', error: null };
        }
        throw makeError('BAD_CONFIG', '配置格式不正确。', 0);
      })
      .catch(function (error) {
        return { config: clone(FALLBACK_CONFIG), source: 'builtin', error: error };
      });
  }

  function keepApproved(list) {
    return (Array.isArray(list) ? list : []).filter(function (item) {
      return item && item.status === 'approved' && typeof item.content === 'string';
    });
  }

  function readLocalNotes() { try { var n = JSON.parse(localStorage.getItem('mom.birthday.notes.v1') || '[]'); return Array.isArray(n) ? n.filter(function(x){return x && typeof x.name==='string' && typeof x.content==='string';}).slice(0,30) : []; } catch(e) { return []; } }
  function loadMessages() {
    if (isMock()) return Promise.resolve({messages:readLocalNotes(), source:'local', error:null});
    // 同上：离线包把示例留言内联进来，避免 file:// 下显示成加载失败
    if (global.MB_MESSAGES && Array.isArray(global.MB_MESSAGES.messages)) {
      return Promise.resolve({
        messages: keepApproved(global.MB_MESSAGES.messages),
        source: 'inline',
        error: null
      });
    }

    return fetchJson(endpoint(mockOrLive('messages.json', 'messages')), { timeout: TIMEOUT_MS })
      .then(function (result) {
        var data = result.data || {};
        return {
          messages: keepApproved(data.messages),
          source: isMock() ? 'mock' : 'live',
          error: null
        };
      })
      .catch(function (error) {
        return { messages: [], source: 'unavailable', error: error };
      });
  }

  function submitMessage(name, content) {
    if (isMock()) {
      var note = {id:Date.now(), name:name, content:content, status:'approved', local:true, createdAt:new Date().toISOString()};
      try { var notes=readLocalNotes(); notes.unshift(note); localStorage.setItem('mom.birthday.notes.v1', JSON.stringify(notes.slice(0,30))); }
      catch(e) { return Promise.resolve({ok:false,error:{friendly:'浏览器未能保存。请复制内容自行收藏，或退出无痕模式后重试。'}}); }
      return Promise.resolve({ok:true,local:true,demo:false,id:note.id,status:'approved',createdAt:note.createdAt});
    }
    return fetchJson(endpoint('messages'), {
      method: 'POST',
      body: { name: name, content: content }
    }).then(function (result) {
      return { ok: true, demo: false, id: result.data && result.data.id,
               status: (result.data && result.data.status) || 'pending',
               createdAt: result.data && result.data.createdAt };
    }).catch(function (error) {
      return { ok: false, demo: false, error: error };
    });
  }

  global.MB = global.MB || {};
  global.MB.api = {
    loadConfig: loadConfig,
    loadMessages: loadMessages,
    submitMessage: submitMessage,
    isMock: isMock,
    get mode() { return isMock() ? 'mock' : 'live'; },
    FALLBACK_CONFIG: FALLBACK_CONFIG
  };
})(window);
