<?php
if (!defined('ABSPATH')) exit;

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'script', 'style']);
    add_theme_support('automatic-feed-links');
});

add_action('wp_enqueue_scripts', function () {
    // Тот же гугл-фонт, что и на статических страницах сайта
    wp_enqueue_style(
        'huntedlead-fonts',
        'https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
        [],
        null
    );

    // Общий styles/main.css с основного сайта — единый источник правды для дизайна
    wp_enqueue_style('huntedlead-main', home_url('/styles/main.css'), [], '20260624');

    // Собственные правки темы (только то, чего нет в main.css: gutenberg-контент, пагинация)
    wp_enqueue_style('huntedlead-theme', get_stylesheet_uri(), ['huntedlead-main'], wp_get_theme()->get('Version'));

    // Общая логика сайта: бургер-меню/дропдауны/навигация и форма заявки
    wp_enqueue_script('huntedlead-nav', home_url('/nav.js'), [], null, ['strategy' => 'defer', 'in_footer' => false]);
    wp_enqueue_script('huntedlead-form', home_url('/form.js'), [], null, ['strategy' => 'defer', 'in_footer' => false]);

    // Стандартные стили блок-редактора конфликтуют с сайтовой дизайн-системой — отключаем
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('classic-theme-styles');
    wp_dequeue_style('global-styles');
});

// Служебные метатеги, которых нет на остальном сайте — убираем для единообразия <head>
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
