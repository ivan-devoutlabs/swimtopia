( function ( global ) {
    'use strict';

    var SECTION = '[data-blog-filter]';

    function Blog( section ) {
        this.section = section;
        this.list = section.querySelector( '.blog__list' );
        this.pagination = section.querySelector( '.blog__pagination' );
        this.filterList = section.querySelector( '.blog__filterList' );
        this.activeBox = section.querySelector( '.blog__filterActive' );
        this.clearBtn = section.querySelector( '.blog__filterList__clear' );
        this.toggleBtn = section.querySelector( '.blog__filterList__toggle' );

        this.selected = this.readFromUrl();
        this.paged = this.readPaged();
        this.request = null;
    }

    Blog.prototype.readFromUrl = function () {
        var value = new URLSearchParams( global.location.search ).get( 'cats' );
        if ( ! value ) return [];
        return value.split( ',' ).filter( Boolean );
    };

    Blog.prototype.readPaged = function () {
        var value = new URLSearchParams( global.location.search ).get( 'paged' );
        return Math.max( 1, parseInt( value, 10 ) || 1 );
    };

    Blog.prototype.buildUrl = function () {
        var params = new URLSearchParams( global.location.search );
        if ( this.selected.length ) { params.set( 'cats', this.selected.join( ',' ) ); } 
        else { params.delete( 'cats' ); }
        if ( this.paged > 1 ) { params.set( 'paged', this.paged ); } 
        else { params.delete( 'paged' ); }
        var query = params.toString();
        return global.location.pathname + ( query ? '?' + query : '' );
    };

    Blog.prototype.renderFilters = function () {
        var self = this;
        var items = this.filterList ? this.filterList.querySelectorAll( '.blog__filterList__item' ) : [];

        Array.prototype.forEach.call( items, function ( item ) {
            var id = item.getAttribute( 'data-term' );
            var isActive = self.selected.indexOf( id ) !== -1;

            item.classList.toggle( 'is-active', isActive );
            item.setAttribute( 'aria-pressed', isActive ? 'true' : 'false' );

            var next = isActive
                ? self.selected.filter( function ( value ) { return value !== id; } )
                : self.selected.concat( [ id ] );

            var params = new URLSearchParams();
            if ( next.length ) { params.set( 'cats', next.join( ',' ) ); }
            var query = params.toString();
            item.setAttribute( 'href', global.location.pathname + ( query ? '?' + query : '' ) );
        } );

        this.renderActive();
    };

    Blog.prototype.renderActive = function () {
        if ( ! this.activeBox ) return;
        var self = this;
        this.activeBox.innerHTML = '';

        this.selected.forEach( function ( id ) {
            var source = self.filterList ? self.filterList.querySelector( '[data-term="' + id + '"]' ) : null;
            if ( ! source ) return;

            var name = source.textContent.trim();
            var item = document.createElement( 'div' );
            item.className = 'blog__filterActive__item';
            item.setAttribute( 'data-term', id );

            var remove = document.createElement( 'button' );
            remove.type = 'button';
            remove.className = 'blog__filterActive__itemRemove';
            remove.setAttribute( 'aria-label', 'Прибрати фільтр «' + name + '»' );

            remove.addEventListener( 'click', function () { self.toggle( id ); } );

            var label = document.createElement( 'span' );
            label.className = 'blog__filterActive__itemLabel';
            label.textContent = name;

            item.appendChild( remove );
            item.appendChild( label );
            self.activeBox.appendChild( item );
        } );

        this.section.classList.toggle( 'has-filters', this.selected.length > 0 );
    };

    Blog.prototype.toggle = function ( id ) {
        var index = this.selected.indexOf( id );
        if ( index === -1 ) { this.selected.push( id ); } 
        else { this.selected.splice( index, 1 ); }
        
        this.paged = 1;
        this.renderFilters();
        this.fetch();
    };

    Blog.prototype.clear = function () {
        if ( ! this.selected.length ) return;
        this.selected = [];
        this.paged = 1;
        this.renderFilters();
        this.fetch();
    };

    Blog.prototype.fetch = function ( options ) {
        var config = global.starterBlogFilter;

        if ( ! config ) {
            console.error('AJAX Error: window.starterBlogFilter не знайдено. Перевірте функцію wp_add_inline_script у functions.php');
            return;
        }

        var self = this;
        options = options || {};

        if ( this.request ) { this.request.abort(); }
        var controller = new AbortController();
        this.request = controller;

        this.section.classList.add( 'is-loading' );
        this.list.setAttribute( 'aria-busy', 'true' );

        var body = new URLSearchParams();
        body.set( 'action', 'starter_blog_filter' );
        body.set( 'nonce', config.nonce );
        body.set( 'cats', this.selected.join( ',' ) );
        body.set( 'paged', this.paged );

        fetch( config.ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            signal: controller.signal,
        } )
            .then( function ( response ) { return response.json(); } )
            .then( function ( json ) {
                if ( ! json || ! json.success ) return;
                self.list.innerHTML = json.data.list;
                if ( self.pagination ) { self.pagination.innerHTML = json.data.pagination; }
                if ( ! options.skipHistory ) {
                    global.history.pushState( { cats: self.selected, paged: self.paged }, '', self.buildUrl() );
                }
                if ( options.scroll ) {
                    self.section.scrollIntoView( { behavior: 'smooth', block: 'start' } );
                }
            } )
            .catch( function ( error ) {
                if ( error.name !== 'AbortError' ) console.warn( 'Blog filter:', error );
            } )
            .finally( function () {
                self.section.classList.remove( 'is-loading' );
                self.list.setAttribute( 'aria-busy', 'false' );
                self.request = null;
            } );
    };

    Blog.prototype.init = function () {
        if ( ! this.list ) return;
        var self = this;

        if ( this.filterList ) {
            this.filterList.addEventListener( 'click', function ( event ) {
                var item = event.target.closest( '.blog__filterList__item' );
                if ( ! item ) return;
                event.preventDefault();
                self.toggle( item.getAttribute( 'data-term' ) ); 
            } );
        }

        if ( this.clearBtn ) {
            this.clearBtn.addEventListener( 'click', function () { self.clear(); } );
        }

        if ( this.pagination ) {
            this.pagination.addEventListener( 'click', function ( event ) {
                var link = event.target.closest( 'a' );
                if ( ! link ) return;
                event.preventDefault();
                var paged = new URL( link.href, global.location.origin ).searchParams.get( 'paged' );
                self.paged = Math.max( 1, parseInt( paged, 10 ) || 1 );
                self.fetch( { scroll: true } );
            } );
        }

        global.addEventListener( 'popstate', function () {
            self.selected = self.readFromUrl();
            self.paged = self.readPaged();
            self.renderFilters();
            self.fetch( { skipHistory: true } );
        } );

        this.renderActive();
    };

    function init() {
        var sections = document.querySelectorAll( SECTION );
        Array.prototype.forEach.call( sections, function ( section ) {
            new Blog( section ).init();
        } );
    }

    if ( document.readyState === 'loading' ) { document.addEventListener( 'DOMContentLoaded', init ); } 
    else { init(); }

} )( window );


