
( function ( wp ) {
	'use strict';

	if ( ! wp || ! wp.blocks || ! wp.element ) {
		return;
	}

	var el = wp.element.createElement;
	var __ = wp.i18n.__;

	wp.blocks.registerBlockType( 'starter/webinar-duration', {
		apiVersion: 3,
		title: __( 'Webinar duration', 'starter' ),
		description: __(
			'Length of the webinar video, read from the attached file.',
			'starter'
		),
		category: 'text',
		icon: 'clock',

		usesContext: [ 'postId' ],

		supports: {
			html: false,
			reusable: false,
		},

		attributes: {
			field: { type: 'string', default: 'webinar_video' },
		},

		edit: function () {
			var props = wp.blockEditor.useBlockProps( {
				className: 'webinarsPreview__listItem__time',
			} );

			return el( 'div', props, __( '00:00', 'starter' ) );
		},

		save: function () {
			return null;
		},
	} );
} )( window.wp );