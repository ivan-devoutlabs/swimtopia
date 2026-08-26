<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_register_blocks() {

	$blocks = array(
		'hero',
	);

	foreach ( $blocks as $block ) {
		$path = THEME_DIR . '/build/' . $block;

		if ( file_exists( $path . '/block.json' ) ) {
			register_block_type( $path );
		} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		}
	}
}
add_action( 'init', 'starter_register_blocks' );
