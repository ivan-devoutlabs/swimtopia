<?php
/**
 * Features: SVG-фільтр спотворення і підключення скрипта.
 *
 * Підключіть у functions.php:
 *   require THEME_DIR . '/inc/features.php';
 *
 * @package Starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Фільтр спотворення для зміни зображень.
 *
 * Справжній ефект із прикладу Codrops зроблено на WebGL із картою
 * зміщення. Тут те саме за принципом, але засобами SVG: шум задає
 * напрямок зсуву пікселів, а силу (атрибут scale) анімує JS.
 *
 * Перевага: працює у всіх браузерах і не тягне three.js.
 * Обмеження: спотворення рівномірне по всій площині, без керування
 * напрямком, як у шейдері.
 */
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

			<!-- Карта зміщення: великі плавні хвилі, не дрібний шум -->
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.006 0.01"
				numOctaves="2"
				seed="3"
				result="noise"
			/>

			<feGaussianBlur in="noise" stdDeviation="4" result="softNoise" />

			<!-- scale=0 у спокої; під час зміни слайда JS піднімає й повертає -->
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

/**
 * Скрипт слайдера.
 */
function starter_features_enqueue() {

	if ( ! is_singular() ) {
		return;
	}

	$post = get_post();

	if ( ! $post || false === strpos( $post->post_content, 'features__slider' ) ) {
		return;
	}

	// Спершу модуль спотворення: слайдер перевіряє його наявність.
	$distortion = THEME_DIR . '/js/features-distortion.js';

	wp_enqueue_script(
		'starter-features-distortion',
		THEME_URI . '/js/features-distortion.js',
		array(),
		file_exists( $distortion ) ? filemtime( $distortion ) : THEME_VERSION,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	$path = THEME_DIR . '/js/features.js';

	wp_enqueue_script(
		'starter-features',
		THEME_URI . '/js/features.js',
		array( 'starter-features-distortion' ),
		file_exists( $path ) ? filemtime( $path ) : THEME_VERSION,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	wp_add_inline_script(
		'starter-features',
		'window.starterFeaturesL10n = ' . wp_json_encode(
			array( 'next' => __( 'Наступний слайд', 'starter' ) )
		) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'starter_features_enqueue' );