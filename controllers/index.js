'use strict';

/* /index route controller */
module.exports = function () {

	// we return the actual routing function
	return function (req, res) {

		if (req.session.messages.index) {
			// set session value to template vars
			res.locals.indexmessage = req.session.messages.index;
			// reset message
			req.session.messages = {};
		}
		

		// if authenticated (=== logged in) go to /app otherwise render index
		if (req.isAuthenticated()) {
			res.redirect('/app');
		} else {
			// not logged in - go home
			res.render('index');
		}

	};

};
