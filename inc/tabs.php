<?php
/**
 * Таби: підключення скриптів.
 *
 * Модуль спотворення спільний із features та картками. Якщо він уже
 * зареєстрований під іменем 'starter-distortion', повторно нічого
 * не реєструємо — лише вказуємо залежність.
 *
 * @package Starter
 */

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

	$path = STARTER_DIR . '/js/tabs.js';

	wp_enqueue_script(
		'starter-tabs',
		STARTER_URI . '/js/tabs.js',
		array( 'starter-distortion' ),
		file_exists( $path ) ? filemtime( $path ) : STARTER_VERSION,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	wp_add_inline_script(
		'starter-tabs',
		'window.starterTabsL10n = ' . wp_json_encode(
			array(
				'prev' => __( 'Попередній таб', 'starter' ),
				'next' => __( 'Наступний таб', 'starter' ),
			)
		) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'starter_tabs_enqueue' );