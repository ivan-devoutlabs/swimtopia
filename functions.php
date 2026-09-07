<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'THEME_VERSION', '7.0.41' );
define( 'THEME_DIR', get_template_directory() );
define( 'THEME_URI', get_template_directory_uri() );

require THEME_DIR . '/inc/setup.php';
require THEME_DIR . '/inc/enqueue.php'; 
require THEME_DIR . '/inc/blocks.php'; 
require THEME_DIR . '/inc/block-styles.php';
require THEME_DIR . '/inc/block-patterns.php';
require THEME_DIR . '/inc/template-tags.php';
require THEME_DIR . '/inc/template-functions.php';
require THEME_DIR . '/inc/customizer.php';
// require THEME_DIR . '/inc/class-mega-menu-walker.php';
require THEME_DIR . '/inc/cta.php';
require THEME_DIR . '/inc/features.php';
require THEME_DIR . '/inc/mega-menu.php';
require THEME_DIR . '/inc/image-sizes.php';
require THEME_DIR . '/inc/post-types.php';
require THEME_DIR . '/inc/reading-time.php';
require THEME_DIR . '/inc/blog-filter.php';
require THEME_DIR . '/inc/webinars-list.php';
require THEME_DIR . '/inc/search.php';
require THEME_DIR . '/inc/footer.php';
require THEME_DIR . '/inc/webinar-duration.php';
require THEME_DIR . '/inc/synced-patterns.php';
require THEME_DIR . '/inc/webinar-form.php';
require THEME_DIR . '/inc/marquee-block.php';




function mytheme_register_block_styles() {
    register_block_style(
        'theme/cards-simple', 
        array(
            'name'  => 'layout-grid-cards',
            'label' => __( 'Grid Cards Layout', 'mytheme' ),
            'is_default' => false,
        )
    );
    
    register_block_style(
        'theme/cards-simple',
        array(
            'name'  => 'layout-list-view',
            'label' => __( 'List View Layout', 'mytheme' ),
        )
    );
}
add_action( 'init', 'mytheme_register_block_styles' );


function image_size_styles() {
	return apply_filters(
		'image_size_styles',
		array(
			'size-s'  => __( 'Image S', 'swimtopia' ),
			'size-m'  => __( 'Image M', 'swimtopia' ),
			'size-l'  => __( 'Image L', 'swimtopia' ),
			'size-xl' => __( 'Image XL', 'swimtopia' ),
		)
	);
}

function register_image_size_styles() {
 
	foreach ( image_size_styles() as $name => $label ) {
		register_block_style(
			'core/image',
			array(
				'name'  => $name,
				'label' => $label,
			)
		);
	}
}
add_action( 'init', 'register_image_size_styles' );


add_action( 'init', 'register_member_position_block' );
function register_member_position_block() {

	wp_register_script(
        'member-position-editor-script',
        get_template_directory_uri() . '/js/member-position-block.js',
        array( 'wp-blocks', 'wp-element', 'wp-block-editor' ),
        filemtime( get_template_directory() . '/js/member-position-block.js' )
    );
    register_block_type( 'theme/member-position', array(
        'api_version'     => 3,
        'title'           => 'Team Member Position',
        'icon'            => 'id-alt',
        'category'        => 'theme',
        'uses_context'    => array( 'postId' ),
		'editor_script' => 'member-position-editor-script',
        'render_callback' => 'render_member_position_block'
    ) );
}

function render_member_position_block( $attributes, $content, $block ) {
    $post_id = isset( $block->context['postId'] ) ? $block->context['postId'] : get_the_ID();
    
    if ( ! $post_id ) {
        return '';
    }

    $position = get_post_meta( $post_id, 'member_position', true );
    
    if ( empty( $position ) ) {
        return '';
    }

    return '<div class="team__listItem__position">' . esc_html( $position ) . '</div>';
}


add_action('acf/init', 'my_acf_init');
function my_acf_init() {

    if (function_exists('acf_add_options_sub_page')) {

        acf_add_options_page(
            array(
                'page_title' => __('General options'),
                'menu_title' => __('General options'),
                'menu_slug' => 'theme-general-settings',
                'capability' => 'edit_posts',
                'redirect' => false
            )
        );

    }
}


function get_video_duration( $attachment_id ) {
    if ( ! $attachment_id ) {
        return '';
    }

    $meta = wp_get_attachment_metadata( $attachment_id );

    if ( empty( $meta['length'] ) ) {
        return '';
    }

    $total_seconds = (int) $meta['length'];
    $hours         = (int) floor( $total_seconds / 3600 );
    $minutes       = (int) floor( ( $total_seconds % 3600 ) / 60 );

    $formatted_time = '';

    if ( $hours > 0 ) {
        $formatted_time .= $hours . 'hr ';
    }

    if ( $minutes > 0 ) {
        $formatted_time .= $minutes . 'min';
    }

    if ( $hours === 0 && $minutes === 0 && $total_seconds > 0 ) {
        $formatted_time = $total_seconds . 'sec';
    }

    return trim( $formatted_time );
}


add_action('init', function() {
    unregister_taxonomy_for_object_type('post_tag', 'post');
});


add_action( 'template_redirect', 'starter_redirect_taxonomy_archives' );
function starter_redirect_taxonomy_archives() {
    if ( is_category() ) {
        $category = get_queried_object();
        
        $blog_page = get_page_by_path( 'blog' ); 
        $base_url  = $blog_page ? get_permalink( $blog_page ) : home_url( '/blog/' );
        
        $redirect_url = add_query_arg( 'cats', $category->slug, $base_url );
        
        wp_safe_redirect( $redirect_url, 301 );
        exit;
    }
    
    if ( is_tax( 'webinars-categories' ) ) {
        $term = get_queried_object();
        
        $webinars_page = get_page_by_path( 'webinars' ); 
        $base_url      = $webinars_page ? get_permalink( $webinars_page ) : home_url( '/webinars/' );
        
        $redirect_url = add_query_arg( 'cats', $term->slug, $base_url );
        
        wp_safe_redirect( $redirect_url, 301 );
        exit;
    }
}