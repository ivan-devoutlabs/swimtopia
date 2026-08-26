<?php
/**
 * Title: Upcoming Webinars
 * Slug: starter/upcoming-webinars
 * Categories: theme
 */

?>

<!-- wp:group {"align":"full","className":"upcomingWebinars blogPreview","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull upcomingWebinars blogPreview">
    <!-- wp:group {"align":"full","className":"upcomingWebinars__content"} -->
    <div class="wp-block-group alignfull upcomingWebinars__content">
	<!-- wp:group {"className":"container"} -->
	<div class="wp-block-group container">

		<!-- wp:paragraph {"className":"upcomingWebinars__tag"} -->
		<p class="upcomingWebinars__tag">Upcoming Webinars</p>
		<!-- /wp:paragraph -->

		<!-- wp:query {"queryId":4,"query":{"perPage":100,"pages":0,"offset":0,"postType":"webinars","order":"asc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":null,"parents":[]},"className":"upcomingWebinars__query"} -->
		<div class="wp-block-query upcomingWebinars__query">

			<!-- wp:post-template {"className":"upcomingWebinars__list blogPreview__list"} -->

				<!-- wp:group {"className":"upcomingWebinars__listItem webinarsPreview__listItem"} -->
				<div class="wp-block-group upcomingWebinars__listItem webinarsPreview__listItem">

					<!-- wp:post-featured-image {"isLink":true,"className":"webinarsPreview__listItem__image"} /-->

					<!-- wp:group {"className":"webinarsPreview__listItem__content"} -->
					<div class="wp-block-group webinarsPreview__listItem__content">

						<!-- wp:group {"className":"webinarsPreview__listItem__top"} -->
						<div class="wp-block-group webinarsPreview__listItem__top">

							<!-- wp:post-terms {"term":"webinars-categories","className":"webinarsPreview__listItem__cat"} /-->

							<!-- wp:post-date {"format":"d/m/y","className":"webinarsPreview__listItem__date"} /-->

						</div>
						<!-- /wp:group -->

						<!-- wp:post-title {"level":3,"isLink":true,"className":"webinarsPreview__listItem__title"} /-->
                        <!-- wp:group {"className":"webinarsPreview__listItem__top"} -->
						<div class="wp-block-group webinarsPreview__listItem__button">
						    <!-- wp:read-more {"content":"View Webinar","className":"wp-block-button__link"} /-->
                        </div>
					    <!-- /wp:group -->
					</div>
					<!-- /wp:group -->

				</div>
				<!-- /wp:group -->

			<!-- /wp:post-template -->

			<!-- wp:query-no-results -->
				<!-- wp:paragraph -->
				<p>No webinars found.</p>
				<!-- /wp:paragraph -->
			<!-- /wp:query-no-results -->

		</div>
		<!-- /wp:query -->

	</div>
	<!-- /wp:group -->

</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->