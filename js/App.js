/**
 * Created by Elior on 12/07/13.
 * The app bootstrapping
 */
define(['backbone',
	'Router',
	'config',
	'models/Session',
	'views/MainView'
], function (Backbone, Router, config, Session, MainView) {
	return {
		initialize: function () {
			// Rewrite sync to include the server's address and CORS
			var sync = Backbone.sync;
			Backbone.sync = function (method, model, options) {
				options = options || {};
				if (!options.crossDomain) {
					options.crossDomain = true;
				}
				if (!options.xhrFields) {
					options.xhrFields = {withCredentials: true};
				}

				return sync(method, model, options);
			};

			$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
				options.url = config.serverUrl + options.url;
			});

			console.log("Creating MainView");
			new MainView().render();

			// Similar to php session start
			Session.getSession(this.sessionStart, this.failSessionStart);

		},

		/**
		 * Start a session and initializes the app
		 */
		sessionStart: function (data) {
			console.log("Authentication successful");

			console.log("Initializing the routes");
			var router = new Router();
		},

		/**
		 * The session has failed authentication, so the router is not initialized and therefore the guy cant access
		 * the app.
		 */
		failSessionStart: function () {
			// Show the landing page
			console.log("Authentication failed");
		}
	}
});