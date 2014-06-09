/* /app controller */
module.exports = function () {
	'use strict';

	return function (req, res) {

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
	};

};
