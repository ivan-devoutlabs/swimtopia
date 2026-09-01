document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var sections = document.querySelectorAll('.blogPreview');

    sections.forEach(function (section) {
        // Шукаємо viewport, а якщо його немає — fallback на query
        var container = section.querySelector('.blogPreview__viewport') || section.querySelector('.blogPreview__query');
        var wrapper = section.querySelector('.blogPreview__list');
        var prevButton = section.querySelector('.blogPreview__arrow--prev');
        var nextButton = section.querySelector('.blogPreview__arrow--next');

        if (!container || !wrapper) return;

        var slides = wrapper.children;

        if (slides.length < 2) {
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            return;
        }

        container.classList.add('swiper');
        wrapper.classList.add('swiper-wrapper');

        Array.prototype.forEach.call(slides, function(slide) {
            slide.classList.add('swiper-slide');
        });

        // Базові конфігурації Swiper
        var swiperOptions = {
            slidesPerView: 'auto',
            spaceBetween: 24, 
            
            wrapperClass: 'swiper-wrapper',
            slideClass: 'swiper-slide',
            
            keyboard: {
                enabled: true,
                onlyInViewport: false,
            }
        };

        // Перевіряємо наявність обох кнопок перед передачею в Swiper
        if (prevButton && nextButton) {
            swiperOptions.navigation = {
                nextEl: nextButton,
                prevEl: prevButton,
            };
        }

        new Swiper(container, swiperOptions);
    });
});

// jQuery(document).ready(function($){
//     $('.blogPreview__listItem').hover(
//         function(){
//             $(this).find('.blogPreview__listItem__button').stop().slideDown();
//         },
//         function() {
//             $(this).find('.blogPreview__listItem__button').stop().slideUp();
//         }
//     );
// });