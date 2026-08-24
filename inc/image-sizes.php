<?php 
function starter_editor_image_size( $settings ) {
	$settings['imageDefaultSize'] = 'full';
 
	return $settings;
}
add_filter( 'block_editor_settings_all', 'starter_editor_image_size' );
 
function starter_big_image_threshold() {
	return 3840;
}
add_filter( 'big_image_size_threshold', 'starter_big_image_threshold' );
 
function starter_image_sizes() {
	add_image_size( 'starter-square', 640, 640, true );
 
	add_image_size( 'starter-wide', 1920, 1080, true );
}
add_action( 'after_setup_theme', 'starter_image_sizes' );
 
function starter_image_size_names( $sizes ) {
	return array_merge(
		$sizes,
		array(
			'starter-square' => __( 'square', 'starter' ),
			'starter-wide'   => __( 'Wide', 'starter' ),
		)
	);
}
add_filter( 'image_size_names_choose', 'starter_image_size_names' );