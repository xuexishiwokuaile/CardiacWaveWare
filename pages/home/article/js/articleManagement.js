var classification = localStorage.getItem('classification');
var loginName = localStorage.getItem('loginName');
//栏目树的定义
var myDataTable;
//用来存储下拉列表树(json)
var type_zNodes;
///配置ztree,为了实现新建和编辑文章时选择类型（栏目）下拉列表树
var setting = {
  view: {
    dblClickExpand: false,
    selectedMulti:false
  },
  data: {
    simpleData: {
      enable: true
    }
  },
  callback: {
    beforeClick: beforeClick,
    onClick: clickNode
  }
};
//编辑文章
var editor;

//检查用户是否登陆
function _checkLogin()
{
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('userToken');
  const classification = localStorage.getItem('classification');
  //没有缓存数据退出
  if(!userId || !userToken ){
    location.href="../../../index.html";
    return;
  }
  let dealResult = function(){
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
//点击下拉列表树之前
function beforeClick(treeId, treeNode) {
  var check = (treeNode && !treeNode.isParent);
  if (!check){
    alert("不能选择该项");
  }
  return check;
}

//点击下拉列表树时执行的方法
function clickNode(e, treeId, treeNode) {
  var zTree = $.fn.zTree.getZTreeObj("typeTree"),
      nodes = zTree.getSelectedNodes(),
      v = "";
  typeId = "";
  nodes.sort(function compare(a,b){return a.id-b.id;});
  for (var i=0, l=nodes.length; i<l; i++) {
    v += nodes[i].name + ",";
    typeId += nodes[i].id + ",";
  }
  if (v.length > 0 ) v = v.substring(0, v.length-1);
  if (typeId.length > 0 ) typeId = typeId.substring(0, typeId.length-1);
  var typeObj = $("#typeSel");
  typeObj.val(v);
  $("#modal-article #type").val(typeId);
  $("#type2").val(typeId);
  $("#type2Sel").val(v);
  $("#type3").val(typeId);
  $("#type3Sel").val(v);
  hideMenu();
}

///显示下拉列表树
//参数flag用来区分是哪个下拉列表，有三个取值：编辑文章，批量复制，批量移动
function showMenu(flag) {
  var typeObj;
  var typeOffset;
  if(flag == "文章编辑"){
    typeObj = $("#typeSel");
    typeOffset = $("#typeSel").offset();
  }
  if(flag == "批量复制"){
    typeObj = $("#type3Sel");
    typeOffset = $("#type3Sel").offset();
  }
  if(flag == "批量移动"){
    typeObj = $("#type2Sel");
    typeOffset = $("#type2Sel").offset();
  }
  $("#menuContent").css({left:typeOffset.left + "px", top:typeOffset.top + typeObj.outerHeight() + "px"}).slideDown("fast");
  $("body").bind("mousedown", onBodyDown);
}

///隐藏下拉列表树
function hideMenu() {
  $("#menuContent").fadeOut("fast");
  $("body").unbind("mousedown", onBodyDown);
}
///点击列表区域外后，隐藏下拉列表树
function onBodyDown(event) {
  if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
    hideMenu();
  }
}

function _getLeftList() {
  // Replace checkboxes when they appear
  var $state = $("#example-2 thead input[type='checkbox']");
  $("#example-2").on('draw.dt', function()
  {
    cbr_replace();
    $state.trigger('change');
  });
  // Script to select all checkboxes
  $state.on('change', function(ev)
  {
    var $chcks = $("#example-2 tbody input[type='checkbox']");
    if($state.is(':checked'))
    {
      $chcks.prop('checked', true).trigger('change');
    }
    else
    {
      $chcks.prop('checked', false).trigger('change');
    }
  });
  var columnsArray = new Array();
  var processResult_columnsArray = function(){
    if(columnsArray[0]){
      type_zNodes = jQuery.parseJSON(columnsArray[0]) ;
      jQuery.fn.zTree.init(jQuery("#typeTree"), setting, type_zNodes);
    }
  }
  //点击栏目，显示对应栏目下的文章
  getFromWS("Home/article/getColumns.template", "operation=getGrantColumns$^@^$classification="+classification, columnsArray, processResult_columnsArray);

  var obj_tree = new Array();
  var processResult_tree = function () {
    var jd = obj_tree[0].replace(/\'/g, '\"');
    var jsonData = jd.replace(/&/g, '\'');
    jsonData = jsonData.substr(0, jsonData.length - 1);//去掉最后一个逗号
    var str = '[' + jsonData + ']';
    var zNodes = JSON.parse(str);//[{},{},....,{}]

    var newTree = new Array();

    var firstTree = new Array();
    //var secondTree = new Array();
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

    $('#treeview-selectable').treeview({
      data: allcolumnData,
      backColor: '#fff',
      borderColor: '#eeeeee',
      nodeIcon: 'glyphicon glyphicon-indent-left',
      selectedBackColor: '#efebeb',
      selectedColor: '#8f1fdc',
      showIcon: true,
      showTags: false,
      levels:1,
      onNodeSelected: function (event, node) {
        var obj = new Array();
        var processResult = function () {
          $("#modal-article #type").val(node.id);
          for(var i = 0; i < zNodes.length; i++){
            if(type_zNodes[i].id==node.id){
              $("#typeSel").val(type_zNodes[i].name);

            }
          }
          myDataTable.fnClearTable();
          myDataTable.fnDestroy();
          $("#articlePanel").html(obj[0]);
          myDataTable = $("#example-2").dataTable({
//								"order": [2,"desc"]
          });

        }
        //左侧栏目列表，点击栏目，显示对应的文章
        getFromWS("Home/article/getArticleList.template", "operation=getSomeArticle$^@^$typeId=" + node.id + "$^@^$classification="+classification , obj, processResult);
      },

    });
  }

  // 获取文章页面的左侧栏目列表树
  getFromWS("Home/article/getColumns.template", "operation=getAllColumnsReadOnly", obj_tree, processResult_tree);


  var obj = new Array();
  var processResult = function () {
    $("#articlePanel").html(obj[0]);
    myDataTable = $("#example-2").dataTable({
      //"order": [3,"desc"]
    });

    //删除按钮
    var deleteModal = $("#deleteModal");
    deleteModal.on("show.bs.modal", function (e) {
      // 这里的btn就是触发元素，即你点击的删除按钮
      var btn = $(e.relatedTarget);
      var id = btn.data("id");
      var type = $("#modal-article #type").val();
      $("#removeItem").on('click',
          function () {
            deleteArticle(id,type);
          });
    });

  }
  // 显示文章
  getFromWS("Home/article/getArticleList.template", "operation=getAllArticle$^@^$classification=" + classification, obj, processResult);
}


function createEditor() {
  editor = KindEditor.create('textarea[id="articleContent"]', {
    allowFileManager: true,
    uploadJson: kindeditUploadUrl(),
    afterUpload: kindeditAfterUpload,
    imageTabIndex: 1,
    pasteType: 1,  //无格式粘贴
  });
}

//重新加载文章，并且定位到当前选中的栏目
function reloadArticle(type){
  var obj = new Array();
  var processResult = function () {
    $("#modal-article #type").val(type);
    for(var i = 0; i < type_zNodes.length; i++){
      if(type_zNodes[i].id==type){
        $("#typeSel").val(type_zNodes[i].name);

      }
    }
    $("#articlePanel").html(obj[0]);
  }
  getFromWS("Home/article/getArticleList.template", "operation=getSomeArticle$^@^$typeId=" + type + "$^@^$classification="+classification + "$^@^$loginName="+loginName, obj, processResult);
}

//单个删除文章
function deleteArticle(id,type){
  var result = new Array();
  var deleteResult = function () {
    if (result[0] == "ok") {
      $('#deleteModal').modal('hide');
      $('#batchDeleteModal').modal('hide');
      //重新加载文章，并且定位到当前选中的栏目
      if(type==""){
        location.reload();
      }else{
        reloadArticle(type);
      }

    } else {
      alert("删除失败");
    }
  }
  var paras = "id=" + id;
  paras += "$^@^$operation=deleteArticle";
  getFromWS("Home/article/saveArticle.template", paras, result, deleteResult);
}

//获取文件名称
function getFileName(path) {
  var pos1 = path.lastIndexOf('/');
  var pos2 = path.lastIndexOf('\\');
  var pos = Math.max(pos1, pos2);
  if (pos < 0) {
    return path;
  }
  else {
    return path.substring(pos + 1);
  }
}

//更新图片的名字
function updatePicName() {
  $("#picName").val(getFileName($("#picInput").val()));
  $("#modal-article #picImg").css("display","inline-block");
  var fr = new FileReader();
  fr.onload = function() {
    document.getElementById('picImg').src = fr.result;
  };
  fr.readAsDataURL($("#picInput")[0].files[0]);
}

//更新附件的名字
function updateAppendixName() {
  $("#appendixName").val(getFileName($("#appendixInput").val()));
}

//新建、编辑文章
function setArticle(flag) {
  $("#bufferArticleId").val(flag);
  if (editor) {
    editor.remove("#articleContent");
  }
  $("#modal-article #appendix-group").html("");
  //新建文章
  if (flag == 0) {
    $("#modal-article #publisher").val(localStorage.getItem("loginName"));
    $("#modal-article #articleId").val(flag);
    $("#modal-article #title").val("");
    $("#modal-article #topArticle").val("0");
    $("#modal-article #publicArticle").val("0");
    $("#modal-article #bufferPicIds").val("");
    $("#modal-article #articleContent").val("");
    $("#modal-article #picInput").val("");
    $("#modal-article #appendixInput").val("");
    $("#modal-article #picId").val("0");
    $("#modal-article #picImg").attr("src","");
    $("#modal-article #picImg").css("display","none");
    $("#modal-article #appendixId").val("");
    $("#modal-article #picName").val("");
    $("#modal-article #appendixName").val("");

    $("#modal-article #picInput").removeAttr("disabled");
    $("#travelInfo #theme").val("");
    $("#travelInfo #district").val("");
    $("#travelInfo #money").val("");
    $("#travelInfo #address").val("");
    createEditor();
    jQuery('#modal-article').modal('show', {backdrop: 'static'});
  } else {  //编辑文章
    $("#modal-article #articleId").val(flag);
    $("#modal-article #title").val($("#title" + flag).html().replace(/\s+/g, ""));//显示编辑文章时，标题前面会莫名出现空格，去除掉
    $("#modal-article #publisher").val($("#publisher" + flag).html());
    $("#modal-article #type").val($("#type" + flag).val());
    for(var i = 0; i < type_zNodes.length; i++){
      if(type_zNodes[i].id==$("#type" + flag).val()){
        $("#modal-article #typeSel").val(type_zNodes[i].name);
      }
    }
    $("#modal-article #topArticle").val($("#top" + flag).val());
    $("#modal-article #publicArticle").val($("#publics" + flag).val());
    $("#modal-article #articleContent").val($("#content" + flag).val());
    //副文本中的图片
    $("#modal-article #bufferPicIds").val("");
    $("#modal-article #picName").val("");
    $("#modal-article #appendixName").val("");
    var picId = $("#picId" + flag).val();
    var appendixId = $("#appendixId" + flag).val();
    //该文章对应的图片和附件
    $("#modal-article #picId").val(picId);
    $("#modal-article #appendixId").val(appendixId);
    if (picId != 0) {
      $("#modal-article #picInput").attr("disabled", "disabled");
      $("#modal-article #picImg").css("display","inline-block");
      $("#modal-article #picImg").attr("src","/one/downloadFile.spe?dtype=PostgresXL&mode=html&fileid="+picId);
    } else {
      $("#modal-article #picInput").removeAttr("disabled");
      $("#modal-article #picImg").css("display","none");
      $("#modal-article #picImg").attr("src","");
    }
    ///如果有图片或者附件，则从数据库中查出相关文件的name
    if (picId != 0 || appendixId != 0) {
      var result = new Array();
      var queryResult = function () {
        if (result[0]) {
          var names = result[0].split("|");
          var picName = names[0];
          $("#modal-article #picName").val(picName);
          var parentDiv = document.getElementById("appendix-group");
          var articleId = $("#modal-article #articleId").val();
          if(appendixId !=""){
            var appendixIds = appendixId.split(";");
            var appendixNames = names[1].split(";");
            for(var i=0;i<appendixNames.length;i++){
              //动态创建div用来显示上传的附件名，以及删除和下载的标签
              var insertDiv = '<div id="appendixId' + appendixIds[i] + '"><span style="display:inline-block;width:200px;overflow: hidden;text-overflow: ellipsis;" id="appendixName'+appendixIds[i]+'">'+appendixNames[i]+'</span><a style="margin-left:30px;color:blue" href="javaScript:deleteAppendix(\''+appendixIds[i]+'\',\''+articleId+'\')">删除</a><a style="margin-left:50px;color:blue" href="/one/downloadFile.spe?dtype=PostgresXL&mode=attachment&fileid='+appendixIds[i]+'">下载</a></div>';
              parentDiv.innerHTML = parentDiv.innerHTML + insertDiv;
            }
          }
          createEditor();
          jQuery('#modal-article').modal('show', {backdrop: 'static'});
        }
      }
      var paras = "picId=" + picId;
      paras += "$^@^$appendixId=" + appendixId;
      paras += "$^@^$operation=getPicAndAppendixName";
      //编辑文章时，先获取文章的图片,附件,然后在编辑页面上显示
      getFromWS("Home/article/saveArticle.template", paras, result, queryResult);
    } else {
      createEditor();
      jQuery('#modal-article').modal('show', {backdrop: 'static'});
    }
  }
}

//删除图片
function deletePic() {
  $("#picInput").val("");
  $("#picName").val("");
  $("#modal-article #picImg").attr("src","");
  $("#modal-article #picImg").css("display","none");
  var picId = $("#modal-article #picId").val();
  if (picId != 0) {
    var result = new Array();
    var deleteResult = function () {
      if (result[0] == "ok") {
        $("#modal-article #picId").val("0");
        $("#modal-article #picName").val("");
        $("#modal-article #picInput").val("");
        $("#picId" + $("#bufferArticleId").val()).val("0");
        $("#modal-article #picInput").removeAttr("disabled");
      } else {
        alert("删除失败");
      }
    }
    var paras = "id=" + picId;
    paras += "$^@^$operation=deletePic";
    getFromWS("Home/article/saveArticle.template", paras, result, deleteResult);
  }
}

//删除附件
function deleteAppendix(id,aid) {
  if (id != "") {
    var result = new Array();
    var deleteResult = function () {
      var father = document.getElementById("appendix-group");
      var child = document.getElementById("appendixId"+id);
      father.removeChild(child);
      //删除一个附件后更新附件域
      $("#modal-article #appendixId").val(result[0]);
    }
    var paras = "id=" + id;
    paras += "$^@^$articleId="+aid;
    paras += "$^@^$operation=deleteAppendix";
    getFromWS("Home/article/saveArticle.template", paras, result, deleteResult);
  }else{
    alert("wrong");
  }
}

//上传附件
function uploadAppendix(){
  var articleId = $("#modal-article #articleId").val();
  if(!($("#modal-article #appendixInput").val())){
    alert("请先选择文件");
    return;
  }
  var setAppendixId = function (fileId) {
    if (fileId) {
      var appendixId = $("#modal-article #appendixId").val();
      if(appendixId ==""){
        $("#modal-article #appendixId").val(fileId)
      }else{
        $("#modal-article #appendixId").val(appendixId+";"+fileId)
      }
      var fileName = getFileName($("#appendixInput").val());

      //动态创建div用来显示上传的附件名，以及删除和下载的标签
      var insertDiv = '<div id="appendixId' + fileId + '"><span style="display:inline-block;width:200px;overflow: hidden;text-overflow: ellipsis;" id="appendixName'+fileId+'">'+fileName+'</span><a style="margin-left:30px;color:blue" href="javaScript:deleteAppendix(\''+fileId+'\',\''+articleId+'\')">删除</a><a style="margin-left:30px;color:blue" href="/one/downloadFile.spe?dtype=PostgresXL&mode=attachment&fileid='+fileId+'">下载</a></div>';
      var parentDiv = document.getElementById("appendix-group");
      parentDiv.innerHTML = parentDiv.innerHTML + insertDiv;

      var result = new Array();
      var processResult = function(){
        $("#modal-article #appendixName").val("")
      }
      var paras = "appendixId=" + $("#modal-article #appendixId").val();
      paras += "$^@^$articleId="+articleId;
      paras += "$^@^$operation=updateAppendixId";
      if(articleId !=0 && articleId !=""){
        getFromWS("Home/article/saveArticle.template", paras, result, processResult);
      }
    }
  }
  uploadToDatabase("appendixInput", setAppendixId, "databaseType=PostgresXL");
}

//保存（获取上传图片的ID）
function doSave() {
  var title = $("#modal-article #title").val();
  var type = $("#modal-article #type").val();
  var content = editor.html();
  var picId = $("#modal-article #picId").val();
  if (!title || !type || !publisher || !content || (!$("#picInput").val()&&!picId)) {
    alert("请把标题，类型，文章内容，文章图片补充完整");
    return;
  }
  if ($("#picInput").val()) {
    //上传图片
    var setPicId = function (fileId_pic) {
      if (fileId_pic) {
        picId = fileId_pic;
        doSaveArticle(picId);
      }
    }
    uploadToDatabase("picInput", setPicId, "databaseType=PostgresXL");
  } else {
    doSaveArticle(picId);
  }
}

//保存文章
function doSaveArticle(picId) {
  var id = $("#modal-article #articleId").val();
  var title = $("#modal-article #title").val();
  var type = $("#modal-article #type").val();
  var top = $("#modal-article #topArticle").val();
  var publics = $("#modal-article #publicArticle").val();
  var publisher = localStorage.getItem("loginName");
  var picIds = $("#bufferPicIds").val();
  var content = editor.html();
  var content_text = editor.text();
  var appendixId = $("#appendixId").val();
  var operation;
  if (id == 0) {
    operation = "newArticle";
  } else {
    operation = "editArticle";
  }
  var paras = "id=" + id;
  paras += "$^@^$title=" + title;
  paras += "$^@^$type=" + type;
  paras += "$^@^$top=" + top;
  paras += "$^@^$publics=" + publics;
  paras += "$^@^$publisher=" + publisher;
  paras += "$^@^$content=" + content;
  paras += "$^@^$content_text=" + content_text;
  paras += "$^@^$picIds=" + picIds;
  paras += "$^@^$picId=" + picId;
  paras += "$^@^$appendixId=" + appendixId;
  paras += "$^@^$operation=" + operation;
  var objs = new Array();
  var afterSaveArticle = function () {
    if (objs[0] == "ok") {
      $("#modal-article #bufferPicIds").val("");
      $("#modal-article").modal('hide');
      reloadArticle(type);
    } else {
      alert("存储失败");
    }
  };
  //保存文章
  getFromWS("Home/article/saveArticle.template", paras, objs, afterSaveArticle);
}

//关闭编辑文章窗口
function closeDia() {
  var picIds = $("#modal-article #bufferPicIds").val();
  if (picIds != "") {
    var paras = "$^@^$picIds=" + picIds;
    paras += "$^@^$operation=deleteFiles";
    var objs = new Array();
    var afterDelete = function () {
      $("#modal-article").modal('hide');
      var type = $("#modal-article #type").val();
      reloadArticle(type);
    };
    getFromWS("Home/article/saveArticle.template", paras, objs, afterDelete);
  } else {
    $("#modal-article").modal('hide');
    var type = $("#modal-article #type").val();
    reloadArticle(type);
  }
}

//批量删除弹出框
function batchDelete(){
  $('#bitchDeleteModal').modal();
}

//批量删除
function saveBatchDelete(){
  var checkboxs = document.getElementsByName("articleCheckBox");
  var ids = "";
  for (var i = 0; i < checkboxs.length; i++) {
    if (checkboxs[i].checked){
      ids = ids + checkboxs[i].value + ";";
    }
  }
  var result = new Array();
  var deleteResult = function () {
    if (result[0] == "ok") {
      location.reload();
    } else {
      alert("删除失败");
    }
  }
  var paras = "ids=" + ids;
  paras += "$^@^$operation=batchDelete";
  getFromWS("Home/article/saveArticle.template", paras, result, deleteResult);
}

//弹出批量移动选择框
function batchEdit(){
  $('#batchEditModal type2').val("");
  $('#batchCopyModal type3Sel').val("");
  $('#batchEditModal').modal();
}

//保存批量移动
function saveBatchEdit(){
  var articleType = $("#batchEditModal #type2").val();
  if(articleType == ""){
    alert("文章类型不能为空");
    return;
  }
  var submitAids = "";
  var checkboxs = document.getElementsByName("articleCheckBox");
  for (var i = 0; i < checkboxs.length; i++) {
    if (checkboxs[i].checked){
      submitAids = submitAids + checkboxs[i].value + ",";
    }
  }
  var obj = new Array();
  var processResult = function(){
    $('#batchEditModal').modal("hide");
    location.reload();
  }
  var paras = "articleIds=" + submitAids;
  paras += "$^@^$articleType="+articleType;
  paras += "$^@^$operation=bitchEdit";
  getFromWS("Home/article/saveArticle.template", paras, obj, processResult);
}

//弹出批量复制选择框
function batchCopy(){
  $('#batchCopyModal type3').val("");
  $('#batchCopyModal type3Sel').val("");
  $('#batchCopyModal').modal();
}

//保存批量复制
function saveBatchCopy(){
  var articleType = $("#batchCopyModal #type3").val();//复制到的栏目的id
  if(articleType == ""){
    alert("文章类型不能为空");
    return;
  }
  var submitAids = "";
  var checkboxs = document.getElementsByName("articleCheckBox");
  for (var i = 0; i < checkboxs.length; i++) {
    if (checkboxs[i].checked){
      submitAids = submitAids + checkboxs[i].value + ",";//选中的文章id
    }
  }
  var obj = new Array();
  var processResult = function(){
    $('#batchCopyModal').modal("hide");
    location.reload();
  }
  var paras = "articleIds=" + submitAids;
  paras += "$^@^$articleType="+articleType;
  paras += "$^@^$operation=bitchCopy";
  getFromWS("Home/article/saveArticle.template", paras, obj, processResult);
}




