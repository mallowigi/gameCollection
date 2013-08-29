/**
 * Created by Elior on 17/07/13.
 */
define(['.',
	'views/GamesView',
	'text!templates/gameList.html',
	'text!templates/gameListItem.html',
	'ratingStars'
], function (BackBone, GamesView, gameListTemplate, gameListItemTemplate, ratingStars) {
	// Extends games view
	var GameListView = Backbone.View.extend({
		initialize: function () {
			console.log("init Games List View");
		},
		template: _.template(gameListTemplate),

		render: function () {
			console.log("Renders a games list view");
			this.$el.html(this.template());

			console.log("Pass the games list item template");
			this._render(gameListItemTemplate);

			// todo: is the rating part of the list view or the list item view?
			$('.ratingStars').ratingStars({
				gold: 'star-gold',
				silver: 'star-silver'
			});
		}
	});

	return GameListView;
});