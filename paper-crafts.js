(() => {
  const book = document.getElementById('b');
  const sea = book.querySelector('.craft-sea');
  const forest = book.querySelector('.craft-forest');
  const textarea = sea.querySelector('textarea');
  const write = sea.querySelector('.cs-write');
  const echo = sea.querySelector('.cs-echo');
  const transit = sea.querySelector('.cs-transit');
  const wish = sea.querySelector('.cs-msg');
  const send = sea.querySelector('.cs-send');
  const retrieve = sea.querySelector('.cs-again');
  const forestMessage = forest.querySelector('.cf-msg');
  const counter = forest.querySelector('.cf-count');
  const reset = forest.querySelector('.cf-reset');
  const lights = [...forest.querySelectorAll('.cf-btn')];
  const startMessage = forestMessage.textContent;
  const defaultWish = '愿每个晚上，都有一盏灯、一桌饭，等你回家。';
  const discoveries = [
    '路口亮了，萤火跟了上来。',
    '枝头的叶子被照成了金色。',
    '猫头鹰睁开眼，替你看着路。',
    '星星低下来，挨着树梢。',
    '家里的窗子亮了，有人在等。',
  ];
  const lit = new Set();
  let arrivalTimer;

  send.addEventListener('click', () => {
    const text = textarea.value.replace(/\s+/g, ' ').trim() || defaultWish;
    wish.textContent = '「' + text + '」';
    sea.classList.add('cs-sent');
    book.dataset.bottleSeen = 'true';
    write.hidden = true;
    transit.hidden = false;
    const land = () => {
      const shouldFocus = sea.classList.contains('on') &&
        (document.activeElement === document.body || transit.contains(document.activeElement));
      transit.hidden = true;
      echo.hidden = false;
      if (shouldFocus) retrieve.focus({ preventScroll: true });
    };
    if (document.body.dataset.motion === 'gentle') land();
    else arrivalTimer = setTimeout(land, 1550);
  });

  function resetBottle() {
    clearTimeout(arrivalTimer);
    sea.classList.remove('cs-sent');
    textarea.value = '';
    wish.textContent = '';
    echo.hidden = true;
    transit.hidden = true;
    write.hidden = false;
  }

  retrieve.addEventListener('click', () => {
    resetBottle();
    textarea.focus({ preventScroll: true });
  });

  function light(id) {
    if (lit.has(id)) return;
    lit.add(id);
    for (const item of forest.querySelectorAll(`[data-i="${id}"],[data-r="${id}"]`)) {
      item.classList.add('is-on');
    }
    lights[id - 1].setAttribute('aria-pressed', 'true');
    forest.dataset.lit = String(lit.size);
    counter.textContent = `已点亮 ${lit.size} / ${lights.length}`;
    if (lit.size === lights.length) {
      forest.classList.add('cf-done');
      book.dataset.firefliesSeen = 'true';
      forestMessage.textContent = '五盏灯连成一条路，萤火一直飞到门口。窗子亮着，饭在桌上。';
      return;
    }
    forestMessage.textContent = discoveries[id - 1];
  }

  for (const button of lights) {
    button.addEventListener('click', () => light(Number(button.dataset.i)));
  }
  forest.querySelector('svg').addEventListener('click', event => {
    const lamp = event.target.closest('.cf-lamp');
    if (lamp) light(Number(lamp.dataset.i));
  });

  function resetLights() {
    lit.clear();
    for (const item of forest.querySelectorAll('.is-on')) item.classList.remove('is-on');
    for (const button of lights) button.setAttribute('aria-pressed', 'false');
    forest.classList.remove('cf-done');
    forest.dataset.lit = '0';
    counter.textContent = `已点亮 0 / ${lights.length}`;
    forestMessage.textContent = startMessage;
  }

  reset.addEventListener('click', resetLights);
  document.addEventListener('home:restart', () => {
    resetBottle();
    resetLights();
    delete book.dataset.bottleSeen;
    delete book.dataset.firefliesSeen;
  });
})();
