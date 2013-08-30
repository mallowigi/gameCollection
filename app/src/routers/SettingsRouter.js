/**
 * Created by Elior on 30/08/13.
 */
define(['backbone'
	// add models and collections here
// TODO Not usable routes
], function (Backbone) {
	"use strict";
	var SettingsRouter = Backbone.Router.extend({
		routes: {
			'settings/info': "showInfo",
			'settings/notifications': "showNotifications"
		},

		showInfo: function(){
			console.log("Showing the info tab");
		},
		showNotifications: function(){
			console.log("Showing the Notifications tab");
		}
	});
	return SettingsRouter;
});