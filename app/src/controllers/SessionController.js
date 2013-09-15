/**
 * Created by Elior on 12/07/13.
 * The app bootstrapping
 */
/* global define */
define(['backbone',
	'models/Session',
	'routers/AppRouter',
	'views/layouts/HeaderView',
	'views/layouts/FooterView',
	'views/layouts/MainView'
], function (Backbone, Session, AppRouter, HeaderView, FooterView, MainView) {
	'use strict';

	// Extend with Backbone events to allow listen to changes
	return _.extend({

		/**
		 * Initialize our session controller: Call session start, then if the user is authenticated load all its routes;
		 * otherwise load the logged out routes. Finally start the backbone history.
		 * @param App Our Application. Used to set the layout according to the status.
		 */
		initialize: function (App) {
			console.log('Session Controller');
			var that = this;
			this.App = App;

			// Call session start then listen to changes on the session object
			this.sessionStart().then(function () {
				// Listen to changes on the Session object
				Session.on('change:auth', that.sessionStart, that);
				Backbone.history.start({pushState: true});
			});
		},

		/**
		 * Similar to php session start. This will check if there is a session registered on the server, whether or not the user is logged.
		 */
		sessionStart: function () {
			var sessionCtl = this;
			return Session.getAuth({
				success: function (authResponse) {
					if (authResponse.get('auth') === 'true') {
						sessionCtl.successSessionStart();
					}
					else {
						sessionCtl.failSessionStart();
					}
				},
				error: sessionCtl.failSessionStart
			});
		},

		/**
		 * If there is a session for this user
		 */
		successSessionStart: function () {
			console.log('Successfully authneticated');
			var options = {isLogged: true, loggedIn: true};

			console.log('Initializing the Main Router');
			// Load logged in routes
			var router = new AppRouter();

			console.log('Loading logged in App Layout and renders it');
			this.App.useLayout('layouts/appLayout', options).setViews({
				'#header': new HeaderView(options),
				'#footer': new FooterView(),
				'#main': new MainView(options)
			}).render();

		},

		/**
		 * The session has failed authentication, so the router is not initialized and therefore the guy cant access
		 * the app.
		 */
		failSessionStart: function () {
			// Show the landing page
			console.log('Authentication failed');
			var options = {isLogged: false};

			// Load logged out routes

			console.log('Loading logged out App Layout and renders it');
			this.App.useLayout('layouts/loggedOutLayout', options).setViews({
				'#header': new HeaderView(options),
				'#footer': new FooterView(),
				'#main': new MainView(options)
			}).render();
		}

	}, Backbone.Events);
});