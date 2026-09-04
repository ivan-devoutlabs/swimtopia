( function () {
	'use strict';

	var SECTION = '.compareComponent';

	function setup( section ) {
		var headers = section.querySelectorAll( '.compareComponent__headerTag' );

		if ( headers.length < 2 ) {
			return;
		}

		var labels = Array.prototype.map.call( headers, function ( node ) {
			return node.textContent.trim();
		} );

		var rows = section.querySelectorAll( '.compareComponent__row' );

		Array.prototype.forEach.call( rows, function ( row ) {
			var cells = row.querySelectorAll( '.compareComponent__rowItem' );

			Array.prototype.forEach.call( cells, function ( cell, i ) {
			
				if ( i === 0 || ! labels[ i ] ) {
					return;
				}

				cell.setAttribute( 'data-label', labels[ i ] );
			} );
		} );

		section.classList.add( 'has-labels' );
	}

	function init() {
		var sections = document.querySelectorAll( SECTION );

		Array.prototype.forEach.call( sections, setup );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();