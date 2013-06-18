define(
"app/views/IssueDetail",
[
	'jquery',
	'underscore', 
	'backbone', 
	'moment',
	'text!app/templates/IssueDetail.html',
	"app/views/IssueForm",
	"app/views/ServerForm",
	"app/views/project/ProjectItem",
	"app/models/ProjectModel",
	"app/views/AddFileForm"
],
function($, _, Backbone, moment, DetailTpl, IssueForm, ServerForm, ProjectItem, ProjectModel, AddFileForm) {
	return Backbone.View.extend({
		
		className : 'issue-detail',
		
		events : {
			'click .modify-btn' : function() {
				if (this.model) {
					var issueForm = new IssueForm({ listView : this.list, model : this.model });
					
					$("body").append(issueForm.el);
					
					issueForm.show();		
				}
			},
			
			'click .delete-btn' : function() {
				if (confirm('Really delete a issue?')) {
					this.model.destroy({
						success : function(model, res) {
							location.reload();
						}
					});
				}
			},
			
			'click .update-file-btn' : function() {
				var files = this.$(".files").val();
				var self = this; 
				this.model.set('files', files);
				this.model.save(null, { 
					success : function() {
						alert('Files are updated!');
						$.post('/deploy/logs/'+self.model.id, { data : "Files updated!\r\n\r\n" + files }, function(data){
							self.reloadDeployLog();	
						})
						
					}
				});
			},
			
			'click .update-revision-btn' : function() {
				var revision = this.$(".revision-list").val();
				var text = this.$(".revision-list option:selected").text();
				var self = this; 
				this.model.set('revision', revision);
				this.model.save(null, { 
					success : function() {
						alert('Revision is updated!');
						$.post('/deploy/logs/'+self.model.id, { data : "revision is updated!\r\n\r\n" + text }, function(data){
							self.reloadDeployLog();	
										
							self.$(".revision-number").html(self.model.get('revision'))
							self.$(".revision-list").val(self.model.get('revision'))

						})
						
					}
				});
			},		
			
			'click .reload-revision-btn' : function() {
				this.reloadRevision();
			},				
			
			'click .add-file-btn' : function() {
				var form = new AddFileForm({ list : this });
				$("body").append(form.el);
				
				form.show();
			},			
			
			'click .target-btn' : function(e) {
				
				var files = this.$(".files").val().split("\n");
				var temp = [];

                var fullsync = $(e.currentTarget).data('fullsync');
				
                if (!fullsync) {
    				for(var i in files) {
	    				var file = $.trim(files[i]);
		    			if (file == "") continue;
			    		if (file.indexOf("#") == 0) continue;
				    	
					    temp.push(file);
    				}
				
	    			if (temp.length == 0) {
		    			alert('File is not exists.')
			    		return ;
				    }
                } 


				var target = $(e.currentTarget).data('target');
				var self = this; 
				var btn_type = {
					real : 'danger',
					stage : 'warning',
					qa : 'success',
					dev : 'info'
				};
				
				var msg = [
					"Really deploy?",
					temp.join("\n")
				].join("\r\n");

                if (fullsync) {
                    msg = "Really Deploy?";
                }

				if (!confirm(msg)) return;
												
				this.$(".deploy-buttons").toggle();
				this.$(".deploy-buttons-panel .progress-bar").removeClass(function(index, cls){
					return cls.match(/progress\-bar\-/);
				}).addClass('progress-bar-' + btn_type[target]);				
				this.$(".deploy-buttons-panel").toggle();

				self.reloadDeployLog()

				$.post("/deploy", { 
					issue_id : this.model.id,
					target : target,
                    fullsync : fullsync
				}, function(data) {
					if (data) {
						self.reloadDeployLog()
					}
					self.$(".deploy-buttons").toggle();
					self.$(".deploy-buttons-panel").toggle();					
				})
			}
		},		
		
		reloadDeployLog : function(log) {
			var self = this; 
			$.ajax({
				method : 'get',
				data : { limit : 10 },
				url : '/deploy/logs/' + this.model.id,
				cache : false,
				success : function(data) {
					self.renderDeployLog(data);	
				}
			})				
		},
		
		reloadRevision : function() {
			var self = this; 
			$.ajax({
				method : 'get',
				data : { limit : 100 },
				url : '/deploy/revision/' + this.model.get('project'),
				cache : false,
				success : function(data) {
					self.renderRevision(data);	
				}
			})			
		},
		
		renderRevision : function(data) {
			
			if (!data.log) return;

			var $data = $(data.log || {}).find("logentry");
			var $dom = this.$(".revision-list");
			
			$dom.html("<option value=''>Recently Revision</option>");
			
			$data.each(function(i, elem) {
				var $elem = $(elem);
				
				var data = {
					author : $elem.find("author").text(),
					revision : $elem.attr("revision"),
					date : moment($elem.find("date").text()).format('YYYY-MM-DD hh:mm:ss'),
					msg : $elem.find("msg").text() 
				};
				
				var $option = $("<option />").val(data.revision).text([data.revision, data.author, data.msg.split("\n")[0]].join(" : "));
				
				$dom.append($option);
								
			})
						
			this.$(".revision-number").html(this.model.get('revision'))
			this.$(".revision-list").val(this.model.get('revision'))			
			
		},
		
		renderDeployLog : function(data) {
			var $dom = $(".deploy-log");
			
			if (data[0]) {
				$dom.find(".first").html(moment(data[0].create_at).format('YYYY-MM-DD hh:mm:ss') + "<pre>" + data[0].data + "</pre>");
				
				if (data[0].type == 'error') {
					$dom.find(".first").addClass('alert-danger');
				} else {
					$dom.find(".first").removeClass('alert-danger');
				}
				
			}
			
			var $ul = $dom.find(".deploy-log-list");
			
			data.shift();
			$ul.empty();
			
			for(var i in data) {
				var $li = $("<li />").html(moment(data[i].create_at).format('YYYY-MM-DD hh:mm:ss') + "<pre>" + data[i].data + "</pre>").addClass('list-group-item');
				if (data[i].type == 'error') {
					$li.addClass('alert-danger');	
				}
				
				$ul.append($li);
			}
		},
		
		addFiles : function(data) {
			var $files = this.$(".files");
			var text = "";
			
			for(var i in data) {
				text += "\r\n\r\n#" + data[i].title.replace(/\n/g, "\n# ") + "\r\n\r\n";
				
				for(var k in data[i].files) {
					text += data[i].files[k] + "\r\n"
				}
			}
			
			$files.append(text);
			
		},
		
		selectProjectInfo : function(model) {
			var self = this; 
			this.model.set({ project : model.id});
			this.model.save(null, {
				success : function() {
					self.renderProject(model);
				}
			});
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
				author : '',
				cc : '', 
				create_at : '',
				files : '',
				project : ''
			}, (this.model) ? this.model.toJSON() : {});
		},		
		
		tpl : function() {
			return _.template(DetailTpl, this.data())
		},
		
		renderProject : function(id) {
			var self = this; 
			if (typeof id == 'string') {
				
				var model = new ProjectModel();
				model.id = id;
				model.fetch({
					success : function() {
						var item = new ProjectItem({ model : model });
						
						self.$(".project_name").html(item.el).data('model', item.model);
					
						self.renderDeployButton(item.model);
						
						self.projectModel = item.model;						
					}
				})
				
				
			} else {
				var item = new ProjectItem({ model : id });
					
				self.$(".project_name").html(item.el).data('model', item.model);
					
				self.renderDeployButton(item.model);
				self.projectModel = item.model;
			}
		},
		
		renderDeployButton : function(model) {
			var $dom = this.$(".deploy-buttons");
			
			$dom.empty();
			
			var server = model.get('server');
			
			var btn_type = {
				real : 'danger',
				stage : 'warning',
				qa : 'success',
				dev : 'info'
			};
			
			var self = this; 
			
			for(var key in server) {
				if (server[key].length > 0) {


                    var $group = $("<div class='btn-group' />");

					var $btn1 = $("<a class='btn btn-small target-btn' />").html(key).addClass('btn-' + btn_type[key]).data('target', key).css({
					});
					var $btn2 = $("<a class='btn btn-small target-btn' />").html("Full Sync").addClass('active btn-' + btn_type[key]).data('target', key).css({
					}).data('fullsync', true);
				
                        
					$group.append($btn1, $btn2);	
					$dom.append($group);	
				}
			}
			
		},
		
		render : function() {
			
			this.$el.html(this.tpl());
			
			if (this.model) {
				console.log(this.model);
				this.$(".modify-btn").show();
				this.$(".delete-btn").show();
				this.renderProject(this.model.get('project'))				
				this.reloadDeployLog();			
				this.reloadRevision();	
				this.$el.show();
			} else {
				this.$el.hide();
			}
			
						
			this.delegateEvents();
			
			return this; 
		}
		
	})	
})
