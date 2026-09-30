/* =====================================================================
   Portfolio interactions (vanilla JS, no dependencies)
   1. Theme toggle (dark default, remembered in localStorage)
   2. Highlight the nav link for the section on screen (sliding glass capsule)
   2b. Liquid glass: refraction switch + pointer highlight
   3. Footer year
   ===================================================================== */

(function () {
  const root = document.documentElement;

  /* ---------- 1. Theme toggle ---------- */
  const toggle = document.querySelector('.theme-toggle');
  const icon = toggle ? toggle.querySelector('i') : null;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (icon) icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#161826' : '#eceff9');
  }

  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
    });
  }

  /* ---------- 1b. Mobile action menu ---------- */
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.menu-toggle');

  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!nav.classList.contains('open'));
    });
    // Close on link click, outside click, or Escape
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------- 2. Active nav link + sliding glass indicator ---------- */
  const links = document.querySelectorAll('.nav-links a[href^="#"]'); // section links only, not the resume download
  const sections = Array.from(links)
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  const navLinks = document.getElementById('nav-links');
  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  if (navLinks) navLinks.prepend(indicator);
  let activeLink = null;

  // Move the capsule onto the active link; jump (no slide) when it was hidden
  function moveIndicator() {
    if (!activeLink || !activeLink.offsetWidth) { indicator.style.opacity = '0'; return; }
    const hidden = indicator.style.opacity !== '1';
    if (hidden) indicator.classList.add('no-anim');
    indicator.style.width = activeLink.offsetWidth + 'px';
    indicator.style.height = activeLink.offsetHeight + 'px';
    indicator.style.transform = 'translate(' + activeLink.offsetLeft + 'px, ' + activeLink.offsetTop + 'px)';
    if (hidden) { void indicator.offsetWidth; indicator.classList.remove('no-anim'); }
    indicator.style.opacity = '1';
  }
  window.addEventListener('resize', moveIndicator);
  // Link widths change once the web font loads, so re-measure whenever the tabs resize
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(function () { moveIndicator(); });
    links.forEach(function (a) { ro.observe(a); });
  } else if (document.fonts) {
    document.fonts.ready.then(moveIndicator);
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { requestAnimationFrame(moveIndicator); });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          const on = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('active', on);
          if (on) activeLink = a;
        });
        moveIndicator();
      });
    }, { rootMargin: '-45% 0px -50% 0px' }); // fires when a section crosses the middle of the screen
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- 2b. Liquid glass ---------- */
  // Refraction needs SVG filters in backdrop-filter, which only Chromium supports
  if (window.chrome) root.classList.add('lg-refract');

  // Specular highlight follows the pointer across each glass surface
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.lg, .btn').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
    });
  }

  /* ---------- 3. Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
