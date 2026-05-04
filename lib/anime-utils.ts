/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    anime: any;
  }
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function afterPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export function waitForAnime(): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    if (window.anime?.animate) return resolve(window.anime);
    const check = setInterval(() => {
      if (window.anime?.animate) {
        clearInterval(check);
        resolve(window.anime);
      }
    }, 30);
    setTimeout(() => { clearInterval(check); resolve(null); }, 5000);
  });
}

export async function animateEntrance(selectors: {
  title?: string;
  subtitle?: string;
  cards?: string;
  sections?: string;
  listItems?: string;
}) {
  if (prefersReducedMotion()) return;
  const anime = await waitForAnime();
  if (!anime) return;
  await afterPaint();

  const { animate, stagger, spring } = anime;

  if (selectors.title) {
    const els = document.querySelectorAll(selectors.title);
    if (els.length) {
      els.forEach((el: any) => { el.style.opacity = '0'; el.style.transform = 'translateY(25px)'; });
      animate(selectors.title, {
        translateY: [25, 0],
        opacity: [0, 1],
        duration: 650,
        ease: 'outExpo',
      });
    }
  }

  if (selectors.subtitle) {
    const els = document.querySelectorAll(selectors.subtitle);
    if (els.length) {
      els.forEach((el: any) => { el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; });
      animate(selectors.subtitle, {
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 650,
        ease: 'outExpo',
        delay: 100,
      });
    }
  }

  if (selectors.cards) {
    const els = document.querySelectorAll(selectors.cards);
    if (els.length) {
      els.forEach((el: any) => { el.style.opacity = '0'; el.style.transform = 'translateY(45px) scale(0.96)'; });
      animate(selectors.cards, {
        translateY: [45, 0],
        scale: [0.96, 1],
        opacity: [0, 1],
        duration: 600,
        ease: spring({ stiffness: 180, damping: 16 }),
        delay: stagger(80, { start: 180 }),
      });
    }
  }

  if (selectors.sections) {
    const els = document.querySelectorAll(selectors.sections);
    if (els.length) {
      els.forEach((el: any) => { el.style.opacity = '0'; el.style.transform = 'translateY(35px)'; });
      animate(selectors.sections, {
        translateY: [35, 0],
        opacity: [0, 1],
        duration: 650,
        ease: 'outExpo',
        delay: stagger(130, { start: 300 }),
      });
    }
  }

  if (selectors.listItems) {
    const els = document.querySelectorAll(selectors.listItems);
    if (els.length) {
      els.forEach((el: any) => { el.style.opacity = '0'; el.style.transform = 'translateX(-20px)'; });
      animate(selectors.listItems, {
        translateX: [-20, 0],
        opacity: [0, 1],
        duration: 450,
        ease: 'outQuart',
        delay: stagger(50, { start: 200 }),
      });
    }
  }
}

export async function animateCounters(elements: { selector: string; target: number; prefix?: string; suffix?: string }[]) {
  if (prefersReducedMotion()) return;
  const anime = await waitForAnime();
  if (!anime) return;

  const { animate } = anime;

  elements.forEach(({ selector, target, prefix = '', suffix = '' }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const obj = { val: 0 };
    animate(obj, {
      val: target,
      duration: 1500,
      ease: 'outExpo',
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
      },
    });
  });
}

export async function animateScrollReveal(selector: string) {
  if (prefersReducedMotion()) return;
  const anime = await waitForAnime();
  if (!anime) return;

  const { animate } = anime;
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  elements.forEach((el: any) => { el.style.opacity = '0'; el.style.transform = 'translateY(50px)'; });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target, {
          translateY: [50, 0],
          opacity: [0, 1],
          duration: 700,
          ease: 'outQuart',
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((el) => observer.observe(el));
}

export async function animateHoverButtons(container?: string) {
  if (prefersReducedMotion()) return;
  const anime = await waitForAnime();
  if (!anime) return;

  const { animate, spring } = anime;
  const scope = container ? document.querySelector(container) : document;
  if (!scope) return;

  const buttons = scope.querySelectorAll('button:not([data-ah]):not(.sidebar-nav-item *)');
  buttons.forEach((btn) => {
    btn.setAttribute('data-ah', '1');
    btn.addEventListener('mouseenter', () => {
      animate(btn, { scale: 1.04, duration: 200, ease: spring({ stiffness: 400, damping: 12 }) });
    });
    btn.addEventListener('mouseleave', () => {
      animate(btn, { scale: 1, duration: 300, ease: 'outQuart' });
    });
  });
}

export async function animateLogin() {
  if (prefersReducedMotion()) return;
  const anime = await waitForAnime();
  if (!anime) return;
  await afterPaint();

  const { animate, stagger, spring } = anime;

  const hide = (sel: string, transform: string) => {
    document.querySelectorAll(sel).forEach((el: any) => {
      el.style.opacity = '0';
      el.style.transform = transform;
    });
  };

  hide('.login-logo', 'translateY(-15px)');
  hide('.login-hero-title', 'translateY(40px)');
  hide('.login-hero-subtitle', 'translateY(25px)');
  hide('.login-feature-pill', 'translateX(-30px)');
  hide('.login-form-field', 'translateY(25px)');
  hide('.login-footer', 'none');
  document.querySelectorAll('.login-footer').forEach((el: any) => { el.style.opacity = '0'; });

  animate('.login-logo', {
    translateY: [-15, 0],
    opacity: [0, 1],
    duration: 500,
    ease: 'outExpo',
  });

  animate('.login-hero-title', {
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 800,
    ease: 'outExpo',
    delay: 200,
  });

  animate('.login-hero-subtitle', {
    translateY: [25, 0],
    opacity: [0, 1],
    duration: 700,
    ease: 'outExpo',
    delay: 400,
  });

  animate('.login-feature-pill', {
    translateX: [-30, 0],
    opacity: [0, 1],
    duration: 500,
    ease: 'outQuart',
    delay: stagger(100, { start: 600 }),
  });

  animate('.login-form-field', {
    translateY: [25, 0],
    opacity: [0, 1],
    duration: 500,
    ease: spring({ stiffness: 200, damping: 18 }),
    delay: stagger(80, { start: 200 }),
  });

  animate('.login-footer', {
    opacity: [0, 1],
    duration: 800,
    ease: 'outQuart',
    delay: 1000,
  });
}

export async function animateSidebarNav() {
  if (prefersReducedMotion()) return;
  const anime = await waitForAnime();
  if (!anime) return;
  await afterPaint();

  const { animate, stagger } = anime;
  const els = document.querySelectorAll('.sidebar-nav-item');
  if (!els.length) return;

  els.forEach((el: any) => { el.style.opacity = '0'; el.style.transform = 'translateX(-15px)'; });

  animate('.sidebar-nav-item', {
    translateX: [-15, 0],
    opacity: [0, 1],
    duration: 400,
    ease: 'outQuart',
    delay: stagger(45, { start: 250 }),
  });
}
