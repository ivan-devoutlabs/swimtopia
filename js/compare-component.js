( function () {
    'use strict';

    var SECTION = '.compareComponent';

    function setup( section ) {
        var headers = section.querySelectorAll( '.compareComponent__headerTag' );

        if ( headers.length < 2 ) {
            return;
        }

        var colCount = headers.length; 

        var labels = Array.prototype.map.call( headers, function ( node ) {
            return node.textContent.trim();
        } );

        var cells = section.querySelectorAll( '.compareComponent__rowItem' );

        Array.prototype.forEach.call( cells, function ( cell, i ) {
            var colIndex = i % colCount;
            
            if ( colIndex === 0 || ! labels[ colIndex ] ) {
                return;
            }

            cell.setAttribute( 'data-label', labels[ colIndex ] );
        } );

        section.classList.add( 'has-labels' );
    }

    function init() {
        var sections = document.querySelectorAll( SECTION );

        Array.prototype.forEach.call( sections, setup );
    }

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }
} )();


document.addEventListener('DOMContentLoaded', function() {
    const wrappers = document.querySelectorAll('.compareComponent__contentWrapper');
    
    if (wrappers.length === 0) return;

    function updateBackgrounds(wrapper) {
        const headers = wrapper.querySelectorAll('.compareComponent__headerItem');
        const bg2 = wrapper.querySelector('.compareComponent__bg--2');
        const bg3 = wrapper.querySelector('.compareComponent__bg--3');

        if (headers.length < 3 || !bg2 || !bg3) return;

        wrapper.style.position = 'relative';

        const header2 = headers[1];
        const header3 = headers[2];

        const wrapperRect = wrapper.getBoundingClientRect();
        const h2Rect = header2.getBoundingClientRect();
        const h3Rect = header3.getBoundingClientRect();

        const left2 = h2Rect.left - wrapperRect.left;
        const left3 = h3Rect.left - wrapperRect.left;

        bg2.style.width = h2Rect.width + 'px';
        bg2.style.left = left2 + 'px';

        bg3.style.width = h3Rect.width + 24 + 'px';
        bg3.style.left = left3 + 'px';
    }

    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            requestAnimationFrame(() => {
                updateBackgrounds(entry.target);
            });
        }
    });

    wrappers.forEach(wrapper => {
        resizeObserver.observe(wrapper);
        
        updateBackgrounds(wrapper);
    });
});