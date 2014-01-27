/* load all dependencies */
var config     = require('./config/index.js'), // loads ./config/index.js
	everyauth  = require('everyauth'),
	express    = require('express'),
	MongoStore = require('connect-mongo')(express),
	mongoose   = require('mongoose'),
	appPort    = process.env.PORT || 3001,
	appMode    = process.env.NODE_ENV || 'development';

/* make sure appMode (process.env.NODE_ENV) is set */
if (['development', 'testing', 'production'].indexOf(appMode) < 0) {
	console.log('appMode not set, make sure you set process.env.NODE_ENV! exiting early ... \n');
	// exit with a 'failure' code
	process.exit(1);
}

/* handle CTRL-C exits */
process.on('SIGINT', function () {
	'use strict';

	console.log('\nnode-base exist ... bye\n');
	process.exit(0);
});

/* load models */
// to stay consistent and to match mongoose.model('SomethingModel')
// ./models/user should be assigned to UserModel,
// ./models/something to SomethingModel etc.
require('./models/user.js')(mongoose);

/* connect mongodb */
require('./config/mongoose.js')(mongoose, config, appMode);

/* everyauth setup */
require('./config/everyauth.js')(everyauth, config, mongoose);


/* express app setup */
var app = express();

/* the global app config */
/* 
node environment reminder: 
--------------------------
set environment variable NODE_ENV to "production" or "development" 
or whatever you like (on console):
$ export NODE_ENV=production

check current value (on console):
$ echo $NODE_ENV

run app with temporary change: 
$ NODE_ENV=testing node server.js

from within app check via: process.env.NODE_ENV what the current value is
*/
app.configure(function () {
	'use strict';

	/* set app config */
	app.set('view engine', 'jade')
		// "./views" is the default, but still included for completeness
		.set('views', './views');

	/* use stuff within application */
	app
		// web server access logs for everything - move lower to exclude e.g. static files
		.use(express.logger())
		// compresses responses with gzip/deflate
		.use(express.compress())
		// add your faviron here, no param == default express icon
		.use(express.favicon(__dirname + '/public/favicon.ico'))
		// all our static assets go here - /public equals our document root
		.use(express.static(__dirname + '/public'))
		.use(express.methodOverride())
		// support JSON, urlencoded, and multipart requests - see express api docs
		.use(express.bodyParser())
		// change secret here
		.use(express.cookieParser('some cookie secret here'))
		// persistent sessions - these go to the existing db connection
		.use(express.session({
			secret: 'some session secret here',
			// session lifetime: one day
			maxAge: new Date(Date.now() + (1 * 24 * 60 * 60)),
			// MongoStore stores our session to mongodb
			// stored sessions are cleaned using mongodb's mechanism (at the most once every minute)
			// see: https://npmjs.org/package/connect-mongo
			store: new MongoStore({
					// existig db connection is used
					mongoose_connection: mongoose.connection
				},
				function (/* dbObj */) {
					// this is executed after theMongoStore connects
					// useful for testing
					// the db connection object is passed in
				}
			)
			}
		))
		// CSRF protection - use a hidden form input named "_csrf"
		// needs to go below session() and cookieParser(), 
		// cf. http://www.senchalabs.org/connect/csrf.html
		.use(express.csrf())
		// a simple custom middleware
		// this is used here to add the CSRF token to our views
		.use(function (req, res, next) {

				/* do stuff here with req data and put it to res, then call next() */

				// get the CSRF token and make it available in all views by attaching it to res.locals
				res.locals.csrftoken = req.csrfToken();

				// optionally add CSRF token to session cookie liek this
				//res.cookie('XSRF-TOKEN', res.locals.csrftoken);

				// make userId universally available in views
				res.locals.userId = req.session && req.session.auth && req.session.auth.userId;

				next();
			}
		)
		// this needs to go after the session stuff
		.use(everyauth.middleware());
		// note: no .use(app.router) here due to everyauth
});

/* development app config */
app.configure('development', function () {
	'use strict';

	// turn everyauth debug on
	everyauth.debug = true;

	// verbose express error handler
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

/* production app config */
app.configure('production', function () {
	'use strict';

	// no everyauth debug output
	everyauth.debug = false;

	// quiet express error handler
	app.use(express.errorHandler());
});


/* express routes and "controllers" */

// note the () after the require()
// this is needed due to the module returning a function object that returns the actual function
// in the case of index this seems bloated but it's better to do this consistently across all controllers
app.get('/', require('./controllers/index')());

// app view
app.get('/app', require('./controllers/app')());

// user view
// note that we pass in ther mongoose object to this controller
app.get('/user', require('./controllers/user')(mongoose));


/* start listening */
app.listen(appPort);

console.log('server on http://localhost.com:' + appPort + ' started running in ' + appMode + ' mode');

/* by exposing app like this we can require it in other places like tests */
module.exports = app;
