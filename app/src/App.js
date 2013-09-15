/**
 * Created by Elior on 30/08/13.
 */
/* global define, config, _, $ */
define([
	'backbone',
	'controllers/SessionController'
], function (Backbone, SessionController) {
	'use strict';

	// -------------------- Initializing jQuery plugins *---------------

	// Ajax Prefilter to include server url for ajax requests
	$.ajaxPrefilter(function (options) {
		// Only for crossDomain requests, the url will be of the server's
		if (options.crossDomain) {
			options.xhrFields = {
				withCredentials: true
			};
			options.url = config.serverUrl + options.url;
		}

		// Local requests need to change this value
		options.crossDomain = true;
	});

	// Inits the Application layout
	var AppLayout = Backbone.Layout.extend({
		el: '#app',

		events: {
			'click a[href]:not([data-bypass])': 'routeLinks'
		},
		/**
		 * Transform all links to routed links
		 * @param ev
		 */
		routeLinks: function (ev) {
			// Get the absolute anchor href.
			var $link = $(ev.currentTarget),
				href = {
					prop: $link.prop('href'),
					attr: $link.attr('href')
				},
			// Get the absolute root.
				root = location.protocol + '//' + location.host + this.root;

			// Ensure the root is part of the anchor href, meaning it's relative.
			if (href.prop.slice(0, root.length) === root) {
				// Stop the default event to ensure the link will not cause a page
				// refresh.
				ev.preventDefault();

				// `Backbone.history.navigate` is sufficient for all Routers and will
				// trigger the correct events. The Router's internal `navigate` method
				// calls this anyways.  The fragment is sliced from the root.
				Backbone.history.navigate(href.attr, true);
			}
		}
	});

	// The application
	var App = {
		root: '/',

		/**
		 * Imitates Bailey's module function to create submodules
		 * @param additionalProps
		 * @returns {*|Object}
		 */
		module: function (additionalProps) {
			return _.extend({ Views: {} }, additionalProps);
		},

		/**
		 * Dynamically sets app layout at runtime
		 * @param template the name of the template to load
		 * @param options the
		 * @returns {*|Object}
		 */
		useLayout: function (template, options) {
			// Enable variable arity by allowing the first argument to be the options
			// object and omitting the name argument.

			if (_.isObject(template)) {
				options = template;
			}

			// Ensure options is an object.
			options = options || {};

			// If a name property was specified use that as the template.
			if (_.isString(template)) {
				options.template = template;
			}

			// Create a new Layout with options.
			this.layout = _.extend(new AppLayout(), options);

			// Cache the reference.
			return this.layout;
		},
		/**
		 * Application start when the dom is loaded
		 */
		start: function () {
			console.log('Calling application.start');
			// Start the session and router history
			SessionController.initialize(this);
		}
	};

	return _.extend(App, Backbone.Events);
});