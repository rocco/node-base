var request = require('supertest');
var should = require('should');

var app = require('../server.js');

describe('node-base', function () {
	'use strict';

	it('show some text on index', function (done) {
		request(app)
			.get('/')
			.end(function (err, res) {
				res.statusCode.should.equal(200);
				res.text.should.include('<h2>Not Authenticated</h2>');
				done();
			});
	});

	it('redirect app to index if not logged in', function (done) {
		request(app)
			.get('/app')
			.end(function (err, res) {
				// no session -> redirected to /
				res.statusCode.should.equal(302);
				done();
			});
	});

});
