/**
 * Marquee block.
 *
 * A wrapper around the existing marquee markup whose only job is to
 * expose the highlight setting as a toggle. The client asked never to
 * have to type CSS classes, and this is the smallest thing that
 * removes that need: the class is still what drives the effect, but
 * the block writes it.
 *
 * No JSX and no build step — the block has one control, so a webpack
 * entry would cost more than it saves.
 *
 * It saves static markup rather than rendering in PHP: the content is
 * just inner blocks, so there is nothing to compute at request time.
 */
( function ( wp ) {
	'use strict';

	if ( ! wp || ! wp.blocks || ! wp.element ) {
		return;
	}

	var el = wp.element.createElement;
	var __ = wp.i18n.__;

	var useBlockProps = wp.blockEditor.useBlockProps;
	var useInnerBlocksProps = wp.blockEditor.useInnerBlocksProps;
	var InspectorControls = wp.blockEditor.InspectorControls;

	var PanelBody = wp.components.PanelBody;
	var ToggleControl = wp.components.ToggleControl;

	/**
	 * Classes for both editor and front end, kept in one place so the
	 * two can't drift apart.
	 */
	function classNames( attributes ) {
		return 'textMarquee' + ( attributes.highlight ? ' is-highlight' : '' );
	}

	/*
	 * Starting content when the block is inserted: the row with a pair
	 * of items, so the client has something to edit rather than an
	 * empty box.
	 */
	var TEMPLATE = [
		[ 'core/group', { className: 'textMarquee__list' }, [
			[ 'core/heading', {
				level: 3,
				className: 'textMarquee__listItem textMarquee__listItem--text',
				content: 'Where Swimmers Meet',
			} ],
			[ 'core/image', {
				className: 'textMarquee__listItem textMarquee__listItem--logo',
			} ],
		] ],
	];

	wp.blocks.registerBlockType( 'starter/marquee', {
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;

			var blockProps = useBlockProps( {
				className: classNames( attributes ),
			} );

			var innerProps = useInnerBlocksProps( blockProps, {
				template: TEMPLATE,
				templateLock: false,
			} );

			return el(
				wp.element.Fragment,
				null,

				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Marquee', 'starter' ) },
						el( ToggleControl, {
							label: __( 'Highlight text in the centre', 'starter' ),
							help: attributes.highlight
								? __( 'Each phrase changes colour as it passes the middle.', 'starter' )
								: __( 'Text stays a single colour.', 'starter' ),
							checked: !! attributes.highlight,
							onChange: function ( value ) {
								setAttributes( { highlight: value } );
							},
							__nextHasNoMarginBottom: true,
						} )
					)
				),

				el( 'div', innerProps )
			);
		},

		save: function ( props ) {
			var blockProps = useBlockProps.save( {
				className: classNames( props.attributes ),
			} );

			var innerProps = useInnerBlocksProps.save( blockProps );

			return el( 'div', innerProps );
		},
	} );
} )( window.wp );