$(document).ready(function() {





    /*
        * As Zendesk does not allow for the same article to exist in multiple places,
        * a workaround has been created where an article exists with a link to another article.
        * We're assigning that link a specific ID and then reference it here to send the user
        * along to the linked article.
    */
    let redirectCheck = document.getElementById( 'js-forward-redirect' );
    if( redirectCheck )  {
        let redirectURL = $( '#js-forward-redirect' ).attr( 'href' );
        window.location.href = redirectURL;
    };





    // Print article button function
    $( '.js-print-article' ).click(function printArticle() {
        window.print();
        return false;
    });





    // Add a little note telling users they can click on images to enable big mode
    $( '.article-inner img.fancybox' ).after( 
        '<p class="subheading subheading--annotation">(Click image to enlarge it)</p>' 
    );

    $( '.article-inner img.fancybox-gallery:last-of-type' ).after( 
        '<p class="subheading subheading--annotation">(Click image to open in gallery)</p>' 
    );




    // Add table and striping class to, and remove width from, all article tables
    $( '.article-inner table' ).each (function tableDeco() {
        $(this).addClass( 'table table-striped' );
        $(this).removeAttr( 'width' );
        $(this).removeAttr( 'style' );
    });

    // Wrap tables in a responsive div tag if sticky headers are not set
    if ( $( 'table thead' ).hasClass( 'table__sticky-header') == false ) {
        $( '.article-inner table' ).wrap( '<div class="table-responsive"></div>' );
    }





    // Scroll article anchor tags into view
    // from: https://css-tricks.com/snippets/jquery/smooth-scrolling/
    $( 'a[href*="#"]' )

    // Remove links that don't actually link to anything
    .not( '[href="#"]' )
    .not( '[href="#0"]' )

    .click (function(event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
            && 
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $( '[name=' + this.hash.slice(1) + ']' );

            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                    $( 'html, body' ).animate({
                        // EDIT: offset scroll by 50 pixels to account for Zendesk's admin bar
                        scrollTop: target.offset().top - 50
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is( ':focus' )) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr( 'tabindex','-1' ); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });





});
