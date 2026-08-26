<?php
/**
 * Одиночний запис.
 *
 * @package Starter
 */

get_header();
?>

<section class="postHero">
	<div class="container">
		<div class="postHero__contentWrapper">
			<div class="postHero__content">
				<h1 class="postHero__title"><?php the_title(); ?></h1>
				<div class="postHero__bottom">
					<div class="postHero__cat"><?php echo get_the_term_list( get_the_ID(), 'category', '', ', ' ); ?></div>
					<div class="postHero__time"><?php echo esc_html( reading_time_label() ); ?></div>
				</div>
			</div>
			<div class="postHero__image"><img src="<?php echo get_the_post_thumbnail_url(); ?>" alt=""></div>
		</div>
	</div>
</section>
<section class="postContent">
	<div class="container">
		<?php the_content(); ?>
			<div class="wp-block-group ctaSimple__contentWrapper">
				<div class="wp-block-group ctaSimple__content">
					<h3 class="wp-block-heading ctaSimple__title">Not Seeing Your Category?</h3>
				</div>
				<div class="wp-block-buttons ctaSimple__button style-2">
					<div class="footer__topLeft__socialList">
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/link-icon.svg'); ?></a>
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector-3.svg'); ?></a>
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector.svg'); ?></a>
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector-2.svg'); ?></a>
					</div>
				</div>
			</div>
	</div>
</section>
<?php 
$args = array(
	'post_type' => 'post',
	'posts_per_page' => 9,
);
$the_query = new WP_Query($args);
if($the_query->have_posts()):
?>
<div class="wp-block-group alignfull blogPreview has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
	<div class="wp-block-group container is-layout-flow wp-block-group-is-layout-flow">
		<div class="wp-block-group blogPreview__content is-layout-flow wp-block-group-is-layout-flow">
			<div class="wp-block-group blogPreview__top is-layout-flow wp-block-group-is-layout-flow">
				<h2 class="wp-block-heading blogPreview__title">Making waves and news</h2>

				<div class="wp-block-buttons blogPreview__button is-layout-flex wp-block-buttons-is-layout-flex">
					<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">View Our Blog</a>
					</div>
				</div>
			</div>



			<div class="wp-block-query blogPreview__query is-layout-flow wp-block-query-is-layout-flow">
				<div class="blogPreview__viewport" tabindex="0" role="region" aria-label="Записи блогу">
					<ul class="blogPreview__list wp-block-post-template is-layout-flow wp-block-post-template-is-layout-flow is-track"
						style="transform: translate3d(0px, 0px, 0px);">
						<?php while($the_query->have_posts()): $the_query->the_post(); ?>
						<li
							class="wp-block-post post-179 post type-post status-publish format-standard has-post-thumbnail hentry category-category">

							<div
								class="wp-block-group blogPreview__listItem is-layout-flow wp-block-group-is-layout-flow">
								<figure class="blogPreview__listItem__image wp-block-post-featured-image"><a
										href="<?php the_permalink(); ?>"
										target="_self"><img src="<?php echo get_the_post_thumbnail_url(); ?>" ></a></figure>


								<div
									class="wp-block-group blogPreview__listItem__content is-layout-flow wp-block-group-is-layout-flow">
									<div
										class="wp-block-group blogPreview__listItem__top is-layout-flow wp-block-group-is-layout-flow">
										<div class="taxonomy-category blogPreview__listItem__tag wp-block-post-terms"><a
												href="http://localhost:8888/swimtopia/category/category/"
												rel="tag"><?php echo get_the_term_list( get_the_ID(), 'category', '', ', ' ); ?></a></div>

										<div class="blogPreview__listItem__time"><?php echo esc_html( reading_time_label() ); ?></div>
									</div>


									<h3 class="blogPreview__listItem__title wp-block-post-title"><a
											href="<?php the_permalink(); ?>"
											target="_self"><?php the_title(); ?></a></h3>

									<a class="blogPreview__listItem__button wp-block-read-more" href="<?php the_permalink(); ?>" target="_self">View Blog</a>
								</div>
							</div>

						</li>
						<?php endwhile; ?>
					</ul>
				</div>

			</div>
		</div>
	</div>
</div>
<?php endif; ?>
<?php
get_footer();