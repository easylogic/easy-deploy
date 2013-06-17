define(
"app/collections/IssueCollection",
['backbone', 'app/models/IssueModel'],
function(Backbone, IssueModel){
	return Backbone.Collection.extend({
		model : IssueModel,
		url : '/issues'
	})
} )
