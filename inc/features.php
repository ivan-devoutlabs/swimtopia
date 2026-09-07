<?php


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


function starter_features_filter() {

	if ( ! is_singular() ) {
		return;
	}

	$post = get_post();

	if ( ! $post || false === strpos( $post->post_content, 'features__slider' ) ) {
		return;
	}
	?>
	<svg
		width="0"
		height="0"
		aria-hidden="true"
		focusable="false"
		style="position:absolute;pointer-events:none"
	>
		<filter id="features-distortion" x="-5%" y="-5%" width="110%" height="110%">

			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.006 0.01"
				numOctaves="2"
				seed="3"
				result="noise"
			/>

			<feGaussianBlur in="noise" stdDeviation="4" result="softNoise" />

			<feDisplacementMap
				in="SourceGraphic"
				in2="softNoise"
				scale="0"
				xChannelSelector="R"
				yChannelSelector="G"
			/>

		</filter>
	</svg>
	<?php
}
add_action( 'wp_footer', 'starter_features_filter' );


function starter_features_enqueue() {

	if ( ! is_singular() ) {
		return;
	}

	$post = get_post();

	if ( ! $post || false === strpos( $post->post_content, 'features__slider' ) ) {
		return;
	}
	$path = THEME_DIR . '/build/js/features.js';

	wp_enqueue_script(
		'starter-features',
		THEME_URI . '/build/js/features.js',
		file_exists( $path ) ? filemtime( $path ) : THEME_VERSION,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	wp_add_inline_script(
		'starter-features',
		'window.starterFeaturesL10n = ' . wp_json_encode(
			array( 'next' => __( 'Next', 'starter' ) )
		) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'starter_features_enqueue' );