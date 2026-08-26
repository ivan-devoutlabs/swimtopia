<?php


get_header();

$posts_results = array();
$webinars_results = array();
$other_results = array();

if ( have_posts() ) {
    while ( have_posts() ) {
        the_post();
        
        $post_type = get_post_type();
        
        if ( 'post' === $post_type ) {
            $posts_results[] = get_post();
        } elseif ( 'webinars' === $post_type ) {
            $webinars_results[] = get_post();
        } else {
            $other_results[] = get_post();
        }
    }
}
?>

<main class="site-main search-results">
    <div class="container">
        
        <header class="search-header">
            <h1 class="search-title">
                <?php
                printf( esc_html__( 'Search Results for: %s', 'starter' ), '<span>' . get_search_query() . '</span>' );
                ?>
            </h1>
        </header>

        <?php if ( ! empty( $posts_results ) || ! empty( $webinars_results ) || ! empty( $other_results ) ) : ?>

            <?php 
            if ( ! empty( $posts_results ) ) : ?>
                <section class="search-section search-section-posts">
                    <h2 class="search-section-title"><?php esc_html_e( 'Articles', 'starter' ); ?></h2>
                    <ul class="blog__list">
                        <?php foreach ( $posts_results as $post ) : setup_postdata( $post ); ?>
                            <li <?php post_class( 'blogPreview__listItem' ); ?>>
                                <?php if ( has_post_thumbnail() ) : ?>
                                    <figure class="blogPreview__listItem__image">
                                        <a href="<?php the_permalink(); ?>">
                                            <?php the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); ?>
                                        </a>
                                    </figure>
                                <?php endif; ?>

                                <div class="blogPreview__listItem__content">
                                    <div class="blogPreview__listItem__top">
                                        <div class="blogPreview__listItem__tag">
                                            <?php echo get_the_term_list( get_the_ID(), 'category', '', ', ' );  ?>
                                        </div>
                                        <div class="blogPreview__listItem__time">
                                            <?php 
                                            if ( function_exists('reading_time_label') ) {
                                                echo esc_html( reading_time_label() ); 
                                            }
                                            ?>
                                        </div>
                                    </div>

                                    <h3 class="blogPreview__listItem__title">
                                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                    </h3>

                                    <a class="blogPreview__listItem__button" href="<?php the_permalink(); ?>">
                                        <?php esc_html_e( 'View Blog', 'starter' ); ?>
                                    </a>
                                </div>
                            </li>
                        <?php endforeach; wp_reset_postdata(); ?>
                    </ul>
                </section>
            <?php endif; ?>


            <?php 
            if ( ! empty( $webinars_results ) ) : ?>
                <section class="search-section search-section-webinars">
                    <h2 class="search-section-title"><?php esc_html_e( 'Webinars', 'starter' ); ?></h2>
                    <ul class="blog__list webinars__list">
                        <?php foreach ( $webinars_results as $post ) : setup_postdata( $post ); ?>
                            <li <?php post_class( 'wp-block-post' ); ?>>
                                <div class="wp-block-group upcomingWebinars__listItem webinarsPreview__listItem is-layout-flow wp-block-group-is-layout-flow">
                                    
                                    <?php if ( has_post_thumbnail() ) : ?>
                                        <figure class="webinarsPreview__listItem__image wp-block-post-featured-image">
                                            <a href="<?php the_permalink(); ?>" target="_self">
                                                <?php the_post_thumbnail( 'post-thumbnail', array( 'loading' => 'lazy', 'style' => 'object-fit:cover;' ) ); ?>
                                            </a>
                                        </figure>
                                    <?php endif; ?>

                                    <div class="wp-block-group webinarsPreview__listItem__content is-layout-flow wp-block-group-is-layout-flow">
                                        <div class="wp-block-group webinarsPreview__listItem__top is-layout-flow wp-block-group-is-layout-flow">
                                            <div class="taxonomy-webinars-categories webinarsPreview__listItem__cat wp-block-post-terms">
                                                <?php echo get_the_term_list( get_the_ID(), 'webinars-categories', '', ', ' ); // phpcs:ignore ?>
                                            </div>
                                            <div class="webinarsPreview__listItem__date wp-block-post-date">
                                                <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date('d/m/y'); ?></time>
                                            </div>
                                        </div>
                                        
                                        <h3 class="webinarsPreview__listItem__title wp-block-post-title">
                                            <a href="<?php the_permalink(); ?>" target="_self"><?php the_title(); ?></a>
                                        </h3>
                                        
                                        <div class="wp-block-group webinarsPreview__listItem__button is-layout-flow wp-block-group-is-layout-flow">
                                            <a class="wp-block-button__link wp-block-read-more" href="<?php the_permalink(); ?>" target="_self">
                                                <?php esc_html_e( 'View Webinar', 'starter' ); ?>
                                                <span class="screen-reader-text">: <?php the_title(); ?></span>
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </li>
                        <?php endforeach; wp_reset_postdata(); ?>
                    </ul>
                </section>
            <?php endif; ?>


            <?php 
            if ( ! empty( $other_results ) ) : ?>
                <section class="search-section search-section-other">
                    <h2 class="search-section-title"><?php esc_html_e( 'Pages', 'starter' ); ?></h2>
                    <ul class="other-results-list">
                        <?php foreach ( $other_results as $post ) : setup_postdata( $post ); ?>
                            <li>
                                <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                                <p><?php echo wp_trim_words( get_the_excerpt(), 20 ); ?></p>
                            </li>
                        <?php endforeach; wp_reset_postdata(); ?>
                    </ul>
                </section>
            <?php endif; ?>

            <?php
            the_posts_pagination(
                array(
                    'prev_text' => esc_html__( 'Previous', 'starter' ),
                    'next_text' => esc_html__( 'Next', 'starter' ),
                )
            );
            ?>

        <?php else : ?>

            <p class="search-no-results">
                <?php esc_html_e( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'starter' ); ?>
            </p>
            <?php get_search_form(); ?>

        <?php endif; ?>

    </div>
</main>

<?php
get_footer();