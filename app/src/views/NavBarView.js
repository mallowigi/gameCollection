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
			// todo remove that
			this.model = new Backbone.Model({
				name: 'Dupuis',
				consoles: ['Wii', 'PS2']
			});

		},

		serialize: function () {
			console.log(this.model.toJSON());
			return this.model.toJSON();
		}
	});
	return NavBarView;
});