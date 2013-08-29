/**
 * Created by Elior on 12/07/13.
 */
define(['.',
	// add models and collections here
	'models/User',
	'models/Game',
	'views/NavBarView',
	'views/GameListView',
	'views/GameGridView',
	'views/GameCarouselView',
	'text!templates/gameListPage.html',
	'views/atoms/LoadMoreButton'
], function (Backbone, User, Game, NavBarView, GameListView, GameGridView, GameCarouselView, gameListPageTemplate, LoadMoreButtonView) {
	var GameListPageView = Backbone.View.extend({
		el: '#app',
		user: {}, // The logged user
		games: [], // the collection
		listType: "list", // list type
		page: 1, // for paging

		initialize: function () {
			console.log("Instantiating a new GameListPageView");

			// Necessary for binding the view methods with the real this
			_.bindAll(this);

			// todo fetch from json
			console.log("Retrieving user data from server");
			this.user = new User({
				name: 'Mallowigi',
				isLogged: true //here get from server/cookie the state
			});

			// list type
			this.listType = this.user.get("listType") || "list";

			// Custom Event handling
			this.bindCustomEvents();
		},

		bindCustomEvents: function () {
			Backbone.on("navbar:resetFilter", this.resetFilter);
			// If we receive a filter event, filter
			Backbone.on("navbar:filter", this.filterBy);
			// When receiving a loadMore, load more games
			Backbone.on("loadMore", this.loadMoreGames);
		},

		resetFilter: function () {
			console.log("Reset filter");
			// Simply recall renderGames to rerender the whole list
			this.renderGames(this.games, this.listType);
		},

		/**
		 * Event handler: filters the list
		 * @param filter
		 */
		filterBy: function (filter) {
			if (this !== window && this.games && this.listType) {
				console.log("Filtering by: " + filter);
				var filteredgames = this.games.where({console: filter});

				// Need to wrap up our filtered array in a game collection
				this.renderGames(new Game.Collection(filteredgames), this.listType);
			}
			else {
				console.error("Cannot apply filter on " + this.games);
			}
		},

		loadMoreGames: function () {
			var that = this;
			this.page++;

			console.log("Retrieving more games from json");
			// todo mechanism to fetch not fetched data
			this.games.fetch({
				// When finishing retrieving the games, render the view
				success: function () {
					console.log("Successfully retrieved from server");

					var games = that.games;
					games.add(new Game.Model({ title: 'Wario', console: 'PS3', rating: 4 }));
					games.add(new Game.Model({ title: 'Peach', console: 'PS3', rating: 5}));
					games.add(new Game.Model({ title: 'Daisy', console: 'Wii', rating: 2.5 }));
					games.add(new Game.Model({ title: 'DK', console: 'Wii', rating: 1}));

					Backbone.trigger("finishedLoading", "success");

					// remove spinner
					//					that.loadMoreButtonView.removeButton();
					//					that.renderGames(that.games, that.listType);

					// todo maybe send event here?
					//					that.loadMoreButtonView.isLoading = false;
				},
				error: function () {
					console.log("Error retrieving games from server");
					Backbone.trigger("finishedLoading", "failure");

					//					that.loadMoreButtonView.showError();
					//					that.isLoading = false;

				}
			});
		},

		/* Data fetching */
		loadGames: function () {
			var that = this;
			// get rest data from server
			console.log("User: " + this.user.get("name"));

			// todo get games from json
			var games = this.games = new Game.Collection();
			games.add(new Game.Model({ title: 'Zorro' }));
			games.add(new Game.Model({ title: 'Mario', console: 'Wii', rating: 3}));
			games.add(new Game.Model({ title: 'Luigi', console: 'Wii'}));
			games.add(new Game.Model({ title: 'Yoshi', console: 'GameCube'}));

			console.log("Retrieving games from json");
			this.games.fetch({
				// When finishing retrieving the games, render the view
				success: function () {
					console.log("Successfully retrieved from server");
					that.renderGames(games, that.listType);
					that.isLoading = false;
					Backbone.trigger("finishedLoading", "success");

				},
				error: function () {
					console.log("Error retrieving games from server");
					that.renderGames(games, that.listType); // todo remove this when the server is up and running
					that.isLoading = false;
					Backbone.trigger("finishedLoading", "failure");

				}
			});
		},

		/**
		 * Renders the games in the given list type
		 * @param games the games
		 * @param listType the list type (default
		 */
		renderGames: function (games, listType) {
			var that = this;

			console.log("Rendering the Game List Page");
			this.isLoading = true;

			var gamesView;

			switch (listType) {
				case "list":
					gamesView = new GameListView();
					break;
				case "grid":
					gamesView = new GameGridView();
					break;
				case "carousel":
					gamesView = new GameCarouselView();
					break;
				default :
					gamesView = new GameListView();
			}

			gamesView.collection = games;
			gamesView.render();
			this.loadMoreButtonView = new LoadMoreButtonView();
			this.loadMoreButtonView.render();
		},

		render: function () {
			var that = this, listType = this.user.get("listType");

			console.log("Rendering Game List Page View");
			// Inserts the template in $el
			this.$el.html(gameListPageTemplate);

			// Inits and renders the gameListView
			this.loadGames();
			//			this.renderGames(that.games, listType);

			// So we can chain
			return this;
		}
	});

	return GameListPageView;
})
;