/* everyauth config */
module.exports = function (everyauth, config, mongoose) {
	'use strict';

	// load needed models from mongoose
	var UserModel = mongoose.model('UserModel');

	// this is used by every single everyauth module
	everyauth
		.everymodule
			.findUserById(function (userId, callBack) {

				// we query by mongodb's unique object ID here,
				// since this object ID is what goes into the session by everyauth
				// this works universally for all authentication modules

				// now query that thing from UserModel and pass it to the callBack function
				UserModel.findOne({_id: userId}, function (errObj, userObj) {

					// call a method attached to the schema like this:
					userObj.dumpName('everyauth.everymodule.findUserById() loaded a userObj with name = ');

					// pass userObj to callBack function if given
					if (typeof callBack === 'function') {
						callBack(errObj, userObj);
					}
				});
			});


	/* local username / password form */
	everyauth
		.password

			// for all everyauth options see node_modules/everyauth/README.md
			// use loginWith only when you want/need everyauth's email or phone validation routine
			// .loginWith('email')

			// GET login form here
			.getLoginPath('/login')
			// use this view template on login page
			.loginView('login.jade')

			// POST login data here
			.postLoginPath('/login')

			// everyauth's loginLocals can pass vars to view locals in various ways (see docs)
			// .loginLocals({ someField: 'some value' })

			// form data is POSTed and passed to this function
			.authenticate(function (login, password) {
				console.log('authenticating, data given: login =', login, ', password =', password);
				var errors = [];
				if (!login) {
					errors.push('User Name missing');
				}
				if (!password) {
					errors.push('Password missing');
				}
				if (errors.length > 0) {
					return errors;
				}

				// load user from DB using login value
				var userData = {};
				if (login === 'someone') {
					userData = {
						name: 'someone',
						password: 'password'
					};
				}

				// check user data from DB against inputs
				if (typeof userData.password === 'undefined' || userData.password !== password) {
					errors.push('Username or password error');
				}

				if (errors.length > 0) {
					return errors;
				}

				// no errors here means user could be retrieved
				return userData;
			})

			// after a successful login go here
			.loginSuccessRedirect('/')

			// register new user view
			.getRegisterPath('/register')
			// register new user view uses this template
			.registerView('register.jade')

			// form of register view is posted here
			.postRegisterPath('/register')

			// again, this can pass vars to the view
			.registerLocals({ title: 'Register' })

			// registration sends in newUserAttrs which will be validated here
			.validateRegistration(function (newUserAttrs, errors) {
				var login = newUserAttrs.login;

				// check if username already exists in DB
				if (login === 'exists') {
					errors.push('Login already taken');
				}
				return errors;
			})

			// a new user is finally actually added using data in newUserAttrs
			.registerUser(function (newUserAttrs) {
				var login = newUserAttrs[this.loginKey()],
					newUser = newUserAttrs;

				console.log('adding a new user:', login, newUser);

				// add newUser to DB
				newUser.id = 1; // increment from DB ?

				// create a new user object
/*
				var newUser = new UserModel({
					name: fbUserMetadata.name,
					firstname: fbUserMetadata.first_name,
					lastname: fbUserMetadata.last_name,
					email: fbUserMetadata.email,
					username: fbUserMetadata.username,
					gender: fbUserMetadata.gender,
					facebook_id: fbUserMetadata.id,
					facebook: fbUserMetadata
				});

				// try to save user object to db
				newUser.save(function (err, newuser) {
					// error - return promise early
					if (err) {
						return promise.fulfill([err]);
					}

					// success - fulfill promise with new user
					promise.fulfill(newuser);
				});
*/

				return newUser;
			})

			// after successfulLY login go here
			.registerSuccessRedirect('/');





	/* facebook */
	everyauth
		.facebook
			.appId(config.everyauth.facebook.appId)
			.appSecret(config.everyauth.facebook.appSecret)
			.findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
				// set up return promise
				var promise = this.Promise();

				// try to find user in DB using their fb data
				UserModel.findOne({facebook_id: fbUserMetadata.id}, function (err, dbUser) {

					// return promise early if there is an error
					if (err) {
						return promise.fulfill([err]);
					}

					// we found a user in db
					if (dbUser) {

						// fulfill promise with user data
						promise.fulfill(dbUser);

					} else {

						// create a new user object
						var newUser = new UserModel({
							name: fbUserMetadata.name,
							firstname: fbUserMetadata.first_name,
							lastname: fbUserMetadata.last_name,
							email: fbUserMetadata.email,
							username: fbUserMetadata.username,
							gender: fbUserMetadata.gender,
							facebook_id: fbUserMetadata.id,
							facebook: fbUserMetadata
						});

						// try to save user object to db
						newUser.save(function (err, newuser) {
							// error - return promise early
							if (err) {
								return promise.fulfill([err]);
							}

							// success - fulfill promise with new user
							promise.fulfill(newuser);
						});
					}

				});

				// return promise
				return promise;
			})
			.redirectPath('/');


	/* twitter */
	everyauth
		.twitter
			.consumerKey(config.everyauth.twitter.consumerKey)
			.consumerSecret(config.everyauth.twitter.consumerSecret)
			.findOrCreateUser(function (sess, accessToken, accessSecret, twitUser) {

				// set up return promise
				var promise = this.Promise();

				// try to find user in DB using their fb data
				UserModel.findOne({twitter_id: twitUser.id}, function (err, dbUser) {

					// return promise early if there is an error
					if (err) {
						return promise.fulfill([err]);
					}

					// we found a user in db
					if (dbUser) {

						// fulfill promise with user data
						promise.fulfill(dbUser);

					} else {

						// create a new user object
						var newUser = new UserModel({
							name: twitUser.name,
							email: '', // no email from twitter :/ https://dev.twitter.com/discussions/4019
							username: twitUser.screen_name,
							twitter_id: twitUser.id,
							twitter: twitUser
						});

						// try to save user object to db
						newUser.save(function (err, newuser) {
							// error - return promise early
							if (err) {
								return promise.fulfill([err]);
							}

							// success - fulfill promise with new user
							promise.fulfill(newuser);
						});
					}

				});

				// return promise
				return promise;
			})
			.redirectPath('/');

};
