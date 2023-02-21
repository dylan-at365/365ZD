$(document).ready(function() {





    /*
        Navigation Menu Scripts
        Based off of Envato's Tuts+ tutorial here: https://codepen.io/tutsplus/pen/zYaWXdM
    */

    const menuButton = document.querySelector( '.js-open-menu' );
    const menuButtonIcon = menuButton.querySelector( 'i' );
    const navMenu = document.querySelector( '.menu' );

    const level1Links = document.querySelectorAll( '.menu__level-1 > li > a' );
    const listWrapper2 = document.querySelector( '.list-wrapper:nth-child(2)' );
    const listWrapper3 = document.querySelector( '.list-wrapper:nth-child(3)' );

    const subMenuWrapper2 = listWrapper2.querySelector( '.submenu-wrapper' );
    const subMenuWrapper3 = listWrapper3.querySelector( '.submenu-wrapper' );

    const backButtons = document.querySelectorAll( '.menu__back' );
    const forwardButtons = document.querySelectorAll( '.menu__forward' );

    const backLabel2 = listWrapper2.querySelector( '.menu__back span' );
    const backLabel3 = listWrapper3.querySelector( '.menu__back span' );
    const forwardLabel2 = listWrapper2.querySelector( '.menu__forward a');
    const forwardLabel3 = listWrapper3.querySelector( '.menu__forward a');

    const isVisibleClass = 'is-visible';
    const isActiveClass = 'is-active';

    menuButton.addEventListener( 'click', function() {

        // Toggle button color state
        menuButton.classList.toggle( 'button--active' );

        // Toggle button icon
        if ( menuButtonIcon.classList.contains( 'ph-list' ) ) {
            menuButtonIcon.classList.remove( 'ph-list' );
            menuButtonIcon.classList.add( 'ph-x' );
        } else if ( menuButtonIcon.classList.contains ( 'ph-x' ) ) {
            menuButtonIcon.classList.remove( 'ph-x' );
            menuButtonIcon.classList.add( 'ph-list' );
        }
        
        // Toggle menu visibility
        navMenu.classList.toggle( isVisibleClass );

        // Hide submenu items if the menu is closed
        if ( !this.classList.contains( isVisibleClass )) {
            listWrapper2.classList.remove( isVisibleClass );
            listWrapper3.classList.remove( isVisibleClass );

            forwardLabel2.textContent = '';
            forwardLabel3.textContent = '';

            const menuLinks = document.querySelectorAll( '.is-active' );

            for ( const menuLink of menuLinks ) {
                menuLink.classList.remove( isActiveClass );
            }
        }
    });

    // Show second-level submenu
    for ( const level1Link of level1Links ) {
        level1Link.addEventListener( 'click', function( e ) {
            const siblingList = level1Link.nextElementSibling;
            const target = e.target;

            if ( siblingList ) {
                e.preventDefault();

                this.classList.add( isActiveClass );
                const cloneSiblingList = siblingList.cloneNode( true );

                subMenuWrapper2.innerHTML = '';
                subMenuWrapper2.append( cloneSiblingList );

                forwardLabel2.textContent = level1Link.textContent;
                forwardLabel2.href = target.closest( 'a' ).attributes.href.nodeValue;

                listWrapper2.classList.add( isVisibleClass );
            }
        });
    }

    // Show third-level submenu
    listWrapper2.addEventListener( 'click', function( e ) {
        const target = e.target;

        if ( target.tagName.toLowerCase() === 'a' && target.nextElementSibling ) {
            const siblingList = target.nextElementSibling;

            e.preventDefault();

            target.classList.add( isActiveClass );
            const cloneSiblingList = siblingList.cloneNode( true );

            subMenuWrapper3.innerHTML = '';
            subMenuWrapper3.append( cloneSiblingList );

            forwardLabel3.textContent = target.textContent;
            forwardLabel3.href = target.attributes.href.nodeValue;

            listWrapper3.classList.add( isVisibleClass );
        }
    });

    // Back button
    for ( const backButton of backButtons ) {
        backButton.addEventListener( 'click', function() {
            const parent = this.closest( '.list-wrapper' );
            
            parent.classList.remove( isVisibleClass );
            parent.previousElementSibling
                .querySelector( '.is-active' )
                .classList.remove( isActiveClass );

            parent.querySelector( '.menu__forward a' ).removeAttribute( 'href' );
        });
    }





    // Pulled a few functions from Zendesk's Copenhagen theme
    // (https://github.com/zendesk/copenhagen_theme/blob/master/script.js)

    // Function 1 - closest()
    function closest (element, selector) {
        if (Element.prototype.closest) {
            return element.closest(selector);
        }
        do {
            if (Element.prototype.matches && element.matches(selector)
            || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
            || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
                return element;
            }

            element = element.parentElement || element.parentNode;

        } while (element !== null && element.nodeType === 1);

        return null;
    }

    // Function 2 - saveFocus()
    // In some cases we should preserve focus after page reload
    function saveFocus() {
        var activeElementId = document.activeElement.getAttribute("id");
        sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
    }

    var returnFocusTo = sessionStorage.getItem('returnFocusTo');

    if (returnFocusTo) {
        sessionStorage.removeItem('returnFocusTo');
        var returnFocusToEl = document.querySelector(returnFocusTo);
        returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }

    // Submit requests filter form when the Status drop down menu is changed
    Array.prototype.forEach.call(document.querySelectorAll('#request-status-select'), function(el) {
        el.addEventListener('change', function(e) {
            e.stopPropagation();
            saveFocus();
            closest(this, 'form').submit();
        });
    });

    // Submit requests filter form on search in the request list page
    var quickSearch = document.querySelector('#quick-search');

    quickSearch && quickSearch.addEventListener('keyup', function(e) {
        if (e.keyCode === ENTER) {
            e.stopPropagation();
            saveFocus();
            closest(this, 'form').submit();
        }
    });

    // Submit requests filter form on status or organization change in the request list page
    Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
        el.addEventListener('change', function(e) {
            e.stopPropagation();
            saveFocus();
            closest(this, 'form').submit();
        });
    });

    // Submit organization form in the request page
    var requestOrganisationSelect = document.querySelector('#request-organization select');

    if (requestOrganisationSelect) {
        requestOrganisationSelect.addEventListener('change', function() {
            closest(this, 'form').submit();
        });
    }
  
    // End borrowed Zendesk scripts

});
