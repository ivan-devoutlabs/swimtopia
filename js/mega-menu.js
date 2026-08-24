( function () {
	'use strict';

	var ITEM = '.header__menu li';
	var PANEL = '.mega-menu';
	var TOGGLE = '.menu-toggle';
	var OPEN = 'is-open';

	var HOVER = window.matchMedia( '(hover: hover) and (pointer: fine)' );

	function open( item ) {
		var panel = item.querySelector( PANEL );
		var toggle = item.querySelector( TOGGLE );

		if ( ! panel ) {
			return;
		}

		panel.hidden = false;

		window.requestAnimationFrame( function () {
			item.classList.add( OPEN );
		} );

		if ( toggle ) {
			toggle.setAttribute( 'aria-expanded', 'true' );
		}
	}

	function close( item ) {
		var panel = item.querySelector( PANEL );
		var toggle = item.querySelector( TOGGLE );

		if ( ! panel ) {
			return;
		}

		item.classList.remove( OPEN );

		if ( toggle ) {
			toggle.setAttribute( 'aria-expanded', 'false' );
		}

		window.setTimeout( function () {
			if ( ! item.classList.contains( OPEN ) ) {
				panel.hidden = true;
			}
		}, 250 );
	}

	function closeAll( except ) {
		var items = document.querySelectorAll( ITEM + '.' + OPEN );

		Array.prototype.forEach.call( items, function ( item ) {
			if ( item !== except ) {
				close( item );
			}
		} );
	}

	function setup( item ) {
		var panel = item.querySelector( PANEL );
		var toggle = item.querySelector( TOGGLE );

		if ( ! panel ) {
			return;
		}

		if ( HOVER.matches ) {
			var timer;

			item.addEventListener( 'mouseenter', function () {
				clearTimeout( timer );
				closeAll( item );
				open( item );
			} );

			item.addEventListener( 'mouseleave', function () {
				timer = setTimeout( function () {
					close( item );
				}, 120 );
			} );
		}

		if ( toggle ) {
			toggle.addEventListener( 'click', function () {
				if ( item.classList.contains( OPEN ) ) {
					close( item );
				} else {
					closeAll( item );
					open( item );
				}
			} );
		}

		item.addEventListener( 'focusout', function ( event ) {
			if ( ! item.contains( event.relatedTarget ) ) {
				close( item );
			}
		} );
	}

	function init() {
		var items = document.querySelectorAll( ITEM );

		Array.prototype.forEach.call( items, setup );

		document.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Escape' ) {
				closeAll();
			}
		} );

		document.addEventListener( 'click', function ( event ) {
			if ( ! event.target.closest( '.main-navigation' ) ) {
				closeAll();
			}
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();