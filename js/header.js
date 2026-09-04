jQuery(document).ready(function($){

    $('.mega-menu').each(function(){
        $(this).parent().addClass('menu-item-has-children');
    })
    $('header .menu > .menu-item.menu-item-has-children').hover(
        function(){
            $('header').addClass('menu-opened');
        }, function(){
            $('header').removeClass('menu-opened');
        }
    )

    if($(window).width() < 1025) {
        $('.header__toggleWrapper').click(function(){
            $(this).find('.header__toggle').toggleClass('active');
            $('.header__menu').stop().slideToggle();
        });

        $('header .menu-item-has-children > a').click(function(e){
            e.preventDefault();
            const currentSubMenu = $(this).siblings('.sub-menu, .mega-menu');
            $('.sub-menu, .mega-menu').not(currentSubMenu).not($(this).parents('.sub-menu, .mega-menu')).removeClass('show').slideUp();
            currentSubMenu.toggleClass('show').stop().slideToggle();
        });


        $('header .menu-item-has-children .menuPanel__top').click(function(e){
            
            const currentSubMenu = $(this).siblings('.menuPanel__bottom');
            $('.menuPanel__bottom').not(currentSubMenu).not($(this).parents('.menuPanel__bottom')).removeClass('show').slideUp();
            currentSubMenu.toggleClass('show').stop().slideToggle();
        });
    }
    

    $(window).on('scroll', function(){
        if($('.header__menu').offset().top > $('header').outerHeight() * 1.2) {
            $('header').addClass('fixed');
        } else {
            $('header').removeClass('fixed');
        }
    })
})
