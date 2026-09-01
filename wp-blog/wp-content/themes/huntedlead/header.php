<?php if (!defined('ABSPATH')) exit; ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="shortcut icon" href="<?php echo esc_url(home_url('/favicon.ico')); ?>">
<link rel="icon" type="image/x-icon" href="<?php echo esc_url(home_url('/favicon.ico')); ?>">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url(home_url('/favicon-32x32.png')); ?>">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo esc_url(home_url('/favicon-16x16.png')); ?>">
<link rel="icon" type="image/svg+xml" href="<?php echo esc_url(home_url('/favicon.svg')); ?>">
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url(home_url('/apple-touch-icon.png')); ?>">

<!-- Яндекс Метрика -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
   ym(108561966, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
</script>

<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<noscript><div><img src="https://mc.yandex.ru/watch/108561966" style="position:absolute; left:-9999px;" alt=""/></div></noscript>

<canvas id="bg-canvas"></canvas>

<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
      <div class="logo-icon"></div>
      HuntedLead
    </a>
    <nav>
      <?php
      // Навигация отдаётся в разметке, а не собирается nav.js: краулерам (в первую
      // очередь Яндексу) JS-меню видно плохо, а это единственные ссылки на нишевые
      // страницы. Якоря ведут на главную — на страницах блога этих секций нет.
      $hl_home = esc_url(home_url('/'));
      $hl_niches = [
          '/industry-it' => 'IT и SaaS',
          '/industry-manufacturing' => 'Производствам',
          '/industry-distributors' => 'Дистрибьюторам',
          '/industry-consulting' => 'Консалтинг',
          '/industry-hrtech' => 'HR-tech',
          '/industry-logistics' => 'Логистика и ВЭД',
      ];
      ?>
      <ul class="nav-links" id="navLinks">
        <li><a href="<?php echo $hl_home; ?>#how">Как работаем</a></li>
        <li><a href="<?php echo esc_url(home_url('/outreach')); ?>">Аутрич</a></li>
        <li class="nav-dropdown">
          <button class="nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">
            Ниши
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <ul class="nav-dropdown-menu" role="menu">
            <?php foreach ($hl_niches as $hl_path => $hl_label) : ?>
            <li role="none"><a href="<?php echo esc_url(home_url($hl_path)); ?>" role="menuitem"><?php echo esc_html($hl_label); ?></a></li>
            <?php endforeach; ?>
          </ul>
        </li>
        <li><a href="<?php echo esc_url(home_url('/blog')); ?>"<?php echo (is_home() || is_singular('post')) ? ' aria-current="page"' : ''; ?>>Блог</a></li>
        <li><a href="<?php echo $hl_home; ?>#faq">Вопросы</a></li>
        <li><a href="<?php echo $hl_home; ?>#pricing">Тарифы</a></li>
        <li><a href="<?php echo $hl_home; ?>#contact" class="nav-cta">Оставить заявку</a></li>
      </ul>
    </nav>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Меню">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="content-wrapper">
