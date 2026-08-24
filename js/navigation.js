( function () {
	const siteNavigation = document.getElementById( 'site-navigation' );

	if ( siteNavigation ) {
		const button = siteNavigation.getElementsByTagName( 'button' )[ 0 ];
		const menu   = siteNavigation.getElementsByTagName( 'ul' )[ 0 ];

		if ( button && menu ) {
			if ( ! menu.classList.contains( 'nav-menu' ) ) {
				menu.classList.add( 'nav-menu' );
			}

			button.addEventListener( 'click', function () {
				siteNavigation.classList.toggle( 'toggled' );
				const expanded = button.getAttribute( 'aria-expanded' ) === 'true';
				button.setAttribute( 'aria-expanded', String( ! expanded ) );
			} );

			document.addEventListener( 'click', function ( event ) {
				if ( ! siteNavigation.contains( event.target ) ) {
					siteNavigation.classList.remove( 'toggled' );
					button.setAttribute( 'aria-expanded', 'false' );
				}
			} );
		}
	}
} () );

document.addEventListener( 'DOMContentLoaded', () => {

	const trigger     = document.querySelector( '.menu-trigger' );
	const megaMenu    = document.querySelector( '.mega-menu' );
	const triggerWrap = document.querySelector( '.menu-trigger-wrap' );

	if ( ! trigger || ! megaMenu ) return;

	document.querySelectorAll('.mega-menu__left .submenu').forEach(submenu => {
		submenu.classList.remove('active');

		const slug = submenu.dataset.submenu;
		const trigger = document.querySelector(
			`.mega-link[data-menu="${slug}"]`
		);

		if (trigger) {
			trigger.after(submenu);
		}
	});

	function setLinkExpanded( link, isExpanded ) {
		if ( ! link ) return;
		link.classList.toggle( 'active', isExpanded );
		link.setAttribute( 'aria-expanded', String( isExpanded ) );
	}

	function closeMegaMenu() {
		trigger.setAttribute( 'aria-expanded', 'false' );
		megaMenu.classList.remove( 'active' );
		megaMenu.setAttribute( 'aria-hidden', 'true' );
		triggerWrap.classList.remove( 'is-open' );
		document.querySelectorAll( '.mega-link[data-menu]' ).forEach( l => setLinkExpanded( l, false ) );
		pinnedLink = null;
	}

	trigger.addEventListener( 'click', ( e ) => {
		e.stopPropagation();
		if ( e.target.closest( '.mega-menu' ) ) return;

		const expanded = trigger.getAttribute( 'aria-expanded' ) === 'true';
		trigger.setAttribute( 'aria-expanded', String( ! expanded ) );
		megaMenu.classList.toggle( 'active' );
		megaMenu.setAttribute( 'aria-hidden', String( expanded ) );
		triggerWrap.classList.toggle( 'is-open' );
	} );

	document.addEventListener( 'click', ( e ) => {
		if ( ! triggerWrap.contains( e.target ) ) {
			closeMegaMenu();
		}
	} );

	document.addEventListener( 'keydown', ( e ) => {
		if ( e.key === 'Escape' && megaMenu.classList.contains( 'active' ) ) {
			closeMegaMenu();
			trigger.focus();
		}
	} );

	const isMobile = () => window.innerWidth <= 767;

	let pinnedLink = null;
	let hideTimeout = null;

	document.querySelectorAll( '.mega-link[data-menu]' ).forEach( link => {
		let hideTimeout;

		link.addEventListener( 'mouseenter', () => {
			if ( isMobile() ) return;

			clearTimeout( hideTimeout );
			document.querySelectorAll( '.mega-link' ).forEach( l => setLinkExpanded( l, false ) );
			setLinkExpanded( link, true );
			document.querySelectorAll( '.submenu' ).forEach( s => {
				s.classList.remove( 'active' );
				s.style.paddingTop = '';
			} );

			const target = document.querySelector(`[data-submenu="${link.dataset.menu}"]`);

			if (target) {
				target.classList.add('active');
				target.style.top = `${link.offsetTop}px`;
			}
		} );

		link.addEventListener( 'mouseleave', () => {
			if ( isMobile() ) return;
			if ( pinnedLink === link ) return;

			clearTimeout( hideTimeout );

			const target = document.querySelector( `[data-submenu="${ link.dataset.menu }"]` );

			hideTimeout = setTimeout( () => {
				if ( target && target.matches( ':hover' ) ) return;
				if ( pinnedLink ) return;

				setLinkExpanded( link, false );

				if ( target ) {
					target.classList.remove( 'active' );
				}
			}, 450 );
		} );

		link.addEventListener( 'click', ( e ) => {
			e.stopPropagation();

			if ( isMobile() ) {
				const isActive = link.classList.contains( 'active' );

				document.querySelectorAll( '.mega-link' ).forEach( l => setLinkExpanded( l, false ) );
				document.querySelectorAll( '.submenu' ).forEach( s => s.classList.remove( 'active' ) );

				if ( ! isActive ) {
					setLinkExpanded( link, true );
					const target = document.querySelector( `[data-submenu="${ link.dataset.menu }"]` );
					if ( target ) target.classList.add( 'active' );
				}
				return;
			}

			if ( pinnedLink === link ) {
				pinnedLink = null;
			} else {
				pinnedLink = link;

				document.querySelectorAll( '.mega-link' ).forEach( l => setLinkExpanded( l, false ) );
				document.querySelectorAll( '.submenu' ).forEach( s => {
					s.classList.remove( 'active' );
					s.style.paddingTop = '';
				} );

				setLinkExpanded( link, true );
				const target = document.querySelector(`[data-submenu="${link.dataset.menu}"]`);

				if (target) {
					target.classList.add('active');
					target.style.top = `${link.offsetTop}px`;
				}
			}
		} );

		link.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				link.click();
			}
			if ( e.key === 'Escape' ) {
				closeMegaMenu();
				trigger.focus();
			}

			if ( e.key === 'Tab' && ! e.shiftKey && document.activeElement === last ) {
				const allTriggers = Array.from( document.querySelectorAll( '.mega-link[data-menu]' ) );
				const currentIndex = allTriggers.indexOf( link );
				const nextTrigger  = allTriggers[ currentIndex + 1 ];

				if ( nextTrigger ) {
					e.preventDefault();
					submenu.classList.remove( 'active' );
					setLinkExpanded( link, false );
					nextTrigger.focus();
				}
			}
		} );
	} );

	document.querySelectorAll( '.submenu' ).forEach( submenu => {
		submenu.addEventListener( 'mouseenter', () => {
			if ( isMobile() ) return;

			clearTimeout( hideTimeout );

			const slug = submenu.dataset.submenu;
			const link = document.querySelector( `.mega-link[data-menu="${ slug }"]` );

			setLinkExpanded( link, true );
		} );

		submenu.addEventListener( 'mouseleave', () => {
			if ( isMobile() ) return;

			const slug = submenu.dataset.submenu;
			const link = document.querySelector( `.mega-link[data-menu="${ slug }"]` );

			if ( pinnedLink === link ) return;

			clearTimeout( hideTimeout );

			hideTimeout = setTimeout( () => {
				submenu.classList.remove( 'active' );
				setLinkExpanded( link, false );
			}, 450 );
		} );

		submenu.addEventListener( 'keydown', ( e ) => {
			const slug = submenu.dataset.submenu;
			const link = document.querySelector( `.mega-link[data-menu="${ slug }"]` );
			const focusable = Array.from( submenu.querySelectorAll( 'a[href], button:not([disabled])' ) );

			if ( ! focusable.length ) return;

			const first = focusable[ 0 ];
			const last  = focusable[ focusable.length - 1 ];

			if ( e.key === 'Tab' && e.shiftKey && document.activeElement === first ) {
				e.preventDefault();
				if ( link ) link.focus();
				return;
			}

			if ( e.key === 'Tab' && ! e.shiftKey && document.activeElement === last ) {
				const allLinks = Array.from(
					document.querySelectorAll('.mega-menu__left > .mega-link')
				);
				const currentIndex = allLinks.indexOf(link);
				const nextItem = allLinks[currentIndex + 1];

				if (nextItem) {
					e.preventDefault();

					submenu.classList.remove('active');
					setLinkExpanded(link, false);

					nextItem.focus();
				}
			}

			if ( e.key === 'Escape' ) {
				submenu.classList.remove( 'active' );
				setLinkExpanded( link, false );
				if ( link ) link.focus();
			}
		} );
	} );

	document.querySelectorAll( '.insights-item' ).forEach( item => {
		const link = item.querySelector( '.insights-item__read-more' );
		if ( ! link ) return;

		item.addEventListener( 'click', ( event ) => {
			if ( event.target.closest( 'a' ) ) return;
			window.location.href = link.href;
		} );
	} );



} );


document.querySelectorAll( '.team-grid__select' ).forEach( select => {
	function resize() {
		const tmp = document.createElement( 'select' );
		tmp.style.visibility = 'hidden';
		tmp.style.position = 'absolute';
		tmp.style.fontFamily = getComputedStyle( select ).fontFamily;
		tmp.style.fontSize = getComputedStyle( select ).fontSize;

		const opt = document.createElement( 'option' );
		opt.textContent = select.options[ select.selectedIndex ].textContent.trim();
		tmp.appendChild( opt );
		document.body.appendChild( tmp );

		select.style.width = ( tmp.offsetWidth + 8 ) + 'px';
		document.body.removeChild( tmp );
	}

	resize();
	select.addEventListener( 'change', resize );
} );
