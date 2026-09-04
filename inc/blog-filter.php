<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'THEME_BLOG_PER_PAGE', 9 );


function starter_blog_query_args( $categories = array(), $paged = 1 ) {
    $args = array(
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => THEME_BLOG_PER_PAGE,
        'paged'          => max( 1, (int) $paged ),
    );

    $categories = array_filter( array_map( 'sanitize_title', (array) $categories ) );

    if ( $categories ) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'category',
                'field'    => 'slug', 
                'terms'    => $categories,
                'operator' => 'IN',
            ),
        );
    }

    return $args;
}


function starter_blog_render_list( WP_Query $query ) {

	if ( ! $query->have_posts() ) {
		echo '<p class="blog__empty">' . esc_html__( 'Nothing was found.', 'starter' ) . '</p>';
		return;
	}

	while ( $query->have_posts() ) :
		$query->the_post();
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
						<?php echo get_the_term_list( get_the_ID(), 'category', '', ', ' ); ?>
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
	endwhile;

	wp_reset_postdata();
}

function starter_blog_render_pagination( WP_Query $query, $paged = 1 ) {

	if ( $query->max_num_pages < 2 ) {
		return;
	}

	echo paginate_links(
		array(
			'total'     => $query->max_num_pages,
			'current'   => max( 1, (int) $paged ),
			'type'      => 'list',
			'prev_text' => esc_html__( 'Previous', 'starter' ),
			'next_text' => esc_html__( 'Next', 'starter' ),

			'base'      => add_query_arg( 'paged', '%#%' ),
			'format'    => '',
		)
	);
}


function starter_blog_current_categories() {
    $raw = isset( $_GET['cats'] ) ? sanitize_text_field( wp_unslash( $_GET['cats'] ) ) : '';

    if ( ! $raw ) {
        return array();
    }

    return array_values( array_filter( array_map( 'sanitize_title', explode( ',', $raw ) ) ) );
}


function starter_blog_section() {

	$selected = starter_blog_current_categories();

	$paged = isset( $_GET['paged'] ) ? absint( $_GET['paged'] ) : 1;

	$query = new WP_Query( starter_blog_query_args( $selected, $paged ) );

	$terms = get_terms(
		array(
			'taxonomy'   => 'category',
			'hide_empty' => true,
		)
	);

	if ( is_wp_error( $terms ) ) {
		$terms = array();
	}

	$base_url = get_permalink();
	?>

	<section class="blog" data-blog-filter>
		<div class="container">

			<div class="blog__top">

				<h2 class="blog__title"><?php esc_html_e( 'Articles', 'starter' ); ?></h2>

				<div class="blog__filterWrapper">

					<div class="blog__filterActive">
                    <?php foreach ( $selected as $term_slug ) : ?>
                        <?php 
                        $term = get_term_by( 'slug', $term_slug, 'category' ); 
                        ?>
                        <?php if ( $term && ! is_wp_error( $term ) ) : ?>
                            <div class="blog__filterActive__item" data-term="<?php echo esc_attr( $term_slug ); ?>">
                                <button
                                    type="button"
                                    class="blog__filterActive__itemRemove"
                                    aria-label="<?php echo esc_attr( sprintf( __( 'Remove Filters «%s»', 'starter' ), $term->name ) ); ?>"
                                ></button>
                                <span class="blog__filterActive__itemLabel"><?php echo esc_html( $term->name ); ?></span>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>

					<div class="blog__filterList__wrapper">

						<div class="blog__filterList__top">
							<button type="button" class="blog__filterList__toggle" aria-expanded="false">
								<?php esc_html_e( 'categories', 'starter' ); ?>
							</button>

							<button type="button" class="blog__filterList__clear">
								<?php esc_html_e( 'Clear Filters', 'starter' ); ?>
							</button>
						</div>

						<div class="blog__filterList">
							<?php foreach ( $terms as $term ) : ?>
								<?php
								$is_active = in_array( $term->slug, $selected, true );

								$next = $is_active
									? array_diff( $selected, array( $term->slug ) )
									: array_merge( $selected, array( $term->slug ) );

								$href = $next
									? add_query_arg( 'cats', implode( ',', $next ), $base_url )
									: remove_query_arg( array( 'cats', 'paged' ), $base_url );
								?>
								<a
									class="blog__filterList__item<?php echo $is_active ? ' is-active' : ''; ?>"
									href="<?php echo esc_url( $href ); ?>"
									data-term="<?php echo esc_attr( $term->slug ); ?>" 
									aria-pressed="<?php echo $is_active ? 'true' : 'false'; ?>"
								>
									<?php echo esc_html( $term->name ); ?>
								</a>
							<?php endforeach; ?>
						</div>

					</div>

				</div>

			</div>

			<ul class="blog__list" aria-live="polite" aria-busy="false">
				<?php starter_blog_render_list( $query ); ?>
			</ul>

			<div class="blog__pagination">
				<?php starter_blog_render_pagination( $query, $paged ); ?>
			</div>

		</div>
	</section>

	<?php
}


function starter_blog_filter_ajax() {

	check_ajax_referer( 'starter_blog_filter', 'nonce' );

    $categories = isset( $_POST['cats'] )
        ? array_filter( array_map( 'sanitize_title', explode( ',', sanitize_text_field( wp_unslash( $_POST['cats'] ) ) ) ) )
        : array();

    $paged = isset( $_POST['paged'] ) ? absint( $_POST['paged'] ) : 1;

    $query = new WP_Query( starter_blog_query_args( $categories, $paged ) );

	ob_start();
	starter_blog_render_list( $query );
	$list = ob_get_clean();

	ob_start();
	starter_blog_render_pagination( $query, $paged );
	$pagination = ob_get_clean();

	wp_send_json_success(
		array(
			'list'       => $list,
			'pagination' => $pagination,
			'found'      => (int) $query->found_posts,
		)
	);
}
add_action( 'wp_ajax_starter_blog_filter', 'starter_blog_filter_ajax' );
add_action( 'wp_ajax_nopriv_starter_blog_filter', 'starter_blog_filter_ajax' );



function starter_blog_filter_assets() {

    if ( ! has_block( 'starter/blog-filter' ) ) {
        return;
    }

	$path = THEME_DIR . '/js/blog-filter.js';

	if ( ! file_exists( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'starter-blog-filter',
		THEME_URI . '/js/blog-filter.js',
		array(),
		filemtime( $path ),
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	wp_add_inline_script(
		'starter-blog-filter',
		'window.starterBlogFilter = ' . wp_json_encode(
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'starter_blog_filter' ),
			)
		) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'starter_blog_filter_assets' );


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_register_blog_block() {



    $dir = get_theme_file_path( '/blocks/blog-filter' );

    if ( ! file_exists( $dir . '/block.json' ) ) {
        return;
    }

    $script_path = get_theme_file_path( '/js/blog-filter-block.js' );
    $script_uri  = get_theme_file_uri( '/js/blog-filter-block.js' );
    
    $args = array();

    if ( file_exists( $script_path ) ) {
        wp_register_script(
            'blog-filter-block',
            $script_uri,
            array(
                'wp-blocks',
                'wp-element',
                'wp-block-editor',
                'wp-components',
                'wp-server-side-render',
                'wp-i18n',
            ),
            filemtime( $script_path ),
            true
        );
        $args['editor_script'] = 'blog-filter-block';
        wp_enqueue_script('blog-filter-block');
    }

    register_block_type( $dir, $args );
}
add_action( 'init', 'starter_register_blog_block' );