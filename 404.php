<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package Starter
 */

get_header();
?>

<section class="errorPage">
    <div class="errorPage__bg">
        <video src="<?php echo get_template_directory_uri(); ?>/assets/videos/404-bg-video.webm" muted autoplay loop></video>
    </div>
    <div class="container">
        <div class="errorPage__tag">404 Error</div>
        <h1 class="errorPage__title">Opps, Did you Drop something in the pool?</h1>
        <div class="errorPage__text">The page you are looking for doesn’t exist. But as a wise fish once told us...</div>
        <div class="errorPage__button style-2"><a href="<?php echo get_home_url(  ); ?>" class="wp-block-button__link">Just Keep Swimming</a></div>
    </div>
</section>

<?php get_footer(); ?>