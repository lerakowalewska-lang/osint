<?php if (!defined('ABSPATH')) exit; ?>
<?php get_header(); ?>

<div class="article-page">
  <div class="article-wrap">

    <?php while (have_posts()) : the_post(); $cats = get_the_category(); ?>

    <nav class="article-meta" aria-label="Хлебные крошки">
      <a href="<?php echo esc_url(home_url('/')); ?>">Главная</a><span class="sep">/</span>
      <a href="<?php echo esc_url(home_url('/blog')); ?>">Блог</a><span class="sep">/</span>
      <span><?php the_title(); ?></span>
    </nav>

    <article class="article-body">
      <?php if (!empty($cats)) : ?>
        <span class="article-tag"><?php echo esc_html($cats[0]->name); ?></span>
      <?php endif; ?>

      <h1><?php the_title(); ?></h1>

      <?php if (has_post_thumbnail()) : ?>
        <div class="article-cover">
          <?php the_post_thumbnail('large', ['alt' => esc_attr(get_the_title())]); ?>
        </div>
      <?php endif; ?>

      <?php the_content(); ?>

      <div class="article-cta">
        <h3>Нужна разведка по компаниям — легально</h3>
        <p>Мы работаем только с открытыми источниками и данными о юрлицах: находим ЛПР и верифицированные контакты под ваш B2B-продукт. Без серых зон.</p>
        <div class="article-cta-actions">
          <a href="<?php echo esc_url(home_url('/#contact')); ?>" class="btn-primary">Оставить заявку</a>
          <a href="<?php echo esc_url(home_url('/blog')); ?>" class="btn-secondary">Все статьи</a>
        </div>
      </div>
    </article>

    <?php endwhile; ?>

  </div>
</div>

<?php get_template_part('template-parts/cta-form', null, [
    'title'    => 'Сколько ЛПР найдём для вас?',
    'subtitle' => 'Расскажите, кого ищете. Мы посмотрим, сколько контактов сможем найти и за какое время.',
]); ?>

<?php get_footer(); ?>
