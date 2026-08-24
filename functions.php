<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'THEME_VERSION', wp_get_theme()->get( 'Version' ) );
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



function theme_content_has( $needle ) {
	if ( ! is_singular() ) {
		return false;
	}
	$post = get_post();
	return $post && false !== strpos( $post->post_content, $needle );
}


function theme_enqueue_components() {

	if ( theme_content_has( 'faq' ) ) {
		wp_enqueue_script(
			'faq',
			THEME_URI . '/js/faq.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'hero' ) ) {
		wp_enqueue_script(
			'hero',
			THEME_URI . '/js/hero.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
		wp_enqueue_script(
			'features',
			THEME_URI . '/js/features.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
		wp_enqueue_script(
			'features-distortion',
			THEME_URI . '/js/features-distortion.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'logo-marquee' ) || theme_content_has( 'headline-marquee' ) ) {
		wp_enqueue_script(
			'logo-marquee',
			THEME_URI . '/js/logo-marquee.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'features' ) ) {
		wp_enqueue_script(
			'features',
			THEME_URI . '/js/features.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
		wp_enqueue_script(
			'features-distortion',
			THEME_URI . '/js/features-distortion.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'tabs' ) ) {
		wp_enqueue_script(
			'features',
			THEME_URI . '/js/tabs.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
		wp_enqueue_script(
			'features-distortion',
			THEME_URI . '/js/features-distortion.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'cards-simple' ) ) {
		wp_enqueue_script(
			'features-distortion',
			THEME_URI . '/js/features-distortion.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'ease-accordion' ) || theme_content_has( 'ease-accordion-with-testimonials' ) || theme_content_has( 'testimonials' ) ) {
		wp_enqueue_script(
			'ease-accordion',
			THEME_URI . '/js/ease-accordion.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}
	
	if ( theme_content_has( 'content-testimonials' ) ) {
		wp_enqueue_script(
			'ease-accordion',
			THEME_URI . '/js/ease-accordion.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}
	

	if ( theme_content_has( 'case-study-preview' ) ) {
		wp_enqueue_script(
			'case-study',
			THEME_URI . '/js/case-study.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'sticky-stats' ) ) {
		wp_enqueue_script(
			'sticky-stats',
			THEME_URI . '/js/sticky-stats.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'blog-preview' ) ) {
		wp_enqueue_script(
			'blog-preview',
			THEME_URI . '/js/blog-preview.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'team-list' ) ) {
		wp_enqueue_script(
			'team-list',
			THEME_URI . '/js/team.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}

	if ( theme_content_has( 'cards-slider' ) ) {
		wp_enqueue_script(
			'features-distortion',
			THEME_URI . '/js/features-distortion.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
		wp_enqueue_script(
			'cards-slider',
			THEME_URI . '/js/cards-slider.js',
			array( 'jquery' ),
			null,
			array( 'strategy' => 'defer', 'in_footer' => true )
		);
	}
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_components' );





function starter_tabs_enqueue() {
 
	if ( ! is_singular() ) {
		return;
	}
 
	$post = get_post();
 
	if ( ! $post || false === strpos( $post->post_content, 'tabs__slider' ) ) {
		return;
	}
 
	if ( ! wp_script_is( 'starter-distortion', 'registered' ) ) {
		$distortion = THEME_DIR . '/js/distortion.js';
 
		wp_register_script(
			'starter-distortion',
			THEME_URI . '/js/distortion.js',
			array(),
			file_exists( $distortion ) ? filemtime( $distortion ) : THEME_VERSION,
			array(
				'strategy'  => 'defer',
				'in_footer' => true,
			)
		);
	}
 
	$path = THEME_DIR . '/js/tabs.js';
 
	wp_enqueue_script(
		'starter-tabs',
		THEME_URI . '/js/tabs.js',
		array( 'starter-distortion' ),
		file_exists( $path ) ? filemtime( $path ) : THEME_VERSION,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);
 
	wp_add_inline_script(
		'starter-tabs',
		'window.starterTabsL10n = ' . wp_json_encode(
			array(
				'prev' => __( 'Попередній таб', 'starter' ),
				'next' => __( 'Наступний таб', 'starter' ),
			)
		) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'starter_tabs_enqueue' );


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
    register_block_type( 'theme/member-position', array(
        'api_version'     => 3,
        'title'           => 'Team Member Position',
        'icon'            => 'id-alt',
        'category'        => 'theme',
        'uses_context'    => array( 'postId' ),
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