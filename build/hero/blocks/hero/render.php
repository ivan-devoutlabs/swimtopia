<?php


$heading      = $attributes['heading'] ?? '';
$text         = $attributes['text'] ?? '';
$image_id     = (int) ( $attributes['imageId'] ?? 0 );
$image_url    = $attributes['imageUrl'] ?? '';
$image_alt    = $attributes['imageAlt'] ?? '';
$bg_id        = (int) ( $attributes['bgId'] ?? 0 );
$bg_url       = $attributes['bgUrl'] ?? '';
$show_overlay = ! empty( $attributes['showOverlay'] );
$min_height   = (int) ( $attributes['minHeight'] ?? 560 );

if ( '' === trim( wp_strip_all_tags( $heading ) )
	&& '' === trim( wp_strip_all_tags( $text ) )
	&& ! $image_url
	&& ! $bg_url
) {
	return;
}

$classes = 'starter-hero';
if ( $show_overlay ) {
	$classes .= ' has-overlay';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $classes,
		'style' => sprintf( 'min-height:%dpx;', max( 200, $min_height ) ),
	)
);

$allowed_inline = array(
	'strong' => array(),
	'em'     => array(),
	'b'      => array(),
	'i'      => array(),
	'br'     => array(),
	'a'      => array(
		'href'   => array(),
		'target' => array(),
		'rel'    => array(),
	),
);
?>

<section <?php echo $wrapper_attributes; ?>>

	<?php if ( $bg_id ) : ?>
		<?php
		echo wp_get_attachment_image(
			$bg_id,
			'full',
			false,
			array(
				'class'   => 'starter-hero__bg',
				'alt'     => '',
				'aria-hidden' => 'true',
				'loading' => 'eager',
			)
		);
		?>
	<?php elseif ( $bg_url ) : ?>
		<img
			class="starter-hero__bg"
			src="<?php echo esc_url( $bg_url ); ?>"
			alt=""
			aria-hidden="true"
		/>
	<?php endif; ?>

	<div class="starter-hero__inner">

		<div class="starter-hero__content">

			<?php if ( $heading ) : ?>
				<h1 class="starter-hero__heading">
					<?php echo wp_kses( $heading, $allowed_inline ); ?>
				</h1>
			<?php endif; ?>

			<?php if ( $text ) : ?>
				<p class="starter-hero__text">
					<?php echo wp_kses( $text, $allowed_inline ); ?>
				</p>
			<?php endif; ?>

		</div>

		<?php if ( $image_id || $image_url ) : ?>
			<figure class="starter-hero__media">
				<?php
				if ( $image_id ) {
					echo wp_get_attachment_image(
						$image_id,
						'large',
						false,
						array(
							'class'   => 'starter-hero__image',
							'alt'     => esc_attr( $image_alt ),
							'loading' => 'eager',
						)
					);
				} else {
					printf(
						'<img class="starter-hero__image" src="%s" alt="%s" loading="eager" />',
						esc_url( $image_url ),
						esc_attr( $image_alt )
					);
				}
				?>
			</figure>
		<?php endif; ?>

	</div>

</section>
