<?php
$title    = $attributes['title'] ?? __( 'Previous Webinars', 'starter' );
$per_page = (int) ( $attributes['perPage'] ?? STARTER_WEBINARS_PER_PAGE );

$selected = starter_webinars_current_categories();
$paged = isset( $_GET['paged'] ) ? absint( $_GET['paged'] ) : 1;

$args = starter_webinars_query_args( $selected, $paged );
$args['posts_per_page'] = max( 1, $per_page );

$query = new WP_Query( $args );

$terms = get_terms( array(
    'taxonomy'   => 'webinars-categories',
    'hide_empty' => true,
) );

if ( is_wp_error( $terms ) ) { $terms = array(); }

$base_url = home_url( add_query_arg( array(), $GLOBALS['wp']->request ) );
$base_url = remove_query_arg( array( 'cats', 'paged' ), $base_url );
?>

<section <?php echo get_block_wrapper_attributes( array( 'class' => 'blog webinars' ) ); ?> data-webinars-filter>
    <div class="container">
        <div class="blog__top">
            <?php if ( $title ) : ?>
                <h2 class="blog__title"><?php echo esc_html( $title ); ?></h2>
            <?php endif; ?>

            <div class="blog__filterWrapper">
                <div class="blog__filterActive">
                    <?php foreach ( $selected as $term_slug ) : ?>
                        <?php 
                        $term = get_term_by( 'slug', $term_slug, 'webinars-categories' ); 
                        ?>
                        <?php if ( $term && ! is_wp_error( $term ) ) : ?>
                            <div class="blog__filterActive__item" data-term="<?php echo esc_attr( $term_slug ); ?>">
                                <button type="button" class="blog__filterActive__itemRemove" aria-label="<?php echo esc_attr( sprintf( __( 'Remove Filter «%s»', 'starter' ), $term->name ) ); ?>"></button>
                                <span class="blog__filterActive__itemLabel"><?php echo esc_html( $term->name ); ?></span>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>

                <div class="blog__filterList__wrapper">
                    <div class="blog__filterList__top">
                        <button type="button" class="blog__filterList__toggle" aria-expanded="false">
                            <?php esc_html_e( 'Browse By Topic', 'starter' ); ?>
                        </button>
                        <button type="button" class="blog__filterList__clear">
                            <?php esc_html_e( 'Clear Filters', 'starter' ); ?>
                        </button>
                    </div>

                    <div class="blog__filterList">
                        <?php foreach ( $terms as $term ) : ?>
                            <?php
                            $is_active = in_array( $term->slug, $selected, true );
                            $next = $is_active ? array_diff( $selected, array( $term->slug ) ) : array_merge( $selected, array( $term->slug ) );
                            $href = $next ? add_query_arg( 'cats', implode( ',', $next ), $base_url ) : $base_url;
                            ?>
                            <a class="blog__filterList__item<?php echo $is_active ? ' is-active' : ''; ?>" href="<?php echo esc_url( $href ); ?>" data-term="<?php echo esc_attr( $term->slug ); ?>" aria-pressed="<?php echo $is_active ? 'true' : 'false'; ?>">
                                <?php echo esc_html( $term->name ); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>

        <ul class="blog__list" aria-live="polite" aria-busy="false">
            <?php starter_webinars_render_list( $query ); ?>
        </ul>

        <div class="blog__pagination">
            <?php starter_webinars_render_pagination( $query, $paged ); ?>
        </div>
    </div>
</section>