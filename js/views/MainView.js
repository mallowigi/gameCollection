/**
 * Created by Elior on 08/08/13.
 */
define(['backbone',
	'fb',
	// add models and collections here
	'models/User',
	'views/NavBarView',
	'text!templates/mainView.html'

], function (Backbone, fb, User, NavBarView, mainView) {
	var MainView = Backbone.View.extend({
		el: 'body',
		id: 'mainView',
		app: '#app',
		navbar: '#navbar-inner',

		template: _.template(mainView),
		views: {},

		initialize: function () {
			_.bindAll(this); // So when putting the render method as a callback, it doesnt mess up the this
			console.log("Initiating MainView");

			// Get subviews templates containers
			this.$app = $(this.app);
			this.$navbar = $(this.navbar);

			// fetch user data
			this.user.fetch()
		},

		events: {
			"click #login-fb": "facebookLogin"
		},

		facebookLogin: function () {
			fb.login();
		},

		/**
		 * Renders the navbar with the given user
		 * @param user the user
		 */
		renderNavBar: function (user) {
			console.log("Creating the NavBarView");
			var navBarView = new NavBarView({
				model: user
			});
			this.$navbar.append(navBarView.getRenderedView());
		},

//		renderMainContent: function (user) {
//			console.log("Rendering the main content");
//			var mainContentView = new MainContentView({
//				model: user
//			});
//			this.$app.append(mainContentView.getRenderedView());
//		},

		render: function () {
			console.log("Rendering MainView");

			this.$el.html(this.template);

			// Inits and renders the navBarView
			this.renderNavBar(this.user);

			// Inits and renders the main content
//			this.renderMainContent(user);

			return this;
		}
	});
	return MainView;

});