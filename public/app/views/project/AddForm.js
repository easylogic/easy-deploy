define(
"app/views/project/AddForm",
["underscore", "backbone", "text!app/templates/project/AddForm.html"],
function(_, Backbone, FormTpl) {
	
	return Backbone.View.extend({
		
		className : 'modal fade',
		
		server_list : ['dev', 'qa', 'stage', 'real'],
		
		events : {
			'click .save-btn' : function(e) {
				
				if (!confirm("Save ?")) return; 
				
				
				var $list = this.$(".project");
				var temp = { server : { dev : [], qa : [],stage : [],real : []}  };
				
				$list.each(function(i, elem) {
					
					if (elem.name.indexOf("[]") > -1) {
						if (elem.value && elem.value != '')	{
							
							var name = elem.name.replace("[]", "").replace("server.", "");
							
							if (!temp.server[name]) {
								temp.server[name] = [];
							}
							
							temp.server[name].push(elem.value);
						}	
					} else if (elem.id) {
						temp[elem.id] = elem.value;
					}
					
				})
				
				if (temp.title && temp.title == "") {
					alert('Input Title');
					this.$("#title").focus();
					return false;
				}
				
				if (temp.text && temp.text == "") {
					alert('Input Summary');
					this.$("#text").focus();
					return false;
				}				
				
				if (temp.location && temp.location  == "") {
					alert('Input Location');
					this.$("#location").focus();
					return false;
				}
				
				console.log(temp);
				
				this.listView.saveServerInfo(this.model, temp);
				
				this.close();
			},
			
			'click .add-target-ip' : function(e) {
				var $a = $(e.currentTarget);
				var target = $a.data('target');
				this.$("." + target + "-list").append('<input type="text" name="server.' + target +'[]"  class="input-small project" style="margin-bottom:2px;">')
			},
			
			'click .type-btn' : function(e) {
			
				var value = this.$(e.currentTarget).data('value');
				
				this.$("#type").val(value).find("> .text").text(value);
			},
			
			'click .project-tab a' : function(e) {
				 e.preventDefault();
  				 this.$(e.currentTarget).tab('show');
			},
			
			'hidden.bs.modal' : function(e) {
				this.$el.remove();
			}
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
				},
				server_list : this.server_list
			}, (this.model) ? this.model.toJSON() : {});
		},
		
		tpl : function(data) {
			return _.template(FormTpl, data);
		},
		
		render : function() {
			
			this.$el.html(this.tpl(this.data()))
			
			this.delegateEvents();
			
			return this; 
		}
	})
	
})
