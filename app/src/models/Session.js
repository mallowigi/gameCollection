/**
 * Created by Elior on 12/08/13.
 */
/* global define, _ */
define(['backbone'
	// add models and collections here

], function (Backbone) {
	'use strict';
	var Session = Backbone.Model.extend({
		urlRoot: '/api/session',
		loginUrl: '/api/login',

		/**
		 * Initializes set a ajaxPrefilter to add a request header for csrf depending on the model
		 */
		initialize: function () {
			console.log('Initializing session');
			var model = this;
			$.ajaxPrefilter(function (options, orig, xhr) {
				// If we have a csrf token send it through with the next request
				if (model.get('_csrf')) {
					xhr.setRequestHeader('X-CSRF-Token', model.get('_csrf'));
				}
			});
		},

		/**
		 * Try to login to the server and save the session if everything is fine
		 * @param credentials json containing the userName and password
		 * @param options
		 */
		login: function (credentials, options) {
			this.save(credentials, _.extend(options, {
				success: function () {
					console.log('Successfully logged in');
				}
			}));
		},

		/**
		 * Delete the session
		 */
		logout: function (options) {
			var that = this;
			this.destroy(_.extend(options, {
				success: function (session, response) {
					session.clear();
					session.id = null;
					that.set({
						auth: false,
						_csrf: response._csrf
					});

				}
			}));
		},

		/**
		 * Get a session from the db, so the user wont have to login.
		 */
		getAuth: function (options) {
			return this.fetch(_.extend({
				crossDomain: true,
				success: function () {
					console.log('Success authenticating');
				},
				error: function () {
					console.log('Error authenticating');
				}
			}, options));
		},

		//		getSession: function (callback, fallback, complete) {
		//			console.log("Trying to retrieve a session");
		//
		//			return this.fetch({
		//				success: callback,
		//				error: fallback,
		//				complete: complete
		//			});
		//		},

		checkCreds: function (creds) {
			var session = this;
			console.log('Checking credentials ' + creds.username + creds.password);
			return $.post(session.loginUrl, creds);
		}

	});

	// Static use
	return new Session();
});