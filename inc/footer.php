<?php
/**
 * Footer rendered from a synced pattern.
 *
 * The entire footer is edited with blocks under Appearance > Patterns.
 * The template only outputs it.
 *
 * WHY A SYNCED PATTERN RATHER THAN A HIDDEN PAGE
 *   A hidden page works, but it sits among the site's real pages where
 *   nobody looks for it and where it can be published or deleted by
 *   accident. A pattern lives where you'd expect it to.
 *
 *   Technically a synced pattern is a wp_block post — the same
 *   mechanism formerly known as a reusable block.
 *
 * Include from functions.php:
 *   require STARTER_DIR . '/inc/footer.php';
 *
 * @package Starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Title of the pattern treated as the footer.
 *
 * Override with:
 *   add_filter( 'starter_footer_pattern_title', fn() => 'Site Footer' );
 */
function starter_footer_pattern_title() {
	return apply_filters( 'starter_footer_pattern_title', 'Footer' );
}

/**
 * Look up the synced pattern by title.
 *
 * We match on title rather than ID because the ID differs between
 * local, staging and production. Hard-coding it would break on the
 * first migration.
 *
 * The result is cached in a transient — querying the database on every
 * page load for a single post is wasteful.
 */
function starter_footer_pattern_id() {

	$cached = get_transient( 'starter_footer_pattern_id' );

	if ( false !== $cached ) {
		return (int) $cached;
	}

	$found = get_posts(
		array(
			'post_type'      => 'wp_block',
			'title'          => starter_footer_pattern_title(),
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);

	$id = $found ? (int) $found[0] : 0;

	set_transient( 'starter_footer_pattern_id', $id, DAY_IN_SECONDS );

	return $id;
}

/**
 * Flush the cache when a pattern is saved.
 *
 * Without this a newly created or renamed footer would only appear a
 * day later — and the cause would take a while to track down.
 */
function starter_clear_footer_cache( $post_id ) {

	if ( 'wp_block' === get_post_type( $post_id ) ) {
		delete_transient( 'starter_footer_pattern_id' );
	}
}
add_action( 'save_post', 'starter_clear_footer_cache' );
add_action( 'deleted_post', 'starter_clear_footer_cache' );

/**
 * Output the footer.
 */
function starter_render_footer() {

	$id = starter_footer_pattern_id();

	if ( ! $id ) {
		starter_footer_fallback();

		return;
	}

	$pattern = get_post( $id );

	if ( ! $pattern || 'publish' !== $pattern->post_status ) {
		starter_footer_fallback();

		return;
	}

	/*
	 * the_content is required so blocks, shortcodes and core styles all
	 * work. The content was already sanitised in the editor.
	 */
	echo apply_filters( 'the_content', $pattern->post_content ); // phpcs:ignore WordPress.Security.EscapeOutput
}

/**
 * Fallback shown until the pattern exists.
 *
 * Minimal but not empty: a site with no footer looks broken, and the
 * administrator should be told what to do about it.
 */
function starter_footer_fallback() {
	?>
	<footer class="footer footer--fallback">
		<div class="container">

			<p class="footer__bottomText">
				<?php
				printf(
					/* translators: 1: year, 2: site name */
					esc_html__( '© %1$s %2$s', 'starter' ),
					esc_html( gmdate( 'Y' ) ),
					esc_html( get_bloginfo( 'name' ) )
				);
				?>
			</p>

			<?php if ( current_user_can( 'edit_theme_options' ) ) : ?>
				<?php
				/*
				 * Only administrators see this notice — it means nothing
				 * to a visitor.
				 */
				?>
				<p class="footer__notice">
					<?php
					printf(
						/* translators: %s: pattern title */
						esc_html__( 'No footer configured. Create a synced pattern titled "%s" under Appearance > Patterns.', 'starter' ),
						esc_html( starter_footer_pattern_title() )
					);
					?>
				</p>
			<?php endif; ?>

		</div>
	</footer>
	<?php
}



function starter_add_patterns_menu() {
 
	add_submenu_page(
		'themes.php',
		__( 'Patterns', 'starter' ),
		__( 'Patterns', 'starter' ),
		'edit_posts',
		'edit.php?post_type=wp_block',
		'',
		20
	);
}
add_action( 'admin_menu', 'starter_add_patterns_menu' );
 
/**
 * Keep Appearance highlighted while the patterns screen is open.
 *
 * Without this WordPress highlights nothing, because the screen really
 * belongs to a post type list table rather than to Appearance.
 */
function starter_patterns_menu_highlight( $parent_file ) {
 
	$screen = get_current_screen();
 
	if ( $screen && 'wp_block' === $screen->post_type ) {
		return 'themes.php';
	}
 
	return $parent_file;
}
add_filter( 'parent_file', 'starter_patterns_menu_highlight' );
 