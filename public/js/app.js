/* ============================================================
   LOVE BITES — front-end behaviour
   No framework. ~5kb. Every feature has a job:
   1. live open/closed status   → answers "can I go right now?"
   2. branch price switcher     → 48/56 items differ by city
   3. category jump bar         → 56 items need wayfinding
   4. craving machine           → replaces "browse the whole menu"
   5. scroll reveal             → print-drop motion, reduced-motion safe
   6. sticker easter egg        → brand personality, zero cost
   ============================================================ */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Build-time data (craving machine, menu categories) arrives as inert JSON
    in #lb-data — never as an executable inline script. */
  let DATA = {};
  try { DATA = JSON.parse($('#lb-data').textContent) || {}; } catch (e) { DATA = {}; }

  /* ---------- 1. LIVE OPEN / CLOSED ------------------------- */
  // Hours are 12:00 → 01:00 / 02:00 next day, so "close" is stored
  // as 25 / 26 and we test the clock in PKT (UTC+5) regardless of
  // the visitor's device timezone — a Chiniot student abroad still
  // sees the truth about the Chiniot branch.
  const pkNow = () => {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 6e4;
    return new Date(utc + 5 * 36e5);
  };
  const state = (b, now) => {
    const h = now.getHours() + now.getMinutes() / 60;
    const late = h < (b.close - 24); // 00:00–01:00/02:00 window
    const open = late || (h >= b.open && h < 24);
    let msg;
    if (open) {
      const closesIn = late ? (b.close - 24) - h : (b.close - h);
      msg = closesIn <= 1
        ? `Closing in ${Math.round(closesIn * 60)} min`
        : `Open now · till ${b.close === 26 ? '2 a.m.' : '1 a.m.'}`;
    } else {
      const opensIn = b.open - h;
      msg = opensIn <= 1 ? `Opens in ${Math.round(opensIn * 60)} min` : `Opens at 12 p.m.`;
    }
    return { open, msg };
  };

  fetch('/js/branches.json').then(r => r.json()).then(list => {
    const now = pkNow();
    const map = Object.fromEntries(list.map(b => [b.slug, b]));

    // per-branch pills
    $$('[data-live-branch-pill]').forEach(el => {
      const b = map[el.dataset.liveBranchPill]; if (!b) return;
      const s = state(b, now);
      el.classList.toggle('live--open', s.open);
      el.classList.toggle('live--shut', !s.open);
      el.lastElementChild.textContent = s.msg;
    });
    // small flags on spot cards
    $$('[data-live-branch]').forEach(el => {
      const b = map[el.dataset.liveBranch]; if (!b) return;
      const s = state(b, now);
      el.textContent = s.open ? 'OPEN' : 'CLOSED';
      el.style.background = s.open ? 'var(--lettuce)' : 'var(--ink)';
      el.style.color = '#fff';
    });
    // hero: summarise the whole chain
    const any = $('[data-live-any]');
    if (any) {
      const openOnes = list.filter(b => state(b, now).open);
      const txt = any.querySelector('[data-live-txt]');
      if (openOnes.length === list.length) txt.textContent = 'All three spots open right now';
      else if (openOnes.length) txt.textContent = `Open now in ${openOnes.map(b => b.city).join(' & ')}`;
      else txt.textContent = 'Closed · doors open 12 p.m.';
      any.classList.toggle('live--open', openOnes.length > 0);
      any.classList.toggle('live--shut', openOnes.length === 0);
    }
  }).catch(() => {
    // Static fallback so the page never sits on "Checking…" forever.
    $$('[data-live-txt]').forEach(el => { el.textContent = 'Open daily from 12 p.m.'; });
    $$('[data-live-branch-pill]').forEach(el => {
      const t = el.querySelector('span:last-child');
      if (t) t.textContent = 'Open daily from 12 p.m.';
    });
    $$('[data-live-branch]').forEach(el => {
      el.textContent = '12 p.m. – 1 a.m.';
      el.style.background = 'var(--ink)'; el.style.color = '#fff';
    });
  });

  const jumpTo = id => {
    const visible = $$('[data-branch-panel]').find(p => !p.hidden) || document;
    const sec = visible.querySelector(`[data-cat="${id}"]`);
    if (!sec) return;
    const y = sec.getBoundingClientRect().top + scrollY - 150;
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  };

  /* ---------- 2b. CATEGORY POSTER WALL ---------------------- */
  // Poster-style entry to each menu section. Counts and "from" prices come from
  // window.LB_CATS, which the build emits straight out of data/menus.json.
  const wall = $('[data-catwall]');
  const paintWall = slug => {
    if (!wall || !DATA.cats) return;
    const cats = DATA.cats[slug] || [];
    wall.innerHTML = cats.map((c, i) => `
      <button type="button" class="cp" data-jump="${c.id}"
        style="--cp-bg:${c.bg};--cp-fg:${c.fg}">
        <span class="cp__no">${String(i + 1).padStart(2, '0')}</span>
        <span class="cp__kick">${c.kick}</span>
        <span class="cp__t">${c.title}</span>
        <span class="cp__f">${c.n} items${c.from ? ` · from Rs ${c.from.toLocaleString('en-PK')}` : ''}</span>
      </button>`).join('');
    wall.querySelectorAll('[data-jump]').forEach(btn =>
      btn.addEventListener('click', () => jumpTo(btn.dataset.jump)));
  };

  /* ---------- 2. BRANCH PRICE SWITCHER ---------------------- */
  const panels = $$('[data-branch-panel]');
  if (panels.length) {
    const setBranch = (slug, push = true) => {
      $$('[data-branch]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.branch === slug)));
      panels.forEach(p => { p.hidden = p.dataset.branchPanel !== slug; });
      const pill = $('[data-live-branch-pill]');
      if (pill) pill.dataset.liveBranchPill = slug;
      try { localStorage.setItem('lb-branch', slug); } catch (e) { }
      paintWall(slug);
      if (push) history.replaceState(null, '', '#' + slug);
    };
    $$('[data-branch]').forEach(btn =>
      btn.addEventListener('click', () => setBranch(btn.dataset.branch)));

    // remember the visitor's city; deep-link wins over memory
    let init = location.hash.slice(1);
    if (!panels.some(p => p.dataset.branchPanel === init)) {
      try { init = localStorage.getItem('lb-branch') || 'chiniot'; } catch (e) { init = 'chiniot'; }
    }
    setBranch(init, false);
    // re-run the live pill after switching
    addEventListener('hashchange', () => {
      const h = location.hash.slice(1);
      if (panels.some(p => p.dataset.branchPanel === h)) setBranch(h, false);
    });
  }

  /* ---------- 3. CATEGORY JUMP BAR -------------------------- */
  const jumps = $$('[data-jump]');
  if (jumps.length) {
    jumps.forEach(btn => btn.addEventListener('click', () => jumpTo(btn.dataset.jump)));
    // highlight the category you're actually reading
    const spy = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.dataset.cat;
        jumps.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.jump === id)));
        const on = jumps.find(b => b.dataset.jump === id);
        if (on) on.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
      });
    }, { rootMargin: '-150px 0px -70% 0px' });
    $$('[data-cat]').forEach(s => spy.observe(s));
  }

  /* ---------- 4. CRAVING MACHINE ---------------------------- */
  // Single source of truth: the build emits CRAVINGS into #lb-data. Each entry
  // points at a photo of the dish it recommends — or, where no photo exists, at
  // an official Love Bites print flagged `illus` and labelled as such on screen.
  const CRAVE = Object.fromEntries((DATA.crave || []).map(c => [c.id, c]));
  const chips = $$('[data-crave]');
  if (chips.length && Object.keys(CRAVE).length) {
    const out = {
      v: $('[data-crave-verdict]'), w: $('[data-crave-why]'),
      p: $('[data-crave-picks]'), i: $('[data-crave-img]'),
      n: $('[data-crave-note]')
    };
    chips.forEach(c => c.addEventListener('click', () => {
      const d = CRAVE[c.dataset.crave]; if (!d) return;
      chips.forEach(x => x.setAttribute('aria-pressed', String(x === c)));
      out.v.textContent = d.verdict; out.w.textContent = d.why;
      out.p.innerHTML = d.picks.map(t => `<span class="tag">${t}</span>`).join('');
      out.i.src = d.img; out.i.alt = d.imgAlt || '';
      if (out.n) out.n.hidden = !d.illus;
      if (!reduced) {
        const card = out.v.closest('.crave__out');
        card.animate([{ transform: 'translateY(6px) rotate(-.3deg)', opacity: .55 }, { transform: 'none', opacity: 1 }],
          { duration: 260, easing: 'cubic-bezier(.2,1.5,.4,1)' });
      }
    }));
  }

  /* ---------- 5. SCROLL REVEAL (print-drop) ----------------- */
  const rv = $$('.rv');
  if (rv.length) {
    if (reduced) rv.forEach(e => e.classList.add('is-in'));
    else {
      const io = new IntersectionObserver((es, o) => es.forEach((e, n) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('is-in'), n * 70);
        o.unobserve(e.target);
      }), { rootMargin: '0px 0px -12% 0px' });
      rv.forEach(e => io.observe(e));
    }
  }

  /* ---------- 6. STICKER EASTER EGG ------------------------- */
  // Tap the nav heart 3× and a sticker gets slapped on the page.
  const mark = $('.nav__logo');
  if (mark) {
    let n = 0, t;
    mark.addEventListener('click', e => {
      // The logo is a link home. On any page it already points at, the
      // navigation is a no-op reload that would reset the counter — so
      // swallow it and let the taps accumulate instead.
      const here = mark.pathname === location.pathname;
      if (!here) return;                 // off-home: behave like a normal link
      e.preventDefault();
      if (++n < 3) { clearTimeout(t); t = setTimeout(() => n = 0, 900); return; }
      n = 0;
      if ($('.sticker')) return;
      const s = document.createElement('div');
      s.className = 'sticker';
      s.innerHTML = `<strong>Bhook lagi hai?</strong><span>Chalo phir. Table's free.</span>
        <button type="button" aria-label="Dismiss">×</button>`;
      document.body.appendChild(s);
      const bye = () => { s.classList.add('is-out'); setTimeout(() => s.remove(), 400); };
      s.querySelector('button').addEventListener('click', bye);
      setTimeout(bye, 7000);
    });
  }


  /* ---------- poster wall: drag to explore + progress line ----
     No arrows by design. Pointer drag on desktop, native momentum
     scroll on touch, keyboard arrows when the rail has focus, and a
     progress bar that reflects position instead of a dot per slide. */
  const rail = $('[data-rail]');
  if (rail) {
    const bar = $('[data-rail-bar]');
    const maxScroll = () => Math.max(1, rail.scrollWidth - rail.clientWidth);
    const paint = () => {
      if (!bar) return;
      const track = rail.clientWidth / rail.scrollWidth;
      bar.style.width = (track * 100).toFixed(2) + '%';
      const room = 100 - track * 100;
      bar.style.transform = 'translateX(' + ((rail.scrollLeft / maxScroll()) * room / track).toFixed(2) + '%)';
    };
    paint();
    rail.addEventListener('scroll', paint, { passive: true });
    addEventListener('resize', paint);

    let down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') return;
      down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft;
      rail.setPointerCapture(e.pointerId);
    });
    rail.addEventListener('pointermove', e => {
      if (!down) return;
      const d = e.clientX - sx;
      moved = Math.max(moved, Math.abs(d));
      if (moved > 4) rail.classList.add('is-drag');
      rail.scrollLeft = sl - d;
    });
    const up = e => {
      if (!down) return;
      down = false;
      try { rail.releasePointerCapture(e.pointerId); } catch (_) {}
      // keep links dead for one frame so a drag never fires a navigation
      setTimeout(() => rail.classList.remove('is-drag'), 0);
    };
    rail.addEventListener('pointerup', up);
    rail.addEventListener('pointercancel', up);

    rail.addEventListener('keydown', e => {
      const card = rail.querySelector('.pw');
      if (!card) return;
      const step = card.getBoundingClientRect().width + 16;
      if (e.key === 'ArrowRight') { rail.scrollBy({ left: step, behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { rail.scrollBy({ left: -step, behavior: 'smooth' }); e.preventDefault(); }
    });
  }

  /* ---------- nav shadow on scroll -------------------------- */
  const navEl = $('.nav');
  if (navEl) {
    const onScroll = () => navEl.classList.toggle('is-stuck', scrollY > 12);
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
  }
})();

