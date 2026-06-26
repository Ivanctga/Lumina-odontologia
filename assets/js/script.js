/* ============================================================
   LUMINA ODONTOLOGIA PREMIUM — script.js
   Vanilla JS | Interactions, Animations & Validation
============================================================ */

'use strict';

/* ============================================================
   1. BACK TO TOP BUTTON
============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ============================================================
   2. STICKY HEADER
============================================================ */
(function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ============================================================
   3. ACTIVE NAV LINK (highlight based on scroll position)
============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
})();


/* ============================================================
   4. MOBILE MENU
============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const open = () => {
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Staggered links animation
    const links = navMenu.querySelectorAll('.nav-link');
    links.forEach((link, i) => {
      link.style.transitionDelay = `${0.1 + (i * 0.05)}s`;
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    });
  };

  const close = () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    
    // Reset links
    const links = navMenu.querySelectorAll('.nav-link');
    links.forEach((link) => {
      link.style.transitionDelay = '0s';
      if (window.innerWidth <= 768) {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
      }
    });
  };

  hamburger.addEventListener('click', () => {
    navMenu.classList.contains('open') ? close() : open();
  });

  overlay.addEventListener('click', close);

  // Close on nav link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Keyboard ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  
  // Handle resize to reset link styles
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const links = navMenu.querySelectorAll('.nav-link');
      links.forEach(link => {
        link.style.opacity = '';
        link.style.transform = '';
        link.style.transitionDelay = '';
      });
    }
  });
})();


/* ============================================================
   5. SMOOTH SCROLL
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const headerHeight = document.getElementById('header')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   6. SCROLL REVEAL
============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   7. COUNTER ANIMATION (Stats Section)
============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOut(progress) * target);
      el.textContent = current.toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('pt-BR');
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();




/* ============================================================
   9. CONTACT FORM VALIDATION
============================================================ */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  const fields = {
    nome:     { el: document.getElementById('nome'),     err: document.getElementById('erroNome'),     validate: v => v.trim().length >= 3 ? '' : 'Por favor, informe seu nome completo.' },
    telefone: { el: document.getElementById('telefone'), err: document.getElementById('erroTelefone'), validate: v => /^[\d\s\(\)\-\+]{10,}$/.test(v) ? '' : 'Informe um telefone válido.' },
    email:    { el: document.getElementById('email'),    err: document.getElementById('erroEmail'),    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Informe um e-mail válido.' }
  };

  // Phone mask
  const telEl = document.getElementById('telefone');
  if (telEl) {
    telEl.addEventListener('input', () => {
      let v = telEl.value.replace(/\D/g, '').substring(0, 11);
      if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d*)/, '($1) $2');
      }
      telEl.value = v;
    });
  }

  // Validate individual field
  function validateField(key) {
    const field = fields[key];
    if (!field.el || !field.err) return true;
    const err = field.validate(field.el.value);
    field.err.textContent = err;
    field.el.classList.toggle('error', !!err);
    return !err;
  }

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    const el = fields[key].el;
    if (el) {
      el.addEventListener('blur', () => validateField(key));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(key);
      });
    }
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const valid = Object.keys(fields).map(k => validateField(k)).every(Boolean);

    if (!valid) {
      // Focus first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate async submission
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (success) {
        success.style.display = 'flex';
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { success.style.display = 'none'; }, 6000);
      }
    }, 1800);
  });
})();


/* ============================================================
   10. PARALLAX — subtle hero bg movement
============================================================ */
(function initParallax() {
  const circles = document.querySelectorAll('.hero-circle');
  if (!circles.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        circles.forEach((c, i) => {
          const speed = (i + 1) * 0.15;
          c.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ============================================================
   11. MAGNETIC BUTTONS & RIPPLE
============================================================ */
(function initMagneticRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    // Magnetic Effect
    btn.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px) translateY(-2px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });

    // Ripple Effect
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.35);
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;

      if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `@keyframes rippleAnim { to { transform: scale(3); opacity: 0; } }`;
        document.head.appendChild(style);
      }

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();


/* ============================================================
   12. CARD TILT EFFECT (subtle 3D on service cards)
============================================================ */
(function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  document.querySelectorAll('.servico-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ============================================================
   13. SCROLL PROGRESS INDICATOR (thin line at top)
============================================================ */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #2563EB, #10B981);
    width: 0%;
    z-index: 9998;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
})();


/* ============================================================
   14. LAZY LOAD IMAGES (future-proof)
============================================================ */
(function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    images.forEach(img => obs.observe(img));
  } else {
    images.forEach(img => { img.src = img.dataset.src; });
  }
})();