// jQuery(document).ready(function($){
//     $('.blog__filterList__toggle').click(function(e) {
//         e.preventDefault();
        
//         var $btn = $(this);
//         var $wrapper = $btn.closest('.blog__filterList__wrapper');
//         var $list = $wrapper.find('.blog__filterList');
//         var isOpened = $wrapper.hasClass('opened');

//         if ( ! $wrapper.data('initialWidth') ) {
//             $wrapper.data('initialWidth', $wrapper.width());
//         }
//         var initialWidth = $wrapper.data('initialWidth');

//         if (!isOpened) {
//             $wrapper.addClass('opened');
//             $btn.attr('aria-expanded', 'true');
//             $list.stop().slideDown(); 
            
//             var targetWidth = $(window).width() < 1025 ? '45vw' : '33vw';
//             $wrapper.stop().animate({ width: targetWidth }, 400); 
            
//         } else {
//             $wrapper.removeClass('opened');
//             $btn.attr('aria-expanded', 'false');
//             $list.stop().slideUp(); 
            
//             $wrapper.stop().animate({ width: initialWidth }, 400, function() {
//                 $(this).css('width', ''); 
//             });
//         }
//     });
// });


( function () {
    'use strict';
 
    var WRAPPER = '.blog__filterList__wrapper';
    var TOP = '.blog__filterList__top';
    var TOGGLE = '.blog__filterList__toggle';
    var LIST = '.blog__filterList';
    var ITEM = '.blog__filterList__item';
 
    var OPEN = 'opened';
    var DURATION = 320;   
 
    function Filters( wrapper ) {
        this.wrapper = wrapper;
        this.top = wrapper.querySelector( TOP );
        this.toggle = wrapper.querySelector( TOGGLE );
        this.list = wrapper.querySelector( LIST );
        this.isOpen = false;
        this.timer = null;
    }
 
    Filters.prototype.measure = function ( withList ) {
        var wrapper = this.wrapper;
        var list = this.list;
 
        var savedWidth = wrapper.style.width;
        var savedDisplay = list.style.display;
        var savedVisibility = list.style.visibility;
        var savedTransition = wrapper.style.transition;
 
        // Вимикаємо анімацію на час заміру
        wrapper.style.transition = 'none';
        list.style.visibility = 'hidden';
        list.style.display = withList ? 'block' : 'none';
        wrapper.style.width = 'auto';
 
        var width = wrapper.getBoundingClientRect().width;
 
        wrapper.style.width = savedWidth;
        list.style.display = savedDisplay;
        list.style.visibility = savedVisibility;
        
        void wrapper.offsetWidth;
        wrapper.style.transition = savedTransition;
 
        return width;
    };
 
    Filters.prototype.toPx = function ( value ) {
        value = String( value ).trim();
        if ( ! value ) return 0;
 
        var number = parseFloat( value );
        if ( isNaN( number ) ) return 0;
 
        if ( value.indexOf( 'rem' ) !== -1 ) {
            var root = parseFloat( window.getComputedStyle( document.documentElement ).fontSize ) || 16;
            return number * root;
        }
        
        if ( value.indexOf( 'vw' ) !== -1 ) {
            return (number * window.innerWidth) / 100;
        }

        if ( value.indexOf( '%' ) !== -1 ) {
            var parent = this.wrapper.parentElement;
            var parentW = parent ? parent.getBoundingClientRect().width : window.innerWidth;
            return (number * parentW) / 100;
        }
 
        return number;
    };
 
    Filters.prototype.openWidth = function () {
        var styles = window.getComputedStyle( this.wrapper );
        var declared = styles.getPropertyValue( '--filters-open-width' );
 
        if ( ! declared.trim() ) {
            return this.measure( true );
        }
 
        var base = this.toPx( declared );
        
        // Читаємо padding-right, який у вашому SCSS розраховує відстань до краю екрана
        var edge = parseFloat( styles.paddingRight ) || 0; 
 
        // Ширина = 36rem + відстань до краю екрана. Більше жодних лімітів.
        return base + edge;
    };
 
    Filters.prototype.closedWidth = function () {
        return this.measure( false );
    };
 
    Filters.prototype.open = function () {
        if ( this.isOpen ) return;
 
        var self = this;
        var fromWidth = this.wrapper.getBoundingClientRect().width;
        var toWidth = this.openWidth();
        var savedTransition = this.wrapper.style.transition;

        // 1. БЕЗПЕЧНИЙ ЗАМІР ВИСОТИ
        this.wrapper.style.transition = 'none';
        this.list.style.transition = 'none';
        
        // Розтягуємо обгортку до фінальної ширини ПЕРЕД заміром висоти (усуває стрибок висоти)
        this.wrapper.style.width = toWidth + 'px';
        
        this.list.style.visibility = 'hidden';
        this.list.style.display = 'block';
        this.list.style.height = 'auto';
        this.list.style.paddingTop = '';
        this.list.style.paddingBottom = '';
        
        var computedList = window.getComputedStyle(this.list);
        var pt = computedList.paddingTop;
        var pb = computedList.paddingBottom;
        var toHeight = this.list.offsetHeight;
        
        // 2. СТАРТОВА ПОЗИЦІЯ ДЛЯ АНІМАЦІЇ
        this.list.style.height = '0px';
        this.list.style.paddingTop = '0px';
        this.list.style.paddingBottom = '0px';
        this.list.style.overflow = 'hidden';
        this.list.style.visibility = ''; 
        
        this.wrapper.style.width = fromWidth + 'px';

        void this.wrapper.offsetWidth; // Форсуємо рендер стартового стану

        // 3. ДОДАЄМО КЛАСИ
        this.isOpen = true;
        this.wrapper.classList.add( OPEN );
        this.toggle.setAttribute( 'aria-expanded', 'true' );

        // 4. СИНХРОННА АНІМАЦІЯ ПО ДВОХ ОСЯХ
        this.wrapper.style.transition = savedTransition; 
        this.list.style.transition = 'all ' + DURATION + 'ms cubic-bezier(0.22, 0.61, 0.36, 1)';
        
        this.wrapper.style.width = toWidth + 'px';
        
        this.list.style.height = toHeight + 'px';
        this.list.style.paddingTop = pt;
        this.list.style.paddingBottom = pb;

        window.clearTimeout( this.timer );
        
        // 5. ОЧИЩЕННЯ
        this.timer = window.setTimeout( function () {
            self.list.style.height = '';
            self.list.style.paddingTop = '';
            self.list.style.paddingBottom = '';
            self.list.style.overflow = '';
            self.list.style.transition = '';
        }, DURATION );
    };
 
    Filters.prototype.close = function () {
        if ( ! this.isOpen ) return;
 
        var self = this;
        var fromWidth = this.wrapper.getBoundingClientRect().width;
        var toWidth = this.closedWidth();
        
        var computedList = window.getComputedStyle(this.list);
        var h = this.list.offsetHeight;
        var pt = computedList.paddingTop;
        var pb = computedList.paddingBottom;
 
        this.isOpen = false;
        this.wrapper.classList.remove( OPEN );
        this.toggle.setAttribute( 'aria-expanded', 'false' );

        // 1. ФІКСУЄМО СТАН ПЕРЕД ЗВУЖЕННЯМ
        var savedTransition = this.wrapper.style.transition;
        this.wrapper.style.transition = 'none';
        this.list.style.transition = 'none';
        
        this.wrapper.style.width = fromWidth + 'px';
        this.list.style.height = h + 'px';
        this.list.style.paddingTop = pt;
        this.list.style.paddingBottom = pb;
        this.list.style.overflow = 'hidden';

        void this.wrapper.offsetWidth;
 
        // 2. АНІМУЄМО В НУЛЬ
        this.wrapper.style.transition = savedTransition;
        this.list.style.transition = 'all ' + DURATION + 'ms cubic-bezier(0.22, 0.61, 0.36, 1)';
        
        this.wrapper.style.width = toWidth + 'px';
        this.list.style.height = '0px';
        this.list.style.paddingTop = '0px';
        this.list.style.paddingBottom = '0px';
 
        window.clearTimeout( this.timer );

        // 3. ПРИХОВУЄМО ТА ОЧИЩАЄМО
        this.timer = window.setTimeout( function () {
            self.list.style.display = 'none';
            self.list.style.height = '';
            self.list.style.paddingTop = '';
            self.list.style.paddingBottom = '';
            self.list.style.overflow = '';
            self.list.style.transition = '';
            self.wrapper.style.width = ''; 
        }, DURATION );
    };
 
    Filters.prototype.toggleOpen = function () {
        if ( this.isOpen ) {
            this.close();
        } else {
            this.open();
        }
    };
 
    Filters.prototype.enhance = function () {
        if ( ! this.list.id ) {
            this.list.id = 'blog-filters-' + Math.random().toString( 36 ).slice( 2, 7 );
        }
 
        this.toggle.setAttribute( 'aria-expanded', 'false' );
        this.toggle.setAttribute( 'aria-controls', this.list.id );
 
        this.list.setAttribute( 'role', 'group' );
        this.list.setAttribute( 'aria-label', 'Categories' );
        
        if ( ! this.isOpen ) {
            this.list.style.display = 'none';
        }
 
        this.syncItems();
    };
 
    Filters.prototype.syncItems = function () {
        Array.prototype.forEach.call(
            this.list.querySelectorAll( ITEM ),
            function ( item ) {
                item.removeAttribute( 'aria-pressed' );
 
                if ( item.classList.contains( 'is-active' ) ) {
                    item.setAttribute( 'aria-current', 'true' );
                } else {
                    item.removeAttribute( 'aria-current' );
                }
            }
        );
    };
 
    Filters.prototype.init = function () {
        if ( ! this.toggle || ! this.list ) return;
 
        var self = this;
        this.enhance();
 
        this.toggle.addEventListener( 'click', function () {
            self.toggleOpen();
        } );
 
        if ( 'MutationObserver' in window ) {
            new MutationObserver( function () {
                self.syncItems();
            } ).observe( this.list, {
                attributes: true,
                subtree: true,
                attributeFilter: [ 'class' ],
            } );
        }
 
        this.wrapper.addEventListener( 'keydown', function ( event ) {
            if ( event.key === 'Escape' && self.isOpen ) {
                self.close();
                self.toggle.focus();
                return;
            }
 
            if ( event.key !== 'ArrowDown' && event.key !== 'ArrowUp' ) return;
 
            var items = Array.prototype.slice.call( self.list.querySelectorAll( ITEM ) );
            var index = items.indexOf( document.activeElement );
            if ( index === -1 ) return;
 
            var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
            if ( items[ next ] ) {
                event.preventDefault();
                items[ next ].focus();
            }
        } );
 
        document.addEventListener( 'click', function ( event ) {
            if ( ! self.isOpen ) return;
            if ( ! event.target.closest( WRAPPER ) ) {
                self.close();
            }
        } );
 
        this.wrapper.addEventListener( 'focusout', function ( event ) {
            if ( ! self.isOpen ) return;
            if ( ! self.wrapper.contains( event.relatedTarget ) ) {
                self.close();
            }
        } );
 
        var resizeTimer;
        window.addEventListener( 'resize', function () {
            window.clearTimeout( resizeTimer );
 
            resizeTimer = window.setTimeout( function () {
                if ( self.isOpen ) {
                    var previous = self.wrapper.style.transition;
                    self.wrapper.style.transition = 'none';
                    self.wrapper.style.width = self.openWidth() + 'px';
 
                    window.requestAnimationFrame( function () {
                        self.wrapper.style.transition = previous;
                    } );
                    return;
                }
                self.wrapper.style.width = '';
            }, 150 );
        }, { passive: true } );
    };
 
    function init() {
        var wrappers = document.querySelectorAll( WRAPPER );
        Array.prototype.forEach.call( wrappers, function ( wrapper ) {
            new Filters( wrapper ).init();
        } );
    }
 
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }
} )();