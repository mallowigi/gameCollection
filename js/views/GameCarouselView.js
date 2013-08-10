/**
 * Created by Elior on 23/07/13.
 */
/**
 * Created by Elior on 23/07/13.
 */
define(['backbone',
	'views/GamesView',
	'text!templates/gameCarousel.html',
	'text!templates/gameCarouselItem.html',
	'jquery.imagesLoaded',
	'jquery.carousel3d'
], function (BackBone, GamesView, gameGridTemplate, gameGridItemTemplate, imagesLoaded, carousel3d) {
	// Extends games view
	var GamesCarouselView = Backbone.View.extend({
		initialize: function () {
			console.log("init Games Carousel View");
		},
		template: _.template(gameGridTemplate),

		render: function () {
			console.log("Renders a games carousel view");
			var grid = this.$el; // #gameList
			grid.html(this.template());

			console.log("Pass the game carousel item template");
			this._render(gameGridItemTemplate);

			var $itemsEl = $(this.itemsEl);
			$itemsEl.imagesLoaded(function () {
				console.log("Carouselling the grid");
				$itemsEl.CloudCarousel({
					reflHeight: 56,
					reflGap: 2,
					titleBox: $('#carouselTitle'),
					altBox: $('#carouselTitle2'),
					speed: 0.15,
					mouseWheel: true
				});
			});
		}
	});

	return GamesCarouselView;
});