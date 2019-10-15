/*
 * jQuery v1.9.1 included
 */
var name;
var userId;
var userRole;

$(document).ready(function() {
	$("form.search input[type=submit]").attr("value", "Search");
	if (HelpCenter.user.role != 'anonymous') {
		$('#support-toolbox').text('' + HelpCenter.user.name.split(" ")[0] + ', did you know you can submit and track support tickets online?');
		$('#ajax-content').load('https://365retailmarkets.zendesk.com/hc/en-us/requests/ #requests-table-iframe'); //Pulls My Activities table from Requests page to User Profile page
		$('#subscription-list .subscriptions-unsubscribe a').text(''); //Change Unfollow link text on Saved Articles (Subscriptions) page
		$('#ajax-subscriptions').load('https://365retailmarkets.zendesk.com/hc/en-us/subscriptions?filter_by=section #subscription-list');
		//Pulls subscribed topics to Dashboard
	}

	// Adds fadeout to the notification window upon follow/unfollow of an article/section
	$(".notification-dismiss")
	setTimeout(function() {
		$(".notification").fadeOut("slow");
	}, 3000);

	// social share popups
	$(".share a").click(function(e) {
		e.preventDefault();
		window.open(this.href, "", "height = 500, width = 500");
	});

	//Change pdf file exentension to png for document library
	$('#preview-image').text('.png'); //Change Unfollow link text on Saved Articles (Subscriptions) page

	// show form controls when the textarea receives focus or backbutton is used and value exists
	var $commentContainerTextarea = $(".comment-container textarea"),
		$commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

	$commentContainerTextarea.one("focus", function() {
		$commentContainerFormControls.show();
	});

	if ($commentContainerTextarea.val() !== "") {
		$commentContainerFormControls.show();
	}

	// Expand Request comment form when Add to conversation is clicked
	var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
		$requestCommentFields = $(".request-container .comment-container .comment-fields"),
		$requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

	$showRequestCommentContainerTrigger.on("click", function() {
		$showRequestCommentContainerTrigger.hide();
		$requestCommentFields.show();
		$requestCommentSubmit.show();
		$commentContainerTextarea.focus();
	});

	// Mark as solved button
	var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
		$requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
		$requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

	$requestMarkAsSolvedButton.on("click", function() {
		$requestMarkAsSolvedCheckbox.attr("checked", true);
		$requestCommentSubmitButton.prop("disabled", true);
		$(this).attr("data-disabled", true).closest("form").submit();
	});

	// Change Mark as solved text according to whether comment is filled
	var $requestCommentTextarea = $(".request-container .comment-container textarea");

	$requestCommentTextarea.on("keyup", function() {
		if ($requestCommentTextarea.val() !== "") {
			$requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
			$requestCommentSubmitButton.prop("disabled", false);
		} else {
			$requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
			$requestCommentSubmitButton.prop("disabled", true);
		}
	});

	// Disable submit button if textarea is empty
	if ($requestCommentTextarea.val() === "") {
		$requestCommentSubmitButton.prop("disabled", true);
	}

	// Submit requests filter form in the request list page
	$("#request-status-select, #request-organization-select")
		.on("change", function() {
			search();
		});

	// Submit requests filter form in the request list page
	$("#quick-search").on("keypress", function(e) {
		if (e.which === 13) {
			search();
		}
	});

	function search() {
		window.location.search = $.param({
			query: $("#quick-search").val(),
			status: $("#request-status-select").val(),
			organization_id: $("#request-organization-select").val()
		});
	}

	$(".header .icon-menu").on("click", function(e) {
		e.stopPropagation();
		var menu = document.getElementById("user-nav");
		var isExpanded = menu.getAttribute("aria-expanded") === "true";
		menu.setAttribute("aria-expanded", !isExpanded);
	});

	if ($("#user-nav").children().length === 0) {
		$(".header .icon-menu").hide();
	}


	// Submit organization form in the request page
	$("#request-organization select").on("change", function() {
		this.form.submit();
	});

});



$(document).ready(function() {
	$('#user-menu .my-activities').html('View Tickets');
	var w = window.innerWidth;
	if (w <= 480) {
		var sticky = $('.hc_header');
		sticky.removeClass('sticky_header_hide');
	}

});


//Accordion for Phone/Email on Contact Us Page
/*
$(document).ready(function() {
	var acc = document.getElementsByClassName("contact-accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function() {
			this.classList.toggle("active");
			var panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + "px";
			}
		});
	}
});*/

;
(function($) {

	// DOM ready
	$(function() {

		// Append the mobile icon nav
		$('#hc-nav').append($('<div class="nav-mobile"></div>'));

		// Add a <span> to every .nav-item that has a <ul> inside
		$('.nav-item').has('ul').prepend('<span class="nav-click"><i class="nav-arrow"></i></span>');

		// Click to reveal the nav
		$('.nav-mobile').click(function() {
			$('.nav-list').toggle();
			$('#hc-nav').parent().find('.help-center-navigation').toggleClass('hc-nav-height');
			$('#hc-nav').parent().find('#nav-search').addClass('nav-search-center');
		});

		// Dynamic binding to on 'click'
		$('.nav-list').on('click', '.nav-click', function() {

			// Toggle - click to display the nested nav (mobile only)
			$(this).siblings('.nav-submenu').toggle();

			// Toggle the arrow using CSS3 transforms
			$(this).children('.nav-arrow').toggleClass('nav-rotate');

		});

	});

})(jQuery);

