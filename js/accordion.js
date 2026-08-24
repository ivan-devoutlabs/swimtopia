jQuery(document).ready(function($){
    $('.accordion__listItem__title').click(function(){
        $('.accordion__listItem__title').not(this).removeClass('opened');
        $('.accordion__listItem__text').not($(this).parent().find('.accordion__listItem__text')).slideUp();

        $(this).parent().find('.accordion__listItem__text').stop().slideToggle();
        $(this).toggleClass('opened');
    })
})