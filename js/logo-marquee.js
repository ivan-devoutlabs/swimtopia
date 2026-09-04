( function () {
	'use strict';

	var SECTION = '.logoMarquee';
	var LIST = '.logoMarquee__list';

	var SPEED = 150;

	function Marquee( section ) {
		this.section = section;
		this.list = section.querySelector( LIST );
		this.originals = null;
		this.width = 0;
	}

	Marquee.prototype.build = function () {
		var list = this.list;

		if ( ! list ) {
			return;
		}

		if ( ! this.originals ) {
			this.originals = Array.prototype.slice.call( list.children );
		}

		if ( ! this.originals.length ) {
			return;
		}

		var clones = list.querySelectorAll( '[data-marquee-clone]' );

		Array.prototype.forEach.call( clones, function ( node ) {
			node.remove();
		} );

		var sectionWidth = this.section.getBoundingClientRect().width;

		var setWidth = this.originals.reduce( function ( sum, item ) {
			var styles = window.getComputedStyle( item );

			return sum +
				item.getBoundingClientRect().width +
				( parseFloat( styles.marginLeft ) || 0 ) +
				( parseFloat( styles.marginRight ) || 0 );
		}, 0 );

		if ( ! setWidth ) {
			return;
		}


		var repeats = Math.max( 1, Math.ceil( sectionWidth / setWidth ) );
		var self = this;

		function appendSet() {
			self.originals.forEach( function ( item ) {
				var clone = item.cloneNode( true );

				clone.setAttribute( 'data-marquee-clone', '' );

				clone.setAttribute( 'aria-hidden', 'true' );

				list.appendChild( clone );
			} );
		}

		var i;

		for ( i = 1; i < repeats; i++ ) {
			appendSet();
		}

		for ( i = 0; i < repeats; i++ ) {
			appendSet();
		}

		var halfWidth = setWidth * repeats;


		this.list.style.setProperty(
			'--marquee-distance',
			halfWidth.toFixed( 2 ) + 'px'
		);

	
		this.list.style.setProperty(
			'--marquee-duration',
			( halfWidth / SPEED ).toFixed( 2 ) + 's'
		);

		this.width = sectionWidth;
		this.section.classList.add( 'is-ready' );
	};

	Marquee.prototype.init = function () {
		var self = this;

		this.build();

		var images = this.section.querySelectorAll( 'img' );
		var pending = 0;

		Array.prototype.forEach.call( images, function ( img ) {
			if ( img.complete ) {
				return;
			}

			pending++;

			function done() {
				pending--;

				if ( pending === 0 ) {
					self.build();
				}
			}

			img.addEventListener( 'load', done, { once: true } );
			img.addEventListener( 'error', done, { once: true } );
		} );

	
		if ( 'IntersectionObserver' in window ) {
			new IntersectionObserver( function ( entries ) {
				entries.forEach( function ( entry ) {
					self.section.classList.toggle(
						'is-offscreen',
						! entry.isIntersecting
					);
				} );
			}, { threshold: 0 } ).observe( this.section );
		}

		
		var timer;

		window.addEventListener( 'resize', function () {
			clearTimeout( timer );

			timer = setTimeout( function () {
				var width = self.section.getBoundingClientRect().width;

				if ( Math.abs( width - self.width ) > 1 ) {
					self.build();
				}
			}, 250 );
		}, { passive: true } );
	};

	function init() {
		var sections = document.querySelectorAll( SECTION );

		Array.prototype.forEach.call( sections, function ( section ) {
			new Marquee( section ).init();
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();