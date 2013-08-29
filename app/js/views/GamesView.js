/**
 * Created by Elior on 23/07/13.
 */
define(['.',
	'views/GameView',
	'holder'
], function (BackBone, GameView, Holder) {
	// Abstract class for all collection views (list, grid, carrousel...)
	var GamesView = BackBone.View.extend({
		el: '#gameList',
		itemsEl: '#items',

		// Abstract initialize
		_initialize: function () {
			console.log("Init Games View");
		},

		// Renders the games
		_render: function (gameItemTemplate) {
			var that = this;

			console.log("Renders the games");
			_.each(that.collection.models, function (game) {
				that.renderGame(game, gameItemTemplate);
			});

			// Run placeholder replacement
			Holder.run();
			return this;
		},

		// Renders a game
		renderGame: function (game, gameItemTemplate) {
			var gameView = new GameView({
				model: game,
				template: gameItemTemplate,
				el: this.itemsEl
			});
			gameView.render();
		}
	});

	return GamesView;
});
