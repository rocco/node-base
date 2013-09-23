/* load all dependencies */
var config     = require('./config'), // loads ./config/index.js
	everyauth  = require('everyauth'),
	express    = require('express'),
	mongostore = require('connect-mongo')(express),
	mongoose   = require('mongoose');


/* connect mongodb */
require('./config/mongoose.js')(mongoose, config);

/* load models */
// to stay consistent and to match mongoose.model('SomethingModel')
// ./models/user should be assigned to UserModel,
// ./models/something to SomethingModel etc.
require('./models/user')(mongoose);


/* everyauth setup */
require('./config/everyauth.js')(everyauth, config, mongoose);


/* express app setup */
var app = express();

/* global app config */
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
		.use(express.cookieParser('some cookie secret'))
		// persistent sessions - these go to the existing db connection
		.use(express.session({
				secret: 'some session secret',
				/* sessions should be auto-cleaned from mongodb after they expire - one day here */
				maxAge: new Date(Date.now() + (1 * 24 * 60 * 60)),
				store: new mongostore(
					/* existig db connection is used */
					{
						db: mongoose.connection.db
					},
					function (err) {
						console.log('connect-mongo setup error: ', err);
					}
				)
		}))
		// CSRF protection - use a hidden form input named "_csrf"
		.use(express.csrf())
		// this needs to go after the session stuff
		.use(everyauth.middleware())
		// a simple custom middleware
		.use(function (req, res, next) {
			// usually you do stuff here with req data and put it to res
			res.locals.userId = req.session && req.session.auth && req.session.auth.userId;
			console.log('custom middleware reached', res.locals.userId);

			next();
		});
		// note: no .use(app.router) here due to everyauth
});

/* development app config */
app.configure('development', function () {

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

	// no everyauth debug output
	everyauth.debug = false;

	// quiet express error handler
	app.use(express.errorHandler()); 
});


/* express routes and "controllers" */

// note the () after the require()
// this is needed due to the module returning a function object that return the actual function
// in thecase if index thisseems bloated but it's better to do this consistently across all controllers
app.get('/',    require('./controllers/index')());

// /app need the mongoose object, so we pass it into the function call
app.get('/app', require('./controllers/app')(mongoose));


/* start listening */
var appPort = process.env.PORT || 3001;
app.listen(appPort);

console.log('server on http://localhost.com:' + appPort + ' started running in ' + process.env.NODE_ENV + ' mode');
