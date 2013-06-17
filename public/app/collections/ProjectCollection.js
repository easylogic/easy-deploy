define(
"app/collections/ProjectCollection",
['backbone', 'app/models/ProjectModel'],
function(Backbone, ProjectModel){
	return Backbone.Collection.extend({
		model : ProjectModel,
		url : '/projects'
	})
} )
