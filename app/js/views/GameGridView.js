/**
 * Created by Elior on 23/07/13.
 */
define(['.',
	'views/GamesView',
	'text!templates/gameGrid.html',
	'text!templates/gameGridItem.html'
//	'masonry', 'jquery.imagesLoaded'
], function (BackBone, GamesView, gameGridTemplate, gameGridItemTemplate) {
	// Extends games view
	var GamesGridView = Backbone.View.extend({
		initialize: function () {
			console.log("init Games Grid View");
		},
		template: _.template(gameGridTemplate),

		render: function () {
			console.log("Renders a games grid view");
			var grid = this.$el; // #gameList
			grid.html(this.template());

			console.log("Pass the game grid item template");
			this._render(gameGridItemTemplate);

			// Masonry for the grid
			var $itemsEl = $(this.itemsEl);
//			$itemsEl.imagesLoaded(function () {
//				console.log("Masonning the grid");
//				$itemsEl.masonry({
//					gutter: 10,
//					isFitWidth: true,
//					transitionDuration: '1.0s',
//					itemSelector: '.hero-item'
//				});
//			});
		}
	});

	return GamesGridView;
});