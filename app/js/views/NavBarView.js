/**
 * Created by Elior on 15/07/13.
 */
define(['.', 'bootstrap',
	// add models and collections here
	'models/Session',
	'models/User',
	'text!templates/navbarLogged.html',
	'text!templates/navbarUnlogged.html'
], function (Backbone, Bootstrap, Session, User, navLogged, navUnlogged) {
	// Create the navBar View
	var NavBarView = Backbone.View.extend({
		// We are creating the element, not attaching to an existing one
		id: 'navbar-menu',
		className: 'navbar-menu',

		regions: {
			consolesMenu: '#consoles-menu'
		},
		views: [],

		initialize: function () {
			_.bindAll(this, 'render'); // So when putting the render method as a callback, it doesnt mess up the this
			this.user = this.model; // So we don't need to set the model
			console.log("Inits NavBarView with user: " + this.user.get('name'));
		},

		events: {
			"click a.console-filter": "filterBy",
			"click a.brand": "resetFilter",
			"submit #login-form": "login"
		},

		login: function (event) {
			event.preventDefault();
			var that = this,
				userNameField = $('#username'),
				passwordField = $('#password'),
				errorMsg = $('#divErrors'),
				username = userNameField.val().trim(),
				password = passwordField.val().trim(),

				creds = {
					username: username,
					password: password
				};

			var jqxhr = Session.checkCreds(creds);

			// When the result of login comes back,
			jqxhr.done(function (errors) {
				// Set the fields in red in case of errors
				userNameField.toggleClass('error-field', errors.username);
				passwordField.toggleClass('error-field', errors.password);

				errorMsg.empty();

				// Append error msgs
				$.each(errors, function (index, value) {
					errorMsg.append('<p>' + value + '</p>');
				});

				if ($.isEmptyObject(errors)) {
					that.sessionLogin(creds);
				}
			});
		},

		sessionLogin: function (creds) {
			Session.login(creds, function () {
				// Disable the button
				//				$('#loginl').hide();
				//				$('#logout').show();
			});
		},

		filterBy: function (event) {
			var filter = $(event.currentTarget).data("filterby");
			// send a filter event to the listeners (ex: the list view)
			// uses the publish/subscribe pattern
			console.log("Filter event sent, by: ", filter);
			Backbone.trigger("navbar:filter", filter);
		},

		resetFilter: function (event) {
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