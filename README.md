node-base
=========

This is a basic node.js app using

- "express" (duh) with jade templates (easily changeable)
- "everyauth" for various authentication possibilities (we cover facebook and twitter)
- "mongoose" for mongodb connectivity
- "connect-mongo" for persistent sessions

Features:

- extensive inline documentation trying to make clear whats going on
- clean and simple structure with config, controllers, models and views
- facebook and twitter authentication through everyauth
- users are stored in mongodb
- persistent sessions in mongodb (you're still logged in after server reboots)
- express config examples for development and production modes
- express access logger (just like regular web server logs)
- CSRF protection, see express API docs and https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
- custom middleware example
- loading of static assets
- custom favicon

Getting started:

- do a "npm update" within this directory to load dependencies to ./node_modules/
- add hosts entry: localhost.com (then you can use the provided oauth keys)
- make sure mongodb is running on 127.0.0.1 (or change in config/index.js), run "mongod" to start the daemon
- maybe set NODE_ENV environment var, see server.js source
- start the node-base app with "node server.js"
- navigate to http://localhost.com:3001 (or whatever your localhost points to)

Inspired by and hacked together using:

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
