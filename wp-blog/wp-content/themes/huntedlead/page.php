<?php if (!defined('ABSPATH')) exit; ?>
<?php get_header(); ?>

<div class="article-page">
  <div class="article-wrap">
    <?php while (have_posts()) : the_post(); ?>
      <article class="article-body">
        <h1><?php the_title(); ?></h1>
        <?php the_content(); ?>
      </article>
    <?php endwhile; ?>
  </div>
</div>

<?php get_footer(); ?>
