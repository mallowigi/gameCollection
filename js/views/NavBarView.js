/**
 * Created by Elior on 15/07/13.
 */
define(['backbone', 'bootstrap',
	// add models and collections here
	'text!templates/navbarLogged.html',
	'text!templates/navbarUnlogged.html'
], function (Backbone, Bootstrap, navLogged, navUnlogged) {
	// Create the navBar View
	var NavBarView = Backbone.View.extend({
		// We are creating the element, not attaching to an existing one
		id: 'navbar-menu',
		className: 'navbar-menu',
		consolesMenu: '#consoles-menu',
		user: {},

		initialize: function () {
			_.bindAll(this); // So when putting the render method as a callback, it doesnt mess up the this
			this.user = this.model; // So we don't need to set the model
			console.log("Inits NavBarView with user: " + this.user.getName());
		},

		events: {
			"click a.console-filter": "filterBy",
			"click a.brand": "resetFilter"
		},

		filterBy: function(event) {
			var filter = $(event.currentTarget).data("filterby");
			// send a filter event to the listeners (ex: the list view)
			// uses the publish/subscribe pattern
			console.log("Filter event sent, by: ", filter);
			Backbone.trigger("navbar:filter", filter);
		},

		resetFilter: function(event){
			console.log("Reset filter event sent");
			Backbone.trigger("navbar:resetFilter");
		},

		render: function () {
			console.log("Rendering navBarView");
			var templateNavBar = this.user.get("isLogged") ? navLogged : navUnlogged;

			var navBarTemplate = _.template(templateNavBar, this.user.attributes);
			this.$el.html(navBarTemplate);

			// So we can chain
			return this;
		}
	});
	return NavBarView;
});