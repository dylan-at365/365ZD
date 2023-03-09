$(document).ready(function() {





    // Pulled a few functions from Zendesk's Copenhagen theme
    // (https://github.com/zendesk/copenhagen_theme/blob/master/script.js)

    // Function 1 - closest()
    function closest ( element, selector ) {

        if ( Element.prototype.closest ) {
            return element.closest( selector );
        }

        do {
            if ( Element.prototype.matches && element.matches( selector )
            || Element.prototype.msMatchesSelector && element.msMatchesSelector( selector )
            || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector( selector )) {
                return element;
            }

            element = element.parentElement || element.parentNode;

        } while ( element !== null && element.nodeType === 1 );

        return null;
    }

    // Function 2 - saveFocus()
    // In some cases we should preserve focus after page reload
    function saveFocus() {
        var activeElementId = document.activeElement.getAttribute( 'id' );
        sessionStorage.setItem( 'returnFocusTo', '#' + activeElementId );
    }

    var returnFocusTo = sessionStorage.getItem( 'returnFocusTo' );

    if (returnFocusTo) {
        sessionStorage.removeItem( 'returnFocusTo' );
        var returnFocusToEl = document.querySelector( returnFocusTo );
        returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }

    // Submit requests filter form when the Status drop down menu is changed
    Array.prototype.forEach.call( document.querySelectorAll( '#request-status-select' ), function( el ) {
        el.addEventListener( 'change', function( e ) {
            e.stopPropagation();
            saveFocus();
            closest( this, 'form' ).submit();
        });
    });

    // Submit requests filter form on search in the request list page
    var quickSearch = document.querySelector( '#quick-search' );
    quickSearch && quickSearch.addEventListener( 'keyup', function( e ) {
        if ( e.keyCode === ENTER ) {
            e.stopPropagation();
            saveFocus();
            closest( this, 'form' ).submit();
        }
    });

    // Submit requests filter form on status or organization change in the request list page
    Array.prototype.forEach.call( document.querySelectorAll( '#request-status-select, #request-organization-select' ), function( el ) {
        el.addEventListener( 'change', function( e ) {
            e.stopPropagation();
            saveFocus();
            closest( this, 'form' ).submit();
        });
    });

    // Submit organization form in the request page
    var requestOrganisationSelect = document.querySelector( '#request-organization select' );

    if (requestOrganisationSelect) {
        requestOrganisationSelect.addEventListener( 'change', function() {
            closest( this, 'form' ).submit();
        });
    }
  
    // End borrowed Zendesk scripts





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

    if ( markAsSolvedButton ) {
        markAsSolvedButton.click( function() {
            markAsSolvedCheckbox.prop( 'checked', true );
            commentSubmitButton.prop( 'disabled', true );
            $(this).data( 'data-disabled', true );
            $(this).closest( 'form' ).submit();
        });
    };

});
