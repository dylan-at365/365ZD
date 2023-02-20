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
    $( '.js-expand-category' ).on('keypress click', function toggleHomeCat() {
        $(this).next( '.category-heading__content' ).slideToggle(250);
        $(this).find( '.heading i' ).toggleClass( 'ph-plus-bold ph-minus-bold' );
    });





    /* 
        Switch over Common Questions categories
    */
    $( '.js-switch-question' ).click(function switchCommonQuestions(event) {

        event.preventDefault();

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
    async function getNewArticles( url ) {

        let articleFramework = document.createDocumentFragment();

        try {

            let response = await fetch ( url )

            .then( ( response ) => {
                return response.json();
            })

            .then(( data ) => {

                let newArticles = data.articles.filter( function( item, index ) {

                    item.position = index;
                    return item.user_segment_id !== '321294' && index < 10;

                });

                newArticles.map( function( article ) {

                    let itemWrapper = document.createElement( 'div' );
                    let itemLink = document.createElement( 'a' );
                    let itemDate = document.createElement( 'div' );

                    itemWrapper.className = 'col-sm-12 col-md-6 new-article-item';
                    itemLink.className = 'font-body--large';
                    itemDate.className = 'font-body--emphasis';

                    itemLink.href = article.html_url;
                    itemLink.innerHTML = article.title;
                    itemDate.innerHTML = article.updated_at.substring( 0, 10 );

                    itemWrapper.appendChild( itemLink );
                    itemWrapper.appendChild( itemDate );
                    articleFramework.appendChild( itemWrapper );

                });

            });
        }

        catch( error ) {
            console.error( error );
        }

        document.querySelector( '.js-new-articles-feed' ).appendChild( articleFramework );
    }

    getNewArticles('https://help.365retailmarkets.com/api/v2/help_center/en-us/articles.json?page=1&per_page=30&sort_by=created_at');





}); // End document.ready block
