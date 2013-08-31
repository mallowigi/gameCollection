/**
 * Created by Elior on 31/08/13.
 */
/* global define */
define(['backbone'
	// add models and collections here

], function (Backbone) {
	'use strict';
	var FooterView = Backbone.View.extend({
		initialize: function () {
			console.log('Initiating FooterView');
		}
	});
	return FooterView;
});