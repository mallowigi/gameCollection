/**
 * Created by Elior on 30/08/13.
 */
define(['backbone','layoutmanager'
	// add models and collections here

], function (Backbone, LayoutManager) {
	"use strict";
	var layout = Backbone.Layout.extend({
		template: '#main'
	});
	return layout;
});