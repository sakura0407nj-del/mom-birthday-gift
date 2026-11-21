(() => {
  'use strict';
  const dialog = document.querySelector('#home-keepsake');
  const opener = document.querySelector('#keepsake-open');
  const image = dialog.querySelector('#home-card-preview');
  const download = dialog.querySelector('#home-card-download');
  const status = dialog.querySelector('#home-card-status');
  const choices = [...dialog.querySelectorAll('[data-card-theme]')];
  const book = document.querySelector('#b');
  const serif = 'Songti SC, STSong, Noto Serif CJK SC, SimSun, serif';
  const editions = {
    warm: {name:'暖灯纸笺', edge:'#cbaa72', paper:'#f8ebd2', ink:'#3e2824', accent:'#8b3d48'},
    night: {name:'星夜来信', edge:'#bd9b69', paper:'#141e34', ink:'#fff0cf', accent:'#e0b277'},
  };
  // Drawn from the original birthday album's flower, letter and cake seals.
  const seals = {
    flower: ['花已收下', 'M24 37V23M24 31Q18 29 16 24M24 33Q30 31 32 26M19 14Q19 23 24 23Q29 23 29 14L26.5 17L24 13L21.5 17Z'],
    letter: ['信已打开', 'M14 18H34V33H14ZM14 18L24 26L34 18M14 33L21 26M34 33L27 26'],
    cake: ['生日快乐', 'M14 31L34 26V35L14 37ZM14 31L30 22L34 26M14 34L34 30.5M30 22V17M30 17Q28 15 30 12.5Q32 15 30 17'],
  };
  let revision = 0, imageUrl = '';

  function text(ctx, value, y, size, color) {
    ctx.textAlign = 'center';
    ctx.font = `${size}px ${serif}`;
    ctx.fillStyle = color;
    ctx.fillText(value, 450, y);
  }

  function seal(ctx, label, path, x, palette, index) {
    ctx.save();
    ctx.translate(x, 985);
    ctx.rotate(index % 2 ? .11 : -.08);
    ctx.scale(2.25, 2.25);
    ctx.translate(-24,-24);
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.arc(24,24,23,0,Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([.8,1.7]);
    ctx.beginPath();
    ctx.arc(24,24,20.5,0,Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke(new Path2D(path));
    ctx.restore();
    ctx.fillStyle = palette.ink;
    ctx.textAlign = 'center';
    ctx.font = `20px ${serif}`;
    ctx.fillText(label, x, 1067);
  }

  function picture(ctx, source, theme) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(78, 114, 744, 520);
    ctx.clip();
    if (theme === 'warm') {
      const scale = Math.max(744/source.naturalWidth, 520/source.naturalHeight);
      const width = source.naturalWidth*scale;
      const height = source.naturalHeight*scale;
      ctx.drawImage(source, 450-width/2, 374-height/2, width, height);
    } else {
      const light = ctx.createRadialGradient(450,424,35,450,420,360);
      light.addColorStop(0,'#a1774e');
      light.addColorStop(.54,'#26334d');
      light.addColorStop(1,'#0d1326');
      ctx.fillStyle = light;
      ctx.fillRect(78,114,744,520);
      ctx.fillStyle = '#f0cb88';
      for (const [x,y,r] of [[230,235,2],[587,200,3],[633,290,2],[343,182,2],[742,207,2],[166,326,3],[670,463,2]]) {
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();
      }
      ctx.drawImage(source,239,166,422,422);
    }
    ctx.restore();
  }

  function draw(ctx, source, theme, collected) {
    const palette = editions[theme];
    ctx.fillStyle = palette.paper;
    ctx.fillRect(0,0,900,1200);
    ctx.strokeStyle = palette.edge;
    ctx.lineWidth = 2;
    ctx.strokeRect(40,40,820,1120);
    ctx.strokeRect(50,50,800,1100);
    picture(ctx,source,theme);
    ctx.strokeRect(77,113,746,522);
    text(ctx,'今 晚 ， 回 家 吃 饭',707,25,palette.accent);
    text(ctx,'妈妈，生日快乐',801,76,palette.ink);
    text(ctx,'往后一起吃饭的日子，再多一点。',867,29,palette.ink);
    collected.forEach((key,i) => seal(ctx,...seals[key],450+(i-(collected.length-1)/2)*152,palette,i));
    text(ctx,'爱你的家人',1120,22,palette.ink);
  }

  function releaseImage() {
    download.hidden = true;
    download.removeAttribute('href');
    image.hidden = true;
    image.removeAttribute('src');
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = '';
  }

  async function make(theme) {
    const ticket = ++revision;
    const source = document.querySelector(theme==='warm'?'.s1 .art':'#c .cake');
    releaseImage();
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cardTheme===theme)));
    status.textContent = '正在印这张纪念笺…';
    try {
      await source.decode();
      if (ticket!==revision || !dialog.open) return;
      const card = document.createElement('canvas');
      card.width = 900;
      card.height = 1200;
      const ctx = card.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      const collected = [];
      if (book.dataset.flowerSeen==='true') collected.push('flower');
      if (book.dataset.letterSeen==='true') collected.push('letter');
      collected.push('cake');
      draw(ctx,source,theme,collected);
      const blob = await new Promise(resolve => card.toBlob(resolve,'image/png'));
      card.width = 0;
      if (ticket!==revision || !dialog.open) return;
      if (!blob) throw new Error('PNG unavailable');
      imageUrl = URL.createObjectURL(blob);
      image.src = imageUrl;
      image.alt = `${editions[theme].name}，妈妈，生日快乐。印章：${collected.map(key=>seals[key][0]).join('、')}。`;
      image.hidden = false;
      download.href = imageUrl;
      download.hidden = false;
      status.textContent = '纪念笺印好了，可以下载或长按图片保存。';
    } catch {
      if (ticket===revision && dialog.open) status.textContent = '这次没印出来，请再点一下配色重试。';
    }
  }

  choices.forEach(button => button.addEventListener('click', () => make(button.dataset.cardTheme)));
  opener.addEventListener('click', () => { dialog.showModal(); make('warm'); });
  dialog.addEventListener('close', () => {
    revision++;
    releaseImage();
    if (!opener.hidden) opener.focus({preventScroll:true});
  });
})();
