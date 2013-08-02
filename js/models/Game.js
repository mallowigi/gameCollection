/**
 * Created by Elior on 17/07/13.
 */
define(['backbone',
	'moment'
], function (Backbone, moment) {
	var Game = Backbone.Model.extend({
		defaults: {
			title: 'N/A',
			publisher: 'N/A',
			console: '',
			rating: 0,
			releasedDate: moment().format('L'),
			description: ''
		},
		initialize: function () {
			console.log('Game Created: ' + this.get("title"));
		}
	});

	var Games = Backbone.Collection.extend({
		model: Game,
		// todo add rest api url by user
		url: '/games'

	});

	// We return a module containing the Model and Collection altogether. This way we don't need to
	// create separate files for models and collections
	// Also it allows creation by new Game.Collection
	return {
		Model: Game,
		Collection: Games
	};
});