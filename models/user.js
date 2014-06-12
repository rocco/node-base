'use strict';

/* user model */
module.exports = function (mongoose) {

	var UserSchema = new mongoose.Schema({
		name: String,
		firstname: String,
		lastname: String,
		email: String,
		username: String,
		facebook_id: String,
		facebook: {},
		twitter_id: String,
		twitter: {}
		// add more auth provider specific properties here
	});

	// add methods to the schema here if needed
	UserSchema.methods.dumpName = function (preText) {
		console.log(preText + this.name);
	};

	// register the model UserModel to mongoose using the UserSchema schema
	mongoose.model('UserModel', UserSchema);

	// return the model
	return mongoose.model('UserModel');
};
