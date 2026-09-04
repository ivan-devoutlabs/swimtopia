
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
		<?php esc_html_e( 'Skip to content', 'starter' ); ?>
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
 
				<?php
				/*
				 * The panel that opens on mobile. It carries the id the
				 * toggle points at, so the button and what it controls
				 * are connected.
				 */
				$header_classes = 'header__menu';
 
				if ( function_exists( 'get_field' ) && get_field( 'blue_header' ) ) {
					$header_classes .= ' blue-header';
				}
				?>
				<div id="header-menu-panel" class="<?php echo esc_attr( $header_classes ); ?>">
 
					<a class="header__menuLogo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<img
							src="<?php echo esc_url( get_theme_file_uri( 'assets/images/small-logo.svg' ) ); ?>"
							alt=""
							aria-hidden="true"
						>
						<span class="screen-reader-text">
							<?php
							printf(
								/* translators: %s: site name */
								esc_html__( '%s home', 'starter' ),
								esc_html( get_bloginfo( 'name' ) )
							);
							?>
						</span>
					</a>
 
					<?php
					/*
					 * A navigation landmark with a name. The label
					 * matters when a page has more than one nav — the
					 * footer has its own, and "navigation, navigation"
					 * tells a listener nothing.
					 */
					?>
					<nav class="header__nav" aria-label="<?php esc_attr_e( 'Primary', 'starter' ); ?>">
						<?php
						wp_nav_menu(
							array(
								'theme_location' => 'menu-1',
								'menu_id'        => 'primary-menu',
								'container'      => false,
								'fallback_cb'    => false,
								'walker'         => new Starter_Mega_Menu_Walker(),
							)
						);
						?>
					</nav>
 
					<?php
					/*
					 * Repeated inside the panel for mobile. Hidden from
					 * assistive technology because the same two controls
					 * already exist in the bar — a duplicate set would
					 * simply be read twice.
					 */
					?>
					<div class="header__buttonsWrapper mobile" aria-hidden="true">
						<div class="header__buttons">
 
							<a class="header__buttonsItem" href="<?php echo esc_url( home_url( '/support/' ) ); ?>" tabindex="-1">
								<img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/swimtpia-header-icon.png' ) ); ?>" alt="">
								<?php esc_html_e( 'Support', 'starter' ); ?>
							</a>
 
							<a class="header__buttonsItem" href="<?php echo esc_url( home_url( '/account/' ) ); ?>" tabindex="-1">
								<img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/swimtpia-header-icon-2.png' ) ); ?>" alt="">
								<?php esc_html_e( 'Account', 'starter' ); ?>
							</a>
 
						</div>
					</div>
 
				</div>
 
				<?php if(have_rows('header_icons', 'options')): ?>
				<div class="header__buttons">
					<?php while(have_rows('header_icons', 'options')): the_row(); 
						$icon = get_sub_field('icon');
						$icon_label = get_sub_field('icon_label');
						$icon_link = get_sub_field('icon_link');
						if($icon_link && $icon):
						?>
						<a class="header__buttonsItem" href="<?php echo $icon_link['url']; ?>">
							<?php if($icon): ?>
							<img src="<?php echo $icon['url']; ?>" alt="">
							<?php endif; ?>
							<?php if($icon_label): ?>
							<span class="header__buttonsLabel"><?php echo $icon_label; ?></span>
							<?php endif; ?>
						</a>
					<?php endif; endwhile; ?>
				</div>
				<?php endif; ?>
 
				<div class="header__toggleWrapper">
					<button
						type="button"
						class="header__toggle"
						aria-expanded="false"
						aria-controls="header-menu-panel"
					>
						<span class="header__toggleIcon" aria-hidden="true">
							<span></span>
							<span></span>
							<span></span>
						</span>
						<span class="screen-reader-text header__toggleLabel">
							<?php esc_html_e( 'Menu', 'starter' ); ?>
						</span>
					</button>
				</div>
 
			</div>
		</div>
	</header>