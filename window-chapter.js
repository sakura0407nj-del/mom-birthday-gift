(() => {
  'use strict';
  const MB = window.MB;
  const source = document.querySelector('#gift-window-art');
  if (!source || !('attachShadow' in HTMLElement.prototype)) return;

  const waterButton = document.querySelector('#water-garden');
  const waterStatus = document.querySelector('#greenhouse-status');
  const nightStatus = document.querySelector('#gift-window-evening');
  const key = 'mb-window-journey-v1';
  const waterNotes = [
    '给窗台上的花苞浇一点水。',
    '冒出了两片小叶子。',
    '花苞饱满了。再浇一次，或用小惊喜里的水渠把水送来。',
    '花开了。天黑以后，它还会在窗台上等你。',
  ];
  let progress = 0;
  let celebrated = false;
  let curtainOpened = false;
  let curtainTimer;
  let waterAnimation;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Number.isInteger(saved?.progress) && saved.progress >= 0 && saved.progress <= 3) {
      progress = saved.progress;
      celebrated = saved.celebrated === true;
    }
  } catch { /* Private browsing and corrupted values start with a bud. */ }

  const windows = [...document.querySelectorAll('[data-gift-window]')].map(host => {
    const shadow = host.attachShadow({mode:'open'});
    shadow.append(source.content.cloneNode(true));
    const view = shadow.querySelector('.bday-window');
    view.dataset.stage = host.dataset.giftWindow;
    return {host, view};
  });
  const morning = windows.find(window => window.view.dataset.stage === '1').view;
  const flowerNames = ['一株含苞的小花', '刚长出新叶的小花', '半开的花', '盛开的花'];

  const originalPlate = document.querySelector('#panel-greenhouse .world-art > .world-svg text');
  const windowPlate = morning.querySelector('.window-nameplate');
  if (originalPlate && windowPlate) {
    const syncPlate = () => {
      const name = originalPlate.textContent.trim();
      windowPlate.textContent = name;
      windowPlate.hidden = !name || name === 'FOR MOM';
    };
    new MutationObserver(syncPlate).observe(originalPlate, {childList:true, characterData:true, subtree:true});
    syncPlate();
  }

  function save() {
    try { localStorage.setItem(key, JSON.stringify({progress, celebrated})); }
    catch { /* State remains available for this visit. */ }
  }

  function paint() {
    const calm = MB.motion.reduced() || document.hidden;
    windows.forEach(({host, view}) => {
      const isMorning = view === morning;
      view.classList.toggle('open', !isMorning || curtainOpened);
      view.classList.toggle('calm', calm);
      view.classList.toggle('lights-on', celebrated);
      view.dataset.water = String(progress);
      view.style.setProperty('--b', [0, .12, .45, 1][progress]);
      if (!host.matches('[data-gift-window="2"]')) {
        host.setAttribute('aria-label', `窗台上有${flowerNames[progress]}`);
      }
    });
    waterButton.textContent = progress === 3 ? '再看一次花开' : `给花浇水 · ${progress}/3`;
    if (waterStatus.textContent !== waterNotes[progress]) waterStatus.textContent = waterNotes[progress];
    const evening = `窗台上是${flowerNames[progress]}。${celebrated ? '庆典过后，远处的小屋为你亮着灯。' : '月亮已经升起来了。'}`;
    if (nightStatus.textContent !== evening) nightStatus.textContent = evening;
  }

  function water(fromGame = false) {
    if (fromGame && progress !== 2) return;
    if (progress < 3) {
      progress++;
      save();
      paint();
      if (onMorning() && !MB.motion.reduced() && !document.hidden) {
        const can = morning.querySelector('.tilt');
        can.classList.remove('pour');
        void can.getBoundingClientRect();
        can.classList.add('pour');
      }
    } else if (!MB.motion.reduced() && !document.hidden) {
      waterAnimation?.cancel();
      waterAnimation = morning.querySelector('.bloom').animate(
        [{opacity:.22, transform:'scale(.3) rotate(-10deg)'}, {opacity:1, transform:'scale(1) rotate(30deg)'}],
        {duration:620, easing:'cubic-bezier(.2,.8,.35,1)'}
      );
    }
    return true;
  }

  function stopVisuals() {
    clearTimeout(curtainTimer);
    waterAnimation?.cancel();
    morning.querySelector('.tilt').classList.remove('pour');
  }

  function onMorning() {
    return document.querySelector('#journey').dataset.scene === 'panel-greenhouse';
  }

  function openCurtain() {
    if (curtainOpened || !onMorning()) return;
    clearTimeout(curtainTimer);
    if (MB.motion.reduced() || document.hidden) {
      curtainOpened = true;
      paint();
    } else if (document.querySelector('#theatre-dock').getAttribute('aria-busy') !== 'true') {
      curtainTimer = setTimeout(() => { curtainOpened = true; paint(); }, 180);
    }
  }

  document.addEventListener('mb:scene', () => {
    if (onMorning()) openCurtain();
    else stopVisuals();
    paint();
  });
  document.addEventListener('mb:transition', ({detail}) => { if (!detail.active) openCurtain(); });
  document.addEventListener('mb:play-complete', ({detail}) => {
    if (detail.id === 'greenhouse') water(true);
  });
  document.addEventListener('mb:gala', ({detail}) => {
    if (!detail.active || celebrated) return;
    celebrated = true;
    save();
    paint();
  });
  document.addEventListener('mb:motion', () => { stopVisuals(); openCurtain(); paint(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopVisuals(); openCurtain(); paint(); });
  MB.birthdayWindow = {water, snapshot: () => ({progress, celebrated, flower:flowerNames[progress]})};
  document.querySelector('#make-window-card').addEventListener('click', () => MB.journeyLetter?.openNight());
  paint();
})();
