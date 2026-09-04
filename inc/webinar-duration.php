<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_register_webinar_duration_block() {

	$dir = THEME_DIR . '/blocks/webinar-duration';

	if ( ! file_exists( $dir . '/block.json' ) ) {
		return;
	}

	$script = THEME_DIR . '/js/webinar-duration-block.js';

	if ( file_exists( $script ) ) {
		wp_register_script(
			'starter-webinar-duration-block',
			THEME_URI . '/js/webinar-duration-block.js',
			array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-i18n' ),
			filemtime( $script ),
			true
		);
	}

	register_block_type(
		$dir,
		array(
			'editor_script' => 'starter-webinar-duration-block',
		)
	);
}
add_action( 'init', 'starter_register_webinar_duration_block' );