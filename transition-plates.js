(function () {
  'use strict';

  var MB = window.MB = window.MB || {};

  var HEAD = '<svg viewBox="0 0 200 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" stroke-linecap="round" stroke-linejoin="round">';
  var TAIL = '</svg>';
  var OC = ' style="transform-box:fill-box;transform-origin:50% 50%"';
  var OB = ' style="transform-box:fill-box;transform-origin:50% 100%"';
  var OL = ' style="transform-box:fill-box;transform-origin:0% 50%"';

  function plate(svg, accent, paper) {
    return Object.freeze({ svg: HEAD + svg + TAIL, accent: accent, paper: paper });
  }

  MB.transitionPlates = Object.freeze({
    timeline: plate(
      '<path d="M36 80Q100 72 164 80" stroke="#78947b" stroke-width="1.2"/>' +
      '<circle cx="36" cy="80" r="2" fill="#c79b60"/><circle cx="164" cy="80" r="2" fill="#c79b60"/>' +
      '<path d="M100 79C101 66 99 56 100 44" stroke="#78947b" stroke-width="1.6"/>' +
      '<g data-anim="sway" data-delay="0.12"' + OL + '><path d="M100 64C108 56 119 56 125 61C117 68 107 69 100 64Z" fill="#78947b"/><path d="M103 63Q112 60 120 61" stroke="#fff7e7" stroke-width=".8"/></g>' +
      '<g data-anim="grow"' + OB + '>' +
        '<path d="M100 44C90 40 84 30 87 21C95 24 100 34 100 44Z" fill="#b77783"/>' +
        '<path d="M100 44C110 40 116 30 113 21C105 24 100 34 100 44Z" fill="#d79aa3"/>' +
        '<path d="M100 44C90 46 80 44 74 37C83 34 93 37 100 44Z" fill="#d79aa3"/>' +
        '<path d="M100 44C110 46 120 44 126 37C117 34 107 37 100 44Z" fill="#b77783"/>' +
        '<circle cx="100" cy="41" r="3" fill="#c79b60"/>' +
      '</g>',
      '#b77783', '#fff7e7'
    ),

    greenhouse: plate(
      '<path d="M60 84V48Q60 14 100 14Q140 14 140 48V84" stroke="#292840" stroke-width="1.3" opacity=".7"/>' +
      '<path d="M60 48H140M100 14V30" stroke="#292840" stroke-width=".8" opacity=".35"/>' +
      '<path d="M52 84H148" stroke="#78947b" stroke-width="1.4"/>' +
      '<path d="M104 84L102 74H122L120 84Z" fill="#b77783"/>' +
      '<rect x="72" y="26" width="18" height="12" rx="3" fill="#78947b"/>' +
      '<path d="M74 26Q81 18 88 26" stroke="#78947b" stroke-width="1.4"/>' +
      '<path d="M90 30L104 25" stroke="#78947b" stroke-width="2"/>' +
      '<g data-anim="drop"' + OC + '>' +
        '<path d="M104 31C102.5 33.5 102.5 35 104 35C105.5 35 105.5 33.5 104 31Z" fill="#292840" opacity=".5"/>' +
        '<path d="M106 38C104.5 40.5 104.5 42 106 42C107.5 42 107.5 40.5 106 38Z" fill="#292840" opacity=".45"/>' +
        '<path d="M104 45C102.5 47.5 102.5 49 104 49C105.5 49 105.5 47.5 104 45Z" fill="#292840" opacity=".4"/>' +
      '</g>' +
      '<g data-anim="grow" data-delay="0.1"' + OB + '>' +
        '<path d="M112 74C112 66 110 60 112 52" stroke="#78947b" stroke-width="1.4"/>' +
        '<path d="M111 66C105 63 102 59 102 56C107 57 110 61 111 66Z" fill="#78947b"/>' +
        '<path d="M112 62C118 60 121 56 121 53C116 54 113 58 112 62Z" fill="#78947b"/>' +
        '<circle cx="112" cy="50" r="4" fill="#b77783"/>' +
        '<circle cx="112" cy="50" r="1.5" fill="#c79b60"/>' +
      '</g>',
      '#78947b', '#fff7e7'
    ),

    seaside: plate(
      '<circle cx="152" cy="28" r="10" fill="#c79b60" opacity=".85"/>' +
      '<path d="M36 26q4-4 8 0q4-4 8 0" stroke="#292840" stroke-width="1" opacity=".5"/>' +
      '<g transform="rotate(-10 102 52)"><g data-anim="float"' + OC + '>' +
        '<rect x="84" y="45" width="28" height="13" rx="5" fill="#fff7e7" stroke="#78947b" stroke-width="1.3"/>' +
        '<path d="M112 48H120V55H112" fill="#fff7e7" stroke="#78947b" stroke-width="1.3"/>' +
        '<rect x="120" y="48.5" width="4" height="6" rx="1" fill="#b77783"/>' +
        '<path d="M89 50H106M89 53.5H102" stroke="#c79b60" stroke-width="1.1"/>' +
      '</g></g>' +
      '<g data-anim="slide"><path d="M14 60Q29 54 44 60T74 60T104 60T134 60T164 60T194 60" stroke="#78947b" stroke-width="1.6"/></g>' +
      '<g data-anim="slide" data-delay="0.1"><path d="M0 72Q15 66 30 72T60 72T90 72T120 72T150 72T180 72T210 72" stroke="#292840" stroke-width="1.3" opacity=".6"/></g>',
      '#c79b60', '#fff7e7'
    ),

    forest: plate(
      '<path d="M150 18A9 9 0 1 0 160 30A7 7 0 1 1 150 18Z" fill="#fff7e7" opacity=".8"/>' +
      '<path d="M40 86Q100 80 160 86" stroke="#78947b" stroke-width="1.2" opacity=".7"/>' +
      '<g data-anim="sway"' + OB + '>' +
        '<path d="M100 86C98 70 96 56 88 42" stroke="#78947b" stroke-width="1.4"/>' +
        '<path d="M99 74C90 72 84 68 80 62C88 62 95 66 99 74Z" fill="#78947b"/>' +
        '<path d="M99 74C106 70 112 64 114 58C107 60 101 66 99 74Z" fill="#78947b"/>' +
        '<path d="M97 63C90 61 85 56 83 50C90 51 95 56 97 63Z" fill="#78947b"/>' +
        '<path d="M97 63C103 59 107 53 108 48C102 50 98 56 97 63Z" fill="#78947b"/>' +
        '<path d="M93 53C88 50 85 46 84 41C89 43 92 47 93 53Z" fill="#78947b"/>' +
        '<path d="M93 53C97 49 99 45 99 41C95 43 93 47 93 53Z" fill="#78947b"/>' +
      '</g>' +
      '<path data-anim="draw" d="M44 70C56 40 82 26 104 32C126 38 132 62 150 58C160 56 164 46 160 40" stroke="#c79b60" stroke-width="1" stroke-dasharray="240" stroke-dashoffset="0" opacity=".7"/>' +
      '<g data-anim="twinkle" data-delay="0.15">' +
        '<circle cx="160" cy="40" r="5" fill="#c79b60" opacity=".25"/>' +
        '<circle cx="160" cy="40" r="1.8" fill="#c79b60"/>' +
        '<circle cx="104" cy="32" r="1.6" fill="#c79b60"/>' +
        '<circle cx="150" cy="58" r="1.4" fill="#c79b60"/>' +
      '</g>',
      '#c79b60', '#292840'
    ),

    clouds: plate(
      '<circle cx="42" cy="26" r="6" fill="#c79b60" opacity=".7"/>' +
      '<path d="M128 42C126 36 134 32 140 35C143 28 155 28 157 35C164 33 170 38 167 42Z" fill="#fff7e7" stroke="#78947b" stroke-width="1"/>' +
      '<path d="M30 58C30 51 36 49 40 52C43 46 52 47 53 52C58 51 61 55 59 58Z" fill="#fff7e7" stroke="#78947b" stroke-width="1" opacity=".8"/>' +
      '<g data-anim="float"' + OC + '>' +
        '<path d="M100 54C88 46 84 38 86 30C88 20 112 20 114 30C116 38 112 46 100 54Z" fill="#b77783"/>' +
        '<path d="M100 22C95 30 95 44 100 54C105 44 105 30 100 22" stroke="#c79b60" stroke-width="1"/>' +
        '<path d="M95 52L97 60M105 52L103 60" stroke="#292840" stroke-width=".8"/>' +
        '<rect x="96" y="60" width="8" height="6" rx="1" fill="#c79b60"/>' +
      '</g>' +
      '<g data-anim="slide" data-delay="0.1"><path d="M58 84C58 76 68 74 74 77C76 68 90 66 96 73C102 66 116 68 118 76C126 72 138 76 136 84Z" fill="#fff7e7" stroke="#78947b" stroke-width="1.1"/></g>',
      '#b77783', '#fff7e7'
    ),

    musicbox: plate(
      '<circle cx="100" cy="15" r="2.4" fill="#c79b60"/>' +
      '<path d="M68 36L100 18L132 36Z" fill="#b77783"/>' +
      '<path d="M84 27L88 36M116 27L112 36M100 18V36" stroke="#fff7e7" stroke-width=".8" opacity=".6"/>' +
      '<path d="M68 36q4 6 8 0q4 6 8 0q4 6 8 0q4 6 8 0q4 6 8 0q4 6 8 0q4 6 8 0q4 6 8 0" fill="#fff7e7" stroke="#b77783" stroke-width="1.2"/>' +
      '<path d="M72 42V78M128 42V78M100 42V54" stroke="#c79b60" stroke-width="1.4"/>' +
      '<path d="M62 78H138M68 84H132" stroke="#292840" stroke-width="1.4"/>' +
      '<g data-anim="sway"' + OB + '>' +
        '<path d="M86 60C86 54 102 53 109 55L113 48C116 45 121 47 119 52L115 60C110 65 90 65 86 60Z" fill="#fff7e7" stroke="#292840" stroke-width="1.1"/>' +
        '<path d="M91 63L89 70M109 63L111 70M86 59Q80 60 80 66" stroke="#292840" stroke-width="1.1"/>' +
        '<path d="M114 47Q110 49 109 54" stroke="#b77783" stroke-width="1.6"/>' +
        '<path d="M82 70Q100 78 118 70" stroke="#292840" stroke-width="1.4"/>' +
      '</g>' +
      '<g data-anim="float" data-delay="0.15"' + OC + '>' +
        '<path d="M150 46V32L158 30V44" stroke="#292840" stroke-width="1.1"/>' +
        '<circle cx="148" cy="46" r="2.2" fill="#292840"/><circle cx="156" cy="44" r="2.2" fill="#292840"/>' +
      '</g>',
      '#b77783', '#fff7e7'
    ),

    lanterns: plate(
      '<path d="M18 18Q100 34 182 18" stroke="#fff7e7" stroke-width="1" opacity=".6"/>' +
      '<circle cx="30" cy="40" r="1" fill="#fff7e7"/><circle cx="172" cy="46" r="1.2" fill="#fff7e7"/>' +
      '<path d="M60 24V33M56 34H64" stroke="#fff7e7" stroke-width="1"/>' +
      '<path d="M54 35H66C70 41 70 51 66 57H54C50 51 50 41 54 35Z" fill="#b77783"/>' +
      '<path d="M60 57V64" stroke="#c79b60" stroke-width="1.2"/>' +
      '<g data-anim="twinkle"><circle cx="60" cy="46" r="15" fill="#c79b60" opacity=".16"/><ellipse cx="60" cy="47" rx="3" ry="5" fill="#fff7e7" opacity=".9"/></g>' +
      '<path d="M100 26V39M96 40H104" stroke="#fff7e7" stroke-width="1"/>' +
      '<path d="M94 41H106C110 47 110 57 106 63H94C90 57 90 47 94 41Z" fill="#c79b60"/>' +
      '<path d="M100 63V70" stroke="#b77783" stroke-width="1.2"/>' +
      '<g data-anim="twinkle" data-delay="0.08"><circle cx="100" cy="52" r="16" fill="#c79b60" opacity=".18"/><ellipse cx="100" cy="53" rx="3" ry="5" fill="#fff7e7" opacity=".9"/></g>' +
      '<path d="M140 24V33M136 34H144" stroke="#fff7e7" stroke-width="1"/>' +
      '<path d="M134 35H146C150 41 150 51 146 57H134C130 51 130 41 134 35Z" fill="#78947b"/>' +
      '<path d="M140 57V64" stroke="#c79b60" stroke-width="1.2"/>' +
      '<g data-anim="twinkle" data-delay="0.16"><circle cx="140" cy="46" r="15" fill="#c79b60" opacity=".16"/><ellipse cx="140" cy="47" rx="3" ry="5" fill="#fff7e7" opacity=".9"/></g>',
      '#c79b60', '#292840'
    ),

    memory: plate(
      '<path d="M0 88Q60 74 120 84T200 80" stroke="#78947b" stroke-width="1.2" opacity=".7"/>' +
      '<circle cx="30" cy="24" r="1" fill="#fff7e7" opacity=".7"/>' +
      '<circle cx="72" cy="18" r=".9" fill="#fff7e7" opacity=".6"/>' +
      '<circle cx="130" cy="20" r="1.1" fill="#fff7e7" opacity=".7"/>' +
      '<circle cx="176" cy="34" r=".9" fill="#fff7e7" opacity=".6"/>' +
      '<path data-anim="draw" d="M50 62L98 30L150 54" stroke="#c79b60" stroke-width="1" stroke-dasharray="240" stroke-dashoffset="0" opacity=".8"/>' +
      '<g data-anim="twinkle" data-delay="0.12">' +
        '<path d="M50 55L52 60L57 62L52 64L50 69L48 64L43 62L48 60Z" fill="#fff7e7"/>' +
        '<path d="M98 23L100 28L105 30L100 32L98 37L96 32L91 30L96 28Z" fill="#c79b60"/>' +
        '<path d="M150 47L152 52L157 54L152 56L150 61L148 56L143 54L148 52Z" fill="#fff7e7"/>' +
      '</g>',
      '#c79b60', '#292840'
    ),

    cake: plate(
      '<path d="M60 80H140" stroke="#292840" stroke-width="1.4"/>' +
      '<path d="M68 84H132" stroke="#292840" stroke-width=".9" opacity=".5"/>' +
      '<rect x="70" y="60" width="60" height="20" rx="3" fill="#b77783"/>' +
      '<path d="M70 63q5 6 10 0q5 6 10 0q5 6 10 0q5 6 10 0q5 6 10 0q5 6 10 0" stroke="#fff7e7" stroke-width="1.6"/>' +
      '<rect x="80" y="46" width="40" height="14" rx="3" fill="#fff7e7" stroke="#b77783" stroke-width="1.2"/>' +
      '<path d="M86 53H114" stroke="#c79b60" stroke-width="1" stroke-dasharray="2 4"/>' +
      '<rect x="98.5" y="32" width="3" height="14" rx="1" fill="#78947b"/>' +
      '<path d="M100 32V29" stroke="#292840" stroke-width=".8"/>' +
      '<g data-anim="grow"' + OB + '>' +
        '<circle cx="100" cy="23" r="8" fill="#c79b60" opacity=".2"/>' +
        '<path d="M100 16C96.5 21 97 28 100 28C103 28 103.5 21 100 16Z" fill="#c79b60"/>' +
      '</g>' +
      '<g data-anim="twinkle" data-delay="0.1"><path d="M82 20V26M79 23H85M120 16V22M117 19H123M126 34V38M124 36H128M74 36V39M72.5 37.5H75.5" stroke="#c79b60" stroke-width="1"/></g>',
      '#b77783', '#fff7e7'
    ),

    wall: plate(
      '<g data-anim="open"' + OB + '><path d="M68 44L100 22L132 44Z" fill="#d79aa3" stroke="#b77783" stroke-width="1.2"/></g>' +
      '<g data-anim="slide" data-delay="0.12">' +
        '<rect x="76" y="20" width="48" height="40" rx="1.5" fill="#fff7e7" stroke="#c79b60" stroke-width="1"/>' +
        '<path d="M84 28H116M84 34H112M84 40H106" stroke="#292840" stroke-width=".9" opacity=".5"/>' +
        '<path d="M110 48C108 45 104 46 105 49C106 51 110 53 110 53C110 53 114 51 115 49C116 46 112 45 110 48Z" fill="#b77783"/>' +
      '</g>' +
      '<path d="M68 44L100 64L132 44V82H68Z" fill="#f3d9d5" stroke="#b77783" stroke-width="1.2"/>' +
      '<path d="M68 82L94 62M132 82L106 62" stroke="#b77783" stroke-width=".9" opacity=".7"/>' +
      '<path d="M136 80C144 72 154 70 160 72C154 80 144 82 136 80Z" fill="#78947b"/>',
      '#b77783', '#fff7e7'
    ),

    rain: plate(
      '<path d="M66 30C64 22 74 18 80 22C84 12 100 12 104 20C110 14 124 18 122 28C128 28 132 34 126 36H70C62 36 60 31 66 30Z" fill="#78947b" fill-opacity=".3" stroke="#292840" stroke-width="1" stroke-opacity=".5"/>' +
      '<path d="M30 88H170" stroke="#292840" stroke-width="1" opacity=".35"/>' +
      '<g data-anim="drop"' + OC + '>' +
        '<path d="M82 42C80 46 80 48 82 48C84 48 84 46 82 42Z" fill="#292840" opacity=".55"/>' +
        '<path d="M101 50C99 54 99 56 101 56C103 56 103 54 101 50Z" fill="#292840" opacity=".4"/>' +
        '<path d="M120 42C118 46 118 48 120 48C122 48 122 46 120 42Z" fill="#292840" opacity=".55"/>' +
      '</g>' +
      '<g data-anim="ripple" data-delay="0.05"' + OC + '>' +
        '<ellipse cx="82" cy="78" rx="10" ry="2.6" stroke="#78947b" stroke-width="1.1"/>' +
        '<ellipse cx="82" cy="78" rx="18" ry="4.6" stroke="#78947b" stroke-width=".8" opacity=".5"/>' +
      '</g>' +
      '<g data-anim="ripple" data-delay="0.15"' + OC + '>' +
        '<ellipse cx="120" cy="80" rx="10" ry="2.6" stroke="#b77783" stroke-width="1.1"/>' +
        '<ellipse cx="120" cy="80" rx="18" ry="4.6" stroke="#b77783" stroke-width=".8" opacity=".5"/>' +
      '</g>',
      '#78947b', '#fff7e7'
    ),

    closing: plate(
      '<rect x="56" y="26" width="88" height="54" rx="2" fill="#fff7e7" stroke="#292840" stroke-width="1.1"/>' +
      '<path d="M56 26L100 56L144 26M56 80L88 56M144 80L112 56" stroke="#292840" stroke-width=".9" opacity=".55"/>' +
      '<g data-anim="grow" data-delay="0.12"' + OL + '>' +
        '<path d="M106 62C116 58 128 61 134 68C124 72 113 70 106 62Z" fill="#78947b"/>' +
        '<path d="M108 63Q120 64 130 68" stroke="#fff7e7" stroke-width=".7"/>' +
      '</g>' +
      '<g data-anim="stamp"' + OC + '>' +
        '<path d="M100 44C107 44 112 48 112 56C112 63 107 68 100 68C92 68 88 63 88 56C88 49 93 44 100 44Z" fill="#b77783"/>' +
        '<circle cx="100" cy="56" r="8" stroke="#fff7e7" stroke-width=".8" opacity=".7"/>' +
        '<path d="M100 60C96 57 95 54 97 52.5C98.5 51.5 100 53 100 53C100 53 101.5 51.5 103 52.5C105 54 104 57 100 60Z" fill="#fff7e7"/>' +
      '</g>',
      '#b77783', '#fff7e7'
    )
  });
})();
