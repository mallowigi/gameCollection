'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
	port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// configurable paths
	var yeomanConfig = {
		app: 'app',
		dist: 'dist',
		tmp: 'tmp'
	};

	grunt.initConfig({
		yeoman: yeomanConfig,
		pkg: grunt.file.readJSON('package.json'),

		// Clean given directories/files
		clean: {
			dist: ['<%= yeoman.dist %>/*', '<%= yeoman.tmp %>'],
			server: '<%= yeoman.tmp %>'
		},

		//	    Handlebars precompilation
		handlebars: {
			options: {
				amd: true
			},
			compile: {
				files: {
					'<%= yeoman.dist %>/src/templates.js': ['<%= yeoman.app %>/templates/*.{html,hbs}']
				}
			}
		},

		// Underscore/EmbeddedJS compilation
		jst: {
			options: {
				amd: true
			},
			compile: {
				files: {
					'<%= yeoman.dist %>/src/templates.js': ['<%= yeoman.app %>/templates/*.{ejs}']
				}
			}
		},

		// Node Connect WebServer
		connect: {
			options: {
				port: 8080,
				// change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost',
				domain: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
			},
			// livereload task
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, yeomanConfig.app)
						];
					}
				}
			},
			// test task
			test: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, 'test'),
							mountFolder(connect, yeomanConfig.app)
						];
					}
				}
			},
			// release task
			dist: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, yeomanConfig.dist)
						];
					}
				}
			}
		},
		// Run the server
		open: {
			server: {
				path: '<%= connect.options.domain %>'
			}
		},

		// Run jshint on given files
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/src/{,*/}*.js',
				'!<%= yeoman.app %>/vendor/*',
				'test/spec/{,*/}*.js'
			]
		},
		// Run mocha on test files
		mocha: {
			all: {
				options: {
					run: true,
					urls: ['<%=connect.options.domain %>/index.html']
				}
			}
		},

		// compile less tasks
		less: {
			all: {
				src: ['<%= yeoman.app %>/styles/**/*.less'],
				dest: '<%= yeoman.app %>/styles/styles.css'
				// Compiles all less files to styles.css
				//				files: {
				//					'<%= yeoman.app %>/styles/styles.css': '<%= yeoman.app %>/styles/{,*/}*.less'
				//				}
			},
			dist: {
				options: {
					yuicompress: true
				}
			}
		},

		// Run r.js to optimize requirejs modules
		requirejs: {
			dist: {
				// Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
				options: {
					appDir: '<%= yeoman.app %>',
					baseUrl: './src',
					mainConfig: './src/main.js',
					dir: './<%= yeoman.dist %>',
					optimize: 'none',
					//   http://requirejs.org/docs/errors.html#sourcemapcomments
					preserveLicenseComments: false,
					useStrict: true,
					wrap: true
				}
			}
		},

		// Automatically install bower deps into require.config
		bower: {
			all: {
				rjsConfig: '<%= yeoman.app %>/src/main.js'
			}
		},
		// Replace some parts of index.html with the minified/concatened versions
		useminPrepare: {
			html: 'index.html',
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				dirs: ['<%= yeoman.dist %>']
			}
		},
		// Optimizes images
		imagemin: {
			// Dynamic handling: all images contained inside /assets/img will be copied and optimized
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= yeoman.app %>/assets/img',
						src: '{,*/}*.{png,jpg,jpeg}',
						dest: '<%= yeoman.dist %>/assets/img'
					}
				]
			}
		},
		// Minifies css. We only minify styles/*.css
		cssmin: {
			dist: {
				files: {
					'<%= yeoman.dist %>/styles/main.css': '<%= yeoman.app %>/styles/{,*/}*.css'
				}
			}
		},
		// Optimizes html files
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					removeCommentsFromCDATA: true,
					// https://github.com/yeoman/grunt-usemin/issues/44
					//collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true
				},
				files: [
					{
						expand: true,
						cwd: '<%= yeoman.app %>',
						src: 'index.html',
						dest: '<%= yeoman.dist %>'
					}
				]
			}
		},
		// Concat javascript files
		concat: {
			options: {
				separator: ';',
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				// the files to concatenate
				src: ['<%= yeoman.app %>/src/{,*/}*.js'],
				// the location of the resulting JS file
				dest: '<%= yeoman.dist %>/<%= pkg.name %>.js'
			}
		},
		// Minimizes js files
		uglify: {
			options: {
				// the banner is inserted at the top of the output
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'<%= yeoman.dist %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		// copy other files: icons, txts, htaccess and gifs
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.app %>',
						dest: '<%= yeoman.dist %>',
						src: [
							'*.{ico,txt, md}',
							'.htaccess',
							'assets/{,*/}*.{gif}'
						]
					}
				]
			}
		},
		// Revision files
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/src/{,*/}*.js',
						'<%= yeoman.dist %>/styles/{,*/}*.css',
						'<%= yeoman.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,ttf,otf}'
					]
				}
			}
		},

		// Watch and live reload
		watch: {
			options: {
				// Avoid having to create new instances
				nospawn: true
			},
			//			src: {
			//				files: ['<%= yeoman.app %>/src/**/*.js'],
			//				tasks: ['jshint']
			//			},
//			less: {
//				files: ['<%= yeoman.app %>/styles/**/*.less'],
//				tasks: ['less']
//			},
			//			hbs: {
			//				files: ['<%= yeoman.app %>/templates/**/*.hbs'],
			//				tasks: ['handlebars']
			//			},

			//			default: {
			//				files: [
			//					'index.html',
			//					'<%= yeoman.app %>/src/{,*/}*.js',
			//					'<%= yeoman.app %>/templates/{,*/}*.{html,hbs}',
			//					'<%= yeoman.app %>/styles/{,*/}*.{less,css}'
			//				],
			//				tasks: ['jshint', 'less', 'handlebars']
			//			},

			// Live Reload whenever there is a change
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'<%= yeoman.app %>/index.html',
					'<%= yeoman.app %>/styles/{,*/}*.css',
					'<%= yeoman.app %>/src/{,*/}*.js',
					'<%= yeoman.app %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		}
	});

	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean',
			'handlebars',
			'connect:livereload',
			'open',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'handlebars',
		'connect:test',
		'mocha'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'handlebars',
		'useminPrepare',
		'bower',
		'requirejs',
		'less',
		'imagemin',
		'htmlmin',
		'concat',
		'cssmin',
		'uglify',
		'copy',
		'usemin'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	]);
};
