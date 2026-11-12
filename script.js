/* =====================================================================
   Portfolio interactions (vanilla JS, no dependencies)
   1. Copy buttons
   2. Footer year
   3. Case studies: click a screenshot to enlarge it
   ===================================================================== */

(function () {

  /* ---------- 1. Copy buttons ---------- */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    let timer;
    btn.addEventListener('click', function () {
      const text = btn.dataset.copy;
      const done = function () {
        btn.textContent = 'Copied';
        btn.dataset.state = 'done';
        clearTimeout(timer);
        timer = setTimeout(function () { btn.textContent = 'Copy'; delete btn.dataset.state; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  /* ---------- Singapore clock in the hero frame ---------- */
  const clock = document.querySelector('.sg-clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = function () {
      const now = new Date();
      clock.textContent = 'SGT ' + fmt.format(now);
      clock.dateTime = now.toISOString();
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- 2. Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 3. Screenshot lightbox ---------- */
  // Clicking a screenshot (.shot img) opens it full size in a <dialog> with
  // its caption. Click anywhere or press Escape to close.
  const shots = document.querySelectorAll('.figure img');
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
        boxImg.src = img.dataset.full || img.currentSrc || img.src;
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
