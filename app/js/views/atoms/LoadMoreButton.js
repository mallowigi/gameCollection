/**
 * Created by Elior on 01/08/13.
 */
define(['../.', 'bootstrap',
	// add models and collections here
	'text!templates/atoms/spinner.html'
], function (Backbone, Bootstrap, spinner) {
	var LoadMoreButtonView = Backbone.View.extend({
		el: "#loadMore", // button that load games
		template: spinner,
		loadWithScroll: true, // whether or not we load auto with scroll
		isLoading: false,

		initialize: function () {
			_.bindAll(this);
			// for infinite scrolling
			$(window).bind("scroll", this.checkScroll);

			Backbone.on("finishedLoading", this.updateButton);
		},
		events: {
			// clicking on the button
			"click.pagination":"reload"
		},

		reload: function() {
			console.log("Scrolling allowed");
			this.loadWithScroll = true;
			this.showSpinner();
			_.delay(function () {
				Backbone.trigger("loadMore");
			}, 1000);
		},


		updateButton: function (finishLoading) {
			console.log("Finsihed loading: " + finishLoading);
			if (finishLoading == "success") {
				this.removeButton();
			}
			else {
				this.loadWithScroll = false;
				this.showError();
			}
		},

		removeButton: function () {
			this.$el.empty();
		},
		checkScroll: function () {
			var docHeight = $(document).height(),
				docScrollTop = $(document).scrollTop(),
				winHeight = $(window).height(),
				threshold = 100;

			// If the difference between the total height and the scrolling top is lesser than the window height,
			// that means that the bottom is reached (given a threshold: the bottom margin)
			if (!this.isLoading && (docHeight - docScrollTop - threshold) < winHeight) {
				console.log("Reached the bottom, loading more");
				// Set the is loading here because otherwise between the moment the scroll reaches the bottom and the loadMoreGames
				// is called the document registers a lot of scroll events
				this.isLoading = true;
				if (this.loadWithScroll) {
					this.reload();
				}
			}
		},

		showSpinner: function () {
			this.$el.find('.pagination').hide();
			this.$el.find('#pagination_loading').show();
		},
		showError: function () {
			this.$el.find('.pagination').hide();
			// change spinner to failure text
			this.$el.find("#pagination_failure").show();
			// avoid auto loading from scroll
			this.loadWithScroll = false;
		},
		showNone: function () {
			this.$el.find('.pagination').hide();
			this.$el.find("pagination_none").show();
			this.loadWithScroll = false;
		},
		render: function () {
			this.$el.html(this.template);
		}

	});

	return LoadMoreButtonView;

});