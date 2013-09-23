/*
 * app controller
 */
module.exports = function (mongoose) {

	var UserModel = mongoose.model('UserModel');

	return function (req, res) {

		// if logged in get user and render app view
		if (res.locals.everyauth.loggedIn === true) {
			// get user data - cf .findUserById in config/everyauth.js
			var objectIdType  = mongoose.Types.ObjectId,
				queryObjectId = new objectIdType(res.locals.everyauth.userId);

			// note that we render the view or redirect in the callback of .findOne()
			// so this actually happend sequentially
			UserModel.findOne({_id: queryObjectId}, function (err, user) {
				if (err) {
					console.log('error retrieving loggedin user from db - logging out');
					// logout to clear session - it's an everyauth provided route
					res.redirect('/logout');
				} else {

					// render app and pass in user data
					res.render('app', {
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
