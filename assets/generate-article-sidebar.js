// Auto-generate a "Table of Contents" based on the heading elements in the article.
var headingElements = $( 'h1, h2, h3, h4, summary' );
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

        if ( headingElements[i].tagName == 'SUMMARY' ) {

            if ( headingElements[i].innerText.includes('Change Log') ) {
                indentLevel = 'toplevel';
            }

            else {
                continue;
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
