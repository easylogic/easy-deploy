define(
"app/views/ServerForm",
[
	"underscore", 
	"backbone", 
	"text!app/templates/ServerForm.html",
	"app/collections/ProjectCollection",
	"app/views/project/ProjectItem"
],
function(_, Backbone, FormTpl, ProjectCollection, ProjectItem) {
	
	return Backbone.View.extend({
		
		className : 'modal fade',
		
		events : {
			'click .save-btn' : function(e) {
				
				if (!confirm("Select ?")) return;
				 
				var model = this.$(".list-group-item.active").data('model');
				console.log(model);
				console.log(this.listView)
				this.listView.selectServerInfo(model);
				
				this.close();
			}
		},
		
		viewDetail : function(model) {
			
		},
		
		show : function() {
			this.$el.modal()
		},
		
		close : function() {
			this.hide();
		},
		
		hide : function() {
			this.$el.modal('hide');
		},
		
		remove : function() {
			this.$el.remove();
		},
		
		initialize : function(opt) {
			
			this.listView = opt.listView;
			
			this.collection = new ServerCollection();
			
			this.listenTo(this.collection, 'reset', this.resetList);
			
			this.render();
			
			this.load();			
		},
		
		load : function() {
			this.collection.fetch({ reset : true } );
		},
		
		resetList : function() {
			
			var self = this; 
			this.$(".project-list").empty();

			this.collection.each(function(model){
				var item = new ServerItem({ model : model, list : self });
				
				item.$el.data('model', model);
				self.$(".project-list").append(item.el)
				
				item.$el.on('click', function(e) {
					self.$(".project-list .active").removeClass('active');
					item.$el.addClass('active');
				})
			})
		},
		
		data : function() {
			return {};
		},
		
		tpl : function(data) {
			return _.template(FormTpl, data);
		},
		
		render : function() {
			
			this.$el.html(this.tpl(this.data()))
			
			return this; 
		}
	})
	
})
