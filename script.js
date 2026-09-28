/* =====================================================================
   Portfolio interactions (vanilla JS, no dependencies)
   1. Theme toggle (dark default, remembered in localStorage)
   2. Highlight the nav link for the section on screen
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

  /* ---------- 2. Active nav link ---------- */
  const links = document.querySelectorAll('.nav-links a');
  const sections = Array.from(links)
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' }); // fires when a section crosses the middle of the screen
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- 3. Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
