/* global define */
define(['layoutmanager'], function (LayoutManager) {
	'use strict';
	// Configure LayoutManager with Backbone Boilerplate defaults.
	var configure = function () {
		console.log('Configuring LayoutManager');
		LayoutManager.configure({

			// Allow LayoutManager to augment Backbone.View.prototype.
			manage: true,

			// Indicate where templates are stored.
			prefix: 'templates/',

			// This custom fetch method will load pre-compiled templates or fetch them
			// remotely with AJAX.
			fetchTemplate: function (path) {
				var JST = window.JST,
					Handlebars = require('handlebars'),
					done;

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
				done = this.async();

				// Seek out the template asynchronously.
				$.get(path, {crossDomain: false}, function (contents) {
					done(Handlebars.compile(contents));
				}, 'text');
			}

		});
	};
	return {
		configure: configure
	};
});
