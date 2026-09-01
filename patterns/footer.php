<?php
/**
 * Title: Footer
 * Slug: starter/footer
 * Categories: starter
 * Description: Footer starting point. Insert it into a new synced pattern titled "Footer".
 *
 * HOW TO USE
 *   1. Appearance > Patterns > Add New Pattern
 *   2. Title it "Footer" — the template looks it up by that title
 *   3. Turn on the "Synced" toggle
 *   4. Insert this pattern inside it and edit the content
 *
 * App store links use Image blocks — upload the SVGs from the design.
 * Social icons use the core Social Icons block, which ships with its
 * own icon set; swap it for Image blocks if the design's icons are
 * required.
 */

?>

<!-- wp:group {"tagName":"footer","align":"full","className":"footer","layout":{"type":"constrained"}} -->
<footer class="wp-block-group alignfull footer">

	<!-- wp:group {"className":"container"} -->
	<div class="wp-block-group container">

		<!-- wp:group {"className":"footer__top"} -->
		<div class="wp-block-group footer__top">

			<!-- wp:group {"className":"footer__topLeft"} -->
			<div class="wp-block-group footer__topLeft">

				<!-- wp:group {"className":"footer__topLeft__apps"} -->
				<div class="wp-block-group footer__topLeft__apps">

					<!-- wp:heading {"level":2,"className":"footer__topLeft__appsTitle"} -->
					<h2 class="wp-block-heading footer__topLeft__appsTitle">Get The App:</h2>
					<!-- /wp:heading -->

					<!-- wp:group {"className":"footer__topLeft__appsList"} -->
					<div class="wp-block-group footer__topLeft__appsList">

						<!-- wp:paragraph {"className":"footer__topLeft__appsList__item"} -->
						<p class="footer__topLeft__appsList__item"><a href="#">App Store</a></p>
						<!-- /wp:paragraph -->

						<!-- wp:paragraph {"className":"footer__topLeft__appsList__item"} -->
						<p class="footer__topLeft__appsList__item"><a href="#">Google Play</a></p>
						<!-- /wp:paragraph -->

					</div>
					<!-- /wp:group -->

				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"footer__topLeft__social"} -->
				<div class="wp-block-group footer__topLeft__social">

					<!-- wp:heading {"level":2,"className":"footer__topLeft__socialTitle"} -->
					<h2 class="wp-block-heading footer__topLeft__socialTitle">Join Our Social Pool:</h2>
					<!-- /wp:heading -->

					<!-- wp:social-links {"className":"footer__topLeft__socialList"} -->
					<ul class="wp-block-social-links footer__topLeft__socialList">
						<!-- wp:social-link {"url":"#","service":"facebook"} /-->
						<!-- wp:social-link {"url":"#","service":"instagram"} /-->
						<!-- wp:social-link {"url":"#","service":"x"} /-->
						<!-- wp:social-link {"url":"#","service":"linkedin"} /-->
						<!-- wp:social-link {"url":"#","service":"youtube"} /-->
						<!-- wp:social-link {"url":"#","service":"tiktok"} /-->
					</ul>
					<!-- /wp:social-links -->

				</div>
				<!-- /wp:group -->

			</div>
			<!-- /wp:group -->

			<!-- wp:group {"className":"footer__topRight"} -->
			<div class="wp-block-group footer__topRight">

				<!-- wp:group {"className":"footer__topRight__menu"} -->
				<div class="wp-block-group footer__topRight__menu">

					<!-- wp:heading {"level":2,"className":"footer__topRight__menuTitle"} -->
					<h2 class="wp-block-heading footer__topRight__menuTitle">Resources:</h2>
					<!-- /wp:heading -->

					<!-- wp:list {"className":"footer__topRight__menuList"} -->
					<ul class="wp-block-list footer__topRight__menuList">
						<!-- wp:list-item -->
						<li><a href="#">News &amp; Insights</a></li>
						<!-- /wp:list-item -->
						<!-- wp:list-item -->
						<li><a href="#">Video Tutorials</a></li>
						<!-- /wp:list-item -->
						<!-- wp:list-item -->
						<li><a href="#">Case Studies</a></li>
						<!-- /wp:list-item -->
						<!-- wp:list-item -->
						<li><a href="#">FAQs</a></li>
						<!-- /wp:list-item -->
						<!-- wp:list-item -->
						<li><a href="#">Switching to Swimtopia</a></li>
						<!-- /wp:list-item -->
					</ul>
					<!-- /wp:list -->

				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"footer__topRight__menu"} -->
				<div class="wp-block-group footer__topRight__menu">

					<!-- wp:heading {"level":2,"className":"footer__topRight__menuTitle"} -->
					<h2 class="wp-block-heading footer__topRight__menuTitle">Swimtopia:</h2>
					<!-- /wp:heading -->

					<!-- wp:list {"className":"footer__topRight__menuList"} -->
					<ul class="wp-block-list footer__topRight__menuList">
						<!-- wp:list-item -->
						<li><a href="#">Company</a></li>
						<!-- /wp:list-item -->
						<!-- wp:list-item -->
						<li><a href="#">Testimonials</a></li>
						<!-- /wp:list-item -->
					</ul>
					<!-- /wp:list -->

				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"footer__topRight__menu"} -->
				<div class="wp-block-group footer__topRight__menu">

					<!-- wp:heading {"level":2,"className":"footer__topRight__menuTitle"} -->
					<h2 class="wp-block-heading footer__topRight__menuTitle">Contact:</h2>
					<!-- /wp:heading -->

					<!-- wp:group {"className":"footer__topRight__menuList"} -->
					<div class="wp-block-group footer__topRight__menuList">

						<!-- wp:paragraph {"className":"footer__topRight__menuList__item contact"} -->
						<p class="footer__topRight__menuList__item contact"><a href="tel:8778562940">877-856-2940</a></p>
						<!-- /wp:paragraph -->

						<!-- wp:paragraph {"className":"footer__topRight__menuList__item contact map"} -->
						<p class="footer__topRight__menuList__item contact map">8127 Mesa Drive<br>Suite B206-223<br>Austin, Texas 78759</p>
						<!-- /wp:paragraph -->

					</div>
					<!-- /wp:group -->

				</div>
				<!-- /wp:group -->

			</div>
			<!-- /wp:group -->

		</div>
		<!-- /wp:group -->

		<!-- wp:image {"className":"footer__logo"} -->
		<figure class="wp-block-image footer__logo"><img alt=""/></figure>
		<!-- /wp:image -->

		<!-- wp:group {"className":"footer__bottom"} -->
		<div class="wp-block-group footer__bottom">

			<!-- wp:paragraph {"className":"footer__bottomText"} -->
			<p class="footer__bottomText">© 2026 Swimtopia. All rights reserved</p>
			<!-- /wp:paragraph -->

			<!-- wp:list {"className":"footer__bottomMenu"} -->
			<ul class="wp-block-list footer__bottomMenu">
				<!-- wp:list-item -->
				<li><a href="#">Privacy Policy</a></li>
				<!-- /wp:list-item -->
				<!-- wp:list-item -->
				<li><a href="#">Terms of Service</a></li>
				<!-- /wp:list-item -->
			</ul>
			<!-- /wp:list -->

		</div>
		<!-- /wp:group -->

	</div>
	<!-- /wp:group -->

</footer>
<!-- /wp:group -->