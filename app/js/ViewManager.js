define(['lib/backbone',
	// add models and collections here

], function (Backbone) {

	/**
	 * Closes a view and unbind its events. (Idea from marionette)
	 */
	Backbone.View.prototype.close = function(){
		// If the view has registered subviews, close the subviews before closing the view.
		if (this.views){
			_.each(this.views, function(view){
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

	/**
	 * Renders a view and return the html rendered
	 * @returns {string} the html rendered
	 */
	Backbone.View.prototype.getRenderedView = function(){
		return this.render().el;
	};

	/**
	 * Veeeeery simplified region management from Marionette. Return a jQuery element of a region
	 * @param regName the region
	 */
	Backbone.View.prototype.getRegion = function (regName) {
		if (this.regions) {
			// Find the region regName and encapsulate it in a jquery object relatively to $el
			return this.$el.find(this.regions[regName]);
		}
		return undefined;
	};

	/**
	 * Main Idea from Derick Bailey http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	 * This, along with the close method defined previously, ensures that a view is closed before creating it.
	 */
	var ViewManager = Backbone.View.extend({

		showView: function(view){
			if (this.currentView){
				this.currentView.close();
			}
			this.currentView = view;
			this.currentView.render();
		}
	});

	return ViewManager;
});
