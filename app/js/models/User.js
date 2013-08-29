/**
 * Created by Elior on 15/07/13.
 */
define(['.'],
	function (BackBone) {
		var User = BackBone.Model.extend({
			defaults: {
				email: 'anonymous@anon.com',
				name: 'Anonymous',
				consoles: ['Wii', 'PS3'],
				listType: "list",
				isLogged: false
			},
			urlRoot: function () {
				if (this.isNew()) {
					return "/api/user/" + this.get('name');
				}
				else {
					return "/api/user/" + this.id;
				}
			},
			//		url: function(){
			//			console.log(this.id);
			//			console.log(this.get("name"));
			//			if (this.isNew()){
			//				return this.urlRoot;
			//			}
			//			else{
			//				return this.urlRoot + this.id;
			//			}
			//		},

			validate: function (attrs) {
				// check if the given name is not already taken
			}
		});

		return User;
	});