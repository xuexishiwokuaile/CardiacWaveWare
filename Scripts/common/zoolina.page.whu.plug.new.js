jQuery(document).ready(function($) {
  //1. 判断是否登录
  //2. 增加对应的checkbox判断

  var checkLoginResult = function() {
    if(objCheckLogin[0]=="bad" || objCheckLogin[0]=="failed"){
      sessionStorage.setItem('userId'," ");
      sessionStorage.setItem('userToken'," ");
      sessionStorage.setItem('classification'," ");
      sessionStorage.setItem('loginName'," ");
      parent.window.location.href = "../index.html";
    }
  }
  //判断用户是否登录，如果未登录直接返回
  var objCheckLogin = new Array();
  var url = "CoreService/checkLogin";
  getFromWS(url, "", objCheckLogin, checkLoginResult);

  //id=" + sessionStorage.getItem("userId") + "$^@^$token="+sessionStorage.getItem("userToken")

  $('input[name=\'_checkBox\']').change(function() {
    if ($('input[name=\'_checkBox\']').not('input:checked').size() <= 0) {
      //如果其它的复选框全部被勾选了，那么全选勾中
      $('.cbr').attr('checked', true);
    } else {
      $('.cbr').attr('checked', false);
    }
  });
});

