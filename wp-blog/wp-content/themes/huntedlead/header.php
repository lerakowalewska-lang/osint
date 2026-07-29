<?php if (!defined('ABSPATH')) exit; ?>
<!DOCTYPE html>
<html lang="ru" <?php language_attributes(); ?>>
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
      <ul class="nav-links" id="navLinks"></ul>
    </nav>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Меню">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="content-wrapper">
