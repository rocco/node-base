/* everyauth config */
module.exports = function (everyauth, config, mongoose) {

	// load needed models from mongoose
	var UserModel = mongoose.model('UserModel');

	// this is used by every single everyauth module
	everyauth.everymodule
		.findUserById(function (userId, callback) {
			// we query by mongodb's unique object ID here, 
			// since object ID is what goes into the session by everyauth
			// this works universally for all authentication modules
			var objectIdType = mongoose.Types.ObjectId,
			queryObjectId = new objectIdType(userId);

			// now query that thing from UserModel and pass it to the callbackfunction
			UserModel.findOne({_id: queryObjectId}, function (err, user) {

				// call a method attached to the schema like this:
				user.dumpName('Everyauth just loaded a user with name = ');

				// pass found user to callback function
				callback(user, err);
			});
		});

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
							email: "", // no email from twitter :/ https://dev.twitter.com/discussions/4019
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
