<?php 
/*
Template Name: Blocks
*/

get_header();

/**
 * Title: Blog Preview
 * Slug: starter/blog-preview
 * Categories: theme
 */

?>
<?php 
$args = array(
    'post_type' => 'webinars',
    'posts_per_page' => -1,
    'tax_query' => array(
        array(
            'taxonomy' => 'webinars-types',
            'field'    => 'slug',
            'terms'    => array( 'upcoming' )
        )
    )

);
$the_query = new WP_Query($args);
if($the_query->have_posts()):
?>
<section class="upcomingWebinars blogPreview">
    <div class="container">
        <div class="upcomingWebinars__tag">Upcoming Webinars</div>
        <div class="upcomingWebinars__list blogPreview__list">
            <?php while($the_query->have_posts()): $the_query->the_post(); ?>
                <div class="upcomingWebinars__listItem webinarsPreview__listItem">
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
</section>
<?php endif; ?>

<script src="<?php echo get_template_directory_uri(); ?>/js/webinars.js"></script>

<?php get_footer(); ?>