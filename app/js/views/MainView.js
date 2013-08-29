/**
 * Created by Elior on 08/08/13.
 */
define(['.',
	// add models and collections here
	'models/User',
	'models/Session',
	'views/NavBarView',
	'views/MainContentView',
	'text!templates/mainView.html'

], function (Backbone, User, Session, NavBarView, MainContentView, mainViewTemplate) {
	var MainView = Backbone.View.extend({
		el: 'body',
		id: 'mainView',
		user: new User(),

		template: _.template(mainViewTemplate),

		// Store our subviews (idea picked from Marionette)
		regions: {
			main: '#app',
			navBar: '#navbar-inner'
		},
		views: [],

		initialize: function () {
			_.bindAll(this, 'render'); // So when putting the render method as a callback, it doesnt mess up the this
			console.log("Initiating MainView");

			// Get subviews templates containers
			// This doesnt work because the template is not yet added to the dom at this time
			//			this.$app = $(this.app);
			//			this.$navbar = $(this.navbar);

			// When the Session receive a change in authentication, fetch the user and render page
			this.listenTo(Session, "change:auth", this.fetchUser);
			this.listenTo(this.user, "change", this.render);
		},

		events: {
			"click #login-fb": "facebookLogin",
			"click #logout": "logout"
		},

		logout: function () {
			Session.logout(function () {
				// Disable the button
				$('#logout').hide();
				$('#loginl').show();
			});
			this.user.set('isLogged', false);
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

			// Store the subview
			this.views.push(navBarView);
			//			$('#navbar-inner').append(navBarView.getRenderedView());
			var renderedView = navBarView.getRenderedView();
			this.getRegion('navBar').append(renderedView);
		},

		/**
		 * Renders the main content. If the user is logged in, mainContentView will render the game list.
		 * Otherwise it will render the landingPage
		 * @param user
		 */
		renderMainContent: function (user) {
			console.log("Rendering the main contentthis.getRegion('navBar')");
			var mainContentView = new MainContentView({
				model: user
			});
			// Store the subview
			this.views.push(mainContentView);
			this.getRegion('app').append(mainContentView.getRenderedView());
		},

		fetchUser: function () {
			var that = this;
			// If the user is authenticated and logged in, fetch the data
			if (Session.get("auth")) {
				// fetch user data
				// The set is important because if i create a new user I lose the bound events
				this.user.set({name: Session.get('username')});
				this.user.fetch().then(function () {
					console.log("Logged in: " + that.user.get('name'));
				})
			}
			else {
				console.log("Logged out");
			}
		},

		render: function () {
			console.log("Rendering MainView (user: " + this.user.get('name') + ")");
			this.$el.html(this.template);

			// Inits and renders the navBarView
			this.renderNavBar(this.user);
			//			Inits and renders the main content
			this.renderMainContent(this.user);
			return this;
		}
	});
	return MainView;

});