// Create a scope for our app, that way we can have multiple mains not using the global scope if needed
(function () {
	var root = this;

	// require conf
	// todo: masonry doesn't work well with AMD, so we load it 'the old way'
	require.config({
		baseUrl: 'js',
		paths: {
			jquery: 'assets/jquery',
			bootstrap: 'assets/bootstrap.min',
			underscore: 'assets/underscore-min',
			backbone: 'assets/backbone',
			// backbone plugins
			crossdomain: 'assets/backbone.crossdomain',
			// facebook integration
			'facebook': '//connect.facebook.net/en_US/all/debug',
			'fb': 'assets/fb',
			// underscore plugins
			text: 'assets/text',
			// jquery plugins
			holder: 'assets/holder',
			'jquery.imagesLoaded': "//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/2.1.0/jquery.imagesloaded.min", // todo download it
			'jquery.colorbox': 'assets/jquery.colorbox',
			'jquery.carousel3d': 'assets/carrousel3d',
			'ratingStars' : 'assets/ratingStars',
			// templates folder
			templates: '../templates',
			config: 'config'
		},

		// Since Backbone is not AMD compatible, it needs jquery and underscore to load
		// The shim configuration allows to force dependency loading before loading Backbone
		// Thanks to that, we dont need to specify jquery/underscore everywhere
		shim: {
			backbone: {
				deps: ['jquery', 'underscore'],
				exports: 'Backbone'
			},
			underscore: {
				exports: '_'
			},
			holder: {
				exports: 'Holder'
			},
			facebook: {
				exports: 'FB'
			},
			'jquery.imagesLoaded': {
				deps: ['jquery'],
				exports: 'imagesLoaded'
			},
			'jquery.colorbox': {
				deps: ['jquery'],
				exports: 'Colorbox'
			},
			'jquery.carousel3d': {
				deps: ['jquery'],
				exports: 'carousel3d'
			},
			ratingStars: {
				deps: ['jquery'],
				exports: 'ratingStars'
			}
		}
	});

	// These deps are defined in the index.html, so we define it here
	define('masonry', [], function () { return root.Masonry; });
	define('moment', [], function () { return root.moment; });

	require(['App', 'fb'], function (App, fb) {
		console.log("Bootstrapping app...");
		App.initialize();
	});

})();