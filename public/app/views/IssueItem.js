define(
"app/views/IssueItem", 
["underscore", "backbone", "text!app/templates/IssueItem.html"], 
function(_, Backbone, ItemTpl){
	return Backbone.View.extend({
		
		tagName : 'a',
		
		className : 'list-group-item',
		
		events : {
			'click' : function() {
				this.list.viewDetail(this.model);
			}
		},		
		
		initialize: function(opt) {
		
			this.list = opt.list;
		
			this.render();
		},
		
		tpl : function(data) {
			return _.template(ItemTpl, data);
		},
		
		render : function() {
			
			this.$el.html(this.tpl(this.model.toJSON()))
			
			return this; 
		}
	})
})
