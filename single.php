<?php
/**
 * Одиночний запис.
 *
 * @package Starter
 */

get_header();
?>

<main id="primary" class="site-main">

	<?php
	while ( have_posts() ) :
		the_post();
		?>

		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

			<header class="entry-header has-global-padding">
				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
				<div class="entry-meta">
					<?php starter_posted_on(); ?>
				</div>
			</header>

			<?php if ( has_post_thumbnail() ) : ?>
				<figure class="post-thumbnail">
					<?php the_post_thumbnail( 'full' ); ?>
				</figure>
			<?php endif; ?>

			<div class="entry-content">
				<?php
				the_content();

				wp_link_pages(
					array(
						'before' => '<div class="page-links">',
						'after'  => '</div>',
					)
				);
				?>
			</div>

		</article>

		<?php
		if ( comments_open() || get_comments_number() ) {
			comments_template();
		}

		the_post_navigation(
			array(
				'prev_text' => '&larr; %title',
				'next_text' => '%title &rarr;',
			)
		);

	endwhile;
	?>

</main>

<?php
get_footer();
