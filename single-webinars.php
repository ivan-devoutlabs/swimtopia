<?php get_header(); ?>
<?php 
$times = get_field('times');
$previous_webinar = get_field('previous_webinar');
$register_btn = get_field('register_btn');
?>
<section class="webinarsHero">
    <div class="container">
        <div class="webinarsHero__contentWrapper">
            <h1 class="webinarsHero__title"><?php the_title(); ?></h1>
            <div class="webinarsHero__content">
                <div class="webinarsHero__text"><?php the_content(); ?></div>
                <div class="webinarsHero__contentInfo">
                    <?php if($times): ?>
                    <div class="webinarsHero__contentInfo__dates">
                        <div class="webinarsHero__contentInfo__datesTitle"><?php _e('Webinar Times', 'theme'); ?></div>
                        <div class="webinarsHero__contentInfo__datesContent"><?php echo $times; ?></div>
                        <?php if($register_btn): ?>
                        <div class="webinarsHero__contentInfo__register"><a href="<?php echo $register_btn['url']; ?>" class="wp-block-button__link"><?php echo $register_btn['title']; ?></a></div>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                    <div class="webinarsHero__contentInfo__previous">
                        <div class="webinarsHero__contentInfo__previousTitle">
                        Previously Recorded Webinar
                        </div>
                        <video src="<?php echo $previous_webinar['url']; ?>" id="player"></video>
                    </div>
                </div>
            </div>
        </div>
        <div class="wp-block-group ctaSimple__contentWrapper">
			<div class="wp-block-group ctaSimple__content">
				<h3 class="wp-block-heading ctaSimple__title"><?php _e('Share With a Friend', 'theme'); ?></h3>
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
    'post_type'      => 'webinars',
    'post_status'    => 'publish',
    'posts_per_page' => 6,
    'paged'          => max( 1, (int) $paged ),
    'tax_query'      => array(
        'relation' => 'AND',
        array(
            'taxonomy' => 'webinars-types',
            'field'    => 'slug',
            'terms'    => 'upcoming',
        ),
    ),
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

			<div class="wp-block-query webinarsPreview__query blogPreview__list">

                <?php while ( $query->have_posts() ) : $query->the_post(); ?>
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
                            </div>
                            <div class="webinarsPreview__listItem__title"><?php the_title(); ?></div>
                            
                            <div class="wp-block-group webinarsPreview__listItem__button">
                                <a class="wp-block-button__link" href="<?php the_permalink(); ?>">
                                    <?php esc_html_e( 'View Webinar', 'starter' ); ?>
                                </a>
                            </div>
                        </div>
                    </div>
                <?php endwhile; ?>
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