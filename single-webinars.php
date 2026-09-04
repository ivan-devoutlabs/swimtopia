<?php get_header(); ?>
<?php 
$types = get_the_terms( $post->ID, 'webinars-types' ); 
$webinarsTypes = '';
foreach($types as $term) {
    $webinarsTypes .= $term->slug;
}


?>
<?php 
$single_post_cta_title = get_field('single_post_cta_title', 'options');
$single_post_cta_text = get_field('single_post_cta_text', 'options');
if($webinarsTypes == 'upcoming'): 
$times = get_field('times');
$previous_webinar = get_field('previous_webinar');
$register_btn = get_field('register_btn');

?>
<section class="webinarsHero">
    <div class="container">
        <div class="webinarsHero__contentWrapper">
            <div class="webinarsHero__top">
                <h1 class="webinarsHero__title"><?php the_title(); ?></h1>
            </div>
            <div class="webinarsHero__content">
                <div class="webinarsHero__text"><?php the_content(); ?></div>
                <div class="webinarsHero__contentInfo">
                    <div class="webinarsHero__contentInfo__dates">
                        <?php if($times): ?>
                        <div class="webinarsHero__contentInfo__datesTitle"><?php _e('Webinar Times', 'theme'); ?></div>
                        <div class="webinarsHero__contentInfo__datesContent"><?php echo $times; ?></div>
                        <?php endif; ?>
                        <?php starter_webinar_form( $register_btn ); ?>
                    </div>
                    <div class="webinarsHero__contentInfo__previous">
                        <div class="webinarsHero__contentInfo__previousTitle">
                            Previously Recorded Webinar
                        </div>
                        
                        <?php 
                        $video_url = is_array($previous_webinar) && isset($previous_webinar['url']) ? $previous_webinar['url'] : $previous_webinar;

                        if ( $video_url ) :
                            $is_external = preg_match('/(youtube\.com|youtu\.be|vimeo\.com)/i', $video_url);

                            if ( $is_external ) : ?>
                                
                                <div class="plyr__video-embed" id="player">
                                    <?php echo wp_oembed_get( $video_url ); ?>
                                </div>

                            <?php else : ?>
                                
                                <video id="player" playsinline controls>
                                    <source src="<?php echo esc_url($video_url); ?>" type="video/mp4" />
                                </video>

                            <?php endif; 
                        endif; ?>
                    </div>
                </div>
            </div>
        </div>
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

						<button type="button" class="footer__topLeft__socialList__item share-copy" aria-label="Copy link" title="Copy link">
							<?php echo str_replace('<svg', '<svg aria-hidden="true" focusable="false"', file_get_contents(get_template_directory() . '/assets/images/Vector-2.svg')); ?>
						</button>
					</nav>
				</div>
			</div>
    </div>
</section>
<?php elseif($webinarsTypes == 'previous'):
$webinar_video = get_field('webinar_video');
$video_duration = get_field('video_duration');
?>
    <section class="webinarsHero previous">
        <div class="container">
            <div class="webinarsHero__contentWrapper">
                <div class="webinarsHero__top">
                    <div class="webinarsHero__date"><?php echo get_the_date('m-d-y'); ?></div>
                    <h1 class="webinarsHero__title"><?php the_title(); ?></h1>
                    <?php if ( ! empty( $video_duration ) ): ?>
                        <div class="webinarsHero__time"><?php echo esc_html( $video_duration ); ?></div>
                    <?php endif; ?>
                </div>
                <div class="webinarsHero__content">
                    <div class="webinarsHero__video">
                        <?php 
                        $video_url = is_array($webinar_video) && isset($webinar_video['url']) ? $webinar_video['url'] : $webinar_video;

                        if ( $video_url ) :
                            $is_external = preg_match('/(youtube\.com|youtu\.be|vimeo\.com)/i', $video_url);

                            if ( $is_external ) : ?>
                                
                                <div class="plyr__video-embed" id="player">
                                    <?php echo wp_oembed_get( $video_url ); ?>
                                </div>

                            <?php else : ?>
                                
                                <video id="player" playsinline controls>
                                    <source src="<?php echo esc_url($video_url); ?>" type="video/mp4" />
                                </video>

                            <?php endif; 
                        endif; ?>
                    </div>
                    <div class="webinarsHero__text"><?php the_content(); ?></div>
                </div>
            </div>
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
<?php endif; ?>
<?php 

$args = array(
    'post_type'      => 'webinars',
    'post_status'    => 'publish',
    'posts_per_page' => 6,
    'paged'          => max( 1, (int) $paged ),
);


$query = new WP_Query($args);
if ( $query->have_posts() ) {
?>
<div class="wp-block-group alignfull webinarsPreview blogPreview">

    <div class="wp-block-group container">

        <div class="wp-block-group webinarsPreview__content">
            
            <div class="webinarsPreview__top">
                <h2 class="wp-block-heading webinarsPreview__title">Binge Watcher?</h2>
                <div class="webinarsPreview__button"><a href="#" class="wp-block-button__link">View All</a></div>
            </div>

            <div class="wp-block-query webinarsPreview__query">
                <div class="webinarsPreview__viewport blogPreview__viewport swiper" tabindex="0" role="region" aria-label="<?php esc_attr_e( 'Webinars', 'starter' ); ?>">
                    <ul class="webinarsPreview__list blogPreview__list swiper-wrapper">

                        <?php while ( $query->have_posts() ) : $query->the_post(); ?>
                            <li class="webinarsPreview__slide swiper-slide">
                                <div class="wp-block-group webinarsPreview__listItem">
                                    <?php if ( has_post_thumbnail() ) : ?>
                                        <figure class="webinarsPreview__listItem__image">
                                            <a href="<?php the_permalink(); ?>">
                                                <?php the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); ?>
                                            </a>
                                        </figure>
                                    <?php endif; ?>
                                    <div class="wp-block-group webinarsPreview__listItem__content">
                                        <div class="wp-block-group webinarsPreview__listItem__top">
                                            <div class="webinarsPreview__listItem__cat">
                                                <?php echo get_the_term_list( get_the_ID(), 'webinars-categories', '', ', ' ); ?>
                                            </div>
                                            <div class="webinarsPreview__listItem__date"><?php echo get_the_date('d/m/y'); ?></div>
                                            <?php $video_duration = get_field('video_duration');
                                            if($video_duration): ?>
                                            <div class="webinarsPreview__listItem__time">
                                                <?php echo esc_html( $video_duration ); ?>
                                            </div>
                                            <?php endif; ?>
                                        </div>
                                        <div class="webinarsPreview__listItem__title"><?php the_title(); ?></div>
                                        
                                        <div class="wp-block-group webinarsPreview__listItem__button">
                                            <a class="wp-block-button__link" href="<?php the_permalink(); ?>">
                                                <?php esc_html_e( 'View Webinar', 'starter' ); ?>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        <?php endwhile; ?>

                    </ul>
                </div>
            </div>

            <div class="webinarsPreview__arrows blogPreview__arrows">
                <button class="webinarsPreview__arrow webinarsPreview__arrow--prev blogPreview__arrow blogPreview__arrow--prev" aria-label="<?php esc_attr_e( 'Previous', 'starter' ); ?>"></button>
                <button class="webinarsPreview__arrow webinarsPreview__arrow--next blogPreview__arrow blogPreview__arrow--next" aria-label="<?php esc_attr_e( 'Next', 'starter' ); ?>"></button>
            </div>

        </div>

    </div>

</div>
<?php 
}
?>

<?php get_footer(); ?>

<script>
  const player = new Plyr('#player');
</script>