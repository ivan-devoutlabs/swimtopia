( function () {
	'use strict';

	var SECTION = '.logoMarquee, .textMarquee';
	var TRACK = '.logoMarquee__list, .textMarquee__list';

	var SPEED = 90;

	function Marquee( section ) {
		this.section = section;
		this.track = section.querySelector( TRACK );
		this.originals = null;
		this.halfWidth = 0;
		this.offset = 0;
		this.lastTime = 0;
		this.raf = null;
		this.paused = false;
		this.visible = true;
	}

	Marquee.prototype.build = function () {
        var track = this.track;

        if ( ! track ) {
            return;
        }

        if ( ! this.originals ) {
            this.originals = Array.prototype.slice.call( track.children );
        }

        if ( ! this.originals.length ) {
            return;
        }

        var clones = track.querySelectorAll( '[data-marquee-clone]' );
        Array.prototype.forEach.call( clones, function ( node ) {
            node.remove();
        } );

        var containerWidth = this.section.getBoundingClientRect().width;
        this.section.style.setProperty( '--marquee-container', containerWidth + 'px' );

        var setWidth = this.originals.reduce( function ( sum, item ) {
            return sum + item.getBoundingClientRect().width;
        }, 0 );

        if ( ! setWidth ) {
            return;
        }

        var repeats = Math.max( 1, Math.ceil( containerWidth / setWidth ) );
        var self = this;

        function appendSet() {
            self.originals.forEach( function ( item ) {
                var clone = item.cloneNode( true );
                clone.setAttribute( 'data-marquee-clone', '' );
                clone.setAttribute( 'aria-hidden', 'true' );
                track.appendChild( clone );
            } );
        }

        var i;
        for ( i = 1; i < repeats; i++ ) {
            appendSet();
        }
        for ( i = 0; i < repeats; i++ ) {
            appendSet();
        }

        this.halfWidth = setWidth * repeats;
        this.containerWidth = containerWidth;
        this.offset = this.offset % this.halfWidth;

        // --- НОВИЙ КОД: Кешування координат для підсвітки центру ---
        var trackRect = track.getBoundingClientRect();
        this.containerCenter = this.containerWidth / 2;
        this.allItems = Array.prototype.slice.call( track.children );
        
        this.itemData = this.allItems.map(function(item) {
            var rect = item.getBoundingClientRect();
            return {
                el: item,
                left: rect.left - trackRect.left, // Позиція відносно треку
                width: rect.width,
                isActive: false
            };
        });
        // ------------------------------------------------------------

        this.section.classList.add( 'is-ready' );
    };

    Marquee.prototype.tick = function ( time ) {
        if ( ! this.lastTime ) {
            this.lastTime = time;
        }

        var delta = ( time - this.lastTime ) / 1000;
        this.lastTime = time;

        if ( delta > 0.1 ) {
            delta = 0.1;
        }

        if ( ! this.paused && this.halfWidth ) {
            this.offset += SPEED * delta;

            if ( this.offset >= this.halfWidth ) {
                this.offset -= this.halfWidth;
            }

            this.track.style.transform =
                'translate3d(' + -this.offset.toFixed( 2 ) + 'px, 0, 0)';

            // --- НОВИЙ КОД: Перевірка перетину центру ---
            if ( this.itemData ) {
                var currentOffset = this.offset;
                var center = this.containerCenter;

                for ( var i = 0; i < this.itemData.length; i++ ) {
                    var data = this.itemData[i];
                    var currentLeft = data.left - currentOffset;
                    var currentRight = currentLeft + data.width;

                    // Якщо центр контейнера потрапляє в межі поточного елемента
                    if ( currentLeft <= center && currentRight >= center ) {
                        if ( ! data.isActive ) {
                            data.el.classList.add( 'is-center' );
                            data.isActive = true;
                        }
                    } else {
                        if ( data.isActive ) {
                            data.el.classList.remove( 'is-center' );
                            data.isActive = false;
                        }
                    }
                }
            }
            // --------------------------------------------
        }

        this.raf = window.requestAnimationFrame( this.tick.bind( this ) );
    };

	Marquee.prototype.start = function () {
		if ( this.raf ) {
			return;
		}

		this.lastTime = 0;
		this.raf = window.requestAnimationFrame( this.tick.bind( this ) );
	};

	Marquee.prototype.stop = function () {
		if ( this.raf ) {
			window.cancelAnimationFrame( this.raf );
			this.raf = null;
		}
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

		this.section.addEventListener( 'mouseenter', function () {
			self.paused = true;
		} );

		this.section.addEventListener( 'mouseleave', function () {
			self.paused = false;
		} );

		this.section.addEventListener( 'focusin', function () {
			self.paused = true;
		} );

		this.section.addEventListener( 'focusout', function () {
			self.paused = false;
		} );

		if ( 'IntersectionObserver' in window ) {
			new IntersectionObserver( function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						self.start();
					} else {
						self.stop();
					}
				} );
			}, { threshold: 0 } ).observe( this.section );
		} else {
			this.start();
		}

		var timer;

		window.addEventListener( 'resize', function () {
			clearTimeout( timer );

			timer = setTimeout( function () {
				var width = self.section.getBoundingClientRect().width;

				if ( Math.abs( width - ( self.containerWidth || 0 ) ) > 1 ) {
					self.build();
				}
			}, 250 );
		}, { passive: true } );
	};

	function init() {
		if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
			return;
		}

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