( function ( wp ) {
	'use strict';

	if ( ! wp || ! wp.plugins || ! wp.element ) {
		return;
	}

	var el = wp.element.createElement;
	var __ = wp.i18n.__;

	var PanelBody = wp.components.PanelBody;
	var TextControl = wp.components.TextControl;

	var DocumentPanel =
		( wp.editor && wp.editor.PluginDocumentSettingPanel ) ||
		( wp.editPost && wp.editPost.PluginDocumentSettingPanel );

	if ( ! DocumentPanel ) {
		return;
	}

	var POST_TYPE = 'team';

	function Panel() {
		var select = wp.data.useSelect( function ( s ) {
			return {
				postType: s( 'core/editor' ).getCurrentPostType(),
				meta: s( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {},
			};
		}, [] );

		var dispatch = wp.data.useDispatch( 'core/editor' );

		if ( select.postType !== POST_TYPE ) {
			return null;
		}

		function update( key, value ) {
			var meta = {};

			meta[ key ] = value;

			dispatch.editPost( { meta: meta } );
		}

		return el(
			DocumentPanel,
			{
				name: 'theme-team-panel',
				title: __( 'Member Info', 'theme' ),
				className: 'theme-team-panel',
			},
			el( TextControl, {
				label: __( 'Position', 'theme' ),
				value: select.meta.member_position || '',
				onChange: function ( value ) {
					update( 'member_position', value );
				},
				__nextHasNoMarginBottom: true,
			} )
		);
	}

	wp.plugins.registerPlugin( 'theme-team-meta', {
		render: Panel,
		icon: null,
	} );
} )( window.wp );