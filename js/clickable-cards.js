( function () {
	'use strict';

	var CARDS = [
		'.caseStudyPreview__sliderItem',
		'.cardsSimple__listItem',
		// '.webinarsPreview__listItem',
	].join( ',' );

	
	function mainLink( card ) {
		return card.querySelector( '.wp-block-button__link[href], a[href]' );
	}

	function setup( card ) {
		var link = mainLink( card );

		if ( ! link ) {
			return;
		}

		card.classList.add( 'is-clickable' );

		card.addEventListener( 'click', function ( event ) {

			
			if ( event.target.closest( 'a, button' ) ) {
				return;
			}

			var selection = window.getSelection();

			if ( selection && selection.toString().length > 0 ) {
				return;
			}

			
			if ( event.metaKey || event.ctrlKey ) {
				window.open( link.href, '_blank', 'noopener' );
				return;
			}

			window.location.href = link.href;
		} );

		card.addEventListener( 'auxclick', function ( event ) {
			if ( event.button !== 1 || event.target.closest( 'a, button' ) ) {
				return;
			}

			event.preventDefault();
			window.open( link.href, '_blank', 'noopener' );
		} );
	}

	function init() {
		var cards = document.querySelectorAll( CARDS );

		Array.prototype.forEach.call( cards, setup );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();