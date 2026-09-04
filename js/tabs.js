/**
 * Tabs.
 *
 * Rebuilt for the layout where one tab is a single block holding both
 * its image and its copy. The script no longer pairs two separate
 * lists by index — it reads each pair out of its own wrapper, so
 * reordering tabs in the editor can't desynchronise them.
 */
( function ( global ) {
	'use strict';

	var SECTION = '.tabs';
	var SWAP = 800;

	function Tabs( section ) {
		this.section = section;
		this.slider = section.querySelector( '.tabs__slider' );
		this.menu = section.querySelector( '.tabs__menu' );
		this.list = section.querySelector( '.tabs__list' );

		this.tabs = Array.prototype.slice.call(
			section.querySelectorAll( '.tabs__menuItem' )
		);

		this.items = this.list
			? Array.prototype.slice.call(
				this.list.querySelectorAll( '.tabs__item' )
			)
			: [];

		// Image and copy are read from the tab they belong to
		this.images = this.items.map( function ( item ) {
			return item.querySelector( '.tabs__sliderImages__item' );
		} );

		this.contents = this.items.map( function ( item ) {
			return item.querySelector( '.tabs__sliderContent__item' );
		} );

		this.index = 0;
		this.distortion = null;
	}

	/**
	 * Tab colour, taken from the palette slug in the class.
	 *
	 * Returns the CSS variable rather than a resolved value so the
	 * colour stays governed by theme.json.
	 */
	Tabs.prototype.colorOf = function ( tab ) {
		var match = tab.className.match( /has-([a-z0-9-]+)-background-color/ );

		return match ? 'var(--wp--preset--color--' + match[ 1 ] + ')' : '';
	};

	/**
	 * Moving pill under the active tab.
	 *
	 * Positioned from the tab's real coordinates rather than from its
	 * index: the labels are different lengths, so a fixed step would
	 * miss.
	 */
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

	/**
	 * Slider background, plus a class naming the colour.
	 *
	 * The class exists so the stylesheet can react to a specific colour
	 * without matching against the inline style string, which breaks on
	 * any change in spacing or property order.
	 */
	Tabs.prototype.applyColor = function () {
		var tab = this.tabs[ this.index ];

		if ( ! tab || ! this.slider ) {
			return;
		}

		var match = tab.className.match( /has-([a-z0-9-]+)-background-color/ );

		if ( ! match ) {
			return;
		}

		this.slider.style.backgroundColor =
			'var(--wp--preset--color--' + match[ 1 ] + ')';

		if ( this.colorClass ) {
			this.slider.classList.remove( this.colorClass );
		}

		this.colorClass = 'is-color-' + match[ 1 ];
		this.slider.classList.add( this.colorClass );
	};

	/**
	 * Height of a single column, from its children.
	 *
	 * The copy column is a flex item and stretches to match the image
	 * beside it, so its own box always reports the image's height no
	 * matter how much text it holds. Measuring it directly therefore
	 * tells us nothing.
	 *
	 * The children don't stretch, so their heights plus margins give
	 * the real content height. Margins are read from the computed
	 * styles rather than assumed, since they come from theme.json and
	 * differ per element.
	 */
	function columnHeight( column ) {
		if ( ! column ) {
			return 0;
		}

		var total = 0;

		Array.prototype.forEach.call( column.children, function ( child ) {
			var styles = window.getComputedStyle( child );

			if ( styles.display === 'none' ) {
				return;
			}

			total += child.getBoundingClientRect().height;
			total += parseFloat( styles.marginTop ) || 0;
			total += parseFloat( styles.marginBottom ) || 0;
		} );

		// Padding on the column itself is not part of its children
		var own = window.getComputedStyle( column );

		total += parseFloat( own.paddingTop ) || 0;
		total += parseFloat( own.paddingBottom ) || 0;

		return total;
	}

	/**
	 * Height of the tallest tab.
	 *
	 * The copy is measured from its children, the image from its own
	 * box — it has a fixed aspect ratio and doesn't stretch. Whichever
	 * is taller decides the height of the stack.
	 *
	 * Any offset the copy carries is added on top: the --role variant
	 * pushes it down, and without that the text would be clipped by
	 * exactly that amount.
	 */
	Tabs.prototype.equalizeHeight = function () {
		if ( ! this.list || ! this.items.length ) {
			return;
		}

		this.list.style.minHeight = '';

		var tallest = 0;

		this.items.forEach( function ( item ) {
			var saved = {
				position: item.style.position,
				visibility: item.style.visibility,
				opacity: item.style.opacity,
			};

			/*
			 * Laid out in flow but kept out of sight, so the page
			 * doesn't flicker while each tab is measured in turn.
			 */
			item.style.position = 'relative';
			item.style.visibility = 'hidden';
			item.style.opacity = '0';

			var itemTop = item.getBoundingClientRect().top;

			var content = item.querySelector( '.tabs__sliderContent__item' );
			var image = item.querySelector( '.tabs__sliderImages__item' );

			var contentHeight = 0;

			if ( content ) {
				var offset = content.getBoundingClientRect().top - itemTop;

				contentHeight = offset + columnHeight( content );
			}

			var imageHeight = image
				? image.getBoundingClientRect().height
				: 0;

			var height = Math.max( contentHeight, imageHeight );

			item.style.position = saved.position;
			item.style.visibility = saved.visibility;
			item.style.opacity = saved.opacity;

			if ( height > tallest ) {
				tallest = height;
			}
		} );

		if ( tallest > 0 ) {
			this.list.style.minHeight = Math.ceil( tallest ) + 'px';
		}
	};

	Tabs.prototype.goTo = function ( index ) {
		var total = this.tabs.length;

		// Wraps around: the arrows never dead-end
		if ( index < 0 ) {
			index = total - 1;
		} else if ( index >= total ) {
			index = 0;
		}

		if ( index === this.index ) {
			return;
		}

		this.index = index;

		this.tabs.forEach( function ( tab, i ) {
			tab.classList.toggle( 'is-active', i === index );
			tab.setAttribute( 'aria-selected', i === index ? 'true' : 'false' );
			tab.setAttribute( 'tabindex', i === index ? '0' : '-1' );
		} );

		this.items.forEach( function ( item, i ) {
			item.classList.toggle( 'is-active', i === index );
			item.setAttribute( 'aria-hidden', i === index ? 'false' : 'true' );
		} );

		if ( this.distortion ) {
			this.distortion.to( index );
		}

		this.applyColor();
		this.moveBg();

		// Only pull focus when the tab was reached with the keyboard
		if ( this.focusTab ) {
			this.tabs[ index ].focus();
			this.focusTab = false;
		}
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
		var l10n = global.starterTabsL10n || {};

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

		this.arrows = {
			prev: make( 'prev', l10n.prev || 'Previous tab' ),
			next: make( 'next', l10n.next || 'Next tab' ),
		};

		holder.appendChild( this.arrows.prev );
		holder.appendChild( this.arrows.next );
	};

	/**
	 * Canvas for the distortion effect.
	 *
	 * The images now sit inside their own tabs, so there is no single
	 * column to attach the canvas to. A holder is created instead and
	 * placed over the first image by measuring it — that way the
	 * proportions stay in the stylesheet and the canvas follows them.
	 */
	Tabs.prototype.mountCanvas = function () {
		var self = this;
		var anchor = this.images[ 0 ];

		var sources = this.images
			.map( function ( figure ) {
				return figure && figure.querySelector( 'img' );
			} )
			.filter( Boolean );

		if ( ! global.StarterDistortion || ! anchor || sources.length < 2 ) {
			return;
		}

		var holder = document.createElement( 'div' );

		holder.className = 'tabs__canvasHolder';
		holder.setAttribute( 'aria-hidden', 'true' );

		this.list.appendChild( holder );
		this.holder = holder;

		function place() {
			var listRect = self.list.getBoundingClientRect();
			var imageRect = anchor.getBoundingClientRect();

			if ( imageRect.width < 1 || imageRect.height < 1 ) {
				return;
			}

			holder.style.left = ( imageRect.left - listRect.left ) + 'px';
			holder.style.top = ( imageRect.top - listRect.top ) + 'px';
			holder.style.width = imageRect.width + 'px';
			holder.style.height = imageRect.height + 'px';
		}

		place();

		// The image only has a size once it has loaded
		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( place ).observe( anchor );
		}

		this.distortion = global.StarterDistortion.create( holder, {
			strength: 0.35,
			duration: SWAP,
			sources: sources,
		} );

		if ( this.distortion ) {
			this.section.classList.add( 'has-distortion' );
		}
	};

	Tabs.prototype.init = function () {
		if ( this.tabs.length < 2 || ! this.items.length ) {
			return;
		}

		var self = this;
		var sectionId = this.section.id ||
			( 'tabs-' + Math.random().toString( 36 ).slice( 2, 9 ) );

		this.buildBg();
		this.buildArrows();

		// Announced as a set of switches rather than plain paragraphs
		this.menu.setAttribute( 'role', 'tablist' );

		this.tabs.forEach( function ( tab, i ) {
			tab.id = tab.id || ( sectionId + '-tab-' + i );

			tab.setAttribute( 'role', 'tab' );
			tab.setAttribute( 'tabindex', i === 0 ? '0' : '-1' );
			tab.setAttribute( 'aria-selected', i === 0 ? 'true' : 'false' );
			tab.classList.toggle( 'is-active', i === 0 );

			var panel = self.items[ i ];

			if ( panel ) {
				panel.id = panel.id || ( sectionId + '-panel-' + i );
				tab.setAttribute( 'aria-controls', panel.id );
			}

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

		this.items.forEach( function ( item, i ) {
			item.setAttribute( 'role', 'tabpanel' );

			if ( self.tabs[ i ] && self.tabs[ i ].id ) {
				item.setAttribute( 'aria-labelledby', self.tabs[ i ].id );
			}

			item.classList.toggle( 'is-active', i === 0 );
			item.setAttribute( 'aria-hidden', i === 0 ? 'false' : 'true' );
		} );

		this.equalizeHeight();
		this.mountCanvas();
		this.applyColor();
		this.moveBg();

		window.addEventListener( 'load', function () {
			self.equalizeHeight();
			self.moveBg();
		} );

		/*
		 * Watching the slider rather than the whole section: the height
		 * is set on a child of the section, so observing the section
		 * would feed its own changes back in.
		 */
		if ( 'ResizeObserver' in window && this.slider ) {
			var timer;

			new ResizeObserver( function () {
				self.moveBg();

				clearTimeout( timer );
				timer = setTimeout( function () {
					self.equalizeHeight();
				}, 100 );
			} ).observe( this.slider );
		}

		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( function () {
				self.moveBg();
				self.equalizeHeight();
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