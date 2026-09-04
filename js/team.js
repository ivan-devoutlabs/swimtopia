document.addEventListener('DOMContentLoaded', function() {
    
    const teamItems = document.querySelectorAll('.team__listItem');
    
    if (teamItems.length > 0) {
        const colorClasses = [
            'team__listItem--color-1', 
            'team__listItem--color-2', 
            'team__listItem--color-3', 
            'team__listItem--color-4'
        ];

        let previousColor = null;

        teamItems.forEach(function(item) {
            const availableColors = colorClasses.filter(function(color) {
                return color !== previousColor;
            });

            const randomIndex = Math.floor(Math.random() * availableColors.length);
            const selectedColor = availableColors[randomIndex];
            
            item.classList.add(selectedColor);
            previousColor = selectedColor;
        });
    }

    const teamSection = document.querySelector('.team');
    if (!teamSection) return;

    const listItems = Array.from(teamSection.querySelectorAll('.team__listItem'));
    if (listItems.length === 0) return;

    const popupHTML = `
        <div class="team__popupWrapper">
            <div class="team__popupOverlay"></div>
            <div class="team__popupModal__wrapper">
                <div class="team__popupModal">
                    <button class="team__popupClose">✕</button>
                    <button class="team__popupArrow team__popupArrow--prev"></button>
                    <button class="team__popupArrow team__popupArrow--next"></button>
                    
                    <div class="team__popupTrack">
                        <!-- PREV -->
                        <div class="team__popupItem team__popupItem--prev">
                            <div class="team__popupContent">
                                <div class="team__popupImage"><img src="" alt=""></div>
                                <div class="team__popupInfo">
                                    <div class="team__popupTitle"></div>
                                    <div class="team__popupPosition"></div>
                                    <div class="team__popupDivider"></div>
                                    <div class="team__popupText"></div>
                                </div>
                            </div>
                        </div>
                        <!-- CURRENT -->
                        <div class="team__popupItem team__popupItem--current">
                            <div class="team__popupContent">
                                <div class="team__popupImage"><img src="" alt=""></div>
                                <div class="team__popupInfo">
                                    <div class="team__popupTitle"></div>
                                    <div class="team__popupPosition"></div>
                                    <div class="team__popupDivider"></div>
                                    <div class="team__popupText"></div>
                                </div>
                            </div>
                        </div>
                        <!-- NEXT -->
                        <div class="team__popupItem team__popupItem--next">
                            <div class="team__popupContent">
                                <div class="team__popupImage"><img src="" alt=""></div>
                                <div class="team__popupInfo">
                                    <div class="team__popupTitle"></div>
                                    <div class="team__popupPosition"></div>
                                    <div class="team__popupDivider"></div>
                                    <div class="team__popupText"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    teamSection.insertAdjacentHTML('beforeend', popupHTML);

    const popupWrapper = teamSection.querySelector('.team__popupWrapper');
    const track = popupWrapper.querySelector('.team__popupTrack');
    const closeBtn = popupWrapper.querySelector('.team__popupClose');
    const overlay = popupWrapper.querySelector('.team__popupOverlay');
    const prevBtn = popupWrapper.querySelector('.team__popupArrow--prev');
    const nextBtn = popupWrapper.querySelector('.team__popupArrow--next');
    
    let currentIndex = 0;
    let isAnimating = false;
    const animationDuration = 500;

    function getIndex(index) {
        const total = listItems.length;
        return (index % total + total) % total;
    }

    function getCardData(index) {
        const item = listItems[getIndex(index)];
        const img = item.querySelector('.team__listItem__image img');
        const title = item.querySelector('.team__listItem__title');
        const position = item.querySelector('.team__listItem__position');
        const text = item.querySelector('.team__listItem__text'); 

        return {
            src: img ? img.src : '',
            alt: img ? img.alt : '',
            title: title ? title.innerText : '',
            position: position ? position.innerText : '',
            text: text ? text.innerHTML : ''
        };
    }

    function populateNode(nodeClass, data) {
        const node = popupWrapper.querySelector(nodeClass);
        node.querySelector('img').src = data.src;
        node.querySelector('img').alt = data.alt;
        node.querySelector('.team__popupTitle').innerText = data.title;
        node.querySelector('.team__popupPosition').innerText = data.position;
        node.querySelector('.team__popupText').innerHTML = data.text;
    }

    function updatePopupData() {
        populateNode('.team__popupItem--prev', getCardData(currentIndex - 1));
        populateNode('.team__popupItem--current', getCardData(currentIndex));
        populateNode('.team__popupItem--next', getCardData(currentIndex + 1));
    }

    listItems.forEach((item, index) => {
        const trigger = item.querySelector('.team__listItem__button a') || item;
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            currentIndex = index;
            updatePopupData();
            popupWrapper.classList.add('is-open');
        });
    });

    function closePopup() {
        popupWrapper.classList.remove('is-open');
    }

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupWrapper.classList.contains('is-open')) {
            closePopup();
        }
    });

    function slide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        if (direction === 'next') {
            track.style.transform = 'translateX(-66.6666%)';
        } else {
            track.style.transform = 'translateX(0%)';
        }

        setTimeout(() => {
            if (direction === 'next') currentIndex = getIndex(currentIndex + 1);
            if (direction === 'prev') currentIndex = getIndex(currentIndex - 1);

            popupWrapper.classList.add('no-transition');
            
            updatePopupData();
            track.style.transform = 'translateX(-33.3333%)'; 

            void track.offsetWidth;

            popupWrapper.classList.remove('no-transition');
            
            isAnimating = false;
        }, animationDuration);
    }

    nextBtn.addEventListener('click', () => slide('next'));
    prevBtn.addEventListener('click', () => slide('prev'));
});

// jQuery(document).ready(function($){
//     $('.team__listItem').hover(
//         function(){
//             $(this).find('.team__listItem__button').stop().slideDown();
//         },
//         function(){
//             $(this).find('.team__listItem__button').stop().slideUp();
//         }
//     );
// });