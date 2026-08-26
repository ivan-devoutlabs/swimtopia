( function( wp ) {
    if ( ! wp || ! wp.blocks || ! wp.element || ! wp.serverSideRender ) {
        return;
    }

    var el = wp.element.createElement;
    var ServerSideRender = wp.serverSideRender;
    var useBlockProps = wp.blockEditor.useBlockProps;

    wp.blocks.registerBlockType( 'starter/blog-filter', {
        edit: function( props ) {
            var blockProps = useBlockProps();
            
            return el(
                'div',
                blockProps,
                el( ServerSideRender, {
                    block: 'starter/blog-filter',
                    attributes: props.attributes
                } )
            );
        },
        save: function() {
            return null;
        }
    } );
} )( window.wp );