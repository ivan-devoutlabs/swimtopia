( function ( $ ) {
    'use strict';
 
    var SECTION = '.hero';
    var ACTIVE = 'is-spotlight-active';
    
    function initSection( section ) {
        var rect = null;
        var pending = false;
        var pointer = { x: 0, y: 0 };
    
        var EASE = 0.75;
        var current = { x: 0, y: 0 };
        var animating = false;
    
        function measure() {
            rect = section.getBoundingClientRect();
        }
    
        function apply() {
            section.style.setProperty( '--spot-x', current.x.toFixed( 1 ) + 'px' );
            section.style.setProperty( '--spot-y', current.y.toFixed( 1 ) + 'px' );
        }
    
        function tick() {
            var dx = pointer.x - current.x;
            var dy = pointer.y - current.y;

            current.x += dx * EASE;
            current.y += dy * EASE;

            apply();

            if ( Math.abs( dx ) > 0.5 || Math.abs( dy ) > 0.5 ) {
                requestAnimationFrame( tick );
            } else {
                animating = false;
            }
        }

        function onMove( event ) {
            if ( pending ) {
                return;
            }

            pending = true;

            requestAnimationFrame( function () {
                pending = false;

                if ( ! rect ) {
                    measure();
                }

                pointer.x = event.clientX - rect.left;
                pointer.y = event.clientY - rect.top;

                if ( ! animating ) {
                    animating = true;
                    requestAnimationFrame( tick );
                }
            } );
        }

        function onEnter( event ) {
            measure();

            pointer.x = current.x = event.clientX - rect.left;
            pointer.y = current.y = event.clientY - rect.top;

            apply();
            section.classList.add( ACTIVE );
        }

        function onLeave() {
            section.classList.remove( ACTIVE );
        }

        section.addEventListener( 'mouseenter', onEnter );
        section.addEventListener( 'mousemove', onMove );
        section.addEventListener( 'mouseleave', onLeave );

        window.addEventListener( 'resize', measure, { passive: true } );
        window.addEventListener( 'scroll', measure, { passive: true } );
    }
    
    function init() {
        if ( window.matchMedia( '(pointer: coarse)' ).matches ) {
            return;
        }
    
        var sections = document.querySelectorAll( SECTION );
    
        Array.prototype.forEach.call( sections, initSection );
    }
    
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }


    $('.hero__buton .wp-block-button__link').hover(
    function(){
        $('.hero').addClass('is-revealed');
    },
    function(){
        $('.hero').removeClass('is-revealed');
    })
} )( jQuery );

( function () {
	'use strict';

	var BANNER = '.hero__banner';
	var STORAGE_KEY = 'swimtopia-hero-banner-closed';

	function label() {
		var l10n = window.starterBannerL10n || {};
		return l10n.close || 'Закрити банер';
	}

	function init() {
		var banners = document.querySelectorAll( BANNER );

		Array.prototype.forEach.call( banners, function ( banner ) {

			try {
				if ( window.sessionStorage.getItem( STORAGE_KEY ) === '1' ) {
					banner.hidden = true;
					return;
				}
			} catch ( e ) {
			}

			var btn = document.createElement( 'button' );

			btn.type = 'button';
			btn.className = 'hero__bannerClose';
			btn.setAttribute( 'aria-label', label() );

			btn.addEventListener( 'click', function () {
				banner.hidden = true;

				try {
					window.sessionStorage.setItem( STORAGE_KEY, '1' );
				} catch ( e ) {}
			} );

			banner.appendChild( btn );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();