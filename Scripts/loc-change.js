			function getname() {
				var args = window.location.search.slice(1).split("&");
				var i = 0;
				var name = "not found user";
				while (args[i])
				{
					if (args[i].indexOf("name") >= 0) 
					{
						name = args[i].slice(args[i].indexOf("name")+5);
						break;
					}
					i++;
				}
				return name;
			}
			function getsid(){
				var sid = sessionStorage.getItem('loginName');
				//var local = window.location.search;
				//var args = local.slice(1).split("&");
				//var i = 0;
				//var sid = "";
				//while (args[i])
				//{
				//	if (args[i].indexOf("sid") >= 0) 
				//	{
				//		sid = args[i].slice(args[i].indexOf("sid")+4);
				//		break;
				//	}
				//	i++;
				//}
				return sid;
			}
			function salary_search() {
				window.location.href = "/pages/salary_search/salary_search.html";
			}
			function apply_check() {
				window.location.href = "/pages/apply_check/apply_check.html";
			}
			function apply_report() {
				sessionStorage.setItem("alertSuccess", false);
				sessionStorage.setItem("alertFail", false);
				window.location.href = "/pages/apply_report/apply_report.html";
			}
			function apply_report_basePay() {
				sessionStorage.setItem("alertSuccess", false);
				sessionStorage.setItem("alertFail", false);
				window.location.href = "/pages/apply_report/apply_report_basePay.html";
			}
			function financial_statistics() {
				window.location.href = "/pages/salary_count/salary_count.html";
			}
			function notices() {
				window.location.href = "/pages/notices/notices.html";
			}
			function person_manage() {
				window.location.href = "/pages/person_manage/list.html";
			}

			function person_info() {
				window.location.href = "/pages/person_info/person_info.html";
			}
			
			
			function person_manage_working() {
				window.location.href = "/pages/person_manage/person_manage_working.html";
			}
			
			function person_manage_contracting() {
				window.location.href = "/pages/person_manage/person_manage_contracting.html";
			}
			function person_manage_dismissing() {
				window.location.href = "/pages/person_manage/person_manage_dismissing.html";
			}
			function person_manage_retiring() {
				window.location.href = "/pages/person_manage/person_manage_retiring.html";
			}
			
			function person_manage_list() {
				window.location.href = "/pages/person_manage/list.html";
			}
			
			





