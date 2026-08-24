
( function ( $ ) {
	'use strict';

	var SELECTORS = {
		grid: '.faq__list',
		item: '.faq__listItem',
		answer: '.faq__listItemAnswear',
	};
 
	var CLASSES = {
		active: 'is-active',
		shrunk: 'is-shrunk',
		hasOpen: 'has-open-item',
	};
 
	var MOBILE = window.matchMedia( '(max-width: 781px)' );
	var REDUCED = window.matchMedia( '(prefers-reduced-motion: reduce)' );
 
	function duration() {
		return REDUCED.matches ? 0 : 400;
	}
 
	function isMobile() {
		return MOBILE.matches;
	}
 

	function clearInline( $grid ) {
		$grid.find( SELECTORS.answer ).stop( true, true ).removeAttr( 'style' );
	}
 
	function rowSiblings( $grid, $item ) {
		var top = $item.get( 0 ).offsetTop;
 
		return $grid.find( SELECTORS.item ).filter( function () {
			return Math.abs( this.offsetTop - top ) < 2;
		} );
	}
 
	function collapse( $grid ) {
		$grid
			.removeClass( CLASSES.hasOpen )
			.find( SELECTORS.item )
			.removeClass( CLASSES.active + ' ' + CLASSES.shrunk )
			.attr( 'aria-expanded', 'false' );
 
		if ( isMobile() ) {
			$grid.find( SELECTORS.answer ).stop( true, true ).slideUp( duration() );
		} else {
			$grid.find( SELECTORS.answer ).css( 'opacity', 0 );
		}
	}
 
	function expand( $grid, $item ) {
		collapse( $grid );
 
		$grid.addClass( CLASSES.hasOpen );
		$item.addClass( CLASSES.active ).attr( 'aria-expanded', 'true' );
 
		var $answer = $item.find( SELECTORS.answer );
 
		if ( isMobile() ) {
			$answer.stop( true, true ).css( 'opacity', 1 ).slideDown( duration() );
			return;
		}
 
		rowSiblings( $grid, $item ).not( $item ).addClass( CLASSES.shrunk );
 
		setTimeout( function () {
			$answer.css( 'opacity', 1 );
		}, duration() > 0 ? 500 : 0 );
	}
 
	function init() {
		var $grids = $( SELECTORS.grid );
 
		if ( ! $grids.length ) {
			return;
		}
 
		$grids.each( function () {
			var $grid = $( this );
 
			$grid.find( SELECTORS.item ).each( function () {
				var $item = $( this );
 
				if ( ! $item.is( 'button, a' ) ) {
					$item.attr( {
						tabindex: 0,
						role: 'button',
					} );
				}
 
				$item.attr( 'aria-expanded', 'false' );
			} );
 
			$grid.on( 'click', SELECTORS.item, function ( event ) {
				event.preventDefault();
 
				var $item = $( this );
 
				if ( $item.hasClass( CLASSES.active ) ) {
					collapse( $grid );
				} else {
					expand( $grid, $item );
				}
			} );
		} );
 
		function onModeChange() {
			$grids.each( function () {
				var $grid = $( this );
				collapse( $grid );
				clearInline( $grid );
			} );
		}
 
		if ( typeof MOBILE.addEventListener === 'function' ) {
			MOBILE.addEventListener( 'change', onModeChange );
		} else {
			MOBILE.addListener( onModeChange ); 
		}
	}
 
	init();
} )( jQuery );