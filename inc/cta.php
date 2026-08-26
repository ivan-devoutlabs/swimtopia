<?php


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_cta_rolodex_words() {
	return apply_filters(
		'starter_cta_rolodex_words',
		array(
			'Teams',
			'Leagues',
			'Admins',
			'Volunteers',
			'Coaches',
			'Swimmers',
			'Parents',
		)
	);
}


function starter_cta_enqueue() {

	if ( ! is_singular() ) {
		return;
	}

	$post = get_post();

	if ( ! $post || false === strpos( $post->post_content, 'cta__contentWrapper' ) ) {
		return;
	}

	$path = THEME_DIR . '/js/cta.js';

	wp_enqueue_script(
		'starter-cta',
		THEME_URI . '/js/cta.js',
		array(),
		file_exists( $path ) ? filemtime( $path ) : THEME_VERSION,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	wp_add_inline_script(
		'starter-cta',
		'window.starterCtaRolodex = ' . wp_json_encode(
			array(
				'words'    => array_values( starter_cta_rolodex_words() ),
				'interval' => 2200, 
			)
		) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'starter_cta_enqueue' );


function starter_cta_editor_assets() {
	$path = THEME_DIR . '/js/cta-editor.js';

	if ( ! file_exists( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'starter-cta-editor',
		THEME_URI . '/js/cta-editor.js',
		array( 'wp-data', 'wp-dom-ready', 'wp-notices' ),
		filemtime( $path ),
		true
	);

	wp_add_inline_script(
		'starter-cta-editor',
		'window.starterCtaL10n = ' . wp_json_encode(
			array(
				'pngOnly' => __(
					'You can upload only PNG images.',
					'starter'
				),
			)
		) . ';',
		'before'
	);
}
add_action( 'enqueue_block_editor_assets', 'starter_cta_editor_assets' );