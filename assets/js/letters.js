// /assets/js/letters.js
// US Peptide Insider — Letter page behavior
// Per UPI_LETTER_01 §7

(function () {
  'use strict';

  const IG_HANDLE = 'HealthierLivingDaily';
  const IG_DEEPLINK = 'instagram://user?username=' + IG_HANDLE;
  const IG_WEB_URL = 'https://instagram.com/' + IG_HANDLE;
  const PAGE_URL = window.location.href;
  const PAGE_TITLE = document.title;

  function trackEvent(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  function getScrollPercent() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  }

  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function getLetterSlug() {
    const match = window.location.pathname.match(/\/letters\/([^\/]+?)(?:\.html)?$/);
    return match ? match[1] : 'unknown';
  }

  // ───── 1. Mobile nav toggle ─────
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
  }

  // ───── 2. Sticky header (hide on scroll down, show on scroll up) ─────
  const header = document.querySelector('.site-header');
  let lastScrollY = window.pageYOffset;
  if (header) {
    window.addEventListener('scroll', function () {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // ───── 3. Scroll depth tracking ─────
  const scrollThresholds = [25, 50, 75, 100];
  const scrollFired = {};
  const slug = getLetterSlug();

  function checkScrollDepth() {
    const percent = getScrollPercent();
    scrollThresholds.forEach(function (threshold) {
      if (percent >= threshold && !scrollFired[threshold]) {
        scrollFired[threshold] = true;
        trackEvent('scroll_depth', {
          letter_slug: slug,
          depth_percent: threshold
        });
      }
    });
  }
  window.addEventListener('scroll', checkScrollDepth, { passive: true });

  // ───── 4. Read complete (past P.S.) ─────
  const postscript = document.querySelector('.postscript');
  let readCompleteFired = false;
  if (postscript && 'IntersectionObserver' in window) {
    const psObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !readCompleteFired) {
          readCompleteFired = true;
          trackEvent('read_complete', { letter_slug: slug });
          psObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    psObserver.observe(postscript);
  }

  // ───── 5. Instagram deep-link on mobile ─────
  const followLinks = document.querySelectorAll('a[data-track="follow_initiated"]');
  followLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const placement = link.getAttribute('data-placement') || 'unknown';
      trackEvent('follow_initiated', {
        letter_slug: slug,
        placement: placement
      });

      if (isMobile()) {
        e.preventDefault();
        const fallbackTimeout = setTimeout(function () {
          window.location.href = IG_WEB_URL;
        }, 600);

        document.addEventListener('visibilitychange', function onHide() {
          if (document.hidden) {
            clearTimeout(fallbackTimeout);
            document.removeEventListener('visibilitychange', onHide);
          }
        });

        window.location.href = IG_DEEPLINK;
      }
    });
  });

  // ───── 6. Share bar ─────
  const copyBtn = document.querySelector('.share-btn--copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const originalText = copyBtn.textContent;
      const writeClipboard = function () {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(function () { copyBtn.textContent = originalText; }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PAGE_URL).then(writeClipboard);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = PAGE_URL;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        writeClipboard();
      }

      trackEvent('share_initiated', { letter_slug: slug, channel: 'copy_link' });
    });
  }

  const nativeBtn = document.querySelector('.share-btn--native');
  if (nativeBtn) {
    if (navigator.share) {
      nativeBtn.addEventListener('click', function () {
        navigator.share({ title: PAGE_TITLE, url: PAGE_URL })
          .then(function () { trackEvent('share_initiated', { letter_slug: slug, channel: 'native' }); })
          .catch(function () { /* user cancelled */ });
      });
    } else {
      if (nativeBtn.parentElement) nativeBtn.parentElement.style.display = 'none';
    }
  }

  document.querySelectorAll('.share-btn[data-channel]').forEach(function (btn) {
    if (btn.classList.contains('share-btn--copy') || btn.classList.contains('share-btn--native')) return;
    btn.addEventListener('click', function () {
      trackEvent('share_initiated', {
        letter_slug: slug,
        channel: btn.getAttribute('data-channel')
      });
    });
  });

  // ───── 7. Lateral link tracking ─────
  document.querySelectorAll('a[data-track="lateral_click"]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackEvent('lateral_click', {
        from_slug: link.getAttribute('data-from') || slug,
        to_slug: link.getAttribute('data-to') || 'unknown'
      });
    });
  });

  // ───── 8. CTA viewport tracking ─────
  const ctaCard = document.querySelector('.cta-card--instagram');
  if (ctaCard && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          trackEvent('follow_cta_view', {
            letter_slug: slug,
            placement: 'primary_cta'
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(ctaCard);
  }

  // ───── 9. Letter view event ─────
  if (window.location.pathname.indexOf('/letters/') === 0 || window.location.pathname.indexOf('/letters') === 0) {
    const meta = {
      letter_slug: slug,
      keyword_target: document.querySelector('meta[name="upi-keyword"]')?.content || '',
      cluster: document.querySelector('meta[name="upi-cluster"]')?.content || '',
      awareness_stage: document.querySelector('meta[name="upi-awareness"]')?.content || ''
    };
    trackEvent('letter_view', meta);
  }
})();

/* ───── Cookie consent (subtle, single decision) ───── */
(function () {
  if (typeof document === 'undefined') return;
  var key = 'upi-consent-v1';
  if (localStorage.getItem(key)) return;

  var bar = document.createElement('div');
  bar.className = 'cookie-consent';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Cookie notice');
  bar.innerHTML =
    '<div class="cookie-consent__inner">' +
      '<p class="cookie-consent__text">We use Google Analytics to understand which letters get read. No email collection, no advertising pixels. <a href="/privacy.html">Read our privacy policy</a>.</p>' +
      '<button type="button" class="cookie-consent__btn" data-cookie-accept>Got it</button>' +
    '</div>';
  document.body.appendChild(bar);
  requestAnimationFrame(function () { bar.classList.add('is-visible'); });

  bar.querySelector('[data-cookie-accept]').addEventListener('click', function () {
    localStorage.setItem(key, '1');
    bar.classList.remove('is-visible');
    setTimeout(function () { bar.remove(); }, 200);
  });
})();

/* ───── Cookie consent (subtle, single decision) ───── */
(function () {
  if (typeof document === 'undefined') return;
  var key = 'upi-consent-v1';
  if (localStorage.getItem(key)) return;

  var bar = document.createElement('div');
  bar.className = 'cookie-consent';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Cookie notice');
  bar.innerHTML =
    '<div class="cookie-consent__inner">' +
      '<p class="cookie-consent__text">We use Google Analytics to understand which letters get read. No email collection, no advertising pixels. <a href="/privacy.html">Read our privacy policy</a>.</p>' +
      '<button type="button" class="cookie-consent__btn" data-cookie-accept>Got it</button>' +
    '</div>';
  document.body.appendChild(bar);
  requestAnimationFrame(function () { bar.classList.add('is-visible'); });

  bar.querySelector('[data-cookie-accept]').addEventListener('click', function () {
    localStorage.setItem(key, '1');
    bar.classList.remove('is-visible');
    setTimeout(function () { bar.remove(); }, 200);
  });
})();
