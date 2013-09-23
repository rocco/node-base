/* main config file */
module.exports = {

	// mongodb config
	mongodb: {
		server: 'mongodb://127.0.0.1/node-base'
	},

	// everyauth config
	everyauth: {
		// facebook
		facebook: {
			appId:     '330598913753196', // app called "Node-Base Login"
			appSecret: '1cf5d7f2119acbf75ea291442a07fd13'
		},
		// twitter
		// make sure you set the "Callback URL" of your app 
		// on dev.twitter.com to http://localhost.com:3001/auth/twitter/callback
		// and enable "Sign in with Twitter" for the app too
		twitter: {
			consumerKey:    '5ar7hcDt5v8pgMjiuiTVsA', // app called "Node-Base Login"
			consumerSecret: '70rVXDLHD7QsVq281Xp2BOeguRW1tMuegCEuZ8YRQ'
		}
	}

};
