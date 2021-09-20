$(document).ready(function() {

    // Toggle hamburger menu in Header
    $( '.button--menu' ).click(function toggleMenu() {
        $( '.header-menu' ).slideToggle(250);
        $( '.button--menu i' ).toggleClass( 'ph-list ph-x' );
    });





    // Set {{my_profile}} URL into Dashboard href attribute
    $.ajax({
		type: 'GET',
		url: 'https://help.365retailmarkets.com/api/v2/users/me.json',
		dataType: 'json',
		async: true,
		success: function insertProfileURL(user) {
			{
				let userId = user.user.id;
				$( '#dashboard_link' ).attr('href', 'https://help.365retailmarkets.com/hc/en-us/profiles/' + userId);
			}
		}
	});





    // Pulled a few functions from Zendesk's Copenhagen theme
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

});
