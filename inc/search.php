<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'STARTER_SEARCH_GROUP_LIMIT', 12 );

function starter_search_post_types() {
	return apply_filters(
		'starter_search_post_types',
		array(
			'post'     => __( 'Articles', 'starter' ),
		)
	);
}

function starter_search_group_query( $post_type, $search, $limit = null, $paged = 1 ) {
	return new WP_Query(
		array(
			'post_type'      => $post_type,
			'post_status'    => 'publish',
			's'              => $search,
			'posts_per_page' => $limit ? (int) $limit : STARTER_SEARCH_GROUP_LIMIT,
			'paged'          => $paged,
		)
	);
}

function starter_search_card_post() {
	?>
	<li <?php post_class( 'blogPreview__listItem' ); ?>>

		<?php if ( has_post_thumbnail() ) : ?>
			<figure class="blogPreview__listItem__image">
				<a href="<?php the_permalink(); ?>">
					<?php the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); ?>
				</a>
			</figure>
		<?php endif; ?>

		<div class="blogPreview__listItem__content">

			<div class="blogPreview__listItem__top">
				<?php if(!empty(get_the_term_list( get_the_ID(), 'category', '', ', ' ))): ?>
				<div class="blogPreview__listItem__tag">
					<?php echo get_the_term_list( get_the_ID(), 'category', '', ', ' );  ?>
				</div>
				<?php endif; ?>
				<div class="blogPreview__listItem__time">
					<?php echo esc_html( reading_time_label() ); ?>
				</div>
			</div>

			<h3 class="blogPreview__listItem__title">
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h3>

            <div class="blogPreview__listItem__button">
				<a class="wp-block-button__link wp-block-read-more" href="<?php the_permalink(); ?>" target="_self"><?php esc_html_e( 'View Blog', 'starter' ); ?></a>
			</div>

		</div>

	</li>
	<?php
}

function starter_search_card_webinar() {
	?>
	<li <?php post_class( 'webinarsPreview__listItem' ); ?>>

		<?php if ( has_post_thumbnail() ) : ?>
			<figure class="webinarsPreview__listItem__image">
				<a href="<?php the_permalink(); ?>">
					<?php the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); ?>
				</a>
			</figure>
		<?php endif; ?>

		<div class="webinarsPreview__listItem__content">

			<div class="webinarsPreview__listItem__top">
				<div class="webinarsPreview__listItem__cat">
					<?php echo get_the_term_list( get_the_ID(), 'webinars-categories', '', ', ' ); ?>
				</div>
				<div class="webinarsPreview__listItem__date">
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
						<?php echo esc_html( get_the_date( 'd/m/y' ) ); ?>
					</time>
				</div>
			</div>

			<h3 class="webinarsPreview__listItem__title">
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h3>

			<div class="webinarsPreview__listItem__button">
				<a class="wp-block-button__link" href="<?php the_permalink(); ?>">
					<?php esc_html_e( 'View Webinar', 'starter' ); ?>
				</a>
			</div>

		</div>

	</li>
	<?php
}


function starter_search_card_page() {
	?>
	<li <?php post_class( 'searchResults__page' ); ?>>

		<h3 class="searchResults__page__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h3>

		<?php if ( has_excerpt() || get_the_excerpt() ) : ?>
			<p class="searchResults__page__text">
				<?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?>
			</p>
		<?php endif; ?>

	</li>
	<?php
}
function starter_search_card( $post_type ) {
	switch ( $post_type ) {
		case 'webinars':
			starter_search_card_webinar();
			break;
		case 'page':
			starter_search_card_page();
			break;
		default:
			starter_search_card_post();
	}
}

function starter_search_list_class( $post_type ) {
	$map = array(
		'post'     => 'blogPreview__list',
		'webinars' => 'webinarsPreview__list',
		'page'     => 'searchResults__pages',
	);
	return isset( $map[ $post_type ] ) ? $map[ $post_type ] : 'searchResults__list';
}


function starter_search_filter_main_query( $query ) {
	if ( ! is_admin() && $query->is_main_query() && $query->is_search() ) {
		$query->set( 'post_type', 'post' );
		$query->set( 'posts_per_page', STARTER_SEARCH_GROUP_LIMIT );
	}
}
add_action( 'pre_get_posts', 'starter_search_filter_main_query' );