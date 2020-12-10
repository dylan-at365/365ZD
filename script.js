$(document).ready(function() {

    // Toggle hamburger menu in Header
    $( '.menu-button' ).click(function toggleMenu() {
        $( '.menu' ).slideToggle(250);
        $( '.menu-button i' ).toggleClass( 'ph-list ph-x' );
    });

    // Show Quick Action button for Canteen Org members only
    if ( HelpCenter.user.organizations[0] === undefined ) {
        $( 'div.canteen' ).remove();

    } else if ( HelpCenter.user.organizations[0].name == '365 Retail Markets' || HelpCenter.user.organizations[0].name == 'Canteen' ) {
        $( 'div.canteen' ).show();

    } else {
        $( 'div.canteen' ).remove();
    };

    // Show Internal Category if 365 user logged in
    if ( HelpCenter.user.organizations[0] === undefined ) {
        $( 'div.internal-header' ).remove();
        $( 'div.internal-content' ).remove();

    } else if ( HelpCenter.user.organizations[0].name == '365 Retail Markets' ) {
        $( 'div.internal-header' ).show();

    } else {
        $( 'div.internal-header' ).remove();
        $( 'div.internal-content' ).remove();
    };

    // Show footer navigation by default
    $( '.nav_footer' ).addClass( 'nav_display' );
    $( '.nav_search' ).addClass( 'nav_display' );
    $( '.nav_categories' ).removeClass( 'd-none' );
    // Hide when at the bottom to not block the social icons
    $(document).scroll(function toggleFooterNav() {
        var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
        if ( scrollBottom < 96 ) {
            $( '.nav_footer' ).removeClass( 'nav_display' );
            $( '.nav_search' ).removeClass( 'nav_display' );
            $( '.nav_categories' ).addClass( 'd-none' );
        } else {
            $( '.nav_footer' ).addClass( 'nav_display' );
            $( '.nav_search' ).addClass( 'nav_display' );
            $( '.nav_categories' ).removeClass( 'd-none' );
        }
    });

    // Toggle footer navigation categories
    $( '.nav_footer-categories_button' ).click(function toggleFootCat() {
        $( '.nav_categories' ).slideToggle(250);
        $(this).toggleClass( 'selected' );
        $(this).find( 'i' ).toggleClass( 'ph-sort-descending ph-sort-ascending' );
    });

    // Toggle footer navigation content
    $( '.nav_category-header' ).click(function toggleCatContent() {
        $(this).next( '.nav_category-item_list' ).slideToggle(250);
        $(this).find( 'i' ).toggleClass( 'ph-plus-bold ph-minus-bold' );
    });

    // Set {{my_profile}} URL into Dashboard href attribute
    $.ajax({
		type: 'GET',
		url: 'https://365retailmarkets.zendesk.com/api/v2/users/me.json',
		dataType: 'json',
		async: true,
		success: function insertProfileURL(user) {
			{
				let userId = user.user.id;
				$( '#dashboard_link' ).attr('href', 'https://365retailmarkets.zendesk.com/hc/en-us/profiles/' + userId);
			}
		}
	});

    // Toggle Home Page Category content
    $( '.rollup-header' ).click(function toggleHomeCat() {
        $(this).next( '.rollup-content' ).slideToggle(250);
        $(this).find( '.category-rollup i' ).toggleClass( 'ph-plus-bold ph-minus-bold' );
    });

    // Retrieve latest articles and insert title, date, and link content into feed
    $.ajax({
		method: 'GET',
		url: 'https://365retailmarkets.zendesk.com/api/v2/help_center/en-us/articles.json?sort_by=created_at',
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
                    $( `a.new_articles-title:nth-child(2n+${t})` ).text( 'Log in to view new articles.' );
                    $( `a.new_articles-title:nth-child(2n+${t})` ).attr( 'href', '#');
                    $( `div.new_articles-date:nth-child(3n+${t})` ).text('N/A');

                } else {

                    $( `a.new_articles-title:nth-child(2n+${t})` ).text(requested.articles[n].title);
                    $( `a.new_articles-title:nth-child(2n+${t})` ).attr("href", requested.articles[n].html_url);
                    $( `div.new_articles-date:nth-child(3n+${t})` ).text(requested.articles[n].updated_at.substring(0, 10));
                }
            }
		}
    });

    // Pulled two functions from Zendesk's Copenhagen theme to operate the Status filter
    // (https://github.com/zendesk/copenhagen_theme/blob/master/script.js)

    // Function 1 - closest()
    function closest (element, selector) {
        if (Element.prototype.closest) {
          return element.closest(selector);
        }
        do {
          if (Element.prototype.matches && element.matches(selector)
            || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
            || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
            return element;
          }
          element = element.parentElement || element.parentNode;
        } while (element !== null && element.nodeType === 1);
        return null;
    }

    // Function 2 - saveFocus()
    // In some cases we should preserve focus after page reload
    function saveFocus() {
        var activeElementId = document.activeElement.getAttribute("id");
        sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
    }
    var returnFocusTo = sessionStorage.getItem('returnFocusTo');
    if (returnFocusTo) {
        sessionStorage.removeItem('returnFocusTo');
        var returnFocusToEl = document.querySelector(returnFocusTo);
        returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }

    // Submit requests filter form when the Status drop down menu is changed
    Array.prototype.forEach.call(document.querySelectorAll('#request-status-select'), function(el) {
        el.addEventListener('change', function(e) {
        e.stopPropagation();
        saveFocus();
        closest(this, 'form').submit();
        });
    });

    // Submit requests filter form on search in the request list page
    var quickSearch = document.querySelector('#quick-search');
    quickSearch && quickSearch.addEventListener('keyup', function(e) {
        if (e.keyCode === ENTER) {
        e.stopPropagation();
        saveFocus();
        closest(this, 'form').submit();
        }
    });

    // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    });
  });


    // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  
    // End borrowed Zendesk scripts

    // Hide the "Internal Support" links in the User Profile page if not Agent
    if (HelpCenter.user.role == 'agent') {
        $( 'div.internal' ).show();
    };

    // Print article button function
    $( '.print_article' ).click(function printArticle() {
        window.print();
        return false;
    });

    // FancyBox lightbox
	$( '.article_body img.fancybox' ).click(function toggleFancyBox() {
		$.fancybox.open([
			{
				src : $(this).attr("src"),
				opts : { smallBtn: true },
			},
		]);
	});

    // Add a little note telling users they can click on images to enable big mode
    $( '.article_body img.fancybox' ).after( '<p class="fancy-p_img">(Click image to enlarge it)</p>' );
    
    // Add table and striping class to, and remove width from, all article tables
    $( '.article_body table' ).each (function tableDeco() {
        $(this).addClass( 'table table-striped' );
        $(this).removeAttr( 'width' );
    });

    // Also wrap tables in a responsive div tag
    $( '.article_body table' ).wrap( '<div class="table-responsive"></div>' );
});
