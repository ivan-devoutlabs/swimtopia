
( function ( global ) {
	'use strict';

	var SECTION = '.tabs';
	var SWAP = 800;

	function Tabs( section ) {
		this.section = section;
		this.slider = section.querySelector( '.tabs__slider' );
		this.menu = section.querySelector( '.tabs__menu' );
		this.imagesWrap = section.querySelector( '.tabs__sliderImages' );

		this.tabs = Array.prototype.slice.call(
			section.querySelectorAll( '.tabs__menuItem' )
		);
		this.images = Array.prototype.slice.call(
			section.querySelectorAll( '.tabs__sliderImages__item' )
		);
		this.contents = Array.prototype.slice.call(
			section.querySelectorAll( '.tabs__sliderContent__item' )
		);

		this.index = 0;
		this.distortion = null;
	}


	Tabs.prototype.colorOf = function ( tab ) {
		var match = tab.className.match( /has-([a-z0-9-]+)-background-color/ );

		if ( ! match ) {
			return '';
		}

		return 'var(--wp--preset--color--' + match[ 1 ] + ')';
	};


	Tabs.prototype.moveBg = function () {
		if ( ! this.bg ) {
			return;
		}

		var tab = this.tabs[ this.index ];

		if ( ! tab ) {
			return;
		}

		var menuRect = this.menu.getBoundingClientRect();
		var tabRect = tab.getBoundingClientRect();

		this.bg.style.width = tabRect.width + 'px';
		this.bg.style.transform =
			'translate3d(' + ( tabRect.left - menuRect.left ) + 'px, -50%, 0)';

		var color = this.colorOf( tab );

		if ( color ) {
			this.bg.style.backgroundColor = color;
		}
	};

	Tabs.prototype.applyColor = function () {
		var color = this.colorOf( this.tabs[ this.index ] );

		if ( color && this.slider ) {
			this.slider.style.backgroundColor = color;
		}
	};

	Tabs.prototype.goTo = function ( index ) {
		var total = this.tabs.length;

		index = Math.max( 0, Math.min( total - 1, index ) );

		if ( index === this.index ) {
			return;
		}

		var previous = this.index;

		this.index = index;

		this.tabs.forEach( function ( tab, i ) {
			tab.classList.toggle( 'is-active', i === index );
			tab.setAttribute( 'aria-selected', i === index ? 'true' : 'false' );
			tab.setAttribute( 'tabindex', i === index ? '0' : '-1' );
		} );

		this.contents.forEach( function ( item, i ) {
			item.classList.toggle( 'is-active', i === index );
			item.setAttribute( 'aria-hidden', i === index ? 'false' : 'true' );
		} );

		if ( this.distortion ) {
			this.distortion.to( index );
		} else {
			this.images.forEach( function ( image, i ) {
				image.classList.toggle( 'is-active', i === index );
			} );
		}

		this.applyColor();
		this.moveBg();
		this.updateArrows();

		if ( this.focusTab ) {
			this.tabs[ index ].focus();
			this.focusTab = false;
		}

		return previous;
	};

	Tabs.prototype.updateArrows = function () {
		if ( ! this.arrows ) {
			return;
		}

		var last = this.tabs.length - 1;

		this.setArrow( this.arrows.prev, this.index === 0 );
		this.setArrow( this.arrows.next, this.index === last );
	};

	Tabs.prototype.setArrow = function ( button, isDisabled ) {
		button.classList.toggle( 'disabled', isDisabled );
		button.disabled = isDisabled;
		button.setAttribute( 'aria-disabled', isDisabled ? 'true' : 'false' );
	};

	Tabs.prototype.buildBg = function () {
		var bg = this.menu.querySelector( '.tabs__menuBg' );

		if ( ! bg ) {
			bg = document.createElement( 'div' );
			bg.className = 'tabs__menuBg';
			bg.setAttribute( 'aria-hidden', 'true' );
			this.menu.insertBefore( bg, this.menu.firstChild );
		}

		this.bg = bg;
	};

	Tabs.prototype.buildArrows = function () {
		var self = this;
		var holder = this.section.querySelector( '.tabs__arrows' );

		if ( ! holder ) {
			holder = document.createElement( 'div' );
			holder.className = 'tabs__arrows';
			this.slider.appendChild( holder );
		}

		function make( dir, label ) {
			var btn = document.createElement( 'button' );

			btn.type = 'button';
			btn.className = 'tabs__arrow tabs__arrow--' + dir;
			btn.setAttribute( 'aria-label', label );

			btn.addEventListener( 'click', function () {
				self.goTo( self.index + ( dir === 'prev' ? -1 : 1 ) );
			} );

			return btn;
		}

		var l10n = global.starterTabsL10n || {};

		this.arrows = {
			prev: make( 'prev', l10n.prev || 'Попередній таб' ),
			next: make( 'next', l10n.next || 'Наступний таб' ),
		};

		holder.appendChild( this.arrows.prev );
		holder.appendChild( this.arrows.next );
	};

	Tabs.prototype.init = function () {
		if ( this.tabs.length < 2 ) {
			return;
		}

		var self = this;

		this.buildBg();
		this.buildArrows();

		this.menu.setAttribute( 'role', 'tablist' );

		this.tabs.forEach( function ( tab, i ) {
			tab.setAttribute( 'role', 'tab' );
			tab.setAttribute( 'tabindex', i === 0 ? '0' : '-1' );
			tab.setAttribute( 'aria-selected', i === 0 ? 'true' : 'false' );
			tab.classList.toggle( 'is-active', i === 0 );

			tab.addEventListener( 'click', function () {
				self.goTo( i );
			} );

			tab.addEventListener( 'keydown', function ( event ) {
				if ( event.key === 'ArrowRight' ) {
					self.focusTab = true;
					self.goTo( self.index + 1 );
				}

				if ( event.key === 'ArrowLeft' ) {
					self.focusTab = true;
					self.goTo( self.index - 1 );
				}

				if ( event.key === 'Enter' || event.key === ' ' ) {
					event.preventDefault();
					self.goTo( i );
				}
			} );
		} );

		this.contents.forEach( function ( item, i ) {
			item.classList.toggle( 'is-active', i === 0 );
			item.setAttribute( 'aria-hidden', i === 0 ? 'false' : 'true' );
		} );

		this.images.forEach( function ( image, i ) {
			image.classList.toggle( 'is-active', i === 0 );
		} );

		var sources = this.images
			.map( function ( figure ) {
				return figure.querySelector( 'img' );
			} )
			.filter( Boolean );

		if ( global.StarterDistortion && sources.length > 1 ) {
			this.distortion = global.StarterDistortion.create( this.imagesWrap, {
				strength: 0.35,
				duration: SWAP,
				sources: sources,
			} );

			if ( this.distortion ) {
				this.section.classList.add( 'has-distortion' );
			}
		}

		this.applyColor();
		this.updateArrows();

		this.moveBg();

		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( function () {
				self.moveBg();
			} ).observe( this.menu );
		}

		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( function () {
				self.moveBg();
			} );
		}
	};

	function init() {
		var sections = document.querySelectorAll( SECTION );

		Array.prototype.forEach.call( sections, function ( section ) {
			new Tabs( section ).init();
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window );

document.addEventListener('DOMContentLoaded', function() {
        
    function equalizeTabsHeight() {
        const tabContainers = document.querySelectorAll('.tabs__sliderContent');
        tabContainers.forEach(function(container) {
            const items = container.querySelectorAll('.tabs__sliderContent__item');
            const menu = container.querySelector('.tabs__menu');
            let maxContentHeight = 0;
            container.style.minHeight = '';
            items.forEach(function(item) {
                const isHidden = window.getComputedStyle(item).display === 'none';
                if (isHidden) {
                    item.style.cssText = 'display: block !important; position: absolute !important; visibility: hidden !important; width: 100%;';
                }
                const currentHeight = item.offsetHeight;
                if (currentHeight > maxContentHeight) {
                    maxContentHeight = currentHeight;
                }
                if (isHidden) {
                    item.style.cssText = '';
                }
            });
            const menuHeight = menu ? menu.offsetHeight : 0;
            container.style.minHeight = (maxContentHeight + menuHeight) + 'px';
        });
    }
    equalizeTabsHeight();
    window.addEventListener('resize', function() {
        clearTimeout(window.tabsResizeTimer);
        window.tabsResizeTimer = setTimeout(equalizeTabsHeight, 150);
    });
});