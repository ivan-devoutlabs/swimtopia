( function ( global ) {
    'use strict';
 
    var SECTION = '.easeAccordion, .content__testimonials';
    var MOBILE = window.matchMedia( '(max-width: 767px)' );
 
    // --- 1. КЛАС АНІМАЦІЇ ЗАГОЛОВКА (Rolodex) ---
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
        this.target.style.width = this.ghost.getBoundingClientRect().width + 'px';
    };
 
    Rolodex.prototype.to = function ( index ) {
        var word = this.words[ index % this.words.length ];
        if ( ! word || word === this.target.textContent.trim() ) return;
 
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

    // --- 2. ДОПОМІЖНІ ФУНКЦІЇ ДЛЯ SWIPER ---
    function prepareSwiper( list ) {
        var items = Array.prototype.slice.call( list.children ).filter( function ( node ) {
            return node.nodeType === 1 && !node.classList.contains('swiper-wrapper');
        } );
 
        if ( items.length < 1 ) return false;
 
        list.classList.add( 'swiper' );
 
        var wrapper = document.createElement( 'div' );
        wrapper.className = 'swiper-wrapper';
 
        items.forEach( function ( item ) {
            var slide = document.createElement( 'div' );
            slide.className = 'swiper-slide';
            slide.appendChild( item );
            wrapper.appendChild( slide );
        } );
 
        list.innerHTML = '';
        list.appendChild( wrapper );
 
        return true;
    }

    function makeArrows( list ) {
        var l10n = global.starterTestimonialsL10n || global.starterEaseL10n || {};
        var holder = document.createElement( 'div' );
        holder.className = 'easeAccordion__testimonialsArrows';
 
        function make( dir, label ) {
            var btn = document.createElement( 'button' );
            btn.type = 'button';
            btn.className = 'vslider__arrow vslider__arrow--' + dir + ' vslider__arrow--x';
            btn.setAttribute( 'aria-label', label );
            return btn;
        }
 
        var prev = make( 'prev', l10n.prev || 'Попередній' );
        var next = make( 'next', l10n.next || 'Наступний' );
 
        holder.appendChild( prev );
        holder.appendChild( next );
        list.parentNode.insertBefore( holder, list.nextSibling );
 
        return { prev: prev, next: next };
    }
 
    // --- 3. ГОЛОВНА ІНІЦІАЛІЗАЦІЯ СЕКЦІЇ ---
    function initSection( section ) {
        var l10n = global.starterEaseL10n || global.starterTestimonialsL10n || {};
        var isBlank = section.classList.contains( 'blank' );
        var subtitle = section.querySelector( '.easeAccordion__subtitle' );
        var rolodex = null;
 
        // А. Зміна слів у заголовку (Rolodex) ТІЛЬКИ якщо є клас .blank
        if ( isBlank && subtitle ) {
            var strongTags = subtitle.querySelectorAll( 'strong' );
            if ( strongTags.length > 0 ) {
                var wordsArray = [];
                var targetStrong = strongTags[0]; 
 
                Array.prototype.forEach.call( strongTags, function ( tag, index ) {
                    var word = tag.textContent.trim();
                    if ( word ) wordsArray.push( word );
                    if ( index > 0 ) tag.remove();
                } );
 
                if ( wordsArray.length > 0 ) {
                    rolodex = new Rolodex( targetStrong, wordsArray );
                }
            }
        }
 
        if ( ! global.Swiper ) {
            console.warn( 'EaseAccordion: Swiper не завантажено.' );
            return;
        }

        // Б. Вертикальний слайдер (.easeAccordion__list)
        var list = section.querySelector( '.easeAccordion__list' );
        if ( list && prepareSwiper( list ) ) {
            
            // Примусово зупиняємо розтягування слайдів по висоті
            var listSlides = list.querySelectorAll('.swiper-slide');
            Array.prototype.forEach.call(listSlides, function(slide) {
                slide.style.height = 'auto';
            });

            var dotsContainer = document.createElement( 'div' );
            dotsContainer.className = 'vslider__dots swiper-pagination';
            list.parentNode.insertBefore( dotsContainer, list.nextSibling );

            // ВИПРАВЛЕНО: Розмір береться тільки з внутрішнього елемента
            function updateListHeight( swiper ) {
                var activeSlide = swiper.slides[swiper.activeIndex];
                var nextSlide = swiper.slides[swiper.activeIndex + 1] || swiper.slides[0];
                
                if ( activeSlide ) {
                    var activeContent = activeSlide.firstElementChild || activeSlide;
                    var nextContent = nextSlide ? (nextSlide.firstElementChild || nextSlide) : null;
                    
                    var gap = 24; 
                    var peek = 0.8;
                    
                    var h = activeContent.getBoundingClientRect().height;
                    if ( nextContent ) {
                        h += gap + (nextContent.getBoundingClientRect().height * peek);
                    }
                    
                    swiper.el.style.height = Math.ceil(h) + 'px';
                    swiper.updateSize(); 
                }
            }

            var listSwiper = new global.Swiper( list, {
                direction: 'vertical',
                slidesPerView: 'auto',
                spaceBetween: 24,
                observer: true,
                observeParents: true,
                pagination: {
                    el: dotsContainer,
                    clickable: true,
                    bulletClass: 'vslider__dot',
                    bulletActiveClass: 'is-active',
                    renderBullet: function (index, className) {
                        return '<button type="button" class="' + className + '" aria-label="Слайд ' + (index + 1) + '"></button>';
                    }
                },
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                },
                on: {
                    init: function () { updateListHeight(this); },
                    resize: function () { updateListHeight(this); },
                    slideChange: function () {
                        updateListHeight(this);
                        if ( rolodex ) rolodex.to( this.activeIndex );
                    }
                }
            } );

            list.classList.add( 'is-clickable' );
            list.setAttribute( 'role', 'button' );
            list.setAttribute( 'tabindex', '0' );
            list.setAttribute( 'aria-label', l10n.nextItem || 'Наступний пункт' );

            list.addEventListener( 'click', function ( event ) {
                if ( event.target.closest( 'a, button' ) ) return;
                if ( listSwiper.isEnd ) listSwiper.slideTo(0);
                else listSwiper.slideNext();
            } );

            list.addEventListener( 'keydown', function ( event ) {
                if ( event.key === 'Enter' || event.key === ' ' ) {
                    event.preventDefault();
                    if ( listSwiper.isEnd ) listSwiper.slideTo(0);
                    else listSwiper.slideNext();
                }
            } );
        }
 
        // В. Горизонтальний слайдер відгуків (.easeAccordion__testimonials)
        var testimonials = section.querySelector( '.easeAccordion__testimonials' );
        if ( testimonials && prepareSwiper( testimonials ) ) {
            var arrows = makeArrows( testimonials );
            var syncTimer;
 
            var testimonialsSwiper = new global.Swiper( testimonials, {
                slidesPerView: 'auto',
                spaceBetween: 24,
                loop: false,
                observer: true,
                observeParents: true,
                watchSlidesProgress: true,
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                },
                breakpoints: {
                    768: { spaceBetween: 24 },
                }
            } );
 
            arrows.prev.addEventListener('click', function (e) {
                e.preventDefault();
                testimonialsSwiper.slidePrev();
            });
            arrows.next.addEventListener('click', function (e) {
                e.preventDefault();
                testimonialsSwiper.slideNext();
            });
 
            testimonialsSwiper.on('snapIndexChange', function() {
                arrows.prev.classList.toggle('disabled', testimonialsSwiper.isBeginning);
                arrows.next.classList.toggle('disabled', testimonialsSwiper.isEnd);
            });
            
            arrows.prev.classList.toggle('disabled', testimonialsSwiper.isBeginning);
            arrows.next.classList.toggle('disabled', testimonialsSwiper.isEnd);
 
            if ( !isBlank && subtitle ) {
                subtitle.setAttribute( 'aria-hidden', 'true' );
                subtitle.classList.add( 'is-synced' );
 
                function syncSubtitle() {
                    var targetSlide = testimonials.querySelector('.swiper-slide-fully-visible');
                    
                    if ( !targetSlide ) {
                        targetSlide = testimonials.querySelector('.swiper-slide-visible') || 
                                      testimonials.querySelector('.swiper-slide-active') || 
                                      testimonialsSwiper.slides[testimonialsSwiper.activeIndex];
                    }
                    if ( !targetSlide ) return;
                    
                    var titleNode = targetSlide.querySelector( '.easeAccordion__testimonialsItem__title' );
                    if ( !titleNode ) return;
 
                    var newText = titleNode.textContent.trim();
                    var currentText = subtitle.textContent.trim();
 
                    if ( !newText || newText === currentText ) return;
 
                    clearTimeout( syncTimer );
                    subtitle.classList.add( 'is-leaving' );
 
                    syncTimer = setTimeout( function () {
                        subtitle.textContent = newText;
                        subtitle.classList.remove( 'is-leaving' );
                    }, 200 );
                }
 
                syncSubtitle();
                testimonialsSwiper.on('transitionEnd', syncSubtitle);
                arrows.prev.addEventListener('click', function() { setTimeout(syncSubtitle, 50); });
                arrows.next.addEventListener('click', function() { setTimeout(syncSubtitle, 50); });
            }
 
            testimonials.style.setProperty(
                '--testimonial-width',
                isBlank && ! MOBILE.matches ? '56.25%' : ''
            );
 
            section.classList.add( 'is-swiper-ready' );
        }
    }
 
    function init() {
        var sections = document.querySelectorAll( SECTION );
        Array.prototype.forEach.call( sections, initSection );
    }
 
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }
} )( window );