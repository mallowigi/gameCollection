/**
 * Created by Elior on 15/07/13.
 */
define(['backbone', 'userConfig'], function (BackBone, userConfig) {
	var User = BackBone.Model.extend({
		defaults: {
			name: 'Anonymous',
			url: userConfig.baseURI + this.name,
			consoles: ['Wii', 'PS3'],
			listType: "list"
		},
		url: userConfig.baseURI + this.name,

		getName: function(){
			return this.get("name");
		}
	});

	return User;
});