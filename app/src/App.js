/**
 * Created by Elior on 30/08/13.
 */
/* global define, _, $ */
define([
	'require',
	'backbone',
	'layoutmanager',
	'views/layouts/HeaderView',
	'views/layouts/FooterView',
	'views/layouts/MainView'
], function (require, Backbone, LayoutManager, HeaderView, FooterView, MainView) {
	'use strict';

	//region Prototype extensions
	/**
	 * Closes a view and unbind its events. (Idea from marionette)
	 */
	Backbone.View.prototype.close = function () {
		// If the view has registered subviews, close the subviews before closing the view.
		if (this.views) {
			_.each(this.views, function (view) {
				view.close();
			});
		}

		this.remove();
		this.unbind();
		// Custom method onClose that views can implement to add disposal code
		if (this.onClose) {
			this.onClose();
		}

	};

	// Configure LayoutManager with Backbone Boilerplate defaults.
	LayoutManager.configure({
		// Allow LayoutManager to augment Backbone.View.prototype.
		manage: true,

		// Indicate where templates are stored.
		prefix: 'templates/',

		// This custom fetch method will load pre-compiled templates or fetch them
		// remotely with AJAX.
		fetchTemplate: function (path) {
			var JST = window.JST;
			var Handlebars = require("handlebars");

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

	//endregion

	var AppLayout = Backbone.Layout.extend({
		el: '#app',
		template: 'layouts/appLayout',

		views: {
			'#header': new HeaderView(),
			'#main': new MainView(),
			'#footer': new FooterView()
		},
		events: {
			'click a[href]:not([data-bypass])': 'routeLinks'
		},
		routeLinks: function (ev) {
			// Get the absolute anchor href.
			var $link = $(ev.currentTarget);
			var href = {
				prop: $link.prop('href'),
				attr: $link.attr('href')
			};
			// Get the absolute root.
			var root = location.protocol + '//' + location.host + this.root;

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

	var App = {root: '/'};

	/**
	 * Application start
	 */
	App.start = function () {
		console.log('Starting the App');
		var appLayout = new AppLayout();

		console.log('Rendering AppLayout');
		appLayout.render();
	};

	return App;
});