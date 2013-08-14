/**
 * Created by Elior on 12/07/13.
 * The app bootstrapping
 */
define(['backbone',
	'models/Session',
	'Router',
	'config',
	'views/MainView',
	'crossdomain'
], function (Backbone, Session, Router, config, MainView) {
	return {
		initialize: function () {
			console.log("Initializing the routes");
			var router = new Router();

			// Ajax Prefilter to include server url for ajax requests
			$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
				options.url = config.serverUrl + options.url;
			});

			// Call session start
			this.sessionStart();
		},

		// Similar to php session start. If the session auth failed, do not start Backbone.history
		sessionStart: function () {
			Session.getSession(this.successSessionStart, this.failSessionStart, this.renderMainView);
		},

		/**
		 * A session has been created: the router is init
		 */
		successSessionStart: function () {
			console.log("Authentication successful");
			Backbone.history.start();
		},

		/**
		 * The session has failed authentication, so the router is not initialized and therefore the guy cant access
		 * the app.
		 */
		failSessionStart: function () {
			// Show the landing page
			console.log("Authentication failed");
			Backbone.history.stop();
		},

		/**
		 * What to do anyway: render the main view which will give two different pages according to auth
		 */
		renderMainView: function () {
			console.log("Creating MainView");
			new MainView().render();

		}
	}
});