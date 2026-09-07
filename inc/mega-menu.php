<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


function starter_register_menu_panels() {

	register_post_type(
		'starter_panel',
		array(
			'labels'          => array(
				'name'          => __( 'Menu panel', 'starter' ),
				'singular_name' => __( 'Menu panel', 'starter' ),
				'add_new_item'  => __( 'Add panel', 'starter' ),
				'edit_item'     => __( 'Edit panel', 'starter' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => 'themes.php', 
			'show_in_rest'    => true, 
			'supports'        => array( 'title', 'editor', 'revisions' ),
			'capability_type' => 'page',
		)
	);
}
add_action( 'init', 'starter_register_menu_panels' );


function starter_menu_item_panel_field( $item_id, $item, $depth ) {

	if ( $depth > 0 ) {
		return;
	}

	$panels = get_posts(
		array(
			'post_type'      => 'starter_panel',
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'post_status'    => 'publish',
		)
	);

	if ( ! $panels ) {
		return;
	}

	$current = get_post_meta( $item_id, '_starter_panel', true );
	?>
	<p class="field-starter-panel description description-wide">
		<label for="starter-panel-<?php echo esc_attr( $item_id ); ?>">
			<?php esc_html_e( 'Menu panel', 'starter' ); ?><br>
			<select
				id="starter-panel-<?php echo esc_attr( $item_id ); ?>"
				name="starter_panel[<?php echo esc_attr( $item_id ); ?>]"
				class="widefat"
			>
				<option value=""><?php esc_html_e( '— sub menu —', 'starter' ); ?></option>
				<?php foreach ( $panels as $panel ) : ?>
					<option
						value="<?php echo esc_attr( $panel->ID ); ?>"
						<?php selected( (int) $current, $panel->ID ); ?>
					>
						<?php echo esc_html( $panel->post_title ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</label>
	</p>
	<?php
}
add_action( 'wp_nav_menu_item_custom_fields', 'starter_menu_item_panel_field', 10, 3 );


function starter_save_menu_item_panel( $menu_id, $menu_item_db_id ) {

	$value = isset( $_POST['starter_panel'][ $menu_item_db_id ] )
		? absint( $_POST['starter_panel'][ $menu_item_db_id ] )
		: 0;

	if ( $value ) {
		update_post_meta( $menu_item_db_id, '_starter_panel', $value );
	} else {
		delete_post_meta( $menu_item_db_id, '_starter_panel' );
	}
}
add_action( 'wp_update_nav_menu_item', 'starter_save_menu_item_panel', 10, 2 );

class Starter_Mega_Menu_Walker extends Walker_Nav_Menu {

	private function toggle_button( $item ) {
		return sprintf(
			'<button type="button" class="menu-toggle" aria-expanded="false" aria-label="%s"><span class="menu-toggle__icon" aria-hidden="true"></span></button>',
			esc_attr(
				sprintf(
					__( 'Expand «%s»', 'starter' ),
					wp_strip_all_tags( $item->title )
				)
			)
		);
	}

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {

		parent::start_el( $output, $item, $depth, $args, $id );

		if ( $depth > 0 ) {
			return;
		}

		$panel_id = (int) get_post_meta( $item->ID, '_starter_panel', true );

		if ( ! $panel_id ) {
			return;
		}

		$panel = get_post( $panel_id );

		if ( ! $panel || 'publish' !== $panel->post_status ) {
			return;
		}

		$output .= $this->toggle_button( $item );

		$output .= '<div class="mega-menu" hidden>';
		$output .= '<div class="mega-menu__inner">';

		$output .= apply_filters( 'the_content', $panel->post_content );

		$output .= '</div></div>';
	}
}


function starter_mega_menu_assets() {
	$path = THEME_DIR . '/js/mega-menu.js';

	if ( ! file_exists( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'starter-mega-menu',
		THEME_URI . '/js/mega-menu.js',
		array(),
		filemtime( $path ),
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);
}
add_action( 'wp_enqueue_scripts', 'starter_mega_menu_assets' );