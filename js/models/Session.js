/**
 * Created by Elior on 12/08/13.
 */
define(['backbone', 'crossdomain'
	// add models and collections here

], function (Backbone) {
	var Session = Backbone.Model.extend({
		urlRoot: '/api/session',
		initialize: function () {
			var that = this;
			// Prefilter ajax requests to ask for credentials
			//			$.ajaxPrefilter(function (options, orig, xhr) {
			//				options.xhrFields = {
			//					withCredentials: true
			//				};
			//
			//				// If we have a csrf token send it through with the next request
			//				if (typeof that.get('_csrf') !== 'undefined') {
			//					xhr.setRequestHeader('X-CSRF-Token', that.get('_csrf'));
			//				}
			//			});

		},

		/**
		 * Try to login to the server and save the session if everything is fine
		 * @param credentials json containing the userName and password
		 * @param callback
		 */
		login: function (credentials, callback) {
			this.save(credentials, {
				success: function(){
					callback();
				}
			});
		},

		/**
		 * Delete the session
		 */
		logout: function (callback) {
			var that = this;
			this.destroy({
				success: function (session, response) {
					session.clear();
					session.id = null;
					that.set({
						auth: false,
						_csrf: response._csrf
					});
					callback();
				}
			});
		},

		/**
		 * Get a session from the db, so the user wont have to login.
		 * @param callback
		 * @param fallback
		 * @param complete
		 */
		getSession: function (callback, fallback, complete) {
			console.log("Trying to retrieve a session");
			return this.fetch({
				success: callback,
				error: fallback,
				complete: complete
			});
		}
	});

	// Static use
	return new Session();
});