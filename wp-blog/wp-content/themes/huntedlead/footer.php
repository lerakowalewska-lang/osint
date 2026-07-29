<?php if (!defined('ABSPATH')) exit; ?>
</div><!-- .content-wrapper -->

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-left">
      <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
        <div class="logo-icon"></div>
        HuntedLead
      </a>
      <p class="footer-copy">&copy; <?php echo esc_html(date('Y')); ?> HuntedLead. Все права защищены.</p>
    </div>
    <ul class="footer-links">
      <li><a href="<?php echo esc_url(home_url('/')); ?>">Главная</a></li>
      <li><a href="<?php echo esc_url(home_url('/outreach')); ?>">Аутрич</a></li>
      <li><a href="<?php echo esc_url(home_url('/#pricing')); ?>">Тарифы</a></li>
      <li><a href="<?php echo esc_url(home_url('/#contacts-info')); ?>">Контакты</a></li>
      <li><a href="#" onclick="openPrivacy(event)">Конфиденциальность</a></li>
      <li><a href="<?php echo esc_url(home_url('/blog')); ?>">Блог</a></li>
    </ul>
  </div>
</footer>

<div class="modal-overlay" id="privacyModal">
  <div class="modal-box">
    <h2>Политика конфиденциальности</h2>
    <p>Настоящая политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта HuntedLead.</p>
    <h3>1. Сбор данных</h3>
    <p>Мы собираем только те данные, которые вы предоставляете добровольно через форму заявки на сайте: имя и номер телефона.</p>
    <h3>2. Цели обработки</h3>
    <p>Персональные данные используются исключительно для связи с вами по вашему запросу и предоставления информации о наших услугах.</p>
    <h3>3. Хранение и защита</h3>
    <p>Мы принимаем необходимые организационные и технические меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
    <h3>4. Передача третьим лицам</h3>
    <p>Мы не передаём, не продаём и не раскрываем ваши персональные данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.</p>
    <h3>5. Срок хранения</h3>
    <p>Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, после чего удаляются.</p>
    <h3>6. Ваши права</h3>
    <p>Вы вправе запросить информацию о своих персональных данных, потребовать их изменения или удаления, направив соответствующий запрос на наш контактный email.</p>
    <h3>7. Файлы cookie</h3>
    <p>Сайт может использовать файлы cookie для улучшения пользовательского опыта. Вы можете отключить cookie в настройках браузера.</p>
    <button class="modal-close" onclick="closePrivacy()">Закрыть</button>
  </div>
</div>

<script>
// ===== 3D PARTICLE BACKGROUND =====
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], mouse = { x: -1000, y: -1000 };
  const PARTICLE_COUNT = 120;
  const CONNECT_DIST = 140;

  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, size: Math.random() * 2 + 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(59, 125, 255, 0.04)';
    ctx.lineWidth = 1;
    const gs = 60;
    for (let x = 0; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) { p.x += dx * 0.01; p.y += dy * 0.01; }
      const alpha = 0.15 + p.z * 0.4;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 125, 255, ${alpha})`; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const ddx = p.x - p2.x, ddy = p.y - p2.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < CONNECT_DIST) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(59, 125, 255, ${(1 - d / CONNECT_DIST) * 0.1})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize(); createParticles(); draw();
})();

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.blog-card').forEach(el => observer.observe(el));
</script>

<?php wp_footer(); ?>
</body>
</html>
