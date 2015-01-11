'use strict';

/* passport config */
module.exports = function (passport, config, UserModel) {

	var TwitterStrategy = require('passport-twitter').Strategy;
	var FacebookStrategy = require('passport-facebook').Strategy;

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		UserModel.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// set up Twitter strategy
	passport.use(new TwitterStrategy(
		{
			consumerKey: config.auth.twitter.consumerKey,
			consumerSecret: config.auth.twitter.consumerSecret,
			callbackURL: 'http://localhost.com:3001/auth/twitter/callback'
		},
		function (req, accessToken, tokenSecret, profile, done) {
			// there's already a user logged in
			if (req.user) {
				// check if a user can be found that has the Twitter ID of the currently logged in user
				UserModel.findOne(
					{
						twitter_id: profile.id
					},
					function (err, existingUser) {
						// did we find a user with this Twitter ID?
						if (existingUser) {
							console.error('Twitter account is already connected to another user!');
							done(err);
						} else {
							// load currently logged-in user from DB and add Twitter Data to account
							UserModel.findById(req.user.id, function (err, loggedInUser) {
								loggedInUser.twitter_id = profile.id;
								loggedInUser.twitter = profile;
								loggedInUser.name = profile.displayName;
								loggedInUser.save(function (err) {
									console.log('Twitter account has been linked to the currently logged in user');
									done(err, loggedInUser);
								});
							});
						}
					});
			} else {
				// no user is currently logged in, check if there is a matching user in DB with this Twitter ID
				UserModel.findOne(
					{
						twitter_id: profile.id
					},
					function (err, existingUser) {
						if (existingUser) {
							// user with this Twitter ID already exists - use it
							return done(null, existingUser);
						}
						// create a new user and save it to DB
						var newUser = new UserModel();
						newUser.email = '';
						newUser.twitter_id = profile.id;
						newUser.twitter = profile;
						newUser.name = profile.displayName;
						newUser.save(function (err) {
							done(err, newUser);
						});
					}
				);
			}
		}
	));

	// set up Facebook strategy
	passport.use(new FacebookStrategy(
		{
			clientID:     config.auth.facebook.appId,
			clientSecret: config.auth.facebook.appSecret,
			callbackURL: 'http://localhost.com:3001/auth/facebook/callback'
		},
		function (req, accessToken, refreshToken, profile, done) {
			// there's already a user logged in
			if (req.user) {
				// check if a user can be found that has the Facebook ID of the logged in user
				UserModel.findOne(
					{
						facebook_id: profile.id
					},
					function (err, existingUser) {
						// did we find a user with this Facebook ID?
						if (existingUser) {
							console.error('Facebook account is already connected to another user!');
							done(err);
						} else {
							// load currently logged-in user from DB and add Facebook Data to account
							UserModel.findById(req.user.id, function (err, loggedInUser) {
								loggedInUser.facebook_id = profile.id;
								loggedInUser.facebook = profile;
								loggedInUser.name = profile.displayName;
								loggedInUser.save(function (err) {
									console.log('Facebook account has been linked to the currently logged in user');
									done(err, loggedInUser);
								});
							});
						}
					});
			} else {
				// no user is currently logged in, check if there is a matching user in DB with this Facebook ID
				UserModel.findOne(
					{
						facebook_id: profile.id
					},
					function (err, existingUser) {
						if (existingUser) {
							// user with this Facebook ID already exists - use it
							return done(null, existingUser);
						}
						// create a new user and save it to DB
						var newUser = new UserModel();
						newUser.email = '';
						newUser.facebook_id = profile.id;
						newUser.facebook = profile;
						newUser.name = profile.displayName;
						newUser.save(function (err) {
							done(err, newUser);
						});
					}
				);
			}
		}
	));

	return {
		isAuth: function (req, res, next) {
			return req.isAuthenticated() ? next() : res.redirect('/');
		}
	};
};
