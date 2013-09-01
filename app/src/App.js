/**
 * Created by Elior on 30/08/13.
 */
/* global define, _, $ */
define([
	'backbone',
	'layoutmanager'
], function (Backbone, LayoutManager) {
	'use strict';
	var App = {root: '/'},
		AppLayout;

	// Configure LayoutManager with Backbone Boilerplate defaults.
	LayoutManager.configure({
		// Allow LayoutManager to augment Backbone.View.prototype.
		manage: true,

		// Indicate where templates are stored.
		prefix: 'templates/',

		// This custom fetch method will load pre-compiled templates or fetch them
		// remotely with AJAX.
		fetchTemplate: function (path) {
			var JST = window.JST,
				Handlebars = require('handlebars');

			// Concatenate the file extension.
			if (path.indexOf('.hbs') === -1) {
				path += '.hbs';
			}

			// If cached, use the compiled template.
			if (JST && JST[path]) {
				// If the template hasn't been compiled yet, then compile.
				if (!JST[path].compiled) {
					JST[path] = Handlebars.template(JST[path]);
					JST[path].compiled = true;
				}

				return JST[path];
			}

			// Put fetch into `async-mode`.
			var done = this.async();

			// Seek out the template asynchronously.
			$.get(path, function (contents) {
				done(Handlebars.compile(contents));
			}, 'text');
		}

	});

	AppLayout = Backbone.Layout.extend({
		el: '#app',
		template: 'layouts/appLayout',

		events: {
			'click a[href]:not([data-bypass])': 'routeLinks'
		},
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

	/**
	 * Sets the appLayout's views after so it configures first
	 */
	return _.extend(App, {
		// Create a custom object with a nested Views object.
		module: function (additionalProps) {
			return _.extend({ Views: {} }, additionalProps);
		},
		// Helper for using layouts.
		useLayout: function (name, options) {
			// Enable variable arity by allowing the first argument to be the options
			// object and omitting the name argument.
			if (_.isObject(name)) {
				options = name;
			}

			// Ensure options is an object.
			options = options || {};

			// If a name property was specified use that as the template.
			if (_.isString(name)) {
				options.template = name;
			}

			// Create a new Layout with options.
			this.layout = _.extend(new AppLayout(), options);

			// Cache the reference.
			return this.layout;
		}
	}, Backbone.Events);
});