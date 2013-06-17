define(
"app/views/AddFileForm",
["underscore", "backbone", "moment", "text!app/templates/AddFileForm.html"],
function(_, Backbone, moment, FormTpl) {
	
	return Backbone.View.extend({
		
		className : 'modal fade',
		
		events : {
			'click .save-btn' : function(e) {
				
				var data = [];
				
				this.$(".file-list a.list-group-item.active").each(function(i, a){
					var $a = $(a);
					
					var title = $a.find(".list-group-heading .title").text();
					var files = [];
					
					$a.find(".alert div").each(function(i, file){
						files.push($(file).text());
					});
					
					data.push({ title : title, files : files });
				})

				this.list.addFiles(data);
				
				this.close();
			},
			
			'click .more-file-btn' : function(e) {
				this.page = (this.page) ? this.page + 1 : 2;
				
				this.showPage();
			}
		},
		
		showPage : function() {
			var self = this; 
			$.get('/deploy/files/' + this.list.model.get('project'), {page : this.page || 1}, function(data){
				self.renderFileList(data);
			})
			
		},
		
		show : function() {
			this.$el.modal()			
			
			this.showPage();
			
		},
		
		renderFileList : function(data, callback) {
			
			var $info = $(data.info);
			var root = $info.find("root").text();
			var url = $info.find("url").text();
			var dir_root = url.replace(root, "");
			
			var $data = $(data.log).find("logentry");
			var $dom = this.$(".file-list");
			
			$data.each(function(i, elem) {
				var $elem = $(elem);
				
				var data = {
					author : $elem.find("author").text(),
					revision : $elem.attr("revision"),
					date : moment($elem.find("date").text()).format('YYYY-MM-DD hh:mm:ss'),
					msg : $elem.find("msg").text() 
				};
				
				var title = [
					"<span class='label'>" + data.author + "</span>",  
					"<span class='label label-warning'>-r" + data.revision + "</span>",  
					data.date, 
					"[<span class='title'>", data.msg, 
					"</span>]"
				].join(" ");
				var $li = $("<a />").html("<div class='list-group-heading'>" + title + "</div>").addClass('list-group-item');
				
				var $pre = $("<div class='alert alert-success' />");
				$li.append($pre);
				
				$elem.find("paths").each(function(index, path){
					$(path).find("path").each(function(idx, p){
						// $(p).attr('action'); // M, D, A
						$pre.append("<div >" + $(p).text().replace(dir_root + "/", "") + "</div>")	
					})
					
				})
				
				$li.click(function(e) {
					$(this).toggleClass('active');
				})
				
				$dom.append($li);				
			})

			
			callback && callback();
		},
		
		close : function() {
			this.hide();
			this.remove();
		},
		
		hide : function() {
			this.$el.modal('hide');
		},
		
		remove : function() {
			this.$el.remove();
		},
		
		initialize : function(opt) {
			
			this.list = opt.list;
			
			this.render();
		},
		
		data : function() {
			
			return _.extend({
			}, (this.model) ? this.model.toJSON() : {});
		},
		
		tpl : function(data) {
			return _.template(FormTpl, data);
		},
		
		render : function() {
			
			this.$el.html(this.tpl(this.data()))
			
			this.$(".modal-dialog").css({
				'width' : '800px',
				'left' : '0px',
				'margin-left' : "auto",
				'margin-right' : "auto"
				
			})
			
			this.delegateEvents();
			
			return this; 
		}
	})
	
})
