/// 文 件 名：jquery.location.whu.plugin.js
/// 描    述：(用一句话描述该文件做什么)  
/// 项目名称：zoolina-cardiac-wave      
/// 作    者：武汉大学国家网络安全学院@沈家强    
/// 发布日期：2019/7/21 10:56  
/// 文件版本：V1.0 
/// 注意：本内容仅限于武汉大学国家网络安全学院陈刚教授团队内部传阅，禁止外泄以及用于其他的商业目
/// @Copyright: 2019 www.whu.edu.cn. All rights reserved. 
/// All rights Reserved, Designed By www.whu.edu.cn

(function($){
  /**
   * 系统配置代码,记录系统当中所有的配置
   * @type {{apis_map_qq_com_KEY: string, _system_userName_in_session: string, _system_loginName_in_session: string, _local_IP_in_session: string, _local_ADDR_in_session: string, _local_LONG_in_session: string, _local_LAT_in_session: string}}
   */
  $.config = {
    //QQ相应的地图服务对应的服务KEY值
    apis_map_qq_com_KEY : "U2MBZ-EULEF-MZMJX-JXA4V-2EDTS-4ZFSQ",

    //对应的session当中保存的KEY的名字
    _system_userName_in_session: "userName",
    _system_loginName_in_session: "loginName",
    _local_IP_in_session : "_local_IP_in_session",
    _local_ADDR_in_session : "_local_ADDR_in_session",
    _local_LONG_in_session : "_local_LONG_in_session",
    _local_LAT_in_session : "_local_LAT_in_session",
    _local_OPENID_in_session : "_local_OPENID_in_session",
  }

  /**
   * 系统日志工具，记录相应的日志信息
   * @param strOperate 相应的日志操作信息
   */
  $.log = function(strOperate) {
    //IP
    let strIP = sessionStorage.getItem($.config._local_IP_in_session);
    //经度
    let strLongitude = "";
    //纬度
    let strLatitude = "";
    //地址
    let strAddress = "";
    let operater = sessionStorage.getItem($.config._system_userName_in_session);

    //未获取到相应的IP
    if(strIP != null){
      strLongitude = sessionStorage.getItem($.config._local_LONG_in_session);
      strLatitude = sessionStorage.getItem($.config._local_LAT_in_session);
      strAddress = sessionStorage.getItem($.config._local_ADDR_in_session);
    }
    else {
      strIP = "0.0.0.0"
      strLongitude = "0";
      strLatitude = "0";
      strAddress = "未知";
    }

    //如果操作者没有姓名，就直接取出匿名
    if(operater == null){
      operater = "匿名";
    }

//写入相应的登录日志
    $.ajax({
      type: "GET",
      dataType: "html",
      async: false,//使用同步的方式,true为异步方式
      data: {
        IP: strIP,
        operater: operater,
        longitude: strLongitude,
        latitude: strLatitude,
        operate: strOperate,
        address: strAddress
      },
      url: "/Home/record/iAddRecord.template",
      success: function (msg) {
        if(msg == "ok"){
          console.log("日志录入成功")
        }
        else{
          alert("登录失败，请确认原因！")
        }
      },
      error: function(error) {
        console.log(error)
        alert("日志录入失败：" + error)
      }
    })
  }
  
  /**
   * 通过腾讯外网的API获取当前人员相应的IP地址和对应的登录信息
   */
  $.saveSystemLocationInfo = function() {
    let strIP = sessionStorage.getItem($.config._local_IP_in_session);
    //如果登录过，不再进行相应的操作
    if(strIP != null){
      console.log("已经登录过！")
    }
    else{
      var data = { key: $.config.apis_map_qq_com_KEY };//ip缺省时会自动获取请求端的公网IP,
      var url = "https://apis.map.qq.com/ws/location/v1/ip";
      data.output = "jsonp";
      $.ajax({
        type: "get",
        dataType: 'jsonp',
        data: data,
        jsonp: "callback",
        url: url,
        success: function (json) {
          //IP
          const strIP = json.result.ip;
          //经度
          const strLongitude = json.result.location.lng;
          //纬度
          const strLatitude = json.result.location.lat;
          //地址
          const strAddress = json.result.ad_info.province + json.result.ad_info.city + json.result.ad_info.district;

          //将对应的结果记入session
          sessionStorage.setItem($.config._local_IP_in_session, strIP);
          sessionStorage.setItem($.config._local_ADDR_in_session, strAddress);
          sessionStorage.setItem($.config._local_LONG_in_session, strLongitude);
          sessionStorage.setItem($.config._local_LAT_in_session, strLatitude);
          $.log("visit")
        },
        error: function (err) {
          //业务处理
        }
      });
    }
  }

})(jQuery)

/**
 * 获取request当中转递相应的内容
 */
function QueryString() {
  //构造参数对象并初始化
  var name, value, i;
  var str = location.href;//获得浏览器地址栏URL串
  var num = str.indexOf('?');
  str = str.substr(num + 1);//截取“?”后面的参数串
  var arrtmp = str.split('&');//将各参数分离形成参数数组
  for (i = 0; i < arrtmp.length; i++) {
    num = arrtmp[i].indexOf('=');
    if (num > 0) {
      name = arrtmp[i].substring(0, num);//取得参数名称
      value = arrtmp[i].substr(num + 1);//取得参数值
      this[name] = value;//定义对象属性并初始化
    }
  }
}