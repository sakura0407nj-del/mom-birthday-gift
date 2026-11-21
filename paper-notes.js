(() => {
  const opener = document.getElementById('paper-notes-open');
  const dialog = document.getElementById('home-notes-dialog');
  const fallback = dialog.querySelector('.paper-notes-loading');
  let frame;

  opener.addEventListener('click', () => {
    if (dialog.open) return;
    frame = document.createElement('iframe');
    frame.title = '祝福短笺';
    frame.src = 'paper-notes.html?v=paper1';
    dialog.append(frame);
    dialog.showModal();
  });

  function syncMotion() {
    frame?.contentWindow?.postMessage({
      type: 'paper-notes-motion',
      reduced: document.body.dataset.motion === 'gentle',
    }, location.origin);
  }

  window.addEventListener('message', event => {
    if (!frame || event.source !== frame.contentWindow || event.origin !== location.origin || !dialog.open) return;
    if (event.data?.type === 'paper-notes-ready') {
      fallback.hidden = true;
      syncMotion();
    }
    if (event.data?.type === 'paper-notes-close') dialog.close();
  });

  new MutationObserver(syncMotion).observe(document.body, {
    attributes: true,
    attributeFilter: ['data-motion'],
  });

  dialog.addEventListener('close', () => {
    frame?.remove();
    frame = undefined;
    fallback.hidden = false;
    opener.focus({ preventScroll: true });
  });
})();
