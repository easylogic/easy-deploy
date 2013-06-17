define(
"app/models/IssueModel",
['backbone'],
function(Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id"
	})
} )
