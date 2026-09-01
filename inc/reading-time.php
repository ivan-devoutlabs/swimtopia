<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'THEME_READING_TIME_KEY', '_reading_time' );


function words_per_minute() {
	return (int) apply_filters( 'words_per_minute', 200 );
}


function calculate_reading_time( $content ) {
    $text = preg_replace( '/<!--(.|\s)*?-->/', '', $content );
    
    $text = wp_strip_all_tags( $text );

    $words = preg_match_all( '/\p{L}+/u', $text );

    if ( ! $words ) {
        return 1;
    }

    $minutes = (int) ceil( $words / words_per_minute() );

    return max( 1, $minutes );
}


function store_reading_time( $post_id, $post ) {

	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}

	if ( 'publish' !== $post->post_status && 'draft' !== $post->post_status ) {
		return;
	}

	update_post_meta(
		$post_id,
		THEME_READING_TIME_KEY,
		calculate_reading_time( $post->post_content )
	);
}
add_action( 'save_post', 'store_reading_time', 10, 2 );


function reading_time( $post_id = null ) {
	$post_id = $post_id ? $post_id : get_the_ID();

	if ( ! $post_id ) {
		return 0;
	}

	$stored = get_post_meta( $post_id, THEME_READING_TIME_KEY, true );

	if ( '' !== $stored ) {
		return (int) $stored;
	}

	$post = get_post( $post_id );

	if ( ! $post ) {
		return 0;
	}

	$minutes = calculate_reading_time( $post->post_content );

	update_post_meta( $post_id, THEME_READING_TIME_KEY, $minutes );

	return $minutes;
}

function reading_time_label( $post_id = null ) {
	$minutes = reading_time( $post_id );

	if ( ! $minutes ) {
		return '';
	}

	return sprintf(
		_n( '%d min read', '%d min read', $minutes, 'starter' ),
		$minutes
	);
}
add_action( 'init', 'starter_register_reading_time_block' );
function starter_register_reading_time_block() {

	wp_register_script(
        'starter-reading-time-editor',
        get_theme_file_uri( '/js/reading-time-block.js' ), 
        array( 'wp-blocks', 'wp-element' ),
        '1.0',
        true
    );

    register_block_type( 'starter/reading-time', array(
        'api_version'     => 3,
        'title'           => 'Reading Time',
        'icon'            => 'clock',
        'category'        => 'theme',
        'uses_context'    => array( 'postId' ),
        'editor_script'   => 'starter-reading-time-editor',
        'render_callback' => 'starter_render_reading_time_block'
    ) );
}

function starter_render_reading_time_block( $attributes, $content, $block ) {
    $post_id = isset( $block->context['postId'] ) ? $block->context['postId'] : get_the_ID();
    
    $label = reading_time_label( $post_id );
    
    if ( ! $label ) {
        return '';
    }

    return '<div class="blogPreview__listItem__time">' . esc_html( $label ) . '</div>';
}


function reading_time_shortcode() {
	$label = reading_time_label();

	if ( ! $label ) {
		return '';
	}

	return '<span class="readingTime">' . esc_html( $label ) . '</span>';
}
add_shortcode( 'reading_time', 'reading_time_shortcode' );