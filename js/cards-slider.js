
( function ( global ) {
	'use strict';

	var SECTION = '.cardsSimple.slider';
	var LIST = '.cardsSimple__list';
	var ITEM = '.cardsSimple__listItem';
	var ARROWS = '.cardsSimple__arrows';

	function Slider( section ) {
		this.section = section;
		this.list = section.querySelector( LIST );
		this.items = this.list
			? Array.prototype.slice.call( this.list.querySelectorAll( ITEM ) )
			: [];

		this.index = 0;
		this.gap = 0;
	}


	Slider.prototype.build = function () {
		if ( this.items.length < 2 ) {
			return false;
		}

		var viewport = document.createElement( 'div' );

		viewport.className = 'cardsSimple__viewport';

		this.list.parentNode.insertBefore( viewport, this.list );
		viewport.appendChild( this.list );

		this.viewport = viewport;
		this.list.classList.add( 'is-track' );

		var styles = window.getComputedStyle( this.list );

		this.gap = parseFloat( styles.columnGap || styles.gap ) || 0;

		return true;
	};

	Slider.prototype.step = function () {
		var first = this.items[ 0 ];

		return first ? first.getBoundingClientRect().width + this.gap : 0;
	};


	Slider.prototype.perView = function () {
		var step = this.step();

		if ( ! step ) {
			return 1;
		}

		return Math.max(
			1,
			Math.round( this.viewport.getBoundingClientRect().width / step )
		);
	};

	Slider.prototype.maxIndex = function () {
		return Math.max( 0, this.items.length - this.perView() );
	};

	Slider.prototype.update = function () {
		var offset = this.index * this.step();

		this.list.style.transform =
			'translate3d(' + -offset.toFixed( 2 ) + 'px, 0, 0)';

		this.updateArrows();
	};

	Slider.prototype.goTo = function ( index ) {
		index = Math.max( 0, Math.min( this.maxIndex(), index ) );

		if ( index === this.index ) {
			return;
		}

		this.index = index;
		this.update();
	};

	Slider.prototype.updateArrows = function () {
		if ( ! this.arrows ) {
			return;
		}

		this.setArrow( this.arrows.prev, this.index === 0 );
		this.setArrow( this.arrows.next, this.index >= this.maxIndex() );
	};


	Slider.prototype.setArrow = function ( button, isDisabled ) {
		button.classList.toggle( 'disabled', isDisabled );
		button.disabled = isDisabled;
		button.setAttribute( 'aria-disabled', isDisabled ? 'true' : 'false' );
	};

	Slider.prototype.buildArrows = function () {
		var self = this;
		var l10n = global.starterCardsL10n || {};

		var holder = this.section.querySelector( ARROWS );

		if ( ! holder ) {
			holder = document.createElement( 'div' );
			holder.className = 'cardsSimple__arrows';
			this.viewport.parentNode.appendChild( holder );
		}

		function make( dir, label ) {
			var btn = document.createElement( 'button' );

			btn.type = 'button';
			btn.className = 'cardsSimple__arrow cardsSimple__arrow--' + dir;
			btn.setAttribute( 'aria-label', label );

			btn.addEventListener( 'click', function () {
				self.goTo( self.index + ( dir === 'prev' ? -1 : 1 ) );
			} );

			return btn;
		}

		this.arrows = {
			prev: make( 'prev', l10n.prev || 'Попередня картка' ),
			next: make( 'next', l10n.next || 'Наступна картка' ),
		};

		holder.appendChild( this.arrows.prev );
		holder.appendChild( this.arrows.next );
	};

	Slider.prototype.init = function () {
		if ( ! this.build() ) {
			return;
		}

		var self = this;

		this.buildArrows();
		this.update();

		this.viewport.setAttribute( 'tabindex', '0' );
		this.viewport.setAttribute( 'role', 'region' );
		this.viewport.setAttribute(
			'aria-label',
			( global.starterCardsL10n || {} ).region || 'Напрямки'
		);

		this.viewport.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'ArrowRight' ) {
				self.goTo( self.index + 1 );
			}

			if ( event.key === 'ArrowLeft' ) {
				self.goTo( self.index - 1 );
			}
		} );


		function refresh() {
			self.index = Math.min( self.index, self.maxIndex() );
			self.update();
		}

		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( refresh ).observe( this.viewport );
		} else {
			var timer;

			window.addEventListener( 'resize', function () {
				clearTimeout( timer );
				timer = setTimeout( refresh, 200 );
			}, { passive: true } );
		}
	};

	function init() {
		var sections = document.querySelectorAll( SECTION );

		Array.prototype.forEach.call( sections, function ( section ) {
			new Slider( section ).init();
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window );