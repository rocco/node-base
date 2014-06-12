'use strict';

/* mongoose config */
module.exports = function (mongoose, config) {

	// mongoose event handlers
	mongoose.connection.on('error', function (err) {
		console.log('mongoose error: ', err);
	});

	// connect mongodb as defined in config
	mongoose.connect(config.mongodb.server, function (err) {
		// in case of an error we exit the app
		if (err) {
			console.log('could not connect to MongoDB at ' + config.mongodb.server);
			process.exit(1);
			//throw err;
		}
		// that worked
		console.log('connected to MongoDB at ' + config.mongodb.server);
	});

};
