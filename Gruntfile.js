module.exports = function(grunt) {
	'use strict';

	// grunt config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			jshintrc: '.jshintrc',
			files: ['Gruntfile.js', 'server.js', 'config/everyauth.js', 'config/index.js', 'config/mongoose.js', 'test/*.js']
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/*.js']
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
