define(['.'
	// add models and collections here
//	'text!templates/mainContentView.html'
], function (Backbone) {
	var MainContentView = Backbone.View.extend({
		el: '#app',
		tagName: "div",
		className: "content",
//		template: _.template(mainContentViewTemplate),

		initialize: function () {
			_.bindAll(this, "render"); // So when putting the render method as a callback, it doesnt mess up the this
			console.log("Initiating MainContentView");
		},

		events: {

		},

		render: function () {
			console.log("Rendering MainContentView");

//			var template = _.template(this.template);
//			this.$el.html(template);

			return this;
		}
	});
	return MainContentView;

});
