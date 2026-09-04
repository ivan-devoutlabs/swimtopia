/**
 * Case study slider.
 *
 * The jQuery hover handler that used slideDown()/slideUp() on the
 * button has been removed. It left display: none on the element, which
 * takes it out of the tab order completely — keyboard users could never
 * reach "View Case Study". The reveal is done in CSS now, on :hover and
 * :focus-within, so the button stays in the document either way.
 */
( function ( global ) {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		var sections = document.querySelectorAll( '.caseStudyPreview' );

		sections.forEach( function ( section ) {
			var track = section.querySelector( '.caseStudyPreview__slider' );

			if ( ! track ) {
				return;
			}

			var slides = Array.prototype.slice.call( track.children )
				.filter( function ( node ) {
					return node.nodeType === 1 && (
						node.classList.contains( 'caseStudyPreview__sliderItem' ) ||
						node.querySelector( '.caseStudyPreview__sliderItem' )
					);
				} );

			if ( slides.length < 2 ) {
				return;
			}

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

			/**
			 * Take off-screen slides out of the tab order.
			 *
			 * Otherwise tabbing walks into cards nobody can see, and the
			 * browser scrolls the track to reach them — the section
			 * appears to jump sideways for no reason.
			 *
			 * Visibility is worked out from the geometry rather than
			 * from Swiper's swiper-slide-visible class. That class only
			 * appears with certain version and option combinations, and
			 * when it doesn't, every slide counts as hidden — which puts
			 * tabindex="-1" on every link in the slider and makes the
			 * whole thing unreachable. Measuring is version-proof.
			 */
			function updateReachable( swiper ) {
                var box = viewport.getBoundingClientRect();

                swiper.slides.forEach( function ( slide ) {
                    var rect = slide.getBoundingClientRect();

                    // Рахуємо, яка частина слайда в зоні видимості
                    var overlap = Math.min( rect.right, box.right ) - Math.max( rect.left, box.left );
                    var ratio = rect.width ? overlap / rect.width : 0;
                    var isVisible = ratio > 0.5;

                    slide.setAttribute( 'aria-hidden', isVisible ? 'false' : 'true' );

                    // ДОДАНО: Вмикаємо фокус тільки для елементів на видимому слайді
                    var links = slide.querySelectorAll( 'a, button' );
                    for ( var i = 0; i < links.length; i++ ) {
                        if ( isVisible ) {
                            links[i].removeAttribute( 'tabindex' );
                        } else {
                            links[i].setAttribute( 'tabindex', '-1' );
                        }
                    }
                } );
            }

			var swiperOptions = {
				slidesPerView: 1.05,
				spaceBetween: 16,
				wrapperClass: 'swiper-wrapper',
				slideClass: 'swiper-slide',

				// Required for swiper-slide-visible, which drives the
				// tab-order handling above
				watchSlidesProgress: true,

				breakpoints: {
					768: {
						slidesPerView: 1.1,
						spaceBetween: 24,
					},
					1024: {
						slidesPerView: 1.24,
						spaceBetween: 24,
					},
				},

				keyboard: {
					enabled: true,
					onlyInViewport: false,
				},

				a11y: {
					prevSlideMessage: l10n.prev || 'Previous case study',
					nextSlideMessage: l10n.next || 'Next case study',
				},

				on: {
					init: function () {
						updateReachable( this );
					},
					/*
					 * After the transition, not during it: mid-move the
					 * slides are between positions and the measurement
					 * would be of a state nobody sees.
					 */
					transitionEnd: function () {
						updateReachable( this );
					},
					resize: function () {
						updateReachable( this );
					},
				},
			};

			if ( prevBtn && nextBtn ) {
				swiperOptions.navigation = {
					nextEl: nextBtn,
					prevEl: prevBtn,
					disabledClass: 'disabled',
				};
			}

			var swiper = new Swiper( viewport, swiperOptions );

			/*
			 * The slider is a focus stop of its own, which gives the
			 * left/right arrow keys somewhere to act from. Without it
			 * they only work while the pointer happens to be over the
			 * section.
			 */
			// viewport.setAttribute( 'tabindex', '0' );
			viewport.setAttribute( 'role', 'region' );
			viewport.setAttribute(
				'aria-label',
				l10n.region || 'Case studies'
			);

			/*
			 * Keep focus and the visible slide in agreement.
			 *
			 * A card can be half visible, so tabbing into it should
			 * bring it fully into view. The browser's own scroll-on-focus
			 * fights Swiper's transform, so it is undone and the slider
			 * is asked to move instead.
			 */
			viewport.addEventListener( 'focusin', function ( event ) {
                var slide = event.target.closest( '.swiper-slide' );

                if ( ! slide ) {
                    return;
                }

                slide.setAttribute( 'aria-hidden', 'false' );
                viewport.scrollLeft = 0;

                var index = swiper.slides.indexOf( slide );

                if ( index > -1 && index !== swiper.activeIndex ) {
                    swiper.slideTo( index );
                }
            } );
		} );
	} );
} )( window );