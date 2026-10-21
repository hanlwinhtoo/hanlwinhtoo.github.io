/* =====================================================================
   Portfolio interactions (vanilla JS, no dependencies)
   1. Theme toggle (light default, remembered in localStorage, cross-fades)
   1b. Phone menu: swipeable side drawer
   2. Highlight the nav link + side dot for the screen in view
   3. Scroll reveal: each screen's content fades up when it comes into view
   4. Keep reveal + active link in sync with scrolling
   4b. Home terminal: types out commands each time Home appears
   5. Copy email button
   6. Tap effects on touch screens
   7. Footer year
   8. Home headline: typed words
   9. Project pages: click a screenshot to enlarge it
   Sections 2-4b only run on the home page (the pages with .screen sections).
   ===================================================================== */

(function () {
  const root = document.documentElement;

  /* ---------- 1. Theme toggle ---------- */
  const toggle = document.querySelector('.theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

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
      // Cross-fade the whole page as one picture (View Transitions). Fading each
      // element's colours separately made nested text lag behind its parent.
      // Older browsers and reduced-motion visitors switch instantly.
      if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // .theme-switching pauses hover colour transitions, so links and
        // buttons don't keep fading after the cross-fade has finished
        const vt = document.startViewTransition(function () {
          root.classList.add('theme-switching');
          applyTheme(next);
        });
        vt.finished.finally(function () { root.classList.remove('theme-switching'); });
      } else {
        applyTheme(next);
      }
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
    if (!current) return; // project pages have no screens
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
      // (both project screens light up "Projects")
      const navId = current.getAttribute('data-nav') || activeId;
      navLinks.forEach(function (a) {
        const id = a.getAttribute('href').slice(1);
        const isDot = a.parentElement.classList.contains('dots');
        a.classList.toggle('active', id === (isDot ? activeId : navId));
      });
    }
  }

  /* ---------- 4. Keep reveal + active link in sync with scrolling ---------- */
  let ticking = false;
  function paint() {
    ticking = false;
    updateScreens();
  }
  function requestPaint() {
    if (!ticking) { ticking = true; requestAnimationFrame(paint); }
  }

  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint);
  requestPaint();

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

  /* ---------- 8. Home headline: typed words ---------- */
  // Types each word in data-words, pauses, deletes it, then types the next.
  // With reduced motion the first word just stays as written.
  const typer = document.querySelector('.type-words');
  if (typer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = typer.getAttribute('data-words').split('|');
    let w = 0, n = words[0].length, deleting = false;
    (function tick() {
      const word = words[w];
      typer.textContent = word.slice(0, n);
      let wait = deleting ? 45 : 90;
      if (!deleting && n === word.length) { deleting = true; wait = 1800; }   // hold the full word
      else if (deleting && n === 0) { deleting = false; w = (w + 1) % words.length; wait = 350; }
      else n += deleting ? -1 : 1;
      setTimeout(tick, wait);
    })();
  }

  /* ---------- 9. Screenshot lightbox ---------- */
  // Clicking a screenshot (.shot img) opens it full size in a <dialog> with
  // its caption. Click anywhere or press Escape to close.
  const shots = document.querySelectorAll('.shot img');
  if (shots.length && typeof HTMLDialogElement === 'function') {
    const box = document.createElement('dialog');
    box.className = 'lightbox';
    box.innerHTML = '<img alt=""><p class="lightbox-caption"></p>';
    document.body.appendChild(box);
    const boxImg = box.querySelector('img');
    const boxCap = box.querySelector('.lightbox-caption');
    shots.forEach(function (img) {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Enlarge: ' + img.alt);
      function open() {
        const cap = img.closest('figure') && img.closest('figure').querySelector('figcaption');
        boxImg.src = img.dataset.full || img.currentSrc || img.src; // data-full: a larger or uncropped version
        boxImg.alt = img.alt;
        boxCap.textContent = cap ? cap.textContent : '';
        box.showModal();
      }
      img.addEventListener('click', open);
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
    box.addEventListener('click', function () { box.close(); });
  }
})();
