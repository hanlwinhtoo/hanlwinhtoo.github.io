/* =====================================================================
   Portfolio interactions (vanilla JS, no dependencies)
   1. Theme toggle (light default, remembered in localStorage, cross-fades)
   1b. Phone menu: swipeable side drawer (project pages' top bar)
   2. Home sidebar: highlight the section in view
   5. Copy email button
   6. Tap effects on touch screens
   7. Footer year
   9. Project pages: click a screenshot to enlarge it
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

  /* ---------- 2. Home sidebar: highlight the section in view ---------- */
  // The link for the last section whose top has passed the upper third of
  // the window lights up; at the very bottom of the page, the last one does.
  const sideLinks = document.querySelectorAll('.side-nav a');
  if (sideLinks.length) {
    const sections = Array.from(sideLinks)
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    let ticking = false;
    function updateActive() {
      ticking = false;
      const line = window.innerHeight / 3;
      let current = sections[0];
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1];
      }
      sideLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateActive); }
    }, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();
  }

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
    const TAP_TARGETS = '.tile, .nav-links a';
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
