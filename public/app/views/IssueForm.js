define(
"app/views/IssueForm",
[
	"underscore", 
	"backbone", 
	"text!app/templates/IssueForm.html",
	"app/collections/ProjectCollection"
],
function(_, Backbone, FormTpl, ProjectCollection) {
	
	return Backbone.View.extend({
		
		className : 'modal fade',
		
		events : {
			'click .save-btn' : function(e) {
				
				if (!confirm("Save ?")) return; 
				
				var $list = this.$(".issue");
				var temp = { };
				
				$list.each(function(i, elem) {
					temp[elem.id] = elem.value;
				})
				
				this.listView.saveServerInfo(this.model, temp);
				
				this.close();
			}
		},
		
		show : function() {
			
			var self = this;
			this.collection.fetch({
				success : function() {
					
					self.collection.each(function(model){
						var $opt = $("<option />").text(model.get('title')).val(model.id);
						
						if(self.model && self.model.get('project') == model.id) {
							$opt.attr('selected', true);
						}

						self.$("#project").append($opt);
					})
					
					self.$el.modal();
				}
			})
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
			this.collection = new ProjectCollection();
			this.listView = opt.listView;
			
			this.render();
		},
		
		data : function() {
			return _.extend({
				title : '', 
				text : '', 
				author : '',
				cc : '',
				project : '',
				files : ''
			}, (this.model) ? this.model.toJSON() : {});
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
