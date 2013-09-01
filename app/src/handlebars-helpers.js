/**
 * Created by Elior on 01/09/13.
 */
/* global define */
define(['swag'
	// add models and collections here

], function (Swag) {
	'use strict';
	Swag.addHelper('link', function (link, options) {
		return new Swag.Handlebars.SafeString(
			'<a href="#/' + options.fn(link) + '">' + options.fn(link) + '</a>'
		);
	});

	return Swag;
});