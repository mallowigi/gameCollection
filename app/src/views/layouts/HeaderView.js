/**
 * Created by Elior on 31/08/13.
 */
/* global define */
define(['backbone',
	// add models and collections here,
	'views/NavBarView'
], function (Backbone, NavBarView) {
	'use strict';
	var HeaderView = Backbone.Layout.extend({
		tagName: 'nav',
		className: 'navbar navbar-static-top topbar',
		id: 'navbar',
		template: 'layouts/headerLayout',

		initialize: function () {
			console.log('Initiating HeaderView');
		},
		views: {
			'#navbarview': new NavBarView()
		}

	});
	return HeaderView;
});