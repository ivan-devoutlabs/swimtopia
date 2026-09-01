( function( wp ) {
    var registerBlockType = wp.blocks.registerBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;

    registerBlockType( 'theme/member-position', {
        title: 'Team Member Position',
        icon: 'id-alt',
        category: 'theme',
        
        edit: function() {
            var blockProps = useBlockProps();
            return el(
                'div',
                blockProps,
                'Team Member Position' 
            );
        },
        
        save: function() {
            return null;
        },
    } );
} )( window.wp );