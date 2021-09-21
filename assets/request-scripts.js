$(document).ready(function() {
    
    // Disable Submit button if text area is empty
    if ( $( '.request-container' ) && $( '.request-container' ).val() === '') {
        $( '.request-container input[name="commit"]' ).prop( 'disabled', true );
        $( '.request-container input[name="commit"]' ).addClass('button--inactive');
    }

    // Watch for changes in the `textarea` element and adjust the button status accordingly
    $( '#request_comment_body' ).change( function() {
        if ( !$.trim( $( 'textarea' ).val()) ) {
            $( '.request-container input[name="commit"]' ).prop( 'disabled', true );
            $( '.request-container input[name="commit"]' ).addClass('button--inactive');
        } else {
            $( '.request-container input[name="commit"]' ).prop( 'disabled', false );
            $( '.request-container input[name="commit"]' ).removeClass('button--inactive');
        }
    });

    // Do the same for the `new_request_page.hbs` template
    // TODO: This can probably be combined with the script above, somehow. An OR selector for the jQuery find?
    $( '#request_description' ).change( function() {
        if ( !$.trim( $( 'textarea' ).val()) ) {
            $( '.request-container input[name="commit"]' ).prop( 'disabled', true );
            $( '.request-container input[name="commit"]' ).addClass('button--inactive');
        } else {
            $( '.request-container input[name="commit"]' ).prop( 'disabled', false );
            $( '.request-container input[name="commit"]' ).removeClass('button--inactive');
        }
    });





});
