/**
 * Smooth Water Flow & Blue Water Ripple Effect Controller
 * Spawns organic concentric blue water ripples on click/tap and hover,
 * tracking cursor water disturbances with zero text blurring or card tilting.
 */

export function initLiquidGlass() {
  if (typeof window === 'undefined') return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activeCards = new Set();
  let rafId = null;

  const ALLOWED_CARD_SELECTORS = [
    '.today-card',
    '.personal-card',
    '.community-card',
    '.qotd-panel',
    '.leaderboard-panel'
  ];
  const ALLOWED_CARD_MATCH_QUERY = ALLOWED_CARD_SELECTORS.join(', ');

  function isAllowedRippleCard(el) {
    return Boolean(el && typeof el.matches === 'function' && el.matches(ALLOWED_CARD_MATCH_QUERY));
  }

  function spawnBlueRipple(card, x, y) {
    if (prefersReduced) return;

    // Primary ripple ring
    const ripple = document.createElement('span');
    ripple.className = 'blue-water-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Secondary concentric ring for realistic water droplet physics
    const ring = document.createElement('span');
    ring.className = 'blue-water-ripple secondary-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;

    card.appendChild(ripple);
    card.appendChild(ring);

    setTimeout(() => {
      ripple.remove();
      ring.remove();
    }, 1100);
  }

  function handlePointerMove(e) {
    if (prefersReduced) return;
    const card = e.currentTarget;
    if (card._waterRaf) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    card._waterRaf = requestAnimationFrame(() => {
      card._waterRaf = null;
      if (!card.isConnected) return;
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

      card.style.setProperty('--water-x', `${xPercent.toFixed(1)}%`);
      card.style.setProperty('--water-y', `${yPercent.toFixed(1)}%`);
    });
  }

  function handlePointerEnter(e) {
    const card = e.currentTarget;
    card.classList.add('water-active');
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnBlueRipple(card, x, y);
  }

  function handlePointerLeave(e) {
    const card = e.currentTarget;
    card.classList.remove('water-active');
  }

  function handlePointerDown(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnBlueRipple(card, x, y);
  }

  function bindCard(card) {
    if (!card || !isAllowedRippleCard(card)) {
      if (card && card.classList) {
        card.classList.remove('water-glass-card', 'water-active');
      }
      return;
    }
    if (!card.classList.contains('water-glass-card')) {
      card.classList.add('water-glass-card');
    }
    if (activeCards.has(card)) return;
    activeCards.add(card);

    card.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    card.addEventListener('pointermove', handlePointerMove, { passive: true });
    card.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    card.addEventListener('pointerdown', handlePointerDown, { passive: true });
  }

  function unbindCard(card) {
    if (!card) return;
    if (card._waterRaf) {
      cancelAnimationFrame(card._waterRaf);
      card._waterRaf = null;
    }
    card.classList.remove('water-glass-card', 'water-active');
    card.querySelectorAll('.blue-water-ripple').forEach((r) => r.remove());
    if (!activeCards.has(card)) return;
    activeCards.delete(card);
    card.removeEventListener('pointerenter', handlePointerEnter);
    card.removeEventListener('pointermove', handlePointerMove);
    card.removeEventListener('pointerleave', handlePointerLeave);
    card.removeEventListener('pointerdown', handlePointerDown);
  }

  function handleRippleHostDown(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnBlueRipple(el, x, y);
  }

  function bindRippleHost(el) {
    if (!el) return;
    if (!el.classList.contains('water-ripple-host')) {
      el.classList.add('water-ripple-host');
    }
    if (activeCards.has(el)) return;
    activeCards.add(el);
    el.addEventListener('pointerdown', handleRippleHostDown, { passive: true });
  }

  function unbindRippleHost(el) {
    if (!el || !activeCards.has(el)) return;
    activeCards.delete(el);
    el.removeEventListener('pointerdown', handleRippleHostDown);
  }

  function scanAndBind() {
    activeCards.forEach((el) => {
      if (!el.isConnected || (!isAllowedRippleCard(el) && !el.classList.contains('water-ripple-host'))) {
        unbindCard(el);
        unbindRippleHost(el);
      }
    });

    // Strip water-glass-card from any elements that are not in the allowed cards list
    document.querySelectorAll('.water-glass-card').forEach((el) => {
      if (!isAllowedRippleCard(el)) {
        unbindCard(el);
      }
    });

    ALLOWED_CARD_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach(bindCard);
    });

    const rippleSelectors = [
      '.button-dark',
      '.button-primary'
    ];
    document.querySelectorAll(rippleSelectors.join(', ')).forEach(bindRippleHost);
  }

  scanAndBind();

  const observer = new MutationObserver(() => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(scanAndBind);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
    activeCards.forEach((el) => {
      unbindCard(el);
      unbindRippleHost(el);
    });
  };
}
