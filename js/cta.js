( function () {
	'use strict';

	function initHover() {
		var sections = document.querySelectorAll( '.cta' );

		Array.prototype.forEach.call( sections, function ( section ) {

			var triggers = section.querySelectorAll(
				'.cta__button .wp-block-button__link, .cta__button a'
			);

			if ( ! triggers.length ) {
				return;
			}

			function on() {
				section.classList.add( 'is-hovered' );
			}

			function off() {
				section.classList.remove( 'is-hovered' );
			}

			Array.prototype.forEach.call( triggers, function ( trigger ) {
				trigger.addEventListener( 'mouseenter', on );
				trigger.addEventListener( 'mouseleave', off );

				trigger.addEventListener( 'focus', on );
				trigger.addEventListener( 'blur', off );
			} );
		} );
	}


	function initRolodex() {
		var config = window.starterCtaRolodex || {};
		var words = config.words || [];
		var interval = config.interval || 2200;

		if ( words.length < 2 ) {
			return;
		}

		var targets = document.querySelectorAll( '.cta__title strong' );

		Array.prototype.forEach.call( targets, function ( target ) {
			target.classList.add( 'cta__rolodex' );

			var list = words.slice();
			var original = target.textContent.trim();

			if ( list.indexOf( original ) === -1 ) {
				list.unshift( original );
			}

			var index = list.indexOf( original );

			var ghost = document.createElement( 'span' );
			ghost.className = 'cta__rolodexGhost';
			ghost.setAttribute( 'aria-hidden', 'true' );
			target.parentNode.insertBefore( ghost, target.nextSibling );

			function widthOf( text ) {
				ghost.textContent = text;
				return ghost.getBoundingClientRect().width;
			}

			target.style.width = widthOf( original ) + 'px';

			target.setAttribute( 'aria-hidden', 'true' );

			var sr = document.createElement( 'span' );
			sr.className = 'screen-reader-text';
			sr.textContent = original;
			target.parentNode.insertBefore( sr, target );

			var timer = null;

			function next() {
				index = ( index + 1 ) % list.length;

				var word = list[ index ];

				target.classList.add( 'is-leaving' );

				window.setTimeout( function () {
					target.textContent = word;
					target.style.width = widthOf( word ) + 'px';
					target.classList.remove( 'is-leaving' );
				}, 220 );
			}

			function start() {
				if ( ! timer ) {
					timer = window.setInterval( next, interval );
				}
			}

			function stop() {
				window.clearInterval( timer );
				timer = null;
			}

			if ( 'IntersectionObserver' in window ) {
				var section = target.closest( '.cta' ) || target;

				new IntersectionObserver( function ( entries ) {
					entries.forEach( function ( entry ) {
						if ( entry.isIntersecting ) {
							start();
						} else {
							stop();
						}
					} );
				}, { threshold: 0.2 } ).observe( section );
			} else {
				start();
			}

			if ( document.fonts && document.fonts.ready ) {
				document.fonts.ready.then( function () {
					target.style.width = widthOf( target.textContent ) + 'px';
				} );
			}
		} );
	}

	function init() {
		initHover();

		if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
			initRolodex();
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();