define(
"app/views/IssueList",
[
	"underscore", 
	"backbone", 
	"app/collections/IssueCollection", 
	"text!app/templates/IssueList.html",
	"app/views/IssueItem",
	"app/views/IssueListPager",
	"app/views/IssueForm",
	"bootstrap/js/bootstrap"
],
function(_, Backbone, IssueCollection, ListTpl, IssueItem, IssueListPager, IssueForm) {
	return Backbone.View.extend({
		
		className : 'issue-list',
		
		page : 1, 
		
		initialize : function() {
			
			this.pager = new IssueListPager({ view : this  });
			
			this.collection = new IssueCollection();
			
			this.listenTo(this.collection, 'reset', this.resetList);
			this.listenTo(this.collection, 'add', this.addList);			
			
			this.render();
			
			this.load();
			
			this.initEvent();
		},
		
		initEvent : function() {
			var self = this; 
			$(".add-issue").click(function(e){
				var issueForm = new IssueForm({ listView : self });
				
				$("body").append(issueForm.el);
				
				issueForm.show();			
			})
		},		
		
		viewDetail : function(model) {
			this.detail.view(model);
		},
		
		addList : function(model) {
			var self = this; 
			model.save(null, {
				success : function() {
					self.$(".body").prepend(new IssueItem({ model : model, list : self }).el)
					
					this.viewDetail(model);							
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

		},		
		
		load : function() {
			this.collection.fetch({ reset : true, data : { page : this.page } } );
		},
		
		next : function() {
			this.page++;
			
			this.load();
		},
		
		prev : function() {
			if (this.page > 0) {
				this.page--;
			}
			
			if (this.page > 0) {
				this.load();	
			} else {
				alert('New is no')
			}
		},
		
		resetList : function() {
			
			if (this.collection.size() == 0) {
				this.page--;
				//alert('No more data.');
				return; 
			}
			
			var self = this; 
			this.$(".body").empty();

			this.collection.each(function(model){
				self.$(".body").append(new IssueItem({ model : model, list : self }).el)
			})
		},
		
		Item : function() {
			
		},
		
		tpl : function() {
			return _.template(ListTpl, {});
		},
		
		render : function() {
			this.$el.append(this.tpl());
			
			this.$(".foot").html(this.pager.el);
			
			return this; 
		}
	})	
})
