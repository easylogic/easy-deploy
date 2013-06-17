define(
"app/views/project/ProjectItem", 
["underscore", "backbone", "text!app/templates/project/ProjectItem.html"], 
function(_, Backbone, ItemTpl){
	return Backbone.View.extend({
		
		tagName : 'a',
		
		className : 'list-group-item',
		
		events : {
			'click' : function() {
				if (this.list) {
					this.list.viewDetail(this.model);
				}
			}
		},
		
		initialize: function(opt) {
			
			this.list = opt.list;
		
			this.render();
		},
		
		data : function() {
			return (this.model) ? this.model.toJSON() : {};
		},
		
		tpl : function() {
			return _.template(ItemTpl, this.data());
		},
		
		render : function() {
			
			this.$el.html(this.tpl())
			
			return this; 
		}
	})
})
