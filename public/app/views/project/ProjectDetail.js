define(
"app/views/project/ProjectDetail",
[
	'underscore', 
	'backbone', 
	'text!app/templates/project/ProjectDetail.html',
	"app/views/project/AddForm"	
],
function(_, Backbone, DetailTpl, AddForm) {
	return Backbone.View.extend({
		
		className : 'project-detail',
		
		events : {
			'click .modify-btn' : function() {
				if (this.model) {
					var addForm = new AddForm({ listView : this.list, model : this.model });
					
					$("body").append(addForm.el);
					
					addForm.show();		
				}
			},
			
			'click .project-tab a' : function(e) {
				 e.preventDefault();
  				 this.$(e.currentTarget).tab('show');
			}			
		},
		
		initialize : function() {
			
			this.render();
		}, 
		
		view : function(model) {
			this.model = model;
			
			this.render();
			
		},
		
		data : function() {
			return _.extend({
				title : '', 
				text : '', 
				type : '', 
				location : '',
				server : {
					dev 	: [],
					qa 		: [],
					stage 	: [],
					real 	: []					
				} 
			}, (this.model) ? this.model.toJSON() : {});
		},
		
		tpl : function() {
			return _.template(DetailTpl, this.data())
		},
		
		render : function() {
			
			this.$el.html(this.tpl());
			
			if (this.model) {
				this.$(".modify-btn").show();
				this.$el.show();
			} else {
				this.$el.hide();
			}
			
			this.delegateEvents();
			
			return this; 
		}
		
	})	
})
