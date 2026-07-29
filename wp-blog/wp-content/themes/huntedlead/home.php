<?php if (!defined('ABSPATH')) exit; ?>
<?php get_header(); ?>

<?php
$posts_page_id = (int) get_option('page_for_posts');
$posts_page    = $posts_page_id ? get_post($posts_page_id) : null;
$hero_title    = $posts_page ? get_the_title($posts_page) : 'Блог';
$hero_sub      = $posts_page && $posts_page->post_excerpt
    ? $posts_page->post_excerpt
    : 'Разбираем, как находить клиентов через открытые источники, выстраивать холодные коммуникации и вести маркетинговый ресерч — без воды, на практике.';
?>

<section class="hero blog-hero" id="hero">
  <div class="hero-badge">
    <span class="dot"></span>
    HUNTEDLEAD BLOG
  </div>
  <h1><?php echo wp_kses_post($hero_title); ?></h1>
  <p class="hero-sub"><?php echo esc_html($hero_sub); ?></p>
</section>

<section class="blog-section">
  <div class="blog-content">
    <div class="section-tag">Статьи</div>
    <h2 class="section-title">Свежие материалы</h2>

    <?php if (have_posts()) : ?>
      <div class="blog-grid">
        <?php $i = 0; while (have_posts()) : the_post(); $delay = ($i % 3) * 100; $i++; $cats = get_the_category(); ?>
          <a href="<?php the_permalink(); ?>" class="blog-card" data-delay="<?php echo esc_attr($delay); ?>">
            <div class="blog-card-cover">
              <?php if (has_post_thumbnail()) : ?>
                <?php the_post_thumbnail('large', ['loading' => 'lazy', 'alt' => esc_attr(get_the_title())]); ?>
              <?php else : ?>
                <img src="<?php echo esc_url(home_url('/images/blog/blog-hero.jpg')); ?>" alt="<?php the_title_attribute(); ?>" loading="lazy" width="1200" height="675">
              <?php endif; ?>
            </div>
            <div class="blog-card-body">
              <?php if (!empty($cats)) : ?>
                <span class="blog-card-tag"><?php echo esc_html($cats[0]->name); ?></span>
              <?php endif; ?>
              <h3 class="blog-card-title"><?php the_title(); ?></h3>
              <p class="blog-card-desc"><?php echo esc_html(wp_trim_words(get_the_excerpt(), 20)); ?></p>
              <span class="blog-card-more">Читать →</span>
            </div>
          </a>
        <?php endwhile; ?>
      </div>

      <div class="blog-pagination">
        <?php echo paginate_links([
            'prev_text' => '← Раньше',
            'next_text' => 'Позже →',
        ]); ?>
      </div>

    <?php else : ?>
      <p>Пока нет опубликованных статей.</p>
    <?php endif; ?>
  </div>
</section>

<?php get_template_part('template-parts/cta-form', null, [
    'title'    => 'Найдём для вас клиентов через OSINT',
    'subtitle' => 'Расскажите, кого ищете. Мы посмотрим, сколько ЛПР сможем найти и за какое время.',
]); ?>

<?php get_footer(); ?>
