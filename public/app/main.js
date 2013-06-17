define(
"app/main", 
["jquery", "app/views/IssueList","app/views/IssueDetail"], 
function($, IssueList, IssueDetail) {
	return {
		initialize: function() {
			
			var issueList = new IssueList();
			var issueDetail = new IssueDetail();
			
			issueList.detail = issueDetail;
			issueDetail.list = issueList;
			
			$(".main").append(issueList.el)
			$(".detail").append(issueDetail.el)
		}
	}
})
