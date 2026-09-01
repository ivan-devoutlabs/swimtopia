<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_tabs_enqueue() {

	if ( ! is_singular() ) {
		return;
	}

	$post = get_post();

	if ( ! $post || false === strpos( $post->post_content, 'tabs__slider' ) ) {
		return;
	}

	if ( ! wp_script_is( 'starter-distortion', 'registered' ) ) {
		$distortion = STARTER_DIR . '/js/distortion.js';

		wp_register_script(
			'starter-distortion',
			STARTER_URI . '/js/distortion.js',
			array(),
			file_exists( $distortion ) ? filemtime( $distortion ) : STARTER_VERSION,
			array(
				'strategy'  => 'defer',
				'in_footer' => true,
			)
		);
	}
}
add_action( 'wp_enqueue_scripts', 'starter_tabs_enqueue' );