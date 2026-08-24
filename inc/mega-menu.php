<?php
/**
 * Мега-меню.
 *
 * ІДЕЯ
 *   Структуру меню клієнт тримає там, де звик — у «Вигляд → Меню».
 *   Вміст випадної панелі редагує блоками, як звичайну сторінку.
 *   Зв'язок між ними — вибір панелі просто в налаштуваннях пункту меню.
 *
 *   Так не доводиться ні описувати колонки полями (у ACF це виходить
 *   громіздко), ні змушувати клієнта вписувати CSS-класи.
 *
 * СКЛАДОВІ
 *   1. Тип запису «Панелі меню» — приховані записи з блоковим редактором.
 *   2. Поле «Панель меню» в кожному пункті меню.
 *   3. Walker, який підставляє вміст панелі замість звичайного підменю.
 *
 * Підключіть у functions.php:
 *   require THEME_DIR . '/inc/mega-menu.php';
 *
 * @package Starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------------------------------------------------------------------
 * 1. Тип запису для панелей
 * ------------------------------------------------------------------ */

/**
 * Панелі — окремий тип запису, а не сторінки: інакше вони засмічували б
 * список сторінок і могли б випадково відкритися за своїм URL.
 *
 * public => false робить їх недоступними ззовні, але редагування
 * блоками лишається завдяки show_ui + show_in_rest.
 */
function starter_register_menu_panels() {

	register_post_type(
		'starter_panel',
		array(
			'labels'          => array(
				'name'          => __( 'Панелі меню', 'starter' ),
				'singular_name' => __( 'Панель меню', 'starter' ),
				'add_new_item'  => __( 'Додати панель', 'starter' ),
				'edit_item'     => __( 'Редагувати панель', 'starter' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => 'themes.php',   // поруч із меню й віджетами
			'show_in_rest'    => true,           // без цього не буде блоків
			'supports'        => array( 'title', 'editor', 'revisions' ),
			'capability_type' => 'page',
		)
	);
}
add_action( 'init', 'starter_register_menu_panels' );

/* ---------------------------------------------------------------------
 * 2. Поле вибору панелі в пункті меню
 * ------------------------------------------------------------------ */

/**
 * Хук wp_nav_menu_item_custom_fields з'явився у WordPress 5.4 —
 * саме він дозволяє додати своє поле без плагінів і без хаків
 * із перевизначенням Walker_Nav_Menu_Edit.
 */
function starter_menu_item_panel_field( $item_id, $item, $depth ) {

	// Панель має сенс лише на верхньому рівні
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
			<?php esc_html_e( 'Панель меню', 'starter' ); ?><br>
			<select
				id="starter-panel-<?php echo esc_attr( $item_id ); ?>"
				name="starter_panel[<?php echo esc_attr( $item_id ); ?>]"
				class="widefat"
			>
				<option value=""><?php esc_html_e( '— звичайне підменю —', 'starter' ); ?></option>
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

/**
 * Збереження вибору.
 */
function starter_save_menu_item_panel( $menu_id, $menu_item_db_id ) {

	// phpcs:ignore WordPress.Security.NonceVerification.Missing -- перевіряє ядро
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

/* ---------------------------------------------------------------------
 * 3. Walker
 * ------------------------------------------------------------------ */

/**
 * Підставляє вміст панелі замість звичайного підменю.
 *
 * Пункти без обраної панелі працюють як раніше — це важливо, бо в
 * одному меню зазвичай є і мега-панелі, і прості випадайки.
 */
class Starter_Mega_Menu_Walker extends Walker_Nav_Menu {

	/**
	 * Кнопка-перемикач для клавіатури.
	 *
	 * Наведення мишкою вирішує CSS, але без кнопки панель була б
	 * недоступна тим, хто ходить сайтом табом.
	 */
	private function toggle_button( $item ) {
		return sprintf(
			'<button type="button" class="menu-toggle" aria-expanded="false" aria-label="%s"><span class="menu-toggle__icon" aria-hidden="true"></span></button>',
			esc_attr(
				sprintf(
					/* translators: %s: назва пункту меню */
					__( 'Розгорнути «%s»', 'starter' ),
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

		/*
		 * the_content потрібен, щоб працювали блоки, шорткоди та
		 * стилі ядра. Вміст уже пройшов санітизацію в редакторі.
		 */
		$output .= apply_filters( 'the_content', $panel->post_content );

		$output .= '</div></div>';
	}
}

/* ---------------------------------------------------------------------
 * 4. Скрипт
 * ------------------------------------------------------------------ */

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