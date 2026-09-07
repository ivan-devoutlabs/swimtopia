<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_register_marquee_block() {

	$dir = get_theme_file_path( 'blocks/marquee' );

	if ( ! file_exists( $dir . '/block.json' ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'starter/marquee: block.json not found at ' . $dir );
		}

		return;
	}

	$script = get_theme_file_path( 'js/marquee-block.js' );

	if ( file_exists( $script ) ) {
		wp_register_script(
			'starter-marquee-block',
			get_theme_file_uri( 'js/marquee-block.js' ),
			array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
			filemtime( $script ),
			true
		);
	}

    $frontend_script = get_theme_file_path( 'js/logo-marquee.js' ); 

    if ( file_exists( $frontend_script ) ) {
        wp_register_script(
            'starter-marquee-block-frontend',
            get_theme_file_uri( 'js/logo-marquee.js' ),
            array(), 
            filemtime( $frontend_script ),
            true
        );
    }

	register_block_type(
		$dir,
		array(
			'editor_script' => 'starter-marquee-block',
            'view_script'   => 'starter-marquee-block-frontend'
		)
	);
}
add_action( 'init', 'starter_register_marquee_block' );