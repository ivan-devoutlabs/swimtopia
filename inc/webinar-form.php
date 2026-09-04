<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_webinar_embed( $post_id = null ) {

	$post_id = $post_id ? $post_id : get_the_ID();

	if ( ! $post_id || ! function_exists( 'get_field' ) ) {
		return '';
	}

	return trim( (string) get_field( 'webinar_form_embed', $post_id ) );
}

function starter_webinar_form( $register_btn = null ) {

	$embed = starter_webinar_embed();

	if ( '' === $embed ) {

		if ( ! empty( $register_btn['url'] ) ) {
			?>
			<div class="webinarsHero__contentInfo__register">
				<a class="wp-block-button__link" href="<?php echo esc_url( $register_btn['url'] ); ?>">
					<?php echo esc_html( $register_btn['title'] ); ?>
				</a>
			</div>
			<?php
		}

		return;
	}
	?>

	<div class="webinarsHero__contentInfo__form">
		<?php
	
		echo $embed; 
		?>
	</div>

	<?php
}