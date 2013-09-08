/**
 * Created by Elior on 30/08/13.
 */
/* global define */
define([
	'backbone'
], function (Backbone) {
	'use strict';
	// Define a router object
	var AppRouter = Backbone.Router.extend({
		initialize: function () {
			console.log('Router init');
		},

		routes: {
			'settings': 'openSettings',
			'logout': 'logout',
			// Because if first, 'settings' would match as an user
			':user': 'openUserProfile',
			// Should always be last
			'': 'openAppView'
		},

		openAppView: function () {
			console.log('Opening app view');
		},
		openUserProfile: function (user) {
			console.log('Opening user profile for user: ' + user);
		},
		openSettings: function () {
			console.log('Opening setttings');
		},
		logout: function () {
			console.log('logout');
		}
	});

	return AppRouter;
});