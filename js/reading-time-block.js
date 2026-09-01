( function( wp ) {
    wp.blocks.registerBlockType( 'starter/reading-time', {
        title: 'Reading Time',
        icon: 'clock',
        category: 'theme',
        
        edit: function() {
            return wp.element.createElement(
                'div',
                { className: 'blogPreview__listItem__time' },
                '3 min read' 
            );
        },
        
        save: function() {
            return null;
        }
    } );
} )( window.wp );