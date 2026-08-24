<?php 
/*
Template Name: Blocks
*/

get_header();
?>


<section class="team">
    <div class="container">
        <div class="team__list">
            <div class="team__listItem">
                <div class="team__listItem__image"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/Frame 362.jpg" alt=""></div>
                <div class="team__listItem__content">
                    <h6 class="team__listItem__title">Mason Hale</h6>
                    <div class="team__listItem__position">CEO & Founder</div>
                    <div class="team__listItem__button"><a href="#" class="wp-block-button__link">Meet Mason</a></div>
                </div>
                <div class="team__listItem__text">Mason has been leading teams creating innovative software products for more than 20 years. He was Chief Technology Officer at OneSpot and Chief Technologist at Frog Design, where he created web and software solutions for clients including Microsoft, HP, Dell, Motorola, SAP, Disney and T-Mobile (among others). Mason was a year-round swimmer and captain of his high school swim team and was an active volunteer for his neighborhood summer league swim team for 15 years.</div>
            </div>
            <div class="team__listItem">
                <div class="team__listItem__image"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/Frame 362-1.jpg" alt=""></div>
                <div class="team__listItem__content">
                    <h6 class="team__listItem__title">Alan Rice</h6>
                    <div class="team__listItem__position">President</div>
                    <div class="team__listItem__button"><a href="#" class="wp-block-button__link">Meet Alan</a></div>
                </div>
            </div>
            <div class="team__listItem">
                <div class="team__listItem__image"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/Frame 362-2.jpg" alt=""></div>
                    <div class="team__listItem__content">
                    <h6 class="team__listItem__title">Tracy Nelson</h6>
                    <div class="team__listItem__position">Director, Customer Success</div>
                    <div class="team__listItem__button"><a href="#" class="wp-block-button__link">Meet Tracy</a></div>
                </div>
            </div>
            <div class="team__listItem">
                <div class="team__listItem__image"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/Frame 362-3.jpg" alt=""></div>
                    <div class="team__listItem__content">
                    <h6 class="team__listItem__title">Megan Hubbard</h6>
                    <div class="team__listItem__position">Marketing Communications / Technical Sales Advisor</div>
                    <div class="team__listItem__button"><a href="#" class="wp-block-button__link">Meet Megan</a></div>
                </div>
            </div>
            <div class="team__listItem">
                <div class="team__listItem__image"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/Frame 362-1.jpg" alt=""></div>
                    <div class="team__listItem__content">
                    <h6 class="team__listItem__title">Alan Rice</h6>
                    <div class="team__listItem__position">President</div>
                    <div class="team__listItem__button"><a href="#" class="wp-block-button__link">Meet Alan</a></div>
                </div>
            </div>
            <div class="team__listItem">
                <div class="team__listItem__image"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/Frame 362-3.jpg" alt=""></div>
                    <div class="team__listItem__content">
                    <h6 class="team__listItem__title">Megan Hubbard</h6>
                    <div class="team__listItem__position">Marketing Communications / Technical Sales Advisor</div>
                    <div class="team__listItem__button"><a href="#" class="wp-block-button__link">Meet Megan</a></div>
                </div>
            </div>
            <div class="team__listItem">
                <div class="team__listItem__image"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/Frame 362.jpg" alt=""></div>
                    <div class="team__listItem__content">
                    <h6 class="team__listItem__title">Mason Hale</h6>
                    <div class="team__listItem__position">CEO & Founder</div>
                    <div class="team__listItem__button"><a href="#" class="wp-block-button__link">Meet Mason</a></div>
                </div>
            </div>
            <div class="team__listItem">
                <div class="team__listItem__image"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/Frame 362-2.jpg" alt=""></div>
                    <div class="team__listItem__content">
                    <h6 class="team__listItem__title">Tracy Nelson</h6>
                    <div class="team__listItem__position">Director, Customer Success</div>
                    <div class="team__listItem__button"><a href="#" class="wp-block-button__link">Meet Tracy</a></div>
                </div>
            </div>
        </div>
    </div>
</section>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var teamItems = document.querySelectorAll('.team__listItem');
        
        var colorClasses = [
            'team__listItem--color-1', 
            'team__listItem--color-2', 
            'team__listItem--color-3', 
            'team__listItem--color-4'
        ];

        var previousColor = null;

        teamItems.forEach(function(item) {
            var availableColors = colorClasses.filter(function(color) {
                return color !== previousColor;
            });

            var randomIndex = Math.floor(Math.random() * availableColors.length);
            var selectedColor = availableColors[randomIndex];
            
            item.classList.add(selectedColor);
            
            previousColor = selectedColor;
        });
    });
    jQuery(document).ready(function($){
        $('.team__listItem').hover(
            function(){
                $(this).find('.team__listItem__button').stop().slideDown();
            },
            function(){
                $(this).find('.team__listItem__button').stop().slideUp();
            }
        )
    });
    document.addEventListener('DOMContentLoaded', function() {
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
</script>

<script src="<?php echo get_template_directory_uri(); ?>/js/ease-accordion.js"></script>

<?php get_footer(); ?>