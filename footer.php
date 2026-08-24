<?php
/**
 * Підвал сайту.
 *
 * Підвал збирається блоками на прихованій сторінці зі слагом "global-footer".
 * Якщо такої сторінки немає — виводиться простий запасний варіант.
 * Так контент-менеджер редагує підвал у звичному редакторі, а не в коді.
 *
 * @package Starter
 */

?>
<footer class="footer">
	<div class="container">
		<div class="footer__top">
			<div class="footer__topLeft">
				<div class="footer__topLeft__apps">
					<div class="footer__topLeft__appsTitle">Get The App:</div>
					<div class="footer__topLeft__appsList">
						<a href="" class="footer__topLeft__appsList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Apple.svg'); ?>App Store</a>
						<a href="" class="footer__topLeft__appsList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/playmarket.svg'); ?>Google Play</a>
					</div>
				</div>
				<div class="footer__topLeft__social">
					<div class="footer__topLeft__socialTitle">Join Our Social Pool:</div>
					<div class="footer__topLeft__socialList">
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector.svg'); ?></a>
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector-1.svg'); ?></a>
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector-2.svg'); ?></a>
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector-3.svg'); ?></a>
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector-4.svg'); ?></a>
						<a href="#" class="footer__topLeft__socialList__item"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/Vector-5.svg'); ?></a>
					</div>
				</div>
			</div>
			<div class="footer__topRight">
				<div class="footer__topRight__menu">
					<div class="footer__topRight__menuTitle">Resources:</div>
					<div class="footer__topRight__menuList">
						<a href="#" class="footer__topRight__menuList__item">News & Insights</a>
						<a href="#" class="footer__topRight__menuList__item">Video Tutorials</a>
						<a href="#" class="footer__topRight__menuList__item">Case Studies</a>
						<a href="#" class="footer__topRight__menuList__item">FAQs</a>
						<a href="#" class="footer__topRight__menuList__item">Switching to Swimtopia</a>
					</div>
				</div>
				<div class="footer__topRight__menu">
					<div class="footer__topRight__menuTitle">Swimtopia:</div>
					<div class="footer__topRight__menuList">
						<a href="#" class="footer__topRight__menuList__item">Company</a>
						<a href="#" class="footer__topRight__menuList__item">Testimonials</a>
					</div>
				</div>
				<div class="footer__topRight__menu">
					<div class="footer__topRight__menuTitle">Contact:</div>
					<div class="footer__topRight__menuList">
						<a href="#" class="footer__topRight__menuList__item contact"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/phone-icon.svg'); ?> 877-856-2940</a>
						<a href="#" class="footer__topRight__menuList__item contact map"><?php echo file_get_contents(get_template_directory_uri() . '/assets/images/map-icon.svg'); ?> 8127 Mesa Drive <br>Suite B206-223<br>Austin, Texas 78759</a>
					</div>
				</div>
			</div>
		</div>
		<div class="footer__logo"><img src="<?php echo get_template_directory_uri() ?>/assets/images/footer-logo.png" alt=""></div>
		<div class="footer__bottom">
			<div class="footer__bottomText">© 2026 Swimtopia. All rights reserved</div>
			<div class="footer__bottomMenu">
				<div class="footer__bottomMenu__item"><a href="#">Privacy Policy</a></div>
				<div class="footer__bottomMenu__item"><a href="#">Terms of Service</a></div>
			</div>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
