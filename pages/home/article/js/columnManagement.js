//检查用户是否登陆
function _checkLogin()
{
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('userToken');
  //const classification = localStorage.getItem('classification');
  //没有缓存数据退出
  if(!userId || !userToken ){
    location.href="../../../index.html";
    return;
  }
  let dealResult = function(){
    //console.log(obj[0]);
    if(obj[0]=="bad"){
      localStorage.removeItem('userId');
      localStorage.removeItem('userToken');
      localStorage.removeItem('classification');
      localStorage.removeItem('loginName');
      alert("请先登陆");
    }else{
      //alert("您已登录");
    }
  };
  let obj = new Array();
  getFromWS("common/checkLoginFilter.template","id="+userId+"$^@^$token="+userToken,obj,dealResult);
}

///页面加载时获取栏目列表
function _getColumns() {
  var obj_tree = new Array();
  var processResult_tree = function () {
    if(obj_tree[0].length>0){
      var jd = obj_tree[0].replace(/\'/g, '\"');//单引号替换为双引号
      var jsonData = jd.replace(/&/g, '\'');//&符号替换为单引号
      jsonData = jsonData.substr(0, jsonData.length - 1);//去掉最后一个逗号
      var str = '[' + jsonData + ']';
      var zNodes = JSON.parse(str);//[{},{},....,{}]
      var newTree = new Array();

      var firstTree = new Array();
      for (var i = 0; i < zNodes.length; i++) {
        var json = {};
        json['text'] = zNodes[i].text;
        json['id'] = zNodes[i].id;
        json['nodes'] = new Array;
        newTree.push(json);
      }	//将所有的{}放入newTree中

      for(var i = 0; i < zNodes.length; i++){
        if (zNodes[i].pId == 0) {//如果是一级的栏目 -----
          firstTree.push(newTree[i]);
        }
      }
      for(var j=0;j<firstTree.length;j++){
        for(var i = 0; i < zNodes.length; i++){
          if (zNodes[i].pId == firstTree[j].id) {//如果是二级的栏目 -----
            firstTree[j].nodes.push(newTree[i]);
          }
        }
      }

      var allcolumnData = JSON.stringify(firstTree);
      //console.log(allcolumnData);
      //var alength=allcolumnData.length;
      $('#treeview-selectable').treeview({
        data: allcolumnData,
        backColor: '#fff',
        borderColor: '#eeeeee',
        nodeIcon: 'glyphicon glyphicon-indent-left',
        selectedBackColor: '#efebeb',
        selectedColor: '#8f1fdc',
        showIcon: true,
        showTags: false,
        levels: 2,
      });
    }
  }
  getFromWS("Home/article/getColumns.template", "operation=getAllColumns", obj_tree, processResult_tree);

  //将一级栏目数量传到此页面,供新增栏目时使用（陈）
  var obj_count = new Array();
  var processResult_count = function () {
    $('#firstColumCount').val(obj_count[0]);
  }
  getFromWS("Home/article/getColumns.template", "operation=getFirstColumCount", obj_count, processResult_count);
}

//新增一级栏目的事件（陈）
function addmodal0(){
  var firstColumCount=$('#firstColumCount').val();
  addmodal('0',firstColumCount);
}

//添加子节点（陈）
function addmodal(nid,count) {//以nid为父亲结点，创建子结点
  $('#addmodal').modal('show');//count为nid的子栏目数量
  var newcount = (parseInt(count)+1)*10;//设置sort的默认值为10，20，30.....
  $("#columnSort").val(newcount);
  var isClick = true;
  $('#addsave').on('click', function () {
    if(isClick){
      isClick = false;
      var columnName = $("#columnName").val().replace(/\s/g,"");
      var columnSort = $("#columnSort").val();
      var flag = true;
      //正则 验证数字
      var reg = /^[0-9]*$/;
      if(!reg.test(columnSort)){
        alert("请输入正确的排序");
        flag = false;
      }
      if (columnName == undefined || ""==columnName) {
        alert("输入不能为空！");
        flag = false;
      }
      if (/(^-[0-9]*[1-9][0-9]*$)/.test(columnSort)) {
        alert("栏目排序必须为非负整数");
        flag = false;
      }
      if (flag == false){
        isClick = true;
        return;
      }
      var obj_add = new Array();
      var processResult_add = function () {
        alert("执行结果："+obj_add[0]);
        location.reload(true);
        // }
      }
      getFromWS("Home/article/saveColumn.template", "operation=newColumn$^@^$name=" + columnName + "$^@^$parent_id=" + nid + "$^@^$sort=" + columnSort , obj_add, processResult_add);
      $('#addmodal').modal('hide');
    }
  })
}
//删除子结点
function deleteModalshow(nid) {
  $('#deleteModal').modal('show');

  $('#removeItem').on('click', function () {
    var obj_delete = new Array();
    var processResult_delete = function () {
      alert("执行结果："+obj_delete[0]);
      location.reload(true);
    }
    getFromWS("Home/article/saveColumn.template", "operation=deleteColumn$^@^$id=" + nid, obj_delete, processResult_delete);
    $('#deleteModal').modal('hide');
  })
}
//修改子结点栏目名称和排序（陈）
function digmodal(nid,name,nsort) {
  $('#newName').val(name);
  $('#newSort').val(nsort);
  $('#editmodal').modal('show');
  var isClick = true;
  $('#editsave').on('click', function () {
    if(isClick) {
      isClick = false;
      var flag = true;
      var newName = $("#newName").val().replace(/\s/g, "");
      //正则 验证数字
      var reg = /^[0-9]*$/;
      var newSort = $("#newSort").val();
      if(!reg.test(newSort)){
        alert("请输入正确的排序");
        flag = false;
      }
      if (name == newName && nsort == newSort) {
        alert("请先修改数据，再提交");
        flag = false;
      }
      if (/(^-[0-9]*[1-9][0-9]*$)/.test(newSort)) {
        alert("栏目排序必须为非负整数");
        flag = false;
      }
      if (newName == undefined) {
        alert("输入不能为空！");
        flag = false;
      }
      if (flag == false){
        isClick = true;
        return;
      }

      //仅修改栏目排序
      if (name == newName) {
        var obj_update = new Array();
        var processResult_update = function() {
          alert("执行结果：" + obj_update[0]);
          location.reload(true);
        }
        getFromWS("Home/article/saveColumn.template",
            "operation=editColumnOnlySort$^@^$id=" + nid + "$^@^$sort=" + newSort, obj_update, processResult_update);
      }
      //修改栏目名称和排序
      else if (name != newName) {
        var obj_update = new Array();
        var processResult_update = function() {
          alert("执行结果：" + obj_update[0]);
          location.reload(true);
        }
        getFromWS("Home/article/saveColumn.template",
            "operation=editColumn$^@^$id=" + nid + "$^@^$name=" + newName + "$^@^$sort=" + newSort, obj_update,
            processResult_update);
      }
      $('#editmodal').modal('hide');
    }
  })
}