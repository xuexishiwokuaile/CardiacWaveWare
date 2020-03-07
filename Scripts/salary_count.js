function salary_count(){
	var obj = new Array();
	var processResult = function(){
		var salaryCount = obj[0];		
		alert(salaryCount);
		//location.reload(true);
		}
	//获取部门信息
	var select_section = document.getElementById("section");
	var index_section = select_section.selectedIndex;
	var select_section_value = select_section.options[index_section].value;

	//获取职员信息
	var select_staff = document.getElementById("staff");
	var index_staff = select_staff.selectedIndex;
	var select_staff_value = select_staff.options[index_staff].value;

	//获取经费类型
	var select_salaryType = document.getElementById("salaryType");
	var index_salaryType = select_salaryType.selectedIndex;
	var select_salaryType_value = select_salaryType.options[index_salaryType].value;

	//获取学院信息
	var select_college = document.getElementById("college");
	var index_college = select_college.selectedIndex;
	var select_college_value = select_college.options[index_college].value;

	getFromWS("salary_count/salary_count.template","select_section="+select_section_value+"$^@^$select_staff="+select_staff_value+"$^@^$select_salaryType="+select_salaryType_value+"$^@^$select_college="+select_college_value,obj,processResult);

}
