/* mongoose config */
module.exports = function (mongoose, config) {

	// mongoose event handlers
	mongoose.connection.on('error', function (err) {
		console.log('mongoose error: ', err);
	});

	// connect mongodb as defined in config
	mongoose.connect(config.mongodb.server, function (err) {
		if (err) {
			console.log('could not connect to MongoDB at ' + config.mongodb.server);
			throw err;
		}
		// that worked
		console.log('connected to MongoDB at ' + config.mongodb.server);
	});

	// complete db object is now accessible via mongoose.connection.db
};