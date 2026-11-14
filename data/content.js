/* 想改文案，改这个文件就行，保存后刷新页面。
   它被 index.html 直接加载，所以双击打开（file://）也能生效。 */

window.MB_CONFIG = {
  "recipientName": "妈妈",
  "pageTitle": "妈妈，生日快乐",
  "opening": {
    "eyebrow": "今天，想把时间慢下来",
    "title": "有一份礼物，想亲手交给你",
    "buttonText": "打开礼物"
  },
  "story": {
    "sceneDurationMs": 7000,
    "transitionMs": 700,
    "scenes": [
      {
        "id": "hand-in-hand",
        "caption": "有你的陪伴，小路也有了方向。"
      },
      {
        "id": "lamplight",
        "caption": "一盏暖灯，照亮了细小而长久的爱。"
      },
      {
        "id": "doorway",
        "caption": "门口的目光，总把牵挂送得很远。"
      },
      {
        "id": "window",
        "caption": "走向远方时，心里始终留着家的窗。"
      },
      {
        "id": "homecoming",
        "caption": "回到你身边，就有一个温暖的拥抱。"
      },
      {
        "id": "candles",
        "caption": "今天，让我们一起，把心愿交给烛光。"
      }
    ]
  },
  "blessing": {
    "title": "妈妈，生日快乐",
    "lines": [
      "谢谢你，把许多平常的日子，过成了**温暖的记忆**。",
      "愿往后的时光，对你**温柔一些**，再温柔一些。",
      "愿你健康、自在，也记得**把喜欢的事留给自己**。",
      "今天不必忙碌，只管**收下这一份爱**。"
    ],
    "charIntervalMs": 90
  },
  "timeline": {
    "title": "把四季的温柔，都送给你",
    "photos": []
  },
  "memoryGame": {
    "title": "把心愿，一颗颗点亮",
    "pairs": [
      {
        "id": "lamp",
        "label": "一盏暖灯",
        "symbol": "灯"
      },
      {
        "id": "letter",
        "label": "一封家书",
        "symbol": "信"
      },
      {
        "id": "flower",
        "label": "一束小花",
        "symbol": "花"
      },
      {
        "id": "tea",
        "label": "一杯热茶",
        "symbol": "茶"
      },
      {
        "id": "home",
        "label": "一处归途",
        "symbol": "家"
      },
      {
        "id": "cake",
        "label": "一份心愿",
        "symbol": "愿"
      }
    ],
    "successMessage": "六颗星都亮起来了。它们连在一起，恰好是同一句话：妈妈，我们爱你。"
  },
  "cake": {
    "title": "许一个心愿吧",
    "wishMessage": "愿你的心愿，被时光温柔珍藏。",
    "easterEgg": {
      "title": "还有一句悄悄话",
      "text": "不只今天，往后的每一天，都想让你知道：你值得被好好爱着。"
    }
  },
  "music": {
    "src": null,
    "title": "背景音乐",
    "enabled": false
  },
  "messageWall": {
    "title": "把祝福留在这里",
    "intro": "有些话，值得认真写下来。把祝福留作一张小小的信笺。",
    "emptyText": "这里还没有收藏的祝福。写下第一句吧。",
    "pendingText": "祝福已收到，审核通过后就会展示。"
  },
  "closing": {
    "title": "最后，想说一句",
    "lines": [
      "这一页能说的话不多，**说不完的，我们留着以后慢慢说**。",
      "往后的每一天，都算数。"
    ],
    "sign": "爱你的家人"
  },
  "blessingRain": {
    "title": "温馨提示",
    "items": [
      "记得按时吃饭",
      "天冷了，多穿一件",
      "别熬太晚，早点睡",
      "今天也要开心",
      "累了就歇一会儿",
      "多喝热水",
      "想吃什么就买",
      "出门记得带伞",
      "有不开心就说出来",
      "多出去走走",
      "别总惦记我们，也顾顾自己",
      "你值得被好好爱着"
    ],
    "closing": "这些话很平常，但每一句都是真的。"
  }
};

window.MB_MESSAGES = { messages: [] };
