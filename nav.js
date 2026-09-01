(function () {
  // Меню отдаётся в разметке (index.html, industry-*.html, outreach.html и
  // header.php темы блога). Здесь остаётся только поведение: дропдаун, бургер,
  // залипающая шапка и плавный скролл по якорям.
  const ul = document.getElementById('navLinks');
  if (!ul) return;

  // ===== DROPDOWN TOGGLE =====
  ul.querySelectorAll('.nav-dropdown-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.closest('.nav-dropdown');
      const isOpen = dropdown.classList.contains('open');

      // close all
      ul.querySelectorAll('.nav-dropdown').forEach((d) => {
        d.classList.remove('open');
        d.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => {
    ul.querySelectorAll('.nav-dropdown').forEach((d) => {
      d.classList.remove('open');
      d.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
    });
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ul.querySelectorAll('.nav-dropdown').forEach((d) => {
        d.classList.remove('open');
        d.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ===== MOBILE TOGGLE =====
  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      ul.classList.toggle('mobile-open');
    });
  }

  // ===== HEADER SCROLL =====
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ===== SMOOTH SCROLL for anchor links =====
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      ul.classList.remove('mobile-open');
    }
  });
})();
