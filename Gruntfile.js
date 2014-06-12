'use strict';

module.exports = function (grunt) {
	// grunt config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: ['Gruntfile.js', 'server.js', 'config/*.js', 'controllers/*.js', 'models/*.js', 'test/*.js']
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['./test/*.js']
			}
		}
	});

	// load npm tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');

	// regster our own tasks
	grunt.registerTask('hint', ['jshint']);
	grunt.registerTask('test', ['mochaTest']);
	grunt.registerTask('default', ['jshint', 'mochaTest']);

};
