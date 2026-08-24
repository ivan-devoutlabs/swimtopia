<?php
/**
 * Шапка сайту.
 *
 * @package Starter
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">

	<a class="skip-link screen-reader-text" href="#primary">
		<?php esc_html_e( 'Перейти до вмісту', 'starter' ); ?>
	</a>

	<header id="masthead" class="header">
		<div class="container">
			<div class="header__inner">

				<div class="header__logo">
					<?php
					if ( has_custom_logo() ) {
						the_custom_logo();
					} else {
						printf(
							'<a class="title" href="%s">%s</a>',
							esc_url( home_url( '/' ) ),
							esc_html( get_bloginfo( 'name' ) )
						);
					}
					?>
				</div>

				<div class="header__menu">
					<?php
					wp_nav_menu( array(
						'theme_location' => 'menu-1',
						'menu_id'        => 'primary-menu',
						'container'      => false,
						'fallback_cb'    => false,
						'walker'         => new Starter_Mega_Menu_Walker(),
					) );
					?>
					<div class="header__buttonsWrapper mobile">
						<div class="header__buttons">
							<div class="header__buttonsItem"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/swimtpia-header-icon.png" alt="">Support</div>
							<div class="header__buttonsItem"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/swimtpia-header-icon-2.png" alt="">Account</div>
						</div>
					</div>
				</div>

				<div class="header__buttons">
					<div class="header__buttonsItem"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/swimtpia-header-icon.png" alt=""></div>
					<div class="header__buttonsItem"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/swimtpia-header-icon-2.png" alt=""></div>
				</div>
				<div class="header__toggleWrapper">
					<div class="header__toggle">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		</div>
	</header>
