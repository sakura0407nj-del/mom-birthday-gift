/* One motion preference for CSS, story, chapter transitions and the celebration. */
(() => {
  'use strict';
  const MB = window.MB = window.MB || {};
  const key = 'mom-motion-preference';
  const system = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  let preference = 'system';
  try { const saved = localStorage.getItem(key); if (saved === 'full' || saved === 'gentle') preference = saved; } catch (_) {}
  const reduced = () => preference === 'gentle' || (preference === 'system' && !!system?.matches);
  function publish() {
    const value = reduced();
    document.documentElement.dataset.motion = value ? 'gentle' : 'full';
    document.documentElement.dataset.motionPreference = preference;
    if (document.body) document.body.classList.toggle('gentle', value);
    document.dispatchEvent(new CustomEvent('mb:motion', { detail: { reduced: value, preference } }));
  }
  function set(value) {
    if (!['system', 'full', 'gentle'].includes(value)) return;
    preference = value;
    try { if (value === 'system') localStorage.removeItem(key); else localStorage.setItem(key, value); } catch (_) {}
    publish();
  }
  MB.motion = { reduced, set, toggle: () => set(reduced() ? 'full' : 'gentle'), get preference() { return preference; } };
  const onSystem = () => { if (preference === 'system') publish(); };
  if (system?.addEventListener) system.addEventListener('change', onSystem);
  else if (system?.addListener) system.addListener(onSystem);
  document.addEventListener('DOMContentLoaded', publish, { once: true });
  publish();
})();
