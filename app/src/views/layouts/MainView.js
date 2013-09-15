/**
 * Created by Elior on 30/08/13.
 */
/* global define*/

define(['backbone'
	// add models and collections here
], function (Backbone) {
	'use strict';
	var MainView = Backbone.View.extend({
		el: '#main',
		initialize: function () {
			console.log('Initiating MainView');
		}
	});
	return MainView;
});