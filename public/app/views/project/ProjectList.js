define(
"app/views/project/ProjectList",
[
	"jquery",
	"underscore", 
	"backbone", 
	"app/collections/ProjectCollection", 
	"text!app/templates/project/ProjectList.html",
	"app/views/project/ProjectItem",
	"app/views/project/AddForm",
	"bootstrap/js/bootstrap"	
],
function($, _, Backbone, ProjectCollection, ListTpl, ProjectItem, AddForm) {
	return Backbone.View.extend({
		
		className : 'server-list',
		
		initialize : function() {
			
			this.collection = new ProjectCollection();
			
			this.listenTo(this.collection, 'reset', this.resetList);
			this.listenTo(this.collection, 'add', this.addList);
			
			this.render();
			
			this.load();
			
			this.initEvent();
		},
		
		initEvent : function() {
			var self = this; 
			$(".add-server").click(function(e){
				var addForm = new AddForm({ listView : self });
				
				$("body").append(addForm.el);
				
				addForm.show();				
			})
		},
		
		viewDetail : function(model) {
			this.detail.view(model);
		},
		
		addList : function(model) {
			var self = this; 
			model.save(null, {
				success : function() {
					self.$(".body").append(new ProjectItem({ model : model, list : self }).el)		
				}
			});			
		},
		
		saveServerInfo : function(model, data) {
			if (model) {
				model.set(data);
				model.save();
			} else {
				this.collection.add([data]);
			}
			
			this.detail.render();
			
		},
		
		load : function() {
			this.collection.fetch({ reset : true } );
		},
		
		resetList : function() {
			
			if (this.collection.size() == 0) {
				this.page--;
				alert('No more data.');
				return; 
			}
			
			var self = this; 
			this.$(".body").empty();

			this.collection.each(function(model){
				console.log(model);
				self.$(".body").append(new ProjectItem({ model : model, list : self }).el)
			})
		},
		
		Item : function() {
			
		},
		
		tpl : function() {
			return _.template(ListTpl, {});
		},
		
		render : function() {
			this.$el.append(this.tpl());
		
			return this; 
		}
	})	
})
