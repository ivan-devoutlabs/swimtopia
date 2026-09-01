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
	

	 var registerFormatType = wp.richText.registerFormatType;
    var toggleFormat = wp.richText.toggleFormat;
    var applyFormat = wp.richText.applyFormat;
    var getActiveFormat = wp.richText.getActiveFormat;
    var RichTextToolbarButton = wp.blockEditor.RichTextToolbarButton;
    var Popover = wp.components.Popover;
    var TextControl = wp.components.TextControl;
    var Button = wp.components.Button;
    var useState = wp.element.useState;
    var createElement = wp.element.createElement;
    var Fragment = wp.element.Fragment;

    var FORMAT_NAME = 'starter/cta-rotating-text';

    var RotatingTextEdit = function ( props ) {
        var value = props.value;
        var onChange = props.onChange;
        var isActive = props.isActive;

        var activeFormat = getActiveFormat( value, FORMAT_NAME );
        var currentWords = activeFormat && activeFormat.attributes && activeFormat.attributes['data-words']
            ? activeFormat.attributes['data-words']
            : '';

        var state = useState( false );
        var isWriting = state[0];
        var setIsWriting = state[1];

        var textState = useState( currentWords );
        var textValue = textState[0];
        var setTextValue = textState[1];

        return createElement(
            Fragment,
            {},
            createElement( RichTextToolbarButton, {
                icon: 'update',
                title: 'Rotating Text',
                onClick: function () {
                    if ( isActive ) {
                        setTextValue( currentWords );
                        setIsWriting( ! isWriting );
                    } else {
                        setTextValue( '' );
                        setIsWriting( true );
                    }
                },
                isActive: isActive
            } ),
            isWriting && createElement(
                Popover,
                {
                    onClose: function () {
                        setIsWriting( false );
                    },
                    position: 'bottom center'
                },
                createElement(
                    'div',
                    { style: { padding: '16px', minWidth: '260px' } },
                    createElement( TextControl, {
                        label: 'Rotating Words (comma separated)',
                        help: 'e.g. Teams, Leagues, Admins',
                        value: textValue,
                        onChange: function ( newVal ) {
                            setTextValue( newVal );
                        }
                    } ),
                    createElement(
                        'div',
                        { style: { display: 'flex', gap: '8px', marginTop: '8px' } },
                        createElement(
                            Button,
                            {
                                variant: 'primary',
                                onClick: function () {
                                    onChange( applyFormat( value, {
                                        type: FORMAT_NAME,
                                        attributes: {
                                            'data-words': textValue
                                        }
                                    } ) );
                                    setIsWriting( false );
                                }
                            },
                            'Save'
                        ),
                        isActive && createElement(
                            Button,
                            {
                                variant: 'terrible',
                                isDestructive: true,
                                onClick: function () {
                                    onChange( toggleFormat( value, { type: FORMAT_NAME } ) );
                                    setIsWriting( false );
                                }
                            },
                            'Remove'
                        )
                    )
                )
            )
        );
    };

    registerFormatType( FORMAT_NAME, {
        title: 'Rotating Text',
        tagName: 'span',
        className: 'cta-rotating-text',
        attributes: {
            'data-words': 'data-words'
        },
        edit: RotatingTextEdit
    } );
} )( window.wp );