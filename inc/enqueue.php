<?php


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


function starter_enqueue_assets() {
    wp_enqueue_script( 'jquery', 'https://code.jquery.com/jquery-3.6.0.min.js', false , false , true);
	wp_enqueue_script(
		'header',
		THEME_URI . '/js/header.js',
		array(),
		THEME_VERSION,
		true
	);

	wp_enqueue_style( 'swiper-style', get_template_directory_uri() . '/assets/css/swiper.css', array(), '11.0.0' );
	wp_enqueue_script( 'swiper-script', get_template_directory_uri() . '/assets/js/swiper.js', array(), '11.0.0', true );

	$css_path = THEME_DIR . '/assets/css/main.css';

	wp_enqueue_style(
		'starter-main',
		THEME_URI . '/assets/css/main.css',
		array(),
		file_exists( $css_path ) ? filemtime( $css_path ) : THEME_VERSION
	);

	wp_enqueue_style( 'starter-style', get_stylesheet_uri(), array( 'starter-main' ), THEME_VERSION );

	wp_enqueue_script(
		'starter-navigation',
		THEME_URI . '/build/js/navigation.js',
		array(),
		THEME_VERSION,
		true
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
    
    if ( is_singular() || is_singular('webinars') ){
        wp_enqueue_script(
            'share-buttons',
            THEME_URI . '/build/js/share-buttons.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/share-buttons.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }
    

	if(is_singular('webinars')){
		
		wp_enqueue_script(
			'plyr-js',
			'https://cdn.plyr.io/3.8.4/plyr.polyfilled.js',
			array(),
			THEME_VERSION,
			true
		);

		wp_enqueue_style(
		'plyr-css',
			'https://cdn.plyr.io/3.8.4/plyr.css',
			array(),
			file_exists( $css_path ) ? filemtime( $css_path ) : THEME_VERSION
		);

        wp_enqueue_script(
            'blog-preview',
            THEME_URI . '/build/js/blog-preview.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/blog-preview.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
	}
}
add_action( 'wp_enqueue_scripts', 'starter_enqueue_assets' );


function starter_editor_assets() {
	$css_path = THEME_DIR . '/assets/css/editor.css';

	if ( file_exists( $css_path ) ) {
		wp_enqueue_style(
			'starter-editor',
			THEME_URI . '/assets/css/editor.css',
			array(),
			filemtime( $css_path )
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'starter_editor_assets' );



function starter_page_blocks() {
 
    static $cache = null;
 
    if ( null !== $cache ) {
        return $cache;
    }
 
    $cache = array(
        'blocks'  => array(),
        'classes' => array(),
    );
 
    if ( ! is_singular() ) {
        return $cache;
    }
 
    $post = get_post();
 
    if ( ! $post || ! $post->post_content ) {
        return $cache;
    }
 
    $collect = function ( $blocks ) use ( &$collect, &$cache ) {
 
        foreach ( $blocks as $block ) {
 
            if ( ! empty( $block['blockName'] ) ) {
                $cache['blocks'][] = $block['blockName'];
            }
 
            if ( ! empty( $block['attrs']['className'] ) ) {
                foreach ( preg_split( '/\s+/', $block['attrs']['className'] ) as $class ) {
                    if ( $class ) {
                        $cache['classes'][] = $class;
                    }
                }
            }
 
            if ( ! empty( $block['innerBlocks'] ) ) {
                $collect( $block['innerBlocks'] );
            }
        }
    };
 
    $collect( parse_blocks( $post->post_content ) );
 
    $cache['blocks']  = array_unique( $cache['blocks'] );
    $cache['classes'] = array_unique( $cache['classes'] );
 
    return $cache;
}

function starter_page_has( $marker ) {
 
    $page = starter_page_blocks();
 
    if ( false !== strpos( $marker, '/' ) ) {
        return in_array( $marker, $page['blocks'], true );
    }
 
    return in_array( $marker, $page['classes'], true );
}

function theme_enqueue_block_assets() {
    $is_global_blog = is_singular( 'post' ) || is_search();

    if ( starter_page_has( 'tabs' ) || starter_page_has( 'roleTabs' ) || starter_page_has( 'role-tabs' ) || starter_page_has( 'cardsSimple' ) || starter_page_has( 'cards-simple' ) || starter_page_has( 'cardsSlider' ) || starter_page_has( 'cards-slider' ) ) {
        wp_enqueue_script(
            'features-distortion',
            THEME_URI . '/build/js/features-distortion.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/features-distortion.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if(starter_page_has( 'cardsSimple' ) ){
        wp_enqueue_script(
            'clickable-cards',
            THEME_URI . '/build/js/clickable-cards.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/clickable-cards.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

	if ( starter_page_has( 'faq' ) ) {
        wp_enqueue_script(
            'faq', 
            THEME_URI . '/build/js/faq.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/tabs.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'tabs' ) || starter_page_has( 'roleTabs' ) || starter_page_has( 'role-tabs' ) ) {
        wp_enqueue_script(
            'theme-tabs', 
            THEME_URI . '/build/js/tabs.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/tabs.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'easeAccordion' ) || starter_page_has( 'ease-accordion' ) || starter_page_has( 'theme/testimonials' ) || starter_page_has( 'testimonials' ) || starter_page_has( 'content__testimonials' ) ) {
        wp_enqueue_script(
            'ease-accordion',
            THEME_URI . '/build/js/ease-accordion.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/ease-accordion.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'caseStudyPreview' ) || starter_page_has( 'case-study-preview' ) ) {
        wp_enqueue_script(
            'case-study',
            THEME_URI . '/build/js/case-study.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/case-study.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
        wp_enqueue_script(
            'clickable-cards',
            THEME_URI . '/build/js/clickable-cards.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/clickable-cards.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'stickyStats' ) ) {
        wp_enqueue_script(
            'sticky-stats',
            THEME_URI . '/build/js/sticky-stats.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/sticky-stats.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'accordion' ) ) {
        wp_enqueue_script(
            'accordion-js',
            THEME_URI . '/build/js/accordion.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/accordion.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( $is_global_blog || starter_page_has( 'blogPreview' ) || starter_page_has( 'starter/blog-preview' ) || starter_page_has( 'blog-preview' ) || starter_page_has( 'featuredBlog' ) ) {
        wp_enqueue_script(
            'blog-preview',
            THEME_URI . '/build/js/blog-preview.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/blog-preview.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( $is_global_blog || starter_page_has( 'webinarsPreview' ) || starter_page_has( 'webinars-preview-list' ) ) {
        wp_enqueue_script(
            'webinars',
            THEME_URI . '/build/js/webinars.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/webinars.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'form' ) || starter_page_has( 'wpcf7' ) ) {
        wp_enqueue_script(
            'form',
            THEME_URI . '/build/js/form.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/form.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'teamBlock' )) {
        wp_enqueue_script(
            'team-list',
            THEME_URI . '/build/js/team.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/team.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'cardsSimple' ) ) {
        wp_enqueue_script(
            'cards-slider',
            THEME_URI . '/build/js/cards-slider.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/cards-slider.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

	if ( starter_page_has( 'headerBlock--hasEffect' ) ) {
        wp_enqueue_script(
            'header-block-effect',
            THEME_URI . '/build/js/header-block-effect.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/header-block-effect.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'logoMarquee' ) || starter_page_has( 'textMarquee' ) ) {
        wp_enqueue_script(
            'logo-marquee',
            THEME_URI . '/build/js/logo-marquee.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/logo-marquee.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'hero' ) ) {
        wp_enqueue_script(
            'hero',
            THEME_URI . '/build/js/hero.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/hero.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }
     
    if ( starter_page_has( 'pricing' ) ) {
        wp_enqueue_script(
            'pricing',
            THEME_URI . '/build/js/pricing.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/pricing.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }

    if ( starter_page_has( 'compareComponent' ) ) {
        wp_enqueue_script(
            'compare-component',
            THEME_URI . '/build/js/compare-component.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/compare-component.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }
    if ( starter_page_has( 'fullBleedCallout' ) ) {
        wp_enqueue_script(
            'water-ripple',
            THEME_URI . '/build/js/water-ripple.js',
            array( 'jquery' ),
            filemtime( get_theme_file_path( '/build/js/water-ripple.js' ) ),
            array( 'strategy' => 'defer', 'in_footer' => true )
        );
    }
	
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_block_assets' );