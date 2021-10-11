$(document).ready(function() {





    /*
        Show Quick Action button for Canteen and CFG members only
    */

    // Get the total number of Orgs a user belongs to
    let userOrgTotal = HelpCenter.user.organizations.length;

    // Loop through all of a user's Orgs to see if they're a Canteen/CFG member
    /*
        Use the 'orgCheck' variable to prevent the removal of the element with the
        'restricted-canteen-content' class and thereby removing the function's chance to re-add the 
        class when the check passes.

        Seems a little convoluted...
        Check to see if this can be improved with a little extra brain power.
    */
    for ( var i = 0; i < userOrgTotal; i++ ) {
        var orgCheck = false;

        if ( HelpCenter.user.organizations[i].name == '365 Retail Markets' || HelpCenter.user.organizations[i].name.includes('Canteen') ) {
            orgCheck = true;
        } else {
            orgCheck = false;
        };
    }

    // Add or remove our element based on the result above
    if ( orgCheck == false ) {
        $( '.js-restricted-canteen-content' ).remove();
    } else if ( orgCheck == true ) {
        $( '.js-restricted-canteen-content' ).show();
    };






    /* 
        Show Internal Category if 365 user logged in
    */
    if ( HelpCenter.user.organizations[0] === undefined ) {
        $( '.js-restricted-internal-content' ).remove();

    } else if ( HelpCenter.user.organizations[0].name == '365 Retail Markets' ) {
        $( '.js-restricted-internal-content' ).show();

        // The .show() method expands the internal category drawer when this script is run
        // Run this .slideToggle() to hide the drawer after it is expanded with a duration of "instant"
        $( '#internal-drawer-content' ).slideToggle(0);

    } else {
        $( '.js-restricted-internal-content' ).remove();
    };





    /*
        Toggle Home Page Category content
    */
    $( '.js-expand-category' ).click(function toggleHomeCat() {
        $(this).next( '.category-heading__content' ).slideToggle(250);
        $(this).find( '.heading i' ).toggleClass( 'ph-plus-bold ph-minus-bold' );
    });





    /* 
        Switch over Common Questions categories
    */
    $( '.js-switch-question' ).click(function (event) {
        event.preventDefault();
    });

    $( '.js-switch-question' ).click(function switchCommonQuestions() {

        // Get the ID of the clicked on button so we can use it to assign classes to the right element
        var questionID = $(this).attr( 'href' );

        // Remove the previous button's "active" state and add it to the clicked button
        $( '.button--active' ).addClass( 'button--inactive' );
        $( '.button--active' ).removeClass( 'button--active' );
        $(this).addClass( 'button--active' );

        // Remove active state from the current block and add it to the one referenced by the data-attribute
        $( '.question-block--active' ).removeClass( 'question-block--active' );
        $( questionID ).addClass( 'question-block--active' );
    });





    /* 
        Retrieve latest articles and insert title, date, and link content into feed
    */
    $.ajax({
		method: 'GET',
		url: 'https://help.365retailmarkets.com/api/v2/help_center/en-us/articles.json?sort_by=created_at',
		dataType: 'json',
		async: true,
		success: function getLatestArticles(requested) {

			for (var i = 0; i < requested.articles.length; i++) {

				if (requested.articles[i].user_segment_id == '321294') {
					requested.articles.splice(i, 1);
				}
            }

            // The article feed titles & dates are siblings. The header counts as child 1.
            // Article titles are then even children and article dates are odd children.
            // Variable t starts at the first title and ends at highest date + 1.
            // Variable n is used to keep in sync with the JSON index.
            
            var n = 0;

            for (var t = 2; t < 12; t++) {
                n++;

                if ( requested.articles[n] === undefined ) {
                    $( `a.new-articles-feed__article-title:nth-child(2n+${t})` ).text( 'Log in to view new articles.' );
                    $( `a.new-articles-feed__article-title:nth-child(2n+${t})` ).attr( 'href', '#');
                    $( `div.js-article-date:nth-child(3n+${t})` ).text('N/A');

                } else {

                    $( `a.new-articles-feed__article-title:nth-child(2n+${t})` ).text(requested.articles[n].title);
                    $( `a.new-articles-feed__article-title:nth-child(2n+${t})` ).attr("href", requested.articles[n].html_url);
                    $( `div.js-article-date:nth-child(3n+${t})` ).text(requested.articles[n].updated_at.substring(0, 10));
                }
            }
		}
    });





}); // End document.ready block
