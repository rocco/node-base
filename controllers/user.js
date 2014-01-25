/*
 * user controller
 */
module.exports = function (mongoose) {
	'use strict';

	// mongoose is passed in here to show how
	// to do DB operations inside of controllers
	var UserModel = mongoose.model('UserModel');

	return function (req, res) {

		// if logged in get user and render app view
		if (res.locals.everyauth.loggedIn === true) {

			// note that we render the view or redirect in the callback of .findOne()
			// so this actually happend sequentially
			UserModel.findOne({_id: res.locals.everyauth.userId}, function (err, user) {
				if (err) {
					console.log('error retrieving loggedin user from db - logging out');
					// logout to clear session - it's an everyauth provided route
					res.redirect('/logout');
				} else {
					// render app and pass in user data
					res.render('user', {
						userData: user
					});
				}
			});

		} else {
			// not logged in - go home
			res.redirect('/');
		}

	};
};
