<?php 
define( 'THEME_WEBINARS_PER_PAGE', 9 );

function starter_webinars_query_args( $categories = array(), $paged = 1 ) {
    $args = array(
        'post_type'      => 'webinars',
        'post_status'    => 'publish',
        'posts_per_page' => THEME_WEBINARS_PER_PAGE,
        'paged'          => max( 1, (int) $paged ),
        'tax_query'      => array(
            'relation' => 'AND',
            array(
                'taxonomy' => 'webinars-types',
                'field'    => 'slug',
                'terms'    => 'previous',
            ),
        ),
    );

    $categories = array_filter( array_map( 'sanitize_title', (array) $categories ) );
    
    if ( $categories ) {
        $args['tax_query'] = array(
            'relation' => 'AND',
            array(
                'taxonomy' => 'webinars-types',
                'field'    => 'slug',
                'terms'    => 'previous',
            ),
            array(
                'taxonomy' => 'webinars-categories',
                'field'    => 'slug',
                'terms'    => $categories,
                'operator' => 'IN',
            ),
        );
    }
    return $args;
}

function starter_webinars_render_list( WP_Query $query ) {
    if ( ! $query->have_posts() ) {
        echo '<p class="blog__empty">' . esc_html__( 'Nothing found for the selected filters.', 'starter' ) . '</p>';
        return;
    }

    while ( $query->have_posts() ) : $query->the_post();
        ?>
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
				
                <div class="blogPreview__listItem__button">
					<a class="wp-block-button__link wp-block-read-more" href="<?php the_permalink(); ?>" target="_self"><?php esc_html_e( 'View Blog', 'starter' ); ?></a>
				</div>
			</div>
		</div>
        <?php
    endwhile;
    wp_reset_postdata();
}

function starter_webinars_render_pagination( WP_Query $query, $paged = 1 ) {
    if ( $query->max_num_pages < 2 ) { return; }
    echo paginate_links( array(
        'total'     => $query->max_num_pages,
        'current'   => max( 1, (int) $paged ),
        'type'      => 'list',
        'prev_text' => esc_html__( 'Previous', 'starter' ),
        'next_text' => esc_html__( 'Next', 'starter' ),
        'base'      => add_query_arg( 'paged', '%#%' ),
        'format'    => '',
    ) );
}

function starter_webinars_current_categories() {
    $raw = isset( $_GET['cats'] ) ? sanitize_text_field( wp_unslash( $_GET['cats'] ) ) : '';
    if ( ! $raw ) { return array(); }
    
    return array_values( array_filter( array_map( 'sanitize_title', explode( ',', $raw ) ) ) );
}

function starter_webinars_filter_ajax() {
    check_ajax_referer( 'starter_webinars_filter', 'nonce' );
    
    $categories = isset( $_POST['cats'] )
        ? array_filter( array_map( 'sanitize_title', explode( ',', sanitize_text_field( wp_unslash( $_POST['cats'] ) ) ) ) )
        : array();
        
    $paged = isset( $_POST['paged'] ) ? absint( $_POST['paged'] ) : 1;

    $query = new WP_Query( starter_webinars_query_args( $categories, $paged ) );

    ob_start();
    starter_webinars_render_list( $query );
    $list = ob_get_clean();

    ob_start();
    starter_webinars_render_pagination( $query, $paged );
    $pagination = ob_get_clean();

    wp_send_json_success( array(
        'list'       => $list,
        'pagination' => $pagination,
        'found'      => (int) $query->found_posts,
    ) );
}
add_action( 'wp_ajax_starter_webinars_filter', 'starter_webinars_filter_ajax' );
add_action( 'wp_ajax_nopriv_starter_webinars_filter', 'starter_webinars_filter_ajax' );

function starter_webinars_filter_assets() {
    $path = get_theme_file_path( '/js/webinars-filter.js' );
    if ( ! file_exists( $path ) ) { return; }

    wp_enqueue_script(
        'starter-webinars-filter',
        get_theme_file_uri( '/js/webinars-filter.js' ),
        array('jquery'),
        filemtime( $path ),
        array( 'strategy' => 'defer', 'in_footer' => true )
    );

    wp_add_inline_script(
        'starter-webinars-filter',
        'window.starterWebinarsFilter = ' . wp_json_encode( array(
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'starter_webinars_filter' ),
        ) ) . ';',
        'before'
    );
}
add_action( 'wp_enqueue_scripts', 'starter_webinars_filter_assets' );

function starter_register_webinars_block() {
    $dir = get_theme_file_path( '/blocks/webinars-filter' );
    if ( ! file_exists( $dir . '/block.json' ) ) { return; }

    $script_path = get_theme_file_path( '/js/webinars-filter-block.js' );
    $script_uri  = get_theme_file_uri( '/js/webinars-filter-block.js' );
    
    $args = array();
    if ( file_exists( $script_path ) ) {
        wp_register_script(
            'webinars-filter-block',
            $script_uri,
            array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-server-side-render', 'wp-i18n' ),
            filemtime( $script_path ),
            true
        );
        $args['editor_script'] = 'webinars-filter-block';
        wp_enqueue_script('webinars-filter-block');
    }
    register_block_type( $dir, $args );
}
add_action( 'init', 'starter_register_webinars_block' );