/* ============================================================
   合成环境音
   没有音频文件时，用 Web Audio 现场合成一段很轻的五声音阶
   - 不加载任何外部资源，无版权问题
   - 必须由用户手势触发；默认关闭
   - 页面不可见时挂起，回来再继续
   ============================================================ */
(function (global) {
  'use strict';

  var SCALE = [0, 2, 4, 7, 9];        // 大调五声：do re mi sol la
  var BASE = 261.63;                  // C4
  var DRONE = 130.81;                 // C3

  function noteFreq(semitones) {
    return BASE * Math.pow(2, semitones / 12);
  }

  /* 十一个可用音，跨两个八度 */
  var NOTES = (function () {
    var list = [];
    for (var octave = 0; octave < 2; octave++) {
      for (var i = 0; i < SCALE.length; i++) {
        list.push(noteFreq(SCALE[i] + octave * 12));
      }
    }
    return list;
  })();

  function Ambient() {
    this.ctx = null;
    this.master = null;
    this.playing = false;
    this.timer = 0;
    this.nextAt = 0;
    this.index = 3;
    this.drone = null;
    this.onVisibility = this.handleVisibility.bind(this);
  }

  Ambient.prototype.ensure = function () {
    if (this.ctx) return true;
    var Ctor = global.AudioContext || global.webkitAudioContext;
    if (!Ctor) return false;

    var ctx = new Ctor();
    var master = ctx.createGain();
    master.gain.value = 0.0001;

    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2100;
    filter.Q.value = 0.3;

    // 一点点回声，让音与音之间留出空间
    var delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.34;
    var feedback = ctx.createGain();
    feedback.gain.value = 0.24;
    var wet = ctx.createGain();
    wet.gain.value = 0.22;

    master.connect(filter);
    filter.connect(ctx.destination);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    return true;
  };

  Ambient.prototype.voice = function (freq, when, peak, duration) {
    var ctx = this.ctx;
    var osc = ctx.createOscillator();
    var overtone = ctx.createOscillator();
    var gain = ctx.createGain();
    var overtoneGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    overtone.type = 'triangle';
    overtone.frequency.value = freq * 2.004;
    overtoneGain.gain.value = 0.14;

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + 0.028);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    gain.connect(this.master);

    osc.start(when);
    overtone.start(when);
    osc.stop(when + duration + 0.06);
    overtone.stop(when + duration + 0.06);
  };

  Ambient.prototype.startDrone = function () {
    var ctx = this.ctx;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var lfo = ctx.createOscillator();
    var lfoGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = DRONE;
    gain.gain.value = 0.0001;

    lfo.type = 'sine';
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 0.014;

    osc.connect(gain);
    gain.connect(this.master);
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    var now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.05, now + 5);

    osc.start(now);
    lfo.start(now);
    this.drone = { osc: osc, lfo: lfo };
  };

  Ambient.prototype.schedule = function () {
    if (!this.playing || !this.ctx) return;
    var ctx = this.ctx;
    var self = this;
    var now = ctx.currentTime;
    var when = Math.max(now + 0.06, this.nextAt);

    // 小步游走，偶尔跳一下
    var steps = [-2, -1, 1, 1, 2, -1, 0, 0];
    var step = steps[Math.floor(Math.random() * steps.length)];
    this.index = Math.max(0, Math.min(NOTES.length - 1, this.index + step));

    var duration = 2.2 + Math.random() * 1.6;
    this.voice(NOTES[this.index], when, 0.16 + Math.random() * 0.05, duration);

    // 偶尔叠一个高音，像伴奏
    if (Math.random() < 0.22) {
      var overtoneIndex = Math.min(NOTES.length - 1, this.index + 2);
      this.voice(NOTES[overtoneIndex], when + 0.07, 0.085, duration * 0.86);
    }

    var gap = 0.95 + Math.random() * 1.7;
    if (Math.random() < 0.16) gap += 2.2;
    this.nextAt = when + gap;

    var wait = Math.max(120, (this.nextAt - ctx.currentTime) * 1000 - 130);
    this.timer = setTimeout(function () { self.schedule(); }, wait);
  };

  Ambient.prototype.play = function () {
    var self = this;
    if (this.playing) return Promise.resolve();
    if (!this.ensure()) return Promise.reject(new Error('NO_AUDIO'));

    var ctx = this.ctx;
    var resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();

    return resume.then(function () {
      var now = ctx.currentTime;
      self.playing = true;

      self.master.gain.cancelScheduledValues(now);
      self.master.gain.setValueAtTime(Math.max(0.0002, self.master.gain.value), now);
      self.master.gain.exponentialRampToValueAtTime(0.42, now + 2.4);

      self.index = 2 + Math.floor(Math.random() * 4);
      self.nextAt = now + 0.5;
      self.startDrone();
      self.schedule();

      document.addEventListener('visibilitychange', self.onVisibility);
    });
  };

  Ambient.prototype.pause = function () {
    if (!this.playing) return;
    var ctx = this.ctx;
    this.playing = false;
    clearTimeout(this.timer);
    this.timer = 0;
    document.removeEventListener('visibilitychange', this.onVisibility);

    var now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(0.0002, this.master.gain.value), now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    if (this.drone) {
      try {
        this.drone.osc.stop(now + 0.8);
        this.drone.lfo.stop(now + 0.8);
      } catch (e) { /* 已停止 */ }
      this.drone = null;
    }
  };

  Ambient.prototype.handleVisibility = function () {
    if (!this.ctx) return;
    var ctx = this.ctx;
    var self = this;

    if (document.hidden) {
      if (this.playing) {
        clearTimeout(this.timer);
        this.timer = 0;
        if (ctx.state === 'running') ctx.suspend();
      }
      return;
    }

    if (this.playing) {
      var resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
      resume.then(function () {
        if (!self.playing || self.timer) return;
        self.nextAt = ctx.currentTime + 0.4;
        self.schedule();
      });
    }
  };

  Ambient.prototype.isPlaying = function () { return this.playing; };

  Ambient.prototype.destroy = function () {
    this.pause();
    if (this.ctx && this.ctx.close) {
      try { this.ctx.close(); } catch (e) { /* 已关闭 */ }
    }
    this.ctx = null;
    this.master = null;
  };

  global.MB = global.MB || {};
  global.MB.music = {
    createAmbient: function () { return new Ambient(); },
    supported: !!(global.AudioContext || global.webkitAudioContext)
  };
})(window);
