/* mongoose config */
module.exports = function (mongoose, config, env) {

	// mongoose event handlers
	mongoose.connection.on('error', function (err) {
		console.log('mongoose error: ', err);
	});

	// connect mongodb as defined in config
	mongoose.connect(config.mongodb[env].server, function (err) {
		if (err) {
			console.log('could not connect to MongoDB at ' + config.mongodb[env].server);
			throw err;
		}
		// that worked
		console.log('connected to MongoDB at ' + config.mongodb[env].server);
	});

};
