( function () {
	'use strict';

	var ITEM = '.stickyStats__listItem';
	var VISIBLE = 'is-visible';

	function init() {
		var items = document.querySelectorAll( ITEM );

		if ( ! items.length ) {
			return;
		}

		if ( ! ( 'IntersectionObserver' in window ) ) {
			Array.prototype.forEach.call( items, function ( item ) {
				item.classList.add( VISIBLE );
			} );

			return;
		}

		var observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.intersectionRatio >= 0.25 ) {
						entry.target.classList.add( VISIBLE );
					} else {
						entry.target.classList.remove( VISIBLE );
					}
				} );
			},
			{
				threshold: [ 0, 0.25 ],
			}
		);

		Array.prototype.forEach.call( items, function ( item ) {
			observer.observe( item );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();