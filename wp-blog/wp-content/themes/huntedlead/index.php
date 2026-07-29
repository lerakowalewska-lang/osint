<?php if (!defined('ABSPATH')) exit; ?>
<?php get_header(); ?>

<div class="article-page">
  <div class="article-wrap">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <article class="article-body">
        <h1><a href="<?php the_permalink(); ?>" style="color:inherit;text-decoration:none;"><?php the_title(); ?></a></h1>
        <?php the_excerpt(); ?>
      </article>
    <?php endwhile; else : ?>
      <p>Ничего не найдено.</p>
    <?php endif; ?>
  </div>
</div>

<?php get_footer(); ?>
