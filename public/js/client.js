// silly animation on all h3s to show this file has been loaded
$(function () {
	$('h3').on('mouseover', function () {
		$(this).animate({
				"margin-left": "200px"
			},
			function () {
				$(this).animate({
					"margin-left": "0px"
				});
			}
		)
	})
});
