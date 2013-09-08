/**
 * Created by Elior on 01/09/13.
 */
/* global define */
define(['backbone'
	// add models and collections here

], function (Backbone) {
	'use strict';
	var NavBarView = Backbone.View.extend({
		template: 'navBarView',

		initialize: function () {
			console.log('Initiating NavBarView');
		},

		serialize: function () {
			return this.model.toJSON();
		}
	});
	return NavBarView;
});