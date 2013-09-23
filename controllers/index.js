/*
 * index controller
 */
module.exports = function () {

	// we return the actual routing function
	return function (req, res) {

		// everyauth data is in res.locals.everyauth

		// if logged in go to /app otherwise render index
		if (res.locals.everyauth.loggedIn === true) {
			res.redirect('/app');
		} else {
			// not logged in - go home
			res.render('index');
		}

	};

};
