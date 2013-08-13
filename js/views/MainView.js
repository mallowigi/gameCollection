/**
 * Created by Elior on 08/08/13.
 */
define(['backbone',
	'fb',
	// add models and collections here
	'models/User',
	'models/Session',
	'views/NavBarView',
	'views/MainContentView',
	'text!templates/mainView.html'

], function (Backbone, fb, User, Session, NavBarView, MainContentView, mainViewTemplate) {
	var MainView = Backbone.View.extend({
		el: 'body',
		id: 'mainView',
		app: '#app',
		navbar: '#navbar-inner',
		user: new User(),

		template: _.template(mainViewTemplate),
		views: {},

		initialize: function () {
			var that = this;
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
			"click #loginl": "login",
			"click #logout": "logout"
		},

		login: function () {
			// Disable the button
			var creds = { username: 'hello' };
			Session.login(creds);
			return false;
		},

		logout: function () {
			Session.logout();
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
			$(this.navbar).append(navBarView.getRenderedView());
		},

		/**
		 * Renders the main content. If the user is logged in, mainContentView will render the game list.
		 * Otherwise it will render the landingPage
		 * @param user
		 */
		renderMainContent: function (user) {
			console.log("Rendering the main content");
			var mainContentView = new MainContentView({
				model: user
			});
			$(this.app).append(mainContentView.getRenderedView());
		},

		fetchUser: function () {
			// If the user is authenticated and logged in, fetch the data
			if (Session.get("auth")) {
				// fetch user data
				// The set is important because if i create a new user I lose the bound events
				this.user.set({name: Session.get('username')});
				this.user.fetch({update: true});
				console.log("Logged in: " + this.user.get('name'));
			}
			else {
				console.log("Logged out");
			}
		},

		render: function () {

			console.log("Rendering MainView (user: " + this.user.get('name') + ")");
			console.log(this.user.get('isLogged'));
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