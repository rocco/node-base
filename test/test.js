/*global describe, before, it*/
'use strict';
var request = require('supertest');
/*jshint ignore:start*/
var should  = require('should');
/*jshint ignore:end*/

/* set env before loading the server */
process.env.NODE_ENV = 'testing';

/* load our server */
var server = require('../server.js');

describe('node-base', function () {

	before(function (done) {

		// do stuff before testing here

		done();
	});

	it('GET /', function (done) {

		request(server)
			.get('/')
			.end(function (err, res) {
				res.statusCode.should.equal(200);
				res.text.should.include('<h1>Not Authenticated</h1>');
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
