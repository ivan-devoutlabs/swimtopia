<?php


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_register_panel_style() {
	register_block_style(
		'core/group',
		array(
			'name'  => 'panel',
			'label' => __( 'Panel', 'swimtopia' ),
		)
	);
}
add_action( 'init', 'starter_register_panel_style' );

function starter_enqueue_hero_video() {

	if ( ! is_singular() ) {
		return;
	}

	$post = get_post();

	if ( ! $post || false === strpos( $post->post_content, '"backgroundType":"video"' ) ) {
		return;
	}

	wp_enqueue_script(
		'starter-hero-video',
		THEME_URI . '/js/hero-video.js',
		array(),
		THEME_VERSION,
		true
	);

	wp_localize_script(
		'starter-hero-video',
		'starterHeroL10n',
		array(
			'pause' => __( 'Pause', 'starter' ),
			'play'  => __( 'Play', 'starter' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'starter_enqueue_hero_video' );
