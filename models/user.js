var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schema
 */
var UserSchema = Schema({
    name: String,
    firstname: String,
    lastname: String,
    email: String,
    username: String,
    facebook_id: String,
    facebook: {}
    /*,
    twitter_id: String,
    twitter: {}
    */
});

mongoose.model('UserModel', UserSchema);