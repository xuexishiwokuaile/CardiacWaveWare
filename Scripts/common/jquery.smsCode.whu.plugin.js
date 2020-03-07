(function($){
  //发送验证码
  $.fn.sendVerifyCode = function(url,tel, type="GET", dataType="json"){

    //封装参数
    var params = {};
    params.tel = tel;//用户手机号
    $.ajax({
      type: type,
      url:url,
      data:params,
      dataType:dataType,
      cache: false, //禁用缓存
      //截至2019-03-11调用之后,不会走任何一个函数，console以及服务器都没有短信发送成功的json返回值，服务器内部，等一两分钟之后，才有相应提示
      //executeRemoteService这个函数，返回结果的时间非常慢
      success:function(result){
        // console.log("ajax，success")
        // console.log(result)
      },
      error:function(error) {
        // console.log("ajax，error")
        // console.log(error)
      }
    });
  }


  //提交，验证
  $.fn.verifyCode = function(tel,userVerifyCode, type="GET", dataType="json"){

    //封装参数
    var params = {};
    params.tel = tel;//用户手机号
    params.code = userVerifyCode;
    $.ajax({
      type: type,
      url:"/Home/smsCode/isms.template?operation=compareVerifyCode",
      data:params,
      dataType:dataType,
      cache: false, //禁用缓存
      success:function(result){
        console.log(result)
        //验证成功
        if(result == 1){
          // alert("提交成功")
          ///删除该用户所有的验证码
          var obj_result = new Array();
          var processResult_count = function () {
            // console.log(obj_result[0])
          }
        }
        //验证码过期
        if(result == 2){
          toastr.error("验证码错误，请重新输入", "添加用户失败！");
          // alert("您的验证码已过期，请重新获取")
        }
        //无记录
        if(result == 0){
          // alert("验证失败，请检查您的手机号和验证码")
          toastr.error("验证失败，请检查您的手机号和验证码", "添加用户失败！");
        }
      },
      error:function(error) {
        console.log(error)
      }
    });
  }
})(jQuery);