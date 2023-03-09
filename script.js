$(document).ready(function() {

    // Navigation Menu
    const menuButton = document.querySelector( '.js-open-menu' );
    const menuButtonIcon = menuButton.querySelector( 'i' );
    const navMenu = document.querySelector( '.menu' );
    const isVisibleClass = 'is-visible';

    menuButton.addEventListener( 'click', function() {

        // Toggle button color state
        menuButton.classList.toggle( 'button--active' );

        // Toggle button icon
        if ( menuButtonIcon.classList.contains( 'ph-list' ) ) {
            menuButtonIcon.classList.remove( 'ph-list' );
            menuButtonIcon.classList.add( 'ph-x' );
        }
        
        else if ( menuButtonIcon.classList.contains ( 'ph-x' ) ) {
            menuButtonIcon.classList.remove( 'ph-x' );
            menuButtonIcon.classList.add( 'ph-list' );
        }
        
        // Toggle menu visibility
        navMenu.classList.toggle( isVisibleClass );

    });

});
