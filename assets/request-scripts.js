$(document).ready(function() {

    var markAsSolvedButton = $( '.mark-as-solved' ),
        markAsSolvedCheckbox = $( 'input[name="mark_as_solved"]' ),
        commentSubmitButton = $( '.request-container input[name="commit"]' );
    
    // Disable Submit button if text area is empty
    if ( $( '.request-container' ) && $( '.request-container' ).val() === '') {
        $( '.request-container input[name="commit"]' ).prop( 'disabled', true );
        $( '.request-container input[name="commit"]' ).addClass( 'button--inactive' );
    }

    // Watch for changes in the `textarea` element and adjust the button status accordingly
    $( '#request_comment_body' ).change( function() {
        if ( !$.trim( $( 'textarea' ).val()) ) {
            commentSubmitButton.prop( 'disabled', true );
            commentSubmitButton.addClass( 'button--inactive' );
            markAsSolvedButton.html(markAsSolvedButton.attr( 'data-solve-translation' ));

        } else {
            commentSubmitButton.prop( 'disabled', false );
            commentSubmitButton.removeClass( 'button--inactive' );
            markAsSolvedButton.html(markAsSolvedButton.attr( 'data-solve-and-submit-translation' ));
        }
    });

    // Do the same for the `new_request_page.hbs` template
    // TODO: This can probably be combined with the script above, somehow. An OR selector for the jQuery find?
    $( '#request_description' ).change( function() {
        if ( !$.trim( $( 'textarea' ).val()) ) {
            commentSubmitButton.prop( 'disabled', true );
            commentSubmitButton.addClass( 'button--inactive' );
        } else {
            commentSubmitButton.prop( 'disabled', false );
            commentSubmitButton.removeClass( 'button--inactive' );
        }
    });

    if (markAsSolvedButton) {
        markAsSolvedButton.click( function() {
            markAsSolvedCheckbox.prop( 'checked', true );
            commentSubmitButton.prop( 'disabled', true );
            $(this).data( 'data-disabled', true );
            $(this).closest( 'form' ).submit();
        });
    };

});
