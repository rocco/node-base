var request = require('supertest');
var should = require('should');

/* ser env before loading the server */
process.env.NODE_ENV = 'test';

/* load our server */
var server = require('../server.js');

describe('node-base', function () {
	'use strict';

	before(function (done) {

		// do stuff before testing here

		done();
	});

	it('GET /', function (done) {

		request(server)
			.get('/')
			.end(function (err, res) {
				res.statusCode.should.equal(200);
				res.text.should.include('<h2>Not Authenticated</h2>');


				done();
			});
	});

	it('GET /app and redirect', function (done) {

		request(server)
			.get('/app')
			.end(function (err, res) {
				// no session -> redirected to /
				res.statusCode.should.equal(302);
				done();
			});
	});

});
