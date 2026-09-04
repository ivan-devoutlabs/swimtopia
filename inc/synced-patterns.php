<?php
/**
 * Rendering synced patterns from templates.
 *
 * Lets a template hand a whole region over to the editor: the client
 * edits it with blocks under Appearance > Patterns, and the template
 * only asks for it by title.
 *
 * Written once and shared, because the footer, the 404 page and
 * anything else that follows all need the same three things — look the
 * pattern up by title, cache the result, fall back to something sane
 * when it isn't there yet.
 *
 * Include from functions.php:
 *   require get_theme_file_path( 'inc/synced-patterns.php' );
 *
 * @package Starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_synced_pattern_id( $title ) {

	$key = 'starter_pattern_' . md5( $title );
	$cached = get_transient( $key );

	if ( false !== $cached ) {
		return (int) $cached;
	}

	$found = get_posts(
		array(
			'post_type'      => 'wp_block',
			'title'          => $title,
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);

	$id = $found ? (int) $found[0] : 0;

	set_transient( $key, $id, DAY_IN_SECONDS );

	return $id;
}

function starter_clear_pattern_cache( $post_id ) {

	if ( 'wp_block' !== get_post_type( $post_id ) ) {
		return;
	}

	global $wpdb;

	$wpdb->query(
		"DELETE FROM {$wpdb->options}
		 WHERE option_name LIKE '_transient_starter_pattern_%'
		    OR option_name LIKE '_transient_timeout_starter_pattern_%'"
	);
}
add_action( 'save_post', 'starter_clear_pattern_cache' );
add_action( 'deleted_post', 'starter_clear_pattern_cache' );

function starter_render_synced_pattern( $title, $fallback = null ) {

	$id = starter_synced_pattern_id( $title );
	$pattern = $id ? get_post( $id ) : null;

	if ( ! $pattern || 'publish' !== $pattern->post_status ) {

		if ( is_callable( $fallback ) ) {
			call_user_func( $fallback, $title );
		}

		return;
	}


	echo apply_filters( 'the_content', $pattern->post_content );
}


function starter_missing_pattern_notice( $title ) {

	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}
	?>
	<p class="starter-missing-pattern">
		<?php
		printf(
			esc_html__( 'No "%s" pattern found. Create a synced pattern with that title under Appearance > Patterns.', 'starter' ),
			esc_html( $title )
		);
		?>
	</p>
	<?php
}