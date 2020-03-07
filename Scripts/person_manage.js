var app = angular.module('applylist',[]);
	app.controller('listCtrl', function($scope){  //

	$scope.detail = function (login_name)
{
	alert(login_name);
	//getDetail(login_name,showDetail);
	var obj = new Array();
	var processResult = function(){
		var userName = obj[0];		
		alert(userName); 
		location.reload(true);
	}
	$('#myModalDetail').modal("show");
	//getDetail(login_name);
	//getFromWS("person_manage/treeGetDetail.template","sid="+login_name,obj,processResult);
	//location.reload(true);
	

}



$scope.add = function ()
{
	var obj = new Array();
	var processResult = function(){
		alert("OK");
		var userName = obj[0];		
		//alert(userName); bad?
		location.reload(true);
	}
	var newperson = document.getElementsByClassName("form-control");
	var sid = newperson[0].value;
	alert(newperson.length);
	var name = newperson[1].value;
	var gender = newperson[2].value;
	var departname = newperson[3].value;
	var divide = newperson[4].value;
	var stafftype = newperson[5].value;
	var title = newperson[6].value;
	var rank = newperson[7].value;
	var pid = newperson[8].value;
	var fid = newperson[9].value;
	var phonenumber = newperson[10].value;
	var priority = newperson[11].value;
	var password = newperson[12].value;
	getFromWS("person_manage/pmAdd.template","sid="+sid+"$^@^$name="+name+"$^@^$gender="+gender+"$^@^$departname="+departname+"$^@^$divide="+divide+"$^@^$stafftype="+stafftype+"$^@^$title="+title+"$^@^$rank="+rank+"$^@^$pid="+pid+"$^@^$fid="+fid+"$^@^$phonenumber="+phonenumber+"$^@^$priority="+priority+"$^@^$password="+password,obj,processResult);

}


$scope.list = function()
 {
 	 var setting = {
     view: {
       showIcon: true,//设置 zTree 是否显示节点的图标。
       },
     edit: {
     	enable: true,
     	editNameSelectAll: true,
     },
     data: {
       simpleData: {
         enable: true,
         	idKey:"id",
         	pIdKey:"pId",
         	rootPId:0
        }
    },
    	//定义回调函数
    callback: {
     onClick: zTreeOnClick,
  }
} 	
	//var str = '[{ "id":1, "pId":0,"name": "校领导", "open":true},{ "id":2, "pId":0,"name": "党政办", "open":true},{ "id":3, "pId":0,"name": "计算机学院", "open":true}]';
		
	var obj = new Array();
	var processResult = function(){
	var jsonData = obj[0];
	jsonData = jsonData.substr(0,jsonData.length-1);
	var str = '['+jsonData+']';
	//alert(str);
	var zNodes = JSON.parse(str);
	$.fn.zTree.init($("#tree"), setting, zNodes);
	}
	
	var sid = "sasa";
	getFromWS("person_manage/list.template","sid="+sid,obj,processResult);
  
     function zTreeOnClick(event, treeId, treeNode) {
     //这里定义点击书中节点时，相应的页面其他的操作，示例： 每次点击节点后， 弹出该节点的 tId、name 的信息
     var sid = treeNode.id;
     alert(sid + ", " + treeNode.name+"，"+treeId);
     var obj = new Array();
	 var processResult = function(){
	 var jsonData = obj[0];
	 jsonData = jsonData.substr(0,jsonData.length-1);
	 var str = '['+jsonData+']';
//	 alert(str);
	 var zNodes = JSON.parse(str);
	 	 	$scope.names = zNodes;
			$scope.$digest();

	 }
     
     getFromWS("person_manage/treeGetPersons.template","sid="+sid,obj,processResult);
     };
   
 }

$scope.list();
 
	
	
	})











 





