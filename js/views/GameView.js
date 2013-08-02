/**
 * Created by Elior on 18/07/13.
 */
define([
	'backbone'
], function (Backbone) {
	var GameView = Backbone.View.extend({

		initialize: function(options) {
			_.bindAll(this);
			console.log("Initialize a game view with model: " + this.model.attributes);
			// Backbone doesn't merge the 'template' property automatically, it instead passes it in the options
			this.template = options.template;
		},


		render: function() {
			var that = this;

			console.log("Compiling template gameItem");
			var template = _.template(this.template, this.model.attributes);

			console.log("Appending template");
			this.$el.append(template);

			return this;
		}

	});

	return GameView;


});