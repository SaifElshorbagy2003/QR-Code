/* =========================================================
   app.js  –  Zaem El Helw Menu
   Handles: language switching, category filter, scroll-top
   ========================================================= */

let currentLang = localStorage.getItem('lang') || 'ar';

// ── apply language ──────────────────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  const t = translations[lang];
  const isAr = lang === 'ar';

  // html direction & lang attr
  document.documentElement.lang = lang;
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

  // page title
  document.title = t.pageTitle;

  // all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // currency suffix on prices  (::after content via CSS var)
  document.documentElement.style.setProperty(
    '--currency-label',
    `" ${t.currency}"`
  );

  // lang buttons active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // scroll-top button tooltip
  if (scrollTopBtn) scrollTopBtn.title = t.scrollTop;

  // font: Poppins for EN, Cairo for AR
  document.body.style.fontFamily = isAr
    ? "'Cairo', sans-serif"
    : "'Poppins', 'Cairo', sans-serif";
}

// ── language switcher buttons ───────────────────────────────
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// ── category filter ─────────────────────────────────────────
const catBtns  = document.querySelectorAll('.cat-btn');
const menuSecs = document.querySelectorAll('.menu-sec');

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.cat;

    menuSecs.forEach(sec => {
      const show = cat === 'all' || sec.dataset.cat === cat;
      if (show) {
        sec.style.display  = 'block';
        sec.style.opacity  = '0';
        sec.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => {
          sec.style.transition = 'opacity .35s, transform .35s';
          sec.style.opacity    = '1';
          sec.style.transform  = 'translateY(0)';
        });
      } else {
        sec.style.display = 'none';
      }
    });

    if (cat !== 'all') {
      const first = document.querySelector(`.menu-sec[data-cat="${cat}"]`);
      if (first) setTimeout(() =>
        first.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  });
});

// ── scroll-to-top button ────────────────────────────────────
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id        = 'scrollTopBtn';
scrollTopBtn.innerHTML = '&#8679;';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 300);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── items fade-in on scroll ─────────────────────────────────
const items = document.querySelectorAll('.item');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateX(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

items.forEach(item => {
  item.style.opacity    = '0';
  item.style.transform  = 'translateX(20px)';
  item.style.transition = 'opacity .4s ease, transform .4s ease';
  observer.observe(item);
});

// ── init ────────────────────────────────────────────────────
applyLang(currentLang);
