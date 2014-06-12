'use strict';

/* load all required modules first */
var // app env
	appPort        = process.env.PORT || 3001,
	appMode        = process.env.NODE_ENV || 'development',
	// app config
	config         = require('./config/index.js')(appMode),
	express        = require('express'),
	// use stylus or not if you don't want to
	// if not, just edit /public/css/styles.css
	stylus         = require('stylus'),
	passport       = require('passport'),
	// express / connect middleware
	morgan         = require('morgan'),
	compression    = require('compression'),
	serveFavicon   = require('serve-favicon'),
	serveStatic    = require('serve-static'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser   = require('cookie-parser'),
	session        = require('express-session'),
	csurf          = require('csurf'),
	errorHandler   = require('errorhandler'),
	// mongodb
	MongoStore     = require('connect-mongo')(session),
	mongoose       = require('mongoose');


/* make sure appMode (process.env.NODE_ENV) is set */
if (['development', 'testing', 'production'].indexOf(appMode) < 0) {
	console.log('appMode not set, make sure you set process.env.NODE_ENV! exiting early ... \n');
	// exit with a 'failure' code
	process.exit(1);
}


/* handle CTRL-C exits */
process.on('SIGINT', function () {
	console.log('\nnode-base exits ... bye\n');
	process.exit(0);
});


/* connect mongodb */
require('./config/mongoose.js')(mongoose, config);


/* load models */
// to stay consistent and to match mongoose.model('SomethingModel')
// ./models/user should be assigned to UserModel,
// ./models/something to SomethingModel etc.
var UserModel = require('./models/user.js')(mongoose);


/* passport setup */
var passportConfig = require('./config/passport.js')(passport, config, UserModel);


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

/* app config */
app
	.set('view engine', 'jade')
	// "./views" is the default, but still included for completeness
	.set('views', './views');

/* app.use() section - here we set all middlewares we want to use */
app
	// web server access logs for everything - move lower to exclude e.g. static files
	.use(morgan())
	// compresses responses with gzip/deflate
	.use(compression())
	// 
	.use(stylus.middleware({
		src: __dirname + '/public',
		compress: true
	}))
	// add your faviron here, no param == default express icon
	.use(serveFavicon(__dirname + '/public/favicon.ico'))
	// all our static assets go here - /public equals our document root
	.use(serveStatic(__dirname + '/public'))
	// handles urlencoded and json bodies in requests
	.use(bodyParser())
	// methodOverride allows use of HTTP verbs such as PUT or DELETE
	.use(methodOverride())
	// change secret here
	.use(cookieParser('some cookie secret here'))
	// persistent sessions - these go to our existing db connection
	.use(session({
		// session lifetime: one day
		maxAge: new Date(Date.now() + (1 * 24 * 60 * 60)),
		// session secret: set something else here!
		secret: 'some session secret here',
		// MongoStore stores our session to mongodb
		// stored sessions are cleaned using mongodb's mechanism (at the most once every minute)
		// see: https://npmjs.org/package/connect-mongo
		store: new MongoStore({
				// existig mongoose_connection is used instead of db: settings.db
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
	// passport init and session this needs to go after the express session setup
	.use(passport.initialize())
	.use(passport.session())
	// CSRF protection - use a hidden form input named "_csrf"
	// needs to go below session() and cookieParser(), 
	// cf. http://www.senchalabs.org/connect/csrf.html
	.use(csurf())
	// a sample custom middleware
	// this is used here to add the CSRF token and the logged-in user's ID to our views
	.use(function (req, res, next) {

			/* do stuff here with req data and put it to res, then call next() */

			// get the CSRF token and make it available in all views by attaching it to res.locals
			res.locals.csrftoken = req.csrfToken();

			// optionally add CSRF token to session cookie liek this
			//res.cookie('XSRF-TOKEN', res.locals.csrftoken);

			// make userId universally available in views
			res.locals.userId = req.isAuthenticated() ? req.user.id : null;

			if (typeof req.session.messages === 'undefined') {
				req.session.messages = {
					'a': 'some message'
				};
			}

			// TODO: auto-set session messages to controllers
			next();
		}
	);


/* special config sections for different environments */
// development app config
if (appMode === 'development') {

	// verbose express error handler
	app.use(errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
}

// production app config
if (appMode === 'production') {

	// quiet express error handler
	app.use(errorHandler());
}


/* express routes and "controllers" */

// note the "()" after the require()s
// this is needed due to the module returning a function object which again returns the actual function
// in the case of index this seems bloated but it's better to do this consistently across all controllers
// you might also strip the ".js" part from controller names, but I find files easier to spot this way

// no authentication on index page
app.get('/', require('./controllers/index.js')());

// log out (no authentication required)
app.get('/logout', require('./controllers/logout.js')());

// now routes that require authentication
// passportConfig.isAuth is called and either does a next() or redirects to "/"

// the app's main view - this should load the SPA
app.get('/app', passportConfig.isAuth, require('./controllers/app.js')());

// user view
// note that we pass in the mongoose object to this controller so we can instanciate a UserModel in there
app.get('/user', passportConfig.isAuth, require('./controllers/user.js')(mongoose));

// passport specific routes

// passport Twitter auth
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function (req, res) {
	res.redirect(req.session.returnTo || '/');
});

// passport Facebook auth
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
	res.redirect(req.session.returnTo || '/');
});


/* start listening */
app.listen(appPort);

/* you may open your browser now */
console.log('server on http://localhost.com:' + appPort + ' started running in ' + appMode + ' mode');

/* by exposing app like this we can require it in other places like tests */
module.exports = app;
