( function ( global ) {
    'use strict';

    var MOBILE = window.matchMedia( '(max-width: 781px)' );

    function Slider( viewport, options ) {
        this.viewport = viewport;
        this.options = options || {};
        this.axis = this.options.axis === 'x' ? 'x' : 'y';
        this.peek = this.options.peek || 0;
        this.infinite = this.options.infinite !== false;
        this.gap = 0;
        this.index = 0;

        this.items = Array.prototype.slice.call( viewport.children )
            .filter( function ( node ) {
                return node.nodeType === 1;
            } );
    }

    Slider.prototype.build = function () {
        if ( this.items.length < 2 ) {
            return false;
        }

        var track = document.createElement( 'div' );

        track.className = 'vslider__track';

        this.viewport.appendChild( track );

        this.items.forEach( function ( item ) {
            track.appendChild( item );
        } );

        this.track = track;
        this.viewport.classList.add( 'vslider', 'vslider--' + this.axis );

        var styles = window.getComputedStyle( track );

        this.gap = parseFloat(
            this.axis === 'x' ? styles.columnGap : styles.rowGap
        ) || parseFloat( styles.gap ) || 0;

        return true;
    };

    Slider.prototype.sizes = function () {
        var axis = this.axis;

        return this.items.map( function ( item ) {
            var rect = item.getBoundingClientRect();

            return axis === 'x' ? rect.width : rect.height;
        } );
    };

    Slider.prototype.measure = function () {
        if ( ! this.track ) {
            return;
        }

        return this.axis === 'x' ? this.measureX() : this.measureY();
    };

    Slider.prototype.measureY = function () {
        var sizes = this.sizes();
        var active = sizes[ this.index ] || 0;
        var next = sizes[ this.index + 1 ];

        if ( next === undefined ) {
            next = sizes[ 0 ] || 0;
        }

        var height = active + ( this.peek ? this.gap + next * this.peek : 0 );

        this.viewport.style.height = Math.ceil( height ) + 'px';

        var offset = 0;
        var i;

        for ( i = 0; i < this.index; i++ ) {
            offset += sizes[ i ] + this.gap;
        }

        this.track.style.transform =
            'translate3d(0, ' + -offset.toFixed( 2 ) + 'px, 0)';
    };

    Slider.prototype.measureX = function () {
        var width = this.viewport.getBoundingClientRect().width;

        if ( width < 1 ) {
            return;
        }

        var item;

        if ( MOBILE.matches && this.options.mobileWidthRatio ) {
            item = width * this.options.mobileWidthRatio;
        } else if ( !MOBILE.matches && this.options.desktopWidthRatio ) {
            item = width * this.options.desktopWidthRatio;
        } else {
            item = ( width - this.gap ) / ( 1 + this.peek );
        }

        this.viewport.style.setProperty( '--vslider-item', item.toFixed( 2 ) + 'px' );

        var tallest = 0;

        this.items.forEach( function ( node ) {
            var h = node.getBoundingClientRect().height;

            if ( h > tallest ) {
                tallest = h;
            }
        } );

        if ( tallest > 0 ) {
            this.viewport.style.height = Math.ceil( tallest ) + 'px';
        }

        var offset = this.index * ( item + this.gap );

        this.track.style.transform =
            'translate3d(' + -offset.toFixed( 2 ) + 'px, 0, 0)';
    };

    Slider.prototype.update = function () {
        var self = this;
        var total = this.items.length;

        this.items.forEach( function ( item, i ) {
            item.classList.toggle( 'is-active', i === self.index );
        } );

        this.measure();

        if ( this.dots ) {
            Array.prototype.forEach.call( this.dots.children, function ( dot, i ) {
                dot.classList.toggle( 'is-active', i === self.index );
                dot.setAttribute( 'aria-current', i === self.index ? 'true' : 'false' );
            } );
        }

        if ( this.btnPrev && this.btnNext && !this.infinite ) {
            var isFirst = this.index === 0;
            var isLast = this.index === total - 1;

            this.btnPrev.classList.toggle( 'disabled', isFirst );
            this.btnPrev.disabled = isFirst;

            this.btnNext.classList.toggle( 'disabled', isLast );
            this.btnNext.disabled = isLast;
        }

        if ( typeof this.options.onChange === 'function' ) {
            this.options.onChange( this.index );
        }
    };

    Slider.prototype.goTo = function ( index ) {
        var total = this.items.length;

        if ( !this.infinite ) {
            if ( index < 0 || index >= total ) {
                return;
            }
            this.index = index;
        } else {
            this.index = ( index + total ) % total;
        }
        
        this.update();
    };

    Slider.prototype.next = function () {
        this.goTo( this.index + 1 );
    };

    Slider.prototype.prev = function () {
        this.goTo( this.index - 1 );
    };

    Slider.prototype.clickToAdvance = function ( label ) {
        var self = this;

        this.viewport.classList.add( 'is-clickable' );
        this.viewport.setAttribute( 'role', 'button' );
        this.viewport.setAttribute( 'tabindex', '0' );
        this.viewport.setAttribute( 'aria-label', label || 'Наступний пункт' );

        this.viewport.addEventListener( 'click', function ( event ) {
            if ( event.target.closest( 'a, button' ) ) {
                return;
            }

            self.next();
        } );

        this.viewport.addEventListener( 'keydown', function ( event ) {
            if ( event.key === 'Enter' || event.key === ' ' ) {
                event.preventDefault();
                self.next();
            }

            if ( event.key === 'ArrowDown' || event.key === 'ArrowRight' ) {
                self.next();
            }

            if ( event.key === 'ArrowUp' || event.key === 'ArrowLeft' ) {
                self.prev();
            }
        } );
    };

    Slider.prototype.addDots = function ( label ) {
        var self = this;
        var dots = document.createElement( 'div' );

        dots.className = 'vslider__dots';

        this.items.forEach( function ( item, i ) {
            var dot = document.createElement( 'button' );

            dot.type = 'button';
            dot.className = 'vslider__dot';
            dot.setAttribute( 'aria-label', ( label || 'Пункт' ) + ' ' + ( i + 1 ) );

            dot.addEventListener( 'click', function ( event ) {
                event.stopPropagation();
                self.goTo( i );
            } );

            dots.appendChild( dot );
        } );

        this.viewport.parentNode.insertBefore( dots, this.viewport.nextSibling );
        this.dots = dots;
    };

    Slider.prototype.addArrows = function ( holder, l10n ) {
        var self = this;
        var axis = this.axis;

        function makeButton( dir, text ) {
            var btn = document.createElement( 'button' );

            btn.type = 'button';
            btn.className =
                'vslider__arrow vslider__arrow--' + dir + ' vslider__arrow--' + axis;
            btn.setAttribute( 'aria-label', text );

            btn.addEventListener( 'click', function () {
                if ( dir === 'prev' ) {
                    self.prev();
                } else {
                    self.next();
                }
            } );

            return btn;
        }

        this.btnPrev = makeButton( 'prev', ( l10n && l10n.prev ) || 'Попередній' );
        this.btnNext = makeButton( 'next', ( l10n && l10n.next ) || 'Наступний' );

        holder.appendChild( this.btnPrev );
        holder.appendChild( this.btnNext );
    };

    Slider.prototype.watch = function () {
        var self = this;

        if ( 'ResizeObserver' in window ) {
            var observer = new ResizeObserver( function () {
                self.measure();
            } );

            observer.observe( this.viewport );

            this.items.forEach( function ( item ) {
                observer.observe( item );
            } );
        } else {
            var timer;

            window.addEventListener( 'resize', function () {
                clearTimeout( timer );
                timer = setTimeout( function () {
                    self.measure();
                }, 200 );
            }, { passive: true } );
        }

        if ( document.fonts && document.fonts.ready ) {
            document.fonts.ready.then( function () {
                self.measure();
            } );
        }
    };

    function Rolodex( target, words ) {
        this.target = target;

        var original = target.textContent.trim();

        this.words = words.slice();

        if ( this.words.indexOf( original ) === -1 ) {
            this.words.unshift( original );
        }

        target.classList.add( 'easeAccordion__rolodex' );

        this.ghost = document.createElement( 'span' );
        this.ghost.className = 'easeAccordion__rolodexGhost';
        this.ghost.setAttribute( 'aria-hidden', 'true' );
        target.parentNode.insertBefore( this.ghost, target.nextSibling );

        this.setWidth( original );
    }

    Rolodex.prototype.setWidth = function ( word ) {
        this.ghost.textContent = word;
        this.target.style.width =
            this.ghost.getBoundingClientRect().width + 'px';
    };

    Rolodex.prototype.to = function ( index ) {
        var word = this.words[ index % this.words.length ];

        if ( ! word || word === this.target.textContent.trim() ) {
            return;
        }

        var self = this;

        this.target.classList.add( 'is-leaving' );

        window.setTimeout( function () {
            self.target.classList.add( 'is-entering' );
            self.target.classList.remove( 'is-leaving' );
            
            self.target.textContent = word;
            self.setWidth( word );
            
            void self.target.offsetWidth;
            
            self.target.classList.remove( 'is-entering' );
        }, 220 ); 
    };


    function initSection( section ) {
        var l10n = global.starterEaseL10n || {};

        var subtitle = section.querySelector( '.easeAccordion__subtitle' );
        var strongTags = subtitle ? subtitle.querySelectorAll( 'strong' ) : [];
        var rolodex = null;

        if ( strongTags.length > 0 ) {
            var wordsArray = [];
            var targetStrong = strongTags[0]; 

            Array.prototype.forEach.call( strongTags, function ( tag, index ) {
                var word = tag.textContent.trim();
                if ( word ) {
                    wordsArray.push( word );
                }
                if ( index > 0 ) {
                    tag.remove();
                }
            } );

            if ( wordsArray.length > 0 ) {
                rolodex = new Rolodex( targetStrong, wordsArray );
            }
        }

        var list = section.querySelector( '.easeAccordion__list' );

        if ( list ) {
            var listSlider = new Slider( list, {
                axis: 'y',
                peek: 0.8,
                onChange: function ( index ) {
                    if ( rolodex ) {
                        rolodex.to( index );
                    }
                },
            } );

            if ( listSlider.build() ) {
                listSlider.clickToAdvance( l10n.nextItem );
                listSlider.addDots( l10n.slide );
                listSlider.watch();
                listSlider.update();
            }
        }

        var testimonials = section.querySelector( '.easeAccordion__testimonials' );

        if ( testimonials ) {
            var isBlank = section.classList.contains( 'blank' );

            var sliderOptions = { 
                axis: 'x', 
                peek: 0.3, 
                infinite: false, 
                mobileWidthRatio: 0.9 
            };

            if ( isBlank ) {
                sliderOptions.desktopWidthRatio = 0.5625;
            }

            var slider = new Slider( testimonials, sliderOptions );

            if ( slider.build() ) {
                var arrows = document.createElement( 'div' );

                arrows.className = 'easeAccordion__testimonialsArrows';

                testimonials.parentNode.insertBefore(
                    arrows, testimonials.nextSibling
                );

                slider.addArrows( arrows, l10n );
                slider.watch();
                slider.update(); 
            }
        }
    }

    function init() {

        var sections = document.querySelectorAll( '.easeAccordion, .content__testimonials' );

        Array.prototype.forEach.call( sections, initSection );
    }

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }
} )( window );