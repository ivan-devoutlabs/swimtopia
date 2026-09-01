<?php
/**
 * Title: Team List
 * Slug: theme/team-list
 * Categories: theme
 */
?>

<!-- wp:group {"tagName":"section","className":"team","layout":{"type":"constrained"}} -->
<div class="wp-block-group team teamBlock">

    <!-- wp:group {"className":"container","layout":{"type":"constrained"}} -->
    <div class="wp-block-group container">

        <!-- wp:query {"queryId":3,"query":{"perPage":100,"pages":0,"offset":0,"postType":"team","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"className":"team__query"} -->
        <div class="wp-block-query team__query">

            <!-- wp:post-template {"className":"team__list"} -->
            
                <!-- wp:group {"className":"team__listItem"} -->
                <div class="wp-block-group team__listItem">

                    <!-- wp:post-featured-image {"isLink":false,"className":"team__listItem__image"} /-->

                    <!-- wp:group {"className":"team__listItem__content"} -->
                    <div class="wp-block-group team__listItem__content">
                        
                        <!-- wp:post-title {"level":6,"isLink":false,"className":"team__listItem__title"} /-->

                        <!-- wp:theme/member-position /-->

                        <!-- wp:group {"className":"team__listItem__button"} -->
                        <div class="wp-block-group team__listItem__button">
                            <!-- wp:read-more {"content":"View Profile","className":"wp-block-button__link"} /-->
                        </div>
                        <!-- /wp:group -->

                    </div>
                    <!-- /wp:group -->

                    <!-- wp:post-content {"showMoreOnNewLine":false,"className":"team__listItem__text"} /-->

                </div>
                <!-- /wp:group -->

            <!-- /wp:post-template -->

            <!-- wp:query-no-results -->
                <!-- wp:paragraph -->
                <p>Team members not found.</p>
                <!-- /wp:paragraph -->
            <!-- /wp:query-no-results -->

        </div>
        <!-- /wp:query -->

    </div>
    <!-- /wp:group -->

</div>
<!-- /wp:group -->