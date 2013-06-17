define(
"app/project", 
["jquery", "app/views/project/ProjectList","app/views/project/ProjectDetail"], 
function($, ProjectList, ProjectDetail) {
	return {
		initialize: function() {
			
			var projectList = new ProjectList();
			var projectDetail = new ProjectDetail();
			
			projectList.detail = projectDetail;
			projectDetail.list = projectList;
			
			$(".main").append(projectList.el)
			$(".detail").append(projectDetail.el)
		}
	}
})
