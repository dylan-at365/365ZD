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





    // Auto-generate a "Table of Contents" based on the heading elements in the article.
    var headingElements = $( 'h1, h2, h3, h4' );
    var regExMatch = /[\w\d]/g;

    if ( $( '.js-deny-toc' ).length ) {
        $( '.table-of-contents' ).remove();
    };

    // Some articles might not want the ToC. Skip the modification if this class exists
    // If the sidebar is empty, also don't do anything
    if ( !$( '.js-deny-toc' ).length ) {

        // Start at index 1 to skip over the HelpCenter title
        for ( var i = 1; i < headingElements.length; i++ ) {

            /*
                * Assign heading elements an ID based on their text content,
                * minus the whitespace & limited to 24 characters.

                * Additionally, if the ID has been created from the WYSIWYG
                * editor, do not replace this with a generated ID.
            */
            headingElementID = headingElements[i].id;

            if ( headingElementID.startsWith('#h_') ) {
                headingElements[i].id = headingElementID;
            }

            else if ( headingElements[i].id == "" ) {
                headingElements[i].id = headingElements[i].textContent.replace(/[\s\W]/g, '').substring(0, 24) + i;
            }

            /*
                * Indent the headings in the auto-generated Table of Contents not by the
                * heading element they're assigned in the article editor, but rather
                * by their relation to the previous heading element.
                * This way, if an author places an h4 element right after an h1 element,
                * the h4 element is not overly indented.
            */
            var indentLevel = 'toplevel';
            var prevSiblings = headingElements[i].previousElementSibling;

            if ( prevSiblings == null) {
                prevSiblings = headingElements[i].nextElementSibling;
            }

            while ( !['H1', 'H2', 'H3', 'H4'].includes(prevSiblings.tagName) ) {
                if ( prevSiblings.previousElementSibling == null ) {
                    break;
                }

                else {
                    prevSiblings = prevSiblings.previousElementSibling;
                }
            }

            if ( headingElements[i].tagName == 'H1' ) {
                indentLevel = 'toplevel';
            }

            else if ( prevSiblings.tagName == 'H1' ) {

                if ( headingElements[i].tagName == 'H1' ) {
                    indentLevel = 'toplevel';
                }

                else if ( headingElements[i].tagName != 'H1' ) {
                    indentLevel = 'sublevel-one';
                }
            }

            else if ( prevSiblings.tagName == 'H2' ) {

                if ( headingElements[i].tagName == 'H1' ) {
                    indentLevel = 'toplevel';
                }

                else if ( headingElements[i].tagName == 'H2' ) {
                    indentLevel = 'sublevel-one';
                }

                else if ( headingElements[i].tagName == 'H3' || headingElements[i].tagName == 'H4' ) {
                    indentLevel = 'sublevel-two';
                }
            }

            else if ( prevSiblings.tagName == 'H3' ) {

                if ( headingElements[i].tagName == 'H1' ) {
                    indentLevel = 'toplevel';
                }

                else if ( headingElements[i].tagName == 'H2' ) {
                    indentLevel = 'sublevel-one';
                }

                else if ( headingElements[i].tagName == 'H3' ) {
                    indentLevel = 'sublevel-two';
                }

                else if ( headingElements[i].tagName == 'H4' ) {
                    indentLevel = 'sublevel-three';
                }
            }

            else if ( prevSiblings.tagName == 'H4' ) {

                if ( headingElements[i].tagName == 'H1' ) {
                    indentLevel = 'toplevel';
                }

                else if ( headingElements[i].tagName == 'H2' ) {
                    indentLevel = 'sublevel-one';
                }

                else if ( headingElements[i].tagName == 'H3' ) {
                    indentLevel = 'sublevel-two';
                }

                else if ( headingElements[i].tagName == 'H4' ) {
                    indentLevel = 'sublevel-three';
                }

            }

            if ( headingElements[i].textContent.match(regExMatch) ) {
                $( '.article-sidebar .js-append-toc' ).append(
                    `<li class="article-sidebar__${indentLevel}">
                        <a href="#${headingElements[i].id}">
                            ${headingElements[i].textContent}
                        </a>
                    </li>`
                );
            };
        };
    };

    // If a link to an auto-generated ID is supplied, navigate to that ID after it has been generated
    var currentHash = window.location.hash;
    if ( currentHash != "" ) {
        $(`${currentHash}`)[0].scrollIntoView();
    };

    // If the ToC is empty, get rid of it
    if ( $( '.js-append-toc').children().length == 0 ) {
        $( '.table-of-contents' ).remove();
    };

    // If the only element is the "to top" button, make the column smaller
    if ( $( '.article-sidebar' ).children().length == 1 ) {
        $( '.article-sidebar' ).removeClass( 'col-md-3' );
        $( '.article-sidebar' ).addClass( 'col-md-1' );
    };

    // Scroll to top button
    $( '.js-scroll-top' ).click (function() {
        $( 'html, body' ).animate( { scrollTop: 0 }, '1000' );
    });





    // FancyBox lightbox
	$( '.article-inner img.fancybox' ).click(function toggleFancyBox() {
		$.fancybox.open([
			{
				src : $(this).attr("src"),
				opts : { smallBtn: true },
			},
		]);
	});

    // Add a little note telling users they can click on images to enable big mode
    $( '.article-inner img.fancybox' ).after( 
        '<p class="subheading subheading--annotation">(Click image to enlarge it)</p>' 
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
