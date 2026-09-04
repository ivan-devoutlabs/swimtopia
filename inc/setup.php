<?php


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


function starter_setup() {

	load_theme_textdomain( 'starter', THEME_DIR . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'customize-selective-refresh-widgets' );

	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/main.css' );
	add_editor_style( 'assets/css/editor.css' );

	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	add_theme_support(
		'custom-logo',
		array(
			'height'      => 60,
			'width'       => 200,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);

	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'starter' ),
			'footer' => esc_html__( 'Footer', 'starter' ),
		)
	);
}
add_action( 'after_setup_theme', 'starter_setup' );


function starter_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'starter_content_width', 1200 );
}
add_action( 'after_setup_theme', 'starter_content_width', 0 );

function starter_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'starter' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widget.', 'starter' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'starter_widgets_init' );

