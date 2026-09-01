jQuery(document).ready(function($){
        $('.pricing__tabsItemBox__optionsContent__item__title').each(function(){
            if($(this).find('.pricing__tabsItemBox__optionsContent__item__titleTag').length > 0) {
                $(this).addClass('has-tag');
            }
        })
    })

    document.addEventListener('DOMContentLoaded', function() {
        const tabItems = document.querySelectorAll('.pricing__tabsList__item');
        const tabContents = document.querySelectorAll('.pricing__tabsItem');
        const tabsBg = document.querySelector('.pricing__tabsList__bg');

        function updateBgPosition(activeItem) {
            if (!tabsBg) return;
            tabsBg.style.width = `${activeItem.offsetWidth}px`;
            tabsBg.style.height = `${activeItem.offsetHeight}px`;
            tabsBg.style.left = `${activeItem.offsetLeft}px`;
            tabsBg.style.top = `${activeItem.offsetTop}px`;
        }

        const activeTabInit = document.querySelector('.pricing__tabsList__item.active');
        if (activeTabInit) {
            updateBgPosition(activeTabInit);
        }

        tabItems.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                tabItems.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                this.classList.add('active');
                if (tabContents[index]) {
                    tabContents[index].classList.add('active');
                }

                updateBgPosition(this);
            });
        });

        const pricingSections = document.querySelectorAll('.pricing__tabsItem');

        pricingSections.forEach(section => {
            const optionItems = section.querySelectorAll('.pricing__tabsItemBox__optionsList__item');
            const optionContents = section.querySelectorAll('.pricing__tabsItemBox__optionsContent__item');

            optionItems.forEach((opt, index) => {
                opt.addEventListener('click', function() {
                    optionItems.forEach(o => o.classList.remove('active'));
                    optionContents.forEach(c => c.classList.remove('active'));

                    this.classList.add('active');
                    if (optionContents[index]) {
                        optionContents[index].classList.add('active');
                    }
                });
            });
        });
    });