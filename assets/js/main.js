// USPeptideInsider — minimal interactivity
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Number rolling for stat panel — runs once on first paint
  document.querySelectorAll('[data-count]').forEach((el) => {
    const final = parseFloat(el.dataset.count);
    if (Number.isNaN(final)) return;
    const dur = 900;
    const start = performance.now();
    const isInt = Number.isInteger(final);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = final * eased;
      el.textContent = isInt ? Math.round(v).toLocaleString() : v.toFixed(1);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
})();
