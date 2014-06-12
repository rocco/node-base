'use strict';

/* base config */
module.exports = function (env) {

	// default config = production
	var appConfig = {

		// mongodb config
		'mongodb': {
			'server': 'mongodb://127.0.0.1/node-base-prod'
		},

		// auth provider config
		'auth': {
			// facebook
			'facebook': {
				'appId':     '330598913753196', // app called "Node-Base Login"
				'appSecret': '1cf5d7f2119acbf75ea291442a07fd13'
			},
			// twitter
			// make sure you set the "Callback URL" of your app 
			// on dev.twitter.com to http://localhost.com:3001/auth/twitter/callback
			// and enable "Sign in with Twitter" for the app too
			'twitter': {
				'consumerKey':    '5ar7hcDt5v8pgMjiuiTVsA', // app called "Node-Base Login"
				'consumerSecret': '70rVXDLHD7QsVq281Xp2BOeguRW1tMuegCEuZ8YRQ'
			}
		}
	};

	// override config values depending on environment
	switch (env) {
		case 'development':
			appConfig.mongodb.server = 'mongodb://127.0.0.1/node-base';
		break;
		case 'testing':
			appConfig.mongodb.server = 'mongodb://127.0.0.1/node-base-testing';
		break;
	}

	return appConfig;
};
