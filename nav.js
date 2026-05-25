(function () {
  const isHome =
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname === '';

  const hasServices = !!document.getElementById('services');

  // Fix logo href on non-home pages
  const logoEl = document.querySelector('a.logo');
  if (logoEl && !isHome) logoEl.setAttribute('href', '/');

  const ul = document.getElementById('navLinks');
  if (!ul) return;

  const items = [
    { href: '#how', text: 'Как работаем' },
    ...(hasServices ? [{ href: '#services', text: 'Услуги' }] : []),
    {
      type: 'dropdown',
      text: 'Ниши',
      children: [
        { href: '/industry-it', text: 'IT и SaaS' },
        { href: '/industry-manufacturing', text: 'Производствам' },
        { href: '/industry-distributors', text: 'Дистрибьюторам' },
        { href: '/industry-consulting', text: 'Консалтинг' },
        { href: '/industry-hrtech', text: 'HR-tech' },
        { href: '/industry-logistics', text: 'Логистика и ВЭД' },
      ],
    },
    { href: '#faq', text: 'Вопросы' },
    { href: '#pricing', text: 'Тарифы' },
    { href: '#contact', text: 'Оставить заявку', cls: 'nav-cta' },
  ];

  ul.innerHTML = items
    .map((item) => {
      if (item.type === 'dropdown') {
        return `<li class="nav-dropdown">
  <button class="nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">
    ${item.text}
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
  </button>
  <ul class="nav-dropdown-menu" role="menu">
    ${item.children
      .map(
        (c) =>
          `<li role="none"><a href="${c.href}" role="menuitem">${c.text}</a></li>`
      )
      .join('')}
  </ul>
</li>`;
      }
      return `<li><a href="${item.href}"${item.cls ? ` class="${item.cls}"` : ''}>${item.text}</a></li>`;
    })
    .join('');

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