function submit()
			{
				save();
				addNew();
			}
			function deleteRec(){
				var obj = new Array();
				var processResult = function(){
				var userName = obj[0];		
				alert(userName);
				location.reload(true);
			    }
				var chbxs = document.getElementsByClassName("ckbx");
				for(var i=0;i<chbxs.length;i++)  
			    {  
					if(chbxs[i].checked)
					{
						var sid = chbxs[i].name;
						getFromWS("person_manage/pmDelete.template","sid="+sid,obj,processResult);
								
					}
			    }       

			}

			function addNew(){
			var obj = new Array();
				var processResult = function(){
				var userName = obj[0];		
				alert(userName);
				location.reload(true);
			    }

				var chbxs = document.getElementsByClassName("newcb");
				for(var i=0;i<chbxs.length;i++)  
			        {
			        	var disa = document.getElementsByName(chbxs[i].name);
					var sid = disa[1].value;
					var name = disa[2].value;
					var gender = disa[3].value;
					var departname = disa[4].value;			
					var divide = disa[5].value;
					var stafftype = disa[6].value;				
					var title = disa[7].value;			
					var rank = disa[8].value;
					var pid = disa[9].value;			
					var fid = disa[10].value;			
					var phonenumber = disa[11].value;					
					var priority = disa[12].value;			
					var password = disa[13].value;			
							
					getFromWS("person_manage/pmAdd.template","sid="+sid+"$^@^$name="+name+"$^@^$gender="+gender+"$^@^$departname="+departname+"$^@^$divide="+divide+"$^@^$stafftype="+stafftype+"$^@^$title="+title+"$^@^$rank="+rank+"$^@^$pid="+pid+"$^@^$fid="+fid+"$^@^$phonenumber="+phonenumber+"$^@^$priority="+priority+"$^@^$password="+password,obj,processResult);
						
			        }         


			}
			 
			function addRow(){

				var t=document.getElementById("t1");
				var nrows = t.rows.length;
				var row=t.insertRow(t.rows.length);
				var id=nrows;
				row.insertCell(0).innerHTML="<input type=\"checkbox\" class=\"newcb\" name="+id+" />";
				row.insertCell(1).innerHTML="<input type=\"text\" id=\"sid\" name="+id+" />";
				row.insertCell(2).innerHTML="<input type=\"text\" name="+id+" />";
				row.insertCell(3).innerHTML="<select id=\"gender\" name="+id+"><option > 女</option><option > 男</option></select>";
				row.insertCell(4).innerHTML="<input type=\"text\" name="+id+" />";
				row.insertCell(5).innerHTML="<select name="+id+"><option >行政</option><option >教学</option></select>";
				row.insertCell(6).innerHTML="<select id=\"stafftype\" name="+id+"><option >在职员工</option><option >离退休员工</option><option >合同制员工</option><option >离职员工</option></select>";
				row.insertCell(7).innerHTML="<input type=\"text\" name="+id+" />";
				row.insertCell(8).innerHTML="<input type=\"text\" name="+id+" />";
				row.insertCell(9).innerHTML="<input type=\"text\" id=\"pid\" name="+id+" />";
				row.insertCell(10).innerHTML="<input type=\"text\" id=\"fid\" name="+id+" />";
				row.insertCell(11).innerHTML="<input type=\"text\" id=\"phonenumber\" name="+id+" />";
				row.insertCell(12).innerHTML="<input type=\"text\" name="+id+" />";
				row.insertCell(13).innerHTML="<input type=\"text\" name="+id+" />";

			}

			function getCheckBox()  
			    {
				var chbxs = document.getElementsByClassName("ckbx");
				for(var i=0;i<chbxs.length;i++)  
			        {  
					if(chbxs[i].checked)
					{
						var disa = document.getElementsByName(chbxs[i].name);
						for(var j=2;j<disa.length;j++)
							disa[j].disabled = false;			
					}
			        }         

			    } 
			    
			function save()
			{
				var obj = new Array();
				var processResult = function(){
				var userName = obj[0];		
				alert(userName);
				location.reload(true);
			    }
				var chbxs = document.getElementsByClassName("ckbx");
				for(var i=0;i<chbxs.length;i++)  
			        {  
					if(chbxs[i].checked)
					{
						var id = chbxs[i].name;
						var disa = document.getElementsByName(id);
						var name = disa[2].value;
						var gender = disa[3].value;
						var departname = disa[4].value;			
						var divide = disa[5].value;
						var stafftype = disa[6].value;				
						var title = disa[7].value;			
						var rank = disa[8].value;
						var pid = disa[9].value;			
						var fid = disa[10].value;			
						var phonenumber = disa[11].value;					
						var priority = disa[12].value;			
						var password = disa[13].value;			
							
						getFromWS("person_manage/pmUpdate.template","id="+id+"$^@^$name="+name+"$^@^$gender="+gender+"$^@^$departname="+departname+"$^@^$divide="+divide+"$^@^$stafftype="+stafftype+"$^@^$title="+title+"$^@^$rank="+title+"$^@^$pid="+pid+"$^@^$fid="+fid+"$^@^$phonenumber="+phonenumber+"$^@^$priority="+priority+"$^@^$password="+password,obj,processResult);
								
					}
			        }       
			}
