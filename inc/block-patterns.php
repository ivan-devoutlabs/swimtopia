<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function theme_register_pattern_category() {
	if ( ! function_exists( 'register_block_pattern_category' ) ) {
		return;
	}

	register_block_pattern_category(
		'theme',
		array( 'label' => __( 'Theme Blocks', 'theme' ) )
	);
}
add_action( 'init', 'theme_register_pattern_category' );
