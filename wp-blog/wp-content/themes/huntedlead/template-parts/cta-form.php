<?php
if (!defined('ABSPATH')) exit;
/** @var array $args ['title' => string, 'subtitle' => string] */
$title    = isset($args['title']) ? $args['title'] : 'Найдём для вас клиентов через OSINT';
$subtitle = isset($args['subtitle']) ? $args['subtitle'] : 'Расскажите, кого ищете. Мы посмотрим, сколько ЛПР сможем найти и за какое время.';
?>
<section class="cta-section" id="contact">
  <div class="cta-content">
    <div class="section-tag">Заявка</div>
    <h2 class="section-title"><?php echo wp_kses_post($title); ?></h2>
    <p class="cta-subtitle"><?php echo wp_kses_post($subtitle); ?></p>
    <div id="formContainer">
      <div class="cta-form" id="leadForm">
        <div class="form-group">
          <input type="text" id="userName" placeholder="Ваше имя" required autocomplete="name">
        </div>
        <div class="form-group">
          <input type="tel" id="userPhone" placeholder="+7 (___) ___-__-__" required autocomplete="tel">
        </div>
        <div class="form-submit">
          <button class="btn-primary" onclick="submitForm()" id="submitBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Оставить заявку
          </button>
        </div>
        <div class="form-error" id="formError">Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами напрямую.</div>
        <p class="form-note">Нажимая кнопку, вы соглашаетесь с&nbsp;<a href="#" onclick="openPrivacy(event)">политикой конфиденциальности</a></p>
      </div>
      <div class="form-success" id="formSuccess">
        <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h3>Заявка отправлена!</h3>
        <p>Мы свяжемся с вами в ближайшее время</p>
      </div>
    </div>
  </div>
</section>
