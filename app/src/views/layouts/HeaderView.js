/**
 * Created by Elior on 31/08/13.
 */
/* global define */
define(['backbone',
	// add models and collections here,
	'views/NavBarView',
	'models/User'
], function (Backbone, NavBarView, User) {
	'use strict';
	var HeaderView = Backbone.Layout.extend({
		tagName: 'nav',
		className: 'navbar navbar-static-top topbar',
		id: 'navbar',
		template: 'layouts/headerLayout',

		views: {
			'#navbarview': new NavBarView()
		},
		initialize: function (options) {
			console.log('Initiating HeaderView');

			// Create a new user here
			var user = new User();
			user.set('isLogged', options.isLogged || false);

			// Assign the user to every subview
			this.getViews().each(function (view) {
				view.model = user;
			});
		}

	});
	return HeaderView;
});