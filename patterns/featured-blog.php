<?php 
/**
 * Title: Featured Blog
 * Slug: starter/featured-blog
 * Categories: theme
 */

?>

<!-- wp:group {"align":"full","className":"blogPreview","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull featuredBlog">

	<!-- wp:group {"className":"container"} -->
	<div class="wp-block-group container">


			<!-- wp:group {"className":"featuredBlog__top"} -->
			<div class="wp-block-group featuredBlog__top">

				<!-- wp:paragraph {"className":"featuredBlog__top"} -->
				<p class="featuredBlog__label">Featured</p>
				<!-- /wp:paragraph -->

			</div>
			<!-- /wp:group -->

			<!-- wp:query {"queryId":2,"query":{"perPage":9,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":null,"parents":[]},"className":"featuredBlog__list"} -->
			<div class="wp-block-query featuredBlog__list">

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

							<!-- wp:group {"className":"blogPreview__listItem__button"} -->
							<div class="blogPreview__listItem__button">
								<!-- wp:read-more {"content":"View Blog","className":"wp-block-button__link"} /-->
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