/**
 * Created by Elior on 12/07/13.
 * The app bootstrapping
 */
define(['backbone',
	'Router',
	'views/MainView'
], function (Backbone, Router, MainView) {
	return {
		initialize: function () {
			console.log("Creating MainView");
			new MainView().render();

			console.log("Initializing the routes");
			var router = new Router();
		}
	}
});