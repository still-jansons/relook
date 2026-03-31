const WEB3FORMS_KEY = '9e682884-15ee-48d3-af6f-997fb59b3ba9';

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar overlay ─────────────────────────────────────────────────────────

  const menu = document.getElementById('menu');
  if (menu) {
    const navbar = menu.closest('.navbar');

    menu.addEventListener('show.bs.collapse', (e) => {
      if (e.target !== menu) return;
      navbar.classList.remove('overlay-closing');
      navbar.classList.add('overlay-open');
      document.body.style.overflow = 'hidden';
    });

    menu.addEventListener('hide.bs.collapse', (e) => {
      if (e.target !== menu) return;
      navbar.classList.add('overlay-closing');
      navbar.classList.remove('overlay-open');
      document.body.style.overflow = '';
    });

    menu.addEventListener('hidden.bs.collapse', (e) => {
      if (e.target !== menu) return;
      navbar.classList.remove('overlay-closing');
    });

    // Close overlay when an anchor nav link is clicked
    menu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        bootstrap.Collapse.getInstance(menu)?.hide();
      });
    });
  }

  // ── Hero button: clear animation after entrance so hover works ─────────────
  document.querySelectorAll('#hero .btn-primary').forEach(btn => {
    btn.addEventListener('animationend', () => {
      btn.style.animation = 'none';
    }, { once: true });
  });

  // ── Scroll reveal ───────────────────────────────────────────────────────────

  // Single elements — reveal individually
  const singleSelectors = [
    '.section-label',
    'section h2',
    'section h3',
    '.contact-form',
    '.section-subtitle',
  ];

  // Groups — siblings within the same parent get staggered delays
  const staggerSelectors = [
    '.profile-card',
    '#services .col-12',
    '.stat-card',
    '.price-card',
    '.testimonial-card',
    '.client-logos-grid img',
    '#benefits ul li',
  ];

  singleSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      // Skip anything already inside #hero (handled by CSS keyframes)
      if (!el.closest('#hero')) {
        el.dataset.reveal = '';
      }
    });
  });

  // ── Stagger delay between siblings — matches --reveal-stagger in CSS ──────
  const STAGGER_STEP = 0.12; // seconds — change here and in --reveal-stagger
  const STAGGER_MAX  = 0.36; // cap so last item doesn't wait too long

  staggerSelectors.forEach(sel => {
    // Group by parent so each row/list staggers independently
    const groups = new Map();
    document.querySelectorAll(sel).forEach(el => {
      if (el.closest('#hero')) return;
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    groups.forEach(children => {
      children.forEach((el, i) => {
        el.dataset.reveal = '';
        el.style.animationDelay = Math.min(i * STAGGER_STEP, STAGGER_MAX) + 's';
      });
    });
  });

  // Observe all marked elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      observer.unobserve(el);

      // After the animation finishes, strip reveal attributes so the element
      // returns to its natural CSS state — hover transitions work normally again
      el.addEventListener('animationend', () => {
        delete el.dataset.reveal;
        el.classList.remove('is-visible');
        el.style.animationDelay = '';
      }, { once: true });
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  const form = document.getElementById('contact-form');
  if (form) {
    const isEnglish = document.documentElement.lang === 'en';
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorEl = document.getElementById('form-error');
    const successEl = document.getElementById('form-success');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;

      const formData = new FormData(form);
      formData.append('access_key', WEB3FORMS_KEY);

      const originalText = submitBtn.textContent;
      submitBtn.textContent = isEnglish ? 'Sending...' : 'Sūta...';
      submitBtn.disabled = true;
      submitBtn.classList.add('btn--sending');

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          form.hidden = true;
          if (successEl) successEl.hidden = false;
        } else {
          if (errorEl) {
            const errorMessage = isEnglish ? 'Something went wrong. Please try again later.' : 'Kaut kas nogāja greizi. Lūdzu, mēģiniet vēlreiz vēlāk.';
            errorEl.textContent = data.message || errorMessage;
            errorEl.hidden = false;
          }
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn--sending');
        }
      } catch {
        if (errorEl) errorEl.hidden = false;
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn--sending');
      }
    });
  }
});