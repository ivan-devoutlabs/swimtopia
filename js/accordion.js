jQuery( document ).ready( function ( $ ) {
	'use strict';

	var TITLE = '.accordion__listItem__title';
	var TEXT = '.accordion__listItem__text';

	$( TITLE ).each( function ( index ) {
		var $title = $( this );
		var $text = $title.parent().find( TEXT );

		if ( ! $text.length ) {
			return;
		}

		var id = 'accordion-panel-' + index;

		$text.attr( 'id', id );

		$title.attr( {
			role: 'button',
			tabindex: 0,
			'aria-expanded': $title.hasClass( 'opened' ) ? 'true' : 'false',
			'aria-controls': id,
		} );
	} );

	function toggle( $title ) {
		var $text = $title.parent().find( TEXT );

		$( TITLE ).not( $title )
			.removeClass( 'opened' )
			.attr( 'aria-expanded', 'false' );

		$( TEXT ).not( $text ).stop().slideUp();

		$text.stop().slideToggle();

		var isOpen = ! $title.hasClass( 'opened' );

		$title.toggleClass( 'opened', isOpen );
		$title.attr( 'aria-expanded', isOpen ? 'true' : 'false' );
	}

	$( TITLE ).on( 'click', function () {
		toggle( $( this ) );
	} );

	$( TITLE ).on( 'keydown', function ( event ) {
		var $items = $( TITLE );
		var index = $items.index( this );

		if ( event.key === 'Enter' || event.key === ' ' ) {
			event.preventDefault();   
			toggle( $( this ) );
			return;
		}

		if ( event.key === 'Escape' && $( this ).hasClass( 'opened' ) ) {
			toggle( $( this ) );
			return;
		}

		if ( event.key === 'ArrowDown' && $items.eq( index + 1 ).length ) {
			event.preventDefault();
			$items.eq( index + 1 ).trigger( 'focus' );
		}

		if ( event.key === 'ArrowUp' && $items.eq( index - 1 ).length && index > 0 ) {
			event.preventDefault();
			$items.eq( index - 1 ).trigger( 'focus' );
		}
	} );
} );