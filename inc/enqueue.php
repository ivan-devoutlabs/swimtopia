<?php
/**
 * Стилі та скрипти.
 *
 * @package Starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Фронтенд.
 *
 * filemtime() як версія: браузер сам скидає кеш після кожної збірки,
 * тож під час розробки не доведеться робити hard reload.
 */
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
}
add_action( 'wp_enqueue_scripts', 'starter_enqueue_assets' );

/**
 * Стилі редактора.
 *
 * Щоб редактор виглядав як фронтенд, зберіть editor.css зі своїх SCSS
 * або підключіть той самий main.css.
 */
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
