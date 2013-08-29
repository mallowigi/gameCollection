/**
 * Created by Elior on 12/07/13.
 */
define([
	'lib/backbone',
	'ViewManager',
	'config',
	'views/GameListPageView'
], function (Backbone, ViewManager, config, GameListPageView) {
	// Define a router object
	var Router = Backbone.Router.extend({
		routes: {
			// default route
			'/': "openAppView",
			'/:user': "openUserProfile",
			'/settings': "openSettings",
			'/logout': "logout"
		},

		initialize: function () {
			console.log("Initializing router");
			// The view manager (idea picked from Marionette)
			this.viewManager = new ViewManager();

		},
		openAppView: function () {
			console.log("Opening app view");

			var gameListPageView = new GameListPageView();
			this.viewManager.showView(gameListPageView);
		},
		openUserProfile: function (user) {
			console.log("Opening user profile for user: " + user);
		},
		openSettings: function () {
			console.log("Opening setttings");
		},
		logout: function () {
			console.log("logout");
		}
	});

	return Router;
});