$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: 'https://365retailmarkets.zendesk.com/api/v2/users/me.json',
		dataType: 'json',
		async: true,
		success: function(user) {
			{
				name = user.user.name;
				userId = user.user.id;
				userRole = user.user.role;
				$("#user-profile-link").attr("href", "https://365retailmarkets.zendesk.com/hc/en-us/profiles/" + userId);
				$("#user-info-name").text(name);

				if (userRole == 'admin' || userRole == 'agent')

				{
					document.getElementById("internal-support-links").style.display = "block";
				} else {
					console.log('Active user is not an Agent/Admin.')
				}

			}
		}
	})
});

$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: 'https://365retailmarkets.zendesk.com/api/v2/help_center/en-us/articles.json?sort_by=created_at',
		dataType: 'json',
		async: true,
		success: function(requested) {

			for (var i = 0; i < requested.articles.length; i++) {

				if (requested.articles[i].user_segment_id == '321294') {
					requested.articles.splice(i, 1);
				}
			}

			{
				articleTitle1 = requested.articles[0].title;
				articleLink1 = requested.articles[0].html_url;
				articleTime1 = requested.articles[0].updated_at.substring(0, 10);

				articleTitle2 = requested.articles[1].title;
				articleLink2 = requested.articles[1].html_url;
				articleTime2 = requested.articles[1].updated_at.substring(0, 10);

				articleTitle3 = requested.articles[2].title;
				articleLink3 = requested.articles[2].html_url;
				articleTime3 = requested.articles[2].updated_at.substring(0, 10);

				articleTitle4 = requested.articles[3].title;
				articleLink4 = requested.articles[3].html_url;
				articleTime4 = requested.articles[3].updated_at.substring(0, 10);

				articleTitle5 = requested.articles[4].title;
				articleLink5 = requested.articles[4].html_url;
				articleTime5 = requested.articles[4].updated_at.substring(0, 10);

				$(".new-articles > li:first-child > .newarticles_title").text(articleTitle1);
				$(".new-articles > li:first-child > .newarticles_published").text(articleTime1);
				$(".new-articles > li:first-child > .newarticles_cta > a").attr("href", articleLink1);

				$(".new-articles > li:nth-child(2) > .newarticles_title").text(articleTitle2);
				$(".new-articles > li:nth-child(2) > .newarticles_published").text(articleTime2);
				$(".new-articles > li:nth-child(2) > .newarticles_cta > a").attr("href", articleLink2);

				$(".new-articles > li:nth-child(3) > .newarticles_title").text(articleTitle3);
				$(".new-articles > li:nth-child(3) > .newarticles_published").text(articleTime3);
				$(".new-articles > li:nth-child(3) > .newarticles_cta > a").attr("href", articleLink3);

				$(".new-articles > li:nth-child(4) > .newarticles_title").text(articleTitle4);
				$(".new-articles > li:nth-child(4) > .newarticles_published").text(articleTime4);
				$(".new-articles > li:nth-child(4) > .newarticles_cta > a").attr("href", articleLink4);

				$(".new-articles > li:nth-child(5) > .newarticles_title").text(articleTitle5);
				$(".new-articles > li:nth-child(5) > .newarticles_published").text(articleTime5);
				$(".new-articles > li:nth-child(5) > .newarticles_cta > a").attr("href", articleLink5);
			}
		}
	})
});

$(document).ready(function() {
	var navUserFunctions = document.getElementById('my-support-logout');
	var navUserSignIn = document.getElementById('my-support-login');

	if (HelpCenter.user.role === 'anonymous') {
		navUserFunctions.style.cssText = "display: none;";
		navUserSignIn.style.cssText = "display: inline-block;";
		console.log('user not logged in');
	} else if (HelpCenter.user.role !== 'anonymous') {
		navUserFunctions.style.cssText = "display: inline-block;";
		navUserSignIn.style.cssText = "display: none;";
		console.log('user is active');
	}
});

$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: 'https://365retailmarkets.zendesk.com/api/v2/help_center/en-us/categories/360002185954/articles.json',
		dataType: 'json',
		async: true,
		success: function(notes) {
			{
				const notifyBlock = document.getElementsByClassName('release_notes_notify')[0];

				currentTime = new Date();
				currentDay = currentTime.getDate();
				currentMonth = currentTime.getMonth() + 1; //Add one to month because January starts at zero
				currentYear = currentTime.getFullYear();

				notesYear = parseInt(notes.articles[0].updated_at.substring(0, 4));
				notesMonth = parseInt(notes.articles[0].updated_at.substring(5, 7));
				notesDay = parseInt(notes.articles[0].updated_at.substring(8, 10));

				if(currentYear === notesYear && currentMonth === notesMonth && currentDay - notesDay < 7) {
					notifyBlock.classList.remove('no_notes');
					notifyBlock.classList.add('new_notes');
				} else {
					notifyBlock.classList.add('no_notes');
					notifyBlock.classList.remove('new_notes');
				}
			}
		}
	})
});

$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: 'https://365retailmarkets.zendesk.com/api/v2/help_center/en-us/categories/360001964953/articles.json',
		dataType: 'json',
		async: true,
		success: function(requested) {

			for (var i = 0; i < requested.articles.length; i++) {

				if (requested.articles[i].id != '360037144093') {
					requested.articles.splice(i, 1);
					messageBody = requested.articles[0].title;

					$(".hc-header > #alert_container").html(messageBody);

				}
			}
		}
	})
});
