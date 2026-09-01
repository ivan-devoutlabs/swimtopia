( function ( global ) {
    'use strict';

    document.addEventListener( 'DOMContentLoaded', function () {
        var sections = document.querySelectorAll( '.caseStudyPreview' );

        sections.forEach( function ( section ) {
            var track = section.querySelector( '.caseStudyPreview__slider' );
            if ( ! track ) return;

            var slides = Array.prototype.slice.call( track.children ).filter( function ( node ) {
                return node.nodeType === 1 && ( node.classList.contains( 'caseStudyPreview__sliderItem' ) || node.querySelector( '.caseStudyPreview__sliderItem' ) );
            } );

            if ( slides.length < 2 ) return;

            var viewport = section.querySelector( '.caseStudyPreview__viewport' );
            if ( ! viewport ) {
                viewport = document.createElement( 'div' );
                viewport.className = 'caseStudyPreview__viewport swiper';
                track.parentNode.insertBefore( viewport, track );
                viewport.appendChild( track );
            } else {
                viewport.classList.add( 'swiper' );
            }

            track.classList.add( 'swiper-wrapper' );
            slides.forEach( function ( slide ) {
                slide.classList.add( 'swiper-slide' );
            } );

            var arrowsHolder = section.querySelector( '.caseStudyPreview__arrows' );
            if ( ! arrowsHolder ) {
                arrowsHolder = document.createElement( 'div' );
                arrowsHolder.className = 'caseStudyPreview__arrows';
                viewport.parentNode.insertBefore( arrowsHolder, viewport );
            }

            var l10n = global.starterCaseStudyL10n || {};

            var prevBtn = arrowsHolder.querySelector( '.caseStudyPreview__arrow--prev' );
            if ( ! prevBtn ) {
                prevBtn = document.createElement( 'button' );
                prevBtn.type = 'button';
                prevBtn.className = 'caseStudyPreview__arrow caseStudyPreview__arrow--prev';
                prevBtn.setAttribute( 'aria-label', l10n.prev || 'Previous case study' );
                arrowsHolder.appendChild( prevBtn );
            }

            var nextBtn = arrowsHolder.querySelector( '.caseStudyPreview__arrow--next' );
            if ( ! nextBtn ) {
                nextBtn = document.createElement( 'button' );
                nextBtn.type = 'button';
                nextBtn.className = 'caseStudyPreview__arrow caseStudyPreview__arrow--next';
                nextBtn.setAttribute( 'aria-label', l10n.next || 'Next case study' );
                arrowsHolder.appendChild( nextBtn );
            }

            var swiperOptions = {
				slidesPerView: 1.05, 
				spaceBetween: 16,
				wrapperClass: 'swiper-wrapper',
				slideClass: 'swiper-slide',
				breakpoints: {
					768: {
						slidesPerView: 1.1,
						spaceBetween: 24
					},
					1024: {
						slidesPerView: 1.24, 
						spaceBetween: 24
					}
				},
				keyboard: {
					enabled: true,
					onlyInViewport: false,
				},
				a11y: {
					prevSlideMessage: l10n.prev || 'Previous case study',
					nextSlideMessage: l10n.next || 'Next case study',
				}
			};

            if ( prevBtn && nextBtn ) {
                swiperOptions.navigation = {
                    nextEl: nextBtn,
                    prevEl: prevBtn,
                    disabledClass: 'disabled',
                };
            }

            new Swiper( viewport, swiperOptions );
        } );
    } );
} )( window );

jQuery(document).ready(function($){
    $('.caseStudyPreview__sliderItem').hover(
        function(){
            $(this).find('.caseStudyPreview__sliderItem__button').stop(true, false).slideDown(300);
        },
        function(){
            $(this).find('.caseStudyPreview__sliderItem__button').stop(true, false).slideUp(300);
        }
    );
});