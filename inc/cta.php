<?php
/**
 * CTA: підключення скриптів і список слів для ролодекса.
 *
 * Підключіть файл у functions.php:
 *   require THEME_DIR . '/inc/cta.php';
 *
 * @package Starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Слова, які по черзі підставляються в заголовок CTA.
 *
 * Список у коді, бо він частина копірайту секції, а не контенту сторінки.
 * Якщо клієнт має редагувати його сам — це вже привід зробити окремий
 * блок з полем або сторінку налаштувань.
 *
 * Змінити можна й ззовні:
 *   add_filter( 'starter_cta_rolodex_words', function ( $words ) { ... } );
 */
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

/**
 * Фронтенд.
 */
function starter_cta_enqueue() {

	if ( ! is_singular() ) {
		return;
	}

	$post = get_post();

	// Скрипт потрібен лише там, де секція справді є.
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
				'interval' => 2200, // мс між словами
			)
		) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'starter_cta_enqueue' );

/**
 * Редактор: попередження про формат зображення.
 */
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
					'У секцію CTA можна завантажувати лише PNG-зображення.',
					'starter'
				),
			)
		) . ';',
		'before'
	);
}
add_action( 'enqueue_block_editor_assets', 'starter_cta_editor_assets' );