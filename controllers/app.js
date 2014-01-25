/*
 * app controller
 */
module.exports = function () {
	'use strict';

	//var UserModel = mongoose.model('UserModel');

	return function (req, res) {

		// if logged in pass user object to app view
		if (res.locals.everyauth.loggedIn === true) {

			// everyauth's middleware loads user data from the current session automatically
			// it executes a function returned by everyauth.everymodule.findUserById() 
			// cf. node_modules/everyauth/index.js:88
			// user data becomes available in req.user
			// findUserById() is specified in config/everyauth.js

			// make sure the user actually has an _id
			if (typeof req.user === 'undefined') {
				res.redirect('/logout');
				// we need to return here otherwise jade will try to render the app template and fail
				return;
			}

			// render app view and pass in user data
			res.render('app', {
				userData: req.user
			});

		} else {
			// not logged in - go home
			res.redirect('/');
			// we need to return here otherwise jade will try to render the app template and fail
			return;
		}
	};
};
