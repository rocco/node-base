node-base
=========

[![Build Status](https://travis-ci.org/rocco/node-base.png?branch=master)](https://travis-ci.org/rocco/node-base)

This is an example node.js app using:

- "express" (duh) with jade templates (easily changeable)
- "everyauth" for various authentication possibilities (we cover facebook and twitter)
- "mongoose" for mongodb connectivity
- "connect-mongo" for persistent sessions

The project also tries to include a complete setup including things like:

- environment differences (development, testing, production)
- jshint setup (but its setup really depends on your preferences)
- mocha tests using supertest (which is based on super-agent)
- grunt for running jshint, tests etc.
- travis-ci setup (see the build status image above)

### Features

- extensive inline documentation trying to make clear whats going on
- clean and simple structure with config, controllers, models and views
- username/password, facebook and twitter authentication through everyauth
- users are stored in mongodb
- persistent sessions in mongodb (you're still logged in after server reboots)
- express config examples for development and production modes
- express access logger (just like regular web server logs)
- CSRF protection, see express API docs and https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
- custom middleware example
- loading of static assets
- custom favicon

### Getting started

If you want to use my existing node-base-apps on facebook and twitter to login using their OAuth mechanism, 
please make sure you serve the app through your localhost accessible via localhost.com!

**You need to make an /etc/hosts entry for localhost.com like this**:

    127.0.0.1    localhost    local.host    localhost.com

#### Other necessary steps

- do a "npm update" within this directory to load dependencies to ./node_modules/
- add hosts entry: localhost.com (then you can use the provided oauth keys)
- make sure mongodb is running on 127.0.0.1 (change in config/index.js): run `mongod &` to start the daemon
- maybe set NODE_ENV environment var, see server.js source (falls back to "development")
- start the node-base app with `node server.js`
	- even better install nodemon: `npm install -g nodemon`, then run `nodemon server.js`
- navigate to http://localhost.com:3001 (or whatever your localhost points to)


### Inspired by and hacked together using

- http://nodejs.org/api/
- http://expressjs.com/api.html
- http://jade-lang.com/reference/
- http://www.hacksparrow.com/running-express-js-in-production-mode.html
- http://vimeo.com/56166857
- https://github.com/bnoguchi/everyauth/tree/master/example
- https://github.com/ThomasHambach/node-express-everyauth-facebook-example
- http://stackoverflow.com/questions/14414225/access-session-object-in-express-middleware
- http://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application
- http://stackoverflow.com/questions/14414225/access-session-object-in-express-middleware

MIT License (see LICENSE file)
