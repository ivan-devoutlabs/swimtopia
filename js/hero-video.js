( function () {
	'use strict';

	var MOBILE_MAX = 781;

	function labels() {
		var l10n = window.starterHeroL10n || {};
		return {
			pause: l10n.pause || 'Зупинити фонове відео',
			play: l10n.play || 'Відтворити фонове відео',
		};
	}

	function makeButton( video ) {
		var text = labels();
		var btn = document.createElement( 'button' );

		btn.type = 'button';
		btn.className = 'hero-video__toggle';
		btn.setAttribute( 'aria-pressed', 'false' );
		btn.setAttribute( 'aria-label', text.pause );
		btn.innerHTML =
			'<span class="hero-video__toggle-icon" aria-hidden="true"></span>';

		btn.addEventListener( 'click', function () {
			var paused = video.paused;

			if ( paused ) {
				video.play();
				btn.setAttribute( 'aria-pressed', 'false' );
				btn.setAttribute( 'aria-label', text.pause );
			} else {
				video.pause();
				btn.setAttribute( 'aria-pressed', 'true' );
				btn.setAttribute( 'aria-label', text.play );
			}

			btn.classList.toggle( 'is-paused', ! paused );
			video.dataset.userPaused = paused ? 'false' : 'true';
		} );

		return btn;
	}

	function shouldNotAutoplay() {
		var reduced = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
		var narrow = window.innerWidth <= MOBILE_MAX;
		var saveData =
			navigator.connection && navigator.connection.saveData === true;

		return reduced || narrow || saveData;
	}

	function setupVisibilityPause( cover, video ) {
		if ( ! ( 'IntersectionObserver' in window ) ) {
			return;
		}

		var observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( video.dataset.userPaused === 'true' ) {
						return; 
					}
					if ( entry.isIntersecting ) {
						video.play().catch( function () {} );
					} else {
						video.pause();
					}
				} );
			},
			{ threshold: 0.1 }
		);

		observer.observe( cover );
	}

	function init() {
		var videos = document.querySelectorAll(
			'.wp-block-cover .wp-block-cover__video-background'
		);

		Array.prototype.forEach.call( videos, function ( video ) {
			var cover = video.closest( '.wp-block-cover' );
			if ( ! cover ) {
				return;
			}

			video.setAttribute( 'aria-hidden', 'true' );
			video.setAttribute( 'tabindex', '-1' );
			video.setAttribute( 'playsinline', '' );

			if ( shouldNotAutoplay() ) {
				video.removeAttribute( 'autoplay' );
				video.pause();
				video.dataset.userPaused = 'true';
				cover.classList.add( 'has-video-paused' );
			}

			var btn = makeButton( video );
			if ( video.paused ) {
				btn.classList.add( 'is-paused' );
				btn.setAttribute( 'aria-pressed', 'true' );
				btn.setAttribute( 'aria-label', labels().play );
			}
			cover.appendChild( btn );

			setupVisibilityPause( cover, video );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
