(() => {
  const MB = window.MB;
  const $ = id => document.getElementById(id);
  const status = document.querySelector('.paper-notes-status');
  const goBack = document.querySelector('.paper-notes-return');
  let toastTimer;
  let reduced;
  const legacyReduced = MB.motion.reduced;
  MB.motion.reduced = () => reduced ?? legacyReduced();

  function tellBook(type) {
    if (parent !== window) parent.postMessage({ type }, location.origin);
  }

  if (parent === window) goBack.hidden = true;
  goBack.addEventListener('click', () => tellBook('paper-notes-close'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.defaultPrevented && !document.querySelector('dialog[open]')) {
      tellBook('paper-notes-close');
    }
  });
  window.addEventListener('message', event => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'paper-notes-motion') return;
    reduced = event.data.reduced === true;
    document.documentElement.dataset.motion = reduced ? 'gentle' : 'full';
    document.body.classList.toggle('gentle', reduced);
    document.dispatchEvent(new CustomEvent('mb:motion', { detail: { reduced } }));
  });

  document.addEventListener('DOMContentLoaded', () => {
    MB.scenery.render('greet', document.querySelector('#panel-wall .scenery'));
    MB.actors.render('greet', document.querySelector('#panel-wall .actors'));
    MB.api.loadConfig().then(({ config: { messageWall } }) => {
      $('wall-title').textContent = messageWall.title;
      $('wall-intro').textContent = messageWall.intro;
      $('wall-empty').textContent = messageWall.emptyText;
    });
    MB.initBirthdayWall(message => {
      clearTimeout(toastTimer);
      status.textContent = message;
      toastTimer = setTimeout(() => { status.textContent = ''; }, 2500);
    }, setTimeout);
    tellBook('paper-notes-ready');
  }, { once: true });
})();