/* ---- sticky offsets -------------------------------------------------------
   The nav, branch bar and category bar all stack as sticky layers. Their
   heights change with viewport width and font loading, so hardcoded rem
   offsets drift and the bars overlap each other. Measure them instead. */
(function stickyOffsets(){
  var root = document.documentElement;
  function sync(){
    var nav = document.querySelector('.nav');
    var bar = document.querySelector('.branchbar');
    var cat = document.querySelector('.catbar');
    if (nav) root.style.setProperty('--navh', nav.offsetHeight + 'px');
    if (bar) root.style.setProperty('--barh', bar.offsetHeight + 'px');
    if (cat) root.style.setProperty('--cath', cat.offsetHeight + 'px');
  }
  sync();
  addEventListener('resize', sync, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
})();

/* ---- review strip -----------------------------------------------------------
   Two independent rows. Each auto-scrolls via CSS, but each is also a real
   scroll container: touching one stops its animation for good (otherwise the
   transform and the scroll position fight each other) and hands over to
   native scrolling. The rows are deliberately not linked — dragging the
   Google row should not move the foodpanda row. */
(function reviewStrips(){
  document.querySelectorAll('[data-mq]').forEach(function(mq){
    var released = false;

    function release(){
      if (released) return;
      released = true;
      mq.classList.add('is-held');
      var dupe = mq.querySelector('.mq__row[aria-hidden="true"]');
      // Preserve the on-screen position: a reversed row sits at -100%, so
      // dropping the duplicate without compensating would jump it.
      var row = mq.querySelector('.mq__row');
      var shift = row ? new DOMMatrixReadOnly(getComputedStyle(row).transform).m41 : 0;
      mq.querySelectorAll('.mq__row').forEach(function(r){ r.style.animation = 'none'; });
      if (dupe) dupe.remove();
      if (shift) mq.scrollLeft = -shift;
    }

    ['wheel','touchstart','pointerdown'].forEach(function(ev){
      mq.addEventListener(ev, release, { passive: true });
    });

    var down = false, sx = 0, sl = 0, moved = 0;
    mq.addEventListener('pointerdown', function(e){
      if (e.pointerType === 'touch') return;
      down = true; moved = 0; sx = e.clientX; sl = mq.scrollLeft;
      try { mq.setPointerCapture(e.pointerId); } catch (_) {}
    });
    mq.addEventListener('pointermove', function(e){
      if (!down) return;
      var dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) mq.classList.add('is-drag');
      mq.scrollLeft = sl - dx;
    });
    ['pointerup','pointercancel','pointerleave'].forEach(function(ev){
      mq.addEventListener(ev, function(){
        down = false;
        setTimeout(function(){ mq.classList.remove('is-drag'); }, 0);
      });
    });
  });
})();

