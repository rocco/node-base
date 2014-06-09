/* /user controller */
module.exports = function (mongoose) {
	'use strict';

	return function (req, res) {

		// mongoose is passed in here to show how
		// to do DB operations inside of controllers
		var UserModel = mongoose.model('UserModel');

		// note that we render the view or redirect in the callback of .findOne()
		// so this actually happend sequentially
		UserModel.findOne({_id: req.user.id}, function (err, user) {
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

	};
};
