/* all our dependencies */
var conf       = require('./conf'),
	everyauth  = require('everyauth'),
	express    = require('express'),
	mongostore = require('connect-mongo')(express),
	mongoose   = require('mongoose');

/* connect mongodb */
mongoose.connect('mongodb://127.0.0.1/node-base');
require('./models/user');
var UserModel = mongoose.model('UserModel');

/* everyauth setup */
everyauth.debug = false;

everyauth.everymodule
	.findUserById(function (userId, callback) {
		// we query by mongodb's unique object ID here 
		// since object ID is what goes into the session by everyauth
		// this works universally for all types of authentication
		var objectIdType = mongoose.Types.ObjectId,
		queryObjectId = new objectIdType(userId);

		// now query that thing
		UserModel.findOne({_id: queryObjectId}, function (err, user) {
			callback(user, err);
		});
	});

everyauth
	.facebook
		.appId(conf.fb.appId)
		.appSecret(conf.fb.appSecret)
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
		.consumerKey(conf.twit.consumerKey)
		.consumerSecret(conf.twit.consumerSecret)
		.findOrCreateUser(function (sess, accessToken, accessSecret, twitUser) {
			return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));
		})
		.redirectPath('/');


/* express setup */
var app = express();

/* configure app */
app.configure(function () {
	/* set stuff */
	app
		.set('view engine', 'jade')
		/* ./views is the default, but still included for completeness */
		.set('views', './views');
	/* use stuff */
	app
		.use(express.favicon())
		/* our static assets go here */
		.use(express.static(__dirname + 'public'))
		.use(express.bodyParser())
		.use(express.methodOverride())
		/* change secrethere */
		.use(express.cookieParser('some secret'))
		/* persistent sessions - these go to the same db connection */
		.use(express.session({
				secret: 'another secret',
				/* sessions should be auto-cleaned from mongodb after they expire - one day here */
				maxAge: new Date(Date.now() + (1 * 24 * 60 * 60)),
				store: new mongostore(
					/* existig db connection is used */
					{
						db: mongoose.connection.db
					},
					function(err){
						console.log(err || 'connect-mongodb setup ok');
					}
				)
		}))
		/* this needs to go after the session stuff */
		.use(everyauth.middleware())
		/* make user data available */
		.use(function(req, res, next){
			res.locals.userData = req.session.user;
			next();
		});
});

/* express controllers and routes */
app.get('/', function (req, res) {

	/* everyauth is in res.locals.everyauth */

	// if logged in go to /app
	if (res.locals.everyauth.loggedIn === true) {
		res.redirect('/app');
	} else {
		res.render('index');
	}
});

app.get('/app', function (req, res) {

	/* everyauth is in res.locals.everyauth */

	// if not logged in go home
	if (res.locals.everyauth.loggedIn === true) {
		// get user data - cf .findUserById above
		var objectIdType  = mongoose.Types.ObjectId,
			queryObjectId = new objectIdType(res.locals.everyauth.userId);

		UserModel.findOne({_id: queryObjectId}, function (err, user) {
			if (err) {
				console.log('error retrieving loggedin user from db - logging out');
				// logout to clear session
				res.redirect('/logout');
			} else {
				res.render('app', {userData: user});
			}
		});
	} else {
		// not logged in
		res.redirect('/');
	}
});


/* start listening */
app.listen(3001);
console.log('Go to http://whatever.local:3001');
