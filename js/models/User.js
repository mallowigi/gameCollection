/**
 * Created by Elior on 15/07/13.
 */
define(['backbone', 'config'], function (BackBone, config) {
	var User = BackBone.Model.extend({
		defaults: {
			name: 'Anonymous',
			url: config.baseURI + this.name,
			consoles: ['Wii', 'PS3'],
			listType: "list"
		},
		url: config.baseURI + this.name,

		validate: function(attrs){
			// check if the given name is not already taken
		},

		getName: function(){
			return this.get("name");
		}
	});

	return User;
});