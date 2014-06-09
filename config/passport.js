/* passport config */
module.exports = function (passport, config, UserModel) {
	'use strict';

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

	passport.use(
		new TwitterStrategy(
			{
				consumerKey: config.auth.twitter.consumerKey,
				consumerSecret: config.auth.twitter.consumerSecret,
				callbackURL: 'http://localhost.com:3001/auth/twitter/callback'
			},
			function (req, accessToken, tokenSecret, profile, done) {
				// there's already a user loaded
				if (req.user) {
					// check if a user can be found that has this Twitter ID
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
								UserModel.findById(req.user.id, function (err, ExistingUser) {
									ExistingUser.twitter_id = profile.id;
									ExistingUser.twitter = profile;
									ExistingUser.name = profile.displayName;
									ExistingUser.save(function (err) {
										console.log('Twitter account has been linked to currently logged in user');
										done(err, ExistingUser);
									});
								});
							}
						});
				} else {
					// no user is currently logged in
					UserModel.findOne(
						{
							twitter_id: profile.id
						},
						function (err, existingUser) {
							if (existingUser) {
								return done(null, existingUser);
							}
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
		)
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID:     config.auth.facebook.appId,
				clientSecret: config.auth.facebook.appSecret,
				callbackURL: 'http://localhost.com:3001/auth/facebook/callback'
			},
			function (req, accessToken, refreshToken, profile, done) {
				// there's already a user loaded
				if (req.user) {
					// check if a user can be found that has this Facebook ID
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
								UserModel.findById(req.user.id, function (err, ExistingUser) {
									ExistingUser.facebook_id = profile.id;
									ExistingUser.facebook = profile;
									ExistingUser.name = profile.displayName;
									ExistingUser.save(function (err) {
										console.log('Facebook account has been linked to currently logged in user');
										done(err, ExistingUser);
									});
								});
							}
						});
				} else {
					// no user is currently logged in
					UserModel.findOne(
						{
							facebook_id: profile.id
						},
						function (err, existingUser) {
							if (existingUser) {
								return done(null, existingUser);
							}
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
		)
	);

	return {
		isAuth: function (req, res, next) {
			return req.isAuthenticated() ? next() : res.redirect('/');
		}
	};
};
