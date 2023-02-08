/*
    * This script adds functionality to a "toggle" switch element in the `header.hbs` file.
    * Note that, due to the way scripting in the Zendesk Guide platform works, there is a flash of
    * an alternate theme mode when the page is reloaded, or a new page is navigated to, as the localStorage
    * is accessed. Presently, I do not believe there is a way around this.
*/

$(document).ready(function() {

    // Update the toggle switch button based on the selected color scheme, either from the OS or the toggle
    function updateToggleButton() {

        // Check localStorage for the desired mode
        switch ( localStorage.getItem('colorMode') ) {
            case 'dark':
                $( '#js-mode-toggle-switch' ).prop( 'checked', true );
                initColorSchemeCSS('css', 'dark');
                toggleColorSchemeCSS( 'css', 'dark' );
            break;

            case 'light':
                $( '#js-mode-toggle-switch' ).prop( 'checked', false );
                initColorSchemeCSS('css', 'light');
                toggleColorSchemeCSS( 'css', 'light' );                
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
    if ( window.matchMedia ) window.matchMedia( '(prefers-color-scheme: dark)' ).addEventListener( 'change', updateToggleButton );

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
    $( '#js-mode-toggle-switch' ).on( 'click', function() {

        // Get current mode
        $mode = $( '#css' ).attr('data-color-scheme');

        // Test if this is a first time click, and if so, init code
        if ( typeof $mode === 'undefined' ) {

            // Not defined yet; set pref. & ask browser if alt. is active
            $mode = 'light';

            if( window.matchMedia && window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) $mode = 'dark';
            initColorSchemeCSS('css', $mode);
        }

        // Swap the current mode
        $mode = ( $mode == 'dark' ) ? 'light' : 'dark';
        localStorage.setItem('colorMode', $mode);
        toggleColorSchemeCSS('css', $mode);
        
        $( '.mode-toggle-switch i' ).addClass( 'js-rotate-button' )
        .on( 'animationend', function() {
            $( this ).removeClass( 'js-rotate-button' );
        });
        
    });

});
