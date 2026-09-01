<?php

get_header();

$search_query = get_search_query();
$paged        = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
global $wp_query;
$query = $wp_query;
?>

<div class="wp-block-group alignfull headerBlock" style="background-image: url(<?php echo get_template_directory_uri(); ?>/assets/images/platform-bg.jpg)">
    <div class="wp-block-group container">
        <h1 class="wp-block-heading headerBlock__title"><?php
        printf(
            esc_html__( 'Search Results For %s', 'starter' ),
            esc_html( $search_query )
        );
        ?></h1>
        
        <div class="headerBlock__search">
            <?php get_search_form(); ?>
        </div>
    </div>
</div>

<div id="primary" class="site-main searchResults">
    <div class="container">

        <?php if ( ! $query->have_posts() ) : ?>

            <div class="searchResults__empty">
                <p><?php esc_html_e( 'Nothing found. Try different words or check your spelling.', 'starter' ); ?></p>
            </div>

        <?php else : ?>

            <section class="searchResults__group searchResults__group--post">

                <ul class="searchResults__list <?php echo esc_attr( starter_search_list_class( 'post' ) ); ?>">
                    <?php
                    while ( $query->have_posts() ) :
                        $query->the_post();
                        starter_search_card( 'post' );
                    endwhile;
                    ?>
                </ul>

                <?php
                $pagination_args = array(
                    'base'      => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
                    'format'    => '?paged=%#%',
                    'current'   => max( 1, $paged ),
                    'total'     => $query->max_num_pages,
                    'prev_text' => __( '&laquo; Prev', 'starter' ),
                    'next_text' => __( 'Next &raquo;', 'starter' ),
                    'type'      => 'list',
                );
                
                $pagination_links = paginate_links( $pagination_args );
                
                if ( $pagination_links ) :
                ?>
                    <nav class="searchResults__pagination" aria-label="<?php esc_attr_e( 'Search results pagination', 'starter' ); ?>">
                        <?php echo $pagination_links; ?>
                    </nav>
                <?php endif; ?>

            </section>

            <?php wp_reset_postdata(); ?>

        <?php endif; ?>

    </div>
</div>

<?php
get_footer();