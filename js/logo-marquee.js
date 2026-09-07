( function () {
    'use strict';

    var SECTION = '.logoMarquee, .textMarquee';
    var LIST = '.logoMarquee__list, .textMarquee__list'; 

    var SPEED = 150;

    function Marquee( section ) {
        this.section = section;
        this.list = section.querySelector( LIST );
        this.originals = null;
        this.width = 0;
        this.rAF = null;
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

    Marquee.prototype.checkCenterHighlight = function () {
        var self = this;
        
        if ( ! this.section.classList.contains( 'is-highlight' ) ) {
            return;
        }

        function loop() {
            if ( ! self.section.classList.contains( 'is-offscreen' ) ) {
                var windowCenter = window.innerWidth / 2;
                var children = self.list.children;

                for ( var i = 0; i < children.length; i++ ) {
                    var item = children[i];
                    var rect = item.getBoundingClientRect();

                    if ( rect.left <= windowCenter && rect.right >= windowCenter ) {
                        item.classList.add( 'is-center-item' );
                        item.style.color = 'var(--wp--preset--color--blue, blue)'; 
                        item.style.transition = 'color 0.3s ease';
                    } else {
                        item.classList.remove( 'is-center-item' );
                        item.style.color = ''; 
                    }
                }
            }
            
            self.rAF = requestAnimationFrame( loop );
        }

        if ( this.rAF ) {
            cancelAnimationFrame( this.rAF );
        }
        this.rAF = requestAnimationFrame( loop );
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

        this.checkCenterHighlight();
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