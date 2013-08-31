/**
 * Created by Elior on 31/08/13.
 */
/* global define */
define(['backbone'
	// add models and collections here
], function (Backbone) {
	'use strict';
	var HeaderView = Backbone.View.extend({
		template: 'layouts/headerLayout',

		initialize: function () {
			console.log('Initiating HeaderView');
		}

	});
	return HeaderView;
});