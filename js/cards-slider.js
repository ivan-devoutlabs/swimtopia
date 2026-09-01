( function ( global ) {
    'use strict';

    document.addEventListener( 'DOMContentLoaded', function () {
        var sections = document.querySelectorAll( '.cardsSimple.slider' );

        sections.forEach( function ( section ) {
            var list = section.querySelector( '.cardsSimple__list' );
            if ( ! list ) return;

            var slides = list.querySelectorAll( '.cardsSimple__listItem' );
            if ( slides.length < 2 ) return;

            // Динамічне створення Swiper Viewport контейнера
            var viewport = section.querySelector( '.cardsSimple__viewport' );
            if ( ! viewport ) {
                viewport = document.createElement( 'div' );
                viewport.className = 'cardsSimple__viewport swiper';
                list.parentNode.insertBefore( viewport, list );
                viewport.appendChild( list );
            } else {
                viewport.classList.add( 'swiper' );
            }

            // Додаємо стандартизовані класи Swiper
            list.classList.add( 'swiper-wrapper' );
            slides.forEach( function ( slide ) {
                slide.classList.add( 'swiper-slide' );
            } );

            // Динамічне створення/знаходження кнопок навігації
            var arrowsHolder = section.querySelector( '.cardsSimple__arrows' );
            if ( ! arrowsHolder ) {
                arrowsHolder = document.createElement( 'div' );
                arrowsHolder.className = 'cardsSimple__arrows';
                viewport.parentNode.appendChild( arrowsHolder );
            }

            var l10n = global.starterCardsL10n || {};

            var prevBtn = arrowsHolder.querySelector( '.cardsSimple__arrow--prev' );
            if ( ! prevBtn ) {
                prevBtn = document.createElement( 'button' );
                prevBtn.type = 'button';
                prevBtn.className = 'cardsSimple__arrow cardsSimple__arrow--prev';
                prevBtn.setAttribute( 'aria-label', l10n.prev || 'Previous slide' );
                arrowsHolder.appendChild( prevBtn );
            }

            var nextBtn = arrowsHolder.querySelector( '.cardsSimple__arrow--next' );
            if ( ! nextBtn ) {
                nextBtn = document.createElement( 'button' );
                nextBtn.type = 'button';
                nextBtn.className = 'cardsSimple__arrow cardsSimple__arrow--next';
                nextBtn.setAttribute( 'aria-label', l10n.next || 'Next slide' );
                arrowsHolder.appendChild( nextBtn );
            }

            // Налаштування Swiper із брейкпоінтами
            var swiperOptions = {
                slidesPerView: 1, // Менше 768px
                spaceBetween: 16,
                wrapperClass: 'swiper-wrapper',
                slideClass: 'swiper-slide',
                breakpoints: {
                    768: {
                        slidesPerView: 2, // Від 768px до 1023px
                        spaceBetween: 24
                    },
                    1024: {
                        slidesPerView: 4, // Від 1024px і більше
                        spaceBetween: 24
                    }
                },
                keyboard: {
                    enabled: true,
                    onlyInViewport: false,
                },
                a11y: {
                    prevSlideMessage: l10n.prev || 'Previous slide',
                    nextSlideMessage: l10n.next || 'Next slide',
                }
            };

            if ( prevBtn && nextBtn ) {
                swiperOptions.navigation = {
                    nextEl: nextBtn,
                    prevEl: prevBtn,
                    disabledClass: 'disabled',
                };
            }

            new Swiper( viewport, swiperOptions );
        } );
    } );
} )( window );