<?php
/**
 * Реєстрація кастомних блоків.
 *
 * Один рядок на блок. WordPress сам прочитає build/<блок>/block.json
 * і підтягне з нього скрипти, стилі та render.php.
 *
 * @package Starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_register_blocks() {

	$blocks = array(
		'hero',
		// додавайте нові сюди
	);

	foreach ( $blocks as $block ) {
		$path = THEME_DIR . '/build/' . $block;

		if ( file_exists( $path . '/block.json' ) ) {
			register_block_type( $path );
		} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			// Найчастіша причина: забули npm run build
			error_log( sprintf( 'Starter: блок "%s" не зібрано (немає %s/block.json)', $block, $path ) );
		}
	}
}
add_action( 'init', 'starter_register_blocks' );
