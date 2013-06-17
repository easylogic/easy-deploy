define(
"app/models/ProjectModel",
['backbone'],
function(Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot : '/projects'
	})
} )
