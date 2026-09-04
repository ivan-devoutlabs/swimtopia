( function ( $ ) {
    'use strict';

    var SELECTORS = {
        grid: '.faq__list',
        item: '.faq__listItem',
        question: '.faq__listItemQuestion',
        answer: '.faq__listItemAnswear',
    };
 
    var CLASSES = {
        active: 'is-active',
        shrunk: 'is-shrunk',
        hasOpen: 'has-open-item',
    };
 
    var MOBILE = window.matchMedia( '(max-width: 767px)' );
    var REDUCED = window.matchMedia( '(prefers-reduced-motion: reduce)' );
 
    function duration() {
        return REDUCED.matches ? 0 : 400;
    }
 
    function isMobile() {
        return MOBILE.matches;
    }
 
    function clearInline( $grid ) {
        $grid.find( SELECTORS.answer ).stop( true, true ).removeAttr( 'style' );
    }
 
    function rowSiblings( $grid, $item ) {
        var top = $item.get( 0 ).offsetTop;
 
        return $grid.find( SELECTORS.item ).filter( function () {
            return Math.abs( this.offsetTop - top ) < 2;
        } );
    }

    function measureHeights( $grid ) {
        if ( isMobile() ) return; 

        $grid.find( SELECTORS.item ).each( function () {
            var $item = $( this );
            var $answer = $item.find( SELECTORS.answer );
            var isExpanded = $item.hasClass( CLASSES.active );

            $answer.css( { 'transition': 'none', 'visibility': 'hidden', 'display': 'block', 'height': 'auto' } );
            
            var h = $answer.get(0).scrollHeight;
            
            $answer.attr( 'data-height', h );

            $answer.css( 'transition', '' );
            
            if ( isExpanded ) {
                $answer.css( { 'height': h + 'px', 'opacity': 1, 'visibility': 'visible', 'display': '' } );
            } else {
                $answer.css( { 'height': 0, 'opacity': 0, 'visibility': 'hidden', 'display': '' } );
            }
        } );
    }
 
    function collapse( $grid ) {
        $grid
            .removeClass( CLASSES.hasOpen )
            .find( SELECTORS.item )
            .removeClass( CLASSES.active + ' ' + CLASSES.shrunk )
            .attr( 'aria-expanded', 'false' );
 
        if ( isMobile() ) {
            $grid.find( SELECTORS.answer ).stop( true, true ).slideUp( duration() );
        } else {
            $grid.find( SELECTORS.answer ).css( {
                'opacity': 0,
                'visibility': 'hidden',
                'height': '0',
            } );
        }
    }
 
    function expand( $grid, $item ) {
        collapse( $grid );
 
        $grid.addClass( CLASSES.hasOpen );
        $item.addClass( CLASSES.active ).attr( 'aria-expanded', 'true' );
 
        var $answer = $item.find( SELECTORS.answer );
 
        if ( isMobile() ) {
            $answer.stop( true, true ).css( {
                'opacity': 1,
                'visibility': 'visible',
            } ).slideDown( duration() );
            return;
        }
 
        rowSiblings( $grid, $item ).not( $item ).addClass( CLASSES.shrunk );
 
        setTimeout( function () {
            $answer.css( {
                'opacity': 1,
                'visibility': 'visible',
                'height': $answer.attr( 'data-height' ) + 'px', 
            } );
        }, duration() > 0 ? 500 : 0 );
    }
 
    function init() {
        var $grids = $( SELECTORS.grid );
 
        if ( ! $grids.length ) {
            return;
        }
 
        $grids.each( function ( gridIndex ) { 
            var $grid = $( this );
 
            $grid.find( SELECTORS.item ).each( function ( itemIndex ) { 
                var $item = $( this );
                var $question = $item.find( SELECTORS.question );
                var $answer = $item.find( SELECTORS.answer );
 
                var questionId = 'faq-question-' + gridIndex + '-' + itemIndex;
                var answerId = 'faq-answer-' + gridIndex + '-' + itemIndex;

                $answer.attr( {
                    'id': answerId,
                    'role': 'region',
                    'aria-labelledby': questionId
                } );

                $question.attr( 'id', questionId );

                if ( ! $item.is( 'button, a' ) ) {
                    $item.attr( {
                        tabindex: 0,
                        role: 'button',
                    } );
                }
 
                $item.attr( {
                    'aria-expanded': 'false',
                    'aria-controls': answerId
                } );
            } );

            measureHeights( $grid );
 
            $grid.on( 'click', SELECTORS.item, function ( event ) {
                event.preventDefault();
 
                var $item = $( this );
 
                if ( $item.hasClass( CLASSES.active ) ) {
                    collapse( $grid );
                } else {
                    expand( $grid, $item );
                }
            } );

            $grid.on( 'keydown', SELECTORS.item, function ( event ) {
                if ( event.key === 'Enter' || event.keyCode === 13 || event.key === ' ' || event.keyCode === 32 ) {
                    event.preventDefault(); 
                    
                    var $item = $( this );
 
                    if ( $item.hasClass( CLASSES.active ) ) {
                        collapse( $grid );
                    } else {
                        expand( $grid, $item );
                    }
                }
            } );
        } );
 
        function onModeChange() {
            $grids.each( function () {
                var $grid = $( this );
                collapse( $grid );
                clearInline( $grid ); 
                
                if ( !isMobile() ) {
                    measureHeights( $grid );
                }
            } );
        }
 
        if ( typeof MOBILE.addEventListener === 'function' ) {
            MOBILE.addEventListener( 'change', onModeChange );
        } else {
            MOBILE.addListener( onModeChange ); 
        }

        var resizeTimer;
        $(window).on('resize', function() {
            if ( isMobile() ) return;
            
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                $grids.each(function() {
                    measureHeights($(this));
                });
            }, 150);
        });
    }
 
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }
} )( jQuery );