define(
"app/views/IssueListPager",
["underscore", "backbone"],
function(_, Backbone){
	return Backbone.View.extend({
		
		tagName : 'ul',
		
		className : 'pager',
		
		events : {
			"click li.previous" : function() {
				this.view.prev();
			},
			
			"click li.next": function() {
				this.view.next();
			}
		},
		
		initialize : function(opt) {
			
			this.view = opt.view ;
			
			this.render();
		},
		
		render : function() {
			
			this.$el.append(' <li class="previous"><a href="#">&larr; Newer</a></li>');
			this.$el.append(' <li class="next"><a href="#">&rarr; Older</a></li>');
			
			this.$el.css({
				margin : '0px'
			})
			
			return this; 
		}
	})
})
