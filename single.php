<?php
get_header();
?>

<section class="postHero">
	<div class="container">
		<div class="postHero__contentWrapper">
			<div class="postHero__content">
				<h1 class="postHero__title"><?php the_title(); ?></h1>
				<div class="postHero__bottom">
					<!-- <div class="postHero__cat"><?php //echo get_the_term_list( get_the_ID(), 'category', '', ', ' ); ?></div> -->
					<div class="postHero__time"><?php echo esc_html( reading_time_label() ); ?></div>
				</div>
			</div>
			<div class="postHero__image"><img src="<?php echo get_the_post_thumbnail_url(); ?>" alt=""></div>
		</div>
	</div>
</section>
<?php 
$single_post_cta_title = get_field('single_post_cta_title', 'options');
$single_post_cta_text = get_field('single_post_cta_text', 'options');
?>
<section class="postContent">
	<div class="container">
		<?php the_content(); ?>
			<div class="wp-block-group ctaSimple__contentWrapper">
				<div class="wp-block-group ctaSimple__content">
					<?php if($single_post_cta_title): ?>
					<h3 class="wp-block-heading ctaSimple__title"><?php echo esc_html($single_post_cta_title); ?></h3>
					<?php endif; ?>
					<?php if($single_post_cta_text): ?>
					<p class="ctaSimple__text"><?php echo esc_html($single_post_cta_text); ?></p>
					<?php endif; ?>
				</div>
				<div class="wp-block-buttons ctaSimple__button style-2">
					<nav class="footer__topLeft__socialList" aria-label="Share this post">
						<button type="button" class="footer__topLeft__socialList__item share-copy" aria-label="Copy link" title="Copy link">
							<?php echo str_replace('<svg', '<svg aria-hidden="true" focusable="false"', file_get_contents(get_template_directory() . '/assets/images/link-icon.svg')); ?>
						</button>

						<a href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo urlencode( get_permalink() ); ?>" class="footer__topLeft__socialList__item" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn (opens in a new tab)" title="Share on LinkedIn">
							<?php echo str_replace('<svg', '<svg aria-hidden="true" focusable="false"', file_get_contents(get_template_directory() . '/assets/images/Vector-3.svg')); ?>
						</a>

						<a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode( get_permalink() ); ?>" class="footer__topLeft__socialList__item" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook (opens in a new tab)" title="Share on Facebook">
							<?php echo str_replace('<svg', '<svg aria-hidden="true" focusable="false"', file_get_contents(get_template_directory() . '/assets/images/Vector.svg')); ?>
						</a>
					</nav>
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
				<h2 class="wp-block-heading blogPreview__title">Making Waves And News</h2>

				<div class="wp-block-buttons blogPreview__button is-layout-flex wp-block-buttons-is-layout-flex">
					<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">View Our Blog</a>
					</div>
				</div>
			</div>



			<div class="wp-block-query blogPreview__query is-layout-flow wp-block-query-is-layout-flow">
				<div class="blogPreview__viewport swiper" tabindex="0" role="region" aria-label="Записи блогу">
					<ul class="blogPreview__list wp-block-post-template is-layout-flow wp-block-post-template-is-layout-flow is-track swiper-wrapper"
						style="transform: translate3d(0px, 0px, 0px);">
						<?php while($the_query->have_posts()): $the_query->the_post(); ?>
						<li
							class="wp-block-post post-179 post type-post status-publish format-standard has-post-thumbnail hentry category-category swiper-slide">

							<div
								class="wp-block-group blogPreview__listItem is-layout-flow wp-block-group-is-layout-flow">
								<figure class="blogPreview__listItem__image wp-block-post-featured-image"><a
										href="<?php the_permalink(); ?>"
										target="_self"><img src="<?php echo get_the_post_thumbnail_url(); ?>" ></a></figure>


								<div
									class="wp-block-group blogPreview__listItem__content is-layout-flow wp-block-group-is-layout-flow">
									<div
										class="wp-block-group blogPreview__listItem__top is-layout-flow wp-block-group-is-layout-flow">
										<?php if(!empty(get_the_term_list( get_the_ID(), 'category', '', ', ' ))): ?>

										<div class="taxonomy-category blogPreview__listItem__tag wp-block-post-terms"><a
												href="http://localhost:8888/swimtopia/category/category/"
												rel="tag"><?php echo get_the_term_list( get_the_ID(), 'category', '', ', ' ); ?></a></div>
										<?php endif; ?>

										<div class="blogPreview__listItem__time"><?php echo esc_html( reading_time_label() ); ?></div>
									</div>


									<h3 class="blogPreview__listItem__title wp-block-post-title"><a
											href="<?php the_permalink(); ?>"
											target="_self"><?php the_title(); ?></a></h3>
									<div class="blogPreview__listItem__button">
										<a class="wp-block-button__link wp-block-read-more" href="<?php the_permalink(); ?>" target="_self">View Blog</a>
									</div>
								</div>
							</div>

						</li>
						<?php endwhile; ?>
					</ul>
				</div>

			</div>
			<div class="blogPreview__arrows">
                <button class="blogPreview__arrow blogPreview__arrow--prev" aria-label="Previous"></button>
                <button class="blogPreview__arrow blogPreview__arrow--next" aria-label="Next"></button>
            </div>
		</div>
	</div>
</div>
<?php endif; ?>
<?php
get_footer();