/*
    * This script adds functionality to a "toggle" switch and a "clear" button element in the `header.hbs` file.
    * Note that, due to the way scripting in the Zendesk Guide platform works, there is a flash of
    * an alternate theme mode when the page is reloaded, or a new page is navigated to, as the localStorage
    * is accessed. Presently, I do not believe there is a way around this.
*/

$(document).ready(function() {

    // Remove the mode toggle/clear elements if user is not internal (for now)
    if ( HelpCenter.user.organizations[0] === undefined ) {
        $( '.mode-toggle' ).remove();
        $( '.clear-mode-toggle' ).remove();
    } 
    
    else if ( HelpCenter.user.organizations[0].name == '365 Retail Markets' ) {
        $( '.mode-toggle' ).show();
        $( '.clear-mode-toggle' ).show();
    } 
    
    else {
        $( '.mode-toggle' ).remove();
        $( '.clear-mode-toggle' ).remove();
    };

    // Update the toggle switch button based on the selected color scheme, either from the OS or the toggle
    // TODO: Using the `updateToggleButton` function as it is run on each page load. Could maybe use something more specific to the localStorage check? At least rename the function...
    function updateToggleButton() {

        // Check localStorage for the desired mode
        switch ( localStorage.getItem('colorMode') ) {
            case 'dark':
                $( '#js-mode-toggle-switch' ).prop( 'checked', true );
                initColorSchemeCSS('css', 'dark');
                toggleColorSchemeCSS( 'css', 'dark' );

                $( '.clear-mode-toggle' ).removeClass( 'button--inactive' );
            break;

            case 'light':
                $( '#js-mode-toggle-switch' ).prop( 'checked', false );
                initColorSchemeCSS('css', 'light');
                toggleColorSchemeCSS( 'css', 'light' );

                $( '.clear-mode-toggle' ).removeClass( 'button--inactive' );
            break;

            // Settle for using the OS-defined theme if localStorage is empty or otherwise
            default:
                $dark = ( window.matchMedia && window.matchMedia( '(prefers-color-scheme: dark)' ).matches );
                $( '#js-mode-toggle-switch' ).prop( 'checked', $dark );
            break;
        }

    }

    // Update on first load
    updateToggleButton();
    
    // And whenever it changes
    if (window.matchMedia) window.matchMedia( '(prefers-color-scheme: dark)' ).addListener( updateToggleButton );

    // Mode Toggle Button
    // ================================
    // Initialize CSS
    function initColorSchemeCSS( $id, $mode ) {
        // Remove existing ID
        if ( $( '#' + $id ) ) $( '#' + $id ).remove();

        $( '#' + $id + '-' + $mode ).attr( {
            // Store light CSS URL
            'data-href-light': $( '#' + $id + '-light' ).attr( 'href' ),

            // Store dark CSS URL
            'data-href-dark': $( '#' + $id + '-dark' ).attr( 'href' ),

            // Store color mode, so we don't re-init
            'data-color-scheme': $mode,

            // Drop media filter
            'media': 'all',

            // Rename the ID (remove `-{mode}` suffix)
            'id': $id,
        } );

        $other = ( $mode == 'dark' ) ? 'light' : 'dark';
        $( '#' + $id + '-' + $other).remove();
    }

    // Toggle the CSS
    function toggleColorSchemeCSS( $id, $mode ) {
        // Get new mode CSS href
        $href = $( '#' + $id ).data( 'href-' + $mode );

        // Set the CSS to the mode perference
        $( '#' + $id ).attr( {
            'href': $href,
            'data-color-scheme': $mode,
        });
    }

    // Toggle button click
    $( '#js-mode-toggle-switch' ).bind( 'click', function() {

        // Get current mode
        $mode = $( '#css' ).attr('data-color-scheme');

        // Test if this is a first time click, and if so, init code
        if ( typeof $mode === 'undefined' ) {

            // Not defined yet; set pref. & ask browser if alt. is active
            $mode = 'light';

            if( window.matchMedia && window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) $mode = 'dark';
            initColorSchemeCSS('css', $mode);

            // Set the state of the "clear" button to inactive, indicating that no choice has been made again
            $( '.clear-mode-toggle' ).addClass( 'button--inactive' );
        }

        // Swap the current mode
        $mode = ( $mode == 'dark' ) ? 'light' : 'dark';
        localStorage.setItem('colorMode', $mode);
        toggleColorSchemeCSS('css', $mode);

        $( '.clear-mode-toggle' ).removeClass( 'button--inactive' );
        
        $( '.mode-toggle-switch i' ).addClass( 'js-rotate-button' )
        .on( 'animationend', function() {
            $( this ).removeClass( 'js-rotate-button' );
        });
        

    });

    // Clear the localStorage if the user wants to use the OS-defined setting again
    $( '#js-clear-mode-storage' ).bind( 'click', function() {

        // If nothing has been set and the button is clicked, fire a toast message informing the user
        if ( !localStorage.getItem( 'colorMode' ) ) {

            $( '.toast' ).addClass( 'toast--alert' );
            $( '.toast__title' ).text( 'Error' );
            $( '.toast__description' ).text( 'Theme mode toggle not set!' );

            $( '.toast' ).removeClass( 'd-none' );
            $( '.toast' ).animate( { opacity: 1 }, 200 );

            // Is a timeout inside a timeout a bad idea? The styles get removed from the fading element too early otherwise...
            setTimeout(() => {
                $( '.toast' ).animate( { opacity: 0 }, 200 );

                setTimeout(() => {
                    $( '.toast' ).removeClass( 'toast--alert' );
                    $( '.toast' ).addClass( 'd-none' );
                }, 200 );
            }, 3000 );

        }

        // If localStorage exists with the theme selection, remove it
        else {

            localStorage.removeItem( 'colorMode' );

            // Inform the user that something happened
            $( '.toast' ).addClass( 'toast--success' );
            $( '.toast__title' ).text( 'Theme mode cleared' );
            $( '.toast__description' ).text( 'Please refresh the page to view changes.');

            $( '.toast' ).removeClass( 'd-none' );
            $( '.toast' ).animate( { opacity: 1 }, 200 );

            setTimeout(() => {
                $( '.toast' ).animate( { opacity: 0 }, 200 );
                
                setTimeout(() => {
                    $( '.toast' ).removeClass( 'toast--success' );
                    $( '.toast' ).addClass( 'd-none' );
                }, 200 );

            }, 3000 );

            // Set our "clear" button back to "inactive"
            $( '.clear-mode-toggle' ).addClass( 'button--inactive' );

        }

    });

});
