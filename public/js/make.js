/* ---- poster maker -----------------------------------------------------------
   The wall prints are ours. This little machine lets anyone print one of four
   designs for themselves — drawn live on a canvas with the same fonts, the
   same five inks and the same heart-burger as the shop posters. Everything
   happens on the device: no uploads, no storage, just a picture to keep.
   The real phone numbers in the Hotline print are the branch numbers, same
   data as /spots/ — keep them in sync if the shop ever changes them. */
(function posterMaker () {
  var root = document.querySelector('[data-make]');
  if (!root) return;
  var canvas = root.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var input = root.querySelector('[data-mk-words]');
  var chips = [].slice.call(root.querySelectorAll('[data-mk-style]'));
  var stage = root.querySelector('[data-mk-stage]');
  var shuffleBtn = root.querySelector('[data-mk-shuffle]');
  var pngBtn = root.querySelector('[data-mk-png]');
  var jpgBtn = root.querySelector('[data-mk-jpg]');

  var W = canvas.width, H = canvas.height, M = 58;
  var HEART = new Path2D('M32 52C18 42 4 32 4 19 4 10 11 4 19 4c6 0 10 3 13 8 3-5 7-8 13-8 8 0 15 6 15 15 0 13-14 23-28 33Z');
  var GRILL = new Path2D('M9 24h46M12 34h40');
  var MARK = null;
  var BLACK = '"Archivo Black", system-ui, sans-serif';
  var TEXT = '"Archivo", system-ui, sans-serif';
  var C = { ink:'#141414', paper:'#fdf3e3', white:'#fffdf9', tomato:'#e0322a',
            cheese:'#ffc531', mustard:'#e0a52e', cyan:'#26d0bb' };
  var T = {
    love:    { label:'Love',    bg:C.paper,  fg:C.ink,   pop:C.tomato, accent:C.cheese },
    hotline: { label:'Hotline', bg:C.mustard,fg:C.ink,   pop:C.paper,  accent:C.tomato },
    crave:   { label:'Crave',   bg:C.cyan,   fg:C.ink,   pop:C.paper,  accent:C.tomato },
    eat:     { label:'Eat',     bg:C.tomato, fg:C.paper, pop:C.cheese, accent:C.paper }
  };
  var PHONES = [
    ['CHINIOT', '+92 47 6331462'],
    ['SARGODHA', '+92 48 3768182'],
    ['FAISALABAD', '+92 315 2821112']
  ];
  var POOL = ['MORE CHEESE','FOR MY SQUAD','AT 1 A.M.','EXTRA SAUCE','NO ONIONS',
              'HUNGRY AGAIN','TEAM PIZZA','FOR AHMED','FRIDAY MOOD','MEGA BITE'];
  var style = 'love', timer = null;

  /* ---------- little drawing kit ---------- */
  function font (fam, size, weight) { return (weight ? weight + ' ' : '') + size + 'px ' + fam; }
  function fit (str, fam, start, maxW, weight, ls) {
    var s = start;
    ctx.save();
    if (ls) ctx.letterSpacing = ls + 'px';
    ctx.font = font(fam, s, weight);
    while (s > 14 && ctx.measureText(str).width > maxW) { s -= 2; ctx.font = font(fam, s, weight); }
    ctx.restore();
    return s;
  }
  function txt (str, x, y, size, fam, weight, col, ls, align) {
    ctx.save();
    ctx.font = font(fam, size, weight);
    if (ls) { try { ctx.letterSpacing = ls + 'px'; } catch (e) {} }
    ctx.fillStyle = col; ctx.textAlign = align || 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(str, x, y);
    ctx.restore();
  }
  function big (str, x, y, size, col, off, shadowCol) {
    if (shadowCol) txt(str, x + off, y + off, size, BLACK, null, shadowCol);
    txt(str, x, y, size, BLACK, null, col);
  }
  function rr (x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function pill (str, cy, h, bg, col, border) {
    var fs = fit(str, BLACK, h * 0.5, W - M * 2 - 76, null, 2);
    ctx.save();
    ctx.font = font(BLACK, fs); try { ctx.letterSpacing = '2px'; } catch (e) {}
    var tw = ctx.measureText(str).width;
    ctx.restore();
    var w = Math.min(W - M * 2, tw + 76), x = (W - w) / 2;
    ctx.save();
    ctx.fillStyle = bg; ctx.strokeStyle = border; ctx.lineWidth = 5;
    ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 6;
    rr(x, cy - h / 2, w, h, h / 2); ctx.fill(); ctx.restore();
    rr(x, cy - h / 2, w, h, h / 2); ctx.strokeStyle = border; ctx.lineWidth = 5; ctx.stroke();
    txt(str, W / 2, cy + fs * 0.36, fs, BLACK, null, col, 2);
    return w;
  }
  function heart (cx, cy, w, fillCol, strokeCol, lw) {
    var k = w / 64;
    ctx.save();
    ctx.translate(cx - 32 * k, cy - 28 * k);
    ctx.scale(k, k);
    if (fillCol) { ctx.fillStyle = fillCol; ctx.fill(HEART); }
    if (strokeCol) { ctx.strokeStyle = strokeCol; ctx.lineWidth = lw / k; ctx.lineCap = 'round'; ctx.stroke(HEART); ctx.stroke(GRILL); }
    ctx.restore();
  }
  function dots (x0, y0, x1, y1, col) {
    ctx.save(); ctx.fillStyle = col;
    for (var y = y0; y <= y1; y += 26) for (var x = x0; x <= x1; x += 26) {
      ctx.globalAlpha = 0.05 + 0.13 * ((x / 26 + y / 26) % 3) / 3;
      ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  function grain (col) {
    ctx.save(); ctx.fillStyle = col;
    for (var i = 0; i < 700; i++) {
      ctx.globalAlpha = 0.045;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.4, 1.4);
    }
    ctx.restore();
  }
  function lockup (t) {
    if (MARK) {
      var mw = 128, mh = mw * 472 / 536;
      ctx.drawImage(MARK, (W - mw) / 2, 62, mw, mh);
      txt('LOVE BITES', W / 2, 62 + mh + 46, 40, BLACK, null, t.fg, 8);
    } else {
      txt('LOVE BITES', W / 2, 150, 54, BLACK, null, t.fg, 8);
    }
  }
  function footer (t) {
    ctx.save(); ctx.globalAlpha = 0.85;
    ctx.fillStyle = t.fg; ctx.fillRect(M, H - 84, W - M * 2, 3);
    ctx.restore();
    txt('LOVEBITES.PK', M, H - 44, 19, TEXT, 800, t.fg, 2, 'left');
    txt('CHINIOT · SARGODHA · FAISALABAD', W - M, H - 44, 19, TEXT, 800, t.fg, 2, 'right');
  }

  /* ---------- the four prints ---------- */
  function drawLove (t, s) {
    dots(180, 690, 580, 945, t.fg);
    txt('ALL YOU NEED IS', W / 2, 336, 28, TEXT, 900, t.fg, 12);
    big('LOVE', W / 2, 486, fit('LOVE', BLACK, 196, W - M * 2, null, 4), t.pop, 10, t.fg);
    big('BITES & PIZZA', W / 2, 578, fit('BITES & PIZZA', BLACK, 84, W - M * 2, null, 2), t.fg, 0);
    if (s) {
      heart(W / 2, 800, 260, t.accent, t.fg, 7);
      pill('FOR ' + s, 996, 82, t.accent, t.fg, t.fg);
    } else {
      heart(W / 2, 826, 320, t.accent, t.fg, 7);
      txt('SINCE 2018 · CHINIOT · PUNJAB', W / 2, 1014, 22, TEXT, 800, t.fg, 6);
    }
  }
  function drawHotline (t, s) {
    txt(s || 'NO APP. NO CART. NO WAITING SCREEN.', W / 2, 330, 32, TEXT, 900, t.fg, 6);
    big('CALL', W / 2, 456, fit('CALL', BLACK, 150, W - M * 2, null, 4), t.fg, 10, t.pop);
    big('YOUR', W / 2, 576, fit('YOUR', BLACK, 150, W - M * 2, null, 4), t.fg, 10, t.pop);
    big('PEOPLE', W / 2, 696, fit('PEOPLE', BLACK, 150, W - M * 2, null, 4), t.fg, 10, t.pop);
    PHONES.forEach(function (p, i) {
      var cy = 792 + i * 86, w = W - M * 2, x = M;
      ctx.save();
      ctx.fillStyle = t.pop; ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 6;
      rr(x, cy, w, 66, 14); ctx.fill(); ctx.restore();
      rr(x, cy, w, 66, 14); ctx.strokeStyle = t.fg; ctx.lineWidth = 5; ctx.stroke();
      txt(p[0], x + 28, cy + 43, 22, TEXT, 900, t.fg, 3, 'left');
      txt(p[1], x + w - 28, cy + 44, fit(p[1], BLACK, 32, w - 220, null, 1), BLACK, null, t.fg, 1, 'right');
    });
  }
  function drawCrave (t, s) {
    ctx.save();
    ctx.translate(W / 2, 760); ctx.rotate(-Math.PI / 10);
    ctx.globalAlpha = 0.1; ctx.strokeStyle = t.fg; ctx.lineWidth = 10;
    for (var x = -520; x <= 520; x += 46) { ctx.beginPath(); ctx.moveTo(x, -360); ctx.lineTo(x, 360); ctx.stroke(); }
    ctx.restore();
    txt('TONIGHT I CRAVE', W / 2, 342, 30, TEXT, 900, t.fg, 12);
    var word = s || 'PIZZA';
    big(word, W / 2, 528, fit(word, BLACK, 186, W - M * 2, null, 2), t.pop, 12, t.fg);
    txt('WE CAN FIX THAT.', W / 2, 606, 28, TEXT, 900, t.fg, 8);
    heart(W / 2, 840, 250, t.accent, t.fg, 7);
    if (s) txt('LOVE BITES · ' + s, W / 2, 1008, 20, TEXT, 800, t.fg, 4);
    else txt('TELL THE COUNTER. THEY KNOW.', W / 2, 1008, 20, TEXT, 800, t.fg, 4);
  }
  function drawEat (t, s) {
    ctx.save();
    ctx.strokeStyle = t.pop; ctx.globalAlpha = 0.16; ctx.lineWidth = 7;
    for (var i = 0; i < 28; i++) {
      var a = (i / 28) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * 190, 520 + Math.sin(a) * 190);
      ctx.lineTo(W / 2 + Math.cos(a) * 900, 520 + Math.sin(a) * 900); ctx.stroke();
    }
    ctx.restore();
    big('EAT', W / 2, 560, fit('EAT', BLACK, 300, W - M * 2, null, 6), t.fg, 14, t.pop);
    txt('GOOD FOOD. GOOD PEOPLE.', W / 2, 646, 32, TEXT, 900, t.fg, 8);
    if (s) pill(s, 724, 76, t.pop, t.accent, t.accent);
    heart(W / 2, 884, 240, null, t.fg, 7);
    txt('ACHHA KHANA, ACHHI ZINDAGI', W / 2, 1010, 22, TEXT, 900, t.fg, 6);
  }
  var DRAWS = { love: drawLove, hotline: drawHotline, crave: drawCrave, eat: drawEat };

  /* ---------- render + wire up ---------- */
  function render () {
    var t = T[style];
    var s = (input.value || '').toUpperCase().replace(/\s+/g, ' ').trim().slice(0, 24);
    ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
    grain(t.fg);
    lockup(t);
    DRAWS[style](t, s);
    footer(t);
    if (stage) stage.style.setProperty('--pw-bg', t.bg);
    canvas.setAttribute('aria-label',
      'Poster preview — the ' + t.label + ' print' + (s ? ' carrying the words ' + s : ''));
  }
  function pick (id) {
    style = id;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-mk-style') === id ? 'true' : 'false'); });
    render();
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () { pick(c.getAttribute('data-mk-style')); });
  });
  if (input) input.addEventListener('input', function () {
    clearTimeout(timer); timer = setTimeout(render, 120);
  });
  if (shuffleBtn) shuffleBtn.addEventListener('click', function () {
    var keys = Object.keys(T).filter(function (k) { return k !== style; });
    var w = POOL[Math.floor(Math.random() * POOL.length)];
    if (input) input.value = w;
    pick(keys[Math.floor(Math.random() * keys.length)]);
  });
  function save (type, ext) {
    canvas.toBlob(function (b) {
      var cap = stage && stage.querySelector('figcaption');
      var capText = cap ? cap.textContent : '';
      if (!b) {
        // Older/private browsers can refuse canvas export — say so instead of failing silently.
        if (cap) {
          cap.textContent = 'Download blocked by the browser — screenshot the frame instead.';
          setTimeout(function () { cap.textContent = capText; }, 5000);
        }
        return;
      }
      var a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = 'love-bites-' + style + '-poster.' + ext;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
    }, type, type === 'image/jpeg' ? 0.92 : undefined);
  }
  if (pngBtn) pngBtn.addEventListener('click', function () { save('image/png', 'png'); });
  if (jpgBtn) jpgBtn.addEventListener('click', function () { save('image/jpeg', 'jpg'); });

  var img = new Image();
  img.onload = function () { MARK = img; render(); };
  img.onerror = render;
  img.src = '/brand/mark.png';
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load('80px "Archivo Black"'), document.fonts.load('900 40px "Archivo"')])
      .then(render).catch(render);
    document.fonts.ready.then(render);
  } else { render(); }
  render();
})();
