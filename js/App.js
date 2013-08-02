/**
 * Created by Elior on 12/07/13.
 */
define(['backbone', 'router', 'jquery', 'masonry'], function(Backbone, Router, $, Masonry) {
	return {
		initialize: function() {
			console.log("Initializing the App");
			Router.initialize();

			var $container = $('#container');
			$container.masonry({
				columnWidth: 200,
				itemSelector: '.hero-item'
			});
		}
	}
});