/* ---- lazy maps: nothing loads from Google until the visitor asks ---------- */
(function lazyMaps(){
  document.querySelectorAll('[data-map]').forEach(function (box) {
    var btn = box.querySelector('[data-map-load]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var src = box.getAttribute('data-map-src');
      var title = box.getAttribute('data-map-title') || 'Map showing Love Bites';
      if (!src) return;
      // Replace the placeholder with the real embed in place.
      var frame = document.createElement('iframe');
      frame.className = 'mapframe';
      frame.src = src;
      frame.title = title;
      frame.setAttribute('loading', 'lazy');
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      box.replaceWith(frame);
    });
  });
})();

/* ---- in-page anchors that cross pages (/#crave from /wall/) --------------- */
(function crossPageAnchors(){
  if (!location.hash || location.pathname !== '/') return;
  var target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView({ behavior: 'auto' });
})();

/* ---- menu deep links to a category (#fried-burgers from a poster) --------- */
(function categoryDeepLinks(){
  if (!location.hash) return;
  var id = location.hash.slice(1);
  var visible = Array.prototype.find.call(
    document.querySelectorAll('[data-branch-panel]'),
    function (p) { return !p.hidden; });
  if (!visible) return;
  var sec = visible.querySelector('[data-cat="' + id.replace(/"/g, '') + '"]');
  if (!sec) return;
  // Let layout settle (sticky bars measure after fonts load) then jump.
  requestAnimationFrame(function () {
    var y = sec.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top: y, behavior: 'auto' });
  });
})();
