( function ( global ) {
    'use strict';

    var SECTION = '.features';

    var MOBILE = window.matchMedia( '(max-width: 767px)' );
    var TABLET = window.matchMedia( '(max-width: 1023px)' );

    var DURATION = 6000;
    var SWAP = 900;
    var DISTORT = 26;

    function Features( section ) {
        this.section = section;
        this.slider = section.querySelector( '.features__slider' );
        this.slides = Array.prototype.slice.call(
            section.querySelectorAll( '.features__sliderItem' )
        );
        this.images = this.slides.map( function ( slide ) {
            return slide.querySelector(
                '.features__sliderItem__image, .features__imagesList__item'
            );
        } );

        this.holder = null;
        this.filter = document.querySelector( '#features-distortion feDisplacementMap' );
        this.distortion = null;

        this.index = 0;
        this.elapsed = 0;
        this.lastTime = 0;
        this.raf = null;
        this.paused = false;
        this.swapping = false;
    }

    Features.prototype.prepare = function () {
        var total = this.slides.length;

        this.slides.forEach( function ( slide, i ) {
            var number = slide.querySelector( '.features__sliderItem__number' );

            if ( number && ! number.querySelector( '.features__num' ) ) {
                var span = document.createElement( 'span' );

                span.className = 'features__num';
                span.textContent = number.textContent.trim();
                number.textContent = '';
                number.appendChild( span );
            }

            slide.style.setProperty(
                '--slide-share',
                ( ( ( i + 1 ) / total ) * 100 ).toFixed( 4 ) + '%'
            );

            slide.style.setProperty( '--slide-index', i + 1 );
            slide.style.setProperty( '--slide-total', total );

            slide.classList.toggle( 'is-active', i === 0 );
            slide.setAttribute( 'aria-hidden', i === 0 ? 'false' : 'true' );
        } );

        if ( this.slider ) {
            this.slider.setAttribute( 'role', 'button' );
            this.slider.setAttribute( 'tabindex', '0' );
            this.slider.setAttribute( 'aria-label', this.label() );
        }
        this.buildCounter();
    };

    Features.prototype.label = function () {
        var l10n = window.starterFeaturesL10n || {};
        return l10n.next || 'Next Slide';
    };

    Features.prototype.setProgress = function ( value ) {
        var total = ( this.index + value ) / this.slides.length;

        this.slider.style.setProperty( '--features-progress', total.toFixed( 4 ) );
    };

    Features.prototype.distort = function () {
        if ( ! this.filter ) {
            return;
        }

        var self = this;
        var start = null;

        function step( time ) {
            if ( start === null ) {
                start = time;
            }

            var p = Math.min( 1, ( time - start ) / SWAP );

            var strength = Math.sin( p * Math.PI ) * DISTORT;

            self.filter.setAttribute( 'scale', strength.toFixed( 2 ) );

            if ( p < 1 ) {
                window.requestAnimationFrame( step );
            } else {
                self.filter.setAttribute( 'scale', '0' );
            }
        }

        window.requestAnimationFrame( step );
    };

    Features.prototype.goTo = function ( next ) {
        if ( this.swapping || next === this.index || MOBILE.matches ) {
            return;
        }

        var total = this.slides.length;

        next = ( next + total ) % total;

        var current = this.index;
        var self = this;

        this.swapping = true;

        var forward = next === ( current + 1 ) % total;

        this.slides[ current ].classList.add( forward ? 'is-leaving' : 'is-leaving-back' );
        this.slides[ current ].classList.remove( 'is-active' );
        this.slides[ current ].setAttribute( 'aria-hidden', 'true' );

        this.slides[ next ].classList.add( forward ? 'is-entering' : 'is-entering-back' );
        this.slides[ next ].classList.add( 'is-active' );
        this.slides[ next ].setAttribute( 'aria-hidden', 'false' );

        window.requestAnimationFrame( function () {
            self.slides[ next ].classList.remove( 'is-entering', 'is-entering-back' );
        } );

        if ( this.distortion ) {
            this.distortion.to( next );
        } else {
            this.section.classList.add( 'is-swapping' );
            this.distort();
        }

        window.setTimeout( function () {
            self.slides[ current ].classList.remove( 'is-leaving', 'is-leaving-back' );
            self.section.classList.remove( 'is-swapping' );
            self.swapping = false;
        }, SWAP );

        this.index = next;
        this.setCounter( next );
        this.elapsed = 0;
        this.setProgress( 0 );
    };

    Features.prototype.next = function () {
        this.goTo( this.index + 1 );
    };

    Features.prototype.tick = function ( time ) {
        if ( ! this.lastTime ) {
            this.lastTime = time;
        }

        var delta = time - this.lastTime;
        this.lastTime = time;

        if ( delta > 100 ) {
            delta = 100;
        }

        if ( ! this.paused ) {
            this.elapsed += delta;

            if ( this.elapsed >= DURATION ) {
                this.next();
            } else {
                this.setProgress( this.elapsed / DURATION );
            }
        }

        this.raf = window.requestAnimationFrame( this.tick.bind( this ) );
    };

    Features.prototype.start = function () {
        if ( MOBILE.matches ) {
            return;
        }

        if ( ! this.raf ) {
            this.lastTime = 0;
            this.raf = window.requestAnimationFrame( this.tick.bind( this ) );
        }
    };

    Features.prototype.stop = function () {
        if ( this.raf ) {
            window.cancelAnimationFrame( this.raf );
            this.raf = null;
        }
    };

    Features.prototype.mountCanvas = function () {
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

        holder.className = 'features__canvasHolder';
        holder.setAttribute( 'aria-hidden', 'true' );

        this.slider.appendChild( holder );
        this.holder = holder;

        function place() {
            var sliderRect = self.slider.getBoundingClientRect();
            var imageRect = anchor.getBoundingClientRect();

            if ( imageRect.width < 1 || imageRect.height < 1 ) {
                return;
            }

            holder.style.left = ( imageRect.left - sliderRect.left ) + 'px';
            holder.style.top = ( imageRect.top - sliderRect.top ) + 'px';
            holder.style.width = imageRect.width + 'px';
            holder.style.height = imageRect.height + 'px';
        }

        place();

        if ( 'ResizeObserver' in window ) {
            new ResizeObserver( place ).observe( anchor );
            new ResizeObserver( place ).observe( this.slider );
        }

        var timer;

        window.addEventListener( 'resize', function () {
            clearTimeout( timer );
            timer = setTimeout( place, 200 );
        }, { passive: true } );

        this.distortion = global.StarterDistortion.create( holder, {
            strength: 0.35,
            duration: SWAP,
            sources: sources,
        } );

        if ( this.distortion ) {
            this.section.classList.add( 'has-distortion' );
        }
    };

    Features.prototype.measureHeight = function () {
        var self = this;
        var maxContentHeight = 0;
        var maxItemHeight = 0;

        var topContent = this.section.querySelector('.features__contentTop');
        var offsetMargin = 0;
        var offsetBottom = 0;
        var topHeight = 0;

        if (topContent) {
            topHeight = topContent.getBoundingClientRect().height;
            offsetMargin = Math.ceil(topHeight * 1.5);
            offsetBottom = Math.ceil(topHeight * 0.75);
            const shiftY = Math.ceil(topHeight * 0.375);
            document.querySelector('.features__slider').style.setProperty('--center-shift', `${shiftY}px`);
        }

        if (topContent) {
            this.section.style.setProperty('--top-content-height', topHeight + 'px');
            this.section.style.setProperty('--top-content-offset', offsetMargin + 'px');
        }

        this.slides.forEach( function ( slide ) {
            var content = slide.querySelector( '.features__sliderItem__content' );

            if ( content ) {
                if ( ! TABLET.matches && offsetMargin > 0 ) {
                    content.style.marginTop = offsetMargin + 'px';
                    content.style.marginBottom = offsetBottom + 'px';
                } else {
                    content.style.marginTop = '';
                    content.style.marginBottom = '';
                }
            }
        } );

        this.slides.forEach( function ( slide ) {
            var content = slide.querySelector( '.features__sliderItem__content' );

            if ( content ) {
                var contentHeight = content.getBoundingClientRect().height;
                if ( contentHeight > maxContentHeight ) {
                    maxContentHeight = contentHeight;
                }
            }

            var itemHeight = slide.getBoundingClientRect().height;
            if ( itemHeight > maxItemHeight ) {
                maxItemHeight = itemHeight;
            }
        } );

        if ( maxContentHeight > 0 ) {
            this.slider.style.setProperty(
                '--features-content-height',
                Math.ceil( maxContentHeight ) + 'px'
            );
        }

        if ( ! MOBILE.matches && maxItemHeight > 0 ) {
            this.slider.style.height = Math.ceil( maxItemHeight ) + 'px';
        } else {
            this.slider.style.height = ''; 
        }
    };

    Features.prototype.watchHeight = function () {
        var self = this;

        this.measureHeight();

        if ( 'ResizeObserver' in window ) {
            var observer = new ResizeObserver( function () {
                self.measureHeight();
            } );

            this.slides.forEach( function ( slide ) {
                var content = slide.querySelector( '.features__sliderItem__content' );
                if ( content ) observer.observe( content );
                
                observer.observe( slide );
            } );

            var topContent = this.section.querySelector('.features__contentTop');
            if ( topContent ) {
                observer.observe( topContent );
            }
        } else {
            var timer;

            window.addEventListener( 'resize', function () {
                clearTimeout( timer );
                timer = setTimeout( function () {
                    self.measureHeight();
                }, 200 );
            }, { passive: true } );
        }

        if ( document.fonts && document.fonts.ready ) {
            document.fonts.ready.then( function () {
                self.measureHeight();
            } );
        }
    };

    Features.prototype.enableStatic = function () {
        this.stop();

        this.section.classList.add( 'is-static' );

        this.slides.forEach( function ( slide ) {
            slide.classList.remove(
                'is-active', 'is-leaving', 'is-leaving-back',
                'is-entering', 'is-entering-back'
            );
            slide.removeAttribute( 'aria-hidden' );
        } );

        if ( this.slider ) {
            this.slider.removeAttribute( 'role' );
            this.slider.removeAttribute( 'tabindex' );
            this.slider.removeAttribute( 'aria-label' );
        }

        if ( this.holder ) {
            this.holder.style.display = 'none';
        }
        if ( this.counter ) {
            this.counter.style.display = 'none';
        }
    };

    Features.prototype.disableStatic = function () {
        this.section.classList.remove( 'is-static' );

        if ( this.holder ) {
            this.holder.style.display = '';
        }

        this.index = 0;
        this.elapsed = 0;

        this.prepare();
        this.setProgress( 0 );
        this.start();
        if ( this.counter ) {
            this.counter.style.display = '';
            this.setCounter( 0 );
        }
    };

    Features.prototype.buildCounter = function () {
        if ( ! this.slider || this.counter ) {
            return;
        }
    
        var total = this.slides.length;
    
        var counter = document.createElement( 'p' );
    
        counter.className = 'features__counter';
    
        /*
        * Decorative: each slide keeps its own number in the markup for
        * screen readers, so announcing this one as well would repeat it.
        */
        counter.setAttribute( 'aria-hidden', 'true' );
    
        /*
        * The leading zero only makes sense while the count stays in single
        * figures. Past nine it would read "010".
        */
        if ( total < 10 ) {
            var zero = document.createElement( 'span' );
    
            zero.className = 'features__counter__zero';
            zero.textContent = '0';
            counter.appendChild( zero );
        }
    
        var window_ = document.createElement( 'span' );
    
        window_.className = 'features__counter__window';
    
        var strip = document.createElement( 'span' );
    
        strip.className = 'features__counter__strip';
    
        var i;
    
        for ( i = 1; i <= total; i++ ) {
            var digit = document.createElement( 'span' );
    
            digit.className = 'features__counter__digit';
            digit.textContent = String( i );
            strip.appendChild( digit );
        }
    
        window_.appendChild( strip );
        counter.appendChild( window_ );
    
        this.slider.appendChild( counter );
    
        this.counter = counter;
        this.counterStrip = strip;
    
        this.setCounter( 0 );
    };
    
    /**
     * Move the strip to the given slide.
     */
    Features.prototype.setCounter = function ( index ) {
        if ( ! this.counterStrip ) {
            return;
        }
    
        this.counterStrip.style.setProperty( '--counter-index', index );
    };
    

    Features.prototype.init = function () {
        if ( this.slides.length < 2 ) {
            return;
        }

        var self = this;

        this.prepare();
        this.watchHeight();
        this.setProgress( 0 );

        function onModeChange() {
            if ( MOBILE.matches ) {
                self.enableStatic();
            } else {
                self.disableStatic();
            }
            self.measureHeight();
        }

        if ( typeof MOBILE.addEventListener === 'function' ) {
            MOBILE.addEventListener( 'change', onModeChange );
        } else {
            MOBILE.addListener( onModeChange ); 
        }

        if ( MOBILE.matches ) {
            this.enableStatic();
            return;
        }

        if ( ! MOBILE.matches ) {
            this.mountCanvas();
        }

        this.slider.addEventListener( 'click', function () {
            self.next();
        } );

        this.slider.addEventListener( 'keydown', function ( event ) {
            if ( event.key === 'Enter' || event.key === ' ' ) {
                event.preventDefault();
                self.next();
            }

            if ( event.key === 'ArrowRight' || event.key === 'ArrowDown' ) {
                self.next();
            }

            if ( event.key === 'ArrowLeft' || event.key === 'ArrowUp' ) {
                self.goTo( self.index - 1 );
            }
        } );

        // this.slider.addEventListener( 'mouseenter', function () {
        //     self.paused = true;
        // } );

        // this.slider.addEventListener( 'mouseleave', function () {
        //     self.paused = false;
        // } );

        // this.slider.addEventListener( 'focusin', function () {
        //     self.paused = true;
        // } );

        // this.slider.addEventListener( 'focusout', function () {
        //     self.paused = false;
        // } );

        if ( 'IntersectionObserver' in window ) {
            new IntersectionObserver( function ( entries ) {
                entries.forEach( function ( entry ) {
                    if ( entry.isIntersecting ) {
                        self.start();
                    } else {
                        self.stop();
                    }
                } );
            }, { threshold: 0.25 } ).observe( this.section );
        } else {
            this.start();
        }
    };

    

    function init() {
        var sections = document.querySelectorAll( SECTION );

        Array.prototype.forEach.call( sections, function ( section ) {
            var slider = new Features( section );

            slider.prepare();
            slider.watchHeight();

            if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
                var s = section.querySelector( '.features__slider' );

                if ( s ) {
                    s.addEventListener( 'click', function () {
                        slider.goTo( slider.index + 1 );
                    } );
                }

                return;
            }

            slider.init();
        } );
    }

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }
} )( window );