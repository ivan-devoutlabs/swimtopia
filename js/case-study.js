( function ( global ) {
	'use strict';

	var SECTION = '.caseStudyPreview';

	function Slider( section ) {
		this.section = section;
		this.viewport = section.querySelector( '.caseStudyPreview__slider' );
		this.index = 0;
		this.gap = 0;

		this.items = this.viewport
			? Array.prototype.slice.call( this.viewport.children ).filter( function ( node ) {
				return node.nodeType === 1;
			} )
			: [];
	}

	Slider.prototype.build = function () {
		if ( this.items.length < 2 ) {
			return false;
		}

		var track = document.createElement( 'div' );

		track.className = 'caseStudyPreview__track';

		this.viewport.appendChild( track );

		this.items.forEach( function ( item ) {
			track.appendChild( item );
		} );

		this.track = track;
		this.viewport.classList.add( 'is-slider' );

		var styles = window.getComputedStyle( track );

		this.gap = parseFloat( styles.columnGap || styles.gap ) || 0;

		return true;
	};

	Slider.prototype.step = function () {
		var first = this.items[ 0 ];

		if ( ! first ) {
			return 0;
		}

		return first.getBoundingClientRect().width + this.gap;
	};

	Slider.prototype.update = function () {
		var offset = this.index * this.step();

		this.track.style.transform =
			'translate3d(' + -offset.toFixed( 2 ) + 'px, 0, 0)';

		var self = this;

		this.items.forEach( function ( item, i ) {
			item.classList.toggle( 'is-active', i === self.index );
		} );

		this.updateArrows();
	};

	Slider.prototype.goTo = function ( index ) {
		var last = this.items.length - 1;

		index = Math.max( 0, Math.min( last, index ) );

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

		var last = this.items.length - 1;

		this.setArrow( this.arrows.prev, this.index === 0 );
		this.setArrow( this.arrows.next, this.index === last );
	};

	Slider.prototype.setArrow = function ( button, isDisabled ) {
		button.classList.toggle( 'disabled', isDisabled );
		button.disabled = isDisabled;
		button.setAttribute( 'aria-disabled', isDisabled ? 'true' : 'false' );
	};

	Slider.prototype.buildArrows = function () {
		var self = this;
		var l10n = global.starterCaseStudyL10n || {};

		var holder = this.section.querySelector( '.caseStudyPreview__arrows' );

		if ( ! holder ) {
			holder = document.createElement( 'div' );
			holder.className = 'caseStudyPreview__arrows';

			this.viewport.parentNode.insertBefore( holder, this.viewport );
		}

		function make( dir, label ) {
			var btn = document.createElement( 'button' );

			btn.type = 'button';
			btn.className = 'caseStudyPreview__arrow caseStudyPreview__arrow--' + dir;
			btn.setAttribute( 'aria-label', label );

			btn.addEventListener( 'click', function () {
				self.goTo( self.index + ( dir === 'prev' ? -1 : 1 ) );
			} );

			return btn;
		}

		this.arrows = {
			prev: make( 'prev', l10n.prev || 'Попередній кейс' ),
			next: make( 'next', l10n.next || 'Наступний кейс' ),
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
			( global.starterCaseStudyL10n || {} ).region || 'Кейси'
		);

		this.viewport.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'ArrowRight' ) {
				self.goTo( self.index + 1 );
			}

			if ( event.key === 'ArrowLeft' ) {
				self.goTo( self.index - 1 );
			}
		} );

		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( function () {
				self.update();
			} ).observe( this.viewport );
		} else {
			var timer;

			window.addEventListener( 'resize', function () {
				clearTimeout( timer );
				timer = setTimeout( function () {
					self.update();
				}, 200 );
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

jQuery(document).ready(function($){
    $('.caseStudyPreview__sliderItem').hover(
        function(){
            $(this).find('.caseStudyPreview__sliderItem__button').stop().slideDown(300);
        },
        function(){
            $(this).find('.caseStudyPreview__sliderItem__button').stop().slideUp(300);
        }
    );
})