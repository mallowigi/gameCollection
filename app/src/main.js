(function () {
	'use strict';

	// Configure requireJS
	require.config({
		baseUrl: 'src',
		paths: {
			carousel3d: 'assets/libs/carrousel3d',
			ratingStars: 'assets/libs/ratingStars',
			templates: '../templates',
			backbone: '../vendor/backbone/backbone',
			bootstrap: '../vendor/bootstrap/docs/assets/js/bootstrap',
			eventEmitter: '../vendor/eventEmitter/EventEmitter',
			'doc-ready': '../vendor/doc-ready/doc-ready',
			eventie: '../vendor/eventie/eventie',
			'get-size': '../vendor/get-size/get-size',
			'get-style-property': '../vendor/get-style-property/get-style-property',
			holderjs: '../vendor/holderjs/holder',
			jquery: '../vendor/jquery/jquery',
			'jquery-bridget': '../vendor/jquery-bridget/jquery.bridget',
			masonry: '../vendor/masonry/masonry',
			'matches-selector': '../vendor/matches-selector/matches-selector',
			moment: '../vendor/moment/moment',
			underscore: '../vendor/underscore/underscore',
			requirejs: '../vendor/requirejs/require',
			handlebars: '../vendor/handlebars/handlebars',
			'handlebars.runtime': '../vendor/handlebars/handlebars.runtime',
			'swag': '../vendor/swag/lib/swag',
			item: '../vendor/outlayer/item',
			outlayer: '../vendor/outlayer/outlayer',
			'backbone.validator': '../vendor/backbone.validator/src/backbone.validator',
			'backbone.crossdomain': '../vendor/backbone.crossdomain/Backbone.CrossDomain',
			colorbox: '../vendor/colorbox/jquery.colorbox',
			modernizr: '../vendor/modernizr/modernizr',
			text: '../vendor/text/text',
			layoutmanager: '../vendor/layoutmanager/backbone.layoutmanager'
		},
		// Shim configs
		shim: {
			handlebars: {
				exports: 'Handlebars'
			},
			swag: {
				deps: ['handlebars'],
				exports: 'Swag'
			},
			backbone: {
				deps: [
					'jquery',
					'underscore',
					'handlebars'
				],
				exports: 'Backbone'
			},
			underscore: {
				exports: '_'
			},
			holder: {
				exports: 'Holder'
			},
			'jquery.colorbox': {
				deps: [
					'jquery'
				],
				exports: 'Colorbox'
			},
			carousel3d: {
				deps: [
					'jquery'
				],
				exports: 'carousel3d'
			},
			ratingStars: {
				deps: [
					'jquery'
				],
				exports: 'ratingStars'
			}
		}
	});

	// Configure layout Manager
	require(['config/LayoutManagerConfig'], function (LayoutManagerConfig) {
		LayoutManagerConfig.configure();
	});

	// Configure Handlebars
	require(['config/handlebars-helpers'], function (Handlebars) {
		Handlebars.registerHelpers();
	});

	// Extend Backbone classes
	require(['config/backbone-extensions'], function () {});

	// Main start
	require([
		'App'
	], function (App) {
		console.log('Starting application');

		//		App.router = new AppRouter(App);
		App.start();
		//	Backbone.history.start({pushState: true, root: App.root}); // todo need to be handled server side
	});
})();