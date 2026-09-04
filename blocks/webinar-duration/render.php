<?php

if ( ! function_exists( 'get_field' ) || ! function_exists( 'get_video_duration' ) ) {
	return;
}

$post_id = isset( $block->context['postId'] )
	? (int) $block->context['postId']
	: get_the_ID();

if ( ! $post_id ) {
	return;
}

$duration = get_field( 'webinar_duration', $post_id );


if ( ! $duration ) {
	return;
}
?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => 'webinarsPreview__listItem__time' ) ); ?>>
	<?php echo esc_html( $duration ); ?>
</div>