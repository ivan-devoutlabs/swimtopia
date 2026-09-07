<?php
/**
 * Footer rendered from a synced pattern.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


function starter_footer_pattern_title() {
    $post_id = get_queried_object_id();
    $footer_view = get_field( 'footer_view', $post_id );

    if ( $footer_view === 'small' ) {
        return apply_filters( 'starter_footer_pattern_title', 'Small Footer' );
    }

    return apply_filters( 'starter_footer_pattern_title', 'Footer' );
}

function starter_footer_pattern_id() {
    $title = starter_footer_pattern_title();
    
    $transient_key = 'starter_footer_id_' . sanitize_title( $title );

    $cached = get_transient( $transient_key );

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

    set_transient( $transient_key, $id, DAY_IN_SECONDS );

    return $id;
}


function starter_clear_footer_cache( $post_id ) {
    if ( 'wp_block' === get_post_type( $post_id ) ) {
        $title = get_the_title( $post_id );
        $transient_key = 'starter_footer_id_' . sanitize_title( $title );
        
        delete_transient( $transient_key );
        
        delete_transient( 'starter_footer_pattern_id' );
    }
}
add_action( 'save_post', 'starter_clear_footer_cache' );
add_action( 'deleted_post', 'starter_clear_footer_cache' );


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


	echo apply_filters( 'the_content', $pattern->post_content ); 
}

function starter_footer_fallback() {
	?>
	<footer class="footer footer--fallback">
		<div class="container">

			<p class="footer__bottomText">
				<?php
				printf(
					esc_html__( '© %1$s %2$s', 'starter' ),
					esc_html( gmdate( 'Y' ) ),
					esc_html( get_bloginfo( 'name' ) )
				);
				?>
			</p>

			<?php if ( current_user_can( 'edit_theme_options' ) ) : ?>
				
				<p class="footer__notice">
					<?php
					printf(
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
 

function starter_patterns_menu_highlight( $parent_file ) {
 
	$screen = get_current_screen();
 
	if ( $screen && 'wp_block' === $screen->post_type ) {
		return 'themes.php';
	}
 
	return $parent_file;
}
add_filter( 'parent_file', 'starter_patterns_menu_highlight' );
 