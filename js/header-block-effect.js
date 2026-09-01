( function () {
    'use strict';

    function Rolodex( target, words ) {
        this.target = target;
        var original = target.textContent.trim();
        
        this.words = words.slice();
        if ( this.words.indexOf( original ) === -1 ) {
            this.words.unshift( original );
        }

        target.classList.add( 'headerBlock__rolodex' );

        // Створюємо невидимий елемент для вимірювання ширини
        this.ghost = document.createElement( 'span' );
        this.ghost.className = 'headerBlock__rolodexGhost';
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

    function init() {
        var title = document.querySelector( '.headerBlock__title' );
        if ( !title ) return;

        var strongTags = title.querySelectorAll( 'strong' );
        if ( strongTags.length < 2 ) return; // Якщо слово тільки одне, анімувати нічого

        var wordsArray = [];
        var targetStrong = strongTags[0]; 

        // Збираємо слова і видаляємо зайві теги
        Array.prototype.forEach.call( strongTags, function ( tag, index ) {
            var word = tag.textContent.trim();
            if ( word ) wordsArray.push( word );
            if ( index > 0 ) tag.remove();
        } );

        var rolodex = new Rolodex( targetStrong, wordsArray );
        var currentIndex = 0;

        // Інтервал зміни слів (3000 мс = 3 секунди)
        setInterval( function () {
            currentIndex++;
            rolodex.to( currentIndex );
        }, 3000 );
    }

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }
} )();