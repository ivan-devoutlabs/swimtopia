<?php
/**
 * Title: Case Study Preview
 * Slug: starter/case-study-preview
 * Categories: theme
 */

?>
<!-- wp:group {"align":"full","className":"caseStudyPreview","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull caseStudyPreview">

    <!-- wp:group {"className":"container"} -->
    <div class="wp-block-group container">

        <!-- wp:heading {"className":"caseStudyPreview__title"} -->
        <h2 class="wp-block-heading caseStudyPreview__title">Poolside Spotlight</h2>
        <!-- /wp:heading -->

        <!-- wp:query {"queryId":5,"query":{"perPage":6,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{"relation":"AND","taxonomies":[{"taxonomy":"category","terms":[30]}],"parents":[]},"parents":[]},"className":"caseStudyPreview__query"} -->
        <div class="wp-block-query caseStudyPreview__query">

            <!-- wp:post-template {"className":"caseStudyPreview__slider"} -->

                <!-- wp:group {"className":"caseStudyPreview__sliderItem"} -->
                <div class="wp-block-group caseStudyPreview__sliderItem">

                    <!-- wp:post-featured-image {"isLink":false,"className":"caseStudyPreview__sliderItem__bg"} /-->

                    <!-- wp:group {"className":"caseStudyPreview__sliderItem__content"} -->
                    <div class="wp-block-group caseStudyPreview__sliderItem__content">

                        <!-- wp:post-title {"level":4,"isLink":true,"className":"caseStudyPreview__sliderItem__title"} /-->
                        <!-- wp:group {"className":"caseStudyPreview__sliderItem__button"} -->
                        <div class="wp-block-group caseStudyPreview__sliderItem__button">
                            <!-- wp:read-more {"content":"View Case Study","className":"wp-block-button__link"} /-->
                        </div>
                        <!-- /wp:group -->

                    </div>
                    <!-- /wp:group -->

                </div>
                <!-- /wp:group -->

            <!-- /wp:post-template -->

            <!-- wp:query-no-results -->
                <!-- wp:paragraph -->
                <p>No case studies yet.</p>
                <!-- /wp:paragraph -->
            <!-- /wp:query-no-results -->

        </div>
        <!-- /wp:query -->

    </div>
    <!-- /wp:group -->

</div>
<!-- /wp:group -->