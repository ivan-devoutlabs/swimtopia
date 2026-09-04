<?php
/**
 * 404 page.
 *
 * @package Starter
 */

get_header();
?>

<main id="primary" class="site-main">

	<?php
	starter_render_synced_pattern( '404 Page', 'starter_404_fallback' );
	?>

</main>

<?php
get_footer();
function starter_404_fallback( $title ) {
	?>
	<section class="errorPage errorPage--fallback">
		<div class="container">

			<h1 class="errorPage__title">
				<?php esc_html_e( 'Oops, did you drop something in the pool?', 'starter' ); ?>
			</h1>

			<p class="errorPage__text">
				<?php esc_html_e( 'The page you are looking for doesn\'t exist.', 'starter' ); ?>
			</p>

			<p class="errorPage__button">
				<a class="wp-block-button__link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<?php esc_html_e( 'Just Keep Swimming', 'starter' ); ?>
				</a>
			</p>

			<?php starter_missing_pattern_notice( $title ); ?>

		</div>
	</section>
	<?php
}