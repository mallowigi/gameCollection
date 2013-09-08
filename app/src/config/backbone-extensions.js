/**
 * Created by Elior on 01/09/13.
 */
/* global define, _ */
define(['backbone'

], function (Backbone) {
	'use strict';
	//region Prototype extensions
	/**
	 * Closes a view and unbind its events. (Idea from marionette)
	 */
	Backbone.View.prototype.close = function () {
		// If the view has registered subviews, close the subviews before closing the view.
		if (this.views) {
			_.each(this.views, function (view) {
				view.close();
			});
		}

		this.remove();
		this.unbind();
		// Custom method onClose that views can implement to add disposal code
		if (this.onClose) {
			this.onClose();
		}

	};

});