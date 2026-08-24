<?php
/**
 * Title: Blog Preview
 * Slug: starter/blog-preview
 * Categories: theme
 */

?>

<!-- wp:group {"align":"full","className":"blogPreview","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull blogPreview">

	<!-- wp:group {"className":"container"} -->
	<div class="wp-block-group container">

		<!-- wp:group {"className":"blogPreview__content"} -->
		<div class="wp-block-group blogPreview__content">

			<!-- wp:group {"className":"blogPreview__top"} -->
			<div class="wp-block-group blogPreview__top">

				<!-- wp:heading {"className":"blogPreview__title"} -->
				<h2 class="wp-block-heading blogPreview__title">Making waves and news</h2>
				<!-- /wp:heading -->

				<!-- wp:buttons {"className":"blogPreview__button"} -->
				<div class="wp-block-buttons blogPreview__button">
					<!-- wp:button -->
					<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">View Our Blog</a></div>
					<!-- /wp:button -->
				</div>
				<!-- /wp:buttons -->

			</div>
			<!-- /wp:group -->

			<!-- wp:query {"queryId":2,"query":{"perPage":9,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":null,"parents":[]},"className":"blogPreview__query"} -->
			<div class="wp-block-query blogPreview__query">

				<!-- wp:post-template {"className":"blogPreview__list"} -->

					<!-- wp:group {"className":"blogPreview__listItem"} -->
					<div class="wp-block-group blogPreview__listItem">

						<!-- wp:post-featured-image {"isLink":true,"className":"blogPreview__listItem__image"} /-->

						<!-- wp:group {"className":"blogPreview__listItem__content"} -->
						<div class="wp-block-group blogPreview__listItem__content">

							<!-- wp:group {"className":"blogPreview__listItem__top"} -->
							<div class="wp-block-group blogPreview__listItem__top">

								<!-- wp:post-terms {"term":"category","className":"blogPreview__listItem__tag"} /-->

								<!-- wp:starter/reading-time /-->

							</div>
							<!-- /wp:group -->

							<!-- wp:post-title {"level":3,"isLink":true,"className":"blogPreview__listItem__title"} /-->

							<!-- wp:read-more {"content":"View Blog","className":"blogPreview__listItem__button"} /-->

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