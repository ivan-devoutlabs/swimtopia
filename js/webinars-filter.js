( function ( global ) {
    'use strict';

    var SECTION = '[data-webinars-filter]'; // <--- Новий селектор

    function Webinars( section ) {
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

    Webinars.prototype.readFromUrl = function () {
        var value = new URLSearchParams( global.location.search ).get( 'cats' );
        if ( ! value ) return [];
        return value.split( ',' ).map( function ( id ) { return parseInt( id, 10 ); } ).filter( Boolean );
    };

    Webinars.prototype.readPaged = function () {
        var value = new URLSearchParams( global.location.search ).get( 'paged' );
        return Math.max( 1, parseInt( value, 10 ) || 1 );
    };

    Webinars.prototype.buildUrl = function () {
        var params = new URLSearchParams( global.location.search );
        if ( this.selected.length ) { params.set( 'cats', this.selected.join( ',' ) ); } 
        else { params.delete( 'cats' ); }
        if ( this.paged > 1 ) { params.set( 'paged', this.paged ); } 
        else { params.delete( 'paged' ); }
        var query = params.toString();
        return global.location.pathname + ( query ? '?' + query : '' );
    };

    Webinars.prototype.renderFilters = function () {
        var self = this;
        var items = this.filterList ? this.filterList.querySelectorAll( '.blog__filterList__item' ) : [];
        Array.prototype.forEach.call( items, function ( item ) {
            var id = parseInt( item.getAttribute( 'data-term' ), 10 );
            var isActive = self.selected.indexOf( id ) !== -1;
            item.classList.toggle( 'is-active', isActive );
            item.setAttribute( 'aria-pressed', isActive ? 'true' : 'false' );
            var next = isActive ? self.selected.filter( function ( value ) { return value !== id; } ) : self.selected.concat( [ id ] );
            var params = new URLSearchParams();
            if ( next.length ) { params.set( 'cats', next.join( ',' ) ); }
            var query = params.toString();
            item.setAttribute( 'href', global.location.pathname + ( query ? '?' + query : '' ) );
        } );
        this.renderActive();
    };

    Webinars.prototype.renderActive = function () {
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

    Webinars.prototype.toggle = function ( id ) {
        var index = this.selected.indexOf( id );
        if ( index === -1 ) { this.selected.push( id ); } else { this.selected.splice( index, 1 ); }
        this.paged = 1;
        this.renderFilters();
        this.fetch();
    };

    Webinars.prototype.clear = function () {
        if ( ! this.selected.length ) return;
        this.selected = [];
        this.paged = 1;
        this.renderFilters();
        this.fetch();
    };

    Webinars.prototype.fetch = function ( options ) {
        var config = global.starterWebinarsFilter;
        if ( ! config ) return;
        var self = this;
        options = options || {};

        if ( this.request ) { this.request.abort(); }
        var controller = new AbortController();
        this.request = controller;
        this.section.classList.add( 'is-loading' );
        this.list.setAttribute( 'aria-busy', 'true' );

        var body = new URLSearchParams();
        body.set( 'action', 'starter_webinars_filter' );
        body.set( 'nonce', config.nonce );
        body.set( 'cats', this.selected.join( ',' ) );
        body.set( 'paged', this.paged );

        fetch( config.ajaxUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            signal: controller.signal,
        } )
            .then( function ( response ) { return response.json(); } )
            .then( function ( json ) {
                if ( ! json || ! json.success ) return;
                self.list.innerHTML = json.data.list;
                if ( self.pagination ) { self.pagination.innerHTML = json.data.pagination; }
                if ( ! options.skipHistory ) { global.history.pushState( { cats: self.selected, paged: self.paged }, '', self.buildUrl() ); }
                if ( options.scroll ) { self.section.scrollIntoView( { behavior: 'smooth', block: 'start' } ); }
            } )
            .catch( function ( error ) { if ( error.name !== 'AbortError' ) console.warn( 'Webinars filter:', error ); } )
            .finally( function () {
                self.section.classList.remove( 'is-loading' );
                self.list.setAttribute( 'aria-busy', 'false' );
                self.request = null;
            } );
    };

    Webinars.prototype.init = function () {
        if ( ! this.list ) return;
        var self = this;
        if ( this.filterList ) {
            this.filterList.addEventListener( 'click', function ( event ) {
                var item = event.target.closest( '.blog__filterList__item' );
                if ( ! item ) return;
                event.preventDefault();
                self.toggle( parseInt( item.getAttribute( 'data-term' ), 10 ) );
            } );
        }
        if ( this.clearBtn ) { this.clearBtn.addEventListener( 'click', function () { self.clear(); } ); }
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
        Array.prototype.forEach.call( sections, function ( section ) { new Webinars( section ).init(); } );
    }

    if ( document.readyState === 'loading' ) { document.addEventListener( 'DOMContentLoaded', init ); } 
    else { init(); }

} )( window );

jQuery(document).ready(function($){
    $(document).on('click', '.blog__filterList__toggle', function(e) {
        e.preventDefault();
        var $btn = $(this);
        var $wrapper = $btn.closest('.blog__filterList__wrapper');
        var $list = $wrapper.find('.blog__filterList');
        var isOpened = $wrapper.hasClass('opened');

        if ( ! $wrapper.data('initialWidth') ) { $wrapper.data('initialWidth', $wrapper.width()); }
        var initialWidth = $wrapper.data('initialWidth');

        if (!isOpened) {
            $wrapper.addClass('opened');
            $btn.attr('aria-expanded', 'true');
            $list.stop().slideDown(); 
            var targetWidth = $(window).width() < 1025 ? '45vw' : '33vw';
            $wrapper.stop().animate({ width: targetWidth }, 400); 
        } else {
            $wrapper.removeClass('opened');
            $btn.attr('aria-expanded', 'false');
            $list.stop().slideUp(); 
            $wrapper.stop().animate({ width: initialWidth }, 400, function() { $(this).css('width', ''); });
        }
    });

    $(window).resize(function() {
        $('.blog__filterList__wrapper:not(.opened)').each(function() {
            $(this).css('width', ''); 
            $(this).data('initialWidth', $(this).width());
        });
    });
});