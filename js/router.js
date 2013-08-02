/**
 * Created by Elior on 12/07/13.
 */
define(['backbone',
	'models/Game',
	'views/GameListPageView'], function(Backbone, Game, GameListPageView){
	// Define a router object
	var Router = Backbone.Router.extend({
		routes: {
			// default route
			'*actions':function(){
				console.log("Default route: init a GameListPageView");
				// Create a game list view containing a game collection
				var gameListView = new GameListPageView();
				console.log("GameListPageView initialized");

				gameListView.render();
			}
		}
	});

	var initialize = function() {
		console.log("Initializing router");
		var router = new Router();
		// add routes callbacks here
		Backbone.history.start()
	};

	// Return a module with a initialize function
	return {
		initialize: initialize
	};
});