( function ( wp ) {
	'use strict';

	if ( ! wp || ! wp.data || ! wp.domReady ) {
		return;
	}

	var NOTICE_ID = 'starter-cta-png-only';
	var TARGET_CLASS = 'cta__image';

	function isPng( url ) {
		if ( ! url ) {
			return true; 
		}

		return /\.png(\?.*)?$/i.test( url );
	}

	function collectImages( blocks, found ) {
		blocks.forEach( function ( block ) {
			var cls = ( block.attributes && block.attributes.className ) || '';

			if ( block.name === 'core/image' && cls.indexOf( TARGET_CLASS ) !== -1 ) {
				found.push( block );
			}

			if ( block.innerBlocks && block.innerBlocks.length ) {
				collectImages( block.innerBlocks, found );
			}
		} );

		return found;
	}

	wp.domReady( function () {
		var notices = wp.data.dispatch( 'core/notices' );
		var editor = wp.data.select( 'core/block-editor' );

		if ( ! notices || ! editor ) {
			return;
		}

		var shown = false;

		wp.data.subscribe( function () {
			var blocks = editor.getBlocks();

			if ( ! blocks || ! blocks.length ) {
				return;
			}

			var images = collectImages( blocks, [] );
			var bad = images.some( function ( block ) {
				return ! isPng( block.attributes.url );
			} );

			if ( bad && ! shown ) {
				shown = true;

				notices.createNotice(
					'warning',
					( window.starterCtaL10n && window.starterCtaL10n.pngOnly ) ||
						'You can upload only PNG images.',
					{
						id: NOTICE_ID,
						isDismissible: true,
					}
				);
			}

			if ( ! bad && shown ) {
				shown = false;
				notices.removeNotice( NOTICE_ID );
			}
		} );
	} );
} )( window.wp );