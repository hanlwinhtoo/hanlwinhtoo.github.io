/* =====================================================================
   Portfolio interactions (vanilla JS, no dependencies)
   1. Theme toggle (dark default, remembered in localStorage, cross-fades)
   1b. Phone menu: swipeable side drawer
   2. Highlight the nav link + side dot for the screen in view
   3. Scroll reveal: each screen's content fades up when it comes into view
   4. Screen-to-screen blur through (wheel, keys and touch swipes)
   4b. Home terminal: types out commands each time Home appears
   5. Copy email button
   6. Tap effects on touch screens
   7. Footer year
   ===================================================================== */

(function () {
  const root = document.documentElement;

  /* ---------- 1. Theme toggle ---------- */
  const toggle = document.querySelector('.theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  let fadeTimer = null;

  function applyTheme(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    if (toggle) toggle.setAttribute('aria-label', theme === 'light' ? 'Toggle dark mode' : 'Toggle light mode');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      // Turn on colour transitions only while switching, so normal hovers stay snappy
      root.classList.add('theme-fade');
      applyTheme(next);
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () { root.classList.remove('theme-fade'); }, 600);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
    });
  }

  /* ---------- 1b. Phone menu: swipeable side drawer ---------- */
  // Open with the menu button or a swipe left from the right screen edge.
  // Close with the button, a tap on the dimmed page, a link, Escape, or by
  // swiping the drawer back to the right (it follows the finger).
  const topbar = document.querySelector('.topbar');
  const menuBtn = document.querySelector('.menu-toggle');
  const drawer = document.getElementById('nav-links');
  const phoneMQ = window.matchMedia('(max-width: 760px)');

  function isOpen() { return topbar.classList.contains('nav-open'); }

  function setMenu(open) {
    if (!topbar || !menuBtn) return;
    topbar.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.style.overflow = open ? 'hidden' : ''; // keep the page still behind it
  }

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!isOpen());
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    // Outside the top bar, or on the dimmed backdrop (the bar's ::before,
    // which reports the bar itself as the target)
    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (!topbar.contains(e.target) || e.target === topbar) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    phoneMQ.addEventListener && phoneMQ.addEventListener('change', function () { setMenu(false); });

    // Swipe gestures
    const EDGE = 24;        // px from the right edge where an opening swipe can start
    const COMMIT = 0.35;    // drag past 35% of the drawer width to finish the move
    const FLICK = 0.5;      // or a flick faster than 0.5 px/ms...
    const FLICK_MIN = 40;   // ...that still travels at least 40px (ignores twitches)
    let mode = null;        // 'open' | 'close' while a swipe may be in progress
    let axis = null;        // 'x' once the gesture is clearly horizontal
    let sx = 0, sy = 0, dx = 0, t0 = 0;

    function moveDrawer(px) {
      drawer.classList.add('dragging');
      drawer.style.visibility = 'visible';
      drawer.style.transform = 'translateX(' + px + 'px)';
    }
    function releaseDrawer() {
      drawer.classList.remove('dragging');
      drawer.style.transform = '';
      drawer.style.visibility = '';
    }

    document.addEventListener('touchstart', function (e) {
      mode = null; axis = null; dx = 0;
      if (!phoneMQ.matches || e.touches.length !== 1) return;
      const t = e.touches[0];
      if (isOpen()) mode = 'close';
      else if (t.clientX > window.innerWidth - EDGE) mode = 'open';
      sx = t.clientX; sy = t.clientY; t0 = performance.now();
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!mode) return;
      const t = e.touches[0];
      dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (!axis) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) axis = 'x';
        else if (Math.abs(dy) > 8) { mode = null; return; } // a vertical scroll, not ours
        else return;
      }
      e.preventDefault();
      const w = drawer.offsetWidth;
      if (mode === 'close') moveDrawer(Math.max(0, dx));                  // drag right to close
      else moveDrawer(Math.min(w, Math.max(0, w + dx)));                  // drag left to open
    }, { passive: false });

    document.addEventListener('touchend', function () {
      if (!mode || axis !== 'x') { mode = null; return; }
      const w = drawer.offsetWidth;
      const speed = Math.abs(dx) / Math.max(1, performance.now() - t0);
      releaseDrawer(); // animates from the finger position to the final state
      if (mode === 'close' && dx > 0 && (dx > w * COMMIT || (speed > FLICK && dx > FLICK_MIN))) setMenu(false);
      if (mode === 'open' && dx < 0 && (-dx > w * COMMIT || (speed > FLICK && -dx > FLICK_MIN))) setMenu(true);
      mode = null;
    }, { passive: true });
  }

  /* ---------- 2. Active section ---------- */
  const navLinks = document.querySelectorAll('.nav-links a, .dots a');
  const screens = document.querySelectorAll('.screen');

  /* ---------- 3. Scroll reveal (tag items, staggered per screen) ---------- */
  screens.forEach(function (screen) {
    const items = screen.querySelectorAll(
      '.hero-text > *, .terminal, .container > :not(.grid):not(.timeline):not(.hero):not(.contact-intro):not(.contact-list):not(.project-info):not(.project-index):not(.skills-head):not(.tiles), .timeline > li, .contact-intro > *, .contact-list > li, .project-info > *, .project-index, .skills-head > *, .tiles > li'
    );
    items.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.setProperty('--i', i);
    });
  });

  // Reveal + active link are updated from the scroll handler in section 4
  // (updateScreens), measured directly so they replay in both directions.
  let activeId = null;
  function updateScreens() {
    const h = window.innerHeight;
    const mid = h / 2;
    let current = screens[0];
    screens.forEach(function (s) {
      const r = s.getBoundingClientRect();
      if (r.top <= mid) current = s;
      // Fade in once 15% of the window shows this screen; reset when fully gone
      const visible = Math.min(r.bottom, h) - Math.max(r.top, 0);
      if (visible >= h * 0.15) s.classList.add('in');
      else if (visible <= 1) s.classList.remove('in'); // <= 1: tolerate sub-pixel edges
    });
    if (current.id !== activeId) {
      activeId = current.id;
      // Side dots match each screen; menu links match its data-nav group
      // (all three project screens light up "Projects")
      const navId = current.getAttribute('data-nav') || activeId;
      navLinks.forEach(function (a) {
        const id = a.getAttribute('href').slice(1);
        const isDot = a.parentElement.classList.contains('dots');
        a.classList.toggle('active', id === (isDot ? activeId : navId));
      });
    }
  }

  /* ---------- 4. Screen-to-screen blur through (screens big enough to fit a section) ---------- */
  // The current screen blurs and fades out, the page jumps while it's hidden,
  // then the next screen comes in from blurry to sharp, like a camera
  // refocusing. Only the two screens involved are blurred (cheap to draw).
  // Works with mouse wheel, trackpad, keyboard and touch swipes. Phones and
  // portrait tablets (sections taller than the screen) and reduced-motion
  // visitors keep normal scrolling.
  const pagingMQ = window.matchMedia('(min-width: 900px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)');
  const screenList = Array.from(screens);
  const BLUR_OUT = 300;    // ms, current screen blurs away
  const BLUR_IN = 550;     // ms, next screen comes into focus
  const BLUR = 14;         // px of blur at the hidden point
  const EASE_OUT = 'cubic-bezier(.55, 0, 1, .45)';  // accelerates away
  const EASE_IN = 'cubic-bezier(.22, .61, .36, 1)'; // settles softly
  const COOLDOWN = 220;    // swallow trackpad momentum after a move
  let animating = false;
  let lockUntil = 0;

  function setFx(el, opacity, blur, ms, easing) {
    el.style.transition = ms ? 'opacity ' + ms + 'ms ' + easing + ', filter ' + ms + 'ms ' + easing : 'none';
    el.style.opacity = opacity;
    el.style.filter = blur ? 'blur(' + blur + 'px)' : 'none';
  }
  function clearFx(el) {
    el.style.transition = '';
    el.style.opacity = '';
    el.style.filter = '';
  }

  // The screen covering the middle of the viewport
  function currentIndex() {
    const mid = window.innerHeight / 2;
    let idx = 0;
    screenList.forEach(function (s, i) {
      if (s.getBoundingClientRect().top <= mid) idx = i;
    });
    return idx;
  }

  function blurTo(y) {
    if (Math.abs(y - window.scrollY) < 1) return;
    animating = true;
    needFreshGesture = true;   // swallow this swipe's leftover momentum

    // 1. Current screen blurs and fades out
    const src = screenList[currentIndex()];
    setFx(src, 0, BLUR, BLUR_OUT, EASE_OUT);

    setTimeout(function () {
      // 2. While hidden: jump (instant: html.paging turns smooth scrolling off)
      window.scrollTo(0, y);
      clearFx(src);
      const dest = screenList[currentIndex()];
      setFx(dest, 0, BLUR, 0);
      // Always replay the arriving screen's reveal, whatever state it was in:
      // hide its content (instant), force a reflow, then let updateScreens
      // add .in again so the fade-up runs from the start
      dest.classList.remove('in');
      void dest.offsetWidth;   // also applies the blurred start state
      updateScreens();         // resets the old screen, starts the new one's reveal

      // 3. Next screen comes into focus
      setFx(dest, 1, 0, BLUR_IN, EASE_IN);
      setTimeout(function () {
        clearFx(dest);
        animating = false;
        lockUntil = performance.now() + COOLDOWN;
      }, BLUR_IN);
    }, BLUR_OUT);
  }

  function goTo(i) {
    const from = currentIndex();
    i = Math.max(0, Math.min(screenList.length - 1, i));
    const s = screenList[i];
    const top = s.getBoundingClientRect().top + window.scrollY;
    if (i === from) {
      // Part-way through the current screen: just ease it back into place
      window.scrollTo({ top: top, behavior: 'smooth' });
      return;
    }
    // Going up into a screen taller than the window: land on its bottom edge
    const target = i < from && isTall(s) ? top + s.offsetHeight - window.innerHeight : top;
    blurTo(target);
  }

  // Let a screen taller than the window scroll normally until its edge
  // A screen only counts as "taller than the window" if more than its bottom
  // padding is cut off; a few px of overflow used to eat a scroll with a tiny
  // nudge instead of a transition.
  const SLACK = 64;
  function isTall(s) {
    return s.offsetHeight - window.innerHeight > SLACK;
  }

  // Edge of the current screen still to scroll to in this direction, or null
  function insideTarget(dir) {
    const s = screenList[currentIndex()];
    if (!isTall(s)) return null;
    const r = s.getBoundingClientRect();
    const y = window.scrollY;
    if (dir > 0 && r.bottom > window.innerHeight + 2) return y + r.bottom - window.innerHeight;
    if (dir < 0 && r.top < -2) return y + r.top;
    return null;
  }

  function step(dir, e) {
    e.preventDefault();
    if (animating || performance.now() < lockUntil) return;
    const edge = insideTarget(dir);
    if (edge !== null) {
      // Tall screen: glide to its other edge in one smooth move first
      animating = true;
      needFreshGesture = true;
      window.scrollTo({ top: edge, behavior: 'smooth' });
      setTimeout(function () { animating = false; lockUntil = performance.now() + COOLDOWN; }, 500);
      return;
    }
    goTo(currentIndex() + dir);
  }

  // Trackpads keep firing wheel events (momentum) for up to a second after the
  // fingers stop. After each move, ignore that stream until it pauses, so one
  // swipe can't carry on into a second transition and skip a screen.
  const GESTURE_GAP = 160;   // ms of wheel silence that marks a new gesture
  let lastWheel = 0;
  let needFreshGesture = false;

  window.addEventListener('wheel', function (e) {
    if (!pagingMQ.matches || e.ctrlKey) return;
    const now = performance.now();
    const gap = now - lastWheel;
    lastWheel = now;
    if (Math.abs(e.deltaY) < 2) { e.preventDefault(); return; }
    if (needFreshGesture && !animating) {
      if (gap < GESTURE_GAP) { e.preventDefault(); return; } // still the old swipe
      needFreshGesture = false;
    }
    step(e.deltaY > 0 ? 1 : -1, e);
  }, { passive: false });

  // Touch screens (tablets in landscape, touch laptops): one swipe = one screen.
  // Only single-finger swipes are taken over, so taps and pinch-zoom still work.
  const SWIPE_MIN = 40;      // px of finger travel that counts as a swipe
  let touchY = null;
  const noop = { preventDefault: function () {} };

  window.addEventListener('touchstart', function (e) {
    touchY = pagingMQ.matches && e.touches.length === 1 ? e.touches[0].clientY : null;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (touchY === null || e.touches.length !== 1) return;
    if (e.target.closest && e.target.closest('.nav-links')) return; // let the menu scroll
    e.preventDefault(); // stop native scrolling; touchend decides the move
  }, { passive: false });

  window.addEventListener('touchend', function (e) {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    touchY = null;
    if (Math.abs(dy) < SWIPE_MIN) return; // a tap, not a swipe
    step(dy > 0 ? 1 : -1, noop);
  }, { passive: true });

  window.addEventListener('keydown', function (e) {
    if (!pagingMQ.matches || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(document.activeElement.tagName)) return;
    const k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) step(1, e);
    else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) step(-1, e);
    else if (k === 'Home') { e.preventDefault(); goTo(0); }
    else if (k === 'End') { e.preventDefault(); goTo(screenList.length - 1); }
  });

  // Menu links, side dots, "Get in touch" etc. use the same blur
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!pagingMQ.matches) return;
      const target = document.querySelector(a.getAttribute('href'));
      const i = screenList.indexOf(target);
      if (i === -1) return;
      e.preventDefault();
      if (!animating) goTo(i);
    });
  });

  // Keep reveal + active link in sync with any scrolling (wheel, touch, keys)
  let ticking = false;
  function paint() {
    ticking = false;
    updateScreens();
  }
  function requestPaint() {
    if (!ticking) { ticking = true; requestAnimationFrame(paint); }
  }

  function syncMode() {
    root.classList.toggle('paging', pagingMQ.matches);
    requestPaint();
  }
  if (pagingMQ.addEventListener) pagingMQ.addEventListener('change', syncMode);
  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint);
  syncMode();

  /* ---------- 4b. Home terminal typing ---------- */
  // Each time Home appears (.in), commands are typed out character by
  // character and their output appears line by line; leaving Home cancels it.
  // Without JS or with reduced motion, the terminal just shows its full text.
  (function () {
    const home = document.getElementById('home');
    const body = home && home.querySelector('.term-body');
    if (!body || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lines = Array.from(body.children);
    const cursor = body.querySelector('.t-cursor');
    // Remember each command's full text, then start empty
    const cmds = lines.filter(function (l) { return l.classList.contains('t-cmd'); });
    cmds.forEach(function (l) { const t = l.querySelector('.t-text'); l.dataset.full = t.textContent; });

    let run = 0; // bumps on every start/stop so stale timers do nothing
    const wait = function (ms, id) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () { id === run ? resolve() : reject(); }, ms);
      });
    };

    function reset() {
      lines.forEach(function (l) { l.classList.add('t-hide'); });
      cmds.forEach(function (l) { l.querySelector('.t-text').textContent = ''; });
    }
    function showAll() {
      lines.forEach(function (l) { l.classList.remove('t-hide'); });
      cmds.forEach(function (l) { l.querySelector('.t-text').textContent = l.dataset.full; });
      lines[lines.length - 1].appendChild(cursor);
    }

    async function play() {
      const id = ++run;
      reset();
      try {
        await wait(350, id);
        for (const line of lines) {
          line.classList.remove('t-hide');
          if (line.classList.contains('t-cmd')) {
            const t = line.querySelector('.t-text');
            line.appendChild(cursor);              // cursor follows the typing
            for (const ch of line.dataset.full) {
              t.textContent += ch;
              await wait(28 + Math.random() * 45, id);
            }
            await wait(line.dataset.full ? 260 : 0, id); // "press Enter"
          } else {
            await wait(70, id);                    // output prints quickly
          }
        }
      } catch (e) { /* cancelled */ }
    }

    // Start when Home's content reveals, stop (and show everything) when it leaves
    let wasIn = false;
    new MutationObserver(function () {
      const isIn = home.classList.contains('in');
      if (isIn && !wasIn) play();
      if (!isIn && wasIn) { run++; showAll(); }
      wasIn = isIn;
    }).observe(home, { attributes: true, attributeFilter: ['class'] });
    if (home.classList.contains('in')) { wasIn = true; play(); }
  })();

  /* ---------- 5. Copy email ---------- */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    let resetTimer = null;
    btn.addEventListener('click', function () {
      const text = btn.getAttribute('data-copy');
      const done = function () {
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = 'mailto:' + text; });
      } else {
        window.location.href = 'mailto:' + text; // no clipboard access: open the mail app instead
      }
    });
  });

  /* ---------- 6. Tap effects on touch screens ---------- */
  // Touch screens have no hover, and iPhones don't apply :hover to plain
  // elements like the skill tiles. Tapping one adds .tap (styled the same as
  // :hover in style.css) for a moment, so the effect is visible on phones too.
  if (window.matchMedia('(hover: none)').matches) {
    const TAP_TARGETS = '.tile, .contact-row, .avatar, .nav-links a';
    const TAP_MS = 1200;
    document.addEventListener('touchstart', function (e) {
      const el = e.target.closest ? e.target.closest(TAP_TARGETS) : null;
      document.querySelectorAll('.tap').forEach(function (x) { if (x !== el) x.classList.remove('tap'); });
      if (!el) return;
      el.classList.add('tap');
      clearTimeout(el.tapTimer);
      el.tapTimer = setTimeout(function () { el.classList.remove('tap'); }, TAP_MS);
    }, { passive: true });
  }

  /* ---------- 7. Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
