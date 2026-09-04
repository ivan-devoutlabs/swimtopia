/**
 * easeAccordion — Swiper-based sliders.
 *
 * Replaces the hand-written slider while keeping every existing class
 * name, so the stylesheet needs only minor additions.
 *
 * WHAT IS PRESERVED
 *   Vertical list  — one item at a time, next one peeking at 80%,
 *                    dots, click/keyboard to advance, rolodex sync.
 *   Testimonials   — horizontal, not looped, arrows disabled at the
 *                    ends, per-breakpoint slide width ratios.
 *
 * WHAT IS NEW
 *   In the .blank variant the section subtitle mirrors the title of
 *   the active testimonial.
 *
 * Swiper needs its own DOM: container > wrapper > slides. The pattern
 * deliberately doesn't contain those wrappers — they'd show up as empty
 * blocks in the editor — so the script builds them.
 */
( function ( global ) {
	'use strict';

	var MOBILE = window.matchMedia( '(max-width: 767px)' );

	/* ------------------------------------------------------------------
	 * DOM preparation
	 * ---------------------------------------------------------------- */

	/**
	 * Wrap the existing children in the structure Swiper expects.
	 *
	 * The wrapper keeps the vslider__track class as well, so the layout
	 * rules already written against it still apply.
	 */
	function buildDom( viewport, axis ) {
		var items = Array.prototype.slice.call( viewport.children )
			.filter( function ( node ) {
				return node.nodeType === 1;
			} );

		if ( items.length < 2 ) {
			return null;
		}

		var wrapper = document.createElement( 'div' );

		wrapper.className = 'vslider__track swiper-wrapper';

		items.forEach( function ( item ) {
			item.classList.add( 'swiper-slide' );
			wrapper.appendChild( item );
		} );

		viewport.appendChild( wrapper );
		viewport.classList.add( 'swiper', 'vslider', 'vslider--' + axis, 'is-swiper' );

		return { items: items, wrapper: wrapper };
	}

	/**
	 * Gap between slides, taken from CSS so the value isn't duplicated
	 * in two places.
	 */
	function readGap( wrapper, axis ) {
		var styles = window.getComputedStyle( wrapper );

		return parseFloat(
			axis === 'x' ? styles.columnGap : styles.rowGap
		) || parseFloat( styles.gap ) || 0;
	}

	/* ------------------------------------------------------------------
	 * Controls
	 * ---------------------------------------------------------------- */

	function makeDots( viewport ) {
		var dots = document.createElement( 'div' );

		dots.className = 'vslider__dots';

		viewport.parentNode.insertBefore( dots, viewport.nextSibling );

		return dots;
	}

	function makeArrows( viewport, axis, l10n ) {
		var holder = document.createElement( 'div' );

		holder.className = 'easeAccordion__testimonialsArrows';

		function make( dir, label ) {
			var btn = document.createElement( 'button' );

			btn.type = 'button';
			btn.className =
				'vslider__arrow vslider__arrow--' + dir + ' vslider__arrow--' + axis;
			btn.setAttribute( 'aria-label', label );

			return btn;
		}

		var prev = make( 'prev', ( l10n && l10n.prev ) || 'Previous' );
		var next = make( 'next', ( l10n && l10n.next ) || 'Next' );

		holder.appendChild( prev );
		holder.appendChild( next );

		viewport.parentNode.insertBefore( holder, viewport.nextSibling );

		return { holder: holder, prev: prev, next: next };
	}

	/* ------------------------------------------------------------------
	 * Rolodex (unchanged behaviour)
	 * ---------------------------------------------------------------- */

	function Rolodex( target, words ) {
		this.target = target;

		var original = target.textContent.trim();

		this.words = words.slice();

		if ( this.words.indexOf( original ) === -1 ) {
			this.words.unshift( original );
		}

		target.classList.add( 'easeAccordion__rolodex' );

		/*
		 * Hidden twin used to measure the next word before it is shown,
		 * so the line doesn't jump as the width changes.
		 */
		this.ghost = document.createElement( 'span' );
		this.ghost.className = 'easeAccordion__rolodexGhost';
		this.ghost.setAttribute( 'aria-hidden', 'true' );
		target.parentNode.insertBefore( this.ghost, target.nextSibling );

		this.setWidth( original );
	}

	Rolodex.prototype.setWidth = function ( word ) {
		this.ghost.textContent = word;
		this.target.style.width = this.ghost.getBoundingClientRect().width + 'px';
	};

	Rolodex.prototype.to = function ( index ) {
		var word = this.words[ index % this.words.length ];

		if ( ! word || word === this.target.textContent.trim() ) {
			return;
		}

		var self = this;

		this.target.classList.add( 'is-leaving' );

		window.setTimeout( function () {
			self.target.classList.add( 'is-entering' );
			self.target.classList.remove( 'is-leaving' );

			self.target.textContent = word;
			self.setWidth( word );

			// Force a reflow so the entering state is actually painted
			// before it is removed, otherwise there is no transition
			void self.target.offsetWidth;

			self.target.classList.remove( 'is-entering' );
		}, 220 );
	};

	/* ------------------------------------------------------------------
	 * Subtitle mirroring the active testimonial (.blank variant)
	 * ---------------------------------------------------------------- */

	function makeSubtitleSync( section, viewport ) {
		var subtitle = section.querySelector( '.easeAccordion__subtitle' );

		if ( ! subtitle ) {
			return null;
		}

		/*
		 * The subtitle repeats a heading that is already on the slide,
		 * so it is decorative for assistive tech — otherwise the same
		 * text would be announced twice.
		 */
		subtitle.setAttribute( 'aria-hidden', 'true' );
		subtitle.classList.add( 'is-synced' );

		return function ( index ) {
			var slides = viewport.querySelectorAll( '.easeAccordion__testimonialsItem' );
			var slide = slides[ index ];

			if ( ! slide ) {
				return;
			}

			var titleNode = slide.querySelector( '.easeAccordion__testimonialsItem__title' );

			if ( ! titleNode ) {
				return;
			}

			var text = titleNode.textContent.trim();

			if ( text === subtitle.textContent.trim() ) {
				return;
			}

			/*
			 * Swap the text mid-animation: the old one fades out first,
			 * the new one fades in. Replacing it instantly would read as
			 * a flicker rather than a transition.
			 */
			subtitle.classList.add( 'is-leaving' );

			window.setTimeout( function () {
				/*
				 * Same three steps as the rolodex: park the element at
				 * the entry position with transitions off, swap the
				 * text, then release it so it animates upwards.
				 */
				subtitle.classList.add( 'is-entering' );
				subtitle.classList.remove( 'is-leaving' );

				subtitle.textContent = text;

				// Force a repaint so the entry position is actually
				// painted before the class is removed
				void subtitle.offsetWidth;

				subtitle.classList.remove( 'is-entering' );
			}, 200 );
		};
	}

	/* ------------------------------------------------------------------
	 * Vertical list
	 * ---------------------------------------------------------------- */

	function initList( section, l10n, rolodex ) {
		var viewport = section.querySelector( '.easeAccordion__list' );

		if ( ! viewport || ! global.Swiper ) {
			return null;
		}

		var dom = buildDom( viewport, 'y' );

		if ( ! dom ) {
			return null;
		}

		var gap = readGap( dom.wrapper, 'y' );
		var peek = 0.8;
		var dots = makeDots( viewport );

		/**
		 * Viewport height and the reserve after the last slide.
		 *
		 * Both are constant, and that is the point.
		 *
		 * A height that changed with the active slide looked tidier but
		 * broke the slider: Swiper works out its scroll limit once, from
		 * whatever height was in place at that moment. Coming from a tall
		 * item to a short last one, that limit stopped the last slide
		 * before it reached the top.
		 *
		 * Padding it out was worse — Swiper adds a snap point at the
		 * scroll limit, so any slack past the last slide became an extra,
		 * empty position to scroll into.
		 *
		 * With a fixed height the reserve can match the limit exactly:
		 *
		 *   height = tallest + gap + tallest * peek
		 *   reserve = height - last slide
		 *
		 * which puts the scroll limit precisely where the last slide sits
		 * flush with the top. No short scroll, no empty slot.
		 *
		 * The section also stops resizing as you page through it, which
		 * keeps the rest of the layout still.
		 */
		function setMetrics( swiper ) {
			var slides = swiper.slides;

			if ( ! slides.length ) {
				return;
			}

			var tallest = 0;

			slides.forEach( function ( slide ) {
				if ( slide.offsetHeight > tallest ) {
					tallest = slide.offsetHeight;
				}
			} );

			if ( ! tallest ) {
				return;
			}

			var height = tallest + ( peek ? gap + tallest * peek : 0 );
			var last = slides[ slides.length - 1 ].offsetHeight;

			viewport.style.height = Math.ceil( height ) + 'px';

			swiper.params.slidesOffsetAfter = Math.max( 0, height - last );
		}

		var swiper = new global.Swiper( viewport, {
			direction: 'vertical',
			slidesPerView: 'auto',
			spaceBetween: 16,

			// Looping keeps the rolodex cycling through the words
			loop: false,
			rewind: true,

			pagination: {
				el: dots,
				clickable: true,
				bulletClass: 'vslider__dot',
				bulletActiveClass: 'is-active',
				renderBullet: function ( index, className ) {
					/*
					 * Rendered as a real button: the default <span> is
					 * not reachable by keyboard and has no accessible
					 * name.
					 */
					return (
						'<button type="button" class="' + className + '" aria-label="' +
						( ( l10n.slide || 'Item' ) + ' ' + ( index + 1 ) ) +
						'"></button>'
					);
				},
			},

			a11y: {
				enabled: true,
			},

			on: {
				init: function () {
					setMetrics( this );

					// The reserve changes the track length, so Swiper
					// has to remeasure before it knows the real end
					this.update();

					this.slides.forEach( function ( slide, i ) {
						slide.classList.toggle( 'is-active', i === 0 );
					} );
				},
				slideChange: function () {
					var swiperInstance = this;

					swiperInstance.slides.forEach( function ( slide, i ) {
						slide.classList.toggle( 'is-active', i === swiperInstance.activeIndex );
					} );

					if ( rolodex ) {
						rolodex.to( swiperInstance.activeIndex );
					}
				},
				resize: function () {
					// Slide heights change with the viewport width,
					// so both numbers are worked out again
					setMetrics( this );
					this.update();
				},
			},
		} );

		/*
		 * Click and keyboard advance, as before. Clicks on links,
		 * buttons and the dots are ignored so they keep working.
		 */
		viewport.classList.add( 'is-clickable' );
		viewport.setAttribute( 'role', 'button' );
		viewport.setAttribute( 'tabindex', '0' );
		viewport.setAttribute( 'aria-label', l10n.nextItem || 'Next item' );

		viewport.addEventListener( 'click', function ( event ) {
			if ( event.target.closest( 'a, button' ) ) {
				return;
			}

			swiper.slideNext();
		} );

		viewport.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Enter' || event.key === ' ' ) {
				event.preventDefault();
				swiper.slideNext();

				return;
			}

			if ( event.key === 'ArrowDown' || event.key === 'ArrowRight' ) {
				swiper.slideNext();
			}

			if ( event.key === 'ArrowUp' || event.key === 'ArrowLeft' ) {
				swiper.slidePrev();
			}
		} );

		/*
		 * Text height depends on the loaded font, so the container is
		 * remeasured once fonts are ready.
		 */
		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( function () {
				setMetrics( swiper );
				swiper.update();
			} );
		}

		return swiper;
	}

	/* ------------------------------------------------------------------
	 * Testimonials
	 * ---------------------------------------------------------------- */

	function initTestimonials( section, l10n ) {

		var viewport = section.querySelector( '.easeAccordion__testimonials' );

        if ( ! viewport || ! global.Swiper ) {
            return null;
        }

        /* --- ДОДАНО: Дублювання елементів --- */
        var originalItems = Array.prototype.slice.call( viewport.children )
            .filter( function ( node ) {
                return node.nodeType === 1;
            } );

        // Якщо елементів достатньо мало, дублюємо їх, щоб заповнити стрічку
        if ( originalItems.length > 0 && originalItems.length <= 3 ) {
            originalItems.forEach( function ( item ) {
                var clone = item.cloneNode( true );
                
                // Додаємо aria-hidden, щоб скрінрідери не читали відгуки двічі
                clone.setAttribute( 'aria-hidden', 'true' );
                
                viewport.appendChild( clone );
            } );
        }
        /* ------------------------------------ */

        // Тепер buildDom збере і оригінали, і клони
        var dom = buildDom( viewport, 'x' );

        if ( ! dom ) {
            return null;
        }

        var gap = readGap( dom.wrapper, 'x' );
		var isBlank = section.classList.contains( 'blank' );
		var arrows = makeArrows( viewport, 'x', l10n );

		// Subtitle mirrors the active slide only in the blank variant
		var syncSubtitle = isBlank ? makeSubtitleSync( section, viewport ) : null;

		/**
		 * Slide width and the reserve after the last slide.
		 *
		 * The width stays a CSS variable rather than a Swiper option, so
		 * the proportions live in the stylesheet with the rest of the
		 * layout.
		 *
		 * The reserve exists for the same reason as in the vertical
		 * slider. A slide is narrower than the viewport — the next one
		 * has to peek — so the track reaches its right edge well before
		 * the last slide has moved into place, and Swiper stops there.
		 * With two slides that is very visible: the second one never
		 * leaves the right-hand side.
		 *
		 * Reserving "viewport minus one slide" moves the scroll limit to
		 * exactly where the last slide sits flush left. It has to be
		 * exact, not generous: Swiper puts a snap point at the limit, so
		 * any surplus becomes an empty position to scroll into.
		 */
		function setMetrics( swiper ) {
			var width = viewport.getBoundingClientRect().width;

			if ( width < 1 ) {
				return;
			}

			var item;

			if ( MOBILE.matches ) {
				item = width * 0.9;
			} else if ( isBlank ) {
				item = width * 0.5625;
			} else {
				item = ( width - gap ) / 1.3;   // next slide peeks at 30%
			}

			viewport.style.setProperty( '--vslider-item', item.toFixed( 2 ) + 'px' );

			if ( swiper ) {
				swiper.params.slidesOffsetAfter = Math.max( 0, width - item );
			}
		}

		// Width has to exist before Swiper measures anything
		setMetrics( null );

		var swiper = new global.Swiper( viewport, {
			slidesPerView: 'auto',
			spaceBetween: 16,

			// Not looped: the arrows go dim at either end
			loop: true,

			navigation: {
				prevEl: arrows.prev,
				nextEl: arrows.next,
				disabledClass: 'disabled',
			},

			keyboard: {
				enabled: true,

				// Otherwise arrow keys would drive the slider from
				// anywhere on the page
				onlyInViewport: true,
			},

			a11y: {
				enabled: true,
				prevSlideMessage: l10n.prev,
				nextSlideMessage: l10n.next,
			},

			on: {
				init: function () {
					setMetrics( this );

					// The reserve changes the track length, so Swiper
					// has to remeasure before it knows the real end
					this.update();

					this.slides.forEach( function ( slide, i ) {
						slide.classList.toggle( 'is-active', i === 0 );
					} );

					if ( syncSubtitle ) {
						syncSubtitle( 0 );
					}
				},
				slideChange: function () {
					var swiperInstance = this;

					swiperInstance.slides.forEach( function ( slide, i ) {
						slide.classList.toggle( 'is-active', i === swiperInstance.activeIndex );
					} );

					if ( syncSubtitle ) {
						syncSubtitle( swiperInstance.activeIndex );
					}
				},
				resize: function () {
					// Slide width is a share of the viewport, so both
					// numbers change together with it
					setMetrics( this );
					this.update();
				},
			},
		} );

		/*
		 * Called directly as well as through the init event: depending
		 * on the Swiper version the event may fire before the handler
		 * is attached.
		 */
		if ( syncSubtitle ) {
			syncSubtitle( swiper.activeIndex || 0 );
		}

		section.classList.add( 'is-swiper-ready' );

		return swiper;
	}

	/* ------------------------------------------------------------------
	 * Section
	 * ---------------------------------------------------------------- */

	function initSection( section ) {
		var l10n = global.starterEaseL10n || {};

		if ( ! global.Swiper ) {
			/*
			 * Without Swiper the section still reads fine — items simply
			 * stack. Log it, because a silently missing slider is the
			 * hardest kind of bug to track down.
			 */
			// eslint-disable-next-line no-console
			console.warn( 'easeAccordion: Swiper not loaded' );

			return;
		}

		/*
		 * Rolodex words come from the <strong> tags in the subtitle:
		 * the first one is the target, the rest are the word list and
		 * are removed from the markup.
		 */
		var subtitle = section.querySelector( '.easeAccordion__subtitle' );
		var strongTags = subtitle ? subtitle.querySelectorAll( 'strong' ) : [];
		var rolodex = null;

		// The blank variant drives the subtitle from the testimonials,
		// so the rolodex must not fight it for the same element
		if ( strongTags.length && ! section.classList.contains( 'blank' ) ) {
			var words = [];
			var target = strongTags[ 0 ];

			Array.prototype.forEach.call( strongTags, function ( tag, index ) {
				var word = tag.textContent.trim();

				if ( word ) {
					words.push( word );
				}

				if ( index > 0 ) {
					tag.remove();
				}
			} );

			if ( words.length ) {
				rolodex = new Rolodex( target, words );
			}
		}

		initList( section, l10n, rolodex );
		initTestimonials( section, l10n );
	}

	function init() {
		var sections = document.querySelectorAll(
			'.easeAccordion, .content__testimonials'
		);

		Array.prototype.forEach.call( sections, initSection );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window );