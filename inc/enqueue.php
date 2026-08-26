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
		THEME_URI . '/js/navigation.js',
		array(),
		THEME_VERSION,
		true
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
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
