<?php
/**
 * Title: Webinars Preview List
 * Slug: starter/webinars-preview-list
 * Categories: theme
 */

?>

<!-- wp:group {"align":"full","className":"webinarsPreview","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull webinarsPreview">

	<!-- wp:group {"className":"container"} -->
	<div class="wp-block-group container">

		<!-- wp:group {"className":"webinarsPreview__content"} -->
		<div class="wp-block-group webinarsPreview__content">

			<!-- wp:heading {"className":"webinarsPreview__title"} -->
			<h2 class="wp-block-heading webinarsPreview__title">Take a Deeper Dive</h2>
			<!-- /wp:heading -->

			<!-- wp:query {"queryId":3,"query":{"perPage":3,"pages":0,"offset":0,"postType":"webinars","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":null,"parents":[]},"className":"webinarsPreview__query"} -->
			<div class="wp-block-query webinarsPreview__query">

				<!-- wp:post-template {"className":"webinarsPreview__list"} -->

					<!-- wp:group {"className":"webinarsPreview__listItem"} -->
					<div class="wp-block-group webinarsPreview__listItem">

						<!-- wp:post-featured-image {"isLink":true,"className":"webinarsPreview__listItem__image"} /-->

						<!-- wp:group {"className":"webinarsPreview__listItem__content"} -->
						<div class="wp-block-group webinarsPreview__listItem__content">

							<!-- wp:group {"className":"webinarsPreview__listItem__top"} -->
							<div class="wp-block-group webinarsPreview__listItem__top">

								<!-- wp:post-terms {"term":"webinars-categories","isLink":false,"className":"webinarsPreview__listItem__cat"} /-->

								<!-- wp:post-date {"format":"d/m/y","className":"webinarsPreview__listItem__date"} /-->

							</div>
							<!-- /wp:group -->

							<!-- wp:post-title {"level":3,"isLink":true,"className":"webinarsPreview__listItem__title"} /-->

							
							<!-- wp:group {"className":"webinarsPreview__listItem__button"} -->
							<div class="wp-block-group webinarsPreview__listItem__button">
							<!-- wp:read-more {"content":"Learn More","className":" wp-block-button__link"} /-->
							</div>
							<!-- /wp:group -->

						</div>
						<!-- /wp:group -->

					</div>
					<!-- /wp:group -->

				<!-- /wp:post-template -->

				<!-- wp:query-no-results -->
					<!-- wp:paragraph -->
					<p>No posts found.</p>